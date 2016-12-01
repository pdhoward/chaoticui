
/*
post component onSubmit ={}

this.handleSubmit.bind(this)

------------------

input component <form

onSubmit={this.props.onSubmit}

*/
import React, { PropTypes } 		from 'react';
import noop 										from 'lodash/noop';
import classNames 							from 'classnames';
import translate 								from '../../i18n/Translate';
import style 										from './Post.scss';


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


// Post Container

const Post = ({ post, currentUser, onEdit, onLike, onUnlike, onDelete, strings }) => (

			<div className={classNames(style.post)}>
				<Conversation messages={post.content} recipient={post.user} />
				<Input messages={"placeholder"} />
			</div>
)

// Conversation

const Conversation = ({ post, recipient }) => (

			<div className={classNames(style.Conversation)}>
				<Header name={recipient} />
				<div className="container">
					<Messages messages={post} />
				</div>
			</div>

)


const Header = ({ name }) => (
			<header>
				<div className={classNames(style.header)}> {name}</div>
			</header>
)


const Messages = ({ post }) => (
		<div className='Messages'>
				{post}
		</div>

)

const Input = ({ messages }) => (
			<form className={classNames(style.Input)}>
				<input className="messageInput" name="message" type="text" placeholder="Enter your message..." />
				<button>
					<i className="fa fa-send"></i>
				</button>
			</form>
	)

Post.propTypes = {
    post: PropTypes.object.isRequired,
    currentUser: PropTypes.string.isRequired,
    onDelete: PropTypes.func,
    onLike: PropTypes.func,
    onUnlike: PropTypes.func,
    onEdit: PropTypes.func,
    strings: PropTypes.object
};

Post.defaultProps = {
    post: null,
    currentUser: null,
    onDelete: noop,
    onLike: noop,
    onUnlike: noop,
    onEdit: noop,
    strings: {
        deleteButton: 'Delete',
        noContent: '(This post has no content)'
    }
};

export default translate('Post')(Post);
