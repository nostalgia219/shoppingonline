import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from '../utils/withRouter';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      productsDropdownOpen: false
    };
  }

  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <Link
          key={item._id}
          to={"/product/category/" + item._id}
          className="dropdown-item"
          onClick={() => this.setState({ productsDropdownOpen: false })}
        >
          {item.name}
        </Link>
      );
    });

    return (
      <div className="menu-secondary">
        <div className="menu-container">
          {/* Categories Dropdown Products */}
          {this.state.productsDropdownOpen && (
            <div className="categories-dropdown">
              <div className="dropdown-header">Shop by Category</div>
              {cates.length > 0 ? (
                cates
              ) : (
                <div className="dropdown-item">Loading...</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event) {
    if (!event.target.closest('.products-dropdown-container')) {
      this.setState({ productsDropdownOpen: false });
    }
  }

  // apis
  apiGetCategories() {
    axios.get("/api/customer/categories").then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}

export default withRouter(Menu);

