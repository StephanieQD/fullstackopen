import React from 'react'

const Filter = ({search, handleSearchChange}) => {
  return (
    <form><label>Search by name <input type="text" value={search} onChange={handleSearchChange} /></label></form>
  )
}

export default Filter;