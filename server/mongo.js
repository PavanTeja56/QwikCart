const mongoose=require('mongoose')
mongoose.connect(MONGOCLUSTERURL)
.then(()=>{
    console.log('mongodb connected')
})
.catch((err)=>{
    console.log('not connected',err)
})

const logScheme=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    stocks:{
        type:Number,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    allRatings:{
        type:Array,
        required:true
    },
    allReviews:{
        type:Array,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const cartSchema=new mongoose.Schema({
    userEmail:{type:String,
        required:true,
        index:true
    },
    items:[{
        productId:{type:String , required:true},
        name:String,
        image:String,
        price:Number,
        quantity:{type:Number,default:1}
    }]
});

const orderSchema=new mongoose.Schema({
    userEmail:{type:String,required:true},

    items:[{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'productCollection' },
        name:String,
        image:String,
        price:Number,
        quantity:{type:Number,default:1}
    }],
    status: {
    type: String,
    default: "Ordered", 
  },

    deliveryAddress:{
        name:{type:String,required:true},
        phone:{type:String,required:true},
        addressLine:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        pincode:{type:String,required:true}
    },

    totalAmount:{type:Number,required:true},
    OrderDate:{type:Date,default:Date.now},
    status:{type:String,default:'Placed'}
})

const Cart=new mongoose.model('cartCollection',cartSchema)
const collec2=new mongoose.model('productCollection',productSchema)
const collec=new mongoose.model('userCollection',logScheme)
const Order=new mongoose.model('ordersCollection',orderSchema)
module.exports = { collec, collec2 ,Cart ,Order};