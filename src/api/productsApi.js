// src/api/productsApi.js
// API wrapper for product-related frontend actions

const isProduction = import.meta.env.VITE_ENV === 'production';
const API_URL = (isProduction ? import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL)
  || "http://localhost:5000";

function authHeaders() {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ========== PUBLIC PRODUCT ROUTES ==========

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/products`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch products (${res.status})`);
  }
  return res.json();
}

export async function fetchFeaturedProducts() {
  const res = await fetch(`${API_URL}/api/products/featured/list`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch featured products (${res.status})`);
  }
  return res.json();
}

export async function fetchProductsByCategory(categorySlug) {
  const res = await fetch(`${API_URL}/api/products/category/${categorySlug}`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch products by category (${res.status})`);
  }
  return res.json();
}

export async function fetchProductDetail(id) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch product detail (${res.status})`);
  }
  return res.json();
}

// ========== PUBLIC CATEGORY ROUTES ==========

export async function fetchProductCategories() {
  const res = await fetch(`${API_URL}/api/products/categories/all`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch categories (${res.status})`);
  }
  return res.json();
}

// ========== ADMIN PRODUCT ROUTES ==========

export async function fetchAllProducts() {
  const res = await fetch(`${API_URL}/api/products/admin/all`, {
    method: "GET",
    headers: authHeaders()
  });
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/admin';
    throw new Error('Invalid or expired token');
  }
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch products (${res.status})`);
  }
  return res.json();
}

export async function createProduct(productData) {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify(productData)
  });
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/admin';
    throw new Error('Invalid or expired token');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err && err.message) || `Failed to create product (${res.status})`);
  }
  return res.json();
}

export async function updateProduct(id, productData) {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify({ id, ...productData })
  });
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/admin';
    throw new Error('Invalid or expired token');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err && err.message) || `Failed to update product (${res.status})`);
  }
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/admin';
    throw new Error('Invalid or expired token');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err && err.message) || `Failed to delete product (${res.status})`);
  }
  return res.json();
}

// ========== ADMIN CATEGORY ROUTES ==========

export async function createProductCategory(categoryData) {
  const res = await fetch(`${API_URL}/api/products/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify(categoryData)
  });
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/admin';
    throw new Error('Invalid or expired token');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err && err.message) || `Failed to create category (${res.status})`);
  }
  return res.json();
}

export async function updateProductCategory(id, categoryData) {
  const res = await fetch(`${API_URL}/api/products/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify({ id, ...categoryData })
  });
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/admin';
    throw new Error('Invalid or expired token');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err && err.message) || `Failed to update category (${res.status})`);
  }
  return res.json();
}

export async function deleteProductCategory(id) {
  const res = await fetch(`${API_URL}/api/products/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/admin';
    throw new Error('Invalid or expired token');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err && err.message) || `Failed to delete category (${res.status})`);
  }
  return res.json();
}
