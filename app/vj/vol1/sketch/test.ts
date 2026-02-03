import * as THREE from "three";

export function testSketch0(scene: THREE.Scene) {
  let mesh: THREE.Mesh;

  const setup = () => {
    const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25, 50, 50, 50);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.5,
      emissive: 0x555555,
      emissiveIntensity: 1,
      wireframe: true,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(0.5, 0.75, 0.5);
    scene.add(mesh);
  };

  const update = (context: any) => {
    mesh.rotateZ(0.01);
    if (context.onBeat) {
      const scale = Math.random() + 1.0;
      // mesh.scale.set(scale, scale, scale);
    }
  };

  return {
    get mesh() {
      return mesh;
    },
    setup,
    update,
  };
}
export function testSketch1(scene: THREE.Scene) {
  let mesh: THREE.Mesh;

  const setup = () => {
    const geometry = new THREE.SphereGeometry(0.125, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.5,
      emissive: 0x555555,
      emissiveIntensity: 1,
      wireframe: true,
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  };

  const update = (ctx: any) => {
    mesh.rotateY(0.01);
    mesh.rotateX(0.01);
    mesh.rotateZ(0.01);
    if (ctx.onBeat) {
      const scale = Math.random() + 1.0;
      mesh.scale.set(scale, scale, scale);
    }
  };

  return {
    get mesh() {
      return mesh;
    },
    setup,
    update,
  };
}

export function testSketch2(scene: THREE.Scene) {
  let mesh: THREE.Mesh;

  const setup = () => {
    const geometry = new THREE.TorusGeometry(0.1, 0.05, 32, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.5,
      emissive: 0x555555,
      emissiveIntensity: 1,
      wireframe: true,
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  };

  const update = (ctx: any) => {
    mesh.rotateY(0.01);
    mesh.rotateX(0.01);
    mesh.rotateZ(0.01);

    if (ctx.onBeat) {
      const scale = Math.random() + 1.0;
      mesh.scale.set(scale, scale, scale);
    }
  };

  return {
    get mesh() {
      return mesh;
    },
    setup,
    update,
  };
}

export function testSketch3(scene: THREE.Scene) {
  let mesh: THREE.Mesh;

  const setup = () => {
    const geometry = new THREE.TorusKnotGeometry(0.1, 0.05, 32, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.5,
      emissive: 0x555555,
      emissiveIntensity: 1,
      wireframe: true,
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  };

  const update = (ctx: any) => {
    mesh.rotateY(0.01);
    mesh.rotateX(0.01);
    mesh.rotateZ(0.01);

    if (ctx.onBeat) {
      const scale = Math.random() + 1.0;
      mesh.scale.set(scale, scale, scale);
    }
  };

  return {
    get mesh() {
      return mesh;
    },
    setup,
    update,
  };
}

export function testSketch4(scene: THREE.Scene) {
  const group = new THREE.Group();
  let meshs: THREE.Mesh[] = [];
  let stopBuffer: number[] = new Array(200).fill(0);

  const setup = () => {
    for (let i = 0; i < 2; i++) {
      let points: THREE.Vector3[] = [];
      for (let j = 0; j < 200; j++) {
        const point = new THREE.Vector3(0, 0, 0);
        points.push(point);
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 1000, 0.01, 100);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.5,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      // mesh.position.set(
      //   Math.random() - 0.5,
      //   Math.random() - 0.5,
      //   Math.random() - 0.5,
      // );

      mesh.userData.points = points;
      meshs.push(mesh);
      group.add(mesh);
    }

    scene.add(group);
  };

  const update = (context: any) => {
    meshs.forEach((mesh, i) => {
      // mesh.rotateY(0.01);
      // mesh.rotateX(0.01);
      // mesh.rotateZ(0.01);
    });

    // let count = Math.floor(context.time * 1) % 1000;
    if (context.frameCount % 5 == 0) {
      stopBuffer = context.buffer;

      const scale = Math.random() + 1.0;
      meshs.forEach((mesh, i) => {
        const points: THREE.Vector3[] = mesh.userData.points;
        for (let j = 0; j < 200; j++) {
          if (i % 2 == 1) {
            points[j].set(
              j * 0.01 - (200 * 0.01) / 2,
              Math.sin(j * 0.5 + context.time) * stopBuffer[j] * 0.5,
              Math.cos(j * 0.5 + context.time) * stopBuffer[j] * 0.5,
            );
          } else {
            points[j].set(
              j * 0.1 - (200 * 0.1) / 2,
              Math.sin(-j * 0.5 + context.time) * stopBuffer[j] * 0.5,
              Math.cos(-j * 0.5 + context.time) * stopBuffer[j] * 0.5,
            );
          }
        }
        const curve = new THREE.CatmullRomCurve3(points);
        mesh.geometry.dispose();

        mesh.geometry = new THREE.TubeGeometry(curve, 1000, 0.005, 100);

        // mesh.scale.set(scale, scale, scale);
      });
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
