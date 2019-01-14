function onClickHandler(info, tab) {
    // someone clicks "open swagger" context menu item
    if (info.menuItemId ==='sv') {
        // open api spec yaml
        chrome.tabs.create({'url': info.linkUrl, 'selected': true}, function(tab) {
            chrome.tabs.executeScript(tab.id, {'file': 'scripts/inject.js'}, function (tab) {
                chrome.tabs.query({'currentWindow': true, 'active': true}, function(tab) {
                    // get api spec
                    chrome.tabs.sendMessage(tab[0].id, 
                        {
                            'state': 'getApi', 
                            'tabId': tab[0].id
                        }
                    );
                    console.log('get api');
                });
            });
        });
    }
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse){
        if (request.state === 'returnApi') {
            chrome.tabs.remove(request.tabId);
            // open swagger online editor
            chrome.tabs.create({'url': 'https://editor.swagger.io/', 'selected': true}, function(tab) {
                chrome.tabs.executeScript(tab.id, {'file': 'scripts/inject.js'}, function (tab) {
                    chrome.tabs.query({'currentWindow': true, 'active': true}, function(tab) {
                        chrome.tabs.sendMessage(tab[0].id, 
                            {
                                'state': 'renderApi', 
                                'tabId': tab[0].id, 
                                'api': request.api
                            }
                        );
                    });
                });
            });
        }
    }
);

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({'id': 'sv', 'title': 'swagger editor', 'contexts': ['selection', 'link']});
});