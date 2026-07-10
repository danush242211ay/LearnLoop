LearnLoop - 

course selling platform - MERN stack Project

Backend 

-Authenication
 *used jsonwebtoken,cookie-parser,bcryptjs,nodemailer packages
 *Google cloud services of Gmail API

 *register api 
  -require email and password
  -then password turned into hash before user updated in users Model
  -After user creation,otp is generated using utils and opt saved in opts Model
  -send otp through email using email services
  -email verified - false

*email verification api
  -find the opt saved through email
  -verify the opt through bcrypt compare
  -update the verified - true
  -delete otp in otps collection

*Login API
 -verify the email verification status
 -verify the password
 -using jwt generate the token
 -token transfered to cookie
 -login successfully

-Logout API
 *Clears the token in cookie
 *logout successfully
 

-Models
 *User Model
 *otp Model

