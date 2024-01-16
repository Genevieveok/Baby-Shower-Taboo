const STORAGE_KEY = 'tabooGame';

// save data to local storage
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// retrieve data from local storage
function getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(data) || {};
}
