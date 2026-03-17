import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={{
          ...styles.content,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out"
        }}>
          {/* Logo Tornado with animation */}
          <div style={styles.logoContainer}>
            <img
              src="/logo/LOGO-TORNADO.svg"
              alt="Tornado Logo"
              style={styles.logo}
            />
          </div>

          {/* 404 Text with gradient */}
          <h1 style={styles.title}>404</h1>

          <div style={styles.divider}></div>

          <h2 style={styles.subtitle}>Trang không tồn tại</h2>
          <p style={styles.text}>
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>

          {/* Animated button */}
          <Link to="/" style={styles.button} className="btn-404">
            <span style={styles.buttonIcon}>←</span>
            Quay về Trang chủ
          </Link>

          {/* Decorative elements */}
          <div style={styles.decorCircle1}></div>
          <div style={styles.decorCircle2}></div>
          <div style={styles.decorCircle3}></div>
        </div>
      </div>
    </>
  );
}

const keyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.5; }
  }

  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .btn-404:hover {
    transform: translateY(-3px) scale(1.05) !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
  }
`;

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #533483)",
    backgroundSize: "400% 400%",
    animation: "gradient 15s ease infinite",
    fontFamily: "system-ui, -apple-system, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  content: {
    textAlign: "center",
    color: "white",
    padding: "2rem",
    position: "relative",
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: "2rem",
    animation: "float 3s ease-in-out infinite",
  },
  logo: {
    width: "120px",
    height: "120px",
    filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
  },
  title: {
    fontSize: "clamp(4rem, 15vw, 10rem)",
    fontWeight: "900",
    margin: "0",
    lineHeight: "1",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "none",
    letterSpacing: "-0.05em",
  },
  divider: {
    width: "100px",
    height: "4px",
    background: "linear-gradient(90deg, transparent, #667eea, transparent)",
    margin: "1.5rem auto",
    borderRadius: "2px",
    animation: "slideIn 1s ease-out",
  },
  subtitle: {
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
    fontWeight: "700",
    margin: "1rem 0",
    color: "#f0f0f0",
  },
  text: {
    fontSize: "clamp(1rem, 2vw, 1.25rem)",
    marginBottom: "2.5rem",
    opacity: "0.85",
    maxWidth: "500px",
    margin: "0 auto 2.5rem",
    lineHeight: "1.6",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 2.5rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    textDecoration: "none",
    borderRadius: "50px",
    fontWeight: "700",
    fontSize: "1.125rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
    border: "2px solid rgba(255,255,255,0.2)",
    position: "relative",
    overflow: "hidden",
  },
  buttonIcon: {
    fontSize: "1.5rem",
    transition: "transform 0.3s ease",
  },
  decorCircle1: {
    position: "absolute",
    top: "10%",
    left: "10%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(102,126,234,0.3) 0%, transparent 70%)",
    animation: "pulse 4s ease-in-out infinite",
    zIndex: 0,
  },
  decorCircle2: {
    position: "absolute",
    bottom: "15%",
    right: "15%",
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(118,75,162,0.3) 0%, transparent 70%)",
    animation: "pulse 5s ease-in-out infinite 1s",
    zIndex: 0,
  },
  decorCircle3: {
    position: "absolute",
    top: "50%",
    right: "5%",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(240,147,251,0.2) 0%, transparent 70%)",
    animation: "pulse 6s ease-in-out infinite 2s",
    zIndex: 0,
  },
};
