/* GL Bajaj Online Book Store - JavaScript */

// College Library Book Database
var BOOKS = [
    // CSE Books (Original Lab Curriculum)
    { id: 1, title: "XML Bible", author: "Winston", pub: "Wiley", price: 40.5, branch: "CSE", color: "#8a2c2c" },
    { id: 2, title: "Artificial Intelligence", author: "S. Russel", pub: "Princeton Hall", price: 63, branch: "CSE", color: "#2c5a8a" },
    { id: 3, title: "Java 2", author: "Watson", pub: "BPB Publications", price: 35.5, branch: "CSE", color: "#2c6b4a" },
    { id: 4, title: "HTML in 24 Hours", author: "Sam Peter", pub: "Sam Publication", price: 50, branch: "CSE", color: "#6b4a8a" },

    // CSIT Books
    { id: 5, title: "Cloud Computing Principles", author: "Rajkumar Buyya", pub: "Wiley", price: 52, branch: "CSIT", color: "#1f6f8b" },
    { id: 6, title: "Web Technologies", author: "Uttam K. Roy", pub: "Oxford Press", price: 42, branch: "CSIT", color: "#3a6073" },

    // CSAI Books
    { id: 7, title: "Machine Learning", author: "Tom M. Mitchell", pub: "McGraw Hill", price: 59, branch: "CSAI", color: "#4a3933" },
    { id: 8, title: "Deep Learning with Python", author: "Francois Chollet", pub: "Manning", price: 68, branch: "CSAI", color: "#2d4059" },

    // ECE Books
    { id: 9, title: "Electronic Devices & Circuits", author: "Boylestad", pub: "Pearson", price: 45, branch: "ECE", color: "#8a5a2c" },
    { id: 10, title: "Digital Signal Processing", author: "Proakis", pub: "PHI", price: 51, branch: "ECE", color: "#795548" },

    // EEE Books
    { id: 11, title: "Electrical Machines", author: "Nagrath", pub: "McGraw Hill", price: 38, branch: "EEE", color: "#2c7a8a" },
    { id: 12, title: "Power System Engineering", author: "D.P. Kothari", pub: "McGraw Hill", price: 53, branch: "EEE", color: "#00695c" },

    // CIVIL Books
    { id: 13, title: "Strength of Materials", author: "R.K. Bansal", pub: "Laxmi Publications", price: 32, branch: "CIVIL", color: "#5a5a5a" },
    { id: 14, title: "Surveying Volume 1", author: "B.C. Punmia", pub: "Laxmi Publications", price: 39, branch: "CIVIL", color: "#455a64" }
];

// Helper function to format price
function formatPrice(num) {
    var val = Math.round(num * 100) / 100;
    return "$" + val;
}

// Function to get cart data from browser localStorage
function getCart() {
    var stored = localStorage.getItem("cart");
    if (stored) {
        return JSON.parse(stored);
    }
    return {};
}

// Function to save cart data to localStorage
function saveCart(cartObj) {
    localStorage.setItem("cart", JSON.stringify(cartObj));
}

// Get branch from URL query parameter (e.g. ?branch=CSE)
var urlParams = new URLSearchParams(window.location.search);
var selectedBranch = urlParams.get("branch");

// Highlight the active branch link in left sidebar
var asideLinks = document.querySelectorAll("aside a");
for (var i = 0; i < asideLinks.length; i++) {
    if (asideLinks[i].getAttribute("data-branch") === selectedBranch) {
        asideLinks[i].classList.add("active");
    }
}

/* ==========================================
   1. BOOK CATALOGUE PAGE
   ========================================== */
var booksTableBody = document.getElementById("books");
if (booksTableBody) {
    // Filter books by branch if selected, otherwise show all
    var displayList = [];
    if (selectedBranch) {
        document.getElementById("catTitle").textContent = selectedBranch + " Department Books";
        for (var b = 0; b < BOOKS.length; b++) {
            if (BOOKS[b].branch === selectedBranch) {
                displayList.push(BOOKS[b]);
            }
        }
    } else {
        displayList = BOOKS;
    }

    if (displayList.length === 0) {
        booksTableBody.innerHTML = '<tr><td colspan="4">No books found for this branch.</td></tr>';
    } else {
        var htmlContent = "";
        for (var k = 0; k < displayList.length; k++) {
            var item = displayList[k];
            htmlContent += '<tr>' +
                '<td><div class="cover" style="background:' + item.color + '">' + item.title + '</div></td>' +
                '<td class="left"><strong>Book:</strong> ' + item.title + '<br><strong>Author:</strong> ' + item.author + '<br><strong>Publisher:</strong> ' + item.pub + '<br><strong>Branch:</strong> ' + item.branch + '</td>' +
                '<td>' + formatPrice(item.price) + '</td>' +
                '<td><button type="button" onclick="addToCart(' + item.id + ')">Add to Cart</button></td>' +
                '</tr>';
        }
        booksTableBody.innerHTML = htmlContent;
    }
}

