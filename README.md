# AgriSense — Frontend-only edition

Pure **HTML + CSS + JavaScript** conversion of the uploaded AgriSense project. The ZIP contains **no Express server, MongoDB, React, Vite, Node.js dependencies, or `npm install` requirement**.

## How to run (Windows)

1. Extract the ZIP completely.
2. Double-click **`index.html`** or **`START_AGRISENSE.bat`**.
3. The app opens in your browser. You can navigate using the five tabs.

If your browser restricts online weather or geocoding from `file://`, you can optionally run it from a **static file server**. This is not an application backend. With Python installed, open a terminal in this folder:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500` in the browser. Python is **not needed** for the app itself.

## Features preserved / rebuilt

| Page | Frontend behavior |
| --- | --- |
| Home | Dashboard, 5-page navigation, crop price illustrations, weather summary |
| Crop Comparison | Add/remove **any of the 39 crops** (minimum 2), editable yield/expected price/cost, profit and risk illustrations, comparison chart and explanation |
| Mandi Prices | Filter **demo** prices by crop/state/district/mandi, view 511 illustrative price records from 38 sample mandis, example charts and a **synthetic** 30-day trend |
| Weather | Direct free Open-Meteo API call for real weather, 3-day forecast, India city/district search and rule-based advisory, subject to internet availability |
| My Plan | Farm area, costs, expected yield, sale price, automatic profit/break-even calculations, save/edit/delete in browser localStorage, export saved plans to CSV |

There is a Hindi / English toggle and a browser text-to-speech action (when supported).

## Very important: data limitations

- **All mandi prices are demo/synthetic figures, not current or historical government market prices.** The 30-day trend is also **synthetic**. The catalog covers 39 crops and the supplied sample covers 38 mandis in 22 states/union territories. It does **not** claim all Indian mandis or real-time government data.
- The original project's live government mandi integration used a server-side API key and server processing. It was removed with the backend. **Do not embed a secret `data.gov.in` API key in public JavaScript**. Live official mandi pricing would require a suitable CORS-enabled public endpoint without a secret, or a trusted proxy/backend.
- Open-Meteo weather and geocoding are requested **directly in the browser** and need an internet connection. When the request fails, the app shows a message, not a fabricated forecast.
- My Plan data is saved **on the current browser and origin only**, not synced to a cloud database. Export CSV regularly. Clearing browser site data can delete saved plans.
- Crop yield, expenses and prices are user estimates or explicitly labelled samples. Recommendations are illustrative calculations, not agricultural/financial guarantees.

## Files

- `index.html`: application entry point / structure
- `styles.css`: all styles and mobile layout
- `data.js`: static crop, location, mandi catalog and demo price records sourced from the uploaded project
- `translations.js`: Hindi and English translations retained from the uploaded project
- `app.js`: routing, calculations, state management, weather calls, filtering and all interactions
- `START_AGRISENSE.bat`: convenient Windows launcher

No build step, package manager, or backend process is required.
