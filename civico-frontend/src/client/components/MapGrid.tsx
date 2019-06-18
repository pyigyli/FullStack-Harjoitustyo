import React from 'react'
import {createStyles, withStyles, WithStyles, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core'

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
  }
})

interface Props {
  map: string[][]
  selfCoordinates: number[]
  x: number
  y: number
  selectedMapSlotData: {population: number}
  onGetMap: () => void
  onGetMapSlot: (username: string) => void
}

interface State {
  width: number
  height: number
  margin: number
  mapMenuOpen: boolean
  selectedX: number
  selectedY: number
}

class MapMap extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {width: 80, height: 80, margin: 3, mapMenuOpen: false, selectedX: 0, selectedY: 0}

  public componentWillMount() {
    this.props.onGetMap()
  }

  public handleOpenMapSlot = (selectedX: number, selectedY: number) => {
    this.props.onGetMapSlot(this.props.map[selectedX][selectedY])
    this.setState({mapMenuOpen: true, selectedX, selectedY})
  }

  public handleCloseMapSlot = () => this.setState({mapMenuOpen: false})

  public render() {

    const {classes, map, x, y, selectedMapSlotData} = this.props
    const {width, height, margin, mapMenuOpen, selectedX, selectedY} = this.state

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
          <DialogTitle>{map[selectedX][selectedY]}</DialogTitle>
          <DialogContent>
            <DialogContentText>Population: {selectedMapSlotData.population}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleCloseMapSlot}>Cancel</Button>
            <Button className={classes.button} onClick={this.handleCloseMapSlot} disabled={false}>Send</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(MapMap)
