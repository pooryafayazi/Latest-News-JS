const API_KEY = "258e09dbbd434b6e878e2f7b9c1e54fd";

const els = {
    mode: document.getElementById("mode"),
    country: document.getElementById("country"),
    q: document.getElementById("q"),
    btn: document.getElementById("btn"),
    status: document.getElementById("status"),
    results: document.getElementById("results"),
};

function fmtDate(iso) {
    try { return new Date(iso).toLocaleString(); } catch { return ""; }
}

function render(articles) {
    if (!articles || !articles.length) {
        els.results.innerHTML = '<div class="status">نتیجه‌ای یافت نشد.</div>';
        return;
    }
    els.results.innerHTML = articles.map(a => `
        <article class="card">
          <img src="${a.urlToImage || ''}" onerror="this.style.display='none'">
          <div class="content">
            <h3 style="margin:0">${a.title || "بدون عنوان"}</h3>
            <div class="meta">${a.source?.name || ""} • ${fmtDate(a.publishedAt)}</div>
            <p>${a.description || ""}</p>
            <a href="${a.url}" target="_blank" rel="noopener">مشاهده خبر</a>
          </div>
        </article>
      `).join("");
}

function buildUrl() {
    const base = "https://newsapi.org/v2";
    if (els.mode.value === "top") {
        const country = els.country.value;
        return `${base}/top-headlines?country=${country}&pageSize=12&apiKey=${API_KEY}`;
    } else {
        const q = encodeURIComponent(els.q.value.trim() || "javascript");
        return `${base}/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${API_KEY}`;
    }
}

function fetchNews() {
    const url = buildUrl();
    els.status.textContent = "در حال دریافت اخبار…";
    els.results.innerHTML = "";

    return fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json(); 
        })
        .then(data => {
            if (data.status !== "ok") throw new Error(data.message || "API error");
            render(data.articles);
            els.status.textContent = `تعداد نتایج: ${data.totalResults ?? "-"}`;
        })
        .catch(err => {
            els.status.textContent = `خطا: ${err.message}`;
            els.results.innerHTML = "";
        })
        .finally(() => {
            console.log("fetch finished.");
        });
}

els.btn.addEventListener("click", fetchNews);

(function init() {
    els.mode.value = "everything";
    els.country.value = "us";
    fetchNews();
})();