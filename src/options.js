//
// shared code - keep in-sync in background.js
//

const localStorageGet = (keys) => {
    return browser.storage.local.get(keys);
};

const defaultTabLimit = 10;
const tabLimitStorageKey = "tab-limit";
const getTabLimit = () => localStorageGet(tabLimitStorageKey).then(results => {
    return +results[tabLimitStorageKey] || defaultTabLimit;
});

//
// background code
//

const tabLimitInput = () => document.getElementById("tab-limit-input");
const tabLimitForm = () => document.getElementById("tab-limit-form");

const setTabLimitInputValue = (v) => tabLimitInput().value = v;

const saveOptions = (e) => {
    e.preventDefault();
    const inputValue = tabLimitInput().value;
    const newTabLimit = +inputValue > 0 ? +inputValue : defaultTabLimit;
    browser.storage.local.set({[tabLimitStorageKey]: newTabLimit});
    // if the user enters an invalid value, make sure the form reflects the default value
    setTabLimitInputValue(newTabLimit);
    window.close();
};

const restoreOptions = () => getTabLimit().then(setTabLimitInputValue);

document.addEventListener("DOMContentLoaded", restoreOptions);
tabLimitForm().addEventListener("submit", saveOptions);
