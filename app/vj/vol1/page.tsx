"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setThree from "./util";
import {
  EffectComposer,
  RenderPass,
  AfterimagePass,
  OutputPass,
  ShaderPass,
  UnrealBloomPass,
  KaleidoShader,
  // UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import {
  testSketch0,
  testSketch1,
  testSketch2,
  testSketch3,
  testSketch4,
} from "./sketch/test";
import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
import { AudioAnalyser } from "@/app/audio/util";
import { vol1S0 } from "./sketch/scenes/s0";
import { vol1S1 } from "./sketch/scenes/s1";
import { vol1S2 } from "./sketch/scenes/s2";
import { vol1S3 } from "./sketch/scenes/s3";
import { vol1Video0 } from "./sketch/videos/video0";
import { vol1S4 } from "./sketch/scenes/glsl/s4";
import { vol1S5 } from "./sketch/scenes/glsl/s5";
import { Title } from "./css/title";
import { FlashOverlay } from "./css/flashOverlay";
import { v1Glitch0 } from "./postProcessing/glitchVj1";
import { AudioDistortion } from "./postProcessing/audioDistorsion";
import { layerVol1 } from "./layer/layer";
import { NegaShader } from "./postProcessing/negaPos";
import { ColorShader } from "./postProcessing/colorShader";
import { fbShader } from "./fb";

interface Sketch {
  mesh: THREE.Object3D;
  setup: () => void;
  update: (context: any) => void;
  beatPos?: number;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTitle = useRef<boolean>(false);
  const isFirstScene = useRef<boolean>(false);
  const isBpmFrash = useRef<boolean>(false);
  const [currentContext, setCurrentContext] = useState<any>();
  const [isFlash, setisFlash] = useState<boolean>(false);
  const flashInterval = useRef<NodeJS.Timeout | null>(null);
  const titleColor = useRef<number>(0);
  /*bpm変調 */
  const currentBpm = useRef<{ index: number; bpm: number; virtualBpm: number }>(
    { index: -1, bpm: 0, virtualBpm: 0 },
  );
  /*cofig */
  const ampBufferNum = useRef<number>(1);
  /*layer */
  const isLayer0 = useRef<boolean>(false);
  const isLayer1 = useRef<boolean>(false);
  /*fb */
  const fbCC = new Float32Array(6);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { scene, camera, renderer } = setThree(canvasRef.current);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 1;
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(0, 1, 0);
    scene.add(light);

    /*pinpon */
    const canvas = canvasRef.current;
    const fbScene = new THREE.Scene();
    const fbCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const sketchTarget = new THREE.WebGLRenderTarget(
      canvas.width,
      canvas.height,
    );
    const targetA = new THREE.WebGLRenderTarget(canvas.width, canvas.height);
    const targetB = new THREE.WebGLRenderTarget(canvas.width, canvas.height);
    const fbGeometry = new THREE.PlaneGeometry(2, 2);
    const fbMaterial = new THREE.ShaderMaterial(fbShader);
    const fbSketch = new THREE.Mesh(fbGeometry, fbMaterial);
    fbScene.add(fbSketch);

