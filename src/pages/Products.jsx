import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import "../styles/products.css";

export default function Products() {
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Scroll animation refs
  const headerRef = useScrollAnimation({ threshold: 0.2 });
  const contentRef = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    let mounted = true;
    const isProduction = import.meta.env.VITE_ENV === 'production';
    const API_URL = (isProduction ? import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL)
      || "http://localhost:5000";

    // Default products data
    const defaultProducts = [
      {
        _id: 'industrial-machinery',
        title: 'Industrial Machinery',
        description: 'Advanced industrial machinery and equipment designed for manufacturing operations',
        body: 'Our industrial machinery solutions are engineered for maximum efficiency and durability. We provide comprehensive support including installation, training, and maintenance services to ensure optimal performance.',
        image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80',
        features: [
          'High-precision components',
          'Automated operation',
          'Energy-efficient design',
          'Low maintenance requirements',
          'Extended warranty coverage'
        ]
      },
      {
        _id: 'telecommunications',
        title: 'Telecommunications Equipment',
        description: 'Cutting-edge telecommunications infrastructure and networking solutions',
        body: 'We specialize in state-of-the-art telecommunications equipment that enables seamless connectivity. Our products support high-speed data transmission and reliable network infrastructure.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        features: [
          'High-speed connectivity',
          'Reliable infrastructure',
          'Scalable solutions',
          'Advanced security features',
          'Global compatibility'
        ]
      },
      {
        _id: 'lightning-systems',
        title: 'Lightning / Metrological Systems / Camera',
        description: 'Comprehensive weather monitoring and surveillance systems',
        body: 'Our advanced lightning detection and metrological systems provide real-time monitoring and data collection. Integrated with high-resolution camera systems for complete surveillance coverage.',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
        features: [
          'Real-time lightning detection',
          'Weather monitoring',
          '4K camera systems',
          'Cloud integration',
          'Mobile app support'
        ]
      },
      {
        _id: 'fire-fighting',
        title: 'Fire Fighting Equipment',
        description: 'Professional fire suppression and safety equipment',
        body: 'We provide comprehensive fire fighting solutions including suppression systems, detection equipment, and emergency response tools. All products meet international safety standards.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
        features: [
          'ISO certified',
          'Quick response systems',
          'Automatic detection',
          'Maintenance services',
          'Training programs'
        ]
      },
      {
        _id: 'it-hardware',
        title: 'IT Hardware & Software & Other Equipment',
        description: 'Complete IT solutions for enterprise and business operations',
        body: 'From servers to workstations, we offer complete IT infrastructure solutions. Our products include hardware, software licenses, and comprehensive technical support.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
        features: [
          'Enterprise-grade servers',
          'Software licensing',
          'Cloud solutions',
          'Technical support 24/7',
          'Scalable infrastructure'
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
        const productsData = all.filter((c) => normalizedSection(c.section) === "products");

        if (productsData.length > 0) {
          setProducts(productsData.map(normalize));
        } else {
          setProducts(defaultProducts.map(normalize));
        }
      } catch (err) {
        console.warn("Failed to load products:", err);
        setProducts(defaultProducts.map(normalize));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Set selected product based on URL param
  useEffect(() => {
    if (products.length > 0) {
      if (productId) {
        const product = products.find((p) => p._id === productId || p._id === productId.toLowerCase());
        setSelectedProduct(product || products[0]);
      } else {
        setSelectedProduct(products[0]);
      }
    }
  }, [products, productId]);

  return (
    <main className="products-main">
      {/* Hero Section */}
      <section className="section products-hero">
        <div className="container">
          <div className="hero-content animate-top" ref={headerRef}>
            <div className="kicker">Our Products</div>
            <h1 className="h1">Comprehensive Product Solutions</h1>
            <p className="lead">
              Discover our extensive range of industrial and technological products designed to meet your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid and Details */}
      <section className="section soft">
        <div className="container">
          <div className="products-layout" ref={contentRef}>
            {/* Products List */}
            <div className="products-list">
              <h2 className="products-title">Our Products</h2>
              <div className="product-items">
                {products.map((product) => (
                  <button
                    key={product._id}
                    className={`product-item ${selectedProduct?._id === product._id ? 'active' : ''}`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <span className="arrow">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            {selectedProduct && (
              <div className="product-details animate-right">
                <div className="product-image">
                  <img
                    src={selectedProduct.resolvedMediaUrl || selectedProduct.image}
                    alt={selectedProduct.title}
                  />
                </div>
                <div className="product-info">
                  <h2>{selectedProduct.title}</h2>
                  <p className="description">{selectedProduct.body}</p>

                  <div className="features">
                    <h3>Key Features</h3>
                    <ul>
                      {(selectedProduct.features || []).map((feature, idx) => (
                        <li key={idx}>
                          <i className="fa-solid fa-check"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="cta">
                    <button className="btn btn-primary">
                      <i className="fa-solid fa-paper-plane"></i> Request Information
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section">
        <div className="container">
          <h2 className="h2">Why Choose Our Products</h2>
          <div className="benefits-grid" style={{ marginTop: "32px" }}>
            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-check-circle">✓</i>
              </div>
              <h3>Quality Assured</h3>
              <p>All products meet international quality and safety standards</p>
            </div>

            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-headset">🎧</i>
              </div>
              <h3>Expert Support</h3>
              <p>Dedicated technical support team available 24/7</p>
            </div>

            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-truck">🚚</i>
              </div>
              <h3>Fast Delivery</h3>
              <p>Reliable shipping and logistics to your location</p>
            </div>

            <div className="benefit-card animate-left">
              <div className="benefit-icon">
                <i className="fa-solid fa-handshake">🤝</i>
              </div>
              <h3>Long-term Partnership</h3>
              <p>Build lasting relationships with our service-oriented approach</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
