// Data
var data = {
	recipient: {
		id: 2,
		firstname: 'Jack-Edward',
		surname: 'Oliver',
		email: 'mrjackolai@gmail.com'
	},
	sender: {
		id: 1
	},
	messages: [
		{
			sender: 1,
			message: 'This is a message, yo',
		},
		{
			sender: 1,
			message: 'This is a second message from the same person!'
		},
		{
			sender: 2,
			message: 'This is a reply, boo!'
		}
	]
}
////////////////
// COMPONENTS //
////////////////

// App Container
var App = React.createClass({
	getInitialState: function() {
		return (data);
	},
	handleSubmit: function(event) {
		var value = $('.messageInput').val();
		console.log(value);
		var message = {
			sender: 1,
			message: value
		};

		var messages = this.state.messages;
		messages.push(message);
		this.setState({ messages: messages });
		this.pushMessage();
		this.scrollWindow();
		$('.messageInput').val("");
		event.preventDefault();
	},
	pushMessage: function() {
		var that = this;
		setTimeout(function() {
			var message = {
				sender: 2,
				message: 'I\'m a made up message yo, sent every time you reply'
			};

			var messages = that.state.messages;
			messages.push(message);
			that.setState({messages: messages });
		}, 500);

	},
	scrollWindow: function() {
		var windowHeight = $('.Messages').height();
		$(".container").animate({scrollTop : ($(".container")[0].scrollHeight)}, 500);
	},
	render: function() {

		return (
			<div className='App'>
				<Conversation messages={this.state.messages} recipient={this.state.recipient} />
				<Input onSubmit={this.handleSubmit} />
			</div>
		);
	}
});

// Conversation
var Conversation = React.createClass({
	render: function() {
		return (
			<div className='Conversation'>
				<Header name={this.props.recipient.firstname} />
				<div className="container">
					<Messages messages={this.props.messages} />
				</div>
			</div>
		);
	}
});

var Header = React.createClass({
	render: function() {
		return (
			<header>
				<div className="name">{this.props.name}</div>
			</header>
		)
	}
});

var Messages = React.createClass({
	render: function() {

		var messages = this.props.messages.map(function(message, i) {
			return <Message message={message.message} sender={message.sender} />;
		});

		return (
			<div className='Messages'>
				{messages}
			</div>
		);
	}
});

var Message = React.createClass({
	render: function() {
		if(this.props.sender === 1) {
			var classNames = "Message Message--you";
		} else {
			var classNames = "Message Message--them";
		}

		return (
			<div className={classNames}>
				<span>{this.props.message}</span>
			</div>
		);
	}
});

// Input
var Input = React.createClass({
	render: function() {
		return (
			<form onSubmit={this.props.onSubmit} className="Input">
				<input className="messageInput" name="message" type="text" placeholder="Enter your message..." />
				<button>
					<i className="fa fa-send"></i>
				</button>
			</form>
		);
	}
});

////////////
// RENDER //
////////////
ReactDOM.render(
	<App />,
	document.getElementById('app')
);
