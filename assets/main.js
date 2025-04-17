// Activate sticky header on scroll
function activateStickyHeader() {
    const announcementBar = document.querySelector("#announcement");
    const header = document.querySelector("#header");
  
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
  
      if (scrollY > 100) {
        announcementBar?.classList.add("hidden");
        header?.classList.add("fixed", "top-0", "left-0", "right-0", "z-50");
      } else {
        announcementBar?.classList.remove("hidden");
        header?.classList.remove("fixed", "top-0", "left-0", "right-0", "z-50");
      }
    });
}
activateStickyHeader();
// Truncate text
function truncate(text, maxLength, suffix = "...") {
  const str = String(text);
  const max = Math.max(0, Number(maxLength) || 0);
  if (str.length <= max) return str;
  const suffixLength = String(suffix).length;
  return max >= suffixLength ? str.slice(0, max - suffixLength) + suffix : str.slice(0, max);
}
// Main cart logic
function addProductToCart() {
  const cartIcon = document.querySelector("#cartIcon"); // cart icon on the menu to open the drawer
  const cartDrawer = document.querySelector("#cart-drawer");// the drawer
  const closeCartDrawer = document.querySelector("#closeCartProducts"); // closing the drawer

  //Open and close the drawer
  openCloseCartDrawer(cartIcon, cartDrawer, closeCartDrawer);
  // Update the cart
  updateCart();
  // Add to cart logic
  buttonClickToAddToCart(cartDrawer);
  // Delegate quantity updates and removal
  document.addEventListener("click", function (e) {
    const isPlus = e.target.classList.contains("qty-plus");
    const isMinus = e.target.classList.contains("qty-minus");
    const isRemove = e.target.classList.contains("remove-from-cart-btn");

    if (isPlus || isMinus) {
      const cartItem = e.target.closest(".cart-item");
      const lineItemKey = cartItem?.dataset.lineItemKey;
      const qtyDisplay = cartItem?.querySelector(".qty-display");

      if (!lineItemKey || !qtyDisplay) return;

      const currentQty = parseInt(qtyDisplay.textContent, 10);
      const newQty = isPlus ? currentQty + 1 : currentQty - 1;
      if (newQty < 1) return;

        fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lineItemKey, quantity: newQty })
      })
        .then(() => fetch("/cart.js"))
        .then(res => res.json())
        .then(cart => renderCartDrawer(cart))
        .catch(err => console.error("Error updating cart item:", err));
    }

    if (isRemove) {
      const cartItem = e.target.closest(".cart-item");
      const lineItemKey = cartItem?.dataset.lineItemKey;

      if (!lineItemKey) return;

      fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lineItemKey, quantity: 0 })
      })
        .then(() => fetch("/cart.js"))
        .then(res => res.json())
        .then(cart => renderCartDrawer(cart))
        .catch(err => console.error("Error removing item from cart:", err));
    }
  });
}
addProductToCart();


//Open and close the drawer
function openCloseCartDrawer(cartIcon, cartDrawer, closeCartDrawer) {
  cartIcon?.addEventListener("click", () => {
    cartDrawer?.classList.remove("translate-x-96");
  });
  closeCartDrawer?.addEventListener("click", () => {
    cartDrawer?.classList.add("translate-x-96");
  });
}

// Update the cart
function updateCart() {
  fetch("/cart.js")
    .then(res => res.json())
    .then(cart => {
      renderCartDrawer(cart);
    })
    .catch(err => console.error("Error fetching cart:", err));
}

