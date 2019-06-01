import React from 'react'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'

const styles = () => createStyles({
  recoursesContainer: {
    fontSize: '13px',
    fontWeight: 'bold',
    width: '600px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    top: '70px',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '100px',
    paddingRight: '100px',
    borderBottomStyle: 'solid',
    borderBottomWidth: '5px',
    borderBottomColor: '#321432aa',
    zIndex: 99
  },
  resourseWrapper: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
})

interface Props {
  population: number
  lumber: number
  iron: number
  clay: number
  wheat: number
  maxLumber: number
  maxIron: number
  maxClay: number
  maxWheat: number
}

class ProfileBar extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {
      classes,
      population,
      lumber,
      iron,
      clay,
      wheat,
      maxLumber,
      maxIron,
      maxClay,
      maxWheat
    } = this.props

    return (
      <div>
        <div className={classes.recoursesContainer}>
          <div className={classes.resourseWrapper}>
            <div>Population</div>
            <div>{population}</div>
          </div>
          <div className={classes.resourseWrapper}>
            <div>Lumber</div>
            <div>{Math.floor(lumber)} / {maxLumber}</div>
          </div>
          <div className={classes.resourseWrapper}>
            <div>Iron</div>
            <div>{Math.floor(iron)} / {maxIron}</div>
          </div>
          <div className={classes.resourseWrapper}>
            <div>Clay</div>
            <div>{Math.floor(clay)} / {maxClay}</div>
          </div>
          <div className={classes.resourseWrapper}>
            <div>Wheat</div>
            <div>{Math.floor(wheat)} / {maxWheat}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ProfileBar)
