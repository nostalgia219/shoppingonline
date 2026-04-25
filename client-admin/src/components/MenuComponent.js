import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import { Link, useLocation } from "react-router-dom";
import './MenuComponent.css';

// Wrapper component to inject useLocation hook
function MenuWithLocation() {
  const location = useLocation();
  return <Menu location={location} />;
}

class Menu extends Component {
  static contextType = MyContext;

  render() {
    const currentPath = this.props.location.pathname;
    
    return (
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title-section">
            <h1>Admin <span className="highlight">Page</span></h1>
            <p>Manage your CUE MASTER store</p>
          </div>
        </div>

        <div className="admin-nav">
          <nav className="nav-tabs">
            <Link 
              to="/admin/home" 
              className={`nav-tab ${currentPath === '/admin/home' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/admin/category" 
              className={`nav-tab ${currentPath === '/admin/category' ? 'active' : ''}`}
            >
              Categories
            </Link>
            <Link 
              to="/admin/product" 
              className={`nav-tab ${currentPath === '/admin/product' ? 'active' : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/admin/order" 
              className={`nav-tab ${currentPath === '/admin/order' ? 'active' : ''}`}
            >
              Orders
            </Link>
            <Link 
              to="/admin/customer" 
              className={`nav-tab ${currentPath === '/admin/customer' ? 'active' : ''}`}
            >
              Customers
            </Link>
          </nav>

          <div className="admin-user-info">
            Hello <b>{this.context.username}</b> |{" "}
            <Link to="/admin/home" onClick={() => this.lnkLogoutClick()}>
              Logout
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // event handlers
  lnkLogoutClick() {
    this.context.setToken("");
    this.context.setUsername("");
  }
}

export default MenuWithLocation;
