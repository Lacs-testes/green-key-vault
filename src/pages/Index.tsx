
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Copy, History, Key, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CompanyForm from '@/components/CompanyForm';
import CredentialsDisplay from '@/components/CredentialsDisplay';
import HistorySearch from '@/components/HistorySearch';

interface CompanyRecord {
  id: string;
  companyName: string;
  username: string;
  password: string;
  createdAt: string;
  userModel: 1 | 2; // Modelo 1 (normal) ou Modelo 2 (com 3288)
}

const Index = () => {
  const [currentRecord, setCurrentRecord] = useState<CompanyRecord | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedUserModel, setSelectedUserModel] = useState<1 | 2>(1);
  const { toast } = useToast();

  const generateCredentials = (companyName: string, userModel: 1 | 2): { username: string; password: string } => {
    // Limpar o nome da empresa
    const cleanName = companyName.trim();
    
    // Gerar username - usar nome completo sem abreviações
    let username = cleanName
      .replace(/[^\w\s]/g, '') // Remove pontuação
      .replace(/\s+/g, '.') // Substitui espaços por pontos
      .toUpperCase();
    
    // Para modelo 2, adicionar 3288 no final
    if (userModel === 2) {
      const maxLength = 15 - 4; // 4 = "3288".length
      if (username.length > maxLength) {
        username = username.substring(0, maxLength);
        // Remove ponto no final se houver
        if (username.endsWith('.')) {
          username = username.substring(0, maxLength - 1);
        }
      }
      username += '3288';
    } else {
      // Limitar a 15 caracteres cortando se necessário
      if (username.length > 15) {
        username = username.substring(0, 15);
        // Remove ponto no final se houver
        if (username.endsWith('.')) {
          username = username.substring(0, 14);
        }
      }
    }
    
    // Gerar senha
    const words = cleanName.split(/\s+/);
    const firstWord = words[0];
    let passwordBase = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
    
    // Limitar para caber @123 (máximo 12 caracteres total)
    const maxPasswordBaseLength = 12 - 4; // 4 = "@123".length
    if (passwordBase.length > maxPasswordBaseLength) {
      passwordBase = passwordBase.substring(0, maxPasswordBaseLength);
    }
    
    const password = passwordBase + '@123';
    
    return { username, password };
  };

  const saveToHistory = (companyName: string, username: string, password: string, userModel: 1 | 2): CompanyRecord => {
    const record: CompanyRecord = {
      id: Date.now().toString(),
      companyName,
      username,
      password,
      createdAt: new Date().toISOString(),
      userModel
    };
    
    const history = getHistory();
    const updatedHistory = [record, ...history];
    localStorage.setItem('companyHistory', JSON.stringify(updatedHistory));
    
    return record;
  };

  const getHistory = (): CompanyRecord[] => {
    const stored = localStorage.getItem('companyHistory');
    return stored ? JSON.parse(stored) : [];
  };

  const searchInHistory = (companyName: string, userModel: 1 | 2): CompanyRecord | null => {
    const history = getHistory();
    return history.find(record => 
      record.companyName.toLowerCase() === companyName.toLowerCase() && 
      record.userModel === userModel
    ) || null;
  };

  const deleteFromHistory = (id: string) => {
    const history = getHistory();
    const updatedHistory = history.filter(record => record.id !== id);
    localStorage.setItem('companyHistory', JSON.stringify(updatedHistory));
    
    // Se o registro atual foi deletado, limpar a tela
    if (currentRecord && currentRecord.id === id) {
      setCurrentRecord(null);
    }
    
    toast({
      title: "Excluído",
      description: "Registro removido do histórico.",
    });
  };

  const updateHistory = (updatedRecord: CompanyRecord) => {
    const history = getHistory();
    const updatedHistory = history.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    );
    localStorage.setItem('companyHistory', JSON.stringify(updatedHistory));
    
    // Se o registro atual foi editado, atualizar a tela
    if (currentRecord && currentRecord.id === updatedRecord.id) {
      setCurrentRecord(updatedRecord);
    }
    
    toast({
      title: "Atualizado",
      description: "Registro atualizado no histórico.",
    });
  };

  const handleCompanySubmit = (companyName: string) => {
    // Verificar se já existe no histórico
    const existingRecord = searchInHistory(companyName, selectedUserModel);
    
    if (existingRecord) {
      setCurrentRecord(existingRecord);
      toast({
        title: "Encontrado no histórico",
        description: "Credenciais recuperadas do histórico.",
      });
    } else {
      // Gerar novas credenciais
      const { username, password } = generateCredentials(companyName, selectedUserModel);
      const newRecord = saveToHistory(companyName, username, password, selectedUserModel);
      setCurrentRecord(newRecord);
      toast({
        title: "Credenciais geradas",
        description: "Novas credenciais foram criadas e salvas no histórico.",
      });
    }
    setShowHistory(false);
  };

  const handleHistorySelect = (record: CompanyRecord) => {
    setCurrentRecord(record);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#AAD1C2]/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header com Logo */}
        <div className="flex items-center mb-8">
          <div className="w-[150px] h-[60px] mr-6 flex items-center">
            <img 
              src="/lovable-uploads/97b4ddf8-3252-4cff-9f32-4895d75ca399.png" 
              alt="LAES Logo" 
              className="h-full w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0E4A36] mb-2">
              Gerador de Credenciais
            </h1>
            <p className="text-[#333333] text-lg">
              Sistema de geração de usuário e senha para empresas
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário Principal */}
          <div className="space-y-6">
            {/* Seleção do Modelo de Usuário */}
            <Card className="border-[#AAD1C2] shadow-lg">
              <CardHeader className="bg-[#117A57] text-white">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Modelo de Usuário
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setSelectedUserModel(1)}
                    variant={selectedUserModel === 1 ? "default" : "outline"}
                    className={selectedUserModel === 1 
                      ? "bg-[#117A57] hover:bg-[#0E4A36] text-white" 
                      : "border-[#117A57] text-[#117A57] hover:bg-[#AAD1C2]/20"
                    }
                  >
                    Modelo 1
                  </Button>
                  <Button
                    onClick={() => setSelectedUserModel(2)}
                    variant={selectedUserModel === 2 ? "default" : "outline"}
                    className={selectedUserModel === 2 
                      ? "bg-[#117A57] hover:bg-[#0E4A36] text-white" 
                      : "border-[#117A57] text-[#117A57] hover:bg-[#AAD1C2]/20"
                    }
                  >
                    Modelo 2 (3288)
                  </Button>
                </div>
                <p className="text-sm text-[#333333] mt-2 text-center">
                  {selectedUserModel === 1 
                    ? "Usuário padrão" 
                    : "Usuário com terminação 3288"
                  }
                </p>
              </CardContent>
            </Card>

            <CompanyForm onSubmit={handleCompanySubmit} />
            
            <Card className="border-[#AAD1C2] shadow-lg">
              <CardHeader className="bg-[#117A57] text-white">
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Histórico
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  variant="outline"
                  className="w-full border-[#117A57] text-[#117A57] hover:bg-[#AAD1C2]/20"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar no Histórico
                </Button>
                
                {showHistory && (
                  <div className="mt-4">
                    <HistorySearch
                      history={getHistory()}
                      onSelect={handleHistorySelect}
                      onDelete={deleteFromHistory}
                      onUpdate={updateHistory}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Exibição de Credenciais */}
          <div>
            {currentRecord ? (
              <CredentialsDisplay record={currentRecord} />
            ) : (
              <Card className="border-[#AAD1C2] shadow-lg h-fit">
                <CardContent className="p-8 text-center">
                  <div className="bg-[#AAD1C2]/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Key className="w-10 h-10 text-[#117A57]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0E4A36] mb-2">
                    Aguardando Empresa
                  </h3>
                  <p className="text-[#333333]">
                    Digite o nome de uma empresa para gerar as credenciais automaticamente.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
