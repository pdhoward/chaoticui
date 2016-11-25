import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from '../../i18n/Translate';
import { Button, IconButton } from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import flow from 'lodash/flow';
import { getCurrentUrl, shouldDisplayDrawerButton, isInviteDialogOpen } from '../../selectors';
import Clipboard from 'react-copy-to-clipboard';
import icons from '../../constants/icons';
import { toggleInviteDialog } from '../../state/invite';

const stateToProps = state => ({
    url: getCurrentUrl(state),
    showInvite: shouldDisplayDrawerButton(state),
    dialogOpen: isInviteDialogOpen(state)
});

const actionsToProps = dispatch => ({
    toggle: () => dispatch(toggleInviteDialog())
});

const Invite = ({ url, showInvite, dialogOpen, toggle, strings }) => {
    if (!showInvite) {
        return null;
    }

    return (
        <span>
            <IconButton icon={icons.group_add}
              onClick={toggle}
              title={strings.inviteButton}
              floating inverse
            />

            <CopyDialog
              url={url}
              dialogOpen={dialogOpen}
              toggle={toggle}
              strings={strings.dialog}
            />
        </span>
    );
};

const CopyDialog = ({ url, dialogOpen, toggle, strings }) => (
    <Dialog
      active={dialogOpen}
      title={strings.title}
      onEscKeyDown={toggle}
      onOverlayClick={toggle}
      type="large"
      actions={[
          { label: 'Ok', onClick: toggle }
      ]}
    >
        <p>
            {strings.text}:
            <br />
            <strong>{url}</strong>
        </p>
        <br />
        <Clipboard text={url}>
            <Button
              icon={icons.content_copy}
              label={strings.copyButton}
              flat primary accent
            />
        </Clipboard>
    </Dialog>
);

CopyDialog.propTypes = {
    url: PropTypes.string,
    dialogOpen: PropTypes.bool,
    toggle: PropTypes.func,
    strings: PropTypes.object
};

Invite.propTypes = {
    url: PropTypes.string,
    showInvite: PropTypes.bool,
    dialogOpen: PropTypes.bool,
    toggle: PropTypes.func,
    strings: PropTypes.object
};

Invite.defaultProps = {
    strings: {
        inviteButton: 'Invite',
        dialog: {
            title: 'Invite others to the ChaoticBot training session',
            text: 'To invite people to this session, simply send them ' +
                  'the following URL',
            copyButton: 'Copy URL to Clipboard'
        }
    }
};

const decorators = flow([
    connect(stateToProps, actionsToProps),
    translate('Invite')
]);

export default decorators(Invite);
