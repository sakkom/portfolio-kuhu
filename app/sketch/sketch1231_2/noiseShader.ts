export const noiseShader = {
uniforms : {
uTime : { value : 0.0 },
tDiffuse : { value : null }
},
vertexShader : `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader : `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D tDiffuse;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

//https://iquilezles.org/articles/distfunctions/
float opSmoothUnion(float d1, float d2, float k) {
  k *= 4.0;
  float h = max(k - abs(d1 - d2), 0.0);
  return min(d1, d2) - h * h * 0.25 / k;
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv - 0.5;

  // float blockSize = 2.0 + rand1(floor(uTime * 8.0)) * 100.0;
  float blockSize = 25.0;

  uv.x -= 0.5;
  uv.x = floor(uv.x * blockSize) / blockSize;
  uv.x += 0.5;

  float noiseScale = 0.1;
  uv += (vec2(rand2(uv), rand2(uv + 12.34)) - 0.5) * noiseScale;

  gl_FragColor = texture2D(tDiffuse, uv + 0.5);
}
`,
} ;
