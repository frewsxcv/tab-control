const browserTypeFirefox = 1;
const browserTypeChrome = 2;

const getBrowser = () => {
    try {
        return [browser, browserTypeFirefox];
    } catch(ReferenceError) {
        return [chrome, browserTypeChrome];
    }
};

const maxNumTabs = 5;
const [browser, browserType] = getBrowser();

browser.tabs.onCreated.addListener(tabId => {
    console.log(tabId);
    getTabs(tabs => {
        const numTabsOpen = tabs.filter(tab => !tab.pinned).length;
        if (numTabsOpen > maxNumTabs) {
            const newTab = tabs.filter(tab => tab.active)[0];
            removeTab(newTab.id);
        }
    });
});

const getTabs = callback => {
    if (browserType === browserChrome) {
        browser.tabs.query({}, tabs => callback(tabs));
    } else {
        browser.tabs.query({}).then(tabs => callback(tabs));
    }
};

const removeTab = tabId => {
    browser.tabs.remove(tabId);
};
