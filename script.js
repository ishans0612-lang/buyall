// ===============================
// BUYALL - Shopping Website
// ===============================

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 1299,
    oldPrice: 1999,
    rating: 4.5,
    image: "https://placehold.co/400x300?text=Headphones",
    store: "Sample Store",
    description: "Wireless headphones with comfortable ear cushions."
  },
  {
    id: 2,
    name: "Smartphone 5G",
    category: "Mobiles",
    price: 14999,
    oldPrice: 17999,
    rating: 4.4,
    image: "https://placehold.co/400x300?text=Smartphone",
    store: "Sample Store",
    description: "5G smartphone with a large display."
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "Shoes",
    price: 899,
    oldPrice: 1499,
    rating: 4.2,
    image: "https://placehold.co/400x300?text=Shoes",
    store: "Sample Store",
    description: "Lightweight shoes for everyday use."
  },
  {
    id: 4,
    name: "Classic Wrist Watch",
    category: "Fashion",
    price: 699,
    oldPrice: 1199,
    rating: 4.1,
    image: "https://placehold.co/400x300?text=Watch",
    store: "Sample Store",
    description: "Classic design wrist watch."
  },
  {
    id: 5,
    name: "Gaming Mouse",
    category: "Gaming",
    price: 499,
    oldPrice: 899,
    rating: 4.3,
    image: "https://placehold.co/400x300?text=Gaming+Mouse",
    store: "Sample Store",
    description: "Gaming mouse with adjustable DPI."
  },
  {
    id: 6,
    name: "Study Table Lamp",
    category: "Home",
    price: 349,
    oldPrice: 599,
    rating: 4.0,
    image: "https://placehold.co/400x300?text=Lamp",
    store: "Sample Store",
    description: "LED lamp for your study desk."
  }
];

let wishlist = JSON.parse(localStorage.getItem("buyallWishlist")) || [];
let recentlyViewed = JSON.parse(localStorage.getItem("buyallRecent")) || [];
let currentCategory = "All";

// ===============================
// ELEMENTS
// ===============================

const productGrid = document.getElementById("productGrid");
const dealsGrid = document.getElementById("dealsGrid");
const recentGrid = document.getElementById("recentGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// ===============================
// PRODUCT CARD
// ===============================

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = "₹" + product.price.toLocaleString("en-IN");

  const rating = document.createElement("p");
  rating.textContent = "Rating: " + product.rating + "/5";

  const store = document.createElement("p");
  store.textContent = "Lowest listed price: " + product.store;

  const detailsBtn = document.createElement("button");
  detailsBtn.textContent = "View Details";
  detailsBtn.onclick = () => showProductDetails(product.id);

  const wishBtn = document.createElement("button");
  wishBtn.textContent = wishlist.includes(product.id)
    ? "♥ Saved"
    : "♡ Wishlist";

  wishBtn.onclick = () => toggleWishlist(product.id);

  card.append(image, name, price, rating, store, detailsBtn, wishBtn);

  return card;
}

// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(list, container) {
  if (!container) return;

  container.replaceChildren();

  if (list.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No products found.";
    container.appendChild(message);
    return;
  }

  list.forEach(product => {
    container.appendChild(createProductCard(product));
  });
}

function loadHomePage() {
  displayProducts(products, productGrid);

  const deals = products
    .filter(product => product.oldPrice > product.price)
    .sort((a, b) => {
      const discountA = (a.oldPrice - a.price) / a.oldPrice;
      const discountB = (b.oldPrice - b.price) / b.oldPrice;
      return discountB - discountA;
    });

  displayProducts(deals, dealsGrid);
  displayRecentlyViewed();
}

// ===============================
// SEARCH
// ===============================

function searchProducts() {
  const query = searchInput.value.trim().toLowerCase();

  const results = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const matchesCategory =
      currentCategory === "All" ||
      product.category === currentCategory;

    return matchesSearch && matchesCategory;
  });

  displayProducts(results, productGrid);
}

if (searchBtn) {
  searchBtn.addEventListener("click", searchProducts);
}

if (searchInput) {
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") searchProducts();
  });
}

// ===============================
// CATEGORY FILTER
// ===============================

document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;
    searchProducts();

    document.getElementById("productGrid")
      ?.scrollIntoView({ behavior: "smooth" });
  });
});

