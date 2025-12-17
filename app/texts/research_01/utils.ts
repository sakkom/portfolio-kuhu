"use server";

//[0, length] floorするとlengthに到達しません。
function fCharRand(text: string): Array<number> {
  const scale = text.length;
  return text.split("").map(() => Math.random() * scale);
}

(() => {
  const testText = "Hello";
  const result = fCharRand(testText);
  console.log(result);
})();
