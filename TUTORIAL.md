# Periodic Table Database

> Welcome to the Periodic Table Database project!

## 1. Instructions

I have started you off with a `periodic_table` database that has information about some chemical elements. You can connect to it by entering `psql --username=freecodecamp --dbname=periodic_table` in the terminal. It’s a good idea to get a little familiar with the existing tables, columns, and rows. Read the instructions below and complete user stories to finish the project. Good luck!

Part 1: Fix the database

I made some mistakes when creating the database, there are a few things I need fixed or changed. See the user stories below for what to change.

Part 2: Create your git repository

I need you to make a small bash program for me. I want the code version controlled with `git`, so you will need to turn the suggested folder into a git repository.

Part 3: Create the script

Lastly, I want to you to make a script that accepts an argument that can be an `atomic number`, `symbol`, or `name` of an element and outputs some information about the given element. Each element in the database has a melting point and boiling point in celsius. Part of the script will be to convert those temperatures into Fehrenheit and Kelvin. The conversion formula for Fahrenheit is `(celsius × 9/5) + 32`, and `celsius + 273.15` for Kelvin. The output from your script should be: `The element with atomic number <atomic_number> is <name> (<symbol>). It's a <type> with a mass of <atomic_mass> amu. <name> has a melting point of <melting_point> Celsius, <temperature> Fahrenheit, or <temperature> Kelvin. It's boiling point is <boiling_point> Celsius, <temperature> Fehrenheit, <temperature> Kelvin.`

### 1.1

Complete the tasks below

#### SUBTASKS

- You should rename the `weight` column to `atomic_mass`
- You should add the `UNIQUE` constraint to the `symbol` and `name` columns from the `elements` table
- Your `symbol` and `name` columns should have the `NOT NULL` constraint
- You should set the `atomic_number` column from the `properties` table as a foreign key that references the column of the same name in the `elements` table
- You should create a `types` table that will store the three types of elements
- Your `types` table should have a `type_id` column that is an integer and the primary key
- Your `types` table should have a `type` column that can store the different types from the `type` column in the `properties` table
- You should add three rows to your `types` table whose values are the three different types from the `properties` table
- Your `properties` table should have a `type_id` foreign key column that references the `type_id` column from the `types` table. It should be an `INT` with the `NOT NULL` constraint
- Your `properties` table should not have a `type` column
- Each row in your `properties` table should have a `type_id` value that links to the correct type from the `types` table
- You should capitalize the first letter of all the `symbol` values in the `elements` table
- You should remove all the irrelevant trailing zeros after the decimals from each value in the `properties` table. You may need to adjust a data type to `DECIMAL` for this
- You should insert the next two elements into the database into the existing tables. They are: 9, F, Fluorine, Nonmetal, 18.998, -220, -188.1, and 10, Ne, Neon, Nonmetal, 20.18, -248.6, -246.1
- You should turn the `periodic_table` folder into a git repository with `git init`
- Your repository should have a `main` branch with all your commits
- Your `period_table` repo should have at least five commits
- You should create an `element.sh` file in your repo folder for the program I want you to make
- Your script (`.sh`) file should have executable permissions
- If I run `./element.sh 1`, `./element.sh H`, or `./element.sh Hydrogen`, it should output `The element with atomic number 1 is Hydrogen (H). It's a Nonmetal with a mass of 1.008 amu. Hydrogen has a melting point of -259.1 Celsius, -434.38 Fahrenheit, or 14.05 Kelvin. It's boiling point is -252.9 Celsius, -423.22 Fehrenheit, or 20.25 Kelvin.`
- If I run your script with another element as input, I should get the same output but with information associated with the given element.
- It the argument input to your script doesn't exist as an `atomic_number`, `symbol`, or `name` in the database, the output should be `I could not find any information in the database about that element.`
- The message for the first commit in your repo should be `Initital commit`
- The rest of the commit messages should start with `fix:`, `feat:`, `refactor:`, `chore:`, or `test:`
- You should rename the `melting_point` column to `melting_point_celsius` and the `boiling_point` column to `boiling_point_celsius`
- Your `melting_point_celsius` and `boiling_point_celsius` should not accept null values
- You should delete the non existent element, whose `atomic_number` is `1001`, from the two tables
- You should finish your project while on the `main` branch. Your working tree should be clean, you should not have any uncommitted changes in your repo
