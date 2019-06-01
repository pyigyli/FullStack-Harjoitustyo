import React from 'react'
import {createStyles, withStyles, WithStyles, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core'
import {FieldSlot} from '../../types/protocol'

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
  },
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '30px',
    paddingRight: '30px',
    margin: '30px'
  }
})

interface Props {
  grid: Array<Array<{name: string, level: number}>>
  getFieldSlotData: (row: number, column: number) => void
  handleFieldLevelUp: (row: number, column: number, newLevel: number) => void
}

interface State {
  slotSelected: boolean
  selectedSlot: FieldSlot | null
}

class FieldGrid extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {slotSelected: false, selectedSlot: null}

  public handleOpen(row: number, column: number) {
    this.props.getFieldSlotData(row, column)
    this.setState({slotSelected: true})
  }

  public handleClose = () => this.setState({slotSelected: false})

  public handleSubmit = (row: number, column: number, newLevel: number) => {
    this.props.handleFieldLevelUp(row, column, newLevel)
    this.setState({slotSelected: false})
  }

  public render() {
    const {classes, grid} = this.props
    const {slotSelected} = this.state
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
                i - 1 > 0               && !grid[i - 1][j].name.includes('?') ||
                i + 1 < grid.length     && !grid[i + 1][j].name.includes('?') ||
                j - 1 > 0               && !grid[i][j - 1].name.includes('?') ||
                j + 1 < grid[0].length  && !grid[i][j + 1].name.includes('?')
              ) ? 'Discover' : ''
              background = (
                i - 1 > 0               && !grid[i - 1][j].name.includes('?') ||
                i + 1 < grid.length     && !grid[i + 1][j].name.includes('?') ||
                j - 1 > 0               && !grid[i][j - 1].name.includes('?') ||
                j + 1 < grid[0].length  && !grid[i][j + 1].name.includes('?')
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
                onClick={() => this.handleOpen(i, j)}
              >
                <div>{slotLabel}</div>
                <div>{slot.level}</div>
              </Paper>
            )
          })
        })}
        <Dialog open={slotSelected} onClose={this.handleClose}>
          <DialogTitle>
            Title
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Text
            </DialogContentText>
            <div>
              Content
            </div>
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleClose}>
              Cancel
            </Button>
            {/* <Button className={classes.button} onClick={() => this.handleSubmit(i, j, slot.level + 1)}>
              Upgrade
            </Button> */}
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(FieldGrid)
