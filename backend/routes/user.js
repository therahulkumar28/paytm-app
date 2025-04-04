const express = require('express');
const zod = require('zod')
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {authMiddleware} = require ('../middleware/middleware')
const {JWT_SECRET} = require('../config/jsontoken');
const {Account , User} = require('../models/Usermodel')
const signupBody = zod.object({
     username:zod.string().email({ message: "Invalid email address" }),
     firstName: zod.string().min(3, { message: "Must be 3 or more characters long" }),
     lastName : zod.string(),
     password:zod.string().min(5, { message: "Must be 5 or more characters long" })
})


router.post('/signup', async (req, res)=>{
    const {success} = signupBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message : "Email already taken / Incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        username : req.body.username
    })
   
    if(existingUser){
        return res.status(411).json({
            message : "User/Email already exist/ try other username "
        })
    }
    
    const salt = await bcrypt.genSalt(parseInt(process.env.Salt));

    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    console.log(hashedPassword)
    const newUser = await User.create({
        username : req.body.username ,
        password : hashedPassword,
        firstName : req.body.firstName ,
        lastName : req.body.lastName,
    })
    const userId = newUser._id ;

    await Account.create({
        userId,
        balance: 1+ Math.random()*10000
    })
    const token = jwt.sign({
        userId 
    },JWT_SECRET)

    res.json({
        message : "User created successfully",
        token : token
    })

});

const signinBody = zod.object({
    username : zod.string().email({ message: "Invalid email address" }),
    password:zod.string()
})
router.post('/signin', async (req, res) => {
    const { success } = signinBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            message: "Invalid Username or password",
        });
    }
    const user = await User.findOne({
        username: req.body.username,
    });
    if(!user){
        return res.status(404).json(
            {
                message:"User not found"
            }
        );
    }
   
    const isMatch = await bcrypt.compare(req.body.password,user.password);
    if(!isMatch){
        return res.status(401).json({
            message:"Username / Password is Incorrect"
        })
    }

    
  //  console.log(user)
    const token = jwt.sign({
        userId : user._id
    },JWT_SECRET)

    // Send the response once, with the token
    res.json({
        token: token,
    });
});

// update method 

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional(),
})

router.put('/', authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    
    if (!success) {
        return res.status(400).json({
            message: "Error while updating information",
        });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
      
        res.json({
            message: "Updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// for filltering get method

router.get('/bulk',async( req, res)=>{
    const filter = req.query.filter || "";
    try {
        const users = await User.find({
            $or: [
                { firstName: { $regex: filter, $options: 'i' } },
                { lastName: { $regex: filter, $options: 'i' } }
            ]
        });
    
        res.json({
            users: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
})


module.exports = router ;