"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // const aspect = window.innerWidth / window.innerHeight;
    const aspect = 2480 / 3508;

    // const WIDTH = 1500;
    // const HEIGHT = 2102;
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT, true);

    const mainScene = new THREE.Scene();
    // const mainCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    const mainCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    mainCamera.position.z = 3;

    const feedbackScene = new THREE.Scene();
    const feedbackCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const sketchTarget = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);
    const targetA = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);
    const targetB = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);

    /*sketch */
    const sketchGeometry = new THREE.PlaneGeometry(2, 2);
    const sketchMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: null },
        uAspect: { value: window.innerWidth / window.innerHeight },
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
      uniform float uAspect;

      float rand2(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      vec2 getOffset2(vec2 p) {
        return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
      }
      float rand1(float y) {
        return fract(sin(y * 12.9898) * 43758.5453123);
      }
      float floorRand(float t, float speed) {
        return rand1(floor(t * speed));
      }
      vec3 hsl2rgb(vec3 hsl) {
        float h = hsl.x;
        float s = hsl.y;
        float l = hsl.z;
        vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
      }
      float lumi(vec3 color) {
        return dot(color, vec3(0.3, 0.59, 0.11));
      }
      vec2 getOffset1(float index) {
        return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
      }
      vec2 rotatePos(vec2 p, float a) {
        return p * mat2(cos(a), -sin(a), sin(a), cos(a));
      }
      vec2 lemniscate(float t, float scale) {
        float x = cos(t);
        float y = sin(t) * cos(t) * 1.0;
        return vec2(x, y) * scale;
      }
      float opSmoothUnion(float d1, float d2, float k) {
        k *= 4.0;
        float h = max(k - abs(d1 - d2), 0.0);
        return min(d1, d2) - h * h * 0.25 / k;
      }

      void main() {
        vec2 uv = vUv - .5;
        uv.x *= uAspect;

        float finalDist = 0.;
        vec3 finalColor = vec3(0.);
        bool filled = false;

        // uv += getOffset2(uv) * 0.01;

        vec2 rotateUv = rotatePos(uv, uTime);

        float loopNum = 50.;
        for(float i = 0.; i < loopNum; i++) {
          // uv += rotatePos(uv, uTime);
          vec2 blockUv = uv;
          float size = pow(max(floor(rand1(floor(blockUv.y * 10.0)) * 10.), 2.5), 2.0);
          rotateUv = rotatePos(rotateUv, (i+1.) / loopNum * 6.28);
          blockUv.y = floor(blockUv.y * size) / size;
          vec2 offset = lemniscate((uTime * 1.), max(rand1(i) * 0.5, .1));
          vec2 sinOffset = vec2(
            sin(atan(rotateUv.y, uv.x) * 5. + uTime * 1.) * 0.1,
            sin(atan(uv.y, rotateUv.x) * 5. + uTime * 1.) * 0.1
          );
          float dist = length(rotateUv - sinOffset - offset) - exp(-30.0  * (i+1.)/loopNum) * .5;
          // float dist = length(uv - sinOffset) - rand1(i+ 1.234) * 0.25;
          float line = step(abs(dist), 0.001);
          // finalDist = opSmoothUnion(finalDist, dist, 0.001);
          if(!filled && line > 0.001) {
            if(rand1(i + floor(uTime * 10.)) > 1.) {
              finalColor = line * hsl2rgb(vec3(rand1(i) * .5 + uTime*.5 , 1., 0.5));
            } else if(rand1(i) > 0.0) {
              finalColor = mod(i, 2.0) == 0.0 ? line * vec3(1.) : line * vec3(0.1);
            }
            filled = true;
          }
          blockUv *= 1.1;
        }

        // vec3 col = smoothstep(-0.05, 0.05, finalColor);

        gl_FragColor = vec4(vec3(finalColor), 1.0);
      }
      `,
    });
    const sketch = new THREE.Mesh(sketchGeometry, sketchMaterial);
    mainScene.add(sketch);

    /*feedback */
    const feedbackGeometry = new THREE.PlaneGeometry(2, 2);
    const feedbackMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tCurrent: { value: null },
        tPrev: { value: null },
        uTime: { value: null },
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
        uniform sampler2D tCurrent;
        uniform sampler2D tPrev;
        uniform float uTime;


        float rand2(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        vec2 getOffset2(vec2 p) {
          return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
        }
        float rand1(float y) {
          return fract(sin(y * 12.9898) * 43758.5453123);
        }
        float floorRand(float t, float speed) {
          return rand1(floor(t * speed));
        }
        vec3 hsl2rgb(vec3 hsl) {
          float h = hsl.x;
          float s = hsl.y;
          float l = hsl.z;

          vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
        }
        float lumi(vec3 color) {
          return dot(color, vec3(0.3, 0.59, 0.11));
        }
        vec2 getOffset1(float index) {
          return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
        }

        void main() {
          vec2 uv = vUv;

          vec2 randUv = uv + getOffset2(uv) * fract(uTime) * 0.1;
          vec2 blockUv = randUv;
          blockUv.x = floor(randUv.x * 100.) /100.;
          vec3 currentColor = texture2D(tCurrent, uv).rgb;
          vec3 prevColor = texture2D(tPrev, uv).rgb;
          vec3 stepPrev = 1.-step(prevColor, vec3(0.5));
          vec3 stepCurrent = step(currentColor, vec3(0.5));
          // vec3 color = mix(currentColor, prevColor, 0.98);
          float diff = length(currentColor - prevColor);
          // vec3 color = currentColor + prevColor * clamp(diff, 0.02, .98);
          // vec3 color = currentColor + prevColor * clamp(rand1(floor(1.-diff * 100.)), 0.9, 0.9999);
          vec3 color = mix(stepPrev * 0.95, currentColor, step(.01, length(currentColor)));
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    const feedbackSketch = new THREE.Mesh(feedbackGeometry, feedbackMaterial);
    feedbackScene.add(feedbackSketch);
    /* */

    const clock = new THREE.Clock();

    let flip = false;

    const captureImage = () => {
      requestAnimationFrame(() => {
        const link = document.createElement("a");
        link.download = `panic_gift_${Date.now()}.png`;
        link.href = canvas!.toDataURL("image/png");
        link.click();
      });
    };
    const loop = () => {
      const readBuffer = flip ? targetA : targetB;
      const writeBuffer = flip ? targetB : targetA;

      sketchMaterial.uniforms.uTime.value = clock.getElapsedTime();
      renderer.setRenderTarget(sketchTarget);
      renderer.render(mainScene, mainCamera);

      feedbackMaterial.uniforms.uTime.value = clock.getElapsedTime();
      feedbackMaterial.uniforms.tCurrent.value = sketchTarget.texture;
      feedbackMaterial.uniforms.tPrev.value = readBuffer.texture;
      renderer.setRenderTarget(writeBuffer);
      renderer.render(feedbackScene, feedbackCamera);

      renderer.setRenderTarget(null);
      renderer.render(feedbackScene, feedbackCamera);

      flip = !flip;

      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("keydown", (e) => {
      if (e.key == "s" || e.key == "S") {
        captureImage();
      }
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
}
