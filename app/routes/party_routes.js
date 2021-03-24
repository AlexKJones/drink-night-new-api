// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for partys
const Party = require('../models/partys')
const Review = require('../models/reviews')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { party: { title: '', text: 'foo' } } -> { party: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /partys
router.get('/partys', (req, res, next) => {
  Party.find()
    .then(partys => {
      // `partys` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return partys.map(party => party.toObject())
    })
    // respond with status 200 and JSON of the partys
    .then(partys => res.status(200).json({ partys: partys }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /partys/5a7db6c74d55bc51bdf39793
router.get('/partys/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  let reviews
  Review.find({ party: req.params.id })
    .then(foundRevs => {
      // console.log(foundRevs)
      reviews = foundRevs
      return Party.findById(req.params.id)
    })
    .then(handle404)
    .then(party => {
      party.reviews = reviews
      console.log('party is ', party)
      res.status(200).json({ party: party, reviews: reviews })
    })
    .catch(next)
})

// CREATE
// POST /partys
router.post('/partys', requireToken, (req, res, next) => {
  // set owner of new party to be current user
  req.body.party.owner = req.user.id

  Party.create(req.body.party)
    // respond to succesful `create` with status 201 and JSON of new "party"
    .then(party => {
      res.status(201).json({ party: party.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /partys/5a7db6c74d55bc51bdf39793
router.patch('/partys/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prparty that by deleting that key/value pair
  delete req.body.party.owner

  Party.findById(req.params.id)
    .then(handle404)
    .then(party => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, party)

      // pass the result of Mongoose's `.update` to the next `.then`
      return party.updateOne(req.body.party)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /partys/5a7db6c74d55bc51bdf39793
router.delete('/partys/:id', requireToken, (req, res, next) => {
  Party.findById(req.params.id)
    .then(handle404)
    .then(party => {
      // throw an error if current user doesn't own `party`
      requireOwnership(req, party)
      // delete the party ONLY IF the above didn't throw
      party.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
