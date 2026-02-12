// // import * as THREE from "three";
// // import {
// //   Line2,
// //   LineGeometry,
// //   LineMaterial,
// // } from "three/examples/jsm/Addons.js";

// // export namespace vol1S4 {
// //   export function sketchS4(scene: THREE.Scene) {
// //     const group = new THREE.Group();

// //     const ps: THREE.Vector3[] = [...Array(10)].map(
// //       (_, i) =>
// //         new THREE.Vector3(
// //           (Math.random() - 0.5) * 2,
// //           (Math.random() - 0.5) * 2,

// //           0,
// //         ),
// //     );
// //     const rots: number[] = [...Array(3)].map(() => Math.random() * 0.1);

// //     const setup = () => {
// //       const loopNum = 500;
// //       for (let i = 0; i < loopNum; i++) {
// //         const hen = i / loopNum;
// //         // const hen = Math.pow(norm, 0.5);
// //         // const p0 = new THREE.Vector3(-hen / 2, -hen / 2, 0);
// //         // const p1 = new THREE.Vector3(-hen / 2, +hen / 2, 0);
// //         // const p2 = new THREE.Vector3(+hen / 2, +hen / 2, 0);
// //         // const p3 = new THREE.Vector3(+hen / 2, -hen / 2, 0);

// //         // const point0 = new THREE.Vector3(p0.x * hen, p0.y * hen, 0);
// //         // const point1 = new THREE.Vector3(p1.x * hen, p1.y * hen, 0);
// //         // const point2 = new THREE.Vector3(p2.x * hen, p2.y * hen, 0);
// //         // const point3 = new THREE.Vector3(p3.x * hen, p3.y * hen, 0);
// //         const points: THREE.Vector3[] = [];
// //         for (let j = 0; j < 10; j++) {
// //           points[j] = new THREE.Vector3(ps[j].x * hen, ps[j].y * hen, 0);
// //         }
// //         // const katati: THREE.Vector3[] = [point0, point1, point2, point3];

// //         // const positions: number[] = [];
// //         // katati.forEach((v) => {
// //         //   positions.push(v.x, v.y, v.z);
// //         // });

// //         const curve = new THREE.CatmullRomCurve3(points, true);
// //         // const geometry = new THREE.TubeGeometry(
// //         //   curve,
// //         //   1000,
// //         //   // Math.random() * 0.001,
// //         //   Math.random() * 0.001,
// //         // );
// //         const geometry = new THREE.BoxGeometry(1.0 * hen, 1.0 * hen, 0.5 * hen);
// //         // const geometry = new THREE.TorusGeometry(0.1, 0.01);

// //         // const geometry = new LineGeometry().setPositions(positions);
// //         // const material = new LineMaterial({
// //         //   color: 0xffffff,
// //         //   linewidth: 3,
// //         // });
// //         const material = new THREE.MeshStandardMaterial({
// //           color: new THREE.Color().setHSL(0.0, 0, 1.0 - hen),
// //           // color: 0xffffff,
// //           wireframe: true,
// //           // blending: THREE.AdditiveBlending,
// //           transparent: true,
// //           // premultipliedAlpha: true,
// //           // opacity: Math.pow(1.0 - hen, 2),
// //           roughness: 0.9,
// //           metalness: 0.1,
// //         });

// //         // const line = new Line2(geometry, material);
// //         const line = new THREE.Mesh(geometry, material);
// //         // line.position.z = 0;
// //         line.rotateX(rots[0] * i);
// //         line.rotateY(rots[1] * i);
// //         line.rotateZ(rots[2] * i);
// //         group.add(line);
// //       }
// //       scene.add(group);
// //     };

// //     const update = (context: any) => {};

// //     return {
// //       get mesh() {
// //         return group;
// //       },
// //       setup,
// //       update,
// //     };
// //   }
// // }

// import * as THREE from "three";

// export namespace vol1S4 {
//   export function sketchS4(scene: THREE.Scene) {
//     const group = new THREE.Group();
//     let planeMesh: THREE.Mesh | null = null;

