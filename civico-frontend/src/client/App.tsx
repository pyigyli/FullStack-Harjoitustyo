import React from 'react'
import {Route} from 'react-router-dom'
import {Message, LoginMessage, CreateAccountMessage} from '../types/protocol'
import CreateAccountScene from './scenes/CreateAccount'
import IndexScene from './scenes/Index'
import LoginScene from './scenes/Login'
import Header from './components/Header'

interface State {
	connection: WebSocket | null,
	token: string
}

const NULL_STATE: State = {
	connection: null,
	token: ''
}

class App extends React.Component<{}, State> {
	public state = {...NULL_STATE}

	public componentDidMount() {
		this.connect()
		const token = window.localStorage.getItem('civico-token')
		if (token) {
			this.setState({token})
			// TODO this.handleSendLoginFromCookiesMessage(token)
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
				case 'AUTH':
					this.setState({token: message.token})
					window.localStorage.setItem('civico-token', message.token)
					break
				default:
					break
			}
		})
	}

	public handleSendLoginMessage = (username: string, password: string) => {
		const {connection} = this.state
		if (connection) {
			const message: LoginMessage = {
				type: 'LOGIN',
				username,
				password
			}
			connection.send(JSON.stringify(message))
		}
	}

	public handleSendCreateAccountMessage = (username: string, password: string) => {
		const {connection} = this.state
		if (connection) {
			const message: CreateAccountMessage = {
				type: 'CREATE_ACCOUNT',
				username,
				password
			}
			connection.send(JSON.stringify(message))
		}
	}

	public render() {
    return (
      <div>
        <Header/>
        <Route exact path='/' render={() =>
					<IndexScene/>
				}/>
        <Route exact path='/login' render={() =>
					<LoginScene onSubmit={this.handleSendLoginMessage}/>
				}/>
        <Route exact path='/create-account' render={() =>
					<CreateAccountScene onSubmit={this.handleSendCreateAccountMessage}/>
				}/>
      </div>
    )
  }
}

export default App