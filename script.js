const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const ulDropdown = document.getElementById("input-dropdown");
const hourlyDropdownBtn = document.getElementById("day-dropdown-btn");
const hourlyDropdown = document.getElementById("days-drop-down");
const unitDropdownBtn = document.getElementById("unit-dropdown-btn");
const unitDropdown = document.getElementById("unit-dropdown");


// ----------------------------------------------------------
// ERROR HANDLING FOR APP BEGINS HERE
// ----------------------------------------------------------

// comeback to this later
const retryBtn = document.getElementById("retry-btn");
retryBtn.addEventListener("click", async () => {
  try {
    if (appState.query) {
      appState.query = appState.query || {lat: 40.71427, lon: -74.00597, name: "New York", country: "United States"};
      removeApiError();
      showMainLoadState()
      const weatherData = await fetchWeather(appState.query.lat, appState.query.lon)
      if (!weatherData) {
        removeMainLoadState()
        showNoResultsError();
        return;
      }
      storeWeatherData(weatherData, appState.query.name, appState.query.country)
    } else {
      appState.queryStr = appState.queryStr || "New York"
      removeApiError()
      showMainLoadState()
      handleSearch(appState.queryStr)
    }
  } catch (err) {
    removeMainLoadState()
    showApiError()
  }
});

function showMainLoadState() {
  const mainLoadingUi = document.getElementById("main-loading-state")
  const mainContent = document.querySelector("#main-content");
  mainLoadingUi.classList.remove("hidden")
  mainLoadingUi.classList.add("grid")
  mainContent.classList.remove("grid")
  mainContent.classList.add("hidden")
  mainLoadingUi.innerHTML = `
  <!-- grid of 4 rows on mobile, 2 rows on desktop -->
      <!-- left -->
      <div>
        <!-- row 1 -->
        <div class="relative w-full h-60 md:h-66 bg-[hsl(243,27%,20%)] rounded-2xl">
          <div class="w-full absolute top-1/2 transform -translate-y-1/2 left-0 flex flex-col items-center gap-y-3">
            <div class="flex gap-3 loading-dots">
              <div class="w-2.5 h-2.5 rounded-[50%] bg-[hsl(250,6%,84%)]"></div>
              <div class="w-2.5 h-2.5 rounded-[50%] bg-[hsl(250,6%,84%)]"></div>
              <div class="w-2.5 h-2.5 rounded-[50%] bg-[hsl(250,6%,84%)]"></div>
            </div>
            <div><p class="text-[hsl(240,6%,70%)]">Loading...</p></div>
          </div>
        </div>
        <!-- row 2 -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 md:mt-8">
          <div class="bg-[hsl(243,27%,20%)] rounded-xl h-25 border border-[hsl(243,23%,30%)] p-4 flex flex-col justify-between">
            <p class="text-[hsl(250,6%,84%)] text-sm">Feels Like</p>
            <p id="feels-like" class="text-2xl fw-light text-[hsl(240,6%,70%)]">_</p>
          </div>
          <div class="bg-[hsl(243,27%,20%)] rounded-xl h-25 border border-[hsl(243,23%,30%)] p-4 flex flex-col justify-between">
            <p class="text-[hsl(250,6%,84%)] text-sm">Humidity</p>
            <p id="humidity-value" class="text-2xl fw-light text-[hsl(240,6%,70%)]">_</p>
          </div>
          <div class="bg-[hsl(243,27%,20%)] rounded-xl h-25 border border-[hsl(243,23%,30%)] p-4 flex flex-col justify-between">
            <p class="text-[hsl(250,6%,84%)] text-sm">Wind</p>
            <p id="wind-value" class="text-2xl fw-light text-[hsl(240,6%,70%)]">_</p>
          </div>
          <div class="bg-[hsl(243,27%,20%)] rounded-xl h-25 border border-[hsl(243,23%,30%)] p-4 flex flex-col justify-between">
            <p class="text-[hsl(250,6%,84%)] text-sm">Percipitation</p>
            <p id="precip-value" class="text-2xl fw-light text-[hsl(240,6%,70%)]">_</p>
          </div>
        </div>
        <!-- row 3 -->
        <div class="mt-6 md:mt-12">
          <p>Daily forecast</p>
          <div id="daily-forecast-container" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-2 xl:gap-4 gap-4 mt-4">
            <div class="bg-[hsl(243,27%,20%)] rounded-xl h-34 border border-[hsl(243,23%,30%)] px-2 py-3"></div>
            <div class="bg-[hsl(243,27%,20%)] rounded-xl h-34 border border-[hsl(243,23%,30%)] px-2 py-3"></div>
            <div class="bg-[hsl(243,27%,20%)] rounded-xl h-34 border border-[hsl(243,23%,30%)] px-2 py-3"></div>
            <div class="bg-[hsl(243,27%,20%)] rounded-xl h-34 border border-[hsl(243,23%,30%)] px-2 py-3"></div>
            <div class="bg-[hsl(243,27%,20%)] rounded-xl h-34 border border-[hsl(243,23%,30%)] px-2 py-3"></div>
            <div class="bg-[hsl(243,27%,20%)] rounded-xl h-34 border border-[hsl(243,23%,30%)] px-2 py-3"></div>
            <div class="bg-[hsl(243,27%,20%)] rounded-xl h-34 border border-[hsl(243,23%,30%)] px-2 py-3"></div>
          </div>
        </div>
      </div>
      <!-- right -->
      <div class="w-full py-4 mt-6 md:mt-0 bg-[hsl(243,23%,24%)] rounded-2xl">
        <div class="px-4 flex justify-between items-center mb-4">
          <p class="text-lg">Hourly forecast</p>
          <div class="group w-27 h-12 day-dropdown flex justify-end items-center">
            <button id="day-dropdown-btn" class="h-9 text-center px-4 py-2 flex justify-between gap-x-2 items-center bg-[hsl(243,23%,30%)] rounded-[6px] gap-2 text-lg cursor-pointer fw-light">- <img src="assets/images/icon-dropdown.svg" alt=""></button>
          </div>
        </div>
        <div id="hourly-section-container" class="hourly-section-container w-full h-135 md:h-200 lg:h-135 px-4 overflow-y-auto custom-scroll">
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div>
          <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full h-13.5 px-4 py-2 flex justify-between items-center mb-4"></div> 
        </div>
      </div>
  `
}

