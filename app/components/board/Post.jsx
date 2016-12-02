
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


// Post Container

const Post = ({ currentUser, posts, type, icon, placeholder, onAdd, onDelete,
                      onLike, onUnlike, onEdit }) => (

			<div className={classNames(style.post)}>
				<Header name={"Just me"} />
				<Conversation messages={"Spoofing"} />
				<Input messages={"placeholder"} />
			</div>
)

// Conversation

const Conversation = ({ messages }) => (

			<div className={classNames(style.conversation)}>
				<div className={classNames(style.container)}>
					<div className={classNames(style.Message)}>
						{messages}
					</div>
				</div>
			</div>

)


const Header = ({ name }) => (
			<div className={classNames(style.header)}>
				<div> {name} </div>
			</div>
)


const Messages = ({ post }) => (
		<div className='Messages'>
				{post}
		</div>

)

const Input = ({ messages }) => (
		<div >
			<form className={classNames(style.Input)}>
				<input className="messageInput" name="message" type="text" placeholder="Enter your message..." />
				<button>
					<i className="fa fa-send"></i>
				</button>
			</form>
		</div>
	)

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
