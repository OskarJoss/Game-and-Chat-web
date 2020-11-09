const playAgainBtn = document.querySelector(".playAgainBtn");

playAgainBtn.addEventListener("click", () => {
  if (location.search) {
    const game = location.search.split("=")[1];
    window.location.replace(`/${game}.html`);
  }
});
