import React from 'react'

const Persons = ({persons, search, deletePerson}) => {
  return (
    <div>
      {persons
        .filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))
        .map((person) => <div className="person" key={person.id}>
			<span className="info">
				<span className="name">{person.name}</span>
				<span className="number">{person.number}</span>
			</span>
			<button onClick={() => deletePerson(person.id)}>&#10005; delete</button>
		</div>)}
    </div>
  )
}

export default Persons