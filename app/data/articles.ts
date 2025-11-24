export interface ArticleData {
  id: number;
  title: string;
  date: string;
  path: string;
  gif: string;
}

export const articles: ArticleData[] = [
  {
    id: 0,
    title: "EffectComposerでピクセル化シェーダー",
    date: "25.10.31",
    path: "mosaic",
    gif: "/gifs/article-00.gif",
  },
  {
    id: 1,
    title:
      "EffectComposerですりガラス効果・マウスムーブで正方円内でエフェクト無効化",
    date: "25.10.31",
    path: "frosted",
    gif: "/gifs/article-01.gif",
  },
  {
    id: 2,
    title: "uv座標の正弦波ディストーションでの揺らぎ",
    date: "25.11.01",
    path: "linearSinDistortion",
    gif: "/gifs/article-02.gif",
  },
  {
    id: 3,
    title: "MarchingCubesでボールの大きさを保ちボールの数を増やす",
    date: "2025.11.03",
    path: "metaball",
    gif: "/gifs/article-03.gif",
  },
  {
    id: 4,
    title: "セグメント分割によるランダムピクセル化グリッチ",
    date: "2025.11.08",
    path: "glitch",
    gif: "/gifs/article-04.gif",
  },
  {
    id: 5,
    title: "uv座標のリップル効果",
    date: "2025.11.10",
    path: "ripple",
    gif: "/gifs/article-05.gif",
  },
  {
    id: 6,
    title: "GLSLスクール2025課題1・頂点シェーダー",
    date: "2025.11.19",
    path: "randVertex",
    gif: "/gifs/article-06.gif",
  },
  {
    id: 7,
    title: "2D SDFでメタボール風",
    date: "2025.11.24",
    path: "sdf/day3Metaball2d",
    gif: "/gifs/article-07.gif",
  },
];
