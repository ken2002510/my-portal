# My Portal ✨ - Link-in-Bio 網站

這是一個仿照 Portaly 風格設計的「可愛網感風」個人連結網站（Link-in-Bio）。它具備即時匯率、Google 表單嵌入、社群連結等功能，並且內建了一個視覺化編輯器，讓你可以即時更新內容，不需要懂程式碼也能輕鬆使用！

## 🌟 功能特色

- **訪客頁面 (`index.html`)**：
  - 📱 RWD 手機優先設計，在任何裝置都好看。
  - ✨ 可愛粉紫漸層背景、浮動裝飾動畫、玻璃擬物化 (Glassmorphism) 卡片。
  - 🔗 支援各種社群連結與自訂按鈕。
  - 💱 內建即時匯率小工具（支援 USD、JPY、EUR、KRW 等兌換 TWD）。
  - 📋 可無縫嵌入 Google 表單（問卷、聯絡我等）。

- **後台編輯器 (`admin.html`)**：
  - ✏️ 雙欄介面：左側編輯資料，右側手機框即時預覽。
  - 🖼️ 支援直接上傳/更換頭像。
  - 🔄 連結按鈕支援拖曳排序 (Drag & Drop)。
  - 💾 所有設定即時儲存在瀏覽器本地 (localStorage)。
  - 📁 支援將設定檔匯出備份 (JSON)，以及匯入還原。

---

## 🚀 如何在本地運行

確保你的電腦已安裝 [Node.js](https://nodejs.org/)。

1. **安裝依賴套件**：
   ```bash
   npm install
   ```

2. **啟動本地開發伺服器**：
   ```bash
   npm run dev
   ```

3. **開啟瀏覽器**：
   - 預設會自動開啟 `http://localhost:3000` (訪客頁面)
   - 若要進入編輯器，請前往 `http://localhost:3000/admin.html`

---

## 🌐 部署與架設教學 (推薦 Vercel)

如果你想把這個網站放到網路上讓大家看，並擁有自己的網址，最簡單且免費的方法是使用 **Vercel**。

### 步驟 1：將程式碼推送到 GitHub
1. 註冊一個 [GitHub](https://github.com/) 帳號。
2. 在 GitHub 建立一個新的 repository (例如命名為 `my-portal`)。
3. 將此專案的所有檔案上傳或推送到該 repository。

### 步驟 2：在 Vercel 部署
1. 前往 [Vercel](https://vercel.com/)，使用你的 GitHub 帳號註冊/登入。
2. 點擊 **"Add New..."** > **"Project"**。
3. 找到你剛剛在 GitHub 建立的 `my-portal` 專案，點擊 **"Import"**。
4. **Framework Preset** 會自動偵測為 `Vite`，不需要改設定。
5. 點擊 **"Deploy"**，等待幾十秒後，Vercel 就會為你生成一個公開網址 (如 `https://my-portal-xxx.vercel.app`)！

### 步驟 3：設定你的自訂域名名稱 (Custom Domain)
如果你不想要 `.vercel.app` 結尾的網址，想擁有如 `yourname.com` 或 `link.yourname.cc` 的專屬連結：

1. **購買域名**：在 Namecheap、GoDaddy 或 Gandi 等網域註冊商購買你喜歡的網域名稱。
2. **在 Vercel 新增域名**：
   - 到 Vercel 的專案控制面板 (Dashboard)。
   - 點擊 **"Settings"** > **"Domains"**。
   - 輸入你買好的網域名稱並按下 Add。
3. **設定 DNS 記錄**：
   - Vercel 會提供你一組 DNS 記錄（通常是 `A Record` 指向 `76.76.21.21`，或是 `CNAME` 指向 `cname.vercel-dns.com`）。
   - 回到你買域名的平台，找到 DNS 管理設定，將 Vercel 提供的記錄加上去。
4. **等待生效**：DNS 更新通常需要幾分鐘到幾個小時，一旦生效，Vercel 會自動為你配置 HTTPS (SSL 憑證)，你的個人專屬網址就大功告成了！

---

## 📝 後續維護與更新內容

網站上線後，如果你想更新大頭照、修改自我介紹或新增連結：

1. 開啟你的網站後台：`https://你的網址/admin.html`。
2. 盡情修改，右邊可以即時看到結果。
3. **注意**：因為這是一個純前端的無伺服器網站，你在後台修改的資料是存在**當前瀏覽器的 localStorage** 中。
   - 如果你換了一台電腦、換了瀏覽器，或是清除了瀏覽器資料，設定會回到預設值。
   - 💡 **解決方案**：每次修改完滿意後，請點擊後台底部的 **「📁 匯出設定」** 將資料下載為 JSON 檔備份。換電腦時，只要用 **「📂 匯入設定」** 把 JSON 檔傳上去，就可以無縫接軌繼續編輯囉！
