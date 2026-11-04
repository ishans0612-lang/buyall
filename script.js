
"use strict";

/* =====================================
   BUYALL - COMPLETE FRONTEND SYSTEM
===================================== */

const $ = (selector) => document.querySelector(selector);

const STORAGE = {
  wishlist: "buyallWishlist",
  cart: "buyallCart",
  recent: "buyallRecent",
  theme: "buyallTheme",
  language: "buyallLanguage",
  reviews: "buyallReviews",
  alerts: "buyallPriceAlerts",
  vip: "buyallVIP",
  products: "buyallProducts",
  compare: "buyallCompareLink"
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let products = readStorage(STORAGE.products, null);

if (!Array.isArray(products)) {
  products = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      category: "Electronics",
      brand: "Audio",
      price: 1299,
      oldPrice: 1999,
      rating: 4.5,
      image: "https://placehold.co/500x400?text=Headphones",
      store: "Sample Store",
      description: "Wireless headphones with comfortable ear cushions."
    },
    {
      id: 2,
      name: "Smartphone 5G",
      category: "Mobiles",
      brand: "Mobile",
      price: 14999,
      oldPrice: 17999,
      rating: 4.4,
      image: "https://placehold.co/500x400?text=Smartphone",
      store: "Sample Store",
      description: "A smartphone with a large display and 5G connectivity."
    },
    {
      id: 3,
      name: "Running Shoes",
      category: "Shoes",
      brand: "Sports",
      price: 899,
      oldPrice: 1499,
      rating: 4.2,
      image: "https://placehold.co/500x400?text=Shoes",
      store: "Sample Store",
      description: "Comfortable lightweight everyday running shoes."
    },
    {
      id: 4,
      name: "Classic Wrist Watch",
      category: "Fashion",
      brand: "Fashion",
      price: 699,
      oldPrice: 1199,
      rating: 4.1,
      image: "https://placehold.co/500x400?text=Watch",
      store: "Sample Store",
      description: "Classic design wrist watch."
    },
    {
      id: 5,
      name: "Gaming Mouse",
      category: "Gaming",
      brand: "Gaming",
      price: 499,
      oldPrice: 899,
      rating: 4.3,
      image: "https://placehold.co/500x400?text=Mouse",
      store: "Sample Store",
      description: "Gaming mouse with adjustable sensitivity."
    },
    {
      id: 6,
      name: "Study Table Lamp",
      category: "Home",
      brand: "Home",
      price: 349,
      oldPrice: 599,
      rating: 4.0,
      image: "https://placehold.co/500x400?text=Lamp",
      store: "Sample Store",
      description: "LED study lamp for your desk."
    },
    {
      id: 7,
      name: "Wireless Keyboard",
      category: "Electronics",
      brand: "Tech",
      price: 799,
      oldPrice: 1199,
      rating: 4.3,
      image: "https://placehold.co/500x400?text=Keyboard",
      store: "Sample Store",
      description: "Wireless keyboard for everyday use."
    },
    {
      id: 8,
      name: "Backpack",
      category: "Fashion",
      brand: "Fashion",
      price: 599,
      oldPrice: 999,
      rating: 4.2,
      image: "https://placehold.co/500x400?text=Backpack",
      store: "Sample Store",
      description: "Everyday backpack with multiple compartments."
    }
  ];

  saveStorage(STORAGE.products, products);
}

let wishlist = readStorage(STORAGE.wishlist, []);
let cart = readStorage(STORAGE.cart, []);
let recent = readStorage(STORAGE.recent, []);
let reviews = readStorage(STORAGE.reviews, {});
let alerts = readStorage(STORAGE.alerts, []);
let currentCategory = "All";
let currentTheme = localStorage.getItem(STORAGE.theme) || "light";

/* =====================================
   TOAST
===================================== */

function toast(message) {
  const element = $("#toast");

  if (!element) {
    alert(message);
    return;
  }

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toast.timer);

  toast.timer = setTimeout(() => {
    element.classList.remove("show");
  }, 2600);
}

/* =====================================
   THEME
===================================== */

