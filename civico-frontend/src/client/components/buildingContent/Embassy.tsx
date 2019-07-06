import React from 'react'
import {createStyles, withStyles, WithStyles, Button} from '@material-ui/core'
import moment from 'moment'

const styles = () => createStyles({
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '25px',
    paddingRight: '25px',
    margin: '5px'
  },
  lineBreak: {
    position: 'relative',
    width: '80%',
    left: '10%',
    marginTop: '20px',
    marginBottom: '10px',
    borderBottomColor: '#321432',
    borderBottomStyle: 'dashed',
    borderBottomWidth: '1px'
  }
})

interface Props {
  buildingLevel: number
  pacifist: boolean
  pacifismDisabledUntil: number
  onTogglePacifism: (days: number) => void
}

interface State {
  time: number
}

class Embassy extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {time: Date.now()}
  public interval: NodeJS.Timeout = setInterval(() => this.setState({time: Date.now()}), 1000)

  public componentWillUnmount() {
    clearInterval(this.interval)
  }

  public render() {
    const {classes, buildingLevel, pacifist, pacifismDisabledUntil, onTogglePacifism} = this.props

    const pasifismDisabledDuration = moment.duration(pacifismDisabledUntil - this.state.time).asSeconds()
    const hours = Math.floor(pasifismDisabledDuration / 3600)
    const minutes = Math.floor((pasifismDisabledDuration - hours * 3600) / 60)
    const seconds = Math.floor(pasifismDisabledDuration - hours * 3600 - minutes * 60)

    return (
      <div>
        <div style={{marginBottom: '20px'}}>
          Your town is currently {pacifist ? 'pacifist' : 'open for battles'}.
          You can restate your military status, but you cannot change it back for {6 - buildingLevel} days.
        </div>
        <Button
          className={classes.button}
          onClick={() => onTogglePacifism(6 - buildingLevel)}
          disabled={pasifismDisabledDuration >= 0}
        >
          Restate military status
        </Button>
        <span>{pasifismDisabledDuration >= 0 && `Cannot toggle again until ${hours}.${minutes}.${seconds}.`}</span>
        <div className={classes.lineBreak}/>
      </div>
    )
  }
}

export default withStyles(styles)(Embassy)
