import { parseRequestUrl } from "./utils.js";
import HomeScreen from "./screens/HomeScreen.js"; // Import the HomeScreen component
import ProductScreen from "./screens/ProductScreen.js"; // Import the ProductScreen component
import LandingPage from "./screens/landingPage.js"; // Import the LandingPage component
import Error404Screen from "./screens/Error404Screen.js"; // Import the Error404Screen component

const routes = {
    "/": HomeScreen,
    "/product/:id": ProductScreen,
    "/landing": LandingPage,
    // Add other routes as needed
}; 

const router = () => {
    const request = parseRequestUrl();
    const { resource, id } = request;

    const parseUrl = (resource ? `/${resource}` : '/') + (id ? `/:id` : '');

    const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;

    const main = document.getElementById("main-container");
    main.innerHTML = screen.render();

    if (screen.after_render) {
        screen.after_render();
    }
};

window.addEventListener('load', router);
window.addEventListener('hashchange', router);