// Render cart drawer contents
function renderCartDrawer(cart) {
  const counter = document.getElementById("cart-count");// targeting the count on cart icon. see it on header.liquid
  const container = document.querySelector("#cart-items-container"); // Items inside the drawer
  
  
  if (!container || !counter) return;
  

  counter.textContent = cart.item_count; // show the count from shopify cart
  console.log(cart.items.length);
  

  if (cart.items.length === 0) {
    container.innerHTML = `<div class="text-center py-10">
        <p class="text-xl font-semibold mb-4">You have 0 products in your cart.</p>
        <a href="" class="underline text-gray-600 hover:text-blue-800">
          Continue Shopping
        </a>
      </div>`;
    
    
    //cartDrawer&&cartDrawer.classList.add("translate-x-96"); // optional: close drawer if empty
  } else {
    //emptyCartMessage&&emptyCartMessage.classList.add("hidden");
    const itemHTML = cart.items.map(item => `
      <div class="cart-item w-full h-fit py-2 flex justify-center gap-4" data-line-item-key="${item.key}">
        <div class="shrink-0 w-[100px] h-[160px]">
          <img class="w-full h-full object-cover block rounded-md" src="${item.image}">
        </div>
        <div class="w-[150px] flex flex-col justify-center items-start gap-1">
          <h3 class="text-base font-semibold">${truncate(item.title, 10, "")}</h3>
          <div class="w-full flex justify-between items-center">
            <h5 class="text-base font-normal"><span class="font-semibold">${item.options_with_values[0].name}:</span>${item.options_with_values[0].value}</h5>
            <h5 class="text-base font-normal"><span class="font-semibold">${item.options_with_values[1].name}:</span>${item.options_with_values[1].value}</h5>
          </div>
          <div class="w-full flex justify-start items-center gap-3">
            <p class="text-base font-semibold text-black">$${(item.price / 100).toFixed(2)}</p>
          </div>
          <div class="w-full flex flex-col justify-between items-start gap-2">
            <div class="w-full border flex justify-between items-center px-2 py-1 rounded-md">
              <span class="qty-minus text-xl cursor-pointer w-5">-</span>
              <span class="qty-display text-base">${item.quantity}</span>
              <span class="qty-plus text-xl cursor-pointer w-5">+</span>
            </div>
            <span class="remove-from-cart-btn block underline text-sm cursor-pointer">Remove</span>
          </div>
        </div>
      </div>
    `).join("");

    container.innerHTML = itemHTML; // add the item to the container
    // SHow the total price
    const totalAmount = document.getElementById("cart-total-amount");
    if (totalAmount) {
    totalAmount.textContent = `$${(cart.total_price / 100).toFixed(2)}`;
    }

  }
}


