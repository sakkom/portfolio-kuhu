import * as THREE from "three" ;

export const metaball2D = {
uniforms : {
uResolution : { value : new THREE . Vector2(0.0, 0.0)},
uTime : { value : 0.0 },
},
vertexShader : `
out vec2 vUv;
void main() {
  vUv = uv;
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

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;

  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
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
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 orbit(float t) {
  vec2 p;
  p.x = mod(t, 3.0) - 1.5;
  p.y = (sin(t * 5.0)) * sin(t);
  return p;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.y *= uResolution.y / uResolution.x;
  vec2 pos = uv;

  vec3 balls = vec3(0.0);

  float finalColor = 100.0;
  float index = 0.0;

  float loopNum = 80.0;

  for (float i = 0.0; i < loopNum; i++) {
    float ni = (i + 1.0) / loopNum;
    float delay = i * 0.01;
    // vec2 offset = orbit(uTime + delay);
    float angle = hash(i) * 6.28;
    //startの調整
    float start = 1.5;
    float speed = uTime * 3.0;
    float scale = (sin(speed * ni + start) * 0.5 + 0.5);
    vec2 offset = vec2(cos(angle), sin(angle)) * scale;

    //pos noise
    vec2 noiseOffset = vec2(rand2(pos * 12.34), rand2(pos * 56.78)) - 0.5;
    pos += noiseOffset * 0.005;

    float lightness;
    if (hash(uTime) > 0.6 && uTime > 3.5 && mod(uTime, 5.0) > 2.5) {
      // vec2 noiseOffset = vec2(rand2(pos * 12.34), rand2(pos * 56.78)) - 0.5;
      // pos += noiseOffset * 0.03;
      lightness = 1.0;
    } else {
      // pos.x = floor(pos.x * 1000.0) / 1000.0;
      // pos.y = floor(pos.y * 100.0) / 100.0;
      // pos = mod(vUv + 0.5, 0.5) - 0.5;

      lightness = 0.5;
    }

    float ballBasedSize = 1.5;
    float ballSize = (cos(uTime + i) * 0.5 + 0.5) * ballBasedSize * ni;
    float dist1 = length(pos - offset) - ballSize;
    float dist2 = min(abs(pos.x - offset.x), abs(pos.y - offset.y)) - 0.01;
    float dist = mix(dist1, dist2, scale);
    float col = smoothstep(0.1, -0.1, dist);
    // vec3 ame = mix(vec3(1.0, 0.0, 0.0), vec3(.0, 0.0, 1.0), scale);

    vec3 color = hsl2rgb(vec3(0.7 * pow(scale, 0.9), 1.0, lightness));
    col *= 1.0 - ni;
    // color = mix(vec3(1.0), color, 0.3);

    balls += col * color / 1.8;
  }

  balls = pow(balls, vec3(2.0));
  if (uTime < 35.0) {
    gl_FragColor = vec4(vec3(balls), 1.0);
  } else {
    gl_FragColor = vec4(vec3(0.0), 1.0);
  }
}
`,
} ;
