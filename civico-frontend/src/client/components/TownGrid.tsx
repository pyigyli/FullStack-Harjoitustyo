import React from 'react'
import {createStyles, withStyles, WithStyles, Paper} from '@material-ui/core'

const styles = () => createStyles({
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
    const width: number = 120
    const height: number = 110
    const margin: number = 5

    return (
      <div>
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
              while (widthIndex < grid[0].length && grid[i][widthIndex] && grid[i][j] === grid[i][widthIndex]) {
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
                  top: i * (height + margin) - grid.length * height / 2,
                  left: j * (width + margin) - grid[0].length * width / 2,
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
