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

    const WIDTH = 1500;
    const HEIGHT = 2102;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(WIDTH, HEIGHT, false);

    const mainScene = new THREE.Scene();
    // const mainCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    const mainCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    mainCamera.position.z = 3;

    const feedbackScene = new THREE.Scene();
    const feedbackCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // const sketchTarget = new THREE.WebGLRenderTarget(
    //   canvas.width,
    //   canvas.height,
    // );
    // const targetA = new THREE.WebGLRenderTarget(canvas.width, canvas.height);
    // const targetB = new THREE.WebGLRenderTarget(canvas.width, canvas.height);
    const sketchTarget = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);
    const targetA = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);
    const targetB = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);

    /*sketch */
    const sketchGeometry = new THREE.PlaneGeometry(2, 2);
    const sketchMaterial = new THREE.ShaderMaterial({
      uniforms: {
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
      vec2 rotatePos(vec2 p, float a) {
        return p * mat2(cos(a), -sin(a), sin(a), cos(a));
      }
      void main() {
        vec2 uv = vUv;
        // uv += getOffset2(uv) * 0.1;

        vec3 finalColor = vec3(0.);
        vec2 blockUv = uv;
        uv = rotatePos(uv-0.5, -uTime * .5 + 1.57);

        for(float i = 0.; i < 3.; i++) {
          uv.x += uTime * .1;
          uv.y += uTime * 0.5;
          float size = floor(rand2(floor(uv * i/3. * 10.)) * 10.);
          blockUv = floor(uv * size) / size;

          //lightness0.1 ~0.15でかなり変化
          vec3 col = vec3(step(rand2(blockUv), .5)) * hsl2rgb(vec3(rand2(blockUv + floor(uTime * .05)), 1.0, 0.1001));
          // vec3 col = vec3(rand2(blockUv)) * vec3(0.2);
          finalColor += col;
          uv *= 1.8;
          uv = rotatePos(uv, i);
        }
        vec3 gray = vec3(rand2(blockUv)) * vec3(0.2);
        // vec3 gray = vec3((finalColor.r + finalColor.g + finalColor.b) / 3.);

        gl_FragColor = vec4(vec3(finalColor) * 1., 1.0);
      }
      `,
    });
    const sketch = new THREE.Mesh(sketchGeometry, sketchMaterial);
    mainScene.add(sketch);
    /* */

    /*monoScene*/
    const monoScene = new THREE.Scene();
    const monoGeometry = new THREE.PlaneGeometry(2, 2);
    const monoMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
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
      uniform sampler2D tDiffuse;
        uniform float uTime;
        varying vec2 vUv;

        float lumi(vec3 color) {
          return dot(color, vec3(0.3, 0.59, 0.11));
        }
        float rand1(float y) {
          return fract(sin(y * 12.9898) * 43758.5453123);
        }
        float rand2(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        vec3 hsl2rgb(vec3 hsl) {
          float h = hsl.x;
          float s = hsl.y;
          float l = hsl.z;

          vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
        }

        void main() {
          vec2 uv = vUv;
          vec4 texCol = texture2D(tDiffuse, vUv);

          float gray = pow(lumi(texCol.rgb),10.);
          float grayFloor = floor(gray *20.);
          float r = rand1(grayFloor);

          if(r > 0.5) {
            float hue = mod(grayFloor, 5.0) / 5.0;
            gl_FragColor = vec4(hsl2rgb(vec3(rand1(grayFloor),1.0, 0.6)) * 1., 1.0) ;
          } else {
          gl_FragColor = vec4(vec3(1.-step(gray, 0.01)), 1.);
            // gl_FragColor = vec4(vec3(gray), 1.);
          }


        }
      `,
    });
    const monoQuad = new THREE.Mesh(monoGeometry, monoMaterial);
    monoScene.add(monoQuad);

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

          vec2 blockUv = uv;

          vec4 currentColor = texture2D(tCurrent, uv);
          vec4 prevColor = texture2D(tPrev, uv);
          float l = pow(lumi(prevColor.rgb), .9);
          vec4 monoPrevColor = vec4((prevColor.r + prevColor.g + prevColor.b) / 3.);

          float diff = length(currentColor.rgb - prevColor.rgb);
          float mask = step(0.01, diff);

          vec4 mixColor = mix(currentColor, prevColor*0.98, diff *3.);
          vec3 finalColor = vec3((mixColor.r + mixColor.g + mixColor.b) / 3.);
          gl_FragColor = vec4(mixColor.rgb, 1.0);

        }
      `,
    });
    const feedbackSketch = new THREE.Mesh(feedbackGeometry, feedbackMaterial);
    feedbackScene.add(feedbackSketch);
    /* */

    const clock = new THREE.Clock();

    let flip = false;

    const captureImage = () => {
      // 次のフレームのレンダリング完了を待つ
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

      /*通常の出力をtCurrentにするための準備 */
      sketchMaterial.uniforms.uTime.value = clock.getElapsedTime();
      renderer.setRenderTarget(sketchTarget);
      renderer.render(mainScene, mainCamera);

      /*ここでvisualが確定する */
      feedbackMaterial.uniforms.uTime.value = clock.getElapsedTime();
      feedbackMaterial.uniforms.tCurrent.value = sketchTarget.texture;
      feedbackMaterial.uniforms.tPrev.value = readBuffer.texture;
      renderer.setRenderTarget(writeBuffer);
      renderer.render(feedbackScene, feedbackCamera);

      renderer.setRenderTarget(null);
      // renderer.render(feedbackScene, feedbackCamera);
      monoMaterial.uniforms.tDiffuse.value = writeBuffer.texture;
      monoMaterial.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(monoScene, feedbackCamera);

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
    <canvas
      // width={2480}
      // height={3508}
      ref={canvasRef}
      style={{
        display: "block",
        margin: 0,
        padding: 0,
      }}
    />
  );
}
