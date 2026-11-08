# 用 AI 打造一間會自己進化的公司 · How to Build a Self-Improving Company with AI

> 把一場 YC 演講,變成一頁中英雙語、可互動、可分享的「公司自我進化」長頁。

本站整理自 **Y Combinator 合夥人 Tom Blomfield** 的演講《How to Build a Self-Improving Company with AI》:如何把公司的 know-how 萃取出來、讓 AI 讀得到,並把每個功能組成一組**遞迴、自我改進的 AI 迴圈** —— 連你睡覺的時候,公司都在變好。內容以英文逐字稿 + 繁體中文編輯稿對照整理,並補上原始影片與相關延伸來源(Diana Hu、Jack Dorsey、Pete Sena)。

---

## 🔗 線上版 / Live

| | |
|---|---|
| 🌐 網站 | <https://self-improving-company-with-ai.peteraim.com/> |

> 直接點進去就能用,無需安裝。可用 `https://self-improving-company-with-ai.peteraim.com/#<slug>` 深連結到特定項目(例如 `#sensor-layer`、`#role-dri`)。

---

## ✨ 功能特色

- 🌏 **中英雙語** — 中文在 `/`、英文在 `/en/`,各自有網址,切換鈕與頁尾都能互相切換
- 🌙 **夜班迴圈主視覺** — 五層架構畫成一條封閉軌道上的五個站點,token 一圈圈跑、夜班時鐘從 00:00 走到 08:00;站點可點到對應段落。系統設定「減少動態」時完全靜止
- 🌗 **深色 / 淺色模式** — 混凝土白 ↔ 石墨深色(主視覺與夜班紀錄兩種模式都是深色);預設跟隨系統設定,手動切換後以 localStorage 記憶
- 🧭 **區段導覽 + scrollspy** — 頂部 sticky 的站點式導覽軌,捲動時自動標示目前所在區段;手機上可橫向捲動,兩側淡出提示
- 🔁 **五層架構流程圖** — 藍圖格線上的五個站點,一條回饋線從第五層繞回第一層
- 🔗 **深連結** — 每個項目都有專屬 `#<slug>`,可直接分享
- ⏱️ **影片章節** — 每個時間戳直接連到影片的該秒數
- 📚 **延伸來源與佐證** — 附原始演講影片與相關文章連結
- 📱 **響應式設計** — 手機、平板、桌機皆適配(375px 無水平溢出)
- ⚡ **純靜態零 build** — 無後端、無打包工具,載入快、可離線瀏覽

---

## 📂 內容結構 / 資料來源

本站內容整理自 **YC 演講《How to Build a Self-Improving Company with AI》(講者 Tom Blomfield)**,並參考 Diana Hu、Jack Dorsey、Pete Sena 等延伸來源(見頁面底部「延伸來源與佐證」)。

```
Self-Improving-Company-with-AI/
├── index.html        # 入口頁(meta / OG / JSON-LD / appbar)
├── data/
│   └── data.js       # 資料層:window.SITE_META + window.SITE_SECTIONS(雙語)
├── assets/
│   ├── styles.css    # 「夜班」工業風視覺(石墨/混凝土白 + 安全黃,雙主題)
│   └── app.js        # 區段渲染註冊表、主視覺迴圈動畫、雙語切換、scrollspy、深連結
├── .nojekyll         # 讓 GitHub Pages 跳過 Jekyll
└── README.md
```

> ⚠️ **非官方**:本網站為個人整理之非官方學習資源,內容整理自上述演講與公開來源,
> 文字經改寫/精煉,如有錯誤或出入,請以官方原始來源為準。

---

## 🛠 本機使用

```bash
# 1. clone 專案
git clone https://github.com/tingwei161803/Self-Improving-Company-with-AI.git
cd Self-Improving-Company-with-AI

# 2a. 最簡單:直接開啟 index.html
open index.html

# 2b. 或啟動本機伺服器(建議,深連結 / hash 路由才正常)
uv run python -m http.server 4173
# 然後瀏覽 http://localhost:4173
```

> 本專案為純靜態網站,不需安裝任何依賴。若要跑本機伺服器,依使用者偏好一律使用 `uv`。

---

## 📝 聲明 / License

- 本站為非官方整理,內容著作權歸原始來源(Y Combinator / Tom Blomfield 等)所有。
- 程式碼以 **MIT** 授權釋出。
- 如為權利人且希望調整或移除內容,請開 issue 聯絡。
