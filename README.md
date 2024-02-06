<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# 0. Introduction 
Project Description
This project involves the creation of a comprehensive social media platform, designed to allow users to interact, share posts, and view profiles. The platform is developed with a focus on user and post management functionalities.
Project Requirements
Database Management: Integration with a NoSQL database 
Authentication and Security: Implementation of secure authentication (using JWT) and data protection practices.
API Development: Creation of RESTful APIs for various functionalities like user management and post interactions.
User Account Management: Registration, login, profile update, and account deactivation/reactivation functionalities.
Post Management: Creating, updating, deleting, and viewing posts, along with file upload capabilities for posts.
User Interaction: Features like following/unfollowing users and liking/unliking other user posts .
Content Filtering: Abilities to filter the content posted by users.
Support Dual language: include the arabic language along with English
Unit testing for User login and Registration journey
Project Stages
The project was divided into stages based on these requirements:
Initial Setup: Configuring the server, database, and core modules.
Database Design and Schema Definition: Creating user and post schemas.
User Authentication: Implementing login mechanisms and security features.
User Management: Developing functionalities for account creation, updates, and profile viewing.
Post Management: Building the system for post interactions.
User and Post Interaction: users interacting with each other and their posts
User wall view management: Developing filters 
Unit testing: User Login and Registration journey
Adding Arabic language: Creating translation files

# 1. Initial Setup 
Files
main.ts, app.module.ts
Description
Setting up the core application framework, configuration of modules, and integration of various components. This stage includes initializing the server and setting up the primary application module.

Technology Stack
 Node.js with NestJS framework, MongoDB database

# 2. Database Design and Schema Definition 
Files
posts.schema.ts, user.schema.ts
Description
Designing the database schema to define how user data and posts are stored. This involves creating models for users and posts, outlining their attributes.
User Schema (user.schema.ts) 
Designing a schema to manage user data, including the following attributes: username (required), password (required), email (required) , full name (required), bio (optional), hobbies (optional) , occupation (optional), location (optional), following (account that the user follows), active (whether the user account is active, default true), and user posts.
Posts Schema (posts.schema.ts) 
Creating a schema for posts, which includes the following attributes: title, contents, image, creation date, user (user that made the post), likes (list of users that liked the post)

# 3. User Authentication
Files
user.guard.ts, login.dto.ts, CreatePost.dto.ts, userservice.ts, usercontroller.ts, constants.ts
Description
Implementing authentication mechanisms to manage user login processes and secure access to the platform. This includes setting up guards for route protection and data transfer objects (DTOs) for login. Implementing secure login processes, including password hashing using bcrpyt and token generation using jwt. Setting up guards for route protection to ensure that only authenticated users can access certain functionalities.
APIs created in this stage in usercontroller.ts
1. User SignUp
Endpoint: POST /users/signup
Functionality: Registers a new user using the following details: email (required),  username (required), password (required), Full Name (required), bio (optional), hobbies (optional), location (optional), occupation (optional). After signing up, a jwt access token is generated for the user and returned. 
2. User Login
Endpoint: POST /users/login
Functionality: Authenticates a user using their username and password, it also returns a token after logging in using jwt.

# 4. User Account Management
Files
createuser.dto.ts, updateuser.dto.ts, viewprofiledto.ts, user.service.ts, user.controller.ts, 
Description
Developing functionalities for user account creation, profile updates, and profile viewing. This stage encompasses user registration, updating user information, and retrieving user profiles. Enabling users to create accounts (createuser.dto.ts), update their profiles (updateuser.dto.ts), and view profiles (viewprofiledto.ts). This includes handling user data validation.
APIs created in this stage in usercontroller.ts
1. Get Users
Endpoint: GET /users
Functionality: Retrieves a list of users whether they are active or inactive and it uses pagination.
2. Get User
	Endpoint: GET users/profile
	Functionality: Gets the profile of the user currently logged in
3. Get User by ID 
	Endpoint: GET users/profile/:id 
	Functionality: Allows a user to views other user profile using viewprofile.dto.ts
	The user profile appears as follows:		
4. Update User
Endpoint: PATCH /users/profile/update
Functionality: Authenticates a User that wants to update their profile and allows them to update it using updateuser.dto.ts.
5. Delete User
Endpoint: DELETE /users/profile/delete 
Functionality: Authenticates a User that wants to delete their profile and allows them to delete it.
6. Deactivate User
Endpoint: POST /users/profile/deactivate
Functionality: Allows a user to deactivate their own account. The method handles the deactivation of the user's account. It identifies the user via the request object and makes the active attribute in the database false. An error is thrown if the user is not found.
7. Activate User
Endpoint: POST /users/profile/activate
Functionality: Enables a user to reactivate their account. The method is used for reactivating a user's account. It functions similarly to the deactivate method but reverses the process.

# 5. Post Management 
Files
posts.controller.ts, posts.service.ts, CreatePosts.Dto.ts, UpdatePosts.Dto.ts, ViewPost.Dto.ts
Description
Building the system for creating, updating, and viewing posts. This includes handling post creation, editing posts, and displaying posts to users. Facilitating users to create (CreatePosts.Dto.ts), update (UpdatePosts.Dto.ts), view (ViewPost.Dto.ts) posts, and delete posts. 
APIs created in this stage in postcontroller.ts
1. Create Post
Endpoint: POST /posts/createPost
Functionality: Allows users to create a new post by entering title, contents and image (optional) using CreatePosts.dto.ts. If you want to upload an image you can choose the size of the image either a thumbnail(100x100), featured(200x200) and item (500x500)
2. Update Post
Endpoint: PATCH /posts/update/:id
Functionality: Verifies that the user that wants to update the post is the owner of the post and then allows the user to update an existing post identified by an ID. The creation date changes then to the date the user updated at.
3. Delete Post
Endpoint: DELETE /posts/delete/:id 
Functionality: Verifies that the user that wants to delete the post is the owner of the post and then allows the user to delete an existing post identified by an ID.
4. Get Posts
Endpoint: GET /posts 
Functionality: Retrieves all posts of all users.
5. Get Posts by ID
	Endpoint: GET /posts/:id 
	Functionality: Retrieve a posts by its ID using viewpostdto.ts

