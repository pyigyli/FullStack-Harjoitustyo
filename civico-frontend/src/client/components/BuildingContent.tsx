import React from 'react'
import {createStyles, withStyles, WithStyles, Button, TextField, Select, MenuItem} from '@material-ui/core'
import moment from 'moment'
import {troopsData} from '../../types/protocol'

const styles = () => createStyles({
  trainTroopTypeSelectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  costsContainer: {
    width: '500px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '30px',
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  costWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  },
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
  lumber: number
  iron: number
  clay: number
  wheat: number
  buildingName: string
  buildingLevel: number
  pacifist: boolean
  pacifismDisabledUntil: number
  onClose: () => void
  onTogglePacifism: (days: number) => void
  onTrainTroops: (troopType: string, amountToTrain: number) => void
}

interface State {
  time: number
  selectedTroopType: string
  soldiersToTrainAmount: number
}

class BuildingContent extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    time: 0,
    selectedTroopType: '',
    soldiersToTrainAmount: 0
  }
  public interval: NodeJS.Timeout

  public componentWillMount() {
    switch (this.props.buildingName) {
      case 'Embassy':
        this.interval = setInterval(() => this.setState({time: Date.now()}), 1000)
        break
      case 'Barracks':
        this.setState({selectedTroopType: 'Knife Boy'})
        break
      default:
        break
    }
  }

  public componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  public handleSelectedTroopTypeChange = (newValue: string) => this.setState({selectedTroopType: newValue})

  public handleTrainAmountChange = (newValue: number) => {
    if (newValue >= 0) {
      this.setState({soldiersToTrainAmount: newValue})
    }
  }

  public handleTrainSoldiers = () => {
    if (this.state.soldiersToTrainAmount > 0) {
      this.props.onTrainTroops(this.state.selectedTroopType, this.state.soldiersToTrainAmount)
    }
    this.props.onClose()
  }

  public render() {
    const {classes,
      lumber,
      iron,
      clay,
      wheat,
      buildingName,
      buildingLevel,
      pacifist,
      pacifismDisabledUntil,
      onTogglePacifism
    } = this.props
    const {time, selectedTroopType, soldiersToTrainAmount} = this.state

    switch (buildingName) {
      case 'Embassy':
        const pasifismDisabledDuration = moment.duration(pacifismDisabledUntil - time).asSeconds()
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
            <span>{pasifismDisabledDuration >= 0 && `Cannot toggle again until ${hours}.${minutes}.${seconds}`}.</span>
            <div className={classes.lineBreak}/>
          </div>
        )
      case 'Barracks':
        return (
          <div>
            <div style={{marginBottom: '20px'}}>
              <div style={{marginBottom: '10px'}}>
                Here you can train basic foot soldiers to attack or raid other
                cities and empty fields or keep them defending your own city.
              </div>
              <span style={{marginRight: '20px'}}>Select unit type to be trained:</span>
              <Select
                value={selectedTroopType}
                onChange={({target}) => this.handleSelectedTroopTypeChange(target.value as string)}
              >
                <MenuItem value={'Knife Boy'}>Knife Boy</MenuItem>
                <MenuItem value={'Spearman'}>Spear Man</MenuItem>
                <MenuItem value={'Swordsman'}>Swordsman</MenuItem>
              </Select>
            </div>
            <div className={classes.trainTroopTypeSelectionContainer}>
              <div className={classes.costsContainer}>
                <div className={classes.costWrapper}>
                  <div style={{fontWeight: 'bold'}}>Statistics:</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Attack</div>
                  <div>{troopsData[selectedTroopType].attack}</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Defence</div>
                  <div>{troopsData[selectedTroopType].defence}</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Speed</div>
                  <div>{troopsData[selectedTroopType].speed}</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Capasity</div>
                  <div>{troopsData[selectedTroopType].capasity}</div>
                </div>
              </div>
              <div className={classes.costsContainer}>
                <div className={classes.costWrapper}>
                  <div style={{fontWeight: 'bold'}}>Cost:</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Lumber</div>
                  <div>{troopsData[selectedTroopType].lumberCost}</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Iron</div>
                  <div>{troopsData[selectedTroopType].ironCost}</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Clay</div>
                  <div>{troopsData[selectedTroopType].clayCost}</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Wheat</div>
                  <div>{troopsData[selectedTroopType].wheatCost}</div>
                </div>
              </div>
            </div>
            <div>
              <span style={{marginLeft: '30px', marginRight: '10px'}}>Train more:</span>
              <TextField
                type='number'
                value={soldiersToTrainAmount}
                onChange={({target}) => this.handleTrainAmountChange(parseInt(target.value, 10))}
                style={{width: '100px', top: '7px', marginRight: '20px'}}
              />
              <Button
                className={classes.button}
                onClick={this.handleTrainSoldiers}
                disabled={
                  lumber < soldiersToTrainAmount * troopsData[selectedTroopType].lumberCost ||
                  iron   < soldiersToTrainAmount * troopsData[selectedTroopType].ironCost   ||
                  clay   < soldiersToTrainAmount * troopsData[selectedTroopType].clayCost   ||
                  wheat  < soldiersToTrainAmount * troopsData[selectedTroopType].wheatCost
                }
              >
                Train
              </Button>
            </div>
              <div className={classes.costsContainer}>
                <div className={classes.costWrapper}>
                  <div style={{fontWeight: 'bold'}}>Total cost:</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Lumber</div>
                  <div>{soldiersToTrainAmount * troopsData[selectedTroopType].lumberCost}</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Iron</div>
                  <div>{soldiersToTrainAmount * troopsData[selectedTroopType].ironCost}</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Clay</div>
                  <div>{soldiersToTrainAmount * troopsData[selectedTroopType].clayCost}</div>
                </div>
                <div className={classes.costWrapper}>
                  <div>Wheat</div>
                  <div>{soldiersToTrainAmount * troopsData[selectedTroopType].wheatCost}</div>
                </div>
              </div>
            <div className={classes.lineBreak}/>
          </div>
        )
      default:
        return null
    }
  }
}

export default withStyles(styles)(BuildingContent)
