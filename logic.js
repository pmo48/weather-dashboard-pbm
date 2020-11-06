$(document).ready(function() {
// This is our API key. Add your own API key between the ""
var APIKey = "19b299f54f209a60926d8dfbec925f38";

// Here we are building the URL we need to query the database
var cities = []
var lat = ""
var lon = ""

// Renders city list upon load
setPage()

function updateCityweather(cityName) {

  //empties lead class div 
  $(".lead").empty();
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
  // We then created an AJAX call
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    //console log to confirm API request is good
    console.log(response);

    // Create CODE HERE to calculate the temperature (converted from Kelvin) and other variables
    var tempFar = (((response.main.temp) - 273.15) * (9 / 5) + 32);
    var cityName = (response.name);
    var humidity = (response.main.humidity);
    var windSpeed = (response.wind.speed);
    var iconcode = (response.weather[0].icon);
    var lat = (response.coord.lat);
    var lon = (response.coord.lon);

    $(".display-4").text(cityName);
    var temp = $("<p>").text("Temperature: " + (Math.round(tempFar)) + " °F");
    $(".lead").append(temp);
    var hum = $("<p>").text("Humidity: " + humidity + "%");
    $(".lead").append(hum);
    var wind = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
    $(".lead").append(wind);
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    $("#wicon").attr('src', iconurl);

    //return latitude and longitute for different call
    var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    $.ajax({
      url: queryURL2,
      method: "GET"
    }).then(function (response2) {

      // console.log(lat);
      console.log(response2);
      console.log(lon);
      console.log(lat);

      var uvIndex = (response2.value)
      console.log(uvIndex);
    
      var UV = $("<span>").attr("class", "badge badge-warning").text("UV: " + uvIndex);
      $(".lead").append(UV);

      if (uvIndex < 2.9) {
        $(".badge").addClass("badge-success");
        $(".badge").removeClass("badge-warning");
      } else if (uvIndex > 6) {
        $(".badge").addClass("badge-danger");
        $(".badge").removeClass("badge-warning");
      } else {
        return;
      }

      //uv levels, green 1-2, yellow 3-5, orange 6-7, red 8+
    
    });
  });

  console.log(lon);
  
  //update list of cities
  renderCitylist();

  //second API for 5 day forecast
  var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
  $.ajax({
    url: queryURL3,
    method: "GET"
  }).then(function (response3) {

    //console log to confirm API request is good
    console.log(response3);

    var dateD1;
    var tempFard1;
    var humidityD1;
    var iconcode;

    var cardMarkUp = "";

    for (let i = 0; i < response3.list.length; i++) {
      //filter out forcasts for a specific time
      if (response3.list[i].dt_txt.indexOf("12:00:00") > -1) {
        //creating variables for each day

        dateD1 = (response3.list[i].dt_txt);
        tempFard1 = Math.round(((response3.list[i].main.temp) - 273.15) * (9 / 5) + 32);
        humidityD1 = (response3.list[i].main.humidity)
        iconcode = (response3.list[i].weather[0].icon);

        //confirming variables are working

        console.log(tempFard1);
        console.log(dateD1);
        console.log(humidityD1);

        //add variables to card
        cardMarkUp += 
        `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${dateD1}</h5>
              <div id="icon"><img id="wicon1" src="http://openweathermap.org/img/w/${iconcode}.png" alt="Weather icon"></div>
              <p class="card-text">Temp: ${tempFard1} °F<p>Humidity: ${humidityD1}%</p></p>
            </div>
          </div>
        `;
      }
    }
    $(".card-group").html(cardMarkUp);

  })

};
// This function handles event when a new city is searched
$("#searchButton").on("click", function (event) {
  event.preventDefault();
  // This line grabs the input from the textbox
  var citySearch = $("#citySearchtext").val().trim();

  // Adding city from the textbox to the "city" array
  cities.push(citySearch);
  console.log(citySearch);
  console.log(cities);
  // Calling updateCityWeather which handles the processing of our city API
  updateCityweather(citySearch);

  // This function stores cities in local storage
  localStorage.setItem("storedCities", JSON.stringify(cities));
});

$("#cityList").on("click",".list-group-item",function(event) {
  var cityInput = $(event.target).attr("data-name");
  updateCityweather(cityInput);
});

// Function for displaying movie data
function renderCitylist() {

  // Deleting the cities prior to adding updated cities
  // (this is necessary otherwise you will have repeat buttons)
  $("#cityList").empty();

  // Looping through the array of cities
  for (var i = 0; i < cities.length; i++) {

    // Then dynamicaly generating list item for each city in the array

    var a = $("<a>");
    // Adding a class of movie-btn to our button
    a.addClass("list-group-item list-group-item-action");
    // Adding a data-attribute
    a.attr("data-name", cities[i]);
    // Providing the initial button text
    a.text(cities[i]);
    // Adding the button to the buttons-view div
    $("#cityList").append(a);
  }
}

function setPage() {
 var storedCities = JSON.parse(localStorage.getItem("storedCities"));

  if (storedCities !== null) {
    cities = storedCities;
    var lastCity = cities[cities.length - 1]
    updateCityweather(lastCity);
    $(".card-group").empty();
    renderCitylist();
    console.log(cities);
  } else {
    localStorage.setItem("storedCities", "[]");
  }
   
}

$("#clearButton").on("click", function () {
  cities = [];
  localStorage.setItem("storedCities", JSON.stringify(cities));
  renderCitylist();
});
}); 