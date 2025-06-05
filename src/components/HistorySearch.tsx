
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Clock, Building2, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompanyRecord {
  id: string;
  companyName: string;
  username: string;
  password: string;
  createdAt: string;
  userModel: 1 | 2;
}

interface HistorySearchProps {
  history: CompanyRecord[];
  onSelect: (record: CompanyRecord) => void;
  onDelete: (id: string) => void;
  onUpdate: (record: CompanyRecord) => void;
}

const HistorySearch: React.FC<HistorySearchProps> = ({ history, onSelect, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{companyName: string; username: string; password: string}>({
    companyName: '',
    username: '',
    password: ''
  });
  const { toast } = useToast();

  const filteredHistory = history.filter(record =>
    record.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const startEdit = (record: CompanyRecord) => {
    setEditingId(record.id);
    setEditForm({
      companyName: record.companyName,
      username: record.username,
      password: record.password
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ companyName: '', username: '', password: '' });
  };

  const saveEdit = (record: CompanyRecord) => {
    if (!editForm.companyName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da empresa não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    const updatedRecord: CompanyRecord = {
      ...record,
      companyName: editForm.companyName.trim(),
      username: editForm.username.trim(),
      password: editForm.password.trim()
    };

    onUpdate(updatedRecord);
    setEditingId(null);
    setEditForm({ companyName: '', username: '', password: '' });
  };

  const handleDelete = (id: string, companyName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${companyName}"?`)) {
      onDelete(id);
    }
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
            <div key={record.id} className="border border-[#AAD1C2] rounded-lg p-4 hover:bg-[#AAD1C2]/10">
              {editingId === record.id ? (
                // Modo de edição
                <div className="space-y-3">
                  <Input
                    value={editForm.companyName}
                    onChange={(e) => setEditForm({...editForm, companyName: e.target.value})}
                    placeholder="Nome da empresa"
                    className="border-[#AAD1C2] focus:border-[#117A57]"
                  />
                  <Input
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    placeholder="Usuário"
                    className="border-[#AAD1C2] focus:border-[#117A57]"
                  />
                  <Input
                    value={editForm.password}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    placeholder="Senha"
                    className="border-[#AAD1C2] focus:border-[#117A57]"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveEdit(record)}
                      size="sm"
                      className="bg-[#117A57] hover:bg-[#0E4A36] text-white"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Salvar
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      size="sm"
                      variant="outline"
                      className="border-[#333333] text-[#333333]"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                // Modo de visualização
                <div className="flex items-start justify-between">
                  <div 
                    className="flex items-start gap-3 w-full cursor-pointer"
                    onClick={() => onSelect(record)}
                  >
                    <Building2 className="w-5 h-5 text-[#117A57] mt-0.5 flex-shrink-0" />
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-[#0E4A36] truncate">
                        {record.companyName}
                      </div>
                      <div className="text-xs text-[#333333] mt-1">
                        Usuário: {record.username} | Modelo: {record.userModel}
                      </div>
                      <div className="text-sm text-[#333333] flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(record.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      onClick={() => startEdit(record)}
                      size="sm"
                      variant="outline"
                      className="border-[#117A57] text-[#117A57] hover:bg-[#AAD1C2]/20 p-2"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(record.id, record.companyName)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 p-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySearch;
