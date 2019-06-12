import { Router } from 'express';
import * as commentService from '../services/comment.service';

const router = Router();

router
    // .get('/react/all', (req, res, next) => commentService.getCommentReactions(req.query)
    //     .then(reactions => res.send(reactions))
    //     .catch(next))
    .get('/:id', (req, res, next) => commentService.getCommentById(req.params.id)
        .then(comment => res.send(comment))
        .catch(next))
    .post('/', (req, res, next) => commentService.create(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
        .then(comment => res.send(comment))
        .catch(next))
    .put('/react', (req, res, next) => commentService.setReaction(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
        .then((reaction) => {
            // console.log('reaction: ', reaction);
            if (reaction.post && (reaction.post.userId !== req.user.id)) {
                // notify a user if someone (not himself) liked his post
                req.io.to(reaction.post.userId).emit('like', 'Your post was liked!');
            }
            return res.send(reaction);
        })
        .catch(next));

export default router;
