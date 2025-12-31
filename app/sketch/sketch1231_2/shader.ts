export const sketch1230Shader = {
uniforms : {
uTime : { value : 0.0 },
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
uniform float uTime;

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;

  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}

//Posのランダム値を3色に静置するシェーダ
void main() {
  vec2 uv = vUv;
  //躍動感
  // uv.x += uTime;

  vec2 pos = uv;

  //粒度設定
  pos = floor(pos * 100.0) / 100.0;
  //３色カラー設定
  vec3 col0 = hsl2rgb(vec3(0.66 + uTime * 0.1, 1.0, 0.4));
  vec3 col1 = hsl2rgb(vec3(0.3 + uTime * 0.1, 1.0, 0.4));
  vec3 col2 = hsl2rgb(vec3(0.0 + uTime * 0.1, 1.0, 0.4));

  vec4 waveColor = vec4(0.0);
  vec4 bgColor = vec4(0.0);

  float randPos = (rand2(pos) * 9.0);
  //静置されたPosランダム値を変化させる
  float shift = uTime * 0.1;
  randPos = randPos - shift;
  float index = mod(randPos, 3.0);

  //カラー確定
  if (index <= 1.5) {
    waveColor = vec4(col0, 1.0);
  } else if (index <= 2.0) {
    waveColor = vec4(col1, 1.0);
  } else if (index <= 2.999) {
    waveColor = vec4(col2, 1.0);
  } else {
    waveColor = vec4(1.0);
  }

  if (index <= 0.5) {
    bgColor = vec4(col0, 1.0);
  } else if (index <= 2.5) {
    bgColor = vec4(col1, 1.0);
  } else if (index <= 2.999) {
    bgColor = vec4(col2, 1.0);
  } else {
    bgColor = vec4(1.0);
  }

  //wave sdf
  float wave = sin(uv.x + uTime) * 0.5;
  float mask = abs(pos.y - 0.5 + wave) - 0.5;
  float maskCol = step(mask, 0.0);

  waveColor = waveColor * (maskCol);
  bgColor = bgColor * (1.0 - maskCol);

  gl_FragColor = waveColor + bgColor;
}
`,
} ;
