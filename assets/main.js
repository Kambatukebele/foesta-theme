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
    const cartIcon = document.querySelector("#cartIcon");
    const cartDrawer = document.querySelector("#cart-drawer");
    const closeCartDrawer = document.querySelector("#closeCartProducts");
  
    function openCloseCartDrawer() {
      cartIcon?.addEventListener("click", () => {
        cartDrawer?.classList.remove("translate-x-96");
      });
      closeCartDrawer?.addEventListener("click", () => {
        cartDrawer?.classList.add("translate-x-96");
      });
    }
    openCloseCartDrawer();
  
    // Re-render cart drawer contents
    function renderCartDrawer(cart) {
      const counter = document.getElementById("cart-count");
      const container = document.querySelector("#cart-items-container");
      const emptyCartMessage = document.querySelector("#empty-cart-message");
  
      if (!container || !counter) return;
  
      counter.textContent = cart.item_count;
      // container.innerHTML = "";
  
      if (cart.items.length === 0) {
        if (emptyCartMessage) emptyCartMessage.classList.remove("hidden");
        if (cartDrawer) cartDrawer.classList.add("translate-x-96"); // optional: close drawer if empty
      } else {
        if (emptyCartMessage) emptyCartMessage.classList.add("hidden");
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
  
        container.innerHTML = itemHTML;
        // SHow the total price
        const totalAmount = document.getElementById("cart-total-amount");
        if (totalAmount) {
        totalAmount.textContent = `$${(cart.total_price / 100).toFixed(2)}`;
        }

      }
    }
  
    // Load initial cart
    function updateCart() {
      fetch("/cart.js")
        .then(res => res.json())
        .then(cart => {
          renderCartDrawer(cart);
        })
        .catch(err => console.error("Error fetching cart:", err));
    }
    updateCart();
  
    // Add to cart logic
    document.querySelectorAll("#add-to-cart-btn").forEach(btn => {
      btn.addEventListener("click", function () {
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
            cartDrawer?.classList.remove("translate-x-96");
            updateCart();
          })
          .catch(err => {
            console.error("Error adding to cart: ", err);
            alert("Something went wrong adding the product.");
          });
      });
    });
  
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
    const quickViewModal = document.querySelector("#quick-view-modal");
    // Fetch the product with the help of the handle to target the corresponding product
    fetch(`/products/${handle}.js`)
    .then(res => res.json())
    .then(product =>{
      // console.log(product);
      // const colorToImage = {};

      // product.variants.forEach(variant => {
      //   const color = variant.option1; // assuming color is the first option
      //   if (!colorToImage[color] && variant.featured_image) {
      //     colorToImage[color] = variant.featured_image.src;
      //   }
      // });
      // console.log(colorToImage);
      // Render swatches
      // const container = document.getElementById('quick-view-colors');
      // for (const [color, image] of Object.entries(colorToImage)) {
      //   const div = document.createElement('div');
      //   div.className = 'color-swatch';
      //   div.innerHTML = `
      //     <div style="
      //       width: 30px; height: 30px; border-radius: 50%;
      //       background-image: url('${image}');
      //       background-size: cover; background-position: center;
      //     " title="${color}"></div>
      //     <small>${color}</small>
      //   `;
      //   container.appendChild(div);
      // }
      
      
       quickViewModal.innerHTML = `
        <div
          class="w-full block h-screen py-12 z-50 fixed top-0 left-0 right-0 bottom-0 overflow-y-scroll bg-gray-50"
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
               
                <div class="w-full flex flex-col justify-center items-start gap-3">
                  <div class="w-28 border flex justify-between items-center px-2 py-1 rounded-md">
                    <span class="block text-lg">-</span>
                    <span class="block text-base">1</span>
                    <span class="block text-lg">+</span>
                  </div>
                  <div class="w-full">
                    <button class="w-full text-center bg-black py-3 px-6 text-white rounded-md">Add To Cart</button>
                  </div>
                </div>
               
                <div class="w-full my-2">
                  <a class="block w-full text-center bg-black py-3 px-6 text-white rounded-md">Buy it now</a>
                </div>
                <a href="" class="text-base font-semibold underline">View full details</a>
              </div>

              
              <span id="closeQuickViewProduct" class="block w-7 h-7 cursor-pointer absolute -top-10 right-5">
                Close
              </span>
            </div>
          </div>
        </div>
       `
    }).join("");            
  })
  
}

  