
window.showCart = function () 
{
    window.location.href = "cart.html";
};


function initializeCart() 
{
    const cartBadge = document.getElementById("cart-badge");
    const cartDropdownItems = document.getElementById("cart-dropdown-items");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartIcon = document.getElementById("cart-icon");
    const cartDropdown = document.getElementById("cart-dropdown");

    let cart = [];
    try 
    {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
    } 
    catch (error) 
    {
        console.warn("Could not access localStorage:", error);
        cart = [];
    }

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
            cartItem.classList.add("cart-item", "d-flex", "align-items-center", "mb-2");

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

    function addToCart(event) 
    {
        event.preventDefault();
        const card = event.target.closest(".card");
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
    }

    function toggleDropdown(event) 
    {
        event.preventDefault();
        cartDropdown.classList.toggle("show");
        event.stopPropagation();
    }

    function closeDropdown(event) 
    {
         // Check if elements exist before calling .contains()
        if (cartDropdown && cartIcon) 
        {
            if (!cartDropdown.contains(event.target) && !cartIcon.contains(event.target)) 
            {
                cartDropdown.classList.remove("show");
            }
        }
    }

    if (addToCartButtons.length > 0) 
    {
        addToCartButtons.forEach(button => 
        {
            button.addEventListener("click", addToCart);
        });
    }

    if (cartIcon) 
    {
        cartIcon.addEventListener("click", toggleDropdown);
    }

    document.addEventListener("click", closeDropdown);

    updateCartBadge();
    renderCartDropdown();
}

// Call the function after DOM is loaded

document.addEventListener("DOMContentLoaded", initializeCart);


// Blink effect to add to cart button

function addBlinkEffect(button) 
{
    button.classList.add('blink'); 

    // Remove the class after animation completes
    setTimeout(() => {
        button.classList.remove('blink');
    }, 100);
}

// Function to all "Add to Cart" buttons

function initializeCartButtons() 
{
    document.querySelectorAll('.add-to-cart').forEach(button => 
    {
        button.addEventListener('click', function(event) 
        {
            event.preventDefault(); 
            addBlinkEffect(this);
        });
    });
}

// Initialize the event listeners on page load

document.addEventListener('DOMContentLoaded', initializeCartButtons);



// ----------------------- Cart details -------------------------------

