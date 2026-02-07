(() => {
  const TOTAL_KEY = "cartTotal";

  const updateTotal = () => {
    const total = localStorage.getItem(TOTAL_KEY);
    const totalElement = document.querySelector("h2");
    if (total && totalElement) {
      totalElement.innerHTML =
        "Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        total +
        "$<br />";
    }
  };

  const validateForm = () => {
    const fname = document.getElementById("firstname").value.trim();
    const lname = document.getElementById("lastname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const card = document.getElementById("card").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!fname || !lname) {
      alert("Firstname and Last name must be entered");
      return false;
    }

    if (isNaN(phone) || phone.length !== 11) {
      alert("Please enter a valid phone number");
      return false;
    }

    if (card.length !== 16 || isNaN(card)) {
      alert("Please enter a valid card number");
      return false;
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
      alert("Please enter a valid cvv");
      return false;
    }

    alert(`Payment Processed for $${localStorage.getItem(TOTAL_KEY) || "0.00"}`);
    window.location.href = "thank-you.html";
    return false;
  };

  window.validation = validateForm;
  window.addEventListener("DOMContentLoaded", updateTotal);
})();