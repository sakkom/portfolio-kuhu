import * as THREE from "three" ;

export const sdfShader = {
uniforms : {
uResolution : { value : new THREE . Vector2(0.0, 0.0)},
uTime : { value : 0.0 },
},
vertexShader : `
out vec2 vUv;
void main() {
  vUv = position.xy;
  gl_Position = vec4(position, 1.0);
}
`,
fragmentShader : `
uniform vec2 uResolution;
uniform float uTime;
in vec2 vUv;

float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}

float sdSquare(vec2 p, float size) {
  vec2 d = abs(p) - size;
  return max(d.x, d.y);
}

//https://iquilezles.org/articles/distfunctions/
float opSmoothUnion(float d1, float d2, float k) {
  k *= 4.0;
  float h = max(k - abs(d1 - d2), 0.0);
  return min(d1, d2) - h * h * 0.25 / k;
}

//PI/4の時に最小最大値の高さ♾️なる
vec2 lemniscate(float t, float scale) {
  float x = cos(t);
  float y = sin(t) * cos(t) * 1.0;
  return vec2(x, y) * scale;
}

mat2 rotate2D(float angle) {
  float c = cos(angle), s = sin(angle);
  return mat2(c, -s, s, c);
}

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;

  float dist = 100.0;
  for (int i = 1; i <= 10; i++) {
    float fi = float(i);
    float angle = hash(fi) * 6.28;
    //[1.0, 2.0]の範囲
    // float speed = 1.0 + fi * 0.1;
    float speed = 1.0 + hash(fi);
    //[0.3, 0.5]
    float scale = 0.3 + fi * 0.02;
    float radius = 0.2;

    vec2 offset = lemniscate(uTime * speed, scale);
    offset *= rotate2D(angle);
    float ballDist = sdCircle(uv + offset, radius);

    dist = opSmoothUnion(dist, ballDist, 0.1);
  }

  vec3 color;
  if (dist < 0.0) {
    float r = 0.2;
    color = vec3(1.0 - (abs(dist) / r));
  }
  else {
    color = vec3(1.0, 1.0, 1.0);
  }
  gl_FragColor = vec4(color, 1.0);
}
`,
} ;

// fragmentShader : `
// uniform vec2 uResolution;
// uniform float uTime;
// in vec2 vUv;

// float sdCircle(vec2 p, float radius) {
//   return length(p) - radius;
// }

// float sdSquare(vec2 p, float size) {
//   vec2 d = abs(p) - size;
//   return max(d.x, d.y);
// }

// float opUnion(float d1, float d2) {
//   return min(d1, d2);
// }

// float opOnion(in float sdf, in float thickness) {
//   return abs(sdf) - thickness;
// }

// /*
//       二つのベン図空間、反転した-空間とそのままの空間が合点するときがdist < 0が成立。
//       max()弾かれの概念。
//     */
// float opSubtraction(float d1, float d2) {
//   return max(-d1, d2);
// }

// float opIntersection(float d1, float d2) {
//   return max(d1, d2);
// }

// //https://iquilezles.org/articles/distfunctions/
// float opSmoothUnion(float d1, float d2, float k) {
//   k *= 4.0;
//   float h = max(k - abs(d1 - d2), 0.0);
//   return min(d1, d2) - h * h * 0.25 / k;
// }

// //PI/4の時に最小最大値の高さ♾️なる
// vec2 lemniscate(float t, float scale) {
//   float x = cos(t);
//   float y = sin(t) * cos(t) * 1.0;
//   return vec2(x, y) * scale;
// }

// mat2 rotate2D(float angle) {
//   float c = cos(angle), s = sin(angle);
//   return mat2(c, -s, s, c);
// }

// float hash(float n) {
//   return fract(sin(n) * 43758.5453123);
// }

// void main() {
//   vec2 uv = vUv;
//   uv.x *= uResolution.x / uResolution.y;

//   float dist = 100.0;
//   for (int i = 1; i <= 50; i++) {
//     float fi = float(i);
//     //1.0間隔で十分なランダム
//     float angle = hash(fi) * 6.28;
//     //[1.0, 2.0]の範囲
//     // float speed = 1.0 + fi * 0.1;
//     float speed = 1.0 + hash(fi);
//     //[0.3, 0.8]
//     float scale = 0.2 + fi * 0.05;
//     // float radius = 0.1 + fi * 0.005;
//     float radius = 0.15;

//     vec2 move = rotate2D(angle) * lemniscate(uTime * speed, scale);
//     float ballDist = sdCircle(uv + move, radius);
//     // float ballDist = sdSquare(uv + move, radius);

//     int maxLoop = int(floor(hash(fi) * 10.0));
//     for (int i = 0; i < 10; i++) {
//       if (i >= maxLoop) break;
//       float thickness = 0.1 - 0.01 * float(i);
//       ballDist = opOnion(ballDist, thickness);
//       /*disc風のビジュアル*/
//       // dist = opOnion(dist, thickness);
//     }

//     //thicknessでビジュアル変わる
//     dist = opSmoothUnion(dist, ballDist, 0.2);
//   }

//   for (int i = 0; i < 20; i++) {
//     float thickness = 0.2 - 0.01 * float(i);
//     dist = opOnion(dist, thickness);
//   }

//   vec3 color;
//   if (dist < 0.0) {
//     color = vec3(0.0, 0.0, 0.0);
// color = vec3(abs(dist)/0.1);
//
//   } else if (dist < 0.003) {
//     color = vec3(1.0);
//     // float glow = 0.01 / (dist + 0.01);
//     // color = vec3(0.2, 0.5, 1.0) * glow;
//   }
//   else {
//     color = vec3(0.0);
//   }
//   gl_FragColor = vec4(color, 1.0);
// }
//`
