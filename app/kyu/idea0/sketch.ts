import * as THREE from "three";

export namespace kyuS0 {
  function edgeCircle(loopNum: number) {
    const points = [];
    // const radius = Math.random() * 0.05 * loopNum;

    for (let i = 0; i < 64; i++) {
      const radius = Math.random() * 0.01 * loopNum;

      let angle = (Math.PI * 2) / 64;
      angle = angle * i;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          // Math.random() * 2.0 - 1.0 * radius,
          0,
        ),
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(0.0, 0.0, Math.random()),
    });
    return new THREE.Line(geometry, material);
  }
  export function sketchKyu0(scene: THREE.Scene) {
    const group = new THREE.Group();
    const lines: THREE.Line[] = [];
    const indexRadius: number[] = [];
    const angles: number[] = [];
    const loopNumber: number[] = [];

    const setup = () => {
      for (let i = 0; i < 30; i++) {
        const loopNum = 1000;
        const radius = 0.1;
        for (let j = 0; j < loopNum; j++) {
          let angle = (Math.PI * 0.5) / loopNum;
          angle = angle * j;

          const line = edgeCircle((i + 1) / 50);

          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          line.position.set(x, y, 0);
          line.visible = false;
          lines.push(line);
          angles.push(angle);
          group.add(line);
          indexRadius.push(radius);
          loopNumber.push(i);
        }
      }
      scene.add(group);
    };

    const update = (ctx: any) => {
      if (!ctx.buffer) return;
      // if (!ctx.onBeat) return;
      lines.forEach((line, i) => {
        // const space =
        if (
          ctx.time > Math.pow(i / lines.length, 0.2) * 2.0 + 1.6 &&
          !line.visible
        ) {
          line.visible = true;
        }
        if (ctx.time > 4) {
          line.visible = false;
        }
        if (line.visible) {
          const amp = 0.1;
          const fractarl = 1000;
          const x =
            Math.cos(angles[i] + loopNumber[i]) *
            (indexRadius[i] + ctx.buffer[i % fractarl] * amp) *
            (loopNumber[i] / 10) *
            1;
          const y =
            Math.sin(angles[i] + loopNumber[i]) *
            (indexRadius[i] + ctx.buffer[i % fractarl] * amp) *
            (loopNumber[i] / 10) *
            1;
          line.position.set(x, y, line.position.z);
          // const scale = Math.random() * 2;
          // line.scale.set(scale, scale, scale);
        }
        // scene.rotateZ(i / 30);
        scene.rotateZ(0.1);
      });
    };

    return {
      get mesh() {
        return group;
      },
      setup,
      update,
    };
  }
}
