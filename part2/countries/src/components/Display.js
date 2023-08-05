import React from 'react'
import Country from './Country'

const Display = ({countries, search}) => {
  if (countries.length > 10) {
    return (
      <p>
        Too many matches ({countries.length} countries found), specify another filter
      </p>
    )
  } else if ( countries.length === 1 ) {
    return (
      <Country country={countries[0]} />
    )
  } else {
    return (
      <>
        <p>Found {countries.length} matching countries</p>
        <ul>
          {countries
            .map((country, i) =>
            <li key={i}> {country.name.common}</li>
          )}
        </ul>
      </>
    )
  }
}

export default Display