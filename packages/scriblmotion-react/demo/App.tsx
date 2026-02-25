import { useState } from 'react';
import ShapesDemo from './ShapesDemo';
import AlgebraDemo from './AlgebraDemo';

type DemoId = 'shapes' | 'algebra';

interface DemoEntry {
    id: DemoId;
    label: string;
    emoji: string;
    description: string;
}

const DEMOS: DemoEntry[] = [
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
    const [activeDemo, setActiveDemo] = useState<DemoId>('algebra');

    return (
        <div style={styles.shell}>
            {/* Demo selector tabs */}
            <nav style={styles.nav}>
                {DEMOS.map((demo) => (
                    <button
                        key={demo.id}
                        onClick={() => setActiveDemo(demo.id)}
                        style={{
                            ...styles.tab,
                            ...(activeDemo === demo.id ? styles.tabActive : {}),
                        }}
                    >
                        <span>{demo.emoji}</span>
                        <div>
                            <div style={styles.tabLabel}>{demo.label}</div>
                            <div style={styles.tabDesc}>{demo.description}</div>
                        </div>
                    </button>
                ))}
            </nav>

            {/* Active demo */}
            {activeDemo === 'algebra' && <AlgebraDemo />}
            {activeDemo === 'shapes' && <ShapesDemo />}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
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
        textAlign: 'left' as const,
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
