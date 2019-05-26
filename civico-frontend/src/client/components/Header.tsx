import React from 'react'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TownIcon from '@material-ui/icons/LocationCity'
import FieldsIcon from '@material-ui/icons/Terrain'

const styles = () => createStyles({
  tabsContainer: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  }
})

interface Props {
  token: string
  onLogout: () => void
}

interface State {
  tab: number
}

class Header extends React.Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
  public state = {tab: 0}

  public handleTabChange = (event, newValue) => {
    this.setState({tab: newValue})
  }

  public render() {
    const {classes, history, token, onLogout} = this.props
    const {tab} = this.state

    if (token) {
      return (
        <Paper square className={classes.tabsContainer}>
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<FieldsIcon/>} label="FIELDS" onClick={() => history.push('/fields')}/>
            <Tab icon={<TownIcon/>} label="TOWN" onClick={() => history.push('/town')}/>
            <Tab icon={<TownIcon/>} label="LOGOUT" onClick={() => onLogout()}/>
          </Tabs>
        </Paper>
      )
    }

    return (
      <Paper square className={classes.tabsContainer}>
        <Tabs
          value={tab}
          onChange={this.handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<FieldsIcon/>} label="LOGIN" onClick={() => history.push('/login')}/>
          <Tab icon={<TownIcon/>} label="CREATE ACCOUNT" onClick={() => history.push('/create-account')}/>
        </Tabs>
      </Paper>
    )
  }
}

export default withRouter(withStyles(styles)(Header))
