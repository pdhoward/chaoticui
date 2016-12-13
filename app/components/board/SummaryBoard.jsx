import React, { PropTypes, Component } from 'react';
import flow from 'lodash/flow';
import translate from '../../i18n/Translate';
import { connect } from 'react-redux';
import { getSortedLivePosts, getSortedAIPosts, getSortedTrainPosts } from '../../selectors';
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card';
import style from './SummaryBoard.scss';

const stateToProps = state => ({
    livePosts: getSortedLivePosts(state),
    aiPosts: getSortedNotAIPosts(state),
    trainPosts: getSortedTrainPosts(state)
});

class SummaryBoard extends Component {
    renderType(label, className, posts) {
        if (!posts.length) {
            return null;
        }
        return (
            <div style={{ margin: 30 }}>
                <Card>
                    <CardTitle className={className}>{ label }</CardTitle>
                    <CardText>
                        <ul style={{ marginLeft: 0, marginTop: 20, listStyleType: 'none' }}>
                            { posts.map(this.renderPost.bind(this)) }
                        </ul>
                    </CardText>
                </Card>
            </div>
        );
    }

    renderPost(post) {
        return (
            <li key={post.id}>
                <span className={style.like}>+{post.likes.length}</span>&#9;
                <span className={style.dislike}>-{post.dislikes.length}</span>&#9;
                {post.content}
            </li>
        );
    }

    render() {
        const { livePosts, aiPosts, trainPosts, strings } = this.props;

        if (!livePosts.length && !aiPosts.length && !trainPosts.length) {
            return (
                <div className={style.summary}>
                    <h4 style={{ textAlign: 'center', marginTop: 50 }}>{strings.noPosts}</h4>
                </div>
            );
        }
        return (
            <div className={style.summary}>
                { this.renderType(strings.liveQuestion, style.live, livePosts) }
                { this.renderType(strings.aiQuestion, style.ai, aiPosts) }
                { this.renderType(strings.trainQuestion, style.train, trainPosts) }
            </div>
        );
    }
}

SummaryBoard.propTypes = {
    livePosts: PropTypes.array.isRequired,
    aiPosts: PropTypes.array.isRequired,
    trainPosts: PropTypes.array.isRequired,
    strings: PropTypes.object
};

SummaryBoard.defaultProps = {
    livePosts: [],
    aiPosts: [],
    trainPosts: [],
    strings: {
        aiQuestion: '',
        liveQuestion: 'Please enter message',
        trainQuestion: '',
        vote: 'vote',
        votes: 'votes',
        noPosts: 'There are no posts to display'
    }
};

const decorators = flow([
    connect(stateToProps),
    translate('PostBoard'),
    translate('SummaryBoard'),
    translate('Post')
]);

export default decorators(SummaryBoard);
