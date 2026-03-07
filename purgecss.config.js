module.exports = {
  content: ["_site/**/*.html"],
  css: ["_site/assets/css/styles.css"],
  output: "_site/assets/css/",
  safelist: {
    // Classes added by JavaScript
    standard: ["is-active"],
    // Selectors with dynamic attributes
    deep: [/data-theme/],
  },
};
