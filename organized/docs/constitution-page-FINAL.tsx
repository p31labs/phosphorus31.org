import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';

const ARTICLES = [
  {
    number: '04',
    title: 'The Whale Song',
    description: 'We do not use the fast, weak voice of the Mouse (WiFi). We use the slow, strong voice of the Whale (physical presence). Minimum 4 physical meetings per month.',
  },
  {
    number: '05',
    title: 'Privacy by Default',
    description: 'Encryption is MANDATORY. No plaintext storage, transmission, or processing. Your data is yours. Forever.',
  },
  {
    number: '06',
    title: 'Missing Node Protocol',
    description: 'Handles departures and grief. The system degrades gracefully (3/4 → 2/4 → reform). Death has dignity.',
  },
  {
    number: '07',
    title: 'Mutual Aid',
    description: 'Memorial Fund activates on crisis. Resources distribute to vertices in need. The mesh protects its own.',
  },
  {
    number: '08',
    title: 'Child Protection',
    description: 'Background checks mandatory. Reporting required. Children are the future of the mesh.',
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
        <div className="space-y-3">
          {ARTICLES.map((article) => (
            <div 
              key={article.number}
              className="
                p-4
                bg-black/40
                border border-cyan-500/20
                rounded
                hover:border-cyan-500/40
                hover:bg-black/60
                transition-all duration-200
              "
            >
              {/* Article header */}
              <div className="flex items-baseline gap-3 mb-2">
                <div className="
                  text-xs
                  text-cyan-500/60
                  font-mono
                  min-w-[3rem]
                ">
                  Art. {article.number}
                </div>
                <h3 className="text-lg font-bold text-cyan-400">
                  {article.title}
                </h3>
              </div>
              
              {/* Article description */}
              <p className="text-sm text-gray-300 leading-relaxed ml-[3.75rem]">
                {article.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Deployed</span>
              <span className="text-gray-300">January 1, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contract</span>
              <span className="text-cyan-400 font-mono text-xs">
                0x742d...bEb8
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="text-green-400">Immutable</span>
            </div>
          </div>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
