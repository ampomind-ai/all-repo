// ─────────────────────────────────────────────────────────────────────────────
// PhysicsSystem — 2D physics simulation (v2.0)
//
// Semi-implicit Euler integration with AABB collision detection,
// constraint solving (pin, distance, spring), and per-body gravity.
// No external dependencies.
// ─────────────────────────────────────────────────────────────────────────────
export class PhysicsSystem {
    constructor(entityManager, eventBus) {
        this._bodies = new Map();
        /** World gravity (pixels/s²). Default: downward 980 px/s². */
        this.gravity = { x: 0, y: 980 };
        /** Scene bounds for containment. */
        this.bounds = { width: 800, height: 600 };
        this._entityManager = entityManager;
        this._eventBus = eventBus;
    }
    // ── Body Management ───────────────────────────────────────────────────
    /**
     * Register a physics body for an entity.
     * Called by SceneManager when entities with `physics` defs are created.
     */
    registerBody(entity) {
        const def = entity.physicsBody;
        if (!def)
            return;
        const isStatic = def.type === 'static';
        const mass = def.mass ?? 1;
        const body = {
            entityId: entity.id,
            mass,
            inverseMass: isStatic ? 0 : 1 / mass,
            friction: def.friction ?? 0.1,
            restitution: def.restitution ?? 0.3,
            gravityScale: def.gravityScale ?? 1,
            fixedRotation: def.fixedRotation ?? false,
            prevPosition: { ...entity.position },
            constraints: def.constraints ?? [],
            isDragged: false,
        };
        this._bodies.set(entity.id, body);
        // Initialize velocity/acceleration on the entity
        if (!entity.velocity)
            entity.velocity = { x: 0, y: 0 };
        if (!entity.acceleration)
            entity.acceleration = { x: 0, y: 0 };
    }
    /** Remove a physics body. */
    removeBody(entityId) {
        this._bodies.delete(entityId);
    }
    /** Set drag state for a body (kinematic override). */
    setDragged(entityId, isDragged) {
        const body = this._bodies.get(entityId);
        if (body) {
            body.isDragged = isDragged;
            // Reset velocity when starting drag
            if (isDragged) {
                const entity = this._entityManager.get(entityId);
                if (entity?.velocity) {
                    entity.velocity.x = 0;
                    entity.velocity.y = 0;
                }
            }
        }
    }
    /** Apply a force to an entity (in pixels/s²). */
    applyForce(entityId, force) {
        const body = this._bodies.get(entityId);
        if (!body || body.inverseMass === 0)
            return;
        const entity = this._entityManager.get(entityId);
        if (!entity?.acceleration)
            return;
        entity.acceleration.x += force.x * body.inverseMass;
        entity.acceleration.y += force.y * body.inverseMass;
    }
    /** Apply an impulse (instant velocity change). */
    applyImpulse(entityId, impulse) {
        const body = this._bodies.get(entityId);
        if (!body || body.inverseMass === 0)
            return;
        const entity = this._entityManager.get(entityId);
        if (!entity?.velocity)
            return;
        entity.velocity.x += impulse.x * body.inverseMass;
        entity.velocity.y += impulse.y * body.inverseMass;
    }
    // ── Simulation Step ───────────────────────────────────────────────────
    /**
     * Advance the physics simulation by `dt` seconds.
     * Called once per frame from the Engine loop.
     */
    step(dt) {
        if (dt <= 0 || dt > 0.1)
            return; // clamp to avoid spiral of death
        // 1. Apply gravity + integrate velocities
        this.integrate(dt);
        // 2. Solve constraints
        this.solveConstraints(dt);
        // 3. Detect and resolve collisions
        this.detectCollisions();
        // 4. Contain within scene bounds
        this.enforceBounds();
        // 5. Clear accelerations
        this.clearAccelerations();
    }
    // ── Integration ───────────────────────────────────────────────────────
    integrate(dt) {
        for (const [entityId, body] of this._bodies) {
            if (body.inverseMass === 0 || body.isDragged)
                continue;
            const entity = this._entityManager.get(entityId);
            if (!entity?.velocity)
                continue;
            // Apply gravity
            entity.velocity.x += (this.gravity.x * body.gravityScale + (entity.acceleration?.x ?? 0)) * dt;
            entity.velocity.y += (this.gravity.y * body.gravityScale + (entity.acceleration?.y ?? 0)) * dt;
            // Apply friction (simple damping)
            entity.velocity.x *= (1 - body.friction * dt);
            entity.velocity.y *= (1 - body.friction * dt);
            // Integrate position
            body.prevPosition.x = entity.position.x;
            body.prevPosition.y = entity.position.y;
            entity.position.x += entity.velocity.x * dt;
            entity.position.y += entity.velocity.y * dt;
        }
    }
    // ── Constraints ───────────────────────────────────────────────────────
    solveConstraints(_dt) {
        const iterations = 4;
        for (let iter = 0; iter < iterations; iter++) {
            for (const [entityId, body] of this._bodies) {
                if (body.isDragged)
                    continue;
                const entity = this._entityManager.get(entityId);
                if (!entity)
                    continue;
                for (const constraint of body.constraints) {
                    switch (constraint.type) {
                        case 'pin':
                            this.solvePin(entity, constraint);
                            break;
                        case 'distance':
                            this.solveDistance(entity, body, constraint);
                            break;
                        case 'spring':
                            this.solveSpring(entity, body, constraint);
                            break;
                    }
                }
            }
        }
    }
    solvePin(entity, constraint) {
        const anchor = constraint.anchor ?? { x: entity.position.x, y: entity.position.y };
        entity.position.x = anchor.x;
        entity.position.y = anchor.y;
        if (entity.velocity) {
            entity.velocity.x = 0;
            entity.velocity.y = 0;
        }
    }
    solveDistance(entity, body, constraint) {
        if (!constraint.targetId)
            return;
        const target = this._entityManager.get(constraint.targetId);
        if (!target)
            return;
        const targetBody = this._bodies.get(constraint.targetId);
        const restLength = constraint.length ?? 100;
        const dx = target.position.x - entity.position.x;
        const dy = target.position.y - entity.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.001)
            return;
        const diff = (dist - restLength) / dist;
        const stiffness = constraint.stiffness ?? 0.5;
        const totalInvMass = body.inverseMass + (targetBody?.inverseMass ?? 0);
        if (totalInvMass === 0)
            return;
        const correctionX = dx * diff * stiffness;
        const correctionY = dy * diff * stiffness;
        if (body.inverseMass > 0) {
            const ratio = body.inverseMass / totalInvMass;
            entity.position.x += correctionX * ratio;
            entity.position.y += correctionY * ratio;
        }
        if (targetBody && targetBody.inverseMass > 0) {
            const ratio = targetBody.inverseMass / totalInvMass;
            target.position.x -= correctionX * ratio;
            target.position.y -= correctionY * ratio;
        }
    }
    solveSpring(entity, body, constraint) {
        if (!constraint.targetId && !constraint.anchor)
            return;
        let anchorX, anchorY;
        if (constraint.targetId) {
            const target = this._entityManager.get(constraint.targetId);
            if (!target)
                return;
            anchorX = target.position.x;
            anchorY = target.position.y;
        }
        else {
            anchorX = constraint.anchor.x;
            anchorY = constraint.anchor.y;
        }
        const stiffness = constraint.stiffness ?? 0.05;
        const damping = constraint.damping ?? 0.02;
        const dx = anchorX - entity.position.x;
        const dy = anchorY - entity.position.y;
        if (entity.velocity && body.inverseMass > 0) {
            entity.velocity.x += dx * stiffness - entity.velocity.x * damping;
            entity.velocity.y += dy * stiffness - entity.velocity.y * damping;
        }
    }
    // ── Collision Detection ───────────────────────────────────────────────
    detectCollisions() {
        const bodyList = [...this._bodies.entries()];
        for (let i = 0; i < bodyList.length; i++) {
            for (let j = i + 1; j < bodyList.length; j++) {
                const [idA, bodyA] = bodyList[i];
                const [idB, bodyB] = bodyList[j];
                if (bodyA.inverseMass === 0 && bodyB.inverseMass === 0)
                    continue;
                const entityA = this._entityManager.get(idA);
                const entityB = this._entityManager.get(idB);
                if (!entityA || !entityB)
                    continue;
                if (this.aabbOverlap(entityA, entityB)) {
                    this.resolveCollision(entityA, bodyA, entityB, bodyB);
                    this._eventBus.emit('physics:collision', { entityA: idA, entityB: idB });
                }
            }
        }
    }
    aabbOverlap(a, b) {
        const aw = (a.styles['width'] ?? 50) * a.scale.x;
        const ah = (a.styles['height'] ?? (a.styles['radius'] ?? 25) * 2) * a.scale.y;
        const bw = (b.styles['width'] ?? 50) * b.scale.x;
        const bh = (b.styles['height'] ?? (b.styles['radius'] ?? 25) * 2) * b.scale.y;
        return (a.position.x - aw / 2 < b.position.x + bw / 2 &&
            a.position.x + aw / 2 > b.position.x - bw / 2 &&
            a.position.y - ah / 2 < b.position.y + bh / 2 &&
            a.position.y + ah / 2 > b.position.y - bh / 2);
    }
    resolveCollision(a, bodyA, b, bodyB) {
        const totalInvMass = bodyA.inverseMass + bodyB.inverseMass;
        if (totalInvMass === 0)
            return;
        // Simple separation along shortest overlap axis
        const aw = (a.styles['width'] ?? 50) * a.scale.x;
        const ah = (a.styles['height'] ?? 50) * a.scale.y;
        const bw = (b.styles['width'] ?? 50) * b.scale.x;
        const bh = (b.styles['height'] ?? 50) * b.scale.y;
        const overlapX = (aw / 2 + bw / 2) - Math.abs(a.position.x - b.position.x);
        const overlapY = (ah / 2 + bh / 2) - Math.abs(a.position.y - b.position.y);
        if (overlapX <= 0 || overlapY <= 0)
            return;
        const restitution = Math.min(bodyA.restitution, bodyB.restitution);
        if (overlapX < overlapY) {
            // Separate along X
            const sign = a.position.x < b.position.x ? -1 : 1;
            if (bodyA.inverseMass > 0)
                a.position.x += sign * overlapX * (bodyA.inverseMass / totalInvMass);
            if (bodyB.inverseMass > 0)
                b.position.x -= sign * overlapX * (bodyB.inverseMass / totalInvMass);
            // Velocity response
            if (a.velocity && bodyA.inverseMass > 0)
                a.velocity.x *= -restitution;
            if (b.velocity && bodyB.inverseMass > 0)
                b.velocity.x *= -restitution;
        }
        else {
            // Separate along Y
            const sign = a.position.y < b.position.y ? -1 : 1;
            if (bodyA.inverseMass > 0)
                a.position.y += sign * overlapY * (bodyA.inverseMass / totalInvMass);
            if (bodyB.inverseMass > 0)
                b.position.y -= sign * overlapY * (bodyB.inverseMass / totalInvMass);
            if (a.velocity && bodyA.inverseMass > 0)
                a.velocity.y *= -restitution;
            if (b.velocity && bodyB.inverseMass > 0)
                b.velocity.y *= -restitution;
        }
    }
    // ── Bounds Enforcement ────────────────────────────────────────────────
    enforceBounds() {
        for (const [entityId, body] of this._bodies) {
            if (body.inverseMass === 0 || body.isDragged)
                continue;
            const entity = this._entityManager.get(entityId);
            if (!entity)
                continue;
            const hw = (entity.styles['width'] ?? 50) * entity.scale.x / 2;
            const hh = (entity.styles['height'] ?? 50) * entity.scale.y / 2;
            if (entity.position.x - hw < 0) {
                entity.position.x = hw;
                if (entity.velocity)
                    entity.velocity.x *= -body.restitution;
            }
            if (entity.position.x + hw > this.bounds.width) {
                entity.position.x = this.bounds.width - hw;
                if (entity.velocity)
                    entity.velocity.x *= -body.restitution;
            }
            if (entity.position.y - hh < 0) {
                entity.position.y = hh;
                if (entity.velocity)
                    entity.velocity.y *= -body.restitution;
            }
            if (entity.position.y + hh > this.bounds.height) {
                entity.position.y = this.bounds.height - hh;
                if (entity.velocity)
                    entity.velocity.y *= -body.restitution;
            }
        }
    }
    // ── Utilities ─────────────────────────────────────────────────────────
    clearAccelerations() {
        for (const entityId of this._bodies.keys()) {
            const entity = this._entityManager.get(entityId);
            if (entity?.acceleration) {
                entity.acceleration.x = 0;
                entity.acceleration.y = 0;
            }
        }
    }
    /** Clear all bodies. */
    clear() {
        this._bodies.clear();
    }
    /** Check if an entity has a physics body. */
    hasBody(entityId) {
        return this._bodies.has(entityId);
    }
    /** Number of active physics bodies. */
    get size() {
        return this._bodies.size;
    }
}
//# sourceMappingURL=PhysicsSystem.js.map