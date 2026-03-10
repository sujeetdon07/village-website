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
        const html = result.data.map(u => {
          if (u.type === 'contact') {
            // Important Contact Card
            return `
              <div class="card small" style="border-left: 4px solid #28a745; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <strong style="font-size: 18px;">${u.name}</strong>
                  <span style="background: #28a745; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                    ${u.category}
                  </span>
                </div>
                <div style="font-size: 16px;">📞 Mobile: <strong>${u.mobile}</strong></div>
              </div>
            `;
          } else {
            // Resident Card
            return `
              <div class="card small" style="margin-bottom: 15px;">
                <strong style="font-size: 18px;">${u.name}</strong>
                <div>Father/Husband: ${u.fatherName}</div>
                <div>Mobile: ${u.mobile}</div>
                <div>Father/Husband Mobile: ${u.fatherMobile}</div>
                <div>Ward: ${u.ward}</div>
                <div>Village: ${u.village}</div>
              </div>
            `;
          }
        }).join('');
        
        out.innerHTML = html;
        return;
      }

      out.innerHTML = '<p style="text-align:center; color: red;">No details found</p>';
    } catch (error) {
      console.error('Search error:', error);
      out.innerHTML = `<p style="text-align:center; color: red;">Server error</p>`;
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
