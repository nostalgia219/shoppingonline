import React, { Component } from 'react';
import { CheckCircle, Truck, Shield, Headphones } from 'lucide-react';

const strengths = [
  {
    icon: CheckCircle,
    title: '100% Authentic Products',
    description: 'Certified & Verified',
  },
  {
    icon: Truck,
    title: 'Delivery & Installation',
    description: 'Professional On-Site Service',
  },
  {
    icon: Shield,
    title: '24-Month Warranty',
    description: 'Full Coverage Guarantee',
  },
  {
    icon: Headphones,
    title: '24/7 Technical Support',
    description: 'Expert Assistance Anytime',
  },
];

class BrandStrengths extends Component {
  render() {
    return (
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.headerContainer}>
            <h2 style={styles.title}>Why Choose Cue Master</h2>
            <p style={styles.subtitle}>
              Trusted by professionals and enthusiasts worldwide
            </p>
          </div>

          <div style={styles.grid}>
            {strengths.map((strength, idx) => {
              const Icon = strength.icon;
              return (
                <div
                  key={idx}
                  style={styles.strengthCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={styles.iconContainer}>
                    <Icon style={styles.icon} />
                  </div>
                  <h3 style={styles.strengthTitle}>{strength.title}</h3>
                  <p style={styles.strengthDescription}>{strength.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}

const styles = {
  section: {
    paddingTop: '80px',
    paddingBottom: '80px',
    paddingLeft: '24px',
    paddingRight: '24px',
    backgroundColor: '#1a1a1a',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: '64px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '300',
    marginBottom: '16px',
    color: '#ffffff',
    fontFamily: 'Georgia, serif',
  },
  subtitle: {
    fontSize: '18px',
    color: '#9ca3af',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
  },
  strengthCard: {
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    marginBottom: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(184, 134, 11, 0.1)',
    border: '2px solid #b8860b',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  icon: {
    width: '40px',
    height: '40px',
    color: '#b8860b',
  },
  strengthTitle: {
    fontSize: '20px',
    marginBottom: '8px',
    color: '#ffffff',
    fontFamily: 'Georgia, serif',
  },
  strengthDescription: {
    fontSize: '14px',
    color: '#9ca3af',
  },
};

export default BrandStrengths;