function removeMainLoadState() {
  const mainLoadingUi = document.getElementById("main-loading-state")
  const mainContent = document.querySelector("#main-content");
  mainLoadingUi.classList.remove("grid")
  mainLoadingUi.classList.add("hidden")
  mainContent.classList.remove("hidden")
  mainContent.classList.add("grid")
  mainLoadingUi.innerHTML = ""
}

function showSearchLoadState() {
  ulDropdown.innerHTML = ""
  ulDropdown.innerHTML = `<li class="p-2 flex gap-3 items-center text-sm">
    <img class="spinner" src="assets/images/icon-loading.svg" alt=""> Search in progress
    </li>`
}

function showApiError() {
  const ui = document.querySelector("#weather-api-error");
  const h2 = document.querySelector("#section2-header");
  const searchDiv = document.querySelector("#section3-search-div");
  const mainContent = document.querySelector("#main-content");
  const mainLoadingUi = document.getElementById("main-loading-state")
  ui.classList.remove("hidden");
  searchDiv.classList.remove("md:flex");
  searchDiv.classList.add("hidden");
  h2.classList.add("hidden");
  mainContent.classList.add("hidden");
  mainLoadingUi.innerHTML = ""
}

function removeApiError() {
  const ui = document.querySelector("#weather-api-error");
  const h2 = document.querySelector("#section2-header");
  const searchDiv = document.querySelector("#section3-search-div");
  const mainContent = document.querySelector("#main-content");
  ui.classList.add("hidden");
  searchDiv.classList.add("md:flex");
  searchDiv.classList.remove("hidden");
  h2.classList.remove("hidden");
  mainContent.classList.remove("hidden");
}

function showNoResultsError() {
  const ui = document.querySelector("#weather-ui-no-result");
  const mainContent = document.querySelector("#main-content");
  const mainLoadingUi = document.getElementById("main-loading-state")
  mainLoadingUi.innerHTML = ""
  mainContent.classList.add("hidden");
  ui.classList.remove("hidden");
}

