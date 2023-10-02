import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    const textFilter = event.target.value
    dispatch(filterChange(textFilter))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input name="textfilter" onChange={handleChange} />
    </div>
  )
}

export default Filter