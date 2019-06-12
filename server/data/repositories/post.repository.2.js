import Sequelize from 'sequelize';
import sequelize from '../db/connection';
import { PostModel, CommentModel, UserModel, ImageModel, PostReactionModel, CommentReactionModel } from '../models/index';
import CommentReactionRepository from './comment-reaction.repository';
import BaseRepository from './base.repository';

const Op = Sequelize.Op;

const likePostCase = bool => `CASE WHEN "postReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;
const likeCommentCase = bool => `CASE WHEN "commentReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;

class PostRepository extends BaseRepository {
    async getPosts(filter) {
      console.log('filter: ', filter);
        const {
            from: offset,
            count: limit,
            userId: queryUserId
        } = filter;

        const where = {};
        if (queryUserId) {
            Object.assign(where, { userId: { [Op.ne]: queryUserId } });
        }

        return this.model.findAll({
            where,
            attributes: {
                include: [
                    [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId")`), 'commentCount'],
                    [sequelize.fn('SUM', sequelize.literal(likePostCase(true))), 'likePostCount'],
                    [sequelize.fn('SUM', sequelize.literal(likePostCase(false))), 'dislikePostCount']
                ]
            },
            include: [{
                model: ImageModel,
                attributes: ['id', 'link']
            }, {
                model: UserModel,
                attributes: ['id', 'username'],
                include: {
                    model: ImageModel,
                    attributes: ['id', 'link']
                }
            }, {
                model: PostReactionModel,
                attributes: [],
                duplicating: false
            }],
            group: [
                'post.id',
                'image.id',
                'user.id',
                'user->image.id'
            ],
            order: [['createdAt', 'DESC']],
            offset,
            limit
        });
    }

    getPostById(id) {
        return this.model.findOne({
            group: [
                'post.id',
                'comments.id',
                'comments->user.id',
                'comments->user->image.id',
                'user.id',
                'user->image.id',
                'image.id'
            ],
            where: { id },
            attributes: {
                include: [
                    [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId")`), 'commentCount'],
                    [sequelize.fn('SUM', sequelize.literal(likePostCase(true))), 'likePostCount'],
                    [sequelize.fn('SUM', sequelize.literal(likePostCase(false))), 'dislikePostCount'],
                    

                    // {
                    //   model: CommentModel,
                    //   include: [{
                    //     model: CommentReactionModel,
                    //     where: {
                    //       "comments.id" = "reactions.commentId"
                    //     },
                    //     required: false
                    //   }]
                    // }

                    // [sequelize.literal(`
                        // (SELECT COUNT(*)
                        // FROM "commentReactions" as "reactions"
                        // WHERE "comment"."id" = "reactions"."commentId")`), 'commentReactionCount'],
                    [sequelize.fn('SUM', sequelize.literal(likeCommentCase(true))), 'likeCommentCount'],
                    [sequelize.fn('SUM', sequelize.literal(likeCommentCase(false))), 'dislikeCommentCount']
                ]
            },
            include: [{
                model: CommentModel,
                include: {
                    model: UserModel,
                    attributes: ['id', 'username'],
                    include: {
                        model: ImageModel,
                        attributes: ['id', 'link']
                    }
                }
            }, {
                model: UserModel,
                attributes: ['id', 'username'],
                include: {
                    model: ImageModel,
                    attributes: ['id', 'link']
                }
            }, {
                model: ImageModel,
                attributes: ['id', 'link']
            }, {
                model: PostReactionModel,
                attributes: []
            }, {
                model: CommentReactionModel,
                attributes: [],
                duplicating: false
            }]
        });
    }
}

export default new PostRepository(PostModel);


// {
    // model: CommentModel,
    // include: [{
    //     model: CommentReactionModel,
    //     attributes: {
    //         include: [
    //             [sequelize.fn('SUM', sequelize.literal(likeCommentCase(true))), 'likeCommentCount'],
    //             [sequelize.fn('SUM', sequelize.literal(likeCommentCase(false))), 'dislikeCommentCount']
    //         ]
    //     },
    // }, {
    //     model: PostReactionModel,
    //     attributes: ['id', 'username'],
    //     include: {
    //         model: ImageModel,
    //         attributes: ['id', 'link']
    //     }
    // }]
// }