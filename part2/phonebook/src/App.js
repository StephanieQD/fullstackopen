import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(people => {
        setPersons(people)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (newName && newNumber) {
      const duplicate = persons.filter((person) =>
        person.name === newName
      )

      if (duplicate.length > 0) {
        alert(`${newName} is already added to phonebook`);
      } else {
        const newPerson = {"name" : newName, "number": newNumber}
        personService
          .create(newPerson)
          .then(createdPerson => {
            setPersons(persons.concat(createdPerson));
            setNewName('');
            setNewNumber('');
          })
      }
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => setSearch(event.target.value)
  const deletePerson = (id) => {
    const personToDel = persons.filter((person) =>
      person.id === id
    )

    if (personToDel.length > 0 && window.confirm(`Do you want to delete ${personToDel[0].name}?`)) {
      console.log('Deleting...');
      personService
        .deletePerson(id)
        .then((req) => {
          console.log(req)
          const newList = persons.filter((person) =>
            person.id !== id
          )
          setPersons(newList)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>Add person to phonebook</h2>
      <PersonForm
        addPerson={addPerson} newName={newName} newNumber={newNumber}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} deletePerson={deletePerson} />
    </div>
  )
}

export default App