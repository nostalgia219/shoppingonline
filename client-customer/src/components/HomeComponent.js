import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './HomeComponent.css';
import Blog from './BlogComponent';
import BrandStrengths from './BrandStrengthsComponent';
import Testimonials from './TestimonialsComponent';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: []
    };
  }

  render() {
    const categories = [
      {
        title: 'Billiard Tables',
        subtitle: 'Pool, Snooker, Carom',
        image: 'https://images.unsplash.com/photo-1677256260549-13f36774d59e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm9va2VyJTIwdGFibGUlMjBlbGVnYW50fGVufDF8fHx8MTc3NDYxMDM5OHww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        title: 'Billiard Cues',
        subtitle: 'Single, Assembly, Competition',
        image: 'https://images.unsplash.com/photo-1761012322191-67444d1133d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBiaWxsaWFyZCUyMGN1ZSUyMHN0aWNrfGVufDF8fHx8MTc3NDYxMDM5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        title: 'Accessories',
        subtitle: 'Balls, Tips, Chalk, Gloves',
        image: 'https://images.unsplash.com/photo-1720408155570-e435204c6197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb29sJTIwdGFibGUlMjBhY2Nlc3NvcmllcyUyMGJhbGxzfGVufDF8fHx8MTc3NDYxMDM5OHww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        title: 'Lighting & Decor',
        subtitle: 'Tables & Decorative Lights',
        image: 'https://images.unsplash.com/photo-1721838449374-722202a68197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWxsaWFyZCUyMHJvb20lMjBsaWdodGluZ3xlbnwxfHx8fDE3NzQ2MTA0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ];

    const categoryCards = categories.map((category, idx) => (
      <div key={idx} className="category-card">
        <div className="category-image-wrapper">
          <img src={category.image} alt={category.title} className="category-image" loading="lazy" />
          <div className="category-overlay"></div>
          <div className="category-content">
            <h3 className="category-title">{category.title}</h3>
            <p className="category-subtitle">{category.subtitle}</p>
            <div className="category-explore">
              <span>Explore</span>
              <span className="category-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    ));

    const newprods = this.state.newprods
      .filter(item => item && item._id) // Filter out null/undefined items
      .map((item) => {
        return (
          <div key={item._id} className="product-card-luxury">
            <div className="product-image-wrapper">
              <Link to={'/product/' + item._id}>
                <img
                  src={"data:image/jpg;base64," + item.image}
                  alt={item.name}
                  className="product-image"
                  loading="lazy"
                />
                <div className="product-overlay">
                  <span className="view-details">View Details</span>
                </div>
              </Link>
            </div>
            <div className="product-info">
              <h3 className="product-name-luxury">{item.name}</h3>
              <p className="product-price-luxury">${item.price.toFixed(2)}</p>
              <Link to={'/product/' + item._id} className="add-to-cart-btn">Add to Cart</Link>
            </div>
          </div>
        );
      });

    const hotprods = this.state.hotprods
      .filter(item => item && item._id) // Filter out null/undefined items
      .map((item) => {
        return (
          <div key={item._id} className="product-card-luxury featured">
            <div className="badge-premium">Featured</div>
            <div className="product-image-wrapper">
              <Link to={'/product/' + item._id}>
                <img
                  src={"data:image/jpg;base64," + item.image}
                  alt={item.name}
                  className="product-image"
                  loading="lazy"
                />
                <div className="product-overlay">
                  <span className="view-details">View Details</span>
                </div>
              </Link>
            </div>
          <div className="product-info">
            <h3 className="product-name-luxury">{item.name}</h3>
            <p className="product-price-luxury">${item.price.toFixed(2)}</p>
            <Link to={'/product/' + item._id} className="add-to-cart-btn">Add to Cart</Link>
          </div>
        </div>
      );
    });

    return (
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section-luxury">
          <div className="hero-background-image"></div>
          <div className="hero-overlay"></div>
          
          <div className="hero-content-luxury">
            <div className="hero-text">
              <span className="hero-accent-label">EXCELLENCE IN EVERY SHOT</span>
              <h1 className="hero-title-luxury">Professional Billiard Equipment</h1>
              <p className="hero-description-luxury">
                International Competition Standard — Crafted for Champions
              </p>
              <div className="hero-buttons-luxury">
                <Link to="/products" className="btn-primary-luxury btn-discover">
                  Discover Now
                </Link>
                <Link to="/products" className="btn-secondary-luxury btn-catalogue">
                  View Catalogue
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <span className="scroll-text">Scroll Down</span>
            <div className="scroll-dot-container">
              <div className="scroll-dot"></div>
            </div>
          </div>
        </section>

        {/* Featured Categories Section */}
        <section className="featured-categories-section">
          <div className="categories-container">
            <div className="categories-header">
              <h2 className="categories-title">Featured Categories</h2>
              <p className="categories-subtitle">Explore our premium collection of billiard equipment</p>
            </div>
            <div className="categories-grid">
              {categoryCards}
            </div>
          </div>
        </section>

        {/* Brand Strengths Section */}
        <BrandStrengths />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Blog Section */}
        <Blog />
      </div>
    );
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  // apis
  apiGetNewProducts() {
    axios.get('/api/customer/products/new').then((res) => {
      const result = res.data;
      this.setState({ newprods: result });
    });
  }

  apiGetHotProducts() {
    axios.get('/api/customer/products/hot').then((res) => {
      const result = res.data;
      this.setState({ hotprods: result });
    });
  }
}

export default Home;