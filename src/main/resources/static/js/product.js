fetch("/api/products")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Failed to load products");
        }
        return response.json();
    })
    .then(function (products) {
        var productList = document.getElementById("product-list");
        productList.innerHTML = "";

        if (products.length === 0) {
            productList.innerHTML = "<p>No products available yet.</p>";
            return;
        }

        var RUPEE = "\u20B9";
        var HEART = "\u2661";

        products.forEach(function (product) {
            var imagePath = product.image && product.image.indexOf("/") === 0
                ? product.image
                : "/IMAGES/" + product.image;

            var card = document.createElement("div");
            card.className = "pc-card";

            var img = document.createElement("img");
            img.className = "pc-img";
            img.src = imagePath;
            img.alt = product.name;

            var info = document.createElement("div");
            info.className = "pc-info";

            var name = document.createElement("h4");
            name.className = "pc-name";
            name.textContent = product.name;

            var desc = document.createElement("p");
            desc.className = "pc-desc";
            desc.textContent = product.description || "";

            var price = document.createElement("p");
            price.className = "pc-price";
            price.textContent = RUPEE + product.price;

            var actions = document.createElement("div");
            actions.className = "pc-actions";

            var addBtn = document.createElement("button");
            addBtn.className = "pc-add";
            addBtn.textContent = "Add to Cart";
            addBtn.addEventListener("click", function () {
                addToCart(product.name, Number(product.price), imagePath);
            });

            var heartBtn = document.createElement("button");
            heartBtn.className = "pc-heart";
            heartBtn.title = "Add to Wishlist";
            heartBtn.textContent = HEART;
            heartBtn.addEventListener("click", function () {
                addToWishlist(product.name, Number(product.price), imagePath);
            });

            actions.appendChild(addBtn);
            actions.appendChild(heartBtn);

            info.appendChild(name);
            info.appendChild(desc);
            info.appendChild(price);
            info.appendChild(actions);

            card.appendChild(img);
            card.appendChild(info);
            productList.appendChild(card);
        });
    })
    .catch(function (error) {
        console.error("Product loading error:", error);
        document.getElementById("product-list").innerHTML =
            "<p>Could not load products. Please try again.</p>";
    });