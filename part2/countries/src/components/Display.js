import React, { useState } from 'react'
import Country from './Country'

const CountryListing = ({country}) => {
  const [showFull, setShowFull] = useState(false)
  return (
    <div>
      {country.name.common} <button onClick={() => setShowFull(!showFull)}>{showFull ? 'Hide' : 'Show'} Info</button>
      { showFull && <Country country={country} /> }
    </div>
  )
}


const Display = ({countries}) => {
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
          {countries
            .map((country) =>
            <CountryListing key={country.cca3} country={country} />
          )}
      </>
    )
  }
}

export default Display