"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, ShaderPass } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { glitchShader } from "./shader";
import "@/app/styles/article.css";
import { setGui } from "../../utils/utils";

interface GuiProps {
  time: number;
  blockSize: number;
  blockSegment: number;
  lineSegment: number;
  lineHeight: number;
  lineWidth: number;
}

const guiProps: GuiProps = {
  time: 0,
  blockSegment: 5,
  blockSize: 100,
  lineSegment: 15,
  lineHeight: 30,
  lineWidth: 400,
};

function createMesh(width: number, height: number) {
  const meshs: THREE.Mesh[] = [];

  const loader = new THREE.TextureLoader();
  const texture = loader.load("/texture-img-04.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.TorusGeometry(80, 40, 50, 50);
  const material = new THREE.MeshPhongMaterial({
    // map: texture,
    color: 0x000000,
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);

  meshs.push(mesh);
  return meshs;
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
      .add(props, "blockSegment", 0, 50)
      .step(1)
      .onChange((value: number) => {
        uniforms.uBlockSegment.value = value;
      });
    blockLayer
      .add(props, "blockSize", 0, 300)
      .step(1)
      .onChange((value: number) => {
        uniforms.uBlockSize.value = value;
      });

    const lineLayer = gui.addFolder("Line Layer");
    lineLayer
      .add(props, "lineSegment", 0, 50)
      .step(1)
      .onChange((value: number) => {
        uniforms.uLineSegment.value = value;
      });
    lineLayer
      .add(props, "lineHeight", 0, 500)
      .step(1)
      .onChange((value: number) => {
        uniforms.uLineHeight.value = value;
      });
    lineLayer
      .add(props, "lineWidth", 0, 1000)
      .step(1)
      .onChange((value: number) => {
        uniforms.uLineWidth.value = value;
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
  light.position.set(1, 1, 1);
  scene.add(light);

  scene.background = new THREE.Color(0xfffff0);
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

  const glitchPass = new ShaderPass(glitchShader);
  composer.addPass(glitchPass);
  return { composer, glitchPass };
}

export default function Glitch({ isHome = false }: { isHome?: boolean }) {
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
    const meshs = createMesh(clientWidth, clientHeight);
    meshs.forEach((mesh) => scene.add(mesh));
    renderer.render(scene, cam);

    const { composer, glitchPass } = initEffectPass(renderer, scene, cam);
    glitchPass.uniforms.uResolution.value = new THREE.Vector2(
      clientWidth,
      clientHeight,
    );
    glitchPass.uniforms.uBlockSize.value = guiPropsRef.current.blockSize;
    glitchPass.uniforms.uBlockSegment.value = guiPropsRef.current.blockSegment;
    glitchPass.uniforms.uLineSegment.value = guiPropsRef.current.lineSegment;
    glitchPass.uniforms.uLineHeight.value = guiPropsRef.current.lineHeight;
    glitchPass.uniforms.uLineWidth.value = guiPropsRef.current.lineWidth;
    initGui(guiPropsRef.current, glitchPass.uniforms, isHome);

    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getDelta();

      guiPropsRef.current.time += time;
      glitchPass.uniforms.uTime.value = guiPropsRef.current.time;

      meshs.forEach((mesh) => {
        mesh.rotation.y += 0.01;
        mesh.rotation.x += 0.01;
        mesh.rotation.z += 0.01;
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
