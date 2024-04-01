<template>
  <div class="page-container">
    <header class="header">
      <div class="title">Remove Watermark</div>
      <div class="title">from Photo</div>
    </header>
    <main class="main center-col">
      <div
        class="center-col drop-zone"
        @dragover.prevent="clearDropZone"
        @drop="handleDrop"
      >
        <div class="upload__info center-col">
          <div class="upload__img">
            <svg
              id="svgUploadImg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="pathUploadImg"
                d="M35 27.5V35H5V27.5H0V35C0 37.75 2.25 40 5 40H35C37.75 40 40 37.75 40 35V27.5H35ZM7.5 12.5L11.025 16.025L17.5 9.575V30H22.5V9.575L28.975 16.025L32.5 12.5L20 0L7.5 12.5Z"
                fill="#1C1C1E"
              />
            </svg>
          </div>
          <input
            ref="fileInput"
            type="file"
            style="display: none"
            accept="image/*"
            @change="previewFile"
          />
          <button class="upload__btn center-col" @click="triggerFileInput">
            Upload Image
          </button>
          <div class="upload__text-wrapper">
            <h3 class="upload__text">
              Or drop your image file here to remove the watermark!
            </h3>
          </div>
        </div>
        <div class="preview__container" v-if="imageSrc">
          <button class="re-upload__btn center-col" @click="triggerFileInput">
            <svg
              id="svgReUploadImg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="pathArrowReUploadImg"
                d="M13.5236 3.21934L19.2833 9.03934C19.5722 9.33216 19.5722 9.80652 19.2833 10.0993C19.1457 10.2423 18.9569 10.3229 18.7597 10.3229C18.5625 10.3229 18.3737 10.2423 18.2361 10.0993L13.741 5.55934V16.7893C13.741 17.2036 13.4092 17.5393 13 17.5393C12.5908 17.5393 12.259 17.2036 12.259 16.7893V5.55934L7.76391 10.0993C7.62636 10.2419 7.43719 10.3214 7.2403 10.3193C7.04364 10.3203 6.85489 10.241 6.7167 10.0993C6.42777 9.80652 6.42777 9.33216 6.7167 9.03934L12.4764 3.21934C12.7657 2.92689 13.2343 2.92689 13.5236 3.21934Z"
                fill="white"
              />
              <path
                id="pathReUploadImg"
                d="M8.0603 19.0793H17.9397C18.3489 19.0793 18.6807 19.4151 18.6807 19.8293C18.6807 20.2436 18.3489 20.5793 17.9397 20.5793H8.0603C7.65108 20.5793 7.31934 20.2436 7.31934 19.8293C7.31934 19.4151 7.65108 19.0793 8.0603 19.0793Z"
                fill="white"
              />
            </svg>
            Re-Upload
          </button>
          <img :src="imageSrc" alt="Preview image" />
        </div>
      </div>
      <div class="progress-bar" v-if="showProgress"></div>
      <button @click="autoRemove">Auto Remove</button>
      <button @click="downloadImage">Download</button>
    </main>
  </div>
</template>
<script setup>
import { ref } from "vue";

const fileInput = ref(null);
const imageSrc = ref("");
const showProgress = ref(false);
makeImagesDraggable();

const uploadButton = document.getElementById("uploadBtn");

const dropZone = document.getElementById("dropZone");
const previewImage = document.getElementById("previewImage");
const downloadButton = document.getElementById("downloadButton");

function makeImagesDraggable() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.setAttribute("draggable", true);
    img.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/uri-list", img.src); // Data type должен быть text/uri-list, чтобы получить URL изображения
    });
  });
}

// dragover для разрешения сброса.
dropZone.addEventListener("dragover", (event) => {
  event.preventDefault(); // Разрешаем сброс
  event.dataTransfer.dropEffect = "copy"; // Показываем, что это операция копирования
});

dropZone.addEventListener("drop", function (event) {
  event.preventDefault();
  const imageUrl = event.dataTransfer.getData("text/uri-list");
  const imgElem = document.createElement("img");
  imgElem.src = imageUrl;
  dropZone.innerHTML = "";
  dropZone.appendChild(imgElem);
});

