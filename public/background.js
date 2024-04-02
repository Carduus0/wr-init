// chrome.action.onClicked.addListener((tab) => {
//   if (tab.id) {
//     chrome.tabs.sendMessage(tab.id, { action: "toggle" });
//   }
// });
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["main.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            `Error injecting script: ${chrome.runtime.lastError.message}`
          );
        }
      }
    );
  }
});
// chrome.action.onClicked.addListener((tab) => {
//   // Проверяем состояние видимости для текущей вкладки
//   chrome.storage.local.get([`visibility_${tab.id}`], function (result) {
//     let isVisible = result[`visibility_${tab.id}`];
//     if (isVisible) {
//       // Если окно уже видно, скрываем его
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: hideWindow,
//       });
//     } else {
//       // Если окно скрыто, показываем его
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ["main.js"],
//       });
//     }
//     // Меняем и сохраняем состояние видимости
//     isVisible = !isVisible;
//     chrome.storage.local.set({ [`visibility_${tab.id}`]: isVisible });
//   });
// });

// function hideWindow() {
//   let window = document.getElementById("watermark-remover-container");
//   if (window) {
//     window.style.display = "none"; // или window.remove() для его удаления
//   }
// }
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.imageFile) {
    fetch("http://158.160.66.115:40000/remove_watermark", {
      //http://78.136.220.93:40008/remove_watermark
      method: "POST",
      body: request.imageFile,
      // image/image_url
      // remove_text (необязательный) true/false
      // user
    })
      .then((response) => response.blob()) // Преобразуем ответ в blob
      .then((blob) => {
        // Создаем URL для blob, чтобы отправить его обратно в контентный скрипт
        const imageUrl = URL.createObjectURL(blob);
        sendResponse({ imageUrl: imageUrl });
      })
      .catch((error) => {
        console.error("Error:", error);
        sendResponse({ error: error.message });
      });
  }
  return true;
});
//--------------------------------
// // content-script.js или background.js
// chrome.action.onClicked.addListener((tab) => {
//   chrome.runtime.sendMessage({action: "toggleVisibility", tabId: tab.id});
// });

// // background.js
// let windowsState = {};

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "toggleVisibility" && message.tabId) {
//     if (windowsState[message.tabId]) {
//       // Если окно уже видно, скрыть его и обновить состояние
//       chrome.windows.remove(windowsState[message.tabId]);
//       delete windowsState[message.tabId];
//     } else {
//       // Если окно скрыто, показать его и обновить состояние
//       chrome.windows.create({ /* ваша конфигурация нового окна */ }, (newWindow) => {
//         windowsState[message.tabId] = newWindow.id;
//       });
//     }
//   }
// });

// // Убедитесь, что состояние обновляется при закрытии окна вручную
// chrome.windows.onRemoved.addListener((windowId) => {
//   Object.keys(windowsState).forEach((tabId) => {
//     if (windowsState[tabId] === windowId) {
//       delete windowsState[tabId];
//     }
//   });
// });
