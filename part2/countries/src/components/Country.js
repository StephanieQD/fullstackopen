import React from 'react'

const Country = ({country}) => {
  console.log(country)
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p><b>Capital:</b> {country.capital[0]}</p>
      <p><b>Area:</b> {country.area}</p>
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
    </div>
  )
}

export default Country