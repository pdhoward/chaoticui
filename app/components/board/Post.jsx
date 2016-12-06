
import React, { PropTypes } 		from 'react';
import noop 										from 'lodash/noop';
import classNames 							from 'classnames';
import translate 								from '../../i18n/Translate';
import style 										from './Post.scss';
import icons 										from '../../constants/icons';


const logData = (args) => {
	console.log("--------------------")
	console.log(JSON.stringify(args))
}

const renderState = () => {
	return {
		recipient: {
			id: 2,
			firstname: 'Patrick',
			surname: 'Howard',
			email: 'patrick.howard@xiollc.com'
		},
		sender: {
			id: 1
		},
		messages: []
	}
}

const handleSubmit = (event) => {
	var value = $('.messageInput').val();
	console.log(value);

	var message = {
		sender: 1,
		message: value
	};

	var messages = this.state.messages;
	messages.push(message);

	this.setState({ messages: messages });
	this.scrollWindow();
	$('.messageInput').val("");
	event.preventDefault();
}

const scrollWindow = () => {
		var windowHeight = $('.Messages').height();
		$(".container").animate({scrollTop : ($(".container")[0].scrollHeight)}, 500);
}

////////////////
// COMPONENTS //
////////////////

// Conversation

const Post = ({ currentUser, posts, type, icon, placeholder, onAdd, onDelete,
                      onLike, onUnlike, onEdit }) => (

			<div className={classNames(style.Conversation)}>
				<div className={classNames(style.header)}>
					<Header name={currentUser} />
				</div>
				<div className={classNames(style.container)}>
					<Messages messages={[{message: "message1"}, {message: "message2"}, {message:"message3"}, {message:"message4"}]} />
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

		var messages = this.props.messages.map(function(message, i) {
			return <Message message={message.message} sender={2} />;
		});

		return (
			<div className={classNames(style.Messages)}>
				{messages}
			</div>
		);
	}

}

class Message extends React.Component {

	render() {
		if(this.props.sender === 1) {
			return (
				<div className={classNames(style.Message, style.you)}>
					<span>{this.props.message}</span>
				</div>
			);
		} else {
			return (
				<div className={classNames(style.Message, style.them)}>
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
