import * as THREE from "three" ;
export const week2Shader = {
uniforms : {
uResolution : { value : new THREE . Vector2(0.0, 0.0)},
uTime : { value : 0.0 },
uLayer : { value : 0.0 },
uTexture0 : { value : null },
},
vertexShader : `
precision mediump float;
uniform sampler2D uTexture0;
uniform float uTime;
uniform float uLayer;
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
uniform sampler2D uTexture0;
varying vec2 vUv;

float lumi(vec3 color) {
  return dot(color, vec3(0.3, 0.59, 0.11));
}

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;

  uv = uv * 2.0 - 1.0;

  // uv.x *= uResolution.x / uResolution.y;
  uv.x += sin(uTime);
  uv.y += cos(uTime);

  // uv = abs(uv);

  // uv = fract(uv * 2.0);
  uv.x += tan(uTime * 10.0);

  vec3 col = vec3(0.0);

  float maxloop = rand1(uTime) * 50.0;
  for (int i = 0; i < 5; i++) {
    // if (float(i) > maxloop) break;

    // float angle = float(i) * 1.58;
    // float angle = 0.0;
    float angle = float(i + 1) * 10.0 + uTime;
    float freq = pow(10.0 * fract(uTime), 1.0);

    vec2 rotUv = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * uv;
    // float amp = sin(uTime * 5.0);
    float amp = fract(uTime * .1) * 1.0;
    float offset = fract(uTime);
    // float wave = sin(rotUv.x * freq) * sin(rotUv.x * freq) * sin(rotUv.x * freq) + fract(uTime) * 1.0;
    float wave = tan(rotUv.x * freq) * sin(uv.x * freq) + offset;
    wave *= amp;

    float line = abs(rotUv.y - wave);
    float lineVal = step(line, min(float(i) / 5.0 / 10.0, 0.1));
    // float lineVal = step(line, 0.01);
    vec3 color = vec3(abs(sin(uTime * 1.0)));
    col += lineVal;
  }

  gl_FragColor = vec4(vec3(col), 1.0);
}
`,
} ;
