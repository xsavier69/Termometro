import { Component } from '@angular/core';
import { Database, object, ref } from '@angular/fire/database';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  barHeight: number = 0;
  barColor: string = 'blue';
  grados: number = 0;
  previousState: string = 'normal';

  constructor(private database: Database) {}

  async updateThermometer() {
    const limitedGrados = Math.max(0, Math.min(this.grados, 100));
    if (limitedGrados <= 36) {
      this.barColor = 'black';
      this.sendNotification('night');
    } else if (limitedGrados >= 80) {
      this.barColor = 'cyan';
      this.sendNotification('sunny');
    } else {
      this.barColor = 'orange';
      this.sendNotification('afternoon');
    }
    this.barHeight = limitedGrados;
  }

  async sendNotification(state: string) {
    if (state !== this.previousState) {
      if (state === 'night') {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "¡Es de noche!",
              body: "Alistate para tener una linda noche.",
              id: 2,
            },
          ],
        });
      } else if (state === 'sunny') {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "¡Está soleado!",
              body: "Aprovecha del hermoso sol.",
              id: 1,
            },
          ],
        });
      } else {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "¡Tarde!",
              body: "Disfruta de esta tarde soleada.",
              id: 3,
            },
          ],
        });
      }
      this.previousState = state;
    }
  }

  async ngOnInit() {
    const routeGrados = ref(this.database, '/grados');
    object(routeGrados).subscribe((snapshot: any) => {
      const newGrados = snapshot.snapshot.val() ?? 0;
      if (newGrados !== this.grados) {
        this.grados = newGrados;
        this.updateThermometer();
      }
    });
    await LocalNotifications.requestPermissions(); // Solicitar permisos de la app
  }
}