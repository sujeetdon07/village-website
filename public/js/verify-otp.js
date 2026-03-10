document.addEventListener("DOMContentLoaded", () => {
  let timeLeft = 300; // 5 minutes
  const timerEl = document.getElementById("timer");
  const resendBtn = document.getElementById("resendBtn");
  const resendMsg = document.getElementById("resendMsg");

  // Countdown for OTP validity
  const countdown = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerEl.textContent = "OTP expired. Please request again.";
    } else {
      const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const seconds = String(timeLeft % 60).padStart(2, "0");
      timerEl.textContent = `Time remaining: ${minutes}:${seconds}`;
      timeLeft--;
    }
  }, 1000);

  // Resend OTP lock for 45s
  let resendLock = 45;
  const resendInterval = setInterval(() => {
    if (resendLock <= 0) {
      clearInterval(resendInterval);
      resendBtn.disabled = false;
      resendBtn.style.background = "#007bff"; // Blue when active
      resendBtn.textContent = "Resend OTP";
    } else {
      resendBtn.textContent = `Resend OTP (${resendLock}s)`;
      resendLock--;
    }
  }, 1000);

  // Resend OTP handler
  resendBtn.addEventListener("click", async () => {
    resendBtn.disabled = true;
    resendBtn.style.background = "#444"; // Gray while locked
    resendMsg.textContent = "";
    resendMsg.style.color = "green";

    try {
      const res = await fetch("/resend-otp", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        resendMsg.textContent = "A new OTP has been sent!";
        resendMsg.style.color = "green";
      } else {
        resendMsg.textContent = data.error || "Failed to resend OTP.";
        resendMsg.style.color = "red";
      }
    } catch (err) {
      resendMsg.textContent = "Server error, please try again.";
      resendMsg.style.color = "red";
    }

    // Restart lock timer
    resendLock = 45;
    const lockInterval = setInterval(() => {
      if (resendLock <= 0) {
        clearInterval(lockInterval);
        resendBtn.disabled = false;
        resendBtn.style.background = "#007bff";
        resendBtn.textContent = "Resend OTP";
      } else {
        resendBtn.textContent = `Resend OTP (${resendLock}s)`;
        resendLock--;
      }
    }, 1000);
  });
});
