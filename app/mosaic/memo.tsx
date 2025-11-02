import { mosaicShader } from "./shader";

export const memo = () => {
  return (
    <>
      <pre>
        <code className="language-glsl">{mosaicShader.fragmentShader}</code>
      </pre>
      <p className="description">
        PostProcessingでモザイク処理をした。具体的な数値を代入して理解に努めた。
        <br />
        {`
          10*10のピクセル座標を想定しuPixelSizeを5すると、0 <= x < 5 で0, 5 <= x < 10で1になる。
          たとえば(5, 10)のときは(1, 2)になる。乗算してピクセル座標に変換するのはその区間の色を取得するためである。たとえば(5, 10), (6, 10)は元の画像の(1, 10)の色を参照。`}
        <br />
        最後にピクセル座標でピクセル化したものをuv座標に変換しレンダリング。
      </p>
    </>
  );
};