# 6. User & Post Interaction
Files
user.service.ts, user.controller.ts, postservice.ts, postcontroller.ts
Description
Developing functionalities for user & Post interaction. This stage encompasses users following and unfollowing each other, user liking and unliking each other's posts, and viewing likes on a post.
APIs created in this stage in both postcontroller.ts and usercontroller.ts
1. Follow User
Endpoint: POST /users/profile/follow/:id
Functionality: Allows a user to follow another user.The method takes the ID of the user to be followed as a URL parameter. It identifies the follower (current user) from the request object and interacts with UserService to establish the following relationship.

2. Unfollow User
Endpoint: POST /users/profile/unfollow/:id
Functionality: Enables a user to unfollow another user they are currently following. The method works similarly to the follow user method but reverses the following relationship. It also uses the UserService to handle the unfollow logic.

3. Like a post
Endpoint: GET posts/like/:id 
Functionality: Allows a user to like a post. The method works by taking the ID of the post the user wants to like. It identifies the user that wants to like the post from the request object. 

4. Unlike a post
Endpoint: GET posts/unlike/:id 
Functionality: Allows a user to like a post. The method works the same as liking a post but in reverse

5. View Likes on a post
	Endpoint: GET posts/viewLikes/:id 
	Functionality: allows a user to view the users that liked a post

6. View Image 
Endpoint: GET /posts/:imagepath
Functionality: As the image appears as a path when the user clicks on it, they are directed to the image to view it using the endpoint. 


# 7. User Wall Management: Developing Filters and Different User Views of Their Wall
Files
postcontroller.ts, postservice.ts, filtration.constants.ts
Description
The User Wall Management stage focuses on the functionality that allows users to view and interact with a stream of posts, commonly known as a "wall" or "feed," on the social media platform. A user has two views either the wall view which contains all users and a following view where the user observes the posts of the users they follow. A user has three options for filtration in each view: recent, oldest, mostLiked. All views have a default pagination of page = 1 and count = 3.
APIs created in this stage in postcontroller.ts
1. Wall View
Endpoint: GET /posts/wall
Endpoint with Pagination: GET /posts/wall?page=2&count=3
Functionality: Retrieves random posts by any user and lists them from the most recent post by default. The pagination contains two queries: count (how many posts in one page) and page (page number)
2. Wall View according to recent posts
Endpoint: GET /posts/wall/recent
Endpoint with Pagination: GET /posts/wall/recent?page=2&count=3
Functionality: Retrieves random posts by any user and lists them from the most recent post.
3. Wall View according to oldest posts
Endpoint: GET /posts/wall/oldest
Endpoint with Pagination: GET /posts/wall/oldest?page=2&count=3
Functionality: Retrieves random posts by any user and lists them from the oldest post.
4. Wall View according to most liked posts
Endpoint: GET /posts/wall/mostLiked
Endpoint with Pagination: GET /posts/wall/mostLiked?page=2&count=3
Functionality: Retrieves random posts by any user and lists them from the most liked post.
5. Following View
Endpoint: GET /posts/following
Endpoint with Pagination: GET /posts/following?page=2&count=3
Functionality: Retrieves posts created by users that a user follows and lists them from the most recent post by default.
6. Following View according to recent posts
Endpoint: GET /posts/following/mostLiked
Endpoint with Pagination: GET /posts/following/recent?page=2&count=3
Functionality:  Retrieves posts created by users that a user follows and lists them from the most recent post.
7. Following View according to oldest posts
Endpoint: GET /posts/following/oldest
Endpoint with Pagination: GET /posts/following/oldest?page=2&count=3
Functionality:  Retrieves posts created by users that a user follows and lists them from the most recent post.
8. Following View according to most liked posts
Endpoint: GET /posts/following/mostLiked
Endpoint with Pagination: GET /posts/following/mostLiked?page=2&count=3
Functionality:  Retrieves posts created by users that a user follows and lists them from the most liked post.

# 8. Unit testing
Files
user.service.spec.ts, user.controller.spec.ts
Description
The file user.controller.spec.ts uses Jest's mocking capabilities to mock dependencies like the UserService and I18nService. It tests two main scenarios: creating a user and logging in a user. For each scenario, it defines test cases that check whether the controller methods correctly interact with the UserService and return the expected results. The tests also validate that the appropriate methods of the mocked services are called with the expected arguments. The file user.service.spec.ts also include unit tests for the createUser and login methods of the UserService. It utilizes Jest's mocking capabilities to mock dependencies, including the database model for users (userModelMock) and the JWT service (jwtServiceMock). The tests cover various scenarios, such as successful user creation, handling of existing usernames during login, and handling incorrect passwords during login. The use of asynchronous functions and Promise-based assertions is prevalent in the tests to handle async operations like database queries.
Mocks are used to simulate database queries and responses, allowing for controlled testing of service methods.

# 8. Adding Arabic language
Files
en/translation.json, ar/translation.json, user.service.ts, posts.service.ts
Description
The files contain the translations of various messages returned by the program in arabic and english. The user in the request choose the language with english as default and the messages are returned in the language the user chooses


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the app with Docker
$ docker compose build 
$ docker compose up 


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
