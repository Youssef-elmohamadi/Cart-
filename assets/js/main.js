let myCards = document.querySelector(".cards");
let cartCount = document.querySelector(".cart-content h2");
let totalPriceElement = document.querySelector(".total-price");
let totalPopupPriceElement = document.querySelector(".popup .total-price");
let imageDisc = document.querySelector(".img-disc");
let buttonCart = document.querySelector(".confirm");
let BGpopup = document.querySelector(".popup-container");
let popup = document.querySelector(".popup");
let popupContent = document.querySelector(".popup-content");
let startNewOrderButton = document.querySelector(".start-new-order");

let number = 0;
let totalPrice = 0;
let myRequest = new XMLHttpRequest();
let cartData = {};

myRequest.open("GET", "assets/js/data.json", true);
myRequest.send();
myRequest.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    let objData = JSON.parse(this.responseText);
    objData.forEach((item) => createProductCard(item));
  }
};

function createProductCard(item) {
  let myCard = document.createElement("div");
  myCard.classList.add("card");
  myCard.innerHTML = `
    <div class="card-content">
      <div class="image-btn">
        <img src="${item.image.desktop}" alt="${item.name}" />
        <button data-name="${item.name}" data-price="${item.price}">
          <i class="fa-solid fa-cart-plus"></i> Add Product
        </button>
      </div>
      <p class="name">${item.name}</p>
      <p class="disc">${item.category}</p>
      <div class="price">$${item.price.toFixed(2)}</div>
    </div>`;
  myCards.appendChild(myCard);
  let clickButton = myCard.querySelector(".image-btn button");
  clickButton.addEventListener("click", () => addToCart(item));
}

function addToCart(item) {
  number++;
  totalPrice += item.price;
  updateCartCountAndTotal();
  updateCartAndPopup(item);
}

function updateCartCountAndTotal() {
  cartCount.textContent = `Your Cart (${number})`;
  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
  totalPopupPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

function updateCartAndPopup(item) {
  let insertBeforeElement = document.querySelector(
    ".cart-content .total-order"
  );
  let insertPopupBeforeElement = document.querySelector(".popup .total-order");
  let existingProduct = findExistingProduct(
    item.name,
    ".cart-content .row-order"
  );

  if (existingProduct) {
    updateExistingProduct(existingProduct, item.price);
  } else {
    createNewProductRow(item, insertBeforeElement, insertPopupBeforeElement);
  }

  if (number > 0) {
    imageDisc.classList.add("hidden");
  }
}

function findExistingProduct(name, selector) {
  return Array.from(document.querySelectorAll(selector)).find(
    (row) => row.querySelector(".name-order").textContent.trim() === name
  );
}

function updateExistingProduct(existingProduct, price) {
  let quantityElement = existingProduct.querySelector(".num");
  let quantity = parseInt(quantityElement.textContent.substring(1)) + 1;
  quantityElement.textContent = `x${quantity}`;
  let totalElement = existingProduct.querySelector(".total");
  totalElement.textContent = `$${(quantity * price).toFixed(2)}`;

  let popupProduct = findExistingProduct(
    existingProduct.querySelector(".name-order").textContent.trim(),
    ".popup-content .row-order"
  );
  let popupQuantityElement = popupProduct.querySelector(".num");
  popupQuantityElement.textContent = `x${quantity}`;
  let popupTotalElement = popupProduct.querySelector(".total");
  popupTotalElement.textContent = `$${(quantity * price).toFixed(2)}`;
}

function createNewProductRow(
  item,
  insertBeforeElement,
  insertPopupBeforeElement
) {
  let myRow = document.createElement("div");
  myRow.classList.add("row-order");
  myRow.innerHTML = `
    <div class="price-order">
      <p class="name-order">${item.name}</p>
      <span class="num">x1</span> <span class="one-of">$${item.price.toFixed(
        2
      )}</span>
      <span class="total">$${item.price.toFixed(2)}</span>
    </div>
    <i class="fa-regular fa-circle-xmark"></i>`;
  insertBeforeElement.parentNode.insertBefore(myRow, insertBeforeElement);

  let myRowPopup = document.createElement("div");
  myRowPopup.classList.add("row-order");
  myRowPopup.innerHTML = `
    <div class="price-order">
      <p class="name-order">${item.name}</p>
      <span class="num">x1</span> <span class="one-of">$${item.price.toFixed(
        2
      )}</span>
      <span class="total">$${item.price.toFixed(2)}</span>
    </div>`;
  insertPopupBeforeElement.parentNode.insertBefore(
    myRowPopup,
    insertPopupBeforeElement
  );

  let icon = myRow.querySelector(".fa-circle-xmark");
  icon.addEventListener("click", () => removeFromCart(item, myRow));
}

function removeFromCart(item, myRow) {
  let quantityElement = myRow.querySelector(".num");
  let quantity = parseInt(quantityElement.textContent.substring(1));
  let productPrice = parseFloat(
    myRow.querySelector(".one-of").textContent.substring(1)
  );

  if (quantity > 1) {
    quantity--;
    quantityElement.textContent = `x${quantity}`;
    myRow.querySelector(".total").textContent = `$${(
      quantity * productPrice
    ).toFixed(2)}`;
  } else {
    myRow.remove();
  }
  number--;
  totalPrice -= productPrice;
  updateCartCountAndTotal();

  if (number === 0) {
    imageDisc.classList.remove("hidden");
  } else {
    imageDisc.classList.add("hidden");
  }

  let popupProduct = findExistingProduct(
    item.name,
    ".popup-content .row-order"
  );
  if (popupProduct) {
    let popupQuantityElement = popupProduct.querySelector(".num");
    let popupQuantity = parseInt(popupQuantityElement.textContent.substring(1));
    if (popupQuantity > 1) {
      popupQuantity--;
      popupQuantityElement.textContent = `x${popupQuantity}`;
      popupProduct.querySelector(".total").textContent = `$${(
        popupQuantity * productPrice
      ).toFixed(2)}`;
    } else {
      popupProduct.remove();
    }
  }
}

function togglePopupVisibility(visible) {
  if (visible) {
    BGpopup.classList.remove("hidden");
    popup.classList.remove("hidden");
  } else {
    BGpopup.classList.add("hidden");
    popup.classList.add("hidden");
  }
}

buttonCart.addEventListener("click", () => togglePopupVisibility(true));
window.addEventListener("click", (event) => {
  if (!popup.contains(event.target) && !buttonCart.contains(event.target)) {
    togglePopupVisibility(false);
  }
});

startNewOrderButton.addEventListener("click", () => location.reload());
