import React from 'react'
import {Button} from '@material-ui/core'

class Header extends React.Component {
  public render() {
    return (
      <div>
        <Button>
          Login
        </Button>
        <Button>
          Create account
        </Button>
      </div>
    )
  }
}

export default Header