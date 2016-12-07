
import React, { PropTypes } 		from 'react';
import ReactDOM 								from 'react-dom';
import noop 										from 'lodash/noop';
import classNames 							from 'classnames';
import translate 								from '../../i18n/Translate';
import style 										from './Post.scss';
import icons 										from '../../constants/icons';


const logData = (args) => {
	console.log("--------------------")
	console.log(JSON.stringify(args))
}


////////////////
// COMPONENTS //
////////////////


const Post = ({ currentUser, posts, type, icon, placeholder, onAdd, onDelete,
                      onLike, onUnlike, onEdit }) => (

			<div className={classNames(style.Conversation)}>
				<div className={classNames(style.header)}>
					<Header name={currentUser} />
				</div>
				<div className={classNames(style.container)}>
					<Messages messages={posts} currentuser={currentUser} />
				</div>
			</div>


)

const Header = ({ name }) => (
			<div className={classNames(style.header)}>
				<div> {name} </div>
			</div>
)

class Messages extends React.Component {

	render() {

		var sender = 1
		var viewerID = this.props.currentuser
		var messages = this.props.messages.map(function(message, i) {
				return <Message message={message.content} user={message.user==viewerID ? 'you' : message.user} sender={message.user==viewerID ? 1 : 2} />;
		});

		return (
			<div className={classNames(style.Messages)}>
				{messages}
			</div>
		);
	}

}

class Message extends React.Component {

	componentDidMount() {
     this.textmessage.scrollIntoView();
   }


	render() {

		if(this.props.sender === 1) {
			return (
				<div>
				<div className={classNames(style.Message, style.ul)} ref={node => this.textmessage = node}>
					<ul>{this.props.user}</ul>
				</div>
				<div className={classNames(style.Message, style.you)} ref={node => this.textmessage = node}>				
					<span>{this.props.message}</span>
				</div>
			</div>
			);
		} else {
			return (
				<div className={classNames(style.Message, style.them)} ref={node => this.textmessage = node}>
					<ul>{this.props.user}</ul>
					<br></br>
					<span>{this.props.message}</span>
				</div>
			);
		}

	}

}

Post.propTypes = {
	    currentUser: PropTypes.string.isRequired,
	    posts: PropTypes.array.isRequired,
	    type: PropTypes.string.isRequired,
	    icon: PropTypes.string,
	    placeholder: PropTypes.string.isRequired,
	    onAdd: PropTypes.func,
	    onDelete: PropTypes.func,
	    onLike: PropTypes.func,
	    onUnlike: PropTypes.func,
	    onEdit: PropTypes.func
	};

Post.defaultProps = {
	    currentUser: null,
	    posts: [],
	    type: 'well',
	    icon: icons.add_circle,
	    placeholder: 'New Comment',
	    onAdd: noop,
	    onDelete: noop,
	    onLike: noop,
	    onUnlike: noop,
	    onEdit: noop
	};

export default translate('Post')(Post);
