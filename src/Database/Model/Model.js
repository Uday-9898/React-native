import SQLite from 'react-native-sqlite-storage';
import SQLWrapper from './SQLWrapper';
import TableCreation from '../TableCreation/TableCreation';

const DATABASE_NAME = 'myHelpa.db';

class Model {
  onSuccess() {
    console.log('success');
  }

  onError(error) {
    console.log('error', error);
  }

  open = async () => {
    if (this.db) {
      return this.db;
    }

    this.db = await SQLite.openDatabase(
      {name: DATABASE_NAME},
      this.onSuccess,
      this.onError,
    ); 

    await TableCreation();

    return this.db;
  };

  async close() {
    await this.db.close();
  }

  deleteTable = async table => {
    await this.open();
    const queryString = `DROP TABLE IF EXISTS ${table}`;
    const transaction = await SQLWrapper.transaction(this.db);

    await SQLWrapper.executeSql(transaction, queryString, []);
  };

  async insertIntoDatabase(table, tableName) {
    let promises = [];
    await this.open();

    table.forEach(record => {
      const p = new Promise(async resolve => {
        let fields = '';
        let values = [];
        let tempStringValues = '';

        Object.keys(record).forEach(field => {
          if (record[field] === undefined || record[field] === null) {
            return;
          }

          fields += field + ', ';
          values.push(record[field]);
          tempStringValues += '?, ';
        });

        fields = fields.substring(0, fields.length - 2);
        tempStringValues = tempStringValues.substring(
          0,
          tempStringValues.length - 2,
        );

        const queryString = `INSERT INTO ${tableName} (${fields}) Values (${tempStringValues});`;

        const transaction = await SQLWrapper.transaction(this.db);
        await SQLWrapper.executeSql(transaction, queryString, values);
        return resolve();
      });

      promises.push(p);
    });

    await Promise.all(promises);
  }

  deleteEverything = async table => {
    await this.open();
    const queryString = 'DELETE FROM ' + table + '';
    const transaction = await SQLWrapper.transaction(this.db);
    await SQLWrapper.executeSql(transaction, queryString, []);
  };

  deleteRow = async (table, condition) => {
    await this.open();
    const queryString = `DELETE FROM ${table} WHERE ${condition}`;
    const transaction = await SQLWrapper.transaction(this.db);
    await SQLWrapper.executeSql(transaction, queryString, []);
  };

  loadFromDatabase = async (tableName, finalFunction) => {
    await this.open();
    const queryString = 'SELECT * FROM ' + tableName + ';';

    const transaction = await SQLWrapper.transaction(this.db);
    const {results} = await SQLWrapper.executeSql(transaction, queryString, []);

    let result = [];
    const rows = results.rows;
    const length = rows.length;

    for (let i = 0; i < length; i++) {
      let tempObject = {};
      let item = rows.item(i);

      Object.keys(item).forEach(field => {
        tempObject[field] = item[field];
      });
      result.push(tempObject);
    }
    return result;
  };

  runCustomQuery = async (query, finalFunction) => {
    await this.open();
    const transaction = await SQLWrapper.transaction(this.db);
    const {results} = await SQLWrapper.executeSql(transaction, query, []);

    const rows = results.rows;
    const length = rows.length;

    for (let i = 0; i < length; i++) {
      let tempObject = {};
      let item = rows.item(i);

      Object.keys(item).forEach(field => {
        tempObject[field] = item[field];
      });

      finalFunction(tempObject);
    }
  };

  /**
   *
   * @param {Array<String>} queries
   * @param {Function} finalFunction
   */
  runCustomQueries = (queries, finalFunction) => {
    queries.forEach(query => {
      this.runCustomQuery(query, finalFunction);
    });
  };
}

export default new Model();
