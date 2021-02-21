# Periodic Table Database

> Welcome to the Periodic Table Database project!

## 1. Instructions

I have started you off with a `periodic_table` database that has information about some chemical elements. You can connect to it by entering `psql —username=freecodecamp —dbname=periodic_table` in the terminal. It’s a good idea to get a little familiar with the existing tables, columns and rows. Read the instructions below and complete user stories to finish the project. Good luck!

Part 1: Fix the database

There are many errors in database I need you need to fix. You can set the database back to how it was at the start of the project by clicking the `reset` button.

Part 2: Create your git repository
- Create a `period_table` folder in your `project` folder and turn it into a git repository with `git init`
- Your repository should have a `main` branch with all your commits
- Your repository should have at least five commits.
- The first commit message should be `Initial commit`
- The rest of the commit message should start with `fix:`, `feat:`, `refactor:`, `chore:` 

Part 3: Create a script
Most of the elements have a melting point and a boiling point in celsius in the database. I want you to make a script that tells me those values in farhenheit and kelvin. The conversion formula for Fahrenheit is `(celsius × 9/5) + 32`. The conversion formula for Kelvin is `celsius + 273.15`.

- Create a `elements.sh` file
- Give executable permissions
- Your script should accept an argument that represents the `atomic_number`
- The script should give me the celsius, fahrenheit, and kelvin temperatures for the `atomic_number` that is input
- If I run `./elements.sh 5` it should output: `<name> has a melting point of #C, which equates to #F or #k. It's boiling point is #C, which equates to #F or #K.`
- If the element doesn't have a melting or boiling, it should ouput `<name> does not have a melting point.`
- If I enter a non existing `atomic_number` as the argument, it should output `I cannot find that atomic number in my database`

Part 4: Complete the `queries.sh` file

### 1.1

Complete the tasks below

#### SUBTASKS

- You should add `unique` and `not null` constraints to the `symbol` and `name` columns from the `elements` table
- You should capitalize the first letter of all the symbols in the `elements` table
- You should remove all the irrelevant trailing zeros and the end of the decimals from each value in the `properties` table. You may need to adjust a data type to `decimal` for this
- You should set the `atomic_number` column from `properties` as a foreign key that references the column of the same name in the `elements` table
- You should create a `types` table for the different element types
- Your `types` table should have a `type_id` column that is a primary key
- Your `types` table should have a `type` column
- Your `properties` table should have a `type_id` foreign key that references the `type_id` column from the `types` table
- Each row in your `properties` table should have a `type_id` value that links to the correct type from the `types` table
- Your `properties` table should not have a `type` column
- You should rename the `weight` column to `atomic_mass`
- You should rename the `melting_point` column to `melting_point_celsius` and the `boiling_point` column to `boiling_point_celsius`
- You should delete the non existing element, whose `atomic_number` is `1001` from the two tables. You will need to delete it in one table first.
- You should insert the next two elements into the database into the existing tables. They are: 
| atomic_number | Symbol | Name     | type     | atomic_mass | melting_point_celsius | boiling_point_celsius |
| ------------- | ------ | -------- | -------- | ----------- | --------------------- | --------------------- |
| 9             | F      | Fluorine | Nonmetal | 18.998      | -220                  | -188.1                |
| 10            | Ne     | Neon     | Nonmetal | 20.18       | -248.6                | -246.1                |
- You should turn the `periodic_table` folder into a git repository with `git init`
