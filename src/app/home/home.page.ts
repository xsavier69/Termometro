import { Component } from '@angular/core';
import { Database, object, ref } from '@angular/fire/database';

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

  updateThermometer() {
    // Limitar el valor de grados entre 0 y 100
    const limitedGrados = Math.max(0, Math.min(this.grados, 100));

    if (limitedGrados <= 20) {
      this.barColor = 'blue';
    } else if (limitedGrados >= 80) {
      this.barColor = 'red';
    } else {
      this.barColor = 'green';
    }

    this.barHeight = limitedGrados;
  }

  ngOnInit() {
    // Suscripción a la ruta "/grados" en la base de datos para obtener el valor numérico
    const routeGrados = ref(this.database, '/grados');
    object(routeGrados).subscribe((snapshot: any) => {
      this.grados = snapshot.snapshot.val() ?? 0; // Acceder a los datos a través de snapshot.snapshot.val()
      this.updateThermometer();
    });
  }
}