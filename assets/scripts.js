const app = {
    init: () => {
      document
        .getElementById('btnGet')
        .addEventListener('click', app.fetchWeather);
      document
        .getElementById('btnCurrent')
        .addEventListener('click', app.getLocation);
    },
    fetchWeather: () => {
      //use the values from latitude and longitude to fetch the weather
      let time = document.getElementById('timeZone')
      let lat = document.getElementById('latitude').value;
      let lon = document.getElementById('longitude').value;
      let key = 'dbb76c5d98d5dbafcb94441c6a10236e';
      let lang = 'en';
      let units = 'Imperial';
      let url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}&time=${time}`;
      //fetch the weather
      fetch(url)
        .then((resp) => {
          if (!resp.ok) throw new Error(resp.statusText);
          return resp.json();
        })
        .then((data) => {
          app.showWeather(data);
        })
        .catch(console.err);
    },
    getLocation: () => {
      let opts = {
        enableHighAccuracy: true,
        timeout: 1000 * 10, //10 seconds
        maximumAge: 1000 * 60 * 5, //5 minutes
      };
      navigator.geolocation.getCurrentPosition(app.ftw, app.wtf, opts);
    },
    ftw: (position) => {
      //got position
     // document.getElementById('timeZone').value =
      //location.timeZone.tofixed(2)
      document.getElementById('latitude').value =
        position.coords.latitude.toFixed(2);
      document.getElementById('longitude').value =
        position.coords.longitude.toFixed(2);
    },
    wtf: (err) => {
      //geolocation failed
      console.error(err);
    },
    showWeather: (resp) => {
      console.log(resp);
      let row = document.querySelector('.weather.row');
      
      row.innerHTML = resp.daily
        .map((day, idx) => {
            // we * by 1000 so we can get the JS day time the 1000k converts it into js
          if (idx <= 4) {
            let dt = new Date(day.dt * 1000); 
            let sr = new Date(day.sunrise * 1000).toTimeString();
            let ss = new Date(day.sunset * 1000).toTimeString();
            //this is where i want all my return values to be 
            //this is also where is set it to show F and % 
            return `<div class="col">
                <div class="card">
                <h5 class="card-title p-2">${dt.toDateString()}</h5>
                  <img
                    src="http://openweathermap.org/img/wn/${
                      day.weather[0].icon
                    }@4x.png"
                    class="cardImgTop"
                    alt="${day.weather[0].description}"
                  />
                  <div class="card-body">
                    <h3 class="card-title">${day.weather[0].main}</h3>
                    <p class="card-text">High ${day.temp.max}&deg;F Low ${
              day.temp.min
            }&deg;F</p>
                    <p class="card-text">High Feels like ${
                      day.feels_like.day
                    }&deg;F</p>
                    <p class="card-text">Pressure ${day.pressure}mb</p>
                    <p class="card-text">Humidity ${day.humidity}%</p>
                    <p class="card-text">UV Index ${day.uvi}</p>
                    <p class="card-text">Precipitation ${day.pop * 100}%</p>
                    <p class="card-text">Dewpoint ${day.dew_point}</p>
                    <p class="card-text">Wind ${day.wind_speed}m/s, ${
              day.wind_deg
            }&deg;</p>
                    <p class="card-text">Sunrise ${sr}</p>
                    <p class="card-text">Sunset ${ss}</p>
                  </div>
                </div>
              </div>
            </div>`;
          }
        })
        .join(' ');
    },
  };

  
  app.init();
