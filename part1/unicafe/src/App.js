import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button className={`button ${text}`} onClick={handleClick}>{text}</button>
)

const Statistics = ({good, bad, neutral}) => {
  const total = good + neutral + bad;

  const calcAvg = () => total !== 0 ? (good + (bad * -1)) / total : 'N/A';
  const calcPos = () => total !== 0 ? (good / total) * 100 : 'N/A';

  return (
    <div>
      <h2>Statistics</h2>
      { total > 0 ? 
        <>
          good {good} <br />
          neutral {neutral} <br />
          bad {bad} <br />
          all {total} <br />
          average {calcAvg()}<br />
          positive {calcPos()}% 
        </> :
        <h3>No feedback given.</h3>
      }
    </div>
    
  );
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => setGood(good + 1)
  const incrementNeutral = () => setNeutral(neutral + 1)
  const incrementBad = () => setBad(bad + 1)

  return (
    <main>
      <h1>Give Feedback</h1>
      <Button text="good" handleClick={incrementGood}/>
      <Button text="neutral" handleClick={incrementNeutral}/>
      <Button text="bad" handleClick={incrementBad}/>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </main>
  )
}

export default App