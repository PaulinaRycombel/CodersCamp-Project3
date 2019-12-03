const API_KEY = '20bc4cd6dbdd378a769241120cee571e';
const BASE_API_URL = 'https://api.openweathermap.org/data/2.5/';
const API_KEY_2 = 'f41229dda90e4e7eba284b086ae008e9';
const BASE_API_URL_2 = 'https://api.weatherbit.io/v2.0/forecast/daily';

//initializing DOM variables
const navItemsUI = document.getElementsByTagName("li");
const headerUI = document.getElementById("hero");
const cityUI = document.getElementsByClassName('city')[0];
const iconUI = document.getElementsByTagName("img")[0];
const dateUI = document.getElementsByClassName("date")[0];
const weatherIconUI = document.getElementById("today-icon");
const temperatureUI = document.getElementById('temperature');
const pressureUI = document.getElementById('pressure');
const humidityUI = document.getElementById('humidity');
const tempMinUI = document.getElementById('temp-min');
const tempMaxUI = document.getElementById('temp-max');
const cloudsUI = document.getElementById('clouds');


const config = {
  London: {
    text: 'London, the United Kingdom',
    iconUrl: './img/flagUK.png',
    backgroundUrl: 'url(./img/headerimg.jpg)',
    apiCityId: 6058560
  },
  Paris: {
    text: 'Paris, France',
    iconUrl: './img/flagFrance.png',
    backgroundUrl: 'url(./img/paris-header.jpg)',
    apiCityId: 2988507
  },
  Barcelona: {
    text: 'Barcelona, Spain',
    iconUrl: './img/flagSpain.png',
    backgroundUrl: 'url(./img/barcelona-header.jpg)',
    apiCityId: 3128760
  },
  Madrid: {
    text: 'Madrid, Spain',
    iconUrl: './img/flagSpain.png',
    backgroundUrl: 'url(./img/madrid-header.jpg)',
    apiCityId: 3120501
  }
}


function onNavItemClicked(event) {
  const selectedItem = event.srcElement.innerText;
  for (var i = 0; i < navItemsUI.length; i++) {
    navItemsUI[i].children[0].classList.remove('active');
  }
  event.target.classList.add('active');
  setStaticData(selectedItem);
  setWeather(selectedItem);
  setForecast(selectedItem);
}

function setStaticData(city) {
  const cityConfig = config[city];
  cityUI.innerText = cityConfig.text;
  iconUI.src = cityConfig.iconUrl;
  headerUI.style.backgroundImage = cityConfig.backgroundUrl;
  dateUI.innerText = 'Today, ' + getTodaysDay();
}

async function setWeather(city) {
  cityId = config[city].apiCityId;
  const data = await getWeather(cityId);
  pressureUI.innerText = `${data.main.pressure} hPa`;
  temperatureUI.innerText = `${data.main.temp} °C`;
  humidityUI.innerText = `${data.main.humidity} %`;
  tempMinUI.innerText = `${data.main.temp_min} °C`;
  tempMaxUI.innerText = `${data.main.temp_max} °C`;
  cloudsUI.innerText = `${data.clouds.all} %`;
  weatherIconUI.src = getWeatherIconUrl(data.clouds.all, data.weather[0].main);
}

async function getWeather(cityId) {
  let response = await fetch(`${BASE_API_URL}weather?id=${cityId}&appid=${API_KEY}&units=metric`);
  let data = await response.json();
  return data;
}


//FORECAST DAYS
const forecastDaysUI = document.getElementById('forecast-days').children;

async function setForecast(city) {
  const data = await getForecast(city);
 
  for (let i = 0; i < forecastDaysUI.length; i++) {
    date = forecastDaysUI[i].children[0];
    icon = forecastDaysUI[i].children[1];
    temp = forecastDaysUI[i].children[2];
    const forecastDay = data.data[i];
    forecastDaysUI[i].children[0].innerText = `${forecastDay.datetime}`;
    forecastDaysUI[i].children[1].src = getForecastIconUrl(forecastDay.clouds, forecastDay.pop, forecastDay.snow);
    forecastDaysUI[i].children[2].innerText = `${data.data[i].temp} °C`;
    forecastDaysUI[i].children[0].style.fontSize = "15px";
    forecastDaysUI[i].children[2].style.fontSize = "25px";
  }
}

async function getForecast(city) {
  let response = await fetch(`${BASE_API_URL_2}?city=${city}&key=${API_KEY_2}`);
  let data = await response.json();
  return data;
}


//CUSTOMIZING ICONS TO WEATHER CONDITIONS
const weatherIconsUrls = {
  sunWithClouds: './animated/cloudy-day-3.svg',
  sun: './animated/day.svg',
  clouds: './animated/cloudy.svg',
  rain: './animated/rainy-6.svg',
  snow: './animated/snowy-6.svg'
}

function getWeatherIconUrl(cloudiness, weatherDescription) {
  if (weatherDescription === "Rain") {
    return weatherIconsUrls.rain;
  } else if (weatherDescription === "Clear") {
    return weatherIconsUrls.sun;
  } else if (weatherDescription === "Snow") {
    return weatherIconsUrls.snow;
  } else if (cloudiness <= 20) {
    return weatherIconsUrls.sun;
  } else if (cloudiness >= 80) {
    return weatherIconsUrls.clouds;
  } else {
    return weatherIconsUrls.sunWithClouds;
  }
}

function getForecastIconUrl(cloudiness, precipitation, snow ) {
  if ( snow >= 5) {
    return weatherIconsUrls.snow;
  } else if ( precipitation > 30 ) {
    return weatherIconsUrls.rain;
  } else if (cloudiness <= 20) {
    return weatherIconsUrls.sun;
  } else if (cloudiness >= 80) {
    return weatherIconsUrls.clouds;
  } else {
    return weatherIconsUrls.sunWithClouds;
  }
}

function getTodaysDay() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
  return `${dd} ${monthNames[today.getMonth()]} ${yyyy}`;
}


//MAIN FUNCTION//
function main() {
  setStaticData("London");
  setWeather("London");
  setForecast("London");

  for (let i = 0; i < navItemsUI.length; i++) {
    navItemsUI[i].addEventListener('click', onNavItemClicked)
  }
}

main();
