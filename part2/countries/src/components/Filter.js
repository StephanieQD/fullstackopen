import React from 'react'

const Filter = ({search, handleSearchChange}) => {
  return (
    <p>Find Countries <input value={search} onChange={handleSearchChange} /> </p>
  )
}

export default Filter;