const rootContainer = document.querySelector("#root");
const urlHash = new Map();
let currentPageId;
let currentActive;

const setActive = (ele) => {
    ele.classList.add("active");
    if (currentActive) {
        currentActive.classList.remove("active");
    };
    currentActive = ele;
};

const setHashForUrl = () => {
    const mapItr = urlHash.entries();
    let done = false;
    let val = "";
    while (!done) {
        const hashNext = mapItr.next();
        const hashValue = hashNext.value;
        if (hashValue !== undefined) {
            if (val !== "") val += "&";
            val += `${hashValue[0]}=${hashValue[1]}`;
        }
        done = hashNext.done;
    };
    window.location.hash = val;
};

const buildHash = (id) => {
    switch(currentPageId) {
        case "cat":
            urlHash.delete("subCat");
            urlHash.set("cat", id);
            break;
        case "subCat":
            urlHash.set("subCat", id);
            break;
        default:
            currentPageId = undefined;
            urlHash = new Map();
            break;
    };
    setHashForUrl();
};

const noImageUrl = (url) => {
    if (!url) {
        return "https://static.thenounproject.com/png/3104878-200.png";
    }
    return url;
};
