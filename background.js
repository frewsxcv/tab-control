const browserTypeFirefox = 1;
const browserTypeChrome = 2;

const storageTabCountKey = 'tab-count';

const getBrowser = () => {
    try {
        return [browser, browserTypeFirefox];
    } catch(ReferenceError) {
        return [chrome, browserTypeChrome];
    }
};

const maxNumTabs = 10;
const [browser, browserType] = getBrowser();

browser.tabs.onCreated.addListener(newTab => {
    getUnpinnedTabs().then(tabs => {
        if (tabs.length > maxNumTabs) {
            browser.tabs.remove(newTab.id);
        }
        browser.storage.local.set({[storageTabCountKey]: tabs.length});
    });
});

browser.tabs.onRemoved.addListener(tabId => {
    // This listener can get fired before the tab is removed, so we'll need
    // to explicitly filter out the removed tab.
    getUnpinnedTabs()
        .then(tabs => tabs.filter(tab => tab.id !== tabId))
        .then(tabs => {
            browser.storage.local.set({[storageTabCountKey]: tabs.length});
        });
})

browser.storage.onChanged.addListener(changes => {
    if (changes.hasOwnProperty(storageTabCountKey)) {
        browser.storage.local.get(storageTabCountKey, items => {
            browser.browserAction.setBadgeText({
                text: items[storageTabCountKey].toString()
            });
        });
    }
});

const getTabs = () => {
    if (browserType === browserTypeChrome) {
        return new Promise((resolve, reject) => {
            browser.tabs.query({}, tabs => {
                resolve(tabs)
            });
        });
    } else {
        return browser.tabs.query({});
    }
};

const getUnpinnedTabs = () => {
    return getTabs().then(tabs => tabs.filter(tab => !tab.pinned));
};