function removeNoResultsError() {
  const ui = document.querySelector("#weather-ui-no-result");
  const mainContent = document.querySelector("#main-content");
  mainContent.classList.remove("hidden");
  ui.classList.add("hidden");
}


// WRAPPER FUNCTION TO HANDLE SEARCH WITH ERRORS

async function handleSearch(query) {
  // showLoading(); // show loading immediately

  try {
    const location = await searchLocation(query);
    if (!location) {
      showNoResultsError();
      return;
    }

    const weatherData = await fetchWeather(location.lat, location.lon,);
    if (!weatherData) {
      showNoResultsError(); // missing/invalid weather data
      return;
    }

    removeNoResultsError();
    removeApiError();
    storeWeatherData(weatherData, location.name, location.country);

  } catch (err) {
    console.error(err);
    showApiError();
  }
}
// ------------------END ERROR HANDLING --------------------------

hourlyDropdownBtn.addEventListener("click", () => {
  hourlyDropdown.classList.toggle("hidden");
});

// Close the dropdown if clicked outside useful for mobile
unitDropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent click from bubbling to document
  unitDropdown.classList.toggle("hidden");
});

document.addEventListener("click", () => {
  if (!unitDropdown.classList.contains("hidden")) {
    unitDropdown.classList.add("hidden");
  }
});

unitDropdown.addEventListener("click", (e) => {
  e.stopPropagation();
});

import { weatherIconMap } from "./weather-icon.js";

searchBar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchBar.value.trim();
    if (query) {
      appState.queryStr = query;
      appState.query = null
      showMainLoadState()
      handleSearch(query);
      searchBar.value = "";
      ulDropdown.classList.add("hidden");
    }
  }
});

searchBar.addEventListener("input", async () => {
  showSearchLoadState()
  try {
    const query = searchBar.value.trim();

    if (!query) {
      ulDropdown.classList.add("hidden");
      return;
    }
    // call search in progress here, jus above fetch

    const places = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=4`);
    const placesData = await places.json();
    ulDropdown.innerHTML = "";
    if (!placesData.results || placesData.results.length === 0) {
      ulDropdown.classList.add("hidden");
      return;
    }
    placesData.results.forEach(place => {
      const li = document.createElement("li");
      li.className = "cursor-pointer text-sm p-2 hover:bg-[hsl(243,23%,24%)] border border-[hsl(243,27%,20%)] hover:border-[hsl(243,23%,30%)] rounded-lg";
      li.textContent = `${place.name}, ${place.country}`;
      li.addEventListener("click", async () => {
        try {
          searchBar.value = li.textContent;
          appState.query = {
            lat: place.latitude,
            lon: place.longitude,
            name: place.name,
            country: place.country
          }
          ulDropdown.classList.add("hidden");
          showMainLoadState()
          const weatherData = await fetchWeather(place.latitude, place.longitude);
          if (!weatherData) {
            searchBar.value = "";
            showNoResultsError();
            return
          }
          removeMainLoadState();
          removeNoResultsError();
          removeApiError();
          storeWeatherData(weatherData, place.name, place.country);
          searchBar.value = "";
        } catch (err) {
          searchBar.value = "";
          showApiError()
        }
      })
      ulDropdown.appendChild(li);
    })
    ulDropdown.classList.remove("hidden");
  } catch (err) {
    console.error("❌ Error fetching weather:", err);
  }
})

searchBtn.addEventListener("click", () => {
  const query = searchBar.value.trim();
  if (query) {
    appState.query = null
    appState.queryStr = query;
    showMainLoadState()
    handleSearch(query);
    searchBar.value = "";
    ulDropdown.classList.add("hidden");
  }
})


// ----------------------------------------------------------
// 🌍 Step 0 — Global State
// ----------------------------------------------------------
const appState = {
  location: {
    name: "",
    country: ""
  },
  current: {},
  daily: [],
  hourly: {},      // Example: hourly["2025-03-22"] = [{time, temp, code}]
  units: {
    system: "metric",  // "metric" or "imperial"
    temp: "c",
    wind: "km/h",
    precip: "mm"
  },
  selectedDay: null,
  query: null,
  queryStr: ""
};

// ----------------------------------------------------------
// 🌍 Step 1 — Search for the location (geocoding request)
// ----------------------------------------------------------
async function searchLocation(query) {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1`);
    if (!geoRes.ok) return null;
    
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return null;
      // throw new Error("Location not found");
    }

    const loc = geoData.results[0];
    return {
      name: loc.name,
      country: loc.country,
      lat: loc.latitude,
      lon: loc.longitude
    }

    // await fetchWeather(loc.latitude, loc.longitude, loc.name, loc.country);

  } catch (err) {
    // console.error("❌ Error fetching location:", err);
    throw new Error("API ERROR");
  }
}

