import commentRepository from '../../data/repositories/comment.repository';
import commentReactionRepository from '../../data/repositories/comment-reaction.repository';

// export const getCommentReactions = filter => commentReactionRepository.getCommentReactions(filter);

export const create = (userId, comment) => commentRepository.create({
    ...comment,
    userId
});

export const getCommentById = id => commentRepository.getCommentById(id);

export const setReaction = async (userId, { commentId, isLike = true }) => {
    console.log('userId, { commentId, isLike = true }: ', userId, commentId, isLike );
    // define the callback for future use as a promise
    const updateOrDelete = react => {
        // console.log('react: ', react);
        return react.isLike === isLike
        ? commentReactionRepository.deleteById(react.id)
        : commentReactionRepository.updateById(react.id, { isLike })};

    const reaction = await commentReactionRepository.getCommentReaction(userId, commentId);

    const result = reaction
        ? await updateOrDelete(reaction)
        : await commentReactionRepository.create({ userId, commentId, isLike });
    console.log('result: ', result);

    // the result is an integer when an entity is deleted
    return Number.isInteger(result) ? {} : commentReactionRepository.getCommentReaction(userId, commentId);
};
