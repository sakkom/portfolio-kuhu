import * as THREE from "three";

export namespace vol1S2 {
  export function sketchS2(scene: THREE.Scene) {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const setup = () => {
      for (let j = 0; j < 10; j++) {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i < 1000; i++) {
          const t = i / 1000.0;
          const theta = t * Math.PI;
          const phi = t * Math.PI * 10;
          const scale = (j + 1) * 0.1;
          const p = new THREE.Vector3(
            Math.sin(theta) * Math.cos(phi) * scale,
            Math.cos(theta) * scale,
            Math.sin(theta) * Math.sin(phi) * scale,
          );
          points.push(p);
        }
        const curve = new THREE.CatmullRomCurve3(points, false);
        const geometry = new THREE.TubeGeometry(
          curve,
          1000,
          0.001 * (j + 1),
          8,
        );
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(0, 0.0, 1.0 - (j * j) / 100.0),
          metalness: 0.5,
          roughness: 0.5,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.z = j;
        meshes.push(mesh);
        group.add(mesh);
      }
      scene.add(group);
    };

    const update = (context: any) => {
      meshes.forEach((m, i) => {
        m.rotation.y += 0.01;
        m.rotation.x += 0.01;

        // if (context.bpmCount % 30 === 0) {
        //   const scale = Math.random() * (2.0 - i * 0.1);
        //   m.scale.set(scale, scale, scale);
        // }
      });
      if (context.onBeat) {
        const scale = Math.random() * 2 + 0.1;
        group.scale.set(scale, scale, scale);
      }
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