// ===============================
// WISHLIST
// ===============================

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Removed from wishlist");
  } else {
    wishlist.push(id);
    showToast("Added to wishlist");
  }

  localStorage.setItem("buyallWishlist", JSON.stringify(wishlist));
  searchProducts();
}

document.getElementById("wishlistBtn")?.addEventListener("click", () => {
  const savedProducts = products.filter(product =>
    wishlist.includes(product.id)
  );

  displayProducts(savedProducts, productGrid);
  showToast("Your wishlist");
});

// ===============================
// RECENTLY VIEWED
// ===============================

function addToRecentlyViewed(id) {
  recentlyViewed = [
    id,
    ...recentlyViewed.filter(item => item !== id)
  ].slice(0, 8);

  localStorage.setItem("buyallRecent", JSON.stringify(recentlyViewed));
  displayRecentlyViewed();
}

function displayRecentlyViewed() {
  const recentProducts = recentlyViewed
    .map(id => products.find(product => product.id === id))
    .filter(Boolean);

  displayProducts(recentProducts, recentGrid);
}

// ===============================
// PRODUCT DETAILS
// ===============================

function showProductDetails(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  addToRecentlyViewed(id);

  const message = `
${product.name}

Price: ₹${product.price.toLocaleString("en-IN")}
Rating: ${product.rating}/5
Category: ${product.category}

${product.description}

Price comparison data is not connected yet.
  `;

  alert(message);
}

// ===============================
// THEME SWITCH
// ===============================

const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
  if (theme === "system") {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.toggle("dark", dark);
  } else {
    document.body.classList.toggle("dark", theme === "dark");
  }

  localStorage.setItem("buyallTheme", theme);
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = localStorage.getItem("buyallTheme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

applyTheme(localStorage.getItem("buyallTheme") || "light");

// ===============================
// ACCOUNT BUTTON
// ===============================

document.getElementById("accountBtn")?.addEventListener("click", () => {
  showToast("Account system will be connected later.");
});

// ===============================
// CART BUTTON
// ===============================

document.getElementById("cartBtn")?.addEventListener("click", () => {
  showToast("Shopping cart will be added soon.");
});

// ===============================
// TOAST MESSAGE
// ===============================

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// ===============================
// START WEBSITE
// ===============================

loadHomePage();

console.log("buyall website loaded successfully!");
// ======================================
// BUYALL EXTRA FEATURES
// ======================================

// VIP ACCESS
const VIP_CODE = "0987654321";

function openVIP() {
  const code = prompt(
    "BUYALL VIP ACCESS\nVIP Price: ₹399\nEnter your Access Code:"
  );

  if (code === VIP_CODE) {
    localStorage.setItem("buyallVIP", "true");
    showToast("VIP Access Unlocked!");
  } else if (code !== null) {
    showToast("Incorrect Access Code!");
  }
}

const vipButton = document.createElement("button");
vipButton.textContent = "VIP Access ₹399";
vipButton.onclick = openVIP;
document.querySelector(".header")?.appendChild(vipButton);


// ======================================
// PRICE COMPARISON
// ======================================

const comparisonStores = [
  { name: "Store A", price: 1299 },
  { name: "Store B", price: 1199 },
  { name: "Store C", price: 1399 }
];

function showPriceComparison(product) {
  const prices = comparisonStores
    .slice()
    .sort((a, b) => a.price - b.price);

  let result = "PRICE COMPARISON\n\n";

  prices.forEach(store => {
    result += `${store.name}: ₹${store.price}\n`;
  });

  result += "\nLowest listed price: ₹" + prices[0].price;
  alert(result);
}


// ======================================
// PRODUCT LINK COMPARISON
// ======================================

function compareProductLink() {
  const link = prompt("Paste a product link:");

  if (!link) return;

  try {
    const url = new URL(link);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Invalid URL");
    }

    showToast("Product link saved for comparison.");
    localStorage.setItem("buyallCompareLink", url.href);
  } catch {
    showToast("Please enter a valid product link.");
  }
}

const compareButton = document.createElement("button");
compareButton.textContent = "Compare Product Link";
compareButton.onclick = compareProductLink;
document.querySelector(".header")?.appendChild(compareButton);


// ======================================
// BUYALL PENGUIN MASCOT
// ======================================

const penguinStyle = document.createElement("style");

