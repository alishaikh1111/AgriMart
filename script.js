// ======================================================
// AGRIMART JAVASCRIPT
// ======================================================


// ======================================================
// CART DATA
// ======================================================

let cart = JSON.parse(
    localStorage.getItem("agrimartCart")
) || [];


// ======================================================
// SAVE CART
// ======================================================

function saveCart() {

    localStorage.setItem(
        "agrimartCart",
        JSON.stringify(cart)
    );

}


// ======================================================
// UPDATE CART COUNT
// ======================================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    let totalQuantity = 0;

    cart.forEach(function(product) {

        totalQuantity += Number(product.quantity);

    });

    cartCount.textContent = totalQuantity;

}


// ======================================================
// ADD PRODUCT TO CART
// ======================================================

function addToCart(productName, productPrice) {

    console.log("Add to cart clicked:", productName, productPrice);

    // Check if product already exists
    const existingProduct = cart.find(function(product) {
        return product.name === productName;
    });

    // If product already exists, increase quantity
    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity) + 1;

    } else {

        // Add new product
        cart.push({
            name: productName,
            price: Number(productPrice),
            quantity: 1
        });
    }

    // Save cart in browser
    localStorage.setItem("agrimartCart", JSON.stringify(cart));

    // Update cart number
    updateCartCount();

    // Show confirmation
    alert(productName + " added to cart!");

    // Open cart page
    window.location.href = "cart.html";
}


// ======================================================
// DISPLAY CART
// ======================================================

