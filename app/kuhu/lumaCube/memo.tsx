import Image from "next/image";
import {} from "./shader";

export const memo = () => {
  const code0 = `
    //https://help.autodesk.com/view/MAYAUL/2015/JPN/?guid=Shading_Nodes_Luminance
    float lumi(vec3 color) {
      return dot(color, vec3(0.3, 0.59, 0.11));
    }

    void main() {
      vUv = uv;
      vec4 lumaTex = texture2D(uTexture0, uv);
      float l = lumi(lumaTex.rgb);
      vec3 newPosition = position;
      newPosition.z = l < 0.5 ? -1.0 : 1.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
    `;
  const code1 = `
    void main() {
      vec2 uv = vUv;
      for (int i = 0; i < 5; i++) {
        vec3 col = texture2D(uTexture0, uv).rgb;
        float l = lumi(col);
        /*白と黒が隣り合う線形において再帰的に入れ替わる*/
        // uv.x += (l - 0.5) * 0.02;
        uv.x += (l - 0.5) * cos(uTime * 0.5) * 0.2;
        uv.y += (l - 0.5) * sin(uTime * 0.5) * 0.2;
      }
      gl_FragColor = texture2D(uTexture0, uv);
    }
    `;
  return (
    <>
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
        GLSLスクール2025のweek2の課題としてチェッカーボード画像の明度とサンプリングをずらして模様が変わるキューブをつくりました。
      </p>

      <div
        style={{
          backgroundColor: "black",
          width: "max-content",
          padding: "0 2vmin",
        }}
      >
        明度をz値にする
      </div>
      <pre>
        <code className="language-glsl">{code0}</code>
      </pre>
      <p className="description">
        前提として画像を貼り付けているPlaneGeometryは[-1, 1]の座標です。
        チェッカーボードは0.0と1.0の２値で構成されているのでz値を[-1,
        1]のどちらかにz値をセットしキューブを構築しました。
      </p>

      <div
        style={{
          backgroundColor: "black",
          width: "max-content",
          padding: "0 2vmin",
        }}
      >
        サンプリング座標をずらす
      </div>
      <pre>
        <code className="language-glsl">{code1}</code>
      </pre>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Image
          src="/articles-img/luma-cube-01.png"
          alt=""
          width={700}
          height={50}
          style={{ width: "50%", height: "auto" }}
        />
        <Image
          src="/articles-img/luma-cube-02.png"
          alt=""
          width={500}
          height={50}
          style={{ width: "50%", height: "auto" }}
        />
      </div>
      <p className="description">
        画像は1%のずらしの画像で、ループが1回と2回の画像です。 明度値は[0,
        1]の範囲であり黒が0.0, 白が1.0です。次にサンプリングする座標は
        黒の場合左に1%、白で右に1%を参照します。左の画像をみると境目付近の座標でもとのチェッカーボードの色がずれた座標値をサンプリング
        しているのがわかります。
        ２回目以降はfor文の中で再帰的にサンプリングが行われるため、また境目で逆転が起きます。すでに一回移動したサンプリングの明度値
        に応じて最終的なサンプリングが行われます。
      </p>
    </>
  );
};
