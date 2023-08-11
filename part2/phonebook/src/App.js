import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="toast">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)

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
      const newPerson = {"name" : newName, "number": newNumber}
      if (duplicate.length > 0) {
        // Have to break this out separately otherwise cancelling will allow creation of item with duplicate name
        if ( window.confirm(`${duplicate[0].name} is already in the phonebook, replace the old number with the new number?
        (${duplicate[0].number} --> ${newNumber})`) ) {
          setNewName('')
          setNewNumber('')
          setNotification(`Updating ${newName}...`)
          personService
            .update(duplicate[0].id, newPerson)
            .then((updatedPerson ) => {
              setNotification(null)
              setNotification(`Updated ${updatedPerson.name}!`)
              setTimeout(() => {setNotification(null)}, 3000)
              setPersons(
                persons.map(person => (person.name === newName ? updatedPerson : person))
              )
            })
            .catch(error => {
              console.log(error)
              setNotification(null)
              setNotification(`Something went wrong, Unable to update ${newName}`)
              setTimeout(() => {setNotification(null)}, 2500)
            })
        }
      } else {
        setNotification(`Adding ${newName}...`)
        personService
          .create(newPerson)
          .then(createdPerson => {
			setNewName('')
			setNewNumber('')
            setNotification(null)
            setNotification(`Added ${createdPerson.name}!`)
            setTimeout(() => {setNotification(null)}, 2500)
            setPersons(persons.concat(createdPerson));
          })
          .catch(error => {
            console.log(error)
			console.log(error.response.data.error)
            setNotification(null)
			
			let reportedError = ''
			if (error.response.data.error) {
				reportedError = error.response.data.error
			}
			
			
			if (reportedError.includes("name") && reportedError.includes("is shorter")) {
				setNotification(`The name "${newName}" is too short. Try again with a longer name`)
			} else if(reportedError.includes("number")) {
				if (reportedError.includes("is shorter")) {
					setNotification(`The number "${newNumber}" is too short. Try again with a longer number`)
				} else {
					setNotification(`The number "${newNumber}" is in the wrong format, must be at least 8 characters and have a hyphen between the 2nd or 3rd digit.`)
				}
			} else {
				setNotification(`Something went wrong, ${newName} not added to the server...`)
			}
            
            setTimeout(() => {setNotification(null)}, 2500)
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
      setNotification(`Deleting ${personToDel[0].name}...`)
      personService
        .deletePerson(id)
        .then((req) => {
          console.log(req)
          const newList = persons.filter((person) =>
            person.id !== id
          )
          setPersons(newList)
          setNotification(null)
          setNotification(`Deleted ${personToDel[0].name}!`)
          setTimeout(() => {setNotification(null)}, 3000)
        })
        .catch(error => {
          console.log(error)
          setNotification(null)
          setNotification(`${personToDel[0].name} appears to have already been removed from the server.`)
          setTimeout(() => {setNotification(null)}, 2500)
          const newList = persons.filter((person) =>
            person.id !== id
          )
          setPersons(newList)
        })
    }
  }

  return (
    <main>
      <Notification message={notification} />
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>Add person to phonebook</h2>
      <PersonForm
        addPerson={addPerson} newName={newName} newNumber={newNumber}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
      />
      <h2>Contacts</h2>
      <Persons persons={persons} search={search} deletePerson={deletePerson} />
    </main>
  )
}

export default App