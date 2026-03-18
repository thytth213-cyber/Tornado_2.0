import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin-dashboard.css";

// API imports
import { 
  fetchContent, 
  saveContent, 
  deleteContent
} from "../api/contentApi";
import { 
  fetchAllProducts, 
  fetchProductCategories,
  createProduct, 
  updateProduct, 
  deleteProduct,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
} from "../api/productsApi";
import { 
  fetchAllServices, 
  fetchServiceCategories,
  createService, 
  updateService, 
  deleteService,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory
} from "../api/servicesApi";

const isProduction = import.meta.env.VITE_ENV === 'production';
const API_URL = (isProduction ? import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL)
  || "http://localhost:5000";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("content");
  const [adminUsername, setAdminUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // CONTENT STATE
  const [contentList, setContentList] = useState([]);
  const [contentEditing, setContentEditing] = useState(null);
  const [contentForm, setContentForm] = useState({
    section: "home-hero",
    title: "",
    body: "",
    mediaUrl: "",
    order: 0
  });
  const [showContentModal, setShowContentModal] = useState(false);

  // PRODUCT STATE
  const [productList, setProductList] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [productEditing, setProductEditing] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    category: "",
    price: 0,
    image: "",
    featured: false,
    order: 0
  });
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProductCategoryModal, setShowProductCategoryModal] = useState(false);
  const [productCategoryEditing, setProductCategoryEditing] = useState(null);
  const [productCategoryForm, setProductCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3498db",
    order: 0
  });

  // SERVICE STATE
  const [serviceList, setServiceList] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [serviceEditing, setServiceEditing] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    slug: "",
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    image: "",
    featured: false,
    order: 0,
    icon: ""
  });
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServiceCategoryModal, setShowServiceCategoryModal] = useState(false);
  const [serviceCategoryEditing, setServiceCategoryEditing] = useState(null);
  const [serviceCategoryForm, setServiceCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3498db",
    order: 0
  });

  // Initialize
  useEffect(() => {
    const u = localStorage.getItem("adminUsername") || localStorage.getItem("adminEmail");
    if (u) setAdminUsername(u);
  }, []);

  useEffect(() => {
    if (activeTab === "content") loadContent();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "products") {
      loadProducts();
      loadProductCategories();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "services") {
      loadServices();
      loadServiceCategories();
    }
  }, [activeTab]);

  // ==================== CONTENT FUNCTIONS ====================
  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await fetchContent();
      setContentList(data || []);
    } catch (err) {
      setErrorMsg("Failed to load content: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentSave = async () => {
    try {
      if (!contentForm.title || !contentForm.section) {
        setErrorMsg("Title and section are required");
        return;
      }
      setIsLoading(true);
      await saveContent(contentForm);
      setSuccessMsg("Content saved successfully");
      setShowContentModal(false);
      setContentForm({ section: "home-hero", title: "", body: "", mediaUrl: "", order: 0 });
      setContentEditing(null);
      await loadContent();
    } catch (err) {
      setErrorMsg("Failed to save content: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    try {
      setIsLoading(true);
      await deleteContent(id);
      setSuccessMsg("Content deleted successfully");
      await loadContent();
    } catch (err) {
      setErrorMsg("Failed to delete content: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openContentEditor = (item = null) => {
    if (item) {
      setContentForm(item);
      setContentEditing(item._id);
    } else {
      setContentForm({ section: "home-hero", title: "", body: "", mediaUrl: "", order: 0 });
      setContentEditing(null);
    }
    setShowContentModal(true);
  };

  // ==================== PRODUCT FUNCTIONS ====================
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllProducts();
      setProductList(data || []);
    } catch (err) {
      setErrorMsg("Failed to load products: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProductCategories = async () => {
    try {
      const data = await fetchProductCategories();
      setProductCategories(data || []);
    } catch (err) {
      console.warn("Failed to load product categories:", err);
    }
  };

  const handleProductSave = async () => {
    try {
      if (!productForm.name || !productForm.category) {
        setErrorMsg("Name and category are required");
        return;
      }
      setIsLoading(true);
      if (productEditing) {
        await updateProduct(productEditing, productForm);
      } else {
        await createProduct(productForm);
      }
      setSuccessMsg("Product saved successfully");
      setShowProductModal(false);
      setProductForm({ name: "", slug: "", description: "", shortDescription: "", category: "", price: 0, image: "", featured: false, order: 0 });
      setProductEditing(null);
      await loadProducts();
    } catch (err) {
      setErrorMsg("Failed to save product: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setIsLoading(true);
      await deleteProduct(id);
      setSuccessMsg("Product deleted successfully");
      await loadProducts();
    } catch (err) {
      setErrorMsg("Failed to delete product: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openProductEditor = (item = null) => {
    if (item) {
      setProductForm(item);
      setProductEditing(item._id);
    } else {
      setProductForm({ name: "", slug: "", description: "", shortDescription: "", category: "", price: 0, image: "", featured: false, order: 0 });
      setProductEditing(null);
    }
    setShowProductModal(true);
  };

  // Product Category Functions
  const handleProductCategorySave = async () => {
    try {
      if (!productCategoryForm.name || !productCategoryForm.slug) {
        setErrorMsg("Name and slug are required");
        return;
      }
      setIsLoading(true);
      if (productCategoryEditing) {
        await updateProductCategory(productCategoryEditing, productCategoryForm);
      } else {
        await createProductCategory(productCategoryForm);
      }
      setSuccessMsg("Product category saved successfully");
      setShowProductCategoryModal(false);
      setProductCategoryForm({ name: "", slug: "", description: "", color: "#3498db", order: 0 });
      setProductCategoryEditing(null);
      await loadProductCategories();
    } catch (err) {
      setErrorMsg("Failed to save product category: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductCategoryDelete = async (id) => {
    if (!confirm("Are you sure? This cannot be undone if products are assigned.")) return;
    try {
      setIsLoading(true);
      await deleteProductCategory(id);
      setSuccessMsg("Product category deleted successfully");
      await loadProductCategories();
      await loadProducts();
    } catch (err) {
      setErrorMsg("Failed to delete product category: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openProductCategoryEditor = (item = null) => {
    if (item) {
      setProductCategoryForm(item);
      setProductCategoryEditing(item._id);
    } else {
      setProductCategoryForm({ name: "", slug: "", description: "", color: "#3498db", order: 0 });
      setProductCategoryEditing(null);
    }
    setShowProductCategoryModal(true);
  };

  // ==================== SERVICE FUNCTIONS ====================
  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllServices();
      setServiceList(data || []);
    } catch (err) {
      setErrorMsg("Failed to load services: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadServiceCategories = async () => {
    try {
      const data = await fetchServiceCategories();
      setServiceCategories(data || []);
    } catch (err) {
      console.warn("Failed to load service categories:", err);
    }
  };

  const handleServiceSave = async () => {
    try {
      if (!serviceForm.name || !serviceForm.category) {
        setErrorMsg("Name and category are required");
        return;
      }
      setIsLoading(true);
      if (serviceEditing) {
        await updateService(serviceEditing, serviceForm);
      } else {
        await createService(serviceForm);
      }
      setSuccessMsg("Service saved successfully");
      setShowServiceModal(false);
      setServiceForm({ name: "", slug: "", title: "", description: "", shortDescription: "", category: "", image: "", featured: false, order: 0, icon: "" });
      setServiceEditing(null);
      await loadServices();
    } catch (err) {
      setErrorMsg("Failed to save service: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      setIsLoading(true);
      await deleteService(id);
      setSuccessMsg("Service deleted successfully");
      await loadServices();
    } catch (err) {
      setErrorMsg("Failed to delete service: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openServiceEditor = (item = null) => {
    if (item) {
      setServiceForm(item);
      setServiceEditing(item._id);
    } else {
      setServiceForm({ name: "", slug: "", title: "", description: "", shortDescription: "", category: "", image: "", featured: false, order: 0, icon: "" });
      setServiceEditing(null);
    }
    setShowServiceModal(true);
  };

  // Service Category Functions
  const handleServiceCategorySave = async () => {
    try {
      if (!serviceCategoryForm.name || !serviceCategoryForm.slug) {
        setErrorMsg("Name and slug are required");
        return;
      }
      setIsLoading(true);
      if (serviceCategoryEditing) {
        await updateServiceCategory(serviceCategoryEditing, serviceCategoryForm);
      } else {
        await createServiceCategory(serviceCategoryForm);
      }
      setSuccessMsg("Service category saved successfully");
      setShowServiceCategoryModal(false);
      setServiceCategoryForm({ name: "", slug: "", description: "", color: "#3498db", order: 0 });
      setServiceCategoryEditing(null);
      await loadServiceCategories();
    } catch (err) {
      setErrorMsg("Failed to save service category: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceCategoryDelete = async (id) => {
    if (!confirm("Are you sure? This cannot be undone if services are assigned.")) return;
    try {
      setIsLoading(true);
      await deleteServiceCategory(id);
      setSuccessMsg("Service category deleted successfully");
      await loadServiceCategories();
      await loadServices();
    } catch (err) {
      setErrorMsg("Failed to delete service category: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openServiceCategoryEditor = (item = null) => {
    if (item) {
      setServiceCategoryForm(item);
      setServiceCategoryEditing(item._id);
    } else {
      setServiceCategoryForm({ name: "", slug: "", description: "", color: "#3498db", order: 0 });
      setServiceCategoryEditing(null);
    }
    setShowServiceCategoryModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    navigate("/admin");
  };

  const clearMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };



  return (
    <div className="admin-dashboard-new">
      {/* HEADER */}
      <header className="admin-header-new">
        <div className="admin-header-content">
          <h1>Admin Management System</h1>
          <div className="admin-user-info">
            <span>Welcome, {adminUsername}</span>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      {errorMsg && (
        <div className="admin-alert admin-alert-error">
          {errorMsg}
          <button onClick={clearMessages} className="alert-close">×</button>
        </div>
      )}
      {successMsg && (
        <div className="admin-alert admin-alert-success">
          {successMsg}
          <button onClick={clearMessages} className="alert-close">×</button>
        </div>
      )}

      {/* TAB NAVIGATION */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
          onClick={() => { setActiveTab("content"); clearMessages(); }}
        >
          📝 Content
        </button>
        <button
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => { setActiveTab("products"); clearMessages(); }}
        >
          📦 Products
        </button>
        <button
          className={`tab-btn ${activeTab === "services" ? "active" : ""}`}
          onClick={() => { setActiveTab("services"); clearMessages(); }}
        >
          🔧 Services
        </button>
      </div>

      <div className="admin-container">
        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="admin-tab-content">
            <div className="admin-section-header">
              <h2>Content Management</h2>
              <button onClick={() => openContentEditor()} className="btn btn-primary">+ Add Content</button>
            </div>

            {isLoading ? (
              <p className="loading-text">Loading...</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Title</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentList && contentList.map((item) => (
                      <tr key={item._id}>
                        <td>{item.section}</td>
                        <td>{item.title || "—"}</td>
                        <td>{item.order}</td>
                        <td>
                          <button onClick={() => openContentEditor(item)} className="btn-sm btn-edit">Edit</button>
                          <button onClick={() => handleContentDelete(item._id)} className="btn-sm btn-delete">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!contentList || contentList.length === 0) && <p className="empty-text">No content found</p>}
              </div>
            )}

            {/* Content Modal */}
            {showContentModal && (
              <div className="modal-overlay" onClick={() => setShowContentModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{contentEditing ? "Edit Content" : "Add Content"}</h3>
                    <button onClick={() => setShowContentModal(false)} className="modal-close">×</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Section:</label>
                      <select value={contentForm.section} onChange={(e) => setContentForm({ ...contentForm, section: e.target.value })}>
                        <option value="home-hero">Home Hero</option>
                        <option value="home-about">Home About</option>
                        <option value="home-projects">Home Projects</option>
                        <option value="about-hero">About Hero</option>
                        <option value="about-story">About Story</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Title:</label>
                      <input type="text" value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Body:</label>
                      <textarea value={contentForm.body} onChange={(e) => setContentForm({ ...contentForm, body: e.target.value })} rows="4"></textarea>
                    </div>
                    <div className="form-group">
                      <label>Media URL:</label>
                      <input type="text" value={contentForm.mediaUrl} onChange={(e) => setContentForm({ ...contentForm, mediaUrl: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Order:</label>
                      <input type="number" value={contentForm.order} onChange={(e) => setContentForm({ ...contentForm, order: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => setShowContentModal(false)} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleContentSave} className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="admin-tab-content">
            {/* Product Categories Section */}
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>Product Categories</h2>
                <button onClick={() => openProductCategoryEditor()} className="btn btn-primary">+ Add Category</button>
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Color</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productCategories && productCategories.map((cat) => (
                      <tr key={cat._id}>
                        <td>{cat.name}</td>
                        <td>{cat.slug}</td>
                        <td><span className="color-swatch" style={{ backgroundColor: cat.color }}></span></td>
                        <td>{cat.order}</td>
                        <td>
                          <button onClick={() => openProductCategoryEditor(cat)} className="btn-sm btn-edit">Edit</button>
                          <button onClick={() => handleProductCategoryDelete(cat._id)} className="btn-sm btn-delete">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!productCategories || productCategories.length === 0) && <p className="empty-text">No categories found</p>}
              </div>
            </div>

            {/* Products Section */}
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>Products</h2>
                <button onClick={() => openProductEditor()} className="btn btn-primary">+ Add Product</button>
              </div>
              {isLoading ? (
                <p className="loading-text">Loading...</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Featured</th>
                        <th>Order</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList && productList.map((prod) => (
                        <tr key={prod._id}>
                          <td>{prod.name}</td>
                          <td>{prod.category?.name || "—"}</td>
                          <td>{prod.featured ? "✓ Yes" : "No"}</td>
                          <td>{prod.order}</td>
                          <td>
                            <button onClick={() => openProductEditor(prod)} className="btn-sm btn-edit">Edit</button>
                            <button onClick={() => handleProductDelete(prod._id)} className="btn-sm btn-delete">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!productList || productList.length === 0) && <p className="empty-text">No products found</p>}
                </div>
              )}
            </div>

            {/* Product Category Modal */}
            {showProductCategoryModal && (
              <div className="modal-overlay" onClick={() => setShowProductCategoryModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{productCategoryEditing ? "Edit Category" : "Add Category"}</h3>
                    <button onClick={() => setShowProductCategoryModal(false)} className="modal-close">×</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Name:</label>
                      <input type="text" value={productCategoryForm.name} onChange={(e) => setProductCategoryForm({ ...productCategoryForm, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Slug:</label>
                      <input type="text" value={productCategoryForm.slug} onChange={(e) => setProductCategoryForm({ ...productCategoryForm, slug: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea value={productCategoryForm.description} onChange={(e) => setProductCategoryForm({ ...productCategoryForm, description: e.target.value })} rows="2"></textarea>
                    </div>
                    <div className="form-group">
                      <label>Color:</label>
                      <input type="color" value={productCategoryForm.color} onChange={(e) => setProductCategoryForm({ ...productCategoryForm, color: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Order:</label>
                      <input type="number" value={productCategoryForm.order} onChange={(e) => setProductCategoryForm({ ...productCategoryForm, order: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => setShowProductCategoryModal(false)} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleProductCategorySave} className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Modal */}
            {showProductModal && (
              <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
                <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{productEditing ? "Edit Product" : "Add Product"}</h3>
                    <button onClick={() => setShowProductModal(false)} className="modal-close">×</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Name:</label>
                      <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Slug:</label>
                      <input type="text" value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Category:</label>
                      <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                        <option value="">-- Select Category --</option>
                        {productCategories && productCategories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-row-two">
                      <div className="form-group">
                        <label>Short Description:</label>
                        <input type="text" value={productForm.shortDescription} onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Price:</label>
                        <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows="3"></textarea>
                    </div>
                    <div className="form-group">
                      <label>Image URL:</label>
                      <input type="text" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
                    </div>
                    <div className="form-row-two">
                      <div className="form-group">
                        <label>Order:</label>
                        <input type="number" value={productForm.order} onChange={(e) => setProductForm({ ...productForm, order: Number(e.target.value) })} />
                      </div>
                    </div>
                    <div className="form-group-checks">
                      <label>
                        <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} />
                        Featured on homepage
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => setShowProductModal(false)} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleProductSave} className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === "services" && (
          <div className="admin-tab-content">
            {/* Service Categories Section */}
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>Service Categories</h2>
                <button onClick={() => openServiceCategoryEditor()} className="btn btn-primary">+ Add Category</button>
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Color</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceCategories && serviceCategories.map((cat) => (
                      <tr key={cat._id}>
                        <td>{cat.name}</td>
                        <td>{cat.slug}</td>
                        <td><span className="color-swatch" style={{ backgroundColor: cat.color }}></span></td>
                        <td>{cat.order}</td>
                        <td>
                          <button onClick={() => openServiceCategoryEditor(cat)} className="btn-sm btn-edit">Edit</button>
                          <button onClick={() => handleServiceCategoryDelete(cat._id)} className="btn-sm btn-delete">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!serviceCategories || serviceCategories.length === 0) && <p className="empty-text">No categories found</p>}
              </div>
            </div>

            {/* Services Section */}
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>Services</h2>
                <button onClick={() => openServiceEditor()} className="btn btn-primary">+ Add Service</button>
              </div>
              {isLoading ? (
                <p className="loading-text">Loading...</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Featured</th>
                        <th>Order</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceList && serviceList.map((svc) => (
                        <tr key={svc._id}>
                          <td>{svc.name}</td>
                          <td>{svc.category?.name || "—"}</td>
                          <td>{svc.featured ? "✓ Yes" : "No"}</td>
                          <td>{svc.order}</td>
                          <td>
                            <button onClick={() => openServiceEditor(svc)} className="btn-sm btn-edit">Edit</button>
                            <button onClick={() => handleServiceDelete(svc._id)} className="btn-sm btn-delete">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!serviceList || serviceList.length === 0) && <p className="empty-text">No services found</p>}
                </div>
              )}
            </div>

            {/* Service Category Modal */}
            {showServiceCategoryModal && (
              <div className="modal-overlay" onClick={() => setShowServiceCategoryModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{serviceCategoryEditing ? "Edit Category" : "Add Category"}</h3>
                    <button onClick={() => setShowServiceCategoryModal(false)} className="modal-close">×</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Name:</label>
                      <input type="text" value={serviceCategoryForm.name} onChange={(e) => setServiceCategoryForm({ ...serviceCategoryForm, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Slug:</label>
                      <input type="text" value={serviceCategoryForm.slug} onChange={(e) => setServiceCategoryForm({ ...serviceCategoryForm, slug: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea value={serviceCategoryForm.description} onChange={(e) => setServiceCategoryForm({ ...serviceCategoryForm, description: e.target.value })} rows="2"></textarea>
                    </div>
                    <div className="form-group">
                      <label>Color:</label>
                      <input type="color" value={serviceCategoryForm.color} onChange={(e) => setServiceCategoryForm({ ...serviceCategoryForm, color: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Order:</label>
                      <input type="number" value={serviceCategoryForm.order} onChange={(e) => setServiceCategoryForm({ ...serviceCategoryForm, order: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => setShowServiceCategoryModal(false)} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleServiceCategorySave} className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Service Modal */}
            {showServiceModal && (
              <div className="modal-overlay" onClick={() => setShowServiceModal(false)}>
                <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{serviceEditing ? "Edit Service" : "Add Service"}</h3>
                    <button onClick={() => setShowServiceModal(false)} className="modal-close">×</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Name:</label>
                      <input type="text" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Slug:</label>
                      <input type="text" value={serviceForm.slug} onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Title:</label>
                      <input type="text" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Category:</label>
                      <select value={serviceForm.category} onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}>
                        <option value="">-- Select Category --</option>
                        {serviceCategories && serviceCategories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Short Description:</label>
                      <input type="text" value={serviceForm.shortDescription} onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} rows="3"></textarea>
                    </div>
                    <div className="form-row-two">
                      <div className="form-group">
                        <label>Image URL:</label>
                        <input type="text" value={serviceForm.image} onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Icon URL:</label>
                        <input type="text" value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-row-two">
                      <div className="form-group">
                        <label>Order:</label>
                        <input type="number" value={serviceForm.order} onChange={(e) => setServiceForm({ ...serviceForm, order: Number(e.target.value) })} />
                      </div>
                    </div>
                    <div className="form-group-checks">
                      <label>
                        <input type="checkbox" checked={serviceForm.featured} onChange={(e) => setServiceForm({ ...serviceForm, featured: e.target.checked })} />
                        Featured on homepage
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => setShowServiceModal(false)} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleServiceSave} className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}