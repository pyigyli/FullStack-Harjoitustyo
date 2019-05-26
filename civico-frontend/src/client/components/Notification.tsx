import React from 'react'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'

const styles = () => createStyles({
  root: {
    position: 'fixed',
    top: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px',
    backgroundColor: '#b14d6f',
    color: 'white',
    fontWeight: 'bold'
  }
})

interface Props {
  message: string
}

class Notification extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {classes, message} = this.props

    return (
      <div>
        <Fade in={Boolean(message)}>
          <Paper className={classes.root}>
            {message}
          </Paper>
        </Fade>
      </div>
    )
  }
}

export default withStyles(styles)(Notification)
