// src/services/googleSheetsService.ts

export class GoogleSheetsService {
  private webAppUrl: string = '';

  constructor() {
    const storedUrl = localStorage.getItem('google_apps_script_url');
    if (storedUrl) {
      this.webAppUrl = storedUrl;
    }
  }

  public setWebAppUrl(url: string) {
    this.webAppUrl = url;
    localStorage.setItem('google_apps_script_url', url);
  }

  public isConfigured(): boolean {
    return !!localStorage.getItem('google_apps_script_url');
  }

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

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error('Erro ao adicionar registro no Google Sheets.');
    }
  }

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

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error('Erro ao atualizar registro no Google Sheets.');
    }
  }

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

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error('Erro ao excluir registro no Google Sheets.');
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
