const express = require('express');
const zod = require('zod')
const router = express.Router();
const jwt = require('jsonwebtoken')
const {authMiddleware} = require ('../middleware/middleware')
const {JWT_SECRET} = require('../config/jsontoken');
const {Account , User} = require('../models/Usermodel')
const signupBody = zod.object({
     username:zod.string().email(),
     firstName: zod.string(),
     lastName : zod.string(),
     password:zod.string()
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
            message : "User already exist/ try other username "
        })
    }
    const newUser = await User.create({
        username : req.body.username ,
        password : req.body.password,
        firstName : req.body.firstName ,
        lastName : req.body.lastName,
    })
    const userId = newUser._id ;

       // random balance added 
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
    username : zod.string().email(),
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
        password: req.body.password,
    });

    if (!user) {
        return res.status(411).json({
            message: "User does not exist",
        });
    }

    const token = jwt.sign({
        user_id: user._id,
    }, JWT_SECRET);

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