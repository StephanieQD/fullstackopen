import React from 'react'

const Filter = ({search, handleSearchChange}) => {
  return (
    <p>filter shown with <input value={search} onChange={handleSearchChange} /> </p>
  )
}

export default Filter;