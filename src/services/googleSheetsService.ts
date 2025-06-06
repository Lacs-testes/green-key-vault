
interface CompanyRecord {
  id: string;
  companyName: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt?: string;
}

class GoogleSheetsService {
  private apiKey: string;
  private spreadsheetId: string;
  private range: string = 'Sheet1!A:F';

  constructor() {
    this.apiKey = localStorage.getItem('google_sheets_api_key') || '';
    this.spreadsheetId = localStorage.getItem('google_sheets_id') || '';
  }

  setCredentials(apiKey: string, spreadsheetId: string) {
    this.apiKey = apiKey;
    this.spreadsheetId = spreadsheetId;
    localStorage.setItem('google_sheets_api_key', apiKey);
    localStorage.setItem('google_sheets_id', spreadsheetId);
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.spreadsheetId);
  }

  private async makeRequest(method: string, endpoint: string, body?: any) {
    const baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    const url = `${baseUrl}/${this.spreadsheetId}${endpoint}?key=${this.apiKey}`;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    return response.json();
  }

  async initializeSheet(): Promise<void> {
    try {
      // Criar cabeçalhos se a planilha estiver vazia
      const headers = [
        ['ID', 'Nome da Empresa', 'Usuário', 'Senha', 'Data de Criação', 'Última Alteração']
      ];

      await this.makeRequest('PUT', `/values/${this.range}`, {
        range: 'Sheet1!A1:F1',
        majorDimension: 'ROWS',
        values: headers
      });
    } catch (error) {
      console.error('Erro ao inicializar planilha:', error);
      throw error;
    }
  }

  async getAllRecords(): Promise<CompanyRecord[]> {
    try {
      const response = await this.makeRequest('GET', `/values/${this.range}`);
      
      if (!response.values || response.values.length <= 1) {
        return [];
      }

      // Pular o cabeçalho (primeira linha)
      const rows = response.values.slice(1);
      
      return rows.map((row: string[]) => ({
        id: row[0] || '',
        companyName: row[1] || '',
        username: row[2] || '',
        password: row[3] || '',
        createdAt: row[4] || '',
        updatedAt: row[5] || undefined
      })).filter(record => record.id); // Filtrar linhas vazias
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      throw error;
    }
  }

  async addRecord(record: CompanyRecord): Promise<void> {
    try {
      const values = [[
        record.id,
        record.companyName,
        record.username,
        record.password,
        record.createdAt,
        record.updatedAt || ''
      ]];

      await this.makeRequest('POST', `/values/${this.range}:append`, {
        range: this.range,
        majorDimension: 'ROWS',
        values: values,
        valueInputOption: 'RAW'
      });
    } catch (error) {
      console.error('Erro ao adicionar registro:', error);
      throw error;
    }
  }

  async updateRecord(record: CompanyRecord): Promise<void> {
    try {
      // Primeiro, encontrar a linha do registro
      const allRecords = await this.getAllRecords();
      const rowIndex = allRecords.findIndex(r => r.id === record.id);
      
      if (rowIndex === -1) {
        throw new Error('Registro não encontrado');
      }

      // +2 porque: +1 para converter de índice 0 para 1, +1 para pular o cabeçalho
      const actualRowIndex = rowIndex + 2;
      
      const values = [[
        record.id,
        record.companyName,
        record.username,
        record.password,
        record.createdAt,
        record.updatedAt || ''
      ]];

      await this.makeRequest('PUT', `/values/Sheet1!A${actualRowIndex}:F${actualRowIndex}`, {
        range: `Sheet1!A${actualRowIndex}:F${actualRowIndex}`,
        majorDimension: 'ROWS',
        values: values,
        valueInputOption: 'RAW'
      });
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      // Primeiro, encontrar a linha do registro
      const allRecords = await this.getAllRecords();
      const rowIndex = allRecords.findIndex(r => r.id === id);
      
      if (rowIndex === -1) {
        throw new Error('Registro não encontrado');
      }

      // +2 porque: +1 para converter de índice 0 para 1, +1 para pular o cabeçalho
      const actualRowIndex = rowIndex + 2;

      // Limpar a linha (não é possível deletar linhas via API básica)
      const emptyValues = [['', '', '', '', '', '']];
      
      await this.makeRequest('PUT', `/values/Sheet1!A${actualRowIndex}:F${actualRowIndex}`, {
        range: `Sheet1!A${actualRowIndex}:F${actualRowIndex}`,
        majorDimension: 'ROWS',
        values: emptyValues,
        valueInputOption: 'RAW'
      });
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
