const apiKey = "661f014a2a44fc5be5bd92162d577b29";

const weatherContainer = document.getElementById("weather-container");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

async function getWeather(city) {

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    showLoading();
    searchBtn.disabled = true;

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        displayWeather(data);

    } catch (error) {
        showError("City not found. Please try again.");
    }

    searchBtn.disabled = false;
}

function displayWeather(data) {
    weatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    `;
}

function showError(message) {
    weatherContainer.innerHTML = `
        <div class="error">
            <p>${message}</p>
        </div>
    `;
}

function showLoading() {
    weatherContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
}

// Button Click
searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();
    getWeather(city);
    cityInput.value = "";
});

// Enter Key Support
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

// Initial Load
getWeather("London");