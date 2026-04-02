import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import './ProductDetailComponent.css';

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
      activeTab: 'description',
      relatedProducts: []
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
        {/* Container */}
        <div className="product-detail-container">
          
          {/* Main Product Section */}
          <div className="product-main-section">
            
            {/* Image Gallery - Left Side */}
            <div className="product-gallery">
              {/* Main Image */}
              <div className="main-image">
                <img 
                  src={mainImage}
                  alt={prod.name}
                  key={this.state.selectedImageIndex}
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="gallery-thumbnails">
                {[0, 1, 2, 3].map((idx) => (
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
            </div>

            {/* Product Information - Right Side */}
            <section className="product-info-section">
              
              {/* Product Header with Brand and Badges */}
              <div className="product-header">
                <span className="product-brand-label">{prod.category?.name || 'Premium'}</span>
                <div className="product-badges">
                  <span className="product-badge new">NEW</span>
                  <span className="product-badge in-stock">In Stock ({this.state.stock})</span>
                </div>
              </div>

              {/* Product Name */}
              <h1 className="product-title">{prod.name}</h1>

              {/* Rating */}
              <div className="product-rating-section">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="rating-star">
                      {i < this.state.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <div className="rating-info">
                  <span className="rating-value">{this.state.rating}.0</span>
                  <span className="rating-reviews">({this.state.reviews} reviews)</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="price-section">
                <span className="current-price">${prod.price.toLocaleString()}</span>
                {originalPrice && (
                  <>
                    <span className="original-price">${originalPrice.toLocaleString()}</span>
                    <span className="discount-badge">Save {savingsPercent}%</span>
                  </>
                )}
              </div>

              {/* Quantity Section */}
              <div className="quantity-section">
                <label className="quantity-label">Quantity:</label>
                <div className="quantity-control">
                  <button 
                    className="quantity-btn" 
                    onClick={() => this.decreaseQuantity()}
                    disabled={this.state.txtQuantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity-value">{this.state.txtQuantity}</span>
                  <button 
                    className="quantity-btn" 
                    onClick={() => this.increaseQuantity()}
                    disabled={this.state.txtQuantity >= this.state.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="btn-add-to-cart"
                  onClick={(e) => this.btnAdd2CartClick(e)}
                >
                  🛒 Add to Cart
                </button>
                <button className="icon-btn" title="Add to wishlist" onClick={() => alert('Added to wishlist!')}>
                  ♥
                </button>
                <button className="icon-btn" title="Share product" onClick={() => alert('Share feature coming soon!')}>
                  ↗
                </button>
              </div>

              {/* Benefits Section */}
              <div className="benefits-section">
                <div className="benefit-item">
                  <span className="benefit-icon">🛡</span>
                  <div className="benefit-text">
                    <h4>Genuine Products</h4>
                    <p>100% authentic guarantee</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <span className="benefit-icon">🚚</span>
                  <div className="benefit-text">
                    <h4>Free Shipping</h4>
                    <p>On orders over $50</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <span className="benefit-icon">⏱</span>
                  <div className="benefit-text">
                    <h4>30-Day Returns</h4>
                    <p>Hassle-free returns</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Tabs Section */}
          <div className="tabs-section">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${this.state.activeTab === 'description' ? 'active' : ''}`}
                onClick={() => this.setState({ activeTab: 'description' })}
              >
                Description
              </button>
              <button 
                className={`tab-btn ${this.state.activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => this.setState({ activeTab: 'specifications' })}
              >
                Specifications
              </button>
              <button 
                className={`tab-btn ${this.state.activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => this.setState({ activeTab: 'reviews' })}
              >
                Reviews
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {this.state.activeTab === 'description' && (
                <div className="description-content">
                  <p className="description-text">
                    Experience premium quality with our {prod.name}. Crafted with precision and attention to detail, 
                    this product combines luxury aesthetics with exceptional functionality. Perfect for discerning customers 
                    who appreciate the finer things in life.
                  </p>
                  <h3 className="features-title">Key Features</h3>
                  <ul className="features-list">
                    <li>Premium {prod.category?.name || 'Grade'} Quality</li>
                    <li>Handcrafted Design & Finish</li>
                    <li>Exceptional Performance & Durability</li>
                    <li>Elegant Aesthetic Appeal</li>
                    <li>Professional Grade Materials</li>
                  </ul>
                </div>
              )}

              {this.state.activeTab === 'specifications' && (
                <div className="specifications-grid">
                  <div className="spec-item">
                    <span className="spec-label">Category:</span>
                    <span className="spec-value">{prod.category?.name || 'Premium'}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Model:</span>
                    <span className="spec-value">Premium Edition</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Warranty:</span>
                    <span className="spec-value">12 Months</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Availability:</span>
                    <span className="spec-value">{this.state.stock} In Stock</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Condition:</span>
                    <span className="spec-value">Brand New</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Shipping:</span>
                    <span className="spec-value">Free Worldwide</span>
                  </div>
                </div>
              )}

              {this.state.activeTab === 'reviews' && (
                <div>
                  <div className="reviews-header">
                    <div className="rating-summary">
                      <span className="rating-display">{this.state.rating}.0</span>
                      <div className="rating-summary-info">
                        <div className="rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="rating-star">
                              {i < this.state.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="rating-summary-text">Based on {this.state.reviews} reviews</span>
                      </div>
                    </div>
                    <button className="write-review-btn">Write a Review</button>
                  </div>

                  <div className="reviews-list">
                    {[1, 2, 3].map((reviewId) => (
                      <div key={reviewId} className="review-item">
                        <div className="review-header">
                          <div className="review-avatar">
                            {['J', 'S', 'M'][reviewId - 1]}
                          </div>
                          <div className="review-info">
                            <div className="review-author">
                              <span className="review-name">
                                {['James Thompson', 'Sarah Chen', 'Michael Rodriguez'][reviewId - 1]}
                              </span>
                              <span className="verified-badge">Verified Purchase</span>
                            </div>
                            <div className="review-meta">
                              <div className="review-rating">
                                <div className="rating-stars">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className="rating-star">
                                      {i < 5 ? '★' : '☆'}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <span className="review-date">
                                {['March 5, 2026', 'March 10, 2026', 'March 15, 2026'][reviewId - 1]}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="review-text">
                          {['Great product, excellent quality and service!', 
                            'Absolutely love it! Exceeded my expectations.', 
                            'Premium quality, highly recommend!'][reviewId - 1]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          {this.state.relatedProducts.length > 0 && (
            <div className="related-section">
              <h2 className="related-title">Related Products</h2>
              <div className="related-grid">
                {this.state.relatedProducts.slice(0, 4).map((relProduct) => (
                  <a 
                    key={relProduct._id} 
                    href={`product/${relProduct._id}`}
                    className="related-product-card"
                  >
                    <div className="related-product-image">
                      <img 
                        src={"data:image/jpg;base64," + relProduct.image}
                        alt={relProduct.name}
                      />
                    </div>
                    <div className="related-product-info">
                      <h3 className="related-product-name">{relProduct.name}</h3>
                      <div className="related-product-price">${relProduct.price.toLocaleString()}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
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
    this.apiGetRelatedProducts(params.id);
  }

  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    }).catch((error) => {
      console.error('Error fetching product:', error);
    });
  }

  apiGetRelatedProducts(currentId) {
    axios.get('/api/customer/products').then((res) => {
      const allProducts = res.data;
      const related = allProducts.filter(p => p._id !== currentId).slice(0, 4);
      this.setState({ relatedProducts: related });
    }).catch((error) => {
      console.error('Error fetching related products:', error);
    });
  }
}

export default withRouter(ProductDetail);
