import React from 'react'
import {createStyles, withStyles, WithStyles, Paper} from '@material-ui/core'

const styles = () => createStyles({
  slot: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
  }
})

interface Props {
  grid: string[][]
}

class TownGrid extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {classes} = this.props
    const grid3 = [['1','2','3'],['1','5','6'],['1','8','9']]
    const grid4 = [['1','2','3','4'],['1','2','5','6'],['7','8','9','6'],['a','8','b','c']]
    const grid5 = [['1','2','3','4','5'],['2','x','x','x','x'],['3','x','x','x','x'],['4','x','x','x','x'],['5','x','x','x','x']]
    const grid6 = [['1','2','3','4','5','6'],['2','x','x','x','x','x'],['3','x','x','x','x','x'],['4','x','x','x','x','x'],['5','x','x','x','x','x'],['6','x','x','x','x','x']]
    const grid7 = [['1','2','3','4','5','6','7'],['2','x','x','x','x','x','x'],['3','x','x','x','x','x','x'],['4','x','x','x','x','x','x'],['5','x','x','x','x','x','x'],['6','x','x','x','x','x','x'],['7','x','x','x','x','x','x']]
    const grid = grid4

    const width: number = 120
    const height: number = 110
    const margin: number = 5
    let tallestSlotHeightPrevious: number = 1

    return (
      <div>
        {grid.map((row: string[], i: number) => {
          let tallestSlotHeight: number = 1
          if (tallestSlotHeightPrevious > 1) {
            tallestSlotHeight = tallestSlotHeightPrevious-1
          }
          return row.map((slot: string, j: number) => {
            if (!grid[i][j]) {
              return null
            }
            let bigHeight: number | null = null
            let index: number = i+1
            while (index < grid.length && grid[index][j] && grid[i][j] === grid[index][j]) {
              grid[index][j] = ''
              index += 1
              bigHeight = (height+(margin-index))*(index-i)
              tallestSlotHeight = Math.max(index-i, tallestSlotHeight)
            }
            tallestSlotHeightPrevious = tallestSlotHeight
            return (
              <Paper
                className={classes.slot}
                style={{
                  width,
                  height: bigHeight ? bigHeight : height,
                  margin,
                  top: i*-(height+margin)*(grid.length-1)+j*-(height+margin)+(grid.length*row.length-2)*
                    (height+margin)*0.452-(bigHeight ? height+margin : tallestSlotHeight*(height+margin)),
                  left: j*(width+margin)-(row.length+1)*(width+margin)+row.length*(width+margin)*0.5,
                  backgroundColor: slot === 'EMPTY' ? 'white' : '#ebefec'
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

export default withStyles(styles)(TownGrid)
