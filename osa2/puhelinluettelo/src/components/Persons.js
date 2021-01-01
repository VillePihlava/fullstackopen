import React from 'react'

const Persons = ({persons, searchWord, removePerson}) => {
    return (
        <div>
            {persons.filter(element => element.name.toLowerCase().includes(searchWord.toLowerCase())).map(person =>
            <div key={person.name}>
                <form onSubmit={removePerson}>
                    <div><input hidden readOnly value={person.id} /></div>
                    <div><input hidden readOnly value={person.name} /></div>
                    <div>{person.name} {person.number}<button type="submit">delete</button></div>
                </form>
            </div>
            )}
        </div>
    )
}

export default Persons