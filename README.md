# FIT2179 Malaysia Hidden Living Pressure Dashboard

Rebuilt dashboard package with 10 Vega-Lite visualisations, a map-first storytelling structure, Malaysia + surrounding-country geographic context, a unified warm colour palette, and derived CSV files with aligned 2022 dates and variable names.

## Run locally
1. Open this folder in VS Code.
2. Install Live Server.
3. Right-click `index.html`.
4. Choose `Open with Live Server`.

Do not double-click `index.html`, because local CSV loading can fail.

## Main files
- `index.html`: page structure and storytelling text
- `style.css`: infographic-style layout and typography
- `js/vega_lite_vis.js`: all Vega-Lite chart specifications
- `data/`: cleaned and derived data files

## Map note
The main map uses a Vega world map as surrounding-country context and a Malaysia state GeoJSON overlay. If the external Malaysia GeoJSON fails to load, download it and save it as `data/malaysia.geojson`, then change `MALAYSIA_GEOJSON_URL` in `js/vega_lite_vis.js` to `data/malaysia.geojson`.
