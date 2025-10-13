document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const alertDiv = document.getElementById("loginAlert");
  const toggleBtn = document.querySelector(".toggle-password");
  const passwordInput = document.getElementById("loginPassword");
  const submitBtn = form.querySelector('button[type="submit"]');

  const mobileInput = document.getElementById("loginMobile");
  if (mobileInput) {
    mobileInput.addEventListener("input", () => {
      mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  function show(msg, isError = true) {
    const tempDiv = document.createElement("div");
    tempDiv.textContent = msg;
    tempDiv.classList.add("alert-message");
    tempDiv.style.background = isError ? "#ffe6e6" : "#e6ffed";
    tempDiv.style.color = isError ? "#900" : "#055a06";
    tempDiv.style.padding = "8px";
    tempDiv.style.borderRadius = "4px";
    tempDiv.style.marginBottom = "10px";
    alertDiv.appendChild(tempDiv);
    setTimeout(() => tempDiv.remove(), 5000);
  }
  toggleBtn.addEventListener("click", () => {
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
    toggleBtn.textContent = passwordInput.type === "password" ? "👁️" : "🙈";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const mobile = document.getElementById("loginMobile").value.trim();
    const password = passwordInput.value;

    if (!/^\d{10}$/.test(mobile)) {
      show("Mobile must be 10 digits");
      return;
    }
    if (!password) {
      show("Enter password");
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Please wait <span class="spinner"></span>`;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      // Always try to parse JSON
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Handle 401 explicitly
        const msg =
          data.error ||
          (res.status === 401 ? "Invalid mobile or password" : "Login failed");
        show(msg);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      if (!data.success) {
        show(data.error || "Login failed");
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      // Success → redirect
      window.location.href = data.redirect || "/profile";
    } catch (err) {
      console.error("Network error:", err);
      show("Network error");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});

// Auto-hide flash messages after 5s
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document
      .querySelectorAll("#loginAlert .alert-message")
      .forEach((msg) => msg.remove());
  }, 5000);
});
