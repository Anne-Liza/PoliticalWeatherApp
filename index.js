// Define constants
const weatherForm = document.getElementById('searchForm');
const cityName = document.getElementById('cityName');
const currentTemp = document.getElementById('currentTemp');
const currentDescription = document.getElementById('currentDescription');
const date = document.getElementById('currentDate');
const humidity = document.getElementById('currentHumidity');
const wind = document.getElementById('currentWind');
const forecastDisplay = document.getElementById('forecastDisplay');

const currentTempCelsius = (kelvin) => Math.round(kelvin - 273.15);
const currentTempFahrenheit = (celsius) => Math.round((celsius * 9/5) + 32);

// Search form function
function search(event) {
    event.preventDefault();

    const city = document.getElementById('search').value.trim();
    const apiKey = '4e193b28ab4a1d34433e80b37e1f075f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log('Current Weather Data:', data);

        if (!data || data.cod !== 200) {
            alert("City not found. Please try again.");
            cityName.innerHTML = '';
            currentTemp.innerHTML = '';
            currentDescription.innerHTML = '';
            date.innerHTML = '';
            humidity.innerHTML = '';
            wind.innerHTML = '';
            forecastDisplay.innerHTML = '';
        } else {
            // Extract data
            const city = data.name;
            const tempK = data.main.temp;
            const tempC = currentTempCelsius(tempK);
            const tempF = currentTempFahrenheit(tempC);
            const weather = data.weather[0].description;
            const icon = data.weather[0].icon;
            const humidityValue = data.main.humidity;
            const windSpeed = data.wind.speed;

            // Display current weather
            cityName.innerHTML = city;
            currentTemp.innerHTML = `<h3>${tempC}°C | ${tempF}°F</h3>`;
            currentDescription.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="${weather}"> ${weather}`;
            date.innerHTML = new Date().toLocaleString('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true });
            humidity.innerHTML = `Humidity: <strong>${humidityValue}%</strong>`;
            wind.innerHTML = `Wind: <strong>${windSpeed} km/h</strong>`;
        }

        // Clear current forecast data
        forecastDisplay.innerHTML = '';

        // Forecast URL
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&cnt=6`;

        // Fetch forecast data
        fetch(forecastUrl)
        .then(response => response.json())
        .then(forecastData => {
            console.log('Forecast Data:', forecastData);

            // Handle errors in fetching forecast data
            if (!forecastData || forecastData.cod !== '200') {
                alert("Forecast not available");
            } else {
                // Extract forecast data
                forecastData.list.forEach((day, index) => {
                    if (index < 5) {
                        const dayOfWeek = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                        const foreCelsius = currentTempCelsius(day.main.temp);
                        const foreFahrenheit = currentTempFahrenheit(foreCelsius);
                        const minCelsius = currentTempCelsius(day.main.temp_min);
                        const minFahrenheit = currentTempFahrenheit(minCelsius);
                        const icon = day.weather[0].icon;

                        // Display forecast
                        forecastDisplay.innerHTML += `
                        <div class="col">
                            <p class="foreDate">${dayOfWeek}</p>
                            <p class="foreIcon"><img src="http://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].description}"></p>
                            <p class="foreTemp">
                                <span class="forecast-max-temp"><strong>${foreCelsius}°C</strong></span>
                                <span class="forecast-min-temp">${minCelsius}°C</span>
                            </p>
                        </div>`;
                    }
                });
            }
        })
        
    })
    
}

// Add event listener to the form
weatherForm.addEventListener('submit', search);
