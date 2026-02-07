(() => {
  const CART_KEY = "cart";
  const TOTAL_KEY = "cartTotal";

  const selectors = {
    tableBody: "tbody",
    checkoutButton: ".checkout-btn",
    summarySubtotal: ".cart-summary p:nth-child(2)",
    summaryTax: ".cart-summary p:nth-child(3)",
    summaryTotal: ".cart-summary p strong",
  };

  const getCart = () => {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  const setItemQuantity = (id, quantity) => {
    const cart = getCart();
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const removeItemById = (id) => {
    const cart = getCart().filter((item) => item.id !== id);
    saveCart(cart);
  };

  const renderEmpty = (tableBody, checkoutBtn) => {
    tableBody.innerHTML =
      "<tr><td colspan='5' class='empty-message'>Your cart is empty.</td></tr>";
    checkoutBtn.style.display = "none";
  };

  const renderRows = (tableBody, cart) => {
    tableBody.innerHTML = "";
    cart.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML =
        "<td>" +
        item.name +
        "</td>" +
        '<td class="cart-quantityPar">' +
        '<input class="cart-quantityip" type="number" value="' +
        item.quantity +
        '" min="1" data-id="' +
        item.id +
        '">' +
        "</td>" +
        '<td class="cart-price">$' +
        Number(item.price).toFixed(2) +
        "</td>" +
        '<td class="item-total">$' +
        (Number(item.price) * Number(item.quantity)).toFixed(2) +
        "</td>" +
        '<td><button class="remove-btn" data-id="' +
        item.id +
        '">Remove</button></td>';
      tableBody.appendChild(row);
    });
  };

  const updateTotals = () => {
    const rows = document.querySelectorAll("tbody tr");
    let subtotal = 0;

    rows.forEach((row) => {
      const priceText = row.querySelector(".cart-price")?.innerText || "$0";
      const price = parseFloat(priceText.replace("$", "")) || 0;
      const quantityInput = row.querySelector('input[type="number"]');
      const quantity = parseInt(quantityInput?.value || "0", 10) || 0;
      subtotal += price * quantity;
    });

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    localStorage.setItem(TOTAL_KEY, total.toFixed(2));

    const subtotalEl = document.querySelector(selectors.summarySubtotal);
    const taxEl = document.querySelector(selectors.summaryTax);
    const totalEl = document.querySelector(selectors.summaryTotal);

    if (subtotalEl) subtotalEl.innerText = `Subtotal: $${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `Tax (5%): $${tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `Total: $${total.toFixed(2)}`;
  };

  const wireQuantityHandlers = () => {
    document.querySelectorAll("tbody tr").forEach((row) => {
      const quantityInput = row.querySelector("input");
      if (!quantityInput) return;

      quantityInput.onchange = function () {
        const itemId = this.getAttribute("data-id");
        const newQuantity = Math.max(1, parseInt(this.value, 10) || 1);
        this.value = newQuantity;

        setItemQuantity(itemId, newQuantity);

        const price = parseFloat(
          this.parentElement.nextElementSibling.innerText.replace("$", "")
        );
        const totalCell =
          this.parentElement.nextElementSibling.nextElementSibling;
        totalCell.innerText = "$" + (price * newQuantity).toFixed(2);

        updateTotals();
      };
    });
  };

  const wireRemoveHandlers = () => {
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.onclick = function () {
        const itemId = this.getAttribute("data-id");
        removeItemById(itemId);
        loadCart();
      };
    });
  };

  const loadCart = () => {
    const cart = getCart();
    const tableBody = document.querySelector(selectors.tableBody);
    const checkoutBtn = document.querySelector(selectors.checkoutButton);

    if (!tableBody || !checkoutBtn) return;

    if (cart.length === 0) {
      renderEmpty(tableBody, checkoutBtn);
      return;
    }

    renderRows(tableBody, cart);
    checkoutBtn.style.display = "inline";
    wireQuantityHandlers();
    wireRemoveHandlers();
    updateTotals();
  };

  document.addEventListener("DOMContentLoaded", loadCart);
})();