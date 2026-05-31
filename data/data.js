/* =========================================================================
   用 AI 打造一間會自己進化的公司  ·  composite · data.js
   How to Build a Self-Improving Company with AI

   Source: a Y Combinator talk by Tom Blomfield (General Partner, YC),
   distilled from the English transcript + a Traditional-Chinese editorial
   rewrite. Every human-facing string is a bilingual {en, zh} object so the
   single language toggle repaints the whole page with nothing left behind.

   Section types consumed by app.js's RENDERERS registry:
     hero | prose | cards | timeline | accordion | quotes | sources | cta
   ========================================================================= */

window.SITE_META = {
  title:    { en: "How to Build a Self-Improving Company with AI",
              zh: "用 AI 打造一間會自己進化的公司" },
  subtitle: { en: "A YC talk by Tom Blomfield on turning a company into recursive, self-improving AI loops.",
              zh: "YC 合夥人 Tom Blomfield 談如何把公司變成一組遞迴、自我改進的 AI 迴圈。" }
};

window.SITE_SECTIONS = [

  /* ---------------------------------------------------------------- HERO */
  {
    type: "hero",
    id: "overview",
    eyebrow: { en: "Y Combinator · AI Startup School",
               zh: "Y Combinator · AI 創業學校" },
    title:    { en: "A company that improves while you sleep",
                zh: "一間在你睡覺時也在進化的公司" },
    subtitle: { en: "Extract your company's know-how, make it legible to AI, and wire up loops that get better on their own — even overnight.",
                zh: "把公司的 know-how 萃取出來、讓 AI 讀得到,然後建立能自我改進的迴圈 —— 連半夜都在變好。" },
    lead: { en: "“If it was recorded, it happened — to the AI. If it was not recorded, it did not happen.”",
            zh: "「如果有被記錄下來,對 AI 來說它就存在;如果沒有被記錄,對 AI 來說它就不存在。」" },
    meta: { en: "Tom Blomfield · General Partner, Y Combinator",
            zh: "Tom Blomfield · Y Combinator 合夥人" },
    stats: [
      { label: { en: "Revenue / employee vs 18 months ago", zh: "每員工營收(對比 18 個月前)" }, value: 5, suffix: "×" },
      { label: { en: "Hours of office hours recorded", zh: "已錄製的 office hours 時數" }, value: 2000, suffix: "+" },
      { label: { en: "Pages in the regenerated manual", zh: "重生 user manual 的頁數" }, value: 150 },
      { label: { en: "Layers in the AI loop", zh: "AI 迴圈的層數" }, value: 5 }
    ]
  },

  /* --------------------------------------------------------------- PROSE: thesis */
  {
    type: "prose",
    id: "thesis",
    title:    { en: "Companies are still built like Roman legions",
                zh: "今天的公司,還是照羅馬軍團在組織" },
    subtitle: { en: "And AI breaks the assumption that hierarchy is how value gets made.",
                zh: "而 AI 從根本上打破了「層級組織才能創造價值」這個假設。" },
    blocks: [
      { type: "p",
        text: { en: "The Roman legion was designed to project power across two continents — from Rome all the way to Hadrian's Wall in Scotland — through nested hierarchies with fixed spans of control, where named individuals passed orders down and sent information back up. Most companies today are organised exactly the same way: human beings are the conduit for information flowing up and down.",
                zh: "羅馬軍團的設計,是要把權力從羅馬城投射到橫跨兩大陸的疆域 —— 一路到蘇格蘭的哈德良長城。它靠的是巢狀層級、固定的管理幅度,由指定的個人把命令往下傳、把資訊往上送。今天大部分公司的組織方式跟它沒兩樣:人類就是資訊上下流動的管道。" } },
      { type: "h3",
        text: { en: "Copilots are the wrong mental model",
                zh: "Copilot 是錯的思考框架" } },
      { type: "p",
        text: { en: "A year ago, people described AI as productivity: copilots that make an engineer 20% faster, tools bolted onto existing workflows to ship a bit more software. But that just straps a more powerful engine onto the old way of working. The bigger move is to reimagine what a company even is.",
                zh: "一年前,大家談 AI 都在講生產力:copilot 讓工程師快 20%、把工具嵌進既有流程、多交付一點軟體。但那只是拿舊的工作方式換上一顆更強的引擎。真正能做的事大得多 —— 是重新想像一間公司可以是什麼。" } },
      { type: "h3",
        text: { en: "Extract the domain knowledge",
                zh: "把 domain knowledge 萃取出來" } },
      { type: "p",
        text: { en: "Every company has know-how scattered across people's heads, Slack threads, emails and Notion docs — together they define how the company works. Make that knowledge legible to AI and you can shift from a hierarchical org to an intelligent, AI-native one: a set of recursive, self-improving AI loops that keep improving even while you sleep.",
                zh: "每間公司都有散落各處的 know-how:在人的腦袋裡、在 Slack、在 email、在 Notion 文件裡 —— 它們加起來定義了這間公司怎麼運作。一旦讓這些知識對 AI「可讀」,你就能從層級式組織轉成由 AI 驅動的智慧型組織:一組遞迴、自我改進的 AI 迴圈,在你睡覺時也持續變好。" } }
    ]
  },

  /* --------------------------------------------------------------- CARDS: architecture */
  {
    type: "cards",
    id: "architecture",
    title:    { en: "The five layers of an AI loop",
                zh: "AI 迴圈的五層架構" },
    subtitle: { en: "Run every step with minimal human intervention and the system gets better on its own. Tap a layer for detail.",
                zh: "讓這五步在最少人為介入下跑完,系統就會自己越跑越好。點一層看細節。" },
    items: [
      { slug: "sensor-layer",
        title:   { en: "1 · Sensor layer", zh: "第一層 · 感測層" },
        summary: { en: "Channels that bring signal in from the real world.",
                   zh: "把外界訊號接進來的管道。" },
        tags: ["input", "signal"],
        overview:{ en: "It sounds technical, but it is just the pipes that bring signal in from the outside world: customer emails, support tickets, code changes, subscription cancellations, product telemetry — real-world data the loop can react to.",
                   zh: "聽起來很技術,其實就是把外界訊號接進來的管道:客戶 email、support tickets、程式碼變更、用戶取消訂閱、產品使用數據 —— 就是從真實世界蒐集到、迴圈能據以反應的訊號。" } },
      { slug: "policy-layer",
        title:   { en: "2 · Policy layer", zh: "第二層 · 政策／決策層" },
        summary: { en: "Rules for what AI may do, what needs a human, what must be logged.",
                   zh: "定義 AI 能做什麼、什麼要問人、什麼必須留紀錄。" },
        tags: ["rules", "decision"],
        overview:{ en: "The decision layer defines the rules of engagement: what the AI is allowed to do on its own, what it must ask a human's permission for, and what it is required to log.",
                   zh: "決策層定義交戰規則:AI 可以自己做什麼、什麼事情必須問人取得許可、什麼事情一定要留下紀錄。" } },
      { slug: "tool-layer",
        title:   { en: "3 · Tool layer", zh: "第三層 · 工具層" },
        summary: { en: "Deterministic APIs the AI can call — query a DB, read a calendar.",
                   zh: "AI 可呼叫的確定性 API —— 查資料庫、看行事曆。" },
        tags: ["skills", "code"],
        overview:{ en: "This is Garry's “skills and code”: largely deterministic APIs — query my database, look at my calendar — a toolbox the agent can reliably call.",
                   zh: "這就是 Garry 講的 skills 和 code:大致上是確定性的 API —— 查我的資料庫、看我的行事曆 —— 一組 agent 可以可靠呼叫的工具箱。" } },
      { slug: "quality-gate",
        title:   { en: "4 · Quality gate", zh: "第四層 · 品質關卡" },
        summary: { en: "Evals, safety filters, human review for high-risk actions.",
                   zh: "自動 eval、安全過濾器、高風險操作的人工審核。" },
        tags: ["eval", "safety"],
        overview:{ en: "Automated eval checks, safety filters, and human review for high-risk operations — the bar an action has to clear before it ships.",
                   zh: "自動化的 eval 檢查、安全過濾器,以及高風險操作所需的人工審核 —— 一個動作要送出前必須先通過的門檻。" } },
      { slug: "learning-mechanism",
        title:   { en: "5 · Learning mechanism", zh: "第五層 · 學習機制" },
        summary: { en: "Catch what didn't work in the real world and loop back to the top.",
                   zh: "抓出真實世界裡行不通的地方,回饋到最上層重來。" },
        tags: ["feedback", "loop"],
        overview:{ en: "The system interacts with the real world, notices where it fell short, and feeds that back into the top of the loop. Close every step with minimal human touch and it improves continuously — while you sleep.",
                   zh: "系統跟真實世界互動,發現哪裡有問題,把它回饋到迴圈最上層重新開始。讓每一步都在最少人為介入下閉環,它就會持續自我改進 —— 在你睡覺的時候也一樣。" } }
    ]
  },

  /* --------------------------------------------------------------- TIMELINE: case study */
  {
    type: "timeline",
    id: "case-study",
    title:    { en: "The “holy shit” moment at YC",
                zh: "YC 的「holy shit」時刻" },
    subtitle: { en: "A live, in-production example of a loop that learned to fix itself overnight.",
                zh: "一個正在線上跑、學會在半夜自我修復的真實迴圈。" },
    events: [
      { date: { en: "Step 1", zh: "第一步" },
        title:{ en: "A deterministic query agent", zh: "確定性查詢 agent" },
        body: { en: "It started simple: an agent with deterministic tools to query our database — “when did I last have office hours with this company?”",
                zh: "一開始很單純:一個有確定性工具、能查我們資料庫的 agent —— 「我上次跟這家公司做 office hours 是什麼時候?」" } },
      { date: { en: "Step 2", zh: "第二步" },
        title:{ en: "It got smarter — but still a sidekick", zh: "它變聰明了 —— 但還是 sidekick" },
        body: { en: "Using RAG and richer queries, it could surface five relevant founders to introduce — say, anyone in petrochemicals. Useful, but this was last year's model: a sidekick making me 20–30% more effective.",
                zh: "靠 RAG 和更豐富的查詢,它能找出五個相關的創辦人推薦見面 —— 例如石化產業的人。很有用,但這還是去年的模式:一個讓我效率提升 20–30% 的 sidekick。" } },
      { date: { en: "Step 3", zh: "第三步" },
        title:{ en: "We put a monitoring agent on top", zh: "我們在上面加了監控 agent" },
        body: { en: "It watched every query every YC employee ran — which worked, which failed — and asked why the failures failed. Different tools? An updated skills file? A new database view or index?",
                zh: "它盯著每一位 YC 員工跑的每一次查詢 —— 哪些成功、哪些失敗 —— 並追問失敗的原因。需要不同的工具?要更新 skills file?還是需要一個新的 database view 或 index?" } },
      { date: { en: "Step 4", zh: "第四步" },
        title:{ en: "It shipped the fix overnight", zh: "它在半夜把修正送上線" },
        body: { en: "Overnight it wrote the code, opened a merge request to the YC codebase, had another agent review it, merged, and deployed.",
                zh: "半夜裡,它自己寫程式碼、送一個 merge request 到 YC 的 codebase、讓另一個 agent 做 code review、合併,然後部署。" } },
      { date: { en: "Step 5", zh: "第五步" },
        title:{ en: "Next morning, the query just worked", zh: "隔天早上,那個查詢就成功了" },
        body: { en: "A human asked the same question the next day and it succeeded. That was the holy-shit moment — not AI making you 20% faster, but AI running the whole loop to figure out how to improve itself.",
                zh: "隔天一個人類來問同樣的查詢,這次就成功了。那就是「holy shit」的時刻 —— 不是 AI 讓你快 20%,而是 AI 自己跑完整個迴圈,找出怎麼自我改進。" } }
    ]
  },

  /* --------------------------------------------------------------- CARDS: more loops */
  {
    type: "cards",
    id: "loops",
    title:    { en: "The same logic, everywhere",
                zh: "同一套邏輯,可以套到任何地方" },
    subtitle: { en: "Find the parts of your company that can run as loops, put humans in a supervisory seat, and just keep feeding it tokens.",
                zh: "辨識出公司裡可以用迴圈運作的部分,讓人類退到監督位置,然後持續投入 token。" },
    items: [
      { slug: "product-loop",
        title:   { en: "A self-optimising product loop", zh: "自我優化的產品迴圈" },
        summary: { en: "Find funnel friction, A/B test it, ship the winner — repeat.",
                   zh: "找出漏斗摩擦、跑 A/B test、部署最佳版本 —— 然後重複。" },
        tags: ["product", "analytics"],
        overview:{ en: "Point an agent at your product analytics to find the highest-friction step in the funnel, research best practices, design an A/B test, run it for a week, deploy the winner, then do it all again. Your product gets a loop that optimises itself.",
                   zh: "讓 agent 去跑你的產品數據,找出漏斗裡摩擦力最大的環節,研究業界最佳實踐,設計一個 A/B test,跑一個禮拜,部署最好的版本,然後再重複一次。你的產品就有了一個自我優化的迴圈。" } },
      { slug: "support-loop",
        title:   { en: "Customer-suggestion triage", zh: "客戶建議的判斷迴圈" },
        summary: { en: "An agent acting as CPO + CTO decides what to build and ships it overnight.",
                   zh: "一個扮演產品長 + 技術長的 agent 做判斷,半夜直接交付。" },
        tags: ["support", "roadmap"],
        overview:{ en: "Suggestions stream in; an agent playing chief product officer and chief technology officer makes the call. Off-roadmap? Discard it. On-roadmap? Write the code overnight, deploy, and ship it to the customer — no human in the loop.",
                   zh: "客戶建議不斷進來;一個扮演產品長加技術長的 agent 做判斷。不符合方向?丟掉。跟 roadmap 一致?半夜寫程式、部署、交付給客戶 —— 完全不需要人類參與。" } },
      { slug: "every-function",
        title:   { en: "Every function as a loop", zh: "把每個功能都當成迴圈" },
        summary: { en: "Reframe each part of the company as a recursive, self-improving loop.",
                   zh: "把公司的每個功能都想成一個遞迴、自我改進的迴圈。" },
        tags: ["org design"],
        overview:{ en: "Once you think of each function as a recursive, self-improving AI loop, the company looks nothing like a hierarchically organised Roman legion. You're no longer constrained by headcount — you're constrained by how many tokens you're willing to spend.",
                   zh: "一旦你能把每個功能都想成一個遞迴、自我改進的 AI 迴圈,公司就會跟層級式的羅馬軍團完全不一樣。你不再受限於人數,而是受限於你願意投入多少 token。" } }
    ]
  },

  /* --------------------------------------------------------------- ACCORDION: shifts */
  {
    type: "accordion",
    id: "shifts",
    title:    { en: "Two shifts this forces", zh: "這會逼出兩個觀念轉變" },
    subtitle: { en: "What changes once you take loops seriously.",
                zh: "當你認真看待迴圈之後,有什麼會變。" },
    qa: [
      { q: { en: "Burn tokens, not headcount", zh: "燒 token,不要燒人頭" },
        a: { en: "Companies are reaching Demo Day with ~5× the revenue per employee they had 18 months ago, and it will keep going through Series A and B. Soon you'll be constrained by token usage, not headcount. The blunt proxy today is everyone's token usage — gameable the moment it becomes a leaderboard for promotions, but directionally it tells you who is “token-maxing” and who isn't.",
             zh: "公司現在抵達 Demo Day 時,每員工營收是 18 個月前的約 5 倍,而且會一路延續到 Series A、B。很快你會受限於 token 用量,而不是人數。現階段最粗略的衡量就是看每個人的 token 用量 —— 一旦變成決定升遷的排行榜就會被刷,但大方向上它能告訴你誰在 token-maxing、誰沒有。" } },
      { q: { en: "Middle management is over", zh: "中間管理層已經結束" },
        a: { en: "Middle management existed to solve a coordination problem — and AI can do that now. Everyone becomes an IC (a builder or an operator), and crucially, every effort has a single Directly Responsible Individual: a named human, not a committee.",
             zh: "中間管理層存在,是為了解決協調問題 —— 而 AI 現在可以做這件事。每個人都變成 IC(builder 或 operator),而關鍵是:每件事都有一個直接負責的個人(DRI)—— 一個有名有姓的人,不是委員會。" } }
    ]
  },

  /* --------------------------------------------------------------- CARDS: three roles */
  {
    type: "cards",
    id: "roles",
    title:    { en: "Three roles, no permanent managers",
                zh: "三種角色,不需要常設的管理層" },
    subtitle: { en: "Jack Dorsey's framing: the world model handles alignment, so people sit closer to the work and the customer.",
                zh: "Jack Dorsey 的框架:對齊交給 world model,人因此能更貼近工作與客戶。" },
    items: [
      { slug: "role-ic",
        title:   { en: "Individual Contributor (IC)", zh: "個人貢獻者(IC)" },
        summary: { en: "Deep specialists who build and operate a specific layer.",
                   zh: "深耕系統某一層的深度專家,負責建構與營運。" },
        tags: ["builder", "operator"],
        overview:{ en: "ICs build and operate the models, intelligence layer and interfaces — deep experts in one layer of the system. The world model supplies the context a manager used to provide, so an IC can make decisions at their layer without waiting to be told what to do.",
                   zh: "IC 建構並營運模型、智慧層與介面 —— 是系統特定一層的深度專家。World model 提供了過去由管理者提供的脈絡,所以 IC 可以在自己的層級做決策,不必等別人告訴他該做什麼。" } },
      { slug: "role-dri",
        title:   { en: "Directly Responsible Individual (DRI)", zh: "直接責任人(DRI)" },
        summary: { en: "Owns a cross-layer problem and the customer outcome.",
                   zh: "擁有一個跨層的問題與客戶成果。" },
        tags: ["ownership", "outcome"],
        overview:{ en: "A DRI owns a specific cross-layer problem or opportunity and the customer outcome — e.g. merchant churn in a segment over the next 90 days — with full authority to pull resources from the world-model, lending and interface teams. They may stay on a problem or move on to the next.",
                   zh: "DRI 擁有一個特定的跨層問題或機會,以及客戶成果 —— 例如未來 90 天某個細分市場的商家流失 —— 並有完整授權,可以從 world model、借貸與介面團隊調動資源。他可能持續深耕某些問題,也可能移往別處解新問題。" } },
      { slug: "role-player-coach",
        title:   { en: "Player-coach", zh: "球員教練" },
        summary: { en: "Builds and grows people at once — replaces the info-routing manager.",
                   zh: "一邊建構、一邊培養人 —— 取代了負責資訊路由的管理者。" },
        tags: ["craft", "people"],
        overview:{ en: "Player-coaches combine building with developing talent, replacing the manager whose main job was routing information. They still write code, build models or design interfaces while investing in the people around them — not stuck in status, alignment and prioritisation meetings.",
                   zh: "球員教練把建構工作與人才培養結合在一起,取代了那個主要工作是資訊路由的管理者。他們仍然寫程式、建模型或設計介面,同時投資周圍的人成長 —— 不會整天耗在進度會議、對齊會議和優先順序談判裡。" } }
    ]
  },

  /* --------------------------------------------------------------- PROSE: make it legible */
  {
    type: "prose",
    id: "legible",
    title:    { en: "Where to start: make the org legible to AI",
                zh: "從哪裡開始:讓組織對 AI 可讀" },
    subtitle: { en: "Record everything, distil it, and treat software as disposable — but data as sacred.",
                zh: "記錄一切、精煉它,把軟體當成可拋棄的 —— 但把資料當成神聖的。" },
    blocks: [
      { type: "p",
        text: { en: "First, record everything. Every partner email now lands in the YC database; every Slack message, every DM, and every office hour from the last few months is recorded. The principle is simple: if it was recorded, it happened — to the AI. If it wasn't, it didn't.",
                zh: "第一,記錄一切。現在每一封 partner 的 email 都進 YC 資料庫;每一則 Slack 訊息、每一則 DM、過去幾個月的每一場 office hours 都有錄音。原則很簡單:如果有被記錄,對 AI 來說它就存在;如果沒有,它就不存在。" } },
      { type: "h3",
        text: { en: "Distil it down (diarisation)", zh: "把它精煉下來(diarization)" } },
      { type: "p",
        text: { en: "You can't pump 100,000 hours of recordings into a context window, so you distil: aggregate, synthesise into the important parts, and leave the AI breadcrumbs back to the raw source.",
                zh: "你不可能把 10 萬小時的錄音塞進 context window,所以要精煉:聚合、合成出重要的部分,再給 AI 線索讓它可以回溯原始資料。" } },
      { type: "h3",
        text: { en: "Regenerating the user manual", zh: "重新生成 user manual" } },
      { type: "p",
        text: { en: "YC's user manual was written 5–10 years ago and is partly out of date. Over one weekend, Haj used ~2,000 hours of recent office hours to regenerate it: a 150-page manual, dramatically better, now updatable every month. Every new piece of advice is compared with the manual and either folded in or discarded — a living brain of what 16 partners actually tell founders.",
                zh: "YC 的 user manual 是五到十年前寫的,有些已經過時。某個週末,Haj 用近 2,000 小時的 office hours 把它重新生成:一份 150 頁、品質好很多的 manual,而且現在每個月都能更新。每一條新建議都會跟 manual 比對,決定納入或捨棄 —— 它變成一個活的大腦,反映 16 位 partner 實際給創辦人的建議。" } },
      { type: "h3",
        text: { en: "Software is ephemeral, data is sacred", zh: "軟體是暫時的,資料是神聖的" } },
      { type: "ul",
        items: {
          en: ["If something produces a self-improving artifact, keep it; if not, throw it away.",
               "Every function can now one-shot its own dashboards and internal tools — treat that software as disposable.",
               "Store the data preciously (Garry keeps every email as markdown); regenerate the software when the models get smarter."],
          zh: ["如果一個東西能產出可自我改進的 artifact,就留著;如果不能,就丟掉。",
               "現在每個功能都能一次生成自己的 dashboard 與內部工具 —— 把那些軟體當成可拋棄的。",
               "資料要非常珍惜地保存(Garry 把每封 email 都存成 markdown);等模型更強了,再用原本的指令重新生成軟體。"]
        } }
    ]
  },

  /* --------------------------------------------------------------- QUOTES: humans */
  {
    type: "quotes",
    id: "humans",
    title:    { en: "So what are humans for?", zh: "那,人類是做什麼的?" },
    subtitle: { en: "Humans live around the edge of the company brain, where intelligence meets reality.",
                zh: "人類活在「公司大腦」的外圍,在智能與現實接觸的地方。" },
    quotes: [
      { text: { en: "All your data, emails, DMs, skills and know-how — that is the company brain. Humans sit around the edge, interfacing with the real world.",
                zh: "你所有的資料、email、DM、skills 與 know-how —— 那就是公司的大腦。人類坐在它的外圍,負責跟真實世界的介面。" },
        by: "Tom Blomfield" },
      { text: { en: "Humans reach into the places the models can't go yet: novel situations, ethical calls, high-stakes moments — like a founder thinking about breaking up with their co-founder.",
                zh: "人類伸進模型還到不了的角落:全新的情境、倫理的判斷、高風險的時刻 —— 像是一個創辦人正在考慮跟共同創辦人拆夥的那種時刻。" },
        by: "Tom Blomfield" },
      { text: { en: "Sales conversations need a real person in the room for the next twenty years.",
                zh: "接下來二十年,銷售對話都需要一個真實的人在房間裡。" },
        by: "Tom Blomfield" }
    ]
  },

  /* --------------------------------------------------------------- TIMELINE: chapters */
  {
    type: "timeline",
    id: "chapters",
    title:    { en: "Chapters", zh: "影片章節" },
    subtitle: { en: "How the talk unfolds, start to finish.",
                zh: "這場演講從頭到尾的脈絡。" },
    events: [
      { date: "00:00", title: { en: "Companies Are Roman Legions", zh: "公司就是羅馬軍團" },
        body: { en: "Why most orgs still route information up and down a hierarchy.", zh: "為什麼大多數組織還在沿著層級上下傳遞資訊。" } },
      { date: "00:54", title: { en: "Copilots Are the Wrong Mental Model", zh: "Copilot 是錯的思考框架" },
        body: { en: "Productivity gains are just a stronger engine on the old way of working.", zh: "生產力提升只是替舊工作方式換上更強的引擎。" } },
      { date: "01:55", title: { en: "Extract the Domain Knowledge", zh: "萃取 domain knowledge" },
        body: { en: "Make the know-how in heads, Slack and email legible to AI.", zh: "把藏在腦袋、Slack 與 email 裡的 know-how 變得對 AI 可讀。" } },
      { date: "02:24", title: { en: "The Recursive Self-Improving Loop", zh: "遞迴自我改進的迴圈" },
        body: { en: "Sensor → policy → tool → quality gate → learning.", zh: "感測 → 政策 → 工具 → 品質關卡 → 學習。" } },
      { date: "04:12", title: { en: "The Holy Shit Moment at YC", zh: "YC 的 holy shit 時刻" },
        body: { en: "A monitoring agent that fixes failed queries overnight.", zh: "一個監控 agent 在半夜修好失敗的查詢。" } },
      { date: "05:50", title: { en: "Self-Optimizing Product and Support Loops", zh: "自我優化的產品與客服迴圈" },
        body: { en: "A/B tests and customer triage that run themselves.", zh: "會自己跑的 A/B test 與客戶建議分流。" } },
      { date: "06:29", title: { en: "Burn Tokens, Not Headcount", zh: "燒 token,不燒人頭" },
        body: { en: "Revenue per employee is up ~5×; the constraint is tokens.", zh: "每員工營收成長約 5 倍;瓶頸是 token。" } },
      { date: "07:23", title: { en: "Middle Management Is Over", zh: "中間管理層已結束" },
        body: { en: "Everyone is an IC; every effort has a DRI.", zh: "每個人都是 IC;每件事都有一個 DRI。" } },
      { date: "08:05", title: { en: "Make Everything Legible to AI", zh: "讓一切對 AI 可讀" },
        body: { en: "Record everything — emails, Slack, DMs, office hours.", zh: "記錄一切 —— email、Slack、DM、office hours。" } },
      { date: "09:40", title: { en: "Regenerating the YC User Manual", zh: "重新生成 YC user manual" },
        body: { en: "2,000 hours of office hours → a 150-page living manual.", zh: "2,000 小時的 office hours → 一份 150 頁、會自我更新的 manual。" } },
      { date: "11:19", title: { en: "Software Is Ephemeral, Context Is Valuable", zh: "軟體是暫時的,context 才有價值" },
        body: { en: "Cherish the data; regenerate the software as models improve.", zh: "珍惜資料;等模型變強就重新生成軟體。" } },
      { date: "12:18", title: { en: "Where Humans Still Matter", zh: "人類仍然重要的地方" },
        body: { en: "Novel, ethical, high-stakes moments — and sales.", zh: "全新、倫理、高風險的時刻 —— 以及銷售。" } }
    ]
  },

  /* --------------------------------------------------------------- SOURCES */
  {
    type: "sources",
    id: "sources",
    title:    { en: "Sources & corroboration", zh: "延伸來源與佐證" },
    subtitle: { en: "The original talk and the references behind it.",
                zh: "這場演講的原始出處,以及它引用的來源。" },
    note: { en: "This page is an unofficial, fan-made summary for study. For anything load-bearing, go to the original sources below.",
            zh: "本頁為非官方的整理,僅供學習參考。任何重要判斷,請以下方原始來源為準。" },
    links: [
      { title: { en: "How to Build a Self-Improving Company with AI — the talk",
                 zh: "How to Build a Self-Improving Company with AI(演講影片)" },
        by: { en: "Y Combinator · YouTube", zh: "Y Combinator · YouTube" },
        kind: { en: "Video", zh: "影片" },
        url: "https://www.youtube.com/watch?v=X_JsIHUfUjc" },
      { title: { en: "“Recursively self-improving companies” — Tom's own breakdown",
                 zh: "「遞迴自我改進的公司」—— Tom 本人的拆解" },
        by: { en: "Tom Blomfield · X", zh: "Tom Blomfield · X" },
        kind: { en: "Post", zh: "貼文" },
        url: "https://x.com/t_blom/status/2056909934156280088" },
      { title: { en: "The Playbook for Building an AI-Native Company",
                 zh: "打造 AI 原生公司的 playbook" },
        by: { en: "Diana Hu · YC Startup Library", zh: "Diana Hu · YC Startup Library" },
        kind: { en: "Reference", zh: "延伸" },
        url: "https://www.ycombinator.com/library/OX-the-playbook-for-building-an-ai-native-company" },
      { title: { en: "From Hierarchy to Intelligence — the IC / DRI / player-coach roles",
                 zh: "From Hierarchy to Intelligence —— IC／DRI／球員教練的出處" },
        by: { en: "Jack Dorsey · Block", zh: "Jack Dorsey · Block" },
        kind: { en: "Reference", zh: "延伸" },
        url: "https://block.xyz/inside/from-hierarchy-to-intelligence" },
      { title: { en: "Your Company Is an Intelligence — You Just Haven't Built It That Way Yet",
                 zh: "你的公司就是一個智能體,你只是還沒這樣建它" },
        by: { en: "Pete Sena", zh: "Pete Sena" },
        kind: { en: "Essay", zh: "文章" },
        url: "https://petesena.substack.com/p/your-company-is-an-intelligence-you" },
      { title: { en: "Tom Blomfield — writing & talks",
                 zh: "Tom Blomfield —— 文章與演講" },
        by: { en: "tomblomfield.com", zh: "tomblomfield.com" },
        kind: { en: "Profile", zh: "個人站" },
        url: "https://tomblomfield.com/" }
    ]
  },

  /* --------------------------------------------------------------- CTA */
  {
    type: "cta",
    id: "closing",
    title: { en: "Would you build it this way today?", zh: "你今天會把公司建成這樣嗎?" },
    text:  { en: "Most companies are still small enough to build in this shape from day one — a recursive, self-improving intelligence with humans around the edge. There's no excuse not to.",
             zh: "大部分公司都還夠小,可以從第一天就建成這個樣子 —— 一個遞迴、自我改進的智能體,人類在外圍。沒有藉口不做。" },
    link:  { label: { en: "Watch the full talk", zh: "看完整演講" },
             url: "https://www.youtube.com/watch?v=X_JsIHUfUjc" }
  }
];
