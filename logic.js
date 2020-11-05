
// This is our API key. Add your own API key between the ""
var APIKey = "19b299f54f209a60926d8dfbec925f38";

// Here we are building the URL we need to query the database
var cities = []

// This code was an attempt to get the list to call the API
// $("#listClick").on("click", function(event) {
//   var citySearch = $(this).attr("data-name");
//   event.preventDefault();
//   console.log(this);
//   }); 
function updateCityweather(cityName) {

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

    // var uvIndex = (response.)
    $(".display-4").text(cityName);
    $(".lead").text("Temperature: " + (Math.round(tempFar)) + " °F");
    var hum = $("<p>").text("Humidity: " + humidity + "%");
    $(".lead").append(hum);
    var wind = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
    $(".lead").append(wind);

    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    $("#wicon").attr('src', iconurl);
  })


  //update list of cities
  renderCitylist();

  //second API for 5 day forecast
  var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
  $.ajax({
    url: queryURL2,
    method: "GET"
  }).then(function (response) {

    //console log to confirm API request is good
    console.log(response);

    var dateD1;
    var tempFard1;
    var humidityD1;
    var iconcode;

    var cardMarkUp = "";

    for (let i = 0; i < response.list.length; i++) {
      //filter out forcasts for a specific time
      if (response.list[i].dt_txt.indexOf("12:00:00") > -1) {
        //creating variables for each day

        dateD1 = (response.list[i].dt_txt);
        tempFard1 = Math.round(((response.list[i].main.temp) - 273.15) * (9 / 5) + 32);
        humidityD1 = (response.list[i].main.humidity)
        iconcode = (response.list[i].weather[0].icon);

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

        

        // $(".card-title").text(dateD1);
        // $(".card-text").text("Temp: " + (Math.round(tempFard1)) + " °F");
        // var humD1 = $("<p>").text("Humidity: " + humidityD1 + "%");
        // $(".card-text").append(humD1);
        // var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        // $("#wicon1").attr('src', iconurl);
      }
    }
    $(".card-group").html(cardMarkUp);



  })

  //pseudocode for using for loop

  //1.store variables using "i" in array of objects called "fiveDay"
  //2. create a for loop, < 5, incrementing by 1 (or 4 if different location)
  //3. add text similar to above except for variables I'd put ("$"'.card-title").text(fiveDay.list[i].dt_txt)



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
  console.log(cities);
}