import { useState } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import "../styles/contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll animation refs
  const heroRef = useScrollAnimation({ threshold: 0.2 });
  const infoRef = useScrollAnimation({ threshold: 0.2 });
  const formRef = useScrollAnimation({ threshold: 0.2 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Demo: Show success message
    setTimeout(() => {
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 500);

    // Future: API integration
    // try {
    //   await sendContactForm(formData);
    //   // Show success message
    // } catch (error) {
    //   // Show error message
    // }
  };

  return (
    <main className="contact-main">
      {/* Hero Section */}
      <section className="section contact-hero">
        <div className="container">
          <div className="hero-content animate-top" ref={heroRef}>
            <div className="kicker">Contact Us</div>
            <h1 className="h1">Get In Touch</h1>
            <p className="lead">
              We'd love to hear from you. Whether you have a question about our products, services, or anything else, our team is ready to answer all your questions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Layout Section */}
      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Contact Information */}
            <div className="contact-info animate-left" ref={infoRef}>
              <div className="contact-info-card">
                <h3>Contact Information</h3>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fa-solid fa-location-dot">📍</i>
                  </div>
                  <div className="info-content">
                    <h4>Address</h4>
                    <p>111 Somerset Road, #03-09 TripleOne Somerset<br />Singapore 238164</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fa-solid fa-phone">📞</i>
                  </div>
                  <div className="info-content">
                    <h4>Phone</h4>
                    <p><a href="tel:+6567321431">+65 67321431</a></p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fa-solid fa-envelope">✉️</i>
                  </div>
                  <div className="info-content">
                    <h4>Email</h4>
                    <p><a href="mailto:enquiry@bgconsultantpteltd.com">enquiry@bgconsultantpteltd.com</a></p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fa-solid fa-clock">⏰</i>

                  </div>
                  <div className="info-content">
                    <h4>Business Hours</h4>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form animate-right" ref={formRef}>
              <h3>Send Us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+65 1234 5678"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    Subject <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}