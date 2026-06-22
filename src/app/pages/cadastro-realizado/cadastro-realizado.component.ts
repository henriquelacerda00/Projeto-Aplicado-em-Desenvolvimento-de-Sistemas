
import { Component } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-cadastro-realizado',
  imports: [ContainerComponent],
  templateUrl: './cadastro-realizado.component.html',
  styleUrl: './cadastro-realizado.component.scss'
})
export class CadastroRealizadoComponent {

  constructor(private supabaseService : SupabaseService) {}


}
