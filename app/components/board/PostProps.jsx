import React, { PropTypes, Component } from 'react';
import noop from 'lodash/noop';
import flow from 'lodash/flow';
import PostWidget from './PostWidget';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { addPost, deletePost, like, unlike, editPost } from '../../state/posts';
import icons from '../../constants/icons';
import translate from '../../i18n/Translate';
import { getWellPosts, getNotWellPosts, getIdeasPosts, getCurrentUser } from '../../selectors';

const stateToProps = state => ({
    currentUser: getCurrentUser(state),
    wellPosts: getWellPosts(state),
    notWellPosts: getNotWellPosts(state),
    ideasPosts: getIdeasPosts(state)
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
      console.log(("--------various parms ---------"))
      console.log("username = " + this.props.currentUser)
      console.log("wellposts = " + this.props.wellPosts)
      console.log("icon satisfied = " + icons.sentiment_satisfied)
      console.log("add action  = " + JSON.stringify(this.props.addPost))
      console.log("placeholder = " + this.props.strings.wellQuestion)
    }

    render() {

        const { strings, wellPosts, notWellPosts, ideasPosts } = this.props;
        const types = [{
            type: 'well',
            question: strings.wellQuestion,
            icon: icons.sentiment_satisfied,
            posts: wellPosts
        }, {
            type: 'notWell',
            question: strings.notWellQuestion,
            icon: icons.sentiment_very_dissatisfied,
            posts: notWellPosts
        }, {
            type: 'ideas',
            question: strings.ideasQuestion,
            icon: icons.lightbulb_outline,
            posts: ideasPosts
        }];

        return (
          <div>
              <PostWidget
                currentUser={this.props.currentUser}
                posts={this.props.wellPosts}
                type={'well'}
                icon={icons.sentiment_satisfied}
                onAdd={this.props.addPost}
                placeholder={this.props.strings.wellQuestion}
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
    wellPosts: PropTypes.array.isRequired,
    notWellPosts: PropTypes.array.isRequired,
    ideasPosts: PropTypes.array.isRequired,
    addPost: PropTypes.func,
    deletePost: PropTypes.func,
    strings: PropTypes.object,
    like: PropTypes.func,
    unlike: PropTypes.func,
    edit: PropTypes.func
};

PostProps.defaultProps = {
    currentUser: null,
    wellPosts: [],
    notWellPosts: [],
    ideasPosts: [],
    addPost: noop,
    deletePost: noop,
    like: noop,
    unlike: noop,
    edit: noop,
    strings: {
        notWellQuestion: 'What could be improved?',
        wellQuestion: 'What went well?',
        ideasQuestion: 'A brilliant idea to share?'
    }
};

const decorators = flow([
    connect(stateToProps, actionsToProps),
    translate('PostBoard')
]);

export default decorators(PostProps);
