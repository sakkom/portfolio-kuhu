"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, ShaderPass } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { frostedShader } from "./shader";
import "@/app/styles/article.css";
import { setGui } from "../../utils/utils";

interface GuiProps {
  offset: number;
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
    gui.add(props, "offset").min(0).max(100).step(1);
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
  const geometry = new THREE.PlaneGeometry(700, 500);
  const loader = new THREE.TextureLoader();
  const texture = loader.load("/texture-img-04.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshPhongMaterial({
    map: texture,
  });
  return new THREE.Mesh(geometry, material);
}

function initEffectPass(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  cam: THREE.Camera,
  width: number,
  height: number,
  radiusValue: number,
) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, cam));

  const frostedPass = new ShaderPass(frostedShader);
  frostedPass.uniforms.uResolution.value = new THREE.Vector2(width, height);
  frostedPass.uniforms.uRadius.value = radiusValue;
  composer.addPass(frostedPass);

  return { composer, frostedPass };
}

export default function Frosted({ isHome = false }: { isHome?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const radiusParams = useRef<GuiProps>({ offset: 30.0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const { clientWidth, clientHeight } = initCanvas(canvasRef.current);
    initGui(radiusParams.current, isHome);

    const { renderer, scene, cam } = initThreeBasics(
      canvasRef.current,
      clientWidth,
      clientHeight,
    );

    const mesh = createMesh();
    scene.add(mesh);
    renderer.render(scene, cam);

    const { composer, frostedPass } = initEffectPass(
      renderer,
      scene,
      cam,
      clientWidth,
      clientHeight,
      radiusParams.current.offset,
    );

    const mouse = new THREE.Vector2();
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const rect = canvasRef.current!.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1 - (e.clientY - rect.top) / rect.height;
      frostedPass.uniforms.uMouse.value.set(mouse.x, mouse.y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      frostedPass.uniforms.uRadius.value = radiusParams.current.offset;
      composer.render();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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
