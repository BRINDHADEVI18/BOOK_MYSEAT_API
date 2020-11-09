const http=require('http');
const app=require('./app');
const port=process.env.PORT||3000;

const server=http.createServer(app);




server.listen(port);















/*nodemon is a tool that helps develop node.js based applications by automatically 
restarting the node application when file changes in the directory are detected.*/
