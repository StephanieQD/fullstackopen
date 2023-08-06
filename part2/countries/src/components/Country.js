import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({country}) => {
  const [weather, setWeather] = useState([])

  useEffect(() => {
    const params = {
      APPID: process.env.REACT_APP_API_KEY,
      q: country.capital[0],
      units: 'metric'
    }

    axios.get('https://api.openweathermap.org/data/2.5/weather', {params})
      .then(response => {
        const apiResponse = response.data;
        console.log(apiResponse)
        setWeather([apiResponse])
      })
      .catch(error => {
        console.log(error);
      })
    }, [])

  console.log(country)
  return (
    <div className="country-info">
      <h2>{country.name.common}</h2>
      <p><b>Capital:</b> {country.capital[0]}</p>
      <p><b>Area:</b> {country.area} km<sup>2</sup></p>
      <h3>Languages</h3>
      <ul>
      {
        Object.entries(country.languages).map(([key, value]) => {
          return (
            <li key={key}>{value}</li>
          )
        })
      }
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      { weather.length > 0 && 
        <>
          <h3>Weather in {weather[0].name}</h3>
          <p><b>Temperature:</b> {weather[0].main.temp}° C</p>
          <img src={`https://openweathermap.org/img/wn/${weather[0].weather[0].icon}@2x.png`} alt={weather[0].weather[0].description} />
          <br /><i>{weather[0].weather[0].description} </i>
          <p><b>Wind:</b> {weather[0].wind.speed} m/s</p>
        </>
      }
    </div>
  )
}

export default Country