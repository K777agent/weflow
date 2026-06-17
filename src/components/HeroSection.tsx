"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Landmark } from "lucide-react";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("WebGL not supported, falling back to empty background.");
      return;
    }

    // Attempt to enable floating point extensions for high-precision physical math
    const halfFloat = gl.getExtension("OES_texture_half_float");
    const extType = halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;

    gl.getExtension("OES_texture_half_float_linear");
    gl.getExtension("OES_texture_float");
    gl.getExtension("OES_texture_float_linear");

    // Grid sizes (simulated at 256x256 for sharp vortices and 60 FPS performance)
    const simWidth = 256;
    const simHeight = 256;

    let width = canvas.offsetWidth || window.innerWidth;
    let height = canvas.offsetHeight || window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // 1. Shaders Setup
    const vsSource = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fsAdvect = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 uTexelSize;
      uniform float uDt;
      uniform float uDissipation;

      void main() {
        // Semi-Lagrangian advection (trace back along velocity vector)
        vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
        gl_FragColor = uDissipation * texture2D(uSource, coord);
      }
    `;

    const fsSplat = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform vec2 uPoint;
      uniform vec3 uColor;
      uniform float uRadius;
      uniform float uAspect;

      void main() {
        vec2 p = vUv - uPoint;
        p.y /= uAspect;
        vec3 splat = uColor * exp(-dot(p, p) / uRadius);
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const fsDivergence = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;

      void main() {
        // Spatial differences of velocity
        float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
        float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
        gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
      }
    `;

    const fsVorticity = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;

      void main() {
        // Compute curl (rotational velocity force)
        float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
        float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
        float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
        float curl = R - L - T + B;
        gl_FragColor = vec4(0.5 * curl, 0.0, 0.0, 1.0);
      }
    `;

    const fsVorticityConfinement = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform vec2 uTexelSize;
      uniform float uCurlStrength;
      uniform float uDt;

      void main() {
        // Gradient of curl magnitude
        float L = abs(texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x);
        float R = abs(texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x);
        float B = abs(texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x);
        float T = abs(texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x);
        float C = abs(texture2D(uCurl, vUv).x);
        
        vec2 force = vec2(R - L, T - B) * 0.5;
        float len = length(force) + 0.0001;
        // Perpendicular curl force to inject vortices
        force = vec2(force.y, -force.x) / len * C * uCurlStrength;
        
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * uDt, 0.0, 1.0);
      }
    `;

    const fsJacobi = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      uniform vec2 uTexelSize;

      void main() {
        // Resolve Poisson equation for pressure field
        float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
        float div = texture2D(uDivergence, vUv).x;
        gl_FragColor = vec4(0.25 * (L + R + B + T - div), 0.0, 0.0, 1.0);
      }
    `;

    const fsGradientSubtract = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;

      void main() {
        // Subtract pressure gradient to enforce incompressibility
        float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel - vec2(R - L, T - B) * 0.5, 0.0, 1.0);
      }
    `;

    const fsRender = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uDensity;
      uniform vec2 uTexelSize;
      uniform vec3 uColor1;
      uniform vec3 uColor2;

      void main() {
        vec3 density = texture2D(uDensity, vUv).xyz;
        
        // 3D Lighting normal approximation using spatial density gradient
        float L = length(texture2D(uDensity, vUv - vec2(uTexelSize.x, 0.0)).xyz);
        float R = length(texture2D(uDensity, vUv + vec2(uTexelSize.x, 0.0)).xyz);
        float B = length(texture2D(uDensity, vUv - vec2(0.0, uTexelSize.y)).xyz);
        float T = length(texture2D(uDensity, vUv + vec2(0.0, uTexelSize.y)).xyz);
        
        vec2 normal = vec2(R - L, T - B);
        
        // Phong Specular lighting (top-left light source)
        vec3 lightDir = normalize(vec3(-1.0, -1.0, 1.5));
        vec3 surfaceNormal = normalize(vec3(normal * 3.5, 0.15));
        float specular = pow(max(0.0, dot(surfaceNormal, lightDir)), 8.0) * 0.45;
        
        // Dynamic ink color mix
        vec3 inkColor = density.x * uColor1 + density.y * uColor2;
        float alpha = clamp(length(density), 0.0, 1.0);
        
        vec3 finalColor = inkColor + vec3(specular) * alpha;
        
        // Fade margins to blend seamlessly with page background borders
        float edgeFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x)
                       * smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);

        gl_FragColor = vec4(finalColor, alpha * edgeFade * 0.85);
      }
    `;

    // Helper compile functions
    const compileShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const linkProgram = (vsSrc: string, fsSrc: string) => {
      const vs = compileShader(gl.VERTEX_SHADER, vsSrc);
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc);
      if (!vs || !fs) return null;
      const prog = gl.createProgram();
      if (!prog) return null;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(prog));
        gl.deleteProgram(prog);
        return null;
      }
      return prog;
    };

    // Instantiate programs
    const advectProgram = linkProgram(vsSource, fsAdvect);
    const splatProgram = linkProgram(vsSource, fsSplat);
    const divergenceProgram = linkProgram(vsSource, fsDivergence);
    const vorticityProgram = linkProgram(vsSource, fsVorticity);
    const vorticityConfinementProgram = linkProgram(vsSource, fsVorticityConfinement);
    const jacobiProgram = linkProgram(vsSource, fsJacobi);
    const gradientSubtractProgram = linkProgram(vsSource, fsGradientSubtract);
    const renderProgram = linkProgram(vsSource, fsRender);

    if (
      !advectProgram || !splatProgram || !divergenceProgram || 
      !vorticityProgram || !vorticityConfinementProgram || 
      !jacobiProgram || !gradientSubtractProgram || !renderProgram
    ) {
      console.warn("Could not compile GPU fluid solver.");
      return;
    }

    // Set up full screen viewport quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const initAttribute = (program: WebGLProgram) => {
      const loc = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    // Framebuffer Object (FBO) creation helpers
    const createFBO = (w: number, h: number, type: number) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, type, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

      return { tex, fbo: framebuffer };
    };

    const createDoubleFBO = (w: number, h: number, type: number) => {
      const read = createFBO(w, h, type);
      const write = createFBO(w, h, type);
      return {
        read,
        write,
        swap() {
          const temp = this.read;
          this.read = this.write;
          this.write = temp;
        }
      };
    };

    // Create FBO grids
    const velocity = createDoubleFBO(simWidth, simHeight, extType);
    const density = createDoubleFBO(simWidth, simHeight, extType);
    const pressure = createDoubleFBO(simWidth, simHeight, extType);
    const divergence = createFBO(simWidth, simHeight, extType);
    const curl = createFBO(simWidth, simHeight, extType);

    // Mouse positions
    const mouse = {
      x: -1000,
      y: -1000,
      px: -1000,
      py: -1000,
      dx: 0,
      dy: 0,
      moved: false
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        handleMouseLeave();
        return;
      }
      const mx = e.clientX - rect.left;
      const my = rect.height - (e.clientY - rect.top);

      if (mouse.px === -1000) {
        mouse.px = mx;
        mouse.py = my;
      }

      mouse.x = mx;
      mouse.y = my;
      mouse.dx = mx - mouse.px;
      mouse.dy = my - mouse.py;
      mouse.moved = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.px = -1000;
      mouse.py = -1000;
      mouse.dx = 0;
      mouse.dy = 0;
      mouse.moved = false;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Mobile touch support
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        handleMouseLeave();
        return;
      }
      const mx = clientX - rect.left;
      const my = rect.height - (clientY - rect.top);

      if (mouse.px === -1000) {
        mouse.px = mx;
        mouse.py = my;
      }

      mouse.x = mx;
      mouse.y = my;
      mouse.dx = mx - mouse.px;
      mouse.dy = my - mouse.py;
      mouse.moved = true;
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };
    window.addEventListener("resize", handleResize);

    // Render loop variables
    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.016;

      const aspect = width / height;
      const texelSizeX = 1.0 / simWidth;
      const texelSizeY = 1.0 / simHeight;

      // 1. Advect Velocity
      gl.viewport(0, 0, simWidth, simHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.useProgram(advectProgram);
      initAttribute(advectProgram);
      gl.uniform2f(gl.getUniformLocation(advectProgram, "uTexelSize"), texelSizeX, texelSizeY);
      gl.uniform1i(gl.getUniformLocation(advectProgram, "uVelocity"), 0);
      gl.uniform1i(gl.getUniformLocation(advectProgram, "uSource"), 0);
      gl.uniform1f(gl.getUniformLocation(advectProgram, "uDt"), 0.016);
      gl.uniform1f(gl.getUniformLocation(advectProgram, "uDissipation"), 0.985); // Damping velocity slightly
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();

      // 2. Advect Density (Ink)
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.useProgram(advectProgram);
      initAttribute(advectProgram);
      gl.uniform2f(gl.getUniformLocation(advectProgram, "uTexelSize"), texelSizeX, texelSizeY);
      gl.uniform1i(gl.getUniformLocation(advectProgram, "uVelocity"), 0);
      gl.uniform1i(gl.getUniformLocation(advectProgram, "uSource"), 1);
      gl.uniform1f(gl.getUniformLocation(advectProgram, "uDt"), 0.016);
      gl.uniform1f(gl.getUniformLocation(advectProgram, "uDissipation"), 0.993); // Ink longevity
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      density.swap();

      // 3. Splat (Mouse Move Actions)
      if (mouse.moved && Math.hypot(mouse.dx, mouse.dy) > 0.01) {
        // Calculate dynamic splat radius based on canvas width to keep physical size uniform
        const baseWidth = Math.max(width, 375); // clamp to avoid division by zero or negative sizing
        const velRadius = (20.0 * 20.0) / (baseWidth * baseWidth);
        const inkRadius = (26.0 * 26.0) / (baseWidth * baseWidth);

        // Splat Velocity
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.useProgram(splatProgram);
        initAttribute(splatProgram);
        gl.uniform1i(gl.getUniformLocation(splatProgram, "uTarget"), 0);
        gl.uniform2f(gl.getUniformLocation(splatProgram, "uPoint"), mouse.x / width, mouse.y / height);
        // Force scaling multiplier
        gl.uniform3f(gl.getUniformLocation(splatProgram, "uColor"), mouse.dx * 8.0, mouse.dy * 8.0, 0.0);
        gl.uniform1f(gl.getUniformLocation(splatProgram, "uRadius"), velRadius);
        gl.uniform1f(gl.getUniformLocation(splatProgram, "uAspect"), aspect);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        velocity.swap();

        // Splat Density (Ink)
        gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
        gl.useProgram(splatProgram);
        initAttribute(splatProgram);
        gl.uniform1i(gl.getUniformLocation(splatProgram, "uTarget"), 0);
        gl.uniform2f(gl.getUniformLocation(splatProgram, "uPoint"), mouse.x / width, mouse.y / height);
        // Rotate colors over time (mixing blue and pink/magenta)
        const colorMix = Math.sin(time * 2.2) * 0.5 + 0.5;
        gl.uniform3f(gl.getUniformLocation(splatProgram, "uColor"), colorMix, 1.0 - colorMix, 0.0);
        gl.uniform1f(gl.getUniformLocation(splatProgram, "uRadius"), inkRadius);
        gl.uniform1f(gl.getUniformLocation(splatProgram, "uAspect"), aspect);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        density.swap();
      }

      // Track last positions
      if (mouse.moved) {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        mouse.moved = false;
      } else {
        mouse.dx = 0;
        mouse.dy = 0;
      }

      // 4. Compute Curl/Vorticity
      gl.bindFramebuffer(gl.FRAMEBUFFER, curl.fbo);
      gl.useProgram(vorticityProgram);
      initAttribute(vorticityProgram);
      gl.uniform2f(gl.getUniformLocation(vorticityProgram, "uTexelSize"), texelSizeX, texelSizeY);
      gl.uniform1i(gl.getUniformLocation(vorticityProgram, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // 5. Apply Vorticity Confinement
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.useProgram(vorticityConfinementProgram);
      initAttribute(vorticityConfinementProgram);
      gl.uniform2f(gl.getUniformLocation(vorticityConfinementProgram, "uTexelSize"), texelSizeX, texelSizeY);
      gl.uniform1i(gl.getUniformLocation(vorticityConfinementProgram, "uVelocity"), 0);
      gl.uniform1i(gl.getUniformLocation(vorticityConfinementProgram, "uCurl"), 1);
      gl.uniform1f(gl.getUniformLocation(vorticityConfinementProgram, "uCurlStrength"), 3.5); // Vorticity curl strength
      gl.uniform1f(gl.getUniformLocation(vorticityConfinementProgram, "uDt"), 0.016);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, curl.tex);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();

      // 6. Compute Divergence
      gl.bindFramebuffer(gl.FRAMEBUFFER, divergence.fbo);
      gl.useProgram(divergenceProgram);
      initAttribute(divergenceProgram);
      gl.uniform2f(gl.getUniformLocation(divergenceProgram, "uTexelSize"), texelSizeX, texelSizeY);
      gl.uniform1i(gl.getUniformLocation(divergenceProgram, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // 7. Solve Pressure (Jacobi Poisson Solver, 16 passes)
      gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.read.fbo);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(jacobiProgram);
      initAttribute(jacobiProgram);
      gl.uniform2f(gl.getUniformLocation(jacobiProgram, "uTexelSize"), texelSizeX, texelSizeY);
      gl.uniform1i(gl.getUniformLocation(jacobiProgram, "uDivergence"), 1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, divergence.tex);

      for (let i = 0; i < 16; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
        gl.uniform1i(gl.getUniformLocation(jacobiProgram, "uPressure"), 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        pressure.swap();
      }

      // 8. Subtract Pressure Gradient
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.useProgram(gradientSubtractProgram);
      initAttribute(gradientSubtractProgram);
      gl.uniform2f(gl.getUniformLocation(gradientSubtractProgram, "uTexelSize"), texelSizeX, texelSizeY);
      gl.uniform1i(gl.getUniformLocation(gradientSubtractProgram, "uPressure"), 0);
      gl.uniform1i(gl.getUniformLocation(gradientSubtractProgram, "uVelocity"), 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();

      // 9. Render Final Output to screen with 3D Specular Shading
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);

      gl.useProgram(renderProgram);
      initAttribute(renderProgram);
      gl.uniform2f(gl.getUniformLocation(renderProgram, "uTexelSize"), 1.0 / width, 1.0 / height);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "uDensity"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, density.read.tex);

      // Light/Dark Theme Color adaptives
      const isDark = document.documentElement.classList.contains("dark");
      const color1 = isDark ? [0.15, 0.55, 1.0] : [0.08, 0.38, 0.85];
      const color2 = isDark ? [1.0, 0.20, 0.65] : [0.85, 0.12, 0.45];

      gl.uniform3fv(gl.getUniformLocation(renderProgram, "uColor1"), new Float32Array(color1));
      gl.uniform3fv(gl.getUniformLocation(renderProgram, "uColor2"), new Float32Array(color2));

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseLeave);

      const deleteFBO = (fboObj: { tex: WebGLTexture | null; fbo: WebGLFramebuffer | null }) => {
        if (fboObj.tex) gl.deleteTexture(fboObj.tex);
        if (fboObj.fbo) gl.deleteFramebuffer(fboObj.fbo);
      };

      deleteFBO(velocity.read);
      deleteFBO(velocity.write);
      deleteFBO(density.read);
      deleteFBO(density.write);
      deleteFBO(pressure.read);
      deleteFBO(pressure.write);
      deleteFBO(divergence);
      deleteFBO(curl);

      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(advectProgram);
      gl.deleteProgram(splatProgram);
      gl.deleteProgram(divergenceProgram);
      gl.deleteProgram(vorticityProgram);
      gl.deleteProgram(vorticityConfinementProgram);
      gl.deleteProgram(jacobiProgram);
      gl.deleteProgram(gradientSubtractProgram);
      gl.deleteProgram(renderProgram);
    };
  }, []);

  return (
    <section className="isolate relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden py-16 px-4 text-center md:py-24 md:px-8">
      {/* Interactive WebGL Fluid Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 h-full w-full bg-transparent cursor-default opacity-85"
      />

      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -z-20 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-600/15 md:h-[500px] md:w-[500px]" />

      <div className="mx-auto max-w-4xl flex flex-col items-center">
        {/* Category Header */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-50/50 px-3 py-1.2 text-[10px] sm:text-xs font-bold text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 tracking-tight max-w-[95%]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
          </span>
          <span className="truncate sm:whitespace-normal">
            랜딩 & 홈페이지 제작 · 광고 운영 · 검색 노출 · 맞춤형 솔루션
          </span>
        </div>

        {/* Main Title (Scaled Typography) */}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl">
          문의로 이어지는 <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            홈페이지를 만듭니다
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base md:text-lg max-w-2xl px-2">
          홈페이지 제작부터 광고 연동·운영 관리까지 단순 제작이 아닌 
          <br className="hidden sm:inline" /> 문의 구조 설계와 검색 상단 노출 전략을 설계합니다.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-2xl px-6">
          <Link
            href="/diagnosis"
            className="flex w-full sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-blue-600 py-3 px-6 sm:py-3.5 sm:px-6 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/35 active:scale-98 dark:bg-blue-500 dark:hover:bg-blue-600 sm:shrink-0"
          >
            무료 진단 신청
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/cases"
            className="flex w-full sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 bg-white/60 py-3 px-6 sm:py-3.5 sm:px-6 text-xs sm:text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-55 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300 dark:hover:bg-gray-900/60 sm:shrink-0"
          >
            성공 사례 보기
          </Link>
          <Link
            href="/service"
            className="flex w-full sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-blue-500/25 bg-blue-50/25 py-3 px-6 sm:py-3.5 sm:px-6 text-xs sm:text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50/50 dark:border-blue-500/20 dark:bg-blue-950/10 dark:text-blue-400 dark:hover:bg-blue-950/20 sm:shrink-0"
          >
            WEFLOW 랜딩
          </Link>
        </div>

        {/* Highlight Cards (3-Box Layout, Grid system) */}
        <div className="mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 px-4">
          <div className="flex items-center gap-3.5 rounded-xl border border-gray-200/50 bg-white/60 p-4 shadow-sm transition-all dark:border-gray-700 dark:bg-gray-950/30 hover:scale-[1.02]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">CARE PLAN</p>
              <h4 className="text-xs font-bold text-gray-800 dark:text-white">제작·광고·운영 통합 케어</h4>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-gray-200/50 bg-white/60 p-4 shadow-sm transition-all dark:border-gray-700 dark:bg-gray-950/30 hover:scale-[1.02]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">SPEED</p>
              <h4 className="text-xs font-bold text-gray-800 dark:text-white">빠른 제작 (3일~7일 완료)</h4>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-gray-200/50 bg-white/60 p-4 shadow-sm transition-all dark:border-gray-700 dark:bg-gray-950/30 hover:scale-[1.02]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <Landmark className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">VALUE</p>
              <h4 className="text-xs font-bold text-gray-800 dark:text-white">합리적 비용 (가성비+퀄리티)</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