// Display Icons on product card
function displayIconsOnProductCard() {
  const productCards = document.querySelectorAll(".productCard"); // productCart
  const productIcons = document.querySelectorAll(".productIcon"); // show and hide all icons
  const eyeIcons = document.querySelectorAll("#icon-eye"); // eye icon
  const buttons = document.querySelectorAll("#add-to-cart-btn")
  
  //Show eye and heart icons on hover
  productCards.forEach((productCard, index) => {
    productIcons.forEach((productIcon, k_index) => {
      if (index === k_index) {
        productCard.addEventListener("mouseenter", (e) => {          
          productIcon.classList.remove("lg:opacity-0");
          productIcon.classList.add("lg:opacity-100");
          productIcon.classList.remove("-lg:right-5");
          productIcon.classList.add("lg:right-2");
          quickViewProduct(e);
          
        });
        productCard.addEventListener("mouseleave", () => {
          productIcon.classList.remove("lg:opacity-100");
          productIcon.classList.add("lg:opacity-0");
          productIcon.classList.remove("lg:right-2");
          productIcon.classList.add("-lg:right-5");
          
        });
      }
    });
  });
}
displayIconsOnProductCard();
// Quick view product
function quickViewProduct(event) {
  /*
  * Show Quick product on click
  * Targeting the eye icon on each card 
  */
  const eyeIcon = event.target.lastElementChild.firstElementChild.firstElementChild //eye icon
  const handle = event.target.firstElementChild.lastElementChild.lastElementChild.attributes[1].value // data-handle value

  eyeIcon.addEventListener("click", () =>{
    const quickViewModal = document.querySelector("#quick-view-modal"); // quick view modal
    // Fetch the product with the help of the handle to target the corresponding product
    fetch(`/products/${handle}.js`)
    .then(res => res.json())
    .then(product =>{
       console.log(product);               
       quickViewModal.innerHTML = `
        <div
          id="quick-view-card"
          class="w-full hidden h-screen py-12 z-50 fixed top-0 left-0 right-0 bottom-0 overflow-y-scroll bg-gray-50"
        >
          <div class="w-full h-full lg:h-screen relative py-12">
            <div class="container lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 flex flex-col bg-white  justify-center items-start gap-3 py-12 px-5 rounded-lg md:flex-row lg:max-w-[1024px] lg:gap-5">
              <div class="w-full shadow">
                <img src="${product.featured_image}" alt="${product.title}"/>
              </div>
             
              <div class="w-full flex flex-col justify-center items-start gap-3.5">
                
                <h2 class="text-2xl font-semibold text-black">${product.title}</h2>
                <div class="w-full flex justify-start items-center gap-2">
                  <p class="text-base font-semibold">$${(product.price / 100).toFixed(2)}</p>
                  ${
                    product.compare_at_price ? `<p class="text-base font-semibold text-red-500 line-through">
                    ${(product.compare_at_price / 100).toFixed(2)}
                  </p>` : ``
                  }
                  
                </div>
                
                <div class="w-full flex flex-col justify-start items-start gap-2.5">
                  <div class="w-full flex justify-start items-center gap-1.5">
                    <span class="text-base font-semibold">${product.options[0].name}:</span>
                    <span class="text-base font-normal">${product.options[0].values[0]}</span>
                  </div>
                  <div class="w-full flex justify-start items-center gap-2">
                    ${product.options[0].values.map((value, index) =>{
                      return `<span class="border cursor-pointer px-3 py-3 rounded-md bg-black text-white">${value}</span>`
                    }).join("")}
                  </div>
                </div>
                
                <div class="w-full flex flex-col justify-center items-start gap-2">
                  <div class="w-full flex justify-start items-start gap-2">
                    <span class="text-base font-semibold">${product.options[1].name}:</span>
                    <span class="text-base font-normal">${product.options[1].values[0]}</span>
                  </div>
                  <div class="flex justify-start items-center gap-2">
                    ${product.options[1].values.map((value, index) => {
                      return `<span class="border cursor-pointer px-3 py-3 rounded-md bg-black text-white">${value}</span>`
                    }).join("")}
                  </div>
                </div>
                <div class="w-full flex justify-start items-start gap-1.5">
                  <div class="w-28 border flex justify-between items-center px-2 py-1 rounded-md">
                    <span class="block text-lg">-</span>
                    <span class="block text-base">1</span>
                    <span class="block text-lg">+</span>
                  </div>
                  <div
                    id="quick-view-message"
                    class="bg-green-700 w-fit flex justify-center items-center gap-1.5 text-white rounded-lg py-2 px-3 duration-500 ease-in-out ml-20 opacity-1"
                  >
                    <span>
                      <svg
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#ffffff"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.00011 13L12.2278 16.3821C12.6557 16.7245 13.2794 16.6586 13.6264 16.2345L22.0001 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1892 12.2368L15.774 6.63327C16.1237 6.20582 16.0607 5.5758 15.6332 5.22607C15.2058 4.87635 14.5758 4.93935 14.226 5.36679L9.65273 10.9564L11.1892 12.2368ZM8.02292 16.1068L6.48641 14.8263L5.83309 15.6248L2.6 13.2C2.15817 12.8687 1.53137 12.9582 1.2 13.4C0.868627 13.8419 0.95817 14.4687 1.4 14.8L4.63309 17.2248C5.49047 17.8679 6.70234 17.7208 7.381 16.8913L8.02292 16.1068Z" fill="#ffffff"></path> </g>
                      </svg>
                    </span>
                    <span class="text-sm font-normal">Item added successfully</span>
                  </div>
                </div>
                
                <div class="w-full flex justify-center items-center gap-3">
                  <div class="w-full">
                    <button data-variant-id="${product.variants[0].id}" class="add-to-cart-btn w-full text-center bg-black py-3 px-6 text-white cursor-pointer rounded-md">Add To Cart</button>
                  </div>               
                  <div class="w-full my-2">
                    <a class="block w-full text-center bg-black py-3 px-6 text-white rounded-md">Buy it now</a>
                  </div>
                </div>
                <a href="${product.url}" class="text-base font-semibold underline">View full details with</a>
              </div>

              
              <span id="closeQuickViewProduct" class="block w-7 h-7 cursor-pointer absolute -top-10 right-5">
                Close
              </span>
            </div>
          </div>
        </div>
       `
       // Targeting the quick view modal card to display the quick view by removing the "class" hidden
       const quickViewCard = document.querySelector("#quick-view-card");
       quickViewCard.classList.remove("hidden");

       // This is to add to cart when quick view is displayed
       const quickViewMessage = document.querySelector("#quick-view-message");
       buttonClickToAddToCart("", quickViewMessage);       

       // Closing the quick view modal
       const closeQuickViewProduct = document.querySelector("#closeQuickViewProduct"); // close quick view modal
       closeQuickViewProduct.addEventListener("click", () =>{
        quickViewCard.classList.add("hidden");
      })
    });    
    
  }); 
  
  
}

/**
 * On click, this add to the cart. 
 * use case: 
 * trending product, 
 * quick view product item
 * collection product
 */
function buttonClickToAddToCart(drawer = null, success = null) {
  const buttons = document.querySelectorAll(".add-to-cart-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", function () {
      console.log("click on add-to-cart-btn");
      const variantId = this.dataset.variantId;
      
      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ id: parseInt(variantId), quantity: 1 })
      })
        .then(res => res.json())
        .then(() => {
          // Show the success message on the quick view modal
          success&&success.classList.remove("ml-20", "opacity-1");
          setTimeout(() => {
            success&&success.classList.add("ml-20", "opacity-1");
          }, 2000);
          drawer&&drawer.classList.remove("translate-x-96");
          
          updateCart();
        })
        .catch(err => {
          console.error("Error adding to cart: ", err);
          // alert("Something went wrong adding the product.");
        });
    });
  });
}  

  