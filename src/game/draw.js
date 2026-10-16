// Vector artwork for the cat-and-mouse game. No external assets required.

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function ellipse(ctx, x, y, rx, ry, rot = 0) {
  ctx.beginPath()
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2)
  ctx.closePath()
}

/* ------------------------------------------------------------------ */
/*  Entrance-screen cat: side view, sitting and licking its paw        */
/* ------------------------------------------------------------------ */

export function drawSittingCat(ctx, cx, cy, scale, t) {
  const lick = (Math.sin(t * 4) + 1) / 2 // 0..1 lick cycle
  const bob = Math.sin(t * 2) * 2

  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)

  // ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ellipse(ctx, 0, 6, 118, 20)
  ctx.fill()

  const FUR = '#f2a24a'
  const FUR_DARK = '#d9822b'
  const CREAM = '#ffe6c2'
  const PINK = '#ff9db4'

  // tail curling around the body
  ctx.strokeStyle = FUR_DARK
  ctx.lineWidth = 22
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-70, -38 + bob)
  ctx.quadraticCurveTo(-140, -30, -120, 4)
  ctx.quadraticCurveTo(-96, 26, -30, 14)
  ctx.stroke()
  ctx.strokeStyle = FUR
  ctx.lineWidth = 14
  ctx.beginPath()
  ctx.moveTo(-70, -38 + bob)
  ctx.quadraticCurveTo(-140, -30, -120, 4)
  ctx.quadraticCurveTo(-96, 26, -30, 14)
  ctx.stroke()

  // haunch / back leg
  ctx.fillStyle = FUR
  ellipse(ctx, -42, -48 + bob, 58, 52)
  ctx.fill()

  // body
  ctx.fillStyle = FUR
  ellipse(ctx, -4, -100 + bob, 78, 92)
  ctx.fill()

  // belly
  ctx.fillStyle = CREAM
  ellipse(ctx, 6, -84 + bob, 46, 66)
  ctx.fill()

  // front legs
  ctx.fillStyle = FUR
  roundRect(ctx, -18, -70 + bob, 26, 74, 13)
  ctx.fill()
  roundRect(ctx, 4, -70 + bob, 26, 74, 13)
  ctx.fill()
  ctx.fillStyle = CREAM
  ellipse(ctx, -5, 4, 15, 10)
  ctx.fill()
  ellipse(ctx, 17, 4, 15, 10)
  ctx.fill()

  // raised paw + arm (licks this one)
  const pawLift = lick * 12
  const pawX = 44
  const pawY = -128 - pawLift + bob
  ctx.strokeStyle = FUR
  ctx.lineWidth = 26
  ctx.beginPath()
  ctx.moveTo(26, -96 + bob)
  ctx.quadraticCurveTo(44, -108 + bob, pawX, pawY)
  ctx.stroke()
  ctx.fillStyle = CREAM
  ellipse(ctx, pawX, pawY, 17, 15)
  ctx.fill()

  // head
  ctx.fillStyle = FUR
  ellipse(ctx, 34, -158 + bob, 62, 56)
  ctx.fill()
  // ears
  ctx.beginPath()
  ctx.moveTo(-8, -196 + bob)
  ctx.lineTo(-2, -238 + bob)
  ctx.lineTo(34, -204 + bob)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(72, -204 + bob)
  ctx.lineTo(88, -244 + bob)
  ctx.lineTo(96, -196 + bob)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = PINK
  ctx.beginPath()
  ctx.moveTo(6, -202 + bob)
  ctx.lineTo(8, -228 + bob)
  ctx.lineTo(30, -206 + bob)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(76, -206 + bob)
  ctx.lineTo(86, -234 + bob)
  ctx.lineTo(89, -202 + bob)
  ctx.closePath()
  ctx.fill()

  // muzzle
  ctx.fillStyle = CREAM
  ellipse(ctx, 48, -142 + bob, 40, 28)
  ctx.fill()

  // happy squinting eyes
  ctx.strokeStyle = '#3a2a1c'
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(22, -168 + bob, 12, Math.PI * 1.15, Math.PI * 1.85)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(62, -168 + bob, 12, Math.PI * 1.15, Math.PI * 1.85)
  ctx.stroke()

  // nose + mouth
  ctx.fillStyle = PINK
  ctx.beginPath()
  ctx.moveTo(42, -146 + bob)
  ctx.lineTo(56, -146 + bob)
  ctx.lineTo(49, -138 + bob)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#3a2a1c'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(49, -138 + bob)
  ctx.lineTo(49, -132 + bob)
  ctx.moveTo(49, -132 + bob)
  ctx.quadraticCurveTo(41, -128 + bob, 36, -134 + bob)
  ctx.moveTo(49, -132 + bob)
  ctx.quadraticCurveTo(57, -128 + bob, 62, -134 + bob)
  ctx.stroke()

  // whiskers
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 2.5
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath()
    ctx.moveTo(24, -140 + i * 8 + bob)
    ctx.lineTo(-16, -146 + i * 14 + bob)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(74, -140 + i * 8 + bob)
    ctx.lineTo(112, -146 + i * 14 + bob)
    ctx.stroke()
  }

  // tongue flicking over the raised paw
  if (lick > 0.35) {
    const tl = (lick - 0.35) / 0.65
    ctx.fillStyle = '#ff6f91'
    ellipse(ctx, 40 + tl * 6, -132 - tl * 4 + bob, 9, 12)
    ctx.fill()
  }

  ctx.restore()
}

