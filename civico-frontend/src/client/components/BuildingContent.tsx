import React from 'react'
import {createStyles, withStyles, WithStyles, DialogContentText, Button} from '@material-ui/core'
import moment from 'moment'

const styles = () => createStyles({
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '25px',
    paddingRight: '25px',
    margin: '5px'
  }
})

interface Props {
  buildingName: string
  buildingLevel: number
  pacifist: boolean
  pacifismDisabledUntil: number
  onTogglePacifism: (days: number) => void
}

interface State {
  time: number
}

class BuildingContent extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {time: 0}
  public interval: NodeJS.Timeout

  public componentDidMount() {
    this.interval = setInterval(() => this.setState({time: Date.now()}), 1000);
  }

  public componentWillUnmount() {
    clearInterval(this.interval);
  }

  public render() {
    const {classes, buildingName, buildingLevel, pacifist, pacifismDisabledUntil, onTogglePacifism} = this.props
    const {time} = this.state

    switch (buildingName) {
      case 'Embassy':
        const pasifismDisabledDuration = moment.duration(pacifismDisabledUntil - time).asSeconds()
        const hours = Math.floor(pasifismDisabledDuration / 3600)
        const minutes = Math.floor((pasifismDisabledDuration - hours * 3600) / 60)
        const seconds = Math.floor(pasifismDisabledDuration - hours * 3600 - minutes * 60)
        return (
          <DialogContentText>
            <div>
              Your town is currently {pacifist ? 'pacifist' : 'open for battles'}.
              You can restate your military status, but you cannot change it back for {6 - buildingLevel} days.
            </div>
            <Button
              className={classes.button}
              onClick={() => onTogglePacifism(6 - buildingLevel)}
              disabled={pasifismDisabledDuration > 0}
            >Restate military status</Button>
            Cannot toggle again until {hours}.{minutes}.{seconds}.
          </DialogContentText>
        )
      default:
        return null
    }
  }
}

export default withStyles(styles)(BuildingContent)
