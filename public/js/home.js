const homeEle = document.querySelector("#homeLnk");
const banners = [
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
            <img class="img-fluid" src="${getRandomImage(banners)}" alt="Online commerce"/>
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
        loginEle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H392.6c-5.4-9.4-8.6-20.3-8.6-32V352c0-2.1 .1-4.2 .3-6.3c-31-26-71-41.7-114.6-41.7H178.3zM528 240c17.7 0 32 14.3 32 32v48H496V272c0-17.7 14.3-32 32-32zm-80 32v48c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32V272c0-44.2-35.8-80-80-80s-80 35.8-80 80z"/></svg>
            Welcome ${username}!
        `;
    };
};

const displayFlash = () => {
    const coupon = localStorage.getItem("coupon");
    if (coupon !== null && coupon !== undefined) {
        const banner = document.querySelector("#flashBanner");
        banner.classList.replace("d-none", "d-block");
        banner.innerHTML = `</nav><nav class="navbar"></nav>
            <img width="16" height="16" src="https://img1.picmix.com/output/stamp/normal/2/3/3/8/48332_1f664.gif"/>
            USE <span class="fs-4">${coupon}</span> TO GET 10% OFF YOUR ORDER
            <img width="16" height="16" src="https://cdn.pixabay.com/animation/2022/12/29/13/04/13-04-14-116_512.gif"/>
            <nav class="navbar">
        `;
    };
};

const initialize = async () => {
    determineLogin();
    displayFlash();
    await fetchCategories();
    loadMenu();
    const currHash = window.location.hash?.replace("#", "");
    if (currHash !== "") {
        const values = currHash.split("&");
        values.forEach(st => {
            const value = st.split("=");
            urlHash.set(value[0], value[1]);
        });
    }
    if (urlHash.get("pid") !== undefined) {
        displayDetailPage(urlHash.get("pid"));
    } else if (urlHash.get("scid") !== undefined) {
        displayListingPage(urlHash.get("scid"));
    } else if (urlHash.get("cat") !== undefined) {
        displayLandingPage(urlHash.get("cat"));
    } else {
        showHome(homeEle);
    }
};

initialize();