function applyTheme(theme) {
  currentTheme = theme;

  const dark = theme === "dark" ||
    (theme === "system" &&
     window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.body.classList.toggle("dark", dark);

  localStorage.setItem(STORAGE.theme, theme);

  const selector = $("#themeSelect");
  if (selector) selector.value = theme;
}

$("#themeBtn")?.addEventListener("click", () => {
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

$("#themeSelect")?.addEventListener("change", event => {
  applyTheme(event.target.value);
});

applyTheme(currentTheme);

/* =====================================
   PRODUCT CARD
===================================== */

function createCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";

  image.onerror = () => {
    image.src = "https://placehold.co/400x300?text=Product";
  };

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("div");
  price.className = "product-price";
  price.textContent = "₹" + product.price.toLocaleString("en-IN");

  const rating = document.createElement("p");
  rating.textContent = "★ " + product.rating + " / 5";

  const store = document.createElement("p");
  store.textContent = "Listed by: " + product.store;

  const details = document.createElement("button");
  details.textContent = "View Details";
  details.onclick = () => openProduct(product.id);

  const wish = document.createElement("button");
  wish.textContent = wishlist.includes(product.id) ? "♥ Saved" : "♡ Wishlist";
  wish.onclick = () => toggleWishlist(product.id);

  const add = document.createElement("button");
  add.textContent = "Add to Cart";
  add.onclick = () => addToCart(product.id);

  card.append(image, name, price, rating, store, details, wish, add);

  return card;
}

/* =====================================
   PRODUCT DISPLAY
===================================== */

function displayProducts(list, container) {
  if (!container) return;

  container.replaceChildren();

  if (!list.length) {
    const message = document.createElement("p");
    message.textContent = "No products found.";
    container.appendChild(message);
    return;
  }

  list.forEach(product => {
    container.appendChild(createCard(product));
  });
}

function loadHome() {
  displayProducts(products, $("#productGrid"));

  const deals = products
    .filter(p => p.oldPrice > p.price)
    .sort((a, b) => {
      const da = (a.oldPrice - a.price) / a.oldPrice;
      const db = (b.oldPrice - b.price) / b.oldPrice;
      return db - da;
    });

  displayProducts(deals, $("#dealsGrid"));
  displayRecent();

  const count = $("#productCount");
  if (count) count.textContent = products.length + " Products";

  updateCartCount();
}

/* =====================================
   SEARCH AND CATEGORY
===================================== */

function searchProducts() {
  const query = ($("#searchInput")?.value || "").trim().toLowerCase();

  const results = products.filter(p => {
    const text = [
      p.name,
      p.category,
      p.brand,
      p.description
    ].join(" ").toLowerCase();

    const matchesQuery = !query || text.includes(query);
    const matchesCategory =
      currentCategory === "All" ||
      p.category === currentCategory;

    return matchesQuery && matchesCategory;
  });

  displayProducts(results, $("#productGrid"));

  const count = $("#productCount");
  if (count) count.textContent = results.length + " Products";
}

$("#searchBtn")?.addEventListener("click", searchProducts);

$("#searchInput")?.addEventListener("keydown", event => {
  if (event.key === "Enter") searchProducts();
});

document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;

    document.querySelectorAll("[data-category]").forEach(btn => {
      btn.classList.toggle("active", btn === button);
    });

    searchProducts();

    $("#productGrid")?.scrollIntoView({ behavior: "smooth" });
  });
});

$("#exploreBtn")?.addEventListener("click", () => {
  $("#productGrid")?.scrollIntoView({ behavior: "smooth" });
});

/* =====================================
   FILTERS
===================================== */

function applyFilters() {
  const query = ($("#searchInput")?.value || "").trim().toLowerCase();
  const max = Number($("#maxPrice")?.value || 0);
  const brand = $("#brandFilter")?.value || "All";
  const sort = $("#sortSelect")?.value || "default";

  let result = products.filter(p => {
    const text = [p.name, p.category, p.brand, p.description]
      .join(" ").toLowerCase();

    return (!query || text.includes(query)) &&
      (currentCategory === "All" || p.category === currentCategory) &&
      (!max || p.price <= max) &&
      (brand === "All" || p.brand === brand);
  });

  if (sort === "low") result.sort((a, b) => a.price - b.price);
  if (sort === "high") result.sort((a, b) => b.price - a.price);
  if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

  if (sort === "discount") {
    result.sort((a, b) => {
      const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
      const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
      return db - da;
    });
  }

  displayProducts(result, $("#productGrid"));

  const count = $("#productCount");
  if (count) count.textContent = result.length + " Products";
}

