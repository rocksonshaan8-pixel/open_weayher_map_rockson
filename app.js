
function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "https://api.openweathermap.org/data/2.5";
}

WeatherApp.prototype.init = function () {
    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.weatherContainer = document.getElementById("weather");
    this.forecastContainer = document.getElementById("forecast");

    this.searchBtn.addEventListener(
        "click",
        this.handleSearch.bind(this)
    );
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();
    if (!city) return;

    this.fetchWeatherData(city);
};

WeatherApp.prototype.fetchWeatherData = function (city) {

    const currentURL = `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastURL = `${this.baseURL}/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    Promise.all([
        fetch(currentURL).then(response => response.json()),
        fetch(forecastURL).then(response => response.json())
    ])
    .then(([currentData, forecastData]) => {
        this.displayCurrentWeather(currentData);
        this.displayForecast(forecastData);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
};

WeatherApp.prototype.displayCurrentWeather = function (data) {

    this.weatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Condition:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    `;
};

WeatherApp.prototype.displayForecast = function (data) {

    const dailyData = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    this.forecastContainer.innerHTML = "";

    dailyData.forEach(day => {

        const card = document.createElement("div");
        card.classList.add("forecast-card");

        const date = new Date(day.dt_txt).toDateString();
        const temp = day.main.temp;
        const desc = day.weather[0].description;
        const icon = day.weather[0].icon;

        card.innerHTML = `
            <h4>${date}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon">
            <p>${temp}°C</p>
            <p>${desc}</p>
        `;

        this.forecastContainer.appendChild(card);
    });
};

const app = new WeatherApp("661f014a2a44fc5be5bd92162d577b29");
app.init();