const createTable = `CREATE TABLE IF NOT EXISTS users (
    isLogged BOOL,
    UserData VARCHAR,
    pushToken VARCHAR,
    colID VARCHAR
  );`;

const insertRecord =
  "INSERT INTO users (isLogged,UserData, pushToken, colID) VALUES (?,?,?,?)";

const selectRecords = "Select * from users";

const deleteRecords = "Delete from users";

export { createTable, insertRecord, selectRecords, deleteRecords };
