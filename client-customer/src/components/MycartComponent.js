import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';
import { Link } from 'react-router-dom';
import './MycartComponent.css';

class Mycart extends Component {
    static contextType = MyContext; // using this . context to access global state

    constructor(props) {
        super(props);
        this.state = {
            promoCode: '',
            promoApplied: false,
            discount: 0
        };
    }

    // Handle quantity change
    updateQuantity = (productId, change) => {
        const mycart = this.context.mycart;
        const index = mycart.findIndex(x => x.product._id === productId);
        if (index !== -1) {
            mycart[index].quantity = Math.max(1, mycart[index].quantity + change);
            this.context.setMycart([...mycart]);
        }
    };

    // Handle promo code
    applyPromoCode = () => {
        const code = this.state.promoCode.toUpperCase();
        if (code === 'SAVE10') {
            this.setState({ discount: 0.1, promoApplied: true });
        } else if (code === 'SAVE20') {
            this.setState({ discount: 0.2, promoApplied: true });
        } else {
            alert('Invalid promo code');
        }
    };

    render() {
        const mycart = this.context.mycart;
        const subtotal = CartUtil.getTotal(mycart);
        const { discount, promoApplied } = this.state;
        const shipping = subtotal > 500 ? 0 : 49;
        const tax = subtotal * 0.08;
        const discountAmount = subtotal * discount;
        const total = subtotal + shipping + tax - discountAmount;

        // Empty cart view
        if (mycart.length === 0) {
            return (
                <div className="cart-page">
                    <div className="cart-breadcrumb">
                        <div className="breadcrumb-content">
                            <Link to="/home" className="breadcrumb-link">Home</Link>
                            <span>/</span>
                            <span className="breadcrumb-current">Shopping Cart</span>
                        </div>
                    </div>

                    <div className="cart-wrapper empty-cart-view">
                        <div className="empty-cart-container">
                            <h1 className="empty-cart-title">Your Cart is Empty</h1>
                            <p className="empty-cart-message">
                                Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
                            </p>
                            <Link to="/products" className="btn-continue-shopping">
                                🛍️ Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="cart-page">
                {/* Breadcrumb */}
                <div className="cart-breadcrumb">
                    <div className="breadcrumb-content">
                        <Link to="/home" className="breadcrumb-link">Home</Link>
                        <span>/</span>
                        <span className="breadcrumb-current">Shopping Cart</span>
                    </div>
                </div>

                <div className="cart-wrapper">
                    {/* Page Header */}
                    <div className="cart-header">
                        <h1>Shopping Cart</h1>
                        <p>{mycart.length} {mycart.length === 1 ? 'item' : 'items'} in your cart</p>
                    </div>

                    <div className="cart-content">
                        {/* Cart Items */}
                        <div className="cart-items-section">
                            <div className="cart-items-container">
                                {mycart.map((item, index) => (
                                    <div key={item.product._id} className="cart-item">
                                        <div className="cart-item-image">
                                            <Link to={`/product/${item.product._id}`}>
                                                <img 
                                                    src={"data:image/jpg;base64," + item.product.image} 
                                                    alt={item.product.name}
                                                    className="product-img"
                                                />
                                            </Link>
                                        </div>

                                        <div className="cart-item-details">
                                            <div className="item-header">
                                                <div className="item-info">
                                                    <Link to={`/product/${item.product._id}`} className="item-name-link">
                                                        <h3 className="item-name">{item.product.name}</h3>
                                                    </Link>
                                                    <p className="item-category">{item.product.category?.name || 'Product'}</p>
                                                    <span className="item-stock">✓ In Stock</span>
                                                </div>
                                                <button 
                                                    className="item-remove-btn"
                                                    onClick={() => this.lnkRemoveClick(item.product._id)}
                                                    title="Remove item"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <div className="item-footer">
                                                <div className="quantity-control">
                                                    <span className="qty-label">Quantity:</span>
                                                    <div className="qty-selector">
                                                        <button 
                                                            className="qty-btn"
                                                            onClick={() => this.updateQuantity(item.product._id, -1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="qty-value">{item.quantity}</span>
                                                        <button 
                                                            className="qty-btn"
                                                            onClick={() => this.updateQuantity(item.product._id, 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="item-pricing">
                                                    <div className="total-price">
                                                        ${(item.product.price * item.quantity).toFixed(2)}
                                                    </div>
                                                    <div className="unit-price">
                                                        ${item.product.price} each
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cart Actions */}
                            <div className="cart-actions">
                                <Link to="/products" className="btn-continue-shopping">
                                    🛍️ Continue Shopping
                                </Link>
                                <button 
                                    className="btn-clear-cart"
                                    onClick={() => {
                                        if (window.confirm('Clear your cart?')) {
                                            this.context.setMycart([]);
                                        }
                                    }}
                                >
                                    🗑️ Clear Cart
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="order-summary-section">
                            <div className="summary-sticky">
                                {/* Order Summary Box */}
                                <div className="order-summary">
                                    <h2>Order Summary</h2>

                                    {/* Promo Code */}
                                    <div className="promo-section">
                                        <label>Promo Code</label>
                                        <div className="promo-input-group">
                                            <input
                                                type="text"
                                                value={this.state.promoCode}
                                                onChange={(e) => this.setState({ promoCode: e.target.value })}
                                                placeholder="Enter code"
                                                disabled={promoApplied}
                                                className="promo-input"
                                            />
                                            <button
                                                onClick={this.applyPromoCode}
                                                disabled={promoApplied || !this.state.promoCode}
                                                className="btn-apply"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {promoApplied && (
                                            <p className="promo-success">✓ Promo code applied successfully!</p>
                                        )}
                                        {!promoApplied && (
                                            <p className="promo-hint">Try: SAVE10 (10% off) or SAVE20 (20% off)</p>
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
                                            <span className={shipping === 0 ? 'free' : ''}>
                                                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                            </span>
                                        </div>
                                        <div className="price-row">
                                            <span>Tax (8%)</span>
                                            <span>${tax.toFixed(2)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="price-row discount">
                                                <span>Discount ({discount * 100}%)</span>
                                                <span>-${discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="price-row total">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button 
                                        className="btn-checkout"
                                        onClick={() => this.lnkCheckoutClick()}
                                    >
                                        Proceed to Checkout →
                                    </button>

                                    {/* Free Shipping Info */}
                                    {subtotal < 500 && (
                                        <p className="shipping-info">
                                            Add ${(500 - subtotal).toFixed(2)} more for free shipping
                                        </p>
                                    )}
                                </div>

                                {/* Trust Badges */}
                                <div className="trust-badges">
                                    <div className="badge-item">
                                        <div className="badge-icon returns">📦</div>
                                        <div className="badge-content">
                                            <p className="badge-title">Free Returns</p>
                                            <p className="badge-desc">30-day return policy</p>
                                        </div>
                                    </div>
                                    <div className="badge-item">
                                        <div className="badge-icon secure">🔒</div>
                                        <div className="badge-content">
                                            <p className="badge-title">Secure Payment</p>
                                            <p className="badge-desc">Your data is protected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Event handlers
    lnkRemoveClick = (id) => {
        const mycart = this.context.mycart;
        const index = mycart.findIndex(x => x.product._id === id);
        if (index !== -1) {
            mycart.splice(index, 1);
            this.context.setMycart([...mycart]);
        }
    };

    lnkCheckoutClick = () => {
        if (this.context.mycart.length > 0) {
            const customer = this.context.customer;
            if (customer) {
                this.props.navigate('/checkout');
            } else {
                this.props.navigate('/login');
            }
        } else {
            alert('Your cart is empty');
        }
    };
}

export default withRouter(Mycart);

