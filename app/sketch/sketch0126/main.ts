import * as THREE from "three" ;

export const sketch0126Shader = {
uniforms : {
uTime : { value : 0.0 },
uResolution : { value : new THREE . Vector2(0.0, 0.0)},
uTexture0 : { value : null },
tDiffuse : { value : null },
},
vertexShader : `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader : `
varying vec2 vUv;
uniform sampler2D uTexture0;
uniform vec2 uResolution;
uniform sampler2D tDiffuse;
uniform float uTime;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
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
float floorRand(float t, float speed) {
  return rand1(floor(t * speed));
}
float lumi(vec3 color) {
  return dot(color, vec3(0.3, 0.59, 0.11));
}

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;

  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}
vec2 rotatePos(vec2 p, float a) {
  return p * mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main() {
  vec2 uv = vUv;

  // vec2 uvR = uv + vec2(0.01, 0.0);
  // vec2 uvG = uv;
  // vec2 uvB = uv - vec2(0.01, 0.0);

  // float circleR = length(uvR) - 0.1;
  // float circleG = length(uvG) - 0.1;
  // float circleB = length(uvB) - 0.1;

  // vec3 color;
  // color.r = step(circleR, 0.);
  // color.g = step(circleG, 0.);
  // color.b = step(circleB, 0.);

  uv += getOffset2(uv) * 0.005;
  // vec3 color;
  // for (float i = 0.; i < 3.; i++) {
  //   vec3 tex = texture2D(tDiffuse, uv + (getOffset1(i + floorRand(uTime, 5.0)))).rgb;
  //   tex = vec3(step(rand1(lumi(tex)), .5));
  //   color += tex;
  // }
  // color /= 3.;

  // float l = lumi(color);
  // float col = step(l, .5);

  // vec3 finalColor;
  // for (float i = .0;
  //   i < 10.;
  //   i++) {
  //   vec3 col = texture2D(uTexture0, uv).rgb;
  //   float l = lumi(col) * 0.5;
  //   vec3 texCol = texture2D(uTexture0, uv + vec2(l, .0)).rgb;
  //   finalColor += texCol;
  // }

  vec2 circleUv = uv - 0.5;

  vec3 circles;
  for (float i = .0;
    i < 30.;
    i++) {
    circleUv = uv - 0.5;
    // circleUv.y += getOffset1(floor(circleUv.y * i / 30. * 300.0)).y * 0.5;
    // circleUv.x += getOffset1(floor(circleUv.y * i / 30. * 300.0)).x * 0.5;
    circleUv.y += (rand1(floor(circleUv.y * (i + 1.) / 50. * 200.0 + uTime * 10.0)) - 0.5) * 1.0;
    circleUv.x += (rand1(floor(circleUv.y * (i + 1.) / 50. * 200.0 + uTime * 10.0)) - 0.5) * 1.0;
    float circle = length(circleUv) - (i + 1.) / 50. * 1.0;
    // float circle = max(abs(circleUv.x), abs(circleUv.y)) - (i + 1.) / 50.0 * 1.0;
    float color = step(circle, 0.0);

    // circles += color * hsl2rgb(vec3((i + 1.0) / 50., 1.0, (i + 1.0) / 50.) - 0.2);
    circles += color * vec3(step(rand1(i), .5));
  }
  circles /= 10.;

  float l = lumi(circles);
  vec3 finalColorda = (1.0 - vec3(step(l, 0.5)));

  // vec3 color;
  // color = vec3(step(circles.r, 0.0));
  // vec3 background = vec3(step(rand2(floor(circleUv * 500.)), 0.5));

  // vec3 finalColor = mix(background, vec3(circles), 0.5);

  gl_FragColor = vec4(vec3(finalColorda), 1.0);
  // gl_FragColor = texture2D(uTexture0, circleUv + .5);
  // gl_FragColor = vec4(vec3(finalColor / 10.), 1.0);
}
`,
} ;
