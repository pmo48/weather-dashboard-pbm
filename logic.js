$(document).ready(function() {
// Variable to store API key
var APIKey = "19b299f54f209a60926d8dfbec925f38";

// variable for cities searched and latitude/longitute
var cities = []
var lat = ""
var lon = ""

// Renders city list upon load
setPage()

// function to update today's weather and 5 day forecast upon click

function updateCityweather(cityName) {

  //empties lead class div 
  $(".lead").empty();

  // variable to store queryURL
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
  // call to get the API and return a response
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    // Variables stored from API response
    var tempFar = (((response.main.temp) - 273.15) * (9 / 5) + 32);
    var cityName = (response.name);
    var humidity = (response.main.humidity);
    var windSpeed = (response.wind.speed);
    var iconcode = (response.weather[0].icon);
    var lat = (response.coord.lat);
    var lon = (response.coord.lon);
    var date = moment(response.dt_txt).format("dddd, MMM D");

    // Adding variables to HTML elements and appending
    $(".display-2").text(cityName);
    $(".display-4").text(date)
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

      // stores UV index
      var uvIndex = (response2.value)

      // creates HTML and append it to class
    
      var UV = $("<span>").attr("class", "badge badge-warning").text("UV: " + uvIndex);
      $(".lead").append(UV);

      // conditionals to color UV index based on index size

      if (uvIndex < 2.9) {
        $(".badge").addClass("badge-success");
        $(".badge").removeClass("badge-warning");
      } else if (uvIndex > 6) {
        $(".badge").addClass("badge-danger");
        $(".badge").removeClass("badge-warning");
      } else {
        return;
      }    
    });
  });

  
  //update list of cities after searching
  renderCitylist();

  //second API for 5 day forecast
  var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
  $.ajax({
    url: queryURL3,
    method: "GET"
  }).then(function (response3) {

    var dateD1;
    var tempFard1;
    var humidityD1;
    var iconcode;

    var cardMarkUp = "";

    for (let i = 0; i < response3.list.length; i++) {
      //filter out forecasts for a specific time
      if (response3.list[i].dt_txt.indexOf("12:00:00") > -1) {
        
        //creating variables for each element of response used

        dateD1 = moment(response3.list[i].dt_txt).format("ddd, MMM D");
        tempFard1 = Math.round(((response3.list[i].main.temp) - 273.15) * (9 / 5) + 32);
        humidityD1 = (response3.list[i].main.humidity)
        iconcode = (response3.list[i].weather[0].icon);

        //add variables to card class
        cardMarkUp += 
        `
          <div class="card text-white bg-primary mb-3 mr-3" style="max-width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">${dateD1}</h5>
              <div id="icon"><img id="wicon1" src="http://openweathermap.org/img/w/${iconcode}.png" alt="Weather icon"></div>
              <p class="card-text">Temp: ${tempFard1} °F<p>Humidity: ${humidityD1}%</p></p>
            </div>
          </div>
        `;
      }
    }

    //displays 5 day forecast title and displays template literal to card-group
    $(".display-3").text("Five Day Forecast:")
    $(".card-group").html(cardMarkUp);

  })

};
// This function handles event when a new city is searched
$("#searchButton").on("click", function (event) {
  event.preventDefault();
  // This line grabs the input from the textbox
  var citySearch = $("#citySearchtext").val().trim();

  // Adding city from the textbox to the "cities" array
  cities.push(citySearch);
  // Calling updateCityWeather which handles the processing of our city API
  updateCityweather(citySearch);

  // This function stores cities in local storage
  localStorage.setItem("storedCities", JSON.stringify(cities));
});

  //eventlistener tied to any listed city
$("#cityList").on("click",".list-group-item",function(event) {
  var cityInput = $(event.target).attr("data-name");
  updateCityweather(cityInput);
});

// Function for displaying city list
function renderCitylist() {

  // Deleting the cities prior to adding updated cities
  $("#cityList").empty();

  // Looping through the array of cities
  for (var i = 0; i < cities.length; i++) {

    // Then dynamicaly generating list item for each city in the array

    var a = $("<a>");
    // Adding a class to city list items
    a.addClass("list-group-item list-group-item-action bg-light");
    // Adding a data-attribute
    a.attr("data-name", cities[i]);
    // Providing the initial list text
    a.text(cities[i]);
    // Adding the list item to the city div
    $("#cityList").append(a);
  }
}

//sets the page with upon load

function setPage() {
  //variable to store cities
 var storedCities = JSON.parse(localStorage.getItem("storedCities"));

// either puts stored cities in cities array and calls the last city to update the weather/forecasts, or initialises stored cities with an empty array if first time visiting page
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

// reset button to clear cities, clear local storage and re-render list
$("#resetButton").on("click", function () {
  cities = [];
  localStorage.setItem("storedCities", JSON.stringify(cities));
  renderCitylist();
});
}); 