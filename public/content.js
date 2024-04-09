// Флаг, показывающий, что этот скрипт уже запущен
window.myContentScriptLoaded = true;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openWindow") {
    createAndShowWindow();
  }
});

function createAndShowWindow() {
  const shadowHost = document.createElement("div");
  document.body.appendChild(shadowHost);
  shadowHost.id = "shadow-host";
  const shadowRoot = shadowHost.attachShadow({ mode: "open" });
  const shadowContent = document.createElement("div");
  shadowContent.id = "pageContainer"; // class="page-container"
  shadowContent.innerHTML = `
  <header class="header">
    <div class="title">Remove Watermark</div>
    <div class="title">from Photo</div>
  </header>
  <main class="main center-col" >
  <div id="dropZone" class=" center-col drop-zone">
    <button id="reUploadBtn" class="re-upload__btn center-col" style="display: none;">
    <svg id="svgReUploadImg"  width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path id="pathArrowReUploadImg" d="M13.5236 3.21934L19.2833 9.03934C19.5722 9.33216 19.5722 9.80652 19.2833 10.0993C19.1457 10.2423 18.9569 10.3229 18.7597 10.3229C18.5625 10.3229 18.3737 10.2423 18.2361 10.0993L13.741 5.55934V16.7893C13.741 17.2036 13.4092 17.5393 13 17.5393C12.5908 17.5393 12.259 17.2036 12.259 16.7893V5.55934L7.76391 10.0993C7.62636 10.2419 7.43719 10.3214 7.2403 10.3193C7.04364 10.3203 6.85489 10.241 6.7167 10.0993C6.42777 9.80652 6.42777 9.33216 6.7167 9.03934L12.4764 3.21934C12.7657 2.92689 13.2343 2.92689 13.5236 3.21934Z" fill="white"/>
      <path id="pathReUploadImg" d="M8.0603 19.0793H17.9397C18.3489 19.0793 18.6807 19.4151 18.6807 19.8293C18.6807 20.2436 18.3489 20.5793 17.9397 20.5793H8.0603C7.65108 20.5793 7.31934 20.2436 7.31934 19.8293C7.31934 19.4151 7.65108 19.0793 8.0603 19.0793Z" fill="white"/>
    </svg>
    Re-Upload</button>
    <div id="uploadInfo" class="upload__info center-col">
      <div id="uploadImg" class="upload__img">
        <svg id="svgUploadImg" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path id="pathUploadImg" d="M35 27.5V35H5V27.5H0V35C0 37.75 2.25 40 5 40H35C37.75 40 40 37.75 40 35V27.5H35ZM7.5 12.5L11.025 16.025L17.5 9.575V30H22.5V9.575L28.975 16.025L32.5 12.5L20 0L7.5 12.5Z" fill="#1C1C1E"/>
          </svg>
      </div>
      <button id="uploadBtn" class="upload__btn center-col">Upload Image</button>
      <div id="uploadTextWrapper" class="upload__text-wrapper">
        <h3 class="upload__text">Or drop your image file here to remove the watermark!</h3>
      </div>
    </div>
    <input type="file" id="fileInput" accept="image/*" />
    <img id="preview" style="display:none;">
  </div>
    <button class="processing" id = "startProcessingBtn">Start Processing</button>
</main>`;
  const shadowStyles = document.createElement("style");
  shadowStyles.textContent = `
  #shadow-container {
    position: fixed;
    top: 40px;
    right: 10px;
    width: 450px;
    height: 600px;
    padding: 10px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 10000;
  }
  #close-button {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }

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
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 294px;
    background-color: #eaddff;
    border-radius: 24px;
    border: 2px dashed black;
    cursor: pointer;
  }
  #dropZone img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  #drop-zone.dragover {
    border-color: #000; /* Выделение области при перетаскивании */
  }
  #fileInput {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }
  .upload__info{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* Остальные стили для инструкций... */
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
`;

  const shadowContainer = document.createElement("div");
  shadowContainer.id = "shadow-container";
  const closeButton = document.createElement("button");
  closeButton.id = "close-button";
  closeButton.textContent = "Close";
  closeButton.onclick = () => {
    shadowHost.remove();
    // shadowHost.style.display = "none";
  };

  shadowRoot.appendChild(shadowStyles);
  shadowContainer.appendChild(closeButton);
  shadowContainer.appendChild(shadowContent);
  shadowRoot.appendChild(shadowContainer);
  // requestAnimationFrame(() => {
  //   initializeEventListeners(shadowRoot);
  // });
  const startProcessingBtn = shadowRoot.querySelector("#startProcessingBtn");
  const uploadInfo = shadowRoot.querySelector("#uploadInfo");
  const dropZone = shadowRoot.querySelector("#dropZone");
  const fileInput = shadowRoot.querySelector("#fileInput");
  let currentFile = null;

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault(); // Обязательно, чтобы разрешить обработку файла
    const files = event.dataTransfer.files;
    // for (let i = 0; i < files.length; i++) {
    //   if (files[i].type.match("image.*")) {
    //     handleFiles(files[i]);
    //   } else {
    //     console.error("File is not an image");
    //   }
    // }
    if (files.length > 0) {
      const file = files[0];
      handleFiles(file);
    } else {
      console.error("No files were dropped.");
    }
  });

  //   const imageUrl = event.dataTransfer.getData("text/uri-list");
  //   if (imageUrl && isImageUrl(imageUrl)) {
  //     chrome.runtime.sendMessage(
  //       { action: "fetchImage", imageUrl },
  //       (response) => {
  //         if (response.fileData) {
  //           // Преобразование ArrayBuffer обратно в Blob
  //           const blob = new Blob([response.fileData], {
  //             type: response.fileType,
  //           });
  //           const objectURL = URL.createObjectURL(blob);
  //           // Теперь у нас есть objectURL, который мы можем использовать для отображения изображения
  //           displayImage(objectURL, dropZone);
  //           // Для сохранения файла нам нужно преобразовать Blob в File
  //           currentFile = new File([blob], "downloaded-image.png", {
  //             type: blob.type,
  //           });
  //         } else if (response.error) {
  //           console.error("Error retrieving image:", response.error);
  //         }
  //       }
  //     );
  //   } else {
  //     // Пытаемся получить файл из события перетаскивания
  //     const files = event.dataTransfer.files;
  //     if (files.length > 0 && isImageFile(files[0])) {
  //       currentFile = files[0];
  //       previewFile(files[0], dropZone);
  //     } else {
  //       console.error("Not a valid image or image file");
  //     }
  //   }
  //});

  // function handleDrop(event, dropZone) {
  //   event.preventDefault();
  //   event.dataTransfer.dropEffect = "copy";
  //   // clearDropZone(dropZone);
  //   const styles = `
  //   max-width: 100%;
  //   max-height: 100%;
  //   object-fit: contain;
  // `;
  //   const imageUrl = event.dataTransfer.getData("text/uri-list");
  //   if (imageUrl && isImageUrl(imageUrl)) {
  //     const imgElem = document.createElement("img");
  //     imgElem.src = imageUrl;
  //     imgElem.style = `max-width: 100%; max-height: 100%; object-fit: contain;`;
  //     clearDropZone(dropZone);
  //     dropZone.appendChild(imgElem);
  //     chrome.runtime.sendMessage(
  //       { action: "fetchImage", imageUrl },
  //       (response) => {
  //         console.log("response", response);
  //         if (response.fileData) {
  //           // Преобразуем ArrayBuffer в Blob
  //           const blob = new Blob([response.fileData], {
  //             // new Blob([new Uint8Array(response.fileData)]
  //             type: response.fileType,
  //           });
  //           currentFile = blob;
  //         } else if (response.error) {
  //           console.error("Error retrieving image:", response.error);
  //         }
  //       }
  //     );
  //   } else {
  //     const imageFile = event.dataTransfer.files[0];
  //     if (imageFile && isImageFile(imageFile)) {
  //       currentFile = imageFile;
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const imgElem = document.createElement("img");
  //         imgElem.src = e.target.result;
  //         imgElem.style = styles;
  //         clearDropZone(dropZone);
  //         dropZone.appendChild(imgElem);
  //       };
  //       reader.readAsDataURL(imageFile);
  //     }
  //   }
  // }
  // function handleDrop(event, dropZone) {
  //   event.preventDefault();
  //   clearDropZone(dropZone);

  //   const files = event.dataTransfer.files;

  //   // Проверяем, есть ли файлы и является ли первый файл изображением
  //   if (files.length > 0 && isImageFile(files[0])) {
  //     const file = files[0];
  //     currentFile = file;

  //     // Создаем URL из файла для отображения в dropZone
  //     const objectURL = URL.createObjectURL(file);
  //     displayImage(objectURL, dropZone);
  //   } else {
  //     console.error("Not a valid image or no image file was dropped.");
  //   }
  // }

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    handleFiles(file, dropZone);
  });

  // fileInput.addEventListener("change", function (event) {
  //   const file = event.target.files[0];

  //   if (file) {
  //     currentFile = file;

  //     // // если файл небольшой
  //     // const reader = new FileReader();
  //     // reader.onload = function (e) {
  //     //   const img = shadowRoot.querySelector("#preview");
  //     //   img.src = e.target.result;
  //     //   img.style.display = "block";
  //     // };
  //     // reader.readAsDataURL(file); // Читаем файл как Data URL для отображения превью
  //     // Большой файл
  //     const objectURL = URL.createObjectURL(file);

  //     // Находим элемент img и устанавливаем его источник на URL файла
  //     const img = shadowRoot.querySelector("#preview");
  //     img.src = objectURL;
  //     img.style.display = "block"; // Показываем изображение

  //     // При необходимости, освобождаем URL после того как он больше не нужен
  //     img.onload = function () {
  //       URL.revokeObjectURL(objectURL);
  //     };
  //   }
  // });

  // function handleFiles(file) {
  //   currentFile = file;
  //   if (currentFile.type.startsWith("image/")) {
  //     console.log(`File size: ${currentFile.size}`);
  //     previewFile(currentFile);
  //   } else {
  //     console.log("File type is not an image or file is too large.");
  //   }
  // }
  function handleFiles(file) {
    if (file) {
      currentFile = file;

      // Удаляем предыдущее превью, если оно есть
      const existingPreview = shadowRoot.querySelector("#preview");
      if (existingPreview) {
        URL.revokeObjectURL(existingPreview.src); // Освобождаем предыдущий объектный URL
        existingPreview.remove();
      }

      // Большой файл
      const objectURL = URL.createObjectURL(file);

      // Создаем новый элемент img для превью
      const img = document.createElement("img");
      img.id = "preview";
      img.src = objectURL;
      img.style.display = "block";
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      img.style.objectFit = "contain";

      // При необходимости, освобождаем URL после того как он больше не нужен
      img.onload = function () {
        URL.revokeObjectURL(objectURL);
      };
      dropZone.innerHTML = "";
      dropZone.appendChild(img);
    }
  }

  // function previewFile(file, dropZone) {
  //   clearDropZone(dropZone);
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     displayImage(e.target.result, dropZone);
  //   };
  //   reader.onerror = (error) => {
  //     console.error("Error occurred while reading file:", error);
  //   };
  //   reader.readAsDataURL(file);
  // }

  // function displayImage(src, dropZone) {
  //   console.log("Displaying image with src:", src);
  //   // uploadInfo.style.display = "none";
  //   // dropZone.style.backgroundImage = `url(${src})`;
  //   // dropZone.style.backgroundSize = "contain";
  //   // dropZone.style.backgroundRepeat = "no-repeat";
  //   // dropZone.style.backgroundPosition = "center center";
  //   uploadInfo.style.display = "none";
  //   // Если у вас есть img элемент для отображения, добавьте его в dropZone
  //   const img = new Image();
  //   img.src = src;
  //   img.style = "max-width: 100%; max-height: 100%; object-fit: contain;";
  //   dropZone.appendChild(img);
  // }

  // function clearDropZone(dropZone) {
  //   // Получаем все дочерние элементы в dropZone, кроме uploadInfo
  //   const children = Array.from(dropZone.children).filter(
  //     (child) => child.id !== "uploadInfo"
  //   );
  //   // Удаляем их
  //   children.forEach((child) => dropZone.removeChild(child));
  //   uploadInfo.style.display = "none";
  // }
  //---------------------------------

  //------------------------------------
  // Обработчик нажатия кнопки "Start Processing"
  startProcessingBtn.addEventListener("click", function () {
    if (currentFile) {
      console.log("Отправляем файл в background скрипт");
      const reader = new FileReader();
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        const binaryString = uint8Array.reduce(
          (acc, byte) => acc + String.fromCharCode(byte),
          ""
        );
        const base64String = btoa(binaryString);

        console.log("File data size:", arrayBuffer.byteLength);
        chrome.runtime.sendMessage({
          action: "uploadImage",
          fileData: base64String,
          fileName: currentFile.name,
          fileType: currentFile.type,
        });
      };
      reader.readAsArrayBuffer(currentFile); // Читаем файл как ArrayBuffer для отправки
    } else {
      console.error("Файл не выбран");
    }
  });

  const uploadButton = shadowRoot.querySelector("#uploadBtn");
  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });
}

