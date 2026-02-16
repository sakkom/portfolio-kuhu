import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export function vj2Grid(scene: THREE.Scene) {
  const group = new THREE.Group();
  let lines: THREE.Mesh[] = [];

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const init = () => {
    const spacing = 0.35;
    const wCols = 4;
    const hCols = 3;
    const w = wCols * spacing;
    const h = hCols * spacing;

    for (let y = 0; y < hCols; y++) {
      for (let x = 0; x < wCols; x++) {
        const segments = 4;
        const positions = new Float32Array((segments + 1) * 3);
        for (let i = 0; i <= segments; i++) {
          const a = ((i % segments) / segments) * 6.28 + Math.PI / 4;
          positions[i * 3] = Math.cos(a) * 0.01;
          positions[i * 3 + 1] = Math.sin(a) * 0.01;
          positions[i * 3 + 2] = 0;
        }
        const geometry = new MeshLineGeometry();
        geometry.setPoints(positions);
        const mat = new MeshLineMaterial({
          color: 0xffffff,
          lineWidth: 0.03,
          opacity: 1,
          resolution: new THREE.Vector2(WIDTH, HEIGHT),
        });
        mat.transparent = true;
        const mesh = new THREE.Mesh(geometry, mat);
        const xPos = (x / (wCols - 1) - 0.5) * w;
        const yPos = (y / (hCols - 1) - 0.5) * h;
        mesh.position.set(xPos, yPos, 0);
        mesh.scale.set(0.001, 0.001, 0.001);
        lines.push(mesh);
        group.add(mesh);
      }
    }
    scene.add(group);
  };

  const update = (props: any) => {
    lines.forEach((line) => {
      const s = line.scale;
      s.x += (0 - s.x) * 0.8;
      s.y += (0 - s.y) * 0.8;
      s.z += (0 - s.z) * 0.8;
      const mat = line.material as MeshLineMaterial;
      mat.opacity += (0 - mat.opacity) * 0.1;
    });

    if (props.onBeat) {
      const loopNum = Math.floor(Math.random() * 4);
      for (let i = 0; i < loopNum; i++) {
        const target = Math.floor(Math.random() * 12);
        const s = 500;
        lines[target].scale.set(s, s, s);
        (lines[target].material as MeshLineMaterial).opacity = 1;
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
