const payment = require('../models/payment.model')
const razorpay = require('../services/payment.service')

async function createOrder(req, res){
  const options = {
    amount: 5000 * 100, // amount in smallest currency unit
    currency: "INR",
  };
  try {
    const order = await razorpay.orders.create(options);
    res.send(order);

    const newPayment = await payment.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: 'pending',
    });

  } catch (error) {
    res.status(500).send('Error creating order');
  }
};


async function verifyOrder(req, res){
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET

  try {
    const { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils.js')

    const result = validatePaymentVerification({ "order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
    if (result) {
      const payment = await Payment.findOne({ orderId: razorpayOrderId });
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = 'completed';
      await payment.save();
      res.json({ status: 'success' });
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error verifying payment');
  }
};


module.exports = {createOrder, verifyOrder}