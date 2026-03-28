import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

const loopNum = 256;

export function vj2Radial(scene: THREE.Scene) {
  const group = new THREE.Group();
  let lines: THREE.Mesh[] = [];
  let smoothBuffer = new Float32Array(256).fill(0);
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  const aspect = WIDTH / HEIGHT;

  const init = () => {
    for (let i = 0; i < loopNum; i++) {
      const geometry = new MeshLineGeometry();
      geometry.setPoints([0, 0, 0, 0, 0, 0]);
      const material = new MeshLineMaterial({
        // color: new THREE.Color().setHSL(0, 0, i / loopNum),
        color: new THREE.Color().setHSL(0, 0, i / loopNum),
        lineWidth: 0.01,
        resolution: new THREE.Vector2(WIDTH, HEIGHT),
        // dashArray: 0.25,
        // dashRatio: 0.25,
      });
      material.transparent = true;
      material.depthTest = false;
      material.depthWrite = false;
      const mesh = new THREE.Mesh(geometry, material);
      lines.push(mesh);
      group.add(mesh);
    }
    scene.add(group);
  };

  const update = (props: any) => {
    const buffer = props.oscillatorBuffer;

    for (let i = 0; i < buffer.length; i++) {
      smoothBuffer[i] = smoothBuffer[i] * 0.98 + buffer[i] * 0.02;
      // smoothBuffer[i] += (buffer[i] - smoothBuffer[i]) * 0.1;
    }
    if (props.onBeat) {
      for (let i = 0; i < loopNum; i++) {
        (lines[i].material as MeshLineMaterial).dashOffset += 0.1;
      }
    }

    for (let i = 0; i < loopNum; i++) {
      const normalI = (i / (loopNum - 1)) * 6.28;
      const x = Math.cos(normalI) * smoothBuffer[i] * 15;
      const y = Math.sin(normalI) * smoothBuffer[i] * 15;
      // const x = normalI * 1.0 - 0.5;
      // const y = i % 2 ? smoothBuffer[i] * 0.5 * 10 : smoothBuffer[i] * 0.5 * 10;
      (lines[i].geometry as MeshLineGeometry).setPoints(
        [x, y, 0, 0, 0, 0],
        (p) => 1 - p,
      );
    }
    group.rotateZ(-0.01);
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
