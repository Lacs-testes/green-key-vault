import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, History } from 'lucide-react';
import { CompanyRecord } from '@/types/company';
import HistorySearch from '@/components/HistorySearch';
interface HistorySectionProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  history: CompanyRecord[];
  isLoading: boolean;
  onSelect: (record: CompanyRecord) => void;
  onDelete: (id: string) => void;
  onUpdate: (record: CompanyRecord) => void;
}
const HistorySection: React.FC<HistorySectionProps> = ({
  showHistory,
  setShowHistory,
  history,
  isLoading,
  onSelect,
  onDelete,
  onUpdate
}) => {
  const openHistoryPage = () => {
    window.open('/historico.html', '_blank');
  };
  return <Card className="border-[#AAD1C2] shadow-lg">
      <CardHeader className="bg-[#117A57] text-white">
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Histórico
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <Button onClick={() => setShowHistory(!showHistory)} variant="outline" className="w-full border-[#117A57] text-[#117A57] hover:bg-[#AAD1C2]/20" disabled={isLoading}>
          <Search className="w-4 h-4 mr-2" />
          {isLoading ? 'Carregando...' : 'Buscar no Histórico'}
        </Button>
        
        
        
        {showHistory && <div className="mt-4">
            <HistorySearch history={history} onSelect={onSelect} onDelete={onDelete} onUpdate={onUpdate} />
          </div>}
      </CardContent>
    </Card>;
};
export default HistorySection;