const rootContainer = document.querySelector("#root");
let urlHash = new Map();
let currentPageId;
let categories;

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

const prepHash = (pageId, id) => {
    switch (pageId) {
        case "cat":
            urlHash.delete("scid");
            urlHash.delete("pid");
            urlHash.delete("seller");
            urlHash.set("cat", id);
            break;
        case "subCat":
            urlHash.delete("pid");
            urlHash.set("scid", id);
            break;
        case "prod":
            urlHash.set("pid", id);
            break;
        case "seller":
            urlHash = new Map();
            urlHash.set("seller", id);
            break;
        default:
            currentPageId = undefined;
            urlHash = new Map();
            break;
    };
};

const buildHash = (id) => {
    prepHash(currentPageId, id);
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
    let randomIndex = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    const bannerIndex = randomIndex >= images.length ? images.length - 1 : randomIndex;
    return images[bannerIndex];
};

const getNoDescContent = (desc) => {
    if (!desc) {
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed dignissim leo, eget pharetra enim. Donec quis dignissim tellus. Sed aliquet, nisi eget elementum porta, mauris nulla pharetra nisi, eget vulputate arcu purus posuere lorem. Nunc et erat turpis. Duis rutrum ut magna laoreet consequat. Ut finibus ante venenatis dolor venenatis, at lacinia tellus consectetur. Quisque dictum id dolor eu pulvinar. Duis ultricies neque ut mattis rhoncus. Mauris sem tellus, accumsan nec massa quis, viverra sagittis nulla. Vestibulum auctor sapien vel odio ullamcorper faucibus. Duis congue sagittis vestibulum."
    }
    return desc;
};
