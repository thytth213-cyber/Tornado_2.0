import { Link } from 'react-router-dom';
import '../styles/footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <h2>Helping you stay ahead with changes and challenges.</h2>
        </div>
        <hr />

        <div className="footer-grid">
          <div className="footer-col-1">
            <div className="footer-logo">
              <img
                src="/assets/logo-tornado.jpg"
                alt="B&G CONSULTANT logo"
                className="footer-logo-img"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
              <div className="logo-text">
                <span className="brand-bg">TORNADO</span>
              </div>
            </div>

            <p style={{ fontSize: '16px' }}>
              Our support for our customers does not stop at the completion of projects or delivery
              of solutions.
            </p>

            <div className="social">
              <a
                href="https://www.facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="24px"
                  height="24px"
                  viewBox="0 0 48 48"
                  version="1.1"
                >
                  <title>Facebook-color</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0">
                      <path
                        d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z"
                        id="Facebook"
                      ></path>
                    </g>
                  </g>
                </svg>
              </a>

              <a
                href="https://twitter.com"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="24px"
                  height="24px"
                  viewBox="0 -4 48 48"
                  version="1.1"
                >
                  <title>Twitter-color</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Color-" transform="translate(-300.000000, -164.000000)" fill="#00AAEC">
                      <path
                        d="M348,168.735283 C346.236309,169.538462 344.337383,170.081618 342.345483,170.324305 C344.379644,169.076201 345.940482,167.097147 346.675823,164.739617 C344.771263,165.895269 342.666667,166.736006 340.418384,167.18671 C338.626519,165.224991 336.065504,164 333.231203,164 C327.796443,164 323.387216,168.521488 323.387216,174.097508 C323.387216,174.88913 323.471738,175.657638 323.640782,176.397255 C315.456242,175.975442 308.201444,171.959552 303.341433,165.843265 C302.493397,167.339834 302.008804,169.076201 302.008804,170.925244 C302.008804,174.426869 303.747139,177.518238 306.389857,179.329722 C304.778306,179.280607 303.256911,178.821235 301.9271,178.070061 L301.9271,178.194294 C301.9271,183.08848 305.322064,187.17082 309.8299,188.095341 C309.004402,188.33225 308.133826,188.450704 307.235077,188.450704 C306.601162,188.450704 305.981335,188.390033 305.381229,188.271578 C306.634971,192.28169 310.269414,195.2026 314.580032,195.280607 C311.210424,197.99061 306.961789,199.605634 302.349709,199.605634 C301.555203,199.605634 300.769149,199.559408 300,199.466956 C304.358514,202.327194 309.53689,204 315.095615,204 C333.211481,204 343.114633,188.615385 343.114633,175.270495 C343.114633,174.831347 343.106181,174.392199 343.089276,173.961719 C345.013559,172.537378 346.684275,170.760563 348,168.735283"
                        id="Twitter"
                      ></path>
                    </g>
                  </g>
                </svg>
              </a>
            </div>
            <div className="footer-divider"></div>
          </div>

          <div className="footer-col-2">
            <h4>Quick Links</h4>
            <div className="f-links">
              <Link to="/" className="active">
                Home
              </Link>
              <Link to="/about">About Us</Link>
              <Link to="/products">Products</Link>
              <Link to="/services">Services</Link>
              <Link to="/partners">Partners</Link>
              <Link to="/contact-us">Contact Us</Link>
            </div>
          </div>

          <div className="footer-col-3">
            <h4>Contact Information</h4>
            <div className="f-links">
              <p>Room 1702, Sino Centre, 582-592 Nathan Rd., Mongkok, Kowloon, Hong Kong</p>
              <a href="tel:+85223841431" className="contact-item">
                <strong>Tel:</strong> +852 23841431
              </a>
              <a href="mailto:sale@tornado.biz" className="contact-item">
                <strong>Email:</strong> sale@tornado.biz
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-container">
          <div className="copyright">
            <span>
              © 2017 - {new Date().getFullYear()} <strong>TORNADO INDUSTRIAL CO., LIMITED</strong>.
              All Rights Reserved. Design by Vodien
            </span>
          </div>
          <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="#fff"
              height="24px"
              width="24px"
              version="1.1"
              id="Layer_1"
              viewBox="0 0 511.735 511.735"
              xmlSpace="preserve"
            >
              <g>
                <g>
                  <path d="M508.788,371.087L263.455,125.753c-4.16-4.16-10.88-4.16-15.04,0L2.975,371.087c-4.053,4.267-3.947,10.987,0.213,15.04    c4.16,3.947,10.667,3.947,14.827,0l237.867-237.76l237.76,237.76c4.267,4.053,10.987,3.947,15.04-0.213    C512.734,381.753,512.734,375.247,508.788,371.087z" />
                </g>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
