// // // // // "use client";

// // // // // import { AudioAnalyser } from "@/app/audio/util";
// // // // // import { useEffect, useRef } from "react";
// // // // // import * as THREE from "three";
// // // // // import { OrbitControls } from "three/examples/jsm/Addons.js";
// // // // // import { vj2CurveOscillator } from "./osillator4";
// // // // // import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
// // // // // import { vj2Radial } from "./projection";
// // // // // import { vj2Grid } from "./grid";

// // // // // export default function Page() {
// // // // //   const canvasRef = useRef<HTMLCanvasElement>(null);
// // // // //   const smoothBuffer = useRef(new Float32Array(256));

// // // // //   useEffect(() => {
// // // // //     if (!canvasRef.current) return;
// // // // //     const clock = new THREE.Clock();

// // // // //     const scene = new THREE.Scene();
// // // // //     const camera = new THREE.PerspectiveCamera(45, 1 / 1, 0.1, 100);
// // // // //     const renderer = new THREE.WebGLRenderer({
// // // // //       canvas: canvasRef.current,
// // // // //       antialias: true,
// // // // //     });
// // // // //     camera.position.z = 1;
// // // // //     const light = new THREE.DirectionalLight(0xffffff, 10);
// // // // //     light.position.set(0, 0, 0.01);
// // // // //     scene.add(light);
// // // // //     // const controls = new OrbitControls(camera, canvasRef.current);
// // // // //     renderer.setPixelRatio(window.devicePixelRatio);
// // // // //     renderer.setSize(window.innerWidth, window.innerHeight);

// // // // //     const sketch = vj2CurveOscillator(scene);
// // // // //     sketch.init();
// // // // //     const projection = vj2Radial(scene);
// // // // //     projection.init();
// // // // //     const grid = vj2Grid(scene);
// // // // //     grid.init();

// // // // //     const bpmDetector = BpmDetector.createBpm();
// // // // //     const audioContext = bpmDetector.init();
// // // // //     const oscillatorBuffer = new Float32Array(1024);
// // // // //     const projectionBuffer = new Float32Array(256);

// // // // //     const handleClick = async () => {
// // // // //       // const audio = new Audio("/audio/audio_clean.wav");
// // // // //       // const audio = new Audio("/audio/audio-01.mp3");
// // // // //       // const audio = new Audio(
// // // // //       //   "/audio/sample-pack-link-in-bio-dopetronic-aliens-in-my-basement-331356.mp3",
// // // // //       // );
// // // // //       const audio = new Audio("/mix/20260130_232541_E01.wav");
// // // // //       AudioAnalyser.play(audioContext.ctx, audioContext.analyser, audio, 2580);

// // // // //       let bpmCounter = 0;
// // // // //       const loop = () => {
// // // // //         const time = clock.getElapsedTime();
// // // // //         AudioAnalyser.getData(audioContext.analyser, oscillatorBuffer);
// // // // //         AudioAnalyser.getData(audioContext.analyser, projectionBuffer);
// // // // //         const bpm = bpmDetector.update(time);
// // // // //         const bpmCount = Math.floor((bpm / 60) * time);
// // // // //         const onBeat = bpm > 0 && bpmCount !== bpmCounter;
// // // // //         console.log("bpm", bpm, "bpmCount", bpmCount, "onBeat", onBeat);
// // // // //         const props = {
// // // // //           onBeat,
// // // // //           oscillatorBuffer,
// // // // //           bpmCount,
// // // // //           time: clock.getElapsedTime(),
// // // // //         };
// // // // //         if (bpmCounter !== bpmCount) {
// // // // //           bpmCounter = bpmCount;
// // // // //         }
// // // // //         // sketch.update(props);
// // // // //         // projection.update(props);
// // // // //         grid.update(props);

// // // // //         // controls.update();
// // // // //         renderer.render(scene, camera);
// // // // //         requestAnimationFrame(loop);
// // // // //       };
// // // // //       loop();
// // // // //     };
// // // // //     window.addEventListener("click", handleClick, { once: true });
// // // // //   }, []);
// // // // //   return (
// // // // //     <div
// // // // //       style={{
// // // // //         display: "flex",
// // // // //         justifyContent: "center",
// // // // //         alignItems: "center",
// // // // //         minHeight: "100vh",
// // // // //       }}
// // // // //     >
// // // // //       <canvas
// // // // //         ref={canvasRef}
// // // // //         // style={{ border: "1px solid white" }}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // "use client";
// // // // import { AudioAnalyser } from "@/app/audio/util";
// // // // import { useEffect, useRef } from "react";
// // // // import * as THREE from "three";
// // // // import { OrbitControls } from "three/examples/jsm/Addons.js";
// // // // import { vj2CurveOscillator } from "./osillator4";
// // // // import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
// // // // import { vj2Radial } from "./projection";
// // // // import { vj2Grid } from "./grid";
// // // // import { vj2Horizontal } from "./horizontal";
// // // // import { vj2CirclePacking } from "./circlePacking";
// // // // import { vj2CirclePacking2 } from "./ciclePacking2";
// // // // import { vj2SinWave } from "./sinwave";
// // // // import { vj2Smoothwave } from "./smoothwave";
// // // // import { vj2PhotoMusic } from "./photomusic";
// // // // import { vj2Sea } from "./sea";
// // // // import { vj2Matsu } from "./masu";

// // // // export default function Page() {
// // // //   const canvasRef = useRef<HTMLCanvasElement>(null);
// // // //   const smoothBuffer = useRef(new Float32Array(256));

// // // //   useEffect(() => {
// // // //     if (!canvasRef.current) return;
// // // //     const clock = new THREE.Clock();
// // // //     const WIDTH = window.innerWidth;
// // // //     const HEIGHT = window.innerHeight;
// // // //     const aspect = WIDTH / HEIGHT;

// // // //     const renderer = new THREE.WebGLRenderer({
// // // //       canvas: canvasRef.current,
// // // //       antialias: true,
// // // //     });
// // // //     renderer.setPixelRatio(window.devicePixelRatio);
// // // //     renderer.setSize(WIDTH, HEIGHT);

// // // //     // メインシーン
// // // //     const scene = new THREE.Scene();
// // // //     const camera = new THREE.OrthographicCamera(
// // // //       -aspect,
// // // //       aspect,
// // // //       1,
// // // //       -1,
// // // //       0.1,
// // // //       100,
// // // //     );
// // // //     camera.position.z = 1;
// // // //     const light = new THREE.DirectionalLight(0xffffff, 10);
// // // //     light.position.set(0, 0, 0.01);
// // // //     scene.add(light);
// // // //     // const controls = new OrbitControls(camera, canvasRef.current);

// // // //     // feedbackシーン
// // // //     const feedbackScene = new THREE.Scene();
// // // //     const feedbackCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// // // //     const dpr = renderer.getPixelRatio();
// // // //     const rtW = Math.floor(WIDTH * dpr);
// // // //     const rtH = Math.floor(HEIGHT * dpr);
// // // //     const sketchTarget = new THREE.WebGLRenderTarget(rtW, rtH);
// // // //     const targetA = new THREE.WebGLRenderTarget(rtW, rtH);
// // // //     const targetB = new THREE.WebGLRenderTarget(rtW, rtH);

