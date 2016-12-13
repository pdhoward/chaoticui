

import React, { PropTypes, Component } from 'react';
import noop from 'lodash/noop';
import flow from 'lodash/flow';
import PostWidget from './PostWidget';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { addPost, deletePost, like, unlike, editPost } from '../../state/posts';
import icons from '../../constants/icons';
import translate from '../../i18n/Translate';
import { getLivePosts, getAIPosts, getTrainPosts, getCurrentUser } from '../../selectors';

const stateToProps = state => ({
    currentUser: getCurrentUser(state),
    livePosts: getLivePosts(state),
    aiPosts: getAIPosts(state),
    trainPosts: getTrainPosts(state)
});

const actionsToProps = dispatch => ({
    addPost: (type, text) => dispatch(addPost(type, text)),
    deletePost: post => dispatch(deletePost(post)),
    like: post => dispatch(like(post)),
    unlike: post => dispatch(unlike(post)),
    edit: (post, content) => dispatch(editPost(post, content))
});


class PostProps extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(props) {
      console.log(("--------Entered PostProps---------"))    
    }

    render() {

        const { strings, livePosts, aiPosts, trainPosts } = this.props;
        const types = [{
            type: 'Live',
            question: strings.liveQuestion,
            icon: icons.sentiment_satisfied,
            posts: livePosts
        }, {
            type: 'AI',
            question: strings.aiQuestion,
            icon: icons.sentiment_very_dissatisfied,
            posts: aiPosts
        }, {
            type: 'Train',
            question: strings.trainQuestion,
            icon: icons.lightbulb_outline,
            posts: trainPosts
        }];

        return (
          <div>
              <PostWidget
                currentUser={this.props.currentUser}
                posts={this.props.livePosts}
                type={'Live'}
                icon={icons.sentiment_satisfied}
                onAdd={this.props.addPost}
                placeholder={this.props.strings.liveQuestion}
                onDelete={this.props.deletePost}
                onLike={this.props.like}
                onUnlike={this.props.unlike}
                onEdit={this.props.edit}
              />
          </div>
        );
    }
}

PostProps.propTypes = {
    currentUser: PropTypes.string,
    livePosts: PropTypes.array.isRequired,
    aiPosts: PropTypes.array.isRequired,
    trainPosts: PropTypes.array.isRequired,
    addPost: PropTypes.func,
    deletePost: PropTypes.func,
    strings: PropTypes.object,
    like: PropTypes.func,
    unlike: PropTypes.func,
    edit: PropTypes.func
};

PostProps.defaultProps = {
    currentUser: null,
    livePosts: [],
    aiPosts: [],
    trainPosts: [],
    addPost: noop,
    deletePost: noop,
    like: noop,
    unlike: noop,
    edit: noop,
    strings: {
        aiQuestion: '',
        liveQuestion: 'Please enter your message',
        trainQuestion: ''
    }
};

const decorators = flow([
    connect(stateToProps, actionsToProps),
    translate('PostProps')
]);

export default decorators(PostProps);
