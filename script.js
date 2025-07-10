
fetch("index.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("timeline");
    const searchInput = document.getElementById("searchInput");
    const tagFilter = document.getElementById("tagFilter");
    const sortOrderSelect = document.getElementById("sortOrder");

    let selectedTags = new Set();
    let currentKeyword = "";
    let currentSortOrder = "desc";

    // 初期タグ一覧の描画
    const allTags = [...new Set(data.flatMap(entry => entry.tags))];
    allTags.sort();
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

    // イベントリスナー
    searchInput.addEventListener("input", e => {
      currentKeyword = e.target.value.toLowerCase();
      render();
    });

    sortOrderSelect.addEventListener("change", e => {
      currentSortOrder = e.target.value;
      render();
    });

    function render() {
      container.innerHTML = "";

      let filtered = data.filter(entry => {
        const keywordMatch =
          entry.title.toLowerCase().includes(currentKeyword) ||
          entry.summary.toLowerCase().includes(currentKeyword) ||
          entry.tags.some(tag => tag.toLowerCase().includes(currentKeyword));

        const tagMatch = selectedTags.size === 0 ||
          entry.tags.some(tag => selectedTags.has(tag));

        return keywordMatch && tagMatch;
      });

      filtered.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return currentSortOrder === "asc"
          ? dateA - dateB
          : dateB - dateA;
      });

      filtered.forEach(entry => {
        const div = document.createElement("div");
        div.className = "timeline-entry";

        div.innerHTML = `
          <div class="entry-date">${entry.timestamp}</div>
          <div class="entry-title">
            <a href="${entry.path}">${entry.title}</a>
          </div>
          <div class="entry-summary">${entry.summary}</div>
          <div class="entry-tags">
            ${entry.tags.map(tag => `<span>#${tag}</span>`).join("")}
          </div>
        `;

        container.appendChild(div);
      });
    }

    render();
  })
  .catch(error => {
    console.error("index.jsonの読み込みに失敗しました:", error);
  });
