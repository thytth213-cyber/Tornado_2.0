import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { getLogo as apiGetLogo } from '../api/settingsApi';

const MENU_CONFIG = [
  { id: 'home', label: 'HOME', href: '/', hasSubmenu: false },
  { id: 'about', label: 'ABOUT US', href: '/about', hasSubmenu: false },
  {
    id: 'products',
    label: 'PRODUCTS',
    href: '/products',
    hasSubmenu: true,
    submenuItems: [
      {
        id: 'industrial-machinery',
        label: 'Industrial Machinery',
        href: '/products/industrial-machinery',
      },
      {
        id: 'telecommunications',
        label: 'Telecommunications Equipment',
        href: '/products/telecommunications',
      },
      {
        id: 'lighting-systems',
        label: 'Lightning/Metrological Systems/Camera',
        href: '/products/lightning-systems',
      },
      { id: 'fire-fighting', label: 'Fire Fighting Equipment', href: '/products/fire-fighting' },
      {
        id: 'it-hardware',
        label: 'IT Hardware & Software & Other Equipment',
        href: '/products/it-hardware',
      },
    ],
  },
  {
    id: 'services',
    label: 'SERVICES',
    href: '/services',
    hasSubmenu: true,
    submenuItems: [
      { id: 'turnkey-solutions', label: 'Turnkey Solutions', href: '/services/turnkey-solutions' },
      {
        id: 'project-management',
        label: 'Project Management',
        href: '/services/project-management',
      },
      {
        id: 'maintenance-support',
        label: 'Maintenance Support/Service & Repair/Others',
        href: '/services/maintenance-support',
      },
      { id: 'import-export', label: 'Import & Export', href: '/services/import-export' },
      {
        id: 'contract-management',
        label: 'Contract Management',
        href: '/services/contract-management',
      },
    ],
  },
  { id: 'partners', label: 'PARTNERS', href: '/partners', hasSubmenu: false },
  { id: 'contact', label: 'CONTACT US', href: '/contact-us', hasSubmenu: false },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [expandedMenus, setExpandedMenus] = useState({
    products: false,
    services: false,
  });
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = href => {
    if (href.startsWith('#')) {
      return false; // Anchor links are not considered "active" pages
    }
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      if (y > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // fetch logo from backend settings on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGetLogo();
        if (mounted && data && data.logoUrl) {
          // If the stored logoUrl is a path (e.g. "/uploads/x.jpg")
          // prefix it with the API base so the browser requests the
          // image from the backend server instead of the Vite dev server.
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const raw = data.logoUrl || '';
          const final = raw && !/^https?:\/\//i.test(raw) ? `${API_URL}${raw}` : raw;
          setLogoUrl(final);
        }
      } catch (err) {
        // ignore - fallback to static logo
        console.warn('Could not fetch site logo', err);
      }
    })();

    // listen for live updates emitted by admin UI
    const onUpdate = e => {
      if (e && e.detail && e.detail.logoUrl) setLogoUrl(e.detail.logoUrl);
    };
    window.addEventListener('siteLogoUpdated', onUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('siteLogoUpdated', onUpdate);
    };
  }, []);

  /*
    Header developer comments:

    - Accessibility: ensure interactive elements have keyboard support (hamburger
      button has aria-expanded but ensure focus styles and keyboard navigation
      for the mobile panel). Consider trapping focus inside the mobile panel
      when it's open, or ensure `tabindex` order is logical.

    - Navigation: when using React Router, prefer `NavLink`/`Link` from
      `react-router-dom` for internal navigation instead of anchor tags with
      hash fragments, unless you intentionally want in-page anchors. Using
      `Link` avoids full-page reloads and integrates with SPA routing.

    - Performance: the `onScroll` handler toggles a class; consider
      debouncing/throttling if heavy work is added. Right now it's light so
      it's acceptable, but keep an eye on reflows caused by complex handlers.

    - Search input: currently uncontrolled and purely visual. If this is a
      functional search, debounce user input before performing queries to avoid
      excessive requests. If it's decorative, mark it with aria-hidden or
      provide an accessible label/placeholder.

    - Images and assets: ensure the `/assets/logo-tornado.jpg` path lives in
      `public/assets` so Vite serves it correctly. Consider adding a small
      `alt` description (you already have alt — keep it meaningful).
  */

  const toggleMenu = menuId => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <>
      {/* Header (FULL WIDTH) */}
      <header ref={headerRef} className="site-header" id="top">
        {/* ✅ container nằm ở đây để nội dung căn giữa, nền vẫn full */}
        <div className="container">
          <div className="navwrap">
            <div className="site-logo">
              <Link to="/" className="brand" aria-label="Tornado Home">
                <img
                  className="brand-logo"
                  src={logoUrl || '/logo/LOGO-TORNADO.svg'}
                  alt="Tornado"
                />
              </Link>
            </div>

            <div className="nav-actions-group">
              <nav className="main-nav" aria-label="Main navigation">
                <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                  HOME
                </Link>
                <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                  ABOUT US
                </Link>

                {/* Products dropdown */}
                <div className="nav-item-with-dropdown">
                  <Link
                    to="/products"
                    className={`has-dropdown nav-link ${isActive('/products') ? 'active' : ''}`}
                  >
                    PRODUCTS{' '}
                    <span className="dropdown-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                  <div className="dropdown-menu">
                    <Link to="/products/industrial-machinery">Industrial Machinery</Link>
                    <Link to="/products/telecommunications">Telecommunications Equipment</Link>
                    <Link to="/products/lightning-systems">
                      Lightning/Metrological Systems/Camera
                    </Link>
                    <Link to="/products/fire-fighting">Fire Fighting Equipment</Link>
                    <Link to="/products/it-hardware">IT Hardware & Software & Other Equipment</Link>
                  </div>
                </div>

                {/* Services dropdown */}
                <div className="nav-item-with-dropdown">
                  <Link
                    to="/services"
                    className={`has-dropdown nav-link ${isActive('/services') ? 'active' : ''}`}
                  >
                    SERVICES{' '}
                    <span className="dropdown-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                  <div className="dropdown-menu">
                    <Link to="/services/turnkey-solutions">Turnkey Solutions</Link>
                    <Link to="/services/project-management">Project Management</Link>
                    <Link to="/services/maintenance-support">
                      Maintenance Support/Service & Repair/Others
                    </Link>
                    <Link to="/services/import-export">Import & Export</Link>
                    <Link to="/services/contract-management">Contract Management</Link>
                  </div>
                </div>

                <Link
                  to="/partners"
                  className={`nav-link ${isActive('/partners') ? 'active' : ''}`}
                >
                  PARTNERS
                </Link>
              </nav>

              <div className="actions">
                <Link className="btn btn-contact" to="/contact-us">
                  CONTACT US
                </Link>

                <div className="btn btn-login" onClick={() => navigate('/admin')}>
                  Login
                </div>

                <button
                  className={`hamburger ${mobileOpen ? 'is-open' : ''}`}
                  onClick={() => setMobileOpen(v => !v)}
                  aria-label="Open menu"
                  aria-expanded={mobileOpen}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4 6H20M4 12H20M4 18H20"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile panel */}
          {mobileOpen && (
            <div className="mobile-panel">
              <nav className="mnav" aria-label="Mobile navigation">
                {MENU_CONFIG.map(menuItem => (
                  <div key={menuItem.id} className="mobile-menu-item">
                    {!menuItem.hasSubmenu ? (
                      menuItem.href.startsWith('#') ? (
                        <a
                          href={menuItem.href}
                          className="mobile-nav-link"
                          onClick={() => setMobileOpen(false)}
                        >
                          {menuItem.label}
                        </a>
                      ) : (
                        <Link
                          to={menuItem.href}
                          className={`mobile-nav-link ${isActive(menuItem.href) ? 'active' : ''}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {menuItem.label}
                        </Link>
                      )
                    ) : (
                      <>
                        <button
                          className={`mobile-nav-link mobile-nav-toggle ${
                            expandedMenus[menuItem.id] ? 'expanded' : ''
                          }`}
                          onClick={() => toggleMenu(menuItem.id)}
                          aria-expanded={expandedMenus[menuItem.id]}
                          aria-controls={`submenu-${menuItem.id}`}
                        >
                          <span>{menuItem.label}</span>
                          <span className="mobile-chevron">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20px"
                              height="20px"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M7 10L12 15L17 10"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </button>
                        {expandedMenus[menuItem.id] && (
                          <div
                            id={`submenu-${menuItem.id}`}
                            className="mobile-submenu"
                            role="region"
                          >
                            {menuItem.submenuItems.map(subItem => (
                              <Link
                                key={subItem.id}
                                to={subItem.href}
                                className="mobile-submenu-link"
                                onClick={() => setMobileOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
