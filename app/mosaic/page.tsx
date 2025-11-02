"use client";
import Mosaic from "./Mosaic";
import "highlight.js/styles/atom-one-dark.css";
import "@/app/styles/article.css";
import { memo } from "./memo";
import { Article } from "../comps/Article";

export default function Page() {
  const title = "EffectComposerでピクセル化シェーダー";
  const date = "2025.10.31";
  const github =
    "https://github.com/sakkom/generate-poeme-like-bip39/blob/main/src/app/globals.css";

  return (
    <div style={{ width: "100vw", minHeight: "100vh" }}>
      <Article
        title={title}
        date={date}
        link={github}
        canvas={<Mosaic />}
        memo={memo}
      />
    </div>
  );
}
