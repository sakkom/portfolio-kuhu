"use client";
import { glitchShader } from "./shader";

const code0 = `
    float trigger = rand1(floor(uTime * 5.0));
    if(trigger > 0.7) {
      vec4 tex1 = texture2D(tDiffuse, blockUV);
      vec4 tex2 = texture2D(tDiffuse, lineUV);
      gl_FragColor = mix(tex1, tex2, 0.5);
    }
    else {
      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `;
const code1 = `
    vec2 seg = floor(uv * uBlockSegment) / uBlockSegment;
    float randomPixel = rand2(seg + sin(timeVal)) * uBlockSize - uBlockSize * 0.5;
    vec2 blockUV = floor(uv * uResolution / randomPixel) * randomPixel / uResolution;
  `;
const code2 = `
  float segY = floor(uv.y * uLineSegment) / uLineSegment;
  float randomHeight = max(rand1(segY + sin(timeVal)) * uLineHeight, 1.0);
  float row = floor(uv.y * uResolution.y / randomHeight) * randomHeight / uResolution.y;
  float randomWidth = rand1(row) * uLineWidth - uLineWidth * 0.5;
  float col = floor(uv.x * uResolution.x / randomWidth) * randomWidth / uResolution.x;
  vec2 lineUV = vec2(col, row);
  `;

const about0 = `
  グリッチの大きな概念に戸惑いながらもグリッチ風なエフェクトを作成しました。
  ピクセル化の工夫で実装しました。xyの二次元ランダムによって決定されるものとyの一次元ランダムから派生するものの２つのレイヤーを重ねました。
  グリッチ風なデモは時間の一次元で60fpsにおいて瞬間的にフレームが発生するようにしました。
  `;
const about1 = `
  最終的なフラグメント座標が確定される前にランダムな大きさでピクセル化が行われるようにします。
  分割された範囲で一意な大きさでピクセル化がされます。なので分割数でバリエーションが決定されます。
  たとえば分割数が2でもピクセル化のrand値が返す(2つ)にしたがって細かいのか大きいのかの粒度が決定されます。
  `;
const about2 = `
  yについて分割された範囲でピクセル化しそのフラグメント座標に従って幅が確定します。
  - uLineWidth * 0.5についてですがxのオフセット的な意図でパラメータ調整していたのですが
  その後の処理では必ず正の値になるので論理的に理解できておりません。
  `;

export const memo = () => {
  return (
    <>
      <pre>
        <code className="language-glsl">{code0}</code>
      </pre>
      <p className="description">{about0}</p>
      <pre>
        <code className="language-glsl">{code1}</code>
      </pre>
      <p className="description">{about1}</p>
      <pre>
        <code className="language-glsl">{code2}</code>
      </pre>
      <p className="description">{about2}</p>
    </>
  );
};
