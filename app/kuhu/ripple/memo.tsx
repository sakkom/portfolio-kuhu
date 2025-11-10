"use client";
import { rippleShader } from "./shader";

const code0 = rippleShader.fragmentShader;
const code1 = `
  float sinValue = sin(dist * uFreq - uTime);
  float brightness = 1.0 - abs(sinValue);
  gl_FragColor = vec4(vec3(brightness), 1.0);
  `;

const about0 = `
  色のみの波紋を考えてみます。
  length()で取得した距離をsin()の入力します。これは[-1, 1]のuv座標で考えた場合に
  [0, 1.414]の範囲をとります。このままでは十分なsin波の周期を持たないので10倍して[0, 14.14]で考えてみます。
  sin波は[-1, 1]で周期を繰り返します。sin波の最小値最大値はそれぞれ0を経由します。
  `;
const about1 = `
  uv座標に対してリップルを考えてみます。uAmp=0.01の場合に各ピクセルは[-1%, 1%]のオフセットを持ちます。
  それがuvの増加とtの増加によって行ったり来たりすることでリップル効果が生まれます。
  一次元で考えた場合sin(u - time) = 1、(u-time)=1.57での最大値は時間が増えるにしたがいuが増加し最大値の山が外側に移動していくことがわかります。
  `;
const about2 = `
  なぜnormalize()するのか考えます。45度での各ピクセルのnormalizeはvec2(0.707, 0.707)の値になります。これは0度の各ピクセルではvec2(1, 0)が成り立ちます。
  normalizeされた長さ1を0.01にすることで[-1%, 1%]になります。各ピクセルは0 -> 0.01 -> 0の+のオフセットと0 -> -0.01 -> 0のマイナスのオフセットを
  時間経過にしたがい繰り返しリップル効果が生まれます。
  `;

export const memo = () => {
  return (
    <>
      <pre>
        <code className="language-glsl">{code0}</code>
      </pre>
      <pre>
        <code className="language-glsl">{code1}</code>
      </pre>
      <p className="description">{about0}</p>
      <p className="description">{about1}</p>
      <p className="description">{about2}</p>
    </>
  );
};
