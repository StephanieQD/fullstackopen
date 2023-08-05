import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Display from './components/Display'
import Filter from './components/Filter'

function App() {
  const [countries, setCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [search, setSearch] = useState('')

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    if (event.target.value) { // Using event.target.value because search seems to lag behind
      const searchResults = allCountries.filter((country) => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))
      setCountries(searchResults);
    } else {
      setCountries(allCountries)
    }
  }

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log(response.data)
        setAllCountries(response.data)
        setCountries(response.data)
      })
  }, [])

  return (
    <main className="App">
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <Display countries={countries} />
    </main>
  );
}

export default App;
