let myCards = document.querySelector(".cards");
let numbers = document.querySelector(".cart-content h2 span");
let cartCount = document.querySelector(".cart-content h2");
let totalPriceElement = document.querySelector(".total-price");
let totalPopupPriceElement = document.querySelector(".popup .total-price");
let imageDisc = document.querySelector(".img-disc");
let buttonCart = document.querySelector(".confirm");
let BGpopup = document.querySelector(".popup-container");
let popup = document.querySelector(".popup");
let popupContent = document.querySelector(".popup-content");

let myRequest = new XMLHttpRequest();
let cartData = {};

let number = 0;
let totalPrice = 0;

myRequest.open("GET", "/assets/js/data.json", true);
myRequest.send();

myRequest.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    let objData = JSON.parse(this.responseText);
    for (let i = 0; i < objData.length; i++) {
      let myCard = document.createElement("div");
      myCard.classList.add("card");
      myCard.innerHTML = `<div class="card-content">
      <div class="image-btn">
      <img src="${objData[i].image.desktop}" alt="${objData[i].name}" />
      <button data-name="${objData[i].name}" data-price="${objData[i].price}">
      <i class="fa-solid fa-cart-plus"></i> Add Product
      </button>
      </div>
      <p class="name">${objData[i].name}</p>
      <p class="disc">${objData[i].category}</p>
      <div class="price">$${objData[i].price.toFixed(2)}</div>
      </div>`;
      myCards.appendChild(myCard);
      let clickButton = myCard.querySelector(".image-btn button");
      let insertBeforeElement = document.querySelector(
        ".cart-content .total-order"
      );
      let insertPopupBeforeElement = document.querySelector(
        ".popup .total-order"
      );

      clickButton.addEventListener("click", function () {
        number++;
        let productPrice = parseFloat(this.getAttribute("data-price"));
        totalPrice += productPrice;
        numbers.textContent = number;
        cartCount.textContent = `Your Cart (${number})`;
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        totalPopupPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        let productName = this.getAttribute("data-name");
        let existingProduct = Array.from(
          document.querySelectorAll(".cart-content .row-order")
        ).find(
          (row) =>
            row.querySelector(".name-order").textContent.trim() === productName
        );
        if (existingProduct) {
          let quantityElement = existingProduct.querySelector(".num");
          let quantity = parseInt(quantityElement.textContent.substring(1)) + 1;
          quantityElement.textContent = `x${quantity}`;

          let totalElement = existingProduct.querySelector(".total");
          totalElement.textContent = `$${(quantity * productPrice).toFixed(2)}`;

          let popupProduct = Array.from(
            document.querySelectorAll(".popup-content .row-order")
          ).find(
            (row) =>
              row.querySelector(".name-order").textContent.trim() ===
              productName
          );
          let popupQuantityElement = popupProduct.querySelector(".num");
          popupQuantityElement.textContent = `x${quantity}`;
          let popupTotalElement = popupProduct.querySelector(".total");
          popupTotalElement.textContent = `$${(quantity * productPrice).toFixed(
            2
          )}`;
        } else {
          let myRow = document.createElement("div");
          myRow.classList.add("row-order");
          myRow.innerHTML = `<div class="price-order">
                  <p class="name-order">${this.getAttribute("data-name")}</p>
                  <span class="num">x1</span> <span class="one-of">$${productPrice.toFixed(
                    2
                  )}</span>
                  <span class="total">$${productPrice.toFixed(2)}</span>
                </div>
                <i class="fa-regular fa-circle-xmark"></i>`;
          insertBeforeElement.parentNode.insertBefore(
            myRow,
            insertBeforeElement
          );

          let myRowPopup = document.createElement("div");
          myRowPopup.classList.add("row-order");
          myRowPopup.innerHTML = `<div class="price-order">
                  <p class="name-order">${this.getAttribute("data-name")}</p>
                  <span class="num">x1</span> <span class="one-of">$${productPrice.toFixed(
                    2
                  )}</span>
                  <span class="total">$${productPrice.toFixed(2)}</span>
                </div>`;
          insertPopupBeforeElement.parentNode.insertBefore(
            myRowPopup,
            insertPopupBeforeElement
          );

          let icon = myRow.querySelector(".fa-circle-xmark");
          icon.addEventListener("click", function () {
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
            numbers.textContent = number;
            cartCount.innerHTML = `Your Cart (${number})`;
            totalPrice -= productPrice;
            totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
            totalPopupPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
            if (number === 0) {
              imageDisc.classList.remove("hidden");
            } else {
              imageDisc.classList.add("hidden");
            }
            let popupProduct = Array.from(
              document.querySelectorAll(".popup-content .row-order")
            ).find(
              (row) =>
                row.querySelector(".name-order").textContent.trim() ===
                productName
            );
            if (popupProduct) {
              let popupQuantityElement = popupProduct.querySelector(".num");
              let popupQuantity = parseInt(
                popupQuantityElement.textContent.substring(1)
              );
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
          });
          document
            .querySelector(".start-new-order")
            .addEventListener("click", function () {
              location.reload();
            });
          if (number > 0) {
            imageDisc.classList.add("hidden");
          }
        }
      });
    }
    buttonCart.addEventListener("click", function () {
      BGpopup.classList.remove("hidden");
      popup.classList.remove("hidden");
    });
    window.addEventListener("click", function (event) {
      if (BGpopup.contains(event.target)) {
        BGpopup.classList.add("hidden");
        popup.classList.add("hidden");
      }
    });
  }
};
