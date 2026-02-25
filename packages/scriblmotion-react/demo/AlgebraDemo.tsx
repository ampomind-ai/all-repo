import { useEffect, useState, useCallback, useMemo } from 'react';
import { useScriblMotion } from '@scriblmotion/react';
import algebraScene from './scenes/algebra-demo.json';
import type { ScriblScriptPayload } from '@scriblmotion/core';

// ── Puzzle definitions ─────────────────────────────────────────────────────

interface Term {
    id: string;
    type: 'x' | 'number';
    value: number; // For 'x', this is the coefficient. For 'number', this is the constant value.
}

interface EquationState {
    left: Term[];
    right: Term[];
}

interface Puzzle {
    id: string;
    description: string;
    initialState: EquationState;
    xValue: number;
}

const PUZZLES: Puzzle[] = [
    {
        id: 'p1',
        description: 'Solve: x + 3 = 7',
        initialState: {
            left: [{ id: 'l1', type: 'x', value: 1 }, { id: 'l2', type: 'number', value: 3 }],
            right: [{ id: 'r1', type: 'number', value: 7 }]
        },
        xValue: 4
    },
    {
        id: 'p2',
        description: 'Solve: 2x = 10',
        initialState: {
            left: [{ id: 'l1', type: 'x', value: 2 }],
            right: [{ id: 'r1', type: 'number', value: 10 }]
        },
        xValue: 5
    },
    {
        id: 'p3',
        description: 'Solve: x - 4 = 2',
        initialState: {
            left: [{ id: 'l1', type: 'x', value: 1 }, { id: 'l2', type: 'number', value: -4 }],
            right: [{ id: 'r1', type: 'number', value: 2 }]
        },
        xValue: 6
    },
    {
        id: 'p4',
        description: 'Solve: 3x + 1 = 10',
        initialState: {
            left: [{ id: 'l1', type: 'x', value: 3 }, { id: 'l2', type: 'number', value: 1 }],
            right: [{ id: 'r1', type: 'number', value: 10 }]
        },
        xValue: 3
    }
];

// ── Helper functions for terms ──────────────────────────────────────────────

const renderTerm = (term: Term) => {
    if (term.type === 'x') {
        if (term.value === 1) return 'x';
        if (term.value === -1) return '-x';
        return `${term.value}x`;
    }
    return `${term.value}`;
};

const renderEquationStr = (state: EquationState) => {
    const leftStr = state.left.length === 0 ? '0' : state.left.map((t, i) => (i > 0 && t.value > 0 ? '+' : '') + renderTerm(t)).join(' ');
    const rightStr = state.right.length === 0 ? '0' : state.right.map((t, i) => (i > 0 && t.value > 0 ? '+' : '') + renderTerm(t)).join(' ');
    return `${leftStr} = ${rightStr}`;
};

const simplifiesTo = (terms: Term[]): Term[] => {
    let xSum = 0;
    let numSum = 0;
    for (const t of terms) {
        if (t.type === 'x') xSum += t.value;
        else numSum += t.value;
    }
    const result: Term[] = [];
    if (xSum !== 0) result.push({ id: Math.random().toString(), type: 'x', value: xSum });
    if (numSum !== 0 || xSum === 0) result.push({ id: Math.random().toString(), type: 'number', value: numSum });
    return result;
};


// ── Components ──────────────────────────────────────────────────────────────

const BlockComponent = ({ term }: { term: Term }) => {
    const isX = term.type === 'x';
    const bgColor = isX ? '#facc15' : (term.value < 0 ? '#f43f5e' : '#6366f1');
    const color = isX ? '#422006' : '#ffffff';
    const label = renderTerm(term);

    return (
        <div style={{
            ...styles.block,
            backgroundColor: bgColor,
            color: color,
            borderRadius: isX ? '50%' : '8px', // x is a "bag", numbers are "blocks"
            width: isX ? 56 : 48,
            height: isX ? 56 : 48,
        }}>
            {label}
        </div>
    );
};


