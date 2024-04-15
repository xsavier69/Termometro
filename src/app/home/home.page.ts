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

  constructor(private database: Database) {}

  async updateThermometer() {
    const limitedGrados = Math.max(0, Math.min(this.grados, 100));

    if (limitedGrados <= 20) {
      this.barColor = 'blue';
    } else if (limitedGrados >= 80) {
      this.barColor = 'red';
    } else {
      this.barColor = 'green';
    }

    this.barHeight = limitedGrados;

    if (this.grados > 40) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "¡Alerta de temperatura!",
            body: "La temperatura ha superado los 40 grados.",
            id: 1
          }
        ]
      });
    }
  }

  async ngOnInit() {
    const routeGrados = ref(this.database, '/grados');
    object(routeGrados).subscribe((snapshot: any) => {
      this.grados = snapshot.snapshot.val() ?? 0; 
      this.updateThermometer();
    });

    await LocalNotifications.requestPermissions();//solicitar permisos de la app
  }
}
