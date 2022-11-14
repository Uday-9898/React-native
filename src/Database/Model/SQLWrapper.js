const SQLWrapper = {
  transaction: db => {
    return new Promise(resolve => {
      db.transaction(tx => {
        resolve(tx);
      });
    });
  },
  executeSql: (tx, query, array) => {
    return new Promise(resolve => {
      tx.executeSql(query, array, (_tx, results) => {
        resolve({_tx, results});
      });
    });
  },
};

export default SQLWrapper;
