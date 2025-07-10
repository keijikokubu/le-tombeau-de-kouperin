fetch("index.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("timeline");
    const searchInput = document.getElementById("searchInput");
    const menuToggle = document.getElementById("menuToggle");
    const searchMenu = document.getElementById("searchMenu");
    const yearNav = document.getElementById("yearNav");

    let selectedTag = null;
    let currentKeyword = "";
    let selectedYear = null;

    menuToggle.addEventListener("click", () => {
      searchMenu.classList.toggle("hidden");
    });

    const years = [...new Set(data.map(entry => entry.timestamp.slice(0, 4)))].sort();
    years.forEach(year => {
      const span = document.createElement("span");
      span.className = "year-option";
      span.textContent = year;
      span.onclick = () => {
        selectedYear = selectedYear === year ? null : year;
        render();
      };
      yearNav.appendChild(span);
    });

    searchInput.addEventListener("input", e => {
      currentKeyword = e.target.value.toLowerCase();
      render();
    });

    function render() {
      container.innerHTML = "";

      Array.from(yearNav.querySelectorAll(".year-option")).forEach(el => {
        el.classList.toggle("active", el.textContent === selectedYear);
      });

      let filtered = data.filter(entry => {
        const entryYear = entry.timestamp.slice(0, 4);
        const matchesYear = !selectedYear || entryYear === selectedYear;

        const matchesKeyword =
          entry.title.toLowerCase().includes(currentKeyword) ||
          entry.summary.toLowerCase().includes(currentKeyword) ||
          entry.tags.some(tag => tag.toLowerCase().includes(currentKeyword));

        const matchesTag = !selectedTag || entry.tags.includes(selectedTag);

        return matchesYear && matchesKeyword && matchesTag;
      });

      filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      filtered.forEach(entry => {
        const div = document.createElement("div");
        div.className = "timeline-entry";

        const tagHTML = entry.tags
          .map(tag => `<span class="entry-tag" data-tag="${tag}">#${tag}</span>`)
          .join("");

        div.innerHTML = `
          <div class="entry-date">${entry.timestamp}</div>
          <div class="entry-title">
            <a href="${entry.path}">${entry.title}</a>
          </div>
          <div class="entry-summary">${entry.summary}</div>
          <div class="entry-tags">${tagHTML}</div>
        `;

        div.querySelectorAll(".entry-tag").forEach(tagEl => {
          tagEl.addEventListener("click", () => {
            const tag = tagEl.dataset.tag;
            selectedTag = selectedTag === tag ? null : tag;
            render();
          });
        });

        container.appendChild(div);
      });
    }

    render();
  })
  .catch(error => {
    console.error("index.jsonの読み込みに失敗しました:", error);
  });
