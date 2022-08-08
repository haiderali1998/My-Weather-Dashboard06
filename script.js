let weatherSearchBtn = $('#userSubmit');
let forecastHeader = $('#forecastHeader');
let userInput = $('#userInput');
let currentWeather = $('#currentWeather');
let fiveDayContainer = $('#forecastContainer');
let myKey = '5fcfffd05f1c1fc99dc1b5389fb22257';

$(function() {
  backgroundImage();
  let retrievedArray = JSON.parse(localStorage.getItem('cities'));
  if (retrievedArray !== null) {
    saveArray = retrievedArray;
    let lastcity = saveArray[saveArray.length -1];
    getData(lastcity);
    saveArray.map((city => displaySearchHistory(city)));
  }
    return false;
});


const getData = (usercity) => {
    currentWeather.empty();
  forecastHeader.empty();
  fiveDayContainer.empty();
  getCurrentForecast(usercity);
  FiveDayForecast(usercity);
}


const getCurrentForecast = (usercity) => {
  const queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${usercity}&units=metric&appid=${myKey}`;
  $.ajax({
    url: queryUrl,
  })
  .then(handleWeatherData)
  .catch();
};


const handleWeatherData = (data) => {
  let icon = data.weather[0].icon;
  let date = data.dt;
  let formattedDate = new Date(date * 1000).toLocaleDateString();
  let iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
  $("#currentWeather")
  .append(`<h2>${data.name}</h2>`)
  .append(`<h2>(${formattedDate})</h2>`)
  .append(`<img src=${iconUrl}>`)
  .append(`<p>Temperature: ${data.main.temp}&#176;C</p>`)
  .append(`<p>Humidity: ${data.main.humidity}%</p>`)
  .append(`<p>Windspeed: ${data.wind.speed}MPH</p>`);
  getUvIndex(data.coord.lat, data.coord.lon);
};


const getUvIndex = (lat, lon) => {
  let queryUVUrl =
  `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${myKey}`;    
  $.ajax({
    url: queryUVUrl,
  })
  .then(function (uv) {
    let uvIndex = uv.value;
    $('#currentWeather').append(
      `<p>UV Index:<span>${uvIndex}</span></p>`);
      if (uvIndex <= 2) {
        $('#currentWeather')
        .find('span')
        .addClass('bg-success text-white');
      } else if (uvIndex > 2 && uvIndex < 7) {
        $('#currentWeather')
        .find('span')
        .addClass('bg-warning text-dark');
      } else {
        $("#currentWeather")
        .find('span')
        .addClass('bg-danger text-white');
      }
    })
    .catch();
  };
  
 
  const FiveDayForecast = (usercity) => {
    const query5DayUrl =
    `https://api.openweathermap.org/data/2.5/forecast?q=${usercity}&units=metric&appid=${myKey}`;
    $.ajax({
      url: query5DayUrl,
    })
    .then(handle5DayWeatherData)
    .catch();
  };
  
  
  const handle5DayWeatherData = (data) => {
    $('#forecastHeader').append('<h4>5-Day Forecast:</h4>');
    data.list.forEach((forecast) => {
      let icon = forecast.weather[0].icon;
      let iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
      let date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (forecast.dt_txt.split(" ")[1] == "09:00:00") {
        $('#forecastContainer').append(
          `<div class="card bg-primary text-white"><div class="card-body">
          <p>${date}</p>
          <img src=${iconUrl}>
          <p>Temp: ${forecast.main.temp}&#176;C</p>
          <p>Humidity: ${forecast.main.humidity}%</p>
          </div></div>`
          );
        }
      });
    };
    
    
    $(weatherSearchBtn).on('click', (event) => {
      event.preventDefault();
      const usercity = userInput.val();
      getData(usercity); 
      displaySearchHistory(usercity);
      saveToStorage(usercity); 
    });
    
    let saveArray = [];

    
    const saveToStorage = (usercity) => {
      saveArray.push(usercity);
      localStorage.setItem('cities', JSON.stringify(saveArray));
    };

   
    const displaySearchHistory = (usercity) => {
      $('#searchHistoryArea').append(
        `<button class='btn btn-light btn-block' id='${usercity}'>${usercity}</button>`
        );
      };

      
      $('#searchHistoryArea').on('click', (event) => {
        event.preventDefault();
        let btn = event.target.id;
        getData(btn);
      });

     
      
        