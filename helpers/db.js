const mysql = require('mysql2');
require('dotenv').config();

let pool;
let databaseConfig = 
  {
    host: process.env.DB_host,
    user: process.env.DB_username,
    password: process.env.DB_password ,
    database: process.env.Database,
    waitForConnections: true,
    connectionLimit : 20
  }

  try{
   pool = mysql.createPool(databaseConfig);
   console.log(`Database Connection Initialized Successfully`);
  }
  catch(err)
  {
    console.log(err);
  }

  async function Query(sql,params)
  {
    return new Promise(async (resolve,reject)=>{
      await pool.getConnection(async (err,connection)=>{
      if(connection)
      {
        await connection.execute(sql,params,(err,result)=>{
            if(result)
             {
                 resolve(result);
             }else{
                 reject(err);
             }
         })

         pool.releaseConnection(connection);
      }
      else{
          reject(err);
      }
  });
})

}

module.exports = {
   Query
};