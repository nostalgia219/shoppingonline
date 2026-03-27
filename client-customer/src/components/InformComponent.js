import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class Inform extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      searchVisible: false,
      userMenuOpen: false,
      searchKeyword: '',
      categories: [],
      categoriesDropdownOpen: false
    };
  }

  render() {
    const cartCount = this.context.mycart.length;
    const isLoggedIn = this.context.token !== '';

    const categoriesList = this.state.categories.map((item) => (
      <Link
        key={item._id}
        to={"/product/category/" + item._id}
        className="dropdown-item"
        onClick={() => this.setState({ categoriesDropdownOpen: false })}
      >
        {item.name}
      </Link>
    ));

    return (
      <>
        {/* Top Header */}
        <header className="header-top">
          <div className="header-container">
            {/* Logo */}
            <div className="header-logo">
              <Link to="/home" className="logo-link">
                <span className="logo-text">Shop</span><span className="logo-accent">Mart</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="header-search">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search products…"
                  className="search-input"
                  value={this.state.searchKeyword}
                  onChange={(e) => this.setState({ searchKeyword: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && this.handleSearch()}
                />
                <button className="search-btn" onClick={() => this.handleSearch()}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <circle cx="8" cy="8" r="6"></circle>
                    <path d="M12 12l5 5"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="header-actions">
              {/* Account */}
              <div className="action-item dropdown">
                <button className="action-btn" onClick={() => this.toggleUserMenu()}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Account</span>
                </button>
                {this.state.userMenuOpen && (
                  <div className="dropdown-menu">
                    {!isLoggedIn ? (
                      <>
                        <Link to="/login" className="dropdown-item">Login</Link>
                        <Link to="/signup" className="dropdown-item">Sign up</Link>
                        <Link to="/active" className="dropdown-item">Activate Account</Link>
                      </>
                    ) : (
                      <>
                        <div className="dropdown-header">Hi, {this.context.customer?.name}</div>
                        <Link to="/myprofile" className="dropdown-item">My Profile</Link>
                        <Link to="/myorders" className="dropdown-item">My Orders</Link>
                        <div className="dropdown-divider"></div>
                        <Link to="/home" className="dropdown-item" onClick={() => this.lnkLogoutClick()}>Logout</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button className="action-btn wishlist-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span className="badge">0</span>
              </button>

              {/* Shopping Cart */}
              <Link to="/mycart" className="action-btn cart-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </header>

        {/* Navigation Menu */}
        <nav className="header-nav">
          <div className="header-container">
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/">Home</Link>
              </li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" onClick={() => this.setState({ categoriesDropdownOpen: !this.state.categoriesDropdownOpen })}>
                  Categories
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" style={{ transform: this.state.categoriesDropdownOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                    <polyline points="6 4 12 10 6 16"></polyline>
                  </svg>
                </button>
                {this.state.categoriesDropdownOpen && (
                  <div className="dropdown-menu nav-dropdown-menu">
                    <div className="dropdown-header">Shop by Category</div>
                    {categoriesList.length > 0 ? categoriesList : <div className="dropdown-item">Loading...</div>}
                  </div>
                )}
              </li>
              <li className="nav-item highlight">
                <Link to="/home">Promotions</Link>
              </li>
              <li className="nav-item">
                <Link to="/home">Blog</Link>
              </li>
              <li className="nav-item">
                <Link to="/home">Contact</Link>
              </li>
            </ul>
          </div>
        </nav>
      </>
    );
  }

  toggleUserMenu() {
    this.setState({ userMenuOpen: !this.state.userMenuOpen });
  }

  handleSearch() {
    if (this.state.searchKeyword.trim()) {
      this.props.navigate('/product/search/' + this.state.searchKeyword);
      this.setState({ searchKeyword: '' });
    }
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
    this.setState({ userMenuOpen: false });
  }

  componentDidMount() {
    this.apiGetCategories();
    // Close dropdowns when clicking outside
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event) {
    const isClickInsideMenu = event.target.closest('.nav-menu');
    const isClickInsideAccount = event.target.closest('.action-item') || event.target.closest('.dropdown-menu');
    
    if (!isClickInsideMenu && !isClickInsideAccount) {
      this.setState({ categoriesDropdownOpen: false });
    }
    if (!isClickInsideAccount) {
      this.setState({ userMenuOpen: false });
    }
  }

  // apis
  apiGetCategories() {
    axios.get("/api/customer/categories").then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    }).catch((err) => {
      console.error("Error fetching categories:", err);
    });
  }
}

export default withRouter(Inform);
