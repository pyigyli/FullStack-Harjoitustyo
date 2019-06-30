import React from 'react'
import {createStyles, withStyles, WithStyles, DialogContentText, DialogTitle, Button, TextField} from '@material-ui/core'
import moment from 'moment'
import {troopsData} from '../../types/protocol'

const styles = () => createStyles({
  trainTroopTypeSelectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  trainTroopTypeSelectionDataContainer: {
    display: 'flex',
    flexDirection: 'row',
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
  buildingName: string
  buildingLevel: number
  pacifist: boolean
  pacifismDisabledUntil: number
  troops: {
    knifeBoys: number
    spearMen: number
    swordsmen: number
  }
  onTogglePacifism: (days: number) => void
}

interface State {
  time: number
  knifeBoysToTrain: number
  spearMenToTrain: number
  swordsmenToTrain: number
}

class BuildingContent extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    time: 0,
    knifeBoysToTrain: 0,
    spearMenToTrain: 0,
    swordsmenToTrain: 0
  }
  public interval: NodeJS.Timeout

  public componentWillMount() {
    this.interval = setInterval(() => this.setState({time: Date.now()}), 1000);
  }

  public componentWillUnmount() {
    clearInterval(this.interval);
  }

  public handleKnifeBoysToTrainChange = (newValue: number) => {
    if (newValue >= 0) {
      this.setState({knifeBoysToTrain: newValue})
    }
  }

  public handleSpearMenToTrainChange  = (newValue: number) => {
    if (newValue >= 0) {
      this.setState({spearMenToTrain: newValue})
    }
  }

  public handleSwordsmenToTrainChange = (newValue: number) => {
    if (newValue >= 0) {
      this.setState({swordsmenToTrain: newValue})
    }
  }

  public render() {
    const {classes, buildingName, buildingLevel, pacifist, pacifismDisabledUntil, troops, onTogglePacifism} = this.props
    const {time, knifeBoysToTrain, spearMenToTrain, swordsmenToTrain} = this.state

    switch (buildingName) {
      case 'Embassy':
        const pasifismDisabledDuration = moment.duration(pacifismDisabledUntil - time).asSeconds()
        const hours = Math.floor(pasifismDisabledDuration / 3600)
        const minutes = Math.floor((pasifismDisabledDuration - hours * 3600) / 60)
        const seconds = Math.floor(pasifismDisabledDuration - hours * 3600 - minutes * 60)
        return (
          <div>
            <DialogContentText>
              <div style={{marginBottom: '20px'}}>
                Your town is currently {pacifist ? 'pacifist' : 'open for battles'}.
                You can restate your military status, but you cannot change it back for {6 - buildingLevel} days.
              </div>
              <Button
                className={classes.button}
                onClick={() => onTogglePacifism(6 - buildingLevel)}
                disabled={pasifismDisabledDuration >= 0}
              >Restate military status</Button>
              {pasifismDisabledDuration >= 0 && `Cannot toggle again until ${hours}.${minutes}.${seconds}`}.
            </DialogContentText>
            <div className={classes.lineBreak}/>
          </div>
        )
      case 'Barracks':
        return (
          <div>
            <DialogContentText>
              <div style={{marginBottom: '10px'}}>
                Here you can train basic foot soldiers to attack or raid other cities and empty fields or keep them defending your own city.
              </div>
              <DialogTitle style={{fontSize: '14px', padding: '20px'}}>
                Knife Boy:
                <span style={{marginLeft: '50px', marginRight: '50px', fontSize: '15px'}}>You have {troops.knifeBoys} knife Boys.</span>
                <TextField
                  type='number'
                  value={knifeBoysToTrain}
                  onChange={({target}) => this.handleKnifeBoysToTrainChange(parseInt(target.value))}
                  style={{width: '100px', margin: '0px', marginRight: '50px'}}
                />
              </DialogTitle>
              <div className={classes.trainTroopTypeSelectionContainer}>
                <div className={classes.trainTroopTypeSelectionDataContainer}>
                  <div style={{fontWeight: 'bold'}}>Statistics:</div>
                  <div>Attack: {troopsData['Knife Boy'].attack}</div>
                  <div>Defence: {troopsData['Knife Boy'].defence}</div>
                  <div>Speed: {troopsData['Knife Boy'].speed}</div>
                  <div>Capasity: {troopsData['Knife Boy'].capasity}</div>
                </div>
                <div className={classes.costsContainer}>
                  <div className={classes.costWrapper}>
                    <div style={{fontWeight: 'bold'}}>Cost:</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Lumber</div>
                    <div>{troopsData['Knife Boy'].lumberCost}</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Iron</div>
                    <div>{troopsData['Knife Boy'].ironCost}</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Clay</div>
                    <div>{troopsData['Knife Boy'].clayCost}</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Wheat</div>
                    <div>{troopsData['Knife Boy'].wheatCost}</div>
                  </div>
                </div>
              </div>
              <DialogTitle style={{fontSize: '14px', padding: '20px'}}>
                Spear Man:
                <span style={{marginLeft: '50px', marginRight: '50px', fontSize: '15px'}}>You have {troops.spearMen} knife Boys.</span>
                <TextField
                  type='number'
                  value={spearMenToTrain}
                  onChange={({target}) => this.handleSpearMenToTrainChange(parseInt(target.value))}
                  style={{width: '100px', margin: '0px', marginRight: '50px'}}
                />
              </DialogTitle>
              <div className={classes.trainTroopTypeSelectionContainer}>
                <div className={classes.trainTroopTypeSelectionDataContainer}>
                  <div style={{fontWeight: 'bold'}}>Statistics:</div>
                  <div>Attack: {troopsData.Spearman.attack}</div>
                  <div>Defence: {troopsData.Spearman.defence}</div>
                  <div>Speed: {troopsData.Spearman.speed}</div>
                  <div>Capasity: {troopsData.Spearman.capasity}</div>
                </div>
                <div className={classes.costsContainer}>
                  <div className={classes.costWrapper}>
                    <div style={{fontWeight: 'bold'}}>Cost:</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Lumber</div>
                    <div>{troopsData.Spearman.lumberCost}</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Iron</div>
                    <div>{troopsData.Spearman.ironCost}</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Clay</div>
                    <div>{troopsData.Spearman.clayCost}</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Wheat</div>
                    <div>{troopsData.Spearman.wheatCost}</div>
                  </div>
                </div>
              </div>
              <DialogTitle style={{fontSize: '14px', padding: '20px'}}>
                Swordsman:
                <span style={{marginLeft: '50px', marginRight: '50px', fontSize: '15px'}}>You have {troops.swordsmen} knife Boys.</span>
                <TextField
                  type='number'
                  value={swordsmenToTrain}
                  onChange={({target}) => this.handleSwordsmenToTrainChange(parseInt(target.value))}
                  style={{width: '100px', margin: '0px', marginRight: '50px'}}
                />
              </DialogTitle>
              <div className={classes.trainTroopTypeSelectionContainer}>
                <div className={classes.trainTroopTypeSelectionDataContainer}>
                  <div style={{fontWeight: 'bold'}}>Statistics:</div>
                  <div>Attack: {troopsData.Swordsman.attack}</div>
                  <div>Defence: {troopsData.Swordsman.defence}</div>
                  <div>Speed: {troopsData.Swordsman.speed}</div>
                  <div>Capasity: {troopsData.Swordsman.capasity}</div>
                </div>
                <div className={classes.costsContainer}>
                  <div className={classes.costWrapper}>
                    <div style={{fontWeight: 'bold'}}>Cost:</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Lumber</div>
                    <div>{troopsData.Swordsman.lumberCost}</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Iron</div>
                    <div>{troopsData.Swordsman.ironCost}</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Clay</div>
                    <div>{troopsData.Swordsman.clayCost}</div>
                  </div>
                  <div className={classes.costWrapper}>
                    <div>Wheat</div>
                    <div>{troopsData.Swordsman.wheatCost}</div>
                  </div>
                </div>
              </div>
            </DialogContentText>
            <div className={classes.lineBreak}/>
          </div>
        )
      default:
        return null
    }
  }
}

export default withStyles(styles)(BuildingContent)
