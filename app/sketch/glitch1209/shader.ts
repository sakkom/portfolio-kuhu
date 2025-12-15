import * as THREE from "three" ;

export const gridSubdivision = {
uniforms : {
uTime : { value : 0.0 },
},
vertexShader : `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader : `
uniform float uTime;
varying vec2 vUv;

//粒度を出す
float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;

  // 正方形グリッド（例：10x10）
  vec2 grid = floor(uv * 10.0);

  // 各セルごとにランダムな色
  float colorVal = rand1(grid.x + grid.y * 10.0);
  vec3 col = vec3(colorVal);

  gl_FragColor = vec4(col, 1.0);
}
`,
} ;