function initializeCartPage() 
{
    const cartTableBody = document.getElementById("add_row");
    const cartSummary = document.getElementById("cart_summary"); 
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const isCheckoutPage = window.location.pathname.includes("checkout.html");

    function renderCartPage() 
    {
        if (!cartTableBody || !cartSummary) return;

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
                ${
                    !isCheckoutPage 
                    ? `<button class="btn btn-sm btn-secondary decrease-qty" data-name="${item.name}">-</button>
                       <span class="mx-2">${item.quantity}</span>
                       <button class="btn btn-sm btn-secondary increase-qty" data-name="${item.name}">+</button>`
                    : `<span class="mx-2">${item.quantity}</span>`
                }
                </td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                ${!isCheckoutPage ? `<td><button class="btn btn-danger remove" style="padding:6px 8px" data-name="${item.name}">Remove</button></td>` : ""}
            `;
            cartTableBody.appendChild(row);
        });

        // Calculate GST (18%) 
        const gst = subtotal * 0.18;
        const finalTotal = subtotal + gst;

        // if screen is mobile 
        let isMobile = window.innerWidth <= 767;

        // Update summary for checkout.html
        if (isCheckoutPage) 
        {
            cartSummary.innerHTML = `
                <tr>
                    <td colspan="3"></td>
                    <td><strong>Total Amount:</strong></td>
                    <td><strong>₹${finalTotal.toFixed(2)}&nbsp;(Incl. GST)</strong></td>
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
                    <td><strong>Total Amount:</strong></td>
                    <td><strong>₹${finalTotal.toFixed(2)}</strong></td>
                </tr>
            `;
        }

        attachEventListeners();
    }

    function attachEventListeners() 
    {
        if (!isCheckoutPage) 
        {
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
}

// Call the function after DOM is loaded
document.addEventListener("DOMContentLoaded", initializeCartPage);


function initializeEmailJS() 
{
    if (document.getElementById("contact-form") || document.getElementById("checkout-form")) 
        {
        if (typeof emailjs !== "undefined") 
        {
            emailjs.init("Gowri_123"); // Replace with your actual EmailJS user ID
        } 
        else 
        {
            console.error("EmailJS is not loaded on this page.");
        }
    }
}

// Call the function only when the document is loaded
document.addEventListener("DOMContentLoaded", function () {
    initializeEmailJS();
});



//   Checkout
function initializeCheckoutPage() 
{
    const checkoutForm = document.getElementById("checkout-form");

    // Check if the form exists (although we already check before calling this)
    if (!checkoutForm) 
    {
        return;
    }

    checkoutForm.addEventListener("submit", function (event) 
    {
        event.preventDefault();

        // Get Billing Info
        const billingData = 
        {
            fullname: document.getElementById('fullname').value,
            address: document.getElementById('street-address').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        };

        console.log("Billing Data:", billingData);

        // Check if all form fields have values
        if (!billingData.fullname || !billingData.address || !billingData.phone || !billingData.email) 
        {
            alert("Please fill out all the required fields.");
            return;
        }

        // Store Billing Info in Local Storage
        localStorage.setItem('billingData', JSON.stringify(billingData));

        window.location.href = "payment.html";
    });
}
// Call the function after DOM is loaded
document.addEventListener("DOMContentLoaded", function() 
{
    const checkoutForm = document.getElementById("checkout-form");

    if (!checkoutForm) 
    {
        return; // Exit if the form is not found, no need to continue
    } 
    initializeCheckoutPage();
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

function initializePaymentPage() 
{
    const billingInfoDiv = document.getElementById("billing_info");
    const cartItemsTable = document.getElementById("cart_items");
    const finalTotalSpan = document.getElementById("final_total");
    const qrCodeImg = document.getElementById("qr_code");
    const confirmPaymentBtn = document.getElementById("confirm_payment");

    if (!billingInfoDiv || !cartItemsTable || !finalTotalSpan || !qrCodeImg || !confirmPaymentBtn) return;

    const billingData = JSON.parse(localStorage.getItem('billingData'));
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    displayBillingInfo(billingData, billingInfoDiv);
    let finalTotal = displayCartItems(cart, cartItemsTable, finalTotalSpan);
    generateQRCode(finalTotal, qrCodeImg);
    setupPaymentConfirmation(confirmPaymentBtn, billingData, cart, finalTotal);
}

// to display billing information
function displayBillingInfo(billingData, billingInfoDiv) 
{
    if (billingData && billingData.fullname) 
    {
        billingInfoDiv.innerHTML = `
            <p><strong>Name:</strong> ${billingData.fullname}</p>
            <p><strong>Address:</strong> ${billingData.address}</p>
            <p><strong>Phone:</strong> ${billingData.phone}</p>
            <p><strong>Email:</strong> ${billingData.email}</p>
        `;
    } 
    else 
    {
        console.log("No billing data found in localStorage.");
        billingInfoDiv.innerHTML = `<p class="text-danger">Billing information not found. Please go back and enter details.</p>`;
    }
}

// to display cart items and calculate final total
function displayCartItems(cart, cartItemsTable, finalTotalSpan) 
{
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

    let gst = subtotal * 0.18;
    let finalTotal = isNaN(subtotal + gst) ? 0 : subtotal + gst;

    console.log("Subtotal:", subtotal);
    console.log("GST (18%):", gst);
    console.log("Final Total Amount:", finalTotal);

    finalTotalSpan.textContent = `₹${finalTotal.toFixed(2)}`;
    
    return finalTotal;
}

// to generate QR code for payment
function generateQRCode(finalTotal, qrCodeImg) 
{
    if (!qrCodeImg || isNaN(finalTotal) || finalTotal <= 0) 
    {
        console.error("Invalid input: QR Code cannot be generated.");
        return;
    }

    const upiID = "example@upi";
    const merchantCode = "1234";  
    const transactionID = "ABCD1234";  
    const transactionNote = "Payment for Order";

    // Using `am` instead of `tr` for amount
    const upiPaymentURL = `upi://pay?pa=${upiID}&pn=YourName&mc=${merchantCode}&tid=${transactionID}&am=${finalTotal.toFixed(2)}&tn=${encodeURIComponent(transactionNote)}`;
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiPaymentURL)}&size=200`;

    qrCodeImg.src = qrUrl;
    console.log("Generated QR Code URL:", qrUrl);
}


// to set up payment confirmation

function setupPaymentConfirmation(confirmPaymentBtn, billingData, cart, finalTotal) 
{
    confirmPaymentBtn.addEventListener("click", function () 
    {
        if (!billingData.email) 
        {
            alert("Email is missing! Please enter your billing information.");
            return;
        }

        let emailParams = 
        {
            to_email: billingData.email,
            user_name: billingData.fullname,
            user_address: billingData.address,
            user_phone: billingData.phone,
            order_items: cart.map(item => `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join("\n"),
            total_amount: `₹${finalTotal.toFixed(2)}`
        };


        emailjs.send("Gowri_123", "Gowri_4321", emailParams, "CPLDU8Q42d1UX6ypJ")
            .then(response => 
            {
                alert("Payment Confirmed! Email Sent Successfully.");
                console.log("Email Sent:", response);
                // localStorage.removeItem("billingData");
                localStorage.removeItem("cart");
                window.location.href = "index.html";
            })
            .catch(error => 
            {
                alert("Error sending email. Please try again.");
                console.error("Email Error:", error);
            });
    });
}

// Call the function after DOM is loaded
document.addEventListener("DOMContentLoaded", initializePaymentPage);



// Contact page

document.addEventListener("DOMContentLoaded", function () 
{
    emailjs.init("CPLDU8Q42d1UX6ypJ"); 

    const contactForm = document.getElementById("contact-form");

    if (contactForm) 
    {
        contactForm.addEventListener("submit", handleContactFormSubmit);
    }
});

// Function to handle form submission

function handleContactFormSubmit(event) 
{
    event.preventDefault();

    const formData = getContactFormData();
    
    sendContactMessage(formData);
}

// Function to get form data

function getContactFormData() 
{
    return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        message: document.getElementById("message").value.trim()
    };
}

// Function to send the message using EmailJS

function sendContactMessage(formData) 
{
    emailjs.send("Gowri_123", "Gowri_4321", formData)
        .then(() => 
        {
            showResponseMessage("Message sent successfully!", true);
            document.getElementById("contact-form").reset();
        })
        .catch(() => 
        {
            showResponseMessage("Failed to send message. Try again.", false);
        });
}

// Function to display response message

function showResponseMessage(message, isSuccess) 
{
    const responseMessage = document.getElementById("response-message");
    
    if (responseMessage) 
    {
        responseMessage.textContent = message;
        responseMessage.style.color = isSuccess ? "green" : "red";
    }
}

