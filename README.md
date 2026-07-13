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

 *Logout API
  -Clears the token in cookie
  -logout successfully
 

-Models
 *User Model
 *otp Model
 *course Model
 *lesson Model

-Instructor role
 
 *Register
  -Verify the verified user or not through token stored in cookies
  -if success then update a user as instructor

 *Upload Courses
  -only instructor have access. verified through authmiddleware
  -Image Kit used as storage service, image stored as URL
  -store the required values according to  course Model
  
 *Get Courses
  -Only Instructor uploaded courses through courses collection

 *Upload lessons
  -only instructor have access. verified through authmiddleware
  -params to upload lessons in particular courses
  -store the required values according to lesson Model

 *Get Lessons
  -Complete lessons particular course upload by the instructor

-Course routes

 *Get ALL Courses
  -All courses upload by every instructors

 *Get ALL Lessons
  -In particular course, but access depend on preview status given by particular instructor
 

