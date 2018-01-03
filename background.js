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

browser.tabs.onCreated.addListener(newTab => {
    getTabs(tabs => {
        const numTabsOpen = tabs.filter(tab => !tab.pinned).length;
        if (numTabsOpen > maxNumTabs) {
            browser.tabs.remove(newTab.id);
        }
    });
});

const getTabs = callback => {
    if (browserType === browserTypeChrome) {
        browser.tabs.query({}, tabs => callback(tabs));
    } else {
        browser.tabs.query({}).then(tabs => callback(tabs));
    }
};
;
