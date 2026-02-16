export const OsiShader = {
  uniforms: {
    uTime: { value: 0.0 },
    uAudioBuffer: { value: null },
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
uniform float uTime;
uniform sampler2D uAudioBuffer;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

vec3 getOffset(float s) {
  return vec3(
    rand1(s),
    rand1(s + 1.23),
    rand1(s + 4.56)
  );
}

mat3 rotateX(float angle) {
  float c = cos(angle), s = sin(angle);
  return mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  );
}

mat3 rotateY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    c, 0., s,
    0., 1., 0.,
    -s, 0., c
  );
}

mat3 rotateZ(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}
vec2 rotatePos(vec2 p, float a) {
  return p * mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main() {
  vec2 uv = vUv;

  float size = rand2(floor(uv * 20.)) * 20.;
  vec2 blockUv = floor(uv * size) / size;
  float audio = texture2D(uAudioBuffer, blockUv).r;
  float line = abs((uv.y-.5) - audio * 1.0);
  // // float col = 1.-smoothstep(-0.1, 0.1, line);
  float col = step(line, 0.1);

  // float size = rand2(floor(uv * 20.)) * 100.;
  // vec2 blockUv = floor(uv * size) / size;

  float uvCol = rand2(blockUv);
  float mono = step(uvCol, 0.5);

  float finalCol = 0.;
  vec2 rectUv = uv-0.5;
  for(float i = 0.; i < 10.; i++) {
    float rect = max(abs(rectUv.x), abs(rectUv.y)) - i / 10. * 0.8;
    float col = step(abs(rect), 0.001);
    finalCol += col;
    rectUv = rotatePos(rectUv, i / 10. * 0.1);
    rectUv *= 1.05;
  }

  gl_FragColor = vec4(vec3(mono), 1.0);
}
`,
};
