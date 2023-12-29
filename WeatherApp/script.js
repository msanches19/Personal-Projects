



let weather = {
    fetchWeather: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
            + city
            + "&units=imperial&appid=" + weatherAppKey
        ).then((response) => response.json()
        ).then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const { name } = data;
        const { description, icon } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp) + "°F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + Math.round(speed) + " mph";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector(".searchbar").value);
        document.querySelector(".searchbar").value = null;
    }
};
document.querySelector(".inbtn")
    .addEventListener("click", function() {
        weather.search();
    });

document.querySelector(".searchbar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});



if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showCity);
} else {
    weather.fetchWeather("Portland");
}

function showCity(position) {
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    console.log(longitude, latitude);
    const url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
        + latitude + ","
        + longitude + "&key="
        + locationAppKey;

    fetch(url)
        .then((response) => response.json())
        .then((data) =>  {
            const city = data.results[0].address_components.find((component) =>
            component.types.includes("locality")
            ).long_name;
            weather.fetchWeather(city);
        })
}
