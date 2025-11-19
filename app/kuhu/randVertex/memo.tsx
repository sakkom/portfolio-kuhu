import Link from "next/link";
import { randVertexShader } from "./shader";

export const memo = () => {
  const code0 = `
    /*width, heightはcanvasのサイズ*/
    const sizes = [];
    const space = width / 100;
    for (let i = 0; i <= width; i += space) {
      for (let j = 0; j <= height; j += space) {
        const x = i / width;
        const y = j / height;
        const signedX = x * 2.0 - 1.0;
        const signedY = y * 2.0 - 1.0;
        positions.push(signedX, signedY, 0);
        /*開発環境820pxから比例*/
        /*float scale = pow(1.0 - normalizeDist, 3.0);により指定可能*/
        sizes.push((w / 820) * 12.0);
      }
    }
    `;
  const code1 = `
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    const material = new THREE.ShaderMaterial(randVertexShader);
    const points = new THREE.Points(geometry, material);
`;
  const code2 = `
    // attribute vec3 position;
    attribute vec4 color;
    attribute float size;
    uniform vec2 uMouse;
    uniform vec2 uResolution;

    varying vec4 vColor;

    vec2 aspectVec(vec2 uResolution) {
      if (uResolution.x > uResolution.y) {
        return vec2(uResolution.x / uResolution.y, 1.0);
      } else {
        return vec2(1.0, uResolution.y / uResolution.x);
      }
    }

    void main() {
      /*実際に長い方を長くする*/
      vec2 aspect = aspectVec(uResolution);
      vec2 pos = position.xy * aspect;
      vec2 mouse = uMouse * aspect;
      float aspectDist = length(pos - mouse);

      /*1より小さいときにradiusは累乗で0%に近づく*/
      /*1より大きいときは移動範囲は大きくなる*/
      float radius = pow(aspectDist * 1.0, 5.0);
      /*範囲は[-1, 1]*/
      vec2 offset = randomOffset(pos);
      vec2 random = offset * radius;

      vec3 p = vec3(position.xy + random , 0.0);
      gl_Position = vec4(p, 1.0);

      vColor = vec4(vec3(0.0), 1.0);

      //aspectDistでscaleを計算するために最大値を考慮
      float aspectEdge = max(aspect.x, aspect.y) * 2.0;
      float maxDist = length(vec2(aspectEdge, 2.0));
      float normalizeDist = aspectDist / maxDist;
      float scale = pow(1.0 - normalizeDist, 3.0);
      gl_PointSize = size * scale;
    }
    }
    `;
  const code3 = `
    float radius = pow(aspectDist * 1.5, 5.0);
    float scale = pow(1.0 - normalizeDist, 5.0);
    `;
  return (
    <>
      {" "}
      <div
        style={{
          backgroundColor: "black",
          width: "max-content",
          padding: "0 2vmin",
        }}
      >
        はじめに
      </div>
      <p className="description">
        GLSLスクール2025に参加中です。第一回では頂点シェーダを学びました。
        頂点シェーダを書くのは初めてです。頂点シェーダを使った課題のアイデアとして
        <Link
          href={`${process.env.NEXT_PUBLIC_LOCAL}/kuhu/frosted`}
          style={{ color: "darkseagreen" }}
        >
          すりガラス効果
        </Link>
        を応用したランダム・集合の動きをするポイントを実装しました。
      </p>
      <div
        style={{
          backgroundColor: "black",
          width: "max-content",
          padding: "0 2vmin",
        }}
      >
        頂点座標のセットの流れ
      </div>
      <pre>
        <code className="typescript">{code1}</code>
      </pre>
      <p className="description">
        attribute変数はFloat32BufferAttribute()で次元数を明記して渡します。
      </p>
      <pre>
        <code className="typescript">{code0}</code>
      </pre>
      <p className="description">
        フラグメントシェーダと違い座標を自ら？準備する必要があるため中心原点で正規化を行なったグリッドを作成しました。
      </p>
      <p className="description"></p>
      <div
        style={{
          backgroundColor: "black",
          width: "max-content",
          padding: "0 2vmin",
        }}
      >
        実装内容
      </div>
      <pre>
        <code className="language-glsl">{code2}</code>
      </pre>
      <pre>
        <code className="language-glsl">{code3}</code>
      </pre>
      <p className="description">
        マウス中心に応じてランダムに散らすこととマウス中心に応じてポイントサイズが変化する二つで構成されます。
        pow()を使うことで1より大きか小さいかで急激にランダムに散るオフセットが変化するようにしました。
        アスペクトを考慮した座標の距離空間の値をそのままオフセットパーセンテージに使用しました。
        累乗数を大きくすることで1より大きいとき大きく動き0に近づくにつれて早めにオフセットがなくなるようにしました。
        マウス中心でattribute変数で設定した初期値をgl_PointSizeで使用するために距離を正規化し1.0-distで反転することで実現しました。
        ここでもpow()を使用することで線形の変化からより急激な変化でメリハリをつけました。
      </p>
    </>
  );
};
