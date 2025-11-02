import * as THREE from "three";

export const frostedShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: null },
    uRadius: { value: null },
    uMouse: { value: new THREE.Vector2() },
  },
  vertexShader: `
    out vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;

    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uRadius;
    uniform vec2 uMouse;

    in vec2 vUv;

    float rand(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p.x * p.y) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      float min_res = min(uResolution.x, uResolution.y);
      vec2 normalizedCoord = (gl_FragCoord.xy * 2.0 - uResolution) / min_res;

      vec2 normalizedMouse = uMouse * 2.0 - 1.0;
      normalizedMouse *= uResolution / min_res;

      float dist = distance(normalizedMouse, normalizedCoord);
      float area = 0.5;

      if(dist >= area) {
        vec2 randomOffset = vec2(
          rand(uv) * 2.0 - 1.0,
          rand(vec2(uv.y, uv.x)) * 2.0 - 1.0
        );
        vec2 distortedCoord = uv + randomOffset * uRadius / uResolution;
        gl_FragColor  = texture2D(tDiffuse, distortedCoord);
      } else {
        gl_FragColor = texture2D(tDiffuse, uv);
      }


      // gl_FragColor = vec4(vec3(rand(uv)), 1.0);
    }
  `,
};
