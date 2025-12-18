// // import * as THREE from "three" ;

// // export const curlnoise = {
// // uniforms : {
// // uResolution : { value : new THREE . Vector2(0.0, 0.0)},
// // uTime : { value : 0.0 },
// // },
// // vertexShader : `
// // out vec2 vUv;
// // void main() {
// //   // vUv = uv;
// //   vUv = position.xy;
// //   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// // }
// // `,
// // // fragmentShader : `
// // // uniform vec2 uResolution;
// // // uniform float uTime;
// // // in vec2 vUv;

// // // float rand1(float y) {
// // //   return fract(sin(y * 12.9898) * 43758.5453123);
// // // }

// // // float rand2(vec2 p) {
// // //   return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
// // // }

// // // // vec2 getDirection(vec2 p) {
// // // //   // return vec2(cos(p.x), sin(p.y));
// // // //   // return vec2(-p.y, p.x);
// // // //   // return vec2((rand1(p.x) - 0.5) * 2.0, (rand1(p.y) - 0.5) * 2.0);
// // // // }

// // // // float potential(vec2 p) {
// // // //   return sin(p.y) * cos(p.x);
// // // // }

// // // // void main() {
// // // //   vec2 uv = vUv;
// // // //   vec2 pos = uv;
// // // //   // for (int i = 0; i < 5; i++) {
// // // //   // vec2 blockUv = floor(uv * 10.0) / 10.0;
// // // //   vec2 direction = getDirection((uv + 0.5));
// // // //   pos += direction * 0.01;
// // // //   // }
// // // //   // float dist = length(pos - uv);
// // // //   // vec3 color = vec3(dist);
// // // //   vec3 color = vec3(direction * 0.5 + 0.5, 1.0);
// // // //   gl_FragColor = vec4(color, 1.0);
// // // // }
// // // float potential(vec2 p) {
// // //   // return sin(p.y) * cos(p.x);
// // //   return sin(p.x * 2.0) * cos(p.y * 2.0);
// // //   // float angle = atan(p.y, p.x);
// // //   // return length(vec2(cos(angle * 0.2) * 10.0, sin(angle * 0.1) * 10.0));
// // //   // return (rand2(p) - 0.5) * 2.0;
// // //   // return sin(p.x) + cos(p.y);
// // // }

// // // vec2 curl(vec2 p) {
// // //   float eps = 0.01;

// // //   float dx = (potential(p + vec2(eps, 0.0)) - potential(p - vec2(eps, 0.0))) / (2.0 * eps);
// // //   float dy = (potential(p + vec2(0.0, eps)) - potential(p - vec2(0.0, eps))) / (2.0 * eps);

// // //   return vec2(dy, -dx); // カール
// // // }

// // // void main() {
// // //   vec2 uv = vUv;
// // //   vec2 pos = uv;

// // //   for (int i = 0; i < 5; i++) {
// // //     vec2 dir = curl(pos * 30.0);
// // //     pos += dir * 0.01;
// // //   }

// // //   float dist = length(pos - uv);
// // //   vec3 color = vec3(dist * 3.0);

// // //   gl_FragColor = vec4(color, 1.0);
// // // }
// // // `,
// // } ;

// import * as THREE from "three" ;

// export const curlnoise = {
// uniforms : {
// uResolution : { value : new THREE . Vector2(0.0, 0.0)},
// uTime : { value : 0.0 },
// },
// vertexShader : `
// out vec2 vUv;
// void main() {
//   vUv = position.xy;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `,
// fragmentShader : `
// uniform vec2 uResolution;
// uniform float uTime;
// in vec2 vUv;

// // Simplex noise (必要に応じて実装)
// vec3 mod289(vec3 x) {
//   return x - floor(x * (1.0 / 289.0)) * 289.0;
// }
// vec2 mod289(vec2 x) {
//   return x - floor(x * (1.0 / 289.0)) * 289.0;
// }
// vec3 permute(vec3 x) {
//   return mod289(((x * 34.0) + 1.0) * x);
// }

