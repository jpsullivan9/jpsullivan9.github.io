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

const showHome = async (ele) => {
    await fetchCategories();
    const homeContent = `
        <div class="row justify-content-md-center p-2">
            <img class="img-fluid" src="https://www.x-cart.com/wp-content/uploads/2019/01/ecommerce.jpg" alt="Online commerce courtesy xcart"/>
        </div>
        <div class="row p-2">
            <div class="col-2"></div>
            <div class="col-8">
                <div class="row">${displayCategories(categories)}</div>
            </div>
            <div class="col-2"></div>
        </div>
    `;
    const catMenuItems = `
        <a class="dropdown-item" href="#">
            Categories &raquo;
        </a>
        <ul class="dropdown-menu dropdown-submenu">
            ${categories.map(cat => `
                <li>
                    <a class="dropdown-item" href="#">${cat.name}</a>
                </li>
            `).join("")}
        </ul>
    `;
    setActive(ele);
    document.querySelector("#catMenu").innerHTML = catMenuItems;
    rootContainer.innerHTML = homeContent;
};

showHome(homeEle);
