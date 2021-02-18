const assert = require('assert');
const { Client } = require('pg');
const { getDirectoryContents, canExecute, getCommandOutput, getCommits, getScriptOutput } = require('./utils');

const connectionString = 'postgresql://postgres@localhost:5432/periodic_table';

const client = new Client({
  connectionString: connectionString
});

describe('SUBTASKS 1.1', async () => {
  before(async () => {
    try {
      await client.connect();
    } catch (error) {
      throw new Error('Cannot connect to PostgreSQL\n' + error);
    }
  });

  after(async () => {
    await client.end();
    console.log('client connections ended');
  });

  it(':1 You should rename the "weight" column to "atomic_mass"', async () => {
    const queryColumns = `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' AND column_name = 'weight' OR column_name = 'atomic_mass'`;
    const res = await client.query(queryColumns);

    if (!res) assert(false);

    const filtered = res.rows.filter(row => {
      return (row.table_name === 'properties' && row.column_name === 'atomic_mass') || row.column_name === 'weight';
    });

    assert(res.rowCount > 0 && filtered.length === 1 && filtered[0].column_name === 'atomic_mass');
  });

  it(':2 You should have "melting_point_celsius" and "boiling_point_celsius" columns, and not have columns with the old names', async () => {
    const queryTables = `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'properties';`;
    const res = await client.query(queryTables);

    if (!res) assert(false);

    const columns = res.rows.map(row => {
      return row.column_name;
    });

    assert(columns.includes('melting_point_celsius') && columns.includes('boiling_point_celsius') && !columns.includes('melting_point') && !columns.includes('boiling_point'));
  });

  it(':3 Your "melting_point_celsius" and "boiling_point_celsius" columns should not accept null values', async () => {
    const queryNotNull = `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND is_nullable='NO' AND table_name = 'properties';`;
    const res = await client.query(queryNotNull);
    
    if (!res) assert(false);

    const columns = res.rows.map(row => {
      return row.column_name;
    });

    assert(columns.includes('melting_point_celsius') && columns.includes('boiling_point_celsius'));
  });

  it(':4 You should add the "UNIQUE" constraint to the "symbol" and "name" columns', async () => {
    const queryUnique = `SELECT c.column_name FROM information_schema.key_column_usage AS c LEFT JOIN information_schema.table_constraints AS t ON t.constraint_name = c.constraint_name WHERE t.constraint_type = 'UNIQUE' AND c.table_name = 'elements'`;

    const res = await client.query(queryUnique);
    
    if (!res) assert(false);

    const filtered = res.rows.filter(row => {
      return row.column_name === 'symbol' || row.column_name === 'name';
    });

    assert(res.rowCount > 0 && filtered.length === 2);
  });

  it(':5 You should add the "NOT NULL" constraint to the suggested columns', async () => {
    const queryNotNull = `SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema = 'public' AND is_nullable='NO' AND table_name = 'elements';`;

    const res = await client.query(queryNotNull);
    
    if (!res) assert(false);

    const filtered = res.rows.filter(row => {
      return row.column_name === 'symbol' || row.column_name === 'name';
    });

    assert(res.rowCount > 0 && filtered.length === 2);
  });

  it(':6 Your "atomic_number" column should be a foreign key that references the correct column', async () => {
    const queryForeignKeys = `SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name WHERE constraint_type = 'FOREIGN KEY';`;

    const res = await client.query(queryForeignKeys);
    
    if (!res) assert(false);

    const filtered = res.rows.filter(row => {
      return row.table_name === 'properties' && row.column_name === 'atomic_number' && row.foreign_table_name === 'elements' && row.foreign_column_name === 'atomic_number';
    });

    assert(res.rowCount > 0 && filtered.length > 0);
  });

  it(':7 You should create a "types" table', async () => {
    const queryTables = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
    const res = await client.query(queryTables);

    if (!res) assert(false);

    const filtered = res.rows.filter(row => {
      return row.table_name === 'types';
    });

    assert(res.rowCount > 0 && filtered.length > 0);
  });

  it(':8 Your "types" table should have a "type_id" colunn with the correct properties', async () => {
    const queryPrimaryKeyDataType = `SELECT c.table_name, c.column_name, c.data_type FROM information_schema.table_constraints tc JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name) JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema AND tc.table_name = c.table_name AND ccu.column_name = c.column_name WHERE constraint_type = 'PRIMARY KEY';`;
    const res = await client.query(queryPrimaryKeyDataType);

    if (!res) assert(false);

    const filtered = res.rows.filter(row => {
      return row.table_name === 'types' && row.column_name === 'type_id' && row.data_type === 'integer';
    });

    assert(res.rowCount > 0 && filtered.length > 0);
  });

  it(':9 Your "types" table should have a "type" colunn with the correct properties', async () => {
    const queryTypeColumn = `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'types' AND column_name = 'type' AND is_nullable='NO' AND data_type = 'character varying';`;
    const res = await client.query(queryTypeColumn);

    if (!res) assert(false);

    assert(res.rowCount > 0);
  });

  it(':10 Your "types" table should have the correct three rows inserted', async () => {
    const query = `SELECT type FROM types;`;
    const res = await client.query(query);

    if (!res) assert(false);

    const types = res.rows.map(row => {
      return row.type;
    })

    assert(types.includes('metal') && types.includes('metalloid') && types.includes('nonmetal'));
  });

  it(':11 Your "properties" table should have a "type_id" column with the correct properties', async () => {
    const queryForeignKeys = `SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name WHERE constraint_type = 'FOREIGN KEY';`;
    const queryColumn = `SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'type_id' AND data_type = 'integer' AND is_nullable='NO';`;
    const res1 = await client.query(queryForeignKeys);
    const res2 = await client.query(queryColumn);

    if (!res1 || !res2) assert(false);

    const filtered = res1.rows.filter(row => {
      return row.table_name === 'properties' && row.column_name === 'type_id' && row.foreign_table_name === 'types' && row.foreign_column_name === 'type_id';
    });

    assert(filtered.length > 0 && res2.rowCount > 0);
  });

  it(':12 Each row in your "properties" table should have the correct "type_id" value', async () => {
    const queryValues = `SELECT atomic_number, types.type FROM properties FULL JOIN types ON properties.type_id = types.type_id;`;
    const res = await client.query(queryValues);

    if (!res) assert(false);

    assert(res.rowCount > 0);
  });

  it(':13 You should capitalize the first letter of all "symbol" values', async () => {
    const query = 'SELECT symbol from elements;';
    const res = await client.query(query);

    if (!res) assert(false);

    const filtered = res.rows.filter(row => {
      return row.symbol[0] !== row.symbol[0].toUpperCase();
    });

    assert(res.rowCount > 0 && filtered.length === 0);
  });

  it(':14 You should remove all trailing zero\'s from value\'s in the "atomic_mass" column of the "properties" table', async () => {
    const query = 'SELECT atomic_mass FROM properties;';
    const res = await client.query(query);

    if (!res) assert(false);

    const filtered = res.rows.filter(row => {
      return row.atomic_mass[row.atomic_mass.length - 1] == '0';
    });

    assert(res.rowCount > 0 && filtered.length === 0);
  });

  it(':15 You should correctly insert "Fluorine" into the database', async () => {
    const query = `select elements.atomic_number, symbol, name, atomic_mass, melting_point_celsius, boiling_point_celsius, types.type from elements FULL JOIN properties ON elements.atomic_number = properties.atomic_number FULL JOIN types ON properties.type_id = types.type_id;`;
    const res = await client.query(query);

    if (!res) assert(false);

    const filtered = res.rows.filter(row => {
      return row.atomic_number == 9 && row.symbol === 'F' && row.name === 'Fluorine' && row.atomic_mass == '18.998' && row.melting_point_celsius == '-220' && row.boiling_point_celsius == '-188.1' && row.type === 'nonmetal'
    });

    assert(res.rowCount > 0 && filtered.length > 0);
  });

  it(':16 You should correctly insert "Neon" into the database', async () => {
    const query = `select elements.atomic_number, symbol, name, atomic_mass, melting_point_celsius, boiling_point_celsius, types.type from elements FULL JOIN properties ON elements.atomic_number = properties.atomic_number FULL JOIN types ON properties.type_id = types.type_id;`;
    const res = await client.query(query);

    if (!res) assert(false);

    const filtered = res.rows.filter(row => {
      return row.atomic_number == 10 && row.symbol === 'Ne' && row.name === 'Neon' && row.atomic_mass == '20.18' && row.melting_point_celsius == '-248.6' && row.boiling_point_celsius == '-246.1' && row.type === 'nonmetal';
    });

    assert(res.rowCount > 0 && filtered.length > 0);
  });

  it(':17 Your "periodic_table" folder should be a git repository', async () => {
    const directoryContents = await getDirectoryContents('../periodic_table');

    if(!directoryContents) assert(false);

    assert(directoryContents.indexOf('.git') >= 0);
  });

  it(':18 Your repository should have a main branch', async () => {
    const commandOutput = await getCommandOutput('git branch');

    if(!commandOutput) assert(false);

    assert(/ main\s/.test(commandOutput));
  });

  it(':19 Your repository should have at least five commits', async () => {
    const commits = await getCommits();

    if(!commits) assert(false);

    assert(commits.length > 4);
  });

  it(':20 You should create an "element.sh" file in your repository', async () => {
    const directoryContents = await getDirectoryContents('../periodic_table');

    assert(directoryContents.indexOf('element.sh') >= 0);
  });

  it(':21 Your "element.sh" file should have executable permissions', async () => {
    const elementFileExecutable = await canExecute('../periodic_table/element.sh');

    if(!elementFileExecutable) assert(false);

    assert(elementFileExecutable);
  });

  it(':22 Running your script with the suggested input gives the output described', async () => {
    const commandOutput = await getCommandOutput('./element.sh');

    assert(commandOutput === `Please provide an element as an argument.\n`);
  });

  it(':23 Running your script with the suggested input gives the output described', async () => {
    const commandOutput1 = await getCommandOutput('./element.sh 1');
    const commandOutput2 = await getCommandOutput('./element.sh H');
    const commandOutput3 = await getCommandOutput('./element.sh Hydrogen');

    const test1 = commandOutput1 === `The element with atomic number 1 is Hydrogen (H). It's a nonmetal, with a mass of 1.008 amu. Hydrogen has a melting point of -259.1 celsius and a boiling point of -252.9 celsius.\n`;
    const test2 = commandOutput2 === `The element with atomic number 1 is Hydrogen (H). It's a nonmetal, with a mass of 1.008 amu. Hydrogen has a melting point of -259.1 celsius and a boiling point of -252.9 celsius.\n`;
    const test3 = commandOutput3 === `The element with atomic number 1 is Hydrogen (H). It's a nonmetal, with a mass of 1.008 amu. Hydrogen has a melting point of -259.1 celsius and a boiling point of -252.9 celsius.\n`;

    assert(test1 && test2 && test3);
  });

  it(':24 Running your script with a random existing element gives the output described', async () => {
    const commandOutput1 = await getCommandOutput('./element.sh Ne');
    const commandOutput2 = await getCommandOutput('./element.sh Fluorine');

    const test1 = commandOutput1 === `The element with atomic number 10 is Neon (Ne). It's a nonmetal, with a mass of 20.18 amu. Neon has a melting point of -248.6 celsius and a boiling point of -246.1 celsius.\n`;
    const test2 = commandOutput2 === `The element with atomic number 9 is Fluorine (F). It's a nonmetal, with a mass of 18.998 amu. Fluorine has a melting point of -220 celsius and a boiling point of -188.1 celsius.\n`;

    assert(test1 && test2);
  });

  it(':25 Running your script with input that doesn\'t exist should give the output described', async () => {
    const commandOutput = await getCommandOutput('./element.sh moTium');

    assert(commandOutput === `I could not find that element in the database.\n`);
  });

  it(':26 Your first commit message should be "Initial commit"', async () => {
    const commits = await getCommits();

    if(!commits) assert(false);

    assert(commits[commits.length - 1].message === 'Initial commit');
  });

  it(':27 All your commit messages except the first should start with one of the suggested prefixes', async () => {
    const commits = await getCommits();

    if(!commits) assert(false);

    commits.splice(commits.length - 1, 1);
    commits.forEach(commit => {
      if(!/^(fix:|feat:|chore:|refactor:|test:)/.test(commit.message)) {
        assert(false);
      }
    });

    assert(commits.length > 0);
  });

  it(':28 You should delete the rows of the non-existent element from your tables', async () => {
    const query = `SELECT * FROM elements FULL JOIN properties ON elements.atomic_number = properties.atomic_number WHERE elements.atomic_number = 1000 OR properties.atomic_number = 1000 OR name = 'moTanium';`;
    const res = await client.query(query);

    if (!res) assert(false);

    assert(res.rowCount === 0);
  });

  it(':29 Your "properties" table should not have a "type" column', async () => {
    const queryColumn = `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'type';`;
    const res = await client.query(queryColumn);

    if (!res) assert(false);

    assert(res.rowCount === 0);
  });

  it(':30 You should finish on the "main" branch, your working tree should be clean and there should not be any uncommitted changes', async () => {
    const commandOutput = await getCommandOutput('git status');

    if(!commandOutput) assert(false);

    assert(/On branch main\s/.test(commandOutput) && /working tree clean/.test(commandOutput));
  });
});