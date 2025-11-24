import { sdfShader } from "./shader";

export const memo = () => {
  const code0 = sdfShader.fragmentShader;
  const code1 = `
    /*重なった領域は反転で+空間で優先され、その他はマイナス空間で比べる*/
    float opSubtraction(float d1, float d2) {
      return max(-d1, d2);
    }

    float opIntersection(float d1, float d2) {
      return max(d1, d2);
    }
    `;
  const code2 = `
    vec2 offset = lemniscate(uTime * speed, scale);
    offset *= rotate2D(angle);
    //uv+move座標での0の場所はどこにいるのかを確認
    float ballDist = sdCircle(uv + offset, radius);
    dist = opSmoothUnion(dist, ballDist, 0.1);
    `;
  return (
    <>
      <pre>
        <code className="language-glsl">{code0}</code>
      </pre>
      <pre>
        <code className="language-glsl">{code1}</code>
      </pre>
      <p className="description">
        2dのsdfとして円と正方形それらの基本的な演算としてunion,
        subtraction,intersectionについて学習をしました。
        ここではopSmoothUnion()を借用してメタボール風のビジュアルをつくってみました。
      </p>
      <div
        style={{
          backgroundColor: "black",
          width: "max-content",
          padding: "0 2vmin",
        }}
      >
        工夫した点
      </div>
      <pre>
        <code className="language-glsl">{code2}</code>
      </pre>
      <p className="description">
        円のsdfの場合0の地点で最小値を返します。なのでオフセット座標とは逆の場所に0が出現し円が描画されます。
        座標を動かして円を描くのですが、座標はレムニスケートの軌道です。時間を入力として極座標から直交座標変換で取得します。
        それらは同一な座標をとるので各円に応じて回転をすることで重ならないようにしました。
        unionを複数回かける際にAIでのリファクタリングでfor文がでてきました。
        ここでの注意点としてフラグメントシェーダの基本に振り返り各ピクセルごとに変数が保持されることで理解を進めました。
        各ピクセルは順次処理されていきsdfの返す距離の負空間を維持することで色付けが決定されます。
        色付けに関しては負空間の最小値を最大値としてネガポジで色を決定しています。
      </p>
    </>
  );
};
