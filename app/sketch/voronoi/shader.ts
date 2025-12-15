import * as THREE from "three" ;
export const week2Shader = {
uniforms : {
uResolution : { value : new THREE . Vector2(0.0, 0.0)},
uTime : { value : 0.0 },
uTexture0 : { value : null },
uBox : { value : null },
},
vertexShader : `
precision mediump float;
uniform float uTime;
varying vec2 vUv;
varying vec3 vPos;

void main() {
  vUv = uv;
  vPos = position.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader : `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture0;
uniform vec3 uBox[8];
varying vec2 vUv;
varying vec3 vPos;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

float rand2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p.x * p.y) * 43758.5453123);
}

void main() {
  vec2 uv = vUv - 0.5;
  float minDist = 100.0;
  float secDist = 100.0;
  float fN = 0.0;

  // vec3 pos = vec3(uv, fract(uTime));
  vec3 pos = vPos;

  float maxR = rand1(uTime) * 100.0;
  for (int i = 0; i < 10; i++) {
    // if (float(i) > maxR) break;
    vec3 point = vec3(
        rand1(float(i) * 12.34) - 0.5,
        rand1(float(i) * 56.78) - 0.5,
        rand1(float(i) * 91.23) - 0.5
      );

    // vec3 point = uBox[i];
    // point += vec2(cos(float(i) + uTime) * 0.1, sin(float(i) + uTime) * 0.1);
    // float dist1 = min(abs(uv.x - point.x), abs(uv.y - point.y));
    // float dist1 = distance(uv, point);
    float dist = distance(pos, point);
    // float dist = mix(dist1, dist2, fract(uTime));

    if (dist < minDist) {
      secDist = minDist;
      minDist = dist;
      fN = float(i);
    } else if (dist < secDist) {
      secDist = dist;
    }
    float a = float(i) + uTime * 0.1;
    mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
    // float angle = atan(length(pos.xy), pos.z);
    // pos = abs(pos);
    // pos.xy += fract(uv.xy * 100.0 + uTime) * 0.5;
    // pos += fract(uTime * 100.0);
    // pos = pos * rot;
  }

  float edge = secDist - minDist;

  vec3 col;
  float e = clamp(fract(uTime * 1.0), 0.001, 0.01);
  if (edge < 0.01) {
    // col = vec3(1.0);
    float r = rand1(fN);
    if (r < 0.33) {
      col = vec3(1.0, 0.5, 0.5);
    } else if (r < 0.66) {
      col = vec3(1.0, 1.0, 0.5);
    } else if (r <= 1.0) {
      col = vec3(0.5, 1.0, 0.5);
    }
  } else {
    col = vec3(0.0);
  }

  gl_FragColor = vec4(col, 1.0);
  // vec2 sampleUv = vec2(rand1(fN * 12.34), rand1(fN * 56.78));

  // gl_FragColor = texture2D(uTexture0, sampleUv);
}

`,
} ;
