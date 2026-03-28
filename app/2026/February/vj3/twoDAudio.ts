import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Vj3Props } from "./page";

export function vj3TwoDAudio(scene: THREE.Scene) {
  const group = new THREE.Group();
  const aspect = window.innerWidth / window.innerHeight;
  let mesh: THREE.Mesh;
  /*texture用 */
  const byteCode = 512;
  const heightLine = 32;
  const linerBuffer = new Float32Array(byteCode);
  const dataBuffer = new Float32Array(byteCode * byteCode);

  const dataTex = new THREE.DataTexture(
    dataBuffer,
    byteCode,
    heightLine,
    THREE.RedFormat,
    THREE.FloatType,
  );
  dataTex.needsUpdate = true;

  const init = () => {
    const geo = new THREE.PlaneGeometry(2 * aspect, 2, byteCode, heightLine);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uAudioTexture: { value: dataTex },
        uTime: { value: null },
      },

      vertexShader: `
        uniform sampler2D uAudioTexture;
        out float uZValue;
        out float uY;
        out float uX;
        void main() {
          vec3 pos = position;
          float z = texture2D(uAudioTexture, uv).r;
          pos.z = z * 1.;
          uZValue = z;
          uY = pos.y;
          uX = pos.x;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,

      fragmentShader: `
      float rand1(float y) {
        return fract(sin(y * 12.9898) * 43758.5453123);
      }
        in float uZValue;
        in float uY;
        in float uX;
        uniform float uTime;

        void main() {
          float col = 1.-smoothstep(.1, -0.0, abs(uZValue));
          if(mod(uY * 8., 1.0) <= 0.05) {
            col = 1.0;
          }
          col *= 2.0;
          gl_FragColor = vec4(vec3(col), col);
        }
      `,
      wireframe: true,
    });
    const m = new THREE.Mesh(geo, mat);
    // mesh.rotateX(-0.785);
    mesh = m;
    group.add(m);
    scene.add(group);
  };

  let counter = 0;
  const clock = new THREE.Clock();
  const update = (props: Vj3Props) => {
    props.analyser.getFloatTimeDomainData(linerBuffer);
    dataBuffer.set(linerBuffer, counter * byteCode);
    counter++;
    if (counter >= heightLine) counter = 0;
    dataTex.needsUpdate = true;
    if (props.onBeat) {
      group.rotation.x -= 0.1;
    }
    (mesh.material as THREE.ShaderMaterial).uniforms.uTime.value =
      clock.getElapsedTime();
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
