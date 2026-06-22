import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MaterialModule } from '../../core/material/material.module';
import { NotificationService } from '../../core/services/notification.service';
import { ExtrisincFormComponent } from '../../pages/extrisinc-form/extrisinc-form.component';
import { MatStepper } from '@angular/material/stepper';

export interface QGrader {
  email: string;
}

export interface Sample {
  sampleNumber: string;
}

@Component({
  selector: 'app-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule, ExtrisincFormComponent],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
})
export class StepComponent implements AfterViewInit, OnChanges {
  @Output() submitSession = new EventEmitter<{
    sessionName: string;
    qgraders: string[];
    samples: string[];
    extrisincForms: Record<string, any>;
  }>();
  @Input() editMode = false;
  @Input() initialSessionData: {
    sessionName: string;
    qgraders: string[];
    samples: string[];
    extrisincForms?: Record<string, any>;
  } | null = null;

  @Input() lockSubmittedData = false;

  @ViewChild(MatStepper) stepper!: MatStepper;

  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  extrisincForms: {
    sampleNumber: string;
    farming: any;
    processing: any;
    trading: any;
    certifications: any;
    impressionOfValue?: number | null;
  }[] = [];
  currentSampleIndex = 0;
  currentExtrisincData: any = undefined;

  get samples(): Sample[] {
    return this.sampleDataSource.data;
  }

  get currentSample(): Sample | null {
    return this.samples[this.currentSampleIndex] ?? null;
  }

  get currentSampleNumber(): string | null {
    return this.currentSample?.sampleNumber ?? null;
  }

  get isLastSample(): boolean {
    return this.currentSampleIndex === this.samples.length - 1;
  }

