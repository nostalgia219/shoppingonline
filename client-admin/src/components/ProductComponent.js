import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';
import './AdminPanel.css';

class Product extends Component {
  static contextType = MyContext; 
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null,
      searchQuery: ''
    };
  }

  getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'status-pending';
    return 'status-active';
  };

  getStockLabel = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return `Low (${stock})`;
    return 'Active';
  };

  render() {
    const filteredProducts = this.state.products.filter(item =>
      item.name.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
      item._id.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    );

    const prods = filteredProducts.map((item) => {
      return (
        <tr key={item._id} onClick={() => this.trItemClick(item)}>
          <td>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={"data:image/jpg;base64," + item.image} alt="" className="product-img" />
              <span>{item.name}</span>
            </div>
          </td>
          <td>{item.category.name}</td>
          <td>${item.price?.toFixed(2)}</td>
          <td>{item.stock || 0}</td>
          <td>{new Date(item.cdate).toLocaleDateString()}</td>
          <td>
            <span className={`status-badge ${this.getStockStatus(item.stock)}`}>
              {this.getStockLabel(item.stock)}
            </span>
          </td>
          <td>
            <div className="action-links">
              <span className="action-link" onClick={(e) => { e.stopPropagation(); this.trItemClick(item); }}>✏️ Edit</span>
              <span className="action-link">🗑️ Delete</span>
            </div>
          </td>
        </tr>
      );
    });

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      if ((index + 1) === this.state.curPage) {
        return (<button key={index} className="pagination-btn active" disabled>{index + 1}</button>);
      } else {
        return (<button key={index} className="pagination-btn" onClick={() => this.lnkPageClick(index + 1)}>{index + 1}</button>);
      }
    });

    return (
      <div className="admin-container">
        <div className="admin-content">
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={this.state.searchQuery}
                onChange={(e) => this.setState({ searchQuery: e.target.value })}
              />
            </div>
            <div className="toolbar-actions">
              <button className="filter-btn">🔻 Filter</button>
              <button className="add-btn" onClick={() => this.handleAddProduct()}>✚ Add Product</button>
            </div>
          </div>

          {/* Products Table */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Added</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prods}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {this.state.noPages > 1 && (
            <div className="pagination">
              {pagination}
            </div>
          )}

          {/* Product Details Editor */}
          {this.state.itemSelected && (
            <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} />
          )}
        </div>
      </div>
    );
  }
  updateProducts = (products, noPages, curPage) => { // arrow-function
    this.setState({ products: products, noPages: noPages, curPage: curPage });
  }
  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }
  // event-handlers
  lnkPageClick(index) {
    this.apiGetProducts(index);
  }
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  handleAddProduct = () => {
    // Create a new empty product object for adding new product
    const newProduct = {
      _id: '',
      name: '',
      price: 0,
      category: { _id: '', name: '' },
      image: '',
      stock: 0,
      cdate: new Date()
    };
    this.setState({ itemSelected: newProduct });
  }
  // apis
  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({ products: result.products, noPages: result.noPages, curPage: result.curPage });
    });
  }
}
export default Product;