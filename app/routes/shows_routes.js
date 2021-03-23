// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for shows
const Show = require('../models/shows')
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
// { show: { title: '', text: 'foo' } } -> { show: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /shows
router.get('/shows', (req, res, next) => {
  Show.find()
    .then(shows => {
      // `shows` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return shows.map(show => show.toObject())
    })
    // respond with status 200 and JSON of the shows
    .then(shows => res.status(200).json({ shows: shows }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /shows/5a7db6c74d55bc51bdf39793
router.get('/shows/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  let reviews
  Review.find({ show: req.params.id })
    .then(foundRevs => {
      // console.log(foundRevs)
      reviews = foundRevs
      return Show.findById(req.params.id)
    })
    .then(handle404)
    .then(show => {
      // console.log(reviews)
      show.reviews = reviews
      console.log('show is ', show)
      res.status(200).json({ show: show, reviews: reviews })
    })
    .catch(next)
})

// CREATE
// POST /shows
router.post('/shows', requireToken, (req, res, next) => {
  // set owner of new show to be current user
  req.body.show.owner = req.user.id

  Show.create(req.body.show)
    // respond to succesful `create` with status 201 and JSON of new "show"
    .then(show => {
      res.status(201).json({ show: show.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /shows/5a7db6c74d55bc51bdf39793
router.patch('/shows/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.show.owner

  Show.findById(req.params.id)
    .then(handle404)
    .then(show => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, show)

      // pass the result of Mongoose's `.update` to the next `.then`
      return show.updateOne(req.body.show)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /shows/5a7db6c74d55bc51bdf39793
router.delete('/shows/:id', requireToken, (req, res, next) => {
  Show.findById(req.params.id)
    .then(handle404)
    .then(show => {
      // throw an error if current user doesn't own `show`
      requireOwnership(req, show)
      // delete the show ONLY IF the above didn't throw
      show.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
