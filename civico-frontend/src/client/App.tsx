import React from 'react'
import {Route} from 'react-router-dom'
import {Message} from './types/protocol'
import LoginScene from './scenes/Login'
import Header from './components/Header'

interface State {
  connection: WebSocket | null
}

class App extends React.Component<{}, State> {
  public state = {connection: null}

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
			this.setState({connection: null})
			this.connect()
		})

		connection.addEventListener('message', evt => {
			const msg: Message = JSON.parse(evt.data)
			console.log(msg)
    })
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