const timeEl = document.getElementById("time");
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const descriptionEl = document.getElementById('description');
const currentImageEl = document.getElementById('currentImage');
const placeNameEl = document.getElementById('placeName');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const cityName = document.getElementById("nameInput");
const button = document.getElementById("search-icon");

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const apikey = "a69a1a73a628b68ed80301c0e5e45aa1";
const url = "https://api.openweathermap.org/data/2.5/forecast?cnt=6&units=metric&q=";

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];

}, 1);

function showWeatherData(data) {
    document.querySelector(".currentImage").style.display = "block";
    currentImageEl.src = `http://openweathermap.org/img/wn//${data.list[0].weather[0].icon}@4x.png`;
    placeNameEl.textContent = data.city.name;
    descriptionEl.textContent = data.list[0].weather[0].description;
    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
        <div>Humidity</div>
        <div>${data.list[0].main.humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${data.list[0].main.pressure}</div>
    </div> 
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${data.list[0].wind.speed}km/h</div>
    </div>
   <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment((data.city.sunrise)* 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment((data.city.sunset)* 1000).format('HH:mm a')}</div>
    </div>
    `;

    let otherDayForecast = [];
    data.list.forEach((day, index) => {
        if (index === 0) {
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">( ${new Date(day.dt_txt).getDate()}-${new Date(day.dt_txt).getMonth()}-${new Date(day.dt_txt).getFullYear()} )</div>
                <div class="description" id="description">${day.weather[0].description}</div>
                <div class="temp">Max: - ${day.main.temp_max}&#176;C</div>
                <div class="temp">Min: - ${day.main.temp_min}&#176;C</div>
            </div>   
            `;
        } else if (index > 0 && index < 6) {
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">( ${new Date(day.dt_txt).getDate()+(index++)}-${new Date(day.dt_txt).getMonth()}-${new Date(day.dt_txt).getFullYear()} )</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                 <div class="description" id="description">${day.weather[0].description}</div>
                <div class="temp">Max: - ${day.main.temp_max}&#176;C</div>
                <div class="temp">Min: - ${day.main.temp_min}&#176;C</div>
            </div>
            `;
        }
    });
    weatherForecastEl.innerHTML = otherDayForecast;
}

button.addEventListener("click", () => {
    fetch(url + cityName.value + `&appid=${apikey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            showWeatherData(data);
        });
});