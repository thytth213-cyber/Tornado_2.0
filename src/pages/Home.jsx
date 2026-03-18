import { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { useScrollAnimation, useStaggerAnimation } from "../hooks/useScrollAnimation";
import "../styles/home.css";

export default function Home() {
  const heroSwiperRef = useRef(null);
  const projectSwiperRef = useRef(null);
  const heroAutoplayFallbackRef = useRef(null);
  const [heroSlides, setHeroSlides] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
  const [aboutItem, setAboutItem] = useState(null);
  const [activeService, setActiveService] = useState(0);
  const [products, setProducts] = useState([]);

  // Scroll animation refs
  const aboutImgRef = useScrollAnimation({ threshold: 0.2 });
  const aboutTextRef = useScrollAnimation({ threshold: 0.2 });
  const servicesRef = useStaggerAnimation({ delay: 100, threshold: 0.2 });
  const productsRef = useStaggerAnimation({ delay: 80, threshold: 0.2 });

  // Safe local fallback slides used only to ensure the hero always shows 3 slides
  const fallbackSlides = [
    {
      _id: 'f-1',
      title: 'Digital Solutions That Drive Growth',
      body: 'Transform your business with cutting-edge technology and innovative strategies',
      resolvedMediaUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
    },
    {
      _id: 'f-2',
      title: 'Custom Development Services',
      body: 'Build scalable applications tailored to your exact business needs',
      resolvedMediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
    },
    {
      _id: 'f-3',
      title: 'Expert Tech Consulting',
      body: 'Strategic guidance to optimize your digital infrastructure',
      resolvedMediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
    },
  ];

  // heroToRender is the array actually rendered: prefer DB slides, but supplement with fallbacks up to 3 slides
  const heroToRender = (heroSlides && heroSlides.length > 0)
    ? [...heroSlides, ...fallbackSlides].slice(0, 3)
    : [];

  useEffect(() => {
    // Fetch dynamic content (hero slides, projects, products) from the content API
    // so uploaded images saved in the admin panel appear on the home page.
    let mounted = true;
    const isProduction = import.meta.env.VITE_ENV === 'production';
    const API_URL = (isProduction ? import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL)
      || "http://localhost:5000";
    (async () => {
      try {
        const { fetchContent } = await import("../api/contentApi");
        const { fetchFeaturedProducts } = await import("../api/productsApi");
        const all = await fetchContent();
        if (!mounted) return;
        // robust section matching: trim + lowercase to avoid casing/whitespace issues
        const normalizedSection = (s) => (s || "").toString().trim().toLowerCase();
        const heroes = all.filter((c) => normalizedSection(c.section) === "home-hero");
        const projects = all
          .filter((c) => normalizedSection(c.section) === "home-projects")
          .sort((a, b) => (Number(a.order || 0) - Number(b.order || 0)));
        const about = all.find((c) => normalizedSection(c.section) === "home-about") || null;

        // Normalize media URLs to absolute when necessary
        const normalize = (item) => {
          if (!item) return item;
          const raw = item.mediaUrl || item.image || "";
          const final = raw && !/^https?:\/\//i.test(raw) ? `${API_URL}${raw}` : raw;
          return Object.assign({}, item, { resolvedMediaUrl: final });
        };

        setHeroSlides(heroes.map(normalize));
        setProjectItems(projects.map(normalize));
        setAboutItem(about ? normalize(about) : null);

        // Fetch featured products
        try {
          const productsData = await fetchFeaturedProducts();
          if (mounted) {
            const normalizedProducts = productsData.map(product => ({
              ...product,
              resolvedImage: product.image && !/^https?:\/\//i.test(product.image) 
                ? `${API_URL}${product.image}` 
                : product.image
            }));
            setProducts(normalizedProducts);
          }
        } catch (err) {
          console.warn("Failed to load products:", err);
        }
      } catch (err) {
        console.warn("Failed to load home content:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // initialize Swiper instances once slides are rendered/updated
  useEffect(() => {
    // HERO Swiper
  if (heroToRender.length > 0) {
      heroSwiperRef.current?.destroy?.(true, true);

      const animateHeroText = () => {
        document.querySelectorAll(".animate-on-slide").forEach((el) => el.classList.remove("is-animate"));
        const active = document.querySelector("#heroSwiper .swiper-slide-active .animate-on-slide");
        if (!active) return;
        void active.offsetWidth;
        active.classList.add("is-animate");
      };

      heroSwiperRef.current = new Swiper("#heroSwiper", {
        modules: [Autoplay, Pagination, EffectFade],
        loop: true,
        effect: "fade",
        fadeEffect: { crossFade: true },
        speed: 900,
        autoplay: { delay: 4200, disableOnInteraction: false },
        pagination: { el: "#heroPagination", clickable: true },
        // Observe DOM changes so Swiper updates when React renders slides
        observer: true,
        observeParents: true,
        // register event handlers early via the `on` option
        on: {
          init() {
            animateHeroText();
          },
          slideChangeTransitionStart() {
            animateHeroText();
          },
        },
      });

      // ensure Swiper recalculates sizes and starts autoplay
      setTimeout(() => {
        try {
          heroSwiperRef.current.update?.();
          // ensure first animation runs
          animateHeroText();

          // Try to start autoplay; if autoplay isn't running (CSS or module issues),
          // fall back to a safe interval that calls slideNext so slides advance.
          const delay = (heroSwiperRef.current.params?.autoplay?.delay) || 4200;
          // clear any previous fallback
          if (heroAutoplayFallbackRef.current) {
            clearInterval(heroAutoplayFallbackRef.current);
            heroAutoplayFallbackRef.current = null;
          }

          // Only attempt autoplay if there's more than one slide
          const slideCount = document.querySelectorAll('#heroSwiper .swiper-slide').length;
          if (slideCount > 1) {
            // prefer the built-in autoplay if available
            try {
              if (heroSwiperRef.current.autoplay && typeof heroSwiperRef.current.autoplay.start === 'function') {
                heroSwiperRef.current.autoplay.start();
              }
            } catch (e) {
              // ignore
            }

            // if autoplay still not active after a short delay, use fallback interval
            setTimeout(() => {
              const autoplayRunning = !!(heroSwiperRef.current && heroSwiperRef.current.autoplay && heroSwiperRef.current.autoplay.running);
              if (!autoplayRunning) {
                heroAutoplayFallbackRef.current = setInterval(() => {
                  try { heroSwiperRef.current.slideNext(); } catch (e) { /* ignore */ }
                }, delay + 100);
              }
            }, 200);
          }
        } catch (e) {
          console.warn('Swiper hero update failed', e);
        }
  }, 120);
    }

    // Projects Swiper
    if (projectItems.length > 0) {
      projectSwiperRef.current?.destroy?.(true, true);
      projectSwiperRef.current = new Swiper("#projectSwiper", {
        modules: [Pagination, Navigation],
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        pagination: { el: "#projectSwiper .swiper-pagination", clickable: true },
        navigation: { nextEl: "#nextBtn", prevEl: "#prevBtn" },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
        observer: true,
        observeParents: true,
      });

      // update sizes after render
      setTimeout(() => {
        try {
          projectSwiperRef.current.update?.();
        } catch (e) {
          console.warn('Swiper project update failed', e);
        }
      }, 50);
    }

    return () => {
      // cleanup: destroy swipers and clear fallback interval
      try {
        heroSwiperRef.current?.destroy?.(true, true);
      } catch (e) { /* ignore */ }
      try {
        projectSwiperRef.current?.destroy?.(true, true);
      } catch (e) { /* ignore */ }
      if (heroAutoplayFallbackRef.current) {
        clearInterval(heroAutoplayFallbackRef.current);
        heroAutoplayFallbackRef.current = null;
      }
    };
  }, [heroSlides, projectItems]);

  useEffect(() => {
    // debug logs so you can inspect arrays in the browser console
    console.debug("Home content - heroSlides:", heroSlides);
    console.debug("Home content - projectItems:", projectItems);
    console.debug("Home content - aboutItem:", aboutItem);
    console.debug("Home content - products:", products);
  }, [heroSlides, projectItems, aboutItem, products]);

  // Stats count-up: animate numbers when the stats section scrolls into view
  useEffect(() => {
    let observer = null;

    const animateCounts = () => {
      const counts = Array.from(document.querySelectorAll('.count'));
      counts.forEach((el) => {
        const target = Number(el.getAttribute('data-target')) || 0;
        const duration = 1500; // ms
        const start = 0;
        let startTime = null;

        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const value = Math.floor(progress * (target - start) + start);
          el.textContent = value;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        };

        // start animation
        requestAnimationFrame(step);
      });
    };

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounts();
            if (observer) observer.disconnect();
          }
        });
      }, { threshold: 0.3 });

      const el = document.querySelector('#stats');
      if (el) observer.observe(el);
    } else {
      // fallback: run immediately
      animateCounts();
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <main className="app-main">
      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="hero-section">
        {/* Background image slider - chỉ có ảnh */}
        <div className="swiper" id="heroSwiper">
          <div className="swiper-wrapper">
            {heroToRender.length > 0
              ? heroToRender.map((item, idx) => (
                  <div key={item._id || `hero-${idx}`} className="swiper-slide hero-slide">
                    <div
                      className="hero-bg"
                      style={{
                        backgroundImage: item.resolvedMediaUrl
                          ? `url(${item.resolvedMediaUrl})`
                          : undefined,
                      }}
                    />
                  </div>
                ))
              : // fallback slides với ảnh từ fallbackSlides
                fallbackSlides.map((item, idx) => (
                  <div key={item._id || `hero-${idx}`} className="swiper-slide hero-slide">
                    <div
                      className="hero-bg"
                      style={{
                        backgroundImage: item.resolvedMediaUrl
                          ? `url(${item.resolvedMediaUrl})`
                          : undefined,
                      }}
                    />
                  </div>
                ))}
          </div>
          <div className="swiper-pagination" id="heroPagination"></div>
        </div>

        {/* Text overlay - position absolute đè lên slider */}
        <div className="hero-text-overlay">
          <div className="container">
            <h1 className="hero-text">We are here to help you & your business</h1>
            <a href="#contact" className="btn btn-primary">
              LEARN MORE
            </a>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image animate-left" ref={aboutImgRef}>
              {aboutItem && aboutItem.resolvedMediaUrl ? (
                <img
                  className="about-image-img"
                  src={aboutItem.resolvedMediaUrl}
                  alt={aboutItem.title || 'About'}
                />
              ) : (
                <img
                  className="about-image-img"
                  src="https://bgconsultantpteltd.com/wp-content/uploads/2025/01/Group-59.jpg"
                  alt="About"
                />
              )}
            </div>
            <div className="about-text animate-right" ref={aboutTextRef}>
              <h3>Growing Your Business</h3>
              <p>
                Established in 2012. B&G Consultant Pte Ltd has a team of well-trained workforce of
                professionals specializing in pre-sales, system design, turnkey, project management,
                system integration, build to order and after-sales service, who will discuss all
                your corporate requirements with you before suggesting solutions to cater to the
                ever-growing customer needs.
              </p>
              <p>
                Our expertise has fuelled our global expansion. Today, we serve clients around the
                world, building upon our established presence in Singapore and the region. We've
                enriched our service portfolio and product range to deliver cutting-edge solutions
                that meet the complex needs of our diverse clientele.
              </p>
              <a href="#about" className="btn btn-primary">
                ABOUT US
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services We Provide</h2>
          </div>
          <div className="services-content" ref={servicesRef}>
            <div className="services-list">
              {[
                {
                  title: 'Turnkey Solutions',
                  image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
                },
                {
                  title: 'Project Management',
                  image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
                },
                {
                  title: 'Maintenance Support/ Service & Repair/ Others',
                  image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
                },
                {
                  title: 'Contract Management',
                  image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
                },
                {
                  title: 'Import & Export',
                  image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
                },
              ].map((service, idx) => (
                <div
                  key={idx}
                  data-stagger-child
                  className={`service-item ${activeService === idx ? 'active' : ''}`}
                  onClick={() => setActiveService(idx)}
                >
                  <h3>{service.title}</h3>
                  <div className="service-arrow">→</div>
                </div>
              ))}
            </div>
            <div className="services-image">
              <img
                src={
                  [
                    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
                    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
                    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
                    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
                  ][activeService]
                }
                alt="Service"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS SECTION ===== */}
      <section id="products" className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Products</h2>
          </div>
          <div className="products-grid" ref={productsRef}>
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="product-box" data-stagger-child>
                  <div className="product-icon">
                    {product.resolvedImage ? (
                      <img
                        src={product.resolvedImage}
                        alt={product.name}
                        width="200"
                        height="200"
                      />
                    ) : (
                      <div className="product-placeholder" style={{ width: '200px', height: '200px', backgroundColor: '#e0e0e0' }} />
                    )}
                  </div>
                  <h3>{product.name}</h3>
                  {product.shortDescription && (
                    <p className="product-description">{product.shortDescription}</p>
                  )}
                  {!product.shortDescription && product.description && (
                    <p className="product-description">{product.description}</p>
                  )}
                </div>
              ))
            ) : (
              // Fallback to hardcoded products if no database products are loaded
              <>
                <div className="product-box" data-stagger-child>
                  <div className="product-icon">
                    <img
                      src="https://bgconsultantpteltd.com/wp-content/uploads/2024/12/g552.svg"
                      alt="Industrial Machinery"
                      width="200"
                      height="200"
                    />
                  </div>
                  <h3>Industrial Machinery</h3>
                </div>

                <div className="product-box" data-stagger-child>
                  <div className="product-icon">
                    <img
                      src="https://bgconsultantpteltd.com/wp-content/uploads/2024/12/Group-22.svg"
                      alt="Telecommunications Equipment"
                      width="200"
                      height="200"
                    />
                  </div>
                  <h3>Telecommunications Equipment</h3>
                </div>

                <div className="product-box" data-stagger-child>
                  <div className="product-icon">
                    <img
                      src="https://bgconsultantpteltd.com/wp-content/uploads/2024/12/Group-52.svg"
                      alt="Lightning Systems"
                      width="200"
                      height="200"
                    />
                  </div>
                  <h3>Lightning/ Metrological Systems/ Camera</h3>
                </div>

                <div className="product-box" data-stagger-child>
                  <div className="product-icon">
                    <img
                      src="https://bgconsultantpteltd.com/wp-content/uploads/2024/12/g2930.svg"
                      alt="Fire Fighting Equipment"
                      width="200"
                      height="200"
                    />
                  </div>
                  <h3>Fire Fighting Equipment</h3>
                </div>

                <div className="product-box" data-stagger-child>
                  <div className="product-icon">
                    <img
                      src="https://bgconsultantpteltd.com/wp-content/uploads/2024/12/Group-25.svg"
                      alt="IT Hardware"
                      width="200"
                      height="200"
                    />
                  </div>
                  <h3>IT Hardware & Software & Other Equipment</h3>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}