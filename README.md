# 用 AI 打造一間會自己進化的公司 · How to Build a Self-Improving Company with AI

> 把一場 YC 演講,變成一頁中英雙語、可互動、可分享的「公司自我進化」長頁。

本站整理自 **Y Combinator 合夥人 Tom Blomfield** 的演講《How to Build a Self-Improving Company with AI》:如何把公司的 know-how 萃取出來、讓 AI 讀得到,並把每個功能組成一組**遞迴、自我改進的 AI 迴圈** —— 連你睡覺的時候,公司都在變好。內容以英文逐字稿 + 繁體中文編輯稿對照整理,並補上原始影片與相關延伸來源(Diana Hu、Jack Dorsey、Pete Sena)。

---

## 🔗 線上版 / Live

| | |
|---|---|
| 🌐 網站 | <https://self-improving-company-with-ai.peteraim.com/> |

> 直接點進去就能用,無需安裝。可用 `https://self-improving-company-with-ai.peteraim.com/#<slug>` 深連結到特定卡片(例如 `#sensor-layer`、`#role-dri`)。

---

## ✨ 功能特色

- 🌏 **全頁雙語切換** — 中文 / English 一鍵切換,整頁(含標題、卡片、詳情、章節、頁面 chrome)同步換語言,無殘留
- 🌗 **深色 / 淺色模式** — 暖紙(editorial)淺色 ↔ 深咖啡深色,手動切換並以 localStorage 記憶
- 🧭 **區段導覽 + scrollspy** — 頂部 sticky 導覽列,捲動時自動高亮目前所在區段
- 🔢 **數字 count-up** — Hero 關鍵數據捲到視窗時動畫累加
- 🪟 **卡片詳情 modal** — 點五層架構 / 應用場景 / 三種角色的卡片,展開完整說明
- 🔗 **深連結** — 每張卡片都有專屬 `#<slug>`,可直接分享、回放
- 🎞️ **進場動畫** — 區塊捲入時淡入上浮(尊重 `prefers-reduced-motion`)
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
│   ├── styles.css    # Editorial Luxury 視覺(暖紙/深咖啡雙主題 + 動態)
│   └── app.js        # 區段渲染註冊表、雙語切換、scrollspy、modal、深連結
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

### (選配)跑 UX 驗證

```bash
uv run --with playwright playwright install chromium       # 首次:下載瀏覽器
uv run --with playwright python <skill>/scripts/verify.py --dir .
```

---

## 📝 聲明 / License

- 本站為非官方整理,內容著作權歸原始來源(Y Combinator / Tom Blomfield 等)所有。
- 程式碼以 **MIT** 授權釋出。
- 如為權利人且希望調整或移除內容,請開 issue 聯絡。
