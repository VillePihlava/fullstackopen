import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({text}) => (
  <h1>{text}</h1>
)

const Line = ({text}) => (
  <div>
    {text}
  </div>
)

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [allVotes, setAll] = useState(Array.apply(null, new Array(anecdotes.length)).map(Number.prototype.valueOf,0))
  const [mostVoted, setMostVoted] = useState(0)
  const [mostVotedValue, setMostVotedValue] = useState(0)

  const setSelectedToValue = (newValue) => {
    setSelected(newValue)
  }

  const setVoteToValue = () => {
    const copy = { ...allVotes }
    copy[selected] += 1
    setAll(copy)

    if (copy[selected] > mostVotedValue) {
      setMostVoted(selected)
      setMostVotedValue(copy[selected])
    }
  }

  return (
    <div>
      <Header text="Anecdote of the day" />
      <Line text={props.anecdotes[selected]} />
      <Line text={"has " + allVotes[selected] + " votes"} />
      <Button handleClick={() => setVoteToValue()} text="vote" />
      <Button handleClick={() => setSelectedToValue(Math.floor((Math.random() * anecdotes.length)))} text="next anecdote" />
      <Header text="Anecdote with most votes" />
      <Line text={props.anecdotes[mostVoted]} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)