import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

const pointsNum = 1024;

export function vj2CurveOscillator(scene: THREE.Scene) {
  const group = new THREE.Group();
  let lines: THREE.Mesh[] = [];
  let stopBuffers: Float32Array[] = Array.from({ length: 4 }, () =>
    new Float32Array(1024).fill(0),
  );

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const init = () => {
    for (let i = 0; i < 4; i++) {
      const positions = new Float32Array(pointsNum * 3);
      const geometry = new MeshLineGeometry();
      geometry.setPoints(positions);
      const material = new MeshLineMaterial({
        color: new THREE.Color().setHSL(0, 0, 1.0),
        lineWidth: 0.005,
        resolution: new THREE.Vector2(WIDTH, HEIGHT),
      });
      material.depthTest = false;
      material.depthWrite = false;

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(0, (i - 1.5) * 0.8, 0);

      mesh.rotateY((i / 4) * 3.14);
      mesh.scale.set(0.1, 0.1, 0.1);

      lines.push(mesh);
      group.add(mesh);
    }
    group.rotateZ(1.57);
    scene.add(group);
  };

  const update = (props: any) => {
    lines.forEach((line, i) => {
      line.rotateY(0.01);
      // line.scale.set(0.1, 0.2, 0.2);
      const s = line.scale;
      s.x += (0.1 - s.x) * 0.25;
      s.y += (0.2 - s.y) * 0.25;
      s.z += (0.2 - s.z) * 0.25;
    });
    // group.rotateY(0.01);
    //
    if (props.onBeat) {
      // const beat = props.bpmCount % 4;
      const beat = Math.floor(Math.random() * 4);
      stopBuffers[beat] = new Float32Array(props.oscillatorBuffer);
      lines[beat].scale.set(1, 1, 1);

      lines.forEach((line, j) => {
        const positions = new Float32Array(pointsNum * 3);
        const buffer = stopBuffers[j];
        for (let i = 0; i < pointsNum; i++) {
          positions[i * 3] = i * 0.01 - (pointsNum * 0.01) / 2;
          positions[i * 3 + 1] = Math.sin(i * 0.1) * Math.pow(buffer[i], 1) * 5;
          positions[i * 3 + 2] = Math.cos(i * 0.1) * Math.pow(buffer[i], 1) * 5;
        }
        (line.geometry as MeshLineGeometry).setPoints(positions, (p) => {
          const index = Math.floor(p * buffer.length - 1);
          return buffer[index] * 1.5 + 1;
        });
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
