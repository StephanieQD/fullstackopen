import { useState, useImperativeHandle, forwardRef } from 'react'
import Button from '@mui/material-next/Button'
import EditNoteIcon from '@mui/icons-material/EditNote'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          variant="filledTonal"
          sx={{ marginBottom: 1 }}
          onClick={toggleVisibility}
        >
          <EditNoteIcon /> {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button color="tertiary" variant="filled" onClick={toggleVisibility}>
          cancel
        </Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