penguinStyle.textContent = `
#buyallPenguin {
  position: fixed;
  bottom: 18px;
  right: 15px;
  z-index: 9999;
  width: 85px;
  cursor: pointer;
  text-align: center;
  font-family: Arial, sans-serif;
}

#buyallPenguin .penguin-body {
  width: 65px;
  height: 78px;
  background: #20252d;
  border-radius: 48% 48% 42% 42%;
  margin: auto;
  position: relative;
  box-shadow: 0 5px 12px #0002;
}

#buyallPenguin .penguin-face {
  position: absolute;
  width: 43px;
  height: 48px;
  background: white;
  border-radius: 50%;
  top: 12px;
  left: 11px;
}

#buyallPenguin .penguin-eyes {
  position: absolute;
  top: 15px;
  left: 11px;
  font-size: 12px;
  color: black;
}

#buyallPenguin .penguin-beak {
  position: absolute;
  top: 27px;
  left: 17px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 9px solid #ff9d26;
}

#buyallPenguin .penguin-message {
  display: none;
  position: absolute;
  bottom: 88px;
  right: 0;
  width: 165px;
  padding: 10px;
  background: white;
  color: #222;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 3px 12px #0002;
  font-size: 12px;
}

#buyallPenguin.active .penguin-message {
  display: block;
}

#buyallPenguin .penguin-feet {
  color: #ff9d26;
  font-size: 20px;
  margin-top: -5px;
}
`;

document.head.appendChild(penguinStyle);

const penguin = document.createElement("div");
penguin.id = "buyallPenguin";

penguin.innerHTML = `
  <div class="penguin-message" id="penguinMessage">
    Welcome to buyall! Let's find great deals!
  </div>
  <div class="penguin-body">
    <div class="penguin-face">
      <div class="penguin-eyes">●　●</div>
      <div class="penguin-beak"></div>
    </div>
  </div>
  <div class="penguin-feet">⌄　⌄</div>
`;

document.body.appendChild(penguin);

penguin.addEventListener("click", () => {
  penguin.classList.toggle("active");
});

function penguinTalk(message) {
  document.getElementById("penguinMessage").textContent = message;
  penguin.classList.add("active");
}

if (!localStorage.getItem("buyallWelcomed")) {
  setTimeout(() => {
    penguinTalk("Hello! Welcome to buyall!");
    localStorage.setItem("buyallWelcomed", "true");
  }, 1500);
}


// ======================================
// ACHIEVEMENT MESSAGES
// ======================================

function celebrateAchievement(message) {
  penguinTalk(message);

  if ("vibrate" in navigator) {
    navigator.vibrate(100);
  }
}


// ======================================
// PRICE ALERT
// ======================================

function setPriceAlert(productId, targetPrice) {
  const alerts = JSON.parse(
    localStorage.getItem("buyallPriceAlerts") || "[]"
  );

  alerts.push({
    productId: productId,
    targetPrice: Number(targetPrice)
  });

  localStorage.setItem(
    "buyallPriceAlerts",
    JSON.stringify(alerts)
  );

  showToast("Price alert saved!");
}


// ======================================
// FILTER BY PRICE
// ======================================

function filterByMaximumPrice(maxPrice) {
  const filtered = products.filter(
    product => product.price <= Number(maxPrice)
  );

  displayProducts(filtered, productGrid);
}


// ======================================
// SORT PRICE
// ======================================

function sortProductsByPrice(order = "low") {
  const sorted = [...products].sort((a, b) => {
    return order === "low"
      ? a.price - b.price
      : b.price - a.price;
  });

  displayProducts(sorted, productGrid);
}


// ======================================
// RANDOM PENGUIN REACTIONS
// ======================================

const penguinMessages = [
  "Great choice!",
  "Let's find a better price!",
  "Keep exploring!",
  "You are doing great!",
  "Happy shopping!"
];

function randomPenguinReaction() {
  const message = penguinMessages[
    Math.floor(Math.random() * penguinMessages.length)
  ];

  celebrateAchievement(message);
}

console.log("buyall extra features loaded!");
// ======================================
// BUYALL ADMIN DASHBOARD
// ======================================

