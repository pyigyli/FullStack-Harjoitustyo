import React from 'react'
import {createStyles, withStyles, WithStyles, TextField, Button, InputAdornment} from '@material-ui/core'
import MapGrid from '../components/MapGrid'
import {Troops} from '../../types/protocol'

const styles = () => createStyles({
  sceneWrapper: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '100%',
    backgroundColor: '#fffafa',
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
    borderLeftWidth: '10px',
    borderRightWidth: '10px',
    borderLeftColor: '#321432aa',
    borderRightColor: '#321432aa'
  },
  mapButtonsContainer: {
    position: 'fixed',
    top: '130px',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textfield: {
    borderColor: '#321432 !important',
    color: '#321432 !important',
    width: '65px'
  },
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '25px',
    paddingRight: '25px',
    marginLeft: '15px',
    marginRight: '15px',
    marginBottom: '5px'
  }
})

interface Props {
  map: string[][]
  selfCoordinates: number[]
  selectedMapSlotData: {username: string, population: number}
  troops: Troops
  onGetMap: () => void
  onGetMapSlot: (username: string) => void
  onSendTroops: (target: string, troopsToSend: Troops, travelTime: number) => void
}

interface State {
  mapCoordinates: number[]
  newX: number
  newY: number
  troopsToSendValues: Troops
}

class MapScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    mapCoordinates: this.props.selfCoordinates,
    newX: this.props.selfCoordinates[0],
    newY: this.props.selfCoordinates[1],
    troopsToSendValues: {'Knife Boy': 0, Spearman: 0, Swordsman: 0, 'Donkey Rider': 0, Jouster: 0, 'Dark Knight': 0}
  }

  public componentWillMount() {
    this.props.onGetMap()
  }

  public handleNewXChange = (newX: number) => {
    newX = newX < 0   ? 0   : newX
    newX = newX > 499 ? 499 : newX
    this.setState({newX})
  }

  public handleNewYChange = (newY: number) => {
    newY = newY < 0   ? 0   : newY
    newY = newY > 499 ? 499 : newY
    this.setState({newY})
  }

  public setNewMapCoordinates = () => this.setState({mapCoordinates: [this.state.newX, this.state.newY]})

  public render() {
    const {classes, map, selfCoordinates, selectedMapSlotData, troops, onGetMapSlot, onSendTroops} = this.props
    const {mapCoordinates, newX, newY} = this.state

    return (
      <div className={classes.sceneWrapper}>
        <div className={classes.mapButtonsContainer}>
          <TextField
            type='number'
            value={newX}
            onChange={({target}) => this.handleNewXChange(parseInt(target.value, 10))}
            margin='normal'
            variant='outlined'
            InputLabelProps={{classes: {root: classes.textfield}}}
            InputProps={{
              classes: {notchedOutline: classes.textfield},
              startAdornment: <InputAdornment position='start'>X:</InputAdornment>
            }}
          />
          <TextField
            type='number'
            value={newY}
            onChange={({target}) => this.handleNewYChange(parseInt(target.value, 10))}
            margin='normal'
            variant='outlined'
            InputLabelProps={{classes: {root: classes.textfield}}}
            InputProps={{
              classes: {notchedOutline: classes.textfield},
              startAdornment: <InputAdornment position='start'>Y:</InputAdornment>
            }}
          />
          <div style={{position: 'relative', top: '25px'}}>
            <Button className={classes.button} onClick={this.setNewMapCoordinates}>Search</Button>
          </div>
        </div>
        <MapGrid
          map={map}
          selfCoordinates={selfCoordinates}
          x={mapCoordinates[0]}
          y={mapCoordinates[1]}
          selectedMapSlotData={selectedMapSlotData}
          troops={troops}
          onGetMapSlot={onGetMapSlot}
          onSendTroops={onSendTroops}
        />
      </div>
    )
  }
}

export default withStyles(styles)(MapScene)