function displayCart() {

    const cartContainer =
        document.getElementById("cart-container");

    const emptyCart =
        document.getElementById("empty-cart");

    const cartSummary =
        document.getElementById("cart-summary");


    // If cart page elements are not present

    if (!cartContainer) {

        return;

    }


    // Empty cart

    if (cart.length === 0) {

        cartContainer.innerHTML = "";

        emptyCart.style.display = "block";

        cartSummary.style.display = "none";

        return;

    }


    // Hide empty cart

    emptyCart.style.display = "none";

    cartSummary.style.display = "block";


    // Clear old cart

    cartContainer.innerHTML = "";


    let totalItems = 0;

    let totalPrice = 0;


    // Create cart product cards

    cart.forEach(function(product, index) {

        const quantity =
            Number(product.quantity);

        const price =
            Number(product.price);

        const itemTotal =
            quantity * price;


        totalItems += quantity;

        totalPrice += itemTotal;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-product-info">

                <div class="cart-product-icon">
                    🌾
                </div>

                <div>

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ₹${price} per item
                    </p>

                </div>

            </div>


            <div class="quantity-control">

                <button
                    onclick="decreaseQuantity(${index})"
                >
                    −
                </button>

                <span>
                    ${quantity}
                </span>

                <button
                    onclick="increaseQuantity(${index})"
                >
                    +
                </button>

            </div>


            <div class="item-total">

                ₹${itemTotal}

            </div>


            <button
                class="remove-button"
                onclick="removeFromCart(${index})"
            >
                🗑️
            </button>

        `;


        cartContainer.appendChild(cartItem);

    });


    // Update summary

    const totalItemsElement =
        document.getElementById("total-items");

    const totalPriceElement =
        document.getElementById("total-price");


    if (totalItemsElement) {

        totalItemsElement.textContent =
            totalItems;

    }


    if (totalPriceElement) {

        totalPriceElement.textContent =
            "₹" + totalPrice;

    }

}


// ======================================================
// INCREASE QUANTITY
// ======================================================

function increaseQuantity(index) {

    if (!cart[index]) {

        return;

    }


    cart[index].quantity =
        Number(cart[index].quantity) + 1;


    saveCart();

    displayCart();

    updateCartCount();

}


// ======================================================
// DECREASE QUANTITY
// ======================================================

function decreaseQuantity(index) {

    if (!cart[index]) {

        return;

    }


    if (Number(cart[index].quantity) > 1) {

        cart[index].quantity =
            Number(cart[index].quantity) - 1;

    }

    else {

        cart.splice(index, 1);

    }


    saveCart();

    displayCart();

    updateCartCount();

}


// ======================================================
// REMOVE PRODUCT
// ======================================================

function removeFromCart(index) {

    if (!cart[index]) {

        return;

    }


    cart.splice(index, 1);


    saveCart();

    displayCart();

    updateCartCount();

}


// ======================================================
// CLEAR CART
// ======================================================

function clearCart() {

    if (cart.length === 0) {

        return;

    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear the cart?"
        );


    if (!confirmClear) {

        return;

    }


    cart = [];


    saveCart();

    displayCart();

    updateCartCount();

}


// ======================================================
// CHECKOUT
// ======================================================

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty!"
        );

        return;

    }


    window.location.href =
        "checkout.html";

}

// ======================================================
// SEARCH PRODUCTS
// ======================================================

function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    const productContainer =
        document.getElementById("productContainer");


    if (!searchInput || !productContainer) {

        return;

    }


    const searchText =
        searchInput.value.toLowerCase().trim();


    const products =
        productContainer.querySelectorAll(
            ".product-card"
        );


    products.forEach(function(product) {

        const productText =
            product.textContent.toLowerCase();


        if (
            productText.includes(searchText)
        ) {

            product.style.display = "block";

        }

        else {

            product.style.display = "none";

        }

    });

}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Update cart count

        updateCartCount();


        // Display cart if cart page

        displayCart();


        // Search

        const searchInput =
            document.getElementById("searchInput");


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchProducts
            );

        }

    }
);
// ======================================================
// AGRIMART USER SYSTEM
// ======================================================


// ======================================================
// REGISTER USER
// ======================================================

function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const phone = document.getElementById("registerPhone").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !phone || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("agrimartUsers")) || [];

    const existingUser = users.find(function(user) {
        return user.email === email;
    });

    if (existingUser) {
        alert("Email already registered!");
        return;
    }

    const newUser = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    users.push(newUser);

    localStorage.setItem("agrimartUsers", JSON.stringify(users));

    alert("Registration successful! Please login.");

    window.location.href = "login.html";
}

    // Check passwords

    if (password !== confirmPassword) {

        alert("Passwords do not match!");

        return;

    }


    // Get existing users

    let users =
        JSON.parse(
            localStorage.getItem("agrimartUsers")
        ) || [];


    // Check existing email

    const existingUser =
        users.find(
            function(user) {

                return user.email === email;

            }
        );


    if (existingUser) {

        alert(
            "An account with this email already exists!"
        );

        return;

    }


    // Create user

    const newUser = {

        name: name,

        email: email,

        phone: phone,

        password: password

    };


    users.push(newUser);


    // Save users

    localStorage.setItem(
        "agrimartUsers",
        JSON.stringify(users)
    );


    alert(
        "Account created successfully!"
    );


    window.location.href =
        "login.html";





// ======================================================
// LOGIN USER
// ======================================================

function loginUser(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    const users =
        JSON.parse(
            localStorage.getItem("agrimartUsers")
        ) || [];


    const user =
        users.find(
            function(account) {

                return (
                    account.email === email &&
                    account.password === password
                );

            }
        );


    if (!user) {

        alert(
            "Invalid email or password!"
        );

        return;

    }


    // Save logged-in user

    localStorage.setItem(
        "agrimartLoggedInUser",
        JSON.stringify(user)
    );


    alert(
        "Login successful! Welcome " +
        user.name
    );


    window.location.href =
        "index.html";

}



// ======================================================
// LOGOUT USER
// ======================================================

function logoutUser() {

    localStorage.removeItem(
        "agrimartLoggedInUser"
    );


    alert(
        "You have been logged out."
    );


    window.location.href =
        "index.html";

}



// ======================================================
// WISHLIST
// ======================================================

let wishlist =
    JSON.parse(
        localStorage.getItem(
            "agrimartWishlist"
        )
    ) || [];


// ======================================================
// SAVE WISHLIST
// ======================================================

function saveWishlist() {

    localStorage.setItem(
        "agrimartWishlist",
        JSON.stringify(wishlist)
    );

}


// ======================================================
// ADD TO WISHLIST
// ======================================================

function addToWishlist(
    productName,
    productPrice
) {

    const exists =
        wishlist.find(
            function(product) {

                return product.name === productName;

            }
        );


    if (exists) {

        alert(
            "Product is already in your wishlist!"
        );

        return;

    }


    wishlist.push({

        name: productName,

        price: Number(productPrice)

    });


    saveWishlist();


    alert(
        "❤️ Product added to wishlist!"
    );

}


// ======================================================
// REMOVE FROM WISHLIST
// ======================================================

function removeFromWishlist(index) {

    wishlist.splice(index, 1);

    saveWishlist();

    displayWishlist();

}


// ======================================================
// DISPLAY WISHLIST
// ======================================================

function displayWishlist() {

    const container =
        document.getElementById(
            "wishlist-container"
        );


    const emptyWishlist =
        document.getElementById(
            "empty-wishlist"
        );


    if (!container) {

        return;

    }


    if (wishlist.length === 0) {

        container.innerHTML = "";

        emptyWishlist.style.display =
            "block";

        return;

    }


    emptyWishlist.style.display =
        "none";


    container.innerHTML = "";


    wishlist.forEach(
        function(product, index) {

            const card =
                document.createElement("div");


            card.className =
                "wishlist-item";


            card.innerHTML = `

                <div class="wishlist-icon">
                    🌱
                </div>

                <div class="wishlist-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ₹${product.price}
                    </p>

                </div>


                <button
                    class="wishlist-cart-button"
                    onclick="wishlistAddToCart(${index})"
                >
                    🛒 Add to Cart
                </button>


                <button
                    class="wishlist-remove-button"
                    onclick="removeFromWishlist(${index})"
                >
                    🗑️ Remove
                </button>

            `;


            container.appendChild(card);

        }
    );

}


// ======================================================
// WISHLIST → CART
// ======================================================

function wishlistAddToCart(index) {

    const product =
        wishlist[index];


    if (!product) {

        return;

    }


    let cart =
        JSON.parse(
            localStorage.getItem(
                "agrimartCart"
            )
        ) || [];


    const existing =
        cart.find(
            function(item) {

                return item.name === product.name;

            }
        );


    if (existing) {

        existing.quantity =
            Number(existing.quantity) + 1;

    }

    else {

        cart.push({

            name: product.name,

            price: product.price,

            quantity: 1

        });

    }


    localStorage.setItem(
        "agrimartCart",
        JSON.stringify(cart)
    );


    window.location.href =
        "cart.html";

}



// ======================================================
// INITIALIZE WISHLIST
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayWishlist();

    }
);
function addToWishlist(productName, productPrice) {
    let wishlist = JSON.parse(localStorage.getItem("agrimartWishlist")) || [];

    const exists = wishlist.find(function(product) {
        return product.name === productName;
    });

    if (exists) {
        alert(productName + " is already in your wishlist!");
        return;
    }

    wishlist.push({
        name: productName,
        price: Number(productPrice)
    });

    localStorage.setItem(
        "agrimartWishlist",
        JSON.stringify(wishlist)
    );

    alert(productName + " added to wishlist ❤️");
}