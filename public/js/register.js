document.addEventListener("DOMContentLoaded", () => {
  // Disclaimer Modal Handling
  const disclaimerModal = document.getElementById("disclaimerModal");
  const registerCard = document.getElementById("registerCard");
  const acceptBtn = document.getElementById("acceptDisclaimer");
  const rejectBtn = document.getElementById("rejectDisclaimer");

  // Show disclaimer on page load
  disclaimerModal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Accept disclaimer
  acceptBtn.addEventListener("click", () => {
    disclaimerModal.style.display = "none";
    registerCard.style.display = "block";
    document.body.style.overflow = "auto";
  });

  // Reject disclaimer - redirect to home
  rejectBtn.addEventListener("click", () => {
    window.location.href = "/";
  });

  const form = document.getElementById("registerForm");
  const alertDiv = document.getElementById("regAlert");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const captchaBox = document.getElementById("captchaBox");
  const captchaInput = document.getElementById("captchaInput");
  const refreshCaptcha = document.getElementById("refreshCaptcha");
  const mobileInput = document.getElementById("mobile");
  const aadhaarInput = document.getElementById("aadhaar");
  const nameInput = document.getElementById("name");
  const registerBtn = document.getElementById("registerBtn");

  // Show alert
  function show(msg, isError = true) {
    alertDiv.style.display = "block";
    alertDiv.textContent = msg;
    alertDiv.style.background = isError ? "#ffe6e6" : "#e6ffed";
    alertDiv.style.color = isError ? "#900" : "#055a06";
    alertDiv.classList.remove("show");
    void alertDiv.offsetWidth;
    alertDiv.classList.add("show");
    alertDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => (alertDiv.style.display = "none"), 4000);
  }

  // Manage button state
  function setButtonState(isLoading) {
    if (isLoading) {
      registerBtn.disabled = true;
      registerBtn.innerHTML = '<span class="spinner"></span> Please wait...';
    } else {
      registerBtn.disabled = false;
      registerBtn.innerHTML = "Register";
    }
  }

  // Password toggle
  document.querySelectorAll(".password-wrapper .toggle-password").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const input = toggle.previousElementSibling;
      const icon = toggle.querySelector("svg");
      if (input.type === "password") {
        input.type = "text";
        icon.innerHTML = `
          <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7c2.17 0 4.098-.39 5.812-1.064l-2.204-2.204A6.972 6.972 0 0 1 12 17c-2.761 0-5-2.239-5-5 0-1.17.391-2.243 1.064-3.092L5.868 6.712A11.9 11.9 0 0 0 0 12s4.367 7 12 7c2.17 0 4.098-.39 5.812-1.064l1.422 1.422 1.414-1.414-16-16-1.414 1.414 2.204 2.204C2.974 7.756 0 12 0 12s4.367 7 12 7c2.17 0 4.098-.39 5.812-1.064l1.422 1.422 1.414-1.414-16-16L5.868 6.712z"/>
        `;
      } else {
        input.type = "password";
        icon.innerHTML = `
          <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"/>
        `;
      }
    });
  });

  // Live password match
  confirmInput.addEventListener("input", () => {
    confirmInput.style.borderColor = confirmInput.value !== passwordInput.value ? "#e74c3c" : "#38a169";
  });

  // Restrict name input
  nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^A-Za-z ]/g, "").trimStart().replace(/\s+/g, " ").slice(0, 30);
  });

  // Restrict mobile and Aadhaar
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

  // CAPTCHA generation
  function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    captchaBox.textContent = Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
    captchaInput.value = "";
  }
  generateCaptcha();
  refreshCaptcha.addEventListener("click", generateCaptcha);

  // Form submission
  let isSubmitting = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSubmitting) return;
    isSubmitting = true;
    setButtonState(true);

    const name = nameInput.value.trim();
    const mobile = mobileInput.value.trim();
    const aadhaar = aadhaarInput.value.trim();
    const email = document.getElementById("email").value.trim();
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const panchayat = document.getElementById("panchayat").value.trim();
    const village = document.getElementById("village").value;
    const password = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();
    const captchaVal = captchaInput.value.trim();
    const captchaActual = captchaBox.textContent.trim();

    // Client-side validation
    if (!name || name.length > 30 || !/^[A-Za-z]+( [A-Za-z]+)*$/.test(name) ||
        !/^\d{10}$/.test(mobile) || !/^\d{12}$/.test(aadhaar) ||
        !dateOfBirth ||
        (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
        !password || password.length < 6 || password !== confirm ||
        !village || captchaVal !== captchaActual) {
      if (!name) show("Name required");
      else if (name.length > 30) show("Name cannot exceed 30 characters");
      else if (!/^[A-Za-z]+( [A-Za-z]+)*$/.test(name)) show("Name must contain only letters with single spaces between words");
      else if (!/^\d{10}$/.test(mobile)) show("Mobile must be 10 digits");
      else if (!/^\d{12}$/.test(aadhaar)) show("Aadhaar must be 12 digits");
      else if (!dateOfBirth) show("Date of birth is required");
      else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) show("Invalid email format");
      else if (!password) show("Password required");
      else if (password.length < 6) show("Password must be at least 6 characters");
      else if (password !== confirm) show("Passwords do not match");
      else if (!village) show("Please select a village");
      else if (captchaVal !== captchaActual) { show("Incorrect CAPTCHA"); generateCaptcha(); }
      setButtonState(false);
      isSubmitting = false;
      return;
    }

    // API call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, mobile, email, aadhaar, dateOfBirth, password, confirmPassword: confirm, panchayat, village, captchaInput: captchaVal
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();

      if (!data.success) {
        show(data.error || "Registration failed");
        generateCaptcha();
        setButtonState(false);
        isSubmitting = false;
        return;
      }

      show("Registered successfully!", false);
      setTimeout(() => {
        setButtonState(false);
        isSubmitting = false;
        window.location.href = data.redirect || "/enter-details";
      }, 1000);
    } catch (err) {
      show(err.name === "AbortError" ? "Request timed out" : "Network error");
      generateCaptcha();
      setButtonState(false);
      isSubmitting = false;
    }
  }, { capture: true });
});
