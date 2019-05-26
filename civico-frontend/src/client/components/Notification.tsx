import React from 'react'

interface Props {
  message: string
}

class Notification extends React.Component<Props> {
  public render() {
    const {message} = this.props

    return (
      <div>
        {message}
      </div>
    )
  }
}

export default Notification
