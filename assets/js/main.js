(function () {
    // Navbar burger toggle
    const navbarBurgers = document.querySelectorAll(".navbar-burger");
    navbarBurgers.forEach((el) => {
        el.addEventListener("click", () => {
            const target = document.getElementById(el.dataset.target);
            el.classList.toggle("is-active");
            target.classList.toggle("is-active");
        });
    });

    // Theme toggle
    const toggle = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-icon");
    const sunSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-sun"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" /></svg>';
    const moonSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-moon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" /></svg>';

    function getTheme() {
        return (
            localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light")
        );
    }

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        icon.innerHTML = theme === "dark" ? sunSvg : moonSvg;
    }

    setTheme(getTheme());
    toggle.addEventListener("click", () =>
        setTheme(getTheme() === "dark" ? "light" : "dark"),
    );
})();
