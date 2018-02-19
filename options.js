const browserTypeFirefox = 1;
const browserTypeChrome = 2;

const getBrowser = () => {
    try {
        return [browser, browserTypeFirefox];
    } catch(ReferenceError) {
        return [chrome, browserTypeChrome];
    }
};

const [browser, browserType] = getBrowser();

const defaultTabLimit = 10;

const tabLimitStorageKey = "tab-limit";

/////// TODO: extract above

const tabLimitInput = () => document.getElementById("tab-limit-input");

const tabLimitForm = () => document.getElementById("tab-limit-form");

const setTabLimitInputValue = (v) => tabLimitInput().value = v;

const saveOptions = (e) => {
    e.preventDefault();
    browser.storage.local.set({
        [tabLimitStorageKey]: tabLimitInput().value
    });
};

const restoreOptions = () => {
    browser.storage.local.get(tabLimitStorageKey, (result) => {
        setTabLimitInputValue(result[tabLimitStorageKey] || defaultTabLimit);
    });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
tabLimitForm().addEventListener("submit", saveOptions);
