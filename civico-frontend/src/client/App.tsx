import React from 'react'
import {Route, withRouter, RouteComponentProps} from 'react-router-dom'
import {Message, LoginMessage, LogoutMessage, CreateAccountMessage} from '../types/protocol'
import CreateAccountScene from './scenes/CreateAccount'
import IndexScene from './scenes/Index'
import LoginScene from './scenes/Login'
import TownScene from './scenes/Town'
import Header from './components/Header'

interface State {
  connection: WebSocket | null,
  token: string
}

const NULL_STATE: State = {
  connection: null,
  token: ''
}

class App extends React.Component<RouteComponentProps, State> {
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
        case 'AUTHORIZE':
          window.localStorage.setItem('civico-token', message.token)
          this.setState({token: message.token})
          this.props.history.push('/town')
          break
        default:
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
    const {token} = this.state
    
    return (
      <div>
        <Header token={token} onLogout={this.handleLogout}/>
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

export default withRouter(App)
