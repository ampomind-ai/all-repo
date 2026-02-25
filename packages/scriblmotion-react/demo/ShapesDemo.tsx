import { useEffect } from 'react';
import { useScriblMotion } from '@scriblmotion/react';
import shapesScene from './scenes/shapes-demo.json';

export default function ShapesDemo() {
    const { containerRef, loadScene, play, pause, stop, seek, state, error } =
        useScriblMotion({ autoPlay: true });

    useEffect(() => {
        loadScene(shapesScene);
    }, [loadScene]);

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1 style={styles.title}>
                    <span style={styles.logo}>◇</span> Shapes Animation
                </h1>
                <span style={styles.badge}>v1.0</span>
            </header>

            <div style={styles.canvasWrapper}>
                <div ref={containerRef} style={styles.canvas} />
            </div>

            <div style={styles.controls}>
                <button
                    onClick={play}
                    disabled={state === 'playing'}
                    style={{
                        ...styles.btn,
                        ...(state === 'playing' ? styles.btnDisabled : styles.btnPrimary),
                    }}
                >
                    ▶ Play
                </button>
                <button
                    onClick={pause}
                    disabled={state !== 'playing'}
                    style={{
                        ...styles.btn,
                        ...(state !== 'playing' ? styles.btnDisabled : styles.btnSecondary),
                    }}
                >
                    ⏸ Pause
                </button>
                <button onClick={stop} style={{ ...styles.btn, ...styles.btnSecondary }}>
                    ⏹ Stop
                </button>
                <button onClick={() => seek(0)} style={{ ...styles.btn, ...styles.btnSecondary }}>
                    ⏮ Reset
                </button>
                <div style={styles.stateLabel}>
                    State: <code style={styles.code}>{state}</code>
                </div>
            </div>

            {error && (
                <div style={styles.error}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div style={styles.info}>
                <h3 style={styles.infoTitle}>Pipeline</h3>
                <ol style={styles.infoList}>
                    <li>📄 JSON DSL payload loaded from <code>scenes/shapes-demo.json</code></li>
                    <li>🔍 <code>DSLParser</code> + <code>DSLValidator</code> process the payload</li>
                    <li>🎬 <code>SceneManager</code> creates entities + registers animation tracks</li>
                    <li>🎨 <code>SVGRenderer</code> reconciles DOM elements each frame</li>
                </ol>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { maxWidth: 880, margin: '0 auto', padding: '20px 16px', fontFamily: "'Inter', system-ui, sans-serif" },
    header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
    title: { fontSize: 20, fontWeight: 700, color: '#e4e4e7', margin: 0 },
    logo: { color: '#8b5cf6', fontSize: 16 },
    badge: { fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontWeight: 600 },
    canvasWrapper: { borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', background: '#0f0f1a', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' },
    canvas: { width: '100%', height: 500 },
    controls: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' as const },
    btn: { padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s ease' },
    btnPrimary: { background: '#6366f1', color: '#fff' },
    btnSecondary: { background: 'rgba(255,255,255,0.06)', color: '#a1a1aa' },
    btnDisabled: { background: 'rgba(255,255,255,0.03)', color: '#3f3f46', cursor: 'not-allowed' },
    stateLabel: { marginLeft: 'auto', fontSize: 13, color: '#71717a' },
    code: { fontFamily: 'monospace', color: '#22d3ee', background: 'rgba(34,211,238,0.08)', padding: '1px 6px', borderRadius: 4 },
    error: { marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 13 },
    info: { marginTop: 20, padding: '14px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' },
    infoTitle: { fontSize: 14, fontWeight: 600, color: '#a1a1aa', marginBottom: 8, margin: 0 },
    infoList: { fontSize: 12, lineHeight: 1.8, color: '#71717a', paddingLeft: 20, margin: '8px 0 0 0' },
};