// // // //     // feedbackクワッド
// // // //     const feedbackMaterial = new THREE.ShaderMaterial({
// // // //       uniforms: {
// // // //         tCurrent: { value: null },
// // // //         tPrev: { value: null },
// // // //         uTime: { value: 0 },
// // // //       },
// // // //       vertexShader: `
// // // //         varying vec2 vUv;
// // // //         void main() {
// // // //           vUv = uv;
// // // //           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// // // //         }
// // // //       `,
// // // //       fragmentShader: `
// // // //         varying vec2 vUv;
// // // //         uniform sampler2D tCurrent;
// // // //         uniform sampler2D tPrev;
// // // //         uniform float uTime;

// // // //         float rand2(vec2 p) {
// // // //           return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
// // // //         }
// // // //         vec2 getOffset2(vec2 p) {
// // // //           return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
// // // //         }
// // // //         float rand1(float y) {
// // // //           return fract(sin(y * 12.9898) * 43758.5453123);
// // // //         }
// // // //         float floorRand(float t, float speed) {
// // // //           return rand1(floor(t * speed));
// // // //         }
// // // //         vec3 hsl2rgb(vec3 hsl) {
// // // //           float h = hsl.x;
// // // //           float s = hsl.y;
// // // //           float l = hsl.z;
// // // //           vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
// // // //           return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
// // // //         }
// // // //         float lumi(vec3 color) {
// // // //           return dot(color, vec3(0.3, 0.59, 0.11));
// // // //         }
// // // //         vec2 getOffset1(float index) {
// // // //           return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
// // // //         }
// // // //         vec2 rotatePos(vec2 p, float a) {
// // // //           return p * mat2(cos(a), -sin(a), sin(a), cos(a));
// // // //         }

// // // //         void main() {
// // // //           vec2 uv = vUv;

// // // //           float caos = sin(uTime * 0.5) * 0.5 + 0.5;

// // // //           vec3 current = texture2D(tCurrent, uv).rgb;
// // // //           vec3 prev = texture2D(tPrev, uv).rgb;

// // // //           vec2 blockUv = floor(uv * 100.) / 100.;
// // // //           vec2 noiseUv = uv + getOffset2(blockUv) * 0.01;
// // // //           vec3 noisePrev = texture2D(tPrev, noiseUv).rgb;
// // // //           vec3 color = current + noisePrev * clamp(length(noisePrev), 0.97, 0.99);
// // // //           // color  += mix((caos-prev) * 0.9999, current, step(0.01, length(current)));
// // // //           vec3 color1  = mix(prev, current, step(0.5, length(current)));
// // // //           // gl_FragColor = vec4(color1, 1.0);
// // // //           gl_FragColor = vec4(current, 1.0);
// // // //         }
// // // //       `,
// // // //     });
// // // //     const feedbackQuad = new THREE.Mesh(
// // // //       new THREE.PlaneGeometry(2, 2),
// // // //       feedbackMaterial,
// // // //     );
// // // //     feedbackScene.add(feedbackQuad);

// // // //     // スケッチ
// // // //     const sketch = vj2CurveOscillator(scene);
// // // //     sketch.init();
// // // //     const projection = vj2Radial(scene);
// // // //     projection.init();
// // // //     const grid = vj2Grid(scene);
// // // //     // grid.init();
// // // //     const horizontal = vj2Horizontal(scene);
// // // //     horizontal.init();
// // // //     const circlePacking = vj2CirclePacking(scene);
// // // //     circlePacking.init();
// // // //     const circlePacking2 = vj2CirclePacking2(scene);
// // // //     circlePacking2.init();
// // // //     const sinWave = vj2SinWave(scene);
// // // //     sinWave.init();
// // // //     const smoothwave = vj2Smoothwave(scene);
// // // //     smoothwave.init();
// // // //     const photoMusic = vj2PhotoMusic(scene);
// // // //     photoMusic.init();
// // // //     const sea = vj2Sea(scene);
// // // //     // sea.init();
// // // //     const matsu = vj2Matsu(scene);
// // // //     // matsu.init();

// // // //     const bpmDetector = BpmDetector.createBpm();
// // // //     const audioContext = bpmDetector.init();
// // // //     const oscillatorBuffer = new Float32Array(1024);
// // // //     const projectionBuffer = new Float32Array(256);

// // // //     let flip = false;

// // // //     const handleClick = async () => {
// // // //       // const audio = new Audio("/audio/audio_clean.wav");
// // // //       // const audio = new Audio("/audio/audio-01.mp3");
// // // //       // const audio = new Audio(
// // // //       //   "/audio/sample-pack-link-in-bio-dopetronic-aliens-in-my-basement-331356.mp3",
// // // //       // );
// // // //       const audio = new Audio("/mix/20260130_232541_E01.wav");
// // // //       AudioAnalyser.play(
// // // //         audioContext.ctx,
// // // //         audioContext.analyser,
// // // //         audio,
// // // //         Math.floor(Math.random() * 3000),
// // // //       );

// // // //       let bpmCounter = 0;

// // // //       const loop = () => {
// // // //         const time = clock.getElapsedTime();
// // // //         AudioAnalyser.getData(audioContext.analyser, oscillatorBuffer);
// // // //         AudioAnalyser.getData(audioContext.analyser, projectionBuffer);

// // // //         const bpm = bpmDetector.update(time);
// // // //         const bpmCount = Math.floor((bpm / 60) * time);
// // // //         const onBeat = bpm > 0 && bpmCount !== bpmCounter;
// // // //         console.log("bpm", bpm, "bpmCount", bpmCount, "onBeat", onBeat);

// // // //         if (bpmCounter !== bpmCount) bpmCounter = bpmCount;

// // // //         const props = {
// // // //           onBeat,
// // // //           oscillatorBuffer,
// // // //           projectionBuffer,
// // // //           bpmCount,
// // // //           time,
// // // //           bpm,
// // // //         };

// // // //         photoMusic.update(props);

// // // //         sketch.update(props);
// // // //         // projection.update(props);
// // // //         // grid.update(props);
// // // //         // horizontal.update(props);
// // // //         // circlePacking.update(props);
// // // //         // circlePacking2.update(props); //normal
// // // //         // smoothwave.update(props);
// // // //         // sinWave.update(props);
// // // //         // sea.update(props);
// // // //         // matsu.update(props);

// // // //         // controls.update();

// // // //         const readBuffer = flip ? targetA : targetB;
// // // //         const writeBuffer = flip ? targetB : targetA;

// // // //         // 1. スケッチをレンダー
// // // //         renderer.setRenderTarget(sketchTarget);
// // // //         renderer.render(scene, camera);

// // // //         // 2. feedback合成
// // // //         feedbackMaterial.uniforms.uTime.value = time;
// // // //         feedbackMaterial.uniforms.tCurrent.value = sketchTarget.texture;
// // // //         feedbackMaterial.uniforms.tPrev.value = readBuffer.texture;
// // // //         renderer.setRenderTarget(writeBuffer);
// // // //         renderer.render(feedbackScene, feedbackCamera);

// // // //         // 3. 画面に出力
// // // //         renderer.setRenderTarget(null);
// // // //         renderer.render(feedbackScene, feedbackCamera);

// // // //         flip = !flip;
// // // //         requestAnimationFrame(loop);
// // // //       };
// // // //       loop();
// // // //     };

// // // //     window.addEventListener("click", handleClick, { once: true });
// // // //   }, []);

