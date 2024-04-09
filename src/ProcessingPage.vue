<template>
  <div class="processing__page">
    <header class="header">
      <h1>Image Watermark Remover</h1>
    </header>
    <main class="main-content">
      <section class="preview-section">
        <div>
          <canvas
            ref="canvasRef"
            class="image-canvas"
            @mousedown="startLasso"
            @mousemove="drawLasso"
            @mouseup="endLasso"
          />
        </div>
      </section>
      <section class="tools-section">
        <button @click="reUpload">Re-Upload</button>
        <button @click="undoChanges">Undo</button>
        <button @click="resetChanges">Reset</button>
        <button @click="sendToServer">Auto</button>
        <button v-if="processedImageSrc" @click="downloadImage">
          Download
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const originalImage = ref(null); // Ссылка на исходное изображение
const processedImageSrc = ref(null); // Ссылка на обработанное изображение
const selectedArea = ref(null); // Данные выбранной области
const canvasRef = ref(null);
const canvasReady = ref(false);
const ctx = ref(null);
const drawing = ref(false);
const points = ref([]);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "processImage") {
    if (request.fileData) {
      // Создаем Uint8Array из ArrayBuffer
      const data = new Uint8Array(request.fileData);

      console.log("Received data length:", data.byteLength);

      // Создаем Blob из полученных данных
      const blob = new Blob([data], { type: request.fileType });
      console.log("Created blob size:", blob.size);

      originalImage.value = URL.createObjectURL(blob); // Создаем URL для Blob
      console.log("originalImage.value", originalImage.value);
    } else {
      console.error("Failed to receive image data.");
    }
  }
});

watch(originalImage, (newSrc) => {
  if (newSrc && canvasRef.value) {
    console.log("newSrc is here");

    const img = new Image();
    img.src = newSrc;
    img.onload = () => {
      console.log("drawImage start");

      if (!ctx.value) {
        ctx.value = canvasRef.value.getContext("2d");
      }
      canvasRef.value.width = img.width;
      canvasRef.value.height = img.height;
      ctx.value.drawImage(img, 0, 0);
    };
    img.onerror = () => {
      console.error("Image failed to load.");
    };
    img.onabort = () => {
      console.log("Image loading aborted.");
    };
  }
});

onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext("2d");
    canvasReady.value = true;
  } else {
    console.log("canvasRef.value", canvasRef.value);
  }
});

//--------------------
const startLasso = (event) => {
  drawing.value = true;
  points.value.push({ x: event.offsetX, y: event.offsetY });
};

const drawLasso = (event) => {
  if (!drawing.value || !ctxRef.value) return; // Проверка на drawing и инициализированный контекст холста
  points.value.push({ x: event.offsetX, y: event.offsetY });

  const ctx = ctxRef.value; // Получаем текущий контекст холста
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  // Здесь ваш код для перерисовки изображения на холсте

  ctx.beginPath();
  ctx.moveTo(points.value[0].x, points.value[0].y);
  points.value.forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.stroke();
};

const endLasso = () => {
  drawing.value = false;
  // Здесь ваш код для обработки выделенной области
};
//---------------------------------------
// после того как пользователь закончит выделение:
function sendModifiedImageToBackground(modifiedImage) {
  // Используйте подходящий метод для получения image data, например, если используется canvas:
  const modifiedImageData = canvas.toDataURL();

  // Отправить изменённые данные обратно в background.js
  chrome.runtime.sendMessage({
    action: "imageProcessed",
    modifiedImageData: modifiedImageData,
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "serverResponse") {
    // Обрабатываем данные, полученные от сервера
    const serverData = message.serverData;
    // Например, отобразить результаты на странице
  }
});

// Обработчик для отмены изменений
function undoChanges() {
  // для отмены последнего действия
}

// Загрузка обработанного изображения
function downloadImage() {
  const link = document.createElement("a");
  link.href = processedImageSrc.value;
  link.setAttribute("download", "processed-image.jpg");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// const originalImage = localStorage.getItem("imageToProcess");
//   // const imageElement = document.getElementById("imageToEdit");
//   imageElement.src = originalImage;
//   localStorage.removeItem("imageToProcess");
//   // Инициализируйте ваши инструменты для рисования или настройки

// Обратите внимание: URL, созданный вызовом URL.createObjectURL,
// должен быть освобожден позднее с помощью URL.revokeObjectURL, чтобы избежать утечек памяти.
//Это можно сделать после того,как изображение было успешно обработано или когда страница обработки изображений закрывается.
</script>

<style scoped>
.processing__page {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.header {
  display: flex;
}

.main-content {
  display: flex;
  flex-direction: column;
}

.preview-section {
  display: flex;
}

.image-canvas {
  max-width: 100%;
  width: 500px;
  height: 300px;
}

.tools-section {
  display: flex;
}

button {
  display: flex;
}
</style>
