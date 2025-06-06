class GoogleSheetsService {
  private webAppUrl: string = '';

  constructor() {
    // Tenta carregar do localStorage se já houver
    const storedUrl = localStorage.getItem('google_apps_script_url');
    if (storedUrl) {
      this.webAppUrl = storedUrl;
    }
  }

  // ✅ Define a URL do Google Apps Script Web App
  public setWebAppUrl(url: string) {
    this.webAppUrl = url;
    localStorage.setItem('google_apps_script_url', url);
  }

  // ✅ Verifica se está configurado
  public isConfigured(): boolean {
    return !!localStorage.getItem('google_apps_script_url');
  }

  // ✅ Busca todos os registros da planilha
  public async getAllRecords(): Promise<any[]> {
    if (!this.webAppUrl) {
      throw new Error('URL do Google Apps Script não configurada.');
    }

    const response = await fetch(`${this.webAppUrl}?action=getRecords`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar os registros no Google Sheets.');
    }

    const data = await response.json();
    return data.records || [];
  }

  // ✅ Adiciona um novo registro
  public async addRecord(record: any): Promise<void> {
    if (!this.webAppUrl) {
      throw new Error('URL do Google Apps Script não configurada.');
    }

    const response = await fetch(this.webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addRecord',
        record,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar registro.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erro ao salvar no Google Sheets.');
    }
  }

  // ✅ Atualiza um registro existente
  public async updateRecord(record: any): Promise<void> {
    if (!this.webAppUrl) {
      throw new Error('URL do Google Apps Script não configurada.');
    }

    const response = await fetch(this.webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateRecord',
        record,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar registro.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erro ao salvar atualização no Google Sheets.');
    }
  }

  // ✅ Deleta um registro por ID
  public async deleteRecord(id: string): Promise<void> {
    if (!this.webAppUrl) {
      throw new Error('URL do Google Apps Script não configurada.');
    }

    const response = await fetch(this.webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'deleteRecord',
        id,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar registro.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Erro ao excluir do Google Sheets.');
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
