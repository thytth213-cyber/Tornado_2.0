import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import "../styles/services.css";

export default function Services() {
  const { serviceId } = useParams();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  // Scroll animation refs
  const headerRef = useScrollAnimation({ threshold: 0.2 });
  const contentRef = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    let mounted = true;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Default services data
    const defaultServices = [
      {
        _id: 'turnkey-solutions',
        title: 'Turnkey Solutions',
        description: 'Complete end-to-end project delivery',
        body: 'We provide comprehensive turnkey solutions where we handle every aspect of your project from planning to execution. Our team manages design, procurement, installation, and commissioning.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        process: [
          'Initial consultation and requirements analysis',
          'Detailed project planning and timeline',
          'Design and engineering',
          'Component procurement',
          'Installation and integration',
          'Testing and commissioning',
          'Staff training',
          'Post-delivery support'
        ]
      },
      {
        _id: 'project-management',
        title: 'Project Management',
        description: 'Professional project oversight and coordination',
        body: 'Our experienced project managers ensure your projects are completed on time, within budget, and to specification. We coordinate all stakeholders and manage resources efficiently.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        process: [
          'Project scope definition',
          'Resource planning',
          'Schedule management',
          'Budget control',
          'Risk management',
          'Quality assurance',
          'Stakeholder communication',
          'Progress reporting'
        ]
      },
      {
        _id: 'maintenance-support',
        title: 'Maintenance Support / Service & Repair',
        description: 'Ongoing maintenance and repair services',
        body: 'Keep your equipment running smoothly with our comprehensive maintenance and repair services. We offer preventive maintenance programs and emergency repair support.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        process: [
          'Preventive maintenance schedules',
          'Regular system inspections',
          'Performance monitoring',
          'Component replacement',
          'Emergency repair response',
          'Spare parts inventory',
          'Service documentation',
          'Performance optimization'
        ]
      },
      {
        _id: 'import-export',
        title: 'Import & Export',
        description: 'International trade and logistics services',
        body: 'We handle all aspects of international import and export operations. Our expertise includes customs clearance, shipping coordination, and compliance management.',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
        process: [
          'Market analysis and sourcing',
          'Supplier identification',
          'Contract negotiation',
          'Documentation preparation',
          'Customs clearance',
          'Shipping coordination',
          'Quality inspection',
          'Delivery management'
        ]
      },
      {
        _id: 'contract-management',
        title: 'Contract Management',
        description: 'Professional contract administration',
        body: 'We provide comprehensive contract management services ensuring all agreements are properly executed and obligations are met. Our team handles negotiations, drafting, and compliance.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        process: [
          'Contract review and analysis',
          'Negotiation support',
          'Document drafting',
          'Legal compliance review',
          'Performance monitoring',
          'Dispute resolution',
          'Record management',
          'Renewal management'
        ]
      }
    ];

    (async () => {
      const normalize = (item) => {
        const raw = item.mediaUrl || item.image || "";
        const final = raw && !/^https?:\/\//i.test(raw) ? `${API_URL}${raw}` : raw;
        return Object.assign({}, item, { resolvedMediaUrl: final });
      };

      try {
        const { fetchContent } = await import("../api/contentApi");
        const all = await fetchContent();
        if (!mounted) return;

        const normalizedSection = (s) => (s || "").toString().trim().toLowerCase();
        const servicesData = all.filter((c) => normalizedSection(c.section) === "services");

        if (servicesData.length > 0) {
          setServices(servicesData.map(normalize));
        } else {
          setServices(defaultServices.map(normalize));
        }
      } catch (err) {
        console.warn("Failed to load services:", err);
        setServices(defaultServices.map(normalize));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Set selected service based on URL param
  useEffect(() => {
    if (services.length > 0) {
      if (serviceId) {
        const service = services.find((s) => s._id === serviceId || s._id === serviceId.toLowerCase());
        setSelectedService(service || services[0]);
      } else {
        setSelectedService(services[0]);
      }
    }
  }, [services, serviceId]);

  return (
    <main className="services-main">
      {/* Hero Section */}
      <section className="section services-hero">
        <div className="container">
          <div className="hero-content animate-top" ref={headerRef}>
            <div className="kicker">Our Services</div>
            <h1 className="h1">Professional Service Solutions</h1>
            <p className="lead">
              From project management to maintenance support, we deliver comprehensive services tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid and Details */}
      <section className="section soft">
        <div className="container">
          <div className="services-layout" ref={contentRef}>
            {/* Services List */}
            <div className="services-list">
              <h2 className="services-title">Our Services</h2>
              <div className="service-items">
                {services.map((service) => (
                  <button
                    key={service._id}
                    className={`service-item ${selectedService?._id === service._id ? 'active' : ''}`}
                    onClick={() => setSelectedService(service)}
                  >
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <span className="arrow">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Details */}
            {selectedService && (
              <div className="service-details animate-right">
                <div className="service-image">
                  <img
                    src={selectedService.resolvedMediaUrl || selectedService.image}
                    alt={selectedService.title}
                  />
                </div>
                <div className="service-info">
                  <h2>{selectedService.title}</h2>
                  <p className="description">{selectedService.body}</p>

                  <div className="process">
                    <h3>Our Process</h3>
                    <ol>
                      {(selectedService.process || []).map((step, idx) => (
                        <li key={idx}>
                          <span className="step-number">{idx + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="cta">
                    <button className="btn btn-primary">
                      <i className="fa-solid fa-phone"></i> Contact Us
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section">
        <div className="container">
          <h2 className="h2">Why Choose Our Services</h2>
          <div className="benefits-grid" style={{ marginTop: "32px" }}>
            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-star"></i>
              </div>
              <h3>Expertise</h3>
              <p>Years of industry experience and proven track record</p>
            </div>

            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-clock"></i>
              </div>
              <h3>On-Time Delivery</h3>
              <p>Committed to meeting deadlines and timelines</p>
            </div>

            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-shield"></i>
              </div>
              <h3>Quality Assurance</h3>
              <p>Rigorous quality control at every stage</p>
            </div>

            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <h3>Professional Team</h3>
              <p>Dedicated specialists ready to support you</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
