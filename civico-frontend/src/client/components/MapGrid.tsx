import React from 'react'
import {createStyles, withStyles, WithStyles, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField} from '@material-ui/core'
import {Troops, troopsData} from '../../types/protocol'

const styles = () => createStyles({
  root: {
    position: 'relative',
    backgroundColor: '#32143255',
    borderStyle: 'solid',
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: '#32143277',
    top: '250px',
    left: '50%',
    transform: 'translate(-49%, 0%)'
  },
  mapContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-center'
  },
  mapWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-center'
  },
  coordinateX: {
    position: 'relative',
    top: '-25px',
    width: '79px',
    textAlign: 'center',
    fontSize: '20px',
    fontStyle: 'bold',
    paddingLeft: '4px'
  },
  coordinatesYWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-center'
  },
  coordinateY: {
    position: 'relative',
    left: '-40px',
    height: '75px',
    textAlign: 'right',
    fontSize: '20px',
    fontStyle: 'bold',
    paddingTop: '8px'
  },
  slot: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'fixed'
  },
  slotWithHover: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'fixed',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7
    }
  },
  dragIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '25px',
    paddingRight: '25px',
    marginLeft: '15px',
    marginRight: '15px',
    marginBottom: '5px'
  },
  infoBoxWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  textfield: {
    borderColor: '#321432 !important',
    color: '#321432 !important',
    '&:after': {
      borderColor: '#321432 !important'
    }
  }
})

interface Props {
  map: string[][]
  selfCoordinates: number[]
  x: number
  y: number
  selectedMapSlotData: {username: string, population: number}
  troops: Troops
  onGetMapSlot: (username: string) => void
  onSendTroops: (target: string, troopsToSend: Troops, travelTime: number) => void
}

interface State {
  width: number
  height: number
  margin: number
  mapMenuOpen: boolean
  selectedX: number
  selectedY: number
  openSendTroopsMenu: boolean
  troopsToSendValues: Troops
}

