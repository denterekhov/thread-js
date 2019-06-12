import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Label, Comment as CommentUI } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';

import styles from './styles.module.scss';

const Comment = (props) => {
    console.log('props: ', props);
    const { comment: { body, createdAt, id, user, userId, commentReactions },
        currentUserId,
        removeComment,
        likeComment,
        dislikeComment
    } = props;

    const countLikesAndDislikes = (array) => {
        let likes;
        let dislikes;
        // for (const item of array) {
        //     if (item.isLike) {
        //         likes + 1;
        //     } else {
        //         dislikes + 1;
        //     }
        // }
        // array.forEach((reaction) => {
        //     reaction.isLike ? likes + 1 : dislikes + 1;
        // });

        console.log('likes: ', likes);
        console.log('dislikes: ', dislikes);
        return [likes, dislikes];
    };

    const [likeCommentCount = 0, dislikeCommentCount = 0] = countLikesAndDislikes(commentReactions);

    // console.log('likeCommentCount: ', likeCommentCount);
    // console.log('dislikeCommentCount: ', dislikeCommentCount);
    const date = moment(createdAt).fromNow();

    const createRemoveIcon = () => (currentUserId === userId
        ? <Icon link name="close" onClick={() => removeComment(id)} />
        : null);

    const removeIcon = createRemoveIcon();

    return (
        <CommentUI className={styles.comment}>
            {removeIcon}
            <CommentUI.Avatar src={getUserImgLink(user.image)} />
            <CommentUI.Content>
                <CommentUI.Author as="a">
                    {user.username}
                </CommentUI.Author>
                <CommentUI.Metadata>
                    {date}
                </CommentUI.Metadata>
                <CommentUI.Text>
                    {body}
                </CommentUI.Text>
            </CommentUI.Content>
            <Card.Content extra>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => likeComment(id)}>
                    <Icon name="thumbs up" />
                    {likeCommentCount}
                </Label>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => dislikeComment(id)}>
                    <Icon name="thumbs down" />
                    {dislikeCommentCount}
                </Label>
            </Card.Content>
        </CommentUI>
    );
};

Comment.propTypes = {
    comment: PropTypes.objectOf(PropTypes.any).isRequired,
    currentUserId: PropTypes.string.isRequired,
    removeComment: PropTypes.func.isRequired,
    likeComment: PropTypes.func.isRequired,
    dislikeComment: PropTypes.func.isRequired
};

export default Comment;
