function success (position){
  localPosition= position;
  var openWeatherMapKey = "a60629539983348caea27e7bf224f54f";
  //set the openWeather json petition url
  function weatherURL(position){
    if(position[1]==undefined){
      var getWeather = "http://api.openweathermap.org/data/2.5/weather?units=imperial&lat="
        + position.coords.latitude + "&lon=" + position.coords.longitude 
        + "&APPID=" + openWeatherMapKey;
      return getWeather;
    } else {
      var getWeather = "http://api.openweathermap.org/data/2.5/weather?units=imperial&lat="
        + position[0] + "&lon=" + position[1] 
        + "&APPID=" + openWeatherMapKey;
      return getWeather;
    }    
  }    

  //set the openWeather json petition url for uv index
   function uvURL(position){
    if(position[1]==undefined){
      var getUV =  "http://api.owm.io/air/1.0/uvi/current?lat="
        + position.coords.latitude + "&lon=" + position.coords.longitude 
        + "&APPID=" + openWeatherMapKey;
      return getUV;
    } else {
      var getUV =  "http://api.owm.io/air/1.0/uvi/current?lat="
        + position[0] + "&lon=" + position[1]
        + "&APPID=" + openWeatherMapKey;
      return getUV;
    }   
    
  }

//creates the google map specifications
  var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);  
  var options = {
    zoom: 14,
    center: coords,
    mapTypeControl: false,
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.SMALL
      },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  //creates the google map
  var map = new google.maps.Map(document.getElementById('map'), options);

  //creates the marker of the local position
  var marker = new google.maps.Marker({
      position: coords,
      map: map,
      title:"Your current location!"
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location        
      }));

      
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    var markerPosition=[markers[0].getPosition().lat(),
      markers[0].getPosition().lng()];
    infoWeather(markerPosition);
    map.setZoom(11);
  });
