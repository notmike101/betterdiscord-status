import { BdApi } from 'bandagedbd__bdapi';
import { StatusPage } from '@/StatusPage';

class DiscordStatus {
  private statusPage: StatusPage | null = null;
  private statusGetterTimer: NodeJS.Timer | null = null;
  private updatedAt: string | null = null;
  private timerInterval: number = 10;
  private statusPageHost: string = 'https://discordstatus.com';
  private lastStatus: string | null = 'none';

  public getName() {
    return 'Discord Status';
  }

  public load() {
    this.statusPage = new StatusPage(this.statusPageHost);
    this.updatedAt = BdApi.loadData('discordStatus', 'updatedAt');
  }

  private processStatus(status: string, statusText: string) {
    if (status !== 'none') {
      const properCaseStatus = status[0].toUpperCase() + status.slice(1);
      BdApi.alert(
        'Discord Status Update',
        `Impact Level: ${properCaseStatus}\n\nDescription: ${statusText}\n\n\n\nMore information at https://discordstatus.com`
      );
    } else if (status === 'none' && this.lastStatus !== 'none') {
      BdApi.showToast('Discord is functioning normally', {
        type: 'info',
        icon: true,
        timeout: 5000,
      });

      return;
    }
  }

  public async start() {
    this.statusGetterTimer = setInterval(async () => {
      const status: any = await this.statusPage.getStatus();

      const isUpdated = status.page.updated_at !== this.updatedAt;

      if (isUpdated) {
        this.updatedAt = status.page.updated_at;

        BdApi.saveData('discordStatus', 'updatedAt', this.updatedAt);
        this.processStatus(status.status.indicator, status.status.description);
      }

      this.lastStatus = status.status.indicator;
    }, this.timerInterval * 1000);
  }

  public stop() {
    clearInterval(this.statusGetterTimer);
  }
}

module.exports = DiscordStatus;
