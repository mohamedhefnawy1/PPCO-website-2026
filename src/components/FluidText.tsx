"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A line of text that fills with coloured smoke where the pointer moves over it.
 *
 * A small fluid simulation (velocity, pressure and dye fields on the GPU) runs on a canvas behind the
 * text; the pointer stirs it and drops dye in the two logo colours. The text is then used as a stencil:
 * a black layer with white letters multiplies the canvas, so the smoke only shows inside the letters,
 * and the whole group is screened onto the page so the black around the letters disappears.
 *
 * - Nothing runs until the pointer first reaches the text, and the loop stops once the smoke has faded.
 * - Reduced-motion visitors, and browsers without WebGL 2 float textures, get a soft two-colour glow
 *   under the pointer instead.
 */

// Linear colour of the letters at rest: screened onto the footer's near-black it lands on the same
// grey the sign-off had before (white at 12%).
const REST = 0.12;
const GREEN: [number, number, number] = [0.08, 0.8, 0.03];
const PURPLE: [number, number, number] = [0.42, 0.16, 1.3];

const VERT = `
attribute vec2 aPos;
uniform vec2 texel;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
void main () {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(texel.x, 0.0); vR = vUv + vec2(texel.x, 0.0);
  vT = vUv + vec2(0.0, texel.y); vB = vUv - vec2(0.0, texel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;
const HEAD = `precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;`;
const FRAG = {
  splat: `${HEAD} uniform sampler2D uTarget; uniform float aspect; uniform vec3 color; uniform vec2 point; uniform float radius;
    void main () { vec2 p = vUv - point; p.x *= aspect; gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0); }`,
  advect: `${HEAD} uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 velTexel; uniform float dt; uniform float dissipation;
    void main () { vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * velTexel; gl_FragColor = vec4(texture2D(uSource, coord).xyz / (1.0 + dissipation * dt), 1.0); }`,
  divergence: `${HEAD} uniform sampler2D uVelocity;
    void main () { float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x; float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0); }`,
  curl: `${HEAD} uniform sampler2D uVelocity;
    void main () { float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y; float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
      gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0); }`,
  vorticity: `${HEAD} uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
    void main () { float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x; float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x; float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L)); force /= length(force) + 0.0001; force *= curl * C; force.y *= -1.0;
      vec2 v = texture2D(uVelocity, vUv).xy + force * dt; gl_FragColor = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0); }`,
  pressure: `${HEAD} uniform sampler2D uPressure; uniform sampler2D uDivergence;
    void main () { float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x; float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
      gl_FragColor = vec4((L + R + B + T - texture2D(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0); }`,
  gradient: `${HEAD} uniform sampler2D uPressure; uniform sampler2D uVelocity;
    void main () { float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x; float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
      gl_FragColor = vec4(texture2D(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0); }`,
  scale: `${HEAD} uniform sampler2D uTarget; uniform float value; void main () { gl_FragColor = value * texture2D(uTarget, vUv); }`,
  display: `${HEAD} uniform sampler2D uTarget; uniform float rest;
    void main () { vec3 c = texture2D(uTarget, vUv).rgb; c = vec3(rest) + (1.0 - rest) * (1.0 - exp(-1.25 * c)); gl_FragColor = vec4(c, 1.0); }`,
};

type FBO = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };
type Double = { read: FBO; write: FBO; swap: () => void };

/** Sets up the simulation on a canvas. Returns null when the browser can't run it. */
function createFluid(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const vert = compile(gl.VERTEX_SHADER, VERT);
  const program = (frag: string) => {
    const p = gl.createProgram()!;
    gl.attachShader(p, vert);
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(p, 0, "aPos");
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("shader");
    const u: Record<string, WebGLUniformLocation | null> = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(p, i)!.name;
      u[name] = gl.getUniformLocation(p, name);
    }
    return { p, u };
  };

  let progs: Record<keyof typeof FRAG, ReturnType<typeof program>>;
  try {
    progs = Object.fromEntries(Object.entries(FRAG).map(([k, src]) => [k, program(src)])) as typeof progs;
  } catch {
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const target = (w: number, h: number): FBO => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h };
  };
  const double = (w: number, h: number): Double => {
    const d = { read: target(w, h), write: target(w, h), swap: () => void ([d.read, d.write] = [d.write, d.read]) };
    return d;
  };

  // Grid sizes follow the strip's shape (it is roughly ten times wider than tall).
  const aspect = Math.max(1, canvas.width / Math.max(1, canvas.height));
  const simH = 48;
  const simW = Math.min(640, Math.round(simH * aspect));
  const dyeH = 144;
  const dyeW = Math.min(1600, Math.round(dyeH * aspect));
  const velocity = double(simW, simH);
  const pressure = double(simW, simH);
  const divergence = target(simW, simH);
  const curl = target(simW, simH);
  const dye = double(dyeW, dyeH);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;

  let unit = 0;
  const use = (name: keyof typeof FRAG, texelOf: { w: number; h: number }) => {
    const pr = progs[name];
    gl.useProgram(pr.p);
    gl.uniform2f(pr.u.texel, 1 / texelOf.w, 1 / texelOf.h);
    unit = 0;
    return pr.u;
  };
  const bind = (loc: WebGLUniformLocation | null, t: FBO) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.uniform1i(loc, unit++);
  };
  const draw = (to: FBO | null) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, to ? to.fbo : null);
    gl.viewport(0, 0, to ? to.w : canvas.width, to ? to.h : canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  return {
    /** Stir the fluid at (x, y) in 0..1, with a push (in simulation cells per second) and a dye colour. */
    splat(x: number, y: number, vx: number, vy: number, color: [number, number, number]) {
      let u = use("splat", velocity.read);
      bind(u.uTarget, velocity.read);
      gl.uniform1f(u.aspect, aspect);
      gl.uniform2f(u.point, x, y);
      gl.uniform3f(u.color, vx, vy, 0);
      gl.uniform1f(u.radius, 0.05);
      draw(velocity.write);
      velocity.swap();
      u = use("splat", dye.read);
      bind(u.uTarget, dye.read);
      gl.uniform1f(u.aspect, aspect);
      gl.uniform2f(u.point, x, y);
      gl.uniform3f(u.color, color[0], color[1], color[2]);
      gl.uniform1f(u.radius, 0.09);
      draw(dye.write);
      dye.swap();
    },
    step(dt: number) {
      let u = use("curl", velocity.read);
      bind(u.uVelocity, velocity.read);
      draw(curl);

      u = use("vorticity", velocity.read);
      bind(u.uVelocity, velocity.read);
      bind(u.uCurl, curl);
      gl.uniform1f(u.curl, 22);
      gl.uniform1f(u.dt, dt);
      draw(velocity.write);
      velocity.swap();

      u = use("divergence", velocity.read);
      bind(u.uVelocity, velocity.read);
      draw(divergence);

      u = use("scale", pressure.read);
      bind(u.uTarget, pressure.read);
      gl.uniform1f(u.value, 0.8);
      draw(pressure.write);
      pressure.swap();

      u = use("pressure", pressure.read);
      for (let i = 0; i < 16; i++) {
        unit = 0;
        bind(u.uDivergence, divergence);
        bind(u.uPressure, pressure.read);
        draw(pressure.write);
        pressure.swap();
      }

      u = use("gradient", velocity.read);
      bind(u.uPressure, pressure.read);
      bind(u.uVelocity, velocity.read);
      draw(velocity.write);
      velocity.swap();

      u = use("advect", velocity.read);
      gl.uniform2f(u.velTexel, 1 / simW, 1 / simH);
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.dissipation, 1.2);
      bind(u.uVelocity, velocity.read);
      bind(u.uSource, velocity.read);
      draw(velocity.write);
      velocity.swap();

      u = use("advect", dye.read);
      gl.uniform2f(u.velTexel, 1 / simW, 1 / simH);
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.dissipation, 0.65);
      bind(u.uVelocity, velocity.read);
      bind(u.uSource, dye.read);
      draw(dye.write);
      dye.swap();

      u = use("display", dye.read);
      bind(u.uTarget, dye.read);
      gl.uniform1f(u.rest, REST);
      draw(null);
    },
    sim: { w: simW, h: simH },
    destroy() {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

export default function FluidText({ text, className = "" }: { text: string; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  // "glow": the simple fallback (reduced motion, or no WebGL 2).
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    if (reduce) return void setGlow(true);

    let fluid: ReturnType<typeof createFluid> = null;
    let failed = false;
    let raf = 0;
    let last = 0;
    let lastInput = 0;
    let prev: { x: number; y: number } | null = null;
    let hue = Math.random() * 6.28;

    const frame = (now: number) => {
      raf = 0;
      if (!fluid) return;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      fluid.step(dt);
      // The smoke has faded a few seconds after the last movement: stop until the pointer returns.
      if (now - lastInput < 5000) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const init = () => {
      if (fluid || failed) return;
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(2, Math.round(r.width * dpr));
      canvas.height = Math.max(2, Math.round(r.height * dpr));
      fluid = createFluid(canvas);
      if (!fluid) {
        failed = true;
        setGlow(true);
      }
    };

    const onMove = (e: PointerEvent) => {
      init();
      const r = wrap.getBoundingClientRect();
      if (!fluid) {
        wrap.style.setProperty("--gx", `${e.clientX - r.left}px`);
        wrap.style.setProperty("--gy", `${e.clientY - r.top}px`);
        return;
      }
      const p = { x: e.clientX - r.left, y: e.clientY - r.top };
      const from = prev ?? p;
      prev = p;
      lastInput = performance.now();
      // Colour drifts between the logo's green and purple.
      // It stays on one colour for a stretch and crosses quickly, so the two don't average into grey.
      hue += 0.05;
      const t = Math.min(1, Math.max(0, 0.5 + 1.6 * Math.sin(hue)));
      const k = 0.2;
      const color: [number, number, number] = [
        (GREEN[0] + (PURPLE[0] - GREEN[0]) * t) * k,
        (GREEN[1] + (PURPLE[1] - GREEN[1]) * t) * k,
        (GREEN[2] + (PURPLE[2] - GREEN[2]) * t) * k,
      ];
      const vx = ((p.x - from.x) / r.width) * fluid.sim.w * 60;
      const vy = (-(p.y - from.y) / r.height) * fluid.sim.h * 60;
      fluid.splat(p.x / r.width, 1 - p.y / r.height, vx, vy, color);
      start();
    };
    const onLeave = () => (prev = null);

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave, { passive: true });
    // Keep the drawing sharp when the strip changes size (its shape stays the same, so the grids do too).
    const onResize = () => {
      if (!fluid) return;
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.round(r.width * dpr));
      if (w === canvas.width) return;
      canvas.width = w;
      canvas.height = Math.max(2, Math.round(r.height * dpr));
      fluid.step(0); // resizing clears the canvas: redraw it straight away
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      fluid?.destroy();
    };
  }, [reduce]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="group/fluid relative isolate overflow-hidden mix-blend-screen"
      style={{ ["--gx" as string]: "50%", ["--gy" as string]: "50%" }}
    >
      {/* Under the letters: the smoke, or the fallback glow, on the letters' resting grey */}
      <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full bg-[#1f1f1f] ${glow ? "hidden" : ""}`} />
      {glow && (
        <div className="absolute inset-0 bg-[#1f1f1f]">
          <div className="absolute inset-0 bg-[radial-gradient(22rem_14rem_at_var(--gx)_var(--gy),var(--color-green),var(--color-purple-bright)_45%,transparent_75%)] opacity-0 transition-opacity duration-500 group-hover/fluid:opacity-100" />
        </div>
      )}
      {/* The stencil: white letters on black, multiplied over the layer above */}
      {/* The padding keeps descenders (y, p) inside the stencil */}
      <p className={`relative bg-black pb-[0.14em] pt-[0.04em] text-white mix-blend-multiply ${className}`}>{text}</p>
    </div>
  );
}
