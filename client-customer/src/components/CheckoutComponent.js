import React, { useContext, useState } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CheckoutComponent.css';

export default function Checkout() {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('shipping');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    address: '',
    city: '',
  });

  // Validate shipping form
  const isShippingFormValid = () => {
    return (
      shippingInfo.firstName &&
      shippingInfo.lastName &&
      shippingInfo.email &&
      shippingInfo.phone &&
      shippingInfo.address &&
      shippingInfo.city
    );
  };

  // Validate payment form
  const isPaymentFormValid = () => {
    return (
      paymentInfo.cardNumber &&
      paymentInfo.cardName &&
      paymentInfo.expiryDate &&
      paymentInfo.cvv
    );
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(0.1);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  const cartItems = context.mycart;
  const subtotal = CartUtil.getTotal(cartItems);
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.08;
  const discountAmount = subtotal * discount;
  const total = subtotal + shipping + tax - discountAmount;

  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ];

  const getStepIndex = (step) => steps.findIndex((s) => s.id === step);

  const handlePlaceOrder = () => {
    if (!isPaymentFormValid()) {
      alert('Please complete payment information');
      return;
    }

    setIsProcessing(true);
    const orderData = {
      total: total,
      items: cartItems,
      customer: context.customer,
      shippingInfo: shippingInfo,
      billingAddress: billingAddress,
    };

    const config = { headers: { 'x-access-token': context.token } };
    axios
      .post('/api/customer/checkout', orderData, config)
      .then((res) => {
        if (res.data) {
          alert('Order placed successfully!');
          context.setMycart([]);
          navigate('/myorders');
        } else {
          alert('Failed to place order');
        }
      })
      .catch((err) => {
        console.error('Checkout error:', err);
        alert('Error placing order: ' + err.message);
      })
      .finally(() => setIsProcessing(false));
  };

  if (!context.customer) {
    return (
      <div className="checkout-container">
        <div className="auth-required">
          <h2>Please log in to checkout</h2>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button
            className="btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Breadcrumb */}
      <div className="checkout-breadcrumb">
        <div className="breadcrumb-content">
          <a href="/home" className="breadcrumb-link">
            Home
          </a>
          <span>/</span>
          <a href="/products" className="breadcrumb-link">
            Products
          </a>
          <span>/</span>
          <span className="breadcrumb-current">Checkout</span>
        </div>
      </div>

      <div className="checkout-wrapper">
        {/* Page Title */}
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className="steps-container">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = getStepIndex(currentStep) > index;

              return (
                <div key={step.id} className="step-item">
                  <div className="steps-flex">
                    <div
                      className={`step-circle ${
                        isCompleted
                          ? 'completed'
                          : isActive
                          ? 'active'
                          : 'inactive'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span
                      className={`step-label ${
                        isActive ? 'active' : ''
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`step-line ${
                        getStepIndex(currentStep) > index
                          ? 'completed'
                          : ''
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Shipping Information */}
            {currentStep === 'shipping' && (
              <div className="step-content shipping-step">
                <div className="step-header">
                  <h2>Shipping Information</h2>
                </div>

                <form className="checkout-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            city: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isShippingFormValid()) {
                        setCurrentStep('payment');
                      } else {
                        alert('Please fill in all required fields');
                      }
                    }}
                    className="btn-continue"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Payment Information */}
            {currentStep === 'payment' && (
              <div className="step-content">
                <div className="payment-section">
                  <div className="step-header">
                    <h2>Payment Information</h2>
                  </div>

                  <form className="checkout-form">
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label>Card Number *</label>
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cardNumber: e.target.value,
                            })
                          }
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Cardholder Name *</label>
                        <input
                          type="text"
                          value={paymentInfo.cardName}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cardName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              expiryDate: e.target.value,
                            })
                          }
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cvv: e.target.value,
                            })
                          }
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={paymentInfo.saveCard}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            saveCard: e.target.checked,
                          })
                        }
                      />
                      Save this card for future purchases
                    </label>
                  </form>
                </div>

                {/* Billing Address */}
                <div className="billing-section">
                  <h3>Billing Address</h3>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={billingAddress.sameAsShipping}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          sameAsShipping: e.target.checked,
                        })
                      }
                    />
                    Same as shipping address
                  </label>

                  {!billingAddress.sameAsShipping && (
                    <form className="checkout-form billing-form">
                      <div className="form-group">
                        <label>Address *</label>
                        <input
                          type="text"
                          value={billingAddress.address}
                          onChange={(e) =>
                            setBillingAddress({
                              ...billingAddress,
                              address: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>City *</label>
                          <input
                            type="text"
                            value={billingAddress.city}
                            onChange={(e) =>
                              setBillingAddress({
                                ...billingAddress,
                                city: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    </form>
                  )}
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shipping')}
                    className="btn-back"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isPaymentFormValid()) {
                        setCurrentStep('review');
                      } else {
                        alert('Please complete payment information');
                      }
                    }}
                    className="btn-continue"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Order Review */}
            {currentStep === 'review' && (
              <div className="step-content">
                <div className="review-section">
                  <div className="step-header">
                    <h2>Order Review</h2>
                  </div>

                  <div className="review-details">
                    <div className="review-box">
                      <h3>Shipping Details</h3>
                      <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}</p>
                      <p>{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                    </div>

                    <div className="review-box">
                      <h3>Payment Method</h3>
                      <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                      <p>{paymentInfo.cardName}</p>
                    </div>
                  </div>

                  <div className="review-items">
                    <h3>Order Items</h3>
                    {cartItems.map((item) => (
                      <div key={item.product._id} className="review-item">
                        <img
                          src={"data:image/jpg;base64," + item.product.image}
                          alt={item.product.name}
                        />
                        <div className="item-details">
                          <p className="item-name">{item.product.name}</p>
                          <p className="item-category">{item.product.category.name}</p>
                        </div>
                        <div className="item-quantity">
                          <p>Qty: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('payment')}
                    className="btn-back"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="btn-place-order"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <div className="summary-sticky">
              <div className="summary-box">
                <h3>Order Summary</h3>

                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="summary-item">
                      <img
                        src={"data:image/jpg;base64," + item.product.image}
                        alt={item.product.name}
                      />
                      <div className="item-info">
                        <p className="item-name">{item.product.name}</p>
                        <p className="item-brand">
                          {item.product.category.name}
                        </p>
                      </div>
                      <div className="item-actions">
                        <p className="quantity">x{item.quantity}</p>
                        <p className="price">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="promo-section">
                  <div className="promo-input-group">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="promo-input"
                    />
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      className="btn-apply"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="success-message">
                      Promo code applied! 10% discount
                    </p>
                  )}
                  {!promoApplied && (
                    <p className="hint-message">Try 'SAVE10' for 10% off</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="price-row discount">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="price-row total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 500 && (
                  <p className="shipping-hint">
                    Add ${(500 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              {/* Security Badge */}
              <div className="security-badge">
                <p>🔒 Secure Checkout</p>
                <p className="security-text">
                  Your information is protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
