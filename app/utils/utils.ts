import GUI from "lil-gui";

export function setGui() {
  const guiContainerElement = document.getElementById("guiContainer")!;
  const gui = new GUI({
    container: guiContainerElement,
  });
  if (gui.domElement) {
    gui.domElement.style.width = "100%";
    gui.domElement.style.padding = "1vmin 1vmin";
    gui.domElement.style.backgroundColor = "#111111";
    gui.domElement.style.color = "#dddddd";
  }
  return gui;
}
