import React,{useState} from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";

const Card = ({ actualPrice, image, name }) => {
  return (
    <section className="orderSection">
      <div>
        <img width="100px" height="100px" src={image} alt="" />
      </div>
      <div>
        <h3>{name}</h3>
        <h5>₹{actualPrice}</h5>
      </div>
    </section>
  );
};

const Cart = () => {
  const orders = JSON.parse(localStorage.getItem("orders"));
  const total = localStorage.getItem("total");
  const [toggle, setToggle] = useState(true)

  const history = useHistory();

  const sendData = () => {
    setToggle(false)
    fetch("http://localhost:4000/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order : orders
      }),
    })
      .then((response) => {
        console.log(response);
        localStorage.setItem("orders", "");
      })
      .catch((err) => console.log(err))
  }

  const makePayment = (token) => {
    
    fetch("http://localhost:4000/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: total,
        order : orders
      }),
    })
      .then((response) => {
        console.log(response);
        localStorage.setItem("orders", "");
      })
      .catch((err) => console.log(err));

    toast.success("Payment Successfull");
    setTimeout(() => {
      history.replace("/");
      window.location.reload(false);
    }, 2000);
  };

  return (
    <div className="mainWrapper">
      <h2>Your Orders</h2>
      <div className="wrapper">
        {
          <div className="orders">
            {orders.map((order, idx) => (
              <Card
                key={idx}
                actualPrice={order.actualPrice}
                image={order.img}
                name={order.name}
              />
            ))}
          </div>
        }
      </div>
      <div className="payment">
        <h3>Total Amount ₹{total} </h3>
        {toggle ? <button className="btn" onClick={sendData}>Pay ₹{total} </button> :<StripeCheckout
          billingAddress
          shippingAddress
          stripeKey="pk_test_51LEQaGSFuaVJlr3qYxOtN8ULMzRDmj2NghMGLh6YSkIdY8qiGS2x0sS9XmxGVVn1bGyin8SIEnhNcedBZR5BABZY005Nuej7sd"
          token={makePayment}
          name="Pizza Order"
        />}
      </div>
    </div>
  );
};

export default Cart;
