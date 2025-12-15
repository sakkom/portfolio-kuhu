import * as THREE from "three";

export const independentGlitch = {
  uniforms: {
    uResolution: { value: new THREE.Vector2(0.0, 0.0) },
    uTime: { value: 0.0 },
    uTex0: { value: null },
  },
  vertexShader: `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
  fragmentShader: `
uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTex0;
varying vec2 vUv;

// 回転行列
mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;
  // uv.x *= uResolution.x / uResolution.y;

  // float col = vec3(uv.x * uv.y);

  for (int i = 0; i < 100; i++) {
    // uv.x += sin(uv.y * 50.0) * fract(uTime) * 0.5 * sin(uTime);
    // uv.y += sin(uv.y * 50.0) * fract(uTime) * 0.1 * cos(uTime);

    float angle = atan(uv.y - 0.5, uv.x - 0.5);
    float dist = length(uv);
    vec2 sampleUv = vec2(dist, angle);
    // uv *= rot(angle);

    float randomX;

    float hatenaX = 5.0 * tan(uTime * 0.05) + 100.0 * cos(uTime);
    randomX = rand1(floor((uv.y + 1.0) * hatenaX)) * 100.0 * fract(uTime * 0.1) + 10.0;
    // randomX *= 1.0;
    uv.x = floor(uv.x * randomX) / randomX + 1.0;
    float hatenaY = 50.0 * tan(uTime * 0.01) + 10.0;
    float randomY = rand1(floor((vUv.x + 1.0) * hatenaY * randomX)) * 1000.0 * cos(uTime * 0.1) + 10.0;
    uv.y = floor(uv.y * randomY) / randomY;
    // uv.x = fract(-uTime * 1.0);
    // float absHatenaX = fract(uTime) * 2.0;
    float absHatenaX = 1.0;
    // uv.y = abs(vUv.y * absHatenaX);
    // uv *= rot(angle);
  }

  // 色
  float pattern = length(uv - 0.5);
  vec3 col = vec3(fract(pattern * 10.0 * fract(1.0 - uTime * .1) * 100.0 * cos(uTime * 0.1) + 1.0));
  float r = rand1(col.r);
  // if (r < 0.2) {
  //   col = vec3(1.0, 0.0, 0.0);
  // } else if (r < 0.4) {
  //   col = vec3(0.0, 1.0, 0.0);
  // } else if (r < 0.6) {
  //   col = vec3(1.0, 1.0, 0.0);
  // } else {
  //   col = col.r > 0.8 ? vec3(1.0) : vec3(0.0);
  // }
  col = col.r > 0.8 ? vec3(1.0) : vec3(0.0);

  gl_FragColor = vec4(col, 1.0);
  // gl_FragColor = texture2D(uTex0, uv);
}
`,
};
