import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
    constructor(props) {
        super(props);
        // Load persisted data from localStorage
        const savedToken = localStorage.getItem('authToken');
        const savedCustomer = localStorage.getItem('customer');
        
        this.state = {
            // variables
            token: savedToken || '',
            customer: savedCustomer ? JSON.parse(savedCustomer) : null,
            mycart: [],
            // functions
            setToken: this.setToken,
            setCustomer: this.setCustomer,
            setMycart: this.setMycart,
            logout: this.logout
        };
    }

    componentDidMount() {
        // Restore authentication state from localStorage on app load
        const savedToken = localStorage.getItem('authToken');
        const savedCustomer = localStorage.getItem('customer');
        
        if (savedToken) {
            this.setState({ 
                token: savedToken,
                customer: savedCustomer ? JSON.parse(savedCustomer) : null
            });
        }
    }

    setMycart = (value) => {
        this.setState({ mycart: value });
    }

    setToken = (value) => {
        this.setState({ token: value });
        if (value) {
            localStorage.setItem('authToken', value);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    setCustomer = (value) => {
        this.setState({ customer: value });
        if (value) {
            localStorage.setItem('customer', JSON.stringify(value));
        } else {
            localStorage.removeItem('customer');
        }
    }

    logout = () => {
        this.setState({ token: '', customer: null, mycart: [] });
        localStorage.removeItem('authToken');
        localStorage.removeItem('customer');
    }

    render() {
        return (
            <MyContext.Provider value={this.state}>
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;
