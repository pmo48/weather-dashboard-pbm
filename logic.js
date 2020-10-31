
  // This is our API key. Add your own API key between the ""
  var APIKey = "";

  // Here we are building the URL we need to query the database
  var cities = []
  var city = $(this).attr("data-name");
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

 // This function handles event when a new city is searched
 $("#searchButton").on("click", function(event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var citySearch = $("#citySearchtext").val().trim();

    // Adding city from the textbox to the "city" array
    cities.push(citySearch);
    console.log(citySearch);
    console.log(cities);
    // Calling updateCityWeather which handles the processing of our movie array
    updateCityweather();
  });


  // Create CODE HERE to transfer content to HTML
  function updateCityweather() {
  // We then created an AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

    //console log to confirm API request is good
    console.log(response);

    // Create CODE HERE to calculate the temperature (converted from Kelvin) and other variables
    var tempFar = (((response.main.temp)-273.15)*(9/5)+32);
    var cityName = (response.name);
    var humidity = (response.main.humidity);
    var windSpeed = (response.wind.speed);
    // var uvIndex = (response.)
    $(".display-4").text(cityName);
    $(".lead").text("Temperature: " + (Math.round(tempFar)) +" °F");
    var hum = $("<p>").text("Humidity: " + humidity + "%" );
    $(".lead").append(hum); 
    var wind = $("<p>").text("Wind Speed: " + windSpeed + " MPH" );
    $(".lead").append(wind);
    })
    //update list of cities
    renderCitylist();

  }

  // Function for displaying movie data
  function renderCitylist() {

    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#cityList").empty();

    // Looping through the array of movies
    for (var i = 0; i < cities.length; i++) {

      // Then dynamicaly generating buttons for each movie in the array
      // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
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