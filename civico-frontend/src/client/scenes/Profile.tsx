import React from 'react'
import {createStyles, withStyles, WithStyles, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField} from '@material-ui/core'
import {UserProfile} from '../../types/protocol'

const styles = () => createStyles({
  sceneWrapper: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '100%',
    backgroundColor: '#fffafa',
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
    borderLeftWidth: '10px',
    borderRightWidth: '10px',
    borderLeftColor: '#321432aa',
    borderRightColor: '#321432aa',
    overflow: 'auto'
  },
  buttonsContainer: {
    position: 'fixed',
    top: '140px',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#32143277',
    position: 'relative',
    top: '170px',
    borderStyle: 'solid',
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: '#32143277',
    margin: '20px'
  },
  profileWrapper: {
    width: '400px',
    backgroundColor: '#fffdfd',
    borderStyle: 'solid',
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: '#32143277',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    margin: '3px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    verticalAlign: 'middle',
    '&$left': {
      marginRight: '1px'
    },
    '&$right': {
      marginLeft: '1px'
    }
  },
  left: {},
  right: {},
  profileRow: {
    width: 'parent',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '5px',
    borderBottomColor: '#321432',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    fontWeight: 'bold',
    '&$link': {
      cursor: 'pointer',
      textDecoration: 'underline',
      '&:hover': {
        backgroundColor: '#32143218'
      }
    }
  },
  link: {},
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '25px',
    paddingRight: '25px',
    marginLeft: '15px',
    marginRight: '15px',
    marginBottom: '5px',
    '&$redButton': {
      background: '#aa2c2caa'
    }
  },
  redButton: {},
  textfield: {
    width: '500px',
    color: '#321432 !important',
    '&:after': {
      borderColor: '#321432 !important'
    }
  }
})

interface Props {
  selfUsername: string
  profile: UserProfile | null
  inboxMessageSent: boolean
  onDeleteAccount: () => void
  onChangeBio: (newBio: string[]) => void
  onSendInboxMessage: (title: string, receiver: string, messageContent: string) => void
}

interface State {
  deleteAccountOpen: boolean
  bioChangeOpen: boolean
  newBio: string
  title: string
  receiver: string
  messageDraft: string
  messageDraftOpen: boolean
}

class ProfileScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    deleteAccountOpen: false,
    bioChangeOpen: false,
    newBio: '',
    title: '',
    receiver: '',
    messageDraft: '',
    messageDraftOpen: false
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.inboxMessageSent === false && this.props.inboxMessageSent === true) {
      this.setState({title: '', receiver: '', messageDraft: '', messageDraftOpen: false})
    }
  }

  public handleOpenDeleteAccount  = () => this.setState({deleteAccountOpen: true})
  public handleCloseDeleteAccount = () => this.setState({deleteAccountOpen: false})

  public handleOpenBioChange  = () => {
    const profile = Object.values(this.props.profile ? this.props.profile.bio : [])
    this.setState({
      bioChangeOpen: true,
      newBio: profile.reduce((draft: string, line: string) => draft += line.length > 0 ? `${line}\n` : '\n', '')
    })
  }

  public handleCloseBioChange = () => this.setState({bioChangeOpen: false})

  public handleNewBioChange = (newBio: string) => this.setState({newBio})

  public handleChangeBio = () => {
    this.props.onChangeBio(this.state.newBio.split('\n'))
    this.setState({bioChangeOpen: false})
  }

  public handleOpenDraftMessage = () => this.setState({messageDraftOpen: true, receiver: this.props.profile ? this.props.profile.username : ''})
  public handleCloseDraftMessage = () => this.setState({title: '', receiver: '', messageDraft: '', messageDraftOpen: false})

  public handleTitleChange = (value: string) => this.setState({title: value})
  public handleReceiverChange = (value: string) => this.setState({receiver: value})
  public handleMessageDraftChange = (value: string) => this.setState({messageDraft: value})

  public render() {
    if (this.props.profile === null) {
      return <div className={this.props.classes.sceneWrapper}/>
    }
  
    const {classes, selfUsername, onDeleteAccount, onSendInboxMessage} = this.props
    const {username, population, bio} = this.props.profile
    const {deleteAccountOpen, bioChangeOpen, newBio, messageDraftOpen, title, receiver, messageDraft} = this.state

    return (
      <div className={classes.sceneWrapper}>
        {username === selfUsername && <div className={classes.buttonsContainer}>
          <Button className={classes.button} onClick={this.handleOpenBioChange}>Change bio</Button>
          <Button className={`${classes.button} ${classes.redButton}`} onClick={this.handleOpenDeleteAccount}>Delete account</Button>
        </div>}
        <div className={classes.profileContainer}>
          <div className={`${classes.profileWrapper} ${classes.left}`}>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
              <div className={classes.profileRow}>Username: {username}</div>
              <div className={classes.profileRow}>Town population: {population}</div>
              {username !== selfUsername &&<div
                className={`${classes.profileRow} ${classes.link}`}
                onClick={this.handleOpenDraftMessage}
              >
                Send message
              </div>}
            </div>
          </div>
          <div className={`${classes.profileWrapper} ${classes.right}`}>
            <div style={{width: '350px', wordWrap: 'break-word'}}>
              {Object.values(bio).map((line: string, index: number) => <p key={index} style={{margin: '5px'}}>{line}<br/></p>)}
            </div>
          </div>
        </div>
        <Dialog open={deleteAccountOpen} onClose={this.handleCloseDeleteAccount}>
          <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
          <DialogActions>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <Button className={classes.button} onClick={this.handleCloseDeleteAccount}>Cancel</Button>
              <Button className={`${classes.button} ${classes.redButton}`} onClick={onDeleteAccount}>Confirm</Button>
            </div>
          </DialogActions>
        </Dialog>
        <Dialog open={bioChangeOpen} onClose={this.handleCloseBioChange}>
          <DialogTitle>Draft your bio</DialogTitle>
          <DialogContent>
            <TextField
              label='Message'
              value={newBio}
              onChange={({target}) => this.handleNewBioChange(target.value)}
              margin='normal'
              variant='filled'
              InputProps={{classes: {root: classes.textfield}}}
              InputLabelProps={{classes: {root: classes.textfield}}}
              multiline
              rows={10}
            />
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleCloseBioChange}>Cancel</Button>
            <Button className={classes.button} onClick={this.handleChangeBio}>Confirm</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={messageDraftOpen} onClose={this.handleCloseDraftMessage}>
          <DialogTitle>Draft a new message</DialogTitle>
          <DialogContent>
            <div>
              <TextField
                label='Title'
                value={title}
                onChange={({target}) => this.handleTitleChange(target.value)}
                margin='normal'
                variant='filled'
                InputProps={{classes: {root: classes.textfield}}}
                InputLabelProps={{classes: {root: classes.textfield}}}
              />
            </div>
            <div>
              <TextField
                label='Send to'
                value={receiver}
                onChange={({target}) => this.handleReceiverChange(target.value)}
                margin='normal'
                variant='filled'
                InputProps={{classes: {root: classes.textfield}}}
                InputLabelProps={{classes: {root: classes.textfield}}}
              />
            </div>
            <TextField
              label='Message'
              value={messageDraft}
              onChange={({target}) => this.handleMessageDraftChange(target.value)}
              margin='normal'
              variant='filled'
              InputProps={{classes: {root: classes.textfield}}}
              InputLabelProps={{classes: {root: classes.textfield}}}
              multiline
              rows={10}
            />
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleCloseDraftMessage}>Cancel</Button>
            <Button className={classes.button} onClick={() => onSendInboxMessage(title, receiver, messageDraft)}>Send</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(ProfileScene)
