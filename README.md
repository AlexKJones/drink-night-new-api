This application is meant for trying to figure out what to/what not to watch on Netflix based off of user reviews.

Planning Story: We started by setting up the backend routes and confirming functionality, and then moved on to the frontend. From there, we established functionality and moved to dressing it up.

User Stories: As a unregistered user, I would like to sign up with email and password. As a registered user, I would like to sign in with email and password. As a signed in user, I would like to change password. As a signed in user, I would like to sign out. As a unregistered user, I would like to see all users blog posts. As a unregistered user, I would like to see comments on those blog posts. As a signed in user, I would to create blog posts. As a signed in user, I would to comment on other users' blog posts. As a signed in user, I would to update my blog posts and comments. As a signed in user, I would to delete my blog posts and comments.

Technologies Used: Javascript, HTML/CSS React, React Bootstrap Axios

Unsolved Problems: Connecting the API successfully for the deployed version.

### Catalog of Routes

Verb         |	URI Pattern
------------ | -------------
POST | /sign-up
POST | /sign-in
PATCH | /change-password
DELETE | /sign-out 
GET  |  /
GET | //:id


Wireframe: [Wireframe]

ERD: [ERD]

Alternate Repo: [API]

Heroku API: [Deployed Heroku API]

Deployed Client-Side Link: [Deployed Client-Side]
