import { SQLite } from "@ionic-native/sqlite";
import {
  createTable,
  deleteRecords,
  insertRecord,
  selectRecords,
} from "./sqlCmds";
import { Storage } from "@capacitor/core";

const createSqlTable = async () => {
  var sql = SQLite.create({
    name: "my.db",
    location: "default",
  });
  if (sql) {
    sql
      .then((db) => {
        db.executeSql(createTable, [])
          .then(() => console.log("Executed SQL"))
          .catch((e) => console.log(JSON.stringify(e)));
      })
      .catch(() => {});
  }
};

const selectData = async () => {
  var sql = SQLite.create({
    name: "my.db",
    location: "default",
  });
  if (sql) {
    sql
      .then((db) => {
        db.executeSql(selectRecords, [])
          .then(async (tx) => {
            for (var x = 0; x < tx.rows.length; x++) {
              await Storage.set({
                key: "UserData",
                value: tx.rows.item(x).UserData,
              });
              await Storage.set({
                key: "isLogged",
                value: tx.rows.item(x).isLogged,
              });
              await Storage.set({
                key: "pushToken",
                value: tx.rows.item(x).pushToken,
              });
              await Storage.set({
                key: "colID",
                value: tx.rows.item(x).colID,
              });
              if (tx.rows.item(x).isLogged) window.location.reload();
            }
          })
          .catch((e) => alert("error"));
      })
      .catch(() => {});
  }
};

const deleteSqlRecords = async () => {
  var sql = SQLite.create({
    name: "my.db",
    location: "default",
  });
  if (sql) {
    sql
      .then((db) => {
        db.executeSql(deleteRecords, [])
          .then((tx) => {
            console.log(JSON.stringify(tx));
          })
          .catch((e) => console.log(JSON.stringify(e)));
      })
      .catch(() => {});
  }
  await SQLite.deleteDatabase({
    name: "my.db",
    location: "default",
  })
    .then((re) => alert(JSON.stringify(re)))
    .catch((re) => alert(JSON.stringify(re)));
};

const insertLoginRecord = async (userInfo, token, colID) => {
  var sql = SQLite.create({
    name: "my.db",
    location: "default",
  });
  if (sql) {
    sql
      .then((db) => {
        db.executeSql(insertRecord, [true, userInfo, token, colID])
          .then(() => console.log("Executed SQL"))
          .catch((e) => alert(JSON.stringify(e)));
      })
      .catch(() => {});
  }
};

export { createSqlTable, selectData, deleteSqlRecords, insertLoginRecord };
