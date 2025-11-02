"use client";
"use client";
import Frosted from "@/app/frosted/Frosted";
import { Article } from "../comps/Article";
import { memo } from "./memo";
import "highlight.js/styles/atom-one-dark.css";
import "@/app/styles/article.css";

export default function Page() {
  const title =
    "EffectComposerですりガラス効果・マウスムーブで正方円内でエフェクト無効化";
  const date = "2025.10.31";
  const github =
    "https://github.com/sakkom/generate-poeme-like-bip39/blob/main/src/app/globals.css";

  return (
    <div style={{ width: "100vw", minHeight: "100vh" }}>
      <Article
        title={title}
        date={date}
        link={github}
        canvas={<Frosted />}
        memo={memo}
      />
    </div>
  );
}