// // // //   return (
// // // //     <div
// // // //       style={{
// // // //         display: "flex",
// // // //         justifyContent: "center",
// // // //         alignItems: "center",
// // // //         minHeight: "100vh",
// // // //       }}
// // // //     >
// // // //       <canvas ref={canvasRef} />
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";
// // // import { AudioAnalyser } from "@/app/audio/util";
// // // import { useEffect, useRef } from "react";
// // // import * as THREE from "three";
// // // import {
// // //   EffectComposer,
// // //   RenderPass,
// // //   ShaderPass,
// // //   OutputPass,
// // // } from "three/examples/jsm/Addons.js";
// // // import { vj2CurveOscillator } from "./osillator4";
// // // import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
// // // import { vj2Radial } from "./projection";
// // // import { vj2Grid } from "./grid";
// // // import { vj2Horizontal } from "./horizontal";
// // // import { vj2CirclePacking2 } from "./ciclePacking2";
// // // import { vj2SinWave } from "./sinwave";
// // // import { vj2Smoothwave } from "./smoothwave";
// // // import { vj2PhotoMusic } from "./photomusic";
// // // import { vj2Sea } from "./sea";
// // // import { vj2Matsu } from "./masu";
// // // import { NegaShader } from "@/app/vj/vol1/postProcessing/negaPos";

// // // interface Scene {
// // //   sketch: {
// // //     mesh: THREE.Object3D;
// // //     init: () => void;
// // //     update: (props: any) => void;
// // //   };
// // //   pad: number;
// // //   active: boolean;
// // // }

// // // export default function Page() {
// // //   const canvasRef = useRef<HTMLCanvasElement>(null);

// // //   useEffect(() => {
// // //     if (!canvasRef.current) return;
// // //     const clock = new THREE.Clock();
// // //     const WIDTH = window.innerWidth;
// // //     const HEIGHT = window.innerHeight;
// // //     const aspect = WIDTH / HEIGHT;

// // //     const renderer = new THREE.WebGLRenderer({
// // //       canvas: canvasRef.current,
// // //       antialias: true,
// // //     });
// // //     renderer.setPixelRatio(window.devicePixelRatio);
// // //     renderer.setSize(WIDTH, HEIGHT);

// // //     const scene = new THREE.Scene();
// // //     scene.background = new THREE.Color(0x000000);
// // //     const camera = new THREE.OrthographicCamera(
// // //       -aspect,
// // //       aspect,
// // //       1,
// // //       -1,
// // //       0.1,
// // //       100,
// // //     );
// // //     camera.position.z = 1;
// // //     const light = new THREE.DirectionalLight(0xffffff, 10);
// // //     light.position.set(0, 0, 0.01);
// // //     scene.add(light);

// // //     // feedback
// // //     const feedbackScene = new THREE.Scene();
// // //     const feedbackCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
// // //     const dpr = renderer.getPixelRatio();
// // //     const rtW = Math.floor(WIDTH * dpr);
// // //     const rtH = Math.floor(HEIGHT * dpr);
// // //     const sketchTarget = new THREE.WebGLRenderTarget(rtW, rtH);
// // //     const targetA = new THREE.WebGLRenderTarget(rtW, rtH);
// // //     const targetB = new THREE.WebGLRenderTarget(rtW, rtH);

// // //     const feedbackMaterial = new THREE.ShaderMaterial({
// // //       uniforms: {
// // //         tCurrent: { value: null },
// // //         tPrev: { value: null },
// // //         uTime: { value: 0 },
// // //         uLevel0: { value: 0.0 },
// // //         uLevel1: { value: 0.0 },
// // //         uLevel2: { value: 0.0 },
// // //         uNega: { value: 0.0 },
// // //       },
// // //       vertexShader: `
// // //         varying vec2 vUv;
// // //         void main() {
// // //           vUv = uv;
// // //           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// // //         }
// // //       `,
// // //       fragmentShader: `
// // //         varying vec2 vUv;
// // //         uniform sampler2D tCurrent;
// // //         uniform sampler2D tPrev;
// // //         uniform float uTime;
// // //         uniform float uLevel0;
// // //         uniform float uLevel1;
// // //         uniform float uLevel2;
// // //         uniform float uNega;

// // //         float rand2(vec2 p) {
// // //           return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
// // //         }
// // //         vec2 getOffset2(vec2 p) {
// // //           return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
// // //         }
// // //         float rand1(float y) {
// // //           return fract(sin(y * 12.9898) * 43758.5453123);
// // //         }
// // //         float floorRand(float t, float speed) {
// // //           return rand1(floor(t * speed));
// // //         }
// // //         vec3 hsl2rgb(vec3 hsl) {
// // //           float h = hsl.x;
// // //           float s = hsl.y;
// // //           float l = hsl.z;
// // //           vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
// // //           return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
// // //         }
// // //         float lumi(vec3 color) {
// // //           return dot(color, vec3(0.3, 0.59, 0.11));
// // //         }
// // //         vec2 getOffset1(float index) {
// // //           return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
// // //         }
// // //         vec2 rotatePos(vec2 p, float a) {
// // //           return p * mat2(cos(a), -sin(a), sin(a), cos(a));
// // //         }

// // //         void main() {
// // //           vec2 uv = vUv;
// // //           vec3 current = texture2D(tCurrent, uv).rgb;
// // //           vec3 prev = texture2D(tPrev, uv).rgb;

// // //           vec2 blockUv = floor(uv * 100.) / 100.;
// // //           vec2 noiseUv = uv + getOffset2(blockUv) * 0.01;
// // //           vec3 noisePrev = texture2D(tPrev, noiseUv).rgb;

// // //           vec3 color = current + noisePrev * clamp(length(noisePrev), 0.97, 0.99);
// // //           vec3 color1 = mix(prev, current, step(0.5, length(current)));
// // //           vec3 colorCaos = mix((uLevel2 - prev) * 0.9999, current, step(0.8, length(current)));

// // //           vec3 result = current;
// // //           result = mix(result, color, uLevel0);
// // //           result = mix(result, color1, uLevel1);
// // //           result += colorCaos * uLevel2;

// // //           result = mix(result, 1.0 - result, uNega);
// // //           gl_FragColor = vec4(result, 1.0);
// // //         }
// // //       `,
// // //     });
// // //     feedbackScene.add(
// // //       new THREE.Mesh(new THREE.PlaneGeometry(2, 2), feedbackMaterial),
// // //     );

// // //     // composer - feedbackSceneを直接通す
// // //     const composer = new EffectComposer(renderer);
// // //     composer.setPixelRatio(window.devicePixelRatio);
// // //     composer.setSize(WIDTH, HEIGHT);
// // //     const renderPass = new RenderPass(feedbackScene, feedbackCamera);
// // //     composer.addPass(renderPass);
// // //     const negaPass = new ShaderPass(NegaShader);
// // //     composer.addPass(negaPass);
// // //     const outputPass = new OutputPass();
// // //     composer.addPass(outputPass);

// // //     // シーン初期化
// // //     const oscillator = vj2CurveOscillator(scene);
// // //     const photoMusic = vj2PhotoMusic(scene);
// // //     const horizontal = vj2Horizontal(scene);
// // //     const circlePacking2 = vj2CirclePacking2(scene);
// // //     const sinWave = vj2SinWave(scene);
// // //     const smoothwave = vj2Smoothwave(scene);
// // //     const projection = vj2Radial(scene);
// // //     const sea = vj2Sea(scene);
// // //     const matsu = vj2Matsu(scene);
// // //     const grid = vj2Grid(scene);

