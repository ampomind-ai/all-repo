import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useScriblMotion } from '@scriblmotion/react';
import shapesScene from './scenes/shapes-demo.json';
export default function ShapesDemo() {
    const { containerRef, loadScene, play, pause, stop, seek, state, error } = useScriblMotion({ autoPlay: true });
    useEffect(() => {
        loadScene(shapesScene);
    }, [loadScene]);
    return (_jsxs("div", { style: styles.page, children: [_jsxs("header", { style: styles.header, children: [_jsxs("h1", { style: styles.title, children: [_jsx("span", { style: styles.logo, children: "\u25C7" }), " Shapes Animation"] }), _jsx("span", { style: styles.badge, children: "v1.0" })] }), _jsx("div", { style: styles.canvasWrapper, children: _jsx("div", { ref: containerRef, style: styles.canvas }) }), _jsxs("div", { style: styles.controls, children: [_jsx("button", { onClick: play, disabled: state === 'playing', style: {
                            ...styles.btn,
                            ...(state === 'playing' ? styles.btnDisabled : styles.btnPrimary),
                        }, children: "\u25B6 Play" }), _jsx("button", { onClick: pause, disabled: state !== 'playing', style: {
                            ...styles.btn,
                            ...(state !== 'playing' ? styles.btnDisabled : styles.btnSecondary),
                        }, children: "\u23F8 Pause" }), _jsx("button", { onClick: stop, style: { ...styles.btn, ...styles.btnSecondary }, children: "\u23F9 Stop" }), _jsx("button", { onClick: () => seek(0), style: { ...styles.btn, ...styles.btnSecondary }, children: "\u23EE Reset" }), _jsxs("div", { style: styles.stateLabel, children: ["State: ", _jsx("code", { style: styles.code, children: state })] })] }), error && (_jsxs("div", { style: styles.error, children: [_jsx("strong", { children: "Error:" }), " ", error] })), _jsxs("div", { style: styles.info, children: [_jsx("h3", { style: styles.infoTitle, children: "Pipeline" }), _jsxs("ol", { style: styles.infoList, children: [_jsxs("li", { children: ["\uD83D\uDCC4 JSON DSL payload loaded from ", _jsx("code", { children: "scenes/shapes-demo.json" })] }), _jsxs("li", { children: ["\uD83D\uDD0D ", _jsx("code", { children: "DSLParser" }), " + ", _jsx("code", { children: "DSLValidator" }), " process the payload"] }), _jsxs("li", { children: ["\uD83C\uDFAC ", _jsx("code", { children: "SceneManager" }), " creates entities + registers animation tracks"] }), _jsxs("li", { children: ["\uD83C\uDFA8 ", _jsx("code", { children: "SVGRenderer" }), " reconciles DOM elements each frame"] })] })] })] }));
}
const styles = {
    page: { maxWidth: 880, margin: '0 auto', padding: '20px 16px', fontFamily: "'Inter', system-ui, sans-serif" },
    header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
    title: { fontSize: 20, fontWeight: 700, color: '#e4e4e7', margin: 0 },
    logo: { color: '#8b5cf6', fontSize: 16 },
    badge: { fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontWeight: 600 },
    canvasWrapper: { borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', background: '#0f0f1a', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' },
    canvas: { width: '100%', height: 500 },
    controls: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' },
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
