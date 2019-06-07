import React from 'react'
import {createStyles, withStyles, WithStyles, Paper} from '@material-ui/core'
import DragIcon from '@material-ui/icons/OpenWith'
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
  placeBuildingDisabled: boolean
  onDragStop: (row: number, column: number) => void
  onOpenBuildingMenu: (buildingName: string, row: number, column: number) => void
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

  public componentDidUpdate(prevProps) {
    if (this.props.grid.length !== prevProps.grid.length) {
      this.setState({width: 130 - 8 * this.props.grid.length, height: 130 - 8 * this.props.grid.length})
    }
  }

  public handleDragStop = (e: MouseEvent, data: any) => {
    const {width, height, margin} = this.state
    this.props.onDragStop(Math.round(data.lastX / (width + margin)), Math.round(data.lastY / (height + margin)))
  }

  public render() {
    const {classes, newBuildingWidth, newBuildingHeight, placeBuildingDisabled, onOpenBuildingMenu} = this.props
    const {width, height, margin} = this.state
    const grid = [...this.props.grid]

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
              if ((i > 0 && grid[i][j].name === grid[i - 1][j].name) || (j > 0 && grid[i][j].name === grid[i][j - 1].name)) {
                return null
              }
              let heightIndex: number = i + 1
              while (heightIndex < grid.length && grid[heightIndex][j] && grid[i][j].name === grid[heightIndex][j].name) {
                heightIndex += 1
                bigHeight = (height + margin) * (heightIndex - i) - margin
              }
              let widthIndex: number = j + 1
              while (widthIndex < grid.length && grid[i][widthIndex] && grid[i][j].name === grid[i][widthIndex].name) {
                widthIndex += 1
                bigWidth = (width + margin) * (widthIndex - j) - margin
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
                onClick={() => onOpenBuildingMenu(slot.name, i, j)}
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
