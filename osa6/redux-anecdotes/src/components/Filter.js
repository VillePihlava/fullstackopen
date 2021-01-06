import React from 'react'
import { connect } from 'react-redux'
import { overwriteFilter } from '../reducers/filterReducer'

const Filter = (props) => {

    const handleChange = (event) => {
        const filter = event.target.value
        props.overwriteFilter(filter)
    }
    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    )
}

const mapDispatchToProps = {
    overwriteFilter
}

const ConnectedFilter = connect(
    null,
    mapDispatchToProps
)(Filter)

export default ConnectedFilter