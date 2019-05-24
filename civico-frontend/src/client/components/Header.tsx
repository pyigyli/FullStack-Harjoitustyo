import React from 'react'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {Button} from '@material-ui/core'

class Header extends React.Component<RouteComponentProps> {

  public toLoginPage() {
    this.props.history.push('/login')
  }

  public toCreateAccountPage() {
    this.props.history.push('/create-account')
  }

  public render() {
    return (
      <div>
        <Button onClick={() => this.toLoginPage()}>
          Login
        </Button>
        <Button onClick={() => this.toCreateAccountPage()}>
          Create account
        </Button>
      </div>
    )
  }
}

export default withRouter(Header)