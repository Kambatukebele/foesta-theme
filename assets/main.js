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
      container.innerHTML = "";
  
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
  