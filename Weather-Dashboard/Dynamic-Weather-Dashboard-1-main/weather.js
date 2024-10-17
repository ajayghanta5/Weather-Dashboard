const apiKey = '251fc550ca3e578c4f76743d762ece4f'; 
const apiUrlBase = 'https://api.openweathermap.org/data/2.5';
const units = 'metric'; // Use 'metric' for Celsius

// Function to fetch current weather data from API
async function getCurrentWeather(city) {
    const apiUrl = `${apiUrlBase}/weather?q=${city}&units=${units}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Current weather:', data); // Log the response data to see what is returned

        // Update DOM with current weather data
        document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('current-weather').textContent = data.weather[0].main;
        document.getElementById('current-temp').textContent = data.main.temp;
        document.getElementById('current-humidity').textContent = data.main.humidity;
        document.getElementById('current-wind-speed').textContent = data.wind.speed;
    } catch (error) {
        console.error('Error fetching current weather data:', error);
        // Clear previous weather data if any error occurs
        clearCurrentWeather();
    }
}

// Function to fetch 5-day forecast data from API
async function getWeatherForecast(city) {
    const apiUrl = `${apiUrlBase}/forecast?q=${city}&units=${units}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Forecast data:', data); // Log the response data to see what is returned

        // Clear previous forecast cards
        const forecastCards = document.getElementById('forecast-cards');
        forecastCards.innerHTML = '';

        // Calculate today's day of the week index (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        const today = new Date().getDay();

        // Map to get the next 5 days in order
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const next5Days = [];
        for (let i = 1; i <= 5; i++) {
            const dayIndex = (today + i) % 7; // Calculate the index, wrapping around using modulo
            next5Days.push(daysOfWeek[dayIndex]);
        }

        // Create forecast cards for each day (assuming data.list has 40 entries for 5 days with 3-hour intervals)
        const forecastDays = data.list.filter(item => {
            // Filter to get data for each day at 12:00 PM (assuming data is available)
            return item.dt_txt.includes('12:00:00');
        }).slice(0, 5); // Get the first 5 items
+
        forecastDays.forEach((dayData, index) => {
            const card = document.createElement('div');
            card.classList.add('forecast-card');

            // Populate forecast card content
            const icon = dayData.weather[0].icon;
            const temp = dayData.main.temp;

            card.innerHTML = `
                <h3>${next5Days[index]}</h3>
                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${dayData.weather[0].description}">
                <p>Temp: ${temp}&deg;C</p>
            `;

            forecastCards.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching weather forecast data:', error);
        // Clear previous forecast cards if any error occurs
        clearForecast();
    }
}

// Function to clear current weather data from DOM
function clearCurrentWeather() {
    document.getElementById('location').textContent = '';
    document.getElementById('current-weather').textContent = '';
    document.getElementById('current-temp').textContent = '';
    document.getElementById('current-humidity').textContent = '';
    document.getElementById('current-wind-speed').textContent = '';
}

// Function to clear forecast cards from DOM
function clearForecast() {
    const forecastCards = document.getElementById('forecast-cards');
    forecastCards.innerHTML = '';
}

// Function to handle search button click
function searchWeather() {
    const cityInput = document.getElementById('city-input').value.trim();
    if (cityInput) {
        getCurrentWeather(cityInput);
        getWeatherForecast(cityInput);
    } else {
        alert('Please enter a city name');
    }
}