// // //     const scenes: Scene[] = [
// // //       { sketch: sea, pad: 36, active: false },
// // //       { sketch: horizontal, pad: 37, active: false },
// // //       { sketch: grid, pad: 38, active: false },
// // //       { sketch: matsu, pad: 39, active: false },
// // //       { sketch: circlePacking2, pad: 40, active: false },
// // //       { sketch: oscillator, pad: 41, active: false },
// // //       { sketch: smoothwave, pad: 42, active: false },
// // //       { sketch: sinWave, pad: 43, active: false },
// // //       { sketch: photoMusic, pad: 44, active: false },
// // //       { sketch: projection, pad: 45, active: false },
// // //     ];

// // //     scenes.forEach((s) => {
// // //       s.sketch.init();
// // //       s.sketch.mesh.visible = false;
// // //     });

// // //     // MIDI
// // //     navigator.requestMIDIAccess().then((access) => {
// // //       access.inputs.forEach((input) => {
// // //         console.log("MIDI input:", input.name);
// // //         input.onmidimessage = (m) => {
// // //           if (!m.data) return;
// // //           const [status, note, value] = m.data;
// // //           // パッド
// // //           if (status === 153) {
// // //             const target = scenes.find((s) => s.pad === note);
// // //             if (target) {
// // //               target.active = !target.active;
// // //               target.sketch.mesh.visible = target.active;
// // //               console.log(`pad ${note}: ${target.active ? "ON" : "OFF"}`);
// // //             }
// // //           }
// // //           // ノブ
// // //           if (status === 176) {
// // //             const level = value / 127;
// // //             if (note === 3) feedbackMaterial.uniforms.uLevel0.value = level;
// // //             if (note === 9) feedbackMaterial.uniforms.uLevel1.value = level;
// // //             if (note === 12) feedbackMaterial.uniforms.uLevel2.value = level;
// // //             if (note === 13) {
// // //               negaPass.uniforms.uLevel.value = level;
// // //               feedbackMaterial.uniforms.uNega.value = level;
// // //             }
// // //           }
// // //         };
// // //       });
// // //     });

// // //     // BPM & audio
// // //     const bpmDetector = BpmDetector.createBpm();
// // //     const audioContext = bpmDetector.init();
// // //     const oscillatorBuffer = new Float32Array(1024);
// // //     const projectionBuffer = new Float32Array(256);

// // //     let flip = false;

// // //     const handleClick = async () => {
// // //       const audio = new Audio("/mix/20260130_232541_E01.wav");
// // //       AudioAnalyser.play(
// // //         audioContext.ctx,
// // //         audioContext.analyser,
// // //         audio,
// // //         Math.floor(Math.random() * 3000),
// // //       );

// // //       let bpmCounter = 0;

// // //       const loop = () => {
// // //         const time = clock.getElapsedTime();
// // //         AudioAnalyser.getData(audioContext.analyser, oscillatorBuffer);
// // //         AudioAnalyser.getData(audioContext.analyser, projectionBuffer);

// // //         const bpm = bpmDetector.update(time);
// // //         const bpmCount = Math.floor((bpm / 60) * time);
// // //         const onBeat = bpm > 0 && bpmCount !== bpmCounter;
// // //         if (bpmCounter !== bpmCount) bpmCounter = bpmCount;

// // //         const props = {
// // //           onBeat,
// // //           oscillatorBuffer,
// // //           projectionBuffer,
// // //           bpmCount,
// // //           time,
// // //           bpm,
// // //         };

// // //         scenes.forEach((s) => {
// // //           if (s.active) s.sketch.update(props);
// // //         });

// // //         // feedback render
// // //         const readBuffer = flip ? targetA : targetB;
// // //         const writeBuffer = flip ? targetB : targetA;

// // //         renderer.setRenderTarget(sketchTarget);
// // //         renderer.render(scene, camera);

// // //         feedbackMaterial.uniforms.uTime.value = time;
// // //         feedbackMaterial.uniforms.tCurrent.value = sketchTarget.texture;
// // //         feedbackMaterial.uniforms.tPrev.value = readBuffer.texture;
// // //         renderer.setRenderTarget(writeBuffer);
// // //         renderer.render(feedbackScene, feedbackCamera);

// // //         // composerに渡すときはtPrevを変えない
// // //         feedbackMaterial.uniforms.tCurrent.value = writeBuffer.texture;
// // //         composer.render();

// // //         flip = !flip;
// // //         flip = !flip;
// // //         requestAnimationFrame(loop);
// // //       };
// // //       loop();
// // //     };

// // //     window.addEventListener("click", handleClick, { once: true });
// // //   }, []);

// // //   return (
// // //     <div
// // //       style={{
// // //         display: "flex",
// // //         justifyContent: "center",
// // //         alignItems: "center",
// // //         minHeight: "100vh",
// // //       }}
// // //     >
// // //       <canvas ref={canvasRef} />
// // //     </div>
// // //   );
// // // }
// // "use client";
// // import { AudioAnalyser } from "@/app/audio/util";
// // import { useEffect, useRef } from "react";
// // import * as THREE from "three";
// // import { vj2CurveOscillator } from "./osillator4";
// // import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
// // import { vj2Radial } from "./projection";
// // import { vj2Grid } from "./grid";
// // import { vj2Horizontal } from "./horizontal";
// // import { vj2CirclePacking2 } from "./ciclePacking2";
// // import { vj2SinWave } from "./sinwave";
// // import { vj2Smoothwave } from "./smoothwave";
// // import { vj2PhotoMusic } from "./photomusic";
// // import { vj2Sea } from "./sea";
// // import { vj2Matsu } from "./masu";

// // interface Scene {
// //   sketch: {
// //     mesh: THREE.Object3D;
// //     init: () => void;
// //     update: (props: any) => void;
// //   };
// //   pad: number;
// //   active: boolean;
// // }

// // export default function Page() {
// //   const canvasRef = useRef<HTMLCanvasElement>(null);

// //   useEffect(() => {
// //     if (!canvasRef.current) return;
// //     const clock = new THREE.Clock();
// //     const WIDTH = window.innerWidth;
// //     const HEIGHT = window.innerHeight;
// //     const aspect = WIDTH / HEIGHT;

// //     const renderer = new THREE.WebGLRenderer({
// //       canvas: canvasRef.current,
// //       antialias: true,
// //     });
// //     renderer.setPixelRatio(window.devicePixelRatio);
// //     renderer.setSize(WIDTH, HEIGHT);

// //     // メインシーン
// //     const scene = new THREE.Scene();
// //     const camera = new THREE.OrthographicCamera(
// //       -aspect,
// //       aspect,
// //       1,
// //       -1,
// //       0.1,
// //       100,
// //     );
// //     camera.position.z = 1;
// //     const light = new THREE.DirectionalLight(0xffffff, 10);
// //     light.position.set(0, 0, 0.01);
// //     scene.add(light);

