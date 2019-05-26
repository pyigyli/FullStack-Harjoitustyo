import React from 'react'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import {Button} from '@material-ui/core'

const styles = () => createStyles({
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
  createAccountButton: {
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
  username: string,
  password: string
}

class CreateAccountScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {username: '', password: ''}

  public handleUsernameChange = (value: string) => this.setState({username: value})
  public handlePasswordChange = (value: string) => this.setState({password: value})

  public render() {
    const {classes, onSubmit} = this.props
    const {username, password} = this.state

    return (
      <div className={classes.sceneWrapper}>
        <h1>Greetings!</h1>
        <h2>Your empire is waiting to be build!</h2>
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
        <Button
          className={classes.createAccountButton}
          onClick={() => onSubmit(username, password)}
        >
          Create Account
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(CreateAccountScene)
