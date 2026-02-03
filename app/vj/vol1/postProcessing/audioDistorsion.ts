export const AudioDistortion = {
uniforms : {
uTime : { value : 0.0 },
uResolution : { value : null },
tDiffuse : { value : null },
uLevel : { value : null },
uAudioTexture : { value : null },
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
uniform sampler2D tDiffuse;
uniform sampler2D uAudioTexture;
uniform float uTime;
uniform float uLevel;

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

  float audio = texture2D(uAudioTexture, uv).r;

  vec2 distortionUv = uv;
  distortionUv.y += audio * uLevel;

  /*stepな感じ*/
  float floorAudio = (floor((audio * 0.5 + 0.5) * 30.0) - 15.0) / 30.0;
  // distortionUv.y += floorAudio * uLevel;

  float l = lumi(texture2D(tDiffuse, distortionUv).rgb);
  // gl_FragColor = vec4(vec3(1.0 - step(l, .5)), 1.0);
  gl_FragColor = texture2D(tDiffuse, distortionUv);
  // gl_FragColor = vec4(vec3(floorAudio), 1.0);
}
`,
} ;
