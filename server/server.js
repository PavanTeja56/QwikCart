const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const PORT = process.env.PORT || 8000;
const nodemailer = require('nodemailer');
const { collec, collec2, Cart, Order } = require('./mongo');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// SIGNUP - hash password before saving
app.post('/SignUp', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists (optional but recommended)
    const existingUser = await collec.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data with hashed password
    const data = {
      name,
      email,
      password: hashedPassword
    };

    // Save to database
    await collec.insertMany([data]);

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error in SignUp:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// LOGIN - compare hashed password
app.post('/login2', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await collec.findOne({ email });

    if (!user) {
      return res.json('notexists');  // User not found
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.cookie('name', user.name);
      res.json('done');  // Password matches
    } else {
      res.json('unmatched');  // Password incorrect
    }
  } catch (err) {
    console.error('Error in login2:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Forgetting password
const otpMap = new Map();
//setting up otp transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAILID,
    pass: PASSCODE
  }
});


app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const user = await collec.findOne({ email })
  if (!user) return res.json({ message: 'not exists' })

  const otp = Math.floor(100000 + Math.random() * 900000)
  console.log(otp)
  const expireAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpMap.set(email, { otp: otp.toString(), expireAt });

  const mailOptions = {
    from: 'pavanteja0107@gmail.com',
    to: email,
    subject: 'otp for reset',
    text: `your otp is ${otp}`

  }
  try {
    await transporter.sendMail(mailOptions)
    res.json({ message: 'sent' })
  }
  catch (error) {
    res.json({ message: 'otp failed' })
  }

})

app.post('/verify-reset', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = otpMap.get(email);
  if (!record || record.otp !== otp || Date.now() > record.expireAt) {
    return res.json({ message: 'invalid otp' })
  }

  const hashedpassword = await bcrypt.hash(newPassword, 10);
  await collec.updateOne({ email }, { $set: { password: hashedpassword } })
  otpMap.delete(email)
  res.json({ message: 'password-reset-done' })
})

app.post('/adminUpdate', async (req, res) => {
  const { name, type, price, stocks, image, description } = req.body;
  try {
    const data = {
      name,
      type,
      price,
      stocks,
      image,
      description,
      allRatings: [],
      allReviews: []
    }
    await collec2.insertMany([data])
    res.json('pass')
  }
  catch (e) {
    res.json('fail')
  }
})


app.post('/pageChange', async (req, res) => {
  try {
    const type = req.body.selectedOption;
    const pageNum = req.body.pageNum;

    let allProducts, totalItems;

    if (type === 'All') {
      allProducts = await collec2.find({})
        .skip((pageNum - 1) * 12)
        .limit(12)
        .lean();
      totalItems = await collec2.countDocuments();
    } else {
      allProducts = await collec2.find({ type: type })
        .skip((pageNum - 1) * 12)
        .limit(12)
        .lean();
      totalItems = await collec2.countDocuments({ type: type });
    }

    res.json({ allProducts, totalItems });
  } catch (e) {
    console.error('Error in /pageChange:', e);
    res.json('fail to reach');
  }
});

app.post('/search', async (req, res) => {
  const { query } = req.body;
  console.log("Received search query:", query);
  try {
    const results = await collec2.find({ name: { $regex: query, $options: 'i' } });
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error during search" });
  }
});

app.get('/product/:id', async (req, res) => {
  try {
    const product = await collec2.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' }); // 404 status
    }
    res.json(product);
  } catch (e) {
    console.error('Error fetching product:', e);
    res.status(500).json({ error: 'Server error loading product' }); // 500 status
  }
});

