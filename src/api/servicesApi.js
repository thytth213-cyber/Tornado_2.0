// src/api/servicesApi.js
// API wrapper for service-related frontend actions

const isProduction = import.meta.env.VITE_ENV === 'production';
const API_URL = (isProduction ? import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL)
  || "http://localhost:5000";

function authHeaders() {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ========== PUBLIC SERVICE ROUTES ==========

export async function fetchServices() {
  const res = await fetch(`${API_URL}/api/services`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch services (${res.status})`);
  }
  return res.json();
}

export async function fetchFeaturedServices() {
  const res = await fetch(`${API_URL}/api/services/featured/list`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch featured services (${res.status})`);
  }
  return res.json();
}

export async function fetchServicesByCategory(categorySlug) {
  const res = await fetch(`${API_URL}/api/services/category/${categorySlug}`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch services by category (${res.status})`);
  }
  return res.json();
}

export async function fetchServiceDetail(id) {
  const res = await fetch(`${API_URL}/api/services/${id}`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch service detail (${res.status})`);
  }
  return res.json();
}

// ========== PUBLIC CATEGORY ROUTES ==========

export async function fetchServiceCategories() {
  const res = await fetch(`${API_URL}/api/services/categories/all`, {
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch categories (${res.status})`);
  }
  return res.json();
}

// ========== ADMIN SERVICE ROUTES ==========

export async function fetchAllServices() {
  const res = await fetch(`${API_URL}/api/services/admin/all`, {
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
    throw new Error(err || `Failed to fetch services (${res.status})`);
  }
  return res.json();
}

export async function createService(serviceData) {
  const res = await fetch(`${API_URL}/api/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify(serviceData)
  });
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/admin';
    throw new Error('Invalid or expired token');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err && err.message) || `Failed to create service (${res.status})`);
  }
  return res.json();
}

export async function updateService(id, serviceData) {
  const res = await fetch(`${API_URL}/api/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify({ id, ...serviceData })
  });
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/admin';
    throw new Error('Invalid or expired token');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err && err.message) || `Failed to update service (${res.status})`);
  }
  return res.json();
}

export async function deleteService(id) {
  const res = await fetch(`${API_URL}/api/services/${id}`, {
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
    throw new Error((err && err.message) || `Failed to delete service (${res.status})`);
  }
  return res.json();
}

// ========== ADMIN CATEGORY ROUTES ==========

export async function createServiceCategory(categoryData) {
  const res = await fetch(`${API_URL}/api/services/categories`, {
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

export async function updateServiceCategory(id, categoryData) {
  const res = await fetch(`${API_URL}/api/services/categories`, {
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

export async function deleteServiceCategory(id) {
  const res = await fetch(`${API_URL}/api/services/categories/${id}`, {
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
