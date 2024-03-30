<template>
  <div class="wr__page">
    <p>Remove Watermark from Photo</p>
  </div>
</template>
<script>
alert("I`m here!");
document.body.style.backgroundColor = "#b9f7c3";
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
}
</style>
