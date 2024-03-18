const homeEle = document.querySelector("#homeLnk");

const showHome = (ele) => {
    const homeContent = `
        <div class="row justify-content-md-center p-2">
            <img class="img-fluid" src="https://www.x-cart.com/wp-content/uploads/2019/01/ecommerce.jpg" alt="Online commerce courtesy xcart"/>
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

const initialize = async () => {
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
    if (urlHash.get("subCat") !== undefined) {
        displayListingPage(urlHash.get("subCat"));
    } else if (urlHash.get("cat") !== undefined) {
        displayLandingPage(urlHash.get("cat"));
    } else {
        showHome(homeEle);
    }
};

initialize();
