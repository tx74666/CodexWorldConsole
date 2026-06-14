const cities = [
  { id: "shanghai", name: "Shanghai", zhName: "ä¸Šæµ·", country: "China", zhCountry: "ä¸­åœ‹", lat: 31.2304, lon: 121.4737, zone: "Asia/Shanghai" },
  { id: "tokyo", name: "Tokyo", zhName: "æ±äº¬", country: "Japan", zhCountry: "æ—¥æœ¬", lat: 35.6762, lon: 139.6503, zone: "Asia/Tokyo" },
  { id: "singapore", name: "Singapore", zhName: "æ–°åŠ å¡", country: "Singapore", zhCountry: "æ–°åŠ å¡", lat: 1.3521, lon: 103.8198, zone: "Asia/Singapore" },
  { id: "dubai", name: "Dubai", zhName: "æœæ‹œ", country: "UAE", zhCountry: "é˜¿è¯é…‹", lat: 25.2048, lon: 55.2708, zone: "Asia/Dubai" },
  { id: "london", name: "London", zhName: "å€«æ•¦", country: "UK", zhCountry: "è‹±åœ‹", lat: 51.5072, lon: -0.1276, zone: "Europe/London" },
  { id: "newyork", name: "New York", zhName: "ç´ç´„", country: "USA", zhCountry: "ç¾Žåœ‹", lat: 40.7128, lon: -74.0060, zone: "America/New_York" },
  { id: "saopaulo", name: "Sao Paulo", zhName: "è–ä¿ç¾…", country: "Brazil", zhCountry: "å·´è¥¿", lat: -23.5558, lon: -46.6396, zone: "America/Sao_Paulo" },
  { id: "sydney", name: "Sydney", zhName: "æ‚‰å°¼", country: "Australia", zhCountry: "æ¾³å¤§åˆ©äºž", lat: -33.8688, lon: 151.2093, zone: "Australia/Sydney" }
];

const fallbackWeather = {
  shanghai: { temperature: 24, humidity: 71, wind: 12, code: 2 },
  tokyo: { temperature: 21, humidity: 63, wind: 9, code: 1 },
  singapore: { temperature: 29, humidity: 78, wind: 10, code: 80 },
  dubai: { temperature: 34, humidity: 38, wind: 16, code: 0 },
  london: { temperature: 13, humidity: 68, wind: 14, code: 3 },
  newyork: { temperature: 18, humidity: 54, wind: 11, code: 2 },
  saopaulo: { temperature: 22, humidity: 66, wind: 8, code: 1 },
  sydney: { temperature: 17, humidity: 59, wind: 18, code: 61 }
};

const cityPhotoRangeOptions = [5, 30, 60];
const cityPhotoMemoryStorageKey = "worldConsole.cityPhotoMemory.v1";
const cityPhotoSubjects = {
  shanghai: [
    { label: "Shanghai skyline", page: "Shanghai" },
    { label: "The Bund", page: "The_Bund" },
    { label: "Pudong", page: "Pudong" },
    { label: "Shanghai Tower", page: "Shanghai_Tower" }
  ],
  tokyo: [
    { label: "Tokyo", page: "Tokyo" },
    { label: "Shibuya", page: "Shibuya" },
    { label: "Shinjuku", page: "Shinjuku" },
    { label: "Tokyo Tower", page: "Tokyo_Tower" }
  ],
  singapore: [
    { label: "Singapore", page: "Singapore" },
    { label: "Marina Bay", page: "Marina_Bay,_Singapore" },
    { label: "Gardens by the Bay", page: "Gardens_by_the_Bay" },
    { label: "Merlion", page: "Merlion" }
  ],
  dubai: [
    { label: "Dubai", page: "Dubai" },
    { label: "Dubai Marina", page: "Dubai_Marina" },
    { label: "Burj Khalifa", page: "Burj_Khalifa" },
    { label: "Palm Jumeirah", page: "Palm_Jumeirah" }
  ],
  london: [
    { label: "London", page: "London" },
    { label: "River Thames", page: "River_Thames" },
    { label: "Tower Bridge", page: "Tower_Bridge" },
    { label: "London Eye", page: "London_Eye" }
  ],
  newyork: [
    { label: "New York City", page: "New_York_City" },
    { label: "Manhattan", page: "Manhattan" },
    { label: "Times Square", page: "Times_Square" },
    { label: "Brooklyn Bridge", page: "Brooklyn_Bridge" }
  ],
  saopaulo: [
    { label: "Sao Paulo", page: "SÃ£o_Paulo" },
    { label: "Paulista Avenue", page: "Paulista_Avenue" },
    { label: "Ibirapuera Park", page: "Ibirapuera_Park" },
    { label: "SÃ£o Paulo Museum of Art", page: "SÃ£o_Paulo_Museum_of_Art" }
  ],
  sydney: [
    { label: "Sydney", page: "Sydney" },
    { label: "Sydney Harbour", page: "Port_Jackson" },
    { label: "Sydney Opera House", page: "Sydney_Opera_House" },
    { label: "Bondi Beach", page: "Bondi_Beach" }
  ]
};

const fallbackEvents = [
  {
    id: "local-trump-xi",
    title: "Trump-Xi Beijing summit puts Taiwan, trade and Iran in focus",
    statement: "Trump-Xi Beijing summit puts Taiwan, trade and Iran in focus",
    summary: "Recent reporting described the Beijing summit as high-stakes diplomacy with modest deliverables and pointed warnings over Taiwan.",
    source: "Local fallback",
    url: "https://apnews.com/article/75d703648da64e2caaace39e6415dc35",
    published: "2026-05-16T00:00:00Z",
    location: "Beijing",
    country: "China",
    lat: 39.9042,
    lon: 116.4074,
    category: "diplomacy",
    severity: 5
  },
  {
    id: "local-putin-china",
    title: "Putin visit to China follows Trump's Beijing trip",
    statement: "Putin visit to China follows Trump's Beijing trip",
    summary: "Russia-China diplomacy remains under watch as Moscow leans heavily on Beijing during continuing pressure over Ukraine.",
    source: "Local fallback",
    url: "https://apnews.com/article/75d703648da64e2caaace39e6415dc35",
    published: "2026-05-16T00:00:00Z",
    location: "Beijing",
    country: "China",
    lat: 39.9042,
    lon: 116.4074,
    category: "diplomacy",
    severity: 4
  }
];

const fallbackMarketAssets = [
  {
    id: "sp500",
    group: "indices",
    symbol: "^GSPC",
    name: "S&P 500",
    zhName: "æ ‡æ™®500",
    value: 5320,
    unit: "pts",
    change: 24,
    changePct: 0.45,
    history: [5070, 5108, 5088, 5142, 5168, 5150, 5212, 5240, 5226, 5288, 5320],
    summary: "The broad U.S. equity benchmark. It is the quickest read on global risk appetite.",
    zhSummary: "ç¾Žå›½å¤§ç›˜åŸºå‡†ï¼Œæœ€é€‚åˆå¿«é€Ÿåˆ¤æ–­å…¨çƒé£Žé™©åå¥½ã€‚"
  },
  {
    id: "nasdaq",
    group: "indices",
    symbol: "^IXIC",
    name: "Nasdaq Composite",
    zhName: "çº³æ–¯è¾¾å…‹ç»¼åˆæŒ‡æ•°",
    value: 16860,
    unit: "pts",
    change: 96,
    changePct: 0.57,
    history: [15920, 16080, 16010, 16240, 16360, 16290, 16480, 16620, 16570, 16750, 16860],
    summary: "Technology and AI-linked growth shares carry the strongest signal here.",
    zhSummary: "ç§‘æŠ€è‚¡å’Œ AI ç›¸å…³æˆé•¿è‚¡çš„åŠ¨å‘åœ¨è¿™é‡Œæœ€æ˜Žæ˜¾ã€‚"
  },
  {
    id: "hangseng",
    group: "indices",
    symbol: "^HSI",
    name: "Hang Seng",
    zhName: "æ’ç”ŸæŒ‡æ•°",
    value: 19680,
    unit: "pts",
    change: -82,
    changePct: -0.41,
    history: [18760, 19020, 19210, 19140, 19480, 19820, 19740, 19920, 19870, 19760, 19680],
    summary: "Hong Kong is a useful pressure gauge for China-linked global capital.",
    zhSummary: "é¦™æ¸¯å¸‚åœºé€‚åˆè§‚å¯Ÿä¸­å›½ç›¸å…³èµ„é‡‘çš„æ¸©åº¦ã€‚"
  },
  {
    id: "usd_cny",
    group: "fx",
    symbol: "CNY=X",
    name: "USD/CNY",
    zhName: "ç¾Žå…ƒ/äººæ°‘å¸",
    value: 7.22,
    unit: "",
    decimals: 4,
    change: 0.01,
    changePct: 0.14,
    history: [7.18, 7.19, 7.20, 7.19, 7.21, 7.22, 7.21, 7.23, 7.22, 7.21, 7.22],
    summary: "A direct read on dollar strength against the renminbi.",
    zhSummary: "ç›´æŽ¥è§‚å¯Ÿç¾Žå…ƒå…‘äººæ°‘å¸å¼ºå¼±ã€‚"
  },
  {
    id: "eur_usd",
    group: "fx",
    symbol: "EURUSD=X",
    name: "EUR/USD",
    zhName: "æ¬§å…ƒ/ç¾Žå…ƒ",
    value: 1.087,
    unit: "",
    decimals: 4,
    change: -0.002,
    changePct: -0.18,
    history: [1.102, 1.098, 1.095, 1.092, 1.094, 1.090, 1.088, 1.091, 1.089, 1.086, 1.087],
    summary: "The main dollar pair, useful for seeing whether the dollar move is broad.",
    zhSummary: "æœ€ä¸»è¦çš„ç¾Žå…ƒè´§å¸å¯¹ï¼Œç”¨æ¥åˆ¤æ–­ç¾Žå…ƒå¼ºå¼±æ˜¯ä¸æ˜¯å…¨é¢å‘ç”Ÿã€‚"
  },
  {
    id: "gold",
    group: "commodities",
    symbol: "GC=F",
    name: "Gold",
    zhName: "é»„é‡‘",
    value: 2395,
    unit: "USD/oz",
    change: 18,
    changePct: 0.76,
    history: [2290, 2312, 2304, 2340, 2358, 2336, 2368, 2380, 2374, 2388, 2395],
    summary: "Gold often moves with real-rate expectations and safe-haven demand.",
    zhSummary: "é»„é‡‘é€šå¸¸åæ˜ å®žé™…åˆ©çŽ‡é¢„æœŸå’Œé¿é™©éœ€æ±‚ã€‚"
  },
  {
    id: "oil",
    group: "commodities",
    symbol: "CL=F",
    name: "WTI Crude",
    zhName: "WTI åŽŸæ²¹",
    value: 78.4,
    unit: "USD/bbl",
    change: -0.6,
    changePct: -0.76,
    history: [82.1, 81.4, 80.2, 79.8, 80.5, 79.1, 78.7, 77.9, 78.6, 79.0, 78.4],
    summary: "Oil connects geopolitics, inflation pressure, and demand expectations.",
    zhSummary: "åŽŸæ²¹æŠŠåœ°ç¼˜æ”¿æ²»ã€é€šèƒ€åŽ‹åŠ›å’Œéœ€æ±‚é¢„æœŸè¿žæŽ¥åœ¨ä¸€èµ·ã€‚"
  },
  {
    id: "btc",
    group: "commodities",
    symbol: "BTC-USD",
    name: "Bitcoin",
    zhName: "æ¯”ç‰¹å¸",
    value: 67200,
    unit: "USD",
    change: 820,
    changePct: 1.24,
    history: [61600, 62800, 62100, 64000, 64600, 63800, 65500, 66100, 65200, 66400, 67200],
    summary: "Bitcoin is the high-beta edge of global liquidity sentiment.",
    zhSummary: "æ¯”ç‰¹å¸æ›´åƒå…¨çƒæµåŠ¨æ€§æƒ…ç»ªé‡Œæ³¢åŠ¨æœ€å¤§çš„é‚£ä¸€ç«¯ã€‚"
  },
  {
    id: "nvidia",
    group: "companies",
    symbol: "NVDA",
    name: "NVIDIA",
    zhName: "è‹±ä¼Ÿè¾¾",
    value: 1240,
    unit: "USD",
    change: 18,
    changePct: 1.47,
    marketCap: 3050000000000,
    history: [1100, 1128, 1114, 1156, 1180, 1168, 1194, 1212, 1205, 1222, 1240],
    summary: "The clearest single-stock proxy for the AI infrastructure trade.",
    zhSummary: "æœ€èƒ½ä»£è¡¨ AI åŸºç¡€è®¾æ–½äº¤æ˜“çš„å•ä¸€è‚¡ç¥¨ã€‚"
  },
  {
    id: "microsoft",
    group: "companies",
    symbol: "MSFT",
    name: "Microsoft",
    zhName: "å¾®è½¯",
    value: 430,
    unit: "USD",
    change: 2.8,
    changePct: 0.66,
    marketCap: 3200000000000,
    history: [408, 412, 410, 416, 421, 420, 424, 426, 423, 428, 430],
    summary: "Cloud and AI software demand make Microsoft a core mega-cap read.",
    zhSummary: "äº‘å’Œ AI è½¯ä»¶éœ€æ±‚è®©å¾®è½¯æˆä¸ºæ ¸å¿ƒå¤§åž‹ç§‘æŠ€è‚¡è§‚å¯Ÿç‚¹ã€‚"
  },
  {
    id: "apple",
    group: "companies",
    symbol: "AAPL",
    name: "Apple",
    zhName: "è‹¹æžœ",
    value: 192,
    unit: "USD",
    change: -1.6,
    changePct: -0.83,
    marketCap: 2950000000000,
    history: [186, 188, 187, 191, 194, 193, 195, 194, 193, 194, 192],
    summary: "Apple is still the cleanest consumer-tech mega-cap signal.",
    zhSummary: "è‹¹æžœä»ç„¶æ˜¯æ¶ˆè´¹ç§‘æŠ€å¤§åž‹è‚¡é‡Œæœ€æ¸…æ™°çš„ä¿¡å·ã€‚"
  },
  {
    id: "tsmc",
    group: "companies",
    symbol: "TSM",
    name: "TSMC",
    zhName: "å°ç§¯ç”µ",
    value: 164,
    unit: "USD",
    change: 1.9,
    changePct: 1.17,
    marketCap: 850000000000,
    history: [150, 153, 151, 155, 158, 157, 160, 162, 161, 163, 164],
    summary: "TSMC anchors the semiconductor supply chain signal.",
    zhSummary: "å°ç§¯ç”µæ˜¯åŠå¯¼ä½“ä¾›åº”é“¾æœ€å…³é”®çš„è§‚å¯Ÿç‚¹ã€‚"
  }
];

const fallbackEarningSources = [
  {
    id: "linkedIn-jobs",
    title: "LinkedIn Jobs",
    zhTitle: "LinkedIn æ‹›è˜",
    category: "job-board",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "LinkedIn",
    remote: true,
    payout: "Variable",
    zhPayout: "è§†å…¬å¸ä¸ŽèŒä½è€Œå®š",
    difficulty: "medium",
    priority: 96,
    tags: ["job-board", "networking", "recruiter"],
    link: "https://www.linkedin.com/jobs/",
    summary: "Most useful for senior-to-director roles: leverage recruiter visibility and referral chains.",
    zhSummary: "é€‚åˆä¸­é«˜é˜¶èŒä½ï¼šå¯åˆ©ç”¨æ‹›è˜è€…æ›å…‰å’Œå†…æŽ¨å…³ç³»é“¾ã€‚",
    actions: [
      "Add 2-3 clear role keywords to job title search",
      "Enable job alerts with one location and one remote preference",
      "Comment on 2 industry posts a day to appear active"
    ],
    zhActions: [
      "åœ¨èŒä½æœç´¢ä¸­å›ºå®š2-3ä¸ªæ ¸å¿ƒå…³é”®è¯",
      "åˆ†åˆ«å¼€ 1 ä¸ªæœ¬åœ°åŒ–å’Œ 1 ä¸ªè¿œç¨‹å²—ä½æé†’",
      "æ¯å¤©è¯„è®º2æ¡è¡Œä¸šåŠ¨æ€æå‡è´¦å·æ´»è·ƒ"
    ]
  },
  {
    id: "indeed-jobs",
    title: "Indeed",
    zhTitle: "Indeed",
    category: "job-board",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Indeed",
    remote: true,
    payout: "Variable",
    zhPayout: "è§†å…¬å¸ä¸ŽèŒä½è€Œå®š",
    difficulty: "low",
    priority: 92,
    tags: ["job-board", "entry", "easy-start"],
    link: "https://www.indeed.com/",
    summary: "Fastest place to collect newly posted roles with direct application flows.",
    zhSummary: "é€‚åˆå¿«é€ŸåŒæ­¥å¤§é‡å²—ä½ï¼Œç›´æŽ¥ç”³è¯·ä½“éªŒé¡ºç•…ã€‚",
    actions: [
      "Collect 5 role titles and one daily location set",
      "Use title + skill + city format for filters",
      "Record response times by recruiter and keep best 3 only"
    ],
    zhActions: [
      "å›ºå®š5ä¸ªç›®æ ‡èŒä½å…³é”®è¯+1ä¸ªåœ°åŒº",
      "ç­›é€‰å™¨ä¿æŒâ€œèŒä½ + æŠ€èƒ½ + åŸŽå¸‚â€æ ¼å¼",
      "è®°å½•å¯¹æ–¹å›žå¤æ—¶æ•ˆï¼Œä¿ç•™æœ€å¿«å›žåº”çš„3ä¸ªæ¸ é“"
    ]
  },
  {
    id: "wellfound-jobs",
    title: "Wellfound (Former AngelList)",
    zhTitle: "Wellfoundï¼ˆåŽŸ AngelListï¼‰",
    category: "job-board",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Wellfound",
    remote: true,
    payout: "Variable + equity",
    zhPayout: "è§†å…¬å¸ä¸ŽèŒä½è€Œå®šï¼ˆå¸¸å«æœŸæƒï¼‰",
    difficulty: "medium",
    priority: 82,
    tags: ["job-board", "startup", "equity"],
    link: "https://wellfound.com/jobs",
    summary: "Best for startup pipeline and product-led engineering/business roles with small teams.",
    zhSummary: "é€‚åˆå°å›¢é˜Ÿ/åˆåˆ›å…¬å¸ï¼Œå¸¸è§è‚¡æƒæˆ–æˆé•¿åž‹æ¿€åŠ±ã€‚",
    actions: [
      "Follow 30+ target startup tags",
      "Update one short founder-style cover note",
      "Prioritize roles with explicit stack and growth stage"
    ],
    zhActions: [
      "å…³æ³¨ 30 ä¸ªä»¥ä¸Šç›®æ ‡å…¬å¸æ ‡ç­¾",
      "å‡†å¤‡ä¸€æ®µç²¾ç®€çš„åˆ›å§‹äººé£Žæ ¼åŠ¨æœºä¿¡",
      "ä¼˜å…ˆçœ‹å²—ä½è¦æ±‚ä¸Žå…¬å¸é˜¶æ®µæ¸…æ™°çš„ JD"
    ]
  },
  {
    id: "upwork-gig",
    title: "Upwork",
    zhTitle: "Upwork",
    category: "freelance",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Upwork",
    remote: true,
    payout: "Hourly / fixed",
    zhPayout: "æŒ‰å°æ—¶æˆ–å›ºå®šé¡¹ç›®",
    difficulty: "low",
    priority: 90,
    tags: ["freelance", "client-work", "portfolio"],
    link: "https://www.upwork.com/",
    summary: "Quickest way to convert skills into real invoices with a visible client workflow.",
    zhSummary: "æŠ€èƒ½è½¬çŽ°é‡‘æœ€å¿«çš„è‡ªç”±èŒä¸šå…¥å£ä¹‹ä¸€ï¼Œå®¢æˆ·æµç¨‹é—­çŽ¯æ¸…æ™°ã€‚",
    actions: [
      "Create 3 concrete sample packages with fixed prices",
      "Set availability + timezone in profile",
      "Bid on 3 projects/day and reply within 30 minutes"
    ],
    zhActions: [
      "åˆ›å»º3ä¸ªæ ‡å‡†åŒ–æœåŠ¡åŒ…å’Œå›ºå®šæŠ¥ä»·",
      "å®Œå–„å¯ç”¨æ—¶æ®µä¸Žæ—¶åŒº",
      "æ¯å¤©è·Ÿè¿›3ä¸ªé¡¹ç›®ï¼Œå°½é‡30åˆ†é’Ÿå†…å›žå¤"
    ]
  },
  {
    id: "fiverr-gig",
    title: "Fiverr",
    zhTitle: "Fiverr",
    category: "freelance",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Fiverr",
    remote: true,
    payout: "Gig-based",
    zhPayout: "æŒ‰ä»»åŠ¡è®¡è´¹",
    difficulty: "low",
    priority: 78,
    tags: ["freelance", "micro-task", "portfolio"],
    link: "https://www.fiverr.com/",
    summary: "Good for short task monetization and packaging niche expertise into digital gigs.",
    zhSummary: "é€‚åˆç”¨å°è€Œå¿«çš„ä»»åŠ¡æ‰¿æŽ¥æŠ€èƒ½åž‹å˜çŽ°ã€‚",
    actions: [
      "Start with 3 micro-services with one clear pain point",
      "Use before/after examples in first 2 lines",
      "Test one new gig title weekly"
    ],
    zhActions: [
      "å…ˆåš3ä¸ªèšç„¦1ä¸ªç—›ç‚¹çš„å¾®æœåŠ¡",
      "æœåŠ¡æè¿°å‰2è¡Œæ”¾â€œæ”¹é€ å‰åŽâ€ç¤ºä¾‹",
      "æ¯å‘¨æµ‹è¯•1ä¸ªæ–°Gigæ ‡é¢˜"
    ]
  },
  {
    id: "remoteok-tech",
    title: "RemoteOK",
    zhTitle: "RemoteOK",
    category: "remote",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "RemoteOK",
    remote: true,
    payout: "Variable",
    zhPayout: "è§†å…¬å¸ä¸Žè§’è‰²è€Œå®š",
    difficulty: "medium",
    priority: 84,
    tags: ["remote", "tech", "salaried"],
    link: "https://remoteok.com/",
    summary: "Strong source for remote tech roles, especially for full-time global teams.",
    zhSummary: "é¢å‘è¿œç¨‹æŠ€æœ¯å²—ä½ï¼Œé€‚åˆé•¿æœŸå…¨èŒå²—ä½å¸ƒå±€ã€‚",
    actions: [
      "Keep one tech stack + one role pair for filters",
      "Apply in batches across timezone groups",
      "Capture time-to-response trend weekly"
    ],
    zhActions: [
      "å›ºå®š1å¥—æŠ€æœ¯æ ˆ+1ä¸ªå²—ä½ç»„åˆç­›é€‰",
      "æŒ‰æ—¶åŒºåˆ†ç»„æ‰¹é‡æŠ•é€’",
      "æ¯å‘¨è·Ÿè¸ªä¸€æ¬¡å¹³å‡å“åº”æ—¶é•¿"
    ]
  },
  {
    id: "weworkremotely",
    title: "We Work Remotely",
    zhTitle: "We Work Remotely",
    category: "remote",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "We Work Remotely",
    remote: true,
    payout: "Variable",
    zhPayout: "è§†å…¬å¸ä¸Žè§’è‰²è€Œå®š",
    difficulty: "medium",
    priority: 80,
    tags: ["remote", "design", "engineering", "ops"],
    link: "https://weworkremotely.com/",
    summary: "High-quality remote roles, often in engineering, support, design, and ops.",
    zhSummary: "å²—ä½è´¨é‡ç›¸å¯¹è¾ƒé«˜ï¼Œå¸¸è§å·¥ç¨‹ã€è®¾è®¡ã€è¿è¥æ–¹å‘ã€‚",
    actions: [
      "Filter one remote + one contract-only queue",
      "Store required stack and matching project examples",
      "Shortlist 8 roles and tailor each resume version"
    ],
    zhActions: [
      "å»º1ä¸ªè¿œç¨‹å…¨èŒå’Œ1ä¸ªçŸ­çº¦å²—ä½é˜Ÿåˆ—",
      "æ•´ç†å¿…éœ€æŠ€èƒ½æ ˆ+å¯¹åº”é¡¹ç›®æ¡ˆä¾‹",
      "ä¸€æ¬¡æ€§æŒ‘8ä¸ªå²—ä½åšå®šåˆ¶åŒ–ç®€åŽ†"
    ]
  },
  {
    id: "toptal-gig",
    title: "Toptal",
    zhTitle: "Toptal",
    category: "freelance",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Toptal",
    remote: true,
    payout: "Premium project + retainer",
    zhPayout: "é«˜ç«¯é¡¹ç›®æˆ–é•¿æœŸé¡¾é—®åˆä½œ",
    difficulty: "high",
    priority: 72,
    tags: ["freelance", "premium", "screening"],
    link: "https://www.toptal.com/",
    summary: "Higher-bar platform for premium freelancers with strict profile screening.",
    zhSummary: "é—¨æ§›è¾ƒé«˜ä½†å•ä»·æ›´å¥½ï¼Œé‡è§†ä½œå“ä¸Žæ²Ÿé€šä¸€è‡´æ€§ã€‚",
    actions: [
      "Prepare one flagship case and one teardown case",
      "Rehearse short technical explanation in 90 seconds",
      "Build a one-page fee and SLA statement"
    ],
    zhActions: [
      "å‡†å¤‡1ä¸ªä¸»æ¡ˆä¾‹+1ä¸ªé—®é¢˜åˆ†æžæ¡ˆä¾‹",
      "ç»ƒä¹ 90ç§’æŠ€æœ¯è§£è¯´ç‰ˆæœ¬",
      "ç»™è‡ªå·±å‡†å¤‡1é¡µæŠ¥ä»·ä¸ŽæœåŠ¡SLA"
    ]
  },
  {
    id: "local-gigs",
    title: "Local freelance teams / communities",
    zhTitle: "æœ¬åœ°è‡ªç”±èŒä¸šå›¢é˜Ÿ/ç¤¾ç¾¤",
    category: "local",
    region: "Local",
    zhRegion: "æœ¬åœ°",
    platform: "Discord, Telegram, å¾®ä¿¡ç¾¤",
    remote: false,
    payout: "Negotiated",
    zhPayout: "å¯è®®ä»·ï¼Œçµæ´»ç»“ç®—",
    difficulty: "low",
    priority: 68,
    tags: ["local", "network", "small-project"],
    link: "https://www.google.com/search?q=local+freelance+jobs",
    summary: "Often lower friction for fast onboarding, especially for short business projects.",
    zhSummary: "æœ¬åœ°ç¤¾ç¾¤é€šå¸¸ä¸Šæ‰‹æ›´å¿«ï¼Œé€‚åˆçŸ­å¹³å¿«ä¸šåŠ¡å•ã€‚",
    actions: [
      "Post one concise offer card in 2 relevant groups",
      "Offer 1-2 pilot tasks as no-cost samples",
      "Capture referrals and warm-intros"
    ],
    zhActions: [
      "åœ¨2ä¸ªç›¸å…³ç¾¤å‘å¸ƒ1å¼ æ¸…æ™°æŠ¥ä»·å¡",
      "æä¾›1-2ä¸ªå°è§„æ¨¡è¯•å•æ ·æœ¬",
      "æ¯æ¬¡æˆäº¤åŽè¯·æŽ¨èäººå¹¶è®°å½•è½¬ä»‹ç»"
    ]
  }
,
  {
    id: "ziprecruiter-jobs",
    title: "ZipRecruiter",
    zhTitle: "ZipRecruiter",
    category: "job-board",
    region: "Global",
    zhRegion: "Global",
    platform: "ZipRecruiter",
    remote: true,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "medium",
    priority: 86,
    tags: ["job-board", "high-volume", "alerts"],
    link: "https://www.ziprecruiter.com/jobs",
    summary: "Large platform with fast posting cadence and good support for volume applications across roles.",
    zhSummary: "Large platform with fast posting cadence and good support for volume applications across roles.",
    actions: [
      "Import one job-search keyword pack and save by salary band",
      "Enable one remote preference and one onsite preference only",
      "Apply to 5 relevant openings in one focused 30-minute block"
    ],
    zhActions: [
      "Import one job-search keyword pack and save by salary band",
      "Enable one remote preference and one onsite preference only",
      "Apply to 5 relevant openings in one focused 30-minute block"
    ]
  },
  {
    id: "glassdoor-jobs",
    title: "Glassdoor",
    zhTitle: "Glassdoor",
    category: "job-board",
    region: "Global",
    zhRegion: "Global",
    platform: "Glassdoor",
    remote: true,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "medium",
    priority: 84,
    tags: ["job-board", "salary", "reviews"],
    link: "https://www.glassdoor.com/Job/index.htm",
    summary: "Use employer reviews and salary ranges to pre-score companies before applying.",
    zhSummary: "Use employer reviews and salary ranges to pre-score companies before applying.",
    actions: [
      "Pick 3 target companies and read their salary pages first",
      "Save 6 roles with clear interview-fit reasons",
      "Prioritize roles with explicit remote label and transparent compensation"
    ],
    zhActions: [
      "Pick 3 target companies and read their salary pages first",
      "Save 6 roles with clear interview-fit reasons",
      "Prioritize roles with explicit remote label and transparent compensation"
    ]
  },
  {
    id: "flexjobs-jobs",
    title: "FlexJobs",
    zhTitle: "FlexJobs",
    category: "job-board",
    region: "Global",
    zhRegion: "Global",
    platform: "FlexJobs",
    remote: true,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "low",
    priority: 82,
    tags: ["job-board", "verified", "remote", "part-time"],
    link: "https://www.flexjobs.com/",
    summary: "Good for screened part-time and full-time remote roles with fewer fake postings.",
    zhSummary: "Good for screened part-time and full-time remote roles with fewer fake postings.",
    actions: [
      "Filter one remote + one part-time lane",
      "Add your top 10 matching skills in every query",
      "Apply to 3 roles where recruiter response is visible"
    ],
    zhActions: [
      "Filter one remote + one part-time lane",
      "Add your top 10 matching skills in every query",
      "Apply to 3 roles where recruiter response is visible"
    ]
  },
  {
    id: "monster-jobs",
    title: "Monster",
    zhTitle: "Monster",
    category: "job-board",
    region: "Global",
    zhRegion: "Global",
    platform: "Monster",
    remote: false,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "low",
    priority: 70,
    tags: ["job-board", "on-demand", "legacy"],
    link: "https://www.monster.com/",
    summary: "Useful for traditional hiring pipelines, especially for office and contract roles in bigger companies.",
    zhSummary: "Useful for traditional hiring pipelines, especially for office and contract roles in bigger companies.",
    actions: [
      "Keep one local and one global alert active",
      "Update location terms after 2 weeks of no response",
      "Create a template cover note for each hiring lane"
    ],
    zhActions: [
      "Keep one local and one global alert active",
      "Update location terms after 2 weeks of no response",
      "Create a template cover note for each hiring lane"
    ]
  },
  {
    id: "justremote-remote",
    title: "JustRemote",
    zhTitle: "JustRemote",
    category: "remote",
    region: "Global",
    zhRegion: "Global",
    platform: "JustRemote",
    remote: true,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "medium",
    priority: 83,
    tags: ["remote", "contract", "tech"],
    link: "https://justremote.co/",
    summary: "Curated remote job board with strong startup and product team focus.",
    zhSummary: "Curated remote job board with strong startup and product team focus.",
    actions: [
      "Track timezone match and align meeting-ready windows",
      "Keep roles filtered by contract length and team size",
      "Apply quickly and only after role-tech compatibility check"
    ],
    zhActions: [
      "Track timezone match and align meeting-ready windows",
      "Keep roles filtered by contract length and team size",
      "Apply quickly and only after role-tech compatibility check"
    ]
  },
  {
    id: "workingnomads-remote",
    title: "Working Nomads",
    zhTitle: "Working Nomads",
    category: "remote",
    region: "Global",
    zhRegion: "Global",
    platform: "Working Nomads",
    remote: true,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "medium",
    priority: 79,
    tags: ["remote", "tech", "lifestyle"],
    link: "https://www.workingnomads.co/jobs",
    summary: "Great for remote product, engineering, and support positions with clear remote rules.",
    zhSummary: "Great for remote product, engineering, and support positions with clear remote rules.",
    actions: [
      "Save your top 3 preferred stacks",
      "Limit search to one contract type at a time",
      "Rewrite application intro for each job posting style"
    ],
    zhActions: [
      "Save your top 3 preferred stacks",
      "Limit search to one contract type at a time",
      "Rewrite application intro for each job posting style"
    ]
  },
  {
    id: "freelancer-com",
    title: "Freelancer",
    zhTitle: "Freelancer",
    category: "freelance",
    region: "Global",
    zhRegion: "Global",
    platform: "Freelancer",
    remote: true,
    payout: "Project-fixed / hourly",
    zhPayout: "Project-fixed / hourly",
    difficulty: "medium",
    priority: 77,
    tags: ["freelance", "project-work", "portfolio"],
    link: "https://www.freelancer.com/",
    summary: "High competition but good for project-based work in many categories.",
    zhSummary: "High competition but good for project-based work in many categories.",
    actions: [
      "Offer one starter package and one premium package",
      "Publish one case study image in profile gallery",
      "Bid on 4 relevant projects before end of day"
    ],
    zhActions: [
      "Offer one starter package and one premium package",
      "Publish one case study image in profile gallery",
      "Bid on 4 relevant projects before end of day"
    ]
  },
  {
    id: "peopleperhour-gig",
    title: "PeoplePerHour",
    zhTitle: "PeoplePerHour",
    category: "freelance",
    region: "Global",
    zhRegion: "Global",
    platform: "PeoplePerHour",
    remote: true,
    payout: "Gig-based",
    zhPayout: "Gig-based",
    difficulty: "medium",
    priority: 76,
    tags: ["freelance", "micro-task", "small-business"],
    link: "https://www.peopleperhour.com/",
    summary: "Useful for matching short gigs to small business owners with faster decision loops.",
    zhSummary: "Useful for matching short gigs to small business owners with faster decision loops.",
    actions: [
      "Publish 3 narrowly focused offers",
      "Put turnaround time in the first line",
      "Invite reviews from every completed first order"
    ],
    zhActions: [
      "Publish 3 narrowly focused offers",
      "Put turnaround time in the first line",
      "Invite reviews from every completed first order"
    ]
  },
  {
    id: "guru-gig",
    title: "Guru",
    zhTitle: "Guru",
    category: "freelance",
    region: "Global",
    zhRegion: "Global",
    platform: "Guru",
    remote: true,
    payout: "Project-based",
    zhPayout: "Project-based",
    difficulty: "medium",
    priority: 74,
    tags: ["freelance", "bidding", "portfolio"],
    link: "https://www.guru.com/",
    summary: "Works well for mid-to-long contracts where milestone statements can be reused.",
    zhSummary: "Works well for mid-to-long contracts where milestone statements can be reused.",
    actions: [
      "Prepare one reusable milestone template",
      "Publish clear revision and delivery policy",
      "Ask for one testimonial per successful project"
    ],
    zhActions: [
      "Prepare one reusable milestone template",
      "Publish clear revision and delivery policy",
      "Ask for one testimonial per successful project"
    ]
  },
  {
    id: "taskrabbit-local",
    title: "TaskRabbit",
    zhTitle: "TaskRabbit",
    category: "local",
    region: "Local",
    zhRegion: "Local",
    platform: "TaskRabbit",
    remote: false,
    payout: "Task fee",
    zhPayout: "Task fee",
    difficulty: "low",
    priority: 70,
    tags: ["local", "tasking", "onsite"],
    link: "https://www.taskrabbit.com/",
    summary: "Good for quick local earning opportunities with fast-first response cycles.",
    zhSummary: "Good for quick local earning opportunities with fast-first response cycles.",
    actions: [
      "Set 2-hour and 24-hour response windows in profile",
      "Pick one hourly service with clear hourly rate",
      "Keep a simple before/after photo evidence flow"
    ],
    zhActions: [
      "Set 2-hour and 24-hour response windows in profile",
      "Pick one hourly service with clear hourly rate",
      "Keep a simple before/after photo evidence flow"
    ]
  },
  {
    id: "zhaopin-china",
    title: "Zhaopin",
    zhTitle: "Zhaopin",
    category: "job-board",
    region: "China",
    zhRegion: "China",
    platform: "Zhaopin",
    remote: true,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "medium",
    priority: 80,
    tags: ["job-board", "regional", "cn"],
    link: "https://www.zhaopin.com/",
    summary: "Mainstream China job platform suitable for traditional and tech roles.",
    zhSummary: "Mainstream China job platform suitable for traditional and tech roles.",
    actions: [
      "Switch between CN-only and remote filters",
      "Track response windows by company type",
      "Prepare bilingual title variants for each application"
    ],
    zhActions: [
      "Switch between CN-only and remote filters",
      "Track response windows by company type",
      "Prepare bilingual title variants for each application"
    ]
  },
  {
    id: "liepin-jobs",
    title: "Liepin",
    zhTitle: "Liepin",
    category: "job-board",
    region: "China",
    zhRegion: "China",
    platform: "Liepin",
    remote: true,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "medium",
    priority: 78,
    tags: ["job-board", "senior", "cn"],
    link: "https://www.liepin.com/",
    summary: "Focused on higher-level roles and career growth opportunities in China.",
    zhSummary: "Focused on higher-level roles and career growth opportunities in China.",
    actions: [
      "Keep one senior-track filter set and one specialist-track set",
      "Upload one role-fit case document",
      "Track recruiter response time by day and follow up after 3 days"
    ],
    zhActions: [
      "Keep one senior-track filter set and one specialist-track set",
      "Upload one role-fit case document",
      "Track recruiter response time by day and follow up after 3 days"
    ]
  },
  {
    id: "bosszhipin-jobs",
    title: "BOSS Zhipin",
    zhTitle: "BOSS ç›´è˜",
    category: "job-board",
    region: "China",
    zhRegion: "China",
    platform: "BOSS",
    remote: true,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "medium",
    priority: 76,
    tags: ["job-board", "regional", "cn"],
    link: "https://www.zhipin.com/",
    summary: "Great for active direct chat style recruitment with quick feedback and relationship momentum.",
    zhSummary: "Great for active direct chat style recruitment with quick feedback and relationship momentum.",
    actions: [
      "Keep one job title and one role grade list only",
      "Respond within one business day for every recruiter chat",
      "Track each chat by decision speed and follow-up cadence"
    ],
    zhActions: [
      "Keep one job title and one role grade list only",
      "Respond within one business day for every recruiter chat",
      "Track each chat by decision speed and follow-up cadence"
    ]
  },
  {
    id: "lagou-cn",
    title: "Lagou",
    zhTitle: "Lagou",
    category: "job-board",
    region: "China",
    zhRegion: "China",
    platform: "Lagou",
    remote: true,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "medium",
    priority: 74,
    tags: ["job-board", "tech", "startup", "cn"],
    link: "https://www.lagou.com/",
    summary: "Strong for tech and product roles in startup environments with fast role turnover.",
    zhSummary: "Strong for tech and product roles in startup environments with fast role turnover.",
    actions: [
      "Prioritize startup and internet roles with clear salary bands",
      "Upload portfolio links for each role you can prove quickly",
      "Update one targeted city group each Monday"
    ],
    zhActions: [
      "Prioritize startup and internet roles with clear salary bands",
      "Upload portfolio links for each role you can prove quickly",
      "Update one targeted city group each Monday"
    ]
  },
  {
    id: "remotive-jobs",
    title: "Remotive",
    zhTitle: "Remotive",
    category: "remote",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Remotive",
    remote: true,
    payout: "Variable",
    zhPayout: "Variable",
    difficulty: "low",
    priority: 80,
    tags: ["remote", "startup", "tech", "curated"],
    link: "https://remotive.com/remote-jobs",
    summary: "Remotive curates remote roles from startups and scale-ups with stronger role clarity.",
    zhSummary: "Remotive æ±‡æ€»äº†å¤§é‡åˆåˆ›å’Œæˆé•¿åž‹å…¬å¸å²—ä½ï¼Œå²—ä½èŒè´£é€šå¸¸æ›´æ¸…æ™°ã€‚",
    actions: [
      "Set one skills + one location preference per alert",
      "Tag each opening with one role level and one stack",
      "Follow up every qualified opening within 30 minutes"
    ],
    zhActions: [
      "æ¯æ¡æé†’å›ºå®š 1 ä¸ªæŠ€èƒ½æ ‡ç­¾å’Œ 1 ä¸ªåœ°åŒºåå¥½",
      "æ¯ä¸ªå²—ä½åŠ  1 ä¸ªç­‰çº§ + 1 ä¸ªæŠ€æœ¯æ ˆæ ‡ç­¾",
      "å¯¹æ¯ä¸ªé«˜åŒ¹é…å²—ä½ 30 åˆ†é’Ÿå†…å®Œæˆå›žå¤"
    ]
  },
  {
    id: "remote-co",
    title: "Remote.co",
    zhTitle: "Remote.co",
    category: "remote",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Remote.co",
    remote: true,
    payout: "Variable",
    zhPayout: "æŒ‰å²—ä½",
    difficulty: "medium",
    priority: 77,
    tags: ["remote", "curated", "customer-support", "operations"],
    link: "https://remote.co/remote-jobs/",
    summary: "Useful for support, operations, design, and marketing roles with clear posting quality.",
    zhSummary: "é€‚åˆè¿è¥ã€å®¢æœã€è®¾è®¡å’Œå¸‚åœºå²—ä½ï¼Œå²—ä½è¯´æ˜Žé€šå¸¸è¾ƒå®Œæ•´ã€‚",
    actions: [
      "Filter one operational role and one technical role each day",
      "Use one tailored cover note per team/function",
      "Collect 3 interview questions likely in each job family"
    ],
    zhActions: [
      "æ¯å¤©å„ç­› 1 ä¸ªè¿è¥æ–¹å‘ä¸Ž 1 ä¸ªæŠ€æœ¯æ–¹å‘å²—ä½",
      "æ¯ä¸ªèŒèƒ½å®šåˆ¶ 1 ä»½æŠ•é€’è¯´æ˜Ž",
      "æå‰å‡†å¤‡æ¯ç±»å²—ä½å¸¸è§çš„ 3 é“é¢è¯•é—®é¢˜"
    ]
  },
  {
    id: "jobspresso-jobs",
    title: "Jobspresso",
    zhTitle: "Jobspresso",
    category: "remote",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Jobspresso",
    remote: true,
    payout: "Variable",
    zhPayout: "æŒ‰å²—ä½",
    difficulty: "low",
    priority: 76,
    tags: ["remote", "quality", "curated", "admin"],
    link: "https://jobspresso.co/remote-jobs/",
    summary: "A curated remote-only board with stable postings for marketing, admin, and support jobs.",
    zhSummary: "ç¨³å®šçš„è¿œç¨‹å²—ä½èšåˆå…¥å£ï¼Œé€‚åˆå¸‚åœºã€è¡Œæ”¿å’Œå®¢æœç±»ç®€åŒ–æµç¨‹ã€‚",
    actions: [
      "Create separate inbox folders for each role stream",
      "Keep a cover note bank for recurring role templates",
      "Track weekly response rates and remove low-response keywords"
    ],
    zhActions: [
      "æŒ‰å²—ä½æ–¹å‘å»ºç‹¬ç«‹é‚®ä»¶æ–‡ä»¶å¤¹",
      "å»ºç«‹é€šç”¨æŠ•é€’æ¨¡æ¿åº“ï¼ˆæ¯ç±»å²—ä½ä¸€ä¸ªï¼‰",
      "æ¯å‘¨ç»Ÿè®¡å›žå¤çŽ‡ï¼Œå‰”é™¤ä½Žå›žä¿¡å…³é”®è¯"
    ]
  },
  {
    id: "hired-jobs",
    title: "Hired",
    zhTitle: "Hired",
    category: "job-board",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Hired",
    remote: true,
    payout: "Variable",
    zhPayout: "æŒ‰å²—ä½",
    difficulty: "high",
    priority: 74,
    tags: ["job-board", "engineering", "tech-senior", "offers"],
    link: "https://hired.com/",
    summary: "Candidate-first technical hiring platform; useful for salary-aware applicants in engineering roles.",
    zhSummary: "å€™é€‰äººå‹å¥½çš„æŠ€æœ¯å²—ä½å¹³å°ï¼Œé€‚åˆå…³æ³¨è–ªèµ„å¼¹æ€§çš„å·¥ç¨‹èŒä½ã€‚",
    actions: [
      "Complete full profile and highlight compensation expectations",
      "Keep responses in 1-hour batches during trading hours",
      "Choose roles with clear stack and interview timeline in profile page"
    ],
    zhActions: [
      "å®Œæ•´å¡«å†™æŠ€èƒ½ä¸Žè–ªèµ„æœŸæœ›",
      "åœ¨å·¥ä½œæ—¶æ®µå†…æ¯å°æ—¶å¤„ç†ä¸€æ‰¹å›žå¤",
      "åªé€‰æŠ€æœ¯æ ˆå’Œé¢è¯•æµç¨‹æ¸…æ™°çš„å²—ä½"
    ]
  },
  {
    id: "arc-dev",
    title: "Arc",
    zhTitle: "Arc",
    category: "freelance",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Arc",
    remote: true,
    payout: "Project-based",
    zhPayout: "é¡¹ç›®åˆ¶",
    difficulty: "medium",
    priority: 72,
    tags: ["freelance", "engineering", "high-quality"],
    link: "https://arc.dev/",
    summary: "Senior-engineering freelance and contract hiring, often with explicit budgets and durations.",
    zhSummary: "åå·¥ç¨‹çš„è¿œç¨‹å¤–åŒ…ä¸ŽåˆåŒé¡¹ç›®å¹³å°ï¼Œå¸¸è§é¢„ç®—ä¸Žå‘¨æœŸæ›´æ˜Žç¡®ã€‚",
    actions: [
      "Upload one concrete case-study + one measurable metric",
      "State availability window and communication SLA clearly",
      "Reply first to roles with defined scope and timeline"
    ],
    zhActions: [
      "ä¸Šä¼ ä¸€ä¸ªæ¡ˆä¾‹ + é‡åŒ–ç»“æžœæ•°æ®",
      "æ˜Žç¡®å¯ç”¨æ—¶é—´çª—å’Œæ²Ÿé€š SLA",
      "ä¼˜å…ˆå¤„ç†æœ‰æ˜Žç¡®èŒƒå›´å’Œå‘¨æœŸçš„å²—ä½"
    ]
  },
  {
    id: "topcoder-gigs",
    title: "Topcoder",
    zhTitle: "Topcoder",
    category: "freelance",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Topcoder",
    remote: true,
    payout: "Contest / project",
    zhPayout: "ç«žèµ› / é¡¹ç›®åˆ¶",
    difficulty: "medium",
    priority: 70,
    tags: ["freelance", "competitions", "coding", "algorithms"],
    link: "https://www.topcoder.com/challenges/",
    summary: "Competition plus workboard model; useful for coding speed and benchmark-style outputs.",
    zhSummary: "ç«žèµ›ä¸Žä»»åŠ¡å¹¶è¡Œæ¨¡å¼ï¼Œé€‚åˆå±•ç¤ºä»£ç è¾“å‡ºé€Ÿåº¦å’Œæ‰§è¡Œç»“æžœã€‚",
    actions: [
      "Join one easy challenge per week",
      "Post one reusable template pack after first win",
      "Track submission-to-feedback time by challenge tier"
    ],
    zhActions: [
      "æ¯å‘¨å‚åŠ  1 ä¸ªéš¾åº¦è¾ƒä½Žçš„æŒ‘æˆ˜",
      "é¦–æ¬¡æ‹¿ä¸‹åŽæ‰“åŒ…å‘å¸ƒä¸€ä¸ªå¯å¤ç”¨æˆæžœ",
      "æŒ‰æŒ‘æˆ˜ç­‰çº§è®°å½•æäº¤é€šçŸ¥æ—¶å»¶"
    ]
  },
  {
    id: "ninety-ninedesigns",
    title: "99designs",
    zhTitle: "99designs",
    category: "freelance",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "99designs",
    remote: true,
    payout: "Project-based",
    zhPayout: "é¡¹ç›®åˆ¶",
    difficulty: "medium",
    priority: 68,
    tags: ["freelance", "design", "portfolio"],
    link: "https://99designs.com/graphics/logos",
    summary: "Strong for branding, logo, and visual identity work with contest and direct-work options.",
    zhSummary: "é€‚åˆå“ç‰Œè®¾è®¡ã€logo ä¸Žè§†è§‰è¯†åˆ«ï¼Œæ”¯æŒç«žæ ‡å¼ä¸Žç›´ç­¾ã€‚",
    actions: [
      "Create one style preset with 3 core logo directions",
      "Prepare one package for startups and one for local business",
      "Follow up with 2 revised rounds within first 5 days"
    ],
    zhActions: [
      "å»ºç«‹ 3 å¥—é£Žæ ¼æ–¹å‘çš„å“ç‰Œææ¡ˆ",
      "åˆ†åˆ«å‡†å¤‡åˆ›ä¸šå…¬å¸ç‰ˆå’Œæœ¬åœ°å•†å®¶ç‰ˆçš„æœåŠ¡åŒ…",
      "å‰ 5 å¤©å†…ä¸»åŠ¨æŽ¨è¿› 2 è½®ä¿®æ”¹"
    ]
  },
  {
    id: "dribbble-jobs",
    title: "Dribbble",
    zhTitle: "Dribbble",
    category: "freelance",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Dribbble",
    remote: true,
    payout: "Project-based",
    zhPayout: "é¡¹ç›®åˆ¶",
    difficulty: "low",
    priority: 67,
    tags: ["freelance", "design", "portfolio", "visual"],
    link: "https://dribbble.com/jobs",
    summary: "Great for design-first talent where portfolio quality drives fast callbacks.",
    zhSummary: "è®¾è®¡æ–¹å‘æ•ˆæžœæ˜Žæ˜¾ï¼Œä½œå“è´¨é‡é«˜æ—¶å“åº”é€Ÿåº¦å¿«ã€‚",
    actions: [
      "Keep portfolio sections by role category",
      "Publish one process case for each signature style",
      "Reach out to designers-to-businesses posts with clear scope notes"
    ],
    zhActions: [
      "æŒ‰å²—ä½æ–¹å‘æ‹†åˆ†ä½œå“é›†ç›®å½•",
      "æ¯ç§ä¸»è¦é£Žæ ¼æ”¾ä¸€ä¸ªæµç¨‹æ¡ˆä¾‹",
      "å¯¹å•†å®¶å²—ä½è´´æ–‡é™„å¸¦æ˜Žç¡®äº¤ä»˜èŒƒå›´å›žå¤"
    ]
  },
  {
    id: "toptal-redo",
    title: "Freelance via Toptal Projects",
    zhTitle: "Toptal æ‹›è˜é¡¹ç›®",
    category: "freelance",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Toptal",
    remote: true,
    payout: "Premium project + retainer",
    zhPayout: "é«˜ç«¯é¡¹ç›®æˆ–é•¿æœŸåˆä½œ",
    difficulty: "high",
    priority: 66,
    tags: ["freelance", "premium", "screening", "long-term"],
    link: "https://www.toptal.com/projects",
    summary: "Premium contracting model for proven specialists and repeat clients.",
    zhSummary: "é«˜ç«¯å¤–åŒ…æ¨¡åž‹ï¼Œé€‚åˆé«˜è´¨é‡æœåŠ¡å’Œç¨³å®šå¤è´­ã€‚",
    actions: [
      "Use one flagship case tailored to client vertical",
      "Attach delivery SLA and timeline in all first responses",
      "Prioritize long-term contracts only after first milestone fit"
    ],
    zhActions: [
      "æ¯æ¡å›žå¤å¸¦ä¸Šåž‚ç›´è¡Œä¸šä¸»æ¡ˆä¾‹",
      "ç¬¬ä¸€è½®æ²Ÿé€šå³å£°æ˜Žäº¤ä»˜ SLA ä¸Žå‘¨æœŸ",
      "åªåœ¨é¦–ä¸ªé‡Œç¨‹ç¢‘å¯æŽ§åŽå†æŽ¨è¿›é•¿æœŸåˆåŒ"
    ]
  },
  {
    id: "gigs-gitlab",
    title: "GitLab Jobs",
    zhTitle: "GitLab Jobs",
    category: "job-board",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "GitLab",
    remote: true,
    payout: "Variable",
    zhPayout: "æŒ‰å²—ä½",
    difficulty: "medium",
    priority: 72,
    tags: ["job-board", "engineering", "remote", "gitlab"],
    link: "https://about.gitlab.com/jobs/",
    summary: "Direct roles from GitLab and often fully distributed hiring workflow.",
    zhSummary: "ç›´æŽ¥å…¬å¸å†…æŽ¨å…¥å£ï¼Œå·¥ç¨‹å²—ä½ä»¥åˆ†å¸ƒå¼æµç¨‹ä¸ºä¸»ã€‚",
    actions: [
      "Open role list and capture 3 direct-fit positions",
      "Align cover note with remote collaboration evidence",
      "Prepare interview stories around async workflows"
    ],
    zhActions: [
      "å…ˆç­› 3 ä¸ªåŒ¹é…åº¦é«˜çš„å²—ä½",
      "çªå‡ºè¿œç¨‹åä½œç»éªŒ",
      "å‡†å¤‡ä¸Žå¼‚æ­¥åä½œç›¸å…³é¢è¯•æ•…äº‹"
    ]
  },
  {
    id: "dice-tech-jobs",
    title: "Dice",
    zhTitle: "Dice",
    category: "job-board",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "Dice",
    remote: false,
    payout: "Variable",
    zhPayout: "æŒ‰å²—ä½",
    difficulty: "medium",
    priority: 65,
    tags: ["job-board", "technology", "contract", "onsite"],
    link: "https://www.dice.com/",
    summary: "Tech-contract and employer-heavy pipeline, especially strong for stable roles and volume.",
    zhSummary: "ä»¥ä¼ä¸šæŠ€æœ¯å²—å’ŒåˆåŒå²—ä½ä¸ºä¸»ï¼Œé€‚åˆåšé«˜é¢‘æŠ•é€’ä¸Žå²—ä½ç•™æ„ã€‚",
    actions: [
      "Keep one onsite and one remote tech lane",
      "Store requirements into 3 reusable templates",
      "Set weekly cadence for contract-to-hire transitions"
    ],
    zhActions: [
      "ä¿ç•™ 1 æ¡çŽ°åœºå’Œ 1 æ¡è¿œç¨‹ç§‘æŠ€å²—ä½çº¿è·¯",
      "æŠŠè¦æ±‚æ•´ç†æˆ 3 å¥—é€šç”¨æ¨¡æ¿",
      "æ¯å‘¨å¤ç›˜åˆåŒè½¬æ­£ä¸Žè½¬æ­£çŽ‡"
    ]
  },
  {
    id: "f51-job",
    title: "51Job",
    zhTitle: "å‰ç¨‹æ— å¿§",
    category: "job-board",
    region: "China",
    zhRegion: "ä¸­å›½",
    platform: "51Job",
    remote: true,
    payout: "Variable",
    zhPayout: "æŒ‰å²—ä½",
    difficulty: "low",
    priority: 70,
    tags: ["job-board", "regional", "cn", "volume"],
    link: "https://www.51job.com/",
    summary: "High-volume Chinese platform for mid-market and mainstream company hiring.",
    zhSummary: "ä¸­å›½é«˜é¢‘æŠ•é€’å¹³å°ï¼Œé€‚åˆä¸­é«˜é¢‘ç”³è¯·å’ŒåŒåŸŽç­›é€‰ã€‚",
    actions: [
      "Run one job-hunt wave every weekday morning",
      "Sort by company tier + hiring speed",
      "Keep a single tracking sheet with last-reply timestamps"
    ],
    zhActions: [
      "å·¥ä½œæ—¥å‰ç»Ÿä¸€å‘èµ·ä¸€æ¬¡é›†ä¸­æŠ•é€’",
      "æŒ‰å…¬å¸å±‚çº§ä¸Žæ‹›è˜é€Ÿåº¦æŽ’åº",
      "ç»´æŠ¤å›žå¤æ—¶é—´è¿½è¸ªè¡¨"
    ]
  },
  {
    id: "simplyhired-jobs",
    title: "SimplyHired",
    zhTitle: "SimplyHired",
    category: "job-board",
    region: "Global",
    zhRegion: "å…¨çƒ",
    platform: "SimplyHired",
    remote: false,
    payout: "Variable",
    zhPayout: "æŒ‰å²—ä½",
    difficulty: "low",
    priority: 64,
    tags: ["job-board", "salary", "search", "global"],
    link: "https://www.simplyhired.com/",
    summary: "Search-intense board for broad openings, useful for finding alternatives fast.",
    zhSummary: "æœç´¢å¯¼å‘æ‹›è˜å¹³å°ï¼Œé€‚åˆå¿«é€Ÿè¡¥å……å€™é€‰æœºä¼šæ± ã€‚",
    actions: [
      "Set one broad keyword alert and one seniority alert",
      "Track one city and one remote job track",
      "Archive low-match listings after 2 response cycles"
    ],
    zhActions: [
      "è®¾ç½®ä¸€æ¡å¹¿æ³›å…³é”®è¯å’Œä¸€æ¡çº§åˆ«æé†’",
      "å»ºç«‹ä¸€æ¡åŸŽå¸‚çº¿å’Œä¸€æ¡è¿œç¨‹çº¿",
      "è¿žç»­ä¸¤è½®æœªå›žå¤å°±å½’æ¡£æŽ‰ä½ŽåŒ¹é…æ¸…å•"
    ]
  }];

const marketGroupOrder = ["metals", "companies", "crypto"];
const keyMarketIds = ["gold", "nvda", "aapl", "btc"];
const marketRangeOptions = ["1d", "5d", "1m", "1y", "5y", "all"];
const currencyOrder = ["USD", "CNY", "EUR", "JPY", "GBP", "CHF", "HKD", "SGD", "BTC", "XAU"];
const requiredCurrencyCodes = currencyOrder.slice();
const defaultCurrencyAnchors = ["USD", "CNY", "EUR", "JPY", "GBP", "BTC", "XAU"];
const assetZhNamesBySymbol = {
  "GOLD": "é»„é‡‘",
  "SILVER": "ç™½é“¶",
  "PLAT": "é“‚é‡‘",
  "PALLAD": "é’¯é‡‘",
  "BTC": "æ¯”ç‰¹å¸",
  "ETH": "ä»¥å¤ªåŠ",
  "NVDA": "è‹±ä¼Ÿè¾¾",
  "GOOG": "Alphabetï¼ˆè°·æ­Œï¼‰",
  "GOOGL": "Alphabetï¼ˆè°·æ­Œï¼‰",
  "AAPL": "è‹¹æžœ",
  "MSFT": "å¾®è½¯",
  "AMZN": "äºšé©¬é€Š",
  "TSM": "å°ç§¯ç”µ",
  "AVGO": "åšé€š",
  "2222.SR": "æ²™ç‰¹é˜¿ç¾Ž",
  "TSLA": "ç‰¹æ–¯æ‹‰",
  "META": "Metaï¼ˆè„¸ä¹¦ï¼‰",
  "005930.KS": "ä¸‰æ˜Ÿç”µå­",
  "BRK-B": "ä¼¯å…‹å¸Œå°” ï¿½ å“ˆæ’’éŸ¦",
  "WMT": "æ²ƒå°”çŽ›",
  "LLY": "ç¤¼æ¥",
  "000660.KS": "SK æµ·åŠ›å£«",
  "MU": "ç¾Žå…‰ç§‘æŠ€",
  "JPM": "æ‘©æ ¹å¤§é€š",
  "AMD": "AMD",
  "XOM": "åŸƒå…‹æ£®ç¾Žå­š",
  "ASML": "é˜¿æ–¯éº¦",
  "V": "Visa",
  "INTC": "è‹±ç‰¹å°”",
  "JNJ": "å¼ºç”Ÿ",
  "ORCL": "ç”²éª¨æ–‡",
  "TCEHY": "è…¾è®¯",
  "CSCO": "æ€ç§‘",
  "COST": "å¥½å¸‚å¤š",
  "MA": "ä¸‡äº‹è¾¾å¡",
  "CAT": "å¡ç‰¹å½¼å‹’",
  "601939.SS": "ä¸­å›½å»ºè®¾é“¶è¡Œ",
  "ABBV": "è‰¾ä¼¯ç»´",
  "LRCX": "æ³›æž—é›†å›¢",
  "CVX": "é›ªä½›é¾™",
  "NFLX": "å¥ˆé£ž",
  "BAC": "ç¾Žå›½é“¶è¡Œ",
  "UNH": "è”åˆå¥åº·",
  "KO": "å¯å£å¯ä¹",
  "RO.SW": "ç½—æ°",
  "AMAT": "åº”ç”¨ææ–™",
  "PG": "å®æ´",
  "601288.SS": "ä¸­å›½å†œä¸šé“¶è¡Œ",
  "PLTR": "Palantir",
  "ARM": "Arm æŽ§è‚¡",
  "MS": "æ‘©æ ¹å£«ä¸¹åˆ©",
  "HSBC": "æ±‡ä¸°æŽ§è‚¡",
  "GE": "é€šç”¨ç”µæ°”",
  "1398.HK": "ä¸­å›½å·¥å•†é“¶è¡Œ",
  "BABA": "é˜¿é‡Œå·´å·´",
  "HD": "å®¶å¾—å®",
  "MRK": "é»˜æ²™ä¸œ",
  "PM": "è²åˆ©æ™®èŽ«é‡Œæ–¯å›½é™…",
  "GS": "é«˜ç››",
  "AZN": "é˜¿æ–¯åˆ©åº·",
  "NVS": "è¯ºåŽ",
  "TXN": "å¾·å·žä»ªå™¨",
  "300750.SZ": "å®å¾·æ—¶ä»£",
  "GEV": "GE Vernova",
  "601988.SS": "ä¸­å›½é“¶è¡Œ",
  "MC.PA": "è·¯å¨é…©è½©",
  "RY": "åŠ æ‹¿å¤§çš‡å®¶é“¶è¡Œ",
  "NESN.SW": "é›€å·¢",
  "0857.HK": "ä¸­å›½çŸ³æ²¹",
  "QCOM": "é«˜é€š",
  "KLAC": "ç§‘ç£Š",
  "TM": "ä¸°ç”°",
  "9984.T": "è½¯é“¶é›†å›¢",
  "LIN": "æž—å¾·",
  "SHEL": "å£³ç‰Œ",
  "IBM": "IBM",
  "RTX": "RTX",
  "SIE.DE": "è¥¿é—¨å­",
  "600519.SS": "è´µå·žèŒ…å°",
  "0941.HK": "ä¸­å›½ç§»åŠ¨",
  "WFC": "å¯Œå›½é“¶è¡Œ"
};
const assetZhNamesByName = {
  "alphabet (google)": "Alphabetï¼ˆè°·æ­Œï¼‰",
  "saudi aramco": "æ²™ç‰¹é˜¿ç¾Ž",
  "meta platforms (facebook)": "Metaï¼ˆè„¸ä¹¦ï¼‰",
  "berkshire hathaway": "ä¼¯å…‹å¸Œå°” ï¿½ å“ˆæ’’éŸ¦",
  "china construction bank": "ä¸­å›½å»ºè®¾é“¶è¡Œ",
  "agricultural bank of china": "ä¸­å›½å†œä¸šé“¶è¡Œ",
  "bank of china": "ä¸­å›½é“¶è¡Œ",
  "royal bank of canada": "åŠ æ‹¿å¤§çš‡å®¶é“¶è¡Œ",
  "softbank group corp.": "è½¯é“¶é›†å›¢",
  "kweichow moutai": "è´µå·žèŒ…å°",
  "china mobile": "ä¸­å›½ç§»åŠ¨"
};
const defaultThemeId = "pacific";
const themeOptions = [
  { id: "pacific", labelKey: "themePacific", colors: ["#4dd5ff", "#9ee493", "#061827"] },
  { id: "dawn", labelKey: "themeDawn", colors: ["#0f766e", "#2563eb", "#f7efe3"] }
];

const maxEventPlacesOnMap = 8;
const labelClearance = 112;
const labelHeight = 54;
const labelMapMargin = 8;
const markerClearance = 8;
const labelAnchorGap = 10;
const hoverCardWidth = 250;
const hoverCardHeight = 138;
const labelLayoutStorageKey = "worldConsole.labelLayouts.v10";
const eventCacheStorageKey = "worldConsole.cachedEvents.v2";
const weatherCacheStorageKey = "worldConsole.cachedWeather.v1";
const marketCacheStorageKey = "worldConsole.cachedMarkets.v3";
const viewStateStorageKey = "worldConsole.viewState.v1";
const languageStorageKey = "worldConsole.language.v1";
const themeStorageKey = "worldConsole.theme.v1";
const translationToggleStorageKey = "worldConsole.selectionTranslation.v2";
const translationCacheStorageKey = "worldConsole.selectionTranslationCache.v1";
const minLabelScale = 0.68;
const maxLabelScale = 1.35;
const labelResizeSensitivity = 180;
const manualLabelMaxDistance = 96;
const mapProjectionAspect = 360 / 168;
const boardSlots = [
  [15, 22], [37, 18], [63, 20], [84, 24],
  [22, 45], [48, 42], [72, 46],
  [14, 70], [36, 68], [60, 70], [84, 68]
];
const MAX_EARNING_OPPORTUNITIES = 10;
const earningSourceFilters = [
  { key: "job-board", labelKey: "earningFilterJobBoard" },
  { key: "freelance", labelKey: "earningFilterFreelance" },
  { key: "remote", labelKey: "earningFilterRemote" },
  { key: "local", labelKey: "earningFilterLocal" }
];
const cityBoardSlots = {
  shanghai: [72, 42],
  tokyo: [86, 28],
  singapore: [68, 64],
  dubai: [50, 38],
  london: [36, 24],
  newyork: [18, 36],
  saopaulo: [30, 72],
  sydney: [82, 72]
};

const fallbackLand = [
  [[-168, 72], [-150, 62], [-133, 55], [-126, 48], [-123, 38], [-116, 32], [-106, 27], [-96, 18], [-86, 20], [-78, 26], [-68, 42], [-60, 52], [-62, 62], [-94, 72]],
  [[-82, 12], [-75, 5], [-70, -8], [-62, -16], [-56, -28], [-64, -45], [-72, -55], [-78, -38], [-74, -18], [-80, -4]],
  [[-18, 35], [-4, 58], [12, 68], [32, 70], [54, 60], [46, 44], [30, 36], [14, 34], [2, 42], [-8, 38]],
  [[-18, 32], [8, 36], [28, 30], [42, 14], [48, -12], [34, -34], [18, -35], [2, -18], [-10, 8]],
  [[36, 58], [70, 62], [104, 58], [134, 48], [146, 34], [136, 20], [112, 18], [92, 12], [76, 22], [58, 28], [42, 42]],
  [[112, -10], [134, -14], [154, -24], [148, -42], [116, -36], [108, -22]],
  [[-52, 72], [-26, 75], [-18, 66], [-38, 60], [-52, 64]]
];

const els = {
  matrix: document.getElementById("matrix"),
  map: document.getElementById("worldMap"),
  mapStage: document.querySelector(".map-stage"),
  mapPanelTitle: document.getElementById("mapPanelTitle"),
  mapPanelSubhead: document.getElementById("mapPanelSubhead"),
  pins: document.getElementById("eventPins"),
  marketBoard: document.getElementById("marketBoard"),
  localTime: document.getElementById("localTime"),
  eventCount: document.getElementById("eventCount"),
  reportLocation: document.getElementById("reportLocation"),
  reportMeta: document.getElementById("reportMeta"),
  reportSeverity: document.getElementById("reportSeverity"),
  reportTitle: document.getElementById("reportTitle"),
  reportSummary: document.getElementById("reportSummary"),
  reportImageFrame: document.getElementById("reportImageFrame"),
  reportImage: document.getElementById("reportImage"),
  placeReports: document.getElementById("placeReports"),
  reportLink: document.getElementById("reportLink"),
  feedClock: document.getElementById("feedClock"),
  feedTitle: document.getElementById("feedTitle"),
  feed: document.getElementById("feed"),
  secondaryPanel: document.querySelector(".city-panel"),
  secondaryPanelTitle: document.getElementById("secondaryPanelTitle"),
  secondaryPanelSubhead: document.getElementById("secondaryPanelSubhead"),
  earningFilters: document.getElementById("earningFilters"),
  cityGrid: document.getElementById("cityGrid"),
  weatherSource: document.getElementById("weatherSource"),
  eventSource: document.getElementById("eventSource"),
  mapMenuToggle: document.getElementById("mapMenuToggle"),
  mapActionMenu: document.getElementById("mapActionMenu"),
  refreshEvents: document.getElementById("refreshEvents"),
  marketRefreshTime: document.getElementById("marketRefreshTime"),
  languageToggle: document.getElementById("languageToggle"),
  translationToggle: document.getElementById("translationToggle"),
  themePicker: document.getElementById("themePicker"),
  modeButtons: document.querySelectorAll("[data-map-mode]")
};

const cachedEvents = loadCachedEvents();
const cachedWeather = loadCachedWeather();
const cachedMarkets = loadCachedMarkets();
let reportsLoadedFromCache = cachedEvents.length > 0;
let viewState = loadViewState();
let weather = mergeWeather(cachedWeather);
let events = cachedEvents.length ? cachedEvents : normalizeEventList(fallbackEvents);
let selectedEventId = events.some(event => event.id === viewState.selectedEventId) ? viewState.selectedEventId : events[0]?.id || "";
let selectedPlaceKey = events.length ? locationKey(events.find(event => event.id === selectedEventId) || events[0]) : "";
let selectedCityId = cities.some(city => city.id === viewState.selectedCityId) ? viewState.selectedCityId : cities[0].id;
let marketAssets = cachedMarkets.assets;
let marketCurrencies = cachedMarkets.currencies;
let currencyAnchors = cachedMarkets.anchors.length ? cachedMarkets.anchors : defaultCurrencyAnchors.slice();
let selectedCurrencyAnchor = viewState.selectedCurrencyAnchor || "USD";
let selectedCurrencyCode = viewState.selectedCurrencyCode || "CNY";
let selectedCurrencyRange = viewState.selectedCurrencyRange || "1m";
let currencyDate = cachedMarkets.currencyDate;
let marketUpdatedAt = cachedMarkets.updated;
let marketServedAt = cachedMarkets.servedAt;
let marketDataStale = marketAssets.length > 0;
let marketGroupFilters = {
  metals: viewState.includeMetals !== false,
  crypto: viewState.includeCrypto !== false
};
let selectedMarketId = viewState.selectedMarketId || "aapl";
let selectedMarketRange = viewState.selectedMarketRange || "1m";
let marketLeadersScrollTop = 0;
let marketLeadersSnapTimer = 0;
let marketLeadersPointerDown = false;
let marketPendingFocusAssetId = "";
let marketPendingFocusDirection = 0;
let earningOpportunities = normalizeEarningOpportunities(fallbackEarningSources);
let selectedEarningId = normalizeEarningId(viewState.selectedEarningId);
let earningFilters = normalizeEarningFilters(viewState.earningFilters);
let mapMode = initialMapMode();
let worldGeoJson = null;
let labelLayouts = loadLabelLayouts();
let mapUiScale = 1;
let currentLanguage = loadLanguage();
let currentTheme = loadTheme();
let translationEnabled = loadTranslationToggle();
let translationSelectionText = "";
let translationResultText = "";
let translationExplanationText = "";
let translationStatus = "idle";
let translationRequestId = 0;
let translationSelectionTimer = 0;
let translationAbortController = null;
let translationResultCache = loadTranslationResultCache();
let marketAskQuestion = "";
let marketAskAnswer = "";
let marketAskStatus = "idle";
let marketAskSource = "";
let marketAskRequestId = 0;
let marketAskAbortController = null;
let marketAskActiveContextKey = "";
let marketAskMode = normalizeMarketAskMode(viewState.marketAskMode || "think");
let cityPhotoRangeMinutes = normalizeCityPhotoRange(viewState.cityPhotoRangeMinutes || 30);
let weatherSourceKey = cachedWeather ? "cachedWeather" : "localWeather";
let eventSourceKey = reportSourceKey();
let marketSourceKey = marketAssets.length ? "cachedMarketData" : "loadingMarkets";
let currencySourceKey = marketCurrencies.length ? "cachedMarketData" : "loadingCurrencyData";
let reportImageRequestId = 0;
let cityPhotoActiveBucket = "";
let marketHistoryRequestId = 0;
let marketHistoryPreloadTimer = 0;
let marketHistoryPreloadInFlight = 0;
let marketHistoryCacheSaveTimer = 0;
let marketFreshRetryTimer = 0;
let marketFreshRetryAttempts = 0;
const marketHistoryPreloadQueue = [];
const marketHistoryPreloadKeys = new Set();
const marketHistoryPreloadDone = new Set();

const translations = {
  en: {
    appTitle: "World Event Console",
    localTime: "Local Time",
    reports: "Reports",
    eventMap: "Event Map",
    mapSubhead: "Reports and city stats share the same map without crowding.",
    refresh: "Refresh",
    language: "\u4e2d\u6587",
    colorKey: "Color key",
    security: "Security",
    diplomacy: "Diplomacy",
    general: "General",
    stats: "Stats",
    cityStats: "City Stats",
    cityStatsSubhead: "Weather, temperature, and local time together.",
    reportStream: "Report Stream",
    cityPhotoPanel: "City view",
    cityPhotoUpdated: minutes => minutes <= 0 ? "Updated just now" : `Updated ${minutes} min ago`,
    cityPhotoRange: "Photo window",
    cityPhotoLoading: "Loading city view...",
    cityPhotoFallback: "No time-matched city photo found",
    openSource: "Open source",
    temp: "Temp",
    hum: "Hum",
    wind: "Wind",
    local: "Local",
    weather: "Weather",
    cityMode: "stats",
    noSummary: "No summary text available.",
    localFallbackReports: "Local fallback reports",
    cachedReports: "Cached reports",
    liveRssReports: "Live RSS reports",
    liveRssWhenAvailable: "Live RSS when available",
    refreshingReports: "Refreshing reports...",
    cachedWeather: "Cached weather",
    localWeather: "Local weather",
    openMeteoLive: "Open-Meteo live",
    clear: "Clear",
    lightCloud: "Light cloud",
    cloudy: "Cloudy",
    fog: "Fog",
    rain: "Rain",
    snow: "Snow",
    storm: "Storm",
    world: "World",
    global: "Global",
    waitingForReports: "Waiting for reports",
    loadingWorldBrief: "Loading world brief...",
    collectingReports: "The console is collecting headlines and locating them on the map.",
    categoryWorld: "world",
    categorySecurity: "security",
    categoryDiplomacy: "diplomacy",
    categoryPolitics: "politics",
    categoryClimate: "climate",
    categoryEconomy: "economy"
  },
  zh: {
    appTitle: "ä¸–ç•Œäº‹ä»¶æŽ§åˆ¶å°",
    localTime: "æœ¬åœ°æ™‚é–“",
    reports: "äº‹ä»¶",
    eventMap: "äº‹ä»¶åœ°åœ–",
    mapSubhead: "äº‹ä»¶å’ŒåŸŽå¸‚æ•¸æ“šå…±ç”¨åŒä¸€å¼µåœ°åœ–ï¼Œé¿å…æ“æ“ ã€‚",
    refresh: "é‡æ–°æ•´ç†",
    language: "English",
    colorKey: "é¡è‰²èªªæ˜Ž",
    security: "å®‰å…¨",
    diplomacy: "å¤–äº¤",
    general: "ç¶œåˆ",
    stats: "æ•¸æ“š",
    cityStats: "åŸŽå¸‚æ•¸æ“š",
    cityStatsSubhead: "å¤©æ°£ã€æº«åº¦ã€æ¿•åº¦ã€é¢¨é€Ÿèˆ‡ç•¶åœ°æ™‚é–“ã€‚",
    reportStream: "æ–°èžåˆ—è¡¨",
    cityPhotoPanel: "åŸŽå¸‚ç…§ç‰‡",
    cityPhotoUpdated: minutes => minutes <= 0 ? "åˆšåˆšæ›´æ–°" : `${minutes} åˆ†é’Ÿå‰æ›´æ–°`,
    cityPhotoRange: "ç…§ç‰‡èŒƒå›´",
    cityPhotoLoading: "æ­£åœ¨åŠ è½½åŸŽå¸‚ç…§ç‰‡...",
    cityPhotoFallback: "æš‚æœªæ‰¾åˆ°åŒ¹é…å½“åœ°æ—¶æ®µçš„åŸŽå¸‚ç…§ç‰‡",
    openSource: "é–‹å•ŸåŽŸæ–‡",
    temp: "æº«åº¦",
    hum: "æ¿•åº¦",
    wind: "é¢¨é€Ÿ",
    local: "ç•¶åœ°æ™‚é–“",
    weather: "å¤©æ°£",
    cityMode: "æ•¸æ“š",
    noSummary: "æš«ç„¡æ‘˜è¦ã€‚",
    localFallbackReports: "é›¢ç·šå‚™ç”¨äº‹ä»¶",
    cachedReports: "å·²è¼‰å…¥äº‹ä»¶",
    liveRssReports: "å³æ™‚ä¾†æº",
    liveRssWhenAvailable: "å¯ç”¨æ™‚æ›´æ–°å³æ™‚ä¾†æº",
    refreshingReports: "æ­£åœ¨æ›´æ–°äº‹ä»¶...",
    cachedWeather: "å·²å–å¾—å¤©æ°£",
    localWeather: "æœ¬åœ°å¤©æ°£è³‡æ–™",
    openMeteoLive: "å³æ™‚å¤©æ°£",
    clear: "æ™´æœ—",
    lightCloud: "å°‘é›²",
    cloudy: "å¤šé›²",
    fog: "éœ§",
    rain: "é›¨",
    snow: "é›ª",
    storm: "é¢¨æš´",
    world: "å…¨çƒ",
    global: "å…¨çƒ",
    waitingForReports: "ç­‰å¾…æ–°èž",
    loadingWorldBrief: "æ­£åœ¨è¼‰å…¥å…¨çƒäº‹ä»¶...",
    collectingReports: "æ­£åœ¨æ”¶é›†äº‹ä»¶ä¸¦æ¨™è¨˜åˆ°åœ°åœ–ä¸Šã€‚",
    categoryWorld: "åœ‹éš›",
    categorySecurity: "å®‰å…¨å±€å‹¢",
    categoryDiplomacy: "å¤–äº¤",
    categoryPolitics: "æ”¿æ²»",
    categoryClimate: "æ°£å€™",
    categoryEconomy: "ç¶“æ¿Ÿ"
  }
};

Object.assign(translations.en, {
  markets: "Markets",
  earning: "Earning",
  earningMap: "Earning",
  earningMapSubhead: "Collecting job opportunities and income options from trusted platforms.",
  earningSources: "Earning Sources",
  earningSourcesSubhead: "Filter by source type, then open links and run a 24-hour action loop.",
  earningStream: "Earning Stream",
  earningFilterTitle: "Filters",
  earningAllFilters: "All",
  earningFilterJobBoard: "Job board",
  earningFilterFreelance: "Freelance",
  earningFilterRemote: "Remote",
  earningFilterLocal: "Local",
  earningFilterTitleLabel: "Source",
  earningModeTitle: "Earning opportunities",
  earningCategoryLabel: "Category",
  earningPlatformLabel: "Platform",
  earningPayoutLabel: "Payout",
  earningDifficultyLabel: "Difficulty",
  earningRemoteLabel: "Remote",
  earningRegionLabel: "Region",
  earningSummaryLabel: "Summary",
  earningActionsTitle: "Quick start",
  earningSourceLabel: "Source",
  earningEmpty: "No opportunities in selected filters.",
  earningOpenListing: "Open listing",
  earningCopyPreviewLabel: "Recruitment snippet",
  statsMap: "City Data Map",
  statsMapSubhead: "Weather and time stay attached to each city.",
  marketMap: "Market Pulse",
  marketMapSubhead: "FX, indices, commodities, and market-cap leaders in one view.",
  companyMarketMap: "Company Market Caps",
  companyMarketSubhead: "Largest public companies ranked by market cap from CompaniesMarketCap.",
  allAssetsMap: "Top 50 Assets",
  allAssetsSubhead: "Top 50 non-ETF assets: companies, metals, and cryptocurrencies.",
  rankChange: "Rank move",
  rankUp: count => `Up ${count}`,
  rankDown: count => `Down ${count}`,
  marketPanelTitle: "Exchange Rates",
  marketPanelSubhead: "Major currencies priced against a selectable anchor.",
  companyPanelSubhead: "Largest public companies, market cap, share price, and today's move.",
  marketStream: "Market Watch",
  localMarketSnapshot: "Market snapshot",
  liveMarketData: "Live market data",
  companiesMarketCapData: "CompaniesMarketCap",
  companiesMarketCapAssets: "CompaniesMarketCap All Assets",
  cachedMarketData: "Cached market data",
  currencyMarketData: "Frankfurter + CompaniesMarketCap",
  loadingCurrencyData: "Loading exchange rates",
  mixedMarketData: "Live market data",
  refreshingMarkets: "Refreshing markets...",
  loadingMarkets: "Loading market data",
  marketLoadingSummary: "Loading the saved market snapshot while live data refreshes.",
  marketUnavailable: "Market source unavailable",
  marketRefreshLabel: "Market refresh",
  marketRefreshUnknown: "not loaded yet",
  marketRefreshCached: "cached",
  marketUnavailableTitle: "Market data is unavailable",
  marketUnavailableSummary: "The console could not reach the market data source. No placeholder prices are shown.",
  loadingHistory: "Loading historical chart...",
  noReliableChart: "No reliable chart",
  chartUnavailableForRange: "No reliable data for this range",
  range1d: "1D",
  range5d: "5D",
  range1m: "1M",
  range1y: "1Y",
  range5y: "5Y",
  rangeAll: "ALL",
  marketGroupIndices: "Indices",
  marketGroupFx: "FX",
  marketGroupCommodities: "Commodities",
  marketGroupCompanies: "Market cap",
  marketGroupMetals: "Metals",
  marketGroupCrypto: "Crypto",
  assetRank: "Rank",
  assetType: "Type",
  marketValue: "Value",
  marketMove: "Move",
  marketCap: "Market cap",
  marketSymbol: "Symbol",
  marketRange: "Recent range",
  marketAskTitle: "Ask for details",
  marketAskPlaceholder: "",
  marketAskButton: "Send",
  marketAskLoading: "Thinking...",
  marketAskLoadingFast: "Reading context...",
  marketAskLoadingThink: "Researching...",
  marketAskFast: "Fast",
  marketAskThink: "Think",
  marketAskEmpty: "",
  marketAskUnavailable: "Ask is not connected yet.",
  includeMetals: "Metals",
  includeCrypto: "Crypto",
  currencyAnchor: "Anchor",
  currencyPair: "Currency pair",
  currencyRate: "Rate",
  currencySource: "Source",
  currencyNoChart: "No reliable chart for this pair",
  currencyUpdated: "Updated",
  currencyGroupFiat: "Fiat",
  currencyGroupMetal: "Metal",
  currencyGroupCrypto: "Crypto",
  style: "Style",
  themeTerminal: "Terminal",
  themePacific: "Pacific",
  themeDawn: "Dawn",
  translationPanel: "Translation",
  translationSource: "Selected text",
  translationEmpty: "Select text to translate.",
  translationLoading: "Translating...",
  translationError: "Translation unavailable.",
  translationOriginal: "Original",
  translationResult: "Translation",
  translationExplanation: "Explanation",
  translationToggleHint: "Selection translation",
  speakOriginal: "Read original",
  speakTranslation: "Read translation"
});
Object.assign(translations.en, {
  earningMap: "Earning",
  earningMapSubhead: "Focus on concrete earning opportunities from trusted recruitment platforms.",
  earningSourcesSubhead: "Filter by source type, then open links and run a 24-hour action loop with ready-to-send scripts.",
  earningActionsTitle: "Quick start",
  earningCopyLabel: "Recruitment copy",
  earningCopyHint: "Use this text directly in applications, outreach, or chats.",
  earningPlaybookTitle: "24h playbook",
  earningPlaybookHint: "Pick one source and complete these 3 steps in 24h.",
  earningCopyButton: "Copy text",
  earningCopyCopied: "Copied",
  earningCopyFailed: "Copy failed",
  earningSourceLabel: "Source"
});

Object.assign(translations.zh, {
  markets: "å¸‚åœº",
  earning: "èµšé’±",
  earningMap: "\u8d5d\u9322",
  earningMapSubhead: "èšåˆé«˜è´¨é‡å¹³å°çš„å²—ä½ä¸Žå˜çŽ°å…¥å£ã€‚",
  earningSources: "èµšé’±æ¥æº",
  earningSourcesSubhead: "å…ˆæŒ‰æ¸ é“ç­›é€‰ï¼Œå†æ‰“å¼€ç›®æ ‡å…¥å£å¿«é€Ÿè¡ŒåŠ¨ã€‚",
  earningStream: "èµšé’±åŠ¨æ€",
  earningFilterTitle: "ç­›é€‰",
  earningAllFilters: "å…¨éƒ¨",
  earningFilterJobBoard: "æ‹›è˜å¹³å°",
  earningFilterFreelance: "è‡ªç”±èŒä¸š",
  earningFilterRemote: "è¿œç¨‹å²—ä½",
  earningFilterLocal: "æœ¬åœ°é¡¹ç›®",
  earningFilterTitleLabel: "æ¥æº",
  earningModeTitle: "èµšé’±æœºä¼š",
  earningCategoryLabel: "ç±»åž‹",
  earningPlatformLabel: "å¹³å°",
  earningPayoutLabel: "æ”¶ç›Š",
  earningDifficultyLabel: "éš¾åº¦",
  earningRemoteLabel: "è¿œç¨‹",
  earningRegionLabel: "åŒºåŸŸ",
  earningSummaryLabel: "è¯´æ˜Ž",
  earningActionsTitle: "å¿«é€Ÿå¯åŠ¨",
  earningSourceLabel: "æ¥æº",
  earningCopyPreviewLabel: "\u62db\u52df\u6587\u6848\u9810\u89bd",
  earningEmpty: "å½“å‰ç­›é€‰ä¸‹æ²¡æœ‰å¯å±•ç¤ºçš„æœºä¼šã€‚",
  earningOpenListing: "æ‰“å¼€èŒä½",
  statsMap: "åŸŽå¸‚æ•°æ®åœ°å›¾",
  statsMapSubhead: "å¤©æ°”å’Œæ—¶é—´ç›´æŽ¥è´´åœ¨åŸŽå¸‚ä¸Šã€‚",
  marketMap: "å¸‚åœºåŠ¨å‘",
  marketMapSubhead: "æ±‡çŽ‡ã€è‚¡æŒ‡ã€å•†å“å’Œå…¬å¸å¸‚å€¼æ”¾åœ¨ä¸€ä¸ªè§†è§’é‡Œã€‚",
  companyMarketMap: "å…¬å¸å¸‚å€¼",
  companyMarketSubhead: "æŒ‰ CompaniesMarketCap çš„å…¨çƒä¸Šå¸‚å…¬å¸å¸‚å€¼æŽ’åã€‚",
  allAssetsMap: "èµ„äº§æŽ’å TOP 50",
  allAssetsSubhead: "å‰ 50 ä¸ªéž ETF èµ„äº§ï¼šå…¬å¸ã€é‡‘å±žå’ŒåŠ å¯†è´§å¸ã€‚",
  marketPanelTitle: "å…¨çƒèµ„äº§",
  marketPanelSubhead: "æ±‡çŽ‡ã€è‚¡æŒ‡ã€å•†å“å’Œå…¬å¸å¸‚å€¼ã€‚",
  companyPanelSubhead: "å…¨çƒä¸Šå¸‚å…¬å¸ã€å¸‚å€¼ã€è‚¡ä»·å’Œå½“æ—¥æ¶¨è·Œã€‚",
  marketStream: "å¸‚åœºåˆ—è¡¨",
  localMarketSnapshot: "å¸‚åœºå¿«ç…§",
  liveMarketData: "å³æ—¶å¸‚åœºæ•°æ®",
  companiesMarketCapData: "CompaniesMarketCap",
  companiesMarketCapAssets: "CompaniesMarketCap All Assets",
  cachedMarketData: "å·²ä¿å­˜çš„å¸‚åœºæ•°æ®",
  mixedMarketData: "å³æ—¶å¸‚åœºæ•°æ®",
  refreshingMarkets: "æ­£åœ¨æ›´æ–°å¸‚åœº...",
  loadingMarkets: "æ­£åœ¨åŠ è½½å¸‚åœºæ•°æ®",
  marketLoadingSummary: "æ­£åœ¨å…ˆè¯»å–å·²ä¿å­˜çš„å¸‚åœºå¿«ç…§ï¼ŒåŒæ—¶åˆ·æ–°å®žæ—¶æ•°æ®ã€‚",
  marketUnavailable: "è¡Œæƒ…æºæš‚ä¸å¯ç”¨",
  marketRefreshLabel: "å¸‚åœºåˆ·æ–°",
  marketRefreshUnknown: "å°šæœªåŠ è½½",
  marketRefreshCached: "ç¼“å­˜",
  marketUnavailableTitle: "å¸‚åœºæ•°æ®æš‚ä¸å¯ç”¨",
  marketUnavailableSummary: "çŽ°åœ¨æ²¡æœ‰æ‹¿åˆ°å¯é è¡Œæƒ…æºï¼Œæ‰€ä»¥è¿™é‡Œä¸æ˜¾ç¤ºå ä½ä»·æ ¼ã€‚",
  loadingHistory: "æ­£åœ¨åŠ è½½åŽ†å²æ›²çº¿...",
  noReliableChart: "æš‚æ— å¯é æ›²çº¿",
  chartUnavailableForRange: "è¿™ä¸ªæ—¶é—´æ®µæš‚æ— å¯é æ•°æ®",
  range1d: "1å¤©",
  range5d: "5å¤©",
  range1m: "1æœˆ",
  range1y: "1å¹´",
  range5y: "5å¹´",
  rangeAll: "å…¨éƒ¨",
  marketGroupIndices: "è‚¡æŒ‡",
  marketGroupFx: "æ±‡çŽ‡",
  marketGroupCommodities: "å•†å“",
  marketGroupCompanies: "å…¬å¸å¸‚å€¼",
  marketGroupMetals: "é‡‘å±ž",
  marketGroupCrypto: "åŠ å¯†è´§å¸",
  assetRank: "æŽ’å",
  assetType: "ç±»åž‹",
  marketValue: "æ•°å€¼",
  marketMove: "æ¶¨è·Œ",
  marketCap: "å¸‚å€¼",
  marketSymbol: "ä»£ç ",
  marketRange: "è¿‘æœŸåŒºé—´",
  marketAskTitle: "è¯¢é—®è¯¦ç»†æƒ…å†µ",
  marketAskPlaceholder: "",
  marketAskButton: "å‘é€",
  marketAskLoading: "æ­£åœ¨æ€è€ƒ...",
  marketAskLoadingFast: "é€Ÿç®—ä¸­...",
  marketAskLoadingThink: "æŸ¥èµ„æ–™...",
  marketAskFast: "Fast",
  marketAskThink: "Think",
  marketAskEmpty: "",
  marketAskUnavailable: "é—®ç­”è¿˜æ²¡æœ‰è¿žæŽ¥ã€‚"
});

Object.assign(translations.zh, {
  allAssetsMap: "èµ„äº§æŽ’å TOP 50",
  allAssetsSubhead: "å‰ 50 ä¸ªéž ETFï¼šå…¬å¸ã€è´µé‡‘å±žå’ŒåŠ å¯†è´§å¸ã€‚",
  marketPanelTitle: "è´§å¸æ±‡çŽ‡",
  marketPanelSubhead: "ä¸»æµè´§å¸æŒ‰å¯åˆ‡æ¢é”šå®šè®¡ä»·ã€‚",
  currencyMarketData: "Frankfurter + CompaniesMarketCap",
  loadingCurrencyData: "æ­£åœ¨åŠ è½½æ±‡çŽ‡",
  cachedMarketData: "å·²ä¿å­˜çš„å¸‚åœºæ•°æ®",
  marketRefreshLabel: "å¸‚åœºåˆ·æ–°",
  marketRefreshUnknown: "å°šæœªåŠ è½½",
  marketRefreshCached: "ç¼“å­˜",
  marketRange: "è¿‘æœŸåŒºé—´",
  includeMetals: "é‡‘å±ž",
  includeCrypto: "åŠ å¯†",
  currencyAnchor: "é”šå®š",
  currencyPair: "è´§å¸å¯¹",
  currencyRate: "æ±‡çŽ‡",
  currencySource: "æ¥æº",
  currencyNoChart: "è¿™ä¸ªè´§å¸å¯¹æš‚æ— å¯é æ›²çº¿",
  currencyUpdated: "æ›´æ–°",
  currencyGroupFiat: "æ³•å¸",
  currencyGroupMetal: "é‡‘å±ž",
  currencyGroupCrypto: "åŠ å¯†è´§å¸",
  style: "\u98ce\u683c",
  themeTerminal: "\u7ec8\u7aef",
  themePacific: "\u6d77\u6d0b",
  themeDawn: "\u6668\u5149",
  translationPanel: "\u7ffb\u8bd1",
  translationSource: "\u9009\u4e2d\u6587\u672c",
  translationEmpty: "\u9009\u4e2d\u6587\u672c\u540e\u663e\u793a\u7ffb\u8bd1\u3002",
  translationLoading: "\u6b63\u5728\u7ffb\u8bd1...",
  translationError: "\u6682\u65f6\u7ffb\u8bd1\u4e0d\u51fa\u6765\u3002",
  translationOriginal: "\u539f\u6587",
  translationResult: "\u8bd1\u6587",
  translationExplanation: "\u89e3\u91ca",
  translationToggleHint: "\u9009\u4e2d\u5373\u7ffb\u8bd1",
  speakOriginal: "\u6717\u8bfb\u539f\u6587",
  speakTranslation: "\u6717\u8bfb\u8bd1\u6587"
});
Object.assign(translations.zh, {
  earningMap: "\u8d5d\u9322",
  earningMapSubhead: "\u76f4\u63a5\u6574\u7406\u53ef\u76f4\u63a5\u4f7f\u7528\u7684\u62db\u52df\u6a5f\u6703\u8207\u5e73\u53f0\uff0c\u7701\u6389\u5730\u5716\u96dc\u8a5e\u3002",
  earningSourcesSubhead: "\u5148\u6309\u4f86\u6e90\u985e\u578b\u7be9\u9078\uff0c\u518d\u6253\u958b\u76ee\u6a19\u5e73\u53f0\u5feb\u901f\u884c\u52d5\u3002",
  earningActionsTitle: "\u5feb\u901f\u555f\u52d5",
  earningPlaybookTitle: "24\u5c0f\u6642\u5de5\u4f5c\u55ae",
  earningPlaybookHint: "\u5148\u9078\u4e00\u500b\u4f86\u6e90\uff0c\u572824\u5c0f\u6642\u5167\u5b8c\u6210\u4ee5\u4e0b\u4e09\u6b65\u3002",
  earningCopyLabel: "\u62db\u52df\u6587\u6848",
  earningCopyPreviewLabel: "\u62db\u52df\u6587\u6848\u9810\u89bd",
  earningCopyHint: "\u9019\u6bb5\u6587\u6848\u53ef\u76f4\u63a5\u8cbc\u5230\u7533\u8acb\u3001\u52a0\u7fa4\u6216\u79fb\u52d5\u901a\u8a71\u4e2d\u4f7f\u7528\u3002",
  earningCopyButton: "\u8907\u88fd\u6587\u672c",
  earningCopyCopied: "\u5df2\u8907\u88fd",
  earningCopyFailed: "\u8907\u88fd\u5931\u6557",
  earningSourceLabel: "\u4f86\u6e90"
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readStorageJson(key, fallbackValue = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function writeStorageJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in hardened browser modes. The app still renders with fallback data.
  }
}

function loadTranslationResultCache() {
  const value = readStorageJson(translationCacheStorageKey, {});
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function smallTextHash(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function translationCacheKeyFor(sourceText, target, uiLanguage, contextText = "") {
  const normalizedSource = normalizedSelectionText(sourceText).toLowerCase();
  const normalizedContext = normalizedSelectionText(contextText).slice(0, 520);
  return `${target}|${uiLanguage}|${normalizedSource}|${smallTextHash(normalizedContext)}`;
}

function cachedTranslationResult(cacheKey) {
  const entry = translationResultCache[cacheKey];
  if (!entry || typeof entry !== "object") return null;
  if (!normalizedSelectionText(entry.translation)) return null;
  return entry;
}

function rememberTranslationResult(cacheKey, payload) {
  const translation = normalizedSelectionText(payload?.translation || "");
  if (!translation) return;
  translationResultCache[cacheKey] = {
    translation,
    explanation: normalizedSelectionText(payload?.explanation || ""),
    savedAt: Date.now()
  };
  const entries = Object.entries(translationResultCache)
    .sort((a, b) => Number(b[1]?.savedAt || 0) - Number(a[1]?.savedAt || 0))
    .slice(0, 90);
  translationResultCache = Object.fromEntries(entries);
  writeStorageJson(translationCacheStorageKey, translationResultCache);
}

const quickSelectionTranslations = {
  "market cap": { zh: "\u5e02\u503c", en: "market cap" },
  "market capitalization": { zh: "\u5e02\u503c", en: "market capitalization" },
  "cap": { zh: "\u5e02\u503c", en: "cap", note: "cap" },
  "rank": { zh: "\u6392\u540d", en: "rank" },
  "rank move": { zh: "\u6392\u540d\u53d8\u5316", en: "rank move" },
  "symbol": { zh: "\u4ee3\u7801", en: "symbol" },
  "value": { zh: "\u6570\u503c", en: "value" },
  "move": { zh: "\u6da8\u8dcc\u5e45", en: "move" },
  "country": { zh: "\u56fd\u5bb6/\u5730\u533a", en: "country" },
  "source": { zh: "\u6765\u6e90", en: "source" },
  "updated": { zh: "\u66f4\u65b0\u4e8e", en: "updated" },
  "anchor": { zh: "\u57fa\u51c6", en: "anchor" },
  "currency pair": { zh: "\u8d27\u5e01\u5bf9", en: "currency pair" },
  "currency": { zh: "\u8d27\u5e01", en: "currency" },
  "exchange rates": { zh: "\u6c47\u7387", en: "exchange rates" },
  "fiat": { zh: "\u6cd5\u5b9a\u8d27\u5e01", en: "fiat" },
  "crypto": { zh: "\u52a0\u5bc6\u8d44\u4ea7", en: "crypto" },
  "metal": { zh: "\u91d1\u5c5e", en: "metal" },
  "asset": { zh: "\u8d44\u4ea7", en: "asset" },
  "assets": { zh: "\u8d44\u4ea7", en: "assets" },
  "top assets": { zh: "\u524d\u5217\u8d44\u4ea7", en: "top assets" },
  "reports": { zh: "\u62a5\u544a", en: "reports" },
  "stats": { zh: "\u7edf\u8ba1", en: "stats" },
  "markets": { zh: "\u5e02\u573a", en: "markets" },
  "selected text": { zh: "\u9009\u4e2d\u6587\u672c", en: "selected text" },
  "original": { zh: "\u539f\u6587", en: "original" },
  "translation": { zh: "\u7ffb\u8bd1", en: "translation" },
  "local time": { zh: "\u672c\u5730\u65f6\u95f4", en: "local time" },
  "company": { zh: "\u516c\u53f8", en: "company" },
  "companies": { zh: "\u516c\u53f8", en: "companies" },
  "share price": { zh: "\u80a1\u4ef7", en: "share price" },
  "share": { zh: "\u80a1\u7968/\u4efd\u989d", en: "share" },
  "price": { zh: "\u4ef7\u683c", en: "price" },
  "bitcoin": { zh: "\u6bd4\u7279\u5e01", en: "bitcoin" },
  "gold": { zh: "\u9ec4\u91d1", en: "gold" },
  "\u5e02\u503c": { zh: "\u5e02\u503c", en: "market cap" },
  "\u6392\u540d": { zh: "\u6392\u540d", en: "rank" },
  "\u6392\u540d\u53d8\u5316": { zh: "\u6392\u540d\u53d8\u5316", en: "rank move" },
  "\u4ee3\u7801": { zh: "\u4ee3\u7801", en: "symbol" },
  "\u8d27\u5e01": { zh: "\u8d27\u5e01", en: "currency" },
  "\u6c47\u7387": { zh: "\u6c47\u7387", en: "exchange rate" }
};

function quickTranslationKey(text) {
  return normalizedSelectionText(text)
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s/]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function quickTranslationExplanation(sourceText, translation, uiLanguage, key) {
  if (uiLanguage !== "zh") {
    if (key === "cap") {
      return "In this market panel, cap is short for market capitalization.";
    }
    return `Local glossary: ${sourceText} usually means ${translation} in this console.`;
  }
  if (key === "cap") {
    return "\u8fd9\u91cc\u7684 cap \u662f market cap \u7684\u7f29\u5199\uff0c\u6307\u516c\u53f8\u6216\u8d44\u4ea7\u7684\u5e02\u503c\u3002";
  }
  return `\u672c\u5730\u5feb\u901f\u8bcd\u8868\uff1a${sourceText} \u5728\u8fd9\u4e2a\u63a7\u5236\u53f0\u91cc\u901a\u5e38\u8bd1\u4e3a ${translation}\u3002`;
}

function quickTranslationResult(sourceText, target, uiLanguage) {
  const key = quickTranslationKey(sourceText);
  const entry = quickSelectionTranslations[key];
  if (!entry) return null;
  const translation = target === "en" ? entry.en : entry.zh;
  if (!translation || normalizedSelectionText(translation).toLowerCase() === normalizedSelectionText(sourceText).toLowerCase()) return null;
  return {
    text: sourceText,
    translation,
    explanation: quickTranslationExplanation(sourceText, translation, uiLanguage, entry.note || key),
    target,
    sourceName: "Local quick glossary"
  };
}

function t(key, ...args) {
  const value = translations[currentLanguage]?.[key] ?? translations.en[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function loadLanguage() {
  try {
    const saved = localStorage.getItem(languageStorageKey);
    return saved === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}

function saveLanguage() {
  try {
    localStorage.setItem(languageStorageKey, currentLanguage);
  } catch {
    // Language preference is optional.
  }
}

function loadTranslationToggle() {
  try {
    const saved = localStorage.getItem(translationToggleStorageKey);
    return saved === null ? true : saved !== "false";
  } catch {
    return true;
  }
}

function saveTranslationToggle() {
  try {
    localStorage.setItem(translationToggleStorageKey, translationEnabled ? "true" : "false");
  } catch {
    // Translation mode is optional UI state.
  }
}

function validThemeId(value) {
  if (value === "terminal") return defaultThemeId;
  return themeOptions.some(theme => theme.id === value) ? value : defaultThemeId;
}

function loadTheme() {
  try {
    return validThemeId(localStorage.getItem(themeStorageKey));
  } catch {
    return defaultThemeId;
  }
}

function saveTheme() {
  try {
    localStorage.setItem(themeStorageKey, currentTheme);
  } catch {
    // Theme preference is optional.
  }
}

function cssVar(name, fallback = "") {
  const bodyValue = getComputedStyle(document.body).getPropertyValue(name).trim();
  if (bodyValue) return bodyValue;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function themeRgba(name, alpha) {
  const rgb = cssVar(`--${name}-rgb`);
  return rgb ? `rgba(${rgb}, ${alpha})` : `rgba(66, 246, 176, ${alpha})`;
}

function applyTheme(themeId = currentTheme) {
  currentTheme = validThemeId(themeId);
  document.body.dataset.theme = currentTheme;
  renderThemePicker();
  drawMatrix();
  if (isMarketMode()) {
    renderMarketBoard();
    renderMarketAssets();
  } else {
    drawWorld();
    positionEventPins();
  }
}

function setTheme(themeId) {
  currentTheme = validThemeId(themeId);
  saveTheme();
  applyTheme(currentTheme);
}

function renderThemePicker() {
  if (!els.themePicker) return;
  els.themePicker.innerHTML = "";
  themeOptions.forEach(theme => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `theme-option ${theme.id === currentTheme ? "active" : ""}`;
    button.setAttribute("aria-pressed", theme.id === currentTheme ? "true" : "false");
    const swatches = document.createElement("span");
    swatches.className = "theme-swatches";
    theme.colors.forEach(color => {
      const swatch = document.createElement("i");
      swatch.style.background = color;
      swatches.appendChild(swatch);
    });
    const label = document.createElement("b");
    label.textContent = t(theme.labelKey);
    button.appendChild(swatches);
    button.appendChild(label);
    button.addEventListener("click", () => setTheme(theme.id));
    els.themePicker.appendChild(button);
  });
}

function cityName(city) {
  return currentLanguage === "zh" ? city.zhName || city.name : city.name;
}

function cityCountry(city) {
  return currentLanguage === "zh" ? city.zhCountry || city.country : city.country;
}

function cloneMarketAssets(items) {
  return (Array.isArray(items) ? items : []).map(asset => ({
    ...asset,
    history: Array.isArray(asset.history) ? asset.history.slice() : [],
    denseHistory: Array.isArray(asset.denseHistory) ? asset.denseHistory.slice() : [],
    shortHistory: Array.isArray(asset.shortHistory) ? asset.shortHistory.slice() : [],
    rangeHistories: normalizeMarketRangeHistories(asset.rangeHistories)
  }));
}

function normalizeMarketHistory(history) {
  if (!Array.isArray(history) || !history.length) return null;
  const normalized = history
    .map((item, index) => {
      if (typeof item === "number") {
        return { label: String(index + 1), value: item };
      }
      const value = Number(item?.value);
      if (!Number.isFinite(value)) return null;
      return {
        label: String(item.label || item.year || index + 1),
        date: item.date || null,
        time: item.time || null,
        value,
        valueKind: item.valueKind || null,
        changePct: Number.isFinite(Number(item.changePct)) ? Number(item.changePct) : null,
        relative: item.relative === true
      };
    })
    .filter(Boolean);
  return normalized.length >= 2 ? normalized : null;
}

function normalizeEarningDifficulty(value) {
  const normalized = String(value || "medium").toLowerCase();
  if (normalized === "easy" || normalized === "low") return "low";
  if (normalized === "hard" || normalized === "high") return "high";
  return "medium";
}

function normalizeEarningCategory(value) {
  const normalized = String(value || "").toLowerCase();
  return ["job-board", "freelance", "remote", "local"].includes(normalized) ? normalized : "job-board";
}

function normalizeEarningOpportunities(items) {
  const normalized = [];
  for (const incoming of Array.isArray(items) ? items : []) {
    const id = String(incoming?.id || "").trim();
    if (!id) continue;
    const summary = String(incoming?.summary || "").trim();
    const zhSummary = String(incoming?.zhSummary || "").trim();
    normalized.push({
      id,
      title: String(incoming?.title || "").trim() || id,
      zhTitle: String(incoming?.zhTitle || incoming?.title || "").trim() || id,
      category: normalizeEarningCategory(incoming?.category),
      region: String(incoming?.region || "Global").trim(),
      zhRegion: String(incoming?.zhRegion || incoming?.region || "").trim(),
      platform: String(incoming?.platform || "").trim() || String(incoming?.title || "").trim(),
      remote: incoming?.remote === true,
      payout: String(incoming?.payout || "").trim() || "Variable",
      zhPayout: String(incoming?.zhPayout || incoming?.payout || "").trim(),
      difficulty: normalizeEarningDifficulty(incoming?.difficulty),
      priority: Number.isFinite(Number(incoming?.priority))
        ? Math.max(1, Math.min(100, Number(incoming?.priority)))
        : 50,
      tags: Array.isArray(incoming?.tags) ? incoming.tags.map(item => String(item).trim()).filter(Boolean) : [],
      link: /^https?:\/\//i.test(String(incoming?.link || "")) ? String(incoming?.link).trim() : "",
      summary,
      zhSummary,
      copyText: String(incoming?.copyText || "").trim(),
      zhCopyText: String(incoming?.zhCopyText || "").trim(),
      actions: Array.isArray(incoming?.actions) ? incoming.actions.map(item => String(item).trim()).filter(Boolean) : [],
      zhActions: Array.isArray(incoming?.zhActions) ? incoming.zhActions.map(item => String(item).trim()).filter(Boolean) : []
    });
  }
  return normalized
    .sort((left, right) => right.priority - left.priority || left.title.localeCompare(right.title))
    .slice(0, MAX_EARNING_OPPORTUNITIES);
}

function normalizeEarningId(id) {
  const normalized = String(id || "").trim();
  if (earningOpportunities.some(item => item.id === normalized)) return normalized;
  return earningOpportunities[0]?.id || "";
}

function normalizeEarningFilters(raw = {}) {
  const saved = raw && typeof raw === "object" ? raw : {};
  const normalized = {};
  earningSourceFilters.forEach(item => {
    normalized[item.key] = saved[item.key] !== false;
  });
  if (!Object.values(normalized).some(Boolean)) {
    earningSourceFilters.forEach(item => {
      normalized[item.key] = true;
    });
  }
  return normalized;
}

function clampUiText(value, maxLength = 120) {
  const text = String(value || "").trim();
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function earningDisplayTitle(item) {
  if (!item) return "";
  return currentLanguage === "zh" ? item.zhTitle || item.title : item.title;
}

function earningDisplayRegion(item) {
  if (!item) return "";
  return currentLanguage === "zh" ? item.zhRegion || item.region : item.region;
}

function earningDisplaySummary(item) {
  if (!item) return "";
  return currentLanguage === "zh" ? (item.zhSummary || item.summary || "") : (item.summary || item.zhSummary || "");
}

function earningDisplayPayout(item) {
  if (!item) return "";
  return currentLanguage === "zh" ? (item.zhPayout || item.payout || "") : item.payout;
}

function earningDisplayActions(item) {
  if (!item) return [];
  const list = currentLanguage === "zh" ? item.zhActions : item.actions;
  return Array.isArray(list) ? list.slice(0, 6) : [];
}

function earningLabelForCategory(category) {
  if (currentLanguage === "zh") {
    return category === "freelance" ? "è‡ªç”±èŒä¸š" : category === "remote" ? "è¿œç¨‹" : category === "local" ? "æœ¬åœ°é¡¹ç›®" : "æ‹›è˜å¹³å°";
  }
  return category === "freelance" ? "Freelance" : category === "remote" ? "Remote" : category === "local" ? "Local projects" : "Job board";
}

function earningLabelForDifficulty(value) {
  const normalized = normalizeEarningDifficulty(value);
  if (currentLanguage === "zh") return normalized === "high" ? "é«˜" : normalized === "low" ? "ä½Ž" : "ä¸­";
  return normalized === "high" ? "High" : normalized === "low" ? "Low" : "Medium";
}

function earningRemoteLabel(item) {
  const yes = currentLanguage === "zh" ? "è¿œç¨‹å¯åš" : "Remote";
  const no = currentLanguage === "zh" ? "ä»¥æœ¬åœ°ä¸ºä¸»" : "Local-first";
  return item?.remote ? yes : no;
}

function earningDifficultyClass(item) {
  return normalizeEarningDifficulty(item?.difficulty);
}

function resolveEarningCopyTemplate(item) {
  if (!item) return "";
  const template = currentLanguage === "zh" ? item.zhCopyText : item.copyText;
  if (!template) return "";
  const platform = item.platform || earningDisplayTitle(item);
  const title = earningDisplayTitle(item);
  const region = earningDisplayRegion(item);
  const payout = earningDisplayPayout(item);
  const categoryLabel = earningLabelForCategory(item.category);
  const remoteLabel = earningRemoteLabel(item);
  const difficulty = earningLabelForDifficulty(item.difficulty).toLowerCase();

  return String(template)
    .replace(/\{platform\}/g, platform)
    .replace(/\{title\}/g, title)
    .replace(/\{region\}/g, region)
    .replace(/\{payout\}/g, payout)
    .replace(/\{category\}/g, categoryLabel)
    .replace(/\{remote\}/g, remoteLabel)
    .replace(/\{difficulty\}/g, difficulty);
}

function earningCopyPreview(item, lines = 2) {
  const source = earningCopyText(item);
  if (!source) return "";
  return source
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, lines)
    .join(" ");
}

function fallbackEarningAction(item, index) {
  return currentLanguage === "zh"
    ? `${index}ã€æ•´ç†å¹¶æ›´æ–° 1 æ¡ä¸Žè¯¥æ¸ é“åŒ¹é…çš„å…³é”®è¯`
    : `${index}. Refresh one keyword pack for this channel`;
}

function earningCopyText(item) {
  if (!item) return "";
  const customTemplate = resolveEarningCopyTemplate(item);
  if (customTemplate) {
    return customTemplate;
  }
  const platform = item.platform || earningDisplayTitle(item);
  const title = earningDisplayTitle(item);
  const region = earningDisplayRegion(item);
  const payout = earningDisplayPayout(item);
  const categoryLabel = earningLabelForCategory(item.category);
  const remoteLabel = earningRemoteLabel(item);
  const difficulty = earningLabelForDifficulty(item.difficulty).toLowerCase();
  const rawActions = earningDisplayActions(item);
  const actions = rawActions.length
    ? rawActions.slice(0, 3).map((action, index) => `- ${index + 1}. ${action}`)
    : ["- " + fallbackEarningAction(currentLanguage === "zh" ? "å…ˆä»Ž 1 æ¡å²—ä½é“¾è·¯å¼€å§‹" : "Start with one strong posting flow", 1)];
  const actionLines = currentLanguage === "zh"
    ? [
      "ä½ ä¹Ÿå¯ä»¥ç›´æŽ¥ç”¨é€™æ®µè¨Šæ¯æŠ•éž/ç§è¨Šï¼š",
      "",
      `æˆ‘æ­£åœ¨æ‰¾${categoryLabel}æ©Ÿæœƒï¼Œåå¥½${remoteLabel}ï¼Œç›®æ¨™åŸŽå¸‚/å€åŸŸï¼š${region}ã€‚`,
      `æˆ‘åœ¨${platform}çš„é—œæ³¨é‡é»žæ˜¯é«˜æ•ˆçŽ‡æŠ•éžèˆ‡ç©©å®šå›žæ‡‰ã€‚é æœŸæ¢ä»¶ï¼š${payout}ã€‚`,
      "",
      "ä»Šæ—¥è¡Œå‹•ï¼š",
      ...actions
    ].join("\n")
    : [
      "You can send this directly in chats/applications:",
      "",
      `I am targeting ${categoryLabel} roles on ${platform} (${title}) with a ${remoteLabel.toLowerCase()} preference.`,
      `Current region: ${region}. Typical target: ${payout}. Difficulty: ${difficulty}.`,
      "",
      "Today I will:",
      ...actions
    ].join("\n");
  return currentLanguage === "zh" ? actionLines : actionLines;
}

async function copyTextToClipboard(text) {
  const value = String(text || "").trim();
  if (!value) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fallback below.
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "readonly");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return Boolean(copied);
  } catch {
    return false;
  }
}

function visibleEarningOpportunities() {
  const selected = earningOpportunities.filter(item => earningFilters[item.category]);
  return (selected.length ? selected : earningOpportunities).slice(0, MAX_EARNING_OPPORTUNITIES);
}

function earningSourcesSummaryLabel() {
  const active = Object.entries(earningFilters).filter(([, enabled]) => enabled).map(([key]) => t(`earningFilter${key.charAt(0).toUpperCase() + key.slice(1)}`));
  if (!active.length) return "";
  return `${t("earningFilterTitleLabel")}: ${active.join(", ")}`;
}

function normalizeMarketRangeHistories(histories) {
  const normalized = {};
  if (!histories || typeof histories !== "object") return normalized;
  marketRangeOptions.forEach(range => {
    const history = normalizeMarketHistory(histories[range]);
    if (history) normalized[range] = history;
  });
  return normalized;
}

function normalizeMarketAssets(items) {
  const templateById = new Map(cloneMarketAssets(fallbackMarketAssets).map(asset => [asset.id, asset]));
  const normalized = [];
  for (const incoming of Array.isArray(items) ? items : []) {
    if (!incoming || !incoming.id) continue;
    const fallback = templateById.get(incoming.id) || {};
    const incomingHistory = normalizeMarketHistory(incoming.history);
    const fallbackRangeHistories = normalizeMarketRangeHistories(fallback.rangeHistories);
    const incomingRangeHistories = normalizeMarketRangeHistories(incoming.rangeHistories);
    const merged = {
      ...fallback,
      ...incoming,
      history: incomingHistory
        ? incomingHistory
        : Array.isArray(fallback.history)
          ? normalizeMarketHistory(fallback.history) || []
          : [],
      denseHistory: normalizeMarketHistory(incoming.denseHistory) || normalizeMarketHistory(fallback.denseHistory) || [],
      shortHistory: normalizeMarketHistory(incoming.shortHistory) || normalizeMarketHistory(fallback.shortHistory) || [],
      sparkline: normalizeMarketHistory(incoming.sparkline) || normalizeMarketHistory(fallback.sparkline) || [],
      rankPrevious: Number.isFinite(Number(incoming.rankPrevious)) ? Number(incoming.rankPrevious) : null,
      rankChange: Number.isFinite(Number(incoming.rankChange)) ? Number(incoming.rankChange) : null,
      rankChangedAt: incoming.rankChangedAt || "",
      historyUrl: incoming.historyUrl || fallback.historyUrl || "",
      rangeHistories: { ...fallbackRangeHistories, ...incomingRangeHistories }
    };
    normalized.push(merged);
  }
  return normalized.sort((left, right) => {
    const leftRank = Number.isFinite(Number(left.rank)) ? Number(left.rank) : 9999;
    const rightRank = Number.isFinite(Number(right.rank)) ? Number(right.rank) : 9999;
    if (leftRank !== rightRank) return leftRank - rightRank;
    return Number(right.marketCap || 0) - Number(left.marketCap || 0);
  });
}

function normalizeCurrencyQuotes(items) {
  const normalized = [];
  for (const incoming of Array.isArray(items) ? items : []) {
    const code = String(incoming?.code || "").toUpperCase();
    const usdValue = Number(incoming?.usdValue);
    const quotePerUsd = Number(incoming?.quotePerUsd);
    if (!code || !Number.isFinite(usdValue) || usdValue <= 0 || !Number.isFinite(quotePerUsd) || quotePerUsd <= 0) {
      continue;
    }
    normalized.push({
      ...incoming,
      code,
      usdValue,
      quotePerUsd,
      changePct: Number.isFinite(Number(incoming.changePct)) ? Number(incoming.changePct) : null,
      history: normalizeMarketHistory(incoming.history) || [],
      denseHistory: normalizeMarketHistory(incoming.denseHistory) || [],
      shortHistory: normalizeMarketHistory(incoming.shortHistory) || []
    });
  }
  return normalized.sort((left, right) => {
    const leftIndex = currencyOrder.indexOf(left.code);
    const rightIndex = currencyOrder.indexOf(right.code);
    const a = leftIndex >= 0 ? leftIndex : 999;
    const b = rightIndex >= 0 ? rightIndex : 999;
    if (a !== b) return a - b;
    return left.code.localeCompare(right.code);
  });
}

function hasCompleteCurrencySet(items) {
  const codes = new Set((Array.isArray(items) ? items : []).map(item => String(item?.code || "").toUpperCase()));
  return requiredCurrencyCodes.every(code => codes.has(code));
}

function marketAssetById(id) {
  return marketAssets.find(asset => asset.id === id) || defaultMarketAsset(visibleMarketAssets()) || defaultMarketAsset(marketAssets);
}

function isMarketAssetVisible(asset) {
  if (!asset) return false;
  if (asset.group === "metals") return marketGroupFilters.metals;
  if (asset.group === "crypto") return marketGroupFilters.crypto;
  return true;
}

function visibleMarketAssets() {
  return marketAssets.filter(isMarketAssetVisible);
}

function compareMarketRank(left, right) {
  const leftRank = Number.isFinite(Number(left?.rank)) ? Number(left.rank) : 9999;
  const rightRank = Number.isFinite(Number(right?.rank)) ? Number(right.rank) : 9999;
  if (leftRank !== rightRank) return leftRank - rightRank;
  return Number(right?.marketCap || 0) - Number(left?.marketCap || 0);
}

function rankedVisibleMarketAssets() {
  return visibleMarketAssets().slice().sort(compareMarketRank);
}

function marketDisplayRank(asset) {
  if (!asset?.id) return null;
  const index = rankedVisibleMarketAssets().findIndex(item => item.id === asset.id);
  return index >= 0 ? index + 1 : null;
}

function marketRankChangeValue(asset) {
  const value = Number(asset?.rankChange);
  return Number.isFinite(value) && value !== 0 ? value : 0;
}

function marketRankChangeClass(asset) {
  const change = marketRankChangeValue(asset);
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "";
}

function formatMarketRankChange(asset, { compact = false } = {}) {
  const change = marketRankChangeValue(asset);
  if (!change) return compact ? "" : "=";
  const count = Math.abs(change);
  if (compact) return change > 0 ? `+${count}` : `-${count}`;
  return change > 0 ? `+${count}` : `-${count}`;
}

function defaultMarketAsset(ranked = rankedVisibleMarketAssets()) {
  return ranked.find(asset => String(asset?.symbol || "").toUpperCase() === "AAPL")
    || ranked.find(asset => String(asset?.id || "").toLowerCase().includes("aapl"))
    || ranked[0]
    || null;
}

function visibleMarketAssetById(id) {
  const ranked = rankedVisibleMarketAssets();
  return ranked.find(asset => asset.id === id) || defaultMarketAsset(ranked);
}

function marketName(asset) {
  if (!asset) return "";
  if (currentLanguage !== "zh") return asset.name;
  const symbol = String(asset.symbol || "").toUpperCase();
  const rawName = String(asset.name || "");
  const nameKey = rawName.toLowerCase();
  return asset.zhName || assetZhNamesBySymbol[symbol] || assetZhNamesByName[nameKey] || rawName;
}

function marketDetailUrl(asset) {
  const raw = String(asset?.historyUrl || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://companiesmarketcap.com${raw.startsWith("/") ? raw : `/${raw}`}`;
}

function createMarketNameLink(asset, className = "market-name-link") {
  const url = marketDetailUrl(asset);
  if (!url) {
    const strong = document.createElement("strong");
    strong.className = className;
    strong.textContent = marketName(asset);
    return strong;
  }
  const link = document.createElement("a");
  link.className = className;
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = marketName(asset);
  link.addEventListener("click", event => {
    event.stopPropagation();
    if (asset?.id && asset.id !== selectedMarketId) {
      event.preventDefault();
      selectMarket(asset.id, { focusList: true });
    }
  });
  return link;
}

function marketSummary(asset) {
  if (!asset) return "";
  return currentLanguage === "zh" ? asset.zhSummary || asset.summary || "" : asset.summary || "";
}

function currencyByCode(code) {
  const key = String(code || "").toUpperCase();
  return marketCurrencies.find(currency => currency.code === key) || null;
}

function currencyName(currency) {
  if (!currency) return "";
  return currentLanguage === "zh" ? currency.zhName || currency.name || currency.code : currency.name || currency.code;
}

function currencyGroupLabel(group) {
  if (group === "crypto") return t("currencyGroupCrypto");
  if (group === "metal") return t("currencyGroupMetal");
  return t("currencyGroupFiat");
}

function validCurrencyAnchors() {
  const codes = new Set(marketCurrencies.map(currency => currency.code));
  return (currencyAnchors.length ? currencyAnchors : defaultCurrencyAnchors).filter(code => codes.has(code));
}

function ensureCurrencySelection() {
  if (!marketCurrencies.length) return;
  const anchors = validCurrencyAnchors();
  if (!currencyByCode(selectedCurrencyAnchor)) {
    selectedCurrencyAnchor = anchors[0] || marketCurrencies[0].code;
  }
  if (!currencyByCode(selectedCurrencyCode) || selectedCurrencyCode === selectedCurrencyAnchor) {
    selectedCurrencyCode = marketCurrencies.find(currency => currency.code !== selectedCurrencyAnchor)?.code || selectedCurrencyAnchor;
  }
}

function currencyPairRate(anchor, quote) {
  if (!anchor || !quote) return null;
  const rate = Number(anchor.usdValue) / Number(quote.usdValue);
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

function currencyQuotePerUsdAt(currency, date) {
  if (!currency || !date) return null;
  if (currency.code === "USD") return 1;
  const point = (currency.history || []).find(item => (item.time || item.date) === date);
  const value = Number(point?.value);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function rescaleCurrencySeriesToCurrent(currency, series) {
  const points = normalizeMarketHistory(series) || [];
  if (!currency || currency.code === "USD" || points.length < 2) return points;
  const current = Number(currency.quotePerUsd);
  const latest = Number(points[points.length - 1]?.value);
  if (!Number.isFinite(current) || current <= 0 || !Number.isFinite(latest) || latest <= 0) {
    return points;
  }
  const scale = current / latest;
  return points.map((point, index) => ({
    ...point,
    value: index === points.length - 1 ? current : point.value * scale
  }));
}

function currencyDisplayDate(currency) {
  if (currency?.date) return String(currency.date);
  const histories = [currency?.shortHistory, currency?.history, currency?.denseHistory];
  for (const history of histories) {
    const points = normalizeMarketHistory(history) || [];
    const last = points.filter(point => point.time || point.date).at(-1);
    if (last?.date) return String(last.date);
    if (last?.time) return String(last.time).slice(0, 10);
  }
  return currencyDate || "";
}

function currencyPairDisplayDate(anchor, quote) {
  const quoteDate = currencyDisplayDate(quote);
  const anchorDate = anchor?.code === "USD" ? quoteDate : currencyDisplayDate(anchor);
  if (quoteDate && anchorDate && quoteDate !== anchorDate) return `${anchorDate} / ${quoteDate}`;
  return quoteDate || anchorDate || currencyDate || "";
}

function currencyHistorySeries(currency, range = selectedCurrencyRange) {
  if (!currency) return [];
  if (currency.code === "USD") return [];
  const history = normalizeMarketHistory(currency.history) || [];
  const dated = history.filter(point => pointTime(point));
  const shortHistory = normalizeMarketHistory(currency.shortHistory) || [];
  const shortDated = shortHistory.filter(point => pointTime(point));
  if ((range === "1d" || range === "5d" || range === "1m") && shortDated.length >= 2) {
    const filtered = pointsWithinDays(shortDated, range === "1d" ? 1 : range === "5d" ? 5 : 31);
    if (range === "1d" && !hasDenseIntradayPoints(filtered)) return [];
    if (filtered.length >= 2) return rescaleCurrencySeriesToCurrent(currency, filtered);
  }

  const denseHistory = normalizeMarketHistory(currency.denseHistory) || [];
  const denseDated = denseHistory.filter(point => pointTime(point));
  if (denseDated.length >= 2) {
    if (range === "all") {
      if (dated.length >= 2 && chartSpanDays(dated) > chartSpanDays(denseDated) + 30) return rescaleCurrencySeriesToCurrent(currency, dated);
      return rescaleCurrencySeriesToCurrent(currency, denseDated);
    }
    if (range === "1d") return [];
    if (range === "5d") return rescaleCurrencySeriesToCurrent(currency, denseDated.slice(-5));
    if (range === "1m") return rescaleCurrencySeriesToCurrent(currency, denseDated.slice(-31));
    const lastTime = Math.max(...denseDated.map(pointTime));
    const day = 24 * 60 * 60 * 1000;
    const days = range === "1y" ? 365 : range === "5y" ? 365 * 5 : null;
    if (days) {
      const filtered = denseDated.filter(point => pointTime(point) >= lastTime - days * day);
      if (filtered.length >= 2) return rescaleCurrencySeriesToCurrent(currency, filtered);
    }
  }

  return rescaleCurrencySeriesToCurrent(currency, dated.length >= 2 ? dated : history);
}

function currencyPointKey(point) {
  return point?.time || point?.date || point?.label || "";
}

function constantCurrencySeries(currency, template) {
  if (!currency || currency.code !== "USD") return [];
  return template.map(point => ({
    label: point.label,
    date: point.date,
    time: point.time,
    value: 1
  }));
}

function latestCurrencyTimestamp(...currencies) {
  const times = [];
  currencies.forEach(currency => {
    const displayDate = currencyDisplayDate(currency);
    const displayTime = Date.parse(displayDate);
    if (Number.isFinite(displayTime)) times.push(displayTime);
    [currency?.shortHistory, currency?.history, currency?.denseHistory].forEach(history => {
      (normalizeMarketHistory(history) || []).forEach(point => {
        const time = pointTimestamp(point);
        if (Number.isFinite(time)) times.push(time);
      });
    });
  });
  return times.length ? Math.max(...times) : Date.now();
}

function currencyFlatRangeDays(range = selectedCurrencyRange) {
  if (range === "1d") return 1;
  if (range === "5d") return 5;
  if (range === "1m") return 31;
  if (range === "1y") return 365;
  if (range === "5y") return 365 * 5;
  return 365 * 5;
}

function flatCurrencyPairHistory(anchor, quote, range = selectedCurrencyRange) {
  const rate = currencyPairRate(anchor, quote);
  if (!Number.isFinite(rate) || rate <= 0) return [];
  const end = latestCurrencyTimestamp(anchor, quote);
  const start = end - currencyFlatRangeDays(range) * 24 * 60 * 60 * 1000;
  return [
    {
      label: range.toUpperCase(),
      date: localDateKey(start),
      time: new Date(start).toISOString(),
      value: rate,
      flat: true
    },
    {
      label: "Now",
      date: localDateKey(end),
      time: new Date(end).toISOString(),
      value: rate,
      flat: true
    }
  ];
}

function currencyPairHistory(anchor, quote, range = selectedCurrencyRange) {
  if (!anchor || !quote) return [];
  let anchorSeries = currencyHistorySeries(anchor, range);
  let quoteSeries = currencyHistorySeries(quote, range);
  if (anchor.code === "USD") anchorSeries = constantCurrencySeries(anchor, quoteSeries);
  if (quote.code === "USD") quoteSeries = constantCurrencySeries(quote, anchorSeries);
  const anchorMap = new Map(anchorSeries.map(point => [currencyPointKey(point), point]));
  const quoteMap = new Map(quoteSeries.map(point => [currencyPointKey(point), point]));
  return Array.from(new Set([...anchorMap.keys(), ...quoteMap.keys()]))
    .filter(key => anchorMap.has(key) && quoteMap.has(key))
    .sort((left, right) => pointTime(anchorMap.get(left) || quoteMap.get(left)) - pointTime(anchorMap.get(right) || quoteMap.get(right)))
    .map(date => {
      const anchorPoint = anchorMap.get(date);
      const quotePoint = quoteMap.get(date);
      const anchorPerUsd = Number(anchorPoint?.value);
      const quotePerUsd = Number(quotePoint?.value);
      if (!anchorPerUsd || !quotePerUsd) return null;
      return {
        date: quotePoint?.date || anchorPoint?.date || date,
        time: quotePoint?.time || anchorPoint?.time || null,
        label: quotePoint?.label || anchorPoint?.label || date,
        value: quotePerUsd / anchorPerUsd,
      };
    })
    .filter(Boolean);
}

function inferredPreviousUsdValue(currency) {
  const value = Number(currency?.usdValue);
  const pct = Number(currency?.changePct);
  if (!Number.isFinite(value) || !Number.isFinite(pct) || pct <= -99.99) return null;
  return value / (1 + pct / 100);
}

function currencyPairChangePct(anchor, quote) {
  if (!anchor || !quote || anchor.code === quote.code) return 0;
  const history = currencyPairHistory(anchor, quote);
  if (history.length >= 2) {
    const current = Number(history[history.length - 1].value);
    const previous = Number(history[history.length - 2].value);
    if (Number.isFinite(current) && Number.isFinite(previous) && previous) {
      return ((current - previous) / previous) * 100;
    }
  }
  const anchorPrevious = inferredPreviousUsdValue(anchor);
  const quotePrevious = inferredPreviousUsdValue(quote);
  const currentRate = currencyPairRate(anchor, quote);
  if (!anchorPrevious || !quotePrevious || !currentRate) return null;
  const previousRate = anchorPrevious / quotePrevious;
  return previousRate ? ((currentRate - previousRate) / previousRate) * 100 : null;
}

function currencyChangeClass(value) {
  const numeric = Number(value);
  if (numeric > 0) return "positive";
  if (numeric < 0) return "negative";
  return "";
}

function formatExchangeNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "--";
  const abs = Math.abs(numeric);
  const maximumFractionDigits = abs >= 1000 ? 0 : abs >= 100 ? 2 : abs >= 10 ? 3 : abs >= 1 ? 4 : abs >= 0.01 ? 5 : 8;
  return new Intl.NumberFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", {
    maximumFractionDigits,
    minimumFractionDigits: abs >= 1 ? 0 : Math.min(2, maximumFractionDigits)
  }).format(numeric);
}

function formatExchangeAxisNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "--";
  const abs = Math.abs(numeric);
  if (abs > 0 && abs < 0.0001) {
    return numeric.toFixed(8).replace(/0+$/, "").replace(/\.$/, ".0");
  }
  return formatExchangeNumber(numeric);
}

function formatCurrencyPair(anchor, quote) {
  const rate = currencyPairRate(anchor, quote);
  return `1 ${anchor?.code || "--"} = ${formatExchangeNumber(rate)} ${quote?.code || "--"}`;
}

function formatCurrencyChange(anchor, quote) {
  const pct = currencyPairChangePct(anchor, quote);
  if (!Number.isFinite(Number(pct))) return "--";
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
}

function formatCurrencyChartValue(code, value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "--";
  return `${formatExchangeNumber(numeric)} ${code || ""}`.trim();
}

function marketGroupKey(group) {
  if (group === "metals") return "marketGroupMetals";
  if (group === "crypto") return "marketGroupCrypto";
  if (group === "fx") return "marketGroupFx";
  if (group === "commodities") return "marketGroupCommodities";
  if (group === "companies") return "marketGroupCompanies";
  return "marketGroupIndices";
}

function marketGroupLabel(group) {
  return t(marketGroupKey(group));
}

function marketGroupsAvailable() {
  return new Set(marketAssets.map(asset => asset.group).filter(Boolean));
}

function onlyCompanyMarketData() {
  const groups = marketGroupsAvailable();
  return groups.size === 1 && groups.has("companies");
}

function isAllAssetsMarketData() {
  const groups = marketGroupsAvailable();
  return groups.has("metals") || groups.has("crypto");
}

function marketRangeLabel(range) {
  return t(`range${range.charAt(0).toUpperCase()}${range.slice(1)}`);
}

function marketDecimals(asset) {
  if (Number.isFinite(asset?.decimals)) return asset.decimals;
  const value = Math.abs(Number(asset?.value));
  if (asset?.group === "fx") return 4;
  if (value >= 1000) return 0;
  if (value >= 100) return 1;
  return 2;
}

function formatAssetPrice(asset) {
  const value = Number(asset?.value);
  if (!Number.isFinite(value)) return "--";
  const decimals = marketDecimals(asset);
  const formatted = new Intl.NumberFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", {
    minimumFractionDigits: asset?.group === "fx" ? decimals : 0,
    maximumFractionDigits: decimals
  }).format(value);
  if (asset?.unit === "USD" || String(asset?.unit || "").startsWith("USD/")) {
    return `$${formatted}${asset.unit === "USD" ? "" : ` ${asset.unit.replace("USD/", "/")}`}`;
  }
  return asset?.unit ? `${formatted} ${asset.unit}` : formatted;
}

function formatCompactCurrency(value, maximumFractionDigits = 1, minimumFractionDigits = 0) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "--";
  return new Intl.NumberFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    minimumFractionDigits,
    maximumFractionDigits
  }).format(numeric);
}

function formatMarketCapCurrency(value) {
  return formatCompactCurrency(value, 2, 2);
}

function formatPrimaryMarketValue(asset) {
  if (Number.isFinite(Number(asset?.marketCap))) {
    return formatMarketCapCurrency(asset.marketCap);
  }
  return formatAssetPrice(asset);
}

function formatMarketChange(asset) {
  const pct = Number(asset?.changePct);
  if (!Number.isFinite(pct)) return "--";
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
}

function marketChangeClass(asset) {
  const pct = Number(asset?.changePct);
  if (pct > 0) return "positive";
  if (pct < 0) return "negative";
  return "";
}

function marketHistory(asset) {
  const history = normalizeMarketHistory(asset?.history);
  return history || [];
}

function denseMarketHistory(asset) {
  const history = normalizeMarketHistory(asset?.denseHistory);
  return history || [];
}

function shortMarketHistory(asset) {
  const history = normalizeMarketHistory(asset?.shortHistory);
  return history || [];
}

function rangeMarketHistory(asset, range = selectedMarketRange) {
  const history = normalizeMarketHistory(asset?.rangeHistories?.[range]);
  return history || [];
}

function canFetchMarketHistory(asset) {
  return !!asset
    && ["companies", "metals", "crypto"].includes(asset.group)
    && !!(asset.historyUrl || asset.symbol);
}

function pointTime(point) {
  const raw = point?.time || point?.date;
  if (!raw) return null;
  const time = Date.parse(raw);
  return Number.isFinite(time) ? time : null;
}

function marketHistorySpanDays(points) {
  const times = (points || []).map(pointTime).filter(Number.isFinite);
  if (times.length < 2) return 0;
  return (Math.max(...times) - Math.min(...times)) / (24 * 60 * 60 * 1000);
}

function pointsWithinDays(points, days) {
  const dated = (points || []).filter(point => pointTime(point));
  if (!dated.length) return [];
  const lastTime = Math.max(...dated.map(pointTime));
  const day = 24 * 60 * 60 * 1000;
  return dated.filter(point => {
    const time = pointTime(point);
    return time >= lastTime - days * day && time <= lastTime + 5 * 60 * 1000;
  });
}

function localDateKey(time) {
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function pointLocalDateKey(point) {
  const time = pointTime(point);
  return time ? localDateKey(time) : null;
}

function todaysIntradaySession(points) {
  const dated = (points || [])
    .filter(point => pointTime(point))
    .sort((left, right) => pointTime(left) - pointTime(right));
  if (!dated.length) return [];
  const todayKey = localDateKey(Date.now());
  return dated.filter(point => pointLocalDateKey(point) === todayKey);
}

function hasDenseIntradayPoints(points, minPoints = 30) {
  const dated = (points || [])
    .filter(point => pointTime(point))
    .sort((left, right) => pointTime(left) - pointTime(right));
  if (dated.length < minPoints) return false;
  const gaps = [];
  for (let index = 1; index < dated.length; index += 1) {
    const gap = pointTime(dated[index]) - pointTime(dated[index - 1]);
    if (Number.isFinite(gap) && gap > 0) gaps.push(gap);
  }
  if (!gaps.length) return false;
  gaps.sort((left, right) => left - right);
  const medianGap = gaps[Math.floor(gaps.length / 2)];
  return medianGap <= 20 * 60 * 1000;
}

function intradayMarketHistory(points) {
  const recent = pointsWithinDays(points, 1);
  if (hasDenseIntradayPoints(recent)) return recent;
  const todaySession = todaysIntradaySession(points);
  if (hasDenseIntradayPoints(todaySession, 2)) return todaySession;
  return [];
}

function marketRangeDays(range) {
  if (range === "1d") return 1;
  if (range === "5d") return 5;
  if (range === "1m") return 31;
  return null;
}

function marketRangeMinimumSpanDays(range) {
  if (range === "5d") return 2.5;
  if (range === "1m") return 20;
  return 0;
}

function marketShortHistoryCoversRange(points, range = selectedMarketRange) {
  const dated = (points || []).filter(point => pointTime(point));
  if (range === "1d") return intradayMarketHistory(dated).length >= 2;
  const days = marketRangeDays(range);
  if (!days) return false;
  const filtered = pointsWithinDays(dated, days);
  if (filtered.length < 2) return false;
  return marketHistorySpanDays(filtered) >= marketRangeMinimumSpanDays(range);
}

function currentMarketChartValue(asset) {
  if (!asset) return null;
  const marketCap = Number(asset.marketCap);
  if (asset.group === "companies" && Number.isFinite(marketCap) && marketCap > 0) {
    return { value: marketCap, valueKind: "marketCap" };
  }
  const value = Number(asset.value);
  if (Number.isFinite(value) && value > 0) {
    return { value, valueKind: asset.group === "companies" ? "marketCap" : "price" };
  }
  return null;
}

function flatMarketHistory(asset, range = selectedMarketRange) {
  const days = marketRangeDays(range);
  const current = currentMarketChartValue(asset);
  if (!days || !current) return [];
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;
  return [
    {
      label: range.toUpperCase(),
      time: new Date(start).toISOString(),
      date: localDateKey(start),
      value: current.value,
      valueKind: current.valueKind,
      flat: true
    },
    {
      label: "Now",
      time: new Date(end).toISOString(),
      date: localDateKey(end),
      value: current.value,
      valueKind: current.valueKind,
      flat: true
    }
  ];
}

function marketHistoryLoadFailedForRange(asset, range = selectedMarketRange) {
  return asset?.historyLoadFailed === true && (!asset.historyLoadFailedRange || asset.historyLoadFailedRange === range);
}

function shouldUseFlatMarketFallback(asset, range = selectedMarketRange) {
  return !!marketRangeDays(range)
    && !!currentMarketChartValue(asset)
    && (marketHistoryLoadFailedForRange(asset, range) || !canFetchMarketHistory(asset));
}

function actualRangedMarketHistory(asset, range = selectedMarketRange) {
  if (range === "1d" || range === "5d" || range === "1m") {
    const exactHistory = rangeMarketHistory(asset, range);
    const exactDated = exactHistory.filter(point => pointTime(point));
    if (marketShortHistoryCoversRange(exactDated, range)) {
      if (range === "1d") return intradayMarketHistory(exactDated);
      return pointsWithinDays(exactDated, range === "5d" ? 5 : 31);
    }
  }

  const shortHistory = shortMarketHistory(asset);
  const shortDated = shortHistory.filter(point => pointTime(point));
  if ((range === "1d" || range === "5d" || range === "1m") && shortDated.length >= 2) {
    if (range === "1d") {
      const intraday = intradayMarketHistory(shortDated);
      if (intraday.length >= 2) return intraday;
      return [];
    }
    const filtered = pointsWithinDays(shortDated, range === "1d" ? 1 : range === "5d" ? 5 : 31);
    if (filtered.length >= 2 && marketShortHistoryCoversRange(shortDated, range)) return filtered;
  }

  const denseHistory = denseMarketHistory(asset);
  const denseDated = denseHistory.filter(point => pointTime(point));
  if (denseDated.length >= 2 && range !== "all") {
    if (range === "1d") return [];
    if (range === "5d" || range === "1m") {
      const filtered = pointsWithinDays(denseDated, range === "5d" ? 5 : 31);
      return filtered.length >= 2 && marketHistorySpanDays(filtered) >= marketRangeMinimumSpanDays(range) ? filtered : [];
    }
    const lastTime = Math.max(...denseDated.map(pointTime));
    const day = 24 * 60 * 60 * 1000;
    const days = range === "1y" ? 365 : range === "5y" ? 365 * 5 : null;
    if (days) {
      const cutoff = lastTime - days * day;
      const filtered = denseDated.filter(point => pointTime(point) >= cutoff);
      if (filtered.length >= 2) return filtered;
    }
  }

  const fullHistory = marketHistory(asset);
  const hasDatedHistory = fullHistory.some(point => pointTime(point));

  if (range === "all") {
    if (fullHistory.length >= 2 && chartSpanDays(fullHistory) > chartSpanDays(denseDated) + 30) return fullHistory;
    return denseDated.length >= 2 ? denseDated : fullHistory;
  }
  if (!fullHistory.length) {
    if (range === "1d" || range === "5d" || range === "1m") return [];
    return denseDated.length >= 2 ? denseDated : [];
  }

  if (!hasDatedHistory) {
    if (range === "5y") return fullHistory.slice(-6);
    return [];
  }

  if (range === "1d") return [];
  if (range === "5d" || range === "1m") {
    const filtered = pointsWithinDays(fullHistory, range === "5d" ? 5 : 31);
    return filtered.length >= 2 && marketHistorySpanDays(filtered) >= marketRangeMinimumSpanDays(range) ? filtered : [];
  }

  const dated = fullHistory.filter(point => pointTime(point));
  const lastTime = Math.max(...dated.map(pointTime));
  const day = 24 * 60 * 60 * 1000;
  const days = range === "1y" ? 365 : range === "5y" ? 365 * 5 : null;
  if (!days) return fullHistory;
  const cutoff = lastTime - days * day;
  const filtered = dated.filter(point => pointTime(point) >= cutoff);
  return filtered.length >= 2 ? filtered : [];
}

function rangedMarketHistory(asset, range = selectedMarketRange, options = {}) {
  const actual = actualRangedMarketHistory(asset, range);
  if (actual.length >= 2) return actual;
  if (options.allowFlatFallback === false) return [];
  return shouldUseFlatMarketFallback(asset, range) ? flatMarketHistory(asset, range) : [];
}

function hasMarketHistoryForRange(asset, range = selectedMarketRange) {
  return actualRangedMarketHistory(asset, range).length >= 2;
}

function formatMarketRange(asset) {
  const history = rangedMarketHistory(asset);
  if (history.length < 2) return "--";
  if (history.some(point => point.relative)) {
    return selectedMarketRange === "1d" ? "1D sparkline" : selectedMarketRange === "5d" ? "5D sparkline" : "30D sparkline";
  }
  const values = history.map(point => point.value);
  const low = Math.min(...values);
  const high = Math.max(...values);
  return `${formatAssetPrice({ ...asset, value: low })} - ${formatAssetPrice({ ...asset, value: high })}`;
}

function translateCategory(category) {
  const normalized = category || "world";
  const key = `category${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
  return t(key);
}

function translateLocationName(value) {
  if (!value) return t("world");
  const normalized = String(value).toLowerCase();
  if (normalized === "unplaced" || normalized === "unmapped") return currentLanguage === "zh" ? "æœªå®šä½" : "Unplaced";
  if (normalized === "world") return t("world");
  if (normalized === "global") return t("global");
  if (currentLanguage === "zh") {
    const names = {
      beijing: "åŒ—äº¬",
      china: "ä¸­åœ‹",
      tehran: "å¾·é»‘è˜­",
      iran: "ä¼Šæœ—",
      taipei: "å°åŒ—",
      taiwan: "å°ç£",
      moscow: "èŽ«æ–¯ç§‘",
      russia: "ä¿„ç¾…æ–¯",
      kyiv: "åŸºè¼”",
      kiev: "åŸºè¼”",
      ukraine: "çƒå…‹è˜­",
      gaza: "åŠ è–©",
      "palestinian territories": "å·´å‹’æ–¯å¦é ˜åœŸ",
      jerusalem: "è€¶è·¯æ’’å†·",
      israel: "ä»¥è‰²åˆ—",
      lebanon: "é»Žå·´å«©",
      "abu dhabi": "é˜¿å¸ƒé”æ¯”",
      uae: "é˜¿è¯é…‹",
      "united arab emirates": "é˜¿è¯é…‹",
      riga: "é‡ŒåŠ ",
      latvia: "æ‹‰è„«ç¶­äºž",
      havana: "å“ˆç“¦é‚£",
      cuba: "å¤å·´",
      caracas: "å¡æ‹‰å¡æ–¯",
      venezuela: "å§”å…§ç‘žæ‹‰",
      washington: "è¯ç››é “",
      "united states": "ç¾Žåœ‹",
      "new york": "ç´ç´„",
      london: "å€«æ•¦",
      "united kingdom": "è‹±åœ‹",
      brussels: "å¸ƒé­¯å¡žçˆ¾",
      belgium: "æ¯”åˆ©æ™‚",
      doha: "æœå“ˆ",
      qatar: "å¡é”",
      tokyo: "æ±äº¬",
      japan: "æ—¥æœ¬",
      seoul: "é¦–çˆ¾",
      "south korea": "å—éŸ“",
      "new delhi": "æ–°å¾·é‡Œ",
      india: "å°åº¦",
      islamabad: "ä¼Šæ–¯è˜­å ¡",
      pakistan: "å·´åŸºæ–¯å¦",
      bangkok: "æ›¼è°·",
      thailand: "æ³°åœ‹",
      jakarta: "é›…åŠ é”",
      indonesia: "å°å°¼",
      sydney: "æ‚‰å°¼",
      australia: "æ¾³å¤§åˆ©äºž",
      "sao paulo": "è–ä¿ç¾…",
      brazil: "å·´è¥¿"
    };
    if (names[normalized]) return names[normalized];
  }
  return value;
}

function normalizedReportKey(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[â€˜â€™]/g, "'")
    .replace(/[â€œâ€]/g, "\"")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function firstReportWord(text) {
  const match = String(text || "").toLowerCase().match(/[a-z0-9]+/);
  return match ? match[0] : "";
}

function keyHasPhrase(key, phrase) {
  return ` ${key} `.includes(` ${phrase} `);
}

function isQuestionLikeReport(title) {
  const questionStarters = new Set([
    "can", "could", "did", "does", "do", "how", "is", "should",
    "what", "when", "where", "why", "will", "would"
  ]);
  return String(title || "").includes("?") || questionStarters.has(firstReportWord(title));
}

function hasAnyReportPhrase(key, phrases) {
  return phrases.some(phrase => keyHasPhrase(key, phrase));
}

function hasConcreteEventSignal(key) {
  return hasAnyReportPhrase(key, [
    "advances", "announces", "announced", "arrives", "attack", "attacks",
    "blames", "called off", "ceasefire", "conducts", "delays", "delayed",
    "detains", "drone", "earthquake", "election", "expel", "fire", "flood",
    "imposes", "jails", "kill", "killed", "kills", "launches", "meeting",
    "meet", "meets", "missile", "orders", "passes", "pauses", "postponed",
    "reaches deal", "reports", "resolution", "rises", "rules", "sanction",
    "sentences", "signs deal", "strike", "strikes", "surge",
    "surges", "summit", "tariff", "visit", "visits", "vote",
    "wins"
  ]);
}

function hasHardEventSignal(key) {
  return hasAnyReportPhrase(key, [
    "attack", "attacks", "ceasefire", "conducts", "death toll", "drone",
    "earthquake", "flood", "imposes", "kill", "killed", "kills", "launches",
    "missile", "sanction", "strike", "strikes", "summit"
  ]);
}

function isIndirectOrIntentReport(key) {
  const indirectSources = [
    "activists say", "advocates say", "analysts say", "campaigners say",
    "critics say", "experts say", "groups say", "rights group says",
    "rights groups say"
  ];
  const intentionPhrases = [
    "aims to", "expected to", "plans to", "planning to", "seeking to",
    "seeks to", "set to", "tries to", "trying to", "wants to"
  ];
  const intentionAllowed = [
    "announces", "announced", "called off", "delays", "delayed",
    "imposes", "orders", "pauses", "postponed"
  ];
  if (hasAnyReportPhrase(key, indirectSources) && !hasHardEventSignal(key)) return true;
  return hasAnyReportPhrase(key, intentionPhrases) && !hasAnyReportPhrase(key, intentionAllowed);
}

function eventTimeValue(event) {
  const value = Date.parse(event?.published || "");
  return Number.isFinite(value) ? value : 0;
}

function eventWindowDays(event) {
  const severity = Number(event?.severity || 1);
  if (severity >= 5) return 21;
  if (severity >= 4) return 7;
  return 3;
}

function isEventFreshEnough(event) {
  const published = Date.parse(event?.published || "");
  if (!Number.isFinite(published)) return false;
  const ageDays = (Date.now() - published) / 86400000;
  return ageDays <= eventWindowDays(event);
}

function isReportableEvent(event) {
  const title = event?.title || "";
  const titleKey = normalizedReportKey(title);
  if (!titleKey) return false;
  if (!isEventFreshEnough(event)) return false;
  if (hasAnyReportPhrase(titleKey, [
    "as it happened", "comment", "commentary", "live", "podcast", "opinion",
    "analysis", "explainer", "what we know", "what to know",
    "your questions answered", "takeaways", "travelogue", "review"
  ])) {
    return false;
  }
  if (isQuestionLikeReport(title)) {
    return false;
  }
  if (
    hasAnyReportPhrase(titleKey, ["could", "if", "may", "might", "possible", "chance", "fears", "concerns", "threat", "threats"]) &&
    !hasAnyReportPhrase(titleKey, ["called off", "delays", "delayed", "pauses", "postponed"])
  ) {
    return false;
  }
  if (isIndirectOrIntentReport(titleKey)) {
    return false;
  }
  return hasConcreteEventSignal(titleKey);
}

function eventDedupePlaceKey(event) {
  if (Number.isFinite(event?.lat) && Number.isFinite(event?.lon)) {
    return `${Number(event.lat).toFixed(1)}|${Number(event.lon).toFixed(1)}`;
  }
  return `${String(event?.location || "").toLowerCase()}|${String(event?.country || "").toLowerCase()}`;
}

function cjkNgrams(text) {
  const chars = Array.from(String(text || "").matchAll(/[\u3400-\u9fff]/gu), match => match[0]);
  const grams = [];
  for (const size of [2, 3]) {
    for (let index = 0; index <= chars.length - size; index += 1) {
      grams.push(chars.slice(index, index + size).join(""));
    }
  }
  return grams;
}

function normalizeDedupeWord(word) {
  const aliases = {
    attacked: "attack",
    attacks: "attack",
    hails: "hail",
    killed: "kill",
    kills: "kill",
    meeting: "meet",
    meets: "meet",
    met: "meet",
    strikes: "strike",
    striking: "strike"
  };
  const normalized = aliases[word] || word;
  return normalized.length > 4 && normalized.endsWith("s") ? normalized.slice(0, -1) : normalized;
}

function eventDedupeRawText(event) {
  return [
    event?.statement || event?.title || "",
    event?.statement_zh || event?.title_zh || ""
  ].join(" ");
}

function eventDedupeEntityTokens(event) {
  const rawText = eventDedupeRawText(event);
  const entityWords = new Set([
    "beijing", "china", "gaza", "hezbollah", "iran", "israel", "israeli",
    "jinping", "lebanon", "palestinian", "putin", "russia", "russian",
    "taiwan", "trump", "xi"
  ]);
  const tokens = normalizedReportKey(rawText)
    .split(" ")
    .map(normalizeDedupeWord)
    .filter(word => entityWords.has(word));
  const aliases = [
    { pattern: /ä¹ è¿‘å¹³|ç¿’è¿‘å¹³/u, token: "xi" },
    { pattern: /æ™®äº¬|æ™®ä¸/u, token: "putin" },
    { pattern: /å·æ™®|ç‰¹æœ—æ™®/u, token: "trump" },
    { pattern: /ä¸­å›½|ä¸­åœ‹|è®¿åŽ|è¨ªè¯/u, token: "china" },
    { pattern: /åŒ—äº¬/u, token: "beijing" },
    { pattern: /ä¿„ä¸­|ä¸­ä¿„/u, token: "russia" }
  ];
  aliases.forEach(({ pattern, token }) => {
    if (pattern.test(rawText)) tokens.push(token);
  });
  return tokens;
}

function eventDedupeTokens(event) {
  const stopWords = new Set([
    "a", "an", "and", "are", "as", "at", "after", "before", "between", "but",
    "by", "for", "from", "he", "in", "into", "is", "it", "new", "of", "on",
    "or", "over", "s", "the", "to", "with", "world"
  ]);
  const shortWords = new Set(["eu", "uk", "un", "us", "xi"]);
  const rawText = eventDedupeRawText(event);
  const wordTokens = normalizedReportKey(rawText)
    .split(" ")
    .map(normalizeDedupeWord)
    .filter(word => !stopWords.has(word) && (word.length > 2 || shortWords.has(word)));
  return [...wordTokens, ...cjkNgrams(rawText)];
}

function tokenSimilarity(a, b) {
  const left = new Set(a);
  const right = new Set(b);
  if (!left.size || !right.size) return 0;
  let shared = 0;
  left.forEach(word => {
    if (right.has(word)) shared += 1;
  });
  return shared / Math.min(left.size, right.size);
}

function isSimilarEvent(a, b) {
  const aEntities = new Set(eventDedupeEntityTokens(a));
  const bEntities = new Set(eventDedupeEntityTokens(b));
  let sharedEntities = 0;
  if (aEntities.size && bEntities.size) {
    aEntities.forEach(entity => {
      if (bEntities.has(entity)) sharedEntities += 1;
    });
  }
  const entityRatio = aEntities.size && bEntities.size
    ? sharedEntities / Math.min(aEntities.size, bEntities.size)
    : 0;
  if (eventDedupePlaceKey(a) !== eventDedupePlaceKey(b)) {
    return sharedEntities >= 3 && entityRatio >= 0.7;
  }
  if (aEntities.size && bEntities.size) {
    if (sharedEntities >= 2 && entityRatio >= 0.66) {
      return true;
    }
  }
  return tokenSimilarity(eventDedupeTokens(a), eventDedupeTokens(b)) >= 0.52;
}

function dedupeSimilarEvents(nextEvents) {
  const deduped = [];
  for (const event of nextEvents) {
    const duplicateIndex = deduped.findIndex(existing => isSimilarEvent(existing, event));
    if (duplicateIndex === -1) {
      deduped.push(event);
      continue;
    }

    const existing = deduped[duplicateIndex];
    if (eventTimeValue(event) > eventTimeValue(existing)) {
      deduped[duplicateIndex] = event;
    }
  }
  return deduped;
}

function normalizeEventList(nextEvents) {
  const filtered = (Array.isArray(nextEvents) ? nextEvents : [])
    .filter(event => event && event.id && event.title)
    .filter(isReportableEvent)
    .filter(event => directReportSourceText(event));
  return dedupeSimilarEvents(filtered)
    .slice(0, 30);
}

function rewriteReportText(text) {
  const key = normalizedReportKey(text);
  if (!key) return "";

  if (key.includes("us senate") && key.includes("curb") && key.includes("war") && key.includes("iran")) {
    return "ç¾Žåœ‹åƒè­°é™¢æŽ¨é€²æ±ºè­°ï¼Œé™åˆ¶å·æ™®å°ä¼Šæœ—å‹•æ­¦çš„æ¬ŠåŠ›";
  }
  if (key.includes("trump") && key.includes("rescue") && key.includes("venezuela")) {
    return "å§”å…§ç‘žæ‹‰å‰ç¸½çµ±é¦¬æœç¾…é­ç¾Žæ–¹å¸¶èµ°å¾Œï¼Œç¯€ç›®è¿½å•å·æ™®æ˜¯å¦çœŸçš„ã€Œæ‹¯æ•‘ã€äº†å§”å…§ç‘žæ‹‰";
  }
  if (key.includes("venezuela") && key.includes("maduro")) {
    return "å§”å…§ç‘žæ‹‰å±€å‹¢èˆ‡å‰ç¸½çµ±é¦¬æœç¾…é­ç¾Žæ–¹å¸¶èµ°äº‹ä»¶ä»å—é—œæ³¨";
  }
  if (key.includes("putin") && key.includes("arrives") && key.includes("beijing")) {
    return "æ™®äº¬æŠµé”åŒ—äº¬å±•é–‹è¨ªå•ï¼Œç·ŠæŽ¥åœ¨å·æ™®è¨ªè¯ä¹‹å¾Œ";
  }
  if (key.includes("iran war") && key.includes("tehran warns") && key.includes("surprises")) {
    return "å¾·é»‘è˜­è­¦å‘Šè‹¥è¡çªæ¢å¾©ï¼Œä¼Šæœ—å°‡æŽ¡å–æ›´å¤šååˆ¶è¡Œå‹•";
  }
  if (key.includes("israeli strikes") && key.includes("lebanon") && key.includes("kill")) {
    return "ä»¥è‰²åˆ—ç©ºè¥²é»Žå·´å«©é€ æˆè‡³å°‘ 19 äººæ­»äº¡ï¼Œèˆ‡çœŸä¸»é»¨è¡çªä»åœ¨å»¶ç‡’";
  }
  if (key.includes("putin meets xi")) {
    return "æ™®äº¬èˆ‡ç¿’è¿‘å¹³æœƒé¢";
  }
  if (key.includes("xi jinping") && key.includes("putin") && key.includes("meet") && key.includes("beijing")) {
    return "ç¿’è¿‘å¹³èˆ‡æ™®äº¬åœ¨åŒ—äº¬æœƒé¢";
  }
  if (key.includes("taiwan travelogue") && key.includes("booker prize")) {
    return "ã€Šå°ç£æ¼«éŠéŒ„ã€‹ç²å¾— 2026 å¹´åœ‹éš›å¸ƒå…‹çŽ";
  }
  if (key.includes("15 800") && key.includes("russia") && key.includes("ukraine")) {
    return "è¯åˆåœ‹ç¨±ä¿„çƒå…¨é¢æˆ°çˆ­å·²é€ æˆè¶…éŽ 15,800 äººæ­»äº¡";
  }
  if (key.includes("ukraine") && key.includes("advantage")) {
    return "çƒå…‹è˜­æŠŠæˆ°ç«æŽ¨å‘ä¿„ç¾…æ–¯å¢ƒå…§ï¼Œå¤–ç•Œé—œæ³¨å…¶æ˜¯å¦å–å¾—éšŽæ®µå„ªå‹¢";
  }
  if (key.includes("jd vance") && key.includes("locked and loaded") && key.includes("iran")) {
    return "JD èŒƒæ–¯ç¨±ç¾Žè»å·²æº–å‚™é‡å•Ÿè¡Œå‹•ï¼Œä¼Šæœ—å‰‡è­¦å‘Šå¯èƒ½é–‹é—¢æ–°æˆ°ç·š";
  }
  if (key.includes("middle east allies") && key.includes("iran war")) {
    return "å·æ™®è½‰å‘ä¸­æ±ç›Ÿå‹å°‹æ±‚å”åŠ©ï¼Œä½†çµæŸä¼Šæœ—æˆ°çˆ­çš„å”è­°ä»é›£ç”¢";
  }
  if (key.includes("big hit") && key.includes("tehran") && key.includes("deal")) {
    return "å·æ™®å¨è„…è‹¥å¾·é»‘è˜­ä¸ç›¡å¿«é”æˆå”è­°ï¼Œç¾Žæ–¹å¯èƒ½ç™¼å‹•é‡å¤§æ‰“æ“Š";
  }
  if (key.includes("putin arrives in china") && key.includes("xi jinping")) {
    return "æ™®äº¬æŠµé”ä¸­åœ‹ï¼Œæº–å‚™èˆ‡ç¿’è¿‘å¹³æœƒè«‡";
  }
  if (key.includes("sanctions") && key.includes("gaza flotilla")) {
    return "ç¾Žåœ‹åˆ¶è£åŠ è–©èˆ¹éšŠçµ„ç¹”è€…ï¼Œé­æ‰¹å£“åˆ¶å·´å‹’æ–¯å¦è²æ´è¡Œå‹•";
  }
  if (key.includes("us warns russia") && key.includes("latvia")) {
    return "èŽ«æ–¯ç§‘å¨è„…æ‹‰è„«ç¶­äºžå¾Œï¼Œç¾Žåœ‹å‘ä¿„ç¾…æ–¯ç™¼å‡ºè­¦å‘Š";
  }
  if (key.includes("uae reactor") && key.includes("nuclear plant safety")) {
    return "é˜¿è¯é…‹æ ¸åæ‡‰å †é™„è¿‘é­è¥²ï¼Œå¼•ç™¼æˆ°æ™‚æ ¸é›»å®‰å…¨æ“”æ†‚";
  }
  if (key.includes("expel") && key.includes("palestinian") && key.includes("east jerusalem")) {
    return "æ´»å‹•äººå£«ç¨±ä»¥è‰²åˆ—æ­£è©¦åœ–é©…é€æ±è€¶è·¯æ’’å†·ä¸€æ•´å€‹å·´å‹’æ–¯å¦ç¤¾å€";
  }
  if (key.includes("palestinian man") && key.includes("survival")) {
    return "ä¸€ååŠ è–©å·´å‹’æ–¯å¦è€äººå›žé¡§è‡ªå·±åœ¨æµé›¢å¤±æ‰€èˆ‡æˆ°çˆ­ä¸­çš„æ±‚ç”Ÿç¶“æ­·";
  }
  if (key.includes("putin visits china") || (key.includes("putin") && key.includes("china") && key.includes("russia ties"))) {
    return "æ™®äº¬è¨ªå•ä¸­åœ‹ï¼Œé‡ç”³ä¿„ä¸­é—œä¿‚ä¸¦è¨Žè«–é›™é‚Šåˆä½œ";
  }
  if (key.includes("russia china ties") && key.includes("stabilising")) {
    return "æ™®äº¬è¨ªè¯å‰ç¨±ä¿„ä¸­é—œä¿‚æ˜¯ç©©å®šä¸–ç•Œçš„é‡è¦åŠ›é‡";
  }
  if (key.includes("china shock") && key.includes("eu") && key.includes("imports")) {
    return "æ­ç›Ÿç”¢æ¥­å°ä¸­åœ‹é€²å£ä¾è³´å‡é«˜ï¼Œå¼•ç™¼æ–°ä¸€è¼ªã€Œä¸­åœ‹è¡æ“Šã€æ“”æ†‚";
  }
  if (key.includes("reliance on imports") && key.includes("china")) {
    return "ä¸­åœ‹é›¶çµ„ä»¶é€²å£å¢žåŠ ï¼Œå¼•ç™¼æ­æ´²ç”¢æ¥­è¢«æ“ å£“èˆ‡å°±æ¥­æµå¤±çš„è­¦å‘Š";
  }
  if (key.includes("repeated ultimatums") && key.includes("iran")) {
    return "è©•è«–ç¨±å·æ™®å°ä¼Šæœ—åè¦†ä¸‹æœ€å¾Œé€šç‰’ï¼Œæš´éœ²ç¾Žæ–¹ç±Œç¢¼ä¸è¶³";
  }
  if (key.includes("barakah nuclear plant") && key.includes("drone")) {
    return "ç„¡äººæ©Ÿè¥²æ“Šå¾Œï¼Œé˜¿è¯é…‹å·´æ‹‰å¡æ ¸é›»å» æ¢å¾©ä¾›é›»";
  }
  if (key.includes("projecting defiance") && key.includes("iran")) {
    return "åŠå³¶é›»è¦–å°ç¨±ä¼Šæœ—é ˜å°Žå±¤å±•ç¾å¼·ç¡¬å§¿æ…‹ï¼Œæ‹’çµ•ç¾Žæ–¹å£“åŠ›";
  }
  if (key.includes("taiwan arms") && key.includes("negotiating chip")) {
    return "å·æ™®æŠŠå°å°è»å”®ç¨±ç‚ºèˆ‡åŒ—äº¬è«‡åˆ¤ç±Œç¢¼ï¼Œå¼•ç™¼å°ç£ä¸å®‰ä¸¦è¢«ä¸­åœ‹åª’é«”åˆ©ç”¨";
  }
  if (key.includes("pakistan army chief") && key.includes("tehran") && key.includes("us israeli war")) {
    return "å·´åŸºæ–¯å¦é™¸è»åƒè¬€é•·è¨ªå•å¾·é»‘è˜­ï¼ŒæŽ¨å‹•çµæŸç¾Žä»¥å°ä¼Šæœ—æˆ°çˆ­";
  }
  if (key.includes("trump") && key.includes("us negotiators") && key.includes("iran") && key.includes("ceasefire proposal")) {
    return "å·æ™®å°‡æœƒè¦‹ç¾Žæ–¹è«‡åˆ¤ä»£è¡¨ï¼Œæ±ºå®šæ˜¯å¦æŽ¥å—ä¼Šæœ—åœç«æ–¹æ¡ˆ";
  }
  if (key.includes("overnight israeli strikes") && key.includes("gaza") && key.includes("heavy destruction")) {
    return "ä»¥è‰²åˆ—å¤œé–“ç©ºè¥²åŠ è–©ï¼Œé€ æˆå¤§è¦æ¨¡ç ´å£ž";
  }
  if (key.includes("secretary of state") && key.includes("india visit") && key.includes("modi") && key.includes("white house")) {
    return "ç¾Žåœ‹åœ‹å‹™å¿è¨ªå•å°åº¦ï¼Œé‚€è«‹èŽ«è¿ªå‰å¾€ç™½å®®";
  }
  if (key.includes("rubio") && key.includes("modi") && key.includes("india visit") && key.includes("energy")) {
    return "ç›§æ¯”å¥§è¨ªå•å°åº¦æœƒè¦‹èŽ«è¿ªï¼Œèƒ½æºè­°é¡Œæˆç‚ºæœƒè«‡é‡é»ž";
  }
  if (key.includes("double tap strike") && key.includes("medics") && key.includes("toddler") && key.includes("lebanon")) {
    return "å½±ç‰‡é¡¯ç¤ºä»¥è‰²åˆ—äºŒæ¬¡æ‰“æ“Šåœ¨é»Žå·´å«©é€ æˆé†«è­·èˆ‡å¹¼ç«¥æ­»äº¡";
  }
  if (key.includes("california") && key.includes("state of emergency") && key.includes("toxic chemical leak")) {
    return "åŠ å·žå› æœ‰æ¯’åŒ–å­¸å“æ´©æ¼å®£å¸ƒé€²å…¥ç·Šæ€¥ç‹€æ…‹";
  }
  if (key.includes("cristian mungiu") && key.includes("fjord") && key.includes("cannes")) {
    return "ç¾…é¦¬å°¼äºžå°Žæ¼”å…‹é‡Œæ–¯è’‚å®‰ ï¿½ è’™ä¹…çš„ã€ŠFjordã€‹ç²å¾—åŽåŸŽæœ€é«˜çŽ";
  }
  if (key.includes("coal mine explosion") && key.includes("china") && key.includes("82")) {
    return "ä¸­åœ‹ç…¤ç¤¦çˆ†ç‚¸é€ æˆè‡³å°‘ 82 äººæ­»äº¡";
  }
  if (key.includes("jacinta allan") && key.includes("apprenticeships") && key.includes("labor conference")) {
    return "æ¾³æ´²ç¶­å·žå·žé•·è‰¾å€«åœ¨å·¥é»¨æœƒè­°ä¸ŠæŽ¨å‡ºæ”¿åºœè³‡åŠ©å­¸å¾’è¨ˆç•«";
  }
  if (key.includes("ufo sighting reports") && key.includes("orbs")) {
    return "ç¾Žåœ‹æ”¿åºœå…¬é–‹ UFO ç›®æ“Šå ±å‘Šï¼Œç¨±æ›¾å‡ºç¾å¤§é‡çƒç‹€ç‰©é«”";
  }
  if (key.includes("trump") && key.includes("taiwan") && key.includes("china")) {
    return "å·æ™®æ¶‰å°èªªæ³•å¼•ç™¼é—œæ³¨ï¼Œä¸­åœ‹åª’é«”å€Ÿé¡Œç™¼æ®";
  }
  if (key.includes("middle east crisis") && key.includes("iran") && key.includes("nuclear")) {
    return "ä¸­æ±å±æ©Ÿå‡æº«ï¼Œå·æ™®ç¨±æœ‰æ©Ÿæœƒé”æˆå”è­°é˜»æ­¢ä¼Šæœ—å–å¾—æ ¸æ­¦";
  }
  if ((key.includes("called off") || key.includes("call off")) && key.includes("iran") && (key.includes("strike") || key.includes("attack"))) {
    return "å·æ™®ç¨±æ‡‰æµ·ç£ç›Ÿå‹è¦æ±‚å–æ¶ˆå°ä¼Šæœ—æ”»æ“Š";
  }
  if (key.includes("iran war") && key.includes("gulf")) {
    return "ä¼Šæœ—æˆ°çˆ­å±€å‹¢æ›´æ–°ï¼šå·æ™®ç¨±æ‡‰æµ·ç£ç›Ÿå‹è¦æ±‚æŽ¨é²æ”»æ“Š";
  }
  if (key.includes("called off") && key.includes("iran attack")) {
    return "å·æ™®ç¨±æ‡‰æµ·ç£åœ‹å®¶è¦æ±‚å–æ¶ˆæ–°ä¸€è¼ªå°ä¼Šæœ—æ”»æ“Š";
  }
  if (key.includes("planned attack") && key.includes("iran") && key.includes("proposal")) {
    return "å¾·é»‘è˜­æå‡ºæ–°æ–¹æ¡ˆå¾Œï¼Œå·æ™®ç¨±å°ä¼Šæœ—æ”»æ“Šè¨ˆç•«å·²æŽ¨é²";
  }
  if (key.includes("scheduled attack") && key.includes("serious negotiations")) {
    return "å·æ™®ç¨±å› èªçœŸè«‡åˆ¤æ­£åœ¨é€²è¡Œï¼ŒæŽ¨é²å°ä¼Šæœ—çš„é å®šæ”»æ“Š";
  }
  if (key.includes("death toll") && key.includes("lebanon")) {
    return "ä»¥è‰²åˆ—ç©ºè¥²é»Žå·´å«©é€ æˆçš„æ­»äº¡äººæ•¸è¶…éŽ 3,000 äºº";
  }
  if (key.includes("cuba") && key.includes("bloodbath")) {
    return "å¤å·´è­¦å‘Šç¾Žåœ‹ï¼Œè‹¥æŽ¡å–è»äº‹è¡Œå‹•æé€ æˆç½é›£æ€§å¾Œæžœ";
  }
  if (key.includes("xi") && key.includes("putin") && key.includes("china")) {
    return "ç¿’è¿‘å¹³æŽ¥å¾…å·æ™®å¾Œï¼Œæº–å‚™åœ¨ä¸­åœ‹è¿ŽæŽ¥æ™®ä¸";
  }
  if (key.includes("fuel shortages") || key.includes("ryanair")) {
    return "ç‘žå®‰èˆªç©ºç¨±ç‡ƒæ²¹ä¾›æ‡‰æš«ç„¡é‡å¤§é¢¨éšªï¼Œä½†è­¦å‘Šç¥¨åƒ¹å¯èƒ½ä¸Šæ¼²";
  }
  if (key.includes("clock is ticking") && key.includes("iran")) {
    return "å’Œå¹³é€²å±•åœæ»¯ä¹‹éš›ï¼Œå·æ™®è­¦å‘Šä¼Šæœ—æ™‚é–“ä¸å¤š";
  }
  if (key.includes("ukraine") && key.includes("drone") && key.includes("russia")) {
    return "çƒå…‹è˜­å°ä¿„ç¾…æ–¯ç™¼å‹•å¤§è¦æ¨¡ç„¡äººæ©Ÿæ”»æ“Š";
  }
  if (key.includes("north korea") && key.includes("nuclear")) {
    return "åŒ—éŸ“èªç‚ºæ ¸æ­¦é¿å…äº†ä¼Šæœ—å¼å‘½é‹";
  }
  if (key.includes("u s") && key.includes("israel") && key.includes("iran")) {
    return "ç¾Žåœ‹èˆ‡ä»¥è‰²åˆ—æº–å‚™å¯èƒ½é‡æ–°èˆ‡ä¼Šæœ—çˆ†ç™¼å…¨é¢æˆ°çˆ­";
  }
  if (key.includes("uae") && key.includes("nuclear plant")) {
    return "é˜¿è¯é…‹é€šå ±æ ¸é›»å» é™„è¿‘é­æ”»æ“Šï¼Œåœ°å€é¢¨éšªå‡é«˜";
  }
  if (key.includes("taiwan") && key.includes("sovereignty")) {
    return "å°ç£ç¸½çµ±è¡¨ç¤ºä¸æœƒæŒ‘é‡è¡çªï¼Œä¹Ÿä¸æœƒæ”¾æ£„ä¸»æ¬Š";
  }
  if (key.includes("political executions") && key.includes("iran")) {
    return "æˆ°çˆ­é–‹å§‹å¾Œï¼Œä¼Šæœ—æ”¿æ²»è™•æ±ºäººæ•¸æ¿€å¢ž";
  }
  if (key.includes("kill zone") && key.includes("ukraine")) {
    return "çƒå…‹è˜­å‰ç·šæ­¦å™¨è®ŠåŒ–æ­£åœ¨æ”¹è®Šæˆ°çˆ­å½¢æ…‹";
  }

  return "";
}

function buildReportBrief(key, originalText = "") {
  const people = [];
  if (key.includes("trump")) people.push("å·æ™®");
  if (key.includes("jd vance")) people.push("JD èŒƒæ–¯");
  if (key.includes("xi")) people.push("ç¿’è¿‘å¹³");
  if (key.includes("putin")) people.push("æ™®äº¬");
  if (key.includes("zelensky")) people.push("æ¾¤é€£æ–¯åŸº");
  if (key.includes("kim jong un") || key.includes("north korea")) people.push("é‡‘æ­£æ©");

  const places = [];
  if (key.includes("iran") || key.includes("tehran")) places.push("ä¼Šæœ—");
  if (key.includes("taiwan") || key.includes("taipei")) places.push("å°ç£");
  if (key.includes("china") || key.includes("beijing")) places.push("ä¸­åœ‹");
  if (key.includes("u s") || key.includes("us ") || key.includes("united states") || key.includes("washington")) places.push("ç¾Žåœ‹");
  if (key.includes("russia") || key.includes("moscow")) places.push("ä¿„ç¾…æ–¯");
  if (key.includes("ukraine") || key.includes("kyiv")) places.push("çƒå…‹è˜­");
  if (key.includes("israel")) places.push("ä»¥è‰²åˆ—");
  if (key.includes("lebanon")) places.push("é»Žå·´å«©");
  if (key.includes("gaza") || key.includes("palestinian")) places.push("å·´å‹’æ–¯å¦");
  if (key.includes("jerusalem")) places.push("è€¶è·¯æ’’å†·");
  if (key.includes("latvia")) places.push("æ‹‰è„«ç¶­äºž");
  if (key.includes("uae") || key.includes("abu dhabi")) places.push("é˜¿è¯é…‹");
  if (key.includes("cuba")) places.push("å¤å·´");
  if (key.includes("eu ") || key.includes("europe")) places.push("æ­æ´²");

  let issue = "";
  if (key.includes("nuclear")) issue = "æ ¸è­°é¡Œ";
  else if (key.includes("sanctions")) issue = "åˆ¶è£";
  else if (key.includes("resolution") || key.includes("senate")) issue = "åœ‹æœƒæ±ºè­°";
  else if (key.includes("strike") || key.includes("attack") || key.includes("drone")) issue = "è»äº‹è¡Œå‹•";
  else if (key.includes("war")) issue = "æˆ°äº‹";
  else if (key.includes("talks") || key.includes("negotiations") || key.includes("deal")) issue = "è«‡åˆ¤";
  else if (key.includes("sovereignty") || key.includes("independent")) issue = "ä¸»æ¬Šè­°é¡Œ";
  else if (key.includes("imports") || key.includes("industry") || key.includes("debt")) issue = "ç¶“æ¿Ÿé¢¨éšª";
  else if (key.includes("fuel") || key.includes("airline")) issue = "èƒ½æºèˆ‡èˆªé‹æˆæœ¬";
  else if (key.includes("booker prize") || key.includes("travelogue")) issue = "æ–‡å­¸çŽé …";
  else if (key.includes("survival") || key.includes("expel")) issue = "äººé“è™•å¢ƒ";

  let action = "";
  if (key.includes("warn") || key.includes("warning")) action = "ç™¼å‡ºè­¦å‘Š";
  else if (key.includes("says") || key.includes("said") || key.includes("claims")) action = "ä½œå‡ºè¡¨æ…‹";
  else if (key.includes("postponed") || key.includes("delays") || key.includes("pauses") || key.includes("called off")) action = "æš«ç·©è¡Œå‹•";
  else if (key.includes("launches") || key.includes("conducts")) action = "å±•é–‹è¡Œå‹•";
  else if (key.includes("advances")) action = "å‘å‰æŽ¨é€²";
  else if (key.includes("imposes")) action = "æ­£å¼å¯¦æ–½";
  else if (key.includes("kill") || key.includes("killed")) action = "é€ æˆæ­»å‚·";
  else if (key.includes("wins")) action = "ç²å¾—è‚¯å®š";
  else if (key.includes("meets") || key.includes("arrives")) action = "å±•é–‹é«˜å±¤äº’å‹•";
  else if (key.includes("prepare") || key.includes("ready")) action = "åŠ ç·Šæº–å‚™";
  else if (key.includes("visits") || key.includes("welcome")) action = "å®‰æŽ’é«˜å±¤äº’å‹•";
  else if (key.includes("fears") || key.includes("concerns")) action = "å¼•ç™¼æ“”æ†‚";
  else action = genericReportAction(key);
  if (!action) return cleanFallbackHeadline(originalText || key);

  const actor = people.length ? people.join("ã€") : "";
  const area = places.length ? places.slice(0, 3).join("ã€") : "";

  if (actor && area && issue) return `${actor}åœç¹ž${area}${issue}${action}`;
  if (area && issue) return `${area}${issue}${action}`;
  if (actor && issue) return `${actor}å°±${issue}${action}`;
  if (area) return `${area}${action}`;
  if (issue) return `${issue}${action}`;
  return compactKeywordBrief(key, originalText);
}

function genericReportAction(key) {
  if (key.includes("support") || key.includes("supports") || key.includes("backs") || key.includes("hails")) return "ç²å¾—å…¬é–‹æ”¯æŒ";
  if (key.includes("pressure") || key.includes("crisis") || key.includes("tensions")) return "å£“åŠ›å‡é«˜";
  if (key.includes("risk") || key.includes("threat")) return "é¢¨éšªå‡é«˜";
  if (key.includes("talk") || key.includes("negotiation") || key.includes("deal")) return "è«‡åˆ¤æŽ¨é€²";
  return "";
}

function compactKeywordBrief(key, originalText = "") {
  const dictionary = {
    diplomacy: "å¤–äº¤",
    diplomatic: "å¤–äº¤",
    summit: "å³°æœƒ",
    pressure: "å£“åŠ›",
    crisis: "å±æ©Ÿ",
    conflict: "è¡çª",
    ceasefire: "åœç«",
    allies: "ç›Ÿå‹",
    president: "ç¸½çµ±",
    government: "æ”¿åºœ",
    economy: "ç¶“æ¿Ÿ",
    cooperation: "åˆä½œ",
    relations: "é—œä¿‚",
    rescue: "æ‹¯æ•‘",
    podcast: "ç¯€ç›®",
    venezuela: "å§”å…§ç‘žæ‹‰",
    maduro: "é¦¬æœç¾…",
    rights: "äººæ¬Š",
    activists: "æ´»å‹•äººå£«",
    safety: "å®‰å…¨",
    wartime: "æˆ°æ™‚",
    military: "è»äº‹",
    campaign: "è»äº‹è¡Œå‹•",
    power: "æ¬ŠåŠ›",
    international: "åœ‹éš›",
    regional: "å€åŸŸ",
    issues: "è­°é¡Œ",
    senate: "åƒè­°é™¢",
    resolution: "æ±ºè­°",
    curb: "é™åˆ¶",
    wage: "ç™¼å‹•",
    war: "æˆ°çˆ­",
    iran: "ä¼Šæœ—",
    russia: "ä¿„ç¾…æ–¯",
    china: "ä¸­åœ‹",
    taiwan: "å°ç£",
    ukraine: "çƒå…‹è˜­",
    gaza: "åŠ è–©",
    israel: "ä»¥è‰²åˆ—",
    lebanon: "é»Žå·´å«©",
    sanctions: "åˆ¶è£",
    nuclear: "æ ¸è­°é¡Œ",
    strike: "æ”»æ“Š",
    attack: "æ”»æ“Š",
    drone: "ç„¡äººæ©Ÿ",
    talks: "æœƒè«‡",
    deal: "å”è­°",
    killed: "æ­»äº¡",
    warns: "è­¦å‘Š",
    visits: "è¨ªå•",
    arrives: "æŠµé”",
    meets: "æœƒé¢",
    prize: "çŽé …",
    industry: "ç”¢æ¥­",
    imports: "é€²å£"
  };
  const stopWords = new Set([
    "a", "an", "the", "to", "of", "on", "in", "for", "and", "or", "as", "it", "is", "are",
    "with", "after", "before", "from", "by", "at", "this", "that", "live", "world"
  ]);
  const terms = key
    .split(" ")
    .filter(word => word && !stopWords.has(word))
    .map(word => dictionary[word] || "")
    .filter(Boolean);
  const uniqueTerms = [...new Set(terms)].slice(0, 6);
  return cleanFallbackHeadline(originalText || key);
}

function cleanFallbackHeadline(text) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  return cleaned.length > 96 ? `${cleaned.slice(0, 93)}...` : cleaned;
}

function translateReportText(text) {
  if (currentLanguage !== "zh" || !text) return text || "";

  const normalized = text.replace(/\s+/g, " ").trim();
  const exact = {
    "â€˜Multipolar worldâ€™: What Xi and Putin announced after Beijing summit": "åŒ—äº¬å³°æœƒå¾Œï¼Œç¿’è¿‘å¹³èˆ‡æ™®äº¬å®£å¸ƒæŽ¨å‹•ã€Œå¤šæ¥µä¸–ç•Œã€",
    "'Multipolar world': What Xi and Putin announced after Beijing summit": "åŒ—äº¬å³°æœƒå¾Œï¼Œç¿’è¿‘å¹³èˆ‡æ™®äº¬å®£å¸ƒæŽ¨å‹•ã€Œå¤šæ¥µä¸–ç•Œã€",
    "Lithuanian leaders rushed to bunkers as drone violates countryâ€™s airspace": "ç„¡äººæ©Ÿä¾µçŠ¯ç«‹é™¶å®›é ˜ç©ºï¼Œç«‹é™¶å®›é ˜å°Žäººç·Šæ€¥é€²å…¥æŽ©é«”",
    "Lithuanian leaders rushed to bunkers as drone violates country's airspace": "ç„¡äººæ©Ÿä¾µçŠ¯ç«‹é™¶å®›é ˜ç©ºï¼Œç«‹é™¶å®›é ˜å°Žäººç·Šæ€¥é€²å…¥æŽ©é«”",
    "Did Trump really rescue Venezuela? â€“ podcast": "ç¯€ç›®è¿½å•å·æ™®æ˜¯å¦çœŸçš„æ”¹è®Šäº†å§”å…§ç‘žæ‹‰å±€å‹¢",
    "Did Trump really rescue Venezuela? - podcast": "ç¯€ç›®è¿½å•å·æ™®æ˜¯å¦çœŸçš„æ”¹è®Šäº†å§”å…§ç‘žæ‹‰å±€å‹¢",
    "Death toll from Israeli strikes on Lebanon passes 3,000, officials say": "ä»¥è‰²åˆ—ç©ºè¥²é»Žå·´å«©é€ æˆçš„æ­»äº¡äººæ•¸è¶…éŽ 3,000 äººï¼Œå®˜å“¡è¡¨ç¤º",
    "Trumpâ€™s shifting remarks on Taiwan are perfect for China to exploit": "å·æ™®å°å°ç£èªªæ³•åè¦†ï¼Œæ­£å¥½çµ¦ä¸­åœ‹æ“ä½œç©ºé–“",
    "Trump's shifting remarks on Taiwan are perfect for China to exploit": "å·æ™®å°å°ç£èªªæ³•åè¦†ï¼Œæ­£å¥½çµ¦ä¸­åœ‹æ“ä½œç©ºé–“",
    "Middle East crisis live: Trump claims â€˜very good chanceâ€™ of deal to prevent Iran obtaining nuclear weapon": "ä¸­æ±å±æ©Ÿç›´æ’­ï¼šå·æ™®ç¨±å¾ˆæœ‰æ©Ÿæœƒé”æˆå”è­°ï¼Œé˜»æ­¢ä¼Šæœ—å–å¾—æ ¸æ­¦",
    "Middle East crisis live: Trump claims 'very good chance' of deal to prevent Iran obtaining nuclear weapon": "ä¸­æ±å±æ©Ÿç›´æ’­ï¼šå·æ™®ç¨±å¾ˆæœ‰æ©Ÿæœƒé”æˆå”è­°ï¼Œé˜»æ­¢ä¼Šæœ—å–å¾—æ ¸æ­¦",
    "Iran war live: Trump says Iran attack postponed at request of Gulf allies": "ä¼Šæœ—æˆ°çˆ­ç›´æ’­ï¼šå·æ™®ç¨±æ‡‰æµ·ç£ç›Ÿå‹è¦æ±‚æŽ¨é²æ”»æ“Šä¼Šæœ—",
    "Trump claims planned attack on Iran postponed after Tehran makes new proposal to end war": "å·æ™®ç¨±å¾·é»‘è˜­æå‡ºåœæˆ°æ–°æ–¹æ¡ˆå¾Œï¼Œå°ä¼Šæœ—æ”»æ“Šè¨ˆç•«å·²æŽ¨é²",
    "Xi prepares to welcome Putin to China four days after hosting Trump": "ç¿’è¿‘å¹³æŽ¥å¾…å·æ™®å››å¤©å¾Œï¼Œæº–å‚™åœ¨ä¸­åœ‹è¿ŽæŽ¥æ™®ä¸",
    "At least 87 Gaza aid flotilla activists abducted by Israel on hunger strike": "è‡³å°‘87ååŠ è–©æ´åŠ©èˆ¹éšŠæ´»å‹•äººå£«é­ä»¥è‰²åˆ—æ‰£æŠ¼å¾Œçµ•é£Ÿ",
    "Kenya transport strike paused after deadly protests": "è‚¯äºžäº¤é€šç½·å·¥åœ¨è‡´å‘½æŠ—è­°å¾Œæš«åœ",
    "Ryanair has â€˜near-zero concernsâ€™ on fuel shortages but warns of future price rises": "ç‘žå®‰èˆªç©ºç¨±å¹¾ä¹Žä¸æ“”å¿ƒç‡ƒæ²¹çŸ­ç¼ºï¼Œä½†è­¦å‘Šæœªä¾†ç¥¨åƒ¹å¯èƒ½ä¸Šæ¼²",
    "Ryanair has 'near-zero concerns' on fuel shortages but warns of future price rises": "ç‘žå®‰èˆªç©ºç¨±å¹¾ä¹Žä¸æ“”å¿ƒç‡ƒæ²¹çŸ­ç¼ºï¼Œä½†è­¦å‘Šæœªä¾†ç¥¨åƒ¹å¯èƒ½ä¸Šæ¼²",
    "Trump warns 'clock is ticking' for Iran as peace progress stalls": "å’Œå¹³é€²å±•åœæ»¯ä¹‹éš›ï¼Œå·æ™®è­¦å‘Šä¼Šæœ—ã€Œæ™‚é–“ä¸å¤šäº†ã€",
    "Ukraine launches large-scale drone strikes on Russia": "çƒå…‹è˜­å°ä¿„ç¾…æ–¯ç™¼å‹•å¤§è¦æ¨¡ç„¡äººæ©Ÿæ”»æ“Š",
    "North Korea is relieved its nuclear weapons have prevented a fate like Iran's": "åŒ—éŸ“èªç‚ºæ ¸æ­¦é¿å…äº†ä¼Šæœ—å¼å‘½é‹ï¼Œå› è€Œæ„Ÿåˆ°æ”¾å¿ƒ",
    "U.S. and Israel prepare for potential return to full-scale war with Iran": "ç¾Žåœ‹èˆ‡ä»¥è‰²åˆ—æº–å‚™å¯èƒ½é‡æ–°èˆ‡ä¼Šæœ—çˆ†ç™¼å…¨é¢æˆ°çˆ­",
    "UAE blames Iran or proxies for strike near nuclear plant, as Trump tells Tehran â€˜clock is tickingâ€™": "é˜¿è¯é…‹æŒ‡è²¬ä¼Šæœ—æˆ–å…¶ä»£ç†äººæ”»æ“Šæ ¸é›»å» é™„è¿‘ï¼Œå·æ™®å‰‡è­¦å‘Šå¾·é»‘è˜­æ™‚é–“ä¸å¤š",
    "UAE blames Iran or proxies for strike near nuclear plant, as Trump tells Tehran 'clock is ticking'": "é˜¿è¯é…‹æŒ‡è²¬ä¼Šæœ—æˆ–å…¶ä»£ç†äººæ”»æ“Šæ ¸é›»å» é™„è¿‘ï¼Œå·æ™®å‰‡è­¦å‘Šå¾·é»‘è˜­æ™‚é–“ä¸å¤š",
    "UAE reports strike near Abu Dhabi nuclear power plant": "é˜¿è¯é…‹é€šå ±é˜¿å¸ƒé”æ¯”æ ¸é›»å» é™„è¿‘é­åˆ°æ”»æ“Š",
    "Ukraine conducts large-scale drone strikes on Russia, killing 4 and wounding 12 others": "çƒå…‹è˜­å°ä¿„ç¾…æ–¯ç™¼å‹•å¤§è¦æ¨¡ç„¡äººæ©Ÿæ”»æ“Šï¼Œé€ æˆ 4 æ­» 12 å‚·",
    "Large-scale Ukrainian drone attack kills three in Moscow region, says Russia": "ä¿„ç¾…æ–¯ç¨±ï¼Œçƒå…‹è˜­å¤§è¦æ¨¡ç„¡äººæ©Ÿæ”»æ“Šé€ æˆèŽ«æ–¯ç§‘åœ°å€ 3 äººæ­»äº¡",
    "'This may be the last time you hear my voice': Political executions surge in Iran since start of war": "ã€Œé€™å¯èƒ½æ˜¯ä½ æœ€å¾Œä¸€æ¬¡è½åˆ°æˆ‘çš„è²éŸ³ã€ï¼šæˆ°çˆ­é–‹å§‹å¾Œä¼Šæœ—æ”¿æ²»è™•æ±ºæ¿€å¢ž",
    "Inside the 'kill-zone' on Ukraine's front line, where new weapons have transformed war": "èµ°é€²çƒå…‹è˜­å‰ç·šã€Œæ®ºå‚·å€ã€ï¼šæ–°æ­¦å™¨æ­£åœ¨æ”¹è®Šæˆ°çˆ­",
    "Cuba warns US of â€˜bloodbathâ€™ if military action follows drone claims": "å¤å·´è­¦å‘Šç¾Žåœ‹ï¼šè‹¥å› ç„¡äººæ©ŸæŒ‡æŽ§æŽ¡å–è»äº‹è¡Œå‹•ï¼Œå°‡é€ æˆã€Œè¡€æ´—ã€",
    "Cuba warns US of 'bloodbath' if military action follows drone claims": "å¤å·´è­¦å‘Šç¾Žåœ‹ï¼šè‹¥å› ç„¡äººæ©ŸæŒ‡æŽ§æŽ¡å–è»äº‹è¡Œå‹•ï¼Œå°‡é€ æˆã€Œè¡€æ´—ã€",
    "Middle East crisis live: Trump claims â€˜very good chanceâ€™ of deal to prevent Iran strike": "ä¸­æ±å±æ©Ÿç›´æ’­ï¼šå·æ™®ç¨±æœ‰ã€Œå¾ˆå¤§æ©Ÿæœƒã€é”æˆå”è­°ä»¥é¿å…æ”»æ“Šä¼Šæœ—",
    "Trump says he called off new Iran attack at request of Gulf states": "å·æ™®ç¨±æ‡‰æµ·ç£åœ‹å®¶è¦æ±‚å–æ¶ˆæ–°ä¸€è¼ªå°ä¼Šæœ—æ”»æ“Š",
    "Trump told Taiwan not to 'go independent' - but does it want to?": "å·æ™®è¦æ±‚å°ç£ä¸è¦èµ°å‘ç¨ç«‹ï¼Œå°ç£å…§éƒ¨æ„å‘å†å—æª¢è¦–",
    "Trump pauses possible Iran strike after Gulf intervention": "æµ·ç£åœ‹å®¶ä»‹å…¥å¾Œï¼Œå·æ™®æš«ç·©å¯èƒ½çš„ä¼Šæœ—æ‰“æ“Š",
    "Trump claims planned attack on Iran postponed after Tehran makes new proposal": "å·æ™®ç¨±ä¼Šæœ—æå‡ºæ–°æ–¹æ¡ˆå¾Œï¼ŒåŽŸå®šæ”»æ“Šè¨ˆç•«å·²è¢«æŽ¨é²",
    "Trump delays â€˜scheduled attackâ€™ on Iran, crediting â€˜serious negotiationsâ€™": "å·æ™®å› ã€ŒèªçœŸè«‡åˆ¤ã€æŽ¨é²å°ä¼Šæœ—çš„ã€Œé å®šæ”»æ“Šã€",
    "Trump delays 'scheduled attack' on Iran, crediting 'serious negotiations'": "å·æ™®å› ã€ŒèªçœŸè«‡åˆ¤ã€æŽ¨é²å°ä¼Šæœ—çš„ã€Œé å®šæ”»æ“Šã€",
    "Could the Iran war trigger the next debt shock?": "ä¼Šæœ—æˆ°çˆ­å¯èƒ½å¼•ç™¼ä¸‹ä¸€æ³¢å‚µå‹™è¡æ“Š",
    "Drone strikes UAE nuclear plant highlighting risk of renewed war": "ç„¡äººæ©Ÿæ”»æ“Šé˜¿è¯é…‹æ ¸é›»å» ï¼Œå‡¸é¡¯æˆ°ç«é‡ç‡ƒé¢¨éšª",
    "Taiwan will not provoke conflict nor give up sovereignty, says president": "å°ç£ä¸æœƒæŒ‘é‡è¡çªï¼Œä¹Ÿä¸æœƒæ”¾æ£„ä¸»æ¬Šï¼Œç¸½çµ±è¡¨ç¤º",
    "Taiwan insists it is independent after Trump warning": "å·æ™®è­¦å‘Šå¾Œï¼Œå°ç£å …ç¨±è‡ªèº«ç¨ç«‹"
  };
  if (exact[normalized]) return statementTitle(exact[normalized]);

  const summaryExact = {
    "It marks a grim milestone in the conflict between Israel and the Lebanese armed group Hezbollah since March, despite a nominal ceasefire.": "é€™æ¨™èªŒè‘—è‡ªä¸‰æœˆä»¥ä¾†ä»¥è‰²åˆ—èˆ‡é»Žå·´å«©æ­¦è£çµ„ç¹”çœŸä¸»é»¨è¡çªä¸­çš„åš´å³»é‡Œç¨‹ç¢‘ï¼Œå„˜ç®¡åç¾©ä¸Šå·²æœ‰åœç«ã€‚",
    "US President Donald Trump has announced that he is delaying a planned attack on Iran.": "ç¾Žåœ‹ç¸½çµ±å”ç´å¾· ï¿½ å·æ™®å®£å¸ƒï¼Œä»–æ­£åœ¨æŽ¨é²ä¸€é …é‡å°ä¼Šæœ—çš„æ”»æ“Šè¨ˆç•«ã€‚",
    "The US president says he is holding off on a US attack planned for Tuesday as \"serious negotiations are now taking place\".": "ç¾Žåœ‹ç¸½çµ±è¡¨ç¤ºï¼Œç”±æ–¼ã€ŒèªçœŸè«‡åˆ¤æ­£åœ¨é€²è¡Œã€ï¼Œä»–æš«ç·©åŽŸå®šé€±äºŒé€²è¡Œçš„ç¾Žæ–¹æ”»æ“Šã€‚",
    "Government bonds are under pressure and households could soon feel the impact.": "æ”¿åºœå‚µåˆ¸æ‰¿å£“ï¼Œå®¶åº­å¯èƒ½å¾ˆå¿«æ„Ÿå—åˆ°å½±éŸ¿ã€‚",
    "Lai Ching-te made his first direct response to Trump and Xi's meeting where they discussed Taiwan independence.": "è³´æ¸…å¾·é¦–æ¬¡ç›´æŽ¥å›žæ‡‰å·æ™®èˆ‡ç¿’è¿‘å¹³æœƒæ™¤ä¸­æœ‰é—œå°ç£ç¨ç«‹çš„è¨Žè«–ã€‚"
  };
  if (summaryExact[normalized]) return statementTitle(summaryExact[normalized]);

  return statementTitle(rewriteReportText(normalized));
}

function statementTitle(text) {
  return String(text || "")
    .replace(/å—Žï¼Ÿ$/u, "")
    .replace(/å—Ž$/u, "")
    .replace(/ï¼Ÿ$/u, "")
    .replace(/\?$/u, "")
    .trim();
}

function directReportSourceText(event) {
  let text = String(event?.statement || event?.title || "").replace(/\s+/g, " ").trim();
  text = text.replace(/^(analysis|comment|commentary|explainer|opinion)\s*:\s*/i, "");
  text = text.replace(/^[^:]{1,56}\blive\s*:\s*/i, "");
  if (!/^[â€˜â€™â€œâ€"']/u.test(text)) {
    text = text.replace(/^([^:]{4,90}):\s*(why|how|what|when|where|could|should|can|is|does|do)\b.*$/i, "$1");
  }
  return statementTitle(text);
}

function reportTitleText(event) {
  if (!event) return "";
  const directText = directReportSourceText(event);
  if (currentLanguage !== "zh") return statementTitle(directText);
  const translated = event.statement_zh || translateReportText(directText) || event.title_zh || "";
  return statementTitle(isGenericReportTitle(translated) ? directText || event.title || "" : translated || directText || event.title || "");
}

function isGenericReportTitle(text) {
  const normalized = String(text || "").replace(/\s+/g, "");
  if (!normalized) return true;
  return [
    "å±€å‹¢",
    "å±€åŠ¿",
    "å±€å‹¢æŒçºŒç™¼é…µ",
    "å±€åŠ¿æŒç»­å‘é…µ",
    "å±€å‹¢å‡ºç¾æ–°å‹•å‘",
    "å±€åŠ¿å‡ºçŽ°æ–°åŠ¨å‘",
    "å±€å‹¢å‡ºç¾æ–°é€²å±•",
    "å±€åŠ¿å‡ºçŽ°æ–°è¿›å±•",
    "å±€å‹¢å£“åŠ›å‡é«˜",
    "å±€åŠ¿åŽ‹åŠ›å‡é«˜",
    "ç›¸é—œå ±å°Ž",
    "ç›¸å…³æŠ¥é“",
    "æˆç‚ºç„¦é»ž",
    "æˆä¸ºç„¦ç‚¹",
    "å‡ºç¾æ–°é€²å±•",
    "å‡ºçŽ°æ–°è¿›å±•",
    "æˆç‚ºç„¦é»ž",
    "æˆä¸ºç„¦ç‚¹"
  ].some(phrase => normalized.includes(phrase));
}

function hasReadableReportTitle(event) {
  const title = reportTitleText(event).replace(/\s+/g, " ").trim();
  return !!title && !/^untitled report$/i.test(title);
}

function feedMetaText(event) {
  const parts = [];
  if (hasMapLocation(event)) parts.push(formatPlaceName(event));
  if (event?.source) parts.push(event.source);
  parts.push(formatDate(event?.published));
  return parts.filter(Boolean).join(" - ");
}

function normalizedDisplayTitleKey(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[â€œâ€â€˜â€™"'`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function uniqueFeedEvents(items, limit = 18) {
  const seen = new Set();
  const unique = [];
  for (const event of items) {
    if (!hasReadableReportTitle(event)) continue;
    const key = normalizedDisplayTitleKey(reportTitleText(event));
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(event);
    if (unique.length >= limit) break;
  }
  return unique;
}

function compactEventText(text) {
  const clean = statementTitle(text).replace(/\s+/g, " ").trim();
  const maxLength = /[^\x00-\x7F]/.test(clean) ? 24 : 54;
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 3)}...` : clean;
}

function mapEventLabelText(event) {
  return compactEventText(reportTitleText(event));
}

function reportSummaryText(event) {
  if (!event) return t("noSummary");
  if (currentLanguage !== "zh") return event.summary || t("noSummary");
  return event.summary_zh || (event.summary ? translateReportText(event.summary) : t("noSummary"));
}

function hideReportImage() {
  els.reportImage.removeAttribute("src");
  els.reportImage.alt = "";
  els.reportImageFrame.hidden = true;
}

function clearReportImage() {
  reportImageRequestId += 1;
  hideReportImage();
}

function showReportImage(event, imageUrl) {
  if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
    return;
  }
  showReportImageFromPath(event, "/api/image-file", imageUrl);
}

function showReportImageFromPath(event, endpoint, url) {
  if (!url || !/^https?:\/\//i.test(url)) {
    return;
  }
  const requestId = reportImageRequestId;
  const imageParams = new URLSearchParams();
  imageParams.set("url", url);
  els.reportImage.alt = reportTitleText(event);
  els.reportImage.onload = () => {
    if (requestId === reportImageRequestId) {
      els.reportImageFrame.hidden = false;
    }
  };
  els.reportImage.onerror = () => {
    if (requestId === reportImageRequestId) hideReportImage();
  };
  els.reportImageFrame.hidden = true;
  els.reportImage.src = `${endpoint}?${imageParams.toString()}`;
}

function updateReportImage(event) {
  reportImageRequestId += 1;
  hideReportImage();

  const imageUrl = String(event?.imageUrl || "").trim();
  if (imageUrl) {
    showReportImage(event, imageUrl);
    return;
  }
  showReportImageFromPath(event, "/api/article-image-file", String(event?.url || "").trim());
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-Hant" : "en";
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = t(node.dataset.i18n);
  });
  const refreshLabel = els.refreshEvents.querySelector("[data-refresh-label]");
  if (refreshLabel) {
    refreshLabel.textContent = t("refresh");
  } else {
    els.refreshEvents.textContent = t("refresh");
  }
  els.languageToggle.textContent = t("language");
  updateTranslationToggleButton();
  els.reportLink.textContent = t("openSource");
  renderThemePicker();
  updateSourceLabels();
}

function rerenderLanguageSensitiveViews() {
  applyLanguage();
  renderCities();
  if (isMarketMode()) {
    selectMarket(selectedMarketId);
  } else if (isCityMapMode()) {
    selectCity(selectedCityId);
  } else if (isEarningMode()) {
    selectEarning(selectedEarningId);
  } else if (!events.length) {
    renderNoRecentEvents();
  } else {
    selectEvent(selectedEventId);
  }
}

function loadCachedEvents() {
  const payload = readStorageJson(eventCacheStorageKey, {});
  const items = Array.isArray(payload.events) ? payload.events : [];
  return normalizeEventList(items);
}

function saveCachedEvents(nextEvents) {
  if (!Array.isArray(nextEvents) || !nextEvents.length) return;
  writeStorageJson(eventCacheStorageKey, {
    savedAt: new Date().toISOString(),
    events: nextEvents.slice(0, 30)
  });
}

function loadCachedWeather() {
  const payload = readStorageJson(weatherCacheStorageKey, {});
  return payload && typeof payload.weather === "object" ? payload.weather : null;
}

function saveCachedWeather(nextWeather) {
  writeStorageJson(weatherCacheStorageKey, {
    savedAt: new Date().toISOString(),
    weather: nextWeather
  });
}

function trimMarketHistoryForCache(history, maxItems) {
  const normalized = normalizeMarketHistory(history) || [];
  return normalized.slice(Math.max(0, normalized.length - maxItems));
}

function compactRangeHistoriesForCache(histories) {
  const compact = {};
  const normalized = normalizeMarketRangeHistories(histories);
  marketRangeOptions.forEach(range => {
    if (normalized[range]) compact[range] = trimMarketHistoryForCache(normalized[range], range === "1m" ? 520 : 220);
  });
  return compact;
}

function compactMarketAssetForCache(asset, index) {
  const includeChart = index < 60 || asset.id === selectedMarketId;
  return {
    id: asset.id,
    rank: asset.rank,
    group: asset.group,
    symbol: asset.symbol,
    name: asset.name,
    zhName: asset.zhName,
    summary: asset.summary,
    zhSummary: asset.zhSummary,
    value: asset.value,
    unit: asset.unit,
    changePct: asset.changePct,
    marketCap: asset.marketCap,
    rankPrevious: asset.rankPrevious,
    rankChange: asset.rankChange,
    rankChangedAt: asset.rankChangedAt,
    country: asset.country,
    countryCode: asset.countryCode,
    countryFlag: asset.countryFlag,
    logoUrl: asset.logoUrl,
    sourceName: asset.sourceName,
    historyUrl: asset.historyUrl,
    sparkline: trimMarketHistoryForCache(asset.sparkline, 40),
    history: includeChart ? trimMarketHistoryForCache(asset.history, 260) : [],
    denseHistory: includeChart ? trimMarketHistoryForCache(asset.denseHistory, 420) : [],
    shortHistory: includeChart ? trimMarketHistoryForCache(asset.shortHistory, 520) : [],
    rangeHistories: includeChart ? compactRangeHistoriesForCache(asset.rangeHistories) : {}
  };
}

function compactCurrencyForCache(currency) {
  return {
    code: currency.code,
    name: currency.name,
    zhName: currency.zhName,
    group: currency.group,
    usdValue: currency.usdValue,
    quotePerUsd: currency.quotePerUsd,
    changePct: currency.changePct,
    date: currency.date,
    source: currency.source,
    history: trimMarketHistoryForCache(currency.history, 260),
    denseHistory: trimMarketHistoryForCache(currency.denseHistory, 420),
    shortHistory: trimMarketHistoryForCache(currency.shortHistory, 520)
  };
}

function loadCachedMarkets() {
  const payload = readStorageJson(marketCacheStorageKey, {});
  const assets = normalizeMarketAssets(payload?.assets);
  const cachedCurrencies = normalizeCurrencyQuotes(payload?.currencies?.quotes);
  const currencies = hasCompleteCurrencySet(cachedCurrencies) ? cachedCurrencies : [];
  const anchors = Array.isArray(payload?.currencies?.anchors)
    ? payload.currencies.anchors.map(code => String(code).toUpperCase())
    : [];
  return {
    assets,
    currencies,
    anchors,
    currencyDate: payload?.currencies?.date || "",
    updated: payload?.updated || payload?.savedAt || "",
    servedAt: payload?.servedAt || "",
  };
}

function saveCachedMarkets(payload) {
  const assets = normalizeMarketAssets(payload?.assets);
  if (!assets.length) return;
  const payloadCurrencies = normalizeCurrencyQuotes(payload?.currencies?.quotes);
  const currencies = hasCompleteCurrencySet(payloadCurrencies)
    ? payloadCurrencies
    : hasCompleteCurrencySet(marketCurrencies)
      ? marketCurrencies
      : [];
  const currencyCodes = new Set(currencies.map(currency => currency.code));
  const anchors = (Array.isArray(payload?.currencies?.anchors) && payload.currencies.anchors.length
    ? payload.currencies.anchors
    : currencyAnchors)
    .map(code => String(code).toUpperCase())
    .filter(code => currencyCodes.has(code));
  const compact = {
    source: payload?.source || "cached",
    savedAt: new Date().toISOString(),
    updated: payload?.updated || marketUpdatedAt || new Date().toISOString(),
    servedAt: payload?.servedAt || marketServedAt || "",
    stale: payload?.stale === true,
    assets: assets.map(compactMarketAssetForCache),
    currencies: {
      source: payload?.currencies?.source || "cached",
      date: payload?.currencies?.date || currencyDate || "",
      anchors: anchors.length ? anchors : defaultCurrencyAnchors.filter(code => currencyCodes.has(code)),
      quotes: currencies.map(compactCurrencyForCache)
    }
  };
  writeStorageJson(marketCacheStorageKey, compact);
}

function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  if (typeof AbortController === "undefined") {
    return fetch(url, options);
  }
  const controller = new AbortController();
  const externalSignal = options.signal;
  const optionsWithoutSignal = { ...options };
  delete optionsWithoutSignal.signal;
  if (externalSignal?.aborted) controller.abort();
  const abortFromExternal = () => controller.abort();
  externalSignal?.addEventListener?.("abort", abortFromExternal, { once: true });
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...optionsWithoutSignal, signal: controller.signal }).finally(() => {
    window.clearTimeout(timer);
    externalSignal?.removeEventListener?.("abort", abortFromExternal);
  });
}

function mergeWeather(cached) {
  const merged = JSON.parse(JSON.stringify(fallbackWeather));
  if (!cached || typeof cached !== "object") return merged;

  for (const city of cities) {
    const item = cached[city.id];
    if (!item) continue;
    merged[city.id] = {
      temperature: Number.isFinite(item.temperature) ? item.temperature : merged[city.id].temperature,
      humidity: Number.isFinite(item.humidity) ? item.humidity : merged[city.id].humidity,
      wind: Number.isFinite(item.wind) ? item.wind : merged[city.id].wind,
      code: Number.isFinite(item.code) ? item.code : merged[city.id].code
    };
  }
  return merged;
}

function loadViewState() {
  const saved = readStorageJson(viewStateStorageKey, {});
  return saved && typeof saved === "object" ? saved : {};
}

function saveViewState() {
  writeStorageJson(viewStateStorageKey, {
    mapMode,
    selectedEventId,
    selectedCityId,
    selectedEarningId,
    selectedMarketId,
    selectedMarketRange,
    selectedCurrencyAnchor,
    selectedCurrencyCode,
    selectedCurrencyRange,
    marketAskMode,
    cityPhotoRangeMinutes,
    earningFilters,
    includeMetals: marketGroupFilters.metals,
    includeCrypto: marketGroupFilters.crypto
  });
}

function initialMapMode() {
  try {
    const requested = new URLSearchParams(window.location.search).get("mode");
    if (requested === "stats") return "stats";
    if (requested === "markets") return "markets";
    if (requested === "events") return "events";
    if (requested === "earning") return "earning";
  } catch {
    // Fall through to the last saved view.
  }
  if (viewState.mapMode === "stats") return "stats";
  if (viewState.mapMode === "markets") return "markets";
  if (viewState.mapMode === "earning") return "earning";
  return "events";
}

function projectionFrame(width, height) {
  const marginX = width * 0.035;
  const marginY = height * 0.08;
  let frameWidth = width - marginX * 2;
  let frameHeight = height - marginY * 2;

  if (frameWidth / frameHeight > mapProjectionAspect) {
    frameWidth = frameHeight * mapProjectionAspect;
  } else {
    frameHeight = frameWidth / mapProjectionAspect;
  }

  return {
    left: (width - frameWidth) / 2,
    top: (height - frameHeight) / 2,
    width: frameWidth,
    height: frameHeight
  };
}

function updateMapUiScale(rect) {
  const frame = projectionFrame(rect.width, rect.height);
  mapUiScale = clamp(frame.width / 860, 1, 1.48);
}

function project(lat, lon, width, height) {
  const frame = projectionFrame(width, height);
  const x = frame.left + ((lon + 180) / 360) * frame.width;
  const y = frame.top + ((84 - lat) / 168) * frame.height;
  return { x, y };
}

function boardPoint(index, width, height, customSlot) {
  const slot = customSlot || boardSlots[index % boardSlots.length];
  return {
    x: (slot[0] / 100) * width,
    y: (slot[1] / 100) * height
  };
}

function formatTime(zone) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: zone
  }).format(new Date());
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat(currentLanguage === "zh" ? "zh-Hant" : "en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date(value));
  } catch {
    return "recent";
  }
}

function formatRefreshDateTime(value) {
  if (!value) return t("marketRefreshUnknown");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t("marketRefreshUnknown");
  return new Intl.DateTimeFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function updateMarketRefreshTime() {
  if (!els.marketRefreshTime) return;
  const timestamp = formatRefreshDateTime(marketUpdatedAt);
  els.marketRefreshTime.textContent = timestamp;
  els.refreshEvents.title = timestamp === t("marketRefreshUnknown") ? "" : timestamp;
}

function scheduleMarketFreshRetry() {
  if (marketFreshRetryAttempts >= 3) return;
  marketFreshRetryAttempts += 1;
  window.clearTimeout(marketFreshRetryTimer);
  const delay = 2500 + (marketFreshRetryAttempts - 1) * 3500;
  marketFreshRetryTimer = window.setTimeout(() => {
    fetchMarkets({ announce: false });
  }, delay);
}

function updateMarketFreshRetryState(payload) {
  if (payload?.stale === true || payload?.cacheReason === "stale-while-revalidate") {
    scheduleMarketFreshRetry();
    return;
  }
  marketFreshRetryAttempts = 0;
  window.clearTimeout(marketFreshRetryTimer);
}

function isMarketLoadingState() {
  return !marketAssets.length && (marketSourceKey === "loadingMarkets" || marketSourceKey === "refreshingMarkets");
}

function marketEmptyTitle() {
  return isMarketLoadingState() ? t("loadingMarkets") : t("marketUnavailableTitle");
}

function marketEmptySummary() {
  return isMarketLoadingState() ? t("marketLoadingSummary") : t("marketUnavailableSummary");
}

function weatherText(code) {
  if ([0].includes(code)) return t("clear");
  if ([1, 2].includes(code)) return t("lightCloud");
  if ([3].includes(code)) return t("cloudy");
  if ([45, 48].includes(code)) return t("fog");
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return t("rain");
  if ([71, 73, 75, 85, 86].includes(code)) return t("snow");
  if ([95, 96, 99].includes(code)) return t("storm");
  return t("weather");
}

function isCityMapMode(mode = mapMode) {
  return mode === "stats" || mode === "weather" || mode === "temp" || mode === "time";
}

function isMarketMode(mode = mapMode) {
  return mode === "markets";
}

function isEarningMode(mode = mapMode) {
  return mode === "earning";
}

function cityModeLabel() {
  return t("cityMode");
}

function cityModeBadge(city, item) {
  return `${Math.round(item.temperature)} C`;
}

function cityModeTitle(city) {
  return currentLanguage === "zh" ? cityName(city) : `${city.name} stats`;
}

function significantWeatherText(city, item) {
  const code = Number(item?.code);
  const temp = Number(item?.temperature);
  const wind = Number(item?.wind);
  const place = cityName(city);
  const parts = [];
  if ([95, 96, 99].includes(code)) parts.push(currentLanguage === "zh" ? "æœ‰é›·æš´" : "has storms");
  else if ([71, 73, 75, 85, 86].includes(code)) parts.push(currentLanguage === "zh" ? "æœ‰é™é›ª" : "has snow");
  else if ([65, 81, 82].includes(code)) parts.push(currentLanguage === "zh" ? "æœ‰è¾ƒå¼ºé™é›¨" : "has heavy rain");
  else if ([45, 48].includes(code)) parts.push(currentLanguage === "zh" ? "æœ‰é›¾" : "has fog");
  if (Number.isFinite(wind) && wind >= 40) parts.push(currentLanguage === "zh" ? `é£Žé€Ÿçº¦ ${Math.round(wind)} km/h` : `wind around ${Math.round(wind)} km/h`);
  if (Number.isFinite(temp) && temp >= 38) parts.push(currentLanguage === "zh" ? `é«˜æ¸©çº¦ ${Math.round(temp)} C` : `heat around ${Math.round(temp)} C`);
  if (Number.isFinite(temp) && temp <= -5) parts.push(currentLanguage === "zh" ? `ä½Žæ¸©çº¦ ${Math.round(temp)} C` : `cold around ${Math.round(temp)} C`);
  if (!parts.length) return "";
  return currentLanguage === "zh"
    ? `${place}${parts.join("ï¼Œ")}ã€‚`
    : `${place} ${parts.join(" and ")}.`;
}

function cityModeSummary(city, item) {
  return significantWeatherText(city, item);
  if (currentLanguage === "zh") {
    return `ç•¶åœ°æ™‚é–“ ${formatTime(city.zone)}ã€‚å¤©æ°£ ${weatherText(item.code)}ã€‚æº«åº¦ ${Math.round(item.temperature)} Cã€‚æ¿•åº¦ ${Math.round(item.humidity)}%ã€‚é¢¨é€Ÿ ${Math.round(item.wind)} km/hã€‚`;
  }
  return `Local time ${formatTime(city.zone)}. Weather ${weatherText(item.code)}. Temperature ${Math.round(item.temperature)} C. Humidity ${Math.round(item.humidity)}%. Wind ${Math.round(item.wind)} km/h.`;
}

function stableHash(text) {
  let hash = 0;
  for (const char of String(text || "")) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
}

function cityLocalHour(city) {
  try {
    const value = new Intl.DateTimeFormat("en-US", {
      timeZone: city.zone,
      hour: "2-digit",
      hour12: false
    }).format(new Date());
    return Number(value);
  } catch {
    return new Date().getHours();
  }
}

function cityPhotoDaypart(city) {
  const hour = cityLocalHour(city);
  if (hour >= 5 && hour < 9) return "morning";
  if (hour >= 9 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

function cityPhotoWeatherTag(item) {
  const code = Number(item?.code);
  if ([95, 96, 99].includes(code)) return "storm";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "rain";
  if ([71, 73, 75, 85, 86].includes(code)) return "snow";
  if ([45, 48].includes(code)) return "fog";
  if ([3].includes(code)) return "cloudy";
  if ([1, 2].includes(code)) return "clouds";
  return "clear";
}

function normalizeCityPhotoRange(value) {
  const minutes = Number(value);
  return cityPhotoRangeOptions.includes(minutes) ? minutes : 30;
}

function cityPhotoRangeMs() {
  return normalizeCityPhotoRange(cityPhotoRangeMinutes) * 60 * 1000;
}

function cityPhotoBucket() {
  return Math.floor(Date.now() / cityPhotoRangeMs());
}

function cityPhotoBucketAgeMinutes(bucket = cityPhotoBucket()) {
  const ageMs = Date.now() - (Number(bucket) || 0) * cityPhotoRangeMs();
  return Math.max(0, Math.floor(ageMs / 60000));
}

function cityPhotoRangeLabel(minutes) {
  if (currentLanguage === "zh") return minutes >= 60 ? "1å°æ—¶" : `${minutes}åˆ†`;
  return minutes >= 60 ? "1h" : `${minutes}m`;
}

function cityPhotoSearchQueries(entry, city, daypart, weatherTag) {
  const label = entry.label || city.name;
  const cityLabel = city.name || label;
  if (daypart === "night") {
    return [
      `${label} night skyline`,
      `${cityLabel} night skyline`,
      `${label} at night`,
      `${cityLabel} city lights`,
      `${cityLabel} blue hour`
    ];
  }
  if (daypart === "evening") {
    return [
      `${label} evening skyline`,
      `${cityLabel} sunset skyline`,
      `${cityLabel} dusk city`,
      `${cityLabel} blue hour`
    ];
  }
  if (daypart === "morning") {
    return [
      `${label} morning skyline`,
      `${cityLabel} sunrise skyline`,
      `${cityLabel} dawn city`,
      `${label} day skyline`
    ];
  }
  const weatherQuery = weatherTag && weatherTag !== "clear" ? `${label} ${weatherTag} skyline` : "";
  return [weatherQuery, `${label} daytime skyline`, `${label} skyline`, `${cityLabel} city`].filter(Boolean);
}

function cityPhotoCandidates(city, item) {
  const subjects = cityPhotoSubjects[city.id] || [`${city.name} city`];
  const daypart = cityPhotoDaypart(city);
  const weatherTag = cityPhotoWeatherTag(item);
  const bucket = cityPhotoBucket();
  return subjects.map((subject, index) => {
    const entry = typeof subject === "string" ? { label: subject, page: city.name } : subject;
    const searchQueries = cityPhotoSearchQueries(entry, city, daypart, weatherTag);
    const query = [entry.label, daypart, weatherTag, searchQueries[0] || "city"].join(",");
    const sig = stableHash(`${city.id}:${query}:${bucket}:${index}`);
    return {
      key: query,
      label: entry.label,
      daypart,
      searchQueries,
      page: entry.page || city.name,
      allowSummaryFallback: daypart === "day",
      fallbackUrl: ""
    };
  });
}

function chooseCityPhoto(city, item) {
  const bucket = cityPhotoBucket();
  const candidates = cityPhotoCandidates(city, item);
  const memory = readStorageJson(cityPhotoMemoryStorageKey, {});
  const saved = memory?.[city.id];
  if (saved?.bucket === bucket && saved?.range === cityPhotoRangeMinutes && candidates.some(candidate => candidate.key === saved.key)) {
    return candidates.find(candidate => candidate.key === saved.key);
  }

  const recent = Array.isArray(saved?.recent) ? saved.recent : [];
  const start = stableHash(`${city.id}:${cityPhotoWeatherTag(item)}:${cityPhotoDaypart(city)}:${bucket}`) % Math.max(1, candidates.length);
  let chosen = candidates[start] || candidates[0];
  for (let offset = 0; offset < candidates.length; offset += 1) {
    const candidate = candidates[(start + offset) % candidates.length];
    if (!recent.slice(0, 2).includes(candidate.key)) {
      chosen = candidate;
      break;
    }
  }
  memory[city.id] = {
    bucket,
    range: cityPhotoRangeMinutes,
    key: chosen.key,
    recent: [chosen.key, ...recent.filter(key => key !== chosen.key)].slice(0, 5)
  };
  writeStorageJson(cityPhotoMemoryStorageKey, memory);
  return chosen;
}

function wikipediaSummaryUrl(page) {
  return `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page || "")}`;
}

function upscaleWikimediaThumbnail(source) {
  const url = String(source || "");
  const match = url.match(/^(https?:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/.+\/)\d+px-([^/?#]+)([?#].*)?$/i);
  return match ? `${match[1]}1280px-${match[2]}${match[3] || ""}` : "";
}

function commonsImageSearchUrl(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "14",
    gsrsearch: query,
    prop: "imageinfo",
    iiprop: "url|size|mime",
    iiurlwidth: "1280",
    format: "json",
    origin: "*"
  });
  return `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
}

function cityPhotoDaypartTitleScore(title, daypart) {
  const normalized = String(title || "").toLowerCase();
  const night = /\b(night|nighttime|nocturne|after dark|city lights?|illuminated)\b|å¤œ|å¤œæ™¯|nachts|nuit|notte/.test(normalized);
  const evening = /\b(evening|dusk|sunset|twilight|blue hour)\b|é»„æ˜|å‚æ™š|å¤•/.test(normalized);
  const morning = /\b(morning|sunrise|dawn|daybreak|early morning)\b|æ¸…æ™¨|æ—©æ™¨|æ—¥å‡º/.test(normalized);
  if (daypart === "night") return night || evening ? (night ? 4 : 2) : -1;
  if (daypart === "evening") return evening || night ? (evening ? 4 : 1) : -1;
  if (daypart === "morning") return morning ? 4 : (night || evening ? -1 : 1);
  return night || evening ? -1 : 1;
}

function cityPhotoAspectOk(width, height) {
  const w = Number(width);
  const h = Number(height);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w < 900 || h < 420) return false;
  const ratio = w / h;
  return ratio >= 1.18 && ratio <= 2.65;
}

function cityPhotoFromCommonsPayload(payload, daypart) {
  const pages = Object.values(payload?.query?.pages || {});
  const candidates = pages
    .map(page => {
      const info = Array.isArray(page?.imageinfo) ? page.imageinfo[0] : null;
      const url = info?.thumburl || info?.url || "";
      const width = Number(info?.thumbwidth || info?.width);
      const height = Number(info?.thumbheight || info?.height);
      const mime = String(info?.mime || "");
      const title = String(page?.title || "");
      const daypartScore = cityPhotoDaypartTitleScore(title, daypart);
      if (daypartScore < 0) return null;
      if (!/^https?:\/\//i.test(url) || !/^image\//i.test(mime)) return null;
      if (!cityPhotoAspectOk(width, height)) return null;
      return {
        url,
        title,
        score: daypartScore + Math.min(3, width / 1280) + Math.min(2, height / 720)
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score);
  return candidates[0]?.url || "";
}

async function resolveCommonsCityPhotoUrl(candidate) {
  const queries = (Array.isArray(candidate?.searchQueries) ? candidate.searchQueries : []).slice(0, 5);
  const results = await Promise.all(queries.map(async query => {
    try {
      const response = await fetchWithTimeout(commonsImageSearchUrl(query), { cache: "force-cache" }, 3600);
      if (!response.ok) return "";
      const payload = await response.json();
      return cityPhotoFromCommonsPayload(payload, candidate.daypart || "day");
    } catch {
      return "";
    }
  }));
  return results.find(Boolean) || "";
}

async function resolveCityPhotoUrl(candidate) {
  try {
    const commonsUrl = await resolveCommonsCityPhotoUrl(candidate);
    if (commonsUrl) return commonsUrl;
    if (!candidate.allowSummaryFallback) return "";
    const response = await fetchWithTimeout(wikipediaSummaryUrl(candidate.page), { cache: "force-cache" }, 3600);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const thumbnailUrl = payload?.thumbnail?.source || "";
    const largeThumbnailUrl = upscaleWikimediaThumbnail(thumbnailUrl);
    const originalUrl = payload?.originalimage?.source || "";
    const imageUrl = largeThumbnailUrl || originalUrl || thumbnailUrl;
    return /^https?:\/\//i.test(imageUrl) ? imageUrl : "";
  } catch {
    return "";
  }
}

function loadCityPhotoCandidate(image, figure, candidates, index = 0) {
  const candidate = candidates[index];
  if (!candidate) {
    figure.classList.remove("loading");
    figure.classList.add("fallback");
    return;
  }

  const token = `${index}:${stableHash(candidate.key || candidate.page || "")}:${Date.now()}`;
  figure.dataset.cityPhotoToken = token;
  let settled = false;
  let triedFallback = false;
  let timer = 0;

  const isCurrent = () => figure.dataset.cityPhotoToken === token;
  const restartTimer = delay => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!isCurrent() || settled) return;
      failover();
    }, delay);
  };
  const failover = () => {
    if (!isCurrent() || settled) return;
    if (!triedFallback && candidate.fallbackUrl) {
      triedFallback = true;
      image.src = candidate.fallbackUrl;
      restartTimer(5200);
      return;
    }
    window.clearTimeout(timer);
    loadCityPhotoCandidate(image, figure, candidates, index + 1);
  };

  image.onload = () => {
    if (!isCurrent()) return;
    settled = true;
    window.clearTimeout(timer);
    figure.classList.remove("loading", "fallback");
    figure.classList.add("loaded");
  };
  image.onerror = () => {
    failover();
  };

  restartTimer(4200);
  resolveCityPhotoUrl(candidate).then(url => {
    if (!isCurrent() || settled || triedFallback) return;
    const nextSrc = url || candidate.fallbackUrl || "";
    if (!nextSrc) {
      failover();
      return;
    }
    if (nextSrc === candidate.fallbackUrl) triedFallback = true;
    image.src = nextSrc;
    restartTimer(triedFallback ? 5200 : 6800);
  });
}

function locationKey(item) {
  const location = item.location || item.name || "World";
  const country = item.country || "Global";
  const lat = Number.isFinite(item.lat) ? item.lat.toFixed(3) : "0";
  const lon = Number.isFinite(item.lon) ? item.lon.toFixed(3) : "0";
  return `${location}|${country}|${lat}|${lon}`;
}

function isGenericMapLocation(item) {
  const location = String(item?.location || item?.name || "").trim().toLowerCase();
  const country = String(item?.country || "").trim().toLowerCase();
  return (
    !location ||
    location === "world" ||
    location === "global" ||
    location === "unplaced" ||
    location === "unmapped" ||
    country === "global"
  );
}

function hasMapLocation(item) {
  return Boolean(
    item &&
    Number.isFinite(item.lat) &&
    Number.isFinite(item.lon) &&
    !isGenericMapLocation(item)
  );
}

function unplacedLabel() {
  return currentLanguage === "zh" ? "æœªå®šä½" : "Unplaced";
}

function formatPlaceName(item) {
  if (!hasMapLocation(item) && isGenericMapLocation(item)) return unplacedLabel();
  const location = translateLocationName(item.location || item.name || "World");
  const country = item.country || "";
  const localizedCountry = translateLocationName(country);
  if (!country || country === "Global" || localizedCountry === location) return location;
  return `${location}, ${localizedCountry}`;
}

function buildEventPlaces() {
  const places = new Map();
  for (const event of events) {
    if (!hasMapLocation(event)) continue;
    const key = locationKey(event);
    if (!places.has(key)) {
      places.set(key, {
        key,
        location: event.location || "World",
        country: event.country || "Global",
        lat: event.lat,
        lon: event.lon,
        category: event.category || "world",
        severity: event.severity || 1,
        events: []
      });
    }

    const place = places.get(key);
    place.events.push(event);
    if ((event.severity || 1) > place.severity) {
      place.severity = event.severity || 1;
      place.category = event.category || place.category;
    }
  }

  return Array.from(places.values()).sort((a, b) => {
    if (b.severity !== a.severity) return b.severity - a.severity;
    if (b.events.length !== a.events.length) return b.events.length - a.events.length;
    return formatPlaceName(a).localeCompare(formatPlaceName(b));
  });
}

function createPinLabel(primary) {
  const label = document.createElement("span");
  label.className = "pin-label";

  const main = document.createElement("span");
  main.className = "pin-city";
  main.textContent = primary || t("world");
  label.appendChild(main);

  return label;
}

function createClimateLabel(city, item) {
  const label = document.createElement("span");
  label.className = "pin-label climate-label";

  const main = document.createElement("span");
  main.className = "pin-city";
  main.textContent = cityName(city);
  label.appendChild(main);

  const details = document.createElement("span");
  details.className = "climate-details";

  const temp = document.createElement("span");
  temp.textContent = `${Math.round(item.temperature)} C`;
  details.appendChild(temp);

  const clock = document.createElement("span");
  clock.dataset.cityClock = city.id;
  clock.textContent = formatTime(city.zone);
  details.appendChild(clock);

  const condition = document.createElement("span");
  condition.textContent = weatherText(item.code);
  details.appendChild(condition);

  label.appendChild(details);
  return label;
}

function createHoverCard({ time, title, body, meta }) {
  const card = document.createElement("span");
  card.className = "pin-hover-card";

  const timeLine = document.createElement("span");
  timeLine.className = "hover-time";
  timeLine.textContent = time;
  card.appendChild(timeLine);

  const titleLine = document.createElement("strong");
  titleLine.textContent = title;
  card.appendChild(titleLine);

  if (body) {
    const bodyLine = document.createElement("span");
    bodyLine.className = "hover-body";
    bodyLine.textContent = body;
    card.appendChild(bodyLine);
  }

  if (meta) {
    const metaLine = document.createElement("span");
    metaLine.className = "hover-meta";
    metaLine.textContent = meta;
    card.appendChild(metaLine);
  }

  return card;
}

function loadLabelLayouts() {
  try {
    const saved = JSON.parse(localStorage.getItem(labelLayoutStorageKey) || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

function saveLabelLayouts() {
  try {
    localStorage.setItem(labelLayoutStorageKey, JSON.stringify(labelLayouts));
  } catch {
    // Storage can be unavailable in hardened browser modes. Drag still works for this session.
  }
}

function currentLabelLayout(pin) {
  return {
    x: Number.parseFloat(pin.style.getPropertyValue("--label-x")) || 0,
    y: Number.parseFloat(pin.style.getPropertyValue("--label-y")) || 0,
    scale: Number.parseFloat(pin.dataset.labelManualScale) || 1
  };
}

function storedLabelLayout(saved) {
  if (!saved || typeof saved !== "object") return null;
  if (saved.unit === "map-scale" && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
    return saved;
  }
  if (Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
    const scaleAtSave = Number.isFinite(saved.mapScale) ? saved.mapScale : 1;
    return {
      unit: "map-scale",
      x: saved.x / scaleAtSave,
      y: saved.y / scaleAtSave,
      scale: Number.isFinite(saved.scale) ? saved.scale : 1
    };
  }
  return null;
}

function setLabelLayout(pin, x, y, scale) {
  const manualScale = clamp(scale, minLabelScale, maxLabelScale);
  pin.style.setProperty("--label-x", `${Math.round(x)}px`);
  pin.style.setProperty("--label-y", `${Math.round(y)}px`);
  pin.dataset.labelManualScale = manualScale.toFixed(2);
  pin.style.setProperty("--label-scale", (manualScale * mapUiScale).toFixed(2));
}

function labelBoxSize(text, height = labelHeight, scale = 1) {
  return {
    width: estimateLabelWidth(text, height) * mapUiScale * scale,
    height: height * mapUiScale * scale
  };
}

function labelRectFromOffset(point, x, y, width, height, rank = 0) {
  return {
    x,
    y,
    left: point.x + x,
    top: point.y + y,
    right: point.x + x + width,
    bottom: point.y + y + height,
    rank
  };
}

function manualDistanceLimit() {
  return clamp(manualLabelMaxDistance * mapUiScale, manualLabelMaxDistance, manualLabelMaxDistance + 42);
}

function resolveManualLabelOffset(point, text, rect, x, y, height, scale, fallbackRect) {
  const size = labelBoxSize(text, height, scale);
  let clamped = clampLabelToMap(point, rect, size.width, size.height, x, y);
  let candidate = labelRectFromOffset(point, clamped.x, clamped.y, size.width, size.height);

  if (pointToRectDistance(point, candidate) < markerClearance && fallbackRect) {
    return fallbackRect;
  }

  const maxDistance = manualDistanceLimit();
  if (pointToRectDistance(point, candidate) > maxDistance) {
    const centerX = candidate.left + size.width / 2;
    const centerY = candidate.top + size.height / 2;
    const dx = centerX - point.x;
    const dy = centerY - point.y;
    const centerDistance = Math.hypot(dx, dy);
    const allowedCenterDistance = Math.hypot(size.width / 2, size.height / 2) + maxDistance;

    if (centerDistance > allowedCenterDistance && centerDistance > 0) {
      const ratio = allowedCenterDistance / centerDistance;
      clamped = clampLabelToMap(
        point,
        rect,
        size.width,
        size.height,
        dx * ratio - size.width / 2,
        dy * ratio - size.height / 2
      );
      candidate = labelRectFromOffset(point, clamped.x, clamped.y, size.width, size.height);
    }
  }

  if (pointToRectDistance(point, candidate) < markerClearance && fallbackRect) {
    return fallbackRect;
  }

  return candidate;
}

function applySavedLabelLayout(pin, key, point, text, rect, height, fallbackRect) {
  const saved = storedLabelLayout(labelLayouts[key]);
  if (!saved) {
    const layout = currentLabelLayout(pin);
    setLabelLayout(pin, layout.x, layout.y, 1);
    return fallbackRect;
  }

  const scale = Number.isFinite(saved.scale) ? saved.scale : 1;
  const x = saved.x * mapUiScale;
  const y = saved.y * mapUiScale;
  const resolved = resolveManualLabelOffset(point, text, rect, x, y, height, scale, fallbackRect);
  setLabelLayout(pin, resolved.x, resolved.y, scale);
  pin.classList.add("manual-label");
  return resolved;
}

function rememberLabelLayout(key, pin) {
  const layout = currentLabelLayout(pin);
  labelLayouts[key] = {
    unit: "map-scale",
    x: layout.x / mapUiScale,
    y: layout.y / mapUiScale,
    scale: layout.scale,
    mapScale: mapUiScale
  };
  pin.classList.add("manual-label");
  saveLabelLayouts();
}

function makeLabelInteractive(label, pin, key) {
  label.dataset.layoutKey = key;
  label.title = "Drag to move. Resize from the corner. Double-click to reset.";

  const handle = document.createElement("span");
  handle.className = "label-resize-handle";
  handle.setAttribute("aria-hidden", "true");
  label.appendChild(handle);

  let action = null;
  const begin = (event, mode) => {
    if (event.button !== 0 && event.pointerType !== "touch") return;
    event.preventDefault();
    event.stopPropagation();
    const layout = currentLabelLayout(pin);
    action = {
      mode,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      labelX: layout.x,
      labelY: layout.y,
      scale: layout.scale
    };
    pin.dataset.suppressClick = "true";
    pin.classList.add("label-is-adjusting");
    label.classList.add("label-adjusting");
    label.setPointerCapture(event.pointerId);
  };

  label.addEventListener("pointerdown", event => {
    if (event.target.closest(".label-resize-handle")) return;
    begin(event, "drag");
  });

  handle.addEventListener("pointerdown", event => begin(event, "resize"));

  label.addEventListener("pointermove", event => {
    if (!action || action.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const dx = event.clientX - action.startX;
    const dy = event.clientY - action.startY;

    if (action.mode === "resize") {
      const scale = clamp(action.scale + (dx + dy) / labelResizeSensitivity, minLabelScale, maxLabelScale);
      setLabelLayout(pin, action.labelX, action.labelY, scale);
      return;
    }

    setLabelLayout(pin, action.labelX + dx, action.labelY + dy, action.scale);
  });

  const finish = event => {
    if (!action || action.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    pin.classList.remove("label-is-adjusting");
    label.classList.remove("label-adjusting");
    rememberLabelLayout(key, pin);
    action = null;
    window.setTimeout(() => {
      delete pin.dataset.suppressClick;
    }, 0);
  };

  label.addEventListener("pointerup", finish);
  label.addEventListener("pointercancel", finish);
  label.addEventListener("dblclick", event => {
    event.preventDefault();
    event.stopPropagation();
    delete labelLayouts[key];
    saveLabelLayouts();
    positionEventPins();
  });
}

function labelsCollide(a, b) {
  const closeX = Math.abs(a.x - b.x) < labelClearance;
  const closeY = Math.abs(a.y - b.y) < 58;
  const distance = Math.hypot(a.x - b.x, a.y - b.y);
  return (closeX && closeY) || distance < 86;
}

function estimateLabelWidth(text, height = labelHeight) {
  if (height >= labelHeight) return 174;
  return clamp((text || "").length * 6 + 30, 72, 230);
}

function rectanglesOverlap(a, b) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

function pointToRectDistance(point, rectangle) {
  const dx = point.x < rectangle.left
    ? rectangle.left - point.x
    : point.x > rectangle.right
      ? point.x - rectangle.right
      : 0;
  const dy = point.y < rectangle.top
    ? rectangle.top - point.y
    : point.y > rectangle.bottom
      ? point.y - rectangle.bottom
      : 0;
  return Math.hypot(dx, dy);
}

function labelGap() {
  return clamp(labelAnchorGap + (mapUiScale - 1) * 3, labelAnchorGap, labelAnchorGap + 3);
}

function labelDistanceRange() {
  const preferred = labelGap();
  return {
    preferred,
    comfortable: preferred + 22 + (mapUiScale - 1) * 8,
    hard: preferred + 44 + (mapUiScale - 1) * 10
  };
}

function labelCandidateOffsets(width, height, compact = false) {
  const centerX = -width / 2;
  const centerY = -height / 2;
  const gap = labelGap();

  const sideCandidates = [
    { x: gap, y: centerY, rank: 0 },
    { x: -width - gap, y: centerY, rank: 1 },
    { x: centerX, y: -height - gap, rank: 2 },
    { x: centerX, y: gap, rank: 3 },
    { x: gap, y: -height - gap, rank: 4 },
    { x: -width - gap, y: -height - gap, rank: 5 },
    { x: gap, y: gap, rank: 6 },
    { x: -width - gap, y: gap, rank: 7 }
  ];

  if (!compact) return sideCandidates;

  return [
    { x: gap, y: -height - gap, rank: 0 },
    { x: -width - gap, y: -height - gap, rank: 1 },
    ...sideCandidates.map(candidate => ({ ...candidate, rank: candidate.rank + 2 }))
  ];
}

function clampLabelToMap(point, rect, width, height, x, y) {
  if (point.x + x < labelMapMargin) {
    x = labelMapMargin - point.x;
  }
  if (point.x + x + width > rect.width - labelMapMargin) {
    x = rect.width - point.x - width - labelMapMargin;
  }
  if (point.y + y < labelMapMargin) {
    y = labelMapMargin - point.y;
  }
  if (point.y + y + height > rect.height - labelMapMargin) {
    y = rect.height - point.y - height - labelMapMargin;
  }
  return { x, y };
}

function labelRectFor(point, text, rect, placement, height = labelHeight) {
  const size = labelBoxSize(text, height);
  const clamped = clampLabelToMap(point, rect, size.width, size.height, placement.x, placement.y);
  return labelRectFromOffset(point, clamped.x, clamped.y, size.width, size.height, placement.rank || 0);
}

function applyHoverPlacement(pin, point, rect) {
  let x = 28;
  let y = -112;

  if (point.x + x + hoverCardWidth > rect.width - labelMapMargin) {
    x = -hoverCardWidth - 28;
  }
  if (point.y + y < labelMapMargin) {
    y = 22;
  }
  if (point.y + y + hoverCardHeight > rect.height - labelMapMargin) {
    y = rect.height - point.y - hoverCardHeight - labelMapMargin;
  }

  pin.style.setProperty("--hover-x", `${Math.round(x)}px`);
  pin.style.setProperty("--hover-y", `${Math.round(y)}px`);
}

function labelPenalty(candidate, point, occupiedLabels, markerPoints) {
  let penalty = candidate.rank * 24;
  const ownDistance = pointToRectDistance(point, candidate);
  const range = labelDistanceRange();

  if (ownDistance < range.preferred - 1) {
    penalty += 100000 + (range.preferred - ownDistance) * 500;
  } else {
    penalty += Math.abs(ownDistance - range.preferred) * 1.2;
    if (ownDistance > range.comfortable) {
      penalty += (ownDistance - range.comfortable) * 90;
    }
    if (ownDistance > range.hard) {
      penalty += 50000 + (ownDistance - range.hard) * 300;
    }
  }

  for (const existing of occupiedLabels) {
    if (rectanglesOverlap(candidate, existing)) penalty += 760;
  }
  for (const markerPoint of markerPoints) {
    const markerDistance = pointToRectDistance(markerPoint, candidate);
    if (markerDistance < markerClearance) {
      penalty += 3000 + (markerClearance - markerDistance) * 80;
    }
  }
  return penalty;
}

function applyLabelPlacement(pin, point, text, rect, occupiedLabels, markerPoints, height = labelHeight) {
  const width = estimateLabelWidth(text, height) * mapUiScale;
  const scaledHeight = height * mapUiScale;
  const candidates = labelCandidateOffsets(width, scaledHeight, height <= 30);
  let best = labelRectFor(point, text, rect, candidates[0], height);
  let bestPenalty = Number.POSITIVE_INFINITY;

  for (const placement of candidates) {
    const candidate = labelRectFor(point, text, rect, placement, height);
    const penalty = labelPenalty(candidate, point, occupiedLabels, markerPoints);
    if (penalty < bestPenalty) {
      best = candidate;
      bestPenalty = penalty;
    }
  }

  pin.style.setProperty("--label-x", `${Math.round(best.x)}px`);
  pin.style.setProperty("--label-y", `${Math.round(best.y)}px`);
  applyHoverPlacement(pin, point, rect);
  return best;
}

function updateClimateClocks() {
  document.querySelectorAll("[data-city-clock]").forEach(clock => {
    const city = cities.find(item => item.id === clock.dataset.cityClock);
    if (city) clock.textContent = formatTime(city.zone);
  });
  document.querySelectorAll("[data-hover-clock]").forEach(clock => {
    const city = cities.find(item => item.id === clock.dataset.hoverClock);
    if (city) clock.textContent = formatTime(city.zone);
  });
}

function selectSpacedMapItems(items, rect, maxItems, activeKey = "") {
  const selected = [];

  for (const item of items) {
    const point = project(item.lat, item.lon, rect.width, rect.height);
    const key = item.key || item.id || locationKey(item);
    const isActive = key === activeKey;
    const collisionIndex = selected.findIndex(existing => labelsCollide(point, existing._mapPoint));

    if (collisionIndex !== -1) {
      if (!isActive) continue;
      selected.splice(collisionIndex, 1);
    }

    selected.push({ ...item, _mapPoint: point });
    if (selected.length >= maxItems && !isActive) break;
  }

  return selected.slice(0, maxItems);
}

function renderPlaceReports(related, activeId) {
  els.placeReports.innerHTML = "";
  if (!related.length) return;

  const list = document.createElement("div");
  list.className = "place-report-list";
  for (const event of related.slice(0, 6)) {
    const button = document.createElement("button");
    button.className = `place-report ${event.id === activeId ? "active" : ""}`;
    button.addEventListener("click", () => selectEvent(event.id));

    const headline = document.createElement("strong");
    headline.textContent = reportTitleText(event);
    button.appendChild(headline);

    const meta = document.createElement("span");
    meta.textContent = `${event.source} - ${formatDate(event.published)}`;
    button.appendChild(meta);
    list.appendChild(button);
  }
  els.placeReports.appendChild(list);
}

function renderWeatherInspect(city, item) {
  els.placeReports.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "weather-inspect-grid";

  const metrics = [
    [t("local"), formatTime(city.zone)],
    [t("weather"), weatherText(item.code)],
    [t("temp"), `${Math.round(item.temperature)} C`]
  ];

  metrics.forEach(([label, value]) => {
    const metric = document.createElement("div");
    metric.className = "weather-inspect-metric";

    const name = document.createElement("span");
    name.textContent = label;
    metric.appendChild(name);

    const reading = document.createElement("strong");
    reading.textContent = value;
    metric.appendChild(reading);

    grid.appendChild(metric);
  });

  els.placeReports.appendChild(grid);
}

function createInspectMetric(label, value, { valueClass = "" } = {}) {
  const metric = document.createElement("div");
  metric.className = "weather-inspect-metric";

  const name = document.createElement("span");
  name.textContent = label;
  metric.appendChild(name);

  const reading = document.createElement("strong");
  reading.textContent = value;
  if (valueClass) reading.className = valueClass;
  metric.appendChild(reading);

  return metric;
}

function pointTimestamp(point) {
  const raw = point?.time || point?.date || point?.label;
  if (!raw) return NaN;
  const time = Date.parse(raw);
  return Number.isFinite(time) ? time : NaN;
}

function formatChartDate(point, options = {}) {
  const raw = point?.time || point?.date || point?.label;
  if (!raw) return "--";
  const time = pointTimestamp(point);
  if (!Number.isFinite(time)) return String(raw);
  const spanDays = Number(options.spanDays);
  const isAxis = options.axis === true;
  let dateOptions;
  if (isAxis && spanDays >= 365) {
    dateOptions = { year: "numeric", month: "2-digit" };
  } else if (isAxis && spanDays >= 60) {
    dateOptions = { month: "2-digit", day: "2-digit" };
  } else if (isAxis) {
    dateOptions = { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false };
  } else if (point?.time) {
    dateOptions = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false };
  } else {
    dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
  }
  return new Intl.DateTimeFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", dateOptions).format(new Date(time));
}

function chartSpanDays(history) {
  const times = history.map(pointTimestamp).filter(Number.isFinite);
  if (times.length < 2) return 0;
  return (Math.max(...times) - Math.min(...times)) / (24 * 60 * 60 * 1000);
}

function formatChartAxisDate(point, history) {
  const spanDays = chartSpanDays(history);
  const raw = point?.time || point?.date || point?.label;
  if (spanDays >= 365) {
    return formatChartDate(point, { axis: true, spanDays });
  }
  if (spanDays >= 60) {
    const time = pointTimestamp(point);
    if (!Number.isFinite(time)) return raw ? String(raw) : "--";
    const date = new Date(time);
    return new Intl.DateTimeFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", {
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }
  return formatChartDate(point, { axis: true, spanDays });
}

function formatChartValue(asset, point) {
  const value = Number(point?.value);
  if (!Number.isFinite(value)) return "--";
  if (point?.valueKind === "marketCap" || asset?.group === "companies") {
    return formatMarketCapCurrency(value);
  }
  return formatAssetPrice({ ...asset, value });
}

function chartTickIndices(length, count = 3) {
  if (length <= 1) return [0];
  const ticks = new Set();
  for (let index = 0; index < count; index += 1) {
    ticks.add(Math.round((index / Math.max(1, count - 1)) * (length - 1)));
  }
  return Array.from(ticks).sort((a, b) => a - b);
}

function createMarketChart(asset) {
  const ns = "http://www.w3.org/2000/svg";
  const width = 640;
  const height = 220;
  const padLeft = 58;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 28;
  const history = rangedMarketHistory(asset);
  if (history.length < 2) {
    const empty = document.createElement("div");
    empty.className = "market-chart-empty";
    empty.textContent = (asset?.historyLoading || (canFetchMarketHistory(asset) && !marketHistoryLoadFailedForRange(asset, selectedMarketRange)))
      ? t("loadingHistory")
      : t("chartUnavailableForRange");
    return empty;
  }
  const values = history.map(point => point.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const flatChart = values.every(value => Math.abs(value - values[0]) <= Math.max(1, Math.abs(values[0] || 1)) * 0.000001);
  const flatPad = Math.abs(values[0] || 1) * 0.01;
  const min = flatChart ? values[0] - flatPad : rawMin;
  const max = flatChart ? values[0] + flatPad : rawMax;
  const range = Math.max(max - min, Math.abs(max || 1) * 0.01);
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;
  const points = history.map((point, index) => {
    const value = point.value;
    const x = padLeft + (index / Math.max(1, history.length - 1)) * chartWidth;
    const y = padTop + (1 - ((value - min) / range)) * chartHeight;
    return [x, y];
  });

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${marketName(asset)} ${t("marketRange")}`);

  for (let index = 0; index < 4; index += 1) {
    const y = padTop + (index / 3) * chartHeight;
    const value = max - (index / 3) * range;
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", padLeft);
    line.setAttribute("x2", width - padRight);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", themeRgba("blue", 0.16));
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);

    const yLabel = document.createElementNS(ns, "text");
    yLabel.setAttribute("x", padLeft - 8);
    yLabel.setAttribute("y", y + 4);
    yLabel.setAttribute("text-anchor", "end");
    yLabel.setAttribute("class", "market-axis-label");
    yLabel.textContent = formatChartValue(asset, { value, valueKind: history[0]?.valueKind });
    svg.appendChild(yLabel);
  }

  const pathData = points.map(([x, y], index) => `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  if (!flatChart) {
    const area = document.createElementNS(ns, "path");
    area.setAttribute("d", `${pathData} L ${(width - padRight).toFixed(1)} ${(height - padBottom).toFixed(1)} L ${padLeft} ${(height - padBottom).toFixed(1)} Z`);
    area.setAttribute("fill", marketChangeClass(asset) === "negative" ? themeRgba("red", 0.10) : themeRgba("green", 0.10));
    svg.appendChild(area);
  }

  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", pathData);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", marketChangeClass(asset) === "negative" ? "var(--red)" : "var(--green)");
  path.setAttribute("stroke-width", "3");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);

  const last = points[points.length - 1];
  if (last && !flatChart) {
    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", last[0]);
    dot.setAttribute("cy", last[1]);
    dot.setAttribute("r", "5");
    dot.setAttribute("fill", marketChangeClass(asset) === "negative" ? "var(--red)" : "var(--green)");
    svg.appendChild(dot);
  }

  chartTickIndices(history.length, 3).forEach(index => {
    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", points[index][0]);
    label.setAttribute("y", height - 7);
    label.setAttribute("text-anchor", index === 0 ? "start" : index === history.length - 1 ? "end" : "middle");
    label.setAttribute("class", "market-axis-label");
    label.textContent = formatChartAxisDate(history[index], history);
    svg.appendChild(label);
  });

  const hoverGroup = document.createElementNS(ns, "g");
  hoverGroup.setAttribute("class", "market-chart-hover");
  hoverGroup.style.display = "none";

  const hoverLine = document.createElementNS(ns, "line");
  hoverLine.setAttribute("y1", padTop);
  hoverLine.setAttribute("y2", height - padBottom);
  hoverLine.setAttribute("class", "market-hover-line");
  hoverGroup.appendChild(hoverLine);

  const hoverDot = document.createElementNS(ns, "circle");
  hoverDot.setAttribute("r", "5");
  hoverDot.setAttribute("class", "market-hover-dot");
  hoverGroup.appendChild(hoverDot);

  const tooltip = document.createElementNS(ns, "g");
  const tooltipBg = document.createElementNS(ns, "rect");
  tooltipBg.setAttribute("width", "150");
  tooltipBg.setAttribute("height", "46");
  tooltipBg.setAttribute("rx", "5");
  tooltipBg.setAttribute("class", "market-chart-tooltip-bg");
  tooltip.appendChild(tooltipBg);

  const tooltipDate = document.createElementNS(ns, "text");
  tooltipDate.setAttribute("x", "8");
  tooltipDate.setAttribute("y", "17");
  tooltipDate.setAttribute("class", "market-chart-tooltip-date");
  tooltip.appendChild(tooltipDate);

  const tooltipValue = document.createElementNS(ns, "text");
  tooltipValue.setAttribute("x", "8");
  tooltipValue.setAttribute("y", "35");
  tooltipValue.setAttribute("class", "market-chart-tooltip-value");
  tooltip.appendChild(tooltipValue);
  hoverGroup.appendChild(tooltip);
  svg.appendChild(hoverGroup);

  const overlay = document.createElementNS(ns, "rect");
  overlay.setAttribute("x", padLeft);
  overlay.setAttribute("y", padTop);
  overlay.setAttribute("width", chartWidth);
  overlay.setAttribute("height", chartHeight);
  overlay.setAttribute("fill", "transparent");
  overlay.style.cursor = "crosshair";
  overlay.addEventListener("mousemove", event => {
    const rect = svg.getBoundingClientRect();
    const localX = ((event.clientX - rect.left) / rect.width) * width;
    const ratio = clamp((localX - padLeft) / chartWidth, 0, 1);
    const index = clamp(Math.round(ratio * (history.length - 1)), 0, history.length - 1);
    const [x, y] = points[index];
    const point = history[index];
    hoverGroup.style.display = "";
    hoverLine.setAttribute("x1", x);
    hoverLine.setAttribute("x2", x);
    hoverDot.setAttribute("cx", x);
    hoverDot.setAttribute("cy", y);
    tooltipDate.textContent = formatChartDate(point);
    tooltipValue.textContent = formatChartValue(asset, point);
    const tooltipX = Math.max(8, x - 82);
    const tooltipY = y < 60 ? y + 12 : y - 56;
    tooltip.setAttribute("transform", `translate(${tooltipX.toFixed(1)} ${tooltipY.toFixed(1)})`);
  });
  overlay.addEventListener("mouseleave", () => {
    hoverGroup.style.display = "none";
  });
  svg.appendChild(overlay);

  return svg;
}

function createCurrencyChart(anchor, quote) {
  const ns = "http://www.w3.org/2000/svg";
  const width = 520;
  const height = 150;
  const padLeft = 82;
  const padRight = 14;
  const padTop = 14;
  const padBottom = 24;
  let history = currencyPairHistory(anchor, quote);
  let flatFallback = false;
  if (history.length < 2) {
    history = flatCurrencyPairHistory(anchor, quote);
    flatFallback = history.length >= 2;
  }
  if (history.length < 2) {
    return document.createDocumentFragment();
  }

  const values = history.map(point => point.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const flatChart = flatFallback || values.every(value => Math.abs(value - values[0]) <= Math.max(1, Math.abs(values[0] || 1)) * 0.000001);
  const flatPad = Math.max(Math.abs(values[0] || 1) * 0.01, Number.EPSILON);
  const min = flatChart ? values[0] - flatPad : rawMin;
  const max = flatChart ? values[0] + flatPad : rawMax;
  const range = Math.max(max - min, Math.abs(max || 1) * 0.01);
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;
  const points = history.map((point, index) => {
    const x = padLeft + (index / Math.max(1, history.length - 1)) * chartWidth;
    const y = padTop + (1 - ((point.value - min) / range)) * chartHeight;
    return [x, y];
  });
  const changeClass = currencyChangeClass(currencyPairChangePct(anchor, quote));
  const chartTone = changeClass === "negative" ? "red" : "green";

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${anchor?.code || ""}/${quote?.code || ""} ${t("currencyRate")}`);

  for (let index = 0; index < 3; index += 1) {
    const y = padTop + (index / 2) * chartHeight;
    const value = max - (index / 2) * range;
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", padLeft);
    line.setAttribute("x2", width - padRight);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", themeRgba("blue", 0.14));
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);

    const yLabel = document.createElementNS(ns, "text");
    yLabel.setAttribute("x", padLeft - 9);
    yLabel.setAttribute("y", y + 4);
    yLabel.setAttribute("text-anchor", "end");
    yLabel.setAttribute("class", "market-axis-label");
    yLabel.textContent = formatExchangeAxisNumber(value);
    svg.appendChild(yLabel);
  }

  const pathData = points.map(([x, y], index) => `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = document.createElementNS(ns, "path");
  area.setAttribute("d", `${pathData} L ${(width - padRight).toFixed(1)} ${(height - padBottom).toFixed(1)} L ${padLeft} ${(height - padBottom).toFixed(1)} Z`);
  area.setAttribute("fill", themeRgba(chartTone, flatFallback ? 0.04 : 0.10));
  svg.appendChild(area);

  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", pathData);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", chartTone === "red" ? "var(--red)" : "var(--green)");
  path.setAttribute("stroke-width", "3");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);

  chartTickIndices(history.length, 3).forEach(index => {
    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", points[index][0]);
    label.setAttribute("y", height - 6);
    label.setAttribute("text-anchor", index === 0 ? "start" : index === history.length - 1 ? "end" : "middle");
    label.setAttribute("class", "market-axis-label");
    label.textContent = formatChartAxisDate(history[index], history);
    svg.appendChild(label);
  });

  const hoverGroup = document.createElementNS(ns, "g");
  hoverGroup.setAttribute("class", "market-chart-hover");
  hoverGroup.style.display = "none";

  const hoverLine = document.createElementNS(ns, "line");
  hoverLine.setAttribute("y1", padTop);
  hoverLine.setAttribute("y2", height - padBottom);
  hoverLine.setAttribute("class", "market-hover-line");
  hoverGroup.appendChild(hoverLine);

  const hoverDot = document.createElementNS(ns, "circle");
  hoverDot.setAttribute("r", "4");
  hoverDot.setAttribute("class", "market-hover-dot");
  hoverGroup.appendChild(hoverDot);

  const tooltip = document.createElementNS(ns, "g");
  const tooltipBg = document.createElementNS(ns, "rect");
  tooltipBg.setAttribute("width", "150");
  tooltipBg.setAttribute("height", "46");
  tooltipBg.setAttribute("rx", "5");
  tooltipBg.setAttribute("class", "market-chart-tooltip-bg");
  tooltip.appendChild(tooltipBg);

  const tooltipDate = document.createElementNS(ns, "text");
  tooltipDate.setAttribute("x", "8");
  tooltipDate.setAttribute("y", "17");
  tooltipDate.setAttribute("class", "market-chart-tooltip-date");
  tooltip.appendChild(tooltipDate);

  const tooltipValue = document.createElementNS(ns, "text");
  tooltipValue.setAttribute("x", "8");
  tooltipValue.setAttribute("y", "35");
  tooltipValue.setAttribute("class", "market-chart-tooltip-value");
  tooltip.appendChild(tooltipValue);
  hoverGroup.appendChild(tooltip);
  svg.appendChild(hoverGroup);

  const overlay = document.createElementNS(ns, "rect");
  overlay.setAttribute("x", padLeft);
  overlay.setAttribute("y", padTop);
  overlay.setAttribute("width", chartWidth);
  overlay.setAttribute("height", chartHeight);
  overlay.setAttribute("fill", "transparent");
  overlay.style.cursor = "crosshair";
  overlay.addEventListener("mousemove", event => {
    const rect = svg.getBoundingClientRect();
    const localX = ((event.clientX - rect.left) / rect.width) * width;
    const ratio = clamp((localX - padLeft) / chartWidth, 0, 1);
    const index = clamp(Math.round(ratio * (history.length - 1)), 0, history.length - 1);
    const [x, y] = points[index];
    const point = history[index];
    hoverGroup.style.display = "";
    hoverLine.setAttribute("x1", x);
    hoverLine.setAttribute("x2", x);
    hoverDot.setAttribute("cx", x);
    hoverDot.setAttribute("cy", y);
    tooltipDate.textContent = formatChartDate(point);
    tooltipValue.textContent = formatCurrencyChartValue(quote?.code, point.value);
    const tooltipX = Math.max(8, x - 82);
    const tooltipY = y < 60 ? y + 12 : y - 56;
    tooltip.setAttribute("transform", `translate(${tooltipX.toFixed(1)} ${tooltipY.toFixed(1)})`);
  });
  overlay.addEventListener("mouseleave", () => {
    hoverGroup.style.display = "none";
  });
  svg.appendChild(overlay);

  return svg;
}

function assetMetaText(asset) {
  const pieces = [];
  const rank = marketDisplayRank(asset);
  if (Number.isFinite(rank)) pieces.push(`#${rank}`);
  pieces.push(marketGroupLabel(asset.group));
  if (asset.symbol) pieces.push(asset.symbol);
  return pieces.join(" - ");
}

function assetFallbackText(asset) {
  const raw = String(asset?.symbol || marketName(asset) || "?").replace(/[^a-z0-9]/gi, "");
  return (raw || "?").slice(0, 2).toUpperCase();
}

function createAssetFallbackIcon(asset, className = "asset-logo") {
  const fallback = document.createElement("span");
  fallback.className = `${className} market-leader-fallback`;
  fallback.textContent = assetFallbackText(asset);
  return fallback;
}

function createAssetIcon(asset, className = "asset-logo") {
  const url = asset.logoUrl || asset.countryFlag || "";
  if (!url) return null;
  const image = document.createElement("img");
  image.className = className;
  image.src = url;
  image.alt = "";
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.replaceWith(createAssetFallbackIcon(asset, className));
  }, { once: true });
  return image;
}

function createCountryFlag(asset) {
  const url = String(asset?.countryFlag || "").trim();
  const code = String(asset?.countryCode || "").trim().toLowerCase();
  const flagUrl = /^[a-z]{2}$/.test(code)
    ? `https://flagcdn.com/w40/${code}.png`
    : /^https?:\/\//i.test(url)
      ? url
      : "";
  if (flagUrl) {
    const flag = document.createElement("img");
    flag.className = "asset-country-flag";
    flag.src = flagUrl;
    flag.alt = asset.country || code.toUpperCase() || "";
    flag.title = asset.country || code.toUpperCase() || "";
    flag.loading = "lazy";
    flag.addEventListener("error", () => {
      flag.remove();
    }, { once: true });
    return flag;
  }
  return null;
}

function setMarketGroupFilter(group, enabled) {
  marketGroupFilters = { ...marketGroupFilters, [group]: enabled };
  const visible = rankedVisibleMarketAssets();
  if (!visible.some(asset => asset.id === selectedMarketId)) {
    selectedMarketId = defaultMarketAsset(visible)?.id || "";
  }
  renderMarketBoard();
  renderFeed();
  saveViewState();
}

function createMarketFilterToggle(group, labelKey) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `market-filter-toggle ${marketGroupFilters[group] ? "active" : ""}`;
  button.textContent = t(labelKey);
  button.setAttribute("aria-pressed", marketGroupFilters[group] ? "true" : "false");
  button.addEventListener("click", () => setMarketGroupFilter(group, !marketGroupFilters[group]));
  return button;
}

function marketNavigationAssets() {
  const ranked = rankedVisibleMarketAssets();
  const topAssets = ranked.slice(0, 50);
  const selected = ranked.find(asset => asset.id === selectedMarketId);
  if (!selected || topAssets.some(asset => asset.id === selected.id)) {
    return topAssets;
  }
  return topAssets.concat(selected);
}

function setMarketRange(range, options = {}) {
  if (!marketRangeOptions.includes(range)) return;
  const active = visibleMarketAssetById(selectedMarketId);
  selectedMarketRange = range;
  if (options.focusList && active) {
    marketPendingFocusAssetId = active.id;
    marketPendingFocusDirection = 0;
  }
  if (active) {
    renderMarketInspect(active);
  }
  renderMarketBoard();
  saveViewState();
  if (active) {
    fetchMarketHistory(active);
  }
}

function navigateMarketAsset(direction) {
  const assets = rankedVisibleMarketAssets();
  if (!assets.length) return;
  let currentIndex = assets.findIndex(asset => asset.id === selectedMarketId);
  if (currentIndex < 0) {
    const fallback = defaultMarketAsset(assets);
    currentIndex = Math.max(0, assets.findIndex(asset => asset.id === fallback?.id));
  }
  const nextIndex = clamp(currentIndex + direction, 0, assets.length - 1);
  const next = assets[nextIndex];
  if (!next || next.id === selectedMarketId) return;
  selectMarket(next.id, { focusList: true, focusDirection: direction });
}

function navigateMarketRange(direction) {
  const currentIndex = Math.max(0, marketRangeOptions.indexOf(selectedMarketRange));
  const nextIndex = clamp(currentIndex + direction, 0, marketRangeOptions.length - 1);
  const nextRange = marketRangeOptions[nextIndex];
  if (!nextRange || nextRange === selectedMarketRange) return;
  setMarketRange(nextRange, { focusList: true });
}

function handleMarketBoardKeydown(event) {
  if (!isMarketMode() || event.altKey || event.ctrlKey || event.metaKey) return;
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  if (event.key === "ArrowUp") navigateMarketAsset(-1);
  if (event.key === "ArrowDown") navigateMarketAsset(1);
  if (event.key === "ArrowLeft") navigateMarketRange(-1);
  if (event.key === "ArrowRight") navigateMarketRange(1);
}

function focusMarketBoardFromPointer(event) {
  if (!isMarketMode() || !els.marketBoard || !els.marketBoard.contains(event.target)) return;
  if (event.target.closest("a, button, .market-leader-row")) return;
  requestAnimationFrame(() => {
    try {
      els.marketBoard.focus({ preventScroll: true });
    } catch {
      els.marketBoard.focus();
    }
  });
}

function createMarketTile(asset, className = "market-tile") {
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = `${className} ${asset.id === selectedMarketId ? "active" : ""}`;
  tile.addEventListener("click", () => selectMarket(asset.id));

  const heading = document.createElement("div");
  heading.className = "market-asset-heading";
  const icon = createAssetIcon(asset);
  if (icon) heading.appendChild(icon);
  const text = document.createElement("div");
  const groupLine = document.createElement("span");
  groupLine.textContent = assetMetaText(asset);
  text.appendChild(groupLine);
  const nameLine = document.createElement("strong");
  nameLine.textContent = marketName(asset);
  text.appendChild(nameLine);
  heading.appendChild(text);
  const flag = createCountryFlag(asset);
  if (flag) heading.appendChild(flag);
  tile.appendChild(heading);

  const group = document.createElement("span");
  group.textContent = `${marketGroupLabel(asset.group)} - ${asset.symbol || ""}`.trim();
  tile.appendChild(group);

  const name = document.createElement("strong");
  name.textContent = marketName(asset);
  tile.appendChild(name);

  const meta = document.createElement("div");
  meta.className = "market-asset-meta";

  const value = document.createElement("span");
  value.className = "market-value";
  value.textContent = formatPrimaryMarketValue(asset);
  meta.appendChild(value);

  const move = document.createElement("span");
  move.className = `market-value ${marketChangeClass(asset)}`;
  move.textContent = formatMarketChange(asset);
  meta.appendChild(move);

  tile.appendChild(meta);
  return tile;
}

function marketLeaderRowTop(list, row) {
  if (!list || !row) return 0;
  const listRect = list.getBoundingClientRect();
  const rowRect = row.getBoundingClientRect();
  return Math.max(0, rowRect.top - listRect.top + list.scrollTop);
}

function marketLeaderTopInset(list) {
  if (!list) return 0;
  const value = parseFloat(getComputedStyle(list).paddingTop);
  return Number.isFinite(value) ? value : 0;
}

function marketLeaderBottomInset(list) {
  if (!list) return 0;
  const value = parseFloat(getComputedStyle(list).paddingBottom);
  return Number.isFinite(value) ? value : 0;
}

function marketLeaderScrollTarget(list, row) {
  const maxTop = Math.max(0, list.scrollHeight - list.clientHeight);
  const rowTop = marketLeaderRowTop(list, row);
  return clamp(rowTop - marketLeaderTopInset(list), 0, maxTop);
}

function marketLeaderBasePaddingBottom(list) {
  if (!list) return 0;
  const saved = Number(list.dataset.basePaddingBottom);
  if (Number.isFinite(saved) && saved >= 0) return saved;
  const value = parseFloat(getComputedStyle(list).paddingBottom);
  const base = Number.isFinite(value) ? value : 0;
  list.dataset.basePaddingBottom = String(base);
  return base;
}

function updateMarketLeadersEndPadding(list) {
  if (!list) return;
  const rows = Array.from(list.querySelectorAll(".market-leader-row"));
  if (!rows.length) return;
  const basePadding = marketLeaderBasePaddingBottom(list);
  list.style.height = "";
  list.style.paddingBottom = `${basePadding}px`;

  const availableHeight = list.clientHeight;
  const topInset = marketLeaderTopInset(list);
  const firstRowTop = marketLeaderRowTop(list, rows[0]);
  const rowHeight = rows[0].offsetHeight;
  const rowGap = rows[1]
    ? Math.max(0, marketLeaderRowTop(list, rows[1]) - firstRowTop - rowHeight)
    : parseFloat(getComputedStyle(list).rowGap) || 0;
  const rowStep = Math.max(1, rowHeight + rowGap);
  const visibleRows = Math.max(
    1,
    Math.floor((availableHeight - topInset - basePadding - rowHeight) / rowStep) + 1
  );
  const cleanHeight = topInset + ((visibleRows - 1) * rowStep) + rowHeight + basePadding;
  if (Number.isFinite(cleanHeight) && cleanHeight > 0 && cleanHeight < availableHeight) {
    list.style.height = `${cleanHeight}px`;
  }
  list.dataset.visibleRows = String(visibleRows);
}

function keepMarketRowInView(list, row, direction = 0) {
  if (!list || !row) return;
  const maxTop = Math.max(0, list.scrollHeight - list.clientHeight);
  const topInset = marketLeaderTopInset(list);
  const bottomInset = marketLeaderBottomInset(list);
  const rowTop = marketLeaderRowTop(list, row);
  const rowBottom = rowTop + row.offsetHeight;
  const viewTop = list.scrollTop + topInset;
  const viewBottom = list.scrollTop + list.clientHeight - bottomInset;
  let nextTop = list.scrollTop;
  const boundarySlack = 1;

  if (direction > 0 && rowBottom >= viewBottom - boundarySlack) {
    nextTop = rowTop - topInset;
  } else if (direction < 0 && rowTop <= viewTop + boundarySlack) {
    nextTop = rowBottom + bottomInset - list.clientHeight;
  } else if (rowTop < viewTop) {
    nextTop = rowTop - topInset;
  } else if (rowBottom > viewBottom) {
    nextTop = rowTop - topInset;
  }

  list.scrollTop = clamp(nextTop, 0, maxTop);
}

function snapMarketLeadersToRow(list, { force = false } = {}) {
  if (!list || (marketLeadersPointerDown && !force)) return;
  const rows = Array.from(list.querySelectorAll(".market-leader-row"));
  if (!rows.length) return;
  const topInset = marketLeaderTopInset(list);
  const currentTop = list.scrollTop + topInset;
  let targetRow = rows[0];
  let targetDistance = Math.abs(marketLeaderRowTop(list, targetRow) - currentTop);

  rows.forEach(row => {
    const distance = Math.abs(marketLeaderRowTop(list, row) - currentTop);
    if (distance < targetDistance) {
      targetDistance = distance;
      targetRow = row;
    }
  });

  const nextTop = marketLeaderScrollTarget(list, targetRow);
  if (Math.abs(nextTop - list.scrollTop) > 1) {
    list.scrollTop = nextTop;
  }
  marketLeadersScrollTop = list.scrollTop;
}

function scheduleMarketLeadersSnap(list) {
  clearTimeout(marketLeadersSnapTimer);
  marketLeadersSnapTimer = setTimeout(() => snapMarketLeadersToRow(list), 180);
}

function holdMarketLeadersSnap(list) {
  marketLeadersPointerDown = true;
  clearTimeout(marketLeadersSnapTimer);
  const release = () => {
    window.removeEventListener("pointerup", release);
    window.removeEventListener("pointercancel", release);
    marketLeadersPointerDown = false;
    scheduleMarketLeadersSnap(list);
  };
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
}

function renderMarketBoard() {
  if (!els.marketBoard) return;
  const previousLeaders = els.marketBoard.querySelector(".market-leaders");
  const previousLeadersScrollTop = previousLeaders ? previousLeaders.scrollTop : marketLeadersScrollTop;
  const navigationAssets = marketNavigationAssets();
  let active = visibleMarketAssetById(selectedMarketId);
  if (active && !navigationAssets.some(asset => asset.id === active.id)) {
    active = defaultMarketAsset(navigationAssets) || active;
  }
  if (!active) {
    renderNoMarketBoard();
    return;
  }
  selectedMarketId = active.id;
  const activeIndex = Math.max(0, navigationAssets.findIndex(asset => asset.id === active.id));

  els.marketBoard.innerHTML = "";

  const main = document.createElement("section");
  main.className = "market-main";

  const focus = document.createElement("div");
  focus.className = "market-focus";

  const titleBlock = document.createElement("div");
  const group = document.createElement("p");
  group.textContent = `${marketGroupLabel(active.group)} - ${active.symbol || ""}`.trim();
  titleBlock.appendChild(group);

  const title = document.createElement("h3");
  title.appendChild(createMarketNameLink(active, "market-title-link"));
  titleBlock.appendChild(title);
  focus.appendChild(titleBlock);

  const price = document.createElement("div");
  price.className = "market-price";
  const value = document.createElement("strong");
  value.textContent = formatPrimaryMarketValue(active);
  price.appendChild(value);
  const change = document.createElement("span");
  change.className = `market-change ${marketChangeClass(active)}`;
  change.textContent = `${formatMarketChange(active)} - ${formatAssetPrice(active)}`;
  price.appendChild(change);
  focus.appendChild(price);
  main.appendChild(focus);

  const ranges = document.createElement("div");
  ranges.className = "market-range-tabs";
  marketRangeOptions.forEach(range => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = range === selectedMarketRange ? "active" : "";
    button.dataset.marketRange = range;
    button.textContent = marketRangeLabel(range);
    button.addEventListener("click", () => setMarketRange(range));
    ranges.appendChild(button);
  });
  main.appendChild(ranges);

  const chart = document.createElement("div");
  chart.className = "market-chart";
  chart.appendChild(createMarketChart(active));
  main.appendChild(chart);
  els.marketBoard.appendChild(main);

  const side = document.createElement("aside");
  side.className = "market-side";
  const sideHead = document.createElement("div");
  sideHead.className = "market-side-head";
  const sideTitle = document.createElement("div");
  sideTitle.className = "market-section-title";
  sideTitle.textContent = t("allAssetsMap");
  sideHead.appendChild(sideTitle);
  const filters = document.createElement("div");
  filters.className = "market-filter-toggles";
  filters.appendChild(createMarketFilterToggle("metals", "includeMetals"));
  filters.appendChild(createMarketFilterToggle("crypto", "includeCrypto"));
  sideHead.appendChild(filters);
  side.appendChild(sideHead);

  const leaders = document.createElement("div");
  leaders.className = "market-leaders";
  leaders.addEventListener("pointerdown", () => holdMarketLeadersSnap(leaders));
  leaders.addEventListener("scroll", () => {
    marketLeadersScrollTop = leaders.scrollTop;
    scheduleMarketLeadersSnap(leaders);
    scheduleMarketHistoryPreload(leaders);
  }, { passive: true });
  navigationAssets
    .forEach((asset, index) => {
      const row = document.createElement("div");
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      row.dataset.assetId = asset.id;
      row.className = `market-leader-row ${asset.id === selectedMarketId ? "active" : ""}`;
      row.addEventListener("click", () => selectMarket(asset.id));
      row.addEventListener("keydown", event => {
        if (event.target?.closest?.("a")) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectMarket(asset.id);
        }
      });

      const iconClass = asset.group === "companies"
        ? "asset-logo market-leader-logo"
        : "asset-logo market-leader-logo market-leader-logo-plain";
      const icon = createAssetIcon(asset, iconClass);
      if (icon) {
        row.appendChild(icon);
      } else {
        row.appendChild(createAssetFallbackIcon(asset, "asset-logo market-leader-logo"));
      }

      const nameWrap = document.createElement("div");
      nameWrap.className = "market-leader-name";
      const name = createMarketNameLink(asset, "market-name-link market-leader-name-link");
      const rank = document.createElement("span");
      rank.className = "market-rank-badge";
      rank.textContent = `#${marketDisplayRank(asset) || index + 1}`;
      nameWrap.appendChild(rank);
      const rankMove = formatMarketRankChange(asset, { compact: true });
      if (rankMove) {
        const rankChange = document.createElement("span");
        rankChange.className = `market-rank-change ${marketRankChangeClass(asset)}`;
        rankChange.textContent = rankMove;
        nameWrap.appendChild(rankChange);
      }
      const flag = createCountryFlag(asset);
      if (flag) nameWrap.appendChild(flag);
      nameWrap.appendChild(name);
      row.appendChild(nameWrap);

      const cap = document.createElement("b");
      cap.textContent = formatMarketCapCurrency(asset.marketCap);
      row.appendChild(cap);

      const meta = document.createElement("span");
      meta.textContent = `${asset.symbol} - ${formatMarketChange(asset)}`;
      row.appendChild(meta);
      leaders.appendChild(row);
    });
  side.appendChild(leaders);
  els.marketBoard.appendChild(side);
  updateMarketLeadersEndPadding(leaders);
  if (previousLeadersScrollTop > 0) {
    const restoreTop = () => {
      updateMarketLeadersEndPadding(leaders);
      leaders.scrollTop = Math.min(previousLeadersScrollTop, Math.max(0, leaders.scrollHeight - leaders.clientHeight));
      snapMarketLeadersToRow(leaders, { force: true });
    };
    restoreTop();
    requestAnimationFrame(restoreTop);
  }
  const pendingAssetId = marketPendingFocusAssetId;
  const pendingDirection = marketPendingFocusDirection;
  marketPendingFocusAssetId = "";
  marketPendingFocusDirection = 0;
  const restoreKeyboardFocus = () => {
    const targetAssetId = pendingAssetId || (!previousLeaders ? active.id : "");
    if (targetAssetId) {
      const row = Array.from(leaders.querySelectorAll(".market-leader-row"))
        .find(item => item.dataset.assetId === targetAssetId);
      if (!row) return;
      if (pendingAssetId) {
        try {
          row.focus({ preventScroll: true });
        } catch {
          row.focus();
        }
      }
      keepMarketRowInView(leaders, row, pendingDirection);
      marketLeadersScrollTop = leaders.scrollTop;
      return;
    }
  };
  restoreKeyboardFocus();
  requestAnimationFrame(() => {
    updateMarketLeadersEndPadding(leaders);
    restoreKeyboardFocus();
    scheduleMarketHistoryPreload(leaders);
  });
}

function renderNoMarketBoard() {
  if (!els.marketBoard) return;
  els.marketBoard.innerHTML = "";
  const empty = document.createElement("section");
  empty.className = "market-empty";

  const title = document.createElement("h3");
  title.textContent = marketEmptyTitle();
  empty.appendChild(title);

  const body = document.createElement("p");
  body.textContent = marketEmptySummary();
  empty.appendChild(body);

  els.marketBoard.appendChild(empty);
}

function renderMarketInspect(asset) {
  els.placeReports.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "market-inspect-grid";
  const displayRank = marketDisplayRank(asset);

  let metrics = [
    [t("assetRank"), Number.isFinite(displayRank) ? `#${displayRank}` : "--"],
    [t("rankChange"), formatMarketRankChange(asset), `market-rank-move-value ${marketRankChangeClass(asset) || "flat"}`],
    [t("assetType"), marketGroupLabel(asset.group)],
    [t("marketSymbol"), asset.symbol || "--"],
    [t("marketCap"), formatMarketCapCurrency(asset.marketCap)],
    [t("marketValue"), formatAssetPrice(asset)],
    [t("marketMove"), formatMarketChange(asset)]
  ];
  if (asset.group === "companies") {
    metrics = [
      [t("assetRank"), Number.isFinite(displayRank) ? `#${displayRank}` : "--"],
      [t("rankChange"), formatMarketRankChange(asset), `market-rank-move-value ${marketRankChangeClass(asset) || "flat"}`],
      [t("marketSymbol"), asset.symbol || "--"],
      [t("marketCap"), formatMarketCapCurrency(asset.marketCap)],
      [t("marketValue"), formatAssetPrice(asset)],
      [t("marketMove"), formatMarketChange(asset)]
    ];
    if (asset.country) metrics.push([currentLanguage === "zh" ? "å›½å®¶/åœ°åŒº" : "Country", asset.country]);
  }

  metrics.forEach(([label, value, valueClass]) => {
    grid.appendChild(createInspectMetric(label, value, { valueClass }));
  });
  els.placeReports.appendChild(grid);
  els.placeReports.appendChild(createMarketAskPanel(asset));
}

function marketAskContextKey(asset) {
  return [
    asset?.id || "",
    selectedMarketRange,
    selectedCurrencyAnchor,
    selectedCurrencyCode,
    selectedCurrencyRange
  ].join(":");
}

function selectedCurrencyAskContext() {
  const anchor = currencyByCode(selectedCurrencyAnchor);
  const quote = currencyByCode(selectedCurrencyCode);
  if (!anchor || !quote) return null;
  return {
    anchor: {
      code: anchor.code,
      name: currencyName(anchor),
      group: anchor.group,
      usdValue: Number(anchor.usdValue),
      changePct: Number(anchor.changePct)
    },
    quote: {
      code: quote.code,
      name: currencyName(quote),
      group: quote.group,
      usdValue: Number(quote.usdValue),
      changePct: Number(quote.changePct)
    },
    pair: formatCurrencyPair(anchor, quote),
    move: formatCurrencyChange(anchor, quote),
    range: selectedCurrencyRange
  };
}

const marketAskSemiconductorPattern = /(nvda|nvidia|è‹±ä¼Ÿè¾¾|amd|avgo|broadcom|åšé€š|tsm|tsmc|å°ç§¯ç”µ|asml|mu|micron|ç¾Žå…‰|qcom|qualcomm|é«˜é€š|intc|intel|è‹±ç‰¹å°”|arm|samsung|ä¸‰æ˜Ÿ|sk hynix|hynix|æµ·åŠ›å£«|mediatek|è”å‘ç§‘|marvell|mrvl|amat|applied materials|åº”ç”¨ææ–™|lrcx|lam research|æ³›æž—|klac|kla|txn|adi|on semiconductor|stm|infineon|tokyo electron|åŠå¯¼ä½“|èŠ¯ç‰‡|chip|semiconductor)/i;

function compactAskAsset(asset) {
  const displayRank = marketDisplayRank(asset);
  return {
    id: asset?.id || "",
    name: marketName(asset),
    symbol: asset?.symbol || "",
    group: asset?.group || "",
    rank: Number.isFinite(displayRank) ? displayRank : null,
    rankMove: formatMarketRankChange(asset) || "",
    marketCap: Number(asset?.marketCap),
    value: Number(asset?.value),
    move: formatMarketChange(asset),
    changePct: Number(asset?.changePct),
    country: asset?.country || ""
  };
}

function isSemiconductorAskAsset(asset) {
  const text = [
    asset?.symbol,
    asset?.name,
    asset?.zhName,
    asset?.id
  ].map(value => String(value || "")).join(" ");
  return marketAskSemiconductorPattern.test(text);
}

function marketAskSnapshot(asset) {
  const ranked = rankedVisibleMarketAssets();
  const activeIndex = ranked.findIndex(item => item.id === asset?.id);
  const nearby = activeIndex >= 0
    ? ranked.slice(Math.max(0, activeIndex - 5), activeIndex + 6).map(compactAskAsset)
    : [];
  const movers = ranked
    .filter(item => Number.isFinite(Number(item.changePct)))
    .slice()
    .sort((left, right) => Number(left.changePct) - Number(right.changePct));
  return {
    nearby,
    decliners: movers.slice(0, 10).map(compactAskAsset),
    gainers: movers.slice(-10).reverse().map(compactAskAsset),
    semiconductorPeers: ranked.filter(isSemiconductorAskAsset).slice(0, 24).map(compactAskAsset)
  };
}

function marketAskContext(asset) {
  const displayRank = marketDisplayRank(asset);
  const snapshot = marketAskSnapshot(asset);
  return {
    mode: "markets",
    language: currentLanguage,
    range: selectedMarketRange,
    asset: {
      id: asset?.id || "",
      name: marketName(asset),
      symbol: asset?.symbol || "",
      group: asset?.group || "",
      rank: Number.isFinite(displayRank) ? displayRank : null,
      rankMove: formatMarketRankChange(asset) || "",
      marketCap: Number(asset?.marketCap),
      value: Number(asset?.value),
      move: formatMarketChange(asset),
      changePct: Number(asset?.changePct),
      country: asset?.country || "",
      source: asset?.sourceName || t(marketSourceKey)
    },
    currency: selectedCurrencyAskContext(),
    marketSnapshot: {
      nearby: snapshot.nearby,
      decliners: snapshot.decliners,
      gainers: snapshot.gainers
    },
    semiconductorPeers: snapshot.semiconductorPeers
  };
}

function normalizeMarketAskMode(mode) {
  return mode === "fast" ? "fast" : "think";
}

function marketAskLoadingText() {
  return t(marketAskMode === "fast" ? "marketAskLoadingFast" : "marketAskLoadingThink") || t("marketAskLoading");
}

function updateMarketAskModeControls() {
  const control = els.placeReports?.querySelector(".market-ask-mode");
  if (!control) return;

  const isThink = marketAskMode === "think";
  control.classList.toggle("think", isThink);
  control.classList.toggle("fast", !isThink);
  control.setAttribute("aria-pressed", isThink ? "true" : "false");
  control.querySelectorAll(".market-ask-mode-label").forEach(label => {
    label.classList.toggle("active", label.dataset.mode === marketAskMode);
  });

  if (marketAskStatus === "idle") {
    els.placeReports?.querySelector(".market-ask-answer")?.remove();
  }
}

function setMarketAskMode(mode) {
  marketAskMode = normalizeMarketAskMode(mode);
  saveViewState();
  if (marketAskStatus === "idle") {
    marketAskAnswer = "";
    marketAskSource = "";
  }
  updateMarketAskModeControls();
}

function createMarketAskPanel(asset) {
  const contextKey = marketAskContextKey(asset);
  if (marketAskActiveContextKey !== contextKey && marketAskStatus !== "loading") {
    marketAskActiveContextKey = contextKey;
    marketAskAnswer = "";
    marketAskSource = "";
    marketAskStatus = "idle";
  }

  const panel = document.createElement("form");
  panel.className = "market-ask-panel";
  panel.addEventListener("submit", event => {
    event.preventDefault();
    askMarketQuestion(asset);
  });

  const head = document.createElement("div");
  head.className = "market-ask-head";
  const title = document.createElement("strong");
  title.textContent = t("marketAskTitle");
  head.appendChild(title);
  const modeToggle = document.createElement("button");
  modeToggle.type = "button";
  modeToggle.className = `market-ask-mode ${marketAskMode === "think" ? "think" : "fast"}`;
  modeToggle.disabled = marketAskStatus === "loading";
  modeToggle.setAttribute("aria-pressed", marketAskMode === "think" ? "true" : "false");
  modeToggle.setAttribute("aria-label", `${t("marketAskFast")} / ${t("marketAskThink")}`);
  modeToggle.addEventListener("click", () => {
    setMarketAskMode(marketAskMode === "fast" ? "think" : "fast");
  });
  const fastLabel = document.createElement("span");
  fastLabel.className = `market-ask-mode-label ${marketAskMode === "fast" ? "active" : ""}`;
  fastLabel.dataset.mode = "fast";
  fastLabel.title = t("marketAskFast");
  fastLabel.setAttribute("aria-hidden", "true");
  const fastIcon = document.createElement("span");
  fastIcon.className = "market-ask-mode-icon fast";
  fastLabel.appendChild(fastIcon);
  const thinkLabel = document.createElement("span");
  thinkLabel.className = `market-ask-mode-label ${marketAskMode === "think" ? "active" : ""}`;
  thinkLabel.dataset.mode = "think";
  thinkLabel.title = t("marketAskThink");
  thinkLabel.setAttribute("aria-hidden", "true");
  const thinkIcon = document.createElement("span");
  thinkIcon.className = "market-ask-mode-icon think";
  thinkLabel.appendChild(thinkIcon);
  const drop = document.createElement("span");
  drop.className = "market-ask-mode-drop";
  modeToggle.appendChild(drop);
  modeToggle.appendChild(fastLabel);
  modeToggle.appendChild(thinkLabel);
  head.appendChild(modeToggle);
  panel.appendChild(head);

  const row = document.createElement("div");
  row.className = "market-ask-row";
  const input = document.createElement("textarea");
  input.className = "market-ask-input";
  input.rows = 2;
  input.value = marketAskQuestion;
  input.placeholder = t("marketAskPlaceholder");
  input.addEventListener("input", () => {
    marketAskQuestion = input.value;
  });
  input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askMarketQuestion(asset);
    }
  });
  row.appendChild(input);

  const button = document.createElement("button");
  button.type = "submit";
  button.className = "market-ask-button";
  button.disabled = marketAskStatus === "loading";
  button.setAttribute("aria-label", marketAskStatus === "loading" ? marketAskLoadingText() : t("marketAskButton"));
  button.title = marketAskStatus === "loading" ? marketAskLoadingText() : t("marketAskButton");
  const sendIcon = document.createElement("span");
  sendIcon.className = "market-ask-send-icon";
  sendIcon.setAttribute("aria-hidden", "true");
  button.appendChild(sendIcon);
  row.appendChild(button);
  panel.appendChild(row);

  if (marketAskStatus === "loading") {
    const answer = document.createElement("div");
    answer.className = `market-ask-answer ${marketAskStatus}`;
    answer.textContent = marketAskLoadingText();
    panel.appendChild(answer);
  } else if (marketAskAnswer) {
    const answer = document.createElement("div");
    answer.className = `market-ask-answer ${marketAskStatus}`;
    answer.textContent = marketAskAnswer;
    panel.appendChild(answer);
  }

  return panel;
}

async function askMarketQuestion(asset) {
  const question = marketAskQuestion.trim();
  if (!question || !asset) return;
  const requestId = ++marketAskRequestId;
  marketAskAbortController?.abort();
  const requestController = new AbortController();
  marketAskAbortController = requestController;
  marketAskStatus = "loading";
  marketAskAnswer = "";
  marketAskSource = "";
  marketAskActiveContextKey = marketAskContextKey(asset);
  renderMarketInspect(asset);

  try {
    const response = await fetchWithTimeout("/api/market-ask", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        question,
        mode: marketAskMode,
        context: marketAskContext(asset)
      }),
      cache: "no-store",
      signal: requestController.signal
    }, 26000);
    const payload = await response.json().catch(() => ({}));
    if (requestId !== marketAskRequestId) return;
    marketAskAnswer = normalizedSelectionText(payload.answer || payload.error || t("marketAskUnavailable"));
    marketAskSource = "";
    marketAskStatus = response.ok && payload.answer ? "done" : "error";
  } catch {
    if (requestId !== marketAskRequestId) return;
    marketAskAnswer = t("marketAskUnavailable");
    marketAskStatus = "error";
  } finally {
    if (marketAskAbortController === requestController) {
      marketAskAbortController = null;
    }
    const active = visibleMarketAssetById(selectedMarketId);
    if (active && requestId === marketAskRequestId) {
      renderMarketInspect(active);
    }
  }
}

function setCurrencyAnchor(code) {
  selectedCurrencyAnchor = code;
  ensureCurrencySelection();
  renderMarketAssets();
  if (isMarketMode()) {
    const active = visibleMarketAssetById(selectedMarketId);
    if (active) renderMarketInspect(active);
  }
  saveViewState();
}

function selectCurrency(code) {
  selectedCurrencyCode = code;
  ensureCurrencySelection();
  renderMarketAssets();
  if (isMarketMode()) {
    const active = visibleMarketAssetById(selectedMarketId);
    if (active) renderMarketInspect(active);
  }
  saveViewState();
}

function setCurrencyRange(range) {
  selectedCurrencyRange = range;
  renderMarketAssets();
  if (isMarketMode()) {
    const active = visibleMarketAssetById(selectedMarketId);
    if (active) renderMarketInspect(active);
  }
  saveViewState();
}

function createCurrencyBadge(currency) {
  const badge = document.createElement("span");
  badge.className = `currency-code ${currency.group || "fiat"}`;
  badge.textContent = currency.code;
  return badge;
}

function createCurrencyCard(currency, anchor) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `currency-card ${currency.code === selectedCurrencyCode ? "active" : ""}`;
  card.addEventListener("click", () => selectCurrency(currency.code));

  const top = document.createElement("div");
  top.className = "currency-card-top";
  top.appendChild(createCurrencyBadge(currency));

  const names = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = currencyName(currency);
  names.appendChild(name);
  const group = document.createElement("span");
  group.textContent = currencyGroupLabel(currency.group);
  names.appendChild(group);
  top.appendChild(names);
  card.appendChild(top);

  const pair = document.createElement("b");
  pair.textContent = formatCurrencyPair(anchor, currency);
  card.appendChild(pair);

  const change = document.createElement("span");
  const pct = currencyPairChangePct(anchor, currency);
  change.className = `currency-card-change ${currencyChangeClass(pct)}`;
  change.textContent = formatCurrencyChange(anchor, currency);
  card.appendChild(change);
  return card;
}

function renderMarketAssets() {
  updateModeChrome();
  els.earningFilters.hidden = true;
  els.cityGrid.classList.add("currency-grid");
  els.cityGrid.innerHTML = "";
  if (!marketCurrencies.length) {
    const empty = document.createElement("article");
    empty.className = "currency-focus market-empty-card";
    empty.innerHTML = `<strong>${marketEmptyTitle()}</strong><span>${marketEmptySummary()}</span>`;
    els.cityGrid.appendChild(empty);
    return;
  }
  ensureCurrencySelection();
  const anchor = currencyByCode(selectedCurrencyAnchor) || marketCurrencies[0];
  const selected = currencyByCode(selectedCurrencyCode) || marketCurrencies.find(currency => currency.code !== anchor.code) || anchor;

  const focus = document.createElement("article");
  focus.className = "currency-focus";

  const top = document.createElement("div");
  top.className = "currency-focus-top";
  const titleBlock = document.createElement("div");
  const eyebrow = document.createElement("span");
  eyebrow.textContent = t("currencyPair");
  titleBlock.appendChild(eyebrow);
  const title = document.createElement("h3");
  title.textContent = `${anchor.code} -> ${selected.code}`;
  titleBlock.appendChild(title);
  top.appendChild(titleBlock);

  const rate = document.createElement("strong");
  rate.className = "currency-focus-rate";
  rate.textContent = formatCurrencyPair(anchor, selected);
  top.appendChild(rate);
  focus.appendChild(top);

  const anchorTabs = document.createElement("div");
  anchorTabs.className = "currency-anchor-tabs";
  const anchorLabel = document.createElement("span");
  anchorLabel.textContent = t("currencyAnchor");
  anchorTabs.appendChild(anchorLabel);
  validCurrencyAnchors().forEach(code => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = code === selectedCurrencyAnchor ? "active" : "";
    button.textContent = code;
    button.addEventListener("click", () => setCurrencyAnchor(code));
    anchorTabs.appendChild(button);
  });
  focus.appendChild(anchorTabs);

  const rangeTabs = document.createElement("div");
  rangeTabs.className = "market-range-tabs currency-range-tabs";
  marketRangeOptions.forEach(range => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = range === selectedCurrencyRange ? "active" : "";
    button.textContent = marketRangeLabel(range);
    button.addEventListener("click", () => setCurrencyRange(range));
    rangeTabs.appendChild(button);
  });
  focus.appendChild(rangeTabs);

  const meta = document.createElement("div");
  meta.className = "currency-focus-meta";
  const pct = currencyPairChangePct(anchor, selected);
  const change = document.createElement("span");
  change.className = currencyChangeClass(pct);
  change.textContent = formatCurrencyChange(anchor, selected);
  meta.appendChild(change);
  const source = document.createElement("span");
  source.textContent = `${t("currencySource")}: ${selected.sourceName || t(currencySourceKey)}`;
  meta.appendChild(source);
  const updatedDate = currencyPairDisplayDate(anchor, selected);
  if (updatedDate) {
    const updated = document.createElement("span");
    updated.textContent = `${t("currencyUpdated")}: ${updatedDate}`;
    meta.appendChild(updated);
  }
  focus.appendChild(meta);

  const chart = document.createElement("div");
  chart.className = "currency-chart";
  chart.appendChild(createCurrencyChart(anchor, selected));
  focus.appendChild(chart);
  els.cityGrid.appendChild(focus);

  const list = document.createElement("div");
  list.className = "currency-list";
  marketCurrencies.forEach(currency => {
    if (currency.code !== anchor.code) {
      list.appendChild(createCurrencyCard(currency, anchor));
    }
  });
  els.cityGrid.appendChild(list);
}

function renderMarketFeed() {
  els.feed.innerHTML = "";
  const visibleAssets = visibleMarketAssets();
  if (!visibleAssets.length) {
    const line = document.createElement("div");
    line.className = "feed-line";
    const headline = document.createElement("strong");
    headline.textContent = marketEmptyTitle();
    line.appendChild(headline);
    const meta = document.createElement("span");
    meta.textContent = marketEmptySummary();
    line.appendChild(meta);
    els.feed.appendChild(line);
    return;
  }
  visibleAssets
    .slice()
    .sort((a, b) => Math.abs(Number(b.changePct || 0)) - Math.abs(Number(a.changePct || 0)))
    .slice(0, 50)
    .forEach(asset => {
      const line = document.createElement("button");
      line.className = `feed-line ${asset.id === selectedMarketId ? "active" : ""}`;

      const headline = document.createElement("strong");
      headline.textContent = marketName(asset);
      line.appendChild(headline);

      const meta = document.createElement("span");
      meta.textContent = `${marketGroupLabel(asset.group)} - ${formatPrimaryMarketValue(asset)} - ${formatMarketChange(asset)}`;
      line.appendChild(meta);

      line.addEventListener("click", () => selectMarket(asset.id, { focusList: true }));
      els.feed.appendChild(line);
    });
}

function normalizedSelectionText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function selectedTextForTranslation(candidate = null) {
  const text = normalizedSelectionText(candidate ?? window.getSelection?.().toString() ?? "");
  return text.length > 600 ? text.slice(0, 600).trim() : text;
}

function selectedContextForTranslation(candidate = null) {
  const selected = selectedTextForTranslation(candidate);
  if (!selected) return "";
  const selection = window.getSelection?.();
  if (!selection || !selection.rangeCount) return selected;

  const range = selection.getRangeAt(0);
  const node = range.commonAncestorContainer;
  const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
  const container = element?.closest?.(".report-panel, .feed-panel, .map-panel, .city-panel, .market-board, body") || element;
  const text = normalizedSelectionText(container?.textContent || "");
  if (!text) return selected;

  const index = text.toLowerCase().indexOf(selected.toLowerCase());
  if (index >= 0) {
    const start = Math.max(0, index - 220);
    const end = Math.min(text.length, index + selected.length + 220);
    return text.slice(start, end).trim();
  }
  return text.length > 700 ? text.slice(0, 700).trim() : text;
}

function translationTargetForText(text) {
  return /[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(text) ? "en" : "zh-CN";
}

function updateTranslationToggleButton() {
  document.body.classList.toggle("translation-mode", translationEnabled);
  if (!els.translationToggle) return;
  els.translationToggle.classList.toggle("active", translationEnabled);
  els.translationToggle.setAttribute("aria-pressed", translationEnabled ? "true" : "false");
  els.translationToggle.title = t("translationToggleHint");
  els.translationToggle.setAttribute("aria-label", t("translationToggleHint"));
}

function canSpeakSelectionText() {
  return typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined";
}

function sourceSpeechLangForText(text) {
  return translationTargetForText(text) === "en" ? "zh-CN" : "en-US";
}

function targetSpeechLangForText(text) {
  return translationTargetForText(text) === "en" ? "en-US" : "zh-CN";
}

function speakSelectionText(text, lang) {
  const spokenText = normalizedSelectionText(text);
  if (!spokenText || !canSpeakSelectionText()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.lang = lang;
  utterance.rate = lang.startsWith("zh") ? 0.92 : 0.88;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function speakerIconSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z"></path>
      <path d="M16 9.5a4 4 0 0 1 0 5"></path>
      <path d="M18.5 7a7 7 0 0 1 0 10"></path>
    </svg>
  `;
}

function appendTranslationBlock(parent, label, text, className, speechLang = "") {
  const header = document.createElement("div");
  header.className = "translation-block-head";

  const labelNode = document.createElement("span");
  labelNode.className = "translation-label";
  labelNode.textContent = label;
  header.appendChild(labelNode);

  if (speechLang && canSpeakSelectionText() && normalizedSelectionText(text)) {
    const speakButton = document.createElement("button");
    speakButton.className = "translation-speak-button";
    speakButton.type = "button";
    speakButton.title = label === t("translationOriginal") ? t("speakOriginal") : t("speakTranslation");
    speakButton.setAttribute("aria-label", speakButton.title);
    speakButton.innerHTML = speakerIconSvg();
    speakButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      speakSelectionText(text, speechLang);
    });
    header.appendChild(speakButton);
  }
  parent.appendChild(header);

  const textNode = document.createElement("p");
  textNode.className = className;
  textNode.textContent = text;
  parent.appendChild(textNode);
}

function cityPhotoPanelTitle(city) {
  if (!city) return t("cityPhotoPanel");
  return currentLanguage === "zh" ? `${cityName(city)}${t("cityPhotoPanel")}` : `${cityName(city)} ${t("cityPhotoPanel")}`;
}

function setCityPhotoRange(minutes) {
  cityPhotoRangeMinutes = normalizeCityPhotoRange(minutes);
  saveViewState();
  if (isCityMapMode()) renderFeed();
}

function renderCityPhotoPanel() {
  els.feed.classList.remove("translation-feed");
  els.feed.classList.add("city-photo-feed");
  els.feed.innerHTML = "";

  const city = cities.find(item => item.id === selectedCityId) || cities[0];
  const item = weather[city.id] || fallbackWeather[city.id];
  const bucket = cityPhotoBucket();
  cityPhotoActiveBucket = `${city.id}:${cityPhotoRangeMinutes}:${bucket}`;
  const photo = chooseCityPhoto(city, item);
  const candidates = cityPhotoCandidates(city, item).filter(candidate => candidate.key !== photo.key);
  els.feedTitle.textContent = cityPhotoPanelTitle(city);
  els.eventSource.textContent = `${weatherText(item.code)} - ${Math.round(item.temperature)} C - ${formatTime(city.zone)}`;

  const tools = document.createElement("div");
  tools.className = "city-photo-tools";
  const meta = document.createElement("span");
  meta.className = "city-photo-meta";
  meta.textContent = `${t("cityPhotoRange")} - ${t("cityPhotoUpdated", cityPhotoBucketAgeMinutes(bucket))}`;
  tools.appendChild(meta);
  const rangeGroup = document.createElement("div");
  rangeGroup.className = "city-photo-range";
  cityPhotoRangeOptions.forEach(minutes => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = minutes === cityPhotoRangeMinutes ? "active" : "";
    button.textContent = cityPhotoRangeLabel(minutes);
    button.addEventListener("click", () => setCityPhotoRange(minutes));
    rangeGroup.appendChild(button);
  });
  tools.appendChild(rangeGroup);
  els.feed.appendChild(tools);

  const figure = document.createElement("figure");
  figure.className = "city-photo-card loading";
  figure.setAttribute("aria-label", t("cityPhotoLoading"));
  figure.dataset.loadingText = t("cityPhotoLoading");
  figure.dataset.fallbackText = t("cityPhotoFallback");

  const image = document.createElement("img");
  image.alt = `${cityName(city)} ${weatherText(item.code)} ${formatTime(city.zone)}`;
  image.loading = "lazy";
  image.referrerPolicy = "no-referrer";
  figure.appendChild(image);

  const caption = document.createElement("figcaption");
  caption.textContent = `${cityName(city)} - ${cityPhotoDaypart(city)} - ${weatherText(item.code)}`;
  figure.appendChild(caption);
  els.feed.appendChild(figure);
  loadCityPhotoCandidate(image, figure, [photo, ...candidates]);
}

function renderTranslationPanel() {
  els.feed.classList.add("translation-feed");
  els.feed.classList.remove("city-photo-feed");
  els.feed.innerHTML = "";

  const card = document.createElement("div");
  card.className = `translation-card ${translationSelectionText ? "" : "empty"}`;
  if (!translationSelectionText) {
    const empty = document.createElement("p");
    empty.className = "translation-source-text";
    empty.textContent = t("translationEmpty");
    card.appendChild(empty);
    els.feed.appendChild(card);
    return;
  }

  appendTranslationBlock(card, t("translationOriginal"), translationSelectionText, "translation-source-text", sourceSpeechLangForText(translationSelectionText));
  const result = translationStatus === "loading"
    ? t("translationLoading")
    : translationStatus === "error"
      ? t("translationError")
      : translationResultText || t("translationError");
  appendTranslationBlock(card, t("translationResult"), result, "translation-result-text", translationStatus === "done" ? targetSpeechLangForText(translationSelectionText) : "");
  if (translationStatus === "done" && translationExplanationText) {
    appendTranslationBlock(card, t("translationExplanation"), translationExplanationText, "translation-explanation-text");
  }
  els.feed.appendChild(card);
}

async function translateSelectedText(text) {
  const sourceText = selectedTextForTranslation(text);
  if (!sourceText || sourceText === translationSelectionText && translationStatus !== "error") return;

  translationSelectionText = sourceText;
  const target = translationTargetForText(sourceText);
  const uiLanguage = currentLanguage === "zh" ? "zh" : "en";
  const contextText = selectedContextForTranslation(sourceText);
  const cacheKey = translationCacheKeyFor(sourceText, target, uiLanguage, contextText);
  const requestId = ++translationRequestId;
  translationAbortController?.abort();
  translationAbortController = null;

  const cached = cachedTranslationResult(cacheKey);
  if (cached) {
    translationResultText = normalizedSelectionText(cached.translation || "");
    translationExplanationText = normalizedSelectionText(cached.explanation || "");
    translationStatus = translationResultText ? "done" : "error";
    renderFeed();
    return;
  }

  const quick = quickTranslationResult(sourceText, target, uiLanguage);
  if (quick) {
    translationResultText = quick.translation;
    translationExplanationText = quick.explanation;
    translationStatus = "done";
    rememberTranslationResult(cacheKey, quick);
    renderFeed();
    return;
  }

  translationResultText = "";
  translationExplanationText = "";
  translationStatus = "loading";
  renderFeed();

  const params = new URLSearchParams({
    text: sourceText,
    target,
    ui: uiLanguage,
    context: contextText
  });
  const requestController = new AbortController();
  translationAbortController = requestController;

  try {
    const response = await fetchWithTimeout(`/api/translate?${params.toString()}`, { cache: "no-store", signal: requestController.signal }, 2200);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (requestId !== translationRequestId) return;
    translationResultText = normalizedSelectionText(payload.translation || "");
    translationExplanationText = normalizedSelectionText(payload.explanation || "");
    translationStatus = translationResultText ? "done" : "error";
    if (translationStatus === "done") rememberTranslationResult(cacheKey, payload);
  } catch {
    if (requestId !== translationRequestId) return;
    const fallback = quickTranslationResult(sourceText, target, uiLanguage);
    translationResultText = normalizedSelectionText(fallback?.translation || "");
    translationExplanationText = normalizedSelectionText(fallback?.explanation || "");
    translationStatus = translationResultText ? "done" : "error";
    if (translationStatus === "done") rememberTranslationResult(cacheKey, fallback);
  } finally {
    if (translationAbortController === requestController) {
      translationAbortController = null;
    }
  }
  renderFeed();
}

function scheduleSelectionTranslation() {
  if (!translationEnabled || isCityMapMode()) return;
  window.clearTimeout(translationSelectionTimer);
  translationSelectionTimer = window.setTimeout(() => {
    const text = selectedTextForTranslation();
    if (text) translateSelectedText(text);
  }, 35);
}

function setTranslationEnabled(enabled) {
  translationEnabled = enabled;
  saveTranslationToggle();
  if (!translationEnabled) {
    translationRequestId += 1;
    translationAbortController?.abort();
    translationAbortController = null;
    window.clearTimeout(translationSelectionTimer);
    translationSelectionText = "";
    translationResultText = "";
    translationExplanationText = "";
    translationStatus = "idle";
  }
  updateTranslationToggleButton();
  updateModeChrome();
  renderFeed();
  if (translationEnabled && !isCityMapMode()) scheduleSelectionTranslation();
}

function marketHistoryRequestKey(asset, range = selectedMarketRange) {
  return `${asset?.id || asset?.symbol || ""}:${range}`;
}

function applyMarketHistoryPayload(asset, payload, range = selectedMarketRange) {
  if (!asset || !payload) return false;
  const history = normalizeMarketHistory(payload.history);
  const denseHistory = normalizeMarketHistory(payload.denseHistory);
  const shortHistory = normalizeMarketHistory(payload.shortHistory);
  let updated = false;
  if (history) {
    asset.history = history;
    asset.sourceName = payload.source || asset.sourceName;
    updated = true;
  }
  if (denseHistory) {
    asset.denseHistory = denseHistory;
    updated = true;
  }
  if (shortHistory) {
    asset.shortHistory = shortHistory;
    if (range === "1d" || range === "5d" || range === "1m") {
      asset.rangeHistories = asset.rangeHistories && typeof asset.rangeHistories === "object" ? asset.rangeHistories : {};
      asset.rangeHistories[range] = shortHistory;
    }
    updated = true;
  }
  if (updated) {
    asset.historyLoadFailed = false;
    asset.historyLoadFailedRange = null;
  }
  return updated;
}

function saveMarketHistorySnapshot() {
  saveCachedMarkets({
    source: marketSourceKey,
    updated: marketUpdatedAt,
    servedAt: marketServedAt,
    assets: marketAssets,
    currencies: {
      date: currencyDate,
      anchors: currencyAnchors,
      quotes: marketCurrencies
    }
  });
}

function scheduleMarketHistorySnapshotSave() {
  window.clearTimeout(marketHistoryCacheSaveTimer);
  marketHistoryCacheSaveTimer = window.setTimeout(saveMarketHistorySnapshot, 1200);
}

function queueMarketHistoryPreload(asset, range = "5d") {
  if (!canFetchMarketHistory(asset) || hasMarketHistoryForRange(asset, range)) return;
  const key = marketHistoryRequestKey(asset, range);
  if (marketHistoryPreloadDone.has(key) || marketHistoryPreloadKeys.has(key)) return;
  marketHistoryPreloadQueue.push({ assetId: asset.id, range });
  marketHistoryPreloadKeys.add(key);
  processMarketHistoryPreloadQueue();
}

function processMarketHistoryPreloadQueue() {
  const maxConcurrent = 2;
  while (marketHistoryPreloadInFlight < maxConcurrent && marketHistoryPreloadQueue.length) {
    const item = marketHistoryPreloadQueue.shift();
    const asset = marketAssets.find(candidate => candidate.id === item.assetId);
    const key = asset ? marketHistoryRequestKey(asset, item.range) : `${item.assetId}:${item.range}`;
    if (!asset || hasMarketHistoryForRange(asset, item.range)) {
      marketHistoryPreloadKeys.delete(key);
      if (asset) marketHistoryPreloadDone.add(key);
      continue;
    }
    marketHistoryPreloadInFlight += 1;
    fetchMarketHistory(asset, { range: item.range, silent: true })
      .finally(() => {
        if (hasMarketHistoryForRange(asset, item.range)) {
          marketHistoryPreloadDone.add(key);
        }
        marketHistoryPreloadKeys.delete(key);
        marketHistoryPreloadInFlight = Math.max(0, marketHistoryPreloadInFlight - 1);
        processMarketHistoryPreloadQueue();
      });
  }
}

function scheduleMarketHistoryPreload(list) {
  if (!list || !isMarketMode()) return;
  window.clearTimeout(marketHistoryPreloadTimer);
  marketHistoryPreloadTimer = window.setTimeout(() => {
    const rows = Array.from(list.querySelectorAll(".market-leader-row"));
    if (!rows.length) return;
    const topInset = marketLeaderTopInset(list);
    const bottomInset = marketLeaderBottomInset(list);
    const viewTop = list.scrollTop + topInset;
    const viewBottom = list.scrollTop + list.clientHeight - bottomInset;
    let firstVisible = rows.findIndex(row => {
      const rowTop = marketLeaderRowTop(list, row);
      return rowTop + row.offsetHeight > viewTop;
    });
    if (firstVisible < 0) firstVisible = 0;
    let lastVisible = rows.length - 1;
    for (let index = firstVisible; index < rows.length; index += 1) {
      if (marketLeaderRowTop(list, rows[index]) > viewBottom) {
        lastVisible = Math.max(firstVisible, index - 1);
        break;
      }
    }
    const navigationAssets = marketNavigationAssets();
    const start = Math.max(0, firstVisible - 2);
    const end = Math.min(navigationAssets.length - 1, lastVisible + 3);
    for (let index = start; index <= end; index += 1) {
      queueMarketHistoryPreload(navigationAssets[index], selectedMarketRange);
    }
  }, 120);
}

async function fetchMarketHistory(asset, options = {}) {
  const range = options.range || selectedMarketRange;
  const silent = options.silent === true;
  if (!canFetchMarketHistory(asset)) {
    return;
  }
  if (hasMarketHistoryForRange(asset, range)) {
    return;
  }
  const requestId = silent ? 0 : ++marketHistoryRequestId;
  if (!silent) {
    asset.historyLoading = true;
    asset.historyLoadFailed = false;
    asset.historyLoadFailedRange = null;
    renderMarketBoard();
  }

  try {
    const params = new URLSearchParams();
    if (asset.historyUrl) params.set("url", asset.historyUrl);
    if (asset.symbol) params.set("symbol", asset.symbol);
    if (asset.group) params.set("group", asset.group);
    params.set("range", range);
    if (Number.isFinite(Number(asset.marketCap))) params.set("marketCap", String(asset.marketCap));
    if (Number.isFinite(Number(asset.value))) params.set("value", String(asset.value));
    const response = await fetchWithTimeout(`/api/market-history?${params.toString()}`, { cache: "no-store" }, range === "1d" ? 6500 : 12000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const updated = applyMarketHistoryPayload(asset, payload, range);
    if (!silent && !hasMarketHistoryForRange(asset, range)) {
      asset.historyLoadFailed = true;
      asset.historyLoadFailedRange = range;
    }
    if (updated) {
      if (silent) {
        scheduleMarketHistorySnapshotSave();
      } else {
        saveMarketHistorySnapshot();
      }
    }
  } catch {
    if (!silent) {
      asset.historyLoadFailed = true;
      asset.historyLoadFailedRange = range;
    }
    // Keep the chart honest. If history is not available, the panel says so.
  } finally {
    if (!silent) asset.historyLoading = false;
    const shouldRender = selectedMarketId === asset.id && isMarketMode() && range === selectedMarketRange;
    if (shouldRender && (silent || requestId === marketHistoryRequestId)) {
      renderMarketInspect(asset);
      renderMarketBoard();
    }
  }
}

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height, dpr };
}

function drawMatrix() {
  const { width, height, dpr } = resizeCanvas(els.matrix);
  const ctx = els.matrix.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = themeRgba("bg", 0.05);
  ctx.fillRect(0, 0, width, height);
  ctx.font = `${11 * dpr}px Consolas, monospace`;
  ctx.fillStyle = themeRgba("green", 0.18);
  const tick = Date.now() / 650;
  const step = 22 * dpr;
  for (let x = 0; x < width; x += step) {
    const y = (Math.sin(x * 0.011 + tick) * 0.5 + 0.5) * height;
    ctx.fillText(Math.random() > 0.5 ? "1" : "0", x, y);
  }
}

function drawGrid(ctx, width, height, dpr) {
  ctx.strokeStyle = themeRgba("blue", 0.13);
  ctx.lineWidth = 1 * dpr;
  for (let lon = -180; lon <= 180; lon += 30) {
    const start = project(-72, lon, width, height);
    const end = project(82, lon, width, height);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 75; lat += 15) {
    const start = project(lat, -180, width, height);
    const end = project(lat, 180, width, height);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
}

function drawRing(ctx, ring, width, height) {
  ring.forEach(([lon, lat], index) => {
    const p = project(lat, lon, width, height);
    if (index === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
}

function drawGeoJson(ctx, width, height, dpr) {
  if (!worldGeoJson || !Array.isArray(worldGeoJson.features)) return false;
  ctx.fillStyle = themeRgba("green", 0.105);
  ctx.strokeStyle = themeRgba("green", 0.34);
  ctx.lineWidth = 0.8 * dpr;

  for (const feature of worldGeoJson.features) {
    const geometry = feature.geometry;
    if (!geometry) continue;
    const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
    if (!Array.isArray(polygons)) continue;
    ctx.beginPath();
    for (const polygon of polygons) {
      if (Array.isArray(polygon[0])) drawRing(ctx, polygon[0], width, height);
    }
    ctx.fill();
    ctx.stroke();
  }
  return true;
}

function drawFallbackLand(ctx, width, height, dpr) {
  ctx.fillStyle = themeRgba("green", 0.10);
  ctx.strokeStyle = themeRgba("green", 0.34);
  ctx.lineWidth = 1.2 * dpr;
  for (const poly of fallbackLand) {
    ctx.beginPath();
    poly.forEach(([lon, lat], index) => {
      const p = project(lat, lon, width, height);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

function drawEventArcs(ctx, width, height, dpr) {
  if (isCityMapMode() || isMarketMode() || isEarningMode()) return;
  const active = buildEventPlaces().slice(0, 8);
  if (active.length < 2) return;

  const t = Date.now() / 1200;
  for (let i = 0; i < active.length; i++) {
    const a = active[i];
    const b = active[(i + 1) % active.length];
    if (!b || a.key === b.key) continue;
    const pa = project(a.lat, a.lon, width, height);
    const pb = project(b.lat, b.lon, width, height);
    if (Math.hypot(pa.x - pb.x, pa.y - pb.y) < 28 * dpr) continue;

    const alpha = 0.12 + Math.sin(t + i) * 0.04;
    ctx.strokeStyle = themeRgba("blue", alpha);
    ctx.lineWidth = 1 * dpr;
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.quadraticCurveTo((pa.x + pb.x) / 2, Math.min(pa.y, pb.y) - 90 * dpr, pb.x, pb.y);
    ctx.stroke();
  }
}

function updateMapModeButtons() {
  els.modeButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.mapMode === mapMode);
  });
}

function updateModeChrome() {
  updateMapModeButtons();
  const marketMode = isMarketMode();
  const cityMode = isCityMapMode();
  const earningMode = isEarningMode();

  els.mapStage?.classList.toggle("market-mode", marketMode);
  if (els.marketBoard) {
    els.marketBoard.hidden = !marketMode;
  }
  document.body.classList.toggle("market-page", marketMode);
  document.body.classList.toggle("stats-mode", cityMode);
  document.body.classList.toggle("earning-mode", earningMode);
  if (earningMode && isMapMenuOpen()) {
    setMapMenuOpen(false);
  }
  els.secondaryPanel?.classList.toggle("market-mode", marketMode);

  if (marketMode) {
    const companyOnly = onlyCompanyMarketData();
    const allAssets = isAllAssetsMarketData();
    els.mapPanelTitle.textContent = allAssets ? t("allAssetsMap") : companyOnly ? t("companyMarketMap") : t("marketMap");
    els.mapPanelSubhead.textContent = allAssets ? t("allAssetsSubhead") : companyOnly ? t("companyMarketSubhead") : t("marketMapSubhead");
    els.secondaryPanelTitle.textContent = t("marketPanelTitle");
    els.secondaryPanelSubhead.textContent = t("marketPanelSubhead");
    els.feedTitle.textContent = t("marketStream");
  } else if (cityMode) {
    els.mapPanelTitle.textContent = t("statsMap");
    els.mapPanelSubhead.textContent = t("statsMapSubhead");
    els.secondaryPanelTitle.textContent = t("cityStats");
    els.secondaryPanelSubhead.textContent = t("cityStatsSubhead");
    els.feedTitle.textContent = cityPhotoPanelTitle(cities.find(item => item.id === selectedCityId) || cities[0]);
  } else if (earningMode) {
    const activeCount = visibleEarningOpportunities().length;
    els.mapPanelTitle.textContent = t("earningMap");
    els.mapPanelSubhead.textContent = t("earningMapSubhead");
    els.secondaryPanelTitle.textContent = t("earningSources");
    els.secondaryPanelSubhead.textContent = t("earningSourcesSubhead");
    els.feedTitle.textContent = t("earningStream");
    if (!activeCount) {
      els.secondaryPanelSubhead.textContent = t("earningEmpty");
    }
  } else {
    els.mapPanelTitle.textContent = t("eventMap");
    els.mapPanelSubhead.textContent = t("mapSubhead");
    els.secondaryPanelTitle.textContent = t("cityStats");
    els.secondaryPanelSubhead.textContent = t("cityStatsSubhead");
    els.feedTitle.textContent = translationEnabled ? t("translationPanel") : t("reportStream");
  }

  updateSourceLabels();
}

function setMapMenuOpen(open) {
  const shouldOpen = Boolean(open);
  els.mapActionMenu.hidden = !shouldOpen;
  els.mapActionMenu.classList.toggle("open", shouldOpen);
  els.mapMenuToggle.classList.toggle("active", shouldOpen);
  els.mapMenuToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
}

function isMapMenuOpen() {
  return !els.mapActionMenu.hidden && els.mapActionMenu.classList.contains("open");
}

function toggleMapMenu() {
  setMapMenuOpen(!isMapMenuOpen());
}

function shouldOpenMapMenu() {
  try {
    return new URLSearchParams(window.location.search).get("menu") === "open";
  } catch {
    return false;
  }
}

function drawWorld() {
  updateModeChrome();
  const { width, height, dpr } = resizeCanvas(els.map);
  const ctx = els.map.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  if (isMarketMode()) {
    renderMarketBoard();
    return;
  }
  drawGrid(ctx, width, height, dpr);
  if (!drawGeoJson(ctx, width, height, dpr)) {
    drawFallbackLand(ctx, width, height, dpr);
  }
  drawEventArcs(ctx, width, height, dpr);
}

function positionEventPins() {
  const rect = els.map.getBoundingClientRect();
  updateMapUiScale(rect);
  els.pins.innerHTML = "";
  els.pins.dataset.mode = mapMode;
  updateModeChrome();

  if (isMarketMode()) {
    renderMarketBoard();
    return;
  }

  if (mapMode === "events") {
    const places = selectSpacedMapItems(buildEventPlaces(), rect, 6, selectedPlaceKey);
    const markerPoints = places.map(place => place._mapPoint);
    const occupiedLabels = [];
    for (const place of places) {
      const p = place._mapPoint;
      const topEvent = place.events[0];
      const pin = document.createElement("button");
      const isActive = place.events.some(event => event.id === selectedEventId);
      pin.className = `event-pin place-marker ${place.category || "world"} ${isActive ? "active" : ""}`;
      pin.style.left = `${p.x}px`;
      pin.style.top = `${p.y}px`;
      const labelKey = `place:${place.key}`;
      const placeLabel = translateLocationName(place.location);
      const autoLabelRect = applyLabelPlacement(pin, p, placeLabel, rect, occupiedLabels, markerPoints, 24);
      const finalLabelRect = applySavedLabelLayout(pin, labelKey, p, placeLabel, rect, 24, autoLabelRect);
      occupiedLabels.push(finalLabelRect);
      pin.title = `${reportTitleText(topEvent)} - ${formatPlaceName(place)}`;
      pin.addEventListener("click", event => {
        if (pin.dataset.suppressClick === "true") {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        selectEvent(place.events[0].id);
      });

      const label = createPinLabel(placeLabel);
      makeLabelInteractive(label, pin, labelKey);
      pin.appendChild(label);
      pin.appendChild(createHoverCard({
        time: formatDate(topEvent.published),
        title: placeLabel,
        body: reportTitleText(topEvent),
        meta: topEvent.source
      }));
      els.pins.appendChild(pin);
    }
  }

  if (isCityMapMode()) {
    const cityPoints = cities.map(city => project(city.lat, city.lon, rect.width, rect.height));
    const occupiedLabels = [];
    for (const [index, city] of cities.entries()) {
      const item = weather[city.id] || fallbackWeather[city.id];
      const p = cityPoints[index];
      const pin = document.createElement("button");
      pin.className = `event-pin weather-marker climate ${mapMode}-mode ${city.id === selectedCityId ? "active" : ""}`;
      pin.style.left = `${p.x}px`;
      pin.style.top = `${p.y}px`;
      const labelKey = `city:${city.id}`;
      const climateText = `${cityName(city)} ${Math.round(item.temperature)} C ${formatTime(city.zone)} ${weatherText(item.code)}`;
      const autoLabelRect = applyLabelPlacement(pin, p, climateText, rect, occupiedLabels, cityPoints, 54);
      const finalLabelRect = applySavedLabelLayout(pin, labelKey, p, climateText, rect, 54, autoLabelRect);
      occupiedLabels.push(finalLabelRect);
      pin.title = `${cityName(city)}, ${cityCountry(city)} - ${cityModeBadge(city, item)}`;
      pin.addEventListener("click", event => {
        if (pin.dataset.suppressClick === "true") {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        selectCity(city.id);
      });

      const label = createClimateLabel(city, item);
      makeLabelInteractive(label, pin, labelKey);
      pin.appendChild(label);
      pin.appendChild(createHoverCard({
        time: formatTime(city.zone),
        title: `${cityName(city)}, ${cityCountry(city)}`,
        body: cityModeTitle(city, item),
        meta: cityModeSummary(city, item)
      }));
      els.pins.appendChild(pin);
    }
  }
}

function renderFeed() {
  const previousScrollTop = els.feed.scrollTop;
  if (isCityMapMode()) {
    renderCityPhotoPanel();
    return;
  }
  if (isEarningMode()) {
    els.feed.innerHTML = "";
    return;
  }
  if (translationEnabled && !isMarketMode()) {
    renderTranslationPanel();
    return;
  }
  els.feed.classList.remove("translation-feed");
  els.feed.classList.remove("city-photo-feed");
  if (isMarketMode()) {
    renderMarketFeed();
    restoreFeedScroll(previousScrollTop);
    return;
  }
  els.feed.innerHTML = "";
  for (const event of uniqueFeedEvents(events, 18)) {
    const title = reportTitleText(event);
    const line = document.createElement("button");
    line.className = `feed-line ${event.id === selectedEventId ? "active" : ""}`;

    const headline = document.createElement("strong");
    headline.textContent = title;
    line.appendChild(headline);

    const meta = document.createElement("span");
    meta.textContent = feedMetaText(event);
    line.appendChild(meta);

    line.addEventListener("click", () => selectEvent(event.id));
    els.feed.appendChild(line);
  }
  restoreFeedScroll(previousScrollTop);
}

function restoreFeedScroll(scrollTop) {
  const maxScrollTop = Math.max(0, els.feed.scrollHeight - els.feed.clientHeight);
  els.feed.scrollTop = Math.min(scrollTop, maxScrollTop);
}

function setMapMode(mode) {
  mapMode = mode === "earning" ? "earning" : mapMode;
  if (isMarketMode(mode)) {
    selectMarket(selectedMarketId, { focusList: true });
    return;
  }

  if (isCityMapMode(mode)) {
    mapMode = "stats";
    selectCity(selectedCityId);
    return;
  }

  if (isEarningMode(mode)) {
    setMapMenuOpen(false);
    selectEarning(selectedEarningId);
    return;
  }

  if (mode === "events") {
    selectEvent(selectedEventId);
    return;
  }

  mapMode = "events";
  drawWorld();
  positionEventPins();
}

function renderNoRecentEvents() {
  selectedEventId = "";
  selectedPlaceKey = "";
  els.reportSeverity.className = "severity";
  els.reportLocation.textContent = currentLanguage === "zh" ? "è¿‘æœŸé‡å¤§äº‹ä»¶" : "Recent major events";
  els.reportMeta.textContent = currentLanguage === "zh" ? "æ²¡æœ‰ç¬¦åˆæ¡ä»¶çš„äº‹ä»¶" : "No qualifying events";
  els.reportSeverity.textContent = "--";
  els.reportTitle.textContent = currentLanguage === "zh" ? "åœ°å›¾æš‚ä¸æ˜¾ç¤ºäº‹ä»¶" : "No events on the map";
  els.reportSummary.hidden = false;
  els.reportSummary.textContent = currentLanguage === "zh"
    ? "åªæœ‰èƒ½ç›´è¯´å‘ç”Ÿäº†ä»€ä¹ˆã€ä¸”è¶³å¤Ÿè¿‘æœŸæˆ–è¶³å¤Ÿé‡è¦çš„äº‹ä»¶æ‰ä¼šå‡ºçŽ°åœ¨åœ°å›¾ä¸Šã€‚"
    : "Only recent, important reports that directly say what happened appear on the map.";
  hideReportImage();
  els.reportLink.textContent = t("openSource");
  els.reportLink.hidden = true;
  els.reportLink.style.visibility = "hidden";
  els.placeReports.innerHTML = "";
  renderCities();
  renderFeed();
  drawWorld();
  positionEventPins();
  saveViewState();
}

function selectEvent(id) {
  mapMode = "events";
  els.reportSeverity.className = "severity";
  if (!events.length) {
    renderNoRecentEvents();
    return;
  }
  selectedEventId = id;
  const event = events.find(item => item.id === id) || events[0];
  if (!event) return;
  const mappedEvent = hasMapLocation(event);
  selectedPlaceKey = mappedEvent ? locationKey(event) : "";
  const related = mappedEvent
    ? events.filter(item => hasMapLocation(item) && locationKey(item) === selectedPlaceKey)
    : [];

  els.reportLocation.textContent = formatPlaceName(event);
  els.reportMeta.textContent = `${translateCategory(event.category)} - ${event.source} - ${formatDate(event.published)}`;
  els.reportSeverity.textContent = `S${event.severity || 2}`;
  els.reportTitle.textContent = reportTitleText(event);
  els.reportSummary.hidden = false;
  els.reportSummary.textContent = reportSummaryText(event);
  updateReportImage(event);
  els.reportLink.href = event.url || "#";
  els.reportLink.textContent = t("openSource");
  els.reportLink.hidden = !event.url;
  els.reportLink.style.visibility = event.url ? "visible" : "hidden";
  renderPlaceReports(related, event.id);
  renderCities();
  renderFeed();
  drawWorld();
  positionEventPins();
  saveViewState();
}

function selectCity(id) {
  mapMode = "stats";
  els.reportSeverity.className = "severity";
  selectedCityId = id;
  selectedPlaceKey = "";
  const city = cities.find(item => item.id === id) || cities[0];
  const item = weather[city.id] || fallbackWeather[city.id];
  if (!city || !item) return;

  els.reportLocation.textContent = `${cityName(city)}, ${cityCountry(city)}`;
  els.reportMeta.textContent = `${weatherText(item.code)} - ${formatTime(city.zone)}`;
  els.reportSeverity.textContent = cityModeBadge(city, item);
  els.reportTitle.textContent = cityModeTitle(city, item);
  const summary = cityModeSummary(city, item);
  els.reportSummary.hidden = !summary;
  els.reportSummary.textContent = summary;
  hideReportImage();
  els.reportLink.textContent = t("openSource");
  els.reportLink.hidden = true;
  els.reportLink.style.visibility = "hidden";
  renderWeatherInspect(city, item);
  renderCities();
  renderFeed();
  drawWorld();
  positionEventPins();
  saveViewState();
}

function selectMarket(id, options = {}) {
  mapMode = "markets";
  const asset = visibleMarketAssetById(id);
  if (!asset) {
    selectedMarketId = "";
    selectedPlaceKey = "";
    els.reportSeverity.className = "severity";
    els.reportLocation.textContent = t("marketMap");
    els.reportMeta.textContent = t(marketSourceKey);
    els.reportSeverity.textContent = "--";
    els.reportTitle.textContent = marketEmptyTitle();
    els.reportSummary.hidden = true;
    els.reportSummary.textContent = "";
    clearReportImage();
    els.reportLink.style.visibility = "hidden";
    els.reportLink.hidden = true;
    els.placeReports.innerHTML = "";
    renderMarketAssets();
    renderFeed();
    drawWorld();
    positionEventPins();
    saveViewState();
    return;
  }

  selectedMarketId = asset.id;
  if (options.focusList) {
    marketPendingFocusAssetId = asset.id;
    marketPendingFocusDirection = Number(options.focusDirection) || 0;
  }
  selectedPlaceKey = "";
  els.reportSeverity.className = `severity ${marketChangeClass(asset)}`;
  els.reportLocation.textContent = marketGroupLabel(asset.group);
  els.reportMeta.textContent = `${asset.symbol || marketName(asset)} - ${asset.sourceName || t(marketSourceKey)}`;
  els.reportSeverity.textContent = formatMarketChange(asset);
  els.reportTitle.innerHTML = "";
  els.reportTitle.appendChild(createMarketNameLink(asset, "market-title-link report-title-link"));
  els.reportSummary.hidden = true;
  els.reportSummary.textContent = "";
  clearReportImage();
  const detailUrl = "";
  if (detailUrl) {
    els.reportLink.href = detailUrl;
    els.reportLink.textContent = currentLanguage === "zh" ? "æ‰“å¼€ CompaniesMarketCap" : "Open CompaniesMarketCap";
    els.reportLink.style.visibility = "visible";
  } else {
    els.reportLink.style.visibility = "hidden";
  }
  els.reportLink.style.visibility = "hidden";
  els.reportLink.hidden = true;
  renderMarketInspect(asset);
  renderMarketAssets();
  renderFeed();
  drawWorld();
  positionEventPins();
  saveViewState();
  fetchMarketHistory(asset);
}

function setEarningFilterState(nextFilters) {
  earningFilters = normalizeEarningFilters(nextFilters);
  const visible = visibleEarningOpportunities();
  if (visible.length && !visible.some(item => item.id === selectedEarningId)) {
    selectedEarningId = visible[0].id;
  }
  if (isEarningMode()) {
    const visibleAfterApply = visibleEarningOpportunities();
    selectEarning(visibleAfterApply[0]?.id || "");
  }
  saveViewState();
  renderCities();
  renderFeed();
}

function selectEarning(id) {
  mapMode = "earning";
  const candidates = visibleEarningOpportunities();
  const first = candidates[0] || earningOpportunities[0];
  const normalized = normalizeEarningId(id);
  const chosen = candidates.find(item => item.id === normalized) || first;
  if (!chosen) {
    selectedEarningId = "";
    els.reportSeverity.className = "severity";
    els.reportLocation.textContent = t("earningModeTitle");
    els.reportMeta.textContent = t("earningEmpty");
    els.reportSeverity.textContent = "--";
    els.reportTitle.textContent = t("earningEmpty");
    els.reportSummary.hidden = false;
    els.reportSummary.textContent = t("earningEmpty");
    hideReportImage();
    els.reportLink.hidden = true;
    els.reportLink.style.visibility = "hidden";
    els.earningFilters.hidden = true;
    renderEarningGrid();
    renderFeed();
    drawWorld();
    positionEventPins();
    saveViewState();
    return;
  }

  selectedEarningId = chosen.id;
  const difficulty = earningDifficultyClass(chosen);
  els.reportSeverity.className = `severity${difficulty === "low" ? " positive" : difficulty === "high" ? " negative" : ""}`;
  els.reportLocation.textContent = t("earningModeTitle");
  els.reportMeta.textContent = `${earningLabelForCategory(chosen.category)} - ${earningDisplayPayout(chosen)} - ${earningDisplayRegion(chosen)}`;
  els.reportSeverity.textContent = earningLabelForDifficulty(chosen.difficulty);
  els.reportTitle.textContent = earningDisplayTitle(chosen);
  els.reportSummary.hidden = false;
  els.reportSummary.textContent = clampUiText(earningDisplaySummary(chosen), 180);
  clearReportImage();
  if (chosen.link) {
    els.reportLink.href = chosen.link;
    els.reportLink.textContent = t("earningOpenListing");
    els.reportLink.hidden = false;
    els.reportLink.style.visibility = "visible";
  } else {
    els.reportLink.hidden = true;
    els.reportLink.style.visibility = "hidden";
  }
  renderEarningInspect(chosen);
  renderEarningFilters();
  renderEarningGrid();
  renderFeed();
  drawWorld();
  positionEventPins();
  saveViewState();
}

function toggleEarningFilter(key) {
  const next = { ...earningFilters, [key]: !earningFilters[key] };
  setEarningFilterState(next);
}

function renderEarningFilters() {
  if (!els.earningFilters) return;
  const filters = earningSourceFilters;
  const visibleCount = visibleEarningOpportunities().length;
  els.earningFilters.hidden = false;
  els.earningFilters.innerHTML = "";
  const title = document.createElement("strong");
  title.className = "earning-filter-title";
  title.textContent = `${t("earningFilterTitle")}: ${t("earningFilterTitleLabel")}`;
  els.earningFilters.appendChild(title);

  const actions = document.createElement("div");
  actions.className = "earning-filter-actions";
  const allActive = filters.every(item => earningFilters[item.key]);
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = `earning-filter-btn ${allActive ? "active" : ""}`;
  allBtn.innerHTML = `<strong>*</strong>${t("earningAllFilters")}`;
  allBtn.addEventListener("click", () => {
    setEarningFilterState(earningSourceFilters.reduce((next, item) => {
      next[item.key] = true;
      return next;
    }, {}));
  });
  actions.appendChild(allBtn);

  filters.forEach(item => {
    const btn = document.createElement("button");
    const active = Boolean(earningFilters[item.key]);
    btn.type = "button";
    btn.className = `earning-filter-btn ${active ? "active" : ""}`;
    btn.innerHTML = `<strong>${active ? "&#10003;" : ""}</strong>${t(item.labelKey)}`;
    btn.addEventListener("click", () => toggleEarningFilter(item.key));
    actions.appendChild(btn);
  });
  els.earningFilters.appendChild(actions);

  const note = document.createElement("div");
  note.className = "earning-filter-note";
  if (!visibleCount) {
    note.textContent = t("earningEmpty");
  } else if (filters.length === Object.values(earningFilters).filter(Boolean).length) {
    note.textContent = `${visibleCount} ${t("earningModeTitle")}`;
  } else {
    const selected = Object.entries(earningFilters).filter(([, enabled]) => enabled).map(([key]) => t(`earningFilter${key.charAt(0).toUpperCase() + key.slice(1)}`));
    note.textContent = `${selected.length}/${filters.length} ${t("earningFilterTitleLabel")}: ${selected.join(", ")}`;
  }
  els.earningFilters.appendChild(note);
}

function renderEarningGrid() {
  updateModeChrome();
  els.earningFilters.hidden = false;
  els.cityGrid.classList.remove("currency-grid");
  els.cityGrid.classList.add("earning-grid");
  els.cityGrid.innerHTML = "";
  const opportunities = visibleEarningOpportunities();
  if (!opportunities.length) {
    const empty = document.createElement("article");
    empty.className = "city-card";
    empty.innerHTML = `<strong>${t("earningEmpty")}</strong><span>${t("earningSourcesSubhead")}</span>`;
    els.cityGrid.appendChild(empty);
    renderEarningFilters();
    return;
  }

  opportunities.forEach(item => {
    const card = document.createElement("button");
    card.className = `city-card earning-card ${item.id === selectedEarningId ? "active" : ""}`;
    card.type = "button";
    card.setAttribute("role", "button");
    card.tabIndex = 0;
    card.addEventListener("click", () => selectEarning(item.id));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectEarning(item.id);
      }
    });
    const name = document.createElement("div");
    name.className = "earning-name";
    const left = document.createElement("span");
    left.textContent = earningDisplayTitle(item);
    name.appendChild(left);
    const region = document.createElement("small");
    region.textContent = `${earningDisplayRegion(item)} • ${earningRemoteLabel(item)}`;
    name.appendChild(region);
    card.appendChild(name);

    const tags = Array.isArray(item.tags)
      ? item.tags
        .map(tag => String(tag || "").trim())
        .filter(Boolean)
        .slice(0, 3)
      : [];
    if (tags.length) {
      const tagsRow = document.createElement("div");
      tagsRow.className = "earning-tags";
      tags.forEach(tag => {
        const chip = document.createElement("span");
        chip.className = "earning-tag";
        chip.textContent = tag;
        tagsRow.appendChild(chip);
      });
      card.appendChild(tagsRow);
    }

    const meta = document.createElement("div");
    meta.className = "earning-meta";
    meta.textContent = `${earningLabelForCategory(item.category)} • ${earningDisplayRegion(item)} • ${earningDisplayPayout(item)} • ${earningLabelForDifficulty(item.difficulty)}`;
    card.appendChild(meta);

    const summary = document.createElement("p");
    summary.className = "earning-summary";
    summary.textContent = clampUiText(earningDisplaySummary(item), 82);
    card.appendChild(summary);

    const copyPreview = document.createElement("p");
    copyPreview.className = "earning-copy-preview";
    copyPreview.textContent = `${t("earningCopyPreviewLabel")}: ${clampUiText(earningCopyPreview(item), 90)}`;
    card.appendChild(copyPreview);

    els.cityGrid.appendChild(card);
  });
  renderEarningFilters();
}

function renderEarningFeed() {
  els.feed.innerHTML = "";
  const opportunities = visibleEarningOpportunities();
  if (!opportunities.length) {
    const line = document.createElement("div");
    line.className = "feed-line";
    const headline = document.createElement("strong");
    headline.textContent = t("earningEmpty");
    line.appendChild(headline);
    const meta = document.createElement("span");
    meta.textContent = t("earningSourcesSubhead");
    line.appendChild(meta);
    els.feed.appendChild(line);
    return;
  }

  opportunities.forEach(item => {
    const line = document.createElement("button");
    line.type = "button";
    line.className = `feed-line ${item.id === selectedEarningId ? "active" : ""}`;
    const title = document.createElement("strong");
    title.textContent = clampUiText(earningDisplayTitle(item), 48);
    line.appendChild(title);
    const meta = document.createElement("span");
    meta.textContent = clampUiText(`${earningLabelForCategory(item.category)} • ${earningDisplayRegion(item)} • ${earningDisplayPayout(item)} • ${earningLabelForDifficulty(item.difficulty)}`, 90);
    line.appendChild(meta);
    line.addEventListener("click", () => selectEarning(item.id));
    els.feed.appendChild(line);
  });
}

function renderEarningInspect(opportunity) {
  els.placeReports.innerHTML = "";
  if (!opportunity) return;

  const grid = document.createElement("div");
  grid.className = "earning-inspect-grid";
  grid.appendChild(createInspectMetric(t("earningCategoryLabel"), clampUiText(`${earningLabelForCategory(opportunity.category)} / ${t("earningPlatformLabel")} ${opportunity.platform || "--"}`, 80)));
  grid.appendChild(createInspectMetric(t("earningPayoutLabel"), clampUiText(earningDisplayPayout(opportunity), 70)));
  grid.appendChild(createInspectMetric(t("earningDifficultyLabel"), earningLabelForDifficulty(opportunity.difficulty)));
  grid.appendChild(createInspectMetric(t("earningRemoteLabel"), earningRemoteLabel(opportunity)));
  grid.appendChild(createInspectMetric(t("earningRegionLabel"), clampUiText(earningDisplayRegion(opportunity), 48)));
  grid.appendChild(createInspectMetric(t("earningSourceLabel"), clampUiText(earningLabelForSource(opportunity), 62)));
  els.placeReports.appendChild(grid);

  const quickStart = document.createElement("article");
  quickStart.className = "earning-quickstart";
  const quickTitle = document.createElement("div");
  quickTitle.className = "earning-quickstart-title";
  quickTitle.textContent = t("earningActionsTitle");
  quickStart.appendChild(quickTitle);
  const list = document.createElement("ul");
  list.className = "earning-quickstart-list";
  const actions = earningDisplayActions(opportunity);
  if (actions.length) {
    actions.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = t("earningEmpty");
    list.appendChild(li);
  }
  quickStart.appendChild(list);
  els.placeReports.appendChild(quickStart);

  const playbook = document.createElement("article");
  playbook.className = "earning-playbook-card";
  const playbookTitle = document.createElement("div");
  playbookTitle.className = "earning-copy-title";
  playbookTitle.textContent = t("earningPlaybookTitle");
  playbook.appendChild(playbookTitle);
  const playbookHint = document.createElement("p");
  playbookHint.className = "earning-copy-hint";
  playbookHint.textContent = t("earningPlaybookHint");
  playbook.appendChild(playbookHint);
  const playbookList = document.createElement("ul");
  playbookList.className = "earning-quickstart-list";
  const playActions = earningDisplayActions(opportunity);
  if (playActions.length) {
    playActions
      .slice(0, 3)
      .forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        playbookList.appendChild(li);
      });
  } else {
    const li = document.createElement("li");
    li.textContent = t("earningCopyHint");
    playbookList.appendChild(li);
  }
  playbook.appendChild(playbookList);
  els.placeReports.appendChild(playbook);

  const copyCard = document.createElement("article");
  copyCard.className = "earning-copy-card";
  const copyTitle = document.createElement("div");
  copyTitle.className = "earning-copy-title";
  copyTitle.textContent = t("earningCopyLabel");
  copyCard.appendChild(copyTitle);
  const copyHint = document.createElement("p");
  copyHint.className = "earning-copy-hint";
  copyHint.textContent = t("earningCopyHint");
  copyCard.appendChild(copyHint);
  const copyText = document.createElement("pre");
  copyText.className = "earning-copy-text";
  copyText.textContent = clampUiText(earningCopyText(opportunity), 900);
  copyCard.appendChild(copyText);

  const copyTools = document.createElement("div");
  copyTools.className = "earning-copy-tools";
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "earning-copy-button";
  copyButton.textContent = t("earningCopyButton");
  const copyStatus = document.createElement("span");
  copyStatus.className = "earning-copy-status";

  copyButton.addEventListener("click", async () => {
    const success = await copyTextToClipboard(copyText.textContent);
    if (!success) {
      copyStatus.textContent = t("earningCopyFailed");
      return;
    }
    copyStatus.textContent = t("earningCopyCopied");
    copyButton.textContent = t("earningCopyCopied");
    window.setTimeout(() => {
      copyStatus.textContent = "";
      if (copyButton.textContent === t("earningCopyCopied")) {
        copyButton.textContent = t("earningCopyButton");
      }
    }, 1800);
  });
  copyTools.appendChild(copyButton);
  copyTools.appendChild(copyStatus);
  copyCard.appendChild(copyTools);
  els.placeReports.appendChild(copyCard);
}

function earningLabelForSource(opportunity) {
  return opportunity.platform ? opportunity.platform : t("earningSourceLabel");
}

function renderCities() {
  if (isMarketMode()) {
    els.earningFilters.hidden = true;
    renderMarketAssets();
    return;
  }
  if (isEarningMode()) {
    els.earningFilters.hidden = false;
    renderEarningGrid();
    return;
  }
  els.earningFilters.hidden = true;
  updateModeChrome();
  els.cityGrid.classList.remove("currency-grid");
  els.cityGrid.innerHTML = "";
  for (const city of cities) {
    const item = weather[city.id] || fallbackWeather[city.id];
    const card = document.createElement("article");
    card.className = `city-card ${city.id === selectedCityId ? "active" : ""}`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.addEventListener("click", () => selectCity(city.id));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCity(city.id);
      }
    });
    card.innerHTML = `
      <div class="city-name"><span>${cityName(city)}</span><small>${formatTime(city.zone)}</small></div>
      <div class="weather-row">
        <span>${t("temp")}<strong>${Math.round(item.temperature)} C</strong></span>
        <span>${t("hum")}<strong>${Math.round(item.humidity)}%</strong></span>
        <span>${t("wind")}<strong>${Math.round(item.wind)} km/h</strong></span>
      </div>
    `;
    els.cityGrid.appendChild(card);
  }
}

function reportSourceKey() {
  const firstSource = events[0]?.source || "";
  if (/fallback/i.test(firstSource)) return "localFallbackReports";
  if (reportsLoadedFromCache) return "cachedReports";
  return "liveRssReports";
}

function reportSourceLabel() {
  return t(reportSourceKey());
}

function setWeatherSource(key) {
  weatherSourceKey = key;
  updateSourceLabels();
}

function setEventSource(key) {
  eventSourceKey = key;
  updateSourceLabels();
}

function updateSourceLabels() {
  updateMarketRefreshTime();
  if (els.weatherSource) els.weatherSource.hidden = false;
  if (isCityMapMode()) {
    const city = cities.find(item => item.id === selectedCityId) || cities[0];
    const item = weather[city.id] || fallbackWeather[city.id];
    els.eventSource.textContent = `${weatherText(item.code)} - ${Math.round(item.temperature)} C - ${formatTime(city.zone)}`;
    els.weatherSource.textContent = t(weatherSourceKey);
    return;
  }
  if (isEarningMode()) {
    els.eventSource.textContent = t("earningSources");
    const summary = earningSourcesSummaryLabel();
    els.weatherSource.textContent = summary || "";
    if (!summary) {
      els.weatherSource.hidden = true;
    }
    return;
  }
  if (translationEnabled && !isMarketMode()) {
    els.eventSource.textContent = t("translationSource");
    els.weatherSource.textContent = isMarketMode() ? t(currencySourceKey) : t(weatherSourceKey);
    return;
  }
  if (isMarketMode()) {
    els.eventSource.textContent = t(marketSourceKey);
    els.weatherSource.textContent = "";
    els.weatherSource.hidden = true;
    return;
  }
  els.eventSource.textContent = t(eventSourceKey);
  els.weatherSource.textContent = t(weatherSourceKey);
}

function renderInitialConsole() {
  els.eventCount.textContent = String(events.length);
  eventSourceKey = reportSourceKey();
  updateSourceLabels();
  renderCities();

  if (isMarketMode()) {
    selectMarket(selectedMarketId);
  } else if (isCityMapMode()) {
    selectCity(selectedCityId);
  } else if (isEarningMode()) {
    selectEarning(selectedEarningId);
  } else {
    selectEvent(selectedEventId);
  }
}

async function fetchWeather() {
  const url = "https://api.open-meteo.com/v1/forecast"
    + `?latitude=${cities.map(c => c.lat).join(",")}`
    + `&longitude=${cities.map(c => c.lon).join(",")}`
    + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
    + "&timezone=auto";

  try {
    const response = await fetchWithTimeout(url, { cache: "no-store" }, 10000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const rows = Array.isArray(payload) ? payload : [payload];
    rows.forEach((row, index) => {
      const city = cities[index];
      if (!city || !row.current) return;
      weather[city.id] = {
        temperature: row.current.temperature_2m,
        humidity: row.current.relative_humidity_2m,
        wind: row.current.wind_speed_10m,
        code: row.current.weather_code
      };
    });
    saveCachedWeather(weather);
    setWeatherSource("openMeteoLive");
  } catch {
    setWeatherSource(cachedWeather ? "cachedWeather" : "localWeather");
  }
  renderCities();
  if (isCityMapMode()) {
    selectCity(selectedCityId);
  } else {
    positionEventPins();
  }
}

async function fetchEvents({ announce = true } = {}) {
  if (announce) {
    setEventSource("refreshingReports");
  }
  try {
    const response = await fetchWithTimeout("/api/events", { cache: "no-store" }, 12000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const nextEvents = normalizeEventList(payload.events);
    if (nextEvents.length) {
      const previousEventId = selectedEventId;
      events = nextEvents;
      reportsLoadedFromCache = false;
      saveCachedEvents(events);
      selectedEventId = events.some(event => event.id === previousEventId) ? previousEventId : events[0].id;
      setEventSource(payload.events[0].source === "Fallback brief"
        ? "localFallbackReports"
        : "liveRssReports");
    } else {
      events = [];
      selectedEventId = "";
      reportsLoadedFromCache = false;
      setEventSource("liveRssReports");
    }
  } catch {
    if (!events.length) {
      events = normalizeEventList(fallbackEvents);
      selectedEventId = events[0]?.id || "";
      reportsLoadedFromCache = false;
    }
    setEventSource(reportSourceKey());
  }
  els.eventCount.textContent = String(events.length);
  const keepCityOpen = isCityMapMode();
  const keepMarketOpen = isMarketMode();
  const keepEarningOpen = isEarningMode();
  renderFeed();
  if (keepMarketOpen) {
    selectMarket(selectedMarketId);
  } else if (keepCityOpen) {
    selectCity(selectedCityId);
  } else if (keepEarningOpen) {
    selectEarning(selectedEarningId);
  } else if (!events.length) {
    renderNoRecentEvents();
  } else {
    selectEvent(selectedEventId);
  }
}

async function fetchMarkets({ announce = false } = {}) {
  if (announce) {
    marketSourceKey = "refreshingMarkets";
    updateSourceLabels();
  }

  try {
    const response = await fetchWithTimeout("/api/markets", { cache: "no-store" }, 18000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    updateMarketFreshRetryState(payload);
    const nextAssets = normalizeMarketAssets(payload.assets);
    const nextCurrencies = normalizeCurrencyQuotes(payload.currencies?.quotes);
    if (hasCompleteCurrencySet(nextCurrencies)) {
      marketCurrencies = nextCurrencies;
      currencyAnchors = Array.isArray(payload.currencies?.anchors) && payload.currencies.anchors.length
        ? payload.currencies.anchors.map(code => String(code).toUpperCase())
        : defaultCurrencyAnchors.slice();
      currencyDate = payload.currencies?.date || currencyDate;
      currencySourceKey = "currencyMarketData";
      ensureCurrencySelection();
    } else if (!marketCurrencies.length) {
      currencySourceKey = "marketUnavailable";
    }
    if (nextAssets.length) {
      const previousMarketId = selectedMarketId;
      marketAssets = nextAssets;
      marketUpdatedAt = payload.updated || marketUpdatedAt;
      marketServedAt = payload.servedAt || "";
      marketDataStale = payload.stale === true;
      const visibleAssets = rankedVisibleMarketAssets();
      selectedMarketId = visibleAssets.some(asset => asset.id === previousMarketId)
        ? previousMarketId
        : defaultMarketAsset(visibleAssets)?.id || marketAssets[0].id;
      if (marketDataStale) {
        marketSourceKey = "cachedMarketData";
      } else if (payload.source === "companiesmarketcap-assets") {
        marketSourceKey = "companiesMarketCapAssets";
      } else if (payload.source === "companiesmarketcap") {
        marketSourceKey = "companiesMarketCapData";
      } else if (payload.source === "mixed") {
        marketSourceKey = "mixedMarketData";
      } else {
        marketSourceKey = payload.source === "live" ? "liveMarketData" : "marketUnavailable";
      }
      saveCachedMarkets({
        ...payload,
        assets: marketAssets,
        currencies: {
          ...(payload.currencies || {}),
          date: currencyDate,
          anchors: currencyAnchors,
          quotes: marketCurrencies
        }
      });
    } else if (marketAssets.length) {
      marketDataStale = true;
      marketSourceKey = "cachedMarketData";
    } else {
      marketAssets = [];
      selectedMarketId = "";
      marketSourceKey = "marketUnavailable";
    }
  } catch {
    if (marketAssets.length) {
      marketDataStale = true;
      marketSourceKey = "cachedMarketData";
    } else {
      marketSourceKey = "marketUnavailable";
    }
    currencySourceKey = marketCurrencies.length ? currencySourceKey : "marketUnavailable";
  }

  updateSourceLabels();
  if (isMarketMode()) {
    selectMarket(selectedMarketId);
  }
}

async function fetchWorldMap() {
  try {
    const response = await fetchWithTimeout("/api/world", { cache: "force-cache" }, 8000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    worldGeoJson = await response.json();
  } catch {
    worldGeoJson = null;
  }
  drawWorld();
  positionEventPins();
}

function tick() {
  els.localTime.textContent = formatTime(Intl.DateTimeFormat().resolvedOptions().timeZone);
  if (isCityMapMode()) {
    const city = cities.find(item => item.id === selectedCityId) || cities[0];
    els.feedClock.textContent = formatTime(city.zone);
    const bucket = `${city.id}:${cityPhotoRangeMinutes}:${cityPhotoBucket()}`;
    if (bucket !== cityPhotoActiveBucket) renderFeed();
  } else {
    els.feedClock.textContent = new Date().toLocaleTimeString("en-US", { hour12: false });
  }
  updateClimateClocks();
  drawMatrix();
}

els.mapMenuToggle.addEventListener("pointerdown", event => {
  event.preventDefault();
  event.stopPropagation();
  toggleMapMenu();
});
els.refreshEvents.addEventListener("click", () => {
  setMapMenuOpen(false);
  if (isMarketMode()) {
    fetchMarkets({ announce: true });
  } else {
    fetchEvents();
  }
});
els.languageToggle.addEventListener("click", () => {
  currentLanguage = currentLanguage === "zh" ? "en" : "zh";
  saveLanguage();
  setMapMenuOpen(false);
  rerenderLanguageSensitiveViews();
});
els.translationToggle?.addEventListener("pointerdown", event => {
  event.preventDefault();
  event.stopPropagation();
  setTranslationEnabled(!translationEnabled);
  setMapMenuOpen(false);
});
els.translationToggle?.addEventListener("keydown", event => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  event.stopPropagation();
  setTranslationEnabled(!translationEnabled);
  setMapMenuOpen(false);
});
els.modeButtons.forEach(button => {
  button.addEventListener("click", () => setMapMode(button.dataset.mapMode));
});
if (els.marketBoard) {
  els.marketBoard.tabIndex = 0;
  els.marketBoard.addEventListener("keydown", handleMarketBoardKeydown);
  els.marketBoard.addEventListener("pointerdown", focusMarketBoardFromPointer);
}
document.addEventListener("click", event => {
  if (isMapMenuOpen() && !event.target.closest(".map-menu")) {
    setMapMenuOpen(false);
  }
});
document.addEventListener("keydown", handleMarketBoardKeydown, true);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") setMapMenuOpen(false);
});
document.addEventListener("selectionchange", scheduleSelectionTranslation);
applyTheme(currentTheme);
applyLanguage();
if (shouldOpenMapMenu()) setMapMenuOpen(true);
window.addEventListener("resize", () => {
  drawWorld();
  drawMatrix();
  positionEventPins();
  if (isMarketMode()) {
    const leaders = els.marketBoard?.querySelector(".market-leaders");
    if (leaders) {
      updateMarketLeadersEndPadding(leaders);
      leaders.scrollTop = Math.min(leaders.scrollTop, Math.max(0, leaders.scrollHeight - leaders.clientHeight));
      snapMarketLeadersToRow(leaders, { force: true });
    }
  }
});

renderInitialConsole();
fetchWeather();
fetchWorldMap();
fetchEvents({ announce: false });
fetchMarkets({ announce: false });
setInterval(fetchWeather, 10 * 60 * 1000);
setInterval(fetchEvents, 10 * 60 * 1000);
setInterval(fetchMarkets, 5 * 60 * 1000);
setInterval(tick, 1000);
tick();
