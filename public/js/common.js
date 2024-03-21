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
    switch (currentPageId) {
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

const getRandomImage = (images) => {
    const minCeiled = Math.ceil(1);
    const maxFloored = Math.floor(images.length);
    // The maximum is inclusive and the minimum is inclusive
    const randomIndex = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    return images[randomIndex];
};

const getNoDescContent = (desc) => {
    if (!desc) {
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed dignissim leo, eget pharetra enim. Donec quis dignissim tellus. Sed aliquet, nisi eget elementum porta, mauris nulla pharetra nisi, eget vulputate arcu purus posuere lorem. Nunc et erat turpis. Duis rutrum ut magna laoreet consequat. Ut finibus ante venenatis dolor venenatis, at lacinia tellus consectetur. Quisque dictum id dolor eu pulvinar. Duis ultricies neque ut mattis rhoncus. Mauris sem tellus, accumsan nec massa quis, viverra sagittis nulla. Vestibulum auctor sapien vel odio ullamcorper faucibus. Duis congue sagittis vestibulum."
    }
    return desc;
};

module.exports = { getNoDescContent, getRandomImage, noImageUrl, buildHash, setHashForUrl, setActive }