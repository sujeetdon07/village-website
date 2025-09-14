// public/js/register.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const alertDiv = document.getElementById("regAlert");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const captchaBox = document.getElementById("captchaBox");
  const captchaInput = document.getElementById("captchaInput");
  const refreshCaptcha = document.getElementById("refreshCaptcha");
  const mobileInput = document.getElementById("mobile");
  const aadhaarInput = document.getElementById("aadhaar");

  // Show alert inside card
  function show(msg, isError = true) {
    alertDiv.style.display = "block";
    alertDiv.textContent = msg;
    alertDiv.style.background = isError ? "#ffe6e6" : "#e6ffed";
    alertDiv.style.color = isError ? "#900" : "#055a06";
    alertDiv.classList.remove("show");
    void alertDiv.offsetWidth; // trigger reflow
    alertDiv.classList.add("show");
    alertDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => (alertDiv.style.display = "none"), 4000);
  }

  // ---------------- PASSWORD TOGGLE ----------------
  document
    .querySelectorAll(".password-wrapper .toggle-password")
    .forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const input = toggle.previousElementSibling; // input comes before button
        const icon = toggle.querySelector("svg");

        if (input.type === "password") {
          input.type = "text";
          // Change icon to "eye-off"
          icon.innerHTML = `
          <path d="M12 5c-7.633 0-12 7-12 7s4.367 7
          12 7c2.17 0 4.098-.39 5.812-1.064l-2.204-2.204A6.972
          6.972 0 0 1 12 17c-2.761 0-5-2.239-5-5
          0-1.17.391-2.243 1.064-3.092L5.868 6.712A11.9
          11.9 0 0 0 0 12s4.367 7 12 7c2.17 0 4.098-.39
          5.812-1.064l1.422 1.422 1.414-1.414-16-16-1.414
          1.414 2.204 2.204C2.974 7.756 0 12 0 12s4.367 7
          12 7c2.17 0 4.098-.39 5.812-1.064l1.422 1.422
          1.414-1.414-16-16L5.868 6.712z"/>
        `;
        } else {
          input.type = "password";
          // Change icon back to "eye"
          icon.innerHTML = `
          <path d="M12 5c-7.633 0-12 7-12 7s4.367 7
          12 7 12-7 12-7-4.367-7-12-7zm0
          12c-2.761 0-5-2.239-5-5s2.239-5
          5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.657
          0-3 1.343-3 3s1.343 3 3
          3 3-1.343 3-3-1.343-3-3-3z"/>
        `;
        }
      });
    });

  // ---------------- LIVE PASSWORD MATCH ----------------
  confirmInput.addEventListener("input", () => {
    if (confirmInput.value !== passwordInput.value) {
      confirmInput.style.borderColor = "#e74c3c";
    } else {
      confirmInput.style.borderColor = "#38a169";
    }
  });

  // ---------------- RESTRICT MOBILE & AADHAAR ----------------
  mobileInput.addEventListener("input", () => {
    mobileInput.value = mobileInput.value.replace(/[^0-9]/g, "").slice(0, 10);
  });
  mobileInput.addEventListener("paste", (e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^[0-9]*$/.test(pasted)) {
      e.preventDefault();
      show("Only numeric values (0-9) are allowed for mobile.");
    }
  });

  aadhaarInput.addEventListener("input", () => {
    aadhaarInput.value = aadhaarInput.value.replace(/[^0-9]/g, "").slice(0, 12);
  });
  aadhaarInput.addEventListener("paste", (e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^[0-9]*$/.test(pasted)) {
      e.preventDefault();
      show("Only numeric values (0-9) are allowed for Aadhaar.");
    }
  });

  // ---------------- CAPTCHA ----------------
  function generateCaptcha() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    captchaBox.textContent = Array.from({ length: 5 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  }
  generateCaptcha();
  refreshCaptcha.addEventListener("click", generateCaptcha);

  // ---------------- FORM SUBMIT ----------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const mobile = mobileInput.value.trim();
    const aadhaar = aadhaarInput.value.trim();
    const email = document.getElementById("email").value.trim();
    const panchayat = document.getElementById("panchayat").value.trim();
    const village = document.getElementById("village").value;
    const password = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();
    const captchaVal = captchaInput.value.trim();
    const captchaActual = captchaBox.textContent.trim();

    if (!name) {
      show("Name required");
      return;
    }
    if (!/^[A-Za-z]{1,20}$/.test(name)) {
      show("Name must contain only letters (A-Z) and max 20 characters");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      show("Mobile must be 10 digits");
      return;
    }
    if (!/^\d{12}$/.test(aadhaar)) {
      show("Aadhaar must be 12 digits");
      return;
    }
    if (!password) {
      show("Password required");
      return;
    }
    if (password !== confirm) {
      show("Passwords do not match");
      return;
    }
    if (captchaVal !== captchaActual) {
      show("Incorrect CAPTCHA");
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          email,
          aadhaar,
          password,
          confirmPassword: confirm,
          panchayat,
          village,
          captchaInput: captchaVal,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        if (data.error && data.error.includes("duplicate"))
          show("Aadhaar or Mobile already exists");
        else show(data.error || "Registration failed");
        generateCaptcha();
        return;
      }

      show("Registered successfully!", false);
      setTimeout(
        () => (window.location.href = data.redirect || "/enter-details"),
        1000
      );
    } catch (err) {
      show("Network error");
    }
  });
});
