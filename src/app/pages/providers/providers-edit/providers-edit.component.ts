import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ProvidersService} from "../../../common/services/providers.service";
import {Provider} from "../../../common/models/provider.model";
import {AlertService} from "../../../common/services/alert.service";

@Component({
  selector: 'app-providers-edit',
  templateUrl: './providers-edit.component.html',
  styleUrls: ['./providers-edit.component.scss']
})
export class ProvidersEditComponent implements OnInit {

  formGroup: FormGroup;
  dataProvider: Provider;

  flagProvider: boolean;
  account: string;

  constructor(private formBuilder: FormBuilder,
              private activtedRoute: ActivatedRoute,
              private providersService: ProvidersService,
              private router: Router,
              private alertService: AlertService) {

    this.flagProvider = false;

    this.formGroup = this.formBuilder.group({
      name : ['', [Validators.required]],
      phone : ['', [Validators.required]],
      account : ['', [Validators.required]],
      contact : ['', [Validators.required]]
    });

    this.activtedRoute.params.subscribe((params) => {
      const providerID = params.id;
      this.provider(providerID);
    });
  }

  provider(id: number){
    this.providersService.getProvider(id).subscribe((response: any) => {
    this.dataProvider = response.data;
    this.setData();
    this.flagProvider = true;
     console.log(response);
    }, (error) => {
     console.log(error);
    });
  }

  setData(){
   this.formGroup.controls['name'].setValue(this.dataProvider.nombre);
   this.formGroup.controls['phone'].setValue(this.dataProvider.telefono);
   this.formGroup.controls['account'].setValue(this.dataProvider.cuenta_bancaria);
   this.formGroup.controls['contact'].setValue(this.dataProvider.contacto);

  }


  // Método para validar que solo ingresen valores numericos para la cuenta bancaria
  validateAccount(e: KeyboardEvent, FCN: string) {
    const patt = new RegExp(/^[0-9]+$/g);
    const expression = patt.test(this.formGroup.controls[FCN].value);

    if (e.key === 'Backspace') {
      this.account = this.formGroup.controls[FCN].value;
    }

    if (expression) {
      this.account = this.formGroup.controls[FCN].value;
    } else {
      this.formGroup.controls[FCN].setValue(this.account);
    }
  }


  onSubmit() {
    const data: Provider = {
      id: this.dataProvider.id,
      nombre: this.formGroup.controls['name'].value,
      telefono: this.formGroup.controls['phone'].value,
      cuenta_bancaria: this.formGroup.controls['account'].value,
      contacto: this.formGroup.controls['contact'].value
    }

    this.providersService.editProvider(data).subscribe((response: any) => {
      this.alertService.show({text: 'Proveedor actualizado correctamente', title: 'Registro Exitoso', type: 'success', time: 4000});
      this.router.navigate(['/pages/providers']);
    }, (error) => {
      console.log(error);
      this.alertService.show({text: 'No se ha actualizado el proveedor', title: 'Registro Fallido', type: 'error', time: 4000});
    });
  }

  ngOnInit() {
  }

}
