fetch("index.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("timeline");

    // 昇順（古い順）
    data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    data.forEach(entry => {
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
  })
  .catch(error => {
    console.error("index.jsonの読み込みに失敗しました:", error);
  });