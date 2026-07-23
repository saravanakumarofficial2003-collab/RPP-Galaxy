window.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.innerHTML = `
    header, nav, .topbar, .navbar {
      display: none !important;
    }
    body {
      margin-top: 0 !important;
    }
  `;
  document.head.appendChild(style);
});
