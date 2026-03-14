import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin-dashboard.css";
import { fetchContent as apiFetchContent, uploadFile as apiUploadFile, saveContent as apiSaveContent, deleteContent as apiDeleteContent, listMedia as apiListMedia } from "../api/contentApi";
import { getLogo as apiGetLogo, saveLogo as apiSaveLogo } from "../api/settingsApi";

const isProduction = import.meta.env.VITE_ENV === 'production';
const API_URL = (isProduction ? import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL)
  || "http://localhost:5000";

export default function AdminDashboard() {
  const pages = useMemo(
    () => [
      { key: "home", label: "Home", sections: ["home-hero","home-about","home-projects","home-partners","home-contact"] },
      { key: "about", label: "About", sections: ["about-hero","about-story"] },
      { key: "solutions", label: "Solutions", sections: ["solutions-hero","solutions-list"] },
      { key: "projects", label: "Projects", sections: ["projects-hero","projects-list"] },
      { key: "pricing", label: "Pricing", sections: ["pricing-hero","pricing-plans"] },
      { key: "partners", label: "Partners", sections: ["partners-hero","partners-list"] },
      { key: "stats", label: "Stats", sections: ["stats-main"] },
      { key: "contact", label: "Contact", sections: ["contact-main"] },
      // site-level settings (admin-controlled)
      { key: "settings", label: "Settings", sections: ["header-logo"] },
    ],
    []
  );

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ section: "home-hero", title: "", body: "", mediaUrl: "", order: 0 });
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadSection, setUploadSection] = useState(formData.section || "");
  const [adminUsername, setAdminUsername] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState("");
  const [currentLogoUrl, setCurrentLogoUrl] = useState("");
  const [brandingSaving, setBrandingSaving] = useState(false);
  const [filterPage, setFilterPage] = useState("home");
  const [filterSection, setFilterSection] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    loadMedia();
  }, []);

  useEffect(() => {
    setUploadSection(formData.section || "");
  }, [formData.section]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiGetLogo();
        if (mounted && res && res.logoUrl) setCurrentLogoUrl(res.logoUrl);
      } catch (err) {
        console.warn('Could not load site logo', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const u = localStorage.getItem("adminUsername") || localStorage.getItem("adminEmail");
        if (u) setAdminUsername(u);
      }
    } catch (err) {
      console.warn("Could not read localStorage:", err);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const normalizeUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('blob:')) return url;
    return /^https?:\/\//i.test(url) ? url : `${API_URL}${url}`;
  };

  const loadContent = async () => {
    try {
      const data = await apiFetchContent();
      setContent(data || []);
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = (sectionKey) => {
    setEditingId(null);
    setFormData({ section: sectionKey || `${filterPage}-hero`, title: "", body: "", mediaUrl: "", order: 0 });
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({ section: item.section, title: item.title || "", body: item.body || "", mediaUrl: item.mediaUrl || "", order: item.order || 0 });
  };

  const handleUploadFile = async (file, section) => {
    if (!file) return null;
    setFileUploading(true);
    try {
      // prefer explicit section param, fall back to current form section
      const sectionToSend = section || formData.section || uploadSection || '';
      const data = await apiUploadFile(file, sectionToSend);
      const url = data && data.url ? data.url : null;
      if (url) {
        setMediaList((cur) => [{ filename: url.split('/').pop(), url, ext: (url.split('.').pop() || '').toLowerCase(), createdAt: new Date().toISOString() }, ...cur]);
        setSelectedMediaUrl(url);
        setFormData((f) => ({ ...f, mediaUrl: url }));
      }
      console.log('Upload response:', data);
      if (url) {
        alert('Upload successful');
      }
      return url;
    } catch (err) {
  console.error("Upload error", err);
  alert(err.message || 'Upload failed');
      return null;
    } finally {
      setFileUploading(false);
    }
  };

  const loadMedia = async () => {
    setMediaLoading(true);
    try {
      const list = await apiListMedia();
      setMediaList(list || []);
    } catch (err) {
      console.error('Error loading media:', err);
      setMediaList([]);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleSelectMedia = (item) => {
    if (!item) return;
    setSelectedMediaUrl(item.url);
    setFormData((f) => ({ ...f, mediaUrl: item.url }));
  };

  const handleSaveLogo = async () => {
    setBrandingSaving(true);
    try {
      let finalLogoUrl = selectedMediaUrl;

      if (pendingFile) {
        setFileUploading(true);
        try {
          const uploadedUrl = await handleUploadFile(pendingFile, 'logo');
          if (uploadedUrl) {
            finalLogoUrl = uploadedUrl;
          }
          setPendingFile(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl("");
          }
        } catch (err) {
          console.error("Upload failed during save logo:", err);
          return alert("Upload failed. Please try again.");
        } finally {
          setFileUploading(false);
        }
      }

      if (!finalLogoUrl) return alert('Please select a media item or upload an image to use as logo');

      await apiSaveLogo(finalLogoUrl);
      setCurrentLogoUrl(finalLogoUrl);
      setSelectedMediaUrl(finalLogoUrl);
      // notify header to update immediately
      window.dispatchEvent(new CustomEvent('siteLogoUpdated', { detail: { logoUrl: finalLogoUrl } }));
      alert('Logo saved');
    } catch (err) {
      console.error('Save logo failed', err);
      alert(err.message || 'Save logo failed');
    } finally {
      setBrandingSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.section) return alert("Please select a section");

      let finalMediaUrl = formData.mediaUrl;
      if (pendingFile) {
        setFileUploading(true);
        try {
          const uploadedUrl = await handleUploadFile(pendingFile, formData.section);
          if (uploadedUrl) {
            finalMediaUrl = uploadedUrl;
          }
          setPendingFile(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl("");
          }
        } catch (err) {
          console.error("Upload failed during save:", err);
          return alert("Upload failed. Please try again.");
        } finally {
          setFileUploading(false);
        }
      }

      if (formData.section === 'header-logo') {
        if (!finalMediaUrl) return alert('Please select or upload an image to use as the header logo');
        setBrandingSaving(true);
        try {
          const payload = { logoUrl: finalMediaUrl };
          console.log('Saving payload:', payload);
          const result = await apiSaveLogo(finalMediaUrl);
          console.log('Save response:', result);
          setCurrentLogoUrl(finalMediaUrl);
          window.dispatchEvent(new CustomEvent('siteLogoUpdated', { detail: { logoUrl: finalMediaUrl } }));
          setFilterPage('settings');
          setFilterSection('header-logo');
          await loadContent();
          alert('Header logo updated successfully');
          setEditingId(null);
          setFormData({ section: `${filterPage}-hero`, title: "", body: "", mediaUrl: "", order: 0 });
          await loadMedia();
        } catch (err) {
          console.error('Save failed:', err);
          alert(err.message || 'Save failed');
        } finally {
          setBrandingSaving(false);
        }
        return;
      }

      const payload = {
        id: editingId,
        section: formData.section,
        title: formData.title,
        body: formData.body,
        mediaUrl: finalMediaUrl,
        order: Number(formData.order) || 0,
      };

      try {
        console.log('Saving payload:', payload);
        const result = await apiSaveContent(payload);
        console.log('Save response:', result);

        const pageKey = (payload.section || '').split('-')[0] || filterPage;
        setFilterPage(pageKey);
        setFilterSection(payload.section);

        await loadContent();

        alert('Content saved successfully');

        setEditingId(null);
        setFormData({ section: payload.section, title: "", body: "", mediaUrl: "", order: 0 });
      } catch (err) {
        console.error('Save failed:', err);
        alert(err.message || 'Save failed');
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      try {
        await apiDeleteContent(id);
        loadContent();
      } catch (err) {
        console.error(err);
        alert(err.message || "Delete failed");
      }
    } catch (err) {
      console.error("Error deleting content:", err);
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    navigate("/admin");
  };

  const currentPage = pages.find((p) => p.key === filterPage) || pages[0];
  const availableSections = currentPage.sections || [];
  const effectiveSection = filterSection || availableSections[0];

  const filtered = content
    .filter((c) => c.section && c.section.startsWith(filterPage))
    .filter((c) => (filterSection ? c.section === filterSection : true))
    .sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Content Management Dashboard</h1>
        <div className="admin-header-right">
          <span>Logged in as: {adminUsername}</span>
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-controls">
        <div className="controls-header">
          <h3>Page / Section</h3>
        </div>
        <label>Page:</label>
        <select value={filterPage} onChange={(e) => { setFilterPage(e.target.value); setFilterSection(""); }}>
          {pages.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>

        <label>Section:</label>
        <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
          <option value="">-- all --</option>
          {availableSections.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button className="btn" onClick={() => openCreate(effectiveSection)}>Create New in Section</button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading content...</div>
      ) : (
        <div className="admin-content">
          <div className="content-wrap">
            <div className="content-main">
              <div className="content-list">
                <div className="content-item content-form">
                  <h3>{editingId ? "Edit Item" : "Create Item"}</h3>
                  <div className="form-row">
                    <label>Section</label>
                    <select value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })}>
                      {pages.flatMap(p => p.sections).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Order</label>
                    <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} />
                  </div>
                  <div className="form-row">
                    <label>Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <label>Body</label>
                    <textarea value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <label>Media URL</label>
                    <input type="text" value={formData.mediaUrl} onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })} placeholder="/uploads/filename.jpg or full URL" />
                  </div>
                  <div className="form-row">
                    <label>Upload Image</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!formData.section) return alert('Please select a section for this content before uploading');

                      setPendingFile(file);

                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                      }
                      const localUrl = URL.createObjectURL(file);
                      setPreviewUrl(localUrl);
                      setFormData({ ...formData, mediaUrl: localUrl });
                    }} />
                    {fileUploading && <span>Uploading...</span>}
                    {pendingFile && !fileUploading && <span style={{ color: '#f59e0b' }}>📁 File ready - will upload on Save</span>}
                  </div>
                  {formData.section === 'header-logo' && (
                    <div className="form-row">
                      <label>Header Logo</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 13, color: '#64748b' }}>Choose or upload an image and click Create to set the site header logo.</div>
                        <input type="text" value={formData.mediaUrl} readOnly placeholder="Select or upload an image from the media library" />
                        {formData.mediaUrl && (
                          <img src={normalizeUrl(formData.mediaUrl)} alt="header-logo-preview" style={{ maxWidth: 260, maxHeight: 80 }} />
                        )}
                      </div>
                    </div>
                  )}
                  {formData.mediaUrl && (
                    <div className="form-row">
                      <label>Preview</label>
                      <img src={normalizeUrl(formData.mediaUrl)} alt="preview" style={{ maxWidth: 200 }} />
                    </div>
                  )}
                  <div className="form-actions">
                    <button onClick={handleSave} className="btn btn-primary">{editingId ? 'Save Changes' : 'Create'}</button>
                    <button onClick={() => {
                      setEditingId(null);
                      setFormData({ section: `${filterPage}-hero`, title: '', body: '', mediaUrl: '', order: 0 });
                      setPendingFile(null);
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl('');
                      }
                    }} className="btn btn-outline">Reset</button>
                  </div>
                </div>

                {filtered.map((item) => (
                  <div key={item._id} className="content-item">
                    <div className="content-preview">
                      {item.mediaUrl && (<img src={normalizeUrl(item.mediaUrl)} alt={item.title} className="content-image" />)}
                      <h3>{item.title || '(no title)'}</h3>
                      <p><strong>Section:</strong> {item.section} <strong>Order:</strong> {item.order}</p>
                      <p>{item.body}</p>
                    </div>
                    <div className="content-actions">
                      <button onClick={() => handleEdit(item)} className="btn btn-primary">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="media-library">
              <div className="media-header">
                <h3>Media Library</h3>
                <div className="media-sub">Click an item to select it for the form</div>
              </div>
              <div className="branding-panel">
                <h4>Site Branding</h4>
                <div className="branding-preview">
                  <div className="branding-label">Current Logo</div>
                  {currentLogoUrl ? (
                    <img src={normalizeUrl(currentLogoUrl)} alt="Current logo" style={{ maxWidth: '100%', maxHeight: 80 }} />
                  ) : (
                    <div className="media-empty">No logo set</div>
                  )}
                </div>

                <div className="branding-select">
                  <div className="branding-label">Selected Logo URL</div>
                  <input type="text" value={selectedMediaUrl || ''} readOnly placeholder="Select an image from the media library" />
                </div>

                <div className="branding-actions">
                  <button className="btn" onClick={() => { setSelectedMediaUrl(''); setFormData((f) => ({ ...f, mediaUrl: '' })); }}>Clear Selection</button>
                  <button className="btn btn-primary" onClick={handleSaveLogo} disabled={!selectedMediaUrl}>{brandingSaving ? 'Saving...' : 'Save Logo'}</button>
                </div>
              </div>

              <div className="media-controls">
                <label className="media-upload-label">Upload New Logo</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setPendingFile(file);

                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    const localUrl = URL.createObjectURL(file);
                    setPreviewUrl(localUrl);
                    setSelectedMediaUrl(localUrl); // Show in Selected Logo URL field
                  }} />
                  {pendingFile && <span style={{ fontSize: '13px', color: '#f59e0b' }}>📁 {pendingFile.name} - will upload on "Save Logo"</span>}
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" style={{ maxWidth: 200, maxHeight: 100, border: '2px dashed #f59e0b', borderRadius: 4, padding: 4 }} />
                  )}
                </div>
              </div>

              {mediaLoading ? (
                <div className="admin-loading">Loading media...</div>
              ) : mediaList.length === 0 ? (
                <div className="media-empty">No media uploaded yet</div>
              ) : (
                <div className="media-grid">
                  {mediaList.map((m) => {
                    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(m.filename || '');
                    return (
                      <div key={m.filename} className={`media-item ${selectedMediaUrl === m.url ? 'selected' : ''}`} onClick={() => handleSelectMedia(m)}>
                        {isImage ? (
                          <img src={normalizeUrl(m.url)} alt={m.filename} />
                        ) : (
                          <div className="media-file">{m.filename}</div>
                        )}
                        <div className="media-name">{m.filename}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}