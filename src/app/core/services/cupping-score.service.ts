import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class CuppingScoreService {

  constructor(private supabaseService : SupabaseService) { }

  calcularCuppingScore(
    notas: number[][], // cada sub-array representa um grupo: aroma, flavor, acidity...
    naoUniformes: number,
    defects: number
  ): number {
    // soma média de cada grupo
    const somaHi = notas.reduce(
      (acc, grupo) => acc + grupo.reduce((a, b) => a + b, 0) / grupo.length,
      0
    );

    return 0.65625 * somaHi + 52.75 - 2 * naoUniformes - 4 * defects;
  }

  /**
   * Calcula e faz upsert na tabela affective_form
   */
 async calcularEAtualizar(payload: any, notas: number[][], naoUniformes: number, defects: number) {
  const cuppingScore = this.calcularCuppingScore(notas, naoUniformes, defects);

  const dataToUpsert = {
    ...payload,          // todos os campos do formulário
    cupping_score: cuppingScore,
  };

  return this.supabaseService.upsertData('affective_form', dataToUpsert);
}

}