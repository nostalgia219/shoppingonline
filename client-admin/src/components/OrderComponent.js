import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import './AdminPanel.css';

class Order extends Component {
    static contextType = MyContext; // using this.context to access global state
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            order: null,
            searchQuery: ''
        };
    }

    getStatusClass = (status) => {
        const statusMap = {
            'PENDING': 'status-pending',
            'PROCESSING': 'status-processing',
            'SHIPPED': 'status-shipped',
            'DELIVERED': 'status-delivered',
            'CANCELLED': 'status-cancelled'
        };
        return statusMap[status] || 'status-pending';
    };

    render() {
        const filteredOrders = this.state.orders.filter(item =>
            item._id.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
            item.customer.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
        );

        const orders = filteredOrders.map((item) => {
            return (
                <tr key={item._id} onClick={() => this.trItemClick(item)}>
                    <td>{item._id}</td>
                    <td>{item.customer.name}</td>
                    <td>{new Date(item.cdate).toLocaleDateString()}</td>
                    <td>{item.items?.length || 0}</td>
                    <td>${item.total?.toFixed(2)}</td>
                    <td>
                        <span className={`status-badge ${this.getStatusClass(item.status)}`}>
                            {item.status}
                        </span>
                    </td>
                    <td>
                        <div className="action-links">
                            {item.status === 'PENDING' ? (
                                <>
                                    <span className="action-link" onClick={(e) => { e.stopPropagation(); this.lnkApproveClick(item._id); }}>APPROVE</span>
                                    <span> | </span>
                                    <span className="action-link" onClick={(e) => { e.stopPropagation(); this.lnkCancelClick(item._id); }}>CANCEL</span>
                                </>
                            ) : (
                                <span className="action-link">—</span>
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
                                placeholder="Search orders..."
                                value={this.state.searchQuery}
                                onChange={(e) => this.setState({ searchQuery: e.target.value })}
                            />
                        </div>
                        <div className="toolbar-actions">
                            <button className="filter-btn">🔻 Filter</button>
                            <button className="bulk-export-btn">📥 Export</button>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders}
                            </tbody>
                        </table>
                    </div>

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
        this.apiGetOrders();
    }
    // event - handlers
    lnkApproveClick(id) {
        this.apiPutOrderStatus(id, 'APPROVED');
    }
    lnkCancelClick(id) {
        this.apiPutOrderStatus(id, 'CANCELED');
    }
    trItemClick(item) {
        this.setState({ order: item });
    }
    //
    // apis
    apiGetOrders() {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/orders', config).then((res) => {
            const result = res.data;
            this.setState({ orders: result });
        });
    }

    apiPutOrderStatus(id, status) {
        const body = { status: status };
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
            const result = res.data;
            if (result) {
                this.apiGetOrders();
            } else {
                alert('Error');
            }
        });
    }
}
export default Order;
