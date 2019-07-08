import React from 'react'
import {createStyles, withStyles, WithStyles, Paper} from '@material-ui/core'
import moment from 'moment'
import {DispatchedTroops} from '../../types/protocol'

const styles = () => createStyles({
  infoBoxContainer: {
    width: '170px',
    fontSize: '13px',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#eeddff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    left: '50%',
    transform: 'translate(-215%, 0%)',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderStyle: 'solid',
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: '#32143277'
  },
  infoBoxWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
})

interface Props {
  troopsOnMove: DispatchedTroops[]
}

interface State {
  time: number
}

class TroopsOnMove extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {time: Date.now()}
  public interval: NodeJS.Timeout = setInterval(() => this.setState({time: Date.now()}), 1000)

  public componentWillUnmount() {
    clearInterval(this.interval)
  }

  public render() {
    const {classes} = this.props
    const attackingTroops = this.props.troopsOnMove.filter(group => !group.headingBack)
    const arrivingTroops = this.props.troopsOnMove.filter(group => group.headingBack)

    return (
      <Paper className={classes.infoBoxContainer} style={{top: '200px'}}>
        {attackingTroops.length > 0 && <div>
          <div style={{marginBottom: '5px'}}>Dispatched troops</div>
          {attackingTroops.map((group, index: number) => {
            const timeUntilArrival = moment.duration(group.arrivalTime - this.state.time).asSeconds()
            const hours = Math.floor(timeUntilArrival / 3600)
            const minutes = Math.floor((timeUntilArrival - hours * 3600) / 60)
            const seconds = Math.floor(timeUntilArrival - hours * 3600 - minutes * 60)
            const hString = `${`${hours}`.length === 1 ? `0${hours}` : hours}`
            const mString = `${`${minutes}`.length === 1 ? `0${minutes}` : minutes}`
            const sString = `${`${seconds}`.length === 1 ? `0${seconds}` : seconds}`
            return (
              <div
                key={index}
                className={classes.infoBoxWrapper}
                style={{justifyContent: 'space-between', flexDirection: 'column', marginLeft: '15px', marginRight: '15px', marginBottom: '10px'}}
              >
                <div style={{textAlign: 'left'}}>{group.target ? `Raiding ${group.target}` : 'Discovering field'}</div>
                <div style={{textAlign: 'right'}}>{hString}.{mString}.{sString}</div>
              </div>
            )
          })}
        </div>}
        {arrivingTroops.length > 0 && <div>
          <div style={{marginBottom: '5px', marginTop: '10px'}}>Incoming troops</div>
          {arrivingTroops.map((group, index: number) => {
            const timeUntilArrival = moment.duration(group.arrivalTime - this.state.time).asSeconds()
            const hours = Math.floor(timeUntilArrival / 3600)
            const minutes = Math.floor((timeUntilArrival - hours * 3600) / 60)
            const seconds = Math.floor(timeUntilArrival - hours * 3600 - minutes * 60)
            const hString = `${`${hours}`.length === 1 ? `0${hours}` : hours}`
            const mString = `${`${minutes}`.length === 1 ? `0${minutes}` : minutes}`
            const sString = `${`${seconds}`.length === 1 ? `0${seconds}` : seconds}`
            return (
              <div
                key={index}
                className={classes.infoBoxWrapper}
                style={{marginLeft: '15px', marginRight: '15px'}}
              >
                <span>Arriving in {hString}.{mString}.{sString}</span>
              </div>
            )
          })}
        </div>}
    </Paper>
    )
  }
}

export default withStyles(styles)(TroopsOnMove)
