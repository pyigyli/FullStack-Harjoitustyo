import React from 'react'
import {createStyles, withStyles, WithStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core'
import ScrollArea from 'react-scrollbar'
import {buildingsData} from '../../types/protocol'
import TownGrid from '../components/TownGrid'

const styles = () => createStyles({
  sceneWrapper: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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
  constructionButtonsContainer: {
    position: 'fixed',
    top: '170px',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  lineBreak: {
    position: 'relative',
    width: '80%',
    left: '10%',
    marginTop: '20px',
    marginBottom: '10px',
    borderBottomColor: '#321432',
    borderBottomStyle: 'dashed',
    borderBottomWidth: '1px'
  },
  buildingCostsContainer: {
    width: '500px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '30px',
    paddingTop: '20px',
    paddingBottom: '20px'
  },
  buildingCostWrapper: {
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
    marginLeft: '20px',
    marginRight: '20px'
  },
  closeButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '20px',
    marginBottom: '1px'
  }
})

interface Props {
  lumber: number,
  iron: number,
  clay: number,
  wheat: number,
  buildings: Array<Array<{
    name: string
    level: number
  }>>
  onExpand: () => void
}

interface State {
  buildingsSelectOpen: boolean
}

class TownScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {buildingsSelectOpen: false}

  public handleOpenBuildingSelect = () => this.setState({buildingsSelectOpen: true})

  public handleCloseBuildingSelect = () => this.setState({buildingsSelectOpen: false})

  public handleSubmitBuildingSelect = (selected: number) => {
    this.setState({buildingsSelectOpen: false})
  }

  public render() {
    const {classes, lumber, iron, clay, wheat, buildings, onExpand} = this.props
    const {buildingsSelectOpen} = this.state

    return (
      <div className={classes.sceneWrapper}>
        <div className={classes.constructionButtonsContainer}>
          <Button className={classes.button} onClick={onExpand}>
            Expand
          </Button>
          <Button className={classes.button} onClick={this.handleOpenBuildingSelect}>
            Build
          </Button>
        </div>
        <TownGrid grid={buildings}/>
        <Dialog open={buildingsSelectOpen} onClose={this.handleCloseBuildingSelect}>
          <div className={classes.closeButtonWrapper}>
            <Button className={classes.button} onClick={this.handleCloseBuildingSelect}>
              Cancel
            </Button>
          </div>
          <ScrollArea style={{height: '600px'}}>
            {Object.entries(buildingsData).map((buildingEntry, index) => (
              <div>
                <DialogTitle>
                  {buildingEntry[0]}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {buildingEntry[1].info}
                  </DialogContentText>
                  <div className={classes.buildingCostsContainer}>
                  <div className={classes.buildingCostWrapper}>
                      <div className={classes.costLabel}>Cost:</div>
                    </div>
                    <div className={classes.buildingCostWrapper}>
                      <div>Lumber</div>
                      <div>{buildingEntry[1].lumberCost}</div>
                    </div>
                    <div className={classes.buildingCostWrapper}>
                      <div>Iron</div>
                      <div>{buildingEntry[1].ironCost}</div>
                    </div>
                    <div className={classes.buildingCostWrapper}>
                      <div>Clay</div>
                      <div>{buildingEntry[1].clayCost}</div>
                    </div>
                    <div className={classes.buildingCostWrapper}>
                      <div>Wheat</div>
                      <div>{buildingEntry[1].wheatCost}</div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    className={classes.button}
                    onClick={() => this.handleSubmitBuildingSelect(index)}
                    disabled={
                      lumber < buildingEntry[1].lumberCost ||
                      iron < buildingEntry[1].ironCost ||
                      clay < buildingEntry[1].clayCost ||
                      wheat < buildingEntry[1].wheatCost
                    }
                  >
                    Upgrade
                  </Button>
                </DialogActions>
                <div key={index} className={classes.lineBreak}/>
              </div>
            ))}
          </ScrollArea>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(TownScene)
