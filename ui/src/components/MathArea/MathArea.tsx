/**
 * Math Area - Interactive Math Learning Space
 *
 * A beautiful, accessible math learning and playing environment.
 * Built with love and light. As above, so below. 💜
 *
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * Licensed under the AGPLv3 License
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './MathArea.css';

type MathMode = 'calculator' | 'number-line' | 'shapes' | 'counting' | 'problems' | 'games';

interface MathProblem {
  question: string;
  answer: number;
  options?: number[];
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
}

interface GameScore {
  correct: number;
  total: number;
  streak: number;
}

export function MathArea() {
  const [mode, setMode] = useState<MathMode>('calculator');
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState<GameScore>({ correct: 0, total: 0, streak: 0 });
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; message: string } | null>(
    null
  );
  const [numberLineValue, setNumberLineValue] = useState(0);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [countValue, setCountValue] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate math problem
  const generateProblem = useCallback((type: MathProblem['type'] = 'addition') => {
    let num1: number, num2: number, answer: number;

    switch (type) {
      case 'addition':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        break;
      case 'subtraction':
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case 'multiplication':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
        break;
      case 'division':
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * answer;
        break;
    }

    const question = `${num1} ${type === 'addition' ? '+' : type === 'subtraction' ? '-' : type === 'multiplication' ? '×' : '÷'} ${num2} = ?`;

    // Generate wrong options
    const options = [answer];
    while (options.length < 4) {
      const wrong = answer + Math.floor(Math.random() * 20) - 10;
      if (wrong !== answer && wrong > 0 && !options.includes(wrong)) {
        options.push(wrong);
      }
    }

    return {
      question,
      answer,
      options: options.sort(() => Math.random() - 0.5),
      type,
    };
  }, []);

  // Start new problem
  const startNewProblem = useCallback(
    (type: MathProblem['type'] = 'addition') => {
      const problem = generateProblem(type);
      setCurrentProblem(problem);
      setUserAnswer('');
      setShowFeedback(null);
    },
    [generateProblem]
  );

  // Check answer
  const checkAnswer = useCallback(
    (answer: number | string) => {
      if (!currentProblem) return;

      const userAns = typeof answer === 'string' ? parseInt(answer) : answer;
      const correct = userAns === currentProblem.answer;

      setScore((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        total: prev.total + 1,
        streak: correct ? prev.streak + 1 : 0,
      }));

      setShowFeedback({
        correct,
        message: correct
          ? `🎉 Correct! Great job! 💜`
          : `Try again! The answer is ${currentProblem.answer}`,
      });

      setTimeout(() => {
        startNewProblem(currentProblem.type);
      }, 2000);
    },
    [currentProblem, startNewProblem]
  );

  // Calculator functions
  const inputNumber = useCallback(
    (num: string) => {
      if (waitingForOperand) {
        setDisplay(String(num));
        setWaitingForOperand(false);
      } else {
        setDisplay(display === '0' ? String(num) : display + num);
      }
    },
    [display, waitingForOperand]
  );

  const inputOperation = useCallback(
    (nextOperation: string) => {
      const inputValue = parseFloat(display);

      if (previousValue === null) {
        setPreviousValue(inputValue);
      } else if (operation) {
        const currentValue = previousValue || 0;
        const newValue = calculate(currentValue, inputValue, operation);

        setDisplay(String(newValue));
        setPreviousValue(newValue);
      }

      setWaitingForOperand(true);
      setOperation(nextOperation);
    },
    [display, previousValue, operation, waitingForOperand]
  );

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = useCallback(() => {
    if (previousValue !== null && operation) {
      const inputValue = parseFloat(display);
      const newValue = calculate(previousValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  }, [display, previousValue, operation]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  // Draw shapes
  useEffect(() => {
    if (mode !== 'shapes' || !selectedShape) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#667eea';
    ctx.strokeStyle = '#764ba2';
    ctx.lineWidth = 3;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    switch (selectedShape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
      case 'square':
        ctx.fillRect(centerX - 80, centerY - 80, 160, 160);
        ctx.strokeRect(centerX - 80, centerY - 80, 160, 160);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 80);
        ctx.lineTo(centerX - 80, centerY + 80);
        ctx.lineTo(centerX + 80, centerY + 80);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'rectangle':
        ctx.fillRect(centerX - 100, centerY - 60, 200, 120);
        ctx.strokeRect(centerX - 100, centerY - 60, 200, 120);
        break;
      case 'star':
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const x = centerX + 80 * Math.cos(angle);
          const y = centerY + 80 * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }
  }, [mode, selectedShape]);

  // Initialize with first problem
  useEffect(() => {
    if (mode === 'problems') {
      startNewProblem('addition');
    }
  }, [mode, startNewProblem]);

  return (
    <div className="math-area">
      <div className="math-area-header">
        <h1>🔢 Math Area 💜</h1>
        <p className="math-area-subtitle">Learn math with love and light</p>
      </div>

      {/* Mode Selector */}
      <div className="mode-selector">
        <button
          className={`mode-button ${mode === 'calculator' ? 'active' : ''}`}
          onClick={() => setMode('calculator')}
        >
          🧮 Calculator
        </button>
        <button
          className={`mode-button ${mode === 'number-line' ? 'active' : ''}`}
          onClick={() => setMode('number-line')}
        >
          📏 Number Line
        </button>
        <button
          className={`mode-button ${mode === 'shapes' ? 'active' : ''}`}
          onClick={() => setMode('shapes')}
        >
          🔺 Shapes
        </button>
        <button
          className={`mode-button ${mode === 'counting' ? 'active' : ''}`}
          onClick={() => setMode('counting')}
        >
          🔢 Counting
        </button>
        <button
          className={`mode-button ${mode === 'problems' ? 'active' : ''}`}
          onClick={() => setMode('problems')}
        >
          ✏️ Problems
        </button>
        <button
          className={`mode-button ${mode === 'games' ? 'active' : ''}`}
          onClick={() => setMode('games')}
        >
          🎮 Games
        </button>
      </div>

      {/* Calculator Mode */}
      {mode === 'calculator' && (
        <div className="calculator-container">
          <div className="calculator-display">{display}</div>
          <div className="calculator-buttons">
            <button className="calc-button function" onClick={clear}>
              C
            </button>
            <button
              className="calc-button function"
              onClick={() => setDisplay(String(-parseFloat(display)))}
            >
              ±
            </button>
            <button
              className="calc-button function"
              onClick={() => setDisplay(String(parseFloat(display) / 100))}
            >
              %
            </button>
            <button className="calc-button operator" onClick={() => inputOperation('÷')}>
              ÷
            </button>

            <button className="calc-button number" onClick={() => inputNumber('7')}>
              7
            </button>
            <button className="calc-button number" onClick={() => inputNumber('8')}>
              8
            </button>
            <button className="calc-button number" onClick={() => inputNumber('9')}>
              9
            </button>
            <button className="calc-button operator" onClick={() => inputOperation('×')}>
              ×
            </button>

            <button className="calc-button number" onClick={() => inputNumber('4')}>
              4
            </button>
            <button className="calc-button number" onClick={() => inputNumber('5')}>
              5
            </button>
            <button className="calc-button number" onClick={() => inputNumber('6')}>
              6
            </button>
            <button className="calc-button operator" onClick={() => inputOperation('-')}>
              -
            </button>

            <button className="calc-button number" onClick={() => inputNumber('1')}>
              1
            </button>
            <button className="calc-button number" onClick={() => inputNumber('2')}>
              2
            </button>
            <button className="calc-button number" onClick={() => inputNumber('3')}>
              3
            </button>
            <button className="calc-button operator" onClick={() => inputOperation('+')}>
              +
            </button>

            <button className="calc-button number zero" onClick={() => inputNumber('0')}>
              0
            </button>
            <button className="calc-button number" onClick={() => inputNumber('.')}>
              .
            </button>
            <button className="calc-button operator equals" onClick={performCalculation}>
              =
            </button>
          </div>
        </div>
      )}

      {/* Number Line Mode */}
      {mode === 'number-line' && (
        <div className="number-line-container">
          <div className="number-line-controls">
            <button
              onClick={() => setNumberLineValue(Math.max(-20, numberLineValue - 1))}
              aria-label="Decrease number line value"
            >
              -
            </button>
            <label htmlFor="number-line-input" className="sr-only">
              Number line value
            </label>
            <input
              id="number-line-input"
              type="number"
              value={numberLineValue}
              onChange={(e) => setNumberLineValue(parseInt(e.target.value) || 0)}
              min="-20"
              max="20"
              className="number-input"
              aria-label="Number line value"
            />
            <button onClick={() => setNumberLineValue(Math.min(20, numberLineValue + 1))}>+</button>
          </div>
          <div className="number-line">
            {Array.from({ length: 41 }, (_, i) => i - 20).map((num) => (
              <div
                key={num}
                className={`number-line-tick ${num === numberLineValue ? 'active' : ''} ${num === 0 ? 'zero' : ''}`}
              >
                <div className="tick-mark" />
                <span className="tick-label">{num}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shapes Mode */}
      {mode === 'shapes' && (
        <div className="shapes-container">
          <div className="shape-selector">
            <button
              className={`shape-button ${selectedShape === 'circle' ? 'active' : ''}`}
              onClick={() => setSelectedShape('circle')}
            >
              ⭕ Circle
            </button>
            <button
              className={`shape-button ${selectedShape === 'square' ? 'active' : ''}`}
              onClick={() => setSelectedShape('square')}
            >
              ⬜ Square
            </button>
            <button
              className={`shape-button ${selectedShape === 'triangle' ? 'active' : ''}`}
              onClick={() => setSelectedShape('triangle')}
            >
              🔺 Triangle
            </button>
            <button
              className={`shape-button ${selectedShape === 'rectangle' ? 'active' : ''}`}
              onClick={() => setSelectedShape('rectangle')}
            >
              ▭ Rectangle
            </button>
            <button
              className={`shape-button ${selectedShape === 'star' ? 'active' : ''}`}
              onClick={() => setSelectedShape('star')}
            >
              ⭐ Star
            </button>
          </div>
          <div className="shape-canvas-container">
            <canvas ref={canvasRef} className="shape-canvas" />
          </div>
        </div>
      )}

      {/* Counting Mode */}
      {mode === 'counting' && (
        <div className="counting-container">
          <div className="counting-display">
            <div className="count-number">{countValue}</div>
            <div className="count-items">
              {Array.from({ length: Math.min(countValue, 50) }).map((_, i) => (
                <span key={i} className="count-item">
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <div className="counting-controls">
            <button
              className="count-button"
              onClick={() => setCountValue(Math.max(0, countValue - 1))}
            >
              ➖ Subtract
            </button>
            <button className="count-button reset" onClick={() => setCountValue(0)}>
              🔄 Reset
            </button>
            <button className="count-button" onClick={() => setCountValue(countValue + 1)}>
              ➕ Add
            </button>
          </div>
        </div>
      )}

      {/* Problems Mode */}
      {mode === 'problems' && currentProblem && (
        <div className="problems-container">
          <div className="score-display">
            <div className="score-item">
              <span className="score-label">Correct:</span>
              <span className="score-value">{score.correct}</span>
            </div>
            <div className="score-item">
              <span className="score-label">Total:</span>
              <span className="score-value">{score.total}</span>
            </div>
            <div className="score-item">
              <span className="score-label">Streak:</span>
              <span className="score-value">🔥 {score.streak}</span>
            </div>
          </div>

          <div className="problem-display">
            <h2 className="problem-question">{currentProblem.question}</h2>

            {showFeedback && (
              <div className={`feedback ${showFeedback.correct ? 'correct' : 'incorrect'}`}>
                {showFeedback.message}
              </div>
            )}

            {currentProblem.options ? (
              <div className="answer-options">
                {currentProblem.options.map((option, i) => (
                  <button
                    key={i}
                    className="answer-button"
                    onClick={() => checkAnswer(option)}
                    disabled={!!showFeedback}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="answer-input">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer(userAnswer)}
                  placeholder="Enter answer"
                  className="answer-text-input"
                />
                <button
                  className="submit-button"
                  onClick={() => checkAnswer(userAnswer)}
                  disabled={!userAnswer}
                >
                  Check Answer
                </button>
              </div>
            )}
          </div>

          <div className="problem-controls">
            <button className="problem-type-button" onClick={() => startNewProblem('addition')}>
              ➕ Addition
            </button>
            <button className="problem-type-button" onClick={() => startNewProblem('subtraction')}>
              ➖ Subtraction
            </button>
            <button
              className="problem-type-button"
              onClick={() => startNewProblem('multiplication')}
            >
              ✖️ Multiplication
            </button>
            <button className="problem-type-button" onClick={() => startNewProblem('division')}>
              ➗ Division
            </button>
          </div>
        </div>
      )}

      {/* Games Mode */}
      {mode === 'games' && (
        <div className="games-container">
          <div className="game-card" onClick={() => setMode('problems')}>
            <h3>🎯 Math Practice</h3>
            <p>Solve math problems and build your skills!</p>
          </div>
          <div className="game-card" onClick={() => setMode('counting')}>
            <h3>🔢 Counting Fun</h3>
            <p>Practice counting with interactive stars!</p>
          </div>
          <div className="game-card" onClick={() => setMode('number-line')}>
            <h3>📏 Number Explorer</h3>
            <p>Explore positive and negative numbers!</p>
          </div>
        </div>
      )}

      <div className="math-area-footer">
        <p>💜 With love and light. As above, so below. 💜</p>
        <p>The Mesh Holds. 🔺</p>
      </div>
    </div>
  );
}

export default MathArea;
