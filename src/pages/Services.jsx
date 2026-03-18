import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { fetchServices, fetchServicesByCategory, fetchServiceCategories } from "../api/servicesApi";
import "../styles/services.css";

export default function Services() {
  const { categorySlug } = useParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll animation refs
  const headerRef = useScrollAnimation({ threshold: 0.2 });
  const contentRef = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    let mounted = true;
    const isProduction = import.meta.env.VITE_ENV === 'production';
    const API_URL = (isProduction ? import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL)
      || "http://localhost:5000";

    const normalize = (item) => {
      const raw = item.mediaUrl || item.image || "";
      const final = raw && !/^https?:\/\//i.test(raw) ? `${API_URL}${raw}` : raw;
      return Object.assign({}, item, { resolvedMediaUrl: final });
    };

    (async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const fetchedCategories = await fetchServiceCategories();
        if (mounted && fetchedCategories && Array.isArray(fetchedCategories)) {
          setCategories(fetchedCategories.sort((a, b) => (a.order || 0) - (b.order || 0)));
        }

        // Fetch services based on category or all services
        let fetchedServices;
        if (categorySlug) {
          fetchedServices = await fetchServicesByCategory(categorySlug);
        } else {
          fetchedServices = await fetchServices();
        }

        if (mounted && fetchedServices && Array.isArray(fetchedServices)) {
          setServices(fetchedServices.map(normalize));
        }
      } catch (err) {
        console.warn("Failed to load services:", err);
        setServices([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [categorySlug]);

  // Set selected service to first service
  useEffect(() => {
    if (services.length > 0) {
      setSelectedService(services[0]);
    } else {
      setSelectedService(null);
    }
  }, [services]);

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
                    <h3>{service.name}</h3>
                    <p>{service.shortDescription}</p>
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
                    alt={selectedService.name}
                  />
                </div>
                <div className="service-info">
                  <h2>{selectedService.name}</h2>
                  {selectedService.shortDescription && (
                    <p className="short-description">{selectedService.shortDescription}</p>
                  )}

                  <div className="process">
                    <h3>Our Process</h3>
                    {selectedService.description && (
                      <div className="description-content">
                        {selectedService.description}
                      </div>
                    )}
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
                <i className="fa-solid fa-star">⭐</i>
              </div>
              <h3>Expertise</h3>
              <p>Years of industry experience and proven track record</p>
            </div>

            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-clock">🕐</i>
              </div>
              <h3>On-Time Delivery</h3>
              <p>Committed to meeting deadlines and timelines</p>
            </div>

            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-shield">🛡️</i>
              </div>
              <h3>Quality Assurance</h3>
              <p>Rigorous quality control at every stage</p>
            </div>

            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-users">👥</i>
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
