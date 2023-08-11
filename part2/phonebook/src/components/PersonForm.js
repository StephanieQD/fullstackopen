import React from 'react'

const PersonForm = ({addPerson, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
      <label>
        name: <input type="text" value={newName} onChange={handleNameChange} />
      </label>
      <label>
        number: <input type="text" value={newNumber} onChange={handleNumberChange} />
      </label>
      <div>
        <button type="submit">+ add</button>
      </div>
    </form>
  )
}

export default PersonForm