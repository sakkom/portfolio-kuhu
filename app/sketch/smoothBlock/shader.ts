import * as THREE from "three" ;
export const smoothBlock = {
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

// float rand2(vec2 p) {
//   p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
//   return fract(sin(p.x * p.y) * 43758.5453123);
// }

float lumi(vec3 color) {
  return dot(color, vec3(0.3, 0.59, 0.11));
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43578.5453);
}

vec2 lemniscate(float t, float scale) {
  float x = cos(t);
  float y = cos(t) * sin(t);
  return vec2(x, y) * scale;
}

vec2 guruguru(float t, float scale) {
  float x = cos(t);
  float y = sin(t);
  return vec2(x, y) * scale;
}

/*[-0.5, 0.5]*/
vec2 setOffset(float fi) {
  float offsetX = rand1(fi * 151.2);
  float offsetY = rand1(fi * 341.3);
  return vec2(offsetX, offsetY) - 0.5;
}

float opSmoothUnion(float d1, float d2, float k) {
  k *= 4.0;
  float h = max(k - abs(d1 - d2), 0.0);
  return min(d1, d2) - h * h * 0.25 / k;
}

void main() {
  vec2 uv = vUv;
  uv = uv - 0.5;
  uv.x *= uResolution.x / uResolution.y;

  // vec3 col = vec3(0.0);
  // float loopNum = 10.0;
  // for (int i = 0; i < int(loopNum); i++) {
  //   float fi = float(i + 1);
  //   vec2 offset = setOffset(fi);
  //   offset *= 2.0;
  //   // offset.x += i % 2 == 0 ? sin(uTime * 0.1 * fi / loopNum) : cos(uTime * 0.1 * fi / loopNum);

  //   float baseRadius = rand1(fi) * 2.5;
  //   float radius = baseRadius * abs(cos(fi * uTime * 0.01));
  //   // float radius = 3.0;

  //   vec2 offsetUv = vec2(uv.x - offset.x, uv.y - 0.0);
  //   float t = i + 1 % 2 == 0 ? -uTime * 0.1 : uTime * 0.1;
  //   /*粒度noiseを付与*/
  //   offsetUv += vec2(rand2(offsetUv * 12.34), rand2(offsetUv * 56.78)) * 0.01;
  //   /*軌道を付与, range = 0.5*/
  //   offsetUv += guruguru(t * fi / loopNum, sin(t) * 0.0);

  //   float circleDist = length(offsetUv) - radius;
  //   // float circleDist = max(abs(offsetUv.x), abs(offsetUv.y)) - radius;

  //   float edge = smoothstep(0.1, -0.1, circleDist);
  //   float unique = fi / loopNum;
  //   float freq = abs(circleDist) * 1.0;
  //   vec3 ballColor = vec3(
  //       abs(sin(freq + uTime * 0.5)),
  //       abs(cos(freq * 2.0)),
  //       abs(cos(freq * 3.0))
  //     ) * 5.0;
  //   vec3 baseColor = vec3(1.0);
  //   vec3 mixColor = mix(baseColor, ballColor, 0.2);
  //   col += mixColor * edge / loopNum;
  // }

  vec3 col = vec3(0.0);
  float spacing = 0.5;

  float index = 0.0;
  float pattern = 100.0;
  for (float y = -1.0; y < 1.0; y += spacing) {
    for (float x = -1.0; x < 1.0; x += spacing) {
      vec2 offsetUv = uv - vec2(x, y);
      // offsetUv = floor(offsetUv * 100.0) / 100.0;
      offsetUv += vec2(rand2(offsetUv * 12.34), rand2(offsetUv * 56.78)) * 0.05;

      float l = length(uv);
      float baseRadius = fract(uTime * 0.01 * index) * 2.0;
      float radius = baseRadius * sin(index * offsetUv.x * 1.0) * cos(index * offsetUv.y * 1.0);

      float dist = length(offsetUv) - radius;
      // float dist = max(abs(offsetUv.x), abs(offsetUv.y)) - radius;

      float edge = smoothstep(0.4, -0.2, abs(dist));
      // float edge = step(abs(dist), 0.001);

      vec3 ballColor = vec3(
          abs(tan(dist + index * 8.0)),
          abs(cos(dist + index * 5.0 + uTime)),
          abs(cos(dist + index * 10.0))
        ) * 1.0;
      vec3 mixColor = mix(vec3(1.0), ballColor, 0.3);

      col += edge * mixColor;

      index += 1.0;
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
`,
} ;
