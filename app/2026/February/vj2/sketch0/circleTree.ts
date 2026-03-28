import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export function vj2CircleTree(scene: THREE.Scene) {
  const group = new THREE.Group();
  let lines: THREE.Mesh[] = [];

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const startPoints = 20;

  const init = () => {
    for (let i = 0; i < startPoints; i++) {
      const positions = new Float32Array(1000 * 3);
      const geo = new MeshLineGeometry();
      geo.setPoints(positions);
      const mat = new MeshLineMaterial({
        resolution: new THREE.Vector2(WIDTH, HEIGHT),
        color: 0xffffff,
        lineWidth: 0.003,
      });
      const mesh = new THREE.Mesh(geo, mat);
      lines.push(mesh);
      group.add(mesh);
    }
    scene.add(group);
  };

  const update = (props: any) => {
    if (props.onBeat) {
      lines.forEach((line, i) => {
        const positions = new Float32Array(1000 * 3);

        const radius = (props.bpmCount % 4) * 0.1;

        for (let j = 0; j < 1000; j++) {
          if (j == 0) {
            const x = Math.sin((i / startPoints) * 6.28) * radius;
            const y = Math.cos((i / startPoints) * 6.28) * radius;
            positions[j * 3] = x;
            positions[j * 3 + 1] = y;
            positions[j * 3 + 2] = 0;
          } else {
            const prevIndex = j - 1;
            const diff = Math.random() > 0.8 ? 0.01 : 0.03;
            let x = positions[prevIndex * 3] + (Math.random() - 0.5) * diff;
            let y = positions[prevIndex * 3 + 1] + (Math.random() - 0.5) * diff;

            const dist = Math.sqrt(x * x + y * y);
            if (dist < radius) {
              x = (x / dist) * radius;
              y = (y / dist) * radius;
            }

            positions[j * 3] = x;
            positions[j * 3 + 1] = y;
            positions[j * 3 + 2] = 0;
          }
        }
        (line.geometry as MeshLineGeometry).setPoints(positions);
      });
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
