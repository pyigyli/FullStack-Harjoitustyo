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
        <div>Create account</div>
        <div>
          <TextField
            label='Username'
            value={username}
            onChange={({target}) => this.handleUsernameChange(target.value)}
            margin='normal'
            variant='outlined'
          />
          <TextField
            label='Password'
            type='password'
            value={password}
            autoComplete='current-password'
            onChange={({target}) => this.handlePasswordChange(target.value)}
            margin='normal'
            variant='outlined'
          />
        </div>
        <Button onClick={() => onSubmit(username, password)}>Create Account</Button>
      </div>
    )
  }
}

export default withStyles(styles)(CreateAccountScene)
