import React from 'react'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {createStyles, withStyles, WithStyles, Button} from '@material-ui/core'

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
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center'
  },
  title: {
    color: '#552255',
    fontSize: '72px',
    marginBottom: '40px'
  },
  button: {
    fontSize: '30px',
    backgroundColor: '#32143244',
    paddingLeft: '50px',
    paddingRight: '50px',
    paddingTop: '10px',
    paddingDown: '10px',
    marginTop: '30px'
  }
})

class IndexScene extends React.Component<RouteComponentProps & WithStyles<typeof styles>> {
  public render() {
    const {classes, history} = this.props

    return (
      <div className={classes.sceneContainer}>
        <div className={classes.sceneWrapper}>
          <div className={classes.title}>Civico</div>
          <Button className={classes.button} onClick={() => history.push('/login')}>
            Login
          </Button>
          <Button className={classes.button} onClick={() => history.push('/create-account')}>
            Join
          </Button>
        </div>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(IndexScene))
