export const AudioDistortionIdea1 = {
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

  // vec3 rgbCol = texture2D(tDiffuse, uv).rgb;
  // float diffRa = rgbCol.r - rgbCol.b;
  // float diffRb = rgbCol.r - rgbCol.g;
  // float diffGa = rgbCol.g - rgbCol.r;
  // float diffGb = rgbCol.g - rgbCol.b;
  // float diffBa = rgbCol.b - rgbCol.r;
  // float diffBb = rgbCol.b - rgbCol.g;

  // vec3 finalColor = vec3(l);

  // if (diffRa > 0.2 && diffRb > 0.2) {
  //   vec3 col = texture2D(tDiffuse, uv).rgb;
  //   finalColor += col;
  // }
  // if (diffGa > 0.2 && diffGb > 0.2) {
  //   vec3 col = texture2D(tDiffuse, uv).rgb;
  //   finalColor += col;
  // }
  // if (diffBa > 0.2 && diffBb > 0.2) {
  //   vec3 col = texture2D(tDiffuse, uv).rgb;
  //   finalColor += col;
  // }

  vec2 distortionUv = uv;
  vec3 finalColor;

  for (float i = 0.0; i < 20.; i++) {
    float l = lumi(texture2D(tDiffuse, distortionUv).rgb);
    distortionUv.y += audio * 0.1;

    vec3 col = texture2D(tDiffuse, distortionUv).rgb * l * l * l;
    finalColor += col;
  }

  /*stepな感じ*/
  // float floorAudio = (floor((audio * 0.5 + 0.5) * 30.0) - 15.0) / 30.0;
  // distortionUv.y += floorAudio * uLevel;

  // vec3 color;

  // color.r = texture2D(tDiffuse, distortionUv + vec2(0.01, 0.0)).r;
  // color.g = texture2D(tDiffuse, distortionUv - vec2(0.01, 0.0)).g;
  // color.b = texture2D(tDiffuse, distortionUv).b;

  // gl_FragColor = vec4(vec3(1.0 - step(l, .5)), 1.0);
  if (rand1(uTime) > 0.0) {
    gl_FragColor = vec4(finalColor, 1.0);
  } else {
    gl_FragColor = texture2D(tDiffuse, uv);
  }

  // gl_FragColor = vec4(finalColor * l, 1.0);
  // gl_FragColor = vec4(vec3(floorAudio), 1.0);
}
`,
} ;
