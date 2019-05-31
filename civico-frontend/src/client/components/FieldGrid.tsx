import React from 'react'
import {createStyles, withStyles, WithStyles, Paper} from '@material-ui/core'

const styles = () => createStyles({
  root: {
    width: '532px',
    height: '533px',
    position: 'fixed',
    top: '130px',
    left: '224px',
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
  handleFieldLevelUp: (row: number, column: number, newLevel: number) => void
}

class TownGrid extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {classes, grid, handleFieldLevelUp} = this.props
    const width: number = 100
    const height: number = 100
    const margin: number = 5

    return (
      <div className={classes.root}>
        {grid.map((row, i) => {
          return row.map((slot, j) => {
            let slotLabel: string = slot.name
            let background: string = 'radial-gradient(100% 100%, #ffffff, #dddddddd)'
            if (slot.name.includes('?')) {
              slotLabel = (
                i - 1 > 0 && !grid[i - 1][j].name.includes('?') ||
                i + 1 < grid.length && !grid[i + 1][j].name.includes('?') ||
                j - 1 > 0 && !grid[i][j - 1].name.includes('?') ||
                j + 1 < grid[0].length && !grid[i][j + 1].name.includes('?')
              ) ? 'Discover' : ''
              background = (
                i - 1 > 0 && !grid[i - 1][j].name.includes('?') ||
                i + 1 < grid.length && !grid[i + 1][j].name.includes('?') ||
                j - 1 > 0 && !grid[i][j - 1].name.includes('?') ||
                j + 1 < grid[0].length && !grid[i][j + 1].name.includes('?')
              ) ? '#70cc7070' : 'radial-gradient(100% 100%, #88778855, #11111111)'
            }
            switch (slot.name) {
              case 'FOREST':
                background = 'radial-gradient(100% 100%, #508850, #448844bb)'
                break
              case 'CAVE':
                background = 'radial-gradient(100% 100%, #999999, #aaaaaaaa)'
                break
              case 'CLAY':
                background = 'radial-gradient(100% 100%, #b57965, #c57975dd)'
                break
              case 'WHEAT':
                background = 'radial-gradient(100% 100%, #f7f78866, #f7f788cc)'
                break
            }
            return (
              <Paper
                key={`${i}${j}`}
                className={classes.slot}
                style={{
                  width,
                  height,
                  margin,
                  top: i * (height + margin) + 132,
                  left: j * (width + margin) + 226,
                  background
                }}
                onClick={() => handleFieldLevelUp(i, j, slot.level + 1)}
              >
                <div>{slot.level}</div>
                <div>{slotLabel}</div>
              </Paper>
            )
          })
        })}
      </div>
    )
  }
}

export default withStyles(styles)(TownGrid)
