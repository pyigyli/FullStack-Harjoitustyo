import React from 'react'
import {createStyles, withStyles, WithStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Checkbox, TextField} from '@material-ui/core'
import {InboxMessage} from '../../types/protocol'
import moment from 'moment'

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
    borderRightColor: '#321432aa'
  },
  mapButtonsContainer: {
    position: 'fixed',
    width: '700px',
    top: '140px',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inboxContainer: {
    backgroundColor: '#32143277',
    position: 'relative',
    top: '170px',
    borderStyle: 'solid',
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: '#32143277',
    margin: '20px'
  },
  inboxWrapper: {
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
    verticalAlign: 'middle'
  },
  inboxMessageListContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minHeight: '42px'
  },
  inboxMessageListItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: '10px',
    '&:hover': {
      backgroundColor: '#32143218'
    },
    '&$unread': {
      fontWeight: 'bold'
    }
  },
  unread: {},
  inboxMessageTitle: {
    width: '370px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRightColor: '#32143277',
    borderRightStyle: 'solid',
    borderRightWidth: '1px',
    fontSize: '14px',
    cursor: 'pointer',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    '&$header': {
      fontWeight: 'bold',
      fontSize: '16px',
      paddingLeft: '10px',
      paddingTop: '5px',
      paddingBottom: '5px'
    }
  },
  inboxMessageSender: {
    width: '190px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRightColor: '#32143277',
    borderRightStyle: 'solid',
    borderRightWidth: '1px',
    fontSize: '14px',
    cursor: 'pointer',
    '&$header': {
      fontWeight: 'bold',
      fontSize: '16px',
      paddingTop: '5px',
      paddingBottom: '5px'
    }
  },
  inboxMessageDate: {
    width: '105px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRightColor: '#32143277',
    borderRightStyle: 'solid',
    borderRightWidth: '1px',
    fontSize: '12px',
    '&$header': {
      fontWeight: 'bold',
      fontSize: '16px',
      paddingTop: '5px',
      paddingBottom: '5px'
    }
  },
  inboxMessageCheckbox: {
    width: '70px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: '18px',
    '&$header': {
      fontWeight: 'bold',
      fontSize: '16px',
      paddingTop: '5px',
      paddingBottom: '5px'
    }
  },
  header: {},
  checkbox: {
    color: '#321432',
    '&$checked': {
      color: '#321432bb'
    }
  },
  checked: {},
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '30px',
    paddingRight: '30px',
    marginLeft: '20px',
    marginRight: '20px',
    marginBottom: '5px',
    '&$redButton': {
      background: '#aa2c2caa'
    },
    '&$container': {
      marginLeft: '0px',
      marginRight: '0px'
    }
  },
  redButton: {},
  container: {},
  textfield: {
    width: '500px',
    color: '#321432 !important',
    '&:after': {
      borderColor: '#321432 !important'
    }
  },
  input: {},
  noMessagesLabel: {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
  }
})

interface Props {
  messages: InboxMessage[]
  inboxMessageSent: boolean
  onSetMessagesToRead: (inboxIndexes: number[]) => void 
  onSendInboxMessage: (title: string, receiver: string, messageContent: string) => void
  onDeleteMessages: (newMessageList: InboxMessage[]) => void
}

interface State {
  readMessageOpen: boolean
  selectedMessage: InboxMessage
  title: string
  receiver: string
  messageDraft: string
  messageDraftOpen: boolean
  checkboxes: number[]
  deleteMessagesOpen: boolean
}

class InboxScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    readMessageOpen: false,
    selectedMessage: {sender: '', title: '', receiver: '', message: '', date: new Date(), unread: false},
    title: '',
    receiver: '',
    messageDraft: '',
    messageDraftOpen: false,
    checkboxes: [] as number[],
    deleteMessagesOpen: false
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.inboxMessageSent === false && this.props.inboxMessageSent === true) {
      this.setState({title: '', receiver: '', messageDraft: '', messageDraftOpen: false})
    }
  }

  public handleOpenReadMessage = (selectedMessage: InboxMessage, index: number) => {
    this.setState({readMessageOpen: true, selectedMessage})
    if (selectedMessage.unread) {
      this.props.onSetMessagesToRead([index])
    }
  }

  public handleCloseReadMessage = () => {
    this.setState({
      readMessageOpen: false,
      selectedMessage: {sender: '', title: '', receiver: '', message: '', date: new Date(), unread: false}
    })
  }

  public handleOpenReply = () => {
    this.setState({
      readMessageOpen: false,
      selectedMessage: {sender: '', title: '', receiver: '', message: '', date: new Date(), unread: false},
      messageDraftOpen: true,
      title: `Re: ${this.state.selectedMessage.title}`,
      receiver: this.state.selectedMessage.sender
    })
  }

  public handleOpenDraftMessage = () => this.setState({messageDraftOpen: true})
  public handleCloseDraftMessage = () => this.setState({title: '', receiver: '', messageDraft: '', messageDraftOpen: false})

  public toggleCheckbox = (index: number) => {
    let checkboxes = [...this.state.checkboxes]
    if (checkboxes.includes(index)) {
      checkboxes = checkboxes.filter((value: number) => value !== index)
    } else {
      checkboxes.push(index)
    }
    this.setState({checkboxes})
  }

  public handleSelectAll = () => {
    if (this.state.checkboxes.length !== this.props.messages.length) {
      this.setState({checkboxes: [...Array(this.props.messages.length).keys()]})
    } else {
      this.setState({checkboxes: []})
    }
  }

  public handleOpenDeleteMessages = () => this.setState({deleteMessagesOpen: true})
  public handleCloseDeleteMessages = () => this.setState({deleteMessagesOpen: false})

  public handleDeleteMessages = () => {
    const newMessageList = this.props.messages.filter((message, index: number) => !this.state.checkboxes.includes(index))
    this.props.onDeleteMessages(newMessageList)
    this.setState({checkboxes: [], deleteMessagesOpen: false})
  }

  public handleTitleChange = (value: string) => this.setState({title: value})
  public handleReceiverChange = (value: string) => this.setState({receiver: value})
  public handleMessageDraftChange = (value: string) => this.setState({messageDraft: value})

  public render() {
    const {classes, messages, onSetMessagesToRead, onSendInboxMessage} = this.props
    const {readMessageOpen, selectedMessage, messageDraftOpen, title, receiver, messageDraft, checkboxes, deleteMessagesOpen} = this.state

    return (
      <div className={classes.sceneWrapper}>
        <div className={classes.mapButtonsContainer}>
          <Button className={`${classes.button} ${classes.container}`} onClick={this.handleOpenDraftMessage}>New Message</Button>
          <Button className={`${classes.button} ${classes.container}`} onClick={this.handleSelectAll}>Select all</Button>
          <Button
            className={`${classes.button} ${classes.container}`}
            onClick={() => onSetMessagesToRead(checkboxes)}
            disabled={checkboxes.length === 0}
          >
            Mark as read
          </Button>
          <Button
            className={`${classes.button} ${classes.container}`}
            onClick={this.handleOpenDeleteMessages}
            disabled={checkboxes.length === 0}
          >
            Delete
          </Button>
        </div>
        <div className={classes.inboxContainer}>
          <div className={classes.inboxWrapper}>
            <div className={`${classes.inboxMessageTitle}    ${classes.header}`}>Title</div>
            <div className={`${classes.inboxMessageSender}   ${classes.header}`}>Sender</div>
            <div className={`${classes.inboxMessageDate}     ${classes.header}`}>Date</div>
            <div className={`${classes.inboxMessageCheckbox} ${classes.header}`}>Select</div>
          </div>
          <div className={classes.inboxWrapper}>
            <div className={classes.inboxMessageListContainer}>
              {messages.length > 0 ? messages.map((message: InboxMessage, index: number) => 
                <div key={index} className={`${classes.inboxMessageListItem} ${message.unread ? classes.unread : ''}`}>
                  <div className={classes.inboxMessageTitle} onClick={() => this.handleOpenReadMessage(message, index)}>{message.title}</div>
                  <div className={classes.inboxMessageSender} /*TODO open profile page */>{message.sender}</div>
                  <div className={classes.inboxMessageDate}>
                    <div>{moment(message.date).format('HH:mm')}</div>
                    <div>{moment(message.date).format('MMM.D.YYYY')}</div>
                  </div>
                  <div className={classes.inboxMessageCheckbox}>
                  <Checkbox
                    className={`${classes.checkbox} ${checkboxes.includes(index) ? classes.checked : ''}`}
                    checked={checkboxes.includes(index)}
                    onClick={() => this.toggleCheckbox(index)}
                  />
                  </div>
                </div>
              ) : <div className={classes.noMessagesLabel}>It's empty</div>}
            </div>
          </div>
        </div>
          {messages.length > 0 && <Dialog open={readMessageOpen} onClose={this.handleCloseReadMessage}>
          <DialogTitle style={{wordWrap: 'break-word'}}>
            <div>Send by: {selectedMessage.sender}</div>
            <div>{selectedMessage.title}</div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{wordWrap: 'break-word'}}>{selectedMessage.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleCloseReadMessage}>Close</Button>
            <Button className={classes.button} onClick={this.handleOpenReply} disabled={false}>Reply</Button>
          </DialogActions>
        </Dialog>}
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
                InputProps={{classes: {root: classes.textfield, focused: classes.textfield}}}
                InputLabelProps={{classes: {root: classes.textfield, focused: classes.textfield}}}
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
        <Dialog open={deleteMessagesOpen} onClose={this.handleCloseDeleteMessages}>
          <DialogTitle>Delete {checkboxes.length} selected message{checkboxes.length > 1 ? 's' : ''}?</DialogTitle>
          <DialogActions>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <Button className={classes.button} onClick={this.handleCloseDeleteMessages}>Cancel</Button>
              <Button className={`${classes.button} ${classes.redButton}`} onClick={this.handleDeleteMessages}>Confirm</Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(InboxScene)
