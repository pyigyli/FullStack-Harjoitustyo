import React from 'react'
import {createStyles, withStyles, WithStyles, Paper} from '@material-ui/core'
import FieldGrid from '../components/FieldGrid'

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
  resourceRatesContainer: {
    width: '170px',
    fontSize: '13px',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#eeddff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    top: '150px',
    left: '50%',
    transform: 'translate(-225%, 0%)',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderStyle: 'solid',
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: '#32143277'
  },
  resourceRateWrapper: {
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
  }
})

interface Props {
  population: number
  fields: Array<Array<{
    name: string
    level: number
  }>>
  lumberRate: number
  ironRate: number
  clayRate: number
  wheatRate: number
  handleFieldLevelUp: (row: number, column: number, newLevel: number) => void
}

class FieldsScene extends React.Component<Props & WithStyles<typeof styles>> {
  public render() {
    const {classes, population, fields, lumberRate, ironRate, clayRate, wheatRate, handleFieldLevelUp} = this.props

    return (
      <div className={classes.sceneWrapper}>
        <Paper className={classes.resourceRatesContainer}>
          <div className={classes.resourceRateWrapper}>
            <div className={classes.resourceRateValueWrapper}>
              {lumberRate}
            </div>
            <div className={classes.resourceRateTextWrapper}>lumber / hour</div>
          </div>
          <div className={classes.resourceRateWrapper}>
            <div className={classes.resourceRateValueWrapper}>
              {ironRate}
            </div>
            <div className={classes.resourceRateTextWrapper}>iron / hour</div>
          </div>
          <div className={classes.resourceRateWrapper}>
            <div className={classes.resourceRateValueWrapper}>
              {clayRate}
            </div>
            <div className={classes.resourceRateTextWrapper}>clay / hour</div>
          </div>
          <div className={classes.resourceRateWrapper}>
            <div className={classes.resourceRateValueWrapper}>
              {wheatRate - population}
            </div>
            <div className={classes.resourceRateTextWrapper}>wheat / hour</div>
          </div>
        </Paper>
        <FieldGrid
          grid={fields}
          handleFieldLevelUp={handleFieldLevelUp}
        />
      </div>
    )
  }
}

export default withStyles(styles)(FieldsScene)
