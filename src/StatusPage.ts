import axios from 'axios';

export class StatusPage {
  private host: string;

  constructor(host: string) {
    this.host = host;
  }

  public async getStatus(): Promise<object> {
    try {
      const res = await axios.get(`${this.host}/api/v2/status.json`);

      return res.data;
    } catch (err) {
      return {
        page: {
          updated_at: new Date().toISOString(),
        },
        status: {
          indicator: 'none',
          description: 'Statuspage unavailable. Assuming everything is ok',
        },
      };
    }
  }
}
