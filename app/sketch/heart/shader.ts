import * as THREE from "three" ;

export const metaball2D = {
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
  float x = cos(t) * 0.5;
  float y = sin(t) * cos(t) * 0.5;
  return vec2(x, y) * scale;
}

mat2 rotate2D(float angle) {
  float c = cos(angle), s = sin(angle);
  return mat2(c, -s, s, c);
}

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float rand2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p.x * p.y) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;
  float offset = sin(length(uv) * 10.0) * 0.2;
  float offset2 = sin(uv.y * 10.0) * 0.1;
  float offset3 = mix(offset, offset2, sin(uTime));
  vec2 offset4 = sin(uv * 10.0) * 0.1;
  // uv += mix(offset4.x, offset, cos(uTime));

  uv += offset;
  float dist = 100.0;
  vec3 finalColor = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    float fi = float(i + 1);
    // float angle = hash(fi) * 6.28;
    float angle = float(i) * 10.0;
    //[1.0, 2.0]の範囲
    // float speed = 1.0 + fi * 0.1;
    float speed = hash(fi + 1.0);
    //[0.3, 0.5]
    float scale = 0.3 + fi * 0.5;
    float radius = 0.1 + fi / 5.0 * 0.5;
    // float radius = 0.3;

    vec2 offset = lemniscate(uTime * speed, scale);
    offset *= rotate2D(angle);
    float ballDist = sdCircle(uv + offset, radius);

    // vec3 ballColor = vec3(float(i) * 1.2, float(i) * 3.4, float(i) * 5.6);
    vec3 ballColor = vec3(
        hash(fi * 1.1),
        hash(fi * 2.3),
        hash(fi * 3.7)
      );
    float distColor = smoothstep(0.3, -0.1, ballDist);
    finalColor += distColor * ballColor;
    dist = opSmoothUnion(dist, ballDist, 0.1);
  }

  // vec3 color;
  // if (dist < 0.0) {
  //   float r = 0.2;
  //   // color = vec3(1.0 - (abs(dist) / r));
  //   color = vec3(abs(cos(1.0 - (abs(dist) / r) + uTime)) * 1.0, abs(sin(uTime * 1.0)) * 1.0, abs(tan(uTime * 0.1)) * 1.0);
  //   color = mix(vec3(1.0), color, 0.5);
  //   // color = finalColor;
  // }
  // else {
  //   // color = vec3(0.1, 0.1, 0.1);
  //   color = vec3(pow(dist, 3.0));
  // }
  // gl_FragColor = vec4(color, 1.0);
  // float mask = smoothstep(0.1, -0.1, dist);

  // float rDist = hash(dist) * 1.0;
  // dist += rDist;
  // vec3 insideColor = vec3(
  //     abs(cos(1.0 - (abs(dist) / 0.2) + uTime)),
  //     abs(sin(uTime * 1.0)),
  //     abs(tan(uTime * 0.1))
  //   );
  // insideColor = mix(vec3(1.0), insideColor, 0.2);

  // vec3 color = insideColor * mask;

  // gl_FragColor = vec4(color, 1.0);

  float mask = smoothstep(1.0, -1.0, abs(dist));

  // vec2 noiseUV = floor(uv * 500.0) / 500.0; // もっと細かく
  float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);

  vec3 insideColor = vec3(
      // abs(sin((abs(dist) / 0.5) + uTime))
      abs(sin(abs(dist) * 10.0)),
      abs(cos(abs(dist) * 5.0 + uTime * 0.5)),
      abs(sin(abs(dist) * 3.0))
    ) * 15.0;
  insideColor = mix(vec3(1.0), insideColor, 0.05);

  insideColor += (noise - 0.5) * 0.5;

  vec3 color = insideColor * mask;
  gl_FragColor = vec4(color, 1.0);
}
`,
} ;
