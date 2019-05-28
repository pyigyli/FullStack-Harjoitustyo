import React from 'react'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import FieldGrid from '../components/FieldGrid';

const styles = () => createStyles({
  sceneWrapper: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
})

interface Props {
  fieldGrid: string[][]
}

class FieldsScene extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {classes, fieldGrid} = this.props

    return (
      <div className={classes.sceneWrapper}>
        <FieldGrid grid={fieldGrid}/>
      </div>
    )
  }
}

export default withStyles(styles)(FieldsScene)
