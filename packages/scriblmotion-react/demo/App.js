import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import ShapesDemo from './ShapesDemo';
import AlgebraDemo from './AlgebraDemo';
const DEMOS = [
    {
        id: 'algebra',
        label: 'Algebra — Weights & Blocks',
        emoji: '📐',
        description: 'Interactive: balance equations by adding weighted blocks',
    },
    {
        id: 'shapes',
        label: 'Shapes — Animation Showcase',
        emoji: '🎨',
        description: 'Animated shapes demonstrating the DSL pipeline',
    },
];
export default function App() {
    const [activeDemo, setActiveDemo] = useState('algebra');
    return (_jsxs("div", { style: styles.shell, children: [_jsx("nav", { style: styles.nav, children: DEMOS.map((demo) => (_jsxs("button", { onClick: () => setActiveDemo(demo.id), style: {
                        ...styles.tab,
                        ...(activeDemo === demo.id ? styles.tabActive : {}),
                    }, children: [_jsx("span", { children: demo.emoji }), _jsxs("div", { children: [_jsx("div", { style: styles.tabLabel, children: demo.label }), _jsx("div", { style: styles.tabDesc, children: demo.description })] })] }, demo.id))) }), activeDemo === 'algebra' && _jsx(AlgebraDemo, {}), activeDemo === 'shapes' && _jsx(ShapesDemo, {})] }));
}
const styles = {
    shell: {
        minHeight: '100vh',
    },
    nav: {
        display: 'flex',
        gap: 8,
        padding: '12px 16px',
        maxWidth: 880,
        margin: '0 auto',
    },
    tab: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        color: '#a1a1aa',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        fontSize: 16,
    },
    tabActive: {
        background: 'rgba(99,102,241,0.1)',
        borderColor: 'rgba(99,102,241,0.3)',
        color: '#e4e4e7',
    },
    tabLabel: {
        fontSize: 13,
        fontWeight: 600,
    },
    tabDesc: {
        fontSize: 10,
        color: '#71717a',
        marginTop: 2,
    },
};
