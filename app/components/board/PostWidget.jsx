import React, { PropTypes }       from 'react';
import noop                       from 'lodash/noop';
import Post                       from './Post';
import PostAdd                    from './PostAdd';
import icons                      from '../../constants/icons';
import style                      from './Post.scss';
import classNames 							  from 'classnames';

const PostWidget = ({ currentUser, posts, type, icon, placeholder, onAdd, onDelete,
                      onLike, onUnlike, onEdit }) => (

    <div className={classNames(style.Post)}>
        <Post currentUser={currentUser}
              posts={posts}
              type={type}
              icon={icon}
              placeholder={placeholder}
              onAdd={text => onAdd(type, text)}
              onDelete={onDelete}
              onLIke={onLike}
              onUnlike={onUnlike}
              onEdit={onEdit}

         />
        <PostAdd
          onAdd={text => onAdd(type, text)}
          placeholder={placeholder}
          icon={icon}
        />
    </div>
);

PostWidget.propTypes = {
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

PostWidget.defaultProps = {
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

export default PostWidget;
