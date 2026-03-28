import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { LineMaterial } from "three/examples/jsm/Addons.js";
import { rand } from "three/src/nodes/TSL.js";

export function MishinSketch0(scene: THREE.Scene) {
  const group = new THREE.Group();
  let lines: THREE.Mesh[] = [];

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  // const aspect = WIDTH / HEIGHT;
  const aspect = 4 / 3;

  const init = () => {
    const loopNum = 100;
    const kLoop = 8;

    for (let n = 0; n < 4; n++) {
      const nN = (n / 4) * 0.8 - 0.4;
      for (let k = 0; k < kLoop; k++) {
        const nK = (k + 0) / kLoop;

        const segment = Math.floor(nK * 8) + 2;

        const positions = new Float32Array((segment * segment + 1) * 3);
        const randOff = (Math.random() - 0.5) * 0.0;
        // const randOff2 = (Math.random() - 0.5) * 0.1;
        const randOff2 = Math.sin(nK * 6.28 * 2) * 0.0;
        const randOff3 = Math.cos(Math.pow(nK, 0.5) * 10) * 0.0;
        const start = Math.random();

        for (let i = 0; i <= loopNum; i++) {
          // const radius = Math.exp(-0.005 * (k + 1)) * 0.1;
          const radius = 0.1;
          // const radius = nK * 0.5;
          const xOffset = Math.exp(-0.1 * (k + 1)) - 0.7;
          // const randOff = Math.exp(-0.25 * (k + 1)) * 0.05;
          const randI = (Math.random() - 0.5) * (0.0 - i / loopNum) * 0.045;
          const randIY = (Math.random() - 0.5) * (0.0 - i / loopNum) * 0.045;
          positions[i * 3] =
            (Math.sin((i / segment) * 6.28 + start) * radius) / aspect +
            xOffset +
            randOff2 +
            randI;
          positions[i * 3 + 1] =
            Math.cos((i / segment) * 6.28 + start) * radius +
            randOff3 +
            randOff +
            nN +
            randIY;
          positions[i * 3 + 2] = 0;
        }

        const geo = new MeshLineGeometry();
        geo.setPoints(positions);
        const mat = new MeshLineMaterial({
          color: 0x000000,
          lineWidth: 0.005,
          // dashArray: 0.5,
          // dashRatio: 0.5,
          // opacity: Math.random() > 0.5 ? 0 : 1,
          // opacity: nK,
          resolution: new THREE.Vector2(WIDTH, HEIGHT),
        });
        mat.transparent = true;
        mat.depthTest = false;
        mat.depthWrite = false;
        const mesh = new THREE.Mesh(geo, mat);
        // mesh.rotateZ(nK * 6.28);
        // if (Math.random() > 0.5) {
        mesh.scale.set(2.2, 2.2, 2.2);
        lines.push(mesh);
        group.add(mesh);
        // }
      }
    }

    scene.add(group);
  };

  const update = (props: any) => {};
  // return {
  //   get mesh() {
  //     return group;
  //   },
  //   init,
  //   update,
  // };
  return {
    get mesh() {
      return group;
    },
    get lines() {
      return lines;
    }, // 追加
    init,
    update,
  };
}
