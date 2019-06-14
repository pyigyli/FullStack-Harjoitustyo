import React from 'react'
import {createStyles, withStyles, WithStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core'
import ScrollArea from 'react-scrollbar'
import {cloneDeep} from 'lodash'
import {GridSlot, buildingsData} from '../../types/protocol'
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
    paddingTop: '10px',
    paddingBottom: '10px'
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
    marginRight: '20px',
    marginBottom: '5px',
    '&$redButton': {
      background: '#aa2c2caa'
    }
  },
  redButton: {},
  closeButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '20px',
    marginBottom: '1px'
  },
  buildingInfoTitleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
})

interface Props {
  lumber: number,
  iron: number,
  clay: number,
  wheat: number,
  buildings: GridSlot[][]
  onPlaceBuilding: (buildings: GridSlot[][], newBuildingName: string, moving: boolean) => void
  onBuildingLevelUp: (row: number, column: number, newLevel: number) => void
  onDeleteBuilding: (buildings: GridSlot[][], removedBuilding: GridSlot) => void
  onExpand: () => void
}

interface State {
  buildingsSelectOpen: boolean
  newBuildingName: string
  newBuildingWidth: number
  newBuildingHeight: number
  newBuildingRow: number
  newBuildingColumn: number
  buildingMenuName: string
  buildingMenuLevel: number
  buildingMenuRow: number
  buildingMenuColumn: number
  buildingsOnMoving: GridSlot[][] | null
  buildingDeleteConfirmOpen: boolean
}

class TownScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    buildingsSelectOpen: false,
    newBuildingName: '',
    newBuildingWidth: 0,
    newBuildingHeight: 0,
    newBuildingRow: 0,
    newBuildingColumn: 0,
    buildingMenuName: '',
    buildingMenuLevel: 1,
    buildingMenuRow: 0,
    buildingMenuColumn: 0,
    buildingsOnMoving: null,
    buildingDeleteConfirmOpen: false
  }

  public handleOpenBuildingSelect = () => this.setState({buildingsSelectOpen: true})

  public handleCloseBuildingSelect = () => this.setState({buildingsSelectOpen: false})

  public handleSubmitBuildingSelect = (key: string) => {
    this.setState({
      buildingsSelectOpen: false,
      newBuildingName: key,
      newBuildingWidth: buildingsData[key].width,
      newBuildingHeight: buildingsData[key].height
    })
  }

  public cancelBuildingPlacement = () => {
    this.setState({
      newBuildingName: '',
      newBuildingWidth: 0,
      newBuildingHeight: 0,
      newBuildingRow: 0,
      newBuildingColumn: 0,
      buildingsOnMoving: null
    })
  }

  public rotateBuilding = () => {
    this.setState({
      newBuildingWidth: this.state.newBuildingHeight,
      newBuildingHeight: this.state.newBuildingWidth
    })
  }

  public handleDragStop = (row: number, column: number) => {
    this.setState({newBuildingRow: row, newBuildingColumn: column})
  }

  public handlePlaceBuilding = () => {
    const buildings = this.state.buildingsOnMoving || this.props.buildings
    for (let i = 0; i < this.state.newBuildingWidth; i++) {
      for (let j = 0; j < this.state.newBuildingHeight; j++) {
        buildings[this.state.newBuildingColumn + j][this.state.newBuildingRow + i] = {
          name: this.state.newBuildingName,
          level: this.state.buildingMenuLevel
        }
      }
    }
    this.props.onPlaceBuilding(buildings, this.state.newBuildingName, !!this.state.buildingsOnMoving)
    this.setState({
      newBuildingName: '',
      newBuildingWidth: 0,
      newBuildingHeight: 0,
      newBuildingRow: 0,
      newBuildingColumn: 0,
      buildingMenuLevel: 1,
      buildingsOnMoving: null
    })
  }

  public handleOpenBuildingMenu = (buildingName: string, row: number, column: number) => {
    if (buildingName !== 'EMPTY' && this.state.newBuildingWidth === 0) {
      this.setState({
        buildingMenuName: buildingName,
        buildingMenuLevel: this.props.buildings[row][column].level,
        buildingMenuRow: row,
        buildingMenuColumn: column
      })
    }
  }
  
  public handleMoveBuilding = () => {
    const grid = cloneDeep(this.props.buildings)
    const {buildingMenuName} = this.state
    for (const row of grid) {
      for (const slot of row) {
        if (slot.name === buildingMenuName) {
          slot.name = 'EMPTY'
        }
      }
    }
    this.setState({
      newBuildingName: buildingMenuName,
      newBuildingWidth: buildingsData[buildingMenuName].width,
      newBuildingHeight: buildingsData[buildingMenuName].height,
      newBuildingRow: 0,
      newBuildingColumn: 0,
      buildingMenuName: '',
      buildingMenuRow: 0,
      buildingMenuColumn: 0,
      buildingsOnMoving: grid
    })
  }

  public handleSubmitBuildingUpgrade = () => {
    const {buildingMenuLevel, buildingMenuRow, buildingMenuColumn} = this.state
    this.props.onBuildingLevelUp(buildingMenuRow, buildingMenuColumn, buildingMenuLevel + 1)
    this.setState({buildingMenuName: ''})
  }

  public handleDeleteBuilding = () => {
    const {buildings} = this.props
    const {buildingMenuName, buildingMenuLevel} = this.state
    for (const row of buildings) {
      for (const slot of row) {
        if (slot.name === buildingMenuName) {
          slot.name = 'EMPTY'
        }
      }
    }
    this.props.onDeleteBuilding(buildings, {name: buildingMenuName, level: buildingMenuLevel})
    this.setState({buildingMenuName: '', buildingDeleteConfirmOpen: false})
  }

  public handleCloseBuildingMenu = () => this.setState({buildingMenuName: ''})

  public handleOpenBuildingDeleteConfirm = () => this.setState({buildingDeleteConfirmOpen: true})

  public handleCloseBuildingDeleteConfirm = () => this.setState({buildingDeleteConfirmOpen: false})

  public render() {
    const {classes, lumber, iron, clay, wheat, buildings, onExpand} = this.props
    const {
      buildingsSelectOpen,
      newBuildingWidth,
      newBuildingHeight,
      newBuildingRow,
      newBuildingColumn,
      buildingMenuName,
      buildingMenuLevel,
      buildingsOnMoving,
      buildingDeleteConfirmOpen
    } = this.state
    const grid: GridSlot[][] = buildingsOnMoving || buildings

    let placeBuildingDisabled: boolean = false
    for (let i = newBuildingColumn; i < newBuildingColumn + newBuildingHeight; i++) {
      for (let j = newBuildingRow; j < newBuildingRow + newBuildingWidth; j++) {
        if (i >= grid.length || j >= grid.length || grid[i][j].name !== 'EMPTY') {
          placeBuildingDisabled = true
        }
      }
    }

    return (
      <div className={classes.sceneWrapper}>
        {newBuildingWidth > 0 && newBuildingHeight > 0 ? (
          <div className={classes.constructionButtonsContainer}>
            <Button className={classes.button} onClick={this.cancelBuildingPlacement}>
              Cancel
            </Button>
            <Button
              className={classes.button}
              onClick={this.rotateBuilding}
              disabled={newBuildingWidth === newBuildingHeight}
            >
              Rotate
            </Button>
            <Button
              className={classes.button}
              onClick={this.handlePlaceBuilding}
              disabled={placeBuildingDisabled}
            >
              Confirm
            </Button>
          </div>
        ) : (
          <div className={classes.constructionButtonsContainer}>
            {grid.length < 6 && (
              <Button className={classes.button} onClick={onExpand}>
                Expand
              </Button>
            )}
            <Button className={classes.button} onClick={this.handleOpenBuildingSelect}>
              Build
            </Button>
          </div>
        )}
        <TownGrid
          grid={grid}
          newBuildingWidth={newBuildingWidth}
          newBuildingHeight={newBuildingHeight}
          newBuildingRow={newBuildingRow}
          newBuildingColumn={newBuildingColumn}
          placeBuildingDisabled={placeBuildingDisabled}
          onDragStop={this.handleDragStop}
          onOpenBuildingMenu={this.handleOpenBuildingMenu}
        />
        <Dialog open={buildingsSelectOpen} onClose={this.handleCloseBuildingSelect}>
          <div className={classes.closeButtonWrapper}>
            <Button className={classes.button} onClick={this.handleCloseBuildingSelect}>
              Cancel
            </Button>
          </div>
          <ScrollArea style={{minWidth: '500px', minHeight: '200px', maxHeight: '600px'}}>
            {Object.entries(buildingsData).filter(buildingEntry => {
              let keepBuilding: boolean = true
              grid.forEach((row: GridSlot[]) => {
                if (row.map((slot: GridSlot) => slot.name).includes(buildingEntry[0])) {
                  keepBuilding = false
                }
              })
              return keepBuilding
            }).map((buildingEntry, index) => (
              <div key={index}>
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
                    onClick={() => this.handleSubmitBuildingSelect(buildingEntry[0])}
                    disabled={
                      lumber < buildingEntry[1].lumberCost ||
                      iron < buildingEntry[1].ironCost ||
                      clay < buildingEntry[1].clayCost ||
                      wheat < buildingEntry[1].wheatCost
                    }
                  >
                    Select {buildingEntry[0]} for building
                  </Button>
                </DialogActions>
                <div className={classes.lineBreak}/>
              </div>
            ))}
          </ScrollArea>
        </Dialog>
        <Dialog open={buildingMenuName.length > 0} onClose={this.handleCloseBuildingSelect}>
          {buildingMenuName && (
            <div>
              <DialogTitle>
                <div className={classes.buildingInfoTitleWrapper}>
                  <div>
                    {buildingMenuName}
                  </div>
                  <div style={{fontSize: '18px', marginTop: '2px', marginLeft: '25px'}}>
                    level {buildingMenuLevel}
                  </div>
                </div>
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {buildingsData[buildingMenuName].info}
                </DialogContentText>
                <div className={classes.buildingCostsContainer}>
                  <div className={classes.buildingCostWrapper}>
                    <div className={classes.costLabel}>Upgrade cost:</div>
                  </div>
                  <div className={classes.buildingCostWrapper}>
                    <div>Lumber</div>
                    <div>{buildingsData[buildingMenuName].upgrade[buildingMenuLevel].lumberCost}</div>
                  </div>
                  <div className={classes.buildingCostWrapper}>
                    <div>Iron</div>
                    <div>{buildingsData[buildingMenuName].upgrade[buildingMenuLevel].ironCost}</div>
                  </div>
                  <div className={classes.buildingCostWrapper}>
                    <div>Clay</div>
                    <div>{buildingsData[buildingMenuName].upgrade[buildingMenuLevel].clayCost}</div>
                  </div>
                  <div className={classes.buildingCostWrapper}>
                    <div>Wheat</div>
                    <div>{buildingsData[buildingMenuName].upgrade[buildingMenuLevel].wheatCost}</div>
                  </div>
                </div>
                <div className={classes.buildingCostsContainer}>
                  <div className={classes.buildingCostWrapper}>
                    <div className={classes.costLabel}>Moving cost:</div>
                  </div>
                  <div className={classes.buildingCostWrapper}>
                    <div>Lumber</div>
                    <div>
                      {Math.floor(buildingsData[buildingMenuName].upgrade[buildingMenuLevel].lumberCost / 5)}
                    </div>
                  </div>
                  <div className={classes.buildingCostWrapper}>
                    <div>Iron</div>
                    <div>
                      {Math.floor(buildingsData[buildingMenuName].upgrade[buildingMenuLevel].ironCost / 5)}
                    </div>
                  </div>
                  <div className={classes.buildingCostWrapper}>
                    <div>Clay</div>
                    <div>
                      {Math.floor(buildingsData[buildingMenuName].upgrade[buildingMenuLevel].clayCost / 5)}
                    </div>
                  </div>
                  <div className={classes.buildingCostWrapper}>
                    <div>Wheat</div>
                    <div>
                      {Math.floor(buildingsData[buildingMenuName].upgrade[buildingMenuLevel].wheatCost / 5)}
                    </div>
                  </div>
                </div>
              </DialogContent>
              <DialogActions>
                <Button className={classes.button} onClick={this.handleCloseBuildingMenu}>
                  Cancel
                </Button>
                <Button
                  className={classes.button}
                  onClick={this.handleMoveBuilding}
                  disabled={
                    lumber < Math.floor(buildingsData[buildingMenuName].upgrade[buildingMenuLevel].lumberCost / 5) ||
                    iron < Math.floor(buildingsData[buildingMenuName].upgrade[buildingMenuLevel].ironCost / 5) ||
                    clay < Math.floor(buildingsData[buildingMenuName].upgrade[buildingMenuLevel].clayCost / 5) ||
                    wheat < Math.floor(buildingsData[buildingMenuName].upgrade[buildingMenuLevel].wheatCost / 5)
                  }
                >
                  Move
                </Button>
                <Button
                  className={classes.button}
                  onClick={this.handleSubmitBuildingUpgrade}
                  disabled={
                    lumber < buildingsData[buildingMenuName].upgrade[buildingMenuLevel].lumberCost ||
                    iron < buildingsData[buildingMenuName].upgrade[buildingMenuLevel].ironCost ||
                    clay < buildingsData[buildingMenuName].upgrade[buildingMenuLevel].clayCost ||
                    wheat < buildingsData[buildingMenuName].upgrade[buildingMenuLevel].wheatCost
                  }
                >
                  Upgrade
                </Button>
                <Button className={`${classes.button} ${classes.redButton}`} onClick={this.handleOpenBuildingDeleteConfirm}>
                  Destruct
                </Button>
                <Dialog open={buildingDeleteConfirmOpen} onClose={this.handleCloseBuildingSelect}>
                  <DialogTitle>
                    Are you sure you want to destruct this building?
                  </DialogTitle>
                  <DialogActions>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                      <Button className={classes.button} onClick={this.handleCloseBuildingDeleteConfirm}>
                        Cancel
                      </Button>
                      <Button className={`${classes.button} ${classes.redButton}`} onClick={this.handleDeleteBuilding}>
                        Confirm
                      </Button>
                    </div>
                  </DialogActions>
                </Dialog>
              </DialogActions>
            </div>
          )}
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(TownScene)