import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filteredProducts: [],
      sortBy: 'newest',
      viewMode: 'grid',
      selectedPriceRange: null,
      selectedRating: null,
      selectedCategories: [],
      priceRanges: [
        { id: 1, label: 'Under 500k', min: 0, max: 500000 },
        { id: 2, label: '500k – 1 million', min: 500000, max: 1000000 },
        { id: 3, label: '1 million – 5 million', min: 1000000, max: 5000000 },
        { id: 4, label: 'Above 5 million', min: 5000000, max: Infinity }
      ],
      categories: [],
      filterOpen: false
    };
  }

  render() {
    const prods = this.state.filteredProducts.map((item) => {
      const discount = Math.floor(Math.random() * 40) + 1; // Random discount for demo
      const rating = Math.floor(Math.random() * 2) + 4; // Random 4-5 stars
      const reviews = Math.floor(Math.random() * 500) + 50;
      const oldPrice = Math.floor(item.price * 1.2);

      return (
        <div key={item._id} className="product-grid-item">
          <div className="product-card">
            {/* Badges */}
            {discount > 20 && (
              <div className="product-badge discount">-{discount}%</div>
            )}
            {Math.random() > 0.7 && (
              <div className="product-badge bestseller">Bestselling</div>
            )}

            {/* Product Image */}
            <div className="product-image-container">
              <Link to={'/product/' + item._id} className="product-image-link">
                <img
                  src={"data:image/jpg;base64," + item.image}
                  alt={item.name}
                  className="product-image"
                />
              </Link>
              <button className="wishlist-btn-card" title="Add to wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            {/* Product Info */}
            <div className="product-info">
              {/* Product Name */}
              <Link to={'/product/' + item._id} className="product-name-link">
                <h3 className="product-name">{item.name}</h3>
              </Link>

              {/* Rating */}
              <div className="product-rating">
                <div className="stars">
                  {[...Array(rating)].map((_, i) => (
                    <span key={i} className="star filled">★</span>
                  ))}
                  {[...Array(5 - rating)].map((_, i) => (
                    <span key={i} className="star empty">★</span>
                  ))}
                </div>
                <span className="reviews-count">({reviews})</span>
              </div>

              {/* Price */}
              <div className="product-price">
                <span className="current-price">${item.price.toLocaleString()}</span>
                <span className="old-price">${oldPrice.toLocaleString()}</span>
              </div>

              {/* Add to Cart Button */}
              <button className="btn-add-to-cart" onClick={() => this.addToCart(item)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="products-page-container">
        {/* Filter Sidebar */}
        <aside className={`filter-sidebar ${this.state.filterOpen ? 'open' : ''}`}>
          <div className="filter-header">
            <h3>Filters</h3>
            <button className="filter-close-btn" onClick={() => this.setState({ filterOpen: false })}>
              ✕
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Price Range</h4>
            {this.state.priceRanges.map((range) => (
              <label key={range.id} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={this.state.selectedPriceRange?.id === range.id}
                  onChange={() => this.handlePriceChange(range)}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Ratings</h4>
            {[5, 4, 3].map((star) => (
              <label key={star} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={this.state.selectedRating === star}
                  onChange={() => this.handleRatingChange(star)}
                />
                <span>
                  {'★'.repeat(star)} {star === 5 ? 'Only' : `& above`}
                </span>
              </label>
            ))}
          </div>

          {/* Clear Filters */}
          <button className="btn-clear-filters" onClick={() => this.clearFilters()}>
            Clear All Filters
          </button>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Top Controls */}
          <div className="products-toolbar">
            <button 
              className="filter-toggle-btn"
              onClick={() => this.setState({ filterOpen: !this.state.filterOpen })}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="sort-container">
              <select 
                className="sort-select"
                value={this.state.sortBy}
                onChange={(e) => this.handleSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="view-toggle">
              <button 
                className={`view-btn ${this.state.viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => this.setState({ viewMode: 'grid' })}
                title="Grid view"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button 
                className={`view-btn ${this.state.viewMode === 'list' ? 'active' : ''}`}
                onClick={() => this.setState({ viewMode: 'list' })}
                title="List view"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>

            <span className="product-count">
              {this.state.filteredProducts.length} products
            </span>
          </div>

          {/* Products Grid/List */}
          {this.state.filteredProducts.length > 0 ? (
            <div className={`products-grid view-${this.state.viewMode}`}>
              {prods}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  handleSort(sortBy) {
    this.setState({ sortBy }, () => this.applyFilters());
  }

  handlePriceChange(range) {
    const newRange = this.state.selectedPriceRange?.id === range.id ? null : range;
    this.setState({ selectedPriceRange: newRange }, () => this.applyFilters());
  }

  handleRatingChange(rating) {
    const newRating = this.state.selectedRating === rating ? null : rating;
    this.setState({ selectedRating: newRating }, () => this.applyFilters());
  }

  clearFilters() {
    this.setState({
      selectedPriceRange: null,
      selectedRating: null,
      selectedCategories: []
    }, () => this.applyFilters());
  }

  applyFilters() {
    let filtered = [...this.state.products];

    // Apply price filter
    if (this.state.selectedPriceRange) {
      const range = this.state.selectedPriceRange;
      filtered = filtered.filter(
        p => p.price >= range.min && p.price < range.max
      );
    }

    // Apply rating filter (simulated - based on name length for demo)
    if (this.state.selectedRating) {
      filtered = filtered.filter(
        p => Math.floor(Math.random() * 2) + 4 >= this.state.selectedRating
      );
    }

    // Apply sorting
    switch (this.state.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.name.length - a.name.length);
        break;
      case 'newest':
      default:
        break;
    }

    this.setState({ filteredProducts: filtered });
  }

  addToCart(product) {
    alert(`Added "${product.name}" to cart!`);
  }

  componentDidMount() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  // apis
  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result, filteredProducts: result });
    });
  }

  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      const result = res.data;
      this.setState({ products: result, filteredProducts: result });
    });
  }
}

export default withRouter(Product);