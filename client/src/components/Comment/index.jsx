import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Comment as CommentUI } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';

import styles from './styles.module.scss';

const Comment = (props) => {
    const { comment: { body, createdAt, id, user, userId }, currentUserId, removeComment } = props;
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
        </CommentUI>
    );
};

Comment.propTypes = {
    comment: PropTypes.objectOf(PropTypes.any).isRequired,
    currentUserId: PropTypes.string.isRequired,
    removeComment: PropTypes.func.isRequired
};

export default Comment;
