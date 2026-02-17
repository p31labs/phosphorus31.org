import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { toast } from './ui/Toast';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import {
  FolderIcon,
  DocumentIcon,
  ArrowPathIcon,
  CloudArrowDownIcon,
} from '@heroicons/react/24/outline';

const GoogleDrivePage = () => {
  const [status, setStatus] = useState({ configured: false, authenticated: false });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderHistory, setFolderHistory] = useState([]);

  useEffect(() => {
    checkStatus();
    // Check for auth code in URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      handleAuthCallback(code);
    }
  }, []);

  useEffect(() => {
    if (status.authenticated) {
      listFiles();
    }
  }, [status.authenticated, currentFolder]);

  const checkStatus = async () => {
    try {
      const res = await api.get('/api/google-drive/status');
      setStatus(res.data);
    } catch {
      // Toast auto-fires via API interceptor
    }
  };

  const handleAuthCallback = async (code) => {
    try {
      setLoading(true);
      await api.post('/api/google-drive/callback', { code });
      window.history.replaceState({}, document.title, window.location.pathname);
      await checkStatus();
    } catch {
      // Toast auto-fires via API interceptor
    } finally {
      setLoading(false);
    }
  };

  const connectDrive = async () => {
    try {
      const res = await api.get('/api/google-drive/auth');
      window.location.href = res.data.url;
    } catch {
      toast.error('Could not get auth URL. Is GOOGLE_CLIENT_ID set?');
    }
  };

  const listFiles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/google-drive/files', {
        params: { folderId: currentFolder || undefined }
      });
      setFiles(res.data.files);
    } catch {
      // Toast auto-fires via API interceptor
    } finally {
      setLoading(false);
    }
  };

  const importFile = async (fileId) => {
    try {
      setLoading(true);
      await api.post('/api/google-drive/import', { fileId });
      toast.success('File imported successfully!');
    } catch {
      // Toast auto-fires via API interceptor
    } finally {
      setLoading(false);
    }
  };

  const navigateFolder = (folderId) => {
    if (folderId) {
      setFolderHistory([...folderHistory, currentFolder]);
      setCurrentFolder(folderId);
    } else {
      // Go back
      const prev = folderHistory.pop();
      setFolderHistory([...folderHistory]);
      setCurrentFolder(prev || null);
    }
  };

  if (!status.configured) {
    return (
      <Card className="max-w-md mx-auto mt-10 text-center">
        <h2 className="text-xl font-bold text-main mb-4">Google Drive Not Configured</h2>
        <p className="text-muted mb-4">
          Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your backend .env file.
        </p>
      </Card>
    );
  }

  if (!status.authenticated) {
    return (
      <Card className="max-w-md mx-auto mt-10 text-center">
        <h2 className="text-xl font-bold text-main mb-4">Connect to Google Drive</h2>
        <p className="text-muted mb-6">
          Connect your Google Drive to import legal documents, medical records, and evidence directly into SUPER CENTAUR.
        </p>
        <Button onClick={connectDrive} disabled={loading} className="w-full">
          {loading ? 'Connecting...' : 'Connect Google Drive'}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-main gradient-text">Google Drive Integration</h1>
        <Button variant="secondary" onClick={listFiles} disabled={loading}>
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        {currentFolder && (
          <div className="mb-4">
            <Button variant="secondary" onClick={() => navigateFolder(null)} className="text-sm">
              ← Back
            </Button>
          </div>
        )}

        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-sidebar rounded-lg hover:bg-card transition-colors">
              <div 
                className="flex items-center space-x-3 cursor-pointer flex-1"
                onClick={() => file.isFolder ? navigateFolder(file.id) : null}
              >
                {file.isFolder ? (
                  <FolderIcon className="w-6 h-6 text-warning" />
                ) : (
                  <DocumentIcon className="w-6 h-6 text-primary" />
                )}
                <div>
                  <p className="text-main font-medium">{file.name}</p>
                  <p className="text-xs text-muted">
                    {file.isFolder ? 'Folder' : file.mimeType}
                  </p>
                </div>
              </div>

              {!file.isFolder && (
                <Button 
                  size="sm" 
                  variant="primary" 
                  onClick={() => importFile(file.id)}
                  disabled={loading}
                >
                  <CloudArrowDownIcon className="w-5 h-5" />
                </Button>
              )}
            </div>
          ))}

          {files.length === 0 && !loading && (
            <p className="text-center text-muted py-10">No files found in this folder.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GoogleDrivePage;