  get isLastStep(): boolean {
    return this.stepper?.selectedIndex === this.stepper?.steps.length - 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialSessionData'] && this.initialSessionData && this.editMode) {
      this.loadInitialData();
    }
  }

  private updateCurrentExtrisincData() {
    if (!this.currentSampleNumber) {
      this.currentExtrisincData = undefined;
      return;
    }

    const data = this.extrisincForms.find(
      (form) => form.sampleNumber === this.currentSampleNumber
    );
    this.currentExtrisincData = data ? structuredClone(data) : undefined;
  }

  private loadInitialData() {
    if (!this.initialSessionData) return;

    this.primeiroFormGroup.patchValue({
      sessionName: this.initialSessionData.sessionName,
    });

    this.dataSource.data = this.initialSessionData.qgraders.map((email) => ({ email }));

    this.sampleDataSource.data = this.initialSessionData.samples.map((sampleNumber) => ({
      sampleNumber,
    }));

    this.extrisincForms = (this.initialSessionData.extrisincForms as any) ?? [];

    this.updateQGraderValidity();
    this.updateCurrentExtrisincData();
  }

  onSamplePageChange(event: any) {
    this.currentSampleIndex = event.pageIndex;
    this.updateCurrentExtrisincData();
  }

  onExtrisincChange(value: any) {
    const sample = this.currentSample?.sampleNumber;
    if (!sample) return;

    const index = this.extrisincForms.findIndex(
      (f) => f.sampleNumber === sample
    );

    if (index >= 0) {
      this.extrisincForms[index] = {
        ...this.extrisincForms[index],
        ...value,
      };
    } else {
      this.extrisincForms.push({
        sampleNumber: sample,
        ...value,
      });
    }
  }

  displayedColumns: string[] = ['email', 'actions'];
  dataSource = new MatTableDataSource<QGrader>([]);

  displayedSampleColumns: string[] = ['sampleNumber', 'actions'];
  sampleDataSource = new MatTableDataSource<Sample>([]);

  @ViewChild('qGraderPaginator') qGraderPaginator!: MatPaginator;
  @ViewChild('samplePaginator') samplePaginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.qGraderPaginator;
    this.sampleDataSource.paginator = this.samplePaginator;
  }

  primeiroFormGroup = this.fb.group({
    sessionName: ['', Validators.required],
  });

  segundoFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    qgradersValid: [false, Validators.requiredTrue],
  });

  terceiroFormGroup = this.fb.group({
    sampleInput: ['', Validators.required],
  });

  private updateQGraderValidity() {
    this.segundoFormGroup.get('qgradersValid')?.setValue(this.dataSource.data.length > 0);

    this.segundoFormGroup.updateValueAndValidity();
  }

  addQGrader() {
    const emailControl = this.segundoFormGroup.get('email');
    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched();
      return;
    }

    const email = emailControl.value as string;

    if (this.dataSource.data.some((q) => q.email === email)) {
      this.notificationService.error('Este Q-Grader já foi adicionado.');
      return;
    }

    this.dataSource.data = [...this.dataSource.data, { email }];
    this.segundoFormGroup.get('qgradersValid')?.setValue(true);

    emailControl.reset('');
    emailControl.setErrors(null);
  }

  removeQGrader(index: number) {
    if (this.dataSource.data.length === 1) {
      this.notificationService.error('Deve haver ao menos um Q-Grader.');
      return;
    }

    const data = [...this.dataSource.data];
    data.splice(index, 1);
    this.dataSource.data = data;

    this.updateQGraderValidity();
  }

  editQGrader(index: number) {
    const emailControl = this.segundoFormGroup.get('email');
    if (!emailControl) return;

    const qGrader = this.dataSource.data[index];
    emailControl.setValue(qGrader.email);

    const data = [...this.dataSource.data];
    data.splice(index, 1);
    this.dataSource.data = data;

    this.updateQGraderValidity();
  }

  addSample() {
    const control = this.terceiroFormGroup.get('sampleInput');

    if (!control) {
      return;
    }

    if (control.invalid || control.value === null || control.value === undefined) {
      control.markAsTouched();
      return;
    }

    const value = control.value as string;

    this.sampleDataSource.data = [...this.sampleDataSource.data, { sampleNumber: value }];

    control.reset('');
    control.setErrors(null);

    this.updateCurrentExtrisincData();
  }

  removeSample(index: number) {
    if (this.sampleDataSource.data.length === 1) {
      this.notificationService.error('Deve haver ao menos uma amostra.');
      return;
    }

    const data = [...this.sampleDataSource.data];
    data.splice(index, 1);
    this.sampleDataSource.data = data;

    if (this.currentSampleIndex >= this.sampleDataSource.data.length) {
      this.currentSampleIndex = Math.max(0, this.sampleDataSource.data.length - 1);
    }

    this.updateCurrentExtrisincData();
  }

  editSample(index: number) {
    const sample = this.sampleDataSource.data[index];
    if (!sample) return;

    this.terceiroFormGroup.get('sampleInput')?.setValue(sample.sampleNumber);

    const data = [...this.sampleDataSource.data];
    data.splice(index, 1);
    this.sampleDataSource.data = data;

    if (this.currentSampleIndex >= this.sampleDataSource.data.length) {
      this.currentSampleIndex = Math.max(0, this.sampleDataSource.data.length - 1);
    }

    this.updateCurrentExtrisincData();
  }

  emitSubmit() {
    const extrisincForms: any[] = Object.entries(this.extrisincForms).map(
      ([sampleNumber, form]) => ({
        sampleNumber,
        farming: form?.farming ?? null,
        processing: form?.processing ?? null,
        trading: form?.trading ?? null,
        certifications: form?.certifications ?? null,
        // impressionOfValue: form?.impression_of_value ?? null,
      })
    );

    this.submitSession.emit({
      sessionName: this.primeiroFormGroup.value.sessionName!,
      qgraders: this.dataSource.data.map((q) => q.email),
      samples: this.sampleDataSource.data.map((s) => s.sampleNumber),
      extrisincForms: extrisincForms as any,
    });
  }
}
