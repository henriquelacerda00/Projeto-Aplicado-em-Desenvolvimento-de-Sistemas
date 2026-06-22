import { Component, ViewChild } from '@angular/core';
import { ContainerComponent } from '../../../components/container/container.component';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { StepComponent } from "../../../components/step/step.component";
import { NotificationService } from '../../../core/services/notification.service';

import { LoadingService } from '../../../core/services/loading.service';
import { Router } from '@angular/router';
import { SessionService } from '../../../core/hml-services/session.service';


@Component({
  selector: 'app-cadastrar-sessao',
  imports: [ContainerComponent, MaterialModule, CommonModule, StepComponent,],
  templateUrl: './cadastrar-sessao.component.html',
  styleUrl: './cadastrar-sessao.component.scss'
})
export class CadastrarSessaoComponent {
  @ViewChild(StepComponent)
  step!: StepComponent;
  isLoading = false;

  constructor(
    private sessionService: SessionService,
    private notification: NotificationService,
    public loading: LoadingService,
    private router: Router
  ) { }

  get canSubmit(): boolean {
    return !!this.step && this.step.isLastStep && this.step.isLastSample;
  }


  submit() {
    if (this.step) {
      this.step.emitSubmit();
    }
  }


  async onCreateSession(data: {
    sessionName: string;
    qgraders: string[];
    samples: string[];
    extrisincForms: Record<string, any>;
  }) {
    this.isLoading = true;
    this.loading.show();

    try {
      const payload = {
        sessionName: data.sessionName,
        qgraders: data.qgraders,
        samples: data.samples,
        extrisincForms: Object.entries(data.extrisincForms).map(
          ([sampleNumber, form]) => ({
            sampleNumber: data.samples[Number(sampleNumber)],
            farming: form.farming,
            processing: form.processing,
            trading: form.trading,
            certifications: form.certifications,
            // impressionOfValue: form.impression_of_value ?? null,
          })
        )
      };

      console.log('payload' , payload)
      await this.sessionService.createSession(payload);
      this.notification.success('Sessão criada com sucesso!');

      await this.router.navigate(['/minha-sessao']);

    } catch (err) {
      console.error(err);
      this.notification.error('Erro ao criar sessão');
      
    } finally {
      this.isLoading = false;
      this.loading.hide();
    }
  }

}
