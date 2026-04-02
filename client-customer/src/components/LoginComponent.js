import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import './LoginComponent.css';

class LoginComponent extends Component {
	static contextType = MyContext;
	
	constructor(props) {
		super(props);
		this.state = {
			username: 'sonkk',
			password: '123',
			remember: false,
			showPassword: false,
			error: '',
			loading: false,
		};
	}

	handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		this.setState({
			[name]: type === 'checkbox' ? checked : value,
			error: '' // Clear error when user starts typing
		});
	};

	togglePasswordVisibility = () => {
		this.setState(prev => ({
			showPassword: !prev.showPassword
		}));
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { username, password } = this.state;

		if (!username || !password) {
			this.setState({ error: 'Please fill in all fields' });
			return;
		}

		this.setState({ loading: true, error: '' });
		this.apiLogin({ username, password });
	};

	apiLogin(account) {
		axios.post('/api/customer/login', account).then(res => {
			const result = res.data;
			if (result.success === true) {
				this.context.setToken(result.token);
				this.context.setCustomer(result.customer);
				this.props.navigate('/home');
			} else {
				this.setState({ 
					error: result.message || 'Login failed. Please try again.',
					loading: false 
				});
			}
		}).catch(err => {
			this.setState({
				error: 'Login failed. Please check your credentials.',
				loading: false
			});
		});
	}

	render() {
		const { username, password, remember, showPassword, error, loading } = this.state;

		return (
			<div className="login-page">
				<div className="login-container">
					{/* Logo Section */}
					<div className="login-header">
						<div className="logo-circle">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<line x1="6" y1="4" x2="6" y2="20" />
								<line x1="6" y1="12" x2="18" y2="12" />
								<circle cx="18" cy="12" r="2" />
							</svg>
						</div>
						<h1>CUE MASTER</h1>
					</div>

					<div className="login-content">
						<h2>Welcome Back</h2>
						<p>Sign in to your account to continue</p>

						{/* Login Form */}
						<div className="login-form-container">
							{error && <div className="error-message">{error}</div>}

							<form onSubmit={this.handleSubmit} className="login-form">
{/* Username Field */}
						<div className="form-group">
							<label htmlFor="username">Username</label>
							<div className="input-wrapper">
								<svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</svg>
								<input
									type="text"
									id="username"
									name="username"
									value={username}
									onChange={this.handleChange}
									placeholder="Enter your username"
											required
											disabled={loading}
										/>
									</div>
								</div>

								{/* Password Field */}
								<div className="form-group">
									<label htmlFor="password">Password</label>
									<div className="input-wrapper">
										<svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
											<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
										</svg>
										<input
											type={showPassword ? 'text' : 'password'}
											id="password"
											name="password"
											value={password}
											onChange={this.handleChange}
											placeholder="Enter your password"
											required
											disabled={loading}
										/>
										<button
											type="button"
											className="toggle-password"
											onClick={this.togglePasswordVisibility}
											tabIndex="-1"
										>
											{showPassword ? (
												<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
													<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
													<line x1="1" y1="1" x2="23" y2="23"></line>
												</svg>
											) : (
												<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
													<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
													<circle cx="12" cy="12" r="3"></circle>
												</svg>
											)}
										</button>
									</div>
								</div>

								{/* Remember & Forgot */}
								<div className="login-options">
									<label className="remember-me">
										<input
											type="checkbox"
											name="remember"
											checked={remember}
											onChange={this.handleChange}
											disabled={loading}
										/>
										<span>Remember me</span>
									</label>
									<Link to="#" className="forgot-password">
										Forgot password?
									</Link>
								</div>

								{/* Submit Button */}
								<button type="submit" className="login-btn" disabled={loading}>
									{loading ? 'Signing in...' : 'Sign In'}
								</button>
							</form>

							{/* Divider */}
							<div className="divider">
								<span>Or continue with</span>
							</div>

							{/* Social Buttons */}
							<div className="social-buttons">
								<button type="button" className="social-btn google-btn">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
										<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
										<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
										<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
									</svg>
									Google
								</button>
								<button type="button" className="social-btn facebook-btn">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
									</svg>
									Facebook
								</button>
							</div>
						</div>

						{/* Sign Up Link */}
						<p className="signup-link">
							Don't have an account?{' '}
							<Link to="/signup">Create one now</Link>
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(LoginComponent);
