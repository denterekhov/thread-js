import {
    SET_ALL_POSTS,
    LOAD_MORE_POSTS,
    ADD_POST,
    REMOVE_POST,
    REMOVE_COMMENT,
    SET_EXPANDED_POST
} from './actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case SET_ALL_POSTS:
            return {
                ...state,
                posts: action.posts,
                hasMorePosts: Boolean(action.posts.length)
            };
        case LOAD_MORE_POSTS:
            return {
                ...state,
                posts: [...(state.posts || []), ...action.posts],
                hasMorePosts: Boolean(action.posts.length)
            };
        case ADD_POST:
            return {
                ...state,
                posts: [action.post, ...state.posts]
            };
        case REMOVE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.postId)
            };
        case REMOVE_COMMENT:
            return {
                ...state,
                expandedPost: {
                    ...state.expandedPost,
                    comments: state.expandedPost.comments.filter(
                        comment => comment.id !== action.commentId
                    )
                }
            };
        case SET_EXPANDED_POST:
            return {
                ...state,
                expandedPost: action.post
            };
        default:
            return state;
    }
};
