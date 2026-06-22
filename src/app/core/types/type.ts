import { AffectiveForm, DescriptiveForm, Extrisnic, PhysicalAssessment, SizeTable } from './tables.interface';

export interface Card {
  type: 'physical' | 'size' | 'descriptive' | 'affective' | 'extrinsic';
  title?: string;
  icon: string;
  route?: string;
}


export interface UserMetadata {
  full_name?: string;
  role?: string;
}

export interface User {
  user_metadata: any;
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

export interface iFilterValues {
  dateRange: {
    start?: string;
    end?: string;
  };
}

// Interface base para todos os tipos de análise
export interface BaseAnalysis {
  [key: string]: any;
  name: string;
  date: string;
  purpose: string;
  sample_number: string;
}

export interface dataSource {
  tableName: string;
  tableType: string;
  data: BaseAnalysis[];
}

export interface AnaliseUsuario {
  sample_number: string;
  date: string;
  tableType:
  | 'Physical Assessments'
  | 'Size Table'
  | 'Descriptive Form'
  | 'Affective Form'
  | 'Descriptive'
  | 'Aroma'
  | 'Fragrance'
  | 'Extrisinc';
  marks?: Record<string, any>; // o que foi marcado pelo usuário (checkboxes, seleções etc.)
  notes?: string; // anotações do usuário
  cuppingScore?: number; // futuramente
}

// export interface PhysicalAssessment {
//   name: string;
//   date: string;
//   purpose: string;
//   sample_number: string;
//   color: string; // Apenas a cor marcada
//   total_green_defects: number;
//   tdg_300: number;
//   cobtype: string;
//   moisture: string;

//   // Lista de defeitos com prefixos DC_ e TC_
//   DC_full_black: number;
//   TC_full_black: number;

//   DC_full_sour: number;
//   TC_full_sour: number;

//   DC_dried_cherry: number;
//   TC_dried_cherry: number;

//   DC_fungus_damage: number;
//   TC_fungus_damage: number;

//   DC_foreign_matter: number;
//   TC_foreign_matter: number;

//   DC_severe_insect_damage: number;
//   TC_severe_insect_damage: number;

//   DC_partial_black: number;
//   TC_partial_black: number;

//   DC_partial_sour: number;
//   TC_partial_sour: number;

//   DC_parchment: number;
//   TC_parchment: number;

//   DC_floater: number;
//   TC_floater: number;

//   DC_immature_unripe: number;
//   TC_immature_unripe: number;

//   DC_withered: number;
//   TC_withered: number;

//   DC_shell: number;
//   TC_shell: number;

//   DC_broken_chipped_cut: number;
//   TC_broken_chipped_cut: number;

//   DC_hull_husk: number;
//   TC_hull_husk: number;

//   DC_slight_insect_damage: number;
//   TC_slight_insect_damage: number;
// }

export interface MessageResponse {
  message: string;
}