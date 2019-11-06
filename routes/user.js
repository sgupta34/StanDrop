
var bcrypt = require('bcryptjs');
var { sentMailToCustomers } = require('./customer_mail');
const saltRounds = 10;
const xss = require('xss');


exports.registerUser = registerUser;
exports.authenticateUser = authenticateUser;
exports.getAllNotifications=getAllNotifications;

// Register User
function registerUser(req, res) {
  var body = req.body;
  if(xss(req.body.email) && xss(req.body.password)) {


  if (body.email == null || body.email == '') {
    res.render("register", {
      errorMSG:"Please provide Email",
      user: body,
    });
  }
  else if (body.password == null || body.password == '') {
    res.render("register", {
      errorMSG:"Please provide Password",
      user: body,
    });
  }
  else if((body.cpassword == null || body.cpassword == ''))
    {
        res.render("register", {
            errorMSG:"Please provide Confirm Password",
            user: body,
        });
    }
    else if(body.password!=body.cpassword)
    {
        res.render("register", {
            errorMSG:"Confirm Password and Password should match",
            user: body,
        });
    }
    else if((((body.mobile)/1000000000) < 1)|| (((body.mobile)/1000000000)>10))
    {
        res.render("register", {
            errorMSG:"Please provide a Valid Mobile Number",
            user: body,
        });
    }

  else {
    var password = body.password;

    // Password encryption
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        res.send(err);
      }
      var encryptedPassword = hash;
      var insertData = {
        firstname: body.firstname,
        lastname: body.lastname,
        address: body.address,
        mobile: body.mobile,
        loginDetails: [
          {
            email: body.email,
            password: encryptedPassword
          }
        ],
      }


      var findData = {
        loginDetails: {
          $elemMatch: {
            email: body.email
          }
        }
      }

      db.collection('Users').findOne(findData, function (error, result) {
        if (error) {
          res.render("register", {
            errorMSG: error,
            user: body,
          });
        }
        else if (result) {
          res.render("login", {
            successMSG:"You have already Registered. Please Login"
          });
        }
        else {
          db.collection('Users').insertOne(insertData, function (error, result) {
            if (error) {
              res.render("register", {
                errorMSG:error,
                user: body,
              });
            } else {
              sentMailToCustomers(req, res, (error, message) => {
                if (error) {
                  res.render("register", {
                    errorMSG: error,
                    user: body,
                  });
                } else {
                  res.render("login", {
                    user: result.ops,
                    successMSG:"Registered Successfully"
                  });
                }
              });
            }
          })
        }
      });


    });
  }
  }

}
// Authenticate User(Login User)
function authenticateUser(req, res,callback) {

  var req = req.body;
  var password = req.password;
  var findData = {
    loginDetails: {
      $elemMatch: {
        email: req.email
        // userID: req.userID
      }
    }
  }

  db.collection('Users').findOne(findData, function (error, result) {
    if (error) {
      //res.send(error);
      throw new Error(error);
    } else {
      if (result != null) {

        var encryptedPassword = result.loginDetails[0].password;

        bcrypt.compare(password, encryptedPassword, function (error, rs) {
          if (rs == true) {
            callback(result);
          } else {
            callback(null);
          }
        });
      } else {
        callback(null);

      }
    }

  })

}

function getAllNotifications(req, res,callback){
  req.body.user_id=req.session.user._id;
  var findData = {
    user_id:req.body.user_id
  }
  db.collection('Products').find(findData).toArray(function(err, result) {
    if (err) {
      return null;
    } else {
      callback(result);
    }
  })

}
