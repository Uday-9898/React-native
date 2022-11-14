const script =
  'CREATE TABLE IF NOT EXISTS "ClockInOutOffline" (\n' +
  '\t"visitId"\tTEXT NOT NULL,\n' +
  '\t"clientId"\tTEXT NOT NULL,\n' +
  '\t"employeeId"\tTEXT NOT NULL,\n' +
  '\t"latitude"\tTEXT NOT NULL,\n' +
  '\t"longitude"\tTEXT NOT NULL,\n' +
  '\t"forceUpdate"\tINTEGER NOT NULL,\n' +
  '\t"date"\tTEXT NOT NULL,\n' +
  '\t"typeClock"\tINTEGER NOT NULL,\n' +
  '\t"end_distance_verification_message"\tTEXT,\n' +
  '\t"end_time_verification_message"\tTEXT,\n' +
  '\t"start_distance_verification_message"\tTEXT,\n' +
  '\t"start_time_verification_message"\tTEXT,\n' +
  '\t"id"\tINTEGER NOT NULL PRIMARY KEY AUTOINCREMENT\n' +
  ');';

export default script;
