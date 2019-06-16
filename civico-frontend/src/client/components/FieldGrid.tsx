import React from 'react'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {createStyles, withStyles, WithStyles, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core'
import {GridSlot, fieldSlotData} from '../../types/protocol'

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
  upgradeCostsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '30px',
    paddingRight: '40px'
  },
  upgradeCostWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  },
  costLabel: {
    fontWeight: 'bold'
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
  lumber: number
  iron: number
  clay: number
  wheat: number
  grid: Array<Array<{name: string, level: number}>>
  onFieldLevelUp: (row: number, column: number, newLevel: number) => void
  onOpenDiscoverMenu: (row: number, column: number) => void
}

interface State {
  slotSelected: boolean
  row: number
  column: number
}

class FieldGrid extends React.Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
  public state = {slotSelected: false, row: 0, column: 0}

  public handleOpen(row: number, column: number) {
    const {grid} = this.props
    if (grid[row][column].name.startsWith('?')) {
      if ((row    - 1 > 0           && !grid[row - 1][column].name.startsWith('?')) ||
          (row    + 1 < grid.length && !grid[row + 1][column].name.startsWith('?')) ||
          (column - 1 > 0           && !grid[row][column - 1].name.startsWith('?')) ||
          (column + 1 < grid.length && !grid[row][column + 1].name.startsWith('?'))) {
        this.props.onOpenDiscoverMenu(row, column)
      }
    } else {
      if (grid[row][column].name === 'TOWN') {
        this.props.history.push('/town')
      } else {
        this.setState({slotSelected: true, row, column})
      }
    }
  }

  public handleClose = () => this.setState({slotSelected: false})

  public handleSubmit = (row: number, column: number, newLevel: number) => {
    this.props.onFieldLevelUp(row, column, newLevel)
    this.setState({slotSelected: false})
  }

  public render() {
    const {classes, grid, lumber, iron, clay, wheat} = this.props
    const {slotSelected, row, column} = this.state
    const width = 100
    const height = 100
    const margin = 5
    const slotName = grid[row][column].name.startsWith('?') ? grid[row][column].name.substr(1) : grid[row][column].name
    let resourceRateGainLabel: string = ''
    if (slotName) {
      if (fieldSlotData[slotName][grid[row][column].level + 1].lumberRateGain > 0) {
        resourceRateGainLabel = `${fieldSlotData[slotName][grid[row][column].level + 1].lumberRateGain} lumber / hour.`
      } else if (fieldSlotData[slotName][grid[row][column].level + 1].ironRateGain > 0) {
        resourceRateGainLabel = `${fieldSlotData[slotName][grid[row][column].level + 1].ironRateGain} iron / hour.`
      } else if (fieldSlotData[slotName][grid[row][column].level + 1].clayRateGain > 0) {
        resourceRateGainLabel = `${fieldSlotData[slotName][grid[row][column].level + 1].clayRateGain} clay / hour.`
      } else if (fieldSlotData[slotName][grid[row][column].level + 1].wheatRateGain > 0) {
        resourceRateGainLabel = `${fieldSlotData[slotName][grid[row][column].level + 1].wheatRateGain} wheat / hour.`
      }
    }

    return (
      <div className={classes.root}>
        {grid.map((gridRow: GridSlot[], i: number) => {
          return gridRow.map((slot: GridSlot, j: number) => {
            let slotLabel: string = slot.name
            let background: string = 'radial-gradient(100% 100%, #ffffff, #dddddddd)'
            if (slot.name.startsWith('?')) {
              if (i - 1 > 0           && !grid[i - 1][j].name.startsWith('?') ||
                  i + 1 < grid.length && !grid[i + 1][j].name.startsWith('?') ||
                  j - 1 > 0           && !grid[i][j - 1].name.startsWith('?') ||
                  j + 1 < grid.length && !grid[i][j + 1].name.startsWith('?') ) {
                slotLabel = 'Discover'
                background = '#70cc7070'
              } else {
                slotLabel = ''
                background = 'radial-gradient(100% 100%, #88778855, #11111111)'
              }
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
                className={slotLabel === '' ? classes.slot : classes.slotWithHover}
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
                <div>{slotLabel && slotLabel !== 'Discover' && slotLabel !== 'TOWN' ? slot.level : ''}</div>
              </Paper>
            )
          })
        })}
        {slotName && <Dialog open={slotSelected} onClose={this.handleClose}>
          <DialogTitle>{slotName}</DialogTitle>
          <DialogContent>
            <DialogContentText>{fieldSlotData[slotName].upgradeText} {resourceRateGainLabel}</DialogContentText>
            <div className={classes.upgradeCostsContainer}>
            <div className={classes.upgradeCostWrapper}>
              <div className={classes.costLabel}>Cost:</div>
              </div>
              <div className={classes.upgradeCostWrapper}>
                <div>Lumber</div>
                <div>{fieldSlotData[slotName][grid[row][column].level + 1].lumberCost}</div>
              </div>
              <div className={classes.upgradeCostWrapper}>
                <div>Iron</div>
                <div>{fieldSlotData[slotName][grid[row][column].level + 1].ironCost}</div>
              </div>
              <div className={classes.upgradeCostWrapper}>
                <div>Clay</div>
                <div>{fieldSlotData[slotName][grid[row][column].level + 1].clayCost}</div>
              </div>
              <div className={classes.upgradeCostWrapper}>
                <div>Wheat</div>
                <div>{fieldSlotData[slotName][grid[row][column].level + 1].wheatCost}</div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleClose}>Cancel</Button>
            <Button
              className={classes.button}
              onClick={() => this.handleSubmit(row, column, grid[row][column].level + 1)}
              disabled={
                lumber < fieldSlotData[slotName][grid[row][column].level + 1].lumberCost ||
                iron   < fieldSlotData[slotName][grid[row][column].level + 1].ironCost   ||
                clay   < fieldSlotData[slotName][grid[row][column].level + 1].clayCost   ||
                wheat  < fieldSlotData[slotName][grid[row][column].level + 1].wheatCost
              }
            >
              Upgrade
            </Button>
          </DialogActions>
        </Dialog>}
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(FieldGrid))
