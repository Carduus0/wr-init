import { createApp } from "vue";
import Test from "./Test.vue";

// import Page from "./Page.vue";
alert("I`m here!");
const appContainer = document.createElement("div");
appContainer.id = "watermark-remover-container";
appContainer.style.position = "relative";
appContainer.style.position = "fixed";
appContainer.style.top = "0";
appContainer.style.right = "0";
appContainer.style.width = "440px";
appContainer.style.height = "580px";
appContainer.style.border = "2px red dashed";
appContainer.style.backgroundColor = "transparent";
appContainer.style.zIndex = "2147483647"; // Максимально возможное значение для z-index
const closeButton = document.createElement("button");
closeButton.style.position = "absolute";
closeButton.style.top = "5px";
closeButton.style.right = "5px";
appContainer.innerText = "Watermark Remover Loading...";
closeButton.onclick = () => {
  appContainer.remove();
};
appContainer.appendChild(closeButton);
document.body.appendChild(appContainer);

createApp(Test).mount("#watermark-remover-container");
