If you are doing development, read this.

This is the admin dashboard.
It is made using Mongo DB Atlas, Express, React and Node
It should be deployed already. Link is: http://192.168.23.117:3000/

The frontend code is in client, the backend in backend.

If you are confused, try learning React, Node and how websites work.

The Basics:
-Open the fullstack_app in your preferred text editor (Visual Studios)
-Run "npm install" on all three directories. fullstack_app, client, backend
    -You need to download Node.js to do this
-To run the app, cd into fullstack_app and run "npm start"
    -This should open up localhost:3000 and you should see the home page

React:
-The frontend is made using React. Various libraries were tested out and used.
    -If you don't know React, learn about it on their website

-The Google Maps API is using my key. When this expires, you will need to get a new key.

Backend:
-server.js is running all the backend code. If you want to add something to the MongoDB, follow these steps
    -Make a schema (data.js)
    -Make something that receives the post request (initialize...)
    -Make sure to use the schema you created
    -Make something that can get the data
        -In the frontend code, axios is used to make http requests

Files:
    App.js - Contains the routing and the header
    Home.js - Home page, contains data
    Controller.js - Fetches data for the Home and Table
    CompanyData.js - CompanyData page with data and layout



