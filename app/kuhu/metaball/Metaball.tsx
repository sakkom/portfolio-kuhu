"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  ShaderPass,
  RGBShiftShader,
} from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import "@/app/styles/article.css";
import { setGui } from "../../utils/utils";
import { MarchingCubes } from "three/examples/jsm/Addons.js";
import { createNoise2D } from "simplex-noise";

interface guiProps {
  balls: number;
}

function setMarchingCubesEffect() {
  const material = new THREE.MeshPhongMaterial({
    emissive: 0x000000,
  });
  const effect = new MarchingCubes(100, material);
  return effect;
}

function updateCubesEffect(
  effect: MarchingCubes,
  numBalls: number,
  time: number,
  noise2D: ReturnType<typeof createNoise2D>,
) {
  effect.reset();

  const subtract = numBalls * 2.0;
  const strength = 1.0 / Math.sqrt(numBalls);
  const speed = time * 0.2;

  for (let i = 0; i < numBalls; i++) {
    const x = 0.5 + noise2D(i + speed, i + speed) * 0.2;
    const y = 0.5 + noise2D(i * 1.2 + speed, i * 1.2 + speed) * 0.1;
    const z = 0.5 + noise2D(i * 1.3 + speed, i * 1.3 + speed) * 0.1;

    effect.addBall(x, y, z, strength, subtract);
  }
  effect.update();
  return { strength };
}

function initCanvas(canvas: HTMLCanvasElement) {
  const clientWidth = canvas.clientWidth;
  const clientHeight = canvas.clientHeight;
  canvas.width = clientWidth;
  canvas.height = clientHeight;
  return { clientWidth, clientHeight };
}

function initGui(props: guiProps, isHome: boolean) {
  if (!isHome) {
    const gui = setGui();
    gui.add(props, "balls").min(2).max(30).step(1);
  } else {
    return;
  }
}

function initThreeBasics(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
) {
  const renderer = new THREE.WebGLRenderer({ canvas });
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  const light = new THREE.DirectionalLight(0xfffff0);
  light.intensity = 5;
  light.position.set(0, 0, 1);
  scene.add(light);

  scene.background = new THREE.Color(0xfffff0);

  return { renderer, scene, cam, light };
}

function initEffectPass(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  cam: THREE.Camera,
) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, cam));

  const linearPass = new ShaderPass(RGBShiftShader);
  linearPass.uniforms.amount.value = 0.01;
  composer.addPass(linearPass);
  return { composer, linearPass };
}

export default function Metaball({ isHome = false }: { isHome?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guiPropsRef = useRef<guiProps>({
    balls: 15,
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    const { clientWidth, clientHeight } = initCanvas(canvasRef.current);
    initGui(guiPropsRef.current, isHome);

    const { renderer, scene, cam } = initThreeBasics(
      canvasRef.current,
      clientWidth,
      clientHeight,
    );

    const effect = setMarchingCubesEffect();
    // effect.scale.set(2.5, 2.5, 2.5);
    effect.scale.set(0.8, 0.8, 0.8);

    scene.add(effect);
    renderer.render(scene, cam);

    const { composer } = initEffectPass(renderer, scene, cam);

    const clock = new THREE.Clock();
    const noise2D = createNoise2D();

    const animate = () => {
      const time = clock.getElapsedTime();
      const { strength } = updateCubesEffect(
        effect,
        guiPropsRef.current.balls,
        time,
        noise2D,
      );
      effect.reset();

      cam.position.set(0, 0, strength * 3);

      composer.render();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, [isHome]);

  return (
    <>
      {!isHome && <div id="guiContainer"></div>}
      <canvas className="article-canvas" ref={canvasRef} />
    </>
  );
}
