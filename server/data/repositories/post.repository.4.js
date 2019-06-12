import Sequelize from 'sequelize';
import sequelize from '../db/connection';
import { PostModel, CommentModel, UserModel, ImageModel, PostReactionModel, CommentReactionModel } from '../models/index';
import commentReactionRepository from './comment-reaction.repository';
import BaseRepository from './base.repository';

const Op = Sequelize.Op;

const likeCase = bool => `CASE WHEN "postReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;
const likeCommentCase = bool => `SELECT "commentReactions"."isLike", CASE WHEN "isLike" = ${bool} THEN 1 ELSE 0 END FROM "commentReactions"`;

class PostRepository extends BaseRepository {
    async getPosts(filter) {
        const {
            from: offset,
            count: limit,
            userId: queryUserId
        } = filter;
        console.log('queryUserId: ', queryUserId);

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
                    // [sequelize.literal(`
                    //     (select users.username from "users" inner join (SELECT * FROM "postReactions" WHERE "postReactions"."isLike" = false) AS react on users.id = react."userId")`), 'peopleWhoLiked Post'],
                    // [sequelize.literal(`
                    //     (SELECT "user"."id"
                    //     FROM "postReactions" as "reaction"
                    //     WHERE "post"."id" = "reaction"."postId")`), 'peopleWhoLiked Post'],
                    [sequelize.fn('SUM', sequelize.literal(likeCase(true))), 'likePostCount'],
                    [sequelize.fn('SUM', sequelize.literal(likeCase(false))), 'dislikePostCount']
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
                attributes: ['isLike'],
                duplicating: false,
                include: {
                    model: UserModel,
                    attributes: ['id', 'username']
                }
            }],
            group: [
                'post.id',
                'image.id',
                'user.id',
                'user->image.id',
                'postReactions.id',
                'postReactions->user.id',
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
                'comments->commentReactions.id',
                'comments->commentReactions->user.id',
                'user.id',
                'user->image.id',
                'image.id',
                'postReactions.id',
                'postReactions->user.id',
                // 'postReactions->user.username'
            ],
            where: { id },
            attributes: {
                include: [
                    [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId")`), 'commentCount'],
                    [sequelize.fn('SUM', sequelize.literal(likeCase(true))), 'likePostCount'],
                    [sequelize.fn('SUM', sequelize.literal(likeCase(false))), 'dislikePostCount'],
                    // [sequelize.fn('SUM', sequelize.literal(`CASE WHEN public.commentReactions."isLike" = true THEN 1 ELSE 0 END`)), 'likeCommentCount'],
                    // [sequelize.fn('SUM', sequelize.literal(likeCommentCase(false))), 'dislikeCommentCount']
                ]
            },
            include: [{
                model: CommentModel,
                include: [{
                    model: UserModel,
                    attributes: ['id', 'username'],
                    include: {
                        model: ImageModel,
                        attributes: ['id', 'link']
                    }
                }, {
                    model: CommentReactionModel,
                    attributes: ['isLike'],
                        include: {
                            model: UserModel,
                            attributes: ['id', 'username']
                        }
                }]
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
                attributes: ['isLike'],
                duplicating: false,
                include: {
                    model: UserModel,
                    attributes: ['id', 'username']
                }
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


//SOMETHING WORKING
// {
//     model: CommentModel,
//     include: [{
//         model: UserModel,
//         attributes: ['id', 'username'],
//         include: {
//             model: ImageModel,
//             attributes: ['id', 'link']
//         }
//     }, 
//     {
//         model: CommentReactionModel,
//         attributes: ['isLike'],
//             include: 
//                 {
//                   model: UserModel,
//                   attributes: ['username']
//                   // [sequelize.fn('SUM', sequelize.literal(likeCommentCase(true))), 'likeCommentCount'],
//                   // [sequelize.fn('SUM', sequelize.literal(likeCommentCase(false))), 'dislikeCommentCount']
//                 }
        
//     }
//     ]
// }



// {
//   model: PostReactionModel,
//   attributes: ['id', 'isLike'],
//   // duplicating: false,
//   include: {
//       model: UserModel,
//       attributes: ['username', 'id']
//   }

  // attributes: ['isLike'], //IT WORKS
  // duplicating: false,
  // include: {
  //     model: UserModel,
  //     attributes: ['username']
  // }
// }