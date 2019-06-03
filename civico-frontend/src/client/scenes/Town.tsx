import React from 'react'
import {createStyles, withStyles, WithStyles, Button} from '@material-ui/core'
import TownGrid from '../components/TownGrid'

const styles = () => createStyles({
  sceneContainer: {
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
  sceneWrapper: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  constructionButtonsContainer: {
    position: 'fixed',
    top: '-300px'
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
  buildings: Array<Array<{
    name: string
    level: number
  }>>
  onExpand: () => void
}

class TownScene extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {classes, buildings, onExpand} = this.props

    return (
      <div className={classes.sceneContainer}>
        <div className={classes.sceneWrapper}>
          <div className={classes.constructionButtonsContainer}>
            <Button className={classes.button} onClick={onExpand}>
              Expand
            </Button>
          </div>
          <TownGrid grid={buildings}/>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(TownScene)
