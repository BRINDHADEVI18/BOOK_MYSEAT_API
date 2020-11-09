const express=require('express');
const mongoose= require('mongoose');

const router=express.Router();
const bcrypt=require('bcrypt');
//Express router is a class which helps us to create router handlers. 
//By router handler it will not just providing routing to our app 
//but also can extend this routing to handle validation, handle 404 or other errors etc.
//var seat =new Array();
const Ticket=require('../models/tickets');
const User = require('../models/user');
   router.get("/ticket/details/:ticket_id",(req,res,next)=>{
    const id=req.params.ticket_id;
    Ticket.findById({_id:id})
    .select('passenger')
    .then(docs =>{
        const p_id=docs.passenger;
        console.log(p_id);
        User.findById({_id:p_id})
        
        .select('name gender age phone email')
        .then(result=>{
            res.status(200).json(result);
        })
        .catch(err=>{
            res.status(500).json({error:err});
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    });
   
});
router.post("/ticket/details",(req, res,next)=> {
    
   const payload=req.body;
   let pass=null;
    if('passenger' in payload){
    const user=new User(req.body.passenger);
    pass=req.body.passenger;
    const ticket=new Ticket({
        _id:mongoose.Types.ObjectId(),
        seat_no:req.body.seat_no,
        passenger:user._id,
        is_available:req.body.is_available
    });
    user.save().then(data=>
       {
         if(data)
            ticket.passenger=user._id;
            ticket.save()
            .then(data =>{
                       console.log(result);
                       res.status(200).json({
                       message: 'Ticket created Successful!!!',
                        createdTickets:ticket});
             })
            .catch(err => {
                   User.findOneAndDelete({ _id: user._id })
                  .then((data) => res.status(400))
                  .catch(err => res.status(400).json({ message: err }));
        });
      })
      .catch(err=>res.status(500).json({error:err}));      
        

    }
    else
    {
        const ticket=new Ticket({
            _id:mongoose.Types.ObjectId(),
            seat_no:req.body.seat_no,
            passenger:req.body.passenger,
           is_available:req.body.is_available,      
            
        }); 
        ticket.save()
        .then(data=>
            {
                res.status(200).json({
                    message:"success",
                    createdTicket:ticket
                });
            })
        .catch(err=>{
            res.status(500).json({error:err});
        });
    }
  
         
});
router.put("/ticket/:ticket_id",(req,res)=>{

    const id=req.params.ticket_id;
    const payload=req.body;
     Ticket.findById({_id:id},function(err,result)
    {
      if(err){ res.status(404).json({error:err});
      }
      else{
          if(result)
          {   result.is_available=payload.is_available;
             if(result.passenger!=null){
                User.findByIdAndUpdate({_id:result.passenger},{name:payload.passenger.name,gender:payload.passenger.gender,age:payload.passenger.age,phone:payload.passenger.phone,email:payload.passenger.email},{new:true})
                   .then(doc=>{
                
                         console.log(doc);
                          res.status(200).json({message:"user details get updated"});
                    }).catch(err=>{
                        error:"user not found"
                    });
                }
               else{
                const user=new User(payload.passenger);
                result.passenger=user._id;
                user.save()
                .then(users=>
                    {
                        res.status(200).json({
                            message:"user saved success"
                        });
                    })
                .catch(err=>{res.status(500)
                    .json({error:err});
                 });

                }
                result.save()
                .then(updatedTicket=>{
                   res.status(200).json({updated:updatedTicket});
                  })
                  .catch(err=>{
                     res.status(500).json(
                    {message:"updated ticket not saved"});
                   });
        }
    }
    })
    .catch(err=>
        {
            res.status(400).json({
                error:err,
                message:"error in ticket finding"
            });
        });
    
});
    
 //viewing ticket status  
 router.get("/ticket/:ticket_id",(req,res)=>{

    const id=req.params.ticket_id;
    Ticket.findById(id)
    .select('seat_no is_available')
    .exec()
    .then(doc =>{
        console.log("from db",doc);
        if(doc){
        res.status(200).json(doc);
        }else{
            res.status(404).json({message:'No valid ID found'});
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});

    });
});
//getting all the tickets which are opened or available
router.get('/tickets/open', (req, res) => {
    Ticket.find({is_available:'true'})
    .select('seat_no passenger')
    .sort({seat_no:1})
    .exec()
    .then(result=>
        {
            console.log(result); 
             res.status(200).json(result );
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
     
});
//passenger 5fa8103c09364f5aa05c46ea seat_no:9
//getting  all the tickets which are closed or not available
router.get('/tickets/closed', (req, res) => {
    Ticket.find({is_available:'false'})
    .select('seat_no passenger')
    .sort({seat_no:1})
    .exec()
    .then(result=>
        {
            console.log(result); 
             res.status(200).json(result );
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
    
});
/*router.get('/tickets/reset', (req, res) => {
    Ticket.updateMany({},{is_available:'true'})
    .select(' seat_no is_available')
   .exec()
    .then(result=>
        {
            console.log(result); 
             res.status(200).json(result );
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
    
});*/

router.post('/tickets/reset', (req, res) => {

    if (!("username" in req.body) && !("password" in req.body)) {
        res.status(400).json({ message: "username and password is needed in request body" })
    }

    const { username, password } = req.body

    if (!(password==process.env.password_HASH)) {
        res.status(400).json({ message: "password is incorrect" });
    }
    if (!(username === process.env.USER)) {
        res.status(400).json({ message: "username is incorrect" })
    }
    Ticket.updateMany({},{is_available:'true'},{new:true})
    .select(' seat_no is_available')
    .then(result=>
        {
            console.log(result); 
             res.status(200).json(result );
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
    

});

module.exports=router;