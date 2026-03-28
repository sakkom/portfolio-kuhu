"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MountSketch0 } from "./sketch/sketch0";
import { MountSketch1 } from "./sketch/sketch1";
import { MountSketch2 } from "./sketch/sketch2";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { RotateChar, useUnixTime } from "../portfolio/comps/RotateChar";

const FONTS = [
  '"Hiragino Mincho ProN", serif', // 細い・明朝
  '"Hiragino Kaku Gothic ProN", sans-serif', // 普通・ゴシック
  '"Yu Mincho", "游明朝", serif', // 太め・明朝
];

function setThree(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  // const aspect = 4 / 3;
  const aspect = WIDTH / HEIGHT;
  const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.background = null;
  return { scene, camera, renderer };
}

const NegaShader = {
  uniforms: {
    tDiffuse: { value: null },
    uLevel: { value: 0.0 },
    uTime: { value: 0.0 },
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
      uniform float uLevel;
      uniform float uTime;

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
      vec3 hsl2rgb(vec3 hsl) {
        float h = hsl.x;
        float s = hsl.y;
        float l = hsl.z;
        vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
      }

      void main() {
        vec2 shiftUv = vUv;
        // float size = max(rand2(floor(vUv * 10.)) * 15., 5.);
        // shiftUv += getOffset2(floor(vUv * size)) * fract(uLevel * 10.) * 2.;
        // shiftUv.x += getOffset1(floor(vUv.y * 50.) / 50.).x * fract(uLevel * 10.) * 0.5;

        float halfLevel = 1. - abs(uLevel - .5) * 2.;
        // shiftUv += getOffset2(vUv) * halfLevel * 0.01;

        // if(rand1(uLevel) > 0.95) {
        //   float size = max(rand2(floor(vUv * 10.)) * 15., 5.);
        //   // shiftUv += getOffset2(floor(vUv * size)) * fract(uLevel * 1.) * .5;
        //   shiftUv.x += getOffset1(floor(vUv.y * 300.) / 300.).x * fract(uLevel * 1.) * 0.5;
        // }
        // if(rand1(uLevel + 1.) > 0.95) {
        //   shiftUv.x += sin(shiftUv.y * 5.) * 0.1;
        //   shiftUv.y += sin(shiftUv.x * 5.) * 0.1;
        // }


        vec3 color = texture2D(tDiffuse, shiftUv).rgb;
        vec3 finalColor = mix(color, 1.0 - color, uLevel);

        vec3 color2 = color;
        float level = fract(uLevel * 0.);

        gl_FragColor = vec4(abs(level- color2), 1.0);
        // gl_FragColor = vec4(finalColor, 1.0);
      }
      `,
};

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<number>(0);
  const [isStatement, setIsStatement] = useState<boolean>(true);
  const isStatementRef = useRef<boolean>(true);
  /*statement style */
  const [stateStyle, setStateStyle] = useState<number>(0);
  /* */
  const countRef = useRef<number>(-1);
  const [sIndex, setSIndex] = useState<number>(0);
  /* */
  const [progress, setProgress] = useState<number>(0);
  const unixTime = useUnixTime();

  const sketchedStates = [
    "どくどくと流れていく",
    "私と一人",
    "動けない心は動いている",
  ];

  /*wheel logic */
  const sketchMaxIndex = 2;
  let accum = 0;
  const maxWheel = 1000;
  const handleWheel = (e: WheelEvent) => {
    // console.log(e.deltaY);
    e.preventDefault();

    if (isStatementRef.current) {
      if (e.deltaY > 0) accum += e.deltaY;

      setStateStyle(accum / maxWheel);

      if (isStatementRef.current && accum >= maxWheel) {
        isStatementRef.current = false;
        setIsStatement(false);
        accum = 0;
        countRef.current = 0;
        setSIndex(countRef.current);
        progressRef.current = 0;
        countRef.current = 0;
        return;
      }
      return;
    }

    accum += e.deltaY;

    if (!isStatementRef.current && accum >= maxWheel) {
      countRef.current++;
      if (countRef.current > sketchMaxIndex) {
        countRef.current = 0;
      }
      setSIndex(countRef.current);
      accum = 0;
    }

    if (!isStatementRef.current && accum < 0) {
      countRef.current--;
      // setSIndex(countRef.current);
      if (countRef.current < 0) {
        countRef.current = sketchMaxIndex;
      }
      setSIndex(countRef.current);
      accum = maxWheel;
    }
    // console.log({ count: count, accum: accum });
    const prog = accum / maxWheel;
    progressRef.current = prog;
    setProgress(progressRef.current);
  };
  /* */

  useEffect(() => {
    if (!canvasRef.current) return;
    const { scene, camera, renderer } = setThree(canvasRef.current);
    scene.background = new THREE.Color(0x000000);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const negaPass = new ShaderPass(NegaShader);
    composer.addPass(negaPass);

    const feedbackScene = new THREE.Scene();
    const feedbackCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const sketchTarget = new THREE.WebGLRenderTarget(
      canvasRef.current.width,
      canvasRef.current.height,
    );
    const targetA = new THREE.WebGLRenderTarget(
      canvasRef.current.width,
      canvasRef.current.height,
    );
    const targetB = new THREE.WebGLRenderTarget(
      canvasRef.current.width,
      canvasRef.current.height,
    );

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

        void main() {
          vec2 uv = vUv;

          vec2 blockUv = uv;
          blockUv.x = floor(uv.x * rand1(uv.y) * 50.);
          vec2 noiseUv = uv + getOffset2(blockUv + floorRand(uTime, 2.0)) * 0.01;

          vec4 currentColor = texture2D(tCurrent, uv);
          vec4 prevColor = texture2D(tPrev, uv);
          vec4 monoPrevColor = vec4(vec3(1.0-step(prevColor.r, 0.65)), 1.0);

          vec4 mixColor = mix(currentColor, prevColor, .95);
          gl_FragColor = mixColor;
          // vec3 color = currentColor.rgb + monoPrevColor.rgb * 0.5;
          vec3 color = currentColor.rgb + prevColor.rgb * 0.95;
          gl_FragColor = vec4(color, 1.);
          // gl_FragColor = mix(currentColor, prevColor, 0.9);
        }
      `,
    });
    const feedbackSketch = new THREE.Mesh(feedbackGeometry, feedbackMaterial);
    feedbackScene.add(feedbackSketch);

    const sketch0 = MountSketch0(scene);
    sketch0.init();
    const sketch1 = MountSketch1(scene);
    sketch1.init();
    const sketch2 = MountSketch2(scene);
    sketch2.init();

    const sketches = [sketch2, sketch1, sketch0];

    let flip = false;
    const clock = new THREE.Clock();
    const loop = () => {
      // sketch0.update();
      // sketch1.update();
      // sketch2.update();

      sketches.forEach((sketch, i) => {
        if (
          i === countRef.current ||
          i === (countRef.current + 1) % sketches.length
        ) {
          sketch.update();
        }

        if (countRef.current < 0 && i === 0) {
          sketch.setProgress(Math.pow(progressRef.current, 10));
          return;
        }
        if (i === countRef.current) {
          sketch.setProgress(1 - progressRef.current);
        } else if (i === (countRef.current + 1) % sketches.length) {
          sketch.setProgress(progressRef.current);
        } else {
          sketch.setProgress(0);
        }
      });

      // const readBuffer = flip ? targetA : targetB;
      // const writeBuffer = flip ? targetB : targetA;
      // renderer.setRenderTarget(sketchTarget);
      // renderer.render(scene, camera);
      // feedbackMaterial.uniforms.uTime.value = clock.getElapsedTime();
      // feedbackMaterial.uniforms.tCurrent.value = sketchTarget.texture;
      // feedbackMaterial.uniforms.tPrev.value = readBuffer.texture;
      // renderer.setRenderTarget(writeBuffer);
      // renderer.render(feedbackScene, feedbackCamera);

      // renderer.setRenderTarget(null);
      // renderer.render(feedbackScene, feedbackCamera);

      // renderer.render(scene, camera);
      negaPass.uniforms.uLevel.value =
        Math.abs(Math.abs(progressRef.current - 0.5) - 0.5) * 2;
      negaPass.uniforms.uTime.value = clock.getElapsedTime();
      composer.render();

      flip = !flip;
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("wheel", handleWheel, { passive: false });
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0 }} />

      {isStatement && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // width: "100%",
              }}
            >
              {String(
                "他者と自分が生み出す環境に人柄を発見した。\n人柄を媒介し心の純度に気づかされる。\n直近３つのスケッチ。レターのように宛先ができた。\nつくる。お話したい。そんな気持ちで。",
              )
                .split("\n")
                .map((line, i) => (
                  // <div key={i} style={{ display: "flex" }}>
                  //   {line.split("").map((char, j) => (
                  //     // <h1
                  //     //   key={j}
                  //     //   style={{
                  //     //     zIndex: 100,
                  //     //     opacity: Math.pow(1 - stateStyle, 10),
                  //     //     fontSize: (1 - stateStyle) * 25,
                  //     //   }}
                  //     // >
                  //     //   {char}
                  //     // </h1>
                  //     <RotateChar key={j} text={char} wheelRatio={stateStyle} />
                  //   ))}
                  // </div>
                  <RotateChar key={i} text={line} wheelRatio={stateStyle} />
                ))}
            </div>
          </div>
          {/*<div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: (Math.floor(stateStyle * 10) / 10) * 15,
              opacity: Math.pow(
                Math.abs(Math.abs(stateStyle - 0.5) - 0.5) * 2,
                1,
              ),
              fontFamily: "Hiragino Mincho ProN",
              color: "black",
            }}
          >
            <h1>{sketchedStates[2]}</h1>*/}
          {/*</div>*/}
          <div
            style={{
              position: "fixed",
              top: "80%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "15",
              fontFamily: "Hiragino Mincho ProN",
              color: "white",
            }}
          >
            please scroll
          </div>
        </>
      )}

      {sIndex >= 0 && progress >= 0.0 && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // fontSize: (Math.floor(progress * 10) / 10) * 25,
            fontSize:
              (1.0 - Math.abs(Math.floor(progress * 10) / 10 - 0.5) * 2) * 15,
            // color: "black",
            opacity: Math.abs(Math.abs(progress - 0.5) - 0.5) * 2,
          }}
        >
          {/*<h1>{sketchedStates[sIndex]}</h1>*/}
          <div
            style={{
              // backgroundColor: `hsl(${Math.random() * 360} 100% 50%)`,
              // padding: "5px",
              display: "flex",
            }}
          >
            {sketchedStates[sIndex].split("").map((char, i) => {
              const phase = unixTime;
              const fontI = Math.floor(
                (sketchedStates[sIndex].length + phase + i) % FONTS.length,
              );
              return (
                <div key={i}>
                  <div
                    style={
                      {
                        // backgroundColor: `hsl(${Math.random() * 360} 100% 50%)`,
                        // padding: "5px",
                        // display: "flex",
                      }
                    }
                  >
                    <h1
                      // key={i}
                      style={{
                        // color: `hsl(0 0% ${Math.floor((Math.sin(unixTime * 100) * 0.5 + 0.5) * 2) * 100}%)`,
                        backgroundColor: `hsl(0 0% ${(Math.sin(unixTime + i) * 0.5 + 0.5) * 100}%)`,
                        color: `hsl(0 0% ${100 - (Math.sin(unixTime + i) * 0.5 + 0.5) * 100}%)`,
                        // backgroundColor: "black",
                        // fontFamily: "Hiragino Mincho ProN",
                        fontFamily: FONTS[fontI],
                      }}
                    >
                      {char}
                    </h1>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/*<div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <button
          onClick={() => window.location.reload()}
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
        >
          reload
        </button>
      </div>*/}
    </div>
  );
}
