import React from 'react'
import {
  createStyles,
  withStyles,
  WithStyles,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from '@material-ui/core'
import {GridSlot, Troops} from '../../types/protocol'
import FieldGrid from '../components/FieldGrid'
import TroopsOnMove from '../components/TroopsOnMove'

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
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '25px',
    paddingRight: '25px',
    margin: '30px'
  },
  textfield: {
    borderColor: '#321432 !important',
    color: '#321432 !important',
    '&:after': {
      borderColor: '#321432 !important'
    }
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
  troopsOnMove: Array<{
    headingBack: boolean
    target: string | null
    troops: Troops
    travelTime: number
    arrivalTime: number
  }>
  onFieldLevelUp: (row: number, column: number, newLevel: number) => void
  onSendTroops: (target: null, troopsToSend: Troops, travelTime: number) => void
}

interface State {
  openDiscoverMenu: boolean
  selectedRow: number
  selectedColumn: number
  troopsToSendValues: Troops
}

class FieldsScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    openDiscoverMenu: false,
    selectedRow: 0,
    selectedColumn: 0,
    troopsToSendValues: {'Knife Boy': 0, Spearman: 0, Swordsman: 0, 'Donkey Rider': 0, Jouster: 0, 'Dark Knight': 0}
  }

  public handleOpenDiscoverMenu = (row: number, column: number) => {
    this.setState({openDiscoverMenu: true, selectedRow: row, selectedColumn: column})
  }

  public handleCloseDiscoverMenu = () => this.setState({openDiscoverMenu: false})

  public handleTroopsToSendAmountChange = (troopType: string, newValue: number) => {
    newValue = newValue >= 0 ? newValue : 0
    newValue = newValue <= this.props.troops[troopType] ? newValue : this.props.troops[troopType]
    this.setState({troopsToSendValues: {...this.state.troopsToSendValues, [troopType]: newValue}})
  }

  public handleSendTroops = () => {
    this.props.onSendTroops(null, this.state.troopsToSendValues, 600000)
    this.setState({openDiscoverMenu: false})
  }

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
      troopsOnMove,
      onFieldLevelUp
    } = this.props
    const {openDiscoverMenu, troopsToSendValues} = this.state
    const troops = Object.entries(this.props.troops).filter(entry => entry[1] !== 0)

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
        {troops.length > 0 && <Paper className={classes.infoBoxContainer} style={{top: '175px'}}>
          <span style={{marginBottom: '5px'}}>Troops in town</span>
          {troops.map((entry, index: number) => 
            <div key={index} className={classes.infoBoxWrapper} style={{justifyContent: 'space-between', marginLeft: '15px', marginRight: '15px'}}>
              <div>{entry[0]}</div>
              <div>{entry[1]}</div>
            </div>
          )}
        </Paper>}
        {troopsOnMove.length > 0 && <TroopsOnMove troopsOnMove={troopsOnMove}/>}
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
            <DialogContentText>Send your troops to conquer uncharted land. What lies there is uncertain, so prepare well.</DialogContentText>
            {troops.map((entry, index: number) => 
              <div key={index} className={classes.infoBoxWrapper}>
                <div style={{fontWeight: 'bold', width: '130px'}}>{entry[0]}:</div>
                <div style={{marginRight: '10px'}}>{entry[1]} unit{entry[1] === 1 ? '' : 's'} available.</div>
                <div style={{marginRight: '10px'}}>Select for sending:</div>
                <TextField
                  type='number'
                  value={troopsToSendValues[entry[0]]}
                  onChange={({target}) => this.handleTroopsToSendAmountChange(entry[0], parseInt(target.value, 10))}
                  style={{width: '100px', bottom: '5px'}}
                  InputProps={{classes: {root: classes.textfield}}}
                  InputLabelProps={{classes: {root: classes.textfield}}}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleCloseDiscoverMenu}>Cancel</Button>
            <Button
              className={classes.button}
              onClick={this.handleSendTroops}
              disabled={troops.length === 0 && Object.values(troopsToSendValues).filter((value: number) => value !== 0).length > 0}
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
