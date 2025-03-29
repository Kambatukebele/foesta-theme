const productCards = document.querySelectorAll(".productCard");
const productIcons = document.querySelectorAll(".productIcon");

productCards.forEach((productCard, index) => {
  productIcons.forEach((productIcon, k_index) => {
    if (index === k_index) {
      productCard.addEventListener("mouseenter", () => {
        productIcon.classList.remove("opacity-0");
        productIcon.classList.add("opacity-100");
        productIcon.classList.remove("-right-5");
        productIcon.classList.add("right-2");
      });
    }
    productCard.addEventListener("mouseleave", () => {
      productIcon.classList.remove("opacity-100");
      productIcon.classList.add("opacity-0");
      productIcon.classList.remove("right-2");
      productIcon.classList.add("-right-5");
    });
  });
});
