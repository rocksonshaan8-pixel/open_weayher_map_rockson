const apiKey = "661f014a2a44fc5be5bd92162d577b29";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
const recentContainer = document.getElementById("recent-searches");

// Fetch weather function
async function fetchWeather(city) {
    if (!city) return;

    try {
        weatherResult.innerHTML = "Loading...";

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        displayWeather(data);
        saveRecentCity(city);
        localStorage.setItem("lastCity", city);

    } catch (error) {
        weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

// Display weather data
function displayWeather(data) {
    weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
}

// Save recent cities
function saveRecentCity(city) {
    let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

    // Remove duplicate
    cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());

    cities.unshift(city);

    // Limit to 5
    if (cities.length > 5) {
        cities.pop();
    }

    localStorage.setItem("recentCities", JSON.stringify(cities));
    renderRecentCities();
}

// Render recent buttons
function renderRecentCities() {
    recentContainer.innerHTML = "";

    const cities = JSON.parse(localStorage.getItem("recentCities")) || [];

    cities.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;
        btn.addEventListener("click", () => fetchWeather(city));
        recentContainer.appendChild(btn);
    });
}

// Search button click
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    fetchWeather(city);
    cityInput.value = "";
});

// Load last searched city on refresh
document.addEventListener("DOMContentLoaded", () => {
    renderRecentCities();

    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        fetchWeather(lastCity);
    }
});