fetch("index.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("timeline");
    const searchInput = document.getElementById("searchInput");
    const tagFilter = document.getElementById("tagFilter");
    const menuToggle = document.getElementById("menuToggle");
    const searchMenu = document.getElementById("searchMenu");
    const yearNav = document.getElementById("yearNav");

    let selectedTags = new Set();
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

    const allTags = [...new Set(data.flatMap(entry => entry.tags))].sort();
    allTags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "tag-option";
      span.textContent = "#" + tag;
      span.dataset.tag = tag;
      span.onclick = () => {
        if (selectedTags.has(tag)) {
          selectedTags.delete(tag);
          span.classList.remove("active");
        } else {
          selectedTags.add(tag);
          span.classList.add("active");
        }
        render();
      };
      tagFilter.appendChild(span);
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

        const matchesTags =
          selectedTags.size === 0 ||
          entry.tags.some(tag => selectedTags.has(tag));

        return matchesYear && matchesKeyword && matchesTags;
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
            if (selectedTags.has(tag)) {
              selectedTags.delete(tag);
            } else {
              selectedTags.add(tag);
            }
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
