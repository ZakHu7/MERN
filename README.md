This is the admin dashboard.
If you are doing development, read this.

You should have experience with HTML, CSS and Javascript.
It is made using Mongo DB Atlas, Express, React and Node

If you already have experience with these, it shouldn't be hard to continue and improve my code.
If you never used these technologies before, it's okay, I didn't either when I made this but I learned.
Google is your friend.

It should be deployed already. Link is: http://192.168.23.117:3000/
If it is not, remote into Dashboard and open up the shortcut to the folder on the Desktop, then run the vbscript file

The frontend code is in client, the backend code in backend.

The Basics:
-To view code, open the fullstack_app folder in your preferred text editor (eg. Visual Studios Code)
-Before you can run, you must run "npm install" on all three directories. fullstack_app, client, backend
    -Run it in cmd, make sure you cd into all three directories
    -You need to download Node.js to do this
-To run the app, cd into fullstack_app and run "npm start"
    -Make sure you are in the right directory, it should say 
    concurently "cd backend && node server.js" "cd client && npm start"
    -This should open up localhost:3000 and you should see the home page
-If you want to add new libraries, do npm install <name>
    

React:
-The frontend is made using React. Various libraries were tested out and used.
    -If you don't know React, learn about it on their website
-The API variable found in CompanyData.js and Controller.js will need to be changed to your ip address or localhost
(I added a comment to change it to localhost)
-The Google Maps API is using my API key. When this expires, you will need to get a new key. This should be in a year
-If you have never used React before, try following some of the code. It should be fairly straightforward
    I get the data, then save it in the State, then pass it into Components by using Props

Backend:
-server.js is running all the backend code. If you want to add something to the MongoDB, follow these steps
    -Make a schema (eg. somethingData.js)
    -Make something that receives the post request (/initialize...)
    -Make sure to use the schema you created
    -Make something that can get the data
        -In the frontend code, axios is used to make http requests
-You can choose to either use my MongoDB account or make a company one
-My login for MongoDB is zhu@rombald.com, Jays2016!
-From there, click on Collections to see what is being stored there
-Note the collection name is derived from the schema that you make

Files:
    App.js - Contains the routing and the header
    Home.js - Home page, contains data
    Controller.js - Fetches data for the Home and Table
    Filters.js - Holds information about filters for the Table
    CompanyData.js - CompanyData page with data and layout
    *Charts.js - Charts
    *Data.js - mongoose Schemas
    credentials/mongodb.js - credentials for the login for MongoDB. Do not share this
    googleMapsApi.js - API key. Do not share this
        -make sure these two files remain in gitignore so they aren't published
    open_app.bat - Runs npm start on the command line
    start_app.vbs - Script that runs open_app.bat

How to use
    -I have buttons called Refresh Data in both the home page and the company data page
    -Pressing them will load data from the SQL server and update the MongoDB.
    WAIT A COUPLE OF SECONDS FOR IT TO FULLY LOAD. IF YOU DON'T THE DATA WILL BE MISSING
    then refresh the page to see changes

How to deploy
    -Currently, I have the code running constantly on the Dashboard server
    -I pulled it from github and changed some things like the API address, added in the credentials and API key
    -To run it without going into the cmd and typing npm start, I created a vbscript file called start_app.vbs that runs it
    -When it first runs, the cpu is capped so the computer lags for a bit. It also uses quite a bit of the RAM

Things to improve
    -The charts. Make sure the data is accurate
    -Backlog chart. I did not have time to implement. Will need to loop through past months to see past data.
    -I could not get async/await to work with the data saving. I wanted it to load new data and then show it immediately,
    instead of having to refresh the page. The key is to fetch new data only after loading new data is successful.
    -I wanted this to be hosted on the web. That is why I used a separate DB and a button to load new data.
    Even if it cannot be completely deployed on a remote server, it would still be good to deploy it using another method.
    -The graphs on the Home page were intended to help generate some numbers for the quoting tool. Since I never had enough
    data to work with, nothing came of it. I will include an excel sheet that has some Square Footages of projects that Devon wrote.
    Those have yet to be put into the database, although double check some of the questionable numbers
    -Could integrate a domain login system, similar to the current dashboard for employees. If not, a password and username could work.


If you haven't taken a look already, there is also a README.md file for the employee dashboard as well.

Good luck, Have fun