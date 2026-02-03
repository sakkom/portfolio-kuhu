export const scene1Shader = {
uniforms : {
uTime : { value : 0.0 },
uRms : { value : null },
uZcr : { value : null },
uTex : { value : null },
uRmsTime : { value : null },
uLoopNum : { value : null },
uColorMix : { value : null },
uSaturation : { value : null },
uLightness : { value : null },
uLine : { value : null },
uHeightAmp : { value : null },
},
vertexShader : `
varying vec2 vUv;
uniform float uRms;
uniform float uZcr;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader : `
varying vec2 vUv;
uniform float uTime;
uniform float uRms;
uniform float uZcr;
uniform sampler2D uTex;
uniform float uRmsTime;
uniform float uLoopNum;
uniform float uColorMix;
uniform float uSaturation;
uniform float uLightness;
uniform float uLine;
uniform float uHeightAmp;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

//https://iquilezles.org/articles/distfunctions/
float opSmoothUnion(float d1, float d2, float k) {
  k *= 4.0;
  float h = max(k - abs(d1 - d2), 0.0);
  return min(d1, d2) - h * h * 0.25 / k;
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 rotatePos(vec2 p, float a) {
  return p * mat2(cos(a), -sin(a), sin(a), cos(a));
}

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;

  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}

float floorRand(float t, float speed) {
  return rand1(floor(t * speed));
}

void main() {
  float colorMix = uColorMix;
  vec2 uv = vUv;

  vec3 colors = vec3(0.0);
  bool painted = false;

  uv -= 0.5;
  float view = uRms * 3.0;
  // uv *= view;
  uv += 0.5;

  float loopNum = uLoopNum;
  for (float i = 0.0; i < loopNum; i++) {
    float offset = (floorRand(uRmsTime - i, 1.0) - 0.5) * view;
    float audio = texture2D(uTex, vec2(uv.x - offset, 0.5)).r;
    float height = audio * uHeightAmp;
    float line = uv.y - height * 0.2 - i / loopNum;
    // float col = smoothstep(0.005, 0.0, abs(line));

    if (line < 0.0 && !painted) {
      if (rand1(i) > 0.5) {
        vec3 mono = vec3(1.0);
        vec3 color = hsl2rgb(vec3(floorRand(uRmsTime + i, 1.0), uSaturation, uLightness)) * 2.0;
        vec3 isColor = mix(mono, color, uColorMix);
        colors = isColor * step(uLine, abs(line));
        painted = true;
      } else {
        // colors = vec3(1.0) * step(abs(line), 0.01);
        vec3 mono = vec3(1.0);
        vec3 color = hsl2rgb(vec3(floorRand(uRmsTime + i * 12.34, 1.0), uSaturation, uLightness)) * 2.0;
        vec3 isColor = mix(mono, color, uColorMix);
        colors = isColor * step(abs(line), uLine);
        painted = true;
      }
    }
  }

  gl_FragColor = vec4(vec3(colors), 1.0);
}
`,
} ;
