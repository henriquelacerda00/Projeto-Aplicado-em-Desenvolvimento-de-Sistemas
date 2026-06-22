import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SupabaseService } from './supabase.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(
    private supabaseService: SupabaseService,
    private notificationService: NotificationService
  ) {}

  async sendIndividualData(
    formGroup: FormGroup,
    sectionName: string
  ): Promise<void> {
    const userId = await this.supabaseService.getCurrentUserId();
    if (!userId) {
      this.notificationService.error('Usuário não autenticado.');
      return;
    }

    const data = formGroup.value;
    const mappedData = this.mapIndividualData(data);

    const payload = {
      user_id: userId,
      ...mappedData,
      form_type: sectionName.toLowerCase(),
    };

    try {
      await this.supabaseService.insertData(
        `${sectionName.toLowerCase()}_data`,
        payload
      );
      this.notificationService.success(`✅ ${sectionName} enviado com sucesso :)`);
    } catch (error) {
      this.notificationService.error(`❌ Erro ao enviar ${sectionName}`);
      console.error(`Erro ao inserir dados de ${sectionName}:`, error);
    }
  }

  async submitAllData(formGroup: FormGroup, tableName: string): Promise<void> {
    const userId = await this.supabaseService.getCurrentUserId();
    if (!userId) {
      this.notificationService.error('Usuário não autenticado.');
      return;
    }

    const formData = formGroup.value;
    const header = formData.header;
    const mappedData = this.mapFormData(formData);

    const payload = {
      user_id: userId,
      name: header?.name,
      purpose: header?.purpose,
      sample_number: header?.sample_number,
      date: header?.date
        ? new Date(header.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      ...mappedData,
    };

    try {
      await this.supabaseService.insertData(tableName, payload);
      this.notificationService.success('✅ Formulário enviado com sucesso!');
    } catch (error) {
      this.notificationService.error('❌ Erro ao enviar o formulário');
      console.error('Erro ao inserir dados do formulário:', error);
    }
  }

  // ✅ Lógica de mapeamento para a tabela principal (que contém todos os campos)
  private mapFormData(formData: any): any {
    const mappedData: any = {};
    const flavorAfterTasteData = formData.flavorAfterTaste;
    const acidityData = formData.acidity;
    const sweetnessData = formData.sweetness;
    const mouthfeelData = formData.mouthfeel;
    const fragranceData = formData.fragrance;
    const aromaData = formData.aroma;

    // Mapeamento para `fragrance`
    if (fragranceData) {
      mappedData['fragrance_slider'] = fragranceData.slider_value;
      mappedData['notes_fragrance'] = fragranceData.notes;
      Object.keys(fragranceData).forEach((key) => {
        if (typeof fragranceData[key] === 'boolean') {
          mappedData[key] = fragranceData[key] ? 1 : 0;
        }
      });
    }

    // Mapeamento para `aroma`
    if (aromaData) {
      mappedData['aroma_slider'] = aromaData.slider_value;
      mappedData['notes_aroma'] = aromaData.notes;
      Object.keys(aromaData).forEach((key) => {
        if (typeof aromaData[key] === 'boolean') {
          mappedData[key] = aromaData[key] ? 1 : 0;
        }
      });
    }

    // Mapeamento para `flavorAfterTaste`
    if (flavorAfterTasteData) {
      mappedData['aftertaste_slider'] = flavorAfterTasteData.slider_value;
      mappedData['flavor_slider'] = flavorAfterTasteData.slider_value_hidden;
      mappedData['notes_flavor_aftertaste'] = flavorAfterTasteData.notes;
      const booleanFields = ['floral', 'fruity', 'berry', 'dried_fruit', 'citrus_fruit', 'sour', 'fermented', 'green_vegetative',
      'other', 'chemical', 'musty_earthy', 'woody', 'roasted', 'cereal', 'burnt', 'tobacco', 'nutty', 'cocoa',
      'spice', 'sweet', 'vanilla', 'brown_sugar', 'sour_fermented', 'nutty_cocoa', 'vanilla_vanillin'];
      booleanFields.forEach(field => {
        mappedData[field] = flavorAfterTasteData[field] ? 1 : 0;
      });
      const tastes = flavorAfterTasteData.main_tastes;
      mappedData['main_taste_salty'] = tastes.includes('Salty') ? 1 : 0;
      mappedData['main_taste_bitter'] = tastes.includes('Bitter') ? 1 : 0;
      mappedData['main_taste_sour'] = tastes.includes('Sour') ? 1 : 0;
      mappedData['main_taste_umami'] = tastes.includes('Umami') ? 1 : 0;
      mappedData['main_taste_sweet'] = tastes.includes('Sweet') ? 1 : 0;
    }

    // Mapeamento para `acidity`
    if (acidityData) {
      mappedData['acidity_slider'] = acidityData.slider_value;
      mappedData['notes_acidity'] = acidityData.notes;
    }

    // Mapeamento para `sweetness`
    if (sweetnessData) {
      mappedData['sweetness_slider'] = sweetnessData.slider_value;
      mappedData['notes_sweetness'] = sweetnessData.notes;
    }

    // Mapeamento para `mouthfeel`
    if (mouthfeelData) {
      mappedData['mouthfeel_slider'] = mouthfeelData.slider_value;
      mappedData['notes_mouthfeel'] = mouthfeelData.notes;
      mappedData['rough'] = mouthfeelData.rough ? 1 : 0;
      mappedData['smooth'] = mouthfeelData.smooth ? 1 : 0;
      mappedData['metallic'] = mouthfeelData.metallic ? 1 : 0;
      mappedData['oily'] = mouthfeelData.oily ? 1 : 0;
      mappedData['mouth_drying'] = mouthfeelData.mouth_drying ? 1 : 0;
    }

    return mappedData;
  }

  // ✅ Lógica de mapeamento para as tabelas individuais (`aroma_data`, `fragrance_data`)
  private mapIndividualData(data: any): any {
    const mappedData: any = {};
    const allowedFields = [
      'slider_value', 'notes', 'floral', 'fruity', 'berry', 'dried_fruit',
      'citrus_fruit', 'sour', 'fermented', 'green_vegetative', 'other',
      'chemical', 'musty_earthy', 'woody', 'roasted', 'cereal', 'burnt',
      'tobacco', 'nutty', 'cocoa', 'spice', 'sweet', 'vanilla', 'brown_sugar',
    ];
   
    Object.keys(data).forEach((key) => {
      if (allowedFields.includes(key)) {
        const value = data[key];
        if (typeof value === 'boolean') {
          mappedData[key] = value ? 1 : 0;
        } else {
          mappedData[key] = value;
        }
      }
    });
    return mappedData;
  }
}
