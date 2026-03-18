import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { fetchProducts, fetchProductsByCategory, fetchProductCategories } from "../api/productsApi";
import "../styles/products.css";

export default function Products() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
        const fetchedCategories = await fetchProductCategories();
        if (mounted && fetchedCategories && Array.isArray(fetchedCategories)) {
          setCategories(fetchedCategories.sort((a, b) => (a.order || 0) - (b.order || 0)));
        }

        // Fetch products based on category or all products
        let fetchedProducts;
        if (categorySlug) {
          fetchedProducts = await fetchProductsByCategory(categorySlug);
        } else {
          fetchedProducts = await fetchProducts();
        }

        if (mounted && fetchedProducts && Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts.map(normalize));
        }
      } catch (err) {
        console.warn("Failed to load products:", err);
        setProducts([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [categorySlug]);

  // Set selected product to first product
  useEffect(() => {
    if (products.length > 0) {
      setSelectedProduct(products[0]);
    } else {
      setSelectedProduct(null);
    }
  }, [products]);

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
