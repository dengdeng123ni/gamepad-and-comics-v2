
chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    if (request.type == "proxy_request") {
      const rsponse = await fetch(request.data.url)
      const data = await readStreamToString(rsponse.body)
      let headers = [];
      rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
      sendMessageToContentScript({ id: request.id, type: "proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } })
    }else if (request.type == "website_proxy_request") {
      request.type="website_proxy_response";
      sendMessageToTargetContentScript(request,request.proxy_request_website_url)
    }else if (request.type == "website_proxy_response") {
      request.type="proxy_response";
      sendMessageToTargetContentScript(request,request.proxy_response_website_url)
    }
  }
);
async function readStreamToString(stream) {
  const reader = stream.getReader();
  let result = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result.push(Array.from(value));
  }
  return result;
}
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function sendMessageToContentScript(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

function sendMessageToTargetContentScript(message, url) {
  chrome.tabs.query({}, function (tabs) {
    const list = tabs.filter(x => x.url.substring(0,url.length) == url);
    if(list.length==0){
      chrome.tabs.create({
        active:false,
        url: url
      }, (tab)=> {
        setTimeout(()=>{
          chrome.tabs.sendMessage(tab.id, message);
        },3000)
      })
    }
    const index=Math.floor(Math.random() * ((list.length - 0) + 0))
    if (index>-1) {
      chrome.tabs.sendMessage(list[index].id, message);
    }
  });
}

function init() {
  chrome.tabs.create({
    active:false,
		url: "https://manga.bilibili.com/"
	}, function(tab) {})
};

// init();