$("#applyFilters")?.addEventListener("click", applyFilters);

$("#clearFilters")?.addEventListener("click", () => {
  $("#searchInput").value = "";
  $("#maxPrice").value = "";
  $("#brandFilter").value = "All";
  $("#sortSelect").value = "default";

  currentCategory = "All";
  loadHome();
});

/* =====================================
   BRAND FILTER
===================================== */

function loadBrands() {
  const selector = $("#brandFilter");
  if (!selector) return;

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  selector.replaceChildren();

  const all = document.createElement("option");
  all.value = "All";
  all.textContent = "All Brands";
  selector.appendChild(all);

  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    selector.appendChild(option);
  });
}

/* =====================================
   WISHLIST
===================================== */

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    toast("Removed from wishlist.");
  } else {
    wishlist.push(id);
    toast("Added to wishlist.");
  }

  saveStorage(STORAGE.wishlist, wishlist);
  searchProducts();
}

function openWishlist() {
  openOverlay("My Wishlist", "wishlist");
}

$("#wishlistBtn")?.addEventListener("click", openWishlist);

/* =====================================
   SHOPPING CART
===================================== */

function addToCart(id) {
  const item = cart.find(p => p.id === id);

  if (item) item.quantity++;
  else cart.push({ id, quantity: 1 });

  saveStorage(STORAGE.cart, cart);
  updateCartCount();
  toast("Added to cart!");
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const button = $("#cartBtn");

  if (button) button.textContent = `Cart (${count})`;
}

function openCart() {
  openOverlay("Shopping Cart", "cart");
}

$("#cartBtn")?.addEventListener("click", openCart);

function changeQuantity(id, amount) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  saveStorage(STORAGE.cart, cart);
  openCart();
  updateCartCount();
}

/* =====================================
   OVERLAY PAGES
===================================== */

function openOverlay(title, type) {
  document.getElementById("buyallOverlay")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "buyallOverlay";

  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    background: "var(--background)",
    color: "var(--text)",
    zIndex: "10005",
    overflowY: "auto",
    padding: "20px"
  });

  const panel = document.createElement("div");
  panel.style.maxWidth = "1000px";
  panel.style.margin = "auto";

  const heading = document.createElement("h1");
  heading.textContent = title;

  const close = document.createElement("button");
  close.textContent = "← Back to Shopping";
  close.style.cssText =
    "padding:12px;background:#2878e8;color:white;border:0;border-radius:8px;margin-bottom:20px";

  close.onclick = () => overlay.remove();

  const content = document.createElement("div");

  panel.append(close, heading, content);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  if (type === "wishlist") {
    const saved = products.filter(p => wishlist.includes(p.id));
    displayProducts(saved, content);
  }

  if (type === "cart") {
    renderCart(content);
  }
}

function renderCart(container) {
  container.replaceChildren();

  let total = 0;

  if (!cart.length) {
    container.textContent = "Your cart is empty.";
    return;
  }

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    total += product.price * item.quantity;

    const row = document.createElement("div");
    row.style.cssText =
      "padding:15px;border:1px solid var(--border);margin:12px 0;border-radius:10px";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent =
      "₹" + (product.price * item.quantity).toLocaleString("en-IN");

    const quantity = document.createElement("p");
    quantity.textContent = "Quantity: " + item.quantity;

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.onclick = () => changeQuantity(item.id, -1);

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.onclick = () => changeQuantity(item.id, 1);

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.onclick = () => changeQuantity(item.id, -item.quantity);

    row.append(name, price, quantity, minus, plus, remove);
    container.appendChild(row);
  });

  const totalText = document.createElement("h2");
  totalText.textContent = "Total: ₹" + total.toLocaleString("en-IN");
  container.appendChild(totalText);

  const checkout = document.createElement("button");
  checkout.textContent = "Proceed to Checkout";
  checkout.style.cssText =
    "padding:13px;background:#2878e8;color:white;border:0;border-radius:8px";

  checkout.onclick = () => toast("Real checkout is not connected yet.");

  container.appendChild(checkout);
}

