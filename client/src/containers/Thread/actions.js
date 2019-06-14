import * as postService from 'src/services/postService';
import * as commentService from 'src/services/commentService';
import {
    ADD_POST,
    REMOVE_POST,
    EDIT_POST,
    EDIT_COMMENT,
    REMOVE_COMMENT,
    LOAD_MORE_POSTS,
    SET_ALL_POSTS,
    SET_EXPANDED_POST,
    SET_EDITING_POST,
    SET_EDITING_COMMENT
} from './actionTypes';

const setPostsAction = posts => ({
    type: SET_ALL_POSTS,
    posts
});

const addMorePostsAction = posts => ({
    type: LOAD_MORE_POSTS,
    posts
});

const addPostAction = post => ({
    type: ADD_POST,
    post
});

const setExpandedPostAction = post => ({
    type: SET_EXPANDED_POST,
    post
});

const setEditingPostAction = () => ({
    type: SET_EDITING_POST,
});

const setEditingCommentAction = () => ({
    type: SET_EDITING_COMMENT,
});

export const removePost = postId => ({
    type: REMOVE_POST,
    postId
});

export const editPost = post => ({
    type: EDIT_POST,
    post
});

export const removeComment = commentId => ({
    type: REMOVE_COMMENT,
    commentId
});

export const editComment = comment => ({
    type: EDIT_COMMENT,
    comment
});

export const loadPosts = filter => async (dispatch) => {
    const posts = await postService.getAllPosts(filter);
    dispatch(setPostsAction(posts));
};

export const loadMorePosts = filter => async (dispatch) => {
    const posts = await postService.getAllPosts(filter);
    dispatch(addMorePostsAction(posts));
};

export const applyPost = postId => async (dispatch) => {
    const post = await postService.getPost(postId);
    dispatch(addPostAction(post));
};

export const addPost = post => async (dispatch) => {
    const { id } = await postService.addPost(post);
    const newPost = await postService.getPost(id);
    dispatch(addPostAction(newPost));
};

export const updatePost = (postId, text) => async (dispatch, getRootState) => {
    const { id } = await postService.updatePost(postId, text);
    const updatedPost = await postService.getPost(id);
    const { posts: { posts } } = getRootState();
    dispatch(setEditingPostAction());
    const newPosts = posts.map(post => (post.id !== updatedPost.id ? post : updatedPost));
    dispatch(setPostsAction(newPosts));
};

export const updateComment = (commentId, text) => async (dispatch, getRootState) => {
    const { id } = await commentService.updateComment(commentId, text);
    const updatedComment = await commentService.getComment(id);
    const { posts: { expandedPost } } = getRootState();
    dispatch(setEditingCommentAction());
    const updatedExpandedPost = {
        ...expandedPost,
        comments: expandedPost.comments.map(comment => (
            comment.id !== updatedComment.id ? comment : updatedComment
        ))
    };
    dispatch(setExpandedPostAction(updatedExpandedPost));
};

export const toggleExpandedPost = postId => async (dispatch) => {
    const post = postId ? await postService.getPost(postId) : undefined;
    dispatch(setExpandedPostAction(post));
};

export const togglePostLike = (postId, isLike) => async (dispatch, getRootState) => {
    const { id } = await postService.togglePostLike(postId, isLike);

    const {
        posts: { posts, expandedPost },
        profile: { user: { id: currentUserId, username } }
    } = getRootState();

    const mapPostReactions = (post) => {
        const filteredPostReactions = post.postReactions.filter(
            reaction => reaction.user.id !== currentUserId
        );
        return {
            ...post,
            postReactions: id
                ? [...filteredPostReactions, {
                    isLike,
                    user: { id: currentUserId, username }
                }]
                : filteredPostReactions
        };
    };

    const updatedPosts = () => posts.map(
        post => (post.id !== postId ? post : mapPostReactions(post))
    );

    dispatch(setPostsAction(updatedPosts()));

    if (expandedPost && expandedPost.id === postId) {
        dispatch(setExpandedPostAction(mapPostReactions(expandedPost)));
    }
};


export const toggleCommentLike = (commentId, isLike) => async (dispatch, getRootState) => {
    const { id } = await commentService.toggleCommentLike(commentId, isLike);

    const {
        posts: { expandedPost },
        profile: { user: { id: currentUserId, username } }
    } = getRootState();

    const mapCommentReactions = (comment) => {
        const filteredCommentReactions = comment.commentReactions.filter(
            reaction => reaction.user.id !== currentUserId
        );
        return {
            ...comment,
            commentReactions: id
                ? [...filteredCommentReactions, {
                    isLike,
                    user: { id: currentUserId, username }
                }]
                : filteredCommentReactions
        };
    };

    const updatedExpandedPost = ({
        ...expandedPost,
        comments: expandedPost.comments.map(
            comment => (comment.id !== commentId ? comment : mapCommentReactions(comment))
        )
    });

    dispatch(setExpandedPostAction(updatedExpandedPost));
};

export const addComment = request => async (dispatch, getRootState) => {
    const { id } = await commentService.addComment(request);
    const comment = await commentService.getComment(id);

    const mapComments = post => ({
        ...post,
        commentCount: Number(post.commentCount) + 1,
        comments: [...(post.comments || []), comment] // comment is taken from the current closure
    });

    const { posts: { posts, expandedPost } } = getRootState();
    const updated = posts.map(post => (post.id !== comment.postId
        ? post
        : mapComments(post)));

    dispatch(setPostsAction(updated));

    if (expandedPost && expandedPost.id === comment.postId) {
        dispatch(setExpandedPostAction(mapComments(expandedPost)));
    }
};
