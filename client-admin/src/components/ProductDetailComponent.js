import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import './AdminPanel.css';

class ProductDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: "",
      txtName: "",
      txtPrice: 0,
      txtStock: 0,
      txtStatus: "Active",
      txtDescription: "",
      cmbCategory: "",
      imgProduct: "",
    };
  }
  handleCloseModal = () => {
    // Clear the selected item from parent component
    if (this.props.item && this.props.item._id === '') {
      // For new product, we need to clear it from parent
      this.props.onClose && this.props.onClose();
    } else {
      this.props.onClose && this.props.onClose();
    }
  }

  render() {
    const cates = this.state.categories.map((cate) => {
      return (
        <option
          key={cate._id}
          value={cate._id}
          selected={this.state.cmbCategory === cate._id}
        >
          {cate.name}
        </option>
      );
    });

    const isNewProduct = this.props.item && this.props.item._id === '';

    return (
      <div className="modal-overlay" onClick={this.handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{isNewProduct ? 'Add New Product' : 'Edit Product'}</h2>
            <button className="modal-close-btn" onClick={this.handleCloseModal}>✕</button>
          </div>

          <form className="modal-form">
            {/* Product Name and Category */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="modal-input"
                  value={this.state.txtName}
                  onChange={(e) => this.setState({ txtName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category <span className="required">*</span></label>
                <select
                  className="modal-select"
                  value={this.state.cmbCategory}
                  onChange={(e) => this.setState({ cmbCategory: e.target.value })}
                >
                  <option value="">-- Select Category --</option>
                  {cates}
                </select>
              </div>
            </div>

            {/* Price, Stock, and Status */}
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Price ($) <span className="required">*</span></label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="modal-input"
                  value={this.state.txtPrice || 0}
                  onChange={(e) => this.setState({ txtPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity <span className="required">*</span></label>
                <input
                  type="number"
                  placeholder="0"
                  className="modal-input"
                  value={this.state.txtStock || 0}
                  onChange={(e) => this.setState({ txtStock: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status <span className="required">*</span></label>
                <select
                  className="modal-select"
                  value={this.state.txtStatus || 'Active'}
                  onChange={(e) => this.setState({ txtStatus: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Image <span className="required">*</span></label>
              <input
                type="file"
                name="fileImage"
                accept="image/jpeg, image/png, image/gif"
                className="modal-input"
                onChange={(e) => this.previewImage(e)}
              />
            </div>

            {/* Image Preview */}
            {this.state.imgProduct && (
              <div className="image-preview-section">
                <p className="preview-label">Image Preview:</p>
                <img
                  src={this.state.imgProduct}
                  alt="Product preview"
                  className="preview-image"
                />
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                placeholder="Enter product description"
                className="modal-textarea"
                value={this.state.txtDescription}
                onChange={(e) => this.setState({ txtDescription: e.target.value })}
                rows="4"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="modal-buttons">
              <button
                type="button"
                className="modal-btn cancel-btn"
                onClick={this.handleCloseModal}
              >
                Cancel
              </button>
              {isNewProduct ? (
                <button
                  type="submit"
                  className="modal-btn submit-btn"
                  onClick={(e) => this.btnAddClick(e)}
                >
                  ✚ Add Product
                </button>
              ) : (
                <button
                  type="submit"
                  className="modal-btn submit-btn"
                  onClick={(e) => this.btnUpdateClick(e)}
                >
                  📝 Update Product
                </button>
              )}
            </div>

            {/* Delete Button for Existing Products */}
            {!isNewProduct && (
              <button
                type="button"
                className="modal-btn delete-btn full-width"
                onClick={(e) => this.btnDeleteClick(e)}
              >
                🗑️ Delete Product
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.apiGetCategories();
    // Initialize form with current product data on mount
    if (this.props.item) {
      if (this.props.item._id === '') {
        // New product - clear form
        this.setState({
          txtID: '',
          txtName: '',
          txtPrice: 0,
          txtStock: 0,
          txtStatus: 'Active',
          txtDescription: '',
          cmbCategory: '',
          imgProduct: '',
        });
      } else {
        // Existing product - populate form
        this.setState({
          txtID: this.props.item._id,
          txtName: this.props.item.name,
          txtPrice: this.props.item.price,
          txtStock: this.props.item.stock || 0,
          txtStatus: this.props.item.status || 'Active',
          txtDescription: this.props.item.description || '',
          cmbCategory: this.props.item.category._id,
          imgProduct: "data:image/jpg;base64," + this.props.item.image,
        });
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      // Handle new product (empty ID) vs editing existing product
      if (this.props.item._id === '') {
        // New product - clear form
        this.setState({
          txtID: '',
          txtName: '',
          txtPrice: 0,
          txtStock: 0,
          txtStatus: 'Active',
          txtDescription: '',
          cmbCategory: '',
          imgProduct: '',
        });
      } else {
        // Existing product - populate form
        this.setState({
          txtID: this.props.item._id,
          txtName: this.props.item.name,
          txtPrice: this.props.item.price,
          txtStock: this.props.item.stock || 0,
          txtStatus: this.props.item.status || 'Active',
          txtDescription: this.props.item.description || '',
          cmbCategory: this.props.item.category._id,
          imgProduct: "data:image/jpg;base64," + this.props.item.image,
        });
      }
    }
  }
  // event-handlers
  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const stock = parseInt(this.state.txtStock);
    const status = this.state.txtStatus;
    const description = this.state.txtDescription;
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(
      /^data:image\/[a-z]+;base64,/,
      "",
    ); // remove "data:image/...;base64,"
    if (name && price && category && image) {
      const prod = {
        name: name,
        price: price,
        stock: stock,
        status: status,
        description: description,
        category: category,
        image: image,
      };
      this.apiPostProduct(prod);
    } else {
      alert("Please input name and price and category and image");
    }
  }
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const stock = parseInt(this.state.txtStock);
    const status = this.state.txtStatus;
    const description = this.state.txtDescription;
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(
      /^data:image\/[a-z]+;base64,/,
      "",
    ); // remove "data:image/...;base64,"

    if (id && name && price && category && image) {
      const prod = {
        name: name,
        price: price,
        stock: stock,
        status: status,
        description: description,
        category: category,
        image: image,
      };
      this.apiPutProduct(id, prod);
    } else {
      alert("Please input id and name and price and category and image");
    }
  }
  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm("ARE YOU SURE ?")) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
      } else {
        alert("Please input id");
      }
    }
  }
  // apis
  apiGetCategories() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/categories", config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
  apiPostProduct(prod) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.post("/api/admin/products", prod, config).then((res) => {
      const result = res.data;
      if (result && result.success !== false) {
        alert("Product added successfully!");
        this.apiGetProducts();
        this.handleCloseModal();
      } else {
        alert("Failed to add product!");
      }
    }).catch(err => {
      alert("Error: " + err.message);
    });
  }
  apiDeleteProduct(id) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.delete("/api/admin/products/" + id, config).then((res) => {
      const result = res.data;
      if (result && result.success !== false) {
        alert("Product deleted successfully!");
        this.apiGetProducts();
        this.handleCloseModal();
      } else {
        alert("Failed to delete product!");
      }
    }).catch(err => {
      alert("Error: " + err.message);
    });
  }
  apiGetProducts() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios
      .get("/api/admin/products?page=" + this.props.curPage, config)
      .then((res) => {
        const result = res.data;
        if (result.products.length !== 0) {
          this.props.updateProducts(result.products, result.noPages, result.curPage);
        } else {
          axios
            .get("/api/admin/products?page=" + (this.props.curPage - 1), config)
            .then((res) => {
              const result = res.data;
              this.props.updateProducts(result.products, result.noPages, result.curPage);
            });
        }
      });
  }

  apiPutProduct(id, prod) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.put("/api/admin/products/" + id, prod, config).then((res) => {
      const result = res.data;
      if (result && result.success !== false) {
        alert("Product updated successfully!");
        this.apiGetProducts();
        this.handleCloseModal();
      } else {
        alert("Failed to update product!");
      }
    }).catch(err => {
      alert("Error: " + err.message);
    });
  }
}
export default ProductDetail;
