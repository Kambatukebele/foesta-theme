//Activate sticky header on scroll
function activateStickyHeader() {
    const announcementBar = document.querySelector("#announcement"); // Targeting the announcement bar
    const header = document.querySelector("#header"); // Targeting the header
    
    let scrollY = 0;
    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
        if (scrollY > 100) {
            announcementBar.classList.add("hidden")
            header.classList.add("fixed");
            header.classList.add("top-0");
            header.classList.add("left-0");
            header.classList.add("right-0");
            header.classList.add("z-50");
        } else {
            announcementBar.classList.remove("hidden")
            header.classList.remove("fixed");
            header.classList.remove("top-0");
            header.classList.remove("left-0");
            header.classList.remove("right-0");
            header.classList.remove("z-50");
        }
        
        
        
    })
    
}

activateStickyHeader();

//Truncate function
function truncate(text, maxLength, suffix = '...') {
    // Convert text to string in case it's not
    const str = String(text);
    // Ensure maxLength is a non-negative number
    const max = Math.max(0, Number(maxLength) || 0);
  
    if (str.length <= max) return str;
    
    const suffixLength = String(suffix).length;
    
    // Check if there's space for the suffix
    if (max >= suffixLength) {
      return str.slice(0, max - suffixLength) + suffix;
    } else {
      // Not enough space for suffix, return truncated text without suffix
      return str.slice(0, max);
    }
  }
// Add to product to cart and open drawer
function addProductToCart(){
    // Toggle Cart Drawer
    const cartIcon = document.querySelector("#cartIcon"); // Targeted the cart icon inside the header.liquid
    const cartDrawer = document.querySelector("#cart-drawer");
    const closeCartDrawer = document.querySelector("#closeCartProducts");
    function openCloseCartDrawer () {        
        cartIcon.addEventListener("click", () =>{
            cartDrawer.classList.remove("translate-x-96")
        });
        closeCartDrawer.addEventListener("click", () =>{
            cartDrawer.classList.add("translate-x-96")
        })
        
    }
    openCloseCartDrawer();
    // Function to update the cart count badge
    function updateCartCount(){
        const counter = document.getElementById('cart-count'); // Grab the cart icon 
        if (!counter) return;

        fetch('/cart.js')
        .then(res => res.json())
        .then(cart => {
            counter.textContent = cart.item_count; //update the number on the cart icon
            const cartItems = cart.items; // grab the cart items inside the cart
            const container = document.querySelector("#cart-items-container");
            container.innerHTML = "";
            
            const itemHTML = cartItems.map((item) =>{
                return `<div class="w-full flex justify-center gap-4">
                        <div class="shrink-0 w-[100px] h-[160px]">
                            <img class="w-full h-full object-cover block rounded-md" src="${item.image}">
                        </div>
                        <div class="w-[150px] flex flex-col justify-center items-start gap-1">
                            <h3 class="text-base font-semibold">${truncate(item.title, 10, "")}</h3>
                            <div class="w-full flex justify-between items-center">
                            <h5 class="text-base font-normal">
                                <span class="font-semibold">Color:</span>
                                Black
                            </h5>
                            <h5 class="text-base font-normal">
                                <span class="font-semibold">Size:</span>
                                Medium
                            </h5>
                        </div>
                        <div class="w-full flex justify-start items-center gap-3">
                            <p class="text-base font-semibold text-black">$${item.presentment_price}</p>
                            <p class="text-base font-semibold text-red-700 line-through">
                               
                            </p>
                        </div>
                        <div class="w-full flex justify-between items-center gap-2">
                            <div class="w-28 border flex justify-between items-center px-2 py-1 rounded-md">
                                <span class="block text-lg">-</span>
                                <span class="block text-base">${item.quantity}</span>
                                <span class="block text-lg">+</span>
                            </div>
                            <span id="remove-from-cart-btn" class="block underline text-base ">Remove</span>
                        </div>
                    </div>
                </div>`;
            }).join("");
            container.innerHTML = itemHTML;
       })
        .catch(err =>console.error('Error fetching cart:', err));
    }

    // Call it on initial page load
    updateCartCount();
    // Handle add-to-cart buttons (if they exist on the page)
    const addBtn = document.querySelectorAll('#add-to-cart-btn');
    if (addBtn.length > 0){
        addBtn.forEach(function (btn, index) {
            btn.addEventListener('click', function () {
            const variantId = this.dataset.variantId;
            fetch('/cart/add.js', {
                method: 'Post',
                headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                },
                body: JSON.stringify({
                id: parseInt(variantId),
                quantity: 1,
                }),
            })
                .then((res) => res.json())
                .then(data => {
                    cartDrawer.classList.remove("translate-x-96"); // This opens the drawer when product is added
                    updateCartCount(); //This refresh count after add
                })
                .catch(err => {
                    console.error('Error adding to cart: ', err);
                    alert("Something went wrong adding the product")
                })
            });
        });
    }
}

addProductToCart();
