document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const alertDiv = document.getElementById("loginAlert");
  const toggleBtn = document.querySelector(".toggle-password");
  const passwordInput = document.getElementById("loginPassword");
  const submitBtn = form.querySelector('button[type="submit"]');
  const mobileInput = document.getElementById("loginMobile");

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
    setTimeout(() => (alertDiv.style.display = "none"), 5000);
  }

  // Manage button state
  function setButtonState(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Please wait...';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Login";
    }
  }

  // Mobile input restriction
  if (mobileInput) {
    mobileInput.addEventListener("input", () => {
      mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  // Password toggle
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
      toggleBtn.textContent = passwordInput.type === "password" ? "👁️" : "🙈";
    });
  }

  // Form submission
  let isSubmitting = false;
  form.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting) return;
      isSubmitting = true;
      setButtonState(true);

      const mobile = mobileInput.value.trim();
      const password = passwordInput.value;

      // Client-side validation
      if (!/^\d{10}$/.test(mobile)) {
        show("Mobile must be 10 digits");
        setButtonState(false);
        isSubmitting = false;
        return;
      }
      if (!password) {
        show("Enter password");
        setButtonState(false);
        isSubmitting = false;
        return;
      }

      // API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, password }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        let data;
        try {
          data = await res.json();
        } catch {
          show("Invalid server response");
          setButtonState(false);
          isSubmitting = false;
          return;
        }

        if (!data.success) {
          show(data.error || "Login failed");
          setButtonState(false);
          isSubmitting = false;
          return;
        }

        show("Login successful!", false);
        setTimeout(() => {
          setButtonState(false);
          isSubmitting = false;
          window.location.href = data.redirect || "/profile";
        }, 1000);
      } catch (err) {
        show(err.name === "AbortError" ? "Request timed out" : "Network error");
        setButtonState(false);
        isSubmitting = false;
      }
    },
    { capture: true }
  );

  // Auto-hide flash messages
  setTimeout(() => {
    document.querySelectorAll("#loginAlert .alert-message").forEach((msg) => msg.remove());
  }, 5000);
});
