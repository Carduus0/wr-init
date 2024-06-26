import { createApp } from "vue";

import Page from "./Page.vue";
const appContainer = document.createElement("div");
appContainer.id = "watermark-remover-container";
appContainer.style.position = "relative";
appContainer.style.position = "fixed";
appContainer.style.top = "0";
appContainer.style.right = "0";
appContainer.style.width = "440px";
appContainer.style.height = "580px";
appContainer.style.border = "5px green";
appContainer.style.borderRadius = "24px";
appContainer.style.backgroundColor = "#fff";
appContainer.style.zIndex = "100000"; //2147483647 Максимально возможное значение для z-index
const closeButton = document.createElement("button");
closeButton.style.position = "absolute";
closeButton.style.top = "5px";
closeButton.style.right = "5px";
closeButton.style.backgroundColor = "#eaddff";
closeButton.innerText = "Close";
closeButton.onclick = () => {
  appContainer.remove();
};
appContainer.appendChild(closeButton);
document.body.appendChild(appContainer);

createApp(Page).mount("#watermark-remover-container");
