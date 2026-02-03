import * as THREE from "three";

export namespace vol1S1 {
  export function sketchS1(scene: THREE.Scene) {
    const group = new THREE.Group();
    const lines: THREE.Line[] = [];

    const setup = () => {
      for (let i = 0; i < 20; i++) {
        const points = [];

        for (let j = 0; j < 10000; j++) {
          if (j == 0) {
            // const start = new THREE.Vector3(0, 0, 0);
            const start = new THREE.Vector3(
              (Math.random() - 0.5) * 1.0,
              (Math.random() - 0.5) * 1.0,
              (Math.random() - 0.5) * 1.0,
              // 0.0,
            )
              .normalize()
              .multiplyScalar(0.5);
            points.push(start);
            continue;
          }
          const prev: THREE.Vector3 = points[j - 1];
          const diff = Math.random() > 0.005 ? 0.01 : 0.1;
          const offset = new THREE.Vector3(
            (Math.random() - 0.5) * diff,
            (Math.random() - 0.5) * diff,
            (Math.random() - 0.5) * diff,
            // 0,
          );
          let point = new THREE.Vector3().addVectors(prev, offset);
          const dist = point.length();
          if (dist > 0.5) {
            point.multiplyScalar(0.5 / dist);
          }
          points.push(point);
        }

        // const curve = new THREE.CatmullRomCurve3(points, false);
        // const geometry = new THREE.TubeGeometry(curve, 10000, 0.001, 32);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHSL(
            0.0,
            0.0,
            // Math.random(),
            Math.random() > 0.5 ? 1.0 : 0.0,
          ),
        });
        const line = new THREE.Line(geometry, material);
        line.scale.set(1.2, 1.2, 1.2);
        // mesh.visible = false
        line.geometry.setDrawRange(0, 0);
        lines.push(line);
        group.add(line);
        // scene.add(line);
      }
      scene.add(group);
    };
    const update = (context: any) => {
      // scene.rotateY(Math.cos(context.time) * 0.01);
      // scene.rotateX(0.01);
      // scene.rotateZ(0.005);

      const count = Math.floor(Math.abs(Math.sin(context.time * 1.0) * 10000));
      lines.forEach((line, i) => {
        line.geometry.setDrawRange(0, count);
        line.rotateX(0.01);
        line.rotateZ(0.005);
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
