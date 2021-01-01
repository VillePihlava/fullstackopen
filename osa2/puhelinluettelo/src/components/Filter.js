import React from 'react'

const Filter = ({searchWord, handleSearchWordChange}) => {
    return (
        <div>
            filter shown with <input value={searchWord} onChange={handleSearchWordChange}/>
        </div>
    )
}

export default Filter