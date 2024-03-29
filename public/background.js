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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.imageFile) {
    fetch("http://78.136.220.93:40008/remove_watermark", {
      method: "POST",
      body: request.imageFile,
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
