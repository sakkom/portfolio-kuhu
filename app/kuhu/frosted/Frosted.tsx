"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, ShaderPass } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { frostedShader } from "./shader";
import "@/app/styles/article.css";
import { setGui } from "../../utils/utils";

export default function Frosted() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const radiusParams = useRef<{ offset: number }>({ offset: 5.0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const clientWidth = canvas.clientWidth;
    const clientHeight = canvas.clientHeight;
    canvas.width = clientWidth;
    canvas.height = clientHeight;

    const gui = setGui();
    gui.add(radiusParams.current, "offset").min(0).max(100).step(1);

    const renderer = new THREE.WebGLRenderer({ canvas });
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(
      45,
      clientWidth / clientHeight,
      0.1,
      1000,
    );
    scene.background = new THREE.Color(0x000000);
    cam.position.set(0, 0, 500);

    const light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 5;
    light.position.set(0, 0, 1);
    scene.add(light);

    const geometry = new THREE.PlaneGeometry(700, 500);
    const loader = new THREE.TextureLoader();
    const texture = loader.load("/texture-img-04.jpg");
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.render(scene, cam);

    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    composer.addPass(new RenderPass(scene, cam));

    const frostedPass = new ShaderPass(frostedShader);
    frostedPass.uniforms.uResolution.value = new THREE.Vector2(
      clientWidth,
      clientHeight,
    );
    frostedPass.uniforms.uRadius.value = radiusParams.current.offset;
    composer.addPass(frostedPass);

    const animate = () => {
      frostedPass.uniforms.uRadius.value = radiusParams.current.offset;
      composer.render();
      requestAnimationFrame(animate);
    };

    animate();

    const mouse = new THREE.Vector2();
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1 - (e.clientY - rect.top) / rect.height;
      frostedPass.uniforms.uMouse.value.set(mouse.x, mouse.y);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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
