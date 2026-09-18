# Duot Labs — Official Website

> **Attention that moves. Growth systems that scale.**  
> High-performance AI growth systems & advertising intelligence for ambitious teams, alongside proprietary decision software.

Live URL: [https://duotlabs.com/](https://duotlabs.com/)  
Repository: [https://github.com/Ritabanm/Duot-labs-website](https://github.com/Ritabanm/Duot-labs-website)

---

## ⚡ Features & Sections

- **Modern AI Aesthetic**: Dark theme default with glassmorphism cards, glowing chartreuse/emerald accents, and animated typography (`Plus Jakarta Sans` & `JetBrains Mono`).
- **Live Signal Visualizer**: Real-time canvas simulation of ad signal vectors, telemetry readouts, and wave resonance.
- **Ads Consulting Engine**: Dedicated modules for Signal Engineering & CAPI, AI Creative Velocity, Paid Acquisition Architecture, and Custom AI Micro-Agents.
- **Interactive Ad ROAS & Signal Impact Calculator**: Real-time slider simulation of wasted spend recovery, creative throughput gains, and projected incremental annual revenue.
- **Proprietary Products Matrix**: Showcase for **Marque** (`marque.live`), **Bargane** (iOS App Store), **PriceScouter AI** (iOS App Store), and **AdPulse Lab**.
- **Field Theses & Vectors**: R&D inquiries (`T/01` to `T/04`) on attention mechanics, signal decay, and adaptive cadence.
- **Direct Strategy Booker**: Integrated Calendly strategy booking (`https://calendly.com/info-duotlabs/30min`) and lead brief intake.
- **Zero-Dependency Static Stack**: 100% pure HTML5, CSS3, and JavaScript — lightning fast, zero build errors, instant deployment.

---

## 🚀 Local Development

To run the site locally on your machine:

```bash
# Using Python 3 built-in HTTP server:
python3 -m http.server 8000

# Or using Node.js npx serve:
npx serve .
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🌐 Hosting via GitHub Pages (For Private Repositories)

### Option A: If you have GitHub Pro, Team, or Enterprise
GitHub Pages is supported natively on private repositories for paid GitHub tiers:

1. Push your code to the `main` branch:
   ```bash
   git add .
   git commit -m "Remake Duot Labs website with modern AI design"
   git push origin main
   ```
2. In your GitHub repository, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically trigger, build, and deploy your site to GitHub Pages!
5. (Optional) In **Custom domain**, enter `duotlabs.com` and enforce HTTPS.

---

### Option B: If you are on GitHub Free (100% Free Hosting for Private Repos)
GitHub restricts native GitHub Pages for private repos on the free tier. You can host this private repo for **100% free with automatic continuous deployment** via:

1. **Cloudflare Pages (Recommended)**:
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
   - Select your private repo `Ritabanm/Duot-labs-website`.
   - Build output directory: leave empty or `/`.
   - Click **Save and Deploy**. Cloudflare gives you a free `.pages.dev` domain and free custom domain binding with instant global CDN and DDoS protection.

2. **Vercel / Netlify**:
   - Import your private GitHub repo into Vercel or Netlify.
   - Framework preset: `Other` (static).
   - Instant 1-click deployment with free SSL and custom domain.

---

## 📂 File Structure

```
.
├── index.html                 # Main website entry point
├── styles.css                 # Modern CSS design system & responsive layout
├── app.js                     # Interactive logic (calculator, canvas, modals, ticker)
├── CNAME                      # Custom domain configuration for GitHub Pages
├── assets/
│   ├── logo.svg               # Vector brand logo
│   └── favicon.svg            # Vector browser icon
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions automated deployment workflow
└── README.md                  # Project documentation & deployment guide
```

---

## 📬 Contact & Channels

- **Website**: [duotlabs.com](https://duotlabs.com)
- **Schedule Call**: [calendly.com/info-duotlabs/30min](https://calendly.com/info-duotlabs/30min)
- **YouTube**: [@DuotLabs](https://www.youtube.com/@DuotLabs)
- **Email**: `info@duotlabs.com`
