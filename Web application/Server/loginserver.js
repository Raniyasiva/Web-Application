var http = require('http');
var connection = require('./loginsql');
const { error } = require('console');
const sessions = {};
var server = http.createServer(function (req, res) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000,
  };
  if (req.url == "/signup") {
    if (req.method == 'POST') {
      console.log('POST')
      var body = ''
      req.on('data', function (data) {
        body += data
        console.log('Partial body: ' + body)
      })
      req.on('end', function () {
        console.log('Body: ' + body)
        var signup = JSON.parse(body)
        console.log(signup.password);
        console.log(signup.email);
        var dob = new Date(signup.dob);
        dob.setHours(0, 0, 0, 0);
        var formattedDob = dob.toISOString().split('T')[0];
        var sql = "INSERT INTO user (name, email, password, gender, phone, dob, district, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        var values = [
          signup.name,
          signup.email,
          signup.password,
          signup.gender,
          signup.phone,
          formattedDob,
          signup.district,
          signup.comment
        ];

        connection.query(sql, values, function (err, result) {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error inserting data into the database');
          } else {
            console.log("Number of records inserted: " + result.affectedRows);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
            res.setHeader('Access-Control-Max-Age', 2592000);
            const jsonResponse = {
              status: 1,
              message: 'Successfully registered',
            }
            const jsonString = JSON.stringify(jsonResponse);
            res.write(jsonString);
            res.end();
          }

        });
      })
    }
  }
  else if (req.url == '/login') {
    if (req.method == 'POST') {
      console.log('POST')
      var body = ''
      req.on('data', function (data) {
        body += data
        console.log('Partial body: ' + body)
      })
      req.on('end', function () {
        console.log('Body: ' + body)
        console.log('login');
        var login = JSON.parse(body);

        var query = "select * from user WHERE email= '" + login.email + "'";
        console.log(query);
        connection.query(query,function (err, rows) {
          console.log(rows+'rows');
            if (err) {
              res.write("error" + err.message);
              connection.end();
              res.end();
              return;
            }

            else if (rows[0].email === login.email && rows[0].password === login.password) {
            
              if(rows[0].isActive===1){
                
                //const sessionId = Math.random().toString(36).substring(2);
                //sessions[sessionId] = { user: rows[0].email };
                //res.setHeader("Set-Cookie", `sessionId=${sessionId}`);
       
             // res.setHeader('Set-Cookie', `sessionId=${sessionId}; Domain=localhost; Path=/ `);
              res.setHeader('Access-Control-Allow-Origin','*');
             // res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
              res.setHeader('Access-Contrl-Allow-Methods','OPTIONS','POST');
              res.setHeader('Acess-Control-Max-Age',2592000);
            
         // console.log(sessionId);
              // Set a session ID as a cookie
              //res.setHeader('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Secure`);
              console.log(rows[0].email +'email');
              const jsonResponse={
                status:1,
                message:'Login Successfully'
              };
              const jsonString=JSON.stringify(jsonResponse);
              res.write(jsonString);
              res.end();
              console.log('Login successfully');
              }

              else{
                res.setHeader('Access-Control-Allow-Origin','*');
              res.setHeader('Access-Contrl-Allow-Methods','OPTIONS','POST');
              res.setHeader('Acess-Control-Max-Age',2592000);
                const jsonResponse={
                  status:0,
                  message:'Your account is not active. Please recharge immediately'
                }
              const jsonString=JSON.stringify(jsonResponse);
              res.write(jsonString);
              res.end();
              console.log('User is not active');
              }
            
            } 
            else {
              res.setHeader('Access-Control-Allow-Origin','*');
              res.setHeader('Access-Contrl-Allow-Methods','OPTIONS','POST');
              res.setHeader('Acess-Control-Max-Age',2592000);
              const jsonResponse = {
                status: 0,
                message: 'Invalid user',
              }
              const jsonString = JSON.stringify(jsonResponse);
              res.write(jsonString);
              console.log("invalid user");
              res.end();
            }
          
          });
        
      })
    }
  }

  else if (req.url == '/dashboard') {
    if (req.method == 'GET') {
      var query = "SELECT name,email,phone,dob,district,comment FROM user";
      console.log(query);
      //const sessionId = req.headers.cookie.replace('sessionId=', '');
     // console.log(req.headers.cookie);
      connection.query(query, function (err, rows) {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error querying the database');
        } else {
          res.setHeader('Access-Control-Allow-Origin','*');
         // res.setHeader('Access-Control-Allow-Credentials', true);
         // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
          res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
          res.setHeader('Access-Control-Max-Age', 2592000);
       
          let jsonResponse={};
          if(rows.length>0){
            const row = rows;
             jsonResponse = {
              status: 1,
              records:rows,
            };
            
          }
          console.log(jsonResponse);
          const jsonString = JSON.stringify(jsonResponse);
          //res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(jsonString);
        }
      });
    }
  }
  else if (req.url == '/uncheck') {
    if (req.method == 'POST') {
      console.log('received the update ');
      var body = '';
      req.on('data', function (data) {
        body += data;
        console.log('Partial body: ' + body);
      });
      req.on('end', function () {
        console.log('Body: ' + body);
        var dashboard = JSON.parse(body);
        if (dashboard.isActive !== 0 && dashboard.isActive !== 1) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid isActive value');
        }else{
        var update = "UPDATE user SET isActive = ? WHERE email= '" + dashboard.email + "'";
        var values = [dashboard.isActive, dashboard.email];
        connection.query(update, values, function (err, result) {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Not updating ');
          } else {
            console.log("Number of records updated: " + result.affectedRows);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
            res.setHeader('Access-Control-Max-Age', 2592000);
            const jsonResponse = {
              status: 1,
              message: 'Successfully updated user status',
            };
            const jsonString = JSON.stringify(jsonResponse);
            res.write(jsonString);
            res.end();
          }
        });
      }
      });
    }
  }
  else if(req.url=='/delete'){
    if(req.method=='POST'){
      console.log('Receive data to delete');
      var body='';
      req.on('data',(data)=>{
        body+=data;
        console.log(body);
      })
      req.on('end',()=>{
        console.log('Body' +body);
        const mail= JSON.parse(body);
        if(!mail.email){
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid delete action');
        }
        else{
          var deleteTable= "DELETE FROM user WHERE email = '"+mail.email+"'";
         var values=[mail.email];
         console.log('SQL:' , deleteTable,values );
          connection.query(deleteTable,values,(err,result)=>{
            if(err){
              console.error(err);
              res.writeHead(500,{'Content-Type': 'text/plain'});
              res.end('Not deleting');
            }
              else{
                console.log("Number of records deleted: " + result.affectedRows);
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
                res.setHeader('Access-Control-Max-Age', 2592000);
                const jsonResponse={
                  status:1,
                  message:'Successfully deleted'
                };
                const jsonString=JSON.stringify(jsonResponse);
                res.write(jsonString);
                res.end();
              }   
        });
        }
      });
    }
  else {
    res.write("invalid request");
    res.end();
  }
}
});
server.listen(5000);
console.log('Node.js web server at port 5000 is running..');

//http://localhost:5000/
