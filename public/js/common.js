const rootContainer = document.querySelector("#root");
const homeEle = document.querySelector("#homeLnk")
let currentActive;

const setActive = (ele) => {
    ele.classList.add("active");
    if (currentActive) {
        currentActive.classList.remove("active");
    };
    currentActive = ele;
};

const showHome = async () => {
    const homeContent = `
        <div class="row justify-content-md-center p-2">
            <img class="img-fluid" src="https://www.x-cart.com/wp-content/uploads/2019/01/ecommerce.jpg" alt="Online commerce courtesy xcart"/>
        </div>
        <div class="row p-2">
            <div class="col-3"></div>
            <div class="col-6">
                <div class="row">${await displayCategories()}</div>
            </div>
            <div class="col-3"></div>
        </div>
    `;
    rootContainer.innerHTML = homeContent;
};

const clearRoot = (ele) => {
    rootContainer.innerHTML = "";
    setActive(ele);
    showHome();
};

setActive(homeEle);
showHome();
