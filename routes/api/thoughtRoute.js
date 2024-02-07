const router = require('express').Router();
const { 
    getAllThoughts, 
    createThought, 
    getThoughtById, 
    updateThought, 
    deleteThought, 
    createReaction, 
    deleteReaction 
} = require('../../controllers/thoughtController');

router.route('/')
.get(getAllThoughts)
.get(createThought);


router.route('/:thoughtId')
.get(getThoughtById)
.put(updateThought)
.delete(deleteThought);

router.route('/:thoughtId/:reactions')
.post(createReaction);

router.route('/:thoughtId/:reactions/:reactionId')
.delete(deleteReaction);

module.exports = router;