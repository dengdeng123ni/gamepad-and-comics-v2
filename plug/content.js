
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        window.postMessage(request, '*');
    }
);

window.addEventListener("message", async function (e) {
    if (e.data && e.data.type == "proxy_request") {
        await chrome.runtime.sendMessage(e.data);
    }

    if (e.data && e.data.type == "website_proxy_request") {
        // console.log(e.data);
        await chrome.runtime.sendMessage(e.data);

    }

    if (e.data && e.data.type == "website_proxy_response") {
        if(e.data.http.option.body) e.data.http.option.body= await stringToReadStream(e.data.http.option.body);
        const rsponse = await fetch(e.data.http.url, e.data.http.option)
        const data = await readStreamToString(rsponse.body)
        let headers = [];
        rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
        await chrome.runtime.sendMessage({ id: e.data.id, proxy_response_website_url: e.data.proxy_response_website_url, type: "website_proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } });

    }

    if (e.data && e.data.type == "proxy_response") {

    }

}, false);


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

async function stringToReadStream(string) {
    const readableStream = new ReadableStream({
        start(controller) {
            for (const data of string) {
                controller.enqueue(Uint8Array.from(data));
            }
            controller.close();
        },
    });
    const response=new Response(readableStream)
    const json=await response.json();
    return JSON.stringify(json);
}

function init(){
   document.body.setAttribute("pulg","true");
}

init();
