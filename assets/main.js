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
        const counter = document.getElementById('cart-count');
        if (!counter) return;

        fetch('/cart.js')
        .then(res => res.json())
        .then(cart => {
            counter.textContent = cart.item_count;
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
