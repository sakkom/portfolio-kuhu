import * as THREE from "three" ;

export const sdfShader = {
uniforms : {
uResolution : { value : new THREE . Vector2(0.0, 0.0)},
uTime : { value : 0.0 },
uCamPos : { value : new THREE . Vector3(0.0)},
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
uniform vec3 uCamPos;
in vec2 vUv;

float sdSpherer(vec3 pos, float radius) {
  return length(pos) - radius;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdBoxFrame(vec3 p, vec3 b, float e) {
  p = abs(p) - b;
  vec3 q = abs(p + e) - e;

  return min(min(
      length(max(vec3(p.x, q.y, q.z), 0.0)) + min(max(p.x, max(q.y, q.z)), 0.0),
      length(max(vec3(q.x, p.y, q.z), 0.0)) + min(max(q.x, max(p.y, q.z)), 0.0)),
    length(max(vec3(q.x, q.y, p.z), 0.0)) + min(max(q.x, max(q.y, p.z)), 0.0)
  );
}

mat3 rotateX(float angle) {
  float c = cos(angle), s = sin(angle);
  return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

mat3 rotateY(float angle) {
  float c = cos(angle), s = sin(angle);
  return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}

mat3 rotateZ(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}

float sdVerticalCapsule(vec3 p, float h, float r) {
  p.y -= clamp(p.y, 0.0, h);
  return length(p) - r;
}

vec3 opRepetition(vec3 p, vec3 spacing) {
  // vec3 q = mod(p + spacing * 0.5, spacing) - spacing * 0.5;
  vec3 q = p - spacing * round(p / spacing);
  return q;
}

float rayMarch(vec3 ro, vec3 rd) {
  float t = 0.0;
  for (int i = 0; i < 100; i++) {
    /*Rx, Ryは+-空間でRzは必ず-空間なのでzは近くなる*/
    /*原点ベクトル->カメラからのベクトルに置き換える*/
    vec3 pos = ro + rd * t;
    vec3 repeatedPos = opRepetition(pos, vec3(5.0));
    vec3 rotatedPos = rotateX(uTime) * repeatedPos;
    // float dist = sdSpherer(rotatedPos, 0.5);
    // float dist = sdBox(rotatedPos, vec3(0.5));
    float dist = sdBoxFrame(rotatedPos, vec3(0.3), 0.005);
    // float dist = sdVerticalCapsule(rotatedPos, 0.3, 0.1);

    if (dist < 0.001) break;
    if (t > 100.0) break;

    t += dist;
  }

  return t;
}

void main() {
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;

  vec3 ro = uCamPos;
  vec3 screenPos = vec3(uv.x, uv.y, 0.0);
  /*zが-になるベクトルを持つここではカメラからz=-5の方向をもつ。*/
  vec3 rd = normalize(screenPos - ro);

  float t = rayMarch(ro, rd);

  vec3 color = vec3(0.0);
  if (t < 100.0) {
    color = vec3(1.0, 0.0, 0.0);
  }

  gl_FragColor = vec4(color, 1.0);
}
`,
} ;