//     const setup = () => {
//       // フルスクリーンPlane
//       const geometry = new THREE.PlaneGeometry(
//         (1.0 * window.innerWidth) / window.innerHeight,
//         1.0,
//       );

//       const material = new THREE.ShaderMaterial({
//         uniforms: {
//           uTime: { value: 0.0 },
//           uResolution: {
//             value: new THREE.Vector2(window.innerWidth, window.innerHeight),
//           },
//           uBackgroundColor: { value: new THREE.Color(0x000000) }, // 青背景
//         },
//         vertexShader: `
//           varying vec2 vUv;

//           void main() {
//             vUv = uv;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//           }
//         `,
//         fragmentShader: `
//           uniform float uTime;
//           uniform vec2 uResolution;
//           uniform vec3 uBackgroundColor;

//           varying vec2 vUv;

//           struct Circle {
//             float index;
//             bool filled;
//           };

//           float rand1(float y) {
//             return fract(sin(y * 12.9898) * 43758.5453123);
//           }
//           float rand2(vec2 p) {
//             return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
//           }
//           vec2 getOffset2(vec2 p) {
//             return vec2(rand2(p) - 0.5, rand2(p*12.34) - 0.5);
//           }
//           vec2 getOffset1(float index) {
//             return vec2(rand1(index) - 0.5, rand1(index+12.34) - 0.5);
//           }
//           float floorRand(float t, float speed) {
//             return rand1(floor(t * speed));
//           }

//           vec3 hsl2rgb(vec3 hsl) {
//             float h = hsl.x;
//             float s = hsl.y;
//             float l = hsl.z;

//             vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
//             return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
//           }
//           vec2 rotatePos(vec2 p, float a) {
//             return p * mat2(cos(a), -sin(a), sin(a), cos(a));
//           }

//           void main() {
//             vec2 uv = vUv - 0.5;
//             uv.x *= uResolution.x / uResolution.y;

//             bool filled = false;
//             bool filled1 = false;
//             bool filled2 = false;
//             vec3 finalColor = vec3(0.0);
//             vec3 finalColor1 = vec3(0.0);
//             vec3 finalColor2 = vec3(0.0);
//             // vec3 finalColor = uBackgroundColor;

//             // uv += getOffset2(uv) * length(uv - offset) * 0.1;

//             // uv = rotatePos(uv, uTime * 0.1);

//             float loopNum = 10.0;
//             for(float i = 0.0; i < loopNum; i++) {
//               float r = pow(i / loopNum * 0.25, 0.8);
//               vec2 offset = getOffset1(i * 3.14 + floorRand(uTime, 2.0)) * 0.8;

//               vec2 baseUv = uv;
//               vec2 circleUv = baseUv;
//               vec2 circleUv1 = baseUv;
//               vec2 circleUv2 = baseUv;

//               circleUv2 = floor(circleUv2 * 1000.0) / 1000.0;

//               circleUv += getOffset2(circleUv + i) * pow(length(baseUv - offset), 1.1);
//               // circleUv1 += getOffset2(circleUv1 + i) * pow(length(baseUv - offset), 2.0);
//               // circleUv2 += getOffset2(circleUv2 + i) * pow(length(baseUv - offset), 10.0);
//               circleUv2 += getOffset2(circleUv2 + i) * 0.001;
//               circleUv1 += getOffset2(circleUv2 + i) * 0.01;

//               float circle = length(circleUv - offset) - r;
//               float circle1 = max(abs(circleUv1.x - offset.x), abs(circleUv1.y - offset.y)) - r;
//               float circle2 = min(abs(circleUv2.x - offset.x), abs(circleUv2.y - offset.y)) - 0.001;

//               if (circle < 0.0 && !filled) {
//                 vec3 circleColor = mod(i, 2.0) == 0.0 ? vec3(0.0) : vec3(1.0);
//                 filled = true;
//                 finalColor = circleColor;
//               }

//               if (abs(circle1) < 0.005 && !filled1) {
//                 vec3 circleColor = mod(i, 2.0) == 0.0 ? vec3(1.0) : vec3(0.0); // 白黒反転
//                 filled1 = true;
//                 finalColor1 = circleColor;
//               }

