import * as THREE from "three" ;

export const fBmShader = {
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
  float angle1 = sin(p.x * 1.0) * cos(p.y * 1.5);
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
vec2 getOffset2(vec2 p) {
  return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
}
vec2 getOffset1(float index) {
  return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
}
vec2 rotatePos(vec2 p, float a) {
  return p * mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;

  // float col = .0;

  // float amp = 2.0;
  // float freq = 10.0;

  // for (float i = .0; i < 5.; i++) {
  //   // vec2 n = filed(uv * freq);
  //   // float nF = dot(n.x, n.y);
  //   float nF = sin(uv.x * freq) * cos(uv.y * freq) + sin(uv.y * freq + rand1(i)) * tanh(uv.x * freq + rand1(i)) * amp;
  //   float value = nF * amp;
  //   freq *= 2.;
  //   amp *= .5;
  //   col += value;
  // }

  // col = col * .5 + .5;
  // col /= 3.0;

  // float finalCol = .1;

  // vec2 distortionUv = uv;

  // float amp = 1.0;
  // float freq = 10.0;

  // for (float i = .0; i < 5.; i++) {
  //   distortionUv.x += cos(cos(uv.y + i / 5. * 1.) * cos(uv.x + i / 5. * 1.) * freq) * amp;
  //   distortionUv.y += sin(cos(uv.y + i / 5. * 1.) * cos(uv.x + i / 5. * 1.) * freq) * amp;

  //   float circle = length(distortionUv) - 1.;
  //   // float col = smoothstep(0.1, -.1, circle);
  //   freq *= 2.;
  //   amp *= .5;
  //   finalCol += circle;
  // }

  float amp = .5;
  float freq = 10.0;
  vec2 distortionUv = uv;
  for (float i = .0; i < 5.; i++) {
    distortionUv.x += cos(sin(uv.x + rand1(i / 5.) * 1.) * cos(uv.y + rand1(i / 5.) * 1.) * freq - uTime) * amp;
    distortionUv.y += sin(cos(uv.y + i / 5. * 1.) * cos(uv.x + i / 5. * 1.) * freq + uTime) * amp;
    // distortionUv += normalize(uv + getOffset1(i) * freq) * amp;
    freq *= 2.;
    amp *= .5;
  }

  float a = atan(uv.y, uv.x);
  a = a < .0 ? a + 6.28 : a;
  uv += getOffset1(floor(a * 50.)) * 2.;
  // uv = rotatePos(uv, uv.x * uv.y * 100.);

  // float circle = length(uv) - .5;
  float circle = max(abs(uv.x), abs(uv.y)) - 0.5;

  // float col = smoothstep(0.5, -.0, abs(circle));
  float col = step(abs(circle), 0.1);

  // finalCol = (finalCol * 0.5 + 0.5);

  gl_FragColor = vec4(vec3(col), 1.0);
}
`,
} ;
