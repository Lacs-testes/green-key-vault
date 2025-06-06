
interface CompanyRecord {
  id: string;
  companyName: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt?: string;
}

class GoogleSheetsService {
  private webAppUrl: string;

  constructor() {
    this.webAppUrl = localStorage.getItem('google_apps_script_url') || '';
  }

  setWebAppUrl(url: string) {
    this.webAppUrl = url;
    localStorage.setItem('google_apps_script_url', url);
  }

  isConfigured(): boolean {
    return !!this.webAppUrl;
  }

  async getAllRecords(): Promise<CompanyRecord[]> {
    if (!this.isConfigured()) {
      throw new Error('Google Apps Script URL não configurado');
    }

    try {
      const response = await fetch(`${this.webAppUrl}?action=getRecords`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        console.error('Response status:', response.status, response.statusText);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados recebidos do Google Sheets:', data);
      return data.records || [];
    } catch (error) {
      console.error('Erro detalhado ao buscar registros:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Erro de CORS ou URL incorreta. Verifique se o Apps Script está publicado corretamente.');
      }
      throw error;
    }
  }

  async addRecord(record: CompanyRecord): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Google Apps Script URL não configurado');
    }

    try {
      const response = await fetch(this.webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          action: 'addRecord',
          record: record
        }),
      });

      if (!response.ok) {
        console.error('Response status:', response.status, response.statusText);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Resultado do envio:', result);
      if (!result.success) {
        throw new Error(result.error || 'Erro ao adicionar registro');
      }
    } catch (error) {
      console.error('Erro detalhado ao adicionar registro:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Erro de CORS ou URL incorreta. Verifique se o Apps Script está publicado corretamente.');
      }
      throw error;
    }
  }

  async updateRecord(record: CompanyRecord): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Google Apps Script URL não configurado');
    }

    try {
      const response = await fetch(this.webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          action: 'updateRecord',
          record: record
        }),
      });

      if (!response.ok) {
        console.error('Response status:', response.status, response.statusText);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Erro ao atualizar registro');
      }
    } catch (error) {
      console.error('Erro detalhado ao atualizar registro:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Erro de CORS ou URL incorreta. Verifique se o Apps Script está publicado corretamente.');
      }
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Google Apps Script URL não configurado');
    }

    try {
      const response = await fetch(this.webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          action: 'deleteRecord',
          id: id
        }),
      });

      if (!response.ok) {
        console.error('Response status:', response.status, response.statusText);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Erro ao deletar registro');
      }
    } catch (error) {
      console.error('Erro detalhado ao deletar registro:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Erro de CORS ou URL incorreta. Verifique se o Apps Script está publicado corretamente.');
      }
      throw error;
    }
  }

  // Método para inicializar a planilha (criar cabeçalhos)
  async initializeSheet(): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Google Apps Script URL não configurado');
    }

    try {
      const response = await fetch(this.webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          action: 'initialize'
        }),
      });

      if (!response.ok) {
        console.error('Response status:', response.status, response.statusText);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Erro ao inicializar planilha');
      }
    } catch (error) {
      console.error('Erro detalhado ao inicializar planilha:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Erro de CORS ou URL incorreta. Verifique se o Apps Script está publicado corretamente.');
      }
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
