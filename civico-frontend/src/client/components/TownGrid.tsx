import React from 'react'
import {createStyles, withStyles, WithStyles, Paper} from '@material-ui/core'
import DragIcon from '@material-ui/icons/openWith'
import Draggable from 'react-draggable'
import {GridSlot} from '../../types/protocol'

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
    position: 'fixed',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  dragIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
})

interface Props {
  grid: GridSlot[][]
  newBuildingWidth: number
  newBuildingHeight: number
  newBuildingRow: number
  newBuildingColumn: number
  onDragStop: (row: number, column: number) => void
}

interface State {
  width: number
  height: number
  margin: number
}

class TownGrid extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    width: 130 - 8 * this.props.grid.length,
    height: 130 - 8 * this.props.grid.length,
    margin: 5
  }

  public handleDragStop = (e: MouseEvent, data: any) => {
    const {width, height, margin} = this.state
    const row = Math.round(data.lastX / (width + margin))
    const column = Math.round(data.lastY / (height + margin))
    this.props.onDragStop(row, column)
  }

  public render() {
    const {classes, grid, newBuildingWidth, newBuildingHeight, newBuildingRow, newBuildingColumn} = this.props
    const {width, height, margin} = this.state
    let placeBuildingDisabled: boolean = false
    if (grid.length < newBuildingWidth + newBuildingRow || grid.length < newBuildingHeight + newBuildingColumn) {
      placeBuildingDisabled = true
    }

    return (
      <div
        className={classes.root}
        style={{
          width: (width + margin) * grid.length + margin,
          height: (height + margin) * grid.length + margin,
          top: '250px',
          left: '50%',
          transform: 'translate(-50%, 0%)'
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
                  top: i * (height + margin),
                  left: j * (width + margin),
                  backgroundColor: slot.name === 'EMPTY' ? 'white' : '#ebefec'
                }}
              >
                <div>{slot.name}</div>
                <div>{slot.name === 'EMPTY' ? '' : slot.level}</div>
              </Paper>
            )
          })
        })}
        {newBuildingWidth > 0 && newBuildingHeight > 0 && (
          <Draggable
            grid={[width + margin, height + margin]}
            bounds='parent'
            onStop={this.handleDragStop}
          >
            <Paper
              className={classes.slot}
              style={{
                width: (width + margin) * newBuildingWidth - margin,
                height: (height + margin) * newBuildingHeight - margin,
                margin,
                top: 0 * (height + margin),
                left: 0 * (width + margin),
                backgroundColor: placeBuildingDisabled ? '#b14d6fcc' : '#70cc70cc'
              }}
            >
              <div className={classes.dragIconContainer}>
                <DragIcon/>
              </div>
            </Paper>
          </Draggable>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(TownGrid)