    /*composer */
    const composer = new EffectComposer(renderer, sketchTarget);
    composer.setPixelRatio(window.devicePixelRatio);
    composer.setSize(window.innerWidth, window.innerHeight);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const afterimagePass = new AfterimagePass();
    afterimagePass.uniforms["damp"].value = 0.0;
    const unrealbloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.0,
      1.0,
      0.0,
    );

    const negaPass = new ShaderPass(NegaShader);
    const glitch0Pass = new ShaderPass(v1Glitch0);
    const audioDistortionPass = new ShaderPass(AudioDistortion);
    const colorShaderPass = new ShaderPass(ColorShader);
    composer.addPass(afterimagePass);
    composer.addPass(unrealbloomPass);
    composer.addPass(glitch0Pass);
    composer.addPass(negaPass);
    composer.addPass(colorShaderPass);
    composer.addPass(audioDistortionPass);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    /*bpm & audioset */
    const bpmDetector = BpmDetector.createBpm();
    const audioContext = bpmDetector.init();

    const firstScene = testSketch0(scene);
    firstScene.setup();
    firstScene.mesh.visible = false;

    /*layer */
    const layerScene0 = layerVol1.layserSketch0(scene);
    layerScene0.setup();
    layerScene0.mesh.visible = false;
    layerScene0.mesh.renderOrder = 100;
    const layerScene1 = layerVol1.layserSketch1(scene);
    layerScene1.setup();
    layerScene1.mesh.visible = false;
    layerScene1.mesh.renderOrder = 100;

    const sketches: Sketch[] = [
      vol1S0.sketchS0(scene),
      vol1S2.sketchS2(scene),
      vol1S1.sketchS1(scene),
      vol1S3.sketchS3(scene),
      // vol1Video0.videoS0(scene),
      vol1S4.sketchS4(scene),
      vol1S5.sketchS5(scene),
    ];
    sketches.forEach((s) => {
      s.setup();
      s.mesh.visible = false;
    });

    for (let i = 0; i < 4; i++) {
      sketches[i].beatPos = i;
    }

    const clock = new THREE.Clock();

    navigator.requestMIDIAccess().then((access) => {
      access.inputs.forEach((input) => {
        input.onmidimessage = (m) => {
          if (!m.data) return;
          const [status, data1, data2] = m.data;

          if (status == 153 && data1 == 36) {
            isTitle.current = !isTitle.current;
          }
          if (status == 153 && data1 == 37) {
            isFirstScene.current = !isFirstScene.current;
            isBpmFrash.current = false;
          }
          if (status == 153 && data1 == 38) {
            if (currentBpm.current.bpm === 0) return;

            isBpmFrash.current = true;

            currentBpm.current.index = (currentBpm.current.index + 1) % 3;
          }
          if (status == 153 && data1 == 39 && isBpmFrash.current) {
            const targetIndex = Math.floor(Math.random() * 4);

            sketches.forEach((s) => {
              if (s.beatPos === targetIndex) {
                s.beatPos = undefined;
              }
            });

            const randoms = sketches.filter((s) => s.beatPos === undefined);
            const addSketch =
              randoms[Math.floor(Math.random() * randoms.length)];
            addSketch.beatPos = targetIndex;
          }
          if (status == 153 && data1 == 40) {
            isLayer0.current = !isLayer0.current;
          }
          if (status == 153 && data1 == 50) {
            isLayer1.current = !isLayer1.current;
          }
          if (status == 153 && data1 == 51) {
            flashInterval.current = setInterval(() => {
              setisFlash((prev) => !prev);
            }, 50);
          }
          if (status == 137 && data1 == 51) {
            if (flashInterval.current !== null) {
              clearInterval(flashInterval.current);
              flashInterval.current = null;
              setisFlash(false);
            }
          }

          /*のぶ */
          if (status == 176 && data1 == 3) {
            afterimagePass.uniforms["damp"].value = data2 / 127 - 0.05;
          }
          if (status == 176 && data1 == 9) {
            unrealbloomPass.strength = (data2 / 127) * 1.5;
          }
          if (status == 176 && data1 == 12) {
            const level = data2 / 127;
            titleColor.current = level;
            negaPass.uniforms.uLevel.value = level;
          }
          if (status == 176 && data1 == 13) {
            glitch0Pass.uniforms.uLevel.value = data2 / 127;
          }
          if (status == 176 && data1 == 14) {
            audioDistortionPass.uniforms.uLevel.value = data2 / 127;
          }
          if (status == 176 && data1 == 15) {
            colorShaderPass.uniforms.uLevel.value = data2 / 127;
          }
          if (status == 176 && data1 >= 16 && data1 <= 21) {
            const index = data1 - 16;
            fbCC[index] = data2 / 127;
            fbMaterial.uniforms.uCC.value = fbCC;
          }
          /*config */
          if (status == 176 && data1 == 27) {
            ampBufferNum.current = (data2 / 127) * 10;
          }
        };
      });
    });

    /*bpm用 */
    const buffer = new Float32Array(audioContext.analyser.frequencyBinCount);

    /*audio distorstion */
    const textureBuffer = new Float32Array(2048 * 2);
    const dataTexture = new THREE.DataTexture(
      textureBuffer,
      2048 * 2,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;

    const handleClick = async () => {
      // const audio = new Audio(
      //   "/audio/sample-pack-link-in-bio-dopetronic-aliens-in-my-basement-331356.mp3",
      // );
      const audio = new Audio(
        "/audio/fassounds-good-night-lofi-cozy-chill-music-160166.mp3",
      );
      // const devices = await navigator.mediaDevices.enumerateDevices();
      // const audioinputs = devices.filter((d) => d.kind == "audioinput");
      // // console.log(audioinputs);
      // const ipod = audioinputs.find((d) => d.label.includes("USB Audio"));
      // const stream = await navigator.mediaDevices.getUserMedia({
      //   audio: {
      //     deviceId: { exact: ipod.deviceId },
      //     echoCancellation: false,
      //     noiseSuppression: false,
      //     autoGainControl: true,
      //   },
      // });

      AudioAnalyser.play(audioContext.ctx, audioContext.analyser, audio);

      let bpmCounter = 0;
      let frameCount = 0;
      let flip = false;
      const loop = () => {
        const time = clock.getElapsedTime();
        light.position.set(Math.cos(time), 1, Math.sin(time));

        AudioAnalyser.getData(audioContext.analyser, buffer);

        const bpm = bpmDetector.update(time);
        currentBpm.current.bpm = bpm;
        /* 仮想BPM*/
        const multiplier = [1, 4, 0.5];
        currentBpm.current.virtualBpm =
          currentBpm.current.bpm *
          multiplier[Math.max(currentBpm.current.index, 0)];
        const bpmCount = Math.floor(
          (currentBpm.current.virtualBpm / 60) * time,
        );

        /*amp config */
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] = buffer[i] * ampBufferNum.current;
        }

        const context = {
          time,
          buffer,
          onBeat: bpm > 0 && bpmCounter !== bpmCount,
          bpmCount,
          frameCount,
          analyser: audioContext.analyser,
          ampBuffer: ampBufferNum.current,
        };
        setCurrentContext(context);

        if (isFirstScene.current) {
          firstScene.mesh.visible = true;
          firstScene.update(context);
          sketches.forEach((s) => (s.mesh.visible = false));
        } else {
          firstScene.mesh.visible = false;
        }

        /*layer */
        if (isLayer0.current) {
          layerScene0.mesh.visible = true;
          layerScene0.update(context);
        } else {
          layerScene0.mesh.visible = false;
        }

        if (isLayer1.current) {
          layerScene1.mesh.visible = true;
          layerScene1.update(context);
        } else {
          layerScene1.mesh.visible = false;
        }

        if (isBpmFrash.current) {
          firstScene.mesh.visible = false;
          const nowBeat = bpmCount % 4;

          sketches.forEach((s, i) => {
            s.mesh.visible = s.beatPos === nowBeat;

            if (s.mesh.visible) {
              s.update(context);
            }
          });
        } else {
          sketches.forEach((s, i) => {
            s.mesh.visible = false;
          });
        }

        /* */
        glitch0Pass.uniforms.uTime.value = time;
        colorShaderPass.uniforms.uTime.value = time;

        /*audio distoretion */

        if (context.bpmCount % 2 === 0) {
          AudioAnalyser.getData(audioContext.analyser, textureBuffer);
          dataTexture.needsUpdate = true;
          audioDistortionPass.uniforms.uAudioTexture.value = dataTexture;
        }
        /* */

        if (bpmCounter !== bpmCount) {
          bpmCounter = bpmCount;
        }

        /*pinpon */
        const readBuffer = flip ? targetA : targetB;
        const writeBuffer = flip ? targetB : targetA;
        composer.render();
        fbMaterial.uniforms.uTime.value = clock.getElapsedTime();
        fbMaterial.uniforms.tCurrent.value = sketchTarget.texture;
        fbMaterial.uniforms.tPrev.value = readBuffer.texture;
        renderer.setRenderTarget(writeBuffer);
        renderer.render(fbScene, fbCamera);
        renderer.setRenderTarget(null);
        renderer.render(fbScene, fbCamera);

        flip = !flip;

        // composer.render();
        requestAnimationFrame(loop);
        frameCount++;
      };
      loop();
    };

    window.addEventListener("click", handleClick, { once: true });
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <FlashOverlay isFlash={isFlash} />
      <Title
        context={currentContext}
        isTitle={isTitle.current}
        color={titleColor.current}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
