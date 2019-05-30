import React from 'react'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import {Button} from '@material-ui/core'

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
    textAlign: 'center'
  },
  textfield: {
    borderColor: '#321432 !important',
    color: '#321432 !important'
  },
  loginButton: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '30px',
    paddingRight: '30px',
    margin: '30px'
  }
})

interface Props {
  onSubmit: (username: string, password: string) => void
}

interface State {
  username: string
  password: string
}

class LoginScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {username: '', password: ''}

  public handleUsernameChange = (value: string) => this.setState({username: value})
  public handlePasswordChange = (value: string) => this.setState({password: value})

  public render() {
    const {classes, onSubmit} = this.props
    const {username, password} = this.state

    return (
      <div className={classes.sceneContainer}>
        <div className={classes.sceneWrapper}>
        <h1>Welcome back!</h1>
          <div>
            <TextField
              label='Username'
              value={username}
              onChange={({target}) => this.handleUsernameChange(target.value)}
              margin='normal'
              variant='outlined'
              InputLabelProps={{classes: {root: classes.textfield}}}
              InputProps={{classes: {notchedOutline: classes.textfield}}}
            />
            <TextField
              label='Password'
              type='password'
              value={password}
              autoComplete='current-password'
              onChange={({target}) => this.handlePasswordChange(target.value)}
              margin='normal'
              variant='outlined'
              InputLabelProps={{classes: {root: classes.textfield}}}
              InputProps={{classes: {notchedOutline: classes.textfield}}}
            />
          </div>
          <Button className={classes.loginButton} onClick={() => onSubmit(username, password)}>
            Login
          </Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(LoginScene)
