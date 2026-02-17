import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { toast } from './ui/Toast';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, TextArea, Select } from './ui/Input';

const MedicalHub = () => {
  const [medicalDocs, setMedicalDocs] = useState([]);
  const [adaDocs, setAdaDocs] = useState([]);
  const [expertWitnessDocs, setExpertWitnessDocs] = useState([]);
  const [newDocument, setNewDocument] = useState({ title: '', type: 'medical', content: '' });

  useEffect(() => {
    loadMedicalData();
  }, []);

  const loadMedicalData = async () => {
    try {
      const response = await api.get('/api/medical/conditions');
      if (response.data) {
        setMedicalDocs(response.data.medical || []);
        setAdaDocs(response.data.ada || []);
        setExpertWitnessDocs(response.data.expertWitness || []);
      }
    } catch {
      // Toast auto-fires
    }
  };

  const addDocument = async () => {
    if (!newDocument.title || !newDocument.content) return;
    try {
      const response = await api.post('/api/medical/document', {
        patientId: 'self',
        condition: newDocument.title,
        symptoms: newDocument.content,
        history: newDocument.type,
      });
      if (newDocument.type === 'medical') setMedicalDocs((prev) => [...prev, response.data]);
      else if (newDocument.type === 'ada') setAdaDocs((prev) => [...prev, response.data]);
      else setExpertWitnessDocs((prev) => [...prev, response.data]);
      setNewDocument({ title: '', type: 'medical', content: '' });
      toast.success('Document added successfully');
    } catch {
      // Toast auto-fires
    }
  };

  const DOC_ICONS = { medical: '👤', ada: '🛡️', expertWitness: '⚠️' };

  const DocList = ({ title, docs, type }) => (
    <Card>
      <h3 className="font-semibold text-main mb-4">{title}</h3>
      {docs.length === 0 ? (
        <p className="text-sm text-muted">No documents yet.</p>
      ) : (
        <div className="space-y-3">
          {docs.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <span className="text-lg" aria-hidden="true">{DOC_ICONS[type] || '📄'}</span>
                <div>
                  <h4 className="font-medium text-main">{doc.title || doc.condition}</h4>
                  <p className="text-sm text-muted">{doc.date || 'Recent'}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary">View</Button>
                <Button>Download</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Medical Documentation Hub</h1>
        <p className="text-muted mt-1">ADA Compliance & Medical Expert Witness Preparation</p>
      </div>

      {/* Add Document */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Add Medical Document</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="med-title"
            label="Title"
            type="text"
            value={newDocument.title}
            onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
            placeholder="Document title"
          />
          <Select
            id="med-type"
            label="Type"
            value={newDocument.type}
            onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
          >
            <option value="medical">Medical Documentation</option>
            <option value="ada">ADA Rights Statement</option>
            <option value="expertWitness">Expert Witness Prep</option>
          </Select>
          <div>
            <span className="block text-sm font-medium text-muted mb-2">Quick Actions</span>
            <Button
              variant="secondary"
              onClick={() =>
                setNewDocument({
                  ...newDocument,
                  title: 'Chronic Hypoparathyroidism Documentation',
                  content: 'Patient diagnosed with chronic hypoparathyroidism requiring lifelong calcium and vitamin D supplementation.',
                })
              }
              className="text-sm"
            >
              Auto-fill Hypoparathyroidism
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <TextArea
            id="med-content"
            label="Content"
            value={newDocument.content}
            onChange={(e) => setNewDocument({ ...newDocument, content: e.target.value })}
            rows={6}
            placeholder="Document content..."
          />
        </div>
        <div className="mt-4">
          <Button onClick={addDocument} disabled={!newDocument.title || !newDocument.content}>
            Add Document
          </Button>
        </div>
      </Card>

      {/* Document Lists */}
      <DocList title="Medical Documentation" docs={medicalDocs} type="medical" />
      <DocList title="ADA Rights Statements" docs={adaDocs} type="ada" />
      <DocList title="Expert Witness Preparation" docs={expertWitnessDocs} type="expertWitness" />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Total Medical Docs</p>
            <p className="text-2xl font-bold text-main">{medicalDocs.length}</p>
          </div>
          <span className="text-3xl" aria-hidden="true">👤</span>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">ADA Compliance</p>
            <p className="text-2xl font-bold text-main">{adaDocs.length}</p>
          </div>
          <span className="text-3xl" aria-hidden="true">🛡️</span>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Expert Witness</p>
            <p className="text-2xl font-bold text-main">{expertWitnessDocs.length}</p>
          </div>
          <span className="text-3xl" aria-hidden="true">⚠️</span>
        </Card>
      </div>
    </div>
  );
};

export default MedicalHub;
