import Model from '../Model/Model';
import CreateClockInOutOffline from '../SQL/CreateClockInOutOffline';

const TableCreation = async () => {
  let creationScripts = [];

  creationScripts.push(CreateClockInOutOffline);

  return Model.runCustomQueries(creationScripts);
};

export default TableCreation;
