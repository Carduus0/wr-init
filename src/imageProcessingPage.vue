<template></template>
<script setup>
document.addEventListener("DOMContentLoaded", () => {
  const imageSrc = localStorage.getItem("imageToProcess");
  const imageElement = document.getElementById("imageToEdit");
  imageElement.src = imageSrc;
  localStorage.removeItem("imageToProcess");
  // Инициализируйте ваши инструменты для рисования или настройки
});
</script>
