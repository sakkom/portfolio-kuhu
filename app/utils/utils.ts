import GUI from "lil-gui";

export function setGui() {
  const guiContainerElement = document.getElementById("guiContainer")!;
  if (guiContainerElement) {
    guiContainerElement.innerHTML = "";
  }
  const gui = new GUI({
    container: guiContainerElement,
  });
  if (gui.domElement) {
    gui.domElement.style.width = "100%";
    gui.domElement.style.padding = "0vmin 1vmin";
    gui.domElement.style.backgroundColor = "seagreen";
    gui.domElement.style.color = "#dddddd";
    gui.domElement.style.border = "1px solid #111111";
    // gui.domElement.style.setProperty("--widget-height", "20px");
    gui.domElement.style.setProperty("--title-background-color", "seagreen");
    gui.domElement.style.setProperty("--widget-color", "#111111");
    gui.domElement.style.setProperty("--widget-padding", "0");
  }
  return gui;
}
