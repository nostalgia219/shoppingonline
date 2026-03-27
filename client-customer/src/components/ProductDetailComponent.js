import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;
  
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      selectedImageIndex: 0,
      rating: Math.floor(Math.random() * 2) + 4,
      reviews: Math.floor(Math.random() * 500) + 100,
      stock: Math.floor(Math.random() * 50) + 10,
      discount: 30,
      imageGallery: []
    };
  }

  render() {
    const prod = this.state.product;
    
    if (!prod) {
      return <div className="product-detail-loading">Loading product...</div>;
    }

    const originalPrice = Math.floor(prod.price * 1.5);
    const savings = originalPrice - prod.price;
    const savingsPercent = Math.round((savings / originalPrice) * 100);
    const mainImage = "data:image/jpg;base64," + prod.image;

    return (
      <div className="product-detail-page">
        {/* Split Container */}
        <div className="product-detail-container">
          
          {/* Left: Image Gallery */}
          <aside className="product-image-section">
            {/* Discount Badge */}
            <div className="discount-badge-large">
              <span className="badge-value">-{this.state.discount}%</span>
            </div>

            {/* Main Image */}
            <div className="main-image-container">
              <img 
                src={mainImage}
                alt={prod.name}
                className="main-product-image"
                key={this.state.selectedImageIndex}
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="thumbnail-gallery">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${idx === this.state.selectedImageIndex ? 'active' : ''}`}
                  onClick={() => this.handleImageSelect(idx)}
                  title={`View image ${idx + 1}`}
                >
                  <img 
                    src={mainImage}
                    alt={`Product view ${idx + 1}`}
                  />
                </button>
              ))}
            </div>
          </aside>

          {/* Right: Product Information */}
          <section className="product-info-section">
            
            {/* Product Category */}
            <div className="product-category">
              <span>{prod.category?.name || 'Electronics'}</span>
            </div>

            {/* Product Name */}
            <h1 className="product-title">{prod.name}</h1>

            {/* Rating */}
            <div className="product-rating-detail">
              <div className="stars-detail">
                {[...Array(this.state.rating)].map((_, i) => (
                  <span key={i} className="star filled">★</span>
                ))}
                {[...Array(5 - this.state.rating)].map((_, i) => (
                  <span key={i} className="star empty">★</span>
                ))}
              </div>
              <span className="rating-text">
                <strong>{this.state.rating}</strong> | {this.state.reviews} reviews
              </span>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <div className="price-container">
                <span className="current-price">${prod.price.toLocaleString()}</span>
                <span className="original-price">${originalPrice.toLocaleString()}</span>
              </div>
              <div className="savings-badge">
                Save {savingsPercent}% (${savings.toLocaleString()})
              </div>
            </div>

            {/* Product Specs */}
            <div className="product-specs">
              <div className="spec-row">
                <span className="spec-label">Model:</span>
                <span className="spec-value">Premium {prod.category?.name || 'Edition'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Warranty:</span>
                <span className="spec-value">12 Months International</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Availability:</span>
                <span className="spec-value in-stock">In Stock ({this.state.stock} items)</span>
              </div>
            </div>

            {/* Divider */}
            <div className="divider"></div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label className="quantity-label">Quantity</label>
              <div className="quantity-selector">
                <button 
                  className="qty-btn" 
                  onClick={() => this.decreaseQuantity()}
                  disabled={this.state.txtQuantity <= 1}
                >
                  −
                </button>
                <input 
                  type="text" 
                  className="qty-input"
                  value={this.state.txtQuantity}
                  onChange={(e) => this.setState({ txtQuantity: parseInt(e.target.value) || 1 })}
                  readOnly
                />
                <button 
                  className="qty-btn" 
                  onClick={() => this.increaseQuantity()}
                  disabled={this.state.txtQuantity >= this.state.stock}
                >
                  +
                </button>
              </div>
              <span className="stock-info">({this.state.stock} available)</span>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={(e) => this.btnAdd2CartClick(e)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>
              <button className="btn btn-secondary">
                Buy Now
              </button>
            </div>

            {/* Wishlist & Share */}
            <div className="secondary-actions">
              <button className="action-icon" title="Add to wishlist">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <button className="action-icon" title="Share product">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="divider"></div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div>
                  <strong>Genuine Products</strong>
                  <p>100% authentic guarantee</p>
                </div>
              </div>
              
              <div className="trust-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <div>
                  <strong>Free Shipping</strong>
                  <p>On all orders over $50</p>
                </div>
              </div>

              <div className="trust-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22v-7m-5-4h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1zm3-4v4m4-4v4"></path>
                </svg>
                <div>
                  <strong>12-Month Warranty</strong>
                  <p>Full manufacturer coverage</p>
                </div>
              </div>

              <div className="trust-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M16 11h6m-3-3v6"></path>
                </svg>
                <div>
                  <strong>30-Day Returns</strong>
                  <p>Hassle-free return policy</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  handleImageSelect(index) {
    this.setState({ selectedImageIndex: index });
  }

  increaseQuantity() {
    if (this.state.txtQuantity < this.state.stock) {
      this.setState({ txtQuantity: this.state.txtQuantity + 1 });
    }
  }

  decreaseQuantity() {
    if (this.state.txtQuantity > 1) {
      this.setState({ txtQuantity: this.state.txtQuantity - 1 });
    }
  }

  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
    
    if (quantity && quantity > 0) {
      const mycart = this.context.mycart;
      const index = mycart.findIndex(x => x.product._id === product._id);
      
      if (index === -1) {
        const newItem = { product: product, quantity: quantity };
        mycart.push(newItem);
      } else {
        mycart[index].quantity += quantity;
      }
      
      this.context.setMycart(mycart);
      alert(`Added ${quantity} item(s) to cart!`);
    } else {
      alert('Please select a valid quantity');
    }
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    });
  }
}

export default withRouter(ProductDetail);