// //     // feedbackシーン
// //     const feedbackScene = new THREE.Scene();
// //     const feedbackCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// //     const dpr = renderer.getPixelRatio();
// //     const rtW = Math.floor(WIDTH * dpr);
// //     const rtH = Math.floor(HEIGHT * dpr);
// //     const sketchTarget = new THREE.WebGLRenderTarget(rtW, rtH);
// //     const targetA = new THREE.WebGLRenderTarget(rtW, rtH);
// //     const targetB = new THREE.WebGLRenderTarget(rtW, rtH);

// //     // feedbackクワッド
// //     const feedbackMaterial = new THREE.ShaderMaterial({
// //       uniforms: {
// //         tCurrent: { value: null },
// //         tPrev: { value: null },
// //         uTime: { value: 0 },
// //         uLevel0: { value: 0.0 },
// //         uLevel1: { value: 0.0 },
// //         uLevel2: { value: 0.0 },
// //       },
// //       vertexShader: `
// //         varying vec2 vUv;
// //         void main() {
// //           vUv = uv;
// //           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// //         }
// //       `,
// //       fragmentShader: `
// //         varying vec2 vUv;
// //         uniform sampler2D tCurrent;
// //         uniform sampler2D tPrev;
// //         uniform float uTime;
// //         uniform float uLevel0;
// //         uniform float uLevel1;
// //         uniform float uLevel2;

// //         float rand2(vec2 p) {
// //           return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
// //         }
// //         vec2 getOffset2(vec2 p) {
// //           return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
// //         }
// //         float rand1(float y) {
// //           return fract(sin(y * 12.9898) * 43758.5453123);
// //         }
// //         float floorRand(float t, float speed) {
// //           return rand1(floor(t * speed));
// //         }
// //         vec3 hsl2rgb(vec3 hsl) {
// //           float h = hsl.x;
// //           float s = hsl.y;
// //           float l = hsl.z;
// //           vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
// //           return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
// //         }
// //         float lumi(vec3 color) {
// //           return dot(color, vec3(0.3, 0.59, 0.11));
// //         }
// //         vec2 getOffset1(float index) {
// //           return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
// //         }
// //         vec2 rotatePos(vec2 p, float a) {
// //           return p * mat2(cos(a), -sin(a), sin(a), cos(a));
// //         }

// //         void main() {
// //           vec2 uv = vUv;

// //           // float caos = sin(uTime * 0.5) * 0.5 + 0.5;

// //           vec3 current = texture2D(tCurrent, uv).rgb;
// //           vec3 prev = texture2D(tPrev, uv).rgb;

// //           vec2 blockUv = floor(uv * 100.) / 100.;
// //           vec2 noiseUv = uv + getOffset2(blockUv) * 0.01;
// //           vec3 noisePrev = texture2D(tPrev, noiseUv).rgb;
// //           vec3 color = current + noisePrev * clamp(length(noisePrev), 0.97, 0.99);
// //           vec3 color1 = mix(prev, current, step(0.5, length(current)));
// //           vec3 colorCaos = mix((uLevel2 - prev) * 0.9999, current, step(0.8, length(current)));

// //           vec3 result = current;
// //           result = mix(result, color, uLevel0);
// //           result = mix(result, color1, uLevel1);
// //           result += colorCaos * uLevel2;

// //           gl_FragColor = vec4(result, 1.0);
// //         }
// //       `,
// //     });
// //     const feedbackQuad = new THREE.Mesh(
// //       new THREE.PlaneGeometry(2, 2),
// //       feedbackMaterial,
// //     );
// //     feedbackScene.add(feedbackQuad);

// //     // 出力用シーン（nega/posi）
// //     const outputScene = new THREE.Scene();
// //     const outputCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
// //     const outputMaterial = new THREE.ShaderMaterial({
// //       uniforms: {
// //         tInput: { value: null },
// //         uNega: { value: 0.0 },
// //       },
// //       vertexShader: `
// //         varying vec2 vUv;
// //         void main() {
// //           vUv = uv;
// //           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// //         }
// //       `,
// //       fragmentShader: `
// //         varying vec2 vUv;
// //         uniform sampler2D tInput;
// //         uniform float uNega;
// //         void main() {
// //           vec3 color = texture2D(tInput, vUv).rgb;
// //           gl_FragColor = vec4(mix(color, 1.0 - color, uNega), 1.0);
// //         }
// //       `,
// //     });
// //     outputScene.add(
// //       new THREE.Mesh(new THREE.PlaneGeometry(2, 2), outputMaterial),
// //     );

// //     // シーン初期化
// //     const oscillator = vj2CurveOscillator(scene);
// //     const photoMusic = vj2PhotoMusic(scene);
// //     const horizontal = vj2Horizontal(scene);
// //     const circlePacking2 = vj2CirclePacking2(scene);
// //     const sinWave = vj2SinWave(scene);
// //     const smoothwave = vj2Smoothwave(scene);
// //     const projection = vj2Radial(scene);
// //     const sea = vj2Sea(scene);
// //     const matsu = vj2Matsu(scene);
// //     const grid = vj2Grid(scene);

// //     const scenes: Scene[] = [
// //       { sketch: sea, pad: 36, active: false },
// //       { sketch: horizontal, pad: 37, active: false },
// //       { sketch: grid, pad: 38, active: false },
// //       { sketch: matsu, pad: 39, active: false },
// //       { sketch: circlePacking2, pad: 40, active: false },
// //       { sketch: oscillator, pad: 41, active: false },
// //       { sketch: smoothwave, pad: 42, active: false },
// //       { sketch: sinWave, pad: 43, active: false },
// //       { sketch: photoMusic, pad: 44, active: false },
// //       { sketch: projection, pad: 45, active: false },
// //     ];

// //     scenes.forEach((s) => {
// //       s.sketch.init();
// //       s.sketch.mesh.visible = false;
// //     });

// //     // MIDI
// //     navigator.requestMIDIAccess().then((access) => {
// //       access.inputs.forEach((input) => {
// //         console.log("MIDI input:", input.name);
// //         input.onmidimessage = (m) => {
// //           if (!m.data) return;
// //           const [status, note, value] = m.data;
// //           // パッド
// //           if (status === 153) {
// //             const target = scenes.find((s) => s.pad === note);
// //             if (target) {
// //               target.active = !target.active;
// //               target.sketch.mesh.visible = target.active;
// //               console.log(`pad ${note}: ${target.active ? "ON" : "OFF"}`);
// //             }
// //           }
// //           // ノブ
// //           if (status === 176) {
// //             const level = value / 127;
// //             if (note === 3) feedbackMaterial.uniforms.uLevel0.value = level;
// //             if (note === 9) feedbackMaterial.uniforms.uLevel1.value = level;
// //             if (note === 12) feedbackMaterial.uniforms.uLevel2.value = level;
// //             if (note === 13) outputMaterial.uniforms.uNega.value = level;
// //           }
// //         };
// //       });
// //     });

// //     const bpmDetector = BpmDetector.createBpm();
// //     const audioContext = bpmDetector.init();
// //     const oscillatorBuffer = new Float32Array(1024);
// //     const projectionBuffer = new Float32Array(256);

// //     let flip = false;

// //     const handleClick = async () => {
// //       const audio = new Audio("/mix/20260130_232541_E01.wav");
// //       AudioAnalyser.play(
// //         audioContext.ctx,
// //         audioContext.analyser,
// //         audio,
// //         Math.floor(Math.random() * 3000),
// //       );

// //       let bpmCounter = 0;

