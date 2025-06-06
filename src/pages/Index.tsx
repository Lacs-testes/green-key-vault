import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, History, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CompanyForm from '@/components/CompanyForm';
import CredentialsDisplay from '@/components/CredentialsDisplay';
import HistorySearch from '@/components/HistorySearch';
import { googleSheetsService } from '@/services/googleSheetsService';

interface CompanyRecord {
  id: string;
  companyName: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt?: string;
}

const Index = () => {
  const [currentRecord, setCurrentRecord] = useState<CompanyRecord | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<CompanyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadHistoryFromGoogleSheets();
  }, []);

  const loadHistoryFromGoogleSheets = async () => {
    setIsLoading(true);
    try {
      const records = await googleSheetsService.getAllRecords();
      const sortedRecords = records.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setHistory(sortedRecords);
    } catch (error) {
      console.error('Erro ao carregar histórico do Google Sheets:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico do Google Sheets. Usando dados locais.",
        variant: "destructive",
      });
      setHistory(getLocalHistory());
    } finally {
      setIsLoading(false);
    }
  };

  const generateCredentials = (companyName: string): { username: string; password: string } => {
    // Limpar o nome da empresa
    const cleanName = companyName.trim();
    
    let username = cleanName
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '.')
      .toUpperCase();
    
    if (username.length > 15) {
      username = username.substring(0, 15);
      if (username.endsWith('.')) {
        username = username.substring(0, 14);
      }
    }
    
    const words = cleanName.split(/\s+/);
    const firstWord = words[0];
    let passwordBase = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
    
    const maxPasswordBaseLength = 12 - 4;
    if (passwordBase.length > maxPasswordBaseLength) {
      passwordBase = passwordBase.substring(0, maxPasswordBaseLength);
    }
    
    const password = passwordBase + '@123';
    
    return { username, password };
  };

  const saveRecord = async (companyName: string, username: string, password: string): Promise<CompanyRecord> => {
    const record: CompanyRecord = {
      id: Date.now().toString(),
      companyName,
      username,
      password,
      createdAt: new Date().toISOString()
    };
    
    if (googleSheetsService.isConfigured()) {
      try {
        await googleSheetsService.addRecord(record);
        await loadHistoryFromGoogleSheets();
        toast({
          title: "Salvo",
          description: "Dados salvos no Google Sheets com sucesso!",
        });
      } catch (error) {
        console.error('Erro ao salvar no Google Sheets:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar no Google Sheets. Dados salvos localmente.",
          variant: "destructive",
        });
        // Fallback para localStorage
        saveToLocalStorage(record);
      }
    } else {
      saveToLocalStorage(record);
    }
    
    return record;
  };

  const saveToLocalStorage = (record: CompanyRecord) => {
    const localHistory = getLocalHistory();
    const updatedHistory = [record, ...localHistory];
    localStorage.setItem('companyHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  const getLocalHistory = (): CompanyRecord[] => {
    const stored = localStorage.getItem('companyHistory');
    return stored ? JSON.parse(stored) : [];
  };

  const searchInHistory = (companyName: string): CompanyRecord | null => {
    return history.find(record => 
      record.companyName.toLowerCase() === companyName.toLowerCase()
    ) || null;
  };

  const deleteFromHistory = async (id: string) => {
    try {
      await googleSheetsService.deleteRecord(id);
      await loadHistoryFromGoogleSheets();
      toast({
        title: "Excluído",
        description: "Registro removido com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir registro.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentRecord && currentRecord.id === id) {
      setCurrentRecord(null);
    }
  };

  const updateHistory = async (updatedRecord: CompanyRecord) => {
    const recordWithUpdateTime = {
      ...updatedRecord,
      updatedAt: new Date().toISOString()
    };

    try {
      await googleSheetsService.updateRecord(recordWithUpdateTime);
      await loadHistoryFromGoogleSheets();
      toast({
        title: "Atualizado",
        description: "Registro atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar registro.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentRecord && currentRecord.id === updatedRecord.id) {
      setCurrentRecord(recordWithUpdateTime);
    }
  };

  const handleCompanySubmit = async (companyName: string) => {
    const existingRecord = searchInHistory(companyName);
    
    if (existingRecord) {
      setCurrentRecord(existingRecord);
      toast({
        title: "Encontrado no histórico",
        description: "Credenciais recuperadas do histórico.",
      });
    } else {
      const { username, password } = generateCredentials(companyName);
      const newRecord = await saveRecord(companyName, username, password);
      setCurrentRecord(newRecord);
      toast({
        title: "Credenciais geradas",
        description: "Novas credenciais foram criadas e salvas.",
      });
    }
    setShowHistory(false);
  };

  const handleHistorySelect = (record: CompanyRecord) => {
    setCurrentRecord(record);
    setShowHistory(false);
  };

  const openHistoryPage = () => {
    window.open('/historico.html', '_blank');
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
            <CompanyForm onSubmit={handleCompanySubmit} />
            
            <Card className="border-[#AAD1C2] shadow-lg">
              <CardHeader className="bg-[#117A57] text-white">
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Histórico
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  variant="outline"
                  className="w-full border-[#117A57] text-[#117A57] hover:bg-[#AAD1C2]/20"
                  disabled={isLoading}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? 'Carregando...' : 'Buscar no Histórico'}
                </Button>
                
                <Button
                  onClick={openHistoryPage}
                  className="w-full bg-[#0E4A36] hover:bg-[#117A57] text-white"
                >
                  <History className="w-4 h-4 mr-2" />
                  Ver Histórico Completo
                </Button>
                
                {showHistory && (
                  <div className="mt-4">
                    <HistorySearch
                      history={history}
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
