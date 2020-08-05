import { Component, OnInit } from '@angular/core';
import { OperacionService } from '../servicios/operacion/operacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../servicios/usuario/usuario.service';
import { Reintegro } from '../models/reintegro.model';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ReintegroService } from '../servicios/reintegro/reintegro.service';
import { TarjetaService } from '../servicios/tarjeta/tarjeta.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  cuentas = [];
  tarjetas = [];
  monederos = [];
  reintegros = [];
  usuario: Usuario;
  cont: number = 0;

  reintegrosActivos: Reintegro[] = [];

  reintegrosCancelados: Reintegro[] = [];

  reintegrosExitosos: Reintegro[] = [];
  
  reintegroDetalle: Reintegro;


  constructor(private router: Router,
    public toastController : ToastController, 
    private loadingController: LoadingController,
    private alertController: AlertController,
    private reintegroService: ReintegroService,
    public alert: AlertController,
    private tarjetaService: TarjetaService) { }

    solicitudPago(){
      this.router.navigate(['tabs/operaciones/pago'])
    }

    cierre(){
      this.router.navigate(['tabs/operaciones/cierre'])
      //this.router.navigate(['tabs/operaciones/reintegro-detalle']);
    }

  ngOnInit(){

 

    this.reintegroService.reintegrosActivos().subscribe(
      (data: any) =>{
        this.reintegrosActivos = data;
        console.log(this.reintegrosActivos);
      }
    );

    this.reintegroService.reintegrosCancelados().subscribe(
      (data: any) =>{
        this.reintegrosCancelados = data;
        console.log(this.reintegrosCancelados);
      }
    );

    this.reintegroService.reintegrosExitosos().subscribe(
      (data: any) =>{
        this.reintegrosExitosos = data;
        console.log(this.reintegrosExitosos);
      }
    );

  }

  onDetail(Reintegro){
    console.log(Reintegro.fecha.year);
    //setear todos los valores para el detalle
    localStorage.setItem('idReintegroDetalle', Reintegro.idReintegro);
    localStorage.setItem('idUsuarioSolicitanteDetalle', Reintegro.idUsuarioSolicitante);
    localStorage.setItem('anoDetalle', Reintegro.fecha.year);
    localStorage.setItem('mesDetalle', Reintegro.fecha.month);
    localStorage.setItem('diaDetalle', Reintegro.fecha.day);
    localStorage.setItem('montoDetalle', Reintegro.monto);
    localStorage.setItem('estatusDetalle', Reintegro.estatus);
    localStorage.setItem('referenciaDetalle', Reintegro.referencia);
    
    this.router.navigate(['tabs/operaciones/reintegro-detalle']);
  }

  async onClick(IdReintegro){
  
    const alert = await this.alert.create({
      header: 'Cancelar',
      message: '¿Desea cancelar este reintegro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: () => {
            
            this.reintegroService.cancelarReintegro(IdReintegro)
            .subscribe(
              (data: any) =>
              {
                
                //this.successToast('success', 'Cobro cancelado satisfactoriamente')
                console.log(data);
                //this.router.navigate(['/post']);
              },
              err =>{
                console.log(err);
                
                //this.presentToast('danger', 'Ha ocurrido un error al cancelar el cobro');
              }
            );         
          }
        }
      ]
    });
    await alert.present();
  }



}
