import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: []
    };
  }

  render() {
    const newprods = this.state.newprods.map((item) => {
      return (
        <div key={item._id} className="product-card">
          <figure>
            <Link to={'/product/' + item._id}>
              <img
                src={"data:image/jpg;base64," + item.image}
                width="200px"
                height="200px"
                alt={item.name}
              />
            </Link>
            <figcaption className="product-caption">
              <p className="product-name">{item.name}</p>
              <p className="product-price">${item.price}</p>
            </figcaption>
          </figure>
        </div>
      );
    });

    const hotprods = this.state.hotprods.map((item) => {
      return (
        <div key={item._id} className="product-card">
          <figure>
            <Link to="">
              <img
                src={"data:image/jpg;base64," + item.image}
                width="200px"
                height="200px"
                alt={item.name}
              />
            </Link>
            <figcaption className="product-caption">
              <p className="product-name">{item.name}</p>
              <p className="product-price">${item.price}</p>
            </figcaption>
          </figure>
        </div>
      );
    });

    return (
      <div>
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <span className="promo-badge">🎉 Khuyến mãi lớn 2026</span>
            <h1 className="hero-title">Mua sắm thông minh</h1>
            <h2 className="hero-subtitle">Giá cả hợp lý</h2>
            <p className="hero-description">
              Khám phá hàng ngàn sản phẩm chất lượng cao với ưu đãi lên đến 50%. Giao hàng nhanh chóng và miễn phí.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                🛍️ Mua ngay
              </Link>
              <Link to="/products" className="btn btn-secondary">
                Xem ưu đãi →
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-placeholder">Sản phẩm nổi bật</div>
          </div>
        </div>

        {/* New Products Section */}
        <div className="products-section">
          <h2 className="section-title">SẢN PHẨM MỚI</h2>
          <div className="products-container">
            {newprods}
          </div>
        </div>

        {/* Hot Products Section */}
        {this.state.hotprods.length > 0 ? (
          <div className="products-section">
            <h2 className="section-title">SẢN PHẨM HOT</h2>
            <div className="products-container">
              {hotprods}
            </div>
          </div>
        ) : (
          <div />
        )}
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