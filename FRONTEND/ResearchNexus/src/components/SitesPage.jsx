import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SitesPage.css'; // We will create this in Step 2

const SitesPage = ({ user }) => {
  const [sites, setSites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    url: ''
  });

  // 1. FETCH SITES (Only if user is logged in)
  const fetchSites = async () => {
    if (!user || !user.Gmail) return;

    try {
      const response = await axios.get(`http://localhost:9222/api/sites/user/${user.Gmail}`);
      setSites(response.data);
    } catch (error) {
      console.error("Error fetching sites", error);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [user]);

  // 2. ADD SITE
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        site_name: formData.site_name,
        url: formData.url,
        Gmail: user.Gmail // Uses the logged-in user's email
      };

      await axios.post('http://localhost:9222/api/sites/add', dataToSend);
      
      setShowModal(false);
      setFormData({ site_name: '', url: '' }); // Clear form
      fetchSites(); // Refresh list
    } catch (error) {
      console.error("Error adding site", error);
    }
  };

  // 3. DELETE SITE
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Stops the card from opening the link
    if(window.confirm("Delete this site?")) {
      try {
        await axios.delete(`http://localhost:9222/api/sites/deleteSite/${id}`);
        fetchSites();
      } catch (error) {
        console.error("Error deleting", error);
      }
    }
  };

  // 4. OPEN LINK
  const openSite = (url) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  };

  if (!user) return <div style={{padding: 40}}>Loading...</div>;

  return (
    <div className="sites-container">
      <h1>Search & Discover for {user.Name}</h1>
      
      <div className="app-grid">
        {/* Render Existing Sites */}
        {sites.map((site) => (
          <div key={site._id} className="app-card" onClick={() => openSite(site.url)}>
            <button className="delete-btn" onClick={(e) => handleDelete(site._id, e)}>×</button>
            <img 
              src={`https://www.google.com/s2/favicons?domain=${site.url}&sz=64`} 
              alt={site.site_name} 
              className="app-icon"
            />
            <span className="app-name">{site.site_name}</span>
          </div>
        ))}

        {/* Add Button (Last item in grid) */}
        <div className="app-card add-card" onClick={() => setShowModal(true)}>
          <div className="plus-icon">+</div>
          <span className="app-name">Add Site</span>
        </div>
      </div>

      {/* Pop-up Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Shortcut</h3>
            <form onSubmit={handleAddSubmit}>
              <input 
                type="text" 
                placeholder="Name (e.g. YouTube)" 
                value={formData.site_name}
                onChange={(e) => setFormData({...formData, site_name: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="URL (e.g. youtube.com)" 
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                required 
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SitesPage;