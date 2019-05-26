import React from 'react'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TownIcon from '@material-ui/icons/LocationCity'
import FieldsIcon from '@material-ui/icons/Terrain'
import MapIcon from '@material-ui/icons/Map'
import InboxIcon from '@material-ui/icons/Inbox'
import LogoutIcon from '@material-ui/icons/ExitToApp'

const styles = () => createStyles({
  tabsContainer: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    color: '#321432'
  },
  tabIndicator: {
    color: '#321432',
    backgroundColor: '#321432aa'
  }
})

interface Props {
  token: string
  onLogout: () => void
}

interface State {
  tab: number | boolean
}

class Header extends React.Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
  public state = {tab: false}

  public handleTabChange = (event: object, newValue: number) => {
    this.setState({tab: newValue === 4 ? 0 : newValue})
  }

  public render() {
    const {classes, history, token, onLogout} = this.props
    const {tab} = this.state

    if (token) {
      return (
        <Paper square className={classes.tabsContainer}>
          <Tabs
            classes={{indicator: classes.tabIndicator}}
            value={tab} onChange={this.handleTabChange}
            variant='fullWidth'
          >
            <Tab icon={<FieldsIcon/>} label='FIELDS'  onClick={() => history.push('/fields')}/>
            <Tab icon={<TownIcon/>}   label='TOWN'    onClick={() => history.push('/town')}/>
            <Tab icon={<MapIcon/>}    label='MAP'     onClick={() => history.push('/map')}/>
            <Tab icon={<InboxIcon/>}  label='INBOX'   onClick={() => history.push('/inbox')}/>
            <Tab icon={<LogoutIcon/>} label='LOGOUT'  onClick={() => onLogout()}/>
          </Tabs>
        </Paper>
      )
    }

    return (
      <Paper square className={classes.tabsContainer}>
        <Tabs
          classes={{indicator: classes.tabIndicator}}
          value={tab} onChange={this.handleTabChange}
          variant='fullWidth'
        >
          <Tab icon={<FieldsIcon/>} label='LOGIN'           onClick={() => history.push('/login')}/>
          <Tab icon={<TownIcon/>}   label='CREATE ACCOUNT'  onClick={() => history.push('/create-account')}/>
        </Tabs>
      </Paper>
    )
  }
}

export default withRouter(withStyles(styles)(Header))
