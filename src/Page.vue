<template>
  <div ref="pageContainer" class="page-container">
    <header class="header">
      <button @click="removeApp" class="app-remove"></button>
      <div class="title">Remove Watermark</div>
      <div class="title">from Photo</div>
    </header>
    <main class="main">
      <div
        class="center-col drop-zone"
        @dragover.prevent="allowDrop"
        @drop="handleDrop"
      >
        <div class="preview__container" v-if="imageSrc">
          <img
            :src="imageSrc"
            alt="Preview image"
            style="max-width: 100%; max-height: 100%; object-fit: contain"
          />
          <button class="re-upload__btn center-row" @click="triggerFileInput">
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
        </div>
        <div v-else class="upload__info center-col">
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
            @change="handleFiles"
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
      </div>
      <button class="processing" @click="startProcessing">
        Start Processing
      </button>
    </main>
  </div>
</template>
<script setup>
import { ref } from "vue";
const pageContainer = ref(null);
const fileInput = ref(null);
const imageSrc = ref("");
const showProgress = ref(false);
makeImagesDraggable();

function makeImagesDraggable() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.setAttribute("draggable", true);
    img.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/uri-list", img.src);
    });
  });
}

function removeApp() {
  if (pageContainer.value) {
    pageContainer.value.remove();
  }
}
function allowDrop(event) {
  if (event.dataTransfer.items) {
    for (const item of event.dataTransfer.items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        event.dataTransfer.dropEffect = "copy"; // Оповещаем пользователя о копировании элемента
        return;
      }
    }
  }
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    for (const file of files) {
      console.log(`Dropped file MIME type: ${file.type}`);
      if (file.type.startsWith("image/")) {
        sendImageToBackground(file);
        console.log(`File size: ${file.size}`);
        previewFile(file);
        break; // Предполагаем, что нужно обработать только один файл
      } else {
        console.log("Dropped file type is not an image or file is too large.");
      }
    }
  }
}

function triggerFileInput() {
  fileInput.value?.click();
}
function handleFiles(event) {
  const file = event.target.files[0];
  if (file.type.startsWith("image/")) {
    console.log(`File size: ${file.size}`);
    previewFile(file);
  } else {
    console.log("File type is not an image or file is too large.");
  }
}

function previewFile(file) {
  clearDropZone();
  // imageSrc.value = URL.createObjectURL(file);
  const reader = new FileReader();
  reader.onload = (e) => {
    imageSrc.value = URL.createObjectURL(file);
  };

  reader.onerror = (error) => {
    console.error("Error occurred while reading file:", error);
  };

  reader.readAsDataURL(file);
}

function clearDropZone() {
  if (imageSrc.value) {
    URL.revokeObjectURL(imageSrc.value);
    imageSrc.value = "";
  }
}
//-----------------------------------------
function startProcessing() {
  const processingPageUrl = chrome.runtime.getURL("imageProcessingPage.html");
  chrome.tabs.create({ url: processingPageUrl });
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
    const img = document.createElement("img");
    img.src = response.imageUrl;
    document.body.appendChild(img);
  } else {
    console.error("No response from background script or error occurred.");
  }
  // Убедитесь, что вы также вызываете URL.revokeObjectURL в нужный момент, чтобы избежать утечек памяти.
  // при удалении изображения из превью или когда компонент удаляется.
  // Также важно учитывать этот вызов после использования изображения:
  //URL.revokeObjectURL(imageSrc.value);
}
</script>
<style scoped>
@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  src: local("Roboto"), url("./fonts/Roboto-Regular.woff2") format("woff2"),
    url("./fonts/Roboto-Regular.woff") format("woff");
}

@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  src: local("Roboto Medium"),
    url("../public/fonts/Roboto-Medium.woff2") format("woff2"),
    url("./public/fonts/Roboto-Medium.woff") format("woff");
}

@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  src: local("Roboto Bold"), url("./fonts/Roboto-Bold.woff2") format("woff2"),
    url("./fonts/Roboto-Bold.woff") format("woff");
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
.hidden {
  display: none;
}
.app-remove {
  width: 15px;
  height: 15px;
  background-color: red;
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drop-zone {
  position: relative;
  width: 100%;
  height: 294px;
  background-color: #eaddff;
  border-radius: 24px;
  border: 2px dashed black;
}

#drop-zone.dragover {
  border-color: #000; /* Выделение области при перетаскивании */
}
.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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
  background-color: #6750a4;
  color: #fff;
  text-align: center;
  /* Watermark Button */
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 133.333% */
}
.upload__btn:hover {
  cursor: pointer;
}
.upload__text {
  width: 274px;
  color: #1c1c1e;
  text-align: center;
  /* Secondary text */
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
}
.re-upload__btn {
  position: absolute;
  top: 50%;
  width: 200px;
  height: 40px;
  margin: 12px;
  padding: 4px 24px;
  border-radius: 24px;
  border: none;
  background-color: #6750a4;
  color: #fff;
  text-align: center;
  /* Watermark Button */
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 133.333% */
  cursor: pointer;
}
.processing {
  width: 392px;
  height: 40px;
  margin: 12px;
  padding: 4px 24px;
  border-radius: 24px;
  border: none;
  background-color: #6750a4;
  color: #fff;
  text-align: center;
  /* Watermark Button */
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 133.333% */
  cursor: pointer;
}
</style>
