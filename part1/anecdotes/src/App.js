import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const randomAnecdoteIndex = () => Math.floor(Math.random() * (anecdotes.length));
  const [selected, setSelected] = useState(randomAnecdoteIndex());
  
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const voteSelected = () => {
    const votesDup = [...votes];
    votesDup[selected] += 1;
    setVotes(votesDup);
  }

  const mostPopIndex = votes.indexOf(Math.max(...votes));

  return (
    <main>
      <h2>Anecdote of the day</h2>
      <blockquote>
        <p>
          <b>Anecdote #{selected}</b> ({votes[selected]} vote{votes[selected] === 1 ? '' : 's'}) <br />
          {anecdotes[selected]}
        </p>
      </blockquote>
      <button onClick={voteSelected}>Vote</button>
      <button onClick={() => setSelected(randomAnecdoteIndex())}>Next anecdote</button>
      <h2>Anecdote with the most votes</h2>
      <blockquote>
        <p>
          <b>Anecdote #{mostPopIndex}</b> ({votes[mostPopIndex]} vote{votes[mostPopIndex] === 1 ? '' : 's'}) <br />
          {anecdotes[mostPopIndex]}
        </p>
      </blockquote>
    </main>
  )
}

export default App