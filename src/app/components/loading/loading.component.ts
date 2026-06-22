import { Component } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  imports: [MaterialModule, CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

  constructor(public loadingService: LoadingService) { } // Injeta o serviço de loading para acessar o estado de loading
}
