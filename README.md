# Rocket Academy Coding Bootcamp: Instagram

https://bc.rocketacademy.co/2-full-stack/2.e-exercises/2.e.1-instagram-chat

## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Upcoming features

To reuse the PostCard component in the Feed and in the individual pages with comments, additional refactoring is needed, e.g. to bring down the handleLikes/Unlikes functions into the PostCard component itself to update the post's data on Firebase, and let Feed pull changes to the child from Firebase.

To enable comments, a new component needs to be created, to be able to write data (comments) to Firebase, and render the comments as part of the post.
