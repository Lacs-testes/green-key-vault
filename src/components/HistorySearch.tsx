
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Clock, Building2 } from 'lucide-react';

interface CompanyRecord {
  id: string;
  companyName: string;
  username: string;
  password: string;
  createdAt: string;
}

interface HistorySearchProps {
  history: CompanyRecord[];
  onSelect: (record: CompanyRecord) => void;
}

const HistorySearch: React.FC<HistorySearchProps> = ({ history, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(record =>
    record.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#117A57] w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar empresa no histórico..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-[#AAD1C2] focus:border-[#117A57]"
        />
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-6 text-[#333333]">
          {searchTerm ? 'Nenhuma empresa encontrada.' : 'Nenhuma empresa no histórico.'}
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredHistory.map((record) => (
            <Button
              key={record.id}
              onClick={() => onSelect(record)}
              variant="outline"
              className="w-full justify-start h-auto p-4 border-[#AAD1C2] hover:bg-[#AAD1C2]/10 hover:border-[#117A57]"
            >
              <div className="flex items-start gap-3 w-full">
                <Building2 className="w-5 h-5 text-[#117A57] mt-0.5 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-[#0E4A36] truncate">
                    {record.companyName}
                  </div>
                  <div className="text-sm text-[#333333] flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(record.createdAt)}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySearch;
