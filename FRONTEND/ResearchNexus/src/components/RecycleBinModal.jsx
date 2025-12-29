import React, { useState, useEffect } from 'react';
import { 
  getFolderTrash, 
  getFileTrash, 
  restoreFolder, 
  restoreFile, 
  deleteFolderPermanently, 
  deleteFilePermanently 
} from '../services/api';
import '../styles/RecycleBinModal.css';

const RecycleBinModal = ({ isOpen, onClose, user, onRestore }) => {
  const [trashedFolders, setTrashedFolders] = useState([]);
  const [trashedFiles, setTrashedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch trash when modal opens
  useEffect(() => {
    if (isOpen && user?.Gmail) {
      loadTrash();
    }
  }, [isOpen, user]);

  const loadTrash = async () => {
    setLoading(true);
    try {
      const [folderRes, fileRes] = await Promise.all([
        getFolderTrash(user.Gmail),
        getFileTrash(user.Gmail)
      ]);
      setTrashedFolders(folderRes.data);
      setTrashedFiles(fileRes.data);
    } catch (error) {
      console.error("Error loading trash:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id, type) => {
    try {
      if (type === 'folder') {
        await restoreFolder(id);
      } else {
        await restoreFile(id);
      }
      loadTrash(); // Refresh list inside modal
      onRestore(); // Refresh the main dashboard
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Failed to restore item.");
    }
  };

  const handleDeletePermanent = async (id, type) => {
    if (window.confirm("Delete permanently? This cannot be undone.")) {
      try {
        if (type === 'folder') {
          await deleteFolderPermanently(id);
        } else {
          await deleteFilePermanently(id);
        }
        loadTrash();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete item.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rb-overlay">
      <div className="rb-modal">
        <div className="rb-header">
          <h2>♻️ Recycle Bin</h2>
          <button onClick={onClose} className="rb-close-btn">×</button>
        </div>

        <div className="rb-content">
          {loading ? (
            <p className="rb-loading">Loading deleted items...</p>
          ) : trashedFolders.length === 0 && trashedFiles.length === 0 ? (
            <div className="rb-empty">
              <p>Recycle Bin is empty.</p>
            </div>
          ) : (
            <table className="rb-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th style={{textAlign: 'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Folders */}
                {trashedFolders.map((folder) => (
                  <tr key={`folder-${folder.id}`}>
                    <td>📁 Folder</td>
                    <td>{folder.Name}</td>
                    <td className="rb-actions">
                      <button 
                        className="btn-restore" 
                        onClick={() => handleRestore(folder.id, 'folder')}
                      >
                        Restore
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeletePermanent(folder.id, 'folder')}
                      >
                        Delete Forever
                      </button>
                    </td>
                  </tr>
                ))}
                
                {/* Files */}
                {trashedFiles.map((file) => (
                  <tr key={`file-${file.id}`}>
                    <td>📄 File</td>
                    <td>{file.Name}</td>
                    <td className="rb-actions">
                      <button 
                        className="btn-restore" 
                        onClick={() => handleRestore(file.id, 'file')}
                      >
                        Restore
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeletePermanent(file.id, 'file')}
                      >
                        Delete Forever
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecycleBinModal;