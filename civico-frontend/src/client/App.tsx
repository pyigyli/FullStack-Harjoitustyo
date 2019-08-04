import React from 'react'
import {Route, withRouter, RouteComponentProps} from 'react-router-dom'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import {
  Message,
  LoginMessage,
  LogoutMessage,
  CreateAccountMessage,
  DeleteAccountMessage,
  GetUserDataMessage,
  FieldLevelUpMessage,
  PlaceBuildingMessage,
  BuildingLevelUpMessage,
  DeleteBuildingMessage,
  ExpandTownMessage,
  GetMapMessage,
  GetMapSlotMessage,
  SetInboxMessagesToReadMessage,
  SendInboxMessage,
  DeleteInboxMessage,
  TogglePacifismMessage,
  TrainTroopsMessage,
  GridSlot,
  MapSlot,
  InboxMessage,
  Troops,
  SendTroopsMessage,
  DispatchedTroops,
  UserProfile,
  GetProfileMessage,
  ChangeBioMessage
} from '../types/protocol'
import CreateAccountScene from './scenes/CreateAccount'
import FieldsScene from './scenes/Fields'
import InboxScene from './scenes/Inbox'
import IndexScene from './scenes/Index'
import LoginScene from './scenes/Login'
import MapScene from './scenes/Map'
import TownScene from './scenes/Town'
import ProfileScene from './scenes/Profile'
import Header from './components/Header'
import Notification from './components/Notification'
import ProfileBar from './components/ProfileBar'

const styles = () => createStyles({
  root: {
    width: '100%',
    height: '100%',
    background: 'radial-gradient(80% 100%, #78377877, #321432dd)',
    color: '#321432'
  },
  pageContainer: {
    width: '50%'
  }
})

interface State {
  connection: WebSocket | null
  token: string
  username: string
  population: number
  lumber: number
  iron: number
  clay: number
  wheat: number
  maxLumber: number
  maxIron: number
  maxClay: number
  maxWheat: number
  lumberRate: number
  ironRate: number
  clayRate: number
  wheatRate: number
  fields: GridSlot[][]
  buildings: GridSlot[][]
  mapCoordinates: number[]
  map: string[][]
  selectedMapSlotData: MapSlot
  inbox: InboxMessage[]
  inboxMessageSent: boolean
  troops: Troops
  troopsOnMove: DispatchedTroops[]
  errorMessage: string
  userProfile: UserProfile | null
  pacifist: boolean
  pacifismDisabledUntil: number
  preventDataFetch: boolean
}

const NULL_STATE: State = {
  connection: null,
  token: '',
  username: '',
  population: 0,
  lumber: 0,
  iron: 0,
  clay: 0,
  wheat: 0,
  maxLumber: 0,
  maxIron: 0,
  maxClay: 0,
  maxWheat: 0,
  lumberRate: 0,
  ironRate: 0,
  clayRate: 0,
  wheatRate: 0,
  fields: [[{name: '', level: 0}]],
  buildings: [[{name: '', level: 0}]],
  mapCoordinates: [0, 0],
  map: [['']],
  selectedMapSlotData: {username: '', population: 0, pacifist: false},
  inbox: [],
  inboxMessageSent: false,
  troops: {'Knife Boy': 0, Spearman: 0, Swordsman: 0, 'Donkey Rider': 0, Jouster: 0, 'Dark Knight': 0},
  troopsOnMove: [],
  errorMessage: '',
  userProfile: null,
  pacifist: true,
  pacifismDisabledUntil: Date.now(),
  preventDataFetch: false
}

class App extends React.Component<RouteComponentProps & WithStyles<typeof styles>, State> {
  public state = {...NULL_STATE}
  public errorTimer: NodeJS.Timeout

  public componentWillMount() {
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
      const message: Message = JSON.parse(evt.data)
      switch (message.type) {
        case 'TOKEN':
          this.setState({token: message.token, username: message.username})
          if (message.token) {
            this.props.history.push('/fields')
          } else {
            this.props.history.push('/login')
          }
          break
        case 'SEND_DATA':
          this.setState({
            population: message.population,
            lumber: message.lumber,
            iron: message.iron,
            clay: message.clay,
            wheat: message.wheat,
            maxLumber: message.maxLumber,
            maxIron: message.maxIron,
            maxClay: message.maxClay,
            maxWheat: message.maxWheat,
            lumberRate: message.lumberRate,
            ironRate: message.ironRate,
            clayRate: message.clayRate,
            wheatRate: message.wheatRate,
            fields: message.fields,
            buildings: message.buildings,
            mapCoordinates: message.mapCoordinates,
            inbox: message.inbox,
            troops: message.troops,
            troopsOnMove: message.troopsOnMove,
            pacifist: message.pacifist,
            pacifismDisabledUntil: new Date(message.pacifismDisabledUntil).getTime(),
            preventDataFetch: false
          })
          break
        case 'SEND_PROFILE':
          this.setState({userProfile: message.userProfile})
          break
        case 'SEND_MAP':
          this.setState({map: message.map})
          break
        case 'SEND_MAPSLOT':
          this.setState({selectedMapSlotData: {
            username: message.username,
            population: message.population,
            pacifist: message.pacifist
          }})
          break
        case 'CONFIRM_INBOX':
            if (message.successful) {
              this.setState({inboxMessageSent: true})
            } else {
              this.handleErrorNotification('Could not find matching username.')
              this.setState({inboxMessageSent: false})
            }
            break
        case 'ERROR':
          this.handleErrorNotification(message.message)
          this.setState({preventDataFetch: false})
          break
        default:
          console.error('Server sent a message of unknown type.') // tslint:disable-line:no-console
          break
      }
    })
  }

  public handleErrorNotification = (message: string) => {
    clearInterval(this.errorTimer)
    this.setState({errorMessage: message})
    this.errorTimer = setInterval(() => {
      this.setState({errorMessage: '', inboxMessageSent: false})
      clearInterval(this.errorTimer)
    }, 5000)
  }

  public handleLogin = (username: string, password: string) => {
    const {connection} = this.state
    if (connection) {
      const message: LoginMessage = {type: 'LOGIN', username, password}
      connection.send(JSON.stringify(message))
    }
  }

  public handleLogout = () => {
    this.setState({token: ''})
    const {connection, token} = this.state
    if (connection) {
      const message: LogoutMessage = {type: 'LOGOUT', token}
      connection.send(JSON.stringify(message))
    }
    this.props.history.push('/')
  }

  public handleCreateAccount = (username: string, password: string) => {
    const {connection} = this.state
    if (connection) {
      if (username.length > 2 && username.length < 13 && password.length > 4) {
        const message: CreateAccountMessage = {type: 'CREATE_ACCOUNT', username, password}
        connection.send(JSON.stringify(message))
      } else if (username.length < 3 && username.length < 13 && password.length < 5) {
        this.handleErrorNotification('Username and password too short. Please provide lengths of at least 3 and 5')
      } else if (username.length < 3) {
        this.handleErrorNotification('Username must be at least 3 characters long.')
      } else if (username.length > 12) {
        this.handleErrorNotification('Username cannot be over 12 characters long.')
      } else {
        this.handleErrorNotification('Password must be at least 5 characters long.')
      }
    }
  }

  public handleDeleteAccount = () => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: DeleteAccountMessage = {type: 'DELETE_ACCOUNT', token}
      connection.send(JSON.stringify(message))
      this.setState({token: ''})
      this.props.history.push('/')
    }
  }

  public handleGetUserData = () => {
    const {connection, token, preventDataFetch} = this.state
    if (connection && token && !preventDataFetch) {
      this.setState({preventDataFetch: true})
      const message: GetUserDataMessage = {type: 'GET_USERDATA', token}
      connection.send(JSON.stringify(message))
    }
  }

  public handleGetProfile = (user: string | null) => {
    const {connection, token} = this.state
    if (connection && token) {
      const username = user || this.state.username
      const message: GetProfileMessage = {type: 'GET_PROFILE', token, username}
      connection.send(JSON.stringify(message))
      this.props.history.push(`/user/${username}`)
    }
  }

  public handleChangeBio = (newBio: string[]) => {
    const {connection, token,} = this.state
    if (connection && token) {
      const message: ChangeBioMessage = {type: 'CHANGE_BIO', token, newBio}
      connection.send(JSON.stringify(message))
    }
  }

  public handleFieldLevelUp = (row: number, column: number, newLevel: number) => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: FieldLevelUpMessage = {type: 'FIELD_LEVELUP', token, row, column, newLevel}
      connection.send(JSON.stringify(message))
    }
  }

  public handlePlaceBuilding = (buildings: GridSlot[][], newBuildingName: string, moving: boolean) => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: PlaceBuildingMessage = {type: 'BUILDING_PLACE', token, buildings, newBuildingName, moving}
      connection.send(JSON.stringify(message))
    }
  }

  public handleBuildingLevelUp = (row: number, column: number, newLevel: number) => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: BuildingLevelUpMessage = {type: 'BUILDING_LEVELUP', token, row, column, newLevel}
      connection.send(JSON.stringify(message))
    }
  }

  public handleDeleteBuilding = (buildings: GridSlot[][], removedBuilding: GridSlot) => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: DeleteBuildingMessage = {type: 'BUILDING_DELETE', token, buildings, removedBuilding}
      connection.send(JSON.stringify(message))
    }
  }

  public handleTownExpand = () => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: ExpandTownMessage = {type: 'EXPAND_TOWN', token}
      connection.send(JSON.stringify(message))
    }
  }

  public handleGetMap = () => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: GetMapMessage = {type: 'GET_MAP', token}
      connection.send(JSON.stringify(message))
    }
  }

  public handleGetMapSlot = (username: string) => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: GetMapSlotMessage = {type: 'GET_MAPSLOT', token, username}
      connection.send(JSON.stringify(message))
    }
  }

  public handleSetMessagesToRead = (inboxIndexes: number[]) => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: SetInboxMessagesToReadMessage = {type: 'READ_INBOX', token, inboxIndexes}
      connection.send(JSON.stringify(message))
    }
  }

  public handleSendInboxMessage = (title: string, receiver: string, messageContent: string) => {
    const {connection, token, username} = this.state
    if (connection && token && title && receiver && messageContent) {
      const inboxMessage: InboxMessage = {
        sender: username,
        title,
        receiver,
        message: messageContent.split('\n'),
        date: Date.now(),
        unread: true
      }
      const message: SendInboxMessage = {type: 'SEND_INBOX', token, inboxMessage}
      connection.send(JSON.stringify(message))
    } else {
      this.handleErrorNotification('All fields must be filled.')
    }
  }

  public handleDeleteInboxMessages = (newMessageList: InboxMessage[]) => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: DeleteInboxMessage = {type: 'DELETE_INBOX', token, newMessageList}
      connection.send(JSON.stringify(message))
    }
  }

  public handleTogglePacifism = (disabledDays: number) => {
    const {connection, token, pacifist} = this.state
    if (connection && token) {
      const message: TogglePacifismMessage = {type: 'PACIFISM', token, pacifist: !pacifist, disabledDays}
      connection.send(JSON.stringify(message))
    }
  }

  public handleTrainTroops = (troopType: string, amountToTrain: number) => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: TrainTroopsMessage = {type: 'TRAIN_TROOPS', token, troopType, amountToTrain}
      connection.send(JSON.stringify(message))
    }
  }

  public handleSendTroops = (target: string | number[], troopsToSend: Troops, travelTime: number) => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: SendTroopsMessage = {type: 'SEND_TROOPS', token, sender: this.state.username, target, troopsToSend, travelTime}
      connection.send(JSON.stringify(message))
    }
  }

  public render() {
    const {classes} = this.props
    const {
      token,
      username,
      population,
      lumber,
      iron,
      clay,
      wheat,
      maxLumber,
      maxIron,
      maxClay,
      maxWheat,
      lumberRate,
      ironRate,
      clayRate,
      wheatRate,
      fields,
      buildings,
      map,
      mapCoordinates,
      selectedMapSlotData,
      inbox,
      inboxMessageSent,
      troops,
      troopsOnMove,
      errorMessage,
      userProfile,
      pacifist,
      pacifismDisabledUntil
    } = this.state

    return (
      <div className={classes.root}>
        <Header
          token={token}
          username={username}
          unreadMessages={Object.values(inbox).filter((message: InboxMessage) => message.unread).length > 0}
          onLogout={this.handleLogout}
          onGetUserData={this.handleGetUserData}
        />
        <Notification message={errorMessage}/>
        <Route exact path='/' render={() => <IndexScene/>}/>
        <Route exact path='/login' render={() => <LoginScene onSubmit={this.handleLogin}/>}/>
        <Route exact path='/create-account' render={() => <CreateAccountScene onSubmit={this.handleCreateAccount}/>}/>
        <Route exact path={['/fields', '/town', '/map', '/inbox', '/user/:username']} render={() => 
          token && <ProfileBar
            population={population}
            lumber={lumber}
            iron={iron}
            clay={clay}
            wheat={wheat}
            maxLumber={maxLumber}
            maxIron={maxIron}
            maxClay={maxClay}
            maxWheat={maxWheat}
            onGetProfile={this.handleGetProfile}
          />
        }/>
        <Route exact path='/fields' render={() =>
          token ? <FieldsScene
            username={username}
            population={population}
            lumber={lumber}
            iron={iron}
            clay={clay}
            wheat={wheat}
            lumberRate={lumberRate}
            ironRate={ironRate}
            clayRate={clayRate}
            wheatRate={wheatRate}
            fields={fields}
            troops={troops}
            troopsOnMove={troopsOnMove}
            updatePage={this.handleGetUserData}
            onFieldLevelUp={this.handleFieldLevelUp}
            onSendTroops={this.handleSendTroops}
          /> : <LoginScene onSubmit={this.handleLogin}/>
        }/>
        <Route exact path='/town' render={() =>
          token ? <TownScene
            lumber={lumber}
            iron={iron}
            clay={clay}
            wheat={wheat}
            netWheatRate={wheatRate - population}
            buildings={buildings}
            pacifist={pacifist}
            pacifismDisabledUntil={pacifismDisabledUntil}
            onPlaceBuilding={this.handlePlaceBuilding}
            onDeleteBuilding={this.handleDeleteBuilding}
            onBuildingLevelUp={this.handleBuildingLevelUp}
            onExpand={this.handleTownExpand}
            onTogglePacifism={this.handleTogglePacifism}
            onTrainTroops={this.handleTrainTroops}
          /> : <LoginScene onSubmit={this.handleLogin}/>
        }/>
        <Route exact path='/map' render={() =>
          token ? <MapScene
            username={username}
            map={map}
            selfCoordinates={mapCoordinates}
            selectedMapSlotData={selectedMapSlotData}
            troops={troops}
            pacifist={pacifist}
            onGetMap={this.handleGetMap}
            onGetMapSlot={this.handleGetMapSlot}
            onSendTroops={this.handleSendTroops}
            onGetProfile={this.handleGetProfile}
          /> : <LoginScene onSubmit={this.handleLogin}/>
        }/>
        <Route exact path='/inbox' render={() =>
          token ? <InboxScene
            messages={inbox}
            inboxMessageSent={inboxMessageSent}
            onSetMessagesToRead={this.handleSetMessagesToRead}
            onSendInboxMessage={this.handleSendInboxMessage}
            onDeleteMessages={this.handleDeleteInboxMessages}
          /> : <LoginScene onSubmit={this.handleLogin}/>
        }/>
        <Route exact path='/user/:username' render={() =>
          token ? <ProfileScene
            selfUsername={username}
            profile={userProfile}
            inboxMessageSent={inboxMessageSent}
            onDeleteAccount={this.handleDeleteAccount}
            onChangeBio={this.handleChangeBio}
            onSendInboxMessage={this.handleSendInboxMessage}
          /> : <LoginScene onSubmit={this.handleLogin}/>
        }/>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(App))
