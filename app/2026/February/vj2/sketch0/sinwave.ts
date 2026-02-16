import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export function vj2SinWave(scene: THREE.Scene) {
  const group = new THREE.Group();
  let lines: THREE.Mesh[] = [];

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const init = () => {
    const positions = new Float32Array(256 * 3);
    const geometry = new MeshLineGeometry();
    geometry.setPoints(positions);
    const mat = new MeshLineMaterial({
      color: 0xffffff,
      lineWidth: 0.01,
      resolution: new THREE.Vector2(WIDTH, HEIGHT),
    });
    mat.transparent = true;
    const mesh = new THREE.Mesh(geometry, mat);
    lines.push(mesh);
    group.add(mesh);
    scene.add(group);
  };

  const update = (props: any) => {
    const positions = new Float32Array(256 * 3);
    for (let i = 0; i < 256; i++) {
      positions[i * 3] = (i / 256) * 2 - 1;
      const de = Math.abs((i / 256) * 2 - 1);
      const d = Math.sin(props.time) * 5;
      // const d = props.time % 5;
      positions[i * 3 + 1] =
        props.projectionBuffer[i] * Math.exp(-5 * de) * 2.5;
      positions[i * 3 + 2] = 0;
      (lines[0].geometry as MeshLineGeometry).setPoints(positions);
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
