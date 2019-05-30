import React from 'react'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'

const styles = () => createStyles({
  sceneContainer: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '100%',
    backgroundColor: '#ffffff',
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
    borderLeftWidth: '10px',
    borderRightWidth: '10px',
    borderLeftColor: '#321432aa',
    borderRightColor: '#321432aa'
  },
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
      <div className={classes.sceneContainer}>
        <div className={classes.sceneWrapper}>
          Inbox
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(InboxScene)
