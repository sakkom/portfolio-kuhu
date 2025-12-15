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
  vec4 bgTex = texture2D(uTexture0, uv);
  float l = lumi(bgTex.rgb);
  vec3 newPosition = position;
  if (uLayer == 0.0) {
    // newPosition.z = l < 0.5 ? -1.0 : 1.0;
  } else {
    // newPosition.z = l < 0.5 ? 1.0 : -1.0;
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
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

void main() {
  vec2 uv = vUv;
  uv.x = abs(uv.x - 0.5) + 0.5;
  for (int i = 0; i < 5; i++) {
    vec3 col = texture2D(uTexture0, uv).rgb;
    float l = lumi(col);
    /*白と黒が隣り合う線形において再帰的に入れ替わる*/
    // uv.x += (l - 0.5) * 0.01;
    vec2 circle = vec2(cos(uTime), sin(uTime)) * 0.05;
    vec2 dir = normalize(uv - 0.5 + circle);
    uv += (l - 0.5) * dir * 0.5;
    float dist = length(uv - 0.5 + circle);
    float a = 1.0 - dist * (5.0 - float(i));
    mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
    uv = rot * (uv - 0.5) + 0.5;
  }
  vec3 finalCol = texture2D(uTexture0, uv).rgb;
  float l = lumi(finalCol);
  vec3 color = vec3(l);

  gl_FragColor = vec4(finalCol, 1.0);
}
` }
