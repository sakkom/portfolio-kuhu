import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export function vj2Smoothwave(scene: THREE.Scene) {
  const group = new THREE.Group();
  let lines: THREE.Mesh[] = [];
  let smoothBuffer = new Float32Array(256).fill(0);

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  const aspect = WIDTH / HEIGHT;

  const linenum = 40;

  const init = () => {
    for (let i = 0; i < linenum; i++) {
      const positions = new Float32Array(256 * 3);
      const geometry = new MeshLineGeometry();
      geometry.setPoints(positions);
      const mat = new MeshLineMaterial({
        color: 0xffffff,
        lineWidth: 0.01,
        // dashArray: 0.5,
        // dashRatio: 0.5,
        opacity: 0,
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
    const buffer = props.oscillatorBuffer;

    for (let i = 0; i < buffer.length; i++) {
      smoothBuffer[i] = smoothBuffer[i] * 0.9 + buffer[i] * 0.1;
      // smoothBuffer[i] += (buffer[i] - smoothBuffer[i]) * 0.1;
    }

    lines.forEach((line, i) => {
      const mat = line.material as MeshLineMaterial;
      mat.opacity *= 0.98;
    });

    lines.forEach((line, k) => {
      const positions = new Float32Array(256 * 3);
      // (line.material as MeshLineMaterial).opacity = 1;

      for (let i = 0; i < 256; i++) {
        positions[i * 3] = (((i / 256) * 1.5 - 0.75) * 4) / 3;
        const de = Math.abs((i / 256) * 2 - 1);
        const de2 = Math.abs(((k + 1) / (linenum + 1)) * 2 - 1);
        const d = Math.sin(props.time) * 5;
        // const d = props.time % 5;
        // const yCurve = de * 2;
        const yOffset = ((k + 1) / (linenum + 1)) * 1.5 - 0.75;
        positions[i * 3 + 1] =
          ((k + 1) / (linenum + 1)) * 2 - 1 > 0.0
            ? smoothBuffer[i] * Math.exp(-de2 * 3 * de) * 2 + yOffset
            : -smoothBuffer[i] * Math.exp(-de2 * 3 * de) * 2 + yOffset;
        positions[i * 3 + 2] = 0;
      }
      (line.geometry as MeshLineGeometry).setPoints(positions);
    });

    if (props.onBeat) {
      lines.forEach((line) => {
        // (line.material as MeshLineMaterial).opacity = 1;
        const mat = line.material as MeshLineMaterial;
        mat.opacity = 1.0;
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
