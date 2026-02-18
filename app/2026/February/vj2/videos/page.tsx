"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
  OutputPass,
} from "three/examples/jsm/Addons.js";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const video = document.createElement("video");
    video.src = "/vj2/run3_0217.mov";
    // video.src = "/vj2/kickflip1_0217.MOV";
    // video.src = "/vj2/treflip4_0217.mov";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadedmetadata", () => {
      const vw = video.videoWidth;
      const vh = video.videoHeight;

      const WIDTH = window.innerWidth;
      const HEIGHT = window.innerHeight;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(WIDTH, HEIGHT, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const fullQuadGeo = new THREE.PlaneGeometry(2, 2);

      const sketchTarget = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);
      const feedbackTargetA = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);
      const feedbackTargetB = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.colorSpace = THREE.SRGBColorSpace;

      // ─── 1. Sketch（パススルー） ───
      const sketchScene = new THREE.Scene();
      const sketchMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          tVideo: { value: videoTexture },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform sampler2D tVideo;

          float lumi(vec3 color) {
            return dot(color, vec3(0.3, 0.59, 0.11));
          }
          float rand1(float y) {
            return fract(sin(y * 12.9898) * 43758.5453123);
          }
          float rand2(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          vec2 getOffset2(vec2 p) {
            return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
          }
          vec2 getOffset1(float index) {
            return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
          }
          void main() {
            vec3 tex = texture2D(tVideo, vUv).rgb;
            float l = lumi(1.-tex);
            gl_FragColor = vec4(vec3(pow(tex, vec3(10. * pow(l, .5)))) * pow(1.-l, .2) * 2., 1.);
          }
        `,
      });
      sketchScene.add(new THREE.Mesh(fullQuadGeo, sketchMaterial));

      // ─── 2. Feedback（パススルー） ───
      const feedbackScene = new THREE.Scene();
      const feedbackMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          tCurrent: { value: null },
          tPrev: { value: null },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform sampler2D tCurrent;
          uniform sampler2D tPrev;

          float lumi(vec3 color) {
            return dot(color, vec3(0.3, 0.59, 0.11));
          }
          void main() {
            vec3 current = texture2D(tCurrent, vUv).rgb;
            vec3 prev = texture2D(tPrev, vUv).rgb;
            // gl_FragColor = vec4(current + prev * 0.9, 1.);
            gl_FragColor = vec4(mix(current,prev ,0.9), 1.);
            // vec3 color = mix(.5-prev * 0.99, current, length(current));
            // gl_FragColor = vec4(color, 1.);
            gl_FragColor = vec4(current, 1.);
          }
        `,
      });
      feedbackScene.add(new THREE.Mesh(fullQuadGeo, feedbackMaterial));

      // ─── 3. Output + Composer（パススルー） ───
      const outputScene = new THREE.Scene();
      const outputCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const outputMaterial = new THREE.MeshBasicMaterial({ map: null });
      outputScene.add(new THREE.Mesh(fullQuadGeo, outputMaterial));

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(outputScene, outputCamera));

      const composerPass = new ShaderPass({
        uniforms: {
          tDiffuse: { value: null },
          tFeedback: { value: null },
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform sampler2D tDiffuse;
          uniform sampler2D tFeedback;
          uniform float uTime;
          float rand1(float y) {
            return fract(sin(y * 12.9898) * 43758.5453123);
          }
          float lumi(vec3 color) {
            return dot(color, vec3(0.3, 0.59, 0.11));
          }
          void main() {
            vec3 finalColor = vec3(0.);
            vec2 texUv = vUv;

            for(float i = 0.; i < 5.; i++) {
              vec3 color = texture2D(tDiffuse, texUv).rgb;
              float l = lumi(color);
              float stepL = step(l, 0.1);
              finalColor += color;
              // texUv.x += (rand1(1.-l) - 0.5) * 0.05;
              texUv.x += sin(stepL * 20.) * 0.05 + cos(stepL * 20.) * 0.05;
            }
            gl_FragColor = vec4(finalColor / 1., 1.);
          }
        `,
      });
      composer.addPass(composerPass);
      composer.addPass(new OutputPass());
      composer.renderTarget1.texture.colorSpace = THREE.SRGBColorSpace;
      composer.renderTarget2.texture.colorSpace = THREE.SRGBColorSpace;

      // ─── Loop ───
      const clock = new THREE.Clock();
      let flip = false;

      const loop = () => {
        const readBuffer = flip ? feedbackTargetA : feedbackTargetB;
        const writeBuffer = flip ? feedbackTargetB : feedbackTargetA;
        const time = clock.getElapsedTime();

        // 1. Sketch
        sketchMaterial.uniforms.uTime.value = time;
        renderer.setRenderTarget(sketchTarget);
        renderer.render(sketchScene, orthoCamera);

        // 2. Feedback
        feedbackMaterial.uniforms.uTime.value = time;
        feedbackMaterial.uniforms.tCurrent.value = sketchTarget.texture;
        feedbackMaterial.uniforms.tPrev.value = readBuffer.texture;
        renderer.setRenderTarget(writeBuffer);
        renderer.render(feedbackScene, orthoCamera);

        // 3. Output → Composer → 画面
        outputMaterial.map = writeBuffer.texture;
        composerPass.uniforms.tFeedback.value = readBuffer.texture;
        composerPass.uniforms.uTime.value = time;
        composer.render();

        flip = !flip;
        requestAnimationFrame(loop);
      };

      video.addEventListener("playing", () => loop(), { once: true });
      video.play().catch(console.error);

      window.addEventListener("keydown", (e) => {
        if (e.key === "s" || e.key === "S") {
          requestAnimationFrame(() => {
            const link = document.createElement("a");
            link.download = `capture_${Date.now()}.png`;
            link.href = canvas!.toDataURL("image/png");
            link.click();
          });
        }
      });
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", margin: 0, padding: 0 }}
    />
  );
}
