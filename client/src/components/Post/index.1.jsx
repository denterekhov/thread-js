import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';

import styles from './styles.module.scss';

const Post = ({
    post,
    likePost,
    dislikePost,
    removePost,
    toggleExpandedPost,
    sharePost,
    currentUserId,
    closeModal
}) => {
    const [likers, setLikers] = useState(false);
    const {
        id,
        image,
        body,
        user,
        likePostCount,
        dislikePostCount,
        commentCount,
        createdAt,
        postReactions,
        userId
    } = post;
    const date = moment(createdAt).fromNow();

    const deletePost = () => {
        removePost(id);
        if (closeModal) closeModal();
    };

    const createDeleteButton = () => (currentUserId === userId
        ? (<button type="submit" className="ui red right floated button" onClick={deletePost}>Delete post</button>)
        : null);

    const deleteButton = createDeleteButton();


    console.log('postReactions: ', postReactions);

    const createList = likes => (
        <ul>
            {likes.map(liker => <li key={liker.id}>{liker.username}</li>)}
        </ul>
    );


    const createLikersList = () => {
        if (likers && postReactions && postReactions.length) {
            const likesObject = postReactions.reduce((acc, next) => {
                const newAcc = next.isLike ? [...acc.likers, next.user] : [...acc.dislikers, next.user];
                return newAcc;
            }, {
                likers: [], dislikers: []
            });
            // console.log('likes: ', likes);
            return {
                likes: createList(likesObject.likers),
                dislikes: createList(likesObject.dislikers)
            };
        }
        return null;
    };

    //   const countLikesAndDislikes = (array) => {
    //     const likesArray = R.pluck('isLike', array);
    //     return R.countBy(Boolean)(likesArray);
    // };

    // const { true: likeCommentCount = 0, false: dislikeCommentCount = 0 } = countLikesAndDislikes(commentReactions);

    const { likes = null, dislikes = null } = createLikersList();

    return (
        <Card style={{ width: '100%' }}>
            {image && <Image src={image.link} wrapped ui={false} />}
            <Card.Content>
                <Card.Meta>
                    <span className="date">
                        posted by
                        {' '}
                        {user.username}
                        {' - '}
                        {date}
                    </span>
                </Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => likePost(id)} onMouseEnter={() => setLikers(true)} onMouseLeave={() => setLikers(false)}>
                    <Icon name="thumbs up">{likes}</Icon>
                    {likePostCount}
                </Label>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => dislikePost(id)}>
                    <Icon name="thumbs down">{dislikes}</Icon>
                    {dislikePostCount}
                </Label>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleExpandedPost(id)}>
                    <Icon name="comment" />
                    {commentCount}
                </Label>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => sharePost(id)}>
                    <Icon name="share alternate" />
                </Label>
                {deleteButton}
            </Card.Content>
        </Card>
    );
};


Post.propTypes = {
    post: PropTypes.objectOf(PropTypes.any).isRequired,
    likePost: PropTypes.func.isRequired,
    dislikePost: PropTypes.func.isRequired,
    removePost: PropTypes.func.isRequired,
    toggleExpandedPost: PropTypes.func.isRequired,
    sharePost: PropTypes.func.isRequired,
    currentUserId: PropTypes.string.isRequired,
    closeModal: PropTypes.func
};


Post.defaultProps = {
    closeModal: undefined
};

export default Post;
