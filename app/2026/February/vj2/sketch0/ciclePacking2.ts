import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { OsiShader } from "./shader/osiShader";

export function vj2CirclePacking2(scene: THREE.Scene) {
  const group = new THREE.Group();
  let lines: THREE.Mesh[] = [];
  const circles: { x: number; y: number; r: number }[] = [];

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  const aspect = WIDTH / HEIGHT;

  const init = () => {
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() * 1 - 1) * aspect;
      const y = Math.random() * 2 - 1;

      let maxRadius = Math.random() * 1;
      for (const c of circles) {
        const d = Math.hypot(c.x - x, c.y - y) - c.r;
        maxRadius = Math.min(maxRadius, d);
      }
      const r = maxRadius;
      if (r >= 0.005) {
        circles.push({ x, y, r });
      }
    }

    for (const c of circles) {
      const segments = 50;
      const positions = new Float32Array((segments + 1) * 3);
      for (let i = 0; i <= segments; i++) {
        const a = ((i % segments) / segments) * 6.28;
        positions[i * 3] = Math.cos(a) * c.r;
        positions[i * 3 + 1] = Math.sin(a) * c.r;
        positions[i * 3 + 2] = 0;
      }
      const geometry = new MeshLineGeometry();
      geometry.setPoints(positions);
      const mat = new MeshLineMaterial({
        color: 0x000000,
        lineWidth: 0.03,
        opacity: 0,
        resolution: new THREE.Vector2(WIDTH, HEIGHT),
      });
      mat.transparent = true;
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(c.x, c.y, 0);
      lines.push(mesh);
      group.add(mesh);
    }
    scene.add(group);
  };

  const update = (props: any) => {
    lines.forEach((line) => {
      const s = line.scale;
      s.x += (1 - s.x) * 0.8;
      s.y += (1 - s.y) * 0.8;
    });

    /*軽くする */
    if (props.onBeat) {
      lines.forEach((line) => {
        line.geometry.dispose();
        (line.material as MeshLineMaterial).dispose();
        group.remove(line);
      });
      lines.length = 0;
      circles.length = 0;

      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 1.5 - 0.75;
        const y = Math.random() * 1.5 - 0.75;
        // const x = (Math.random() * 2 - 1) * aspect;
        // const y = Math.random() * 2 - 1;
        let maxR = 0.5;
        for (const c of circles) {
          maxR = Math.min(maxR, Math.hypot(c.x - x, c.y - y) - c.r);
        }
        if (maxR >= 0.005) circles.push({ x, y, r: maxR });
      }
      const maxCircle = circles.reduce((a, b) => (a.r > b.r ? a : b));

      for (const c of circles) {
        let mesh;
        if (maxCircle) {
          const segments = 50;
          // const segments = Math.max(Math.floor(Math.random() * 50), 2);
          const positions = new Float32Array((segments + 1) * 3);
          const d = 0.2;
          for (let i = 0; i <= segments; i++) {
            const randomDraw = Math.random() * 6.28;

            // const a = (i / segments) * Math.PI * 2;
            const a = randomDraw;
            positions[i * 3] = Math.cos(a) * c.r;
            positions[i * 3 + 1] = Math.sin(a) * c.r;
            positions[i * 3 + 2] = 0;
          }
          const geometry = new MeshLineGeometry();
          geometry.setPoints(positions);
          const mat = new MeshLineMaterial({
            color: 0xffffff,
            lineWidth: 0.005,
            opacity: 1,
            resolution: new THREE.Vector2(WIDTH, HEIGHT),
          });
          mat.transparent = true;
          const mesh = new THREE.Mesh(geometry, mat);
          mesh.position.set(c.x, c.y, 0);
          mesh.scale.set(0, 0, 1);
          lines.push(mesh);
          group.add(mesh);
        }
      }
    }
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
