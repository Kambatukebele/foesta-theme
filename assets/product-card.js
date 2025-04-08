const productCards = document.querySelectorAll(".productCard");
const productIcons = document.querySelectorAll(".productIcon");
const quickViewProduct = document.querySelector("#quick-view-product");
const closeQuickViewProduct = document.querySelector("#closeQuickViewProduct");

productCards.forEach((productCard, index) => {
  productIcons.forEach((productIcon, k_index) => {
    if (index === k_index) {
      productCard.addEventListener("mouseenter", () => {
        productIcon.classList.remove("lg:opacity-0");
        productIcon.classList.add("lg:opacity-100");
        productIcon.classList.remove("-lg:right-5");
        productIcon.classList.add("lg:right-2");
      });

      // Show Quic product on click
      productIcon.addEventListener("click", () =>{        
        quickViewProduct.classList.replace("hidden", "block");        
      });
      //hide quick product on click
      closeQuickViewProduct.addEventListener("click", () =>{
        quickViewProduct.classList.replace("block", "hidden");
      })
    }
    productCard.addEventListener("mouseleave", () => {
      productIcon.classList.remove("lg:opacity-100");
      productIcon.classList.add("lg:opacity-0");
      productIcon.classList.remove("lg:right-2");
      productIcon.classList.add("-lg:right-5");
    });
  });
});
