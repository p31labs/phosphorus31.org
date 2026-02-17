// FIXED CONSTITUTION PAGE
// Replace whatever exists with this

import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';

const ARTICLES = [
  {
    number: '01',
    title: 'K₄ Topology',
    description: 'Every group must be exactly 4 vertices connected as a complete graph.',
    locked: false,
  },
  {
    number: '02',
    title: 'Decentralization',
    description: 'No central authority. No hub. Mesh topology only.',
    locked: false,
  },
  {
    number: '03',
    title: 'Exit Rights',
    description: 'Any vertex can leave at any time. No penalties. Data export guaranteed.',
    locked: false,
  },
  {
    number: '04',
    title: 'Physical Presence',
    description: 'Minimum 4 physical meetings per month. Digital-only relationships degrade.',
    locked: false,
  },
  {
    number: '05',
    title: 'Privacy by Default',
    description: 'All data encrypted end-to-end. Platform never has plaintext.',
    locked: false,
  },
  {
    number: '06',
    title: 'Missing Node Protocol',
    description: 'When vertex lost: K₄ → K₃ → K₄ transition with dignity.',
    locked: false,
  },
  {
    number: '07',
    title: 'Mutual Aid',
    description: 'Memorial Fund distributes resources when vertex in crisis.',
    locked: false,
  },
  {
    number: '08',
    title: 'Child Protection',
    description: 'All childcare vertices background-checked. Mandatory reporting.',
    locked: true, // Example of locked article
  },
];

export default function ConstitutionPage() {
  return (
    <ModulePage>
      <ModuleCard 
        title="Constitution"
        subtitle="Immutable Principles"
        icon="📜"
        size="lg"
      >
        <div className="space-y-4">
          {ARTICLES.map((article) => (
            <ArticleCard key={article.number} article={article} />
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-4">
            Deployed: January 1, 2026
          </p>
          <p className="text-sm text-gray-400">
            Contract: <span className="font-mono text-cyan-400">0x742d...bEb8</span>
          </p>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}

function ArticleCard({ article }: { article: typeof ARTICLES[0] }) {
  return (
    <div className="
      p-4
      bg-black/50
      border border-gray-700
      rounded
      hover:border-cyan-500/30
      transition-colors
    ">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="
            text-xs
            text-gray-500
            font-mono
            w-12
          ">
            Art. {article.number}
          </div>
          <h3 className="text-lg font-bold text-yellow-400">
            {article.title}
          </h3>
        </div>
        {article.locked && (
          <div className="text-yellow-600">
            🔒
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-300 ml-15">
        {article.description}
      </p>
    </div>
  );
}