/* =====================================
   PRODUCT DETAILS
===================================== */

function openProduct(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;

  recent = [id, ...recent.filter(item => item !== id)].slice(0, 8);
  saveStorage(STORAGE.recent, recent);
  displayRecent();

  document.getElementById("buyallOverlay")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "buyallOverlay";
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:10005;background:var(--background);color:var(--text);overflow:auto;padding:20px";

  const panel = document.createElement("div");
  panel.style.cssText =
    "max-width:950px;margin:auto;background:var(--surface);padding:20px;border-radius:15px";

  const back = document.createElement("button");
  back.textContent = "← Back";
  back.onclick = () => overlay.remove();

  const layout = document.createElement("div");
  layout.style.cssText =
    "display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:25px;margin:20px 0";

  const image = document.createElement("img");
  image.src = p.image;
  image.alt = p.name;
  image.style.cssText = "width:100%;max-height:350px;object-fit:contain";

  const info = document.createElement("div");

  const title = document.createElement("h1");
  title.textContent = p.name;

  const price = document.createElement("h2");
  price.textContent = "₹" + p.price.toLocaleString("en-IN");

  const description = document.createElement("p");
  description.textContent = p.description;

  const rating = document.createElement("p");
  rating.textContent = "Rating: " + p.rating + "/5";

  const add = document.createElement("button");
  add.textContent = "Add to Cart";
  add.onclick = () => addToCart(p.id);

  const wish = document.createElement("button");
  wish.textContent = "♡ Wishlist";
  wish.onclick = () => toggleWishlist(p.id);

  info.append(title, price, description, rating, add, wish);
  layout.append(image, info);

  const comparison = document.createElement("p");
  comparison.textContent =
    "Live retailer price comparison is not connected. This is the currently listed sample price.";

  const reviewTitle = document.createElement("h2");
  reviewTitle.textContent = "Customer Reviews";

  const reviewList = document.createElement("div");
  renderReviews(p.id, reviewList);

  const ratingSelect = document.createElement("select");

  [5, 4, 3, 2, 1].forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = "★".repeat(value);
    ratingSelect.appendChild(option);
  });

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Write your review";
  textarea.style.cssText =
    "display:block;width:100%;min-height:90px;padding:12px;margin:12px 0";

  const submit = document.createElement("button");
  submit.textContent = "Submit Review";

  submit.onclick = () => {
    const text = textarea.value.trim();

    if (!text) {
      toast("Please write a review.");
      return;
    }

    reviews[p.id] = reviews[p.id] || [];

    reviews[p.id].push({
      text,
      rating: Number(ratingSelect.value),
      date: new Date().toLocaleDateString()
    });

    saveStorage(STORAGE.reviews, reviews);
    textarea.value = "";
    renderReviews(p.id, reviewList);
    toast("Review saved on this device.");
  };

  const alertButton = document.createElement("button");
  alertButton.textContent = "Set Price Alert";

  alertButton.onclick = () => {
    const target = Number(prompt("Enter target price ₹:"));

    if (!Number.isFinite(target) || target <= 0) {
      toast("Enter a valid price.");
      return;
    }

    alerts.push({ id: p.id, target });
    saveStorage(STORAGE.alerts, alerts);
    toast("Price alert saved locally.");
  };

  panel.append(
    back, layout, comparison, reviewTitle,
    reviewList, ratingSelect, textarea, submit, alertButton
  );

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

function renderReviews(id, container) {
  container.replaceChildren();

  const list = reviews[id] || [];

  if (!list.length) {
    container.textContent = "No reviews yet.";
    return;
  }

  list.forEach(review => {
    const item = document.createElement("div");
    item.style.cssText =
      "padding:12px;margin:10px 0;background:var(--background);border-radius:8px";

    const heading = document.createElement("strong");
    heading.textContent = "★".repeat(review.rating);

    const comment = document.createElement("p");
    comment.textContent = review.text;

    const date = document.createElement("small");
    date.textContent = review.date;

    item.append(heading, comment, date);
    container.appendChild(item);
  });
}

/* =====================================
   RECENTLY VIEWED
===================================== */

function displayRecent() {
  const list = recent
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  displayProducts(list, $("#recentGrid"));
}

/* =====================================
   VIP ACCESS
===================================== */

