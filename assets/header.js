// Toggle menu on mobile
const ToggleMenu = () => {
  const hamburgerMenu = document.querySelector("#hamburgerMenu");
  const closeMenu = document.querySelector("#closeMenu");
  const menu = document.querySelector("#menu");

  hamburgerMenu.addEventListener("click", () => {
    menu.classList.remove("-left-[1300px]");
    menu.classList.add("left-0");
    closeMenu.classList.remove("hidden");
    hamburgerMenu.classList.add("hidden");
  });

  closeMenu.addEventListener("click", () => {
    menu.classList.add("-left-[1300px]");
    menu.classList.remove("left-0");
    closeMenu.classList.add("hidden");
    hamburgerMenu.classList.remove("hidden");
  });
};
// Toggle search bar
const ToggleSearch = () => {
  const searchBox = document.querySelector("#search");
  const searchIcon = document.querySelector("#searchIcon");
  const closeSearch = document.querySelector("#closeSearch");

  searchIcon.addEventListener("click", () => {
    searchBox.classList.remove("lg:-top-96");
    searchBox.classList.add("lg:top-0");
  });
  closeSearch.addEventListener("click", () => {
    searchBox.classList.add("lg:-top-96");
    searchBox.classList.remove("lg:top-0");
  });
};

// Toggle Cart item
const ToggleCartItem = () =>{
  const cartIcon = document.querySelector("#cartIcon"); // Targeted the cart icon inside the header.liquid
  const cartProducts = document.querySelector("#cart-products");
  const closeCartProducts = document.querySelector("#closeCartProducts");
  cartIcon.addEventListener("click", () =>{
    cartProducts.classList.remove("translate-x-96")
  });
  closeCartProducts.addEventListener("click", () =>{
    cartProducts.classList.add("translate-x-96")
  })
}

ToggleMenu();
ToggleSearch();
ToggleCartItem();
