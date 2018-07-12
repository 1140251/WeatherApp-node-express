const express = require('express')
const app = express()
const { port, host, apiKey } = require('./config/server.json')
const http = require('http')
const https = require('https')
const bodyParser = require('body-parser')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
let weather, error = false
let photo
app.get('/', function (req, res) {
    //res.send('Hello World!')
    res.render('index', { weather: weather, error: error, photo:photo })
})
app.locals.getIcon = function (code) {
    icons = {
        200: "005-storm-1", 201: "005-storm-1", 202: "005-storm-1", // Thunderstorm  with rain
        230: "012-storm", 231: "012-storm", 232: "012-storm", 233: "012-storm", // Thunderstorm 
        300: "010-raining", 301: "010-raining", 302: "010-raining", // chuviscos
        500: "008-umbrella", 501: "008-umbrella", 900: "008-umbrella", // chuva fraca
        502: "007-rain", 511: "007-rain", 520: "007-rain", 521: "007-rain", 522: "007-rain", // chuva intensa 
        600: "snowflake", 601: "snowflake", 602: "snowflake",
        610: "snowing", 621: "snowing", 622: "snowing", 623: "snowing", // snow
        611: "009-wind-1", 612: "009-wind-1", // vento nublado
        700: "mist", 711: "mist", 721: "mist", 731: "mist", 741: "mist", 751: "mist", // mist
        800: "016-sun", // limpo
        801: "011-cloudy", 802: "011-cloudy", 803: "011-cloudy", // clounds sunny
        804: "015-cloud" // clouds only
    }
    return icons[code]
}
app.post('/', function (req, res) {
    let url_weather = 'http://api.weatherbit.io/v2.0/forecast/daily'
    req.body.type == "coordinates" ? url_weather += `?lat=${req.body.latitude}&lon=${req.body.longitude}` : url_weather += `?city=${req.body.city}`
    url_weather += `&units=M&days=7&key=${apiKey}`
    http.get(url_weather, (resp) => {
        let data = ''
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk
        })
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            try {
                weather = JSON.parse(data)
                let url_photo= 'http://api.teleport.org/api/urban_areas'
                url_photo += `/slug:${weather.city_name.toLowerCase()}/images/`
                http.get(url_photo, (resp_photo) => {
                    let data_photo = ''
                    resp_photo.on('data', (chunk) => {
                        data_photo += chunk
                    })
                    resp_photo.on('end', () => {
                        let temp =  JSON.parse(data_photo)
                        photo = temp.photos[0].image.web

                        res.render('index', { weather: weather, error: error, photo: photo })
                        res.end()
                    })
                }).on("error", (err) => {
                    console.log("Error: " + err.message)
                    weather = null
                    error = true
                    res.render('index', { weather: weather, error: error, photo:photo })
                    res.end()
                })
            } catch (error) {
                console.log(error)
                weather = null
                error = true
                res.render('index', { weather: weather, error: error ,photo:photo})
                res.end()
            }
        })
    }).on("error", (err) => {
        console.log("Error: " + err.message)
        weather = null
        error = true
        res.render('index', { weather: weather, error: error,photo:photo })
        res.end()
    })
})
app.listen(port, host, function () {
    console.log(`Example app listening on port ${port} !`)
})