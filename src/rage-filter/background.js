function doWork() {
    function waitForEl(el, callback) {
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                if (document.querySelector(el)) {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 500);
        }).then(callback).then(() => { setTimeout(() => waitForEl(el, callback), 1000) });
    }

    console.log("aaa")

    waitForEl("#comments #content-text", () => {
        let elements = document.querySelectorAll("#content-text")
        for (const element of elements) {
            if (element.innerHTML.toLowerCase().match("i love")) {
                element.innerHTML = "Too dumb to display it"
            }
        }
    })
    console.log("bbb")
}


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: doWork
        })
            .then(() => {
                console.log("INJECTED THE FOREGROUND SCRIPT.");
            })
            .catch(err => console.log(err));
    }
});