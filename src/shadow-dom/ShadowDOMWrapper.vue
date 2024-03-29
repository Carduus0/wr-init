<template>
  <div ref="shadowHost" class="shadow-host">
    <!-- Этот элемент будет хостом для Shadow DOM -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const shadowHost = ref(null);

onMounted(() => {
  if (shadowHost.value) {
    const shadowRoot = shadowHost.value.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      .custom-style {
        /* Ваши стили здесь */
      }
    `;

    shadowRoot.appendChild(style);

    // Создаём слот внутри Shadow DOM
    const slotElement = document.createElement("slot");
    shadowRoot.appendChild(slotElement);

    // Теперь слоты будут работать и отображать содержимое внутри теневого DOM
  }
});
</script>

<style>
.shadow-host {
  position: fixed;
  top: 0;
  left: 0;
  width: 440px;
  height: 580px;
  z-index: 10000;
}
</style>
