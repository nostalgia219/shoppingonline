import React, { Component } from 'react';
import './BlogComponent.css';

const articles = [
  {
    id: 1,
    title: 'Complete Guide to Choosing the Perfect Billiard Cue',
    excerpt: 'Learn the essential factors to consider when selecting a professional cue stick that matches your playing style and skill level.',
    image: 'https://images.unsplash.com/photo-1761012322191-67444d1133d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBiaWxsaWFyZCUyMGN1ZSUyMHN0aWNrfGVufDF8fHx8MTc3NDYxMDM5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    date: 'March 15, 2026',
    category: 'Buying Guide',
  },
  {
    id: 2,
    title: 'How to Maintain Your Billiard Table for Longevity',
    excerpt: 'Expert tips and best practices for keeping your billiard table in pristine condition for decades of enjoyment.',
    image: 'https://images.unsplash.com/photo-1574340082901-eccc3a3398bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiaWxsaWFyZHMlMjBwb29sJTIwdGFibGUlMjBkYXJrfGVufDF8fHx8MTc3NDYxMDM5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    date: 'March 10, 2026',
    category: 'Maintenance',
  },
  {
    id: 3,
    title: 'Understanding Professional Billiard Rules & Techniques',
    excerpt: 'Master the official rules of pool, snooker, and carom billiards with our comprehensive guide for players of all levels.',
    image: 'https://images.unsplash.com/photo-1618454422033-f902cbdba2e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb29sJTIwcGxheWVyfGVufDF8fHx8MTc3NDYxMDM5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    date: 'March 5, 2026',
    category: 'Rules & Tips',
  },
];

class Blog extends Component {
  render() {
    return (
      <section className="blog-section">
        <div className="blog-container">
          <div className="blog-header">
            <h2 className="blog-title">Billiard News & Guides</h2>
            <p className="blog-subtitle">Stay informed with the latest tips, tricks, and industry insights</p>
          </div>

          <div className="blog-grid">
            {articles.map((article, idx) => (
              <article key={article.id} className="blog-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                {/* Image */}
                <div className="blog-image-wrapper">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="blog-image"
                    loading="lazy"
                  />
                  <div className="blog-overlay"></div>
                  <span className="blog-category">{article.category}</span>
                </div>

                {/* Content */}
                <div className="blog-content">
                  <div className="blog-date">📅 {article.date}</div>

                  <h3 className="blog-article-title">{article.title}</h3>

                  <p className="blog-excerpt">{article.excerpt}</p>

                  <button className="blog-read-more">
                    <span>Read More</span>
                    <span className="arrow">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="blog-footer-btn">
            <button className="blog-view-all">View All Articles</button>
          </div>
        </div>
      </section>
    );
  }
}

export default Blog;
