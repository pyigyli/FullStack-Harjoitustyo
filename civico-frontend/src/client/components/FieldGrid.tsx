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
  grid: string[][]
}

class TownGrid extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {classes, grid} = this.props
    const width: number = 100
    const height: number = 100
    const margin: number = 5

    return (
      <div>
        {grid.map((row: string[], i: number) => {
          return row.map((slot: string, j: number) => {
            return (
              <Paper
                className={classes.slot}
                style={{
                  width,
                  height,
                  margin,
                  top: i*(height+margin)-grid.length*height/2,
                  left: j*(width+margin)-grid[0].length*width/2,
                  backgroundColor: slot.substr(0, 1) === '?' ? '#555555' : '#ebefec'
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
