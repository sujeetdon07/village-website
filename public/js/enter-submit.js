document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"], [type="submit"]');

    if (submitBtn) {
      // Handle Enter key press only on inputs
      form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
          // Allow normal form submission
          e.preventDefault();
          submitBtn.click();
        }
      });

      // Handle form submit with loading state
      form.addEventListener('submit', () => {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
          <span class="spinner"></span> Please wait...
        `;
      });
    }
  });
});
