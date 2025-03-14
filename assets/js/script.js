
window.showCart = function () 
{
    window.location.href = "cart.html";
};


document.addEventListener("DOMContentLoaded", function () 
{
    const cartBadge = document.getElementById("cart-badge");
    const cartDropdownItems = document.getElementById("cart-dropdown-items");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartIcon = document.getElementById("cart-icon");
    const cartDropdown = document.getElementById("cart-dropdown");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartBadge() 
    {
        if (!cartBadge) return;
        let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalQuantity;
    }

    function renderCartDropdown() 
    {
        if (!cartDropdownItems) return;
        cartDropdownItems.innerHTML = "";
        if (cart.length === 0) 
        {
            cartDropdownItems.innerHTML = "<p class='text-muted text-center'>Cart is empty</p>";
            return;
        }

        cart.forEach((item, index) => 
        {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item","d-flex", "align-items-center", "mb-2");

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="me-2" style="width: 50px; height: 50px;">
                <div class="flex-grow-1">
                    <p class="mb-0">${item.name} (x${item.quantity})</p>
                    <p class="mb-0 text-success fw-bold">₹${(item.price * item.quantity).toFixed(2)}</p> 
                </div>
                <button class="btn btn-sm btn-danger remove-item" data-index="${index}">
                    <i class="bi bi-trash"></i>
                </button>
            `;

            cartDropdownItems.appendChild(cartItem);
        });

       // Stop dropdown from closing when clicking inside it
       cartDropdown.addEventListener("click", function (event) 
       {
            event.stopPropagation();
        });

        document.querySelectorAll(".remove-item").forEach(button => 
        {
            button.addEventListener("click", function (event) 
            {
                event.stopPropagation(); 
                let index = this.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartBadge();
                renderCartDropdown();
            });
        });
    }

    if (addToCartButtons.length > 0) 
    {
        addToCartButtons.forEach(button => 
        {
            button.addEventListener("click", function (event) 
            {
                event.preventDefault();
                const card = this.closest(".card");
                const productName = card.querySelector(".card-title").textContent;
                const productImage = card.querySelector(".card-img-top").src;
                const priceText = card.querySelector(".card-text").textContent.replace(/[^\d.]/g, "");
                const productPrice = parseFloat(priceText);

                let existingItem = cart.find(item => item.name === productName);

                if (existingItem) 
                {
                    existingItem.quantity++;
                } 
                else 
                {
                    cart.push({ name: productName, image: productImage, price: productPrice, quantity: 1 });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartBadge();
                renderCartDropdown();
            });
        });
    }

    function toggleDropdown(event) 
    {
        event.preventDefault();
        cartDropdown.classList.toggle("show");
        event.stopPropagation();
    }

    function closeDropdown(event) 
    {
        if (!cartDropdown.contains(event.target) && !cartIcon.contains(event.target)) 
        {
            cartDropdown.classList.remove("show");
        }
    }

    if (cartIcon) 
    {
        cartIcon.addEventListener("click", toggleDropdown);
    }

    document.addEventListener("click", closeDropdown);

    updateCartBadge();
    renderCartDropdown();
});




// ----------------------- Cart details -------------------------------

document.addEventListener("DOMContentLoaded", function () 
{
    const cartTableBody = document.getElementById("add_row");
    const cartSummary = document.getElementById("cart_summary"); 
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const isCheckoutPage = window.location.pathname.includes("checkout.html");

    function renderCartPage() 
    {
        cartTableBody.innerHTML = "";
        cartSummary.innerHTML = ""; 

        if (cart.length === 0) 
        {
            cartTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Your cart is empty</td></tr>`;
            return;
        }

        let totalItems = 0;
        let subtotal = 0;

        cart.forEach((item, index) => 
        {
            totalItems += item.quantity;
            subtotal += item.price * item.quantity;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;"></td>
                <td>${item.name}</td>
                <td>
                    <button class="btn btn-sm btn-secondary decrease-qty" data-name="${item.name}">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-secondary increase-qty" data-name="${item.name}">+</button>
                </td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                ${!isCheckoutPage ? `<td><button class="btn btn-danger remove" data-name="${item.name}">Remove</button></td>` : ""}
            `;
            cartTableBody.appendChild(row);
        });

        // Calculate GST (18%) 
        const gst = subtotal * 0.18;
        const finalTotal = subtotal + gst;

        // Update summary for checkout.html
        if (isCheckoutPage) 
        {
            cartSummary.innerHTML = `
                <tr>
                    <td colspan="3"></td>
                    <td><strong>Total Ammount:</strong></td>
                    <td><strong>₹${finalTotal.toFixed(2)}</strong></td>
                </tr>
            `;
        } 
        else 
        {
            cartSummary.innerHTML = `
                <tr>
                    <td colspan="4"></td>
                    <td><strong>Total Items:</strong></td>
                    <td>${totalItems}</td>
                </tr>
                <tr>
                    <td colspan="4"></td>
                    <td><strong>Subtotal:</strong></td>
                    <td>₹${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td colspan="4"></td>
                    <td><strong>GST (18%):</strong></td>
                    <td>₹${gst.toFixed(2)}</td>
                </tr>
                <tr>
                    <td colspan="4"></td>
                    <td><strong>Total Ammount:</strong></td>
                    <td><strong>₹${finalTotal.toFixed(2)}</strong></td>
                </tr>
            `;
        }

        // Attach event listeners for increasing and decreasing quantity
        document.querySelectorAll(".increase-qty").forEach(button => 
        {
            button.addEventListener("click", function () 
            {
                let name = this.getAttribute("data-name");
                let item = cart.find(i => i.name === name);
                if (item) item.quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCartPage();
            });
        });

        document.querySelectorAll(".decrease-qty").forEach(button => 
        {
            button.addEventListener("click", function () 
            {
                let name = this.getAttribute("data-name");
                let itemIndex = cart.findIndex(i => i.name === name);
                if (itemIndex !== -1) 
                {
                    if (cart[itemIndex].quantity > 1) 
                    {
                        cart[itemIndex].quantity--;
                    } 
                    else 
                    {
                        cart.splice(itemIndex, 1);
                    }
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCartPage();
            });
        });

        // Remove item from cart
        if (!isCheckoutPage) 
        {
            document.querySelectorAll(".remove").forEach(button =>
            {
                button.addEventListener("click", function () 
                {
                    let name = this.getAttribute("data-name");
                    cart = cart.filter(item => item.name !== name);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCartPage();
                });
            });
        }
    }

    // Clear Cart Function
    window.clearCart = function () 
    {
        localStorage.removeItem("cart");
        cart = [];
        renderCartPage();
    };

    // Back to Shop Function
    window.Back = function () 
    {
        window.location.href = "index.html";
    };

    renderCartPage();
});


//   Checkout

document.addEventListener("DOMContentLoaded", function () 
{
    const checkoutForm = document.getElementById("checkout-form");

    if (checkoutForm) 
    {
        checkoutForm.addEventListener("submit", function (event) 
        {
            event.preventDefault(); // Prevent form submission

            // Get Billing Info
            let billingInfo = 
            {
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                address: document.getElementById("address").value.trim(),
                phone: document.getElementById("phone").value.trim()
            };

            // Store Billing Info in Local Storage
            localStorage.setItem("billingInfo", JSON.stringify(billingInfo));

            //  Redirect to Payment Page
            window.location.href = "payment.html";
        });
    }
});




// Redirect to Payment page

document.addEventListener("DOMContentLoaded", function () 
{
    const checkoutForm = document.getElementById("checkout-form");
    
    if (checkoutForm) 
    {
        checkoutForm.addEventListener("submit", function(event) 
        {
            event.preventDefault();

            // Check cart is empty before proceeding
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cart.length === 0) 
            {
                alert("Your cart is empty!");
                return;
            }

            window.location.href = "payment.html"; 
        });
    }
});


// payment page 

document.addEventListener("DOMContentLoaded", function () 
{
    const billingInfoDiv = document.getElementById("billing_info");
    const cartItemsTable = document.getElementById("cart_items");
    const finalTotalSpan = document.getElementById("final_total");
    const qrCodeImg = document.getElementById("qr_code");
    const confirmPaymentBtn = document.getElementById("confirm_payment");

    // Retrieve Billing Information and Cart from Local Storage
    let billingInfo = JSON.parse(localStorage.getItem("billingInfo")) || {};
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Display Billing Information
    if (billingInfo && billingInfo.name) 
    {
        billingInfoDiv.innerHTML = `
            <p><strong>Name:</strong> ${billingInfo.name || "N/A"}</p>
            <p><strong>Email:</strong> ${billingInfo.email || "N/A"}</p>
            <p><strong>Address:</strong> ${billingInfo.address || "N/A"}</p>
            <p><strong>Phone:</strong> ${billingInfo.phone || "N/A"}</p>
        `;
    }
    else 
    {
        billingInfoDiv.innerHTML = `<p class="text-danger">Billing information not found. Please go back and enter details.</p>`;
    }

    // Display Cart Items
    cartItemsTable.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => 
    {
        let total = item.price * item.quantity;
        subtotal += total;

        cartItemsTable.innerHTML += `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" width="50" height="50"></td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${total.toFixed(2)}</td>
            </tr>
        `;
    });

    // Calculate GST (18%) & Final Total
    let gst = subtotal * 0.18;
    let finalTotal = isNaN(subtotal + gst) ? 0 : subtotal + gst;

    console.log("Subtotal:", subtotal);
    console.log("GST (18%):", gst);
    console.log("Final Total Amount:", finalTotal);

    // Display Final Amount in UI
    finalTotalSpan.textContent = `₹${finalTotal.toFixed(2)}`;

    // Generate QR Code for Payment
    let upiID = "example@upi";
    let upiPaymentURL = `upi://pay?pa=${upiID}&pn=YourName&mc=1234&tid=ABCD1234&tr=${finalTotal.toFixed(2)}&tn=Payment%20for%20Order`;

    const encodedUPI = encodeURIComponent(upiPaymentURL);
    const qrUrl = `https://quickchart.io/qr?text=${encodedUPI}&size=200`;

    console.log("QR Code URL:", qrUrl);

    qrCodeImg.src = qrUrl; 

    console.log("Generated QR Code URL:", qrUrl);

    // Confirm Payment & Send Email
    confirmPaymentBtn.addEventListener("click", function () 
    {
        if (!billingInfo.email) 
        {
            alert("Email is missing! Please enter your billing information.");
            return;
        }

        // Debugging: Log email before sending
        console.log("Sending email to:", billingInfo.email);

        // Format Order Details
        let emailParams = 
        {
            to_email: billingInfo.email,
            user_name: billingInfo.name,
            user_address: billingInfo.address,
            user_phone: billingInfo.phone,
            order_items: cart.map(item => `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join("\n"),
            total_amount: `₹${finalTotal.toFixed(2)}`
        };

        emailjs.send("Gowri_123", "Gowri_4321", emailParams, "CPLDU8Q42d1UX6ypJ")
            .then(response => 
            {
                alert("Payment Confirmed! Email Sent Successfully.");
                console.log("Email Sent:", response);
                localStorage.removeItem("cart");
                window.location.href = "index.html";
            })
            .catch(error => 
            {
                alert("Error sending email. Please try again.");
                console.error("Email Error:", error);
            });
    });
});



// Contact page

emailjs.init("CPLDU8Q42d1UX6ypJ"); 
        document.getElementById("contact-form").addEventListener("submit", function(event) 
        {
            event.preventDefault();
            
            emailjs.send("Gowri_123", "Gowri_4321", 
            {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value
            })
            .then(function(response) 
            {
                document.getElementById("response-message").textContent = "Message sent successfully!";
                document.getElementById("contact-form").reset();
            }, function(error) 
            {
                document.getElementById("response-message").textContent = "Failed to send message. Try again.";
            });
        });