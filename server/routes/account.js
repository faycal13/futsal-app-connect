// * IMPORT DEPENDENCIES * //
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');
const checkJwt = require('../middleware/check-jwt');

// * REGISTER * //
router.post('/signup', (req, res, next) => {
  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.picture = user.gravatar();
  user.haveEvent = req.body.haveEvent


User.findOne({ email: req.body.email }, (err, existUser) => {
        if (existUser) {
          res.json({
            success: false,
            message: 'Account with that email or username is already exist'
          });

        } else {
      user.save();

      let token = jwt.sign({
        user: user
      }, config.secret, {
        expiresIn: '7d'
      });

      res.json({
        success: true,
        message: 'Enjoy your token',
        token: token
      });
    }
  });
});


// * LOGIN * //
router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      console.log(req.body);
      res.json({
        success: false,
        message: 'Login failed, User not found'
      });
    } else if (user) {

        let validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Login failed, Wrong password'
          });
        } else {
          let token = jwt.sign({
            user: user
          }, config.secret,{
            expiresIn: '7d'
          });

          res.json({
            success: true,
            message: 'Enjoy your token',
            token: token
          });
        }
      }
  });
});

// * UPDATE PROFILE * //
router.route('/profile')
// Get the user data
.get(checkJwt, (req, res, next) => {
  User.findOne({ _id: req.decoded.user._id }, (err, user) => {
    res.json({
      success: true,
      user: user,
      message: "Successful"
    });
  });
})
// Update the name, email and password
.post(checkJwt, (req, res, next) => {
  User.findOne({ _id: req.decoded.user._id}, (err, user) => {
    if (err) {
      return next(err);
    }
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    user.save();
    res.json({
      success: true,
      message: 'Successfuly edited your profile'
    });
  });
});

// * UPDATE ADDRESS * //
router.route('/address')
// GET user address
.get(checkJwt, (req, res, next) => {
  User.findOne({ _id: req.decoded.user._id }, (err, user) => {
    res.json({
      success: true,
      address: user.address,
      message: "Successful"
    });
  });
})
// UPDATE user address
.post(checkJwt, (req, res, next) => {
  User.findOne({ _id: req.decoded.user._id}, (err, user) => {
    if (err) {
      return next(err);
    }
    if (req.body.addr1) {
      user.address.addr1 = req.body.addr1;
    }
    if (req.body.addr2) {
      user.address.addr2 = req.body.addr2;
    }
    if (req.body.city) {
      user.address.city = req.body.city;
    }
    if (req.body.state) {
      user.address.state = req.body.state;
    }
    if (req.body.country) {
      user.address.country = req.body.state;
    }
    if (req.body.postalCode) {
      user.address.postalCode = req.body.postalCode;
    }
    user.save();
    res.json({
      success: true,
      message: 'Successfuly edited your address'
    });
  });
});

module.exports = router;
