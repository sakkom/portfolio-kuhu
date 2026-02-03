export const wavesShader = {
uniforms : {
uTime : { value : 0.0 },
uResolution : { value : null },
uAudioTexture : { value : null },
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
uniform vec2 uResolution;
uniform sampler2D uAudioTexture;

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

vec2 rotatePos(vec2 p, float a) {
  return p * mat2(cos(a), -sin(a), sin(a), cos(a));
}

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;

  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}

float stepRand(float t, float speed) {
  return rand1(floor(t * speed));
}

vec2 arukimedesu(vec2 pos, float t) {
  return vec2(cos(t), sin(t)) * cos(-t * 0.1) * 0.3;
  float angle = atan(pos.y, pos.x);
  // return vec2(cos(t), sin(t)) * 0.5;
  // return vec2(mod(t, 4.0) - 2.0, 0.0);
}
vec2 getOffset2(vec2 p) {
  return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
}
vec2 getOffset1(float index) {
  return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
}

void main() {
  vec2 uv = vUv - 0.5;
  // uv += getOffset2(uv) * clamp(pow(abs(uv.y), .1), 0., .2);
  float audio1 = texture2D(uAudioTexture, uv + 0.5).r * 1.;

  uv.y += 0.5;
  uv.y = fract(uv.y * 100.);
  uv.y -= 0.5;
  // uv += getOffset2(uv) * pow(abs(uv.y), 1.);
  // uv += getOffset2(uv) * pow(abs(audio1), 0.8) * 0.5;
  // uv += getOffset2(floor(uv * 10.) / 10.) * 0.1;
  // uv += getOffset2(uv) * 0.5;

  float audio = texture2D(uAudioTexture, uv + 0.5).r * 10.;
  // float line = (uv.y - (step((audio), 0.0) - 0.5) * 0.1);
  // float line = (uv.y - (floor(audio * 100.) / 100.) * 0.5);
  float line = (uv.y - audio);
  float col = step(abs(line), 0.1);

  gl_FragColor = vec4(vec3(col) * 1.0 * hsl2rgb(vec3((audio * 0.5 + 0.5) * 1. + uTime * 0.1, 1., 0.5)), 1.0);
  // gl_FragColor = vec4(vec3(col) * hsl2rgb(vec3(0., 0., rand1(audio))), 1.0);
  // gl_FragColor = vec4(vec3(col), 1.0);
}
`,
} ;
