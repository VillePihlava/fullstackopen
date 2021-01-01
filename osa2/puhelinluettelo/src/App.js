import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import NotificationMessage from './components/NotificationMessage'
import ErrorMessage from './components/ErrorMessage'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchWord, setSearchWord] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const foundPersons = persons.filter(element => element.name === newName)
    if (foundPersons.length > 0) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const id = parseInt(foundPersons[0].id)
        const personObject = {
          name: newName,
          number: newNumber
        }
        personService
          .update(id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setNotificationMessage(
              `Updated ${returnedPerson.name}`
            )
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(error => {
            setPersons(persons.filter(person => person.id !== id))
            setErrorMessage(
              `Information of ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
        setNewName('')
        setNewNumber('')
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotificationMessage(
            `Added ${returnedPerson.name}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const removePerson = (event) => {
    event.preventDefault()
    const id = parseInt(event.target[0].value)
    const name = event.target[1].value
    if (window.confirm(`Delete ${name}?`))
    {
      personService
        .remove(id)
        .then(data => {
          setPersons(persons.filter(person => person.id !== id))
          setNotificationMessage(
            `Removed ${name}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchWordChange = (event) => {
    setSearchWord(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <NotificationMessage message={notificationMessage} />
      <ErrorMessage message={errorMessage} />
      <Filter searchWord={searchWord} handleSearchWordChange={handleSearchWordChange} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={persons} searchWord={searchWord} removePerson={removePerson} />
    </div>
  )

}

export default App