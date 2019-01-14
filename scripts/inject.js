var loaded = false;

chrome.runtime.onMessage.addListener(
    function (request,sender,sendResponse){
        // get api spec from yaml file
        if (request.state === 'getApi') {
            var apiLoader = setInterval(function() {
                // api yaml spec is loaded
                if (loaded) {
                    clearInterval(apiLoader);
                    // pass api spec for rendering
                    chrome.runtime.sendMessage({
                        'state': 'returnApi',
                        'tabId': request.tabId,
                        'api': document.getElementsByTagName("pre")[0].innerText
                    });
                }
            }, 1000);
        // prepare to show api spec in swagger editor
        } else if (request.state === 'renderApi') {
            var specLoader = setInterval(function() {
                // swagger editor is loaded
                if (loaded) {
                    clearInterval(specLoader);
                    localStorage.setItem('swagger-editor-content', request.api);
                    // load content in local storage
                    location.reload();
                }
            }, 1000); 
        }
    }
);

window.onload = function() {
    // page is loaded
    loaded = true;
};