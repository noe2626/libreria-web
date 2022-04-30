import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProvidersService} from "../../../common/services/providers.service";
import {Provider} from "../../../common/models/provider.model";
import {Router} from "@angular/router";
import {AlertService} from "../../../common/services/alert.service";

@Component({
  selector: 'app-providers-add',
  templateUrl: './providers-add.component.html',
  styleUrls: ['./providers-add.component.scss']
})
export class ProvidersAddComponent implements OnInit {

  formGroup: FormGroup;
  account: string;

  constructor(private formBuilder: FormBuilder,
              private providersService: ProvidersService,
              private router: Router,
              private alertService: AlertService) {
    this.formGroup = this.formBuilder.group({
      name : ['', [Validators.required]],
      phone : ['', [Validators.required]],
      account : ['', [Validators.required]],
      contact : ['', [Validators.required]]
    });
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
      nombre: this.formGroup.controls['name'].value,
      telefono: this.formGroup.controls['phone'].value,
      cuenta_bancaria: this.formGroup.controls['account'].value,
      contacto: this.formGroup.controls['contact'].value
    };

    this.providersService.createProvider(data).subscribe((response: any) => {
     console.log(response);
      this.alertService.show({text: 'Proveedor guardado correctamente', title: 'Registro Exitoso', type: 'success', time: 4000});
      this.router.navigate(['/pages/providers']);
    }, (error) => {
      this.alertService.show({text: 'No ha guardado el proveedor', title: 'Registro Fallido', type: 'error', time: 4000});
      console.log(error);
    });
  }

  ngOnInit() {
  }

}