// //       const loop = () => {
// //         const time = clock.getElapsedTime();
// //         AudioAnalyser.getData(audioContext.analyser, oscillatorBuffer);
// //         AudioAnalyser.getData(audioContext.analyser, projectionBuffer);

// //         const bpm = bpmDetector.update(time);
// //         const bpmCount = Math.floor((bpm / 60) * time);
// //         const onBeat = bpm > 0 && bpmCount !== bpmCounter;
// //         if (bpmCounter !== bpmCount) bpmCounter = bpmCount;

// //         const props = {
// //           onBeat,
// //           oscillatorBuffer,
// //           projectionBuffer,
// //           bpmCount,
// //           time,
// //           bpm,
// //         };

// //         scenes.forEach((s) => {
// //           if (s.active) s.sketch.update(props);
// //         });

// //         const readBuffer = flip ? targetA : targetB;
// //         const writeBuffer = flip ? targetB : targetA;

// //         // 1. スケッチをレンダー
// //         renderer.setRenderTarget(sketchTarget);
// //         renderer.render(scene, camera);

// //         // 2. feedback合成
// //         feedbackMaterial.uniforms.uTime.value = time;
// //         feedbackMaterial.uniforms.tCurrent.value = sketchTarget.texture;
// //         feedbackMaterial.uniforms.tPrev.value = readBuffer.texture;
// //         renderer.setRenderTarget(writeBuffer);
// //         renderer.render(feedbackScene, feedbackCamera);

// //         // 3. 画面に出力
// //         renderer.setRenderTarget(null);
// //         renderer.render(feedbackScene, feedbackCamera);

// //         flip = !flip;

// //         // flip = !flip;
// //         requestAnimationFrame(loop);
// //       };
// //       loop();
// //     };

// //     window.addEventListener("click", handleClick, { once: true });
// //   }, []);

// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         justifyContent: "center",
// //         alignItems: "center",
// //         minHeight: "100vh",
// //       }}
// //     >
// //       <canvas ref={canvasRef} />
// //     </div>
// //   );
// // }

// "use client";
// import { AudioAnalyser } from "@/app/audio/util";
// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import {
//   EffectComposer,
//   RenderPass,
//   ShaderPass,
//   OutputPass,
//   AfterimagePass,
//   UnrealBloomPass,
// } from "three/examples/jsm/Addons.js";
// import { vj2CurveOscillator } from "./osillator4";
// import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
// import { vj2Radial } from "./projection";
// import { vj2Grid } from "./grid";
// import { vj2Horizontal } from "./horizontal";
// import { vj2CirclePacking2 } from "./ciclePacking2";
// import { vj2SinWave } from "./sinwave";
// import { vj2Smoothwave } from "./smoothwave";
// import { vj2PhotoMusic } from "./photomusic";
// import { vj2Sea } from "./sea";
// import { vj2Matsu } from "./masu";
// import { NegaShader } from "@/app/vj/vol1/postProcessing/negaPos";
// import { v1Glitch0 } from "@/app/vj/vol1/postProcessing/glitchVj1";
// import { ColorShader } from "@/app/vj/vol1/postProcessing/colorShader";

// interface Scene {
//   sketch: {
//     mesh: THREE.Object3D;
//     init: () => void;
//     update: (props: any) => void;
//   };
//   pad: number;
//   active: boolean;
// }

// export default function Page() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;
//     const clock = new THREE.Clock();
//     const WIDTH = window.innerWidth;
//     const HEIGHT = window.innerHeight;
//     const aspect = WIDTH / HEIGHT;

//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current,
//       antialias: true,
//     });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(WIDTH, HEIGHT);

//     // メインシーン
//     const scene = new THREE.Scene();
//     const camera = new THREE.OrthographicCamera(
//       -aspect,
//       aspect,
//       1,
//       -1,
//       0.1,
//       100,
//     );
//     camera.position.z = 1;
//     const light = new THREE.DirectionalLight(0xffffff, 10);
//     light.position.set(0, 0, 0.01);
//     scene.add(light);

//     // feedbackシーン
//     const feedbackScene = new THREE.Scene();
//     const feedbackCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

//     const dpr = renderer.getPixelRatio();
//     const rtW = Math.floor(WIDTH * dpr);
//     const rtH = Math.floor(HEIGHT * dpr);
//     const sketchTarget = new THREE.WebGLRenderTarget(rtW, rtH);
//     const targetA = new THREE.WebGLRenderTarget(rtW, rtH);
//     const targetB = new THREE.WebGLRenderTarget(rtW, rtH);

//     // feedbackクワッド
//     const feedbackMaterial = new THREE.ShaderMaterial({
//       uniforms: {
//         tCurrent: { value: null },
//         tPrev: { value: null },
//         uTime: { value: 0 },
//         uLevel0: { value: 0.0 },
//         uLevel1: { value: 0.0 },
//         uLevel2: { value: 0.0 },
//       },
//       vertexShader: `
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragmentShader: `
//         varying vec2 vUv;
//         uniform sampler2D tCurrent;
//         uniform sampler2D tPrev;
//         uniform float uTime;
//         uniform float uLevel0;
//         uniform float uLevel1;
//         uniform float uLevel2;

//         float rand2(vec2 p) {
//           return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
//         }
//         vec2 getOffset2(vec2 p) {
//           return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
//         }
//         float rand1(float y) {
//           return fract(sin(y * 12.9898) * 43758.5453123);
//         }
//         float floorRand(float t, float speed) {
//           return rand1(floor(t * speed));
//         }
//         vec3 hsl2rgb(vec3 hsl) {
//           float h = hsl.x;
//           float s = hsl.y;
//           float l = hsl.z;
//           vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
//           return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
//         }
//         float lumi(vec3 color) {
//           return dot(color, vec3(0.3, 0.59, 0.11));
//         }
//         vec2 getOffset1(float index) {
//           return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
//         }
//         vec2 rotatePos(vec2 p, float a) {
//           return p * mat2(cos(a), -sin(a), sin(a), cos(a));
//         }

//         void main() {
//           vec2 uv = vUv;

//           vec3 current = texture2D(tCurrent, uv).rgb;
//           vec3 prev = texture2D(tPrev, uv).rgb;

//           vec2 blockUv = floor(uv * 100.) / 100.;
//           vec2 noiseUv = uv + getOffset2(blockUv) * 0.01;
//           vec3 noisePrev = texture2D(tPrev, noiseUv).rgb;
//           vec3 color = current + noisePrev * clamp(length(noisePrev), 0.97, 0.99);
//           vec3 color1 = mix(prev, current, step(0.5, length(current)));
//           vec3 colorCaos = mix((uLevel2 - prev) * 0.9999, current, step(0.8, length(current)));

//           vec3 result = current;
//           result = mix(result, color, uLevel0);
//           result = mix(result, color1, uLevel1);
//           result += colorCaos * uLevel2;

//           gl_FragColor = vec4(result, 1.0);
//         }
//       `,
//     });
//     const feedbackQuad = new THREE.Mesh(
//       new THREE.PlaneGeometry(2, 2),
//       feedbackMaterial,
//     );
//     feedbackScene.add(feedbackQuad);

//     // 出力用シーン（feedbackの結果をcomposerに通す）
//     const outputScene = new THREE.Scene();
//     const outputCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//     const outputMaterial = new THREE.MeshBasicMaterial({ map: null });
//     outputScene.add(
//       new THREE.Mesh(new THREE.PlaneGeometry(2, 2), outputMaterial),
//     );

