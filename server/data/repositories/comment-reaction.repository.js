import { PostModel, CommentModel, UserModel, ImageModel, PostReactionModel, CommentReactionModel } from '../models/index';
import sequelize from '../db/connection';

import BaseRepository from './base.repository';

export const likeCommentCase = bool => `CASE WHEN "commentReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;

class CommentReactionRepository extends BaseRepository {
    getCommentReaction(userId, commentId) {
        return this.model.findOne({
            group: [
                'commentReaction.id',
                'comment.id'
            ],
            where: { userId, commentId },
            include: [{
                model: CommentModel,
                attributes: ['id', 'userId']
            }]
        });
    }

    // async getCommentReactions(filter) {
    //     console.log('filter: ', filter);
    //     const {
    //         commentId
    //     } = filter;

    //     // const where = {};
    //     // if (queryUserId) {
    //     //     Object.assign(where, { userId: { [Op.ne]: queryUserId } });
    //     // }

    //     return this.model.findAll({
    //         // where,
    //         // where: { commentId },
    //         attributes: {
    //             include: [
    //                 // [sequelize.literal(`
    //                 //     (SELECT COUNT(*)
    //                 //     FROM "comments" as "comment"
    //                 //     WHERE "post"."id" = "comment"."postId")`), 'commentCount'],
    //                 // [sequelize.literal(`
    //                 //     (select users.username from "users" inner join (SELECT * FROM "postReactions" WHERE "postReactions"."isLike" = false) AS react on users.id = react."userId")`), 'peopleWhoLiked Post'],
    //                 // [sequelize.literal(`
    //                 //     (SELECT COUNT(*)
    //                 //     FROM "commentReactions" as "reaction"
    //                 //     WHERE "post"."id" = "reaction"."postId")`), 'peopleWhoLiked Post'],
    //                 [sequelize.fn('SUM', sequelize.literal(likeCommentCase(true))), 'likeCommentCount'],
    //                 [sequelize.fn('SUM', sequelize.literal(likeCommentCase(false))), 'dislikeCommentCount']
    //             ]
    //         },
    //         // include: [
    //         //   {
    //         //     model: ImageModel,
    //         //     attributes: ['id', 'link']
    //         // }, 
    //         // {
    //         //     model: UserModel,
    //         //     attributes: ['id', 'username'],
    //         //     include: {
    //         //         model: ImageModel,
    //         //         attributes: ['id', 'link']
    //         //     }
    //         // }, 
    //         // {
    //         //     model: PostReactionModel,
    //         //     attributes: [],
    //         //     duplicating: false
    //             // include: {
    //             //     model: UserModel,
    //             //     attributes: ['username']
    //             // }

    //             // attributes: ['isLike'], //IT WORKS
    //             // duplicating: false,
    //             // include: {
    //             //     model: UserModel,
    //             //     attributes: ['username']
    //             // }
    //         // }
    //       // ],
    //         // group: [
    //             // 'commentReaction.id',
    //             // 'image.id',
    //             // 'user.id',
    //             // 'user->image.id',
    //             // 'postReactions.id',// IT WORKS
    //             // 'postReactions->user.id'
    //         // ],
    //         order: [['createdAt', 'DESC']],
    //         // offset,
    //         // limit
    //     });
    // }
}

export default new CommentReactionRepository(CommentReactionModel);
