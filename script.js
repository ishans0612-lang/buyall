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