$("#vipBtn")?.addEventListener("click", () => {
  if (localStorage.getItem(STORAGE.vip) === "true") {
    toast("VIP Access is already unlocked.");
    return;
  }

  const code = prompt("VIP Access ₹399\nEnter Access Code:");

  if (code === null) return;

  if (code === "0987654321") {
    localStorage.setItem(STORAGE.vip, "true");
    toast("VIP access unlocked!");
  } else {
    toast("Incorrect access code.");
  }
});

/* =====================================
   PRODUCT LINK SAVING
===================================== */

$("#compareBtn")?.addEventListener("click", () => {
  const field = $("#compareLink");
  const message = $("#compareMessage");

  try {
    const url = new URL(field.value.trim());

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Invalid URL");
    }

    localStorage.setItem(STORAGE.compare, url.href);

    message.textContent =
      "Link saved. Live retailer comparison needs product integration.";

    toast("Product link saved.");
  } catch {
    message.textContent = "Please enter a valid product URL.";
  }
});

/* =====================================
   LANGUAGE
===================================== */

const translations = {
  English: {
    search: "Search products, brands and more...",
    trending: "Trending Products",
    deals: "Best Deals",
    recent: "Recently Viewed"
  },
  Bengali: {
    search: "পণ্য, ব্র্যান্ড খুঁজুন...",
    trending: "জনপ্রিয় পণ্য",
    deals: "সেরা অফার",
    recent: "সম্প্রতি দেখা"
  },
  Hindi: {
    search: "उत्पाद और ब्रांड खोजें...",
    trending: "लोकप्रिय उत्पाद",
    deals: "सबसे अच्छे ऑफर",
    recent: "हाल ही में देखे गए"
  }
};

function changeLanguage(language) {
  const t = translations[language] || translations.English;

  $("#searchInput").placeholder = t.search;

  const headings = document.querySelectorAll(".section-heading h2");

  if (headings[0]) headings[0].textContent = t.trending;
  if (headings[1]) headings[1].textContent = t.deals;
  if (headings[2]) headings[2].textContent = t.recent;

  localStorage.setItem(STORAGE.language, language);
}

const languageSelect = $("#languageSelect");

if (languageSelect) {
  languageSelect.value =
    localStorage.getItem(STORAGE.language) || "English";

  languageSelect.addEventListener("change", event => {
    changeLanguage(event.target.value);
  });

  changeLanguage(languageSelect.value);
}

/* =====================================
   ACCOUNT
===================================== */

$("#accountBtn")?.addEventListener("click", () => {
  toast("Account registration requires a secure backend.");
});

/* =====================================
   ADMIN DASHBOARD
===================================== */