//               if (circle2 < 0.0 && !filled2) {
//                 vec3 circleColor = mod(i, 2.0) == 0.0 ? vec3(.0) : vec3(1.0);
//                 filled2 = true;
//                 finalColor2 = circleColor;
//               }

//               // uv = rotatePos(uv, 0.005 * (loopNum - i));
//             }

//             vec3 result = vec3(0.0);
//             if (filled) result = mix(result, finalColor, 1.0);
//             if (filled1) result = mix(result, finalColor1, 1.0); // 0.5 → 1.0 (線をはっきり)
//             if (filled2) result = mix(result, finalColor2, 0.5);

//             gl_FragColor = vec4(result * 3.0, 1.0);
//           }
//         `,
//         side: THREE.DoubleSide,
//       });

//       planeMesh = new THREE.Mesh(geometry, material);
//       group.add(planeMesh);
//       scene.add(group);
//     };

//     const update = (context: any) => {
//       if (!planeMesh || !(planeMesh.material instanceof THREE.ShaderMaterial)) {
//         return;
//       }

//       if (planeMesh && planeMesh.material instanceof THREE.ShaderMaterial) {
//         planeMesh.material.uniforms.uTime.value = context.time;
//       }
//     };

//     return {
//       get mesh() {
//         return group;
//       },
//       setup,
//       update,
//     };
//   }
// }

// import * as THREE from "three";
// import {
//   Line2,
//   LineGeometry,
//   LineMaterial,
// } from "three/examples/jsm/Addons.js";

// export namespace vol1S4 {
//   export function sketchS4(scene: THREE.Scene) {
//     const group = new THREE.Group();

//     const ps: THREE.Vector3[] = [...Array(10)].map(
//       (_, i) =>
//         new THREE.Vector3(
//           (Math.random() - 0.5) * 2,
//           (Math.random() - 0.5) * 2,

//           0,
//         ),
//     );
//     const rots: number[] = [...Array(3)].map(() => Math.random() * 0.1);

//     const setup = () => {
//       const loopNum = 500;
//       for (let i = 0; i < loopNum; i++) {
//         const hen = i / loopNum;
//         // const hen = Math.pow(norm, 0.5);
//         // const p0 = new THREE.Vector3(-hen / 2, -hen / 2, 0);
//         // const p1 = new THREE.Vector3(-hen / 2, +hen / 2, 0);
//         // const p2 = new THREE.Vector3(+hen / 2, +hen / 2, 0);
//         // const p3 = new THREE.Vector3(+hen / 2, -hen / 2, 0);

//         // const point0 = new THREE.Vector3(p0.x * hen, p0.y * hen, 0);
//         // const point1 = new THREE.Vector3(p1.x * hen, p1.y * hen, 0);
//         // const point2 = new THREE.Vector3(p2.x * hen, p2.y * hen, 0);
//         // const point3 = new THREE.Vector3(p3.x * hen, p3.y * hen, 0);
//         const points: THREE.Vector3[] = [];
//         for (let j = 0; j < 10; j++) {
//           points[j] = new THREE.Vector3(ps[j].x * hen, ps[j].y * hen, 0);
//         }
//         // const katati: THREE.Vector3[] = [point0, point1, point2, point3];

//         // const positions: number[] = [];
//         // katati.forEach((v) => {
//         //   positions.push(v.x, v.y, v.z);
//         // });

//         const curve = new THREE.CatmullRomCurve3(points, true);
//         // const geometry = new THREE.TubeGeometry(
//         //   curve,
//         //   1000,
//         //   // Math.random() * 0.001,
//         //   Math.random() * 0.001,
//         // );
//         const geometry = new THREE.BoxGeometry(1.0 * hen, 1.0 * hen, 0.5 * hen);
//         // const geometry = new THREE.TorusGeometry(0.1, 0.01);

//         // const geometry = new LineGeometry().setPositions(positions);
//         // const material = new LineMaterial({
//         //   color: 0xffffff,
//         //   linewidth: 3,
//         // });
//         const material = new THREE.MeshStandardMaterial({
//           color: new THREE.Color().setHSL(0.0, 0, 1.0 - hen),
//           // color: 0xffffff,
//           wireframe: true,
//           // blending: THREE.AdditiveBlending,
//           transparent: true,
//           // premultipliedAlpha: true,
//           // opacity: Math.pow(1.0 - hen, 2),
//           roughness: 0.9,
//           metalness: 0.1,
//         });

