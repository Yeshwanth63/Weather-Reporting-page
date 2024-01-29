//assigning buttons to save the search Input
const searchBtn = document.querySelector('.searchBtn');
const cityInput = document.querySelector('.city');
const currentweather = document.querySelector('.currentWeather');
const API_key = 'b60a1d4ac03b1c2ca9880098a2f1202b'; //API key for OpenWeatherMap API

const createWeatherCard = (cityName, element, index) => {
    if (index === 0) {
        return `<div class="details">
        <h2>${cityName} (${element.dt_txt.split(' ')[0]})</h2>
        <h4>Temperature: ${(element.main.temp - 273.15).toFixed(2)} °C</h4>
        <h4>Wind: ${element.wind.speed} m/s</h4>
        <h4>Humidity: ${element.main.humidity} %</h4>
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${element.weather[0].icon}.png" alt="img">
        <h4>${element.weather[0].description}</h4>
    </div>
    `;
    }
};

const getWeatherDetails = (cityName, lat, lon) => {
    const Weather_API_URL = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_key}`;

    fetch(Weather_API_URL)
        .then(res => res.json())
        .then(data => {
            const seperateForecastDays = [];
            const Final = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getFullYear();
                if (!seperateForecastDays.includes(forecastDate)) {
                    return seperateForecastDays.push(forecastDate);
                }
            });
            currentweather.innerHTML = '';
            Final.forEach((element, index) => {
                if (index === 0) {
                    currentweather.insertAdjacentHTML('beforeend', createWeatherCard(cityName, element, index));
                }
            });
        })
        .catch((err) => alert('Your city was not found'));
};

const getCity = () => {
    const cityName = cityInput.value.trim(); //gets users city name and removes extra spaces
    if (!cityName) return;
    const getCityCoordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;
    fetch(getCityCoordinates)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return (`No Coordinates Found for ${cityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert('An error occurred while fetching your Location');
        });
};

searchBtn.addEventListener('click', getCity);
