const plusToggles = document.querySelectorAll(".plusToggle");
const minusToggles = document.querySelectorAll(".minusToggle");
const displayContent = document.querySelectorAll(".displayFooterContent");

plusToggles.forEach((plus, index) => {
  const minus = minusToggles[index];
  const content = displayContent[index];

  plus.addEventListener("click", () => {
    plus.classList.replace("block", "hidden");
    minus.classList.replace("hidden", "block");
    content.classList.replace("hidden", "block");
  });

  minus.addEventListener("click", () => {
    plus.classList.replace("hidden", "block");
    minus.classList.replace("block", "hidden");
    content.classList.replace("block", "hidden");
  });
});
