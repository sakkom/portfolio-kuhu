"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RGBShiftShader,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { kaleidoShader } from "./shader";
import "@/app/styles/article.css";
import { setGui } from "../../utils/utils";
import { create } from "node:domain";
import Ripple from "../ripple/Ripple";
import { rippleShader } from "../ripple/shader";
import { linerShader } from "../linearSinDistortion/shader";

const MAX_Z_INDEX = 500;

interface GuiProps {
  time: number;
  gridSeg: number;
  seg: number;
}

const guiProps: GuiProps = {
  time: 0,
  gridSeg: 30,
  seg: 8,
};

function createMesh(width: number, height: number, gridSeg: number) {
  const meshs: THREE.Mesh[] = [];

  // const space = width / (Math.random() * 50 + 10);
  const space = width / gridSeg;
  // const tube = Math.random() * 10;

  for (let i = -height / 2; i <= height / 2; i += space) {
    for (let j = -width / 2; j <= width / 2; j += space) {
      //texture要素
      const tube = Math.random() * 10;
      const geometry = new THREE.TorusKnotGeometry(width / 50, tube);

      const lightness = Math.random();
      const material = new THREE.MeshBasicMaterial({
        // color: new THREE.Color().setHSL(hue, 0.5, lightness),
        color: new THREE.Color().setHSL(0, 0, Math.random()),
        wireframe: true,
      });

      const torus = new THREE.Mesh(geometry, material);

      //animationでzを調整する
      torus.position.set(j, i, /*Math.random() * 500*/ 0);
      torus.rotation.x = Math.random() * Math.PI * 2;
      torus.rotation.y = Math.random() * Math.PI * 2;
      torus.rotation.z = Math.random() * Math.PI * 2;
      torus.userData.lightness = lightness;

      meshs.push(torus);
    }
  }

  return { meshs };
}

function initEffectPass(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  cam: THREE.Camera,
) {
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(window.devicePixelRatio);
  // composerRef = composer;
  composer.addPass(new RenderPass(scene, cam));

  const rgbPass = new ShaderPass(RGBShiftShader);
  composer.addPass(rgbPass);
  const kaleidoPass = new ShaderPass(kaleidoShader);
  composer.addPass(kaleidoPass);

  return { composer, kaleidoPass };
}

function initCanvas(canvas: HTMLCanvasElement) {
  const clientWidth = canvas.clientWidth;
  const clientHeight = canvas.clientHeight;
  const pixelRatio = window.devicePixelRatio;
  canvas.width = clientWidth * pixelRatio;
  canvas.height = clientHeight * pixelRatio;
  return { clientWidth, clientHeight };
}

function initGui(
  props: GuiProps,
  uniforms: { [key: string]: THREE.IUniform },
  isHome: boolean,
) {
  if (!isHome) {
    const gui = setGui();

    gui.add(props, "gridSeg", 0, 50).step(1);
    gui
      .add(props, "seg", 2, 50)
      .step(1)
      .onChange((value: number) => {
        uniforms.uSeg.value = value;
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
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  const light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 5;
  light.position.set(0, 0, 1);
  scene.add(light);

  scene.background = new THREE.Color(0x000000);
  cam.position.set(0, 0, MAX_Z_INDEX);

  return { renderer, scene, cam, light };
}

export default function Kaleido({ isHome = false }: { isHome?: boolean }) {
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
    let { meshs } = createMesh(
      clientWidth,
      clientHeight,
      guiPropsRef.current.gridSeg,
    );
    meshs.forEach((mesh) => scene.add(mesh));
    renderer.render(scene, cam);

    const { composer, kaleidoPass } = initEffectPass(renderer, scene, cam);
    kaleidoPass.uniforms.uResolution.value = new THREE.Vector2(
      clientWidth,
      clientHeight,
    );
    kaleidoPass.uniforms.uSeg.value = guiPropsRef.current.seg;
    initGui(guiPropsRef.current, kaleidoPass.uniforms, isHome);

    const clock = new THREE.Clock();
    let prevGridSeg = guiPropsRef.current.gridSeg;

    const animate = () => {
      const time = clock.getDelta();

      guiPropsRef.current.time += time;
      kaleidoPass.uniforms.uTime.value = guiPropsRef.current.time;

      if (prevGridSeg !== guiPropsRef.current.gridSeg) {
        meshs.forEach((mesh) => {
          scene.remove(mesh);
          mesh.geometry.dispose();
          if (mesh.material instanceof THREE.Material) {
            mesh.material.dispose();
          }
        });

        meshs = createMesh(
          clientWidth,
          clientHeight,
          guiPropsRef.current.gridSeg,
        ).meshs;
        meshs.forEach((mesh) => scene.add(mesh));
        prevGridSeg = guiPropsRef.current.gridSeg;
      }

      meshs.forEach((mesh) => {
        if (mesh.material instanceof THREE.MeshBasicMaterial) {
          const hue = (guiPropsRef.current.time * 0.5) % 1.0;
          mesh.material.color.setHSL(hue, 0.3, mesh.userData.lightness);
          // mesh.material.color.setHSL(0, 0, mesh.userData.lightness);
        }

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        mesh.rotation.z += 0.01;

        if (Math.random() > 0.98) {
          const zIndex = Math.random() * MAX_Z_INDEX;
          mesh.position.z = zIndex;
        }
      });
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
