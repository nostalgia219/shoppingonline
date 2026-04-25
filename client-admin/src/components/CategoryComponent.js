import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import './CategoryComponent.css';

class Category extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      searchQuery: '',
      showAddModal: false,
      newCategoryName: '',
      newCategoryDescription: '',
      showEditModal: false,
      editingCategory: null,
      editCategoryName: '',
      editCategoryDescription: '',
      editCategoryStatus: 'Active'
    };
  }

  render() {
    const filteredCategories = this.getFilteredCategories();

    return (
      <div className="categories-page">
        <div className="categories-header">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search categories..."
              value={this.state.searchQuery}
              onChange={(e) => this.handleSearch(e)}
            />
          </div>
          <button className="add-category-btn" onClick={() => this.setState({ showAddModal: true })}>
            <span>+</span> Add Category
          </button>
        </div>

        <div className="categories-grid">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category._id} className="category-card">
                <div className="card-header">
                  <div className="category-icon">📋</div>
                  <div className="card-header-right">
                    <h3 className="category-title">{category.name}</h3>
                    <span className={`status-badge ${category.status === 'active' ? 'active' : 'inactive'}`}>
                      {category.status || 'Active'}
                    </span>
                  </div>
                </div>

                <p className="category-description">{category.description || 'No description'}</p>

                <div className="card-stats">
                  <div className="stat-row">
                    <span className="stat-label">Products</span>
                    <span className="stat-value">{category.productCount || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Created</span>
                    <span className="stat-value">{this.formatDate(category.createdAt)}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="action-btn" onClick={() => this.handleEdit(category)}>
                    ✎ Edit
                  </button>
                  <button className="action-btn delete-btn" onClick={() => this.handleDelete(category._id)}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No categories found</div>
          )}
        </div>

        {this.state.showAddModal && (
          <div className="modal-overlay" onClick={() => this.setState({ showAddModal: false })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Add New Category</h2>
                <button 
                  className="modal-close-btn"
                  onClick={() => this.setState({ showAddModal: false })}
                >
                  ✕
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Category Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Enter category name"
                  value={this.state.newCategoryName}
                  onChange={(e) => this.setState({ newCategoryName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="modal-textarea"
                  placeholder="Enter category description"
                  value={this.state.newCategoryDescription}
                  onChange={(e) => this.setState({ newCategoryDescription: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="modal-select">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button
                  className="modal-btn cancel"
                  onClick={() => this.setState({ showAddModal: false, newCategoryName: '', newCategoryDescription: '' })}
                >
                  Cancel
                </button>
                <button className="modal-btn submit" onClick={() => this.addCategory()}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.showEditModal && (
          <div className="modal-overlay" onClick={() => this.setState({ showEditModal: false })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Edit Category</h2>
                <button 
                  className="modal-close-btn"
                  onClick={() => this.setState({ showEditModal: false })}
                >
                  ✕
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Category Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Enter category name"
                  value={this.state.editCategoryName}
                  onChange={(e) => this.setState({ editCategoryName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="modal-textarea"
                  placeholder="Enter category description"
                  value={this.state.editCategoryDescription}
                  onChange={(e) => this.setState({ editCategoryDescription: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="modal-select"
                  value={this.state.editCategoryStatus}
                  onChange={(e) => this.setState({ editCategoryStatus: e.target.value })}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button
                  className="modal-btn cancel"
                  onClick={() => this.setState({ showEditModal: false, editingCategory: null })}
                >
                  Cancel
                </button>
                <button className="modal-btn submit" onClick={() => this.updateCategory()}>
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  // Utility methods
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  getFilteredCategories() {
    return this.state.categories.filter((category) =>
      category.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    );
  }

  handleSearch(e) {
    this.setState({ searchQuery: e.target.value });
  }

  handleEdit(category) {
    this.setState({
      showEditModal: true,
      editingCategory: category,
      editCategoryName: category.name,
      editCategoryDescription: category.description || '',
      editCategoryStatus: category.status || 'Active'
    });
  }

  handleDelete(categoryId) {
    if (window.confirm('Are you sure you want to delete this category?')) {
      this.apiDeleteCategory(categoryId);
    }
  }

  addCategory() {
    const { newCategoryName, newCategoryDescription } = this.state;
    if (newCategoryName.trim()) {
      const newCategory = {
        name: newCategoryName,
        description: newCategoryDescription
      };
      this.apiPostCategory(newCategory);
    } else {
      alert('Please enter a category name');
    }
  }

  updateCategory() {
    const { editingCategory, editCategoryName, editCategoryDescription, editCategoryStatus } = this.state;
    if (editCategoryName.trim()) {
      const updatedCategory = {
        name: editCategoryName,
        description: editCategoryDescription,
        status: editCategoryStatus
      };
      this.apiPutCategory(editingCategory._id, updatedCategory);
    } else {
      alert('Please enter a category name');
    }
  }

  // API methods
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  apiPostCategory(category) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', category, config).then((res) => {
      if (res.data) {
        alert('Category added successfully!');
        this.setState({
          showAddModal: false,
          newCategoryName: '',
          newCategoryDescription: ''
        });
        this.apiGetCategories();
      }
    }).catch(() => {
      alert('Error adding category');
    });
  }

  apiPutCategory(categoryId, category) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/categories/${categoryId}`, category, config).then((res) => {
      if (res.data) {
        alert('Category updated successfully!');
        this.setState({
          showEditModal: false,
          editingCategory: null,
          editCategoryName: '',
          editCategoryDescription: '',
          editCategoryStatus: 'Active'
        });
        this.apiGetCategories();
      }
    }).catch(() => {
      alert('Error updating category');
    });
  }

  apiDeleteCategory(categoryId) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete(`/api/admin/categories/${categoryId}`, config).then((res) => {
      if (res.data) {
        alert('Category deleted successfully!');
        this.apiGetCategories();
      }
    }).catch(() => {
      alert('Error deleting category');
    });
  }
}

export default Category;