// ----------------------------------------------------------
// 🌦️ Step 2 — Fetch weather data (main API call)
// ----------------------------------------------------------
async function fetchWeather(lat, lon) {
  try {
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode&forecast_days=7&timezone=auto`);
    if (!weatherRes.ok) return null

    const weatherData = await weatherRes.json();

    if (!weatherData.daily || !weatherData.hourly || !weatherData.current) {
      return null;
    }

    return weatherData;
    // storeWeatherData(weatherData, name, country);


  } catch (err) {
    throw new Error("API ERROR");
    // console.error("❌ Error fetching weather:", err);
  }
}

// ----------------------------------------------------------
// 💾 Step 3 — STORE DATA (core of app)
// ----------------------------------------------------------
function storeWeatherData(data, name, country) {

  // --------------------------
  // 1. Store location
  // --------------------------
  appState.location.name = name;
  appState.location.country = country;


  // --------------------------
  // 2. Store CURRENT weather
  // --------------------------
  appState.current = {
    temp: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    wind: data.current.wind_speed_10m,
    precip: data.current.precipitation,
    weathercode: data.current.weathercode,
    time: data.current.time,
    feelslike: data.current.apparent_temperature
  };


  // --------------------------
  // 3. Store DAILY forecast (7 days)
  // --------------------------
  // Structure: [{date, max, min, weathercode}, {date, max, min, weathercode}, ... max is 7 days]
  appState.daily = data.daily.time.map((date, i) => ({
    date: date,
    max: data.daily.temperature_2m_max[i],
    min: data.daily.temperature_2m_min[i],
    weathercode: data.daily.weathercode[i]
  }));


  // --------------------------
  // 4. Store HOURLY forecast (grouped by day)
  // --------------------------
  // Structure: { "2025-03-22": [{time, temp, weathercode}, {time, temp, weathercode}, ... max is 24 hours], "2025-03-23": [{time, temp, weathercode}, ... max is 24 hours], ... max is 7 days }
  appState.hourly = {}; // reset

  data.hourly.time.forEach((timestamp, i) => {
    const day = timestamp.split("T")[0];  // "2025-03-22"

    if (!appState.hourly[day]) {
      appState.hourly[day] = [];
    }

    appState.hourly[day].push({
      time: timestamp,
      temp: data.hourly.temperature_2m[i],
      weathercode: data.hourly.weathercode[i]
    });
  });


  // --------------------------
  // 5. Trigger UI rendering
  // --------------------------
  removeMainLoadState();
  renderCurrentWeather();
  renderDailyForecast();
  renderHourlyForecast();
}
// ----------------------------------------------------------
// 🛠️ Step 3.5 — Helper functions
// ----------------------------------------------------------
function getWeatherIconClass(code) {
  return weatherIconMap[code] || "icon-sunny"
}

function formatDay(dateStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  const currentDate = new Date(dateStr);
  return currentDate.toLocaleDateString(undefined, options)
}

function formatDateShort(dateStr) {
  const day = new Date(dateStr);
  return day.toLocaleDateString(undefined, { weekday: 'short'})
}

function formatDatelong(dateStr) {
  const day = new Date(dateStr);
  return day.toLocaleDateString(undefined, { weekday: 'long'})
}

function formatHour(dateStr) {
  const d = new Date(dateStr);
  let hour = d.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour} ${ampm}`;
}


// ----------------------------------------------------------
// 🎨 Step 4 — Render functions (empty for now)
// ----------------------------------------------------------
function renderCurrentWeather() {
  const temperatureDisplay = document.getElementById("temperature-display");
  const locationDisplay = document.getElementById("current-location");
  const dateDisplay = document.getElementById("current-date");
  const currentIcon = document.getElementById("icon-current");
  const feelsLikeDisplay = document.getElementById("feels-like");
  const humidityDisplay = document.getElementById("humidity-value");
  const windDisplay = document.getElementById("wind-value");
  const precipDisplay = document.getElementById("precip-value");

  temperatureDisplay.textContent = `${Math.round(appState.current.temp)}°`;
  locationDisplay.textContent = `${appState.location.name}, ${appState.location.country}`;
  dateDisplay.textContent = formatDay(appState.current.time);
  currentIcon.src = `assets/images/${getWeatherIconClass(appState.current.weathercode)}.webp`
  humidityDisplay.textContent = `${appState.current.humidity}%`;
  windDisplay.textContent = `${Math.round(appState.current.wind * 10) / 10} ${appState.units.wind}`;
  precipDisplay.textContent = `${appState.current.precip} ${appState.units.precip}`;
  feelsLikeDisplay.textContent = `${Math.round(appState.current.feelslike)}°`;
}

function renderDailyForecast() {
  const dailyContainer = document.getElementById("daily-forecast-container");
  dailyContainer.innerHTML = "";
  appState.daily.forEach(day => {
    dailyContainer.innerHTML += `
      <div class="bg-[hsl(243,27%,20%)] rounded-xl h-34 border border-[hsl(243,23%,30%)] px-2 py-3">
        <div class="w-full h-full flex flex-col justify-between">
          <p class="text-center">${formatDateShort(day.date)}</p>
          <img src="assets/images/${getWeatherIconClass(day.weathercode)}.webp" alt="weather-icon" class="w-13 mx-auto">
          <div class="w-full flex justify-between">
            <span class="text-sm">${Math.round(day.max)}°</span>
            <span class="text-sm text-[hsl(250,6%,84%)]">${Math.round(day.min)}°</span>
          </div>
        </div>
      </div>`
  })
}

function renderHourlyForecast() {
  const hourlyContainer = document.getElementById("hourly-section-container");

  let day = appState.selectedDay;
  if(!day) {
    day = appState.daily[0].date;
    appState.selectedDay = day;
  }

  const hourlyData = appState.hourly[day];
  hourlyContainer.innerHTML = "";
  hourlyData.forEach(hour => {
    hourlyContainer.innerHTML += `
      <div class="bg-[hsl(243,27%,20%)] rounded-lg border border-[hsl(243,23%,30%)] w-full px-4 py-2 flex justify-between items-center mb-4">
        <div class="flex gap-2 justify-between items-center">
          <img src="assets/images/${getWeatherIconClass(hour.weathercode)}.webp" alt="weather-icon" class="w-9">
          <p class="text-lg">${formatHour(hour.time)}</p>
        </div>
          <p class="text-sm">${Math.round(hour.temp)}°</p>
      </div>`
  })

  setupDaySelector();
}

function setupDaySelector() {
  // Populate the days dropdown
  hourlyDropdown.innerHTML = ""
  appState.daily.forEach(day => {
    const p = document.createElement("p");
    if (appState.selectedDay === day.date) {
      p.className = "p-2 text-sm bg-[hsl(243,23%,24%)] rounded-lg cursor-pointer";
      hourlyDropdownBtn.innerHTML = `${formatDatelong(day.date)} <img src="assets/images/icon-dropdown.svg" alt="">`;
    } else {
      p.className = "p-2 text-sm rounded-lg cursor-pointer";
    }
    p.textContent = formatDatelong(day.date);
    p.addEventListener("click", () => {
      appState.selectedDay = day.date;
      p.className = "p-2 text-sm bg-[hsl(243,23%,24%)] rounded-lg cursor-pointer";
      hourlyDropdownBtn.innerHTML = `${formatDatelong(day.date)} <img src="assets/images/icon-dropdown.svg" alt="">`;
      renderHourlyForecast();
      hourlyDropdown.classList.add("hidden");
    })
    hourlyDropdown.appendChild(p);
  })
}

// ----------------------------------------------------------
// ⚙️ Step 5 — Unit switcher (later)
// ----------------------------------------------------------
const unitsBtn = document.getElementById("switch-units-btn");
const tempMetric = document.getElementById("temp-metric");
const tempImperial = document.getElementById("temp-imperial");
const windMetric = document.getElementById("metric-wind-speed");
const windImperial = document.getElementById("Imperial-wind-speed");
const precipMetric = document.getElementById("metric-measurement");
const precipImperial = document.getElementById("Imperial-measurement");

unitsBtn.addEventListener("click", () => {
  const newSystem = appState.units.system === "metric" ? "imperial" : "metric";
  unitsBtn.textContent = newSystem === "metric" ? "Switch to Imperial" : "Switch to Metric";
  if (newSystem === "metric") {
    tempMetric.classList.add("bg-[hsl(243,23%,24%)]");
    tempMetric.innerHTML = `Celsius (°C) <img src="assets/images/icon-checkmark.svg" alt="">`;
    tempImperial.innerHTML = `Fahrenheit (°F) <img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    tempImperial.classList.remove("bg-[hsl(243,23%,24%)]");
    windMetric.classList.add("bg-[hsl(243,23%,24%)]");
    windMetric.innerHTML = `km/h<img src="assets/images/icon-checkmark.svg" alt="">`;
    windImperial.innerHTML = `mph<img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    windImperial.classList.remove("bg-[hsl(243,23%,24%)]");
    precipMetric.classList.add("bg-[hsl(243,23%,24%)]");
    precipMetric.innerHTML = `Millimeters (mm) <img src="assets/images/icon-checkmark.svg" alt="">`;
    precipImperial.innerHTML = `Inches (in) <img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    precipImperial.classList.remove("bg-[hsl(243,23%,24%)]");
  } else {
    tempImperial.classList.add("bg-[hsl(243,23%,24%)]");
    tempImperial.innerHTML = `Fahrenheit (°F) <img src="assets/images/icon-checkmark.svg" alt="">`;
    tempMetric.innerHTML = `Celsius (°C) <img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    tempMetric.classList.remove("bg-[hsl(243,23%,24%)]");
    windImperial.classList.add("bg-[hsl(243,23%,24%)]");
    windImperial.innerHTML = `mph<img src="assets/images/icon-checkmark.svg" alt="">`;
    windMetric.innerHTML = `km/h<img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    windMetric.classList.remove("bg-[hsl(243,23%,24%)]");
    precipImperial.classList.add("bg-[hsl(243,23%,24%)]");
    precipImperial.innerHTML = `Inches (in) <img src="assets/images/icon-checkmark.svg" alt="">`;
    precipMetric.innerHTML = `Millimeters (mm) <img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    precipMetric.classList.remove("bg-[hsl(243,23%,24%)]");
  }

  switchSystem(newSystem);
  switchUnits();
  renderCurrentWeather();
  renderDailyForecast();
  renderHourlyForecast();
});

// CONVERSION HELPERS

// Celsius → Fahrenheit
function cToF(c) {
  return (c * 9) / 5 + 32;
}

// Fahrenheit → Celsius
function fToC(f) {
  return ((f - 32) * 5) / 9;
}

// km/h → mph
function kmhToMph(k) {
  return k * 0.621371;
}

// mph → km/h
function mphToKmh(m) {
  return m / 0.621371;
}

// mm → inches
function mmToIn(mm) {
  return mm / 25.4;
}

// inches → mm
function inToMm(inches) {
  return inches * 25.4;
}

// SWITCH FULL SYSTEM
export function switchSystem(system) {
  appState.units.system = system; // "metric" or "imperial" 
    if (appState.units.system === "imperial") {
    appState.units.temp = appState.units.temp === "f" ? "c" : "f";
    appState.units.wind = appState.units.wind === "mph" ? "km/h" : "mph";
    appState.units.precip = appState.units.precip === "in" ? "mm" : "in";
  }
  else {
    appState.units.temp = appState.units.temp === "c" ? "f" : "c";
    appState.units.wind = appState.units.wind === "km/h" ? "mph" : "km/h";
    appState.units.precip = appState.units.precip === "mm" ? "in" : "mm";
  }
}



function switchUnits() {
  // Convert CURRENT weather
  if (appState.units.system === "imperial") {
    if(appState.units.temp === "f") {
      appState.current.temp = cToF(appState.current.temp);
      appState.current.feelslike = cToF(appState.current.feelslike);
    }
    if (appState.units.wind === "mph") appState.current.wind = kmhToMph(appState.current.wind);
    if (appState.units.precip === "in") appState.current.precip = mmToIn(appState.current.precip);
  } else {
    if(appState.units.temp === "c") {
      appState.current.temp = fToC(appState.current.temp);
      appState.current.feelslike = fToC(appState.current.feelslike);
    } 
    if (appState.units.wind === "km/h") appState.current.wind = mphToKmh(appState.current.wind);
    if (appState.units.precip === "mm") appState.current.precip = inToMm(appState.current.precip);
  }
  // Convert DAILY forecast
  appState.daily = appState.daily.map(day => {
    if (appState.units.system === "imperial" && appState.units.temp === "f") {
      return {
        date: day.date,
        max: cToF(day.max),
        min: cToF(day.min),
        weathercode: day.weathercode
      };
    } else if (appState.units.system === "imperial" && appState.units.temp === "c") {
        return {
          date: day.date,
          max: day.max,
          min: day.min,
          weathercode: day.weathercode
        };
    } else if (appState.units.system === "metric" && appState.units.temp === "c") {
      return {
        date: day.date,
        max: fToC(day.max),
        min: fToC(day.min),
        weathercode: day.weathercode
      };
    } else if (appState.units.system === "metric" && appState.units.temp === "f") {
      return {
        date: day.date,
        max: day.max,
        min: day.min,
        weathercode: day.weathercode
      };
    }
  });
  // Convert HOURLY forecast
  Object.keys(appState.hourly).forEach(day => {
    appState.hourly[day] = appState.hourly[day].map(hour => {
      if (appState.units.system === "imperial" && appState.units.temp === "f") {
        return {
          time: hour.time,
          temp: cToF(hour.temp),
          weathercode: hour.weathercode
        };
      } else if (appState.units.system === "imperial" && appState.units.temp === "c") {
        return {
          time: hour.time,
          temp: hour.temp,
          weathercode: hour.weathercode
        };
      } else if (appState.units.system === "metric" && appState.units.temp === "c") {
        return {
          time: hour.time,
          temp: fToC(hour.temp),
          weathercode: hour.weathercode
        };
      } else if (appState.units.system === "metric" && appState.units.temp === "f") {
        return {
          time: hour.time,
          temp: hour.temp,
          weathercode: hour.weathercode
        };
      }
    });
  });
  
  // standardize units
  appState.units.temp = appState.units.system === "imperial" ? "f" : "c";
  appState.units.wind = appState.units.system === "imperial" ? "mph" : "km/h";
  appState.units.precip = appState.units.system === "imperial" ? "in" : "mm";
}

// switch individual units if needed
// temperature
tempImperial.addEventListener("click", () => {
  if (appState.units.temp !== "f") {
    appState.units.temp = "f";
    tempImperial.classList.add("bg-[hsl(243,23%,24%)]");
    tempImperial.innerHTML = `Fahrenheit (°F) <img src="assets/images/icon-checkmark.svg" alt="">`;
    tempMetric.innerHTML = `Celsius (°C) <img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    tempMetric.classList.remove("bg-[hsl(243,23%,24%)]");
    checkUnit();
    switchTemp();
    renderCurrentWeather();
    renderDailyForecast();
    renderHourlyForecast();
  } else {
    return;
  }
})

tempMetric.addEventListener("click", () => {
  if (appState.units.temp !== "c") {
    appState.units.temp = "c";
    tempMetric.classList.add("bg-[hsl(243,23%,24%)]");
    tempMetric.innerHTML = `Celsius (°C) <img src="assets/images/icon-checkmark.svg" alt="">`;
    tempImperial.innerHTML = `Fahrenheit (°F) <img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    tempImperial.classList.remove("bg-[hsl(243,23%,24%)]");
    checkUnit();
    switchTemp();
    renderCurrentWeather();
    renderDailyForecast();
    renderHourlyForecast();
  } else {
    return;
  }
})

function switchTemp() {
  if (appState.units.temp === "f") {
    // change cunrrent
    appState.current.temp = cToF(appState.current.temp);
    appState.current.feelslike = cToF(appState.current.feelslike);
    // change daily
    appState.daily = appState.daily.map(day => ({
      date: day.date,
      max: cToF(day.max),
      min: cToF(day.min),
      weathercode: day.weathercode
    }));
    // change hourly
    Object.keys(appState.hourly).forEach(day => {
      appState.hourly[day] = appState.hourly[day].map(hour => ({
        time: hour.time,
        temp: cToF(hour.temp),
        weathercode: hour.weathercode
      }));
    });
  } else {
    // change cunrrent
    appState.current.temp = fToC(appState.current.temp);
    appState.current.feelslike = fToC(appState.current.feelslike);
    // change daily
    appState.daily = appState.daily.map(day => ({
      date: day.date,
      max: fToC(day.max),
      min: fToC(day.min),
      weathercode: day.weathercode
    }));
    // change hourly
    Object.keys(appState.hourly).forEach(day => {
      appState.hourly[day] = appState.hourly[day].map(hour => ({
        time: hour.time,
        temp: fToC(hour.temp),
        weathercode: hour.weathercode
      }));
    });
  }
}

// wind speed
windImperial.addEventListener("click", () => {
  if (appState.units.wind !== "mph") {
    appState.units.wind = "mph";
    windImperial.classList.add("bg-[hsl(243,23%,24%)]");
    windImperial.innerHTML = `mph<img src="assets/images/icon-checkmark.svg" alt="">`;
    windMetric.innerHTML = `km/h<img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    windMetric.classList.remove("bg-[hsl(243,23%,24%)]"); 
    checkUnit();
    switchWind();
    renderCurrentWeather()
  } else {
    return;
  }
})
windMetric.addEventListener("click", () => {
  if (appState.units.wind !== "km/h") {
    appState.units.wind = "km/h";
    windMetric.classList.add("bg-[hsl(243,23%,24%)]");
    windMetric.innerHTML = `km/h<img src="assets/images/icon-checkmark.svg" alt="">`;
    windImperial.innerHTML = `mph<img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    windImperial.classList.remove("bg-[hsl(243,23%,24%)]");
    checkUnit();
    switchWind();
    renderCurrentWeather()
  } else {
    return;
  }
})

function switchWind() {
  if (appState.units.wind === "mph") {
    appState.current.wind = kmhToMph(appState.current.wind);
  } else {
    appState.current.wind = mphToKmh(appState.current.wind);
  }
}

// precipitation
precipImperial.addEventListener("click", () => {
  if (appState.units.precip !== "in") {
    appState.units.precip = "in"
    precipImperial.classList.add("bg-[hsl(243,23%,24%)]");
    precipImperial.innerHTML = `Inches (in) <img src="assets/images/icon-checkmark.svg" alt="">`;
    precipMetric.innerHTML = `Millimeters (mm) <img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    precipMetric.classList.remove("bg-[hsl(243,23%,24%)]");
    checkUnit();
    switchPrecip();
    renderCurrentWeather();
  } else {
    return;
  }
})

precipMetric.addEventListener("click", () => {
  if (appState.units.precip !== "mm") {
    appState.units.precip = "mm"
    precipMetric.classList.add("bg-[hsl(243,23%,24%)]");
    precipMetric.innerHTML = `Millimeters (mm) <img src="assets/images/icon-checkmark.svg" alt="">`;
    precipImperial.innerHTML = `Inches (in) <img src="assets/images/icon-checkmark.svg" alt="" class="hidden">`;
    precipImperial.classList.remove("bg-[hsl(243,23%,24%)]");
    checkUnit();
    switchPrecip();
    renderCurrentWeather();
  } else {
    return;
  }
})

function switchPrecip() {
  if (appState.units.precip === "in") {
    appState.current.precip = mmToIn(appState.current.precip);
  } else {
    appState.current.precip = inToMm(appState.current.precip);
  }
}

// check current selected unit and update UI accordingly
function checkUnit() {
  // imperial
  if (appState.units.temp === "f" && appState.units.wind === "mph" && appState.units.precip === "in") {
    appState.units.system = "imperial";
    unitsBtn.textContent = "Switch to Metric";
  } else if (appState.units.temp === "c" && appState.units.wind === "km/h" && appState.units.precip === "mm") {
    appState.units.system = "metric";
    unitsBtn.textContent = "Switch to Imperial";
  } else {
    return;
  }
}

// Initial fetch for a default location
showMainLoadState()
handleSearch("New York");