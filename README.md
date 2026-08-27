# WooCommerce Product Catalogue

A digital B2B product catalogue website for **Core Sportswears** — a wholesale and private-label apparel manufacturer based in Sialkot, Pakistan. The site fetches live product data from a WooCommerce store and presents it as an interactive flipbook with realistic page-flipping animations, PDF export, and responsive design.

## Features

- **Interactive Flipbook Viewer** — Turn.js-powered page-flipping with curl shadows, spine effects, and elevation
- **Live WooCommerce Data** — Fetches products and categories from the WooCommerce Store API v1, with fallback to hardcoded data
- **PDF Download** — Export any category catalogue as a PDF via html2canvas + jsPDF
- **6 Product Categories** — Ski & Snow Wear, Streetwear, Sportswear, Bags, Headwear & Accessories, Customization Options
- **Table of Contents** — Auto-generated with subcategory page numbers
- **Thumbnail Grid** — Quick page navigation overlay
- **Zoom Controls** — 0.5x to 2x with smooth transitions
- **Full-Screen Mode** — Immersive viewing
- **Keyboard Navigation** — Arrow keys, Ctrl+/- zoom, Escape
- **Image Proxy** — Server-side proxy to bypass CORS on product images
- **Caching** — WooCommerce responses cached 5 min, images cached 24 hr
- **WhatsApp CTA** — Direct contact integration

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Server | Node.js, Express.js, ES Modules |
| Frontend | Vanilla HTML/CSS/JS, jQuery, Turn.js 3 |
| PDF Generation | html2canvas, jsPDF (client-side) |
| Fonts | Google Fonts (Poppins, Open Sans) |
| Icons | Font Awesome 6.5.1 |
| Data Source | WooCommerce Store API v1 |
| Deployment | Vercel |

## Project Structure

```
woocommerce-catalogue/
├── server.js                          # Express server (production entry point)
├── public/                            # Static frontend (used by Vercel)
│   ├── index.html                     # Catalogue landing page
│   ├── flipbook-viewer.html           # Interactive flipbook viewer
│   └── *.png, *.jfif                  # Category images, assets
├── artifacts/
│   └── static-site/                   # Alternate static site (used by Express)
│       ├── index.html                 # Landing page (served at / by server.js)
│       └── public/                    # Static assets (flipbook-viewer, favicon, etc.)
├── api/                               # Vercel serverless functions
│   ├── wc.js                          # WooCommerce API proxy
│   └── img-proxy.js                   # Image proxy (CORS bypass)
├── lib/                               # Shared workspace libraries (Replit monorepo)
├── scripts/                           # Utility scripts
├── vercel.json                        # Vercel deployment config
└── replit.md                          # Replit workspace docs
```

## Getting Started

### Prerequisites

- Node.js 18+

### Run Locally

The project has no root `package.json`. Install dependencies manually:

```bash
git clone https://github.com/arooba-shafique/woocommerce-catalogue.git
cd woocommerce-catalogue
npm init -y
npm install express cors
node server.js
```

Open [http://localhost:3000](http://localhost:3000).

### Run with pnpm (Full Workspace)

The repo includes a monorepo workspace (Replit-focused) with TypeScript, React, and PostgreSQL support:

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wc?endpoint=<wc_path>` | Proxy to WooCommerce Store API v1 |
| GET | `/api/img-proxy?url=<image_url>` | Proxy image fetches (CORS bypass) |
| GET | `/healthz` | Health check |

## Deployment

Configured via `vercel.json`:
- Static files from `public/`
- Serverless functions in `api/`