//         // const line = new Line2(geometry, material);
//         const line = new THREE.Mesh(geometry, material);
//         // line.position.z = 0;
//         line.rotateX(rots[0] * i);
//         line.rotateY(rots[1] * i);
//         line.rotateZ(rots[2] * i);
//         group.add(line);
//       }
//       scene.add(group);
//     };

//     const update = (context: any) => {};

//     return {
//       get mesh() {
//         return group;
//       },
//       setup,
//       update,
//     };
//   }
// }

import * as THREE from "three";

export namespace vol1S4 {
  export function sketchS4(scene: THREE.Scene) {
    const group = new THREE.Group();
    let planeMesh: THREE.Mesh | null = null;

    const setup = () => {
      // フルスクリーンPlane
      const geometry = new THREE.PlaneGeometry(
        (1.0 * window.innerWidth) / window.innerHeight,
        1.0,
      );

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.0 },
          uBpmCount: { value: 0.0 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
          uBackgroundColor: { value: new THREE.Color(0x000000) },
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec2 uResolution;
          uniform vec3 uBackgroundColor;
          uniform float uBpmCount;

          varying vec2 vUv;

          struct Circle {
            float index;
            bool filled;
          };

          float rand1(float y) {
            return fract(sin(y * 12.9898) * 43758.5453123);
          }
          float rand2(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          vec2 getOffset2(vec2 p) {
            return vec2(rand2(p) - 0.5, rand2(p*12.34) - 0.5);
          }
          vec2 getOffset1(float index) {
            return vec2(rand1(index) - 0.5, rand1(index+12.34) - 0.5);
          }
          float floorRand(float t, float speed) {
            return rand1(floor(t * speed));
          }

          vec3 hsl2rgb(vec3 hsl) {
            float h = hsl.x;
            float s = hsl.y;
            float l = hsl.z;

            vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
            return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
          }
          vec2 rotatePos(vec2 p, float a) {
            return p * mat2(cos(a), -sin(a), sin(a), cos(a));
          }

          void main() {
            vec2 uv = vUv - 0.5;
            uv.x *= uResolution.x / uResolution.y;

            bool filled = false;
            bool filled1 = false;
            bool filled2 = false;
            vec3 finalColor = vec3(0.0);
            vec3 finalColor1 = vec3(0.0);
            vec3 finalColor2 = vec3(0.0);
            // vec3 finalColor = uBackgroundColor;

            // uv += getOffset2(uv) * length(uv - offset) * 0.1;

            // uv = rotatePos(uv, uTime * 0.1);

            float loopNum = 20.0;
            for(float i = 0.0; i < loopNum; i++) {
              float r = pow(i / loopNum * 0.25, 0.8);
              vec2 offset = getOffset1(i * 3.14 + uBpmCount) * 0.8;

              vec2 baseUv = uv;
              vec2 circleUv = baseUv;


              circleUv += getOffset2(circleUv + i) * pow(length(baseUv - offset), 1.1);

              float circle = length(circleUv - offset) - r;

              if (circle < 0.0 && !filled) {
                vec3 circleColor = mod(i, 2.0) == 0.0 ? vec3(0.0) : vec3(1.0);
                filled = true;
                finalColor = circleColor;
              }


            }

            gl_FragColor = vec4(finalColor * 3.0, 1.0);
          }
        `,
        side: THREE.DoubleSide,
      });

      planeMesh = new THREE.Mesh(geometry, material);
      group.add(planeMesh);
      scene.add(group);
    };

    const update = (context: any) => {
      if (!planeMesh || !(planeMesh.material instanceof THREE.ShaderMaterial)) {
        return;
      }

      if (planeMesh && planeMesh.material instanceof THREE.ShaderMaterial) {
        planeMesh.material.uniforms.uBpmCount.value = context.bpmCount;
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
