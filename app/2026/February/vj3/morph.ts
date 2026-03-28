import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export function vj3Morph(scene: THREE.Scene) {
  const group = new THREE.Group();
  let lines: THREE.Mesh[] = [];
  const aspect = window.innerWidth / window.innerHeight;
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  const loopNum = 128;

  const init = () => {
    for (let i = 0; i < loopNum; i++) {
      // const segment = Math.max(Math.floor(Math.random() * 5), 3);
      const segment = 2;
      const points = new Float32Array((segment + 1) * 3);

      for (let j = 0; j <= segment; j++) {
        points[j * 3] = Math.sin((j / segment) * 6.28) * 0.5;
        points[j * 3 + 1] = Math.cos((j / segment) * 6.28) * 0.5;
        points[j * 3 + 2] = 0;
      }

      const geo = new MeshLineGeometry();
      geo.setPoints(points);
      const mat = new MeshLineMaterial({
        color: 0xffffff,
        lineWidth: 0.01,
        resolution: new THREE.Vector2(WIDTH, HEIGHT),
      });
      const mesh = new THREE.Mesh(geo, mat);
      // mesh.position.z = i / loopNum;
      mesh.position.x = (i / loopNum) * 4 - 2;
      // mesh.rotateY(i / loopNum);
      mesh.rotateZ((i / loopNum) * 3);
      lines.push(mesh);
      group.add(mesh);
    }
    scene.add(group);
  };

  const clock = new THREE.Clock();
  let bpmCounter = 0;
  const update = (props: any) => {
    let time = clock.getElapsedTime();
    const segment = 3;

    const bpmCount = Math.floor(((props.bpm * 1) / 60) * props.time);
    const onBpmCount = bpmCounter != bpmCount;
    bpmCounter = bpmCount;

    const targetLine = Math.floor(Math.random() * loopNum);

    lines.forEach((line, i) => {
      const points = new Float32Array((segment + 1) * 3);

      // for (let j = 0; j <= segment; j++) {
      //   points[j * 3] =
      //     Math.sin((j / segment) * 6.28) *
      //     Math.max((Math.sin(props.time) * 0.5 + 0.5) * 1.5, 0.3);
      //   points[j * 3 + 1] =
      //     Math.cos((j / segment) * 6.28) *
      //     Math.max((Math.sin(props.time) * 0.5 + 0.5) * 1.5, 0.3);
      //   points[j * 3 + 2] = 0;
      // }
      for (let j = 0; j <= segment; j++) {
        points[j * 3] =
          Math.sin((j / segment) * 6.28) *
          Math.max((Math.sin(bpmCount * 0.5) * 0.5 + 0.5) * 2.0, 0.5);
        points[j * 3 + 1] =
          Math.cos((j / segment) * 6.28) *
          Math.max((Math.sin(bpmCount * 0.5) * 0.5 + 0.5) * 2.0, 0.5);
        points[j * 3 + 2] = 0;
      }
      (line.geometry as MeshLineGeometry).setPoints(points);

      let mat = line.material as MeshLineMaterial;
      mat.lineWidth += (0.01 - mat.lineWidth) * 0.9;
      // mat.color.lerp(new THREE.Color().setHSL(1.0, 1.0, 1.0), 0.1);
      // line.position.x += ((i / loopNum) * 2 - 1 - line.position.x) * 0.5;
      line.scale.x += (1 - line.scale.x) * 1.0;
      line.scale.y += (1 - line.scale.y) * 1;
      line.scale.z += (1 - line.scale.z) * 1;

      line.rotateZ(0.015);
      line.position.y = Math.sin((i / loopNum) * 10 + props.time) * 0.25;
      if (onBpmCount && i == targetLine) {
        // line.position.y = Math.random() * 2 - 1;
        // line.position.x = Math.random() * 2 - 1;
        let mat = line.material as MeshLineMaterial;
        // mat.lineWidth = 2;
        // line.scale.set(2, 2, 2);
        const colors = [0xff0000, 0x00ff00, 0x0000ff];
        // mat.color = new THREE.Color(colors[Math.floor(Math.random() * 3)]);
      }
      // mat.color = new THREE.Color().setHSL(
      //   (i / loopNum) * 0.25 + props.time * 0.25,
      //   0.75,
      //   0.25,
      // );

      // line.position.x = Math.cos(time) * ((i / loopNum) * 2 - 1);
      // line.position.y += Math.sin(time) * ((i / loopNum) * 2 - 1);
    });
    if (onBpmCount) {
      group.rotateZ(0.5);
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