function openAdmin() {
  const password = prompt("Enter Admin Password:");

  if (password !== "BUYALLADMIN") {
    if (password !== null) toast("Access denied.");
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "buyallAdminPanel";
  overlay.style.cssText =
    "position:fixed;inset:0;background:var(--background);color:var(--text);z-index:10010;overflow:auto;padding:20px";

  const panel = document.createElement("div");
  panel.style.cssText = "max-width:800px;margin:auto";

  const heading = document.createElement("h1");
  heading.textContent = "BUYALL ADMIN DASHBOARD";

  const close = document.createElement("button");
  close.textContent = "Close";
  close.onclick = () => overlay.remove();

  const name = document.createElement("input");
  name.placeholder = "Product Name";

  const price = document.createElement("input");
  price.type = "number";
  price.placeholder = "Product Price";

  const category = document.createElement("input");
  category.placeholder = "Category";

  const brand = document.createElement("input");
  brand.placeholder = "Brand";

  const image = document.createElement("input");
  image.placeholder = "Image URL";

  const description = document.createElement("textarea");
  description.placeholder = "Product description";

  [name, price, category, brand, image, description].forEach(input => {
    input.style.cssText =
      "display:block;width:100%;padding:12px;margin:10px 0;border:1px solid var(--border);border-radius:8px";
  });

  const add = document.createElement("button");
  add.textContent = "Add Product";

  add.onclick = () => {
    const productName = name.value.trim();
    const amount = Number(price.value);
    const productCategory = category.value.trim();

    if (!productName || !productCategory || amount <= 0) {
      toast("Enter valid product details.");
      return;
    }

    const product = {
      id: Date.now(),
      name: productName,
      price: amount,
      oldPrice: amount,
      category: productCategory,
      brand: brand.value.trim() || "Other",
      rating: 0,
      image: image.value.trim() || "https://placehold.co/400x300?text=Product",
      store: "Admin listing",
      description: description.value.trim()
    };

    products.push(product);
    saveStorage(STORAGE.products, products);

    loadBrands();
    loadHome();
    toast("Product added.");

    name.value = "";
    price.value = "";
    category.value = "";
    brand.value = "";
    image.value = "";
    description.value = "";
  };

  const exportButton = document.createElement("button");
  exportButton.textContent = "Export Product Data";

  exportButton.onclick = () => {
    const blob = new Blob(
      [JSON.stringify(products, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "buyall-products.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  panel.append(
    heading, close, name, price, category,
    brand, image, description, add, exportButton
  );

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

const adminButton = document.createElement("button");
adminButton.textContent = "Admin";
adminButton.onclick = openAdmin;
adminButton.style.cssText =
  "padding:9px 12px;background:#eaf2ff;color:#2878e8;border-radius:8px;margin:5px";

$(".header-actions")?.appendChild(adminButton);

/* =====================================
   PENGUIN MASCOT
===================================== */

const penguinStyle = document.createElement("style");

penguinStyle.textContent = `
#buyallPenguin {
  position:fixed;
  right:15px;
  bottom:15px;
  z-index:9000;
  width:75px;
  cursor:pointer;
  text-align:center;
  font-family:Arial,sans-serif;
}

#buyallPenguin .body {
  height:76px;
  width:62px;
  margin:auto;
  background:#20252d;
  border-radius:48% 48% 42% 42%;
  position:relative;
  box-shadow:0 5px 15px #0002;
}

#buyallPenguin .face {
  position:absolute;
  background:white;
  width:43px;
  height:48px;
  left:9px;
  top:12px;
  border-radius:50%;
}

#buyallPenguin .eyes {
  position:absolute;
  top:14px;
  left:9px;
  font-size:11px;
  color:black;
}

#buyallPenguin .beak {
  position:absolute;
  top:29px;
  left:16px;
  border-left:6px solid transparent;
  border-right:6px solid transparent;
  border-top:8px solid #ff9d26;
}

#buyallPenguin .feet {
  color:#ff9d26;
  font-size:18px;
  margin-top:-4px;
}

#buyallPenguin .message {
  display:none;
  position:absolute;
  right:0;
  bottom:90px;
  width:170px;
  padding:12px;
  background:white;
  color:#222;
  border:1px solid #ddd;
  border-radius:12px;
  box-shadow:0 4px 15px #0002;
  font-size:12px;
}

#buyallPenguin.active .message {
  display:block;
}
`;

document.head.appendChild(penguinStyle);

const penguin = document.createElement("div");
penguin.id = "buyallPenguin";

penguin.innerHTML = `
  <div class="message" id="penguinMessage">
    Welcome to buyall!
  </div>
  <div class="body">
    <div class="face">
      <div class="eyes">●　●</div>
      <div class="beak"></div>
    </div>
  </div>
  <div class="feet">⌄　⌄</div>
`;

document.body.appendChild(penguin);

penguin.addEventListener("click", () => {
  penguin.classList.toggle("active");
});

function penguinTalk(message) {
  $("#penguinMessage").textContent = message;
  penguin.classList.add("active");
}

if (!localStorage.getItem("buyallWelcomed")) {
  setTimeout(() => {
    penguinTalk("Hello! Welcome to buyall!");
    localStorage.setItem("buyallWelcomed", "true");
  }, 1800);
}

/* =====================================
   PRICE ALERT CHECK
===================================== */

function checkPriceAlerts() {
  alerts.forEach(alert => {
    const product = products.find(p => p.id === alert.id);

    if (product && product.price <= alert.target) {
      penguinTalk("Your saved price target has been reached!");

      toast("Price target reached: " + product.name);
    }
  });
}

/* =====================================
   START WEBSITE
===================================== */

loadBrands();
loadHome();
updateCartCount();

console.log("BUYALL COMPLETE FRONTEND LOADED");