/* ------------------------------------------------------------------ */
/*  Top-down cat (the player), faces +X before rotation                */
/* ------------------------------------------------------------------ */

export function drawArenaCat(ctx, x, y, angle, scale, t, moving, invuln = 0) {
  const step = moving ? Math.sin(t * 18) : 0
  const FUR = '#f2a24a'
  const FUR_DARK = '#d9822b'
  const CREAM = '#ffe6c2'
  const PINK = '#ff9db4'

  ctx.save()
  ctx.translate(x, y)

  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ellipse(ctx, 0, 6, 34 * scale, 22 * scale)
  ctx.fill()

  if (invuln > 0 && Math.floor(t * 14) % 2 === 0) ctx.globalAlpha = 0.4

  ctx.rotate(angle)
  ctx.scale(scale, scale)

  // tail
  ctx.strokeStyle = FUR
  ctx.lineWidth = 9
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-24, 0)
  ctx.quadraticCurveTo(-46, step * 8, -58, 18)
  ctx.stroke()

  // legs
  ctx.fillStyle = CREAM
  const lp = step * 6
  ellipse(ctx, 14, -20 + lp, 8, 11)
  ctx.fill()
  ellipse(ctx, 14, 20 - lp, 8, 11)
  ctx.fill()
  ellipse(ctx, -16, -20 - lp, 8, 11)
  ctx.fill()
  ellipse(ctx, -16, 20 + lp, 8, 11)
  ctx.fill()

  // body
  ctx.fillStyle = FUR
  ellipse(ctx, -2, 0, 30, 22)
  ctx.fill()
  // stripes
  ctx.strokeStyle = FUR_DARK
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(-12, -16)
  ctx.quadraticCurveTo(-6, 0, -12, 16)
  ctx.moveTo(0, -18)
  ctx.quadraticCurveTo(6, 0, 0, 18)
  ctx.stroke()

  // head
  ctx.fillStyle = FUR
  ellipse(ctx, 26, 0, 19, 18)
  ctx.fill()
  // ears
  ctx.beginPath()
  ctx.moveTo(18, -16)
  ctx.lineTo(14, -30)
  ctx.lineTo(32, -20)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(18, 16)
  ctx.lineTo(14, 30)
  ctx.lineTo(32, 20)
  ctx.closePath()
  ctx.fill()
  // muzzle
  ctx.fillStyle = CREAM
  ellipse(ctx, 34, 0, 12, 13)
  ctx.fill()

  // eyes
  ctx.fillStyle = '#2c2018'
  ellipse(ctx, 30, -7, 3.4, 4.4)
  ctx.fill()
  ellipse(ctx, 30, 7, 3.4, 4.4)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ellipse(ctx, 31.4, -8, 1.2, 1.5)
  ctx.fill()
  ellipse(ctx, 31.4, 6, 1.2, 1.5)
  ctx.fill()
  // nose
  ctx.fillStyle = PINK
  ellipse(ctx, 40, 0, 3.2, 2.6)
  ctx.fill()

  ctx.restore()
}

