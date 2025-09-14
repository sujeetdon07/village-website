document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const alertDiv = document.getElementById('loginAlert');
  const toggleBtn = document.querySelector('.toggle-password');
  const passwordInput = document.getElementById('loginPassword');

  function show(msg, isError = true) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = msg;
    tempDiv.classList.add('alert-message');
    tempDiv.style.background = isError ? '#ffe6e6' : '#e6ffed';
    tempDiv.style.color = isError ? '#900' : '#055a06';
    tempDiv.style.padding = '8px';
    tempDiv.style.borderRadius = '4px';
    tempDiv.style.marginBottom = '10px';
    alertDiv.appendChild(tempDiv);
    setTimeout(() => tempDiv.remove(), 5000);
  }

  toggleBtn.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    toggleBtn.textContent = passwordInput.type === 'password' ? '👁️' : '🙈';
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const mobile = document.getElementById('loginMobile').value.trim();
    const password = passwordInput.value;

    if (!/^\d{10}$/.test(mobile)) { show('Mobile must be 10 digits'); return; }
    if (!password) { show('Enter password'); return; }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ mobile, password })
      });

      const data = await res.json();
      if (!res.ok) { show(data.error || 'Login failed'); return; }

      window.location.href = data.redirect || '/profile';
    } catch (err) {
      show('Network error');
    }
  });
});
