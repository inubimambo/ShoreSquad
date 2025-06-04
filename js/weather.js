// weather.js
// Fetch and display 4-day weather forecast from NEA's API

const weatherInfo = document.getElementById('weather-info');

const weatherIcons = {
  "Fair (Day)": "☀️",
  "Fair (Night)": "🌙",
  "Partly Cloudy (Day)": "⛅",
  "Partly Cloudy (Night)": "☁️🌙",
  "Cloudy": "☁️",
  "Light Rain": "🌦️",
  "Moderate Rain": "🌧️",
  "Heavy Rain": "⛈️",
  "Showers": "🌦️",
  "Thundery Showers": "⛈️",
  "Heavy Thundery Showers": "⛈️",
  "Windy": "💨",
  "Hazy": "🌫️",
  "Fog": "🌫️",
  // fallback
  "default": "🌊"
};

function getWeatherIcon(desc) {
  for (const key in weatherIcons) {
    if (desc.includes(key)) return weatherIcons[key];
  }
  return weatherIcons["default"];
}

function getDayOfWeek(dateStr) {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

async function fetchWeatherForecast() {
  try {
    // NEA 4-day weather forecast endpoint
    const response = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast');
    if (!response.ok) throw new Error('Weather API error');
    const data = await response.json();
    renderForecast(data);
  } catch (err) {
    weatherInfo.innerHTML = '<p style="color:red">Unable to load weather forecast.</p>';
  }
}

function renderForecast(data) {
  if (!data.items || !data.items[0] || !data.items[0].forecasts) {
    weatherInfo.innerHTML = '<p>No forecast data available.</p>';
    return;
  }
  const forecasts = data.items[0].forecasts;
  let html = '<div class="forecast-grid">';
  forecasts.forEach(day => {
    const icon = getWeatherIcon(day.forecast);
    const dayOfWeek = getDayOfWeek(day.date);
    html += `
      <div class="forecast-day">
        <div class="forecast-date">${day.date} <span class="forecast-dow">(${dayOfWeek})</span></div>
        <div class="forecast-icon" style="font-size:2.2em;">${icon}</div>
        <div class="forecast-desc">${day.forecast} <span class="beachy">🌊</span></div>
        <div class="forecast-temp">${day.temperature.low}&ndash;${day.temperature.high}&deg;C</div>
        <div class="forecast-rh">Humidity: ${day.relative_humidity.low}&ndash;${day.relative_humidity.high}%</div>
        <div class="forecast-wind">Wind: ${day.wind.speed.low}&ndash;${day.wind.speed.high} km/h (${day.wind.direction})</div>
        <div class="forecast-rain">Rain: <span class="rain-emoji">${day.forecast.includes('Rain') || day.forecast.includes('Showers') ? '💧' : 'No rain lah!'}</span></div>
      </div>
    `;
  });
  html += '</div>';
  weatherInfo.innerHTML = html;
}

// Fetch and display today's weather (using NEA 2-hour nowcast as proxy for 'today')
async function fetchTodayWeather() {
  try {
    const response = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');
    if (!response.ok) throw new Error('Weather API error');
    const data = await response.json();
    renderTodayWeather(data);
  } catch (err) {
    document.getElementById('today-weather').innerHTML = '<span style="color:red">Unable to load today\'s weather.</span>';
  }
}

function renderTodayWeather(data) {
  // Try to find a forecast for a main beach area (Sentosa, East Coast, Pasir Ris, Changi)
  const beaches = ['Sentosa', 'East Coast', 'Pasir Ris', 'Changi'];
  let forecast = null;
  for (const area of beaches) {
    forecast = data.items[0].forecasts.find(f => f.area.includes(area));
    if (forecast) break;
  }
  if (!forecast) forecast = data.items[0].forecasts[0];
  const icon = getWeatherIcon(forecast.forecast);
  const now = new Date();
  const dayOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()];
  document.getElementById('today-weather').innerHTML = `
    <span class="today-icon">${icon}</span>
    <span class="today-main">Today (${dayOfWeek})</span>
    <span class="today-desc">${forecast.area}: ${forecast.forecast}</span>
  `;
}

// Override DOMContentLoaded to fetch both today and 4-day
function fetchWeatherAll() {
  fetchTodayWeather();
  fetchWeatherForecast();
}
document.addEventListener('DOMContentLoaded', fetchWeatherAll);
