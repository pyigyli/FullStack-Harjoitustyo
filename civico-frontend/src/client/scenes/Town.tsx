import React from 'react'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import TownGrid from '../components/TownGrid';

const styles = () => createStyles({
  sceneWrapper: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
})

interface Props {
  townGrid: string[][]
}

class TownScene extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
  const {classes, townGrid} = this.props

  return (
      <div className={classes.sceneWrapper}>
        <TownGrid grid={townGrid}/>
      </div>
    )
  }
}

export default withStyles(styles)(TownScene)
