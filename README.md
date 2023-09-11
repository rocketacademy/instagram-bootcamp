Deployment

Step

1. sudo npm install -g firebase-tools
2. firebase login
3. firebase init

- Are you ready to proceed ? press ‘y’ (Yes)
- Which Firebase features do you want to set up for this directory? (From the options come to the option “Hosting: Configure files for Firebase Hosting”. Now press ‘space bar’. You will see the option is marked with a star mark (\*). Now press ‘Enter’.
- Project Setup : You have to choose the project of your firebase. Choose your project.
- Select: use an existing project.
- Hosting Setup : (Here is one important part)
- You will be asked to set your public directory? It may be suggesting “public” but don’t select it. As you are using Vite, you have to write “dist” (this will be created after building our project, which consists another index.html)

Then comes the following set of questions,

1. Configure as a single-page app (rewrite all urls to /index.html)? (Yes)
2. Set up automatic builds and deploys with GitHub? (No)
3. Optional, if you have already done npm run build then you must already have the index.html file then you will be asked : File dist/index.html already exists. Overwrite? (Yes)

Firebase Initialization Complete !!!

4. npm run build

5. firebase deploy - it will shows Hosting URL.
