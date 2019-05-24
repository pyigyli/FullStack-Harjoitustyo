import React from 'react'
import {Route} from 'react-router-dom'
import {Message, LoginMessage} from './types/protocol'
import LoginScene from './scenes/Login'
import Header from './components/Header'

interface State {
	connection: WebSocket | null
}

const NULL_STATE: State = {
	connection: null
}

class App extends React.Component<{}, State> {
	public state = {...NULL_STATE}

	public componentDidMount() {
		this.connect()
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
			const msg: Message = JSON.parse(evt.data)
			switch (msg.type) {
				default:
					break
			}
		})
	}

	public handleSendTextMessage = (username: string, password: string) => {
		const {connection} = this.state
		if (connection) {
			const protocolMessage: LoginMessage = {
				type: 'LOGIN',
				username,
				password
			}
			connection.send(JSON.stringify(protocolMessage))
		}
	}

	public render() {
    return (
      <div>
        <Header/>
        <Route path='/login' render={() => <LoginScene/>}/>
      </div>
    )
  }
}

export default App