document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".password-wrapper .toggle-password").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = toggle.previousElementSibling; // input comes before button
      const icon = toggle.querySelector("svg");

      if (input.type === "password") {
        input.type = "text";
        // Change to "eye-off" icon
        icon.innerHTML = `
          <path d="M12 5c-7.633 0-12 7-12 7s4.367 7
          12 7c2.17 0 4.098-.39 5.812-1.064l-2.204-2.204A6.972
          6.972 0 0 1 12 17c-2.761 0-5-2.239-5-5
          0-1.17.391-2.243 1.064-3.092L5.868 6.712A11.9
          11.9 0 0 0 0 12s4.367 7 12 7c2.17 0 4.098-.39
          5.812-1.064l1.422 1.422 1.414-1.414-16-16-1.414
          1.414 2.204 2.204C2.974 7.756 0 12 0 12s4.367 7
          12 7c2.17 0 4.098-.39 5.812-1.064l1.422 1.422
          1.414-1.414-16-16L5.868 6.712z"/>`;
      } else {
        input.type = "password";
        // Change back to "eye" icon
        icon.innerHTML = `
          <path d="M12 5c-7.633 0-12 7-12 7s4.367 7
          12 7 12-7 12-7-4.367-7-12-7zm0
          12c-2.761 0-5-2.239-5-5s2.239-5
          5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.657
          0-3 1.343-3 3s1.343 3 3
          3 3-1.343 3-3-1.343-3-3-3z"/>`;
      }
    });
  });
});
