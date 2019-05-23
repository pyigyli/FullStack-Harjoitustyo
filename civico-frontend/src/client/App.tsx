import React from 'react'
import {Route} from 'react-router-dom'
import LoginScene from './scenes/Login'
import Header from './components/Header'

class App extends React.Component {
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