const express=require('express');
const app=express();
const mongoose=require('mongoose');
const morgan=require('morgan');
/*
  Morgan is a HTTP request logger middleware for Node. js.
 It simplifies the process of logging requests to your application. 
  It is like a helper that generates request logs. 
  It saves developers time because they don't have to manually create these logs.
*/
mongoose.connect('mongodb+srv://Brindha_18:'+process.env.MONGODB_PWD+'@node-rest-api.tkj50.mongodb.net/<dbname>?retryWrites=true&w=majority',  { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});
const ticketRoutes=require('./api/routes/ticket');
app.use(morgan('dev'));
//to parse json bodies
//Concise output colored by response status for development use.
//'dev' in morgan will return this following in the terminal
//:method :url :status :response-time ms - :res[content-length
app.use(express.json()); //Used to parse JSON bodies

app.use(express.urlencoded({extended:false})); //Parse URL-encoded bodies

//Routes to handle requests
app.use((req,res,next)=>{
     res.header('Access-Control-Allow-Origin','*');
     res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
     if(req.method=='OPTIONS')
     {
       res.header('Access-Control-Allow-Methods','PUT,POST,GET,PATCH,DELETE');
       return res.json({});
     }
     next();
});
//to get access by any client
//to overcome cors errors
app.use('/tickets',ticketRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});


module.exports=app;

   

