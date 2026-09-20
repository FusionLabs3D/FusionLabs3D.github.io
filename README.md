# FusionLabs3D — Official Website & Visual CMS

> **Engineering-Grade 3D Prototyping**  
> Functional parts • Engineering prototypes • Real-world applications.

Official production repository for the **FusionLabs3D** website, built with a precision engineering aesthetic (Hubs.com philosophy) and an integrated **Visual In-Place Editor / CMS** powered by Google Firebase.

---

## 🌐 Live Website & Channels

- **Live Website (GitHub Pages):** [https://fusionlabs3d.github.io/](https://fusionlabs3d.github.io/)
- **Quotation Form:** [Google Quotation Form](https://forms.gle/3dGpscBGzWatQ5mS8)
- **Instagram:** [@fusionlabs3d.india](https://www.instagram.com/fusionlabs3d.india/)
- **GitHub Organization / Repo:** [github.com/fusionlabs3d](https://github.com/fusionlabs3d)
- **Direct Inquiries:** `solutions.fusionlabs3d@gmail.com`
- **Location:** Jaipur, Rajasthan, India

---

## 🎨 Visual In-Place Editor (Owner CMS)

You have a complete visual clone of your website where **only you** can edit content directly on the page and publish live updates.

### What You Can Do in the Editor:
1. **Direct Click-to-Edit Text:**
   - Click directly on any headline, description, or section text on the page to change the wording.
2. **Filament Inventory & Tabs Management:**
   - **Toggle Stock:** Click any filament card's badge to toggle between `● In Stock` and `○ On Demand`.
   - **Add New Filaments:** Click **`+ Add New Filament`** to add any material (e.g. PLA, PETG, TPU, PC-CF) with temperature limits and characteristics. It will appear on your live site immediately.
   - **Edit Specs:** Change thermal ratings, use cases, or requirements for any material.
   - **Remove Materials:** Remove obsolete filaments with one click.
3. **One-Click Live Publishing:**
   - Click **`🚀 Publish to Live Site`** in the top bar to push your edits live to visitors worldwide in 1 second.

---

## 🔒 Security Architecture (Google Cloud / Firebase)

Your editing system is protected by **Google Firebase Authentication & Cloud Firestore**:
* **Public Visitors:** Can only read the website (fast, cached static delivery).
* **Owner Authentication:** Only your verified email (`solutions.fusionlabs3d@gmail.com`) with your password can publish changes.
* **Security Rules (`firestore.rules`):**
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /site_config/{document} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.token.email == "solutions.fusionlabs3d@gmail.com";
      }
    }
  }
  ```

---

## ⚡ Connecting Firebase (3-Year Lifespan Setup)

*(The editor already works out of the box in Local/Demo mode. Follow these 3 steps whenever you want real-time cloud sync across devices):*

1. **Create a Free Firebase Project:**
   - Go to [console.firebase.google.com](https://console.firebase.google.com/) and sign in with `solutions.fusionlabs3d@gmail.com`.
   - Click **"Add Project"** and name it `FusionLabs3D`.
2. **Enable Authentication & Firestore:**
   - Under **Build** &rarr; **Authentication** &rarr; **Sign-in method**, enable **Email/Password**.
   - Add your admin user: `solutions.fusionlabs3d@gmail.com` and create a strong password.
   - Under **Build** &rarr; **Firestore Database**, click **Create database** (start in production mode) and paste the rules from `firestore.rules`.
3. **Add Web App Credentials to `firebase-config.js`:**
   - Go to **Project Settings** (gear icon) &rarr; **General** &rarr; **Your apps** &rarr; click the `</>` Web icon.
   - Copy the `firebaseConfig` object and paste it into [`firebase-config.js`](firebase-config.js).
   - Commit and push to GitHub!

---

## 📁 Repository Structure

```
├── index.html              # Main public website (reads live published config)
├── admin-devansh.html      # Owner visual editor & password gate
├── editor.css              # Editor toolbar, editable outlines & modal styles
├── editor.js               # In-place text editing, image replacer & cloud publishing
├── firebase-config.js      # Firebase credentials & cloud database bridge
├── firestore.rules         # Security rules (locks write access to admin email)
├── data/
│   └── materials.json      # Centralized materials database
├── style.css               # Hubs.com engineering styles & animations
├── script.js               # Scroll reveals, hero carousel, filter tabs & live sync
├── robots.txt              # Production search engine directives
├── sitemap.xml             # XML sitemap
├── favicon.ico             # Tab icon
├── README.md               # Documentation
└── assets/                 # Logo and CAD technical schematics
```

---

## 💻 Local Testing

Start a local server:
```powershell
cd e:\IoT\FusionLabs3D-Website
python -m http.server 3000
```
- **View Website:** [http://localhost:3000](http://localhost:3000)

---

## 🚀 Publishing to GitHub Pages

1. **Push Local Code to GitHub:**
   ```powershell
   git add .
   git commit -m "Update site"
   git push origin main
   ```

2. **Accessing Admin Once Live:**
   - Navigate to your private admin URL
   - Authenticate with your Firebase administrator account (`solutions.fusionlabs3d@gmail.com`)
   - Edit any texts, replace images, or manage materials and click **Publish to Live Site**!


