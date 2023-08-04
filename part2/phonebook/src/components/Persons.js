import React from 'react'

const Persons = ({persons, search, deletePerson}) => {
  return (
    <div>
      {persons
        .filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))
        .map((person) => <p key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></p>)}
    </div>
  )
}

export default Persons