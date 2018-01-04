const browserTypeFirefox = 1;
const browserTypeChrome = 2;

const storageTabCountKey = 'tab-count';

const badgeBackgroundColorGrey = '#636c72';
const badgeBackgroundColorYellow = '#f0ad4e';
const badgeBackgroundColorRed = '#d9534f';

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
        setTabCountIntoStorage(tabs.length);
    });
});

browser.tabs.onRemoved.addListener(tabId => {
    // This listener can get fired before the tab is removed, so we'll need
    // to explicitly filter out the removed tab to make sure it's not factored
    // into the new tab count.
    getUnpinnedTabs()
        .then(tabs => tabs.filter(tab => tab.id !== tabId))
        .then(tabs => setTabCountIntoStorage(tabs.length));
})

browser.storage.onChanged.addListener(changes => {
    if (changes.hasOwnProperty(storageTabCountKey)) {
        onTabCountChange();
    }
});

const onTabCountChange = newTabCount => {
    getTabCountFromStorage().then(tabCount => {
        browser.browserAction.setBadgeBackgroundColor({
            color: getBadgeBackgroundColor(tabCount),
        });
        browser.browserAction.setBadgeText({text: tabCount.toString()});
    });
};

const getBadgeBackgroundColor = tabCount => {
    if (tabCount < maxNumTabs) {
        return badgeBackgroundColorGrey;
    } else if (tabCount === maxNumTabs) {
        return badgeBackgroundColorYellow;
    } else {
        return badgeBackgroundColorRed;
    }
}

const setTabCountIntoStorage = tabCount => {
    browser.storage.local.set({[storageTabCountKey]: tabCount});
};

const getTabCountFromStorage = () => {
    return localStorageGet(storageTabCountKey)
        .then(results => results[storageTabCountKey]);
};

const localStorageGet = (keys) => {
    if (browserType === browserTypeChrome) {
        return new Promise((resolve, reject) => {
            browser.storage.local.get(keys, results => {
                resolve(results);
            });
        });
    } else {
        return browser.storage.local.get(keys);
    }
};

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
