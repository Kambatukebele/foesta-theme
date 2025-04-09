// Add to product to cart 
function addProductToCart(){
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
                    console.log('Product added to cart: ', data);
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
