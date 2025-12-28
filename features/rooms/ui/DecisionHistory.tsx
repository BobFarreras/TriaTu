import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card } from '@/components/ui/Card';

type PastDecision = {
  choice: string;
  reason: string;
  date: string; // ISO string
};

export function DecisionHistory({ history }: { history: PastDecision[] }) {
  const { t } = useLanguage();

  if (history.length === 0) {
    return (
      <div className="text-center p-8 text-gray-400 italic border border-dashed border-gray-300 rounded-xl">
        {t.room.no_history}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        📜 {t.room.history_title}
      </h3>
      <div className="space-y-3">
        {history.map((item, idx) => (
          <Card key={idx} className="p-4 border-l-4 border-l-black dark:border-l-white bg-gray-50 dark:bg-zinc-900">
            <div className="flex justify-between items-start">
              <h4 className="text-xl font-bold">{item.choice}</h4>
              <span className="text-xs text-gray-500">
                {new Date(item.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              "{item.reason}"
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}