// Function to add a book to the cart
function addToCart(bookId) {
    var cart = getCart();
    if (cart[bookId]) {
        cart[bookId] = cart[bookId] + 1;
    } else {
        cart[bookId] = 1;
    }
    saveCart(cart);

    // Find book details
    var bookFound = null;
    for (var i = 0; i < BOOKS.length; i++) {
        if (BOOKS[i].id === bookId) {
            bookFound = BOOKS[i];
            break;
        }
    }

    var addedMsg = document.getElementById("added");
    if (addedMsg && bookFound) {
        addedMsg.innerHTML = '✓ "' + bookFound.title + '" added to cart! (Quantity: ' + cart[bookId] + ') — <a href="cart.html">View Cart</a>';
    }
}

/* ==========================================
   2. SHOPPING CART PAGE
   ========================================== */
var cartBox = document.getElementById("cartBox");
if (cartBox) {
    function renderCartTable() {
        var cart = getCart();
        var keys = Object.keys(cart);

        if (keys.length === 0) {
            cartBox.innerHTML = '<p>Your cart is empty. <a href="catalogue.html">Go to Catalogue</a> to add books.</p>';
            return;
        }

        var totalAmount = 0;
        var tableRows = "";

        for (var i = 0; i < keys.length; i++) {
            var id = keys[i];
            var qty = cart[id];

            // Find book
            var book = null;
            for (var j = 0; j < BOOKS.length; j++) {
                if (BOOKS[j].id == id) {
                    book = BOOKS[j];
                    break;
                }
            }

            if (book) {
                var itemTotal = book.price * qty;
                totalAmount += itemTotal;

                tableRows += '<tr>' +
                    '<td>' + book.title + '</td>' +
                    '<td>' + formatPrice(book.price) + '</td>' +
                    '<td class="qty">' +
                    '<button type="button" onclick="changeQty(' + id + ', -1)">−</button> ' +
                    '<span> ' + qty + ' </span>' +
                    '<button type="button" onclick="changeQty(' + id + ', 1)">+</button>' +
                    '</td>' +
                    '<td>' + formatPrice(itemTotal) + '</td>' +
                    '</tr>';
            }
        }

        var fullCartHtml = '<table>' +
            '<thead><tr><th>Book Name</th><th>Price</th><th>Quantity</th><th>Subtotal</th></tr></thead>' +
            '<tbody>' + tableRows +
            '<tr class="total"><th colspan="3">Total Amount</th><th>' + formatPrice(totalAmount) + '</th></tr>' +
            '</tbody></table>';

        cartBox.innerHTML = fullCartHtml;
    }

    // Function to increase or decrease quantity
    window.changeQty = function(bookId, delta) {
        var cart = getCart();
        if (cart[bookId]) {
            cart[bookId] = cart[bookId] + delta;
            if (cart[bookId] <= 0) {
                delete cart[bookId];
            }
            saveCart(cart);
            renderCartTable();
        }
    };

    // Button to clear entire cart
    var clearBtn = document.getElementById("clear");
    if (clearBtn) {
        clearBtn.onclick = function() {
            if (confirm("Are you sure you want to empty your cart?")) {
                saveCart({});
                renderCartTable();
            }
        };
    }

    renderCartTable();
}

/* ==========================================
   3. REGISTRATION FORM VALIDATION
   ========================================== */
function showFormErrors(errorList) {
    var msgBox = document.getElementById("msg");
    if (!msgBox) return false;

    if (errorList.length > 0) {
        msgBox.style.display = "block";
        var listItems = "";
        for (var i = 0; i < errorList.length; i++) {
            listItems += "<li>" + errorList[i] + "</li>";
        }
        msgBox.innerHTML = "<ul>" + listItems + "</ul>";
        return false;
    } else {
        msgBox.style.display = "none";
        msgBox.innerHTML = "";
        return true;
    }
}

