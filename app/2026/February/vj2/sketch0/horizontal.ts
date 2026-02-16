import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export function vj2Horizontal(scene: THREE.Scene) {
  const group = new THREE.Group();
  let lines: THREE.Mesh[] = [];
  let lastBeatIndex = -1;

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const init = () => {
    const num = 1000;
    for (let i = 0; i < num; i++) {
      const geometry = new MeshLineGeometry();
      const segment = 100;
      const positions = new Float32Array(segment * 3);
      for (let j = 0; j < segment; j++) {
        positions[j * 3] = (j / segment) * 4 - 2;
        positions[j * 3 + 1] = 0;
        positions[j * 3 + 2] = 0;
      }
      geometry.setPoints(positions);
      const mat = new MeshLineMaterial({
        color: 0xffffff,
        lineWidth: 0.005,
        opacity: 0,
        // dashArray: 0.1,
        // dashRatio: 0.05,
        resolution: new THREE.Vector2(WIDTH, HEIGHT),
      });
      mat.transparent = true;
      const mesh = new THREE.Mesh(geometry, mat);
      lines.push(mesh);
      group.add(mesh);
    }

    scene.add(group);
  };

  const update = (props: any) => {
    lines.forEach((line, i) => {
      line.position.y += (0 - line.position.y) * 0.0015;
      // (line.material as MeshLineMaterial).dashOffset += 0.01;
      if (Math.abs(line.position.y) < 0.0001) {
        (line.material as MeshLineMaterial).opacity = 0;
      }
    });
    const beatFloat = (props.bpm / 60) * props.time;
    const beatIndex = Math.floor(beatFloat * 3);
    if (beatIndex !== lastBeatIndex) {
      lastBeatIndex = beatIndex;
      const rand = Math.floor(Math.random() * lines.length);
      lines[rand].position.y = Math.random() > 0.5 ? 1 : -1;
      (lines[rand].material as MeshLineMaterial).opacity = 1;
      if (Math.random() > 0.5) {
        (lines[rand].material as MeshLineMaterial).color =
          new THREE.Color().setHSL(0, 0, Math.random());
      }
    }

    lines.forEach((line, i) => {});
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
