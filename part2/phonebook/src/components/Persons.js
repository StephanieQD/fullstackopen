import React from 'react'

const Persons = ({persons, search}) => {
  return (
    <div>
      {persons
        .filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))
        .map((person) => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default Persons