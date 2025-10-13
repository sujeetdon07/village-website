document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchName');
  const out = document.getElementById('searchResults');

  const performSearch = async () => {
    const q = searchInput.value.trim();
    out.innerHTML = '';

    if (!q) {
      out.innerHTML = '<p style="text-align:center; color: red;">Please type a name</p>';
      return;
    }

    // Disable button & show loading
    searchBtn.disabled = true;
    const originalText = searchBtn.innerHTML;
    searchBtn.innerHTML = `<span class="spinner"></span> Searching...`;

    try {
      const res = await fetch('/api/search?q=' + encodeURIComponent(q));
      const result = await res.json();

      if (result.message) {
        out.innerHTML = `<p style="text-align:center; color: red;">${result.message}</p>`;
        return;
      }

      if (result.data && result.data.length) {
        const html = result.data.map(u => `
          <div class="card small">
            <strong>${u.name}</strong>
            <div>Father: ${u.fatherName}</div>
            <div>Grandfather: ${u.grandfatherName}</div>
            <div>Mobile: ${u.mobile}</div>
            <div>Father mobile: ${u.fatherMobile}</div>
            <div>Ward: ${u.ward}</div>
            <div>Village: ${u.village}</div>
          </div>
        `).join('');
        out.innerHTML = html;
        return;
      }

      out.innerHTML = '<p style="text-align:center; color: red;">No details found</p>';
    } catch {
      out.innerHTML = '<p style="text-align:center; color: red;">Server error</p>';
    } finally {
      searchBtn.disabled = false;
      searchBtn.innerHTML = originalText;
    }
  };

  // Trigger search on button click
  searchBtn.addEventListener('click', performSearch);

  // Trigger search on Enter key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });
});
