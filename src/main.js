import { createApp } from "vue";
import WatermarkRemover from "./WatermarkRemover.vue";

function embedVueComponent() {
  // Создаем контейнер для нашего Vue приложения
  const appContainer = document.createElement("div");
  appContainer.id = "watermark-remover-container";
  appContainer.style.position = "fixed";
  appContainer.style.top = "0";
  appContainer.style.right = "0";
  appContainer.style.width = "440px";
  appContainer.style.height = "580px";
  appContainer.style.zIndex = "10000";
  appContainer.style.backgroundColor = "#6a00ff";

  appContainer.innerText = "Watermark Remover Loading...";
  document.body.appendChild(appContainer);
  // Создаем экземпляр Vue приложения с WatermarkRemover компонентом
  const app = createApp(WatermarkRemover);

  // Монтируем приложение Vue в созданный контейнер
  app.mount(appContainer);
}

// Выполняем встраивание
embedVueComponent();
