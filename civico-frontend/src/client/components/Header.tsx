import React from 'react'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {Button} from '@material-ui/core'

interface Props {
  token: string
  onLogout: () => void
}

class Header extends React.Component<Props & RouteComponentProps> {

  public render() {
    const {history, token, onLogout} = this.props

    if (token) {
      return (
        <div>
          <Button onClick={() => history.push('/town')}>Town</Button>
          <Button onClick={() => onLogout()}>Logout</Button>
        </div>
      )
    }

    return (
      <div>
        <Button onClick={() => history.push('/login')}>Login</Button>
        <Button onClick={() => history.push('/create-account')}>Create account</Button>
      </div>
    )
  }
}

export default withRouter(Header)
