(async function() {
  
  const fs = require ('fs');
  const {sql} = require('./helpers/db-config-helper');

  const config = {

    user: "AmatG3MapperV2app",
    password: "Amat@2019",
    server: "ec2-18-232-66-2.compute-1.amazonaws.com", 
    database: "AmatG3MapperV2AppDbDEV",
    pool:{max : "100"},
    connectionTimeout : "30000",
    requestTimeout : +"30000"
  }

  console.log(JSON.stringify(config));

  async function connectToDatabase(path, folderName) {
    
    try {

      console.log(`current path is : ${path}`);

      let filesList = fs.readdirSync(path);
      console.log(`funtion accesed with the array : ${filesList}`);

      const filesTable = new sql.Table();
      filesTable.columns.add('name', sql.VarChar);

      for(i = 0; i < filesList.length; i++) {
            
        filesTable.rows.add(filesList[i]); 
      }

      console.log('table created successfully');
            
      console.log(`trying for connection to mssql with config ${JSON.stringify(config)}`);
      const pool = await new sql.ConnectionPool(config).connect();
      console.log(`connected to mssql, will create request`);
      console.log(pool);     
      const request = pool.request();
       
      request.input('DirectoryFilesList',filesTable);
      request.input('FolderName',folderName);

      console.log(`table input succssfull: ${filesTable}`);
      
      var result2 = await request.execute('spGetExistingFilesList');
      var junkFiles = result2.recordset;

      console.log(junkFiles);

      sql.close();
      console.log('connection closed');

      return junkFiles;
    } catch(error) {

      console.log(error);
      console.log(`error caught, closing sql connection`);
      sql.close();
      console.log(`sql connection closed, sending 500 error response to client`);    
    }
  }

  const paths = ['SVGFiles/','MetadataMediaFiles/pdf/','MetadataMediaFiles/vid/', 'MetadataMediaFiles/img/','MetadataMediaFiles/doc/','MetadataMediaFiles/ppt/','MetadataMediaFiles/excel/', 'FeaturedFiles/', 'LatestFiles/'];

  for(let i in paths) {

    const endPath = '../client-assets/' + paths[i];
    console.log(endPath);
    
    const result = await connectToDatabase(endPath, paths[i]);
    console.log(result);

    for(let j in result) {

      const endFile = endPath + result[j].name;
      console.log("endFile: ", endFile);

      fs.unlink(endFile, function(err) {

        console.log('file deleted err: ', err);

        if(err) {

          return console.log(err);
        } else {

          console.log('file deleted successfully');
        }
      });
    }
  }

  process.exit(0);

})();