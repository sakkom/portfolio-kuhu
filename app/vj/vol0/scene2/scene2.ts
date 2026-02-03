export const scene2Shader = {
uniforms : {
uTime : { value : 0.0 },
uRms : { value : null },
uZcr : { value : null },
uRmsTime : { value : null },
uResolution : { value : null },
uLoopNum : { value : null },
uSaturation : { value : null },
uLightness : { value : null },
uCircleSize : { value : null },
},
vertexShader : `
varying vec2 vUv;
uniform float uRms;
uniform float uZcr;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader : `
varying vec2 vUv;
uniform float uTime;
uniform float uRms;
uniform float uZcr;
uniform float uRmsTime;
uniform vec2 uResolution;
uniform float uLoopNum;
uniform float uCircleSize;
uniform float uSaturation;
uniform float uLightness;

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

float floorRand(float t, float speed) {
  return rand1(floor(t * speed));
}

vec2 lemniscate(float t, float scale) {
  float x = cos(t);
  float y = sin(t) * cos(t) * 1.0;
  return vec2(x, y) * scale;
}

//loopNum・minRadius・smoothstepで大きさのコントラストが決まっている
// midiでそれらを変化させると遊べそう。
// shapeの別バーションのsketchを用意してeffectorやシーン切り替えをしても面白そう
// circle -> line -> lineのように
void main() {
  vec2 uv = vUv - 0.5;
  // uv.x *= uResolution.x / uResolution.y;

  float metaball = 100.0;

  float loopNum = uLoopNum;
  float circleSize = uCircleSize;
  float saturation = uSaturation;
  float lightness = uLightness;

  vec2 pos = uv;
  for (float i = 0.0; i < loopNum; i++) {
    pos = rotatePos(pos, rand1(i + 1.0));
    float position = i + 1.0;
    vec2 move = lemniscate(uRmsTime + position, uRms);
    float minRadius = rand1(i + 1.0) * circleSize;
    float shape;
    shape = length(pos + move) - (minRadius);
    // shape = min(abs(pos.x - move.x), abs(pos.y - move.y));
    // float thinkness = mix(0.01, 0.05, shape);
    metaball = opSmoothUnion(metaball, shape, 0.03);
  }

  metaball = smoothstep(0.05, -0.05, metaball);
  float brightness = 2.0;
  vec3 color = hsl2rgb(vec3(metaball + uRmsTime, uSaturation, uLightness)) * brightness;
  vec3 metaballColor = metaball * color;

  // vec3 outSide = (1.0 - metaball) * hsl2rgb(vec3(uRmsTime, 1.0, 0.5));
  vec3 outSide = (1.0 - metaball) * vec3(0.0);

  vec3 finalCol = mix(outSide, metaballColor, metaball);
  gl_FragColor = vec4(vec3(finalCol), 1.0);
}
`,
} ;
