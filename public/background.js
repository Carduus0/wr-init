chrome.action.onClicked.addListener((tab) => {
  // Проверить, активен ли контентный скрипт
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: () => {
        return !!window.myContentScriptLoaded;
      },
    },
    (results) => {
      // Если контентный скрипт не активен, внедрить его
      if (results[0].result === false) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["content.js"], // Укажите путь к файлу контентного скрипта
          },
          () => {
            // После внедрения скрипта отправить сообщение для отрисовки окна
            chrome.tabs.sendMessage(tab.id, { action: "openWindow" });
          }
        );
      } else {
        // Если контентный скрипт уже активен, просто отправляем сообщение
        chrome.tabs.sendMessage(tab.id, { action: "openWindow" });
      }
    }
  );
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.imageSrc) {
//     const processingPageUrl =
//       chrome.runtime.getURL("./processing.js") +
//       "?image=" +
//       encodeURIComponent(message.imageSrc);
//     chrome.tabs.create({ url: processingPageUrl });

//     sendResponse({ status: "Image processed successfully" });
//   }

//   return true;
// });

let processingTabId = null;
let imageData = null;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // открываем PageProcessing
  if (request.action === "uploadImage") {
    const binaryString = atob(request.fileData);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const arrayBuffer = bytes.buffer;

    imageData = arrayBuffer;
    console.log("imageData", imageData);

    imageType = request.fileType; // Сохраняем MIME тип
    chrome.tabs.create({ url: "./index.html" }, function (tab) {
      processingTabId = tab.id; // Сохраняем ID для последующего общения
    });
  }
  // Отправляем  на сервер
  if (
    request.action === "imageProcessed" &&
    sender.tab.id === processingTabId
  ) {
    console.log(" Отправляем  на сервер");

    const modifiedImageData = request.modifiedImageData;
    const formData = new FormData();
    formData.append(
      "image",
      new Blob([modifiedImageData], { type: request.fileType })
    );

    // Если у вас есть параметры remove_text и user, добавьте их в formData
    if (request.remove_text) {
      formData.append("remove_text", String(request.remove_text));
    }
    if (request.user) {
      formData.append("user", request.user);
    }

    fetch("http://158.160.66.115:40000/remove_watermark", {
      method: "POST",
      body: formData,
      // body: modifiedImageData,
      // image/image_url
      // remove_text (необязательный) true/false
      // user
    })
      .then((response) => response.blob())
      .then((blob) => {
        chrome.tabs.sendMessage(processingTabId, {
          action: "serverResponse",
          serverData: blob,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        sendResponse({ error: error.message });
      });
  }
  return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tabId === processingTabId && changeInfo.status === "complete") {
    console.log("Size of imageData before sending:", imageData.byteLength);
    let bufferCopy = new Uint8Array(imageData);
    let arrayBuffer = bufferCopy.buffer;
    console.log("bufferCopy", arrayBuffer.byteLength);
    chrome.tabs.sendMessage(tabId, {
      action: "processImage",
      fileData: arrayBuffer,
      fileType: imageType,
    });
    processingTabId = null;
    imageData = null;
    imageType = null; // Сбрасываем MIME тип
  }
});
//--------------------------------

// // Убедитесь, что состояние обновляется при закрытии окна вручную
// chrome.windows.onRemoved.addListener((windowId) => {
//   Object.keys(windowsState).forEach((tabId) => {
//     if (windowsState[tabId] === windowId) {
//       delete windowsState[tabId];
//     }
//   });
// });
