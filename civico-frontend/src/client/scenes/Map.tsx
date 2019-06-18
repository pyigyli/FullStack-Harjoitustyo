import React from 'react'
import {createStyles, withStyles, WithStyles, TextField, Button, InputAdornment} from '@material-ui/core'
import MapGrid from '../components/MapGrid'

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
  mapCoordinates: number[]
  selectedMapSlotData: {population: number}
  onGetMap: () => void
  onGetMapSlot: (username: string) => void
  onNewMapCoordinates: (newX: number, newY: number) => void
}

interface State {
  newX: number
  newY: number
}

class MapScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {newX: 0, newY: 0}

  public handleNewXChange = (newX: number) => {
    if (newX < 0) {
      newX = 0
    } else if (newX > 499) {
      newX = 499
    }
    this.setState({newX})
  }

  public handleNewYChange = (newY: number) => {
    if (newY < 0) {
      newY = 0
    } else if (newY > 499) {
      newY = 499
    }
    this.setState({newY})
  }

  public render() {
    const {classes, map, selfCoordinates, mapCoordinates, selectedMapSlotData, onGetMap, onGetMapSlot, onNewMapCoordinates} = this.props
    const {newX, newY} = this.state

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
            <Button className={classes.button} onClick={() => onNewMapCoordinates(newX, newY)}>Search</Button>
          </div>
        </div>
        <MapGrid
          map={map}
          selfCoordinates={selfCoordinates}
          x={mapCoordinates[0]}
          y={mapCoordinates[1]}
          selectedMapSlotData={selectedMapSlotData}
          onGetMap={onGetMap}
          onGetMapSlot={onGetMapSlot}
        />
      </div>
    )
  }
}

export default withStyles(styles)(MapScene)