//-------------------------------------------------------------------------
//при отправке файла в background скрипт использование FileReader для чтения файла как ArrayBuffer
// может быть необходимо, если background скрипт требует бинарные данные файла.
// Если вам нужно отправить сам объект File, вы можете отправить его напрямую,
// поскольку File является подтипом Blob и может быть передан через сообщения расширений Chrome
//-------------------------------------------------------------------------
// function makeImagesDraggable() {
//   const images = document.querySelectorAll("img");
//   images.forEach((img) => {
//     img.setAttribute("draggable", true);
//     img.addEventListener("dragstart", (event) => {
//       const src = img.src;
//       event.dataTransfer.setData("text/uri-list", src);
//     });
//   });
// }
//--------------------------- --------
let imageSrc = "";
function isImageFile(file) {
  return file.type.startsWith("image/");
}

function isImageUrl(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}
//-----------send------------------

// function sendImageToBackground(file) {
//   if (!(file instanceof Blob)) {
//     console.error("The provided value is not a Blob.");
//     return;
//   }
//   const reader = new FileReader();
//   reader.onload = function (event) {
//     const arrayBuffer = event.target.result;
//     chrome.runtime.sendMessage({
//       action: "uploadImage",
//       fileData: arrayBuffer,
//       fileName: file.name,
//       fileType: file.type,
//     });
//   };
//   reader.onerror = function (error) {
//     console.error("Error reading file:", error);
//   };
//   reader.readAsArrayBuffer(file);
// }

// makeImagesDraggable();
//});
// Если imageSrc был создан с помощью URL.createObjectURL(), освободите его.
// if (imageSrc) {
//   URL.revokeObjectURL(imageSrc);
//   imageSrc = "";
// }
