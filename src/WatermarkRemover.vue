<template>
  <div class="wr__page">
    <p>Remove Watermark from Photo</p>
  </div>
</template>
<script>
alert("I`m here!");
document.body.style.backgroundColor = "#b9f7c3";
function embedVueComponent() {
  // контейнер для нашего приложения
  const appContainer = document.createElement("div");
  const closeButton = document.createElement("button");
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
  closeButton.style.position = "absolute";
  closeButton.style.top = "5px";
  closeButton.style.right = "5px";
  appContainer.innerText = "Watermark Remover Loading...";
  closeButton.onclick = () => {
    windowContainer.remove();
  };
  document.body.appendChild(appContainer);
}
// Выполняем встраивание
embedVueComponent();
// import { ref } from "vue";

// const show = ref(true);
// const imageSrc = ref("");
// const selectedFile = ref(null);

// const previewFile = (event) => {
//   selectedFile.value = event.target.files[0];
//   imageSrc.value = URL.createObjectURL(selectedFile.value);
// };

// const sendImage = () => {
//   if (selectedFile.value) {
//     const formData = new FormData();
//     formData.append("file", selectedFile.value);
//     sendImageToBackground(formData);
//   }
// };

// async function sendImageToBackground(formData) {
//   try {
//     chrome.runtime.sendMessage({ imageFile: formData }, function (response) {
//       if (response && response.imageUrl) {
//         imageSrc.value = response.imageUrl;
//       } else {
//         console.error("No response from background script or error occurred.");
//       }
//     });
//   } catch (error) {
//     console.error("Error sending message to background script:", error);
//   }
// }

// const downloadImage = () => {
//   const imgLink = document.createElement("a");
//   imgLink.href = imageSrc.value;
//   imgLink.download = "downloadedImage.png"; // Имя файла для скачивания
//   document.body.appendChild(imgLink);
//   imgLink.click();
//   document.body.removeChild(imgLink);
// };
</script>

<style scoped>
.wr__page {
  width: 640px;
  height: 800px;
  background-color: red;
  border: 2px dashed;
  /*----------*/
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2147483647;
}
</style>