app.post('/product/:id/review', async (req, res) => {
  const { rating, review } = req.body;

  try {
    const product = await collec2.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Initialize arrays if they don't exist
    if (!product.allRatings) product.allRatings = [];
    if (!product.allReviews) product.allReviews = [];

    // Add new review
    product.allRatings.push(Number(rating));
    product.allReviews.push(String(review));

    await product.save();
    res.json(product);

  } catch (e) {
    console.error('Review submission error:', e);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

app.post('/addToCart', async (req, res) => {
  const { userEmail, product } = req.body;
  try {
    let cart = await Cart.findOne({ userEmail });
    if (!cart) {
      cart = new Cart({ userEmail, items: [] })
    }
    const idx = cart.items.findIndex(i => i.productId === product._id.toString());

    if (idx > -1) {
      cart.items[idx].quantity += 1
    }
    else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        image: product.image?.[0] || product.image,
        price: product.price,
        quantity: 1
      });
    }
    await cart.save()
    res.json({ success: true })
  }
  catch (err) {
    console.error(err); res.status(500).json({ success: false });
  }

})


app.get('/getCart', async (req, res) => {
  const userEmail = req.query.email;
  try {
    const cart = await Cart.findOne({ userEmail });
    res.json({ success: true, items: cart?.items || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


// 3) Update Quantity
app.post('/updateCartItem', async (req, res) => {
  const { userEmail, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userEmail });
    if (!cart) return res.status(404).json({ success: false });
    const idx = cart.items.findIndex(i => i.productId === productId);
    if (idx > -1) {
      if (quantity <= 0) {
        cart.items.splice(idx, 1);
      } else {
        cart.items[idx].quantity = quantity;
      }
      await cart.save();
      res.json({ success: true, items: cart.items });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (err) {
    console.error(err); res.status(500).json({ success: false });
  }
});

// 4) Remove Item
app.post('/removeCartItem', async (req, res) => {
  const { userEmail, productId } = req.body;
  try {
    const cart = await Cart.findOne({ userEmail });
    if (cart) {
      cart.items = cart.items.filter(i => i.productId !== productId);
      await cart.save();
      res.json({ success: true, items: cart.items });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (err) {
    console.error(err); res.status(500).json({ success: false });
  }
});

app.post('/placeOrder', async (req, res) => {
  const { userEmail, items, deliveryAddress, totalAmount, payment } = req.body;

  if (!userEmail || !items || !deliveryAddress || !totalAmount) {
    console.log("❌ Missing fields in request body");
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const sanitizedItems = items.map(item => {
      let productId = item.productId;

      // 🔁 Convert to ObjectId only if it's valid
      if (mongoose.Types.ObjectId.isValid(productId)) {
        productId = new mongoose.Types.ObjectId(productId);
      } else {
        console.warn(`⚠️ Invalid ObjectId for product: ${productId}`);
        throw new Error("Invalid productId format");
      }

      return {
        ...item,
        productId
      };
    });

    const newOrder = new Order({
      userEmail,
      items: sanitizedItems,
      deliveryAddress,
      totalAmount
    });

    await newOrder.save();
    console.log("✅ Order saved successfully");
    res.status(200).json({ success: true, message: "Order placed successfully!" });
    for (const item of sanitizedItems) {
      try {
        await collec2.updateOne(
          { _id: item.productId },
          { $inc: { stocks: - (item.quantity || 1) } }
        );
      } catch (e) {
        console.warn(`⚠️ Stock update failed for ${item.name}: ${e.message}`);
      }
    }

    let payType;
    if (payment == 1) {
      payType = 'COD';
    }
    else {
      payType = 'UPI DONE';
    }

    const productNames = items.map(item => item.name).join(", ");
    const today = new Date();
    today.setDate(today.getDate())
    deliveryDate = today.toISOString().split('T')[0]
    const orderDetails = {
      from: 'pavanteja0107@gmail.com',
      to: userEmail,
      subject: 'Qwik Food Order confirmation message ',
      text: `Hello ${deliveryAddress.name} .,\n
      Thanks for ordering ,\n
      Your order of :${productNames} , \n
      Has been Placed and will be delivered to: ${deliveryAddress.addressLine} , ${deliveryAddress.city} \n
      With the total bill of :${totalAmount}/- \n
      Delivery date : ${deliveryDate} \n
      Our delivery agents will call you when they arrive \n
       Note : Delivery of your order maximun will take 15-20mins, if it exceeds please cancel the order and send a report to us.
        Happy Food 😊 \n Visit again \n for any queries email us : admin@gmail.com \n`

    }
    try {
      await transporter.sendMail(orderDetails)

    }
    catch (error) {
      console.log('order message not sent')
    }

    // 🧠 Step 1: Map canteen names to emails
    const canteenEmailMap = {
      "Ball canteen 1": "venkatsetty1129@gmail.com",
      "Ball canteen 2": "maincanteenAUS@gmail.com",
      "Eat n Play": "varmakallepalli0203@gmail.com",
    };

    // 🧠 Step 2: Group items by canteen
    const canteenItemMap = {};

    items.forEach(item => {
      const canteenName = item.description; // assuming 'description' is canteenName
      if (!canteenItemMap[canteenName]) {
        canteenItemMap[canteenName] = [];
      }
      canteenItemMap[canteenName].push(item);
    });

    // 🧠 Step 3: Send mail to each canteen
    for (const [canteenName, canteenItems] of Object.entries(canteenItemMap)) {
      const canteenEmail = canteenEmailMap[canteenName];
      if (!canteenEmail) {
        console.warn(`⚠️ No email mapped for canteen: ${canteenName}`);
        continue;
      }

      const foodList = canteenItems.map(it => `${it.name} x${it.quantity}`).join(", ");

      const canteenMail = {
        from: 'pavanteja0107@gmail.com',
        to: canteenEmail,
        subject: `New Order for ${canteenName}`,
        text: `Hello ${canteenName} team,\n\nYou have received a new food order:\n\nItems: ${foodList}\nTotal: ₹${totalAmount},\ncustomer name: ${deliveryAddress.name},\nPhone: ${deliveryAddress.phone},\nDelivery Address: ${deliveryAddress.addressLine}, ${deliveryAddress.city}\nDelivery Date: ${deliveryDate}\n payment type:${payType}\nPlease start preparing the order.\n\n- Qwik Cart System`
      };

      try {
        await transporter.sendMail(canteenMail);
        console.log(`📧 Mail sent to ${canteenName} (${canteenEmail})`);
      } catch (err) {
        console.error(`❌ Failed to send mail to ${canteenName}:`, err.message);
      }
    }


  } catch (error) {
    console.error("❌ Order placement failed:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }

  //stock updation
  for (const item of sanitizedItems) {
    try {
      await collec2.updateOne({ _id: item.productId }, { $inc: { stocks: -item.quantity } })
    }
    catch (e) {
      console.warn(`⚠️ Stock update failed for ${item.name}: ${e.message}`);
    }
  }

});


app.get('/getOrders', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const orders = await Order.find({ userEmail: email })
      .sort({ OrderDate: -1 }) // Sort by order date (newest first)
      .populate('items.productId'); // Populate product details

    if (!orders || orders.length === 0) {
      return res.json({ success: true, orders: [], message: "No orders found" });
    }

    // Format the response to include necessary order details
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderDate: order.OrderDate,
      status: order.status,
      items: order.items.map(item => ({
        productId: item.productId._id,
        name: item.name || item.productId.name,
        image: item.image || item.productId.image,
        price: item.price || item.productId.price,
        quantity: item.quantity
      })),
      deliveryAddress: order.deliveryAddress,
      totalAmount: order.totalAmount
    }));

    return res.json({ success: true, orders: formattedOrders });
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/cancelOrder', async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, message: "Missing orderId" });
  }

  try {
    const updated = await Order.findByIdAndUpdate(orderId, { status: "Cancelled" });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }


    res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    console.error("❌ Cancel order failed:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }


});


app.post('/deliveredOrder',async(req,res)=>{
  const {orderId}=req.body;
  if(!orderId){
    return res.status(400).json({success:false,message:"Missing OrderId"})
  }

  try{
    const updated=await Order.findByIdAndUpdate(orderId,{status:"Delivered"});
    if(!updated){
      return res.status(400).json({success:false,message:"Order not found"});
    }
    res.json({success:true,message:"Delivered confirmed"});
  }
  catch(err){
    console.error("❌ Delivery of order failed:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