/* ------------------------------------------------------------------ */
/*  Top-down mouse (the target), faces +X before rotation              */
/* ------------------------------------------------------------------ */

export function drawMouse(ctx, x, y, angle, scale, t, scared) {
  const step = Math.sin(t * 26) * 4
  const GREY = '#b9c0cc'
  const GREY_DARK = '#8f98a8'
  const PINK = '#ff9db4'

  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ellipse(ctx, 0, 4, 16 * scale, 10 * scale)
  ctx.fill()

  ctx.rotate(angle)
  ctx.scale(scale, scale)

  // tail
  ctx.strokeStyle = PINK
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-14, 0)
  ctx.quadraticCurveTo(-30, step, -40, 8 + step)
  ctx.stroke()

  // ears
  ctx.fillStyle = GREY_DARK
  ctx.beginPath()
  ctx.arc(-4, -14, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(-4, 14, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = PINK
  ctx.beginPath()
  ctx.arc(-4, -14, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(-4, 14, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = GREY
  ctx.beginPath()
  ctx.arc(-4, -14, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(-4, 14, 8, 0, Math.PI * 2)
  ctx.fill()

  // body
  ctx.fillStyle = GREY
  ellipse(ctx, 0, 0, 17, 12)
  ctx.fill()

  // head
  ellipse(ctx, 16, 0, 11, 10)
  ctx.fill()

  // eyes
  ctx.fillStyle = '#22242c'
  ellipse(ctx, 19, -4, 2.4, 2.8)
  ctx.fill()
  ellipse(ctx, 19, 4, 2.4, 2.8)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ellipse(ctx, 19.8, -4.6, 0.9, 1.1)
  ctx.fill()
  ellipse(ctx, 19.8, 3.4, 0.9, 1.1)
  ctx.fill()
  // nose
  ctx.fillStyle = PINK
  ellipse(ctx, 26, 0, 2.6, 2.1)
  ctx.fill()
  // whiskers
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 1
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath()
    ctx.moveTo(26, i * 2)
    ctx.lineTo(38, i * 6)
    ctx.stroke()
  }

  if (scared) {
    ctx.fillStyle = '#7fd7ff'
    ellipse(ctx, 16, -10, 2, 3)
    ctx.fill()
  }

  ctx.restore()
}

/* ------------------------------------------------------------------ */
/*  Hurdle (top-down wooden crate barrier)                             */
/* ------------------------------------------------------------------ */

export function drawHurdle(ctx, h, t) {
  const s = h.r
  ctx.save()
  ctx.translate(h.x, h.y)
  ctx.rotate(h.rot)

  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ellipse(ctx, 0, 4, s * 1.05, s * 0.8)
  ctx.fill()

  // caution stripes
  ctx.save()
  roundRect(ctx, -s, -s, s * 2, s * 2, 8)
  ctx.clip()
  ctx.fillStyle = '#f4b942'
  ctx.fillRect(-s, -s, s * 2, s * 2)
  ctx.fillStyle = '#2b2b33'
  for (let i = -s * 2; i < s * 2; i += 22) {
    ctx.beginPath()
    ctx.moveTo(i, s)
    ctx.lineTo(i + 12, s)
    ctx.lineTo(i + 12 + s * 2, -s)
    ctx.lineTo(i + s * 2, -s)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  ctx.strokeStyle = '#8a5a1e'
  ctx.lineWidth = 4
  roundRect(ctx, -s, -s, s * 2, s * 2, 8)
  ctx.stroke()

  ctx.restore()
}

/* ------------------------------------------------------------------ */
/*  Arena floor                                                         */
/* ------------------------------------------------------------------ */

export function drawArena(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#20304a')
  g.addColorStop(1, '#0e1726')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  const grid = 60
  for (let x = 0; x <= w; x += grid) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let y = 0; y <= h; y += grid) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }

  ctx.strokeStyle = 'rgba(120,180,255,0.25)'
  ctx.lineWidth = 3
  ctx.strokeRect(6, 6, w - 12, h - 12)
}
