import React from 'react'
import {createStyles, withStyles, WithStyles, Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, TextField} from '@material-ui/core'
import {InboxMessage} from '../../types/protocol'

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
    padding: '10px',
    margin: '3px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  inboxMessageTitle: {
    width: '400px',
    textAlign: 'left',
    borderRightColor: '#32143277',
    borderRightStyle: 'solid',
    borderRightWidth: '1px',
    fontWeight: 'bold'
  },
  inboxMessageAuthor: {
    width: '190px',
    textAlign: 'center',
    borderRightColor: '#32143277',
    borderRightStyle: 'solid',
    borderRightWidth: '1px',
    fontWeight: 'bold'
  },
  inboxMessageDate: {
    width: '100px',
    textAlign: 'center',
    borderRightColor: '#32143277',
    borderRightStyle: 'solid',
    borderRightWidth: '1px',
    fontWeight: 'bold'
  },
  inboxMessageCheckbox: {
    width: '60px',
    textAlign: 'right',
    fontWeight: 'bold'
  },
  checkbox: {
    color: '#321432',
    '&$checked': {
      color: '#321432'
    }
  },
  button: {
    backgroundColor: '#32143244',
    color: '#321432',
    paddingLeft: '30px',
    paddingRight: '30px',
    marginLeft: '20px',
    marginRight: '20px',
    marginBottom: '5px'
  },
  textfield: {
    borderColor: '#321432 !important',
    color: '#321432 !important'
  }
})

interface Props {
  messages: InboxMessage[]
  onSendInboxMessage: (title: string, receiver: string, messageContent: string) => void
}

interface State {
  title: string
  receiver: string
  messageDraft: string
  messageDraftOpen: boolean
  checkboxes: number[]
}

class InboxScene extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    title: '',
    receiver: '',
    messageDraft: '',
    messageDraftOpen: false,
    checkboxes: [-1]
  }

  public handleOpenDraftMessage = () => this.setState({messageDraftOpen: true})
  
  public handleCloseDraftMessage = () => this.setState({messageDraftOpen: false})

  public toggleCheckbox = (index: number) => {
    const {checkboxes} = this.state
    if (checkboxes.includes(index)) {
      checkboxes.filter((value: number) => value === index)
    } else {
      checkboxes.push(index)
    }
    this.setState({checkboxes})
  }

  public handleTitleChange = (value: string) => this.setState({title: value})

  public handleReceiverChange = (value: string) => this.setState({receiver: value})

  public handleMessageDraftChange = (value: string) => this.setState({messageDraft: value})

  public render() {
    const {classes, messages, onSendInboxMessage} = this.props
    const {messageDraftOpen, checkboxes, title, receiver, messageDraft} = this.state

    return (
      <div className={classes.sceneWrapper}>
        <div className={classes.mapButtonsContainer}>
          <Button className={classes.button} onClick={this.handleOpenDraftMessage}>
            New Message
          </Button>
        </div>
        <div className={classes.inboxContainer}>
          <div className={classes.inboxWrapper}>
            <div className={classes.inboxMessageTitle}>
              Title
            </div>
            <div className={classes.inboxMessageAuthor}>
              Author
            </div>
            <div className={classes.inboxMessageDate}>
              Date
            </div>
            <div className={classes.inboxMessageCheckbox}>
              Select
            </div>
            {messages && messages.sort((a: InboxMessage, b: InboxMessage) => {
              return a.date.getTime() - b.date.getTime()
            }).map((message: InboxMessage, index: number) => (
              <div>
                <div className={classes.inboxMessageTitle}>
                  {message.title}
                </div>
                <div className={classes.inboxMessageAuthor}>
                  {message.author}
                </div>
                <div className={classes.inboxMessageDate}>
                  {message.date}
                </div>
                <div className={classes.inboxMessageCheckbox}>
                <Checkbox
                  className={classes.checkbox}
                  checked={checkboxes.includes(index)}
                  onClick={() => this.toggleCheckbox(index)}
                />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Dialog open={messageDraftOpen} onClose={this.handleCloseDraftMessage}>
          <DialogTitle>
            Draft a new message
          </DialogTitle>
          <DialogContent>
              <TextField
                label='Title'
                value={title}
                onChange={({target}) => this.handleTitleChange(target.value)}
                margin='normal'
                variant='filled'
                InputLabelProps={{classes: {root: classes.textfield}}}
              />
              <TextField
                label='Send to'
                value={receiver}
                onChange={({target}) => this.handleReceiverChange(target.value)}
                margin='normal'
                variant='filled'
                InputLabelProps={{classes: {root: classes.textfield}}}
              />
              <TextField
                label='Message'
                value={messageDraft}
                onChange={({target}) => this.handleMessageDraftChange(target.value)}
                margin='normal'
                variant='filled'
                InputLabelProps={{classes: {root: classes.textfield}}}
                multiline
                rows={10}
              />
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={this.handleCloseDraftMessage}>
              Cancel
            </Button>
            <Button
              className={classes.button}
              onClick={() => onSendInboxMessage(title, receiver, messageDraft)}
              disabled={false}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(InboxScene)
