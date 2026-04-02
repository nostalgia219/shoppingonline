import React, { Component } from 'react';
import './TestimonialsComponent.css';

class Testimonials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
    };
  }

  testimonials = [
    {
      id: 1,
      name: 'Michael Thompson',
      role: 'Owner, Elite Billiards Club',
      rating: 5,
      text: 'Outstanding quality and service! We ordered 6 professional tables for our new club. The installation team was meticulous and the tables play perfectly. Our members are thrilled.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Pool Bar Manager',
      rating: 5,
      text: 'The consultation service helped us choose the perfect tables for our venue. Delivery was on time and the 24-month warranty gives us peace of mind. Highly recommended!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: 3,
      name: 'David Rodriguez',
      role: 'Home Enthusiast',
      rating: 5,
      text: "Transformed my basement into a professional billiard room. The custom lighting and premium table exceeded my expectations. It's like having a private club at home!",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
  ];

  nextTestimonial = () => {
    this.setState((prevState) => ({
      currentIndex: (prevState.currentIndex + 1) % this.testimonials.length,
    }));
  };

  prevTestimonial = () => {
    this.setState((prevState) => ({
      currentIndex:
        (prevState.currentIndex - 1 + this.testimonials.length) % this.testimonials.length,
    }));
  };

  setCurrentIndex = (index) => {
    this.setState({ currentIndex: index });
  };

  render() {
    const { currentIndex } = this.state;
    const current = this.testimonials[currentIndex];

    return (
      <section className="testimonials-section">
        <div className="testimonials-bg-decoration">
          <div className="quote-icon">❝</div>
        </div>

        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2 className="testimonials-title">What Our Customers Say</h2>
            <p className="testimonials-subtitle">Join thousands of satisfied customers worldwide</p>
          </div>

          {/* Testimonial Carousel */}
          <div className="testimonials-carousel">
            <div className="testimonial-card">
              {/* Quote Icon */}
              <div className="testimonial-quote-icon">❝</div>

              {/* Rating */}
              <div className="testimonial-rating">
                {[...Array(current.rating)].map((_, i) => (
                  <span key={i} className="star">
                    ★
                  </span>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="testimonial-text">"{current.text}"</p>

              {/* Author */}
              <div className="testimonial-author">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="testimonial-avatar"
                />
                <div className="author-info">
                  <h4 className="author-name">{current.name}</h4>
                  <p className="author-role">{current.role}</p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="testimonials-nav-buttons">
              <button
                onClick={this.prevTestimonial}
                className="nav-button prev-button"
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <button
                onClick={this.nextTestimonial}
                className="nav-button next-button"
                aria-label="Next testimonial"
              >
                ›
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="testimonials-dots">
              {this.testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => this.setCurrentIndex(idx)}
                  className={`dot ${idx === currentIndex ? 'active' : ''}`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Testimonials;
