import React from 'react'
import {createStyles, withStyles, WithStyles, Dialog, DialogTitle, DialogActions, Button} from '@material-ui/core'
import {UserProfile} from '../../types/protocol'

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
    borderRightColor: '#321432aa',
    overflow: 'auto'
  },
  profileWrapper: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '25px',
    paddingRight: '25px',
    marginLeft: '15px',
    marginRight: '15px',
    marginBottom: '5px',
    '&$redButton': {
      background: '#aa2c2caa'
    }
  },
  redButton: {},
  textfield: {
    width: '500px',
    color: '#321432 !important',
    '&:after': {
      borderColor: '#321432 !important'
    }
  }
})

interface Props {
  selfUsername: string
  profile: UserProfile | null
  onDeleteAccount: () => void
}

interface State {
  deleteAccountOpen: boolean
}

class ProfileScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {deleteAccountOpen: false}

  public handleDeleteAccount = () => this.props.onDeleteAccount()
  public handleOpenDeleteAccount  = () => this.setState({deleteAccountOpen: true})
  public handleCloseDeleteAccount = () => this.setState({deleteAccountOpen: false})

  public render() {
    if (this.props.profile === null) {
      return <div className={this.props.classes.sceneWrapper}/>
    }
  
    const {classes, selfUsername} = this.props
    const {username, population, bio} = this.props.profile
    const {deleteAccountOpen} = this.state

    return (
      <div className={classes.sceneWrapper}>
        <div className={classes.profileWrapper}>
          <div>{selfUsername === username ? 'it be you' : username}</div>
          <div>{population}</div>
          <div>{bio}</div>
        </div>
        <Button className={`${classes.button} ${classes.redButton}`} onClick={this.handleOpenDeleteAccount}>Confirm</Button>
        <Dialog open={deleteAccountOpen} onClose={this.handleCloseDeleteAccount}>
          <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
          <DialogActions>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <Button className={classes.button} onClick={this.handleCloseDeleteAccount}>Cancel</Button>
              <Button className={`${classes.button} ${classes.redButton}`} onClick={this.handleDeleteAccount}>Confirm</Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(ProfileScene)
