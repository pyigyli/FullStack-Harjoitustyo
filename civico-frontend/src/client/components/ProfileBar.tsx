import React from 'react'
import {createStyles, withStyles, WithStyles, Paper} from '@material-ui/core'

const styles = () => createStyles({
  recoursesContainer: {
    width: '600px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    top: '45px',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    paddingTop: '40px',
    paddingBottom: '30px',
    paddingLeft: '100px',
    paddingRight: '100px'
  },
  recourseRatesContainer: {
    width: '200px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    top: '50px',
    left: '50%',
    transform: 'translate(-200%, 0%)',
    paddingTop: '40px',
    paddingBottom: '30px'
  }
})

interface Props {
  username: string
  population: number
  lumber: number
  iron: number
  clay: number
  wheat: number
  maxLumber: number
  maxIron: number
  maxClay: number
  maxWheat: number
  lumberRate: number
  ironRate: number
  clayRate: number
  wheatRate: number
}

class ProfileBar extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {
      classes,
      username,
      population,
      lumber,
      iron,
      clay,
      wheat,
      maxLumber,
      maxIron,
      maxClay,
      maxWheat,
      lumberRate,
      ironRate,
      clayRate,
      wheatRate
    } = this.props

    return (
      <div>
        <div>{username}</div>
        <Paper className={classes.recoursesContainer}>
          <div>{population}</div>
          <div>{lumber}/{maxLumber}</div>
          <div>{iron}/{maxIron}</div>
          <div>{clay}/{maxClay}</div>
          <div>{wheat}/{maxWheat}</div>
        </Paper>
        <Paper className={classes.recourseRatesContainer}>
          <div>{lumberRate}</div>
          <div>{ironRate}</div>
          <div>{clayRate}</div>
          <div>{wheatRate}</div>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(ProfileBar)
