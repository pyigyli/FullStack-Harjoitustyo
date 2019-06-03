import React from 'react'
import {createStyles, withStyles, WithStyles, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core'
import {fieldSlotData} from '../../types/protocol'

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
  grid: Array<Array<{name: string, level: number}>>
  handleFieldLevelUp: (row: number, column: number, newLevel: number) => void
}

interface State {
  slotSelected: boolean
  row: number
  column: number
}

class FieldGrid extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    slotSelected: false,
    row: 0,
    column: 0
  }

  public handleOpen(row: number, column: number) {
    this.setState({
      slotSelected: true,
      row,
      column
    })
  }

  public handleClose = () => this.setState({slotSelected: false})

  public handleSubmit = (row: number, column: number, newLevel: number) => {
    this.props.handleFieldLevelUp(row, column, newLevel)
    this.setState({slotSelected: false})
  }

  public render() {
    const {classes, grid} = this.props
    const {slotSelected, row, column} = this.state
    const width = 100
    const height = 100
    const margin = 5
    const slotName = grid[row][column].name.includes('?') ? grid[row][column].name.substr(1) : grid[row][column].name
    let resourceRateGainLabel: string = ''
    if (slotName) {
      if (fieldSlotData[slotName][grid[row][column].level + 1].lumberRateGain > 0) {
        resourceRateGainLabel = `${fieldSlotData[slotName][grid[row][column].level + 1].lumberRateGain / 3600000} lumber / hour.`
      } else if (fieldSlotData[slotName][grid[row][column].level + 1].ironRateGain > 0) {
        resourceRateGainLabel = `${fieldSlotData[slotName][grid[row][column].level + 1].ironRateGain / 3600000} iron / hour.`
      } else if (fieldSlotData[slotName][grid[row][column].level + 1].clayRateGain > 0) {
        resourceRateGainLabel = `${fieldSlotData[slotName][grid[row][column].level + 1].clayRateGain / 3600000} clay / hour.`
      } else if (fieldSlotData[slotName][grid[row][column].level + 1].wheatRateGain > 0) {
        resourceRateGainLabel = `${fieldSlotData[slotName][grid[row][column].level + 1].wheatRateGain / 3600000} wheat / hour.`
      }
    }

    return (
      <div className={classes.root}>
        {grid.map((gridRow, i) => {
          return gridRow.map((slot, j) => {
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
                <div>{slotLabel && slotLabel !== 'Discover' && slotLabel !== 'TOWN' ? slot.level : ''}</div>
              </Paper>
            )
          })
        })}
        {slotName && <Dialog open={slotSelected} onClose={this.handleClose}>
          <DialogTitle>
            {slotName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {fieldSlotData[slotName].upgradeText} {resourceRateGainLabel}
            </DialogContentText>
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
            <Button className={classes.button} onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              className={classes.button}
              onClick={() => this.handleSubmit(row, column, grid[row][column].level + 1)}
            >
              Upgrade
            </Button>
          </DialogActions>
        </Dialog>}
      </div>
    )
  }
}

export default withStyles(styles)(FieldGrid)
