import React from 'react'
import {createStyles, withStyles, WithStyles, Paper} from '@material-ui/core'

const styles = () => createStyles({
  root: {
    position: 'fixed',
    backgroundColor: '#eeddff',
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
  }
})

interface Props {
  grid: Array<Array<{
    name: string
    level: number
  }>>
}

class TownGrid extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {classes, grid} = this.props
    const width: number = 130 - 7 * grid.length
    const height: number = 130 - 7 * grid.length
    const margin: number = 5

    return (
      <div
        className={classes.root}
        style={{
          width: (width + margin) * grid.length + margin,
          height: (height + margin) * grid.length + margin,
          top: -grid.length * (height + margin) / 2 + 100,
          left: -grid.length * (width + margin) / 2
        }}
      >
        {grid.map((row, i) => {
          return row.map((slot, j) => {
            let bigHeight: number | null = null
            let bigWidth: number | null = null
            if (grid[i][j].name !== 'EMPTY') {
              if (!grid[i][j]) {
                return null
              }
              let heightIndex: number = i + 1
              let elementUnderDeleted: Boolean = false
              while (heightIndex < grid.length && grid[heightIndex][j] && grid[i][j] === grid[heightIndex][j]) {
                grid[heightIndex][j].name = ''
                heightIndex += 1
                bigHeight = (height + margin) * (heightIndex - i) - margin
                elementUnderDeleted = true
              }
              let widthIndex: number = j + 1
              let elementRightDeleted: Boolean = false
              while (widthIndex < grid.length && grid[i][widthIndex] && grid[i][j] === grid[i][widthIndex]) {
                grid[i][widthIndex].name = ''
                widthIndex += 1
                bigWidth = (width + margin) * (widthIndex - j) - margin
                elementRightDeleted = true
              }
              if (elementUnderDeleted && elementRightDeleted) {
                for (let a: number = i + 1; a < heightIndex; a++) {
                  for (let b: number = j + 1; b < widthIndex; b++) {
                    grid[a][b].name = ''
                  }
                }
              }
            }
            return (
              <Paper
                key={`${i}${j}`}
                className={classes.slot}
                style={{
                  width: bigWidth ? bigWidth : width,
                  height: bigHeight ? bigHeight : height,
                  margin,
                  top: i * (height + margin) - grid.length * (height + margin) / 2 + 100,
                  left: j * (width + margin) - grid.length * (width + margin) / 2,
                  backgroundColor: slot.name === 'EMPTY' ? 'white' : '#ebefec'
                }}
              >
                <div>{slot.level}</div>
                <div>{slot.name}</div>
              </Paper>
            )
          })
        })}
      </div>
    )
  }
}

export default withStyles(styles)(TownGrid)
