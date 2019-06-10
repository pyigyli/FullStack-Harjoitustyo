import React from 'react'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import MapGrid from '../components/MapGrid'

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
  }
})

interface Props {
  map: string[][]
  selfCoordinates: number[]
  mapCoordinates: number[]
  onGetMap: () => void
}

class MapScene extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {classes, map, selfCoordinates, mapCoordinates, onGetMap} = this.props

    return (
      <div className={classes.sceneContainer}>
        <div className={classes.sceneWrapper}>
          <MapGrid
            map={map}
            selfCoordinates={selfCoordinates}
            x={mapCoordinates[0]}
            y={mapCoordinates[1]}
            onGetMap={onGetMap}
          />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(MapScene)