function openAdminDashboard() {
  const password = prompt("Enter Admin Password:");

  if (password !== "BUYALLADMIN") {
    showToast("Access Denied!");
    return;
  }

  const dashboard = document.createElement("div");

  dashboard.id = "buyallAdmin";

  dashboard.innerHTML = `
    <div class="admin-panel">
      <button id="closeAdmin">✕</button>
      <h2>BUYALL ADMIN</h2>

      <h3>Dashboard Overview</h3>
      <p>Total Products: ${products.length}</p>
      <p>Wishlist Items: ${wishlist.length}</p>

      <h3>Add New Product</h3>

      <input id="adminName" placeholder="Product Name">
      <input id="adminPrice" type="number" placeholder="Price">
      <input id="adminCategory" placeholder="Category">
      <input id="adminImage" placeholder="Image URL">

      <button id="addAdminProduct">Add Product</button>
      <button id="adminExport">Export Products</button>
    </div>
  `;

  document.body.appendChild(dashboard);

  document.getElementById("closeAdmin").onclick = () => {
    dashboard.remove();
  };

  document.getElementById("addAdminProduct").onclick = () => {
    const name = document.getElementById("adminName").value.trim();
    const price = Number(document.getElementById("adminPrice").value);
    const category = document.getElementById("adminCategory").value.trim();
    const image = document.getElementById("adminImage").value.trim();

    if (!name || !price || price <= 0 || !category) {
      alert("Please enter valid product details.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      price,
      oldPrice: price,
      rating: 0,
      category,
      image: image || "https://placehold.co/400x300?text=Product",
      store: "Not connected",
      description: "Product added by admin."
    };

    products.push(newProduct);

    localStorage.setItem(
      "buyallProducts",
      JSON.stringify(products)
    );

    loadHomePage();
    showToast("Product added!");

    dashboard.remove();
  };

  document.getElementById("adminExport").onclick = () => {
    const file = new Blob(
      [JSON.stringify(products, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "buyall-products.json";
    link.click();

    URL.revokeObjectURL(url);
  };
}


// ======================================
// ADMIN BUTTON
// ======================================

const adminButton = document.createElement("button");
adminButton.textContent = "Admin";
adminButton.onclick = openAdminDashboard;

document.querySelector(".header")?.appendChild(adminButton);


// ======================================
// ADMIN STYLE
// ======================================

const adminStyle = document.createElement("style");

adminStyle.textContent = `
#buyallAdmin {
  position: fixed;
  inset: 0;
  background: #0009;
  z-index: 10000;
  display: grid;
  place-items: center;
  padding: 15px;
}

.admin-panel {
  background: white;
  color: #222;
  width: min(450px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  padding: 22px;
  border-radius: 16px;
}

.admin-panel input {
  display: block;
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.admin-panel button {
  padding: 10px 14px;
  margin: 5px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background: #2878e8;
  color: white;
}
`;

document.head.appendChild(adminStyle);


// ======================================
// ADVANCED SEARCH
// ======================================

function advancedSearch(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);

  const results = products.filter(product => {
    const text = (
      product.name + " " +
      product.category + " " +
      product.description
    ).toLowerCase();

    return words.every(word => text.includes(word));
  });

  displayProducts(results, productGrid);

  if (results.length === 0) {
    showToast("No matching products found.");
  }
}


// ======================================
// LANGUAGE SYSTEM
// ======================================

const buyallLanguages = {
  English: {
    search: "Search products...",
    trending: "Trending Products",
    deals: "Best Deals",
    recent: "Recently Viewed"
  },

  Bengali: {
    search: "পণ্য খুঁজুন...",
    trending: "জনপ্রিয় পণ্য",
    deals: "সেরা অফার",
    recent: "সম্প্রতি দেখা"
  },

  Hindi: {
    search: "उत्पाद खोजें...",
    trending: "लोकप्रिय उत्पाद",
    deals: "सबसे अच्छे ऑफर",
    recent: "हाल ही में देखे गए"
  }
};

function changeBuyallLanguage(language) {
  const selected = buyallLanguages[language];

  if (!selected) {
    showToast("Language not available yet.");
    return;
  }

  if (searchInput) {
    searchInput.placeholder = selected.search;
  }

  const headings = document.querySelectorAll("h2");

  if (headings[0]) headings[0].textContent = selected.trending;
  if (headings[1]) headings[1].textContent = selected.deals;
  if (headings[2]) headings[2].textContent = selected.recent;

  localStorage.setItem("buyallLanguage", language);
}


// ======================================
// LANGUAGE SELECTOR
// ======================================

const languageSelector = document.createElement("select");

languageSelector.innerHTML = `
  <option value="English">English</option>
  <option value="Bengali">বাংলা</option>
  <option value="Hindi">हिन्दी</option>
`;

languageSelector.value =
  localStorage.getItem("buyallLanguage") || "English";

languageSelector.onchange = () => {
  changeBuyallLanguage(languageSelector.value);
};

document.querySelector(".header")?.appendChild(languageSelector);

changeBuyallLanguage(languageSelector.value);


// ======================================
// BUYALL SETTINGS
// ======================================

function openBuyallSettings() {
  const settings = document.createElement("div");

  settings.style.cssText = `
    position:fixed;
    inset:0;
    background:#0008;
    z-index:10001;
    display:grid;
    place-items:center;
    padding:15px;
  `;

  settings.innerHTML = `
    <div style="
      background:white;
      color:#222;
      padding:22px;
      border-radius:15px;
      width:min(350px,100%);
    ">
      <h2>Settings</h2>

      <label>
        Theme:
        <select id="settingTheme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <br><br>

      <button id="saveSettings">Save Settings</button>
      <button id="closeSettings">Close</button>
    </div>
  `;

  document.body.appendChild(settings);

  const themeSelect = settings.querySelector("#settingTheme");

  themeSelect.value =
    localStorage.getItem("buyallTheme") || "light";

  settings.querySelector("#saveSettings").onclick = () => {
    applyTheme(themeSelect.value);
    settings.remove();
    showToast("Settings saved!");
  };

  settings.querySelector("#closeSettings").onclick = () => {
    settings.remove();
  };
}

const settingsButton = document.createElement("button");
settingsButton.textContent = "Settings";
settingsButton.onclick = openBuyallSettings;

document.querySelector(".header")?.appendChild(settingsButton);

console.log("BUYALL ADMIN AND SETTINGS READY!");
// ======================================
// BUYALL PRODUCT DETAILS PAGE
// ======================================

function openProductPage(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  addToRecentlyViewed(id);

  const page = document.createElement("div");
  page.id = "buyallProductPage";

  page.innerHTML = `
    <div class="product-page">
      <button id="backToShop">← Back to Shopping</button>

      <div class="product-info">
        <img id="detailImage" alt="Product image">

        <div>
          <h1 id="detailName"></h1>
          <h2 id="detailPrice"></h2>
          <p id="detailCategory"></p>
          <p id="detailRating"></p>

          <button id="detailWishlist">♡ Add to Wishlist</button>
          <button id="detailAlert">Set Price Alert</button>
        </div>
      </div>

      <h2>Product Description</h2>
      <p id="detailDescription"></p>

      <h2>Price Comparison</h2>
      <div id="detailComparison"></div>

      <h2>Customer Reviews</h2>
      <div id="reviewList"></div>

      <h3>Write a Review</h3>
      <select id="reviewRating">
        <option value="5">★★★★★</option>
        <option value="4">★★★★</option>
        <option value="3">★★★</option>
        <option value="2">★★</option>
        <option value="1">★</option>
      </select>

      <textarea id="reviewText" placeholder="Write your review"></textarea>
      <button id="submitReview">Submit Review</button>
    </div>
  `;

  document.body.appendChild(page);

  document.getElementById("detailImage").src = product.image;
  document.getElementById("detailName").textContent = product.name;
  document.getElementById("detailPrice").textContent =
    "₹" + product.price.toLocaleString("en-IN");

  document.getElementById("detailCategory").textContent =
    "Category: " + product.category;

  document.getElementById("detailRating").textContent =
    "Rating: " + product.rating + "/5";

  document.getElementById("detailDescription").textContent =
    product.description;

  document.getElementById("backToShop").onclick = () => page.remove();

  document.getElementById("detailWishlist").onclick = () => {
    toggleWishlist(product.id);
    document.getElementById("detailWishlist").textContent =
      wishlist.includes(product.id)
        ? "♥ Saved"
        : "♡ Add to Wishlist";
  };

  document.getElementById("detailAlert").onclick = () => {
    const target = prompt("Enter your target price in ₹:");

    if (target !== null && Number(target) > 0) {
      setPriceAlert(product.id, Number(target));
    }
  };

  // Price comparison data is clearly marked as sample.
  const comparison = document.getElementById("detailComparison");

  comparison.textContent =
    "Live retailer prices are not connected yet. Current listed price: ₹" +
    product.price.toLocaleString("en-IN");

  displayReviews(product.id);

  document.getElementById("submitReview").onclick = () => {
    const text = document.getElementById("reviewText").value.trim();
    const rating = Number(
      document.getElementById("reviewRating").value
    );

    if (!text) {
      showToast("Please write a review.");
      return;
    }

    const allReviews = JSON.parse(
      localStorage.getItem("buyallReviews") || "{}"
    );

    allReviews[product.id] = allReviews[product.id] || [];

    allReviews[product.id].push({
      text,
      rating,
      date: new Date().toLocaleDateString()
    });

    localStorage.setItem(
      "buyallReviews",
      JSON.stringify(allReviews)
    );

    document.getElementById("reviewText").value = "";

    displayReviews(product.id);
    showToast("Review added!");
  };
}


// ======================================
// REVIEW SYSTEM
// ======================================

function displayReviews(productId) {
  const container = document.getElementById("reviewList");
  if (!container) return;

  container.replaceChildren();

  const allReviews = JSON.parse(
    localStorage.getItem("buyallReviews") || "{}"
  );

  const reviews = allReviews[productId] || [];

  if (reviews.length === 0) {
    container.textContent = "No reviews yet.";
    return;
  }

  reviews.forEach(review => {
    const item = document.createElement("div");
    item.className = "buyall-review";

    const title = document.createElement("strong");
    title.textContent = "Rating: " + "★".repeat(review.rating);

    const comment = document.createElement("p");
    comment.textContent = review.text;

    const date = document.createElement("small");
    date.textContent = review.date;

    item.append(title, comment, date);
    container.appendChild(item);
  });
}


// ======================================
// WISHLIST PAGE
// ======================================

function openWishlistPage() {
  const page = document.createElement("div");
  page.id = "buyallWishlistPage";

  page.innerHTML = `
    <div class="wishlist-page">
      <button id="closeWishlistPage">← Back</button>
      <h1>My Wishlist</h1>
      <div id="wishlistProducts" class="product-grid"></div>
    </div>
  `;

  document.body.appendChild(page);

  document.getElementById("closeWishlistPage").onclick = () => {
    page.remove();
  };

  const saved = products.filter(p => wishlist.includes(p.id));

  displayProducts(
    saved,
    document.getElementById("wishlistProducts")
  );
}


// ======================================
// PRODUCT PAGE DESIGN
// ======================================

const productPageStyle = document.createElement("style");

productPageStyle.textContent = `
#buyallProductPage,
#buyallWishlistPage {
  position:fixed;
  inset:0;
  z-index:9998;
  background:#f5f8fc;
  color:#222;
  overflow-y:auto;
  padding:20px;
}

.product-page,
.wishlist-page {
  max-width:1000px;
  margin:auto;
  background:white;
  padding:22px;
  border-radius:15px;
}

.product-info {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:25px;
  margin:25px 0;
}

.product-info img {
  width:100%;
  max-height:350px;
  object-fit:contain;
  border-radius:12px;
}

.product-page button,
.wishlist-page button {
  background:#2878e8;
  color:white;
  border:0;
  border-radius:8px;
  padding:11px 16px;
  margin:5px;
  cursor:pointer;
}

.product-page textarea {
  display:block;
  width:100%;
  min-height:90px;
  padding:12px;
  margin:12px 0;
  border:1px solid #ddd;
  border-radius:8px;
}

.buyall-review {
  padding:14px;
  margin:10px 0;
  background:#f2f6fc;
  border-radius:10px;
}

@media(max-width:650px) {
  .product-info {
    grid-template-columns:1fr;
  }
}
`;

document.head.appendChild(productPageStyle);


// ======================================
// CONNECT PRODUCT DETAILS BUTTON
// ======================================

const originalShowProductDetails = showProductDetails;

showProductDetails = function(id) {
  openProductPage(id);
};


// ======================================
// CONNECT WISHLIST BUTTON
// ======================================

document.getElementById("wishlistBtn")?.addEventListener(
  "dblclick",
  openWishlistPage
);

console.log("BUYALL PRODUCT PAGES READY!");

