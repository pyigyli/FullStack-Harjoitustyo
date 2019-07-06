import React from 'react'
import {createStyles, withStyles, WithStyles, Button, TextField, Select, MenuItem} from '@material-ui/core'
import {troopsData} from '../../../types/protocol'

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
  buildingLevel: number
  onClose: () => void
  onTrainTroops: (troopType: string, amountToTrain: number) => void
}

interface State {
  selectedTroopType: string
  soldiersToTrainAmount: number
}

class Barracks extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    selectedTroopType: 'Knife Boy',
    soldiersToTrainAmount: 0
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
    const {classes, lumber, iron, clay, wheat, buildingLevel} = this.props
    const {selectedTroopType, soldiersToTrainAmount} = this.state

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
            <MenuItem value={'Spearman'}>Spearman</MenuItem>
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
              <div>{Math.round(troopsData[selectedTroopType].lumberCost * (1.05 - 0.05 * buildingLevel))}</div>
            </div>
            <div className={classes.costWrapper}>
              <div>Iron</div>
              <div>{Math.round(troopsData[selectedTroopType].ironCost * (1.05 - 0.05 * buildingLevel))}</div>
            </div>
            <div className={classes.costWrapper}>
              <div>Clay</div>
              <div>{Math.round(troopsData[selectedTroopType].clayCost * (1.05 - 0.05 * buildingLevel))}</div>
            </div>
            <div className={classes.costWrapper}>
              <div>Wheat</div>
              <div>{Math.round(troopsData[selectedTroopType].wheatCost * (1.05 - 0.05 * buildingLevel))}</div>
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
              lumber < Math.round(soldiersToTrainAmount * troopsData[selectedTroopType].lumberCost * (1.05 - 0.05 * buildingLevel)) ||
              iron   < Math.round(soldiersToTrainAmount * troopsData[selectedTroopType].ironCost   * (1.05 - 0.05 * buildingLevel)) ||
              clay   < Math.round(soldiersToTrainAmount * troopsData[selectedTroopType].clayCost   * (1.05 - 0.05 * buildingLevel)) ||
              wheat  < Math.round(soldiersToTrainAmount * troopsData[selectedTroopType].wheatCost  * (1.05 - 0.05 * buildingLevel))
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
              <div>{Math.round(soldiersToTrainAmount * troopsData[selectedTroopType].lumberCost * (1.05 - 0.05 * buildingLevel))}</div>
            </div>
            <div className={classes.costWrapper}>
              <div>Iron</div>
              <div>{Math.round(soldiersToTrainAmount * troopsData[selectedTroopType].ironCost * (1.05 - 0.05 * buildingLevel))}</div>
            </div>
            <div className={classes.costWrapper}>
              <div>Clay</div>
              <div>{Math.round(soldiersToTrainAmount * troopsData[selectedTroopType].clayCost * (1.05 - 0.05 * buildingLevel))}</div>
            </div>
            <div className={classes.costWrapper}>
              <div>Wheat</div>
              <div>{Math.round(soldiersToTrainAmount * troopsData[selectedTroopType].wheatCost * (1.05 - 0.05 * buildingLevel))}</div>
            </div>
          </div>
        <div className={classes.lineBreak}/>
      </div>
    )
  }
}

export default withStyles(styles)(Barracks)
