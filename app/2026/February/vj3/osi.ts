import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Vj3Props } from "./page";

export function vj3Osi(scene: THREE.Scene) {
  const group = new THREE.Group();
  const lines: THREE.Mesh[] = [];
  const lines2: THREE.Mesh[] = [];
  const aspect = window.innerWidth / window.innerHeight;
  let smoothBuffer = new Float32Array(256).fill(0);
  let buffer = new Float32Array(256);
  const loopNum = 256;

  const init = () => {
    const points = new Float32Array(loopNum * 2 * 3);

    for (let i = 0; i < loopNum; i++) {
      const geo = new MeshLineGeometry();

      geo.setPoints(points);
      const mat = new MeshLineMaterial({
        lineWidth: 0.005,
        color: 0xffffff,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      });
      const m = new THREE.Mesh(geo, mat);
      lines.push(m);
      group.add(m);
    }

    const geo = new MeshLineGeometry();

    geo.setPoints(points);
    const mat = new MeshLineMaterial({
      lineWidth: 0.02,
      color: 0x000000,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    });
    const m = new THREE.Mesh(geo, mat);
    lines2.push(m);
    group.add(m);

    scene.add(group);
  };

  const update = (props: Vj3Props) => {
    props.analyser.getFloatTimeDomainData(buffer);
    for (let i = 0; i < loopNum; i++) {
      smoothBuffer[i] = smoothBuffer[i] * 0.5 + buffer[i] * 0.5;
    }
    if (props.onBeat) {
      for (let i = 0; i < loopNum; i++) {
        const x = (i / loopNum) * 2 - 1.0;
        const y = buffer[i] * 2;
        const points = new Float32Array([0, 0, 0, x, y, 0]);
        (lines[i].geometry as MeshLineGeometry).setPoints(points);
      }
    }
    if (props.onBeat) {
      const points = new Float32Array(loopNum * 3);
      for (let i = 0; i < loopNum; i++) {
        points[i * 3] = (i / loopNum) * 2 - 1.0;
        points[i * 3 + 1] = buffer[i] * 2;
        points[i * 3 + 2] = 0;
        (lines2[0].geometry as MeshLineGeometry).setPoints(points);
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
