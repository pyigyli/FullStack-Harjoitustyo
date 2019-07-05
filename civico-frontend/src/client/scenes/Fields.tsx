import React from 'react'
import {createStyles, withStyles, WithStyles, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core'
import FieldGrid from '../components/FieldGrid'
import {GridSlot, Troops} from '../../types/protocol'

const styles = () => createStyles({
  sceneWrapper: {
    position: 'fixed',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    width: '800px',
    height: '100%',
    backgroundColor: '#fffafa',
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
    borderLeftWidth: '10px',
    borderRightWidth: '10px',
    borderLeftColor: '#321432aa',
    borderRightColor: '#321432aa'
  },
  infoBoxContainer: {
    width: '170px',
    fontSize: '13px',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#eeddff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    left: '50%',
    transform: 'translate(-215%, 0%)',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderStyle: 'solid',
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: '#32143277'
  },
  infoBoxWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  resourceRateValueWrapper: {
    width: '30px',
    textAlign: 'right'
  },
  resourceRateTextWrapper: {
    width: '93px',
    textAlign: 'right'
  },
  troopsRateWrapper: {

  },
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '25px',
    paddingRight: '25px',
    margin: '30px'
  }
})

interface Props {
  population: number
  lumber: number
  iron: number
  clay: number
  wheat: number
  lumberRate: number
  ironRate: number
  clayRate: number
  wheatRate: number
  fields: GridSlot[][]
  troops: Troops
  onFieldLevelUp: (row: number, column: number, newLevel: number) => void
}

interface State {
  openDiscoverMenu: boolean
  selectedRow: number
  selectedColumn: number
}

class FieldsScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    openDiscoverMenu: false,
    selectedRow: 0,
    selectedColumn: 0
  }

  public handleOpenDiscoverMenu = (row: number, column: number) => {
    this.setState({openDiscoverMenu: true, selectedRow: row, selectedColumn: column})
  }

  public handleCloseDiscoverMenu = () => this.setState({openDiscoverMenu: false})

  public render() {
    const {
      classes,
      population,
      lumber,
      iron,
      clay,
      wheat,
      lumberRate,
      ironRate,
      clayRate,
      wheatRate,
      fields,
      troops,
      onFieldLevelUp
    } = this.props
    const {openDiscoverMenu} = this.state

    return (
      <div className={classes.sceneWrapper}>
        <Paper className={classes.infoBoxContainer} style={{top: '150px'}}>
          <span style={{marginBottom: '5px'}}>Resource rates</span>
          <div className={classes.infoBoxWrapper}>
            <div className={classes.resourceRateValueWrapper}>{lumberRate}</div>
            <div className={classes.resourceRateTextWrapper}>lumber / hour</div>
          </div>
          <div className={classes.infoBoxWrapper}>
            <div className={classes.resourceRateValueWrapper}>{ironRate}</div>
            <div className={classes.resourceRateTextWrapper}>iron / hour</div>
          </div>
          <div className={classes.infoBoxWrapper}>
            <div className={classes.resourceRateValueWrapper}>{clayRate}</div>
            <div className={classes.resourceRateTextWrapper}>clay / hour</div>
          </div>
          <div className={classes.infoBoxWrapper}>
            <div className={classes.resourceRateValueWrapper}>{wheatRate - population}</div>
            <div className={classes.resourceRateTextWrapper}>wheat / hour</div>
          </div>
        </Paper>
        {Object.values(troops).filter((value: number) => value !== 0).length > 0 &&
          <Paper className={classes.infoBoxContainer} style={{top: '175px'}}>
            <span style={{marginBottom: '5px'}}>Troops in town</span>
            {Object.entries(troops).map(entry => 
              <div className={classes.infoBoxWrapper} style={{justifyContent: 'space-between', marginLeft: '15px', marginRight: '15px'}}>
                <div>{entry[0]}</div>
                <div>{entry[1]}</div>
              </div>
            )}
          </Paper>
        }
        <FieldGrid
          lumber={lumber}
          iron={iron}
          clay={clay}
          wheat={wheat}
          grid={fields}
          netWheatRate={wheatRate - population}
          onFieldLevelUp={onFieldLevelUp}
          onOpenDiscoverMenu={this.handleOpenDiscoverMenu}
        />
        <Dialog open={openDiscoverMenu} onClose={this.handleCloseDiscoverMenu}>
          <DialogTitle>Discover a new field</DialogTitle>
          <DialogContent>
            <DialogContentText>Send your troops to conquer uncharted land.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleCloseDiscoverMenu}>Cancel</Button>
            <Button
              className={classes.button}
              onClick={this.handleCloseDiscoverMenu}
              disabled={false}
              // TODO send troops to discover
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(FieldsScene)
