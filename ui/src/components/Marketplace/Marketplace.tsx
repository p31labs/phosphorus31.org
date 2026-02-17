/**
 * Marketplace — Quantum Geodesic Platform asset listing
 * Coherence Tokens (CT); mock API for first version.
 */

import React, { useEffect, useState } from 'react';

export interface MarketplaceAsset {
  id: string;
  name: string;
  creator: string;
  price: number;
  thumbnail: string;
}

const MOCK_ASSETS: MarketplaceAsset[] = [
  {
    id: '1',
    name: 'Tetra House',
    creator: 'P31',
    price: 100,
    thumbnail: '',
  },
  {
    id: '2',
    name: 'IVM Dome',
    creator: 'P31',
    price: 150,
    thumbnail: '',
  },
  {
    id: '3',
    name: 'Coherent Prism',
    creator: 'P31',
    price: 80,
    thumbnail: '',
  },
];

export const Marketplace: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [assets, setAssets] = useState<MarketplaceAsset[]>([]);

  useEffect(() => {
    const url = '/api/marketplace';
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.resolve(MOCK_ASSETS)))
      .then((data: MarketplaceAsset[]) => setAssets(Array.isArray(data) ? data : MOCK_ASSETS))
      .catch(() => setAssets(MOCK_ASSETS));
  }, []);

  const handleBuy = (assetId: string) => {
    fetch('/api/marketplace/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetId, userId: 'current-user' }),
    })
      .then((res) => res.json())
      .then(() => {
        // Purchase success — could show toast or refresh
        if (typeof window !== 'undefined' && window.alert) {
          window.alert('Purchase successful!');
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined' && window.alert) {
          window.alert('Purchase failed. Try again.');
        }
      });
  };

  return (
    <div
      className="absolute inset-0 bg-black/90 text-white p-8 overflow-auto z-30"
      role="dialog"
      aria-label="Marketplace"
    >
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-bold text-cyan-400">Marketplace</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl"
          aria-label="Close Marketplace"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-cyan-500/50 transition-colors"
          >
            <div className="w-full h-32 rounded bg-gray-700 flex items-center justify-center text-gray-500 text-sm">
              {asset.thumbnail ? (
                <img
                  src={asset.thumbnail}
                  alt={asset.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span>🔺</span>
              )}
            </div>
            <h3 className="font-bold mt-2 text-white">{asset.name}</h3>
            <p className="text-sm text-gray-400">by {asset.creator}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-cyan-400 font-bold">{asset.price} CT</span>
              <button
                type="button"
                onClick={() => handleBuy(asset.id)}
                className="bg-cyan-600 hover:bg-cyan-500 px-3 py-1 rounded text-sm font-medium"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
