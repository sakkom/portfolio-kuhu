import * as THREE from "three";

export namespace vol1S0 {
  function edgeCircle(loopNum: number) {
    const points = [];
    const radius = Math.random() * 0.1 * loopNum;

    for (let i = 0; i < 16; i++) {
      // const radius = Math.random() * 0.02 * loopNum;
      // const radius = Math.random() * 0.01;

      let angle = (Math.PI * 2) / 16;
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
  export function sketchS0(scene: THREE.Scene) {
    const group = new THREE.Group();
    const lines: THREE.Line[] = [];
    const indexRadius: number[] = [];
    const angles: number[] = [];
    const loopNumber: number[] = [];
    const smoothBuffer: number[] = [];

    const setup = () => {
      for (let i = 0; i < 13; i++) {
        const loopNum = 500;
        const radius = 0.3;
        for (let j = 0; j < loopNum; j++) {
          let angle = (Math.PI * 1.5) / loopNum;
          angle = angle * j;

          const line = edgeCircle((i + 1) / 50);

          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          line.position.set(x, y, 0);
          // line.visible = false;
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

      for (let i = 0; i < ctx.buffer.length; i++) {
        smoothBuffer[i] = (smoothBuffer[i] || 0) * 0.8 + ctx.buffer[i] * 0.2;
      }

      lines.forEach((line, i) => {
        const amp = 0.3;
        const fractarl = 500;
        const x =
          Math.cos(angles[i] + loopNumber[i]) *
          (indexRadius[i] + smoothBuffer[i % fractarl] * amp) *
          (loopNumber[i] / 10) *
          1.5;
        const y =
          Math.sin(angles[i] + loopNumber[i]) *
          (indexRadius[i] + smoothBuffer[i % fractarl] * amp) *
          (loopNumber[i] / 10) *
          1.5;
        line.position.set(x, y, line.position.z);
        // const scale = Math.random() * 2;
        // line.scale.set(scale, scale, scale);
      });
      group.rotateZ(0.05);
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
