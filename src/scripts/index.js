import buildModel from "./model/buildModel";
import data from "./att-timeline.txt";
import generateView from "./view/generateView";
import renderGraph from "./view/renderGraph";

function remountApp() {
  const model = buildModel(data);
  const view = generateView(model);
  const graph = renderGraph(view);
  const app = document.querySelector("#app");
  app.innerHTML = "";
  app.appendChild(graph);
}

if (module.hot) {
  module.hot.dispose(remountApp);
  module.hot.accept(remountApp);
}

remountApp();
