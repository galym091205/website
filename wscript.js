const apiKey = 'f063201a0c9675137e55b5e06915715b';
let unit = 'metric';

const cityInput = document.getElementById('cityInput');
const suggestions = document.getElementById('suggestions');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const currentLocationButton = document.getElementById('currentLocationButton');

cityInput.addEventListener('input', handleCitySearch);
document.querySelectorAll('input[name="unit"]').forEach(radio => 
  radio.addEventListener('change', () => {
    unit = document.querySelector('input[name="unit"]:checked').value;
    if (cityInput.value.trim()) fetchWeather(cityInput.value.trim());
  })
);
currentLocationButton.addEventListener('click', fetchCurrentLocationWeather);

async function handleCitySearch() {
  const query = cityInput.value.trim();
  if (query.length > 2) {
    try {
      const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
      const cities = await response.json();
      displaySuggestions(cities);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  }
}

function displaySuggestions(cities) {
  suggestions.innerHTML = '';
  cities.forEach(city => {
    const item = document.createElement('div');
    item.textContent = `${city.name}, ${city.country}`;
    item.addEventListener('click', () => fetchWeather(city.name));
    suggestions.appendChild(item);
  });
}

async function fetchWeather(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`);
    const weatherData = await response.json();
    console.log("Current Weather Data:", weatherData);
    displayCurrentWeather(weatherData);

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();
    console.log("Forecast Data:", forecastData);
    displayForecast(forecastData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function displayCurrentWeather(data) {
  const { main, weather, wind, name } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  currentWeather.innerHTML = `
    <h2>${name}</h2>
    <img src="${iconUrl}" alt="${weather[0].description}">
    <p>Condition: ${weather[0].description}</p>
    <p>Temperature: ${main.temp}°${unit === 'metric' ? 'C' : 'F'}</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</p>
  `;
}

function displayForecast(data) {
  forecast.innerHTML = '<h3>5-Day Forecast</h3>';
  const forecastList = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  forecastList.forEach(dayData => {
    const date = new Date(dayData.dt * 1000).toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`;
    forecast.innerHTML += `
      <div class="forecast-day">
        <p>${date}</p>
        <img src="${iconUrl}" alt="${dayData.weather[0].description}">
        <p>${dayData.weather[0].description}</p>
        <p>High: ${dayData.main.temp_max}°</p>
        <p>Low: ${dayData.main.temp_min}°</p>
      </div>
    `;
  });
}

function fetchCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`);
        const weatherData = await response.json();
        console.log("Current Location Weather Data:", weatherData);
        displayCurrentWeather(weatherData);

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();
        console.log("Current Location Forecast Data:", forecastData);
        displayForecast(forecastData);
      } catch (error) {
        console.error("Error fetching current location weather data:", error);
      }
    }, error => {
      console.error("Geolocation error:", error);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
