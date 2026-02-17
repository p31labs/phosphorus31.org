import React, { useState } from 'react';
import { ScaleIcon } from '@heroicons/react/24/outline';
import api from '../lib/api';
import { toast } from './ui/Toast';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TextArea } from './ui/Input';
import StatusBadge from './ui/StatusBadge';

const LegalPortal = () => {
  const [caseInput, setCaseInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const legalTemplates = [
    { id: 1, name: 'Emergency Ex Parte Motion', type: 'motion' },
    { id: 2, name: 'ADA Rights Statement', type: 'compliance' },
    { id: 3, name: 'Medical Expert Witness Prep', type: 'medical' },
    { id: 4, name: 'Intellectual Gap Documentation', type: 'documentation' },
  ];

  const analyzeCase = async () => {
    if (!caseInput.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/api/legal/generate', {
        type: 'analysis',
        context: caseInput,
        urgency: 'normal',
      });
      setAnalysis(response.data);
      toast.success('Case analysis complete');
    } catch {
      // Toast auto-fires via API interceptor
    } finally {
      setLoading(false);
    }
  };

  const generateDocument = async (template) => {
    try {
      const response = await api.post('/api/legal/generate', {
        type: template.type,
        context: caseInput,
        urgency: 'normal',
      });
      setDocuments([...documents, response.data]);
      toast.success(`${template.name} generated`);
    } catch {
      // Toast auto-fires
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Legal AI Portal</h1>
          <p className="text-muted mt-1">Nuclear Legal Analysis & Document Generation</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-primary to-success rounded-xl flex items-center justify-center">
          <ScaleIcon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* Case Analysis */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Case Analysis</h3>
        <div className="space-y-4">
          <TextArea
            id="case-input"
            label="Describe your legal situation:"
            value={caseInput}
            onChange={(e) => setCaseInput(e.target.value)}
            rows={4}
            placeholder="Describe your legal situation, court case, or issue you need help with..."
          />
          <Button onClick={analyzeCase} disabled={loading || !caseInput.trim()}>
            {loading ? 'Analyzing...' : 'Analyze Case'}
          </Button>
        </div>

        {analysis && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-main">Analysis Results:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface rounded-xl p-4 border border-border">
                <h5 className="font-medium text-main mb-2">Legal Strategy</h5>
                <p className="text-sm text-muted">{analysis.strategy}</p>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-border">
                <h5 className="font-medium text-main mb-2">Key Arguments</h5>
                <ul className="text-sm text-muted space-y-1">
                  {analysis.arguments?.map((arg, i) => (
                    <li key={i}>&#8226; {arg}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-border">
                <h5 className="font-medium text-main mb-2">Risk Assessment</h5>
                <StatusBadge status={
                  analysis.risk === 'low' ? 'active' :
                  analysis.risk === 'medium' ? 'warning' : 'error'
                } label={analysis.risk?.toUpperCase()} />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Document Templates */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Document Generation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {legalTemplates.map((template) => (
            <div key={template.id} className="bg-surface rounded-xl p-4 hover:bg-card hover:shadow-md transition-all duration-300 cursor-pointer group border border-transparent hover:border-primary">
              <div className="w-10 h-10 bg-linear-to-r from-primary to-success rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white text-lg" aria-hidden="true">📄</span>
              </div>
              <h4 className="font-medium text-main mb-2">{template.name}</h4>
              <p className="text-sm text-muted mb-4 capitalize">{template.type}</p>
              <Button onClick={() => generateDocument(template)} className="w-full">
                Generate
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Generated Documents */}
      {documents.length > 0 && (
        <Card>
          <h3 className="font-semibold text-main mb-4">Generated Documents</h3>
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                <div>
                  <h4 className="font-medium text-main">{doc.title || doc.type}</h4>
                  <p className="text-sm text-muted">{doc.type}</p>
                </div>
                <div className="flex space-x-2">
                  <Button>View</Button>
                  <Button variant="secondary">Download</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LegalPortal;
