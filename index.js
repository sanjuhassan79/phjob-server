const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port =process.env.PORT || 5000
const stripe = require('stripe')(process.env.STRIPE_SECRET)



app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sanju1.bssaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);







async function run() {
  try {
    await client.connect();
    const database = client.db("phshop");
    const usercollection = database.collection("user");
    const productcollection = database.collection("sanju");
    
    // Query for a movie that has the title 'The Room'

  // User add
  app.post('/users',async(req,res)=>{
    const user=req.body
     const result=await usercollection.insertOne(user)
     console.log(result);
     res.json(result)

   })

   app.get('/users/:key',async(req,res)=>{

    const cursor=usercollection.find({
      "$or":[
        {name:{$regex:req.params.key}},
        
        {email:{$regex:req.params.key}},
        {phone:{$regex:req.params.key}},
        {age:{$regex:req.params.key}}
      ]

    })
      const result=await cursor.toArray()
      res.json(result)
  })

  app.get('/users',async(req,res)=>{

    const cursor=usercollection.find({})
      const result=await cursor.toArray()
      res.json(result)
  })
  app.get('/userss',async(req,res)=>{

    const cursor=productcollection.find({})
      const result=await cursor.toArray()
      res.json(result)
  })
  app.put('/users/admin',async(req,res)=>{
    const user=req.body;
    const filter={email:user.email}
   
    const updateDoc={
        $set:{role:'admin'}
    }
    const result=await usercollection.updateOne(filter,updateDoc)
    console.log(result);
    res.json(result)
  })

  app.get('/users/:email',async(req,res)=>{
    const id=req.params.email;
    const cursoer= usercollection.find({email:req.params.email});
    const users=await cursoer.toArray();
  res.send(users)
  
  
  
  })


  app.delete('//users/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:ObjectId(id)}
    const result=await usercollection.deleteOne(query);
    res.json(result)
    
    })


  
  app.get('/admin/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usercollection.findOne(query);
    let isAdmin = false;
    if (user?.role === 'admin') {
        isAdmin = true;
    }
    res.json({ admin: isAdmin });
  })





  app.post('/create-payment-intent', async (req, res) => {
    const paymentInfo = req.body;
    const amount = paymentInfo;
    const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: amount,
        payment_method_types: ['card']
    });
    res.json({ clientSecret: paymentIntent.client_secret })
})










  } finally {
    // await client.close();
  }
}
run().catch(console.dir);















  
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})