import { RotateChar } from "./comps/RotateChar";

export default function Page() {
  // const profileText =
  //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";
  const p = "My name is sakama haruki";
  return (
    <div style={{ margin: "50vh" }}>
      <RotateChar text={p} />
    </div>
  );
}
