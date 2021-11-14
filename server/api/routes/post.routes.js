import { Router } from 'express';
import * as postService from '../services/post.service.js';
import { SENDGRID_API_KEY } from '../../config/email.config.js';

const router = Router();
const sgMail = require('@sendgrid/mail');

router
    .get('/', (req, res, next) => postService.getPosts(req.query)
        .then(posts => res.send(posts))
        .catch(next))
    .get('/:id', (req, res, next) => postService.getPostById(req.params.id)
        .then(post => res.send(post))
        .catch(next))
    .post('/', (req, res, next) => postService.create(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
        .then((post) => {
            req.io.emit('new_post', post); // notify all users that a new post was created
            return res.send(post);
        })
        .catch(next))
    .put('/:id', (req, res, next) => postService.updatePostById(req.params.id, req.body) 
        .then((post) => {
            req.io.emit('update_post', post); // notify all users that a post was updated
            return res.send(post);
        })
        .catch(next))
    .put('/react/:id', (req, res, next) => postService.setReaction(req.user.id, req.body)
        .then((reaction) => {
            if (reaction.post && (reaction.post.userId !== req.user.id)) {
                sgMail.setApiKey(SENDGRID_API_KEY);
                const msg = {
                    to: reaction.post.user.email,
                    from: 'support@thread-js.com',
                    subject: 'Your post was liked by someone',
                    text: 'Your post was liked by someone',
                };
                sgMail.send(msg);
                // notify a user if someone (not himself) liked his post
                req.io.to(reaction.post.userId).emit('like', 'Your post was liked!');
            }
            return res.send(reaction);
        })
        .catch(next))
    .post('/share', (req, res, next) => {
        sgMail.setApiKey(SENDGRID_API_KEY);
        const msg = {
            to: req.body.to,
            from: req.body.from,
            subject: req.body.subject,
            text: req.body.text,
        };
        sgMail.send(msg);
        return res.json({body: true});
    });

export default router;