class MapMap extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    width: 80,
    height: 80,
    margin: 3,
    mapMenuOpen: false,
    selectedX: 0,
    selectedY: 0,
    openSendTroopsMenu: false,
    troopsToSendValues: {'Knife Boy': 0, Spearman: 0, Swordsman: 0, 'Donkey Rider': 0, Jouster: 0, 'Dark Knight': 0}
  }

  public handleOpenMapSlot = (selectedX: number, selectedY: number) => {
    if (this.props.map[selectedX][selectedY]) {
      this.props.onGetMapSlot(this.props.map[selectedX][selectedY])
      this.setState({mapMenuOpen: true, selectedX, selectedY})
    }
  }

  public handleCloseMapSlot = () => this.setState({mapMenuOpen: false})

  public handleOpenSendTroopsMenu = () => this.setState({mapMenuOpen: false, openSendTroopsMenu: true})

  public handleCloseSendTroopsMenu = () => this.setState({mapMenuOpen: true, openSendTroopsMenu: false})

  public handleTroopsToSendAmountChange = (troopType: string, newValue: number) => {
    newValue = newValue >= 0 ? newValue : 0
    newValue = newValue <= this.props.troops[troopType] ? newValue : this.props.troops[troopType]
    this.setState({troopsToSendValues: {...this.state.troopsToSendValues, [troopType]: newValue}})
  }

  public handleSendTroops = () => {
    const distanceX = Math.abs(this.props.selfCoordinates[0] - this.props.x)
    const distanceY = Math.abs(this.props.selfCoordinates[1] - this.props.y)
    const distanceOfTowns = Math.sqrt(
      (distanceX > 250 ? 500 - distanceX : distanceX) ** 2 +
      (distanceY > 250 ? 500 - distanceY : distanceY) ** 2
    )
    const travelSpeed = troopsData[Object.entries(this.state.troopsToSendValues).reduce((value, next) => 
      next[1] > 0 && troopsData[next[0]].speed < troopsData[value[0]].speed ? next : value
    )[0]].speed
    this.props.onSendTroops(this.props.selectedMapSlotData.username, this.state.troopsToSendValues, travelSpeed / distanceOfTowns * 3600000)
    this.setState({
      openSendTroopsMenu: false,
      troopsToSendValues: {'Knife Boy': 0, Spearman: 0, Swordsman: 0, 'Donkey Rider': 0, Jouster: 0, 'Dark Knight': 0}
    })
  }

  public render() {
    const {classes, map, x, y, selectedMapSlotData} = this.props
    const {width, height, margin, mapMenuOpen, selectedX, selectedY, openSendTroopsMenu, troopsToSendValues} = this.state
    const troops = Object.entries(this.props.troops).filter(entry => entry[1] !== 0)

    if (map.length < 500) {
      return (
        <div
          className={classes.root}
          style={{
            width: (width + margin) * map.length + margin,
            height: (height + margin) * map.length + margin,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )
    }

    const grid: string[][] = []
    for (let i = x - 3; i < x + 4; i++) {
      let rowIndex = i
      if (i < 0) {
        rowIndex = 500 + i
      } else if (i > 499) {
        rowIndex = i - 500
      }
      const row: string[] = []
      for (let j = y - 3; j < y + 4; j++) {
        let columnIndex = j
        if (j < 0) {
          columnIndex = 500 + j
        } else if (j > 499) {
          columnIndex = j - 500
        }
        row.push(map[rowIndex][columnIndex])
      }
      grid.push(row)
    }

    return (
      <div
        className={classes.root}
        style={{
          width:  (width  + margin) * grid.length + margin,
          height: (height + margin) * grid.length + margin
        }}
      >
        <div className={classes.mapContainer}>
          <div className={classes.mapWrapper}>
            <div className={classes.coordinateX}>{x - 3 < 0 ? 497 + x : x - 3}</div>
            <div className={classes.coordinateX}>{x - 2 < 0 ? 498 + x : x - 2}</div>
            <div className={classes.coordinateX}>{x - 1 < 0 ? 499 + x : x - 1}</div>
            <div className={classes.coordinateX}>{x}</div>
            <div className={classes.coordinateX}>{x + 1 > 499 ? x - 499 : x + 1}</div>
            <div className={classes.coordinateX}>{x + 2 > 499 ? x - 498 : x + 2}</div>
            <div className={classes.coordinateX}>{x + 3 > 499 ? x - 497 : x + 3}</div>
          </div>
          <div className={classes.mapWrapper}>
            <div className={classes.coordinatesYWrapper}>
              <div className={classes.coordinateY}>{y - 3 < 0 ? 497 + y : y - 3}</div>
              <div className={classes.coordinateY}>{y - 2 < 0 ? 498 + y : y - 2}</div>
              <div className={classes.coordinateY}>{y - 1 < 0 ? 499 + y : y - 1}</div>
              <div className={classes.coordinateY}>{y}</div>
              <div className={classes.coordinateY}>{y + 1 > 499 ? y - 499 : y + 1}</div>
              <div className={classes.coordinateY}>{y + 2 > 499 ? y - 498 : y + 2}</div>
              <div className={classes.coordinateY}>{y + 3 > 499 ? y - 497 : y + 3}</div>
            </div>
            {grid.map((gridRow: string[], i: number) => {
              return gridRow.map((slot: string, j: number) => 
                <Paper
                  key={`${i}${j}`}
                  className={slot ? classes.slotWithHover : classes.slot}
                  style={{
                    width,
                    height,
                    margin,
                    top: i * (height + margin),
                    left: j * (width + margin),
                    background: slot ? 'radial-gradient(100% 100%, #32143204, #32143232)' : '#dfffbadd'
                  }}
                  onClick={() => this.handleOpenMapSlot(x - 3 + i, y - 3 + j)}
                >
                  {slot}
                </Paper>
              )
            })}
          </div>
        </div>
        <Dialog open={mapMenuOpen} onClose={this.handleCloseMapSlot}>
          <DialogTitle>
            <span>Town of {map[selectedX][selectedY]}</span>
            <span style={{fontSize: '16px', marginLeft: '20px'}}>Population: {selectedMapSlotData.population}</span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Send your troops to visit this town?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleCloseMapSlot}>Cancel</Button>
            <Button
              className={classes.button}
              onClick={this.handleOpenSendTroopsMenu}
              disabled={troops.length === 0}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openSendTroopsMenu} onClose={this.handleCloseSendTroopsMenu}>
          <DialogTitle>Send your troops to raid the town of {selectedMapSlotData.username}</DialogTitle>
          <DialogContent>
            <DialogContentText>Send your troops to fight and steal resources from other player's town.</DialogContentText>
            {troops.map((entry, index: number) => 
              <div key={index} className={classes.infoBoxWrapper}>
                <div style={{fontWeight: 'bold', width: '130px'}}>{entry[0]}:</div>
                <div style={{marginRight: '10px'}}>{entry[1]} unit{entry[1] === 1 ? '' : 's'} available.</div>
                <div style={{marginRight: '10px'}}>Select for sending:</div>
                <TextField
                  type='number'
                  value={troopsToSendValues[entry[0]]}
                  onChange={({target}) => this.handleTroopsToSendAmountChange(entry[0], parseInt(target.value, 10))}
                  style={{width: '100px', bottom: '5px'}}
                  InputProps={{classes: {root: classes.textfield}}}
                  InputLabelProps={{classes: {root: classes.textfield}}}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleCloseSendTroopsMenu}>Cancel</Button>
            <Button
              className={classes.button}
              onClick={this.handleSendTroops}
              disabled={troops.length === 0 && Object.values(troopsToSendValues).filter((value: number) => value !== 0).length > 0}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(MapMap)
