import React from 'react'
import TextField from '@material-ui/core/TextField'
import {Button} from '@material-ui/core'

interface Props {
  onSubmit: (username: string, password: string) => void
}

interface State {
  username: string,
  password: string
}

class LoginScene extends React.Component<Props, State> {
  public state = {username: '', password: ''}

  public handleUsernameChange = (value: string) => this.setState({username: value})
  public handlePasswordChange = (value: string) => this.setState({password: value})

  public render() {
    const {onSubmit} = this.props
    const {username, password} = this.state

    return (
      <div>
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
        <Button onClick={() => onSubmit(username, password)}>Login</Button>
      </div>
    )
  }
}

export default LoginScene
