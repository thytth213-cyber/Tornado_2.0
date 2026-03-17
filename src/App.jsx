import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Partner from "./pages/Partner";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

export default function App() {
  /*
    App-level developer comments:

    - Consider creating a `Layout` component that renders `Header` and
      `Footer` and accepts a `children` prop so route definitions are cleaner
      and layout changes are centralized. Example: <Layout><Outlet/></Layout>

    - Add an ErrorBoundary at a high level to catch render/runtime errors and
      show a friendly error screen instead of a blank app.

    - Currently `"/"` returns a composite of Header + Home + Footer. If you
      later convert this to multi-page or nested routes, using `Outlet` and
      nested `Route` will make maintenance easier.

    - Routes that need authentication are wrapped with `ProtectedRoute`.
      Ensure that `ProtectedRoute` performs robust validation (see comments
      in the component) rather than only checking for the presence of a token.
  */
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <Header />
              <About />
              <Footer />
            </>
          }
        />

        <Route
          path="/products"
          element={
            <>
              <Header />
              <Products />
              <Footer />
            </>
          }
        />

        <Route
          path="/products/:productId"
          element={
            <>
              <Header />
              <Products />
              <Footer />
            </>
          }
        />

        <Route
          path="/services"
          element={
            <>
              <Header />
              <Services />
              <Footer />
            </>
          }
        />

        <Route
          path="/services/:serviceId"
          element={
            <>
              <Header />
              <Services />
              <Footer />
            </>
          }
        />

        <Route
          path="/partners"
          element={
            <>
              <Header />
              <Partner />
              <Footer />
            </>
          }
        />

        <Route
          path="/contact-us"
          element={
            <>
              <Header />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* Admin Login */}
        <Route path="/admin" element={<Admin />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}