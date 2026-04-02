import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import './ProductComponent.css';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filteredProducts: [],
      sortBy: 'featured',
      viewMode: 'grid',
      selectedCategory: null,
      selectedPriceRange: null,
      selectedBrands: [],
      priceRanges: [
        { id: 1, label: 'Under $50', min: 0, max: 50 },
        { id: 2, label: '$50 - $100', min: 50, max: 100 },
        { id: 3, label: '$100 - $300', min: 100, max: 300 },
        { id: 4, label: '$300 - $600', min: 300, max: 600 },
        { id: 5, label: 'Over $600', min: 600, max: Infinity }
      ],
      categories: [],
      brands: [],
      filterOpen: false
    };
  }

  componentDidMount() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts = () => {
    axios.get('/api/customer/products').then(res => {
      this.setState({ 
        products: res.data || []
      }, () => this.applyFilters());
    }).catch(err => console.error('Error loading products:', err));
  };

  loadCategories = () => {
    axios.get('/api/customer/categories').then(res => {
      this.setState({ 
        categories: res.data || []
      });
    }).catch(err => console.error('Error loading categories:', err));
  };

  render() {
    const { filteredProducts, viewMode, categories, products } = this.state;
    
    // Get unique brands from products
    const brands = [...new Set(filteredProducts.map(p => p.brand).filter(Boolean))];
    
    // Count products per category
    const getCategoryCount = (categoryId) => {
      if (!categoryId) return this.state.products.length;
      return this.state.products.filter(p => {
        const catId = p.category?._id || p.category;
        return catId === categoryId;
      }).length;
    };

    return (
      <div className="products-page-container">
        {/* Sidebar */}
        <aside className={`filter-sidebar ${this.state.filterOpen ? 'open' : ''}`}>
          <div className="filter-header">
            <button 
              className="filter-close-btn" 
              onClick={() => this.setState({ filterOpen: false })}
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>

          {/* Categories Filter */}
          <div className="filter-group sidebar-section">
            <h3 className="sidebar-title">Categories</h3>
            <div className="sidebar-options">
              <button
                className={`sidebar-option ${!this.state.selectedCategory ? 'active' : ''}`}
                onClick={() => this.handleCategoryChange(null)}
              >
                <span>All Products</span>
                <span className="option-count">({this.state.products.length})</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`sidebar-option ${this.state.selectedCategory?._id === cat._id ? 'active' : ''}`}
                  onClick={() => this.handleCategoryChange(cat)}
                >
                  <span>{cat.name}</span>
                  <span className="option-count">({getCategoryCount(cat._id)})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group sidebar-section">
            <h3 className="sidebar-title">Price Range</h3>
            <div className="sidebar-options">
              {this.state.priceRanges.map((range) => (
                <button
                  key={range.id}
                  className={`sidebar-option ${this.state.selectedPriceRange?.id === range.id ? 'active' : ''}`}
                  onClick={() => this.handlePriceChange(range)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="filter-group sidebar-section">
            <h3 className="sidebar-title">Brands</h3>
            <div className="sidebar-options">
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <label key={brand} className="sidebar-checkbox">
                    <input
                      type="checkbox"
                      checked={this.state.selectedBrands.includes(brand)}
                      onChange={() => this.handleBrandChange(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))
              ) : (
                <div style={{ color: '#808080', padding: '12px' }}>No brands available</div>
              )}
            </div>
          </div>

          {/* Clear Filters */}
          <button className="clear-filters-btn" onClick={() => this.clearFilters()}>
            Clear All Filters
          </button>
        </aside>

        {/* Overlay for mobile */}
        {this.state.filterOpen && (
          <div 
            className="filter-overlay open"
            onClick={() => this.setState({ filterOpen: false })}
          />
        )}

        {/* Main Content */}
        <main className="products-main">
          {/* Header */}
          <div>
            <h1 className="products-title">Our Products</h1>
            <p className="products-count">Showing {filteredProducts.length} products</p>
          </div>

          {/* Top Controls */}
          <div className="products-toolbar">
            <div className="toolbar-left">
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

              {/* View Mode Toggle */}
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => this.setState({ viewMode: 'grid' })}
                  title="Grid view"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button 
                  className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => this.setState({ viewMode: 'list' })}
                  title="List view"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"></line>
                    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"></line>
                    <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div className="toolbar-right">
              {/* Sort Dropdown */}
              <select 
                className="sort-select"
                value={this.state.sortBy}
                onChange={(e) => this.handleSort(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={`products-grid view-${viewMode}`}>
              {filteredProducts.map((item) => {
                // Generate random display data if not in database
                const isNew = !item.status || item.status === 'NEW';
                const hasSale = Math.random() > 0.6;
                const oldPrice = hasSale && item.price ? Math.floor(item.price * 1.3) : null;
                const rating = Math.floor(Math.random() * 2) + 4;
                const reviews = Math.floor(Math.random() * 300) + 50;
                
                // Handle image - base64 encoded
                const productImage = item.image ? ("data:image/jpg;base64," + item.image) : null;

                return (
                  <a key={item._id} href={'/product/' + item._id} className="product-card-link">
                    <div className={`product-card ${viewMode === 'list' ? 'list-view' : ''}`}>
                      {/* Image Container */}
                      <div className={`product-image-container ${viewMode === 'list' ? 'list-view' : ''}`}>
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={item.name}
                            className="product-image"
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                            No Image
                          </div>
                        )}
                        {isNew && <span className="product-badge-new">NEW</span>}
                        {hasSale && <span className="product-badge-sale">SALE</span>}
                      </div>

                      {/* Product Info */}
                      <div className={`product-info ${viewMode === 'list' ? 'list-view' : ''}`}>
                        <div className="product-brand">{item.brand || 'Brand'}</div>
                        <h3 className={`product-name ${viewMode === 'list' ? 'list-view' : ''}`}>{item.name}</h3>
                        
                        {/* Rating */}
                        <div className="product-rating">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < rating ? 'star filled' : 'star empty'}>★</span>
                            ))}
                          </div>
                          <span className="reviews-count">({reviews})</span>
                        </div>

                        {/* Price */}
                        <div className="product-price">
                          <span className="current-price">${item.price || 0}</span>
                          {oldPrice && <span className="old-price">${oldPrice}</span>}
                        </div>

                        {/* Add to Cart Button */}
                        <button 
                          className="btn-add-to-cart"
                          onClick={(e) => {
                            e.preventDefault();
                            this.addToCart(item);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </a>
                );
              })}
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

  handleCategoryChange(category) {
    this.setState({ selectedCategory: category }, () => this.applyFilters());
  }

  handlePriceChange(range) {
    const newRange = this.state.selectedPriceRange?.id === range.id ? null : range;
    this.setState({ selectedPriceRange: newRange }, () => this.applyFilters());
  }

  handleBrandChange(brand) {
    const selectedBrands = this.state.selectedBrands.includes(brand)
      ? this.state.selectedBrands.filter(b => b !== brand)
      : [...this.state.selectedBrands, brand];
    this.setState({ selectedBrands }, () => this.applyFilters());
  }

  clearFilters() {
    this.setState({
      selectedCategory: null,
      selectedPriceRange: null,
      selectedBrands: []
    }, () => this.applyFilters());
  }

  applyFilters() {
    let filtered = [...this.state.products];

    // Apply category filter
    if (this.state.selectedCategory) {
      filtered = filtered.filter(p => {
        const productCatId = p.category?._id || p.category;
        const selectedCatId = this.state.selectedCategory._id || this.state.selectedCategory;
        return productCatId === selectedCatId;
      });
    }

    // Apply price filter
    if (this.state.selectedPriceRange) {
      const range = this.state.selectedPriceRange;
      filtered = filtered.filter(
        p => p.price >= range.min && p.price < range.max
      );
    }

    // Apply brand filter
    if (this.state.selectedBrands.length > 0) {
      filtered = filtered.filter(
        p => p.brand && this.state.selectedBrands.includes(p.brand)
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
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.cdate || 0) - new Date(a.cdate || 0));
        break;
      default:
        break;
    }

    this.setState({ filteredProducts: filtered });
  }

  addToCart(item) {
    // Implement add to cart logic - you can integrate with your cart context/state here
    console.log('Added to cart:', item);
    // TODO: Add to cart state management
  }
}

export default withRouter(Product);