// float snoise(vec2 v) {
//   const vec4 C = vec4(0.211324865405187, 0.366025403784439,
//       -0.577350269189626, 0.024390243902439);
//   vec2 i = floor(v + dot(v, C.yy));
//   vec2 x0 = v - i + dot(i, C.xx);
//   vec2 i1;
//   i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
//   vec4 x12 = x0.xyxy + C.xxzz;
//   x12.xy -= i1;
//   i = mod289(i);
//   vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
//         + i.x + vec3(0.0, i1.x, 1.0));
//   vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
//   m = m * m;
//   m = m * m;
//   vec3 x = 2.0 * fract(p * C.www) - 1.0;
//   vec3 h = abs(x) - 0.5;
//   vec3 ox = floor(x + 0.5);
//   vec3 a0 = x - ox;
//   m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
//   vec3 g;
//   g.x = a0.x * x0.x + h.x * x0.y;
//   g.yz = a0.yz * x12.xz + h.yz * x12.yw;
//   return 130.0 * dot(m, g);
// }

// // 多層ノイズでポテンシャル場を作る
// float potential(vec2 p) {
//   float n = 0.0;
//   float amp = 1.0;
//   float freq = 1.0;

//   // 4オクターブ重ねる
//   for (int i = 0; i < 4; i++) {
//     n += snoise(p * freq + uTime * 0.1) * amp;
//     freq *= 2.0;
//     amp *= 0.5;
//   }

//   return n;
// }

// // カールを計算
// vec2 curl(vec2 p) {
//   float eps = 0.01;
//   float dx = (potential(p + vec2(eps, 0.0)) - potential(p - vec2(eps, 0.0))) / (2.0 * eps);
//   float dy = (potential(p + vec2(0.0, eps)) - potential(p - vec2(0.0, eps))) / (2.0 * eps);
//   return vec2(dy, -dx);
// }

// void main() {
//   vec2 uv = vUv;
//   vec2 pos = uv;

//   // より多くの反復で流れを蓄積
//   for (int i = 0; i < 200; i++) {
//     vec2 dir = curl(pos * 1.0); // スケール調整
//     pos += dir * 0.001; // ステップサイズ調整
//   }

//   // 移動距離を可視化
//   float dist = length(pos - uv);

//   // 白と濃紺のグラデーション
//   vec3 darkBlue = vec3(0.1, 0.15, 0.3);
//   vec3 white = vec3(0.95, 0.96, 0.98);
//   vec3 color = mix(white, darkBlue, smoothstep(0.0, 0.5, dist * 8.0));

//   // コントラスト調整
//   color = pow(color, vec3(1.2));

//   gl_FragColor = vec4(color, 1.0);
// }
// `,
// } ;

import * as THREE from "three" ;

export const curlnoise = {
uniforms : {
uResolution : { value : new THREE . Vector2(0.0, 0.0)},
uTime : { value : 0.0 },
},
vertexShader : `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader : `
uniform vec2 uResolution;
uniform float uTime;
in vec2 vUv;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

vec2 filed(vec2 p) {
  float angle1 = sin(p.x * 1.0 + uTime) * cos(p.y * 1.5);
  float angle2 = cos(p.y * 2.0) * cos(p.x * 2.5);
  float angle = angle1 + angle2 * 2.0;

  return vec2(cos(angle), sin(angle));
}

vec2 rotate(vec2 dir, float a) {
  return dir * mat2(cos(a), -sin(a), sin(a), cos(a));
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  vec2 pos = uv;

  for (float i = 0.0; i < 10.0; i++) {
    // pos += rand2(pos) * 0.02;
    vec2 dir = filed(pos * 10.0);
    // dir = rotate(dir, fract(uTime * 0.1) * 6.28);
    pos += dir * 0.1;
  }

  float dist = length(pos - uv);

  gl_FragColor = vec4(vec3(dist, dist, dist), 1.0);
}
`,
} ;
