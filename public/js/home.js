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

const showHome = () => {
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
    if (rootContainer) {
        rootContainer.innerHTML = homeContent;
    }
};

const determineLogin = (basePath) => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    const username = profile?.username;
    if (username !== null && username !== undefined) {
        let sellerMenu = "";
        const loginEle = document.querySelector("#loginLnk");
        const loginEleParent = loginEle.parentElement;
        loginEleParent.classList.add("dropdown");

        if (profile.seller && currentPageId !== "cart") {
            sellerMenu = `
            <li>
                <a class="dropdown-item" href="#" onclick="sellerForm();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>
                    Seller
                </a>
            </li>`;
        }

        loginEleParent.innerHTML = `
        <a id="loginLnk" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H392.6c-5.4-9.4-8.6-20.3-8.6-32V352c0-2.1 .1-4.2 .3-6.3c-31-26-71-41.7-114.6-41.7H178.3zM528 240c17.7 0 32 14.3 32 32v48H496V272c0-17.7 14.3-32 32-32zm-80 32v48c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32V272c0-44.2-35.8-80-80-80s-80 35.8-80 80z"/></svg>
            Welcome ${username}!
        </a>
        <ul class="dropdown-menu" aria-labelledby="loginLnkMenuLink">
            <li>
                <a class="dropdown-item" href="${basePath}pages/account.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 96l576 0c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96zm0 32V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128H0zM64 405.3c0-29.5 23.9-53.3 53.3-53.3H234.7c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7H74.7c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16z"/></svg>
                    Profile
                </a>
            </li>
            ${sellerMenu}
        </ul>`;
    };
};

const displayFlash = () => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    const coupon = profile?.coupon;
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

const loadMenu = () => {
    const catMenuItems = `
        <a class="dropdown-item" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></svg>Categories &raquo;
        </a>
        <ul class="dropdown-menu dropdown-submenu">
            ${categories.map(cat => `
                <li>
                    ${currentPageId === "cart" ? `<a class="dropdown-item" href="/#cat=${cat.id}">${cat.name}</a>` : `<a class="dropdown-item" href="#" onclick="displayLandingPage('${cat.id}')">${cat.name}</a>`}
                </li>
            `).join("")}
        </ul>
    `;
    document.querySelector("#catMenu").innerHTML = catMenuItems;
};

const initialize = async (path) => {
    buildNav(path);
    buildFooter();
    determineLogin(path);
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
        showHome();
    }
};
