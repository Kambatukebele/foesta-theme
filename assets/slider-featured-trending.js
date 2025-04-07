//SLiding or scrolling the card in the trending and collection section

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
