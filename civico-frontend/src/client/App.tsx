import React from 'react'
import {Route, withRouter, RouteComponentProps} from 'react-router-dom'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import {Message, LoginMessage, LogoutMessage, CreateAccountMessage} from '../types/protocol'
import CreateAccountScene from './scenes/CreateAccount'
import IndexScene from './scenes/Index'
import LoginScene from './scenes/Login'
import TownScene from './scenes/Town'
import Header from './components/Header'
import Notification from './components/Notification'

const styles = () => createStyles({
  appCointainer: {
    backgroundColor: '#cccccc'
  }
})

interface State {
  connection: WebSocket | null,
  token: string,
  errorMessage: string
}

const NULL_STATE: State = {
  connection: null,
  token: '',
  errorMessage: ''
}

class App extends React.Component<RouteComponentProps & WithStyles<typeof styles>, State> {
  public state = {...NULL_STATE}

  public componentDidMount() {
    this.connect()
    const token = window.localStorage.getItem('civico-token')
    if (token) {
      this.setState({token})
    }
  }

  public componentWillUnmount() {
    const connection = this.state.connection
    if (connection) {
      connection.close()
    }
  }

  public connect() {
    const connection = new WebSocket(window.env.WS_API_URL || 'ws://localhost:3000')

    connection.addEventListener('open', () => {
      this.setState({connection})
    })

    connection.addEventListener('close', () => {
      this.setState(NULL_STATE)
      this.connect()
    })

    connection.addEventListener('message', evt => {
      const message: Message = JSON.parse(evt.data)
      switch (message.type) {
        case 'TOKEN':
          this.setState({token: message.token})
          if (message.token) {
            window.localStorage.setItem('civico-token', message.token)
            this.props.history.push('/town')
          } else {
            window.localStorage.removeItem('civico-token')
            this.props.history.push('/login')
          }
          break
        case 'ERROR':
          this.setState({errorMessage: message.message})
          setTimeout(() => this.setState({errorMessage: ''}), 5000)
          break
        default:
          console.error('Server sent a message of unknown type.') // tslint:disable-line:no-console
          break
      }
    })
  }

  public handleLogin = (username: string, password: string) => {
    const {connection} = this.state
    if (connection) {
      const message: LoginMessage = {type: 'LOGIN', username, password}
      connection.send(JSON.stringify(message))
    }
  }

  public handleLogout = () => {
    window.localStorage.removeItem('civico-token')
    this.setState({token: ''})
    const {connection, token} = this.state
    if (connection) {
      const message: LogoutMessage = {type: 'LOGOUT', token}
      connection.send(JSON.stringify(message))
    }
    this.props.history.push('/')
  }

  public handleCreateAccount = (username: string, password: string) => {
    const {connection} = this.state
    if (connection) {
      const message: CreateAccountMessage = {type: 'CREATE_ACCOUNT', username, password}
      connection.send(JSON.stringify(message))
    }
  }

  public render() {
    const {classes} = this.props
    const {token, errorMessage} = this.state
    
    return (
      <div className={classes.appCointainer}>
        <Header token={token} onLogout={this.handleLogout}/>
        {errorMessage && <Notification message={errorMessage}/>}
        <Route exact path='/' render={() =>
          <IndexScene/>
        }/>
        <Route exact path='/login' render={() =>
          <LoginScene onSubmit={this.handleLogin}/>
        }/>
        <Route exact path='/create-account' render={() =>
          <CreateAccountScene onSubmit={this.handleCreateAccount}/>
        }/>
        <Route exact path='/town' render={() =>
          token ? <TownScene/> : <LoginScene onSubmit={this.handleLogin}/>
        }/>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(App))