dropZone.addEventListener("drop", function (event) {
  event.preventDefault();
  const imageFile = event.dataTransfer.files[0];
  if (imageFile) {
    previewFile({ target: { files: [imageFile] } });
  }
});
//-----------send------------------
function sendImageToBackground(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const arrayBuffer = event.target.result;
    chrome.runtime.sendMessage(
      {
        action: "uploadImage",
        fileData: arrayBuffer,
        fileName: file.name,
        fileType: file.type,
      },
      (response) => {
        if (response.imageUrl) {
          // здесь код для обработки ответа
          handleResponse(response);
        } else {
          console.error(
            "No response from background script or error occurred."
          );
        }
      }
    );
  };
  reader.onerror = function (error) {
    console.error("Error reading file:", error);
  };
  reader.readAsArrayBuffer(file);
}

function handleResponse(response) {
  if (response && response.imageUrl) {
    // Действия после получения ответа, например, обновите src элемента img для отображения изображения.
    const img = document.createElement("img");
    img.src = response.imageUrl;
    document.body.appendChild(img);
  } else {
    console.error("No response from background script or error occurred.");
  }
}
uploadButton.addEventListener("click", () => {
  fileInput.click(); // Имитация клика по скрытому input
});
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    previewFile(file);
  }
});

const previewFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    imageSrc.value = e.target.result; // Обновляем реактивное свойство изображения
    // Отображаем превью
    const imgElem = document.createElement("img");
    imgElem.src = imageSrc.value;
    imgElem.style.maxWidth = "100%";
    imgElem.style.maxHeight = "100%";
    imgElem.style.objectFit = "contain";
    clearDropZone();
    dropZone.appendChild(imgElem);
  };
  reader.onerror = (error) => {
    console.error("Error occurred while reading file:", error);
  };
  reader.readAsDataURL(file);
};
const clearDropZone = () => {
  while (dropZone.firstChild) {
    dropZone.removeChild(dropZone.firstChild);
  }
};

downloadButton.addEventListener("click", downloadImage);

//-----------------------------

// Обновление отображения изображения
function updateImageDisplay() {
  if (imageSrc) {
    previewImage.src = imageSrc;
    previewImage.style.display = "block";
    downloadButton.style.display = "block";
  } else {
    previewImage.style.display = "none";
    downloadButton.style.display = "none";
  }
}
// ------download-----------
const downloadImage = () => {
  const link = document.createElement("a");
  link.href = imageSrc;
  link.download = "downloadedImage.png"; // Имя файла для скачивания
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
downloadButton.addEventListener("click", downloadImage);
</script>
<style scoped>
@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  src: local("Roboto"), url("fonts/Roboto-Regular.woff2") format("woff2"),
    url("fonts/Roboto-Regular.woff") format("woff");
}

@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  src: local("Roboto Medium"), url("fonts/Roboto-Medium.woff2") format("woff2"),
    url("fonts/Roboto-Medium.woff") format("woff");
}

@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  src: local("Roboto Bold"), url("fonts/Roboto-Bold.woff2") format("woff2"),
    url("fonts/Roboto-Bold.woff") format("woff");
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --main-color: #6750a4;
  --hover-main: #9775ef;
  --main: #eaddff;
  --no-active: #48464c;
  --done: #50a45d;
  --black: #1c1c1e;
}

.page-container {
  font-family: "Roboto", sans-serif;
  position: relative;
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-width: 440px;
}
.center-row {
  display: flex;
  justify-content: center;
  align-items: center;
}
.center-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}
.title {
  color: #000;
  text-align: center;
  font-family: "Roboto", sans-serif;
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 44px;
}
.main {
  width: 100%;
}

.drop-zone {
  width: 100%;
  height: 294px;
  background-color: var(--main);
  border-radius: 24px;
  border: 1px dashed;
}

#drop-zone.dragover {
  border-color: #000; /* Выделение области при перетаскивании */
}
.upload__img {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload__btn {
  width: 200px;
  height: 40px;
  margin: 12px;
  padding: 4px 24px;
  border-radius: 24px;
  border: none;
  background-color: var(--main-color);
  color: #fff;
  text-align: center;
  /* Watermark Button */
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px; /* 133.333% */
}
.upload__btn:hover {
  cursor: pointer;
}
.upload__text {
  width: 274px;
  color: var(--Black, #1c1c1e);
  text-align: center;
  /* Secondary text */
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
}
</style>
