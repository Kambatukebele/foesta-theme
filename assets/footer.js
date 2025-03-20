const plusToggles = document.querySelectorAll(".plusToggle");
const minusToggles = document.querySelectorAll(".minusToggle");
const displayContent = document.querySelectorAll(".displayFooterContent");

const LOOP_DISPLAY_CONTENT = (plusIndex = "", minusIndex = "") => {
  displayContent.forEach((contentElement, contentIndex) => {
    if (plusIndex === contentIndex) {
      contentElement.classList.remove("hidden");
      contentElement.classList.remove("opacity-0");
      contentElement.classList.add("block");
      contentElement.classList.add("opacity-100");
    }
    if (minusIndex === contentIndex) {
      contentElement.classList.add("hidden");
      contentElement.classList.add("opacity-0");
      contentElement.classList.remove("block");
      contentElement.classList.remove("opacity-100");
    }
  });
};

plusToggles.forEach((plusToggle, plusIndex) => {
  plusToggle.addEventListener("click", () => {
    LOOP_DISPLAY_CONTENT(plusIndex, "");
    minusToggles.forEach((minusToggle) => {
      minusToggle.classList.remove("hidden");
      minusToggle.classList.add("block");
      plusToggle.classList.add("hidden");
      plusToggle.classList.remove("block");
    });
  });
});
minusToggles.forEach((minusToggle, minusIndex) => {
  minusToggle.addEventListener("click", () => {
    LOOP_DISPLAY_CONTENT("", minusIndex);
    plusToggles.forEach((plusToggle) => {
      minusToggle.classList.add("hidden");
      minusToggle.classList.remove("block");
      plusToggle.classList.remove("hidden");
      plusToggle.classList.add("block");
    });
  });
});
