const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let users = [];
let tasks = [];

app.post('/auth/register', async (req,res)=>{
  const {email,password}=req.body;
  const hash = await bcrypt.hash(password,10);
  users.push({email,password:hash});
  res.json({msg:"Registered"});
});

app.post('/auth/login', async (req,res)=>{
  const {email,password}=req.body;
  const user = users.find(u=>u.email===email);
  if(!user) return res.status(401).json({msg:"Invalid"});
  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.status(401).json({msg:"Invalid"});
  const token = jwt.sign({email}, "secret");
  res.json({token});
});

app.get('/tasks', (req,res)=>{
  res.json(tasks);
});

app.post('/tasks',(req,res)=>{
  const {title}=req.body;
  const task={id:Date.now(),title,completed:false};
  tasks.push(task);
  res.json(task);
});

app.delete('/tasks/:id',(req,res)=>{
  tasks = tasks.filter(t=>t.id != req.params.id);
  res.json({msg:"Deleted"});
});

app.listen(5000,()=>console.log("Backend running"));