//     // composer
//     const composer = new EffectComposer(renderer);
//     composer.setPixelRatio(window.devicePixelRatio);
//     composer.setSize(WIDTH, HEIGHT);

//     const renderPass = new RenderPass(outputScene, outputCamera);
//     composer.addPass(renderPass);

//     // CC13: nega/posi
//     const negaPass = new ShaderPass(NegaShader);
//     composer.addPass(negaPass);

//     // CC14: glitch
//     const glitchPass = new ShaderPass(v1Glitch0);
//     composer.addPass(glitchPass);

//     const outputPass = new OutputPass();
//     composer.addPass(outputPass);

//     // シーン初期化
//     const oscillator = vj2CurveOscillator(scene);
//     const photoMusic = vj2PhotoMusic(scene);
//     const horizontal = vj2Horizontal(scene);
//     const circlePacking2 = vj2CirclePacking2(scene);
//     const sinWave = vj2SinWave(scene);
//     const smoothwave = vj2Smoothwave(scene);
//     const projection = vj2Radial(scene);
//     const sea = vj2Sea(scene);
//     const matsu = vj2Matsu(scene);
//     const grid = vj2Grid(scene);

//     const scenes: Scene[] = [
//       { sketch: sea, pad: 36, active: false },
//       { sketch: horizontal, pad: 37, active: false },
//       { sketch: grid, pad: 38, active: false },
//       { sketch: matsu, pad: 39, active: false },
//       { sketch: circlePacking2, pad: 40, active: false },
//       { sketch: oscillator, pad: 41, active: false },
//       { sketch: smoothwave, pad: 42, active: false },
//       { sketch: sinWave, pad: 43, active: false },
//       { sketch: photoMusic, pad: 44, active: false },
//       { sketch: projection, pad: 45, active: false },
//     ];

//     scenes.forEach((s) => {
//       s.sketch.init();
//       s.sketch.mesh.visible = false;
//     });

//     // MIDI
//     navigator.requestMIDIAccess().then((access) => {
//       access.inputs.forEach((input) => {
//         console.log("MIDI input:", input.name);
//         input.onmidimessage = (m) => {
//           if (!m.data) return;
//           const [status, note, value] = m.data;
//           // パッド
//           if (status === 153) {
//             const target = scenes.find((s) => s.pad === note);
//             if (target) {
//               target.active = !target.active;
//               target.sketch.mesh.visible = target.active;
//               console.log(`pad ${note}: ${target.active ? "ON" : "OFF"}`);
//             }
//           }
//           // ノブ
//           if (status === 176) {
//             const level = value / 127;
//             // feedback
//             if (note === 3) feedbackMaterial.uniforms.uLevel0.value = level;
//             if (note === 9) feedbackMaterial.uniforms.uLevel1.value = level;
//             if (note === 12) feedbackMaterial.uniforms.uLevel2.value = level;
//             // post-processing
//             if (note === 13) negaPass.uniforms.uLevel.value = level;
//             if (note === 14) glitchPass.uniforms.uLevel.value = level;
//           }
//         };
//       });
//     });

//     const bpmDetector = BpmDetector.createBpm();
//     const audioContext = bpmDetector.init();
//     const oscillatorBuffer = new Float32Array(1024);
//     const projectionBuffer = new Float32Array(256);

//     let flip = false;

//     const handleClick = async () => {
//       const audio = new Audio("/mix/20260130_232541_E01.wav");
//       AudioAnalyser.play(
//         audioContext.ctx,
//         audioContext.analyser,
//         audio,
//         Math.floor(Math.random() * 3000),
//       );

//       let bpmCounter = 0;

//       const loop = () => {
//         const time = clock.getElapsedTime();
//         AudioAnalyser.getData(audioContext.analyser, oscillatorBuffer);
//         AudioAnalyser.getData(audioContext.analyser, projectionBuffer);

//         const bpm = bpmDetector.update(time);
//         const bpmCount = Math.floor((bpm / 60) * time);
//         const onBeat = bpm > 0 && bpmCount !== bpmCounter;
//         if (bpmCounter !== bpmCount) bpmCounter = bpmCount;

//         const props = {
//           onBeat,
//           oscillatorBuffer,
//           projectionBuffer,
//           bpmCount,
//           time,
//           bpm,
//         };

//         scenes.forEach((s) => {
//           if (s.active) s.sketch.update(props);
//         });

//         const readBuffer = flip ? targetA : targetB;
//         const writeBuffer = flip ? targetB : targetA;

//         // 1. スケッチをレンダー
//         renderer.setRenderTarget(sketchTarget);
//         renderer.render(scene, camera);

//         // 2. feedback合成
//         feedbackMaterial.uniforms.uTime.value = time;
//         feedbackMaterial.uniforms.tCurrent.value = sketchTarget.texture;
//         feedbackMaterial.uniforms.tPrev.value = readBuffer.texture;
//         renderer.setRenderTarget(writeBuffer);
//         renderer.render(feedbackScene, feedbackCamera);

//         // 3. feedback結果をcomposerに通して画面出力
//         outputMaterial.map = writeBuffer.texture;
//         glitchPass.uniforms.uTime.value = time;
//         composer.render();

//         flip = !flip;
//         requestAnimationFrame(loop);
//       };
//       loop();
//     };

//     window.addEventListener("click", handleClick, { once: true });
//   }, []);

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//       }}
//     >
//       <canvas ref={canvasRef} />
//     </div>
//   );
// }
"use client";
import { AudioAnalyser } from "@/app/audio/util";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
  OutputPass,
  AfterimagePass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import { vj2CurveOscillator } from "./osillator4";
import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
import { vj2Radial } from "./projection";
import { vj2Grid } from "./grid";
import { vj2Horizontal } from "./horizontal";
import { vj2CirclePacking2 } from "./ciclePacking2";
import { vj2SinWave } from "./sinwave";
import { vj2Smoothwave } from "./smoothwave";
import { vj2PhotoMusic } from "./photomusic";
import { vj2Sea } from "./sea";
import { vj2Matsu } from "./masu";
import { NegaShader } from "@/app/vj/vol1/postProcessing/negaPos";
import { v1Glitch0 } from "@/app/vj/vol1/postProcessing/glitchVj1";
import { ColorShader } from "@/app/vj/vol1/postProcessing/colorShader";

