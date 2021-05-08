chrome.runtime.onInstalled.addListener((details) => {
    chrome.tabs.create({
        url: chrome.extension.getURL("welcome.html"),
        active: true
    })
})