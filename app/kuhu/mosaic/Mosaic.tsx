"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, ShaderPass } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { mosaicShader } from "./shader";
import "@/app/styles/article.css";
import { setGui } from "../../utils/utils";

interface GuiProps {
  pixelSize: number;
}

function initCanvas(canvas: HTMLCanvasElement) {
  const clientWidth = canvas.clientWidth;
  const clientHeight = canvas.clientHeight;
  canvas.width = clientWidth;
  canvas.height = clientHeight;
  return { clientWidth, clientHeight };
}

function initGui(props: GuiProps, isHome: boolean) {
  if (!isHome) {
    const gui = setGui();
    gui.add(props, "pixelSize").min(1).max(50).step(1);
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
  scene.background = new THREE.Color(0x000000);
  cam.position.set(0, 0, 500);
  return { renderer, scene, cam };
}

function createMesh() {
  const geometry = new THREE.BoxGeometry(200, 200, 200);
  const loader = new THREE.TextureLoader();
  const texture = loader.load("/texture-img-03.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    color: 0x00ff00,
  });
  return new THREE.Mesh(geometry, material);
}

function initEffectPass(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  cam: THREE.Camera,
  width: number,
  height: number,
  pixelSize: number,
) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, cam));

  const mosaicPass = new ShaderPass(mosaicShader);
  mosaicPass.uniforms.uPixelSize.value = pixelSize;
  mosaicPass.uniforms.uResolution.value = new THREE.Vector2(width, height);
  composer.addPass(mosaicPass);

  return { composer, mosaicPass };
}

export default function Mosaic({ isHome = false }: { isHome?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mosaicParams = useRef<GuiProps>({ pixelSize: 5.0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const { clientWidth, clientHeight } = initCanvas(canvasRef.current);
    initGui(mosaicParams.current, isHome);

    const { renderer, scene, cam } = initThreeBasics(
      canvasRef.current,
      clientWidth,
      clientHeight,
    );

    const mesh = createMesh();
    scene.add(mesh);
    renderer.render(scene, cam);

    const { composer, mosaicPass } = initEffectPass(
      renderer,
      scene,
      cam,
      clientWidth,
      clientHeight,
      mosaicParams.current.pixelSize,
    );

    let rot = 0;
    const animate = () => {
      rot += 1;
      mesh.rotation.x = Math.cos((rot * Math.PI) / 180);
      mesh.rotation.y += 0.01;
      mosaicPass.uniforms.uPixelSize.value = mosaicParams.current.pixelSize;
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