// Function to fetch registered users list from localStorage
function getRegisteredUsers() {
    var data = localStorage.getItem("users");
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

var regForm = document.getElementById("regForm");
if (regForm) {
    // Populate Day dropdown (1 to 31)
    var daySelect = document.getElementById("day");
    var dayHtml = '<option value="">Day</option>';
    for (var d = 1; d <= 31; d++) {
        dayHtml += '<option value="' + d + '">' + d + '</option>';
    }
    daySelect.innerHTML = dayHtml;

    // Populate Month dropdown
    var monthSelect = document.getElementById("month");
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthHtml = '<option value="">Month</option>';
    for (var m = 0; m < months.length; m++) {
        monthHtml += '<option value="' + (m + 1) + '">' + months[m] + '</option>';
    }
    monthSelect.innerHTML = monthHtml;

    // Populate Year dropdown (1970 to 2010)
    var yearSelect = document.getElementById("year");
    var yearHtml = '<option value="">Year</option>';
    for (var y = 2010; y >= 1970; y--) {
        yearHtml += '<option value="' + y + '">' + y + '</option>';
    }
    yearSelect.innerHTML = yearHtml;

    // Handle form submit
    regForm.addEventListener("submit", function(event) {
        event.preventDefault();

        var nameVal = document.getElementById("name").value.trim();
        var passVal = document.getElementById("password").value;
        var emailVal = document.getElementById("email").value.trim();
        var phoneVal = document.getElementById("phone").value.trim();
        var addressVal = document.getElementById("address").value.trim();

        var errors = [];

        // 1. Name validation (alphabets only, min length 6)
        if (nameVal === "") {
            errors.push("Name cannot be empty.");
        } else if (!/^[A-Za-z ]+$/.test(nameVal)) {
            errors.push("Name must contain alphabets only.");
        } else if (nameVal.length < 6) {
            errors.push("Name must be at least 6 characters long.");
        }

        // 2. Password validation (min length 6)
        if (passVal.length < 6) {
            errors.push("Password must be at least 6 characters long.");
        }

        // 3. Email validation (name@domain.com)
        var emailRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(emailVal)) {
            errors.push("Please enter a valid e-mail ID (e.g. name@domain.com).");
        }

        // 4. Phone validation (exact 10 digits)
        if (!/^\d{10}$/.test(phoneVal)) {
            errors.push("Phone number must contain exactly 10 digits.");
        }

        // 5. Gender radio check
        var sexChecked = document.querySelector('input[name="sex"]:checked');
        if (!sexChecked) {
            errors.push("Please select your gender.");
        }

        // 6. Date of birth check
        if (!daySelect.value || !monthSelect.value || !yearSelect.value) {
            errors.push("Please select complete Date of Birth (Day, Month, Year).");
        }

        // 7. Languages checkbox
        var langChecked = document.querySelector('input[name="lang"]:checked');
        if (!langChecked) {
            errors.push("Please select at least one language known.");
        }

        // 8. Address check
        if (addressVal === "") {
            errors.push("Please enter your address.");
        }

        // Display errors if any
        if (!showFormErrors(errors)) {
            return;
        }

        // Check if user already exists
        var users = getRegisteredUsers();
        for (var u = 0; u < users.length; u++) {
            if (users[u].email.toLowerCase() === emailVal.toLowerCase()) {
                showFormErrors(["This e-mail is already registered. Please go to Login."]);
                return;
            }
        }

        // Save new user
        users.push({
            name: nameVal,
            email: emailVal,
            password: passVal
        });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful! You can now log in.");
        window.location.href = "login.html";
    });
}

/* ==========================================
   4. LOGIN FORM
   ========================================== */
var loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        var userInput = document.getElementById("user").value.trim();
        var passInput = document.getElementById("pass").value;
        var errors = [];

        if (userInput === "") {
            errors.push("Please enter your User Name or Email.");
        }
        if (passInput === "") {
            errors.push("Please enter your Password.");
        }

        if (!showFormErrors(errors)) {
            return;
        }

        // Verify credentials with localStorage users
        var users = getRegisteredUsers();
        var matchedUser = null;

        for (var i = 0; i < users.length; i++) {
            var u = users[i];
            if ((u.name === userInput || u.email.toLowerCase() === userInput.toLowerCase()) && u.password === passInput) {
                matchedUser = u;
                break;
            }
        }

        if (!matchedUser) {
            showFormErrors(["Invalid username/email or password, or user not registered."]);
            return;
        }

        alert("Login successful! Welcome, " + matchedUser.name + ".");
        window.location.href = "index.html";
    });
}

