"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, ShaderPass } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { linerShader } from "./shader";
import "@/app/styles/article.css";
import { setGui } from "../utils/utils";

interface guiProps {
  freq: number;
  amp: number;
}

function createRectGeometries(width: number, height: number) {
  const rects: THREE.Line[] = [];
  const colors = [0xff00ff, 0xffff00, 0x00ffff];

  function createRectPoints(width: number, height: number) {
    return [
      new THREE.Vector2(-width, -height),
      new THREE.Vector2(-width, height),
      new THREE.Vector2(width, height),
      new THREE.Vector2(width, -height),
      new THREE.Vector2(-width, -height),
    ];
  }

  for (let i = 0; i < 3; i++) {
    const size = (i + 1) * 5;
    const points = createRectPoints(width / size, height / size);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: colors.reverse()[i],
    });
    const rect = new THREE.Line(geometry, material);
    rects.push(rect);
  }
  return rects;
}

function initCanvas(canvas: HTMLCanvasElement) {
  const clientWidth = canvas.clientWidth;
  const clientHeight = canvas.clientHeight;
  canvas.width = clientWidth;
  canvas.height = clientHeight;
  return { clientWidth, clientHeight };
}

function initGui(props: guiProps) {
  const gui = setGui();
  gui
    .add(props, "freq")
    .min(0)
    .max(Math.PI * 4)
    .step(1);
  gui.add(props, "amp").min(0.0).max(0.1).step(0.01);
  // return gui;
}

function initThreeBasics(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
) {
  const renderer = new THREE.WebGLRenderer({ canvas });
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  const light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 5;
  light.position.set(0, 0.5, 1);
  scene.add(light);

  scene.background = new THREE.Color(0x000000);
  cam.position.set(0, 0, 500);

  return { renderer, scene, cam, light };
}

function initEffectPass(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  cam: THREE.Camera,
) {
  const composer = new EffectComposer(renderer);
  // composerRef = composer;
  composer.addPass(new RenderPass(scene, cam));

  const linearPass = new ShaderPass(linerShader);
  composer.addPass(linearPass);
  return { composer, linearPass };
}

export default function LinearSinDistortion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guiPropsRef = useRef<guiProps>({
    freq: Math.PI * 2,
    amp: 1.0 / 16.0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    const { clientWidth, clientHeight } = initCanvas(canvasRef.current);
    initGui(guiPropsRef.current);

    const { renderer, scene, cam } = initThreeBasics(
      canvasRef.current,
      clientWidth,
      clientHeight,
    );
    const rects = createRectGeometries(clientWidth, clientHeight);
    rects.forEach((rect) => scene.add(rect));
    renderer.render(scene, cam);

    const { composer, linearPass } = initEffectPass(renderer, scene, cam);
    linearPass.uniforms.uResolution.value = new THREE.Vector2(
      clientWidth,
      clientHeight,
    );
    linearPass.uniforms.uFreq.value = guiPropsRef.current.freq;
    linearPass.uniforms.uAmp.value = guiPropsRef.current.amp;

    const animate = () => {
      rects.forEach((rect, i) => {
        rect.position.set(i * 100 - 100, 0, 0);
        rect.rotation.z += 0.01;
      });
      linearPass.uniforms.uFreq.value = guiPropsRef.current.freq;
      linearPass.uniforms.uAmp.value = guiPropsRef.current.amp;
      composer.render();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div id="guiContainer"></div>
      <canvas className="article-canvas" ref={canvasRef} />
    </>
  );
}
