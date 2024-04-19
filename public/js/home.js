const homeEle = document.querySelector("#homeLnk");
const images = [
    "https://www.x-cart.com/wp-content/uploads/2019/01/ecommerce.jpg",
    "https://blog.flock.com/hs-fs/hubfs/Ecommerce.jpeg?width=1800&height=600&name=Ecommerce.jpeg",
    "https://www.cloudways.com/blog/wp-content/uploads/Ecommerce-Shopping-Infographics.png",
    "https://blog.hubspot.com/hubfs/ecommerce%20marketing.jpg",
    "https://www.salesforce.com/blog/wp-content/uploads/sites/2/2023/11/SF_Blog_Image_Ecommerce_Changing_Everything.png",
    "https://images.businessnewsdaily.com/app/uploads/2022/04/04073619/how-ecommerce-works.png",
    "https://www.salesforce.com/ca/blog/wp-content/uploads/sites/12/2023/10/what-retailers-need-to-know-about-ecommerce-header.png",
    "https://imatrix.com/wp-content/uploads/sites/12/2021/03/ecommerce.jpg"
];

const showHome = (ele) => {
    const homeContent = `
        <div class="row justify-content-md-center p-2">
            <img class="img-fluid" src="${getRandomImage(images)}" alt="Online commerce courtesy xcart"/>
        </div>
        <div class="row p-2">
            <div class="col-2"></div>
            <div class="col-8">
                <div class="row">${displayCategories(false, categories)}</div>
            </div>
            <div class="col-2"></div>
        </div>
    `;
    setActive(ele);
    rootContainer.innerHTML = homeContent;
};

const determineLogin = () => {
    const username = localStorage.getItem("username");
    if (username !== null && username !== undefined) {
        const loginEle = document.querySelector("#loginLnk");
        loginEle.innerHTML = "Welcome " + username + "!";
    }
};

const initialize = async () => {
    await fetchCategories();
    loadMenu();
    determineLogin();
    const currHash = window.location.hash?.replace("#", "");
    if (currHash !== "") {
        const values = currHash.split("&");
        values.forEach(st => {
            const value = st.split("=");
            urlHash.set(value[0], value[1]);
        });
    }
    if (urlHash.get("subCat") !== undefined) {
        displayListingPage(urlHash.get("subCat"));
    } else if (urlHash.get("cat") !== undefined) {
        displayLandingPage(urlHash.get("cat"));
    } else {
        showHome(homeEle);
    }
};

initialize();
