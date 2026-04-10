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
      cmbCategory: "",
      imgProduct: "",
    };
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
      <div className="detail-section">
        <h3>{isNewProduct ? 'Add New Product' : `Edit Product - ${this.state.txtID}`}</h3>
        <form style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Product Name *</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={this.state.txtName}
                onChange={(e) => this.setState({ txtName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#0f0f0f',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Price *</label>
              <input
                type="number"
                placeholder="Enter price"
                value={this.state.txtPrice}
                onChange={(e) => this.setState({ txtPrice: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#0f0f0f',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Category *</label>
              <select
                value={this.state.cmbCategory}
                onChange={(e) => this.setState({ cmbCategory: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#0f0f0f',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">-- Select Category --</option>
                {cates}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Product Image *</label>
              <input
                type="file"
                name="fileImage"
                accept="image/jpeg, image/png, image/gif"
                onChange={(e) => this.previewImage(e)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#0f0f0f',
                  color: '#999',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Image Preview */}
          {this.state.imgProduct && (
            <div style={{ padding: '16px', backgroundColor: '#0f0f0f', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ marginBottom: '12px', fontSize: '12px', color: '#999' }}>Image Preview</p>
              <img
                src={this.state.imgProduct}
                alt="Product preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '6px',
                  border: '1px solid #444'
                }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {isNewProduct ? (
              <button
                type="submit"
                onClick={(e) => this.btnAddClick(e)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#2d7d4d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                ✚ Add Product
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  onClick={(e) => this.btnUpdateClick(e)}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                >
                  ✏️ Update
                </button>
                <button
                  type="submit"
                  onClick={(e) => this.btnDeleteClick(e)}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    );
  }
  componentDidMount() {
    this.apiGetCategories();
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
          cmbCategory: '',
          imgProduct: '',
        });
      } else {
        // Existing product - populate form
        this.setState({
          txtID: this.props.item._id,
          txtName: this.props.item.name,
          txtPrice: this.props.item.price,
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
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(
      /^data:image\/[a-z]+;base64,/,
      "",
    ); // remove "data:image/...;base64,"
    if (name && price && category && image) {
      const prod = {
        name: name,
        price: price,
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
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(
      /^data:image\/[a-z]+;base64,/,
      "",
    ); // remove "data:image/...;base64,"

    if (id && name && price && category && image) {
      const prod = {
        name: name,
        price: price,
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
      } else {
        alert("Failed to update product!");
      }
    }).catch(err => {
      alert("Error: " + err.message);
    });
  }
}
export default ProductDetail;
