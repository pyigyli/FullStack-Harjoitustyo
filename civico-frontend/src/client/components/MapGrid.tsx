import React from 'react'
import {createStyles, withStyles, WithStyles, Paper} from '@material-ui/core'

const styles = () => createStyles({
  root: {
    position: 'fixed',
    backgroundColor: '#32143255',
    borderStyle: 'solid',
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: '#32143277'
  },
  slot: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'fixed'
  },
  dragIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
})

interface Props {
  map: string[][]
  selfCoordinates: number[]
  x: number
  y: number
  onGetMap: () => void
}

interface State {
  width: number
  height: number
  margin: number
}

class MapMap extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    width: 80,
    height: 80,
    margin: 3
  }

  public componentWillMount() {
    this.props.onGetMap()
  }

  public render() {

    const {classes, map, x, y} = this.props
    const {width, height, margin} = this.state

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
      ></div>
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
          width: (width + margin) * grid.length + margin,
          height: (height + margin) * grid.length + margin,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {grid.map((gridRow: string[], i: number) => {
          return gridRow.map((slot: string, j: number) => {
            return (
              <Paper
                key={`${i}${j}`}
                className={classes.slot}
                style={{
                  width,
                  height,
                  margin,
                  top: i * (height + margin),
                  left: j * (width + margin),
                  background: slot ? 'radial-gradient(100% 100%, #32143204, #32143232)' : '#dfffbadd'
                }}
              >
                {slot}
              </Paper>
            )
          })
        })}
      </div>
    )
  }
}

export default withStyles(styles)(MapMap)
