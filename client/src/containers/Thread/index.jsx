import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as imageService from 'src/services/imageService';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import SharedPostLink from 'src/components/SharedPostLink';
import { Checkbox, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { loadPosts, loadMorePosts, likePost, dislikePost, removePost, toggleExpandedPost, addPost } from './actions';

import styles from './styles.module.scss';

class Thread extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sharedPostId: undefined,
            showOtherPeoplesPosts: false
        };
        this.postsFilter = {
            userId: undefined,
            from: 0,
            count: 10
        };
    }

    togglePosts = () => {
        this.setState(
            ({ showOtherPeoplesPosts }) => ({ showOtherPeoplesPosts: !showOtherPeoplesPosts }),
            () => {
                Object.assign(this.postsFilter, {
                    userId: this.state.showOtherPeoplesPosts ? this.props.userId : undefined,
                    from: 0
                });
                this.props.loadPosts(this.postsFilter);
                const { from, count } = this.postsFilter;
                this.postsFilter.from = from + count;
            }
        );
    };

    loadMorePosts = () => {
        this.props.loadMorePosts(this.postsFilter);
        const { from, count } = this.postsFilter;
        this.postsFilter.from = from + count;
    }

    sharePost = (sharedPostId) => {
        this.setState({ sharedPostId });
    };

    closeSharePost = () => {
        this.setState({ sharedPostId: undefined });
    }

    uploadImage = file => imageService.uploadImage(file);


    render() {
        const { posts = [], expandedPost, hasMorePosts, ...props } = this.props;
        const { showOtherPeoplesPosts, sharedPostId } = this.state;
        return (
            <div className={styles.threadContent}>
                <div className={styles.addPostForm}>
                    <AddPost addPost={props.addPost} uploadImage={this.uploadImage} />
                </div>
                <div className={styles.toolbar}>
                    <Checkbox toggle label="Show only other people's posts" checked={showOtherPeoplesPosts} onChange={this.togglePosts} />
                </div>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMorePosts}
                    hasMore={hasMorePosts}
                    loader={<Loader active inline="centered" key={0} />}
                >
                    {posts.map(post => (
                        <Post
                            post={post}
                            likePost={props.likePost}
                            dislikePost={props.dislikePost}
                            removePost={props.removePost}
                            toggleExpandedPost={props.toggleExpandedPost}
                            sharePost={this.sharePost}
                            currentUserId={props.userId}
                            key={post.id}
                        />
                    ))}
                </InfiniteScroll>
                {
                    expandedPost
                    && <ExpandedPost sharePost={this.sharePost} />
                }
                {
                    sharedPostId
                    && <SharedPostLink postId={sharedPostId} close={this.closeSharePost} />
                }
            </div>
        );
    }
}

Thread.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.object),
    hasMorePosts: PropTypes.bool,
    expandedPost: PropTypes.objectOf(PropTypes.any),
    sharedPostId: PropTypes.string,
    userId: PropTypes.string,
    loadPosts: PropTypes.func.isRequired,
    loadMorePosts: PropTypes.func.isRequired,
    likePost: PropTypes.func.isRequired,
    dislikePost: PropTypes.func.isRequired,
    toggleExpandedPost: PropTypes.func.isRequired,
    addPost: PropTypes.func.isRequired,
    removePost: PropTypes.func.isRequired
};

Thread.defaultProps = {
    posts: [],
    hasMorePosts: true,
    expandedPost: undefined,
    sharedPostId: undefined,
    userId: undefined
};

const mapStateToProps = rootState => ({
    posts: rootState.posts.posts,
    hasMorePosts: rootState.posts.hasMorePosts,
    expandedPost: rootState.posts.expandedPost,
    userId: rootState.profile.user.id
});

const actions = {
    loadPosts,
    loadMorePosts,
    likePost,
    dislikePost,
    removePost,
    toggleExpandedPost,
    addPost
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Thread);
