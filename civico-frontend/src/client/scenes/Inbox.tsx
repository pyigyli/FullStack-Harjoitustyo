import React from 'react'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'

const styles = () => createStyles({
  sceneWrapper: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
})

class InboxScene extends React.Component<WithStyles<typeof styles>> {
  public render() {
    const {classes} = this.props

    return (
      <div className={classes.sceneWrapper}>
        Inbox
      </div>
    )
  }
}

export default withStyles(styles)(InboxScene)
