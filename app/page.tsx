import Image from "next/image";
import Mosaic from "./kuhu/mosaic/Mosaic";
import Frosted from "./kuhu/frosted/Frosted";
import LinearSinDistortion from "./kuhu/linearSinDistortion/Linear";
import Link from "next/link";
import Metaball from "./kuhu/metaball/Metaball";
import Glitch from "./kuhu/glitch/Glitch";
import Ripple from "./kuhu/ripple/Ripple";
import "@/app/styles/main.css";

interface ArticleData {
  id: number;
  title: string;
  date: string;
}

const articles: ArticleData[] = [
  {
    id: 0,
    title: "EffectComposerでピクセル化シェーダー",
    date: "25.10.31",
  },
  {
    id: 1,
    title:
      "EffectComposerですりガラス効果・マウスムーブで正方円内でエフェクト無効化",
    date: "25.10.31",
  },
  {
    id: 2,
    title: "uv座標の正弦波ディストーションでの揺らぎ",
    date: "25.11.01",
  },
  {
    id: 3,
    title: "MarchingCubesでボールの大きさを保ちボールの数を増やす",
    date: "2025.11.03",
  },
  {
    id: 4,
    title: "セグメント分割によるランダムピクセル化グリッチ",
    date: "2025.11.08",
  },
  {
    id: 5,
    title: "uv座標のリップル効果",
    date: "2025.11.10",
  },
];

export default function Home() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          margin: "2vmin 0",
          backgroundColor: "#111111",
          color: "#dddddd",
          padding: "0vmin 2vmin",
        }}
      >
        <h3>2025November</h3>
      </div>
      <div id="main-container">
        <div style={{ padding: "2vmin 10vmin" }}>
          <Link href={`${process.env.NEXT_PUBLIC_LOCAL}/kuhu/ripple`}>
            <div
              style={{
                backgroundColor: "#111111",
                padding: "0 2vmin",
              }}
            >
              <h1>{articles[5].title}</h1>
            </div>
            <Image
              src={"/gifs/article-05.gif"}
              alt=""
              width={700}
              height={500}
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </Link>
        </div>

        <div style={{ padding: "2vmin 10vmin" }}>
          <Link href={`${process.env.NEXT_PUBLIC_LOCAL}/kuhu/glitch`}>
            <div
              style={{
                backgroundColor: "#111111",
                padding: "0 2vmin",
              }}
            >
              <h1>{articles[4].title}</h1>
            </div>
            <Image
              src={"/gifs/article-04.gif"}
              alt=""
              width={700}
              height={500}
              style={{ width: "100%", height: "auto" }}
            />
          </Link>
        </div>

        <div style={{ padding: "2vmin 10vmin" }}>
          <Link href={`${process.env.NEXT_PUBLIC_LOCAL}/kuhu/metaball`}>
            <div
              style={{
                backgroundColor: "#111111",
                padding: "0 2vmin",
              }}
            >
              <h1>{articles[3].title}</h1>
            </div>
            <Image
              src={"/gifs/article-03.gif"}
              alt=""
              width={700}
              height={500}
              style={{ width: "100%", height: "auto" }}
            />
          </Link>
        </div>

        <div style={{ padding: "2vmin 10vmin" }}>
          <Link
            href={`${process.env.NEXT_PUBLIC_LOCAL}/kuhu/linearSinDistortion`}
          >
            <div
              style={{
                backgroundColor: "#111111",
                padding: "0 2vmin",
              }}
            >
              <h1>{articles[2].title}</h1>
            </div>
            <Image
              src={"/gifs/article-02.gif"}
              alt=""
              width={700}
              height={500}
              style={{ width: "100%", height: "auto" }}
            />
          </Link>
        </div>

        <div style={{ padding: "2vmin 10vmin" }}>
          <Link href={`${process.env.NEXT_PUBLIC_LOCAL}/kuhu/frosted`}>
            <div
              style={{
                backgroundColor: "#111111",
                padding: "0 2vmin",
              }}
            >
              <h1>{articles[1].title}</h1>
            </div>
            <Image
              src={"/gifs/article-01.gif"}
              alt=""
              width={700}
              height={500}
              style={{ width: "100%", height: "auto" }}
            />
          </Link>
        </div>

        <div style={{ padding: "2vmin 10vmin" }}>
          <Link href={`${process.env.NEXT_PUBLIC_LOCAL}/kuhu/mosaic`}>
            <div
              style={{
                backgroundColor: "#111111",
                padding: "0 2vmin",
              }}
            >
              <h1>{articles[0].title}</h1>
            </div>
            <Image
              src={"/gifs/article-00.gif"}
              alt=""
              width={700}
              height={500}
              style={{ width: "100%", height: "auto" }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
