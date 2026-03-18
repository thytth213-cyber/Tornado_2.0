import { useEffect, useState } from "react";
import { useScrollAnimation, useStaggerAnimation } from "../hooks/useScrollAnimation";
import "../styles/about.css";

export default function About() {
  const [aboutContent, setAboutContent] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll animation refs
  const heroTextRef = useScrollAnimation({ threshold: 0.2 });
  const heroImageRef = useScrollAnimation({ threshold: 0.2 });
  const missionCardsRef = useStaggerAnimation({ delay: 120, threshold: 0.2 });
  const teamCardsRef = useStaggerAnimation({ delay: 100, threshold: 0.2 });
  const featuresRef = useStaggerAnimation({ delay: 100, threshold: 0.2 });
  const statsRef = useStaggerAnimation({ delay: 90, threshold: 0.2 });

  useEffect(() => {
    let mounted = true;
    const isProduction = import.meta.env.VITE_ENV === 'production';
    const API_URL = (isProduction ? import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL)
      || "http://localhost:5000";

    (async () => {
      try {
        const { fetchContent } = await import("../api/contentApi");
        const all = await fetchContent();
        if (!mounted) return;

        // Normalize section names (trim + lowercase)
        const normalizedSection = (s) => (s || "").toString().trim().toLowerCase();

        // Fetch about section content
        const aboutData = all.find((c) => normalizedSection(c.section) === "about-hero") || null;

        // Fetch team members
        const team = all
          .filter((c) => normalizedSection(c.section) === "about-team")
          .sort((a, b) => (Number(a.order || 0) - Number(b.order || 0)));

        // Normalize media URLs
        const normalize = (item) => {
          if (!item) return item;
          const raw = item.mediaUrl || item.image || "";
          const final = raw && !/^https?:\/\//i.test(raw) ? `${API_URL}${raw}` : raw;
          return Object.assign({}, item, { resolvedMediaUrl: final });
        };

        // Set default image if about data doesn't have one
        if (aboutData) {
          const normalized = normalize(aboutData);
          if (!normalized.resolvedMediaUrl) {
            normalized.resolvedMediaUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';
          }
          setAboutContent(normalized);
        } else {
          // Provide default about content with image
          setAboutContent({
            title: "Driving Innovation Through Technology",
            body: "We are a team of passionate professionals dedicated to delivering exceptional solutions that transform businesses and create lasting impact.",
            resolvedMediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
          });
        }
        setTeamMembers(team.map(normalize));
      } catch (err) {
        console.warn("Failed to load about content:", err);
        // Set default content on error
        setAboutContent({
          title: "Driving Innovation Through Technology",
          body: "We are a team of passionate professionals dedicated to delivering exceptional solutions that transform businesses and create lasting impact.",
          resolvedMediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
        });
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="about-main">
      {/* Hero Section */}
      <section className="section about-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text animate-left" ref={heroTextRef}>
              <div className="kicker">About Us</div>
              <h1 className="h1">
                {aboutContent?.title || 'Driving Innovation Through Technology'}
              </h1>
              <p className="lead" style={{ marginTop: '16px', maxWidth: '70ch' }}>
                {aboutContent?.body ||
                  'We are a team of passionate professionals dedicated to delivering exceptional solutions that transform businesses and create lasting impact.'}
              </p>
            </div>
            {aboutContent?.resolvedMediaUrl && (
              <div className="hero-image animate-right" ref={heroImageRef}>
                <img
                  src={aboutContent.resolvedMediaUrl}
                  alt="About Hero"
                  style={{ borderRadius: '12px', maxWidth: '100%' }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="section soft" id="mission-vision">
        <div className="container">
          <div className="kicker">Our Foundation</div>
          <h2 className="h2">Mission, Vision & Values</h2>

          <div className="grid mission-grid" style={{ marginTop: '32px' }} ref={missionCardsRef}>
            {/* Mission Card */}
            <div className="card mission-card hover-up" data-stagger-child>
              <div className="card-icon">
                <i className="fa-solid fa-target">🎯</i>
              </div>
              <h3>Our Mission</h3>
              <p>
                To empower businesses with innovative technology solutions that drive growth,
                efficiency, and sustainable success in the digital era.
              </p>
            </div>

            {/* Vision Card */}
            <div className="card mission-card hover-up" data-stagger-child>
              <div className="card-icon">
                <i className="fa-solid fa-eye">👁️</i>
              </div>
              <h3>Our Vision</h3>
              <p>
                To be the leading technology partner trusted by organizations worldwide for
                delivering transformative digital solutions.
              </p>
            </div>

            {/* Values Card */}
            <div className="card mission-card hover-up" data-stagger-child>
              <div className="card-icon">
                <i className="fa-solid fa-heart">❤️</i>
              </div>
              <h3>Our Values</h3>
              <ul className="values-list">
                <li>
                  <i className="fa-solid fa-check">✓</i> Excellence & Innovation
                </li>
                <li>
                  <i className="fa-solid fa-check">✓</i> Integrity & Transparency
                </li>
                <li>
                  <i className="fa-solid fa-check">✓</i> Customer Commitment
                </li>
                <li>
                  <i className="fa-solid fa-check">✓</i> Team Collaboration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section" id="story">
        <div className="container">
          <div className="kicker">The Journey</div>
          <h2 className="h2">Our Story</h2>

          <div className="story-timeline" style={{ marginTop: '40px' }} ref={missionCardsRef}>
            <div className="timeline-item animate-left" data-stagger-child>
              <div className="timeline-block"></div>
              <div className="timeline-marker">
                <div className="marker-dot"></div>
              </div>
              <div className="timeline-content">
                <h4>Founded</h4>
                <p className="timeline-year">2015</p>
                <p>
                  Started with a vision to revolutionize the technology consulting space, our
                  founders brought together world-class talent to solve complex business challenges.
                </p>
              </div>
            </div>

            <div className="timeline-item animate-right" data-stagger-child>
              <div className="timeline-block"></div>

              <div className="timeline-marker">
                <div className="marker-dot"></div>
              </div>
              <div className="timeline-content">
                <h4>Rapid Growth</h4>
                <p className="timeline-year">2018</p>
                <p>
                  Expanded our team and service offerings, successfully delivered 50+ projects
                  across multiple industries and countries.
                </p>
              </div>
            </div>

            <div className="timeline-item animate-left" data-stagger-child>
              <div className="timeline-block"></div>

              <div className="timeline-marker">
                <div className="marker-dot"></div>
              </div>
              <div className="timeline-content">
                <h4>Global Recognition</h4>
                <p className="timeline-year">2021</p>
                <p>
                  Recognized as industry leaders, won multiple awards for innovation and customer
                  satisfaction in the technology sector.
                </p>
              </div>
            </div>

            <div className="timeline-item animate-right" data-stagger-child>
              <div className="timeline-block"></div>

              <div className="timeline-marker">
                <div className="marker-dot"></div>
              </div>
              <div className="timeline-content">
                <h4>Today</h4>
                <p className="timeline-year">2026</p>
                <p>
                  Continuing to innovate and serve 200+ clients globally, with a team of 100+
                  dedicated professionals across multiple offices worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section soft" id="why-us">
        <div className="container">
          <div className="kicker">Why Choose Us</div>
          <h2 className="h2">What Sets Us Apart</h2>

          <div className="grid features-grid" style={{ marginTop: '32px' }} ref={featuresRef}>
            <div className="card feature-card hover-up" data-stagger-child>
              <div className="feature-number">01</div>
              <h3>Expert Team</h3>
              <p>
                Industry veterans with 15+ years of experience delivering world-class solutions
                across diverse sectors.
              </p>
            </div>

            <div className="card feature-card hover-up" data-stagger-child>
              <div className="feature-number">02</div>
              <h3>Proven Track Record</h3>
              <p>
                Successfully completed 200+ projects with 98% client satisfaction rate and strong
                long-term partnerships.
              </p>
            </div>

            <div className="card feature-card hover-up" data-stagger-child>
              <div className="feature-number">03</div>
              <h3>Cutting-Edge Technology</h3>
              <p>
                Always leveraging the latest technologies and best practices to ensure modern,
                scalable, and secure solutions.
              </p>
            </div>

            <div className="card feature-card hover-up" data-stagger-child>
              <div className="feature-number">04</div>
              <h3>Customer-Centric Approach</h3>
              <p>
                Your success is our success. We work closely with you to understand goals and
                deliver tailored solutions.
              </p>
            </div>

            <div className="card feature-card hover-up" data-stagger-child>
              <div className="feature-number">05</div>
              <h3>24/7 Support</h3>
              <p>
                Dedicated support team available round-the-clock to ensure your systems run smoothly
                and efficiently.
              </p>
            </div>

            <div className="card feature-card hover-up" data-stagger-child>
              <div className="feature-number">06</div>
              <h3>Scalable Solutions</h3>
              <p>
                From startups to enterprises, our solutions grow with your business needs and adapt
                to market changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="section" id="team">
          <div className="container">
            <div className="kicker">Meet the Team</div>
            <h2 className="h2">Our Leadership & Experts</h2>

            <div className="grid team-grid" style={{ marginTop: '40px' }} ref={teamCardsRef}>
              {teamMembers.map(member => (
                <div key={member._id} className="card team-card hover-up" data-stagger-child>
                  {member.resolvedMediaUrl && (
                    <div className="team-image">
                      <img src={member.resolvedMediaUrl} alt={member.title} />
                    </div>
                  )}
                  <h3>{member.title}</h3>
                  <p className="team-role" style={{ color: 'var(--primary)', marginTop: '4px' }}>
                    {member.order && `Position ${member.order}`}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '8px' }}>
                    {member.body || 'Experienced professional dedicated to excellence.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      <section className="section soft" id="stats-about">
        <div className="container">
          <h2 className="h2">By The Numbers</h2>

          <div className="grid stats-grid" style={{ marginTop: '32px' }} ref={statsRef}>
            <div className="stat-card" data-stagger-child>
              <div className="stat-number">200+</div>
              <p className="stat-label">Happy Clients</p>
              <p className="stat-description">Across multiple industries worldwide</p>
            </div>

            <div className="stat-card" data-stagger-child>
              <div className="stat-number">100+</div>
              <p className="stat-label">Team Members</p>
              <p className="stat-description">Talented professionals dedicated to success</p>
            </div>

            <div className="stat-card" data-stagger-child>
              <div className="stat-number">500+</div>
              <p className="stat-label">Projects Delivered</p>
              <p className="stat-description">Successfully completed across 30+ countries</p>
            </div>

            <div className="stat-card" data-stagger-child>
              <div className="stat-number">98%</div>
              <p className="stat-label">Client Satisfaction</p>
              <p className="stat-description">Consistent quality and service excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section" id="cta-about">
        <div className="container">
          <div className="cta-box animate-scale">
            <h2 className="h2">Ready to Work With Us?</h2>
            <p className="lead" style={{ marginTop: '12px', maxWidth: '70ch' }}>
              Let's discuss how we can help transform your business and achieve your goals.
            </p>
            <div style={{ marginTop: '20px' }}>
              <a
                href="#contact"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <i className="fa-solid fa-paper-plane"></i> Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
