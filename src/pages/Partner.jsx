import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';
import '../styles/partners.css';

export default function Partner() {
  const [partners, setPartners] = useState([]);

  // Scroll animation refs
  const heroRef = useScrollAnimation({ threshold: 0.2 });
  const partnersGridRef = useStaggerAnimation({ delay: 100, threshold: 0.2 });
  const benefitsRef = useStaggerAnimation({ delay: 120, threshold: 0.2 });
  const ctaRef = useScrollAnimation({ threshold: 0.2 });

  // Default partners data
  const defaultPartners = [
    {
      _id: 'partner-1',
      title: 'Tech Innovators Inc',
      body: 'Leading technology solutions provider',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-2',
      title: 'Digital Solutions Co',
      body: 'Innovative software development',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-3',
      title: 'Global Manufacturing',
      body: 'Manufacturing excellence',
      image:
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-4',
      title: 'Telecom Solutions',
      body: 'Telecommunications leader',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-5',
      title: 'Logistics Partners',
      body: 'Global logistics solutions',
      image:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-6',
      title: 'Cloud Services Ltd',
      body: 'Cloud infrastructure provider',
      image:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-7',
      title: 'AI Systems Corp',
      body: 'AI and machine learning',
      image:
        'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-8',
      title: 'CyberSec Solutions',
      body: 'Cybersecurity solutions',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-9',
      title: 'Energy Systems',
      body: 'Energy and utilities',
      image:
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-10',
      title: 'HealthTech Group',
      body: 'Healthcare technology',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-11',
      title: 'Business Consulting',
      body: 'Consulting and advisory',
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop&q=80',
    },
    {
      _id: 'partner-12',
      title: 'Training Academy',
      body: 'Training and development',
      image:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop&q=80',
    },
  ];

  useEffect(() => {
    let mounted = true;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const normalize = item => {
      if (!item) return item;
      const raw = item.mediaUrl || item.image || '';
      const final = raw && !/^https?:\/\//i.test(raw) ? `${API_URL}${raw}` : raw;
      return Object.assign({}, item, { resolvedMediaUrl: final });
    };

    (async () => {
      try {
        const { fetchContent } = await import('../api/contentApi');
        const all = await fetchContent();
        if (!mounted) return;

        const normalizedSection = s => (s || '').toString().trim().toLowerCase();
        const partnersList = all
          .filter(c => normalizedSection(c.section) === 'partners-list')
          .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

        if (partnersList.length > 0) {
          setPartners(partnersList.map(normalize));
        } else {
          setPartners(defaultPartners.map(normalize));
        }
      } catch (err) {
        console.warn('Failed to load partners:', err);
        setPartners(defaultPartners.map(normalize));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="partners-main">
      {/* Hero Section */}
      <section className="section partners-hero">
        <div className="container">
          <div className="hero-content animate-top" ref={heroRef}>
            <div className="kicker">Our Partners</div>
            <h1 className="h1">Our Trusted Partners</h1>
            <p className="lead">
              Building strong relationships with industry leaders to deliver exceptional value and
              innovative solutions to our clients worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section soft">
        <div className="container">
          <h2 className="h2">Why Partner With Us</h2>
          <div className="benefits-grid" ref={benefitsRef}>
            <div className="benefit-card" data-stagger-child>
              <div className="benefit-icon">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3>Global Reach</h3>
              <p>
                Access our extensive international network and expand your market presence across
                multiple regions and industries.
              </p>
            </div>

            <div className="benefit-card" data-stagger-child>
              <div className="benefit-icon">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <h3>Innovation Support</h3>
              <p>
                Collaborate on cutting-edge technology solutions and stay ahead of market trends
                with our innovation programs.
              </p>
            </div>

            <div className="benefit-card" data-stagger-child>
              <div className="benefit-icon">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <h3>Long-term Commitment</h3>
              <p>
                Build lasting relationships based on mutual trust, shared goals, and sustained
                growth for both parties.
              </p>
            </div>

            <div className="benefit-card" data-stagger-child>
              <div className="benefit-icon">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3>Mutual Growth</h3>
              <p>
                Leverage our expertise and resources to drive business growth and create value for
                both organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box animate-scale" ref={ctaRef}>
            <h2>Become Our Partner</h2>
            <p>
              Join our network of trusted partners and unlock new opportunities for collaboration
              and growth. Let's build the future together.
            </p>
            <Link to="/contact-us" className="btn btn-white">
              <i className="fa-solid fa-paper-plane"></i> Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
