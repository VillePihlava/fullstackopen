import React from 'react'
import { connect } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
    const anecdotes = props.anecdotes
    const filter = props.filter

    const vote = (anecdote) => {
        props.addVote(anecdote)
        props.setNotification(`you voted '${anecdote.content}'`, 5)
    }

    return (
        <div>
            {anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => b.votes - a.votes).map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        anecdotes: state.anecdote,
        filter: state.filter
    }
}

const mapDispatchToProps = {
    addVote,
    setNotification
}

const ConnectedAnecdoteList = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList