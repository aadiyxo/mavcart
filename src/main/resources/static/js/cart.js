function getCart() {
    const data = localStorage.getItem('mavcart_cart');
    return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
    localStorage.setItem('mavcart_cart', JSON.stringify(cart));
}

function addToCart(name, price, image) {
    let cart = getCart();
    let existing = cart.find(function (item) {
        return item.name === name;
    });

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, price: price, image: image, qty: 1 });
    }

    saveCart(cart);
    alert(name + " added to cart");
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

function changeQty(index, change) {
    let cart = getCart();
    cart[index].qty += change;
    if (cart[index].qty < 1) {
        cart[index].qty = 1;
    }
    saveCart(cart);
    renderCart();
}

function renderCart() {
    const cart = getCart();
    const listEl = document.getElementById('cart-list');
    if (!listEl) {
        return;
    }

    if (cart.length === 0) {
        listEl.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    } else {
        listEl.innerHTML = '';
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            listEl.innerHTML += '<div class="cart-item">' +
                '<img src="' + item.image + '" alt="' + item.name + '">' +
                '<div class="cart-item-info">' +
                '<h4>' + item.name + '</h4>' +
                '<p class="price">Rs ' + item.price + '</p>' +
                '</div>' +
                '<div class="qty-control">' +
                '<button class="qty-btn" data-action="decrease" data-index="' + i + '">-</button>' +
                '<span>' + item.qty + '</span>' +
                '<button class="qty-btn" data-action="increase" data-index="' + i + '">+</button>' +
                '</div>' +
                '<button class="remove-btn" data-action="remove" data-index="' + i + '">Remove</button>' +
                '</div>';
        }
    }

    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].qty;
    }

    const subtotalEl = document.getElementById('subtotal-amt');
    const totalEl = document.getElementById('total-amt');
    if (subtotalEl) {
        subtotalEl.innerText = 'Rs ' + subtotal;
    }
    if (totalEl) {
        totalEl.innerText = 'Rs ' + subtotal;
    }
}

function getWishlist() {
    const data = localStorage.getItem('mavcart_wishlist');
    return data ? JSON.parse(data) : [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('mavcart_wishlist', JSON.stringify(wishlist));
}

function addToWishlist(name, price, image) {
    let wishlist = getWishlist();
    let existing = wishlist.find(function (item) {
        return item.name === name;
    });

    if (!existing) {
        wishlist.push({ name: name, price: price, image: image });
        saveWishlist(wishlist);
    }

    alert(name + " added to wishlist");
}

function removeFromWishlist(index) {
    let wishlist = getWishlist();
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
    renderWishlist();
}

function renderWishlist() {
    const wishlist = getWishlist();
    const listEl = document.getElementById('wishlist-list');
    if (!listEl) {
        return;
    }

    if (wishlist.length === 0) {
        listEl.innerHTML = '<p class="empty-cart">Your wishlist is empty.</p>';
        return;
    }

    listEl.innerHTML = '';
    for (let i = 0; i < wishlist.length; i++) {
        const item = wishlist[i];
        listEl.innerHTML += '<div class="product-card">' +
            '<img src="' + item.image + '" alt="' + item.name + '">' +
            '<h4>' + item.name + '</h4>' +
            '<p class="price">Rs ' + item.price + '</p>' +
            '<button class="wishlist-remove-btn" data-action="remove-wishlist" data-index="' + i + '">Remove</button>' +
            '</div>';
    }
}

function isLoggedIn() {
    return localStorage.getItem('mavcart_logged_in') === 'true';
}

function loginUser(email) {
    localStorage.setItem('mavcart_logged_in', 'true');
    localStorage.setItem('mavcart_user_email', email);
}

function logoutUser() {
    localStorage.removeItem('mavcart_logged_in');
    localStorage.removeItem('mavcart_user_email');
    window.location.href = 'index.html';
}

function renderProfile() {
    const guestView = document.getElementById('guest-view');
    const profileView = document.getElementById('profile-view');

    if (!guestView || !profileView) {
        return;
    }

    if (isLoggedIn()) {
        guestView.style.display = 'none';
        profileView.style.display = 'block';

        const email = localStorage.getItem('mavcart_user_email') || 'user@example.com';
        const emailEl = document.getElementById('profile-email-display');
        if (emailEl) {
            emailEl.innerText = email;
        }
    } else {
        guestView.style.display = 'block';
        profileView.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {

    renderCart();
    renderWishlist();
    renderProfile();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            loginUser(email);
            window.location.href = 'profile.html';
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            logoutUser();
        });
    }

    const addButtons = document.querySelectorAll('[data-action="add"]');
    addButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-image');
            addToCart(name, price, image);
        });
    });

    const wishlistButtons = document.querySelectorAll('[data-action="add-wishlist"]');
    wishlistButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-image');
            addToWishlist(name, price, image);
        });
    });

    const cartListEl = document.getElementById('cart-list');
    if (cartListEl) {
        cartListEl.addEventListener('click', function (e) {
            const target = e.target;
            if (target.tagName !== 'BUTTON') {
                return;
            }

            const action = target.getAttribute('data-action');
            const index = parseInt(target.getAttribute('data-index'));

            if (action === 'increase') {
                changeQty(index, 1);
            } else if (action === 'decrease') {
                changeQty(index, -1);
            } else if (action === 'remove') {
                removeFromCart(index);
            }
        });
    }

    const wishlistListEl = document.getElementById('wishlist-list');
    if (wishlistListEl) {
        wishlistListEl.addEventListener('click', function (e) {
            const target = e.target;
            if (target.tagName !== 'BUTTON') {
                return;
            }

            const action = target.getAttribute('data-action');
            const index = parseInt(target.getAttribute('data-index'));

            if (action === 'remove-wishlist') {
                removeFromWishlist(index);
            }
        });
    }

});