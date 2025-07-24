# MausamGuru Weather App

A modern, accessible, and responsive weather dashboard built with React, featuring real-time weather, air quality, AI-powered insights, interactive maps (Mapbox & Leaflet), and more.

---

## Features

- **Current Weather:** Real-time weather for any location.
- **Forecasts:** Daily, hourly, and minute-by-minute forecasts.
- **Air Quality:** Live AQI and pollutant data.
- **AI Insights:** Health/activity recommendations and weather summaries powered by Google Gemini.
- **Interactive Maps:** Mapbox GL and Leaflet map views with weather overlays.
- **Search:** Fast, accessible location search with autocomplete.
- **Accessibility:** Full keyboard navigation, ARIA roles, focus outlines, and screen reader support.
- **Mobile Responsive:** Optimized for all devices.
- **Performance:** Debounced API calls, smooth map animations.
- **Customizable:** Built with Tailwind CSS for easy theming.

---

## Tech Stack

- **Frontend:** React, JavaScript, Tailwind CSS
- **Mapping:** Mapbox GL, Leaflet, react-map-gl, react-leaflet
- **Charts:** Recharts
- **APIs:** OpenWeatherMap, Google Gemini (AI), Mapbox
- **Build Tools:** Create React App, PostCSS, Autoprefixer

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/M-RajaBabu/MausamGuru.git
cd MausamGuru/client
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `client` directory:

```env
REACT_APP_OWM_API_KEY=your-openweathermap-api-key
REACT_APP_MAPBOX_TOKEN=your-mapbox-token
REACT_APP_GEMINI_API_KEY=your-gemini-api-key
```

> **Never commit your `.env` file!**  
> For sharing, use `.env.example` (provided).

### 4. Run Locally

```sh
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Deployment

### Deploying to Vercel

1. **Push your code to GitHub.**
2. **Import your repo on [Vercel](https://vercel.com/).**
3. **Set the project root to `client`.**
4. **Add the same environment variables in the Vercel dashboard.**
5. **Deploy!**

---

## Project Structure

```
client/
  ├── public/           # Static assets
  ├── src/
  │   ├── components/   # React components (Weather, Maps, Search, etc.)
  │   ├── App.js        # Main app logic
  │   ├── index.js      # Entry point
  │   └── ...           # Styles, tests, etc.
  ├── tailwind.config.js
  ├── postcss.config.js
  ├── package.json
  └── .env.example
```

---

## Customization

- **Styling:** Tailwind CSS is fully configured. Edit `tailwind.config.js` to customize.
- **APIs:** Swap out OpenWeatherMap or Mapbox with other providers by updating API calls and environment variables.

---

## Accessibility & Best Practices

- All interactive elements are keyboard accessible.
- ARIA roles and attributes are used throughout.
- Focus outlines and skip links for screen readers.
- Responsive design for all devices.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE) (or specify your license)

---

## Credits

- [OpenWeatherMap](https://openweathermap.org/)
- [Mapbox](https://www.mapbox.com/)
- [Leaflet](https://leafletjs.com/)
- [Google Gemini](https://ai.google.dev/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/) 