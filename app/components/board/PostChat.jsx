



import React, { PropTypes, Component }        from 'react';
import noop                                   from 'lodash/noop';
import flow                                   from 'lodash/flow';
import Post                                   from './Post';
import style                                  from './PostChat.scss';
import classNames                             from 'classnames';
import { connect }                            from 'react-redux';
import { addPost, deletePost,
         like, unlike, editPost }             from '../../state/posts';
import icons                                  from '../../constants/icons';
import translate                              from '../../i18n/Translate';
import { getWellPosts, getNotWellPosts,
         getIdeasPosts, getCurrentUser }      from '../../selectors';

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

class PostChat extends Component {
    constructor(props) {
        super(props);        
    }

    componentWillMount(){
      console.log("=========================")
      console.log("ABOUT TO ENTER POSTCHAT MODULE")
    }

    componentDidMount(){
      console.log("ENTERED POSTCHAT MODULE")
    }

    render() {
        return (
            <div className={classNames(style.board)}>
                <Post
                  currentUser={this.props.currentUser}
                  posts={"POSTS"}
                  type={"TYPES"}
                  icon={"ICON"}
                  onAdd={this.props.addPost}
                  placeholder={"QUESTION"}
                  onDelete={this.props.deletePost}
                  onLike={this.props.like}
                  onUnlike={this.props.unlike}
                  onEdit={this.props.edit}
                />
            </div>
        );
    }

}

PostChat.propTypes = {
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

PostChat.defaultProps = {
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
    translate('PostChat')
]);

export default decorators(PostChat);
