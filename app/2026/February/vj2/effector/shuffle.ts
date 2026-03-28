export const ShuffleUv = {
  uniforms: {
    tDiffuse: { value: null },
    uLevel: { value: 0.0 },
    uTime: { value: null },
    uBpmCount: { value: null },
  },
  vertexShader: `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
  fragmentShader: `
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uLevel;
uniform float uTime;
uniform float uBpmCount;

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;
  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}
float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}
vec2 getOffset1(float index) {
  return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float fieldCol(vec2 uv, float time) {
  float col = sin(uv.x * 1.2 + uTime * 0.5) * cos(uv.y * 2.3) + sin(uv.y * 3.4) * cos(uv.x * 4.5);
  float col3 = sin(uv.x * 3.1) * cos(uv.y * 9.3) + sin(uv.y * 0.4) * cos(uv.x * 2.5 + uTime * 1.5);
  float col2 = cos(uv.x) + sin(uv.y + uTime * 0.8);
  return col + col2 + col3 + uTime;
}
vec2 getOffset2(vec2 p) {
  return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
}

void main() {
  vec2 uv = vUv;
  // vec2 shiftUv = uv + (rand2(uv) - .5) * uLevel;
  // vec2 shiftUv = uv + (getOffset1(uBpmCount)) * uLevel;
  vec2 shiftUv = uv;
  float size = max(rand2(floor(uv * 10. + uBpmCount)) * 15., 5.);
  shiftUv += getOffset2(uBpmCount * floor(uv * size)) * uLevel;
  vec3 texColor = texture2D(tDiffuse, shiftUv).rgb;
  gl_FragColor = vec4(texColor, 1.0);
}`,
};
