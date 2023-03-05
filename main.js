document.addEventListener("DOMContentLoaded", function () {
  var asknameInput = document.getElementById("askname-input");
  var greeting = document.getElementById("greet");
  var timeEl = document.getElementById("time");
  var dateEl = document.getElementById("date");

  asknameInput.addEventListener("change", function () {
    localStorage.setItem("name", asknameInput.value);
    var name = asknameInput.value;
    var timeof = getTimeOfDay();
    greeting.textContent = `Good ${timeof}, ${name}!`;
  });

  function getTimeOfDay() {
    var clock = new Date();
    var hours = clock.getHours();
    if (hours < 12) {
      return "morning";
    } else if (hours < 18) {
      return "afternoon";
    } else {
      return "evening";
    }
  }

  function updateTime() {
    var clock = new Date();
    var hours = clock.getHours();
    var minutes = clock.getMinutes();
    var timeof = getTimeOfDay();

    var name = localStorage.getItem("name");

    if (name) {
      greeting.textContent = "Good " + timeof + ", " + name + "!";
    } else {
      greeting.textContent = "Good " + timeof + "!";
      asknameInput.style.top = "3.5%";
    }

    hours = hours % 12 || 12;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    var options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    var date = new Intl.DateTimeFormat("en-US", options).format(clock);

    var TimeString = hours + ":" + minutes;
    var DateString = date;
    if (timeEl.textContent !== TimeString) timeEl.textContent = TimeString;
    if (dateEl.textContent !== DateString) dateEl.textContent = DateString;
  }

  updateTime();
  setInterval(updateTime, 1000);
});

function changeBackground() {
  var images = [
    "local-images/1.jpg",
    "local-images/2.jpg",
    "local-images/3.jpg",
    "local-images/4.jpg",
    "local-images/5.jpg",
    "local-images/6.jpg",
    "local-images/7.jpg",
    "local-images/8.jpg",
    "local-images/9.jpg",
    "local-images/10.jpg",
  ];
  var randomIndex = Math.floor(Math.random() * images.length);
  var randomImage = images[randomIndex];
  document.body.style.background =
    "url('" + randomImage + "') no-repeat center";
}

document.addEventListener("DOMContentLoaded", function () {
  changeBackground();
});

setInterval(changeBackground, 3600000);

function quoteGen() {
  const quote = document.getElementById("mainquote");
  const author = document.getElementById("mainauthor");

  const cachedQuote = localStorage.getItem("quote");
  if (cachedQuote) {
    const cachedData = JSON.parse(cachedQuote);
    const cachedTimestamp = new Date(cachedData.timestamp);
    const now = new Date();
    const diff = (now - cachedTimestamp) / (1000 * 60 * 60);
    if (diff < 1) {
      quote.innerHTML = `“${cachedData.content}”`;
      author.innerHTML = `- ${cachedData.author}`;
      return;
    }
  }

  fetch("http://api.quotable.io/random?maxLength=50")
    .then((res) => res.json())
    .then((data) => {
      quote.innerHTML = `“${data.content}”`;
      author.innerHTML = `- ${data.author}`;
      data.timestamp = new Date().toISOString();
      localStorage.setItem("quote", JSON.stringify(data));
    })
    .catch((error) => {
      console.log(error);
    });
}

setInterval(() => {
  quoteGen();
}, 60 * 60 * 1000);

document.addEventListener("DOMContentLoaded", () => {
  quoteGen();
});

let weather = {
  apiKey: "API_KEY_HERE",
  defaultCity: "Delhi",
  defaultUnit: localStorage.getItem("unit") || "metric",
  fetchWeather: function (city, unit) {
    if (!city) {
      city = this.defaultCity;
    }
    if (!unit) {
      unit = this.defaultUnit;
    }
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=" +
        unit +
        "&appid=" +
        this.apiKey
    )
      .then((response) => response.json())
      .then((data) => {
        this.displayWeather(data, unit);
        localStorage.setItem("weatherData", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching weather data: ", error);
      });
  },

  displayWeather: function (data, unit) {
    const { name } = data;
    const { description } = data.weather[0];
    const { temp } = data.main;
    const roundedTemp = Math.floor(temp);
    const cityName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    document.getElementById("city").innerText = cityName;
    document.getElementById("description").innerText = description;
    if (unit === "metric") {
      document.getElementById("temp").innerText = roundedTemp + "°C";
    } else {
      document.getElementById("temp").innerText = roundedTemp + "°F";
    }
  },

  setUnit: function (unit) {
    if (unit === "metric") {
      this.defaultUnit = "metric";
      document.getElementById("celcius").classList.add("active");
      document.getElementById("fahrenhiet").classList.remove("active");
    } else if (unit === "imperial") {
      this.defaultUnit = "imperial";
      document.getElementById("fahrenhiet").classList.add("active");
      document.getElementById("celcius").classList.remove("active");
    }
    const savedCity = localStorage.getItem("city");
    this.fetchWeather(savedCity, this.defaultUnit);

    localStorage.setItem("unit", this.defaultUnit);
    this.fetchWeather(savedCity, this.defaultUnit);
  },
};

document.addEventListener("DOMContentLoaded", function () {
  const city = document.getElementById("city");
  const searchBox = document.getElementById("searchbox-input");
  const searchInput = document.getElementById("searchbox-input");
  const tempClick = document.getElementById("temp");
  const unitsButton = document.getElementById("unitclick");
  const celciusBtn = document.getElementById("celcius");
  const fahrenhietBtn = document.getElementById("fahrenhiet");
  const nameInput = document.getElementById("askname-input");
  var greeting = document.getElementById("greet");

  const cachedData = localStorage.getItem("weatherData");
  if (cachedData) {
    const data = JSON.parse(cachedData);
    weather.displayWeather(data, weather.defaultUnit);
  } else {
    const savedCity = localStorage.getItem("city");
    if (savedCity) {
      weather.fetchWeather(savedCity, weather.defaultUnit);
    } else {
      weather.fetchWeather(weather.defaultCity, weather.defaultUnit);
    }
  }

  setTimeout(function () {
    const savedCity = localStorage.getItem("city");
    weather.fetchWeather(savedCity, weather.defaultUnit);

    setInterval(function () {
      const savedCity = localStorage.getItem("city");
      weather.fetchWeather(savedCity, weather.defaultUnit);
    }, 30 * 60 * 1000);
  }, 5000);

  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      const city = searchInput.value;
      weather.fetchWeather(city, weather.defaultUnit);
      localStorage.setItem("city", city);
      document.getElementById("city").innerText = city;
      searchBox.style.top = "-10%";
    }
  });

  city.addEventListener("click", function () {
    if (searchBox.style.top === "3.5%") {
      searchBox.style.top = "-10%";
    } else {
      searchBox.style.top = "3.5%";
    }
  });

  nameInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      nameInput.style.top = "-10%";
    }
  });

  greeting.addEventListener("click", function () {
    if (nameInput.style.top === "3.5%") {
      nameInput.style.top = "-10%";
    } else {
      nameInput.style.top = "3.5%";
    }
  });

  tempClick.addEventListener("click", function () {
    if (unitsButton.style.top === "3.5%") {
      unitsButton.style.top = "-10%";
    } else {
      unitsButton.style.top = "3.5%";
    }
  });

  celciusBtn.addEventListener("click", function () {
    weather.setUnit("metric");
    unitclick.style.top = "-10%";
  });

  fahrenhietBtn.addEventListener("click", function () {
    weather.setUnit("imperial");
    unitclick.style.top = "-10%";
  });
});
