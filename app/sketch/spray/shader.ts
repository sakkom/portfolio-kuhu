import * as THREE from "three" ;
export const waveMix = {
uniforms : {
uResolution : { value : new THREE . Vector2(0.0, 0.0)},
uTime : { value : 0.0 },
},
vertexShader : `
precision mediump float;
uniform float uTime;
varying vec2 vUv;

//https://help.autodesk.com/view/MAYAUL/2015/JPN/?guid=Shading_Nodes_Luminance
float lumi(vec3 color) {
  return dot(color, vec3(0.3, 0.59, 0.11));
}

mat3 rotateX(float angle) {
  float c = cos(angle), s = sin(angle);
  return mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  );
}

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader : `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;

float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

float rand2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p.x * p.y) * 43758.5453123);
}

float lumi(vec3 color) {
  return dot(color, vec3(0.3, 0.59, 0.11));
}

float simpleNoise(float x) {
  float i = floor(x);
  float f = fract(x);

  float a = rand1(i);
  float b = rand1(i + 1.0);

  float u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u);
}

float perlinNoise(float x) {
  float i = floor(x);
  float f = fract(x);

  float g0 = rand1(i) * 2.0 - 1.0;
  float g1 = rand1(i + 1.0) * 2.0 - 1.0;

  float n0 = g0 * f;
  float n1 = g1 * (f - 1.0);
  float u = f * f * (3.0 - 2.0 * f);

  return mix(n0, n1, u);
}

void main() {
  vec2 uv = vUv;
  uv = uv - 0.5;
  uv.x *= uResolution.x / uResolution.y;

  float pattern = 100.0;
  int closestLayer = 0;

  // uv.x = abs(uv.x);
  // uv = fract(uv * 2.0);
  for (int i = 0; i < 10; i++) {
    // uv -= float(i) / 20.0 * 0.1;
    vec2 offset = vec2(rand1(float(i + 1) * 100.0), rand1(float(i + 1) * 200.0)) - 0.5;
    offset *= abs(fract(uTime * 0.5)) - 0.5;
    offset *= 5.0;
    // uv.x += offset.x * sin(uTime * 1.0);
    // float dist = length(uv + offset);
    // uv.x = fract(uTime * 10.0);
    // vec2 sampleUv = floor(uv * 1000.0);
    float angle = atan(uv.y, uv.x);

    float dist1 = length(uv);
    // float dist2 = min(abs(uv.x + (fract(offset.x + uTime) - 0.5) * 50.0), abs(uv.y));
    float dist2 = max(abs(uv.x + offset.x), abs(uv.y + offset.y));
    // float dist2 = length(uv + offset) * (1.0 + abs(sin(angle * 5.0)) * 0.5);
    // float dist2 = min(abs(uv.x + offset.x), abs(uv.y + offset.y));
    float dist = mix(dist2, dist1, pow(sin(uTime * 0.5), 3.0));

    angle = angle < 0.0 ? angle + 6.28 : angle;
    angle += float(i) * 3.14;
    angle = mod(float(i), 2.0) == 0.0 ? angle + uTime * 0.5 : angle - uTime * 0.5;

    vec2 blockUv = floor(uv * 100.0);
    float n = rand2(blockUv);
    // float freq = float(i) / 10.0 * 10.0;
    // float freq = 100.0;
    // n *= ;
    // float time = i % 2 == 0 ? -uTime * 5.0 : uTime * 2.0;
    // float wave = 0.1 + (float(i) * 0.01) + pow(sin(angle * freq), 3.0) * 0.01;
    float wave = 0.05 + float(i) * 0.01;
    float time = mod(float(i), 2.0) == 0.0 ? uTime : -uTime;
    float y = pow(sin(angle * float(i + 1)), 3.0);
    // float amp = float(i) / 50.0;
    float amp = 0.1;
    y = y > 0.0 ? y * amp * 0.5 : y * amp;
    wave += y;

    float d = abs(dist - wave);

    if (d < pattern) {
      pattern = d;
      closestLayer = i;
    }
  }

  vec3 col;
  if (pattern < 0.002) {
    // col = vec3(1.0, 0.0, 0.0);
    // col = vec3(rand1(float(closestLayer)), rand1(float(closestLayer) + 10.0), rand1(float(closestLayer) + 10.0));
    // float i = float(closestLayer) / 100.0;
    // col = vec3(i);
    // col = vec3(1.0);
    col = closestLayer % 2 == 0 ? vec3(1.0) : vec3(0.0);
  } else if (pattern < 0.01) {
    float i = float(closestLayer) / 100.0;
    col = vec3(1.0 - i);
    // col = vec3(1.0);
    col = closestLayer % 2 == 0 ? vec3(0.0) : vec3(1.0);
  }
  else {
    col = vec3(0.0, 0.0, 0.0);
  }

  gl_FragColor = vec4(col, 1.0);
}
`,
} ;
