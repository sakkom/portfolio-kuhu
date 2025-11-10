"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RGBShiftShader,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { rippleShader } from "./shader";
import "@/app/styles/article.css";
import { setGui } from "../../utils/utils";
import { Wireframe } from "three/examples/jsm/lines/webgpu/Wireframe.js";

interface GuiProps {
  time: number;
  freq: number;
  amp: number;
}

const guiProps: GuiProps = {
  time: 0,
  freq: 10.0,
  amp: 0.01,
};

function createMesh(width: number, height: number) {
  const meshs: THREE.Mesh[] = [];

  const space = width / 20;
  for (let i = -height / 1; i <= height / 1; i += space) {
    for (let j = -width / 1; j <= width / 1; j += space) {
      const geometry = new THREE.PlaneGeometry(space - 1, space - 1);
      const material = new THREE.MeshBasicMaterial({
        // color: 0xeeeeee,
        // color: 0x000000,
        color: 0xfffff0,
        // wireframe: true,
      });
      const circle = new THREE.Mesh(geometry, material);
      circle.position.set(j, i, 0);
      // circle.rotation.z = 30;
      meshs.push(circle);
    }
  }

  return { meshs };
}

function initCanvas(canvas: HTMLCanvasElement) {
  const clientWidth = canvas.clientWidth;
  const clientHeight = canvas.clientHeight;
  canvas.width = clientWidth;
  canvas.height = clientHeight;
  return { clientWidth, clientHeight };
}

function initGui(
  props: GuiProps,
  uniforms: { [key: string]: THREE.IUniform },
  isHome: boolean,
) {
  if (!isHome) {
    const gui = setGui();
    const blockLayer = gui.addFolder("Block Layer");
    blockLayer
      .add(props, "freq", 0, 50)
      .step(0.01)
      .onChange((value: number) => {
        uniforms.uFreq.value = value;
      });
    blockLayer
      .add(props, "amp", 0, 1.0)
      .step(0.01)
      .onChange((value: number) => {
        uniforms.uAmp.value = value;
      });
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
  const light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 5;
  light.position.set(0, 0, 1);
  scene.add(light);

  // scene.background = new THREE.Color(0xffffff);
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

  const rgbShift = new ShaderPass(RGBShiftShader);
  // rgbShift.uniforms.amount.value = 0.05;
  rgbShift.uniforms.angle.value = 1.57;
  const ripplePass = new ShaderPass(rippleShader);
  composer.addPass(rgbShift);
  composer.addPass(ripplePass);
  return { composer, ripplePass };
}

export default function Ripple({ isHome = false }: { isHome?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guiPropsRef = useRef<GuiProps>(guiProps);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { clientWidth, clientHeight } = initCanvas(canvasRef.current);

    const { renderer, scene, cam } = initThreeBasics(
      canvasRef.current,
      clientWidth,
      clientHeight,
    );
    const { meshs } = createMesh(clientWidth, clientHeight);
    meshs.forEach((mesh) => scene.add(mesh));
    renderer.render(scene, cam);

    const { composer, ripplePass } = initEffectPass(renderer, scene, cam);
    ripplePass.uniforms.uResolution.value = new THREE.Vector2(
      clientWidth,
      clientHeight,
    );
    // ripplePass.uniforms.uBlockSize.value = guiPropsRef.current.blockSize;
    // ripplePass.uniforms.uBlockSegment.value = guiPropsRef.current.blockSegment;
    // ripplePass.uniforms.uLineSegment.value = guiPropsRef.current.lineSegment;
    // ripplePass.uniforms.uLineHeight.value = guiPropsRef.current.lineHeight;
    // ripplePass.uniforms.uLineWidth.value = guiPropsRef.current.lineWidth;
    ripplePass.uniforms.uFreq.value = guiPropsRef.current.freq;
    ripplePass.uniforms.uAmp.value = guiPropsRef.current.amp;
    // initGui(guiPropsRef.current, ripplePass.uniforms, isHome);

    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getDelta();

      guiPropsRef.current.time += time;
      ripplePass.uniforms.uTime.value = guiPropsRef.current.time;
      // if (Math.random() > 0.97) {
      //   ripplePass.uniforms.uAmp.value = Math.random() * 0.3;
      //   ripplePass.uniforms.uFreq.value =
      //     Math.floor(Math.random() * 5) * Math.PI;
      // }
      // meshs.forEach((mesh) => {
      // mesh.rotation.y += 0.1;
      // mesh.rotation.x += 0.1;
      // mesh.rotation.z += 0.1;
      // });
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
      {!isHome && <div id="guiContainer"></div>}
      <canvas className="article-canvas" ref={canvasRef} />
    </>
  );
}
