import { useEffect, useRef, useState, useCallback } from 'react'
import { createGame } from './game/engine.js'
import { drawSittingCat } from './game/draw.js'

const START_W = 420
const START_H = 340

function Heart({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className={`heart ${filled ? 'on' : 'off'}`}>
      <path d="M12 21s-7.5-4.7-9.8-9.2C.6 8.5 2.4 5 5.9 5c2 0 3.4 1.1 4.1 2.2C10.7 6.1 12 5 14 5c3.5 0 5.3 3.5 3.7 6.8C19.5 16.3 12 21 12 21z" />
    </svg>
  )
}

function StartScreen({ onPlay, best }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = START_W * dpr
    canvas.height = START_H * dpr
    let raf = 0
    const t0 = performance.now()

    const render = (now) => {
      const t = (now - t0) / 1000
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, START_W, START_H)

      const g = ctx.createLinearGradient(0, 0, 0, START_H)
      g.addColorStop(0, '#1b2a44')
      g.addColorStop(1, '#0b1220')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, START_W, START_H)

      ctx.fillStyle = 'rgba(120,180,255,0.08)'
      for (let i = 0; i < 24; i++) {
        const x = (i * 97) % START_W
        const y = (i * 53) % START_H
        ctx.beginPath()
        ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2)
        ctx.fill()
      }

      // floor
      ctx.fillStyle = '#16233a'
      ctx.beginPath()
      ctx.ellipse(START_W / 2, 300, 230, 40, 0, 0, Math.PI * 2)
      ctx.fill()

      drawSittingCat(ctx, START_W / 2 - 10, 300, 0.82, t)
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="screen start-screen">
      <h1 className="title">
        Cat <span>&amp;</span> Mouse
      </h1>
      <p className="subtitle">Chase the mouse. Dodge the hurdles.</p>

      <div className="start-art">
        <canvas ref={ref} />
      </div>

      <button className="play-btn" onClick={onPlay}>
        Play
      </button>

      <p className="hint">
        Drag anywhere to steer · or use arrow keys / WASD
      </p>
      {best > 0 && <p className="best">Best score: {best}</p>}
    </div>
  )
}

function GameScreen({ onExit, onEnd, best }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [over, setOver] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const engine = createGame(canvasRef.current, {
      onScore: setScore,
      onLives: setLives,
      onGameOver: (s) => {
        setOver(true)
        onEnd(s)
      },
    })
    engineRef.current = engine
    engine.start()

    const onResize = () => engine.resize()
    window.addEventListener('resize', onResize)

    const onKey = (e, down) => {
      const k = e.key.toLowerCase()
      if (k === 'arrowup' || k === 'w') engine.input.up = down
      else if (k === 'arrowdown' || k === 's') engine.input.down = down
      else if (k === 'arrowleft' || k === 'a') engine.input.left = down
      else if (k === 'arrowright' || k === 'd') engine.input.right = down
      else return
      e.preventDefault()
    }
    const kd = (e) => onKey(e, true)
    const ku = (e) => onKey(e, false)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)

    const canvas = canvasRef.current
    const down = (e) => {
      canvas.setPointerCapture?.(e.pointerId)
      engine.setPointer(true, e.clientX, e.clientY)
    }
    const move = (e) => {
      if (e.buttons || e.pointerType === 'touch') {
        if (e.pointerType === 'touch' || e.buttons) {
          engine.setPointer(true, e.clientX, e.clientY)
        }
      }
    }
    const up = () => engine.setPointer(false)
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)
    canvas.addEventListener('pointerleave', up)

    return () => {
      engine.destroy()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
      canvas.removeEventListener('pointerleave', up)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const togglePause = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return
    if (paused) {
      engine.start()
      setPaused(false)
    } else {
      engine.stop()
      setPaused(true)
    }
  }, [paused])

  return (
    <div className="screen game-screen" ref={wrapRef}>
      <div className="hud">
        <div className="hud-left">
          <span className="hud-label">Score</span>
          <span className="hud-value">{score}</span>
        </div>
        <div className="hearts">
          {[0, 1, 2].map((i) => (
            <Heart key={i} filled={i < lives} />
          ))}
        </div>
        <div className="hud-right">
          <button className="icon-btn" onClick={togglePause}>
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button className="icon-btn" onClick={onExit}>
            Menu
          </button>
        </div>
      </div>

      <div className="arena">
        <canvas ref={canvasRef} />
      </div>

      {!over && !paused && (
        <p className="hint in-game">Drag to steer · catch the mouse · dodge the hurdles</p>
      )}

      {paused && !over && (
        <div className="overlay">
          <div className="card">
            <h2>Paused</h2>
            <button className="play-btn small" onClick={togglePause}>
              Resume
            </button>
            <button className="ghost-btn" onClick={onExit}>
              Quit to menu
            </button>
          </div>
        </div>
      )}

      {over && (
        <div className="overlay">
          <div className="card">
            <h2>Caught out!</h2>
            <p className="final">
              You caught <b>{score}</b> mouse{score === 1 ? '' : 's'}
            </p>
            <p className="best">Best score: {Math.max(best, score)}</p>
            <button
              className="play-btn small"
              onClick={() => {
                setOver(false)
                setScore(0)
                setLives(3)
                engineRef.current?.start()
              }}
            >
              Play again
            </button>
            <button className="ghost-btn" onClick={onExit}>
              Back to menu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('start')
  const [best, setBest] = useState(() => {
    const v = Number(localStorage.getItem('catmouse.best') || 0)
    return Number.isFinite(v) ? v : 0
  })

  const endGame = useCallback((score) => {
    setBest((b) => {
      const nb = Math.max(b, score)
      localStorage.setItem('catmouse.best', String(nb))
      return nb
    })
  }, [])

  return (
    <div className="app">
      {screen === 'start' && (
        <StartScreen onPlay={() => setScreen('play')} best={best} />
      )}
      {screen === 'play' && (
        <GameScreen
          best={best}
          onEnd={endGame}
          onExit={() => setScreen('start')}
        />
      )}
    </div>
  )
}
