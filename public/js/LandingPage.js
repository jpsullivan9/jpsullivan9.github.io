const LandingPage = {
    render: () => {
        return `
            <div class="landing-page">
                <h1>Welcome to Anzom</h1>
                <p>Discover amazing products and services!</p>
                <button id="exploreButton">Explore Now</button>
            </div>
        `;
    },
    after_render: () => {
        document.getElementById('exploreButton').addEventListener('click', () => {
            // Redirect to the home screen when the explore button is clicked
            window.location.hash = '/';
        });
    }
};

export default LandingPage;