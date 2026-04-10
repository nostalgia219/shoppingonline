import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import './AdminPanel.css';

class Customer extends Component {
    static contextType = MyContext; // using this.context to access global state
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            orders: [],
            order: null,
            searchQuery: ''
        };
    }

    getActiveStatus = (active) => {
        return active === 1 ? 'status-active' : 'status-inactive';
    };

    getActiveLabel = (active) => {
        return active === 1 ? 'Active' : 'Inactive';
    };

    render() {
        const filteredCustomers = this.state.customers.filter(item =>
            item.name.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
            item.username.toLowerCase().includes(this.state.searchQuery.toLowerCase())
        );

        const customers = filteredCustomers.map((item) => {
            return (
                <tr key={item._id} onClick={() => this.trCustomerClick(item)}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{item.username}</td>
                    <td>{new Date(item.cdate).toLocaleDateString()}</td>
                    <td>
                        <span className={`status-badge ${this.getActiveStatus(item.active)}`}>
                            {this.getActiveLabel(item.active)}
                        </span>
                    </td>
                    <td>
                        <div className="action-links">
                            {item.active === 0 ? (
                                <span className="action-link" onClick={(e) => { e.stopPropagation(); this.lnkEmailClick(item); }}>📧 Send Email</span>
                            ) : (
                                <span className="action-link" onClick={(e) => { e.stopPropagation(); this.lnkDeactiveClick(item); }}>❌ Deactivate</span>
                            )}
                        </div>
                    </td>
                </tr>
            );
        });

        if (this.state.order) {
            var items = this.state.order.items.map((item, index) => {
                return (
                    <div key={item.product._id} className="detail-item">
                        <img src={"data:image/jpg;base64," + item.product.image} alt="" className="detail-item-img" />
                        <div className="detail-item-info">
                            <div className="detail-item-name">{item.product.name}</div>
                            <div className="detail-item-qty">Quantity: {item.quantity}x @ ${item.product.price}/each</div>
                        </div>
                        <div style={{ fontWeight: 600 }}>${(item.product.price * item.quantity)?.toFixed(2)}</div>
                    </div>
                );
            });
        }

        return (
            <div className="admin-container">
                <div className="admin-content">
                    {/* Toolbar */}
                    <div className="admin-toolbar">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={this.state.searchQuery}
                                onChange={(e) => this.setState({ searchQuery: e.target.value })}
                            />
                        </div>
                        <div className="toolbar-actions">
                            <button className="filter-btn">🔻 Filter</button>
                            <button className="bulk-export-btn">📥 Export</button>
                        </div>
                    </div>

                    {/* Customers Table */}
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Username</th>
                                    <th>Join Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers}
                            </tbody>
                        </table>
                    </div>

                    {/* Customer Orders */}
                    {this.state.orders.length > 0 && (
                        <div className="detail-section">
                            <h3>Customer Orders</h3>
                            <div className="detail-items">
                                {this.state.orders.map((order) => (
                                    <div key={order._id} style={{ padding: '12px', backgroundColor: '#0f0f0f', borderRadius: '6px', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{order._id}</div>
                                                <div style={{ fontSize: '12px', color: '#999' }}>{new Date(order.cdate).toLocaleDateString()} - ${order.total?.toFixed(2)}</div>
                                            </div>
                                            <span className={`status-badge ${order.status === 'PENDING' ? 'status-pending' : order.status === 'APPROVED' ? 'status-active' : 'status-processing'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Order Details */}
                    {this.state.order && (
                        <div className="detail-section">
                            <h3>Order Details - {this.state.order._id}</h3>
                            <div className="detail-items">
                                {items}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.apiGetCustomers();
    }
    // event-handlers
    trCustomerClick(item) {
        this.setState({ orders: [], order: null });
        this.apiGetOrdersByCustID(item._id);
    }
    trOrderClick(item) {
        this.setState({ order: item });
    }
    lnkDeactiveClick(item) {
        this.apiPutCustomerDeactive(item._id, item.token);
    }
    lnkEmailClick(item) {
        this.apiGetCustomerSendmail(item._id);
    }

    // apis
    apiGetCustomerSendmail(id) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
            const result = res.data;
            alert(result.message);
        });
    }
    apiGetCustomers() {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/customers', config).then((res) => {
            const result = res.data;
            this.setState({ customers: result });
        });
    }
    apiGetOrdersByCustID(cid) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
            const result = res.data;
            this.setState({ orders: result });
        });
    }
    apiPutCustomerDeactive(id, token) {
        const body = { token: token };
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
            const result = res.data;
            if (result) {
                this.apiGetCustomers();
            } else {
                alert('SORRY BABY !');
            }
        });
    }
}
export default Customer;