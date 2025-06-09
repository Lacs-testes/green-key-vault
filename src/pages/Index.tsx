
import React, { useState } from 'react';
import CompanyForm from '@/components/CompanyForm';
import CredentialsDisplay from '@/components/CredentialsDisplay';
import HistorySection from '@/components/HistorySection';
import WelcomeCard from '@/components/WelcomeCard';
import AppHeader from '@/components/AppHeader';
import { useCompanyRecords } from '@/hooks/useCompanyRecords';

const Index = () => {
  const [showHistory, setShowHistory] = useState(false);
  const {
    currentRecord,
    history,
    isLoading,
    handleCompanySubmit,
    handleDelete,
    handleUpdate,
    handleHistorySelect
  } = useCompanyRecords();

  const onHistorySelect = (record: any) => {
    handleHistorySelect(record);
    setShowHistory(false);
  };

  const onCompanySubmit = async (companyName: string) => {
    await handleCompanySubmit(companyName);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#AAD1C2]/20">
      <div className="container mx-auto px-4 py-8">
        <AppHeader />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário Principal */}
          <div className="space-y-6">
            <CompanyForm onSubmit={onCompanySubmit} />
            
            <HistorySection
              showHistory={showHistory}
              setShowHistory={setShowHistory}
              history={history}
              isLoading={isLoading}
              onSelect={onHistorySelect}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>

          {/* Exibição de Credenciais */}
          <div>
            {currentRecord ? (
              <CredentialsDisplay record={currentRecord} />
            ) : (
              <WelcomeCard />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