export default function AlgebraDemo() {
    const { containerRef, loadScene } = useScriblMotion({ autoPlay: true });

    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const puzzle = PUZZLES[puzzleIndex]!;

    // Game state
    const [eqState, setEqState] = useState<EquationState>(puzzle.initialState);
    const [history, setHistory] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [solved, setSolved] = useState(false);

    // Load the background scene
    useEffect(() => {
        loadScene(algebraScene as ScriblScriptPayload);
    }, [loadScene]);

    // Reset when puzzle changes
    useEffect(() => {
        setEqState(PUZZLES[puzzleIndex]!.initialState);
        setHistory([]);
        setErrorMsg(null);
        setInputValue('');
        setSolved(false);
    }, [puzzleIndex]);

    // Derived states
    const leftTerms = eqState.left;
    const rightTerms = eqState.right;
    const isIsolated = leftTerms.length === 1 && leftTerms[0]?.type === 'x' && leftTerms[0]?.value === 1 && rightTerms.length === 1 && rightTerms[0]?.type === 'number';

    const handleAction = useCallback((actionType: 'add' | 'subtract' | 'divide', value: number) => {
        setErrorMsg(null);
        const currentEqStr = renderEquationStr(eqState);
        let actionStr = '';

        setEqState(prev => {
            let nextLeft = [...prev.left];
            let nextRight = [...prev.right];

            if (actionType === 'add' || actionType === 'subtract') {
                const addVal = actionType === 'add' ? value : -value;
                actionStr = `${actionType === 'add' ? 'Add' : 'Subtract'} ${Math.abs(value)} to both sides`;
                nextLeft.push({ id: Math.random().toString(), type: 'number', value: addVal });
                nextRight.push({ id: Math.random().toString(), type: 'number', value: addVal });

                nextLeft = simplifiesTo(nextLeft);
                nextRight = simplifiesTo(nextRight);

            } else if (actionType === 'divide') {
                actionStr = `Divide both sides by ${value}`;
                // Only allow division if all terms are cleanly divisible to keep UI simple
                const canDivideLeft = nextLeft.every(t => t.value % value === 0);
                const canDivideRight = nextRight.every(t => t.value % value === 0);

                if (!canDivideLeft || !canDivideRight) {
                    setErrorMsg("Can't cleanly divide these terms by " + value);
                    return prev;
                }

                nextLeft = nextLeft.map(t => ({ ...t, value: t.value / value }));
                nextRight = nextRight.map(t => ({ ...t, value: t.value / value }));
            }

            const newState = { left: nextLeft, right: nextRight };
            const newEqStr = renderEquationStr(newState);
            setHistory(h => [...h, `${currentEqStr}  →  [${actionStr}]  →  ${newEqStr}`]);
            return newState;
        });
    }, [eqState]);

    const checkAnswer = () => {
        const val = parseInt(inputValue, 10);
        if (isNaN(val)) {
            setErrorMsg("Please enter a valid number.");
            return;
        }
        if (val === puzzle.xValue) {
            setSolved(true);
            setErrorMsg(null);
        } else {
            setErrorMsg("Incorrect. Try again!");
        }
    };

    const nextPuzzle = () => {
        setPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
    };

    const resetPuzzle = () => {
        setEqState(puzzle.initialState);
        setHistory([]);
        setErrorMsg(null);
        setInputValue('');
    };

    // Determine available actions based on current state
    const availableActions = useMemo(() => {
        const actions: { label: string; onClick: () => void }[] = [];
        // Find constants we can subtract or add
        const allNums = [...eqState.left, ...eqState.right].filter(t => t.type === 'number' && t.value !== 0);

        // Let's just surface obvious moves
        const leftNums = eqState.left.filter(t => t.type === 'number');
        leftNums.forEach(n => {
            if (n.value > 0) actions.push({ label: `Subtract ${n.value} from both sides`, onClick: () => handleAction('subtract', n.value) });
            if (n.value < 0) actions.push({ label: `Add ${Math.abs(n.value)} to both sides`, onClick: () => handleAction('add', Math.abs(n.value)) });
        });

        const leftX = eqState.left.find(t => t.type === 'x');
        if (leftX && leftX.value > 1 && eqState.left.length === 1) {
            actions.push({ label: `Divide both sides by ${leftX.value}`, onClick: () => handleAction('divide', leftX.value) });
        }

        // Add a generic fallback if no specific targets
        if (actions.length === 0 && !isIsolated) {
            actions.push({ label: `Divide both sides by 2`, onClick: () => handleAction('divide', 2) });
        }

        return actions;
    }, [eqState, handleAction, isIsolated]);


    return (
        <div style={styles.page}>
            <div style={styles.chatSimulation}>
                <div style={styles.chatMessage}>
                    <div style={styles.avatar}>AI</div>
                    <div style={styles.bubble}>
                        <p style={{ margin: '0 0 12px 0', fontSize: 15, color: '#3f3f46' }}>
                            Here is an interactive puzzle to help you practice solving algebraic equations. Try to isolate <span style={styles.inlineX}>x</span>!
                        </p>

                        {/* --- Compact Embedded Widget --- */}
                        <div style={styles.widgetCard}>
                            <div style={styles.widgetHeader}>
                                <span style={styles.badge}>Level {puzzleIndex + 1}</span>
                                <span style={styles.puzzleDesc}>{puzzle.description}</span>
                            </div>

                            <div style={styles.equationVisualizer}>
                                <div style={styles.side}>
                                    {eqState.left.map(term => <BlockComponent key={term.id} term={term} />)}
                                </div>
                                <div style={styles.equalsSign}>=</div>
                                <div style={styles.side}>
                                    {eqState.right.map(term => <BlockComponent key={term.id} term={term} />)}
                                </div>
                            </div>

                            {/* Hidden canvas so engine runs but takes no space */}
                            <div ref={containerRef} style={{ display: 'none' }} />

                            {!isIsolated && !solved && (
                                <div style={styles.actionArea}>
                                    <div style={styles.actionButtons}>
                                        {availableActions.map((action) => (
                                            <button key={action.label} style={styles.actionBtn} onClick={action.onClick}>
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errorMsg && <div style={styles.errorMsg}>{errorMsg}</div>}
                                </div>
                            )}

                            {isIsolated && !solved && (
                                <div style={styles.answerArea}>
                                    <div style={styles.inputGroup}>
                                        <span style={styles.inputPrefix}>x = </span>
                                        <input
                                            type="number"
                                            style={styles.inputField}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="?"
                                            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                                            autoFocus
                                        />
                                        <button style={styles.submitBtn} onClick={checkAnswer}>Check</button>
                                    </div>
                                    {errorMsg && <div style={styles.errorMsg}>{errorMsg}</div>}
                                </div>
                            )}

                            {solved && (
                                <div style={styles.successArea}>
                                    <span style={styles.successText}>🎉 Correct! <strong style={{ color: '#166534' }}>x = {puzzle.xValue}</strong></span>
                                    <button style={styles.nextBtn} onClick={nextPuzzle}>Next Puzzle →</button>
                                </div>
                            )}
                        </div>
                        {/* --- End Embedded Widget --- */}

                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    page: {
        background: '#f4f4f5',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
    },
    chatSimulation: {
        width: '100%',
        maxWidth: 700,
        padding: 32,
    },
    chatMessage: {
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
    },
    avatar: {
        position: 'relative',
        width: 36,
        height: 36,
        borderRadius: 18,
        background: '#0ea5e9', // Blueish for AI
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 14,
        flexShrink: 0,
        // The glow beam relies on absolute pseudo-elements, so we need overflow or z-index management
        // But inline styles don't support pseudo-elements directly. We must inject a `<style>` tag or add elements.
    },
    bubble: {
        flex: 1,
        background: '#ffffff',
        padding: 20,
        borderRadius: '0 16px 16px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid #e4e4e7',
    },
    inlineX: {
        background: '#fef08a',
        padding: '2px 6px',
        borderRadius: 4,
        fontWeight: 700,
        color: '#854d0e',
        fontSize: 13,
    },
    widgetCard: {
        background: '#fafafa',
        border: '1px solid #d4d4d8',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 16,
    },
    widgetHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: '#ffffff',
        borderBottom: '1px solid #e4e4e7',
    },
    badge: {
        fontSize: 11,
        padding: '4px 8px',
        borderRadius: 6,
        background: '#e0e7ff',
        color: '#4338ca',
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    puzzleDesc: {
        fontSize: 14,
        fontWeight: 600,
        color: '#52525b',
    },
    equationVisualizer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '32px 16px',
        background: '#f8fafc',
    },
    side: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minWidth: 100,
        padding: '16px',
        background: '#ffffff',
        borderBottom: '3px solid #cbd5e1',
        borderRadius: '8px 8px 0 0',
        transition: 'all 0.3s ease',
        flexWrap: 'wrap',
    },
    equalsSign: {
        fontSize: 28,
        fontWeight: 800,
        color: '#94a3b8',
    },
    block: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 700,
        boxShadow: '0 2px 4px -1px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        border: '1px solid rgba(0,0,0,0.05)',
    },
    actionArea: {
        padding: 20,
        background: '#ffffff',
        borderTop: '1px solid #e4e4e7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
    },
    actionButtons: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    actionBtn: {
        padding: '8px 16px',
        background: '#f1f5f9',
        border: '1px solid #cbd5e1',
        color: '#475569',
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    answerArea: {
        padding: 20,
        background: '#f0fdf4',
        borderTop: '1px solid #bbf7d0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    inputPrefix: {
        color: '#16a34a',
        fontSize: 20,
        fontWeight: 800,
        fontFamily: 'monospace',
    },
    inputField: {
        background: '#ffffff',
        border: '2px solid #4ade80',
        color: '#14532d',
        fontSize: 20,
        fontWeight: 800,
        padding: '6px 12px',
        width: 70,
        borderRadius: 8,
        outline: 'none',
        textAlign: 'center',
    },
    submitBtn: {
        padding: '8px 16px',
        background: '#22c55e',
        color: '#ffffff',
        border: 'none',
        fontSize: 14,
        fontWeight: 700,
        borderRadius: 8,
        cursor: 'pointer',
    },
    successArea: {
        padding: 20,
        background: '#f0fdf4',
        borderTop: '1px solid #bbf7d0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    successText: {
        color: '#15803d',
        fontSize: 16,
        fontWeight: 600,
    },
    nextBtn: {
        padding: '8px 16px',
        background: '#16a34a',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 700,
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
    },
    errorMsg: {
        color: '#ef4444',
        fontSize: 13,
        fontWeight: 600,
    }
};
