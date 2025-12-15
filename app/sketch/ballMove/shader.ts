import * as THREE from "three";
export const ballMove = {
  uniforms: {
    uResolution: { value: new THREE.Vector2(0.0, 0.0) },
    uTime: { value: 0.0 },
  },
  vertexShader: `
precision mediump float;
uniform float uTime;
varying vec2 vUv;
varying vec3 vPos;

void main() {
  vUv = uv;
  vPos = position.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
  fragmentShader: `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

// float rand2(vec2 p) {
//   p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
//   return fract(sin(p.x * p.y) * 43758.5453123);
// }

//粒度を出す
float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv - 0.5;
  uv.x *= uResolution.x / uResolution.y;
  // uv *= sin(uv.x);
  vec2 offset = vec2((fract(uTime * .1) - 0.5) * 2.0, 0.0);
  float dist = length(uv - offset) - 0.3;
  float a = atan(uv.y, uv.x);
  // dist += sin(uv.y * 100.0) * 0.05;
  // vec2 blockUv = floor(uv * 500.0);
  float noise = rand2(uv) - 0.5;
  float s = smoothstep(1.0, -0.5, abs(dist));
  // vec3 col = vec3(s);
  // s += noise * 0.1 * dist;
  vec3 col = vec3(s);
  col += noise * 0.2;
  gl_FragColor = vec4(col, 1.0);
}

`,
};
