import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import './MyordersComponent.css';

class Myorders extends Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            selectedOrder: null,
            filterStatus: 'all'
        };
    }

    getStatusBadgeClass = (status) => {
        const statusMap = {
            'pending': 'status-pending',
            'processing': 'status-processing',
            'shipped': 'status-shipped',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return statusMap[status?.toLowerCase()] || 'status-pending';
    };

    getStatusLabel = (status) => {
        const labels = {
            'pending': 'Pending',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };
        return labels[status?.toLowerCase()] || status;
    };

    render() {
        if (this.context.token === '') return (<Navigate replace to='/login' />);

        const filteredOrders = this.state.filterStatus === 'all'
            ? this.state.orders
            : this.state.orders.filter(order => order.status?.toLowerCase() === this.state.filterStatus);

        return (
            <div className="orders-page">
                {/* Breadcrumb */}
                <div className="breadcrumb-section">
                    <div className="breadcrumb-content">
                        <a href="/home" className="breadcrumb-link">Home</a>
                        <span>/</span>
                        <span className="breadcrumb-current">My Orders</span>
                    </div>
                </div>

                <div className="orders-container">
                    {/* Page Header */}
                    <div className="page-header">
                        <h1>My Orders</h1>
                        <p>Track and manage your order history</p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${this.state.filterStatus === 'all' ? 'active' : ''}`}
                            onClick={() => this.setState({ filterStatus: 'all' })}
                        >
                            All Orders
                        </button>
                        <button
                            className={`filter-btn ${this.state.filterStatus === 'processing' ? 'active' : ''}`}
                            onClick={() => this.setState({ filterStatus: 'processing' })}
                        >
                            Processing
                        </button>
                        <button
                            className={`filter-btn ${this.state.filterStatus === 'shipped' ? 'active' : ''}`}
                            onClick={() => this.setState({ filterStatus: 'shipped' })}
                        >
                            Shipped
                        </button>
                        <button
                            className={`filter-btn ${this.state.filterStatus === 'delivered' ? 'active' : ''}`}
                            onClick={() => this.setState({ filterStatus: 'delivered' })}
                        >
                            Delivered
                        </button>
                        <button
                            className={`filter-btn ${this.state.filterStatus === 'cancelled' ? 'active' : ''}`}
                            onClick={() => this.setState({ filterStatus: 'cancelled' })}
                        >
                            Cancelled
                        </button>
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <div className="empty-orders">
                            <p>No orders found with this status</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {filteredOrders.map((order) => (
                                <div key={order._id} className="order-card">
                                    {/* Order Header */}
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h3 className="order-id">{order._id}</h3>
                                            <div className="order-meta">
                                                <span className="meta-item">
                                                    📅 {new Date(order.cdate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span className="meta-item">
                                                    💰 ${order.total?.toFixed(2) || '0.00'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="order-status-section">
                                            <span className={`status-badge ${this.getStatusBadgeClass(order.status)}`}>
                                                {this.getStatusLabel(order.status)}
                                            </span>
                                            <button
                                                className="eye-btn"
                                                onClick={() => this.toggleOrderDetails(order._id)}
                                                title="View details"
                                            >
                                                👁️
                                            </button>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="items-preview">
                                        <div className="items-grid">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="item-thumbnail">
                                                    <img
                                                        src={"data:image/jpg;base64," + item.product.image}
                                                        alt={item.product.name}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="items-count">
                                            {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {this.state.selectedOrder === order._id && (
                                        <div className="order-details">
                                            {/* Order Items Detail */}
                                            <div className="details-section">
                                                <h4>Order Items</h4>
                                                <div className="items-detail">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="item-detail-row">
                                                            <img
                                                                src={"data:image/jpg;base64," + item.product.image}
                                                                alt={item.product.name}
                                                            />
                                                            <div className="item-info">
                                                                <p className="item-name">{item.product.name}</p>
                                                                <p className="item-qty">Quantity: {item.quantity}x</p>
                                                            </div>
                                                            <div className="item-price">
                                                                ${(item.product.price * item.quantity)?.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Order Summary */}
                                            <div className="details-section">
                                                <h4>Order Summary</h4>
                                                <div className="summary-info">
                                                    <div className="summary-row">
                                                        <span>Subtotal</span>
                                                        <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                                                    </div>
                                                    <div className="summary-row">
                                                        <span>Shipping</span>
                                                        <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping?.toFixed(2)}`}</span>
                                                    </div>
                                                    <div className="summary-row">
                                                        <span>Tax</span>
                                                        <span>${order.tax?.toFixed(2) || '0.00'}</span>
                                                    </div>
                                                    <div className="summary-row total">
                                                        <span>Total</span>
                                                        <span>${order.total?.toFixed(2) || '0.00'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tracking Info */}
                                            {order.trackingNumber && (
                                                <div className="details-section">
                                                    <h4>Tracking Information</h4>
                                                    <p className="tracking-number">
                                                        <strong>Tracking #:</strong> {order.trackingNumber}
                                                    </p>
                                                    {order.estimatedDelivery && (
                                                        <p className="delivery-date">
                                                            <strong>Expected Delivery:</strong> {order.estimatedDelivery}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="action-buttons">
                                                {order.status?.toLowerCase() === 'delivered' && (
                                                    <button className="action-btn buy-again">
                                                        🔄 Buy Again
                                                    </button>
                                                )}
                                                {order.trackingNumber && (
                                                    <button className="action-btn track">
                                                        📦 Track Package
                                                    </button>
                                                )}
                                                <button className="action-btn download">
                                                    📥 Download Invoice
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    toggleOrderDetails = (orderId) => {
        this.setState({
            selectedOrder: this.state.selectedOrder === orderId ? null : orderId
        });
    };

    componentDidMount() {
        if (this.context.customer) {
            const cid = this.context.customer._id;
            this.apiGetOrdersByCustID(cid);
        }
    }

    apiGetOrdersByCustID(cid) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
            const result = res.data;
            this.setState({ orders: result });
        }).catch(err => {
            console.error('Error fetching orders:', err);
        });
    }
}

export default Myorders;