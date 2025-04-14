const productCards = document.querySelectorAll(".productCard");
const productIcons = document.querySelectorAll(".productIcon");
const quickViewProducts = document.querySelector("#quick-view-product");
const closeQuickViewProducts = document.querySelector("#closeQuickViewProduct");

// function renderQuickViewProduct(icons, productViews, index) {
//   productViews.forEach((productView, p_index) =>{
//     if(index === p_index){
//       icons[index].addEventListener("click", () =>{
//         productView.classList.replace("hidden", "block");
//       }) 
//     }else{
//       productView.classList.replace("block", "hidden");
//     }              
//   })
// }


productCards.forEach((productCard, index) => {
  productIcons.forEach((productIcon, k_index) => {
    if (index === k_index) {
      productCard.addEventListener("mouseenter", () => {
        productIcon.classList.remove("lg:opacity-0");
        productIcon.classList.add("lg:opacity-100");
        productIcon.classList.remove("-lg:right-5");
        productIcon.classList.add("lg:right-2");
        // Show Quic product on click
        renderQuickViewProduct(productIcons, quickViewProducts, index) 
      });
      productCard.addEventListener("mouseleave", () => {
        productIcon.classList.remove("lg:opacity-100");
        productIcon.classList.add("lg:opacity-0");
        productIcon.classList.remove("lg:right-2");
        productIcon.classList.add("-lg:right-5");
        // Show Quic product on click
        // renderQuickViewProduct(productIcons, quickViewProducts, index) 
      });
    }
  });
});


