import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import './SignupComponent.css';

class SignupComponent extends Component {
	static contextType = MyContext;
	
	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			password: '',
			confirmPassword: '',
			agreeToTerms: false,
			newsletter: false,
			showPassword: false,
			showConfirmPassword: false,
			error: '',
			loading: false,
			errors: {}
		};
	}

	handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		this.setState({
			[name]: type === 'checkbox' ? checked : value,
			error: '',
			errors: {}
		});
	};

	togglePasswordVisibility = (field) => {
		if (field === 'password') {
			this.setState(prev => ({
				showPassword: !prev.showPassword
			}));
		} else {
			this.setState(prev => ({
				showConfirmPassword: !prev.showConfirmPassword
			}));
		}
	};

	validateForm = () => {
		const { firstName, email, password, confirmPassword, agreeToTerms } = this.state;
		const newErrors = {};

		if (!firstName.trim()) {
			newErrors.firstName = 'First name is required';
		}

		if (!email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Please enter a valid email';
		}

		if (!password) {
			newErrors.password = 'Password is required';
		} else if (password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
		}

		if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		if (!agreeToTerms) {
			newErrors.agreeToTerms = 'You must agree to the terms and conditions';
		}

		this.setState({ errors: newErrors });
		return Object.keys(newErrors).length === 0;
	};

	handleSubmit = (e) => {
		e.preventDefault();

		if (!this.validateForm()) {
			return;
		}

		const { firstName, lastName, email, phone, password } = this.state;
		this.setState({ loading: true, error: '' });

		const account = {
			name: `${firstName} ${lastName}`.trim(),
			email,
			phone,
			password,
			username: email // Using email as username
		};

		this.apiSignup(account);
	};

	apiSignup(account) {
		axios.post('/api/customer/signup', account)
			.then(res => {
				const result = res.data;
				if (result.success) {
					// Auto-login after successful signup
					this.apiLogin({ username: account.email, password: account.password });
				} else {
					this.setState({
						error: result.message || 'Signup failed. Please try again.',
						loading: false
					});
				}
			})
			.catch(err => {
				this.setState({
					error: err.response?.data?.message || 'Signup failed. Please try again.',
					loading: false
				});
			});
	}

	apiLogin(account) {
		axios.post('/api/customer/login', account)
			.then(res => {
				const result = res.data;
				if (result.success) {
					this.context.setToken(result.token);
					this.context.setCustomer(result.customer);
					this.props.navigate('/home');
				}
			})
			.catch(err => {
				console.error('Auto-login failed:', err);
				this.props.navigate('/login');
			});
	}

	render() {
		const {
			firstName, lastName, email, phone, password, confirmPassword,
			agreeToTerms, newsletter, showPassword, showConfirmPassword,
			error, loading, errors
		} = this.state;

		return (
			<div className="signup-page">
				<div className="signup-container">
					{/* Logo Section */}
					<div className="signup-header">
						<div className="logo-circle">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<line x1="6" y1="4" x2="6" y2="20" />
								<line x1="6" y1="12" x2="18" y2="12" />
								<circle cx="18" cy="12" r="2" />
							</svg>
						</div>
						<h1>CUE MASTER</h1>
					</div>

					<div className="signup-content">
						<h2>Create Your Account</h2>
						<p>Join the elite community of billiards enthusiasts</p>

						{/* Signup Form */}
						<div className="signup-form-container">
							{error && <div className="error-message">{error}</div>}

							<form onSubmit={this.handleSubmit} className="signup-form">
								{/* Name Fields */}
								<div className="form-row">
									<div className="form-group">
										<label htmlFor="firstName">First Name *</label>
										<div className="input-wrapper">
											<svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
												<circle cx="12" cy="7" r="4"></circle>
											</svg>
											<input
												type="text"
												id="firstName"
												name="firstName"
												value={firstName}
												onChange={this.handleChange}
												placeholder="John"
												disabled={loading}
												className={errors.firstName ? 'error' : ''}
											/>
										</div>
										{errors.firstName && <span className="error-text">{errors.firstName}</span>}
									</div>

									<div className="form-group">
										<label htmlFor="lastName">Last Name</label>
										<div className="input-wrapper">
											<svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
												<circle cx="12" cy="7" r="4"></circle>
											</svg>
											<input
												type="text"
												id="lastName"
												name="lastName"
												value={lastName}
												onChange={this.handleChange}
												placeholder="Doe"
												disabled={loading}
											/>
										</div>
									</div>
								</div>

								{/* Email Field */}
								<div className="form-group">
									<label htmlFor="email">Email Address *</label>
									<div className="input-wrapper">
										<svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
											<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
										</svg>
										<input
											type="email"
											id="email"
											name="email"
											value={email}
											onChange={this.handleChange}
											placeholder="your.email@example.com"
											disabled={loading}
											className={errors.email ? 'error' : ''}
										/>
									</div>
									{errors.email && <span className="error-text">{errors.email}</span>}
								</div>

								{/* Phone Field */}
								<div className="form-group">
									<label htmlFor="phone">Phone Number (Optional)</label>
									<div className="input-wrapper">
										<svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
										</svg>
										<input
											type="tel"
											id="phone"
											name="phone"
											value={phone}
											onChange={this.handleChange}
											placeholder="+1 (555) 123-4567"
											disabled={loading}
										/>
									</div>
								</div>

								{/* Password Fields */}
								<div className="form-row">
									<div className="form-group">
										<label htmlFor="password">Password *</label>
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
												placeholder="Min. 6 characters"
												disabled={loading}
												className={errors.password ? 'error' : ''}
											/>
											<button
												type="button"
												className="toggle-password"
												onClick={() => this.togglePasswordVisibility('password')}
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
										{errors.password && <span className="error-text">{errors.password}</span>}
									</div>

									<div className="form-group">
										<label htmlFor="confirmPassword">Confirm Password *</label>
										<div className="input-wrapper">
											<svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
												<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
											</svg>
											<input
												type={showConfirmPassword ? 'text' : 'password'}
												id="confirmPassword"
												name="confirmPassword"
												value={confirmPassword}
												onChange={this.handleChange}
												placeholder="Re-enter password"
												disabled={loading}
												className={errors.confirmPassword ? 'error' : ''}
											/>
											<button
												type="button"
												className="toggle-password"
												onClick={() => this.togglePasswordVisibility('confirm')}
												tabIndex="-1"
											>
												{showConfirmPassword ? (
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
										{errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
									</div>
								</div>

								{/* Terms & Newsletter */}
								<div className="form-checkboxes">
									<label className="checkbox-label">
										<input
											type="checkbox"
											name="agreeToTerms"
											checked={agreeToTerms}
											onChange={this.handleChange}
											disabled={loading}
										/>
										<span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
									</label>
									{errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}

									<label className="checkbox-label">
										<input
											type="checkbox"
											name="newsletter"
											checked={newsletter}
											onChange={this.handleChange}
											disabled={loading}
										/>
										<span>Send me exclusive offers, product updates, and billiards tips</span>
									</label>
								</div>

								{/* Submit Button */}
								<button type="submit" className="signup-btn" disabled={loading}>
									{loading ? 'Creating Account...' : 'Create Account'}
								</button>
							</form>

							{/* Divider */}
							<div className="divider">
								<span>Or sign up with</span>
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

						{/* Login Link */}
						<p className="login-link">
							Already have an account?{' '}
							<Link to="/login">Sign in here</Link>
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(SignupComponent);
