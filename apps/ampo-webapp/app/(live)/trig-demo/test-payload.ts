import { Engine } from '@scriblmotion/core';
import { SVGRenderer } from '@scriblmotion/svg';
import { summationLessonPayload } from './summation-lesson';

async function test() {
    try {
        console.log("Loading engine...");
        const renderer = new SVGRenderer();
        const engine = new Engine({
            container: document.createElement('div'),
            renderer
        });

        console.log("Loading summation payload...");
        engine.loadScene(summationLessonPayload);
        console.log("Successfully loaded. Entity Count:", engine.entityManager.entities.size);
    } catch (err) {
        console.error("Failed to load engine:", err);
    }
}

test();
