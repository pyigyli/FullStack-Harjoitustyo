import React from 'react'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'

const styles = () => createStyles({
  root: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'fixed',
    top: '100px',
    left: '30%',
  }
})

interface Props {
  username: string,
  population: number,
  lumber: number,
  iron: number,
  clay: number,
  wheat: number,
  lumberRate: number,
  ironRate: number,
  clayRate: number,
  wheatRate: number
}

class ProfileBar extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {classes} = this.props

    return (
      <div className={classes.root}>
        {this.props.username}
      </div>
    )
  }
}

export default withStyles(styles)(ProfileBar)
