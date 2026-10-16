import {
  drawArena,
  drawArenaCat,
  drawMouse,
  drawHurdle,
} from './draw.js'

const W = 900
const H = 600
const CAT_R = 24
const MOUSE_R = 16
const EDGE = 26

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function len(x, y) {
  return Math.hypot(x, y)
}

export function createGame(canvas, opts = {}) {
  const ctx = canvas.getContext('2d')
  const {
    onScore = () => {},
    onLives = () => {},
    onGameOver = () => {},
    onCatch = () => {},
    onHit = () => {},
  } = opts

  const input = { up: false, down: false, left: false, right: false }
  const pointer = { active: false, x: 0, y: 0 }

  let dpr = 1
  let view = { scale: 1, ox: 0, oy: 0, cw: 0, ch: 0 }

  const cat = { x: W / 2, y: H / 2, vx: 0, vy: 0, angle: 0, moving: false, invuln: 0 }
  const mouse = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, scared: false }
  let hurdles = []
  let particles = []

  let score = 0
  let lives = 3
  let level = 1
  let spawnTimer = 0
  let wanderAngle = 0
  let wanderTimer = 0

  let running = false
  let rafId = 0
  let last = 0
  let time = 0

  function resize() {
    const rect = canvas.getBoundingClientRect()
    const cw = Math.max(1, rect.width)
    const ch = Math.max(1, rect.height)
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(cw * dpr)
    canvas.height = Math.round(ch * dpr)
    const scale = Math.min(cw / W, ch / H)
    view = { scale, ox: (cw - W * scale) / 2, oy: (ch - H * scale) / 2, cw, ch }
  }

  function clientToLogical(clientX, clientY) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: (clientX - rect.left - view.ox) / view.scale,
      y: (clientY - rect.top - view.oy) / view.scale,
    }
  }

  function setPointer(active, clientX = 0, clientY = 0) {
    pointer.active = active
    if (active) {
      const p = clientToLogical(clientX, clientY)
      pointer.x = p.x
      pointer.y = p.y
    }
  }

  function spawnMouse() {
    let mx
    let my
    do {
      mx = rand(60, W - 60)
      my = rand(60, H - 60)
    } while (len(mx - cat.x, my - cat.y) < 260)
    mouse.x = mx
    mouse.y = my
    mouse.vx = 0
    mouse.vy = 0
  }

  function spawnHurdle() {
    const r = rand(26, 34)
    const speed = Math.min(80 + level * 14 + rand(0, 40), 260)
    const a = rand(0, Math.PI * 2)
    // start near an edge, travelling inwards
    let x
    let y
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? EDGE : W - EDGE
      y = rand(r, H - r)
    } else {
      y = Math.random() < 0.5 ? EDGE : H - EDGE
      x = rand(r, W - r)
    }
    hurdles.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      r,
      rot: rand(0, Math.PI),
      rotSpeed: rand(-2, 2),
    })
  }

  function burst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2)
      const sp = rand(60, 300)
      particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rand(0.3, 0.7),
        max: 0.7,
        size: rand(2, 5),
        color,
      })
    }
  }

  function caught() {
    score += 1
    level += 1
    onScore(score)
    onCatch(score)
    burst(mouse.x, mouse.y, '#ffd66b', 26)
    spawnMouse()
    // nail a new hurdle into the arena occasionally
    if (hurdles.length < 3 + Math.min(level, 6)) spawnHurdle()
  }

  function hit(h) {
    lives -= 1
    onLives(lives)
    cat.invuln = 1.6
    const dx = cat.x - h.x
    const dy = cat.y - h.y
    const d = Math.max(1, len(dx, dy))
    cat.vx = (dx / d) * 520
    cat.vy = (dy / d) * 520
    burst(cat.x, cat.y, '#ff6b6b', 22)
    onHit()
    if (lives <= 0) {
      running = false
      onGameOver(score)
    }
  }

  function updateCat(dt) {
    let tx = 0
    let ty = 0
    if (input.up) ty -= 1
    if (input.down) ty += 1
    if (input.left) tx -= 1
    if (input.right) tx += 1

    if (pointer.active) {
      const dx = pointer.x - cat.x
      const dy = pointer.y - cat.y
      if (len(dx, dy) > 6) {
        tx = dx
        ty = dy
      }
    }

    const mag = len(tx, ty)
    const speed = 330
    let dvx = 0
    let dvy = 0
    if (mag > 0) {
      dvx = (tx / mag) * speed
      dvy = (ty / mag) * speed
      cat.moving = true
    } else {
      cat.moving = false
    }

    const k = Math.min(1, dt * 12)
    cat.vx += (dvx - cat.vx) * k
    cat.vy += (dvy - cat.vy) * k
    cat.x += cat.vx * dt
    cat.y += cat.vy * dt

    // walls
    if (cat.x < CAT_R) {
      cat.x = CAT_R
      cat.vx = 0
    }
    if (cat.x > W - CAT_R) {
      cat.x = W - CAT_R
      cat.vx = 0
    }
    if (cat.y < CAT_R) {
      cat.y = CAT_R
      cat.vy = 0
    }
    if (cat.y > H - CAT_R) {
      cat.y = H - CAT_R
      cat.vy = 0
    }

    if (cat.moving && len(cat.vx, cat.vy) > 20) {
      cat.angle = Math.atan2(cat.vy, cat.vx)
    }
    if (cat.invuln > 0) cat.invuln = Math.max(0, cat.invuln - dt)
  }

  function updateMouse(dt) {
    wanderTimer -= dt
    if (wanderTimer <= 0) {
      wanderTimer = rand(0.6, 1.6)
      wanderAngle = rand(0, Math.PI * 2)
    }

    const dx = mouse.x - cat.x
    const dy = mouse.y - cat.y
    const dist = len(dx, dy)
    const speed = Math.min(200 + level * 24, 420)

    let dvx
    let dvy
    if (dist < 280) {
      mouse.scared = true
      const nx = dx / Math.max(1, dist)
      const ny = dy / Math.max(1, dist)
      // add a little sideways weave so it's not a straight line
      const weave = Math.sin(time * 4) * 0.5
      dvx = (nx * Math.cos(weave) - ny * Math.sin(weave)) * speed
      dvy = (nx * Math.sin(weave) + ny * Math.cos(weave)) * speed
    } else {
      mouse.scared = false
      dvx = Math.cos(wanderAngle) * speed * 0.55
      dvy = Math.sin(wanderAngle) * speed * 0.55
    }

    // steer away from walls
    if (mouse.x < MOUSE_R + 20) dvx += speed
    if (mouse.x > W - MOUSE_R - 20) dvx -= speed
    if (mouse.y < MOUSE_R + 20) dvy += speed
    if (mouse.y > H - MOUSE_R - 20) dvy -= speed

    const k = Math.min(1, dt * 8)
    mouse.vx += (dvx - mouse.vx) * k
    mouse.vy += (dvy - mouse.vy) * k
    mouse.x += mouse.vx * dt
    mouse.y += mouse.vy * dt

    if (mouse.x < MOUSE_R) {
      mouse.x = MOUSE_R
      mouse.vx *= -0.6
    }
    if (mouse.x > W - MOUSE_R) {
      mouse.x = W - MOUSE_R
      mouse.vx *= -0.6
    }
    if (mouse.y < MOUSE_R) {
      mouse.y = MOUSE_R
      mouse.vy *= -0.6
    }
    if (mouse.y > H - MOUSE_R) {
      mouse.y = H - MOUSE_R
      mouse.vy *= -0.6
    }

    if (len(mouse.vx, mouse.vy) > 10) {
      mouse.angle = Math.atan2(mouse.vy, mouse.vx)
    }
  }

  function updateHurdles(dt) {
    for (const h of hurdles) {
      if (Math.random() < dt * 0.4) {
        h.vx += rand(-80, 80)
        h.vy += rand(-80, 80)
        const sp = len(h.vx, h.vy)
        const cap = 280
        if (sp > cap) {
          h.vx = (h.vx / sp) * cap
          h.vy = (h.vy / sp) * cap
        }
      }
      h.x += h.vx * dt
      h.y += h.vy * dt
      h.rot += h.rotSpeed * dt

      if (h.x < h.r) {
        h.x = h.r
        h.vx = Math.abs(h.vx)
      }
      if (h.x > W - h.r) {
        h.x = W - h.r
        h.vx = -Math.abs(h.vx)
      }
      if (h.y < h.r) {
        h.y = h.r
        h.vy = Math.abs(h.vy)
      }
      if (h.y > H - h.r) {
        h.y = H - h.r
        h.vy = -Math.abs(h.vy)
      }
    }
  }

  function checkCollisions() {
    // catch the mouse
    if (len(cat.x - mouse.x, cat.y - mouse.y) < CAT_R + MOUSE_R) {
      caught()
    }
    // dodge the hurdles
    if (cat.invuln <= 0) {
      for (const h of hurdles) {
        if (len(cat.x - h.x, cat.y - h.y) < CAT_R + h.r - 6) {
          hit(h)
          break
        }
      }
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vx *= 0.94
      p.vy *= 0.94
      p.life -= dt
      if (p.life <= 0) particles.splice(i, 1)
    }
  }

  function render() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, view.cw, view.ch)
    ctx.save()
    ctx.translate(view.ox, view.oy)
    ctx.scale(view.scale, view.scale)

    drawArena(ctx, W, H)
    for (const h of hurdles) drawHurdle(ctx, h, time)
    drawMouse(ctx, mouse.x, mouse.y, mouse.angle, 1, time, mouse.scared)
    drawArenaCat(
      ctx,
      cat.x,
      cat.y,
      cat.angle,
      1,
      time,
      cat.moving,
      cat.invuln,
    )

    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max)
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    ctx.restore()
  }

  function loop(ts) {
    if (!running) return
    if (!last) last = ts
    const dt = Math.min(0.033, (ts - last) / 1000)
    last = ts
    time += dt

    spawnTimer -= dt

    updateCat(dt)
    updateMouse(dt)
    updateHurdles(dt)
    checkCollisions()
    updateParticles(dt)

    if (running) rafId = requestAnimationFrame(loop)
    render()
  }

  function start() {
    resize()
    score = 0
    lives = 3
    level = 1
    time = 0
    last = 0
    spawnTimer = 0
    particles = []
    hurdles = []
    cat.x = W / 2
    cat.y = H / 2
    cat.vx = 0
    cat.vy = 0
    cat.angle = 0
    cat.invuln = 1
    spawnMouse()
    onScore(score)
    onLives(lives)
    running = true
    rafId = requestAnimationFrame(loop)
  }

  function stop() {
    running = false
    cancelAnimationFrame(rafId)
  }

  // keep the arena fed with hurdles as the level rises
  const obstacleTimer = setInterval(() => {
    if (!running) return
    const target = 3 + Math.min(level, 6)
    if (hurdles.length < target) spawnHurdle()
  }, 1400)

  return {
    input,
    start,
    stop,
    resize,
    setPointer,
    destroy() {
      stop()
      clearInterval(obstacleTimer)
    },
    get running() {
      return running
    },
    W,
    H,
  }
}
