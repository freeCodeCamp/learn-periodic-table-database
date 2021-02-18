# Periodic Table Database

> Welcome to the Periodic Table Database project!

## 1. Instructions

I have started you off with several files. One of them is `games.csv`. It contains a comma-separated list of all games of the final three rounds of the World Cup tournement since 2014, the titles are at the top. It includes the year of each game, the round of the tournament the game was in, the winner, their opponenet, and the number of goals each team scored. You need to do three things for this project:

Create the database according to the user stories.
You can log into the psql interactive terminal with `psql --username=freecodecamp --dbname=postgres`. Create your database structure with the interactive terminal. Don't forget to connect to the database after you create it.

Complete the `insert_data.sh` script to correctly insert all the data from `games.csv` into the database.
I have started the file for you. Do not modify any of the code I have started you with. Use the `PSQL` variable I defined to query your database. My tests will use first value of the variable, you will use the second. The tests have a 10 second limit, so try to make your script efficient. The less you have to query the database, the faster it will be. Hint: you can empty out the data in your database by entering `TRUNCATE TABLE games, teams;` in the psql prompt before testing your script.

Complete empty `echo` commands in the `queries.sh` file to produce output that matches the `example-output.txt` file. I have started the file and completed the first one for you. Use the `PSQL` variable I have defined to complete the queries. Note that you need to have your database filled with the correct data from previous script in order to get the correct results from your queries. Hint: test your queries in the psql prompt first and then add them to the script file.

### 1.1

Complete the tasks below

#### SUBTASKS

- You should create a database named `worldcup`