interface Scene {
  sketch: {
    mesh: THREE.Object3D;
    init: () => void;
    update: (props: any) => void;
  };
  pad: number;
  active: boolean;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const clock = new THREE.Clock();
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    const aspect = WIDTH / HEIGHT;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true, // 録画のために必要
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -aspect,
      aspect,
      1,
      -1,
      0.1,
      100,
    );
    camera.position.z = 1;
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(0, 0, 0.01);
    scene.add(light);

    const feedbackScene = new THREE.Scene();
    const feedbackCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const dpr = renderer.getPixelRatio();
    const rtW = Math.floor(WIDTH * dpr);
    const rtH = Math.floor(HEIGHT * dpr);
    const sketchTarget = new THREE.WebGLRenderTarget(rtW, rtH);
    const targetA = new THREE.WebGLRenderTarget(rtW, rtH);
    const targetB = new THREE.WebGLRenderTarget(rtW, rtH);

    const feedbackMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tCurrent: { value: null },
        tPrev: { value: null },
        uTime: { value: 0 },
        uLevel0: { value: 0.0 }, // CC3
        uLevel1: { value: 0.0 }, // CC9
        uLevel2: { value: 0.0 }, // CC12
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tCurrent;
        uniform sampler2D tPrev;
        uniform float uLevel0;
        uniform float uLevel1;
        uniform float uLevel2;
        float rand2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        vec2 getOffset2(vec2 p) { return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5); }
        void main() {
          vec2 uv = vUv;
          vec3 current = texture2D(tCurrent, uv).rgb;
          vec3 prev = texture2D(tPrev, uv).rgb;
          vec2 blockUv = floor(uv * 100.) / 100.;
          vec2 noiseUv = uv + getOffset2(blockUv) * 0.01;
          vec3 noisePrev = texture2D(tPrev, noiseUv).rgb;
          vec3 color = current + noisePrev * clamp(length(noisePrev), 0.97, 0.99);
          vec3 color1 = mix(prev, current, step(0.5, length(current)));
          vec3 colorCaos = mix((uLevel2 - prev) * 0.9999, current, step(0.8, length(current)));
          vec3 result = current;
          result = mix(result, color, uLevel0);
          result = mix(result, color1, uLevel1);
          result += colorCaos * uLevel2;
          gl_FragColor = vec4(result, 1.0);
        }
      `,
    });
    feedbackScene.add(
      new THREE.Mesh(new THREE.PlaneGeometry(2, 2), feedbackMaterial),
    );

    const outputScene = new THREE.Scene();
    const outputCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const outputMaterial = new THREE.MeshBasicMaterial({ map: null });
    outputScene.add(
      new THREE.Mesh(new THREE.PlaneGeometry(2, 2), outputMaterial),
    );

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(outputScene, outputCamera);
    composer.addPass(renderPass);

    const negaPass = new ShaderPass(NegaShader);
    composer.addPass(negaPass); // CC13

    const glitchPass = new ShaderPass(v1Glitch0);
    composer.addPass(glitchPass); // CC14

    const colorPass = new ShaderPass(ColorShader);
    composer.addPass(colorPass); // CC15

    composer.addPass(new OutputPass());

    const scenes: Scene[] = [
      { sketch: vj2Sea(scene), pad: 36, active: false },
      { sketch: vj2Horizontal(scene), pad: 37, active: false },
      { sketch: vj2Grid(scene), pad: 38, active: false },
      { sketch: vj2Matsu(scene), pad: 39, active: false },
      { sketch: vj2CirclePacking2(scene), pad: 40, active: false },
      { sketch: vj2CurveOscillator(scene), pad: 41, active: false },
      { sketch: vj2Smoothwave(scene), pad: 42, active: false },
      { sketch: vj2SinWave(scene), pad: 43, active: false },
      { sketch: vj2PhotoMusic(scene), pad: 44, active: false },
      { sketch: vj2Radial(scene), pad: 45, active: false },
    ];
    scenes.forEach((s) => {
      s.sketch.init();
      s.sketch.mesh.visible = false;
    });

    const bpmDetector = BpmDetector.createBpm();
    const audioContext = bpmDetector.init();
    const streamDest = audioContext.ctx.createMediaStreamDestination();
    audioContext.analyser.connect(audioContext.ctx.destination);
    audioContext.analyser.connect(streamDest);

    const oscillatorBuffer = new Float32Array(1024);
    const projectionBuffer = new Float32Array(256);
    let flip = false;
    let bpmCounter = 0;

    // MIDI
    navigator.requestMIDIAccess?.().then((access) => {
      access.inputs.forEach((input) => {
        input.onmidimessage = (m) => {
          if (!m.data) return;
          const [status, note, value] = m.data;
          const level = value / 127;
          if (status === 153) {
            const target = scenes.find((s) => s.pad === note);
            if (target) {
              target.active = !target.active;
              target.sketch.mesh.visible = target.active;
            }
          }
          if (status === 176) {
            if (note === 3) feedbackMaterial.uniforms.uLevel0.value = level;
            if (note === 9) feedbackMaterial.uniforms.uLevel1.value = level;
            if (note === 12) feedbackMaterial.uniforms.uLevel2.value = level;
            if (note === 13) negaPass.uniforms.uLevel.value = level;
            if (note === 14) glitchPass.uniforms.uLevel.value = level;
            if (note === 15) colorPass.uniforms.uLevel.value = level;
          }
        };
      });
    });

    // 録画 ('s'キー)
    const toggleRec = () => {
      if (!recorderRef.current || recorderRef.current.state === "inactive") {
        const stream = new MediaStream([
          ...canvasRef.current!.captureStream(60).getTracks(),
          ...streamDest.stream.getAudioTracks(),
        ]);
        recorderRef.current = new MediaRecorder(stream, {
          mimeType: "video/webm; codecs=vp9,opus",
        });
        chunksRef.current = [];
        recorderRef.current.ondataavailable = (e) =>
          chunksRef.current.push(e.data);
        recorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `vj-rec-${Date.now()}.webm`;
          a.click();
        };
        recorderRef.current.start();
        console.log("REC START");
      } else {
        recorderRef.current.stop();
        console.log("REC STOP");
      }
    };
    const handleS = (e: KeyboardEvent) => {
      if (e.key === "s") toggleRec();
    };
    window.addEventListener("keydown", handleS);

    const loop = () => {
      const time = clock.getElapsedTime();
      AudioAnalyser.getData(audioContext.analyser, oscillatorBuffer);
      AudioAnalyser.getData(audioContext.analyser, projectionBuffer);
      const bpm = bpmDetector.update(time);
      const bpmCount = Math.floor((bpm / 60) * time);
      const onBeat = bpm > 0 && bpmCount !== bpmCounter;
      if (bpmCounter !== bpmCount) bpmCounter = bpmCount;

      const props = {
        onBeat,
        oscillatorBuffer,
        projectionBuffer,
        bpmCount,
        time,
        bpm,
      };
      scenes.forEach((s) => {
        if (s.active) s.sketch.update(props);
      });

      const readBuffer = flip ? targetA : targetB;
      const writeBuffer = flip ? targetB : targetA;

      renderer.setRenderTarget(sketchTarget);
      renderer.render(scene, camera);

      feedbackMaterial.uniforms.uTime.value = time;
      feedbackMaterial.uniforms.tCurrent.value = sketchTarget.texture;
      feedbackMaterial.uniforms.tPrev.value = readBuffer.texture;
      renderer.setRenderTarget(writeBuffer);
      renderer.render(feedbackScene, feedbackCamera);

      outputMaterial.map = writeBuffer.texture;
      glitchPass.uniforms.uTime.value = time;
      colorPass.uniforms.uTime.value = time;
      composer.render();

      flip = !flip;
      requestAnimationFrame(loop);
    };

    const handleClick = () => {
      const audio = new Audio("/mix/20260130_232541_E01.wav");
      audio.onloadedmetadata = () => {
        const start = Math.random() * audio.duration; // ランダム再生
        AudioAnalyser.play(
          audioContext.ctx,
          audioContext.analyser,
          audio,
          start,
        );
        loop();
      };
    };
    window.addEventListener("click", handleClick, { once: true });

    return () => {
      window.removeEventListener("keydown", handleS);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#000",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
