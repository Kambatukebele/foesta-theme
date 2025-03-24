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

//SLiding the card

const productAndCollection = () => {
  const SLIDER = document.querySelector("#sliderCollections");
  const nextBtn = document.querySelector("#nextBtn");
  const prevBtn = document.querySelector("#prevBtn");

  //For trending product
  const SLIDER_TRENDING = document.querySelector("#sliderProductTrending");
  const nextBtnTrending = document.querySelector("#nextBtnTrending");
  const prevBtnTrending = document.querySelector("#prevBtnTrending");

  // Define scroll amount (each card width + gap)
  const scrollAmount = 296;

  scrollCard(prevBtn, nextBtn, SLIDER);
  scrollCard(prevBtnTrending, nextBtnTrending, SLIDER_TRENDING);

  function scrollCard(prev, next, sliding) {
    // Function to scroll right
    next.addEventListener("click", () => {
      sliding.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // // Function to scroll left
    prev.addEventListener("click", () => {
      sliding.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }
};
productAndCollection();
