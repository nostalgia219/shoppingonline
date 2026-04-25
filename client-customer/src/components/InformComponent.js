import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import './InformComponent.css';

class Inform extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      mobileMenuOpen: false,
      userMenuOpen: false,
      searchKeyword: '',
      categories: [],
      categoriesDropdownOpen: false
    };
  }

  render() {
    const cartCount = this.context.mycart.length;
    const isLoggedIn = this.context.token !== '';
    const menuItems = ['Home', 'Products', 'Cues & Accessories', 'News', 'Contact Us'];

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
      <header className="luxury-header">
        {/* Main Header */}
        <div className="header-main">
          <div className="header-main-content">
            {/* Logo */}
            <Link to="/home" className="header-logo">
              <div className="logo-icon">⟫</div>
              <h1 className="logo-text">CUE MASTER</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="header-nav-desktop">
              {menuItems.map((item, idx) => (
                <div key={idx}>
                  <a
                    href="#"
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (item === 'Home') this.props.navigate('/home');
                      else if (item === 'Products') this.props.navigate('/products');
                    }}
                  >
                    {item}
                  </a>
                  
                  {/* Categories Dropdown Right After Products */}
                  {item === 'Products' && (
                    <div className="nav-dropdown">
                      <button
                        className="nav-link categories-toggle"
                        onClick={() => this.setState({ categoriesDropdownOpen: !this.state.categoriesDropdownOpen })}
                      >
                        Categories
                        <span className="dropdown-arrow">▼</span>
                      </button>
                      {this.state.categoriesDropdownOpen && (
                        <div className="categories-dropdown">
                          {categoriesList}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="header-actions">
              <button className="icon-btn search-btn" onClick={() => this.toggleSearch()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>

              <Link to="/mycart" className="icon-btn cart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>

              <button className="icon-btn user-btn" onClick={() => this.toggleUserMenu()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>

              <button
                className="menu-toggle lg-hidden"
                onClick={() => this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen })}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* User Dropdown */}
            {this.state.userMenuOpen && (
              <div className="user-dropdown">
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
        </div>

        {/* Mobile Menu */}
        {this.state.mobileMenuOpen && (
          <div className="header-mobile-menu">
            <nav className="mobile-nav">
              {menuItems.map((item, idx) => (
                <div key={idx}>
                  <a
                    href="#"
                    className="mobile-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (item === 'Home') this.props.navigate('/home');
                      else if (item === 'Products') this.props.navigate('/products');
                      this.setState({ mobileMenuOpen: false });
                    }}
                  >
                    {item}
                  </a>
                  
                  {/* Mobile Categories Right After Products */}
                  {item === 'Products' && (
                    <div className="mobile-categories">
                      <button
                        className="mobile-nav-link categories-toggle"
                        onClick={() => this.setState({ categoriesDropdownOpen: !this.state.categoriesDropdownOpen })}
                      >
                        Categories
                        <span className="dropdown-arrow">▼</span>
                      </button>
                      {this.state.categoriesDropdownOpen && (
                        <div className="mobile-categories-dropdown">
                          {this.state.categories.map((item) => (
                            <Link
                              key={item._id}
                              to={"/product/category/" + item._id}
                              className="mobile-category-item"
                              onClick={() => {
                                this.setState({ categoriesDropdownOpen: false, mobileMenuOpen: false });
                              }}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* Search Bar */}
        <div className="header-search-bar" id="searchBar">
          <input
            type="text"
            placeholder="Search products…"
            className="search-input"
            value={this.state.searchKeyword}
            onChange={(e) => this.setState({ searchKeyword: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && this.handleSearch()}
          />
          <button className="search-btn" onClick={() => this.handleSearch()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>
      </header>
    );
  }

  toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
      searchBar.style.display = searchBar.style.display === 'none' ? 'flex' : 'none';
      if (searchBar.style.display === 'flex') {
        searchBar.querySelector('.search-input').focus();
      }
    }
  }

  toggleUserMenu() {
    this.setState({ userMenuOpen: !this.state.userMenuOpen });
  }

  handleSearch() {
    if (this.state.searchKeyword.trim()) {
      this.props.navigate('/product/search/' + this.state.searchKeyword);
      this.setState({ searchKeyword: '' });
      document.getElementById('searchBar').style.display = 'none';
    }
  }

  lnkLogoutClick() {
    this.context.logout();
    this.setState({ userMenuOpen: false });
  }

  componentDidMount() {
    this.apiGetCategories();
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event) {
    const isClickInsideHeader = event.target.closest('.luxury-header');
    
    if (!isClickInsideHeader) {
      this.setState({ 
        userMenuOpen: false,
        mobileMenuOpen: false,
        categoriesDropdownOpen: false
      });
      const searchBar = document.getElementById('searchBar');
      if (searchBar) searchBar.style.display = 'none';
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
