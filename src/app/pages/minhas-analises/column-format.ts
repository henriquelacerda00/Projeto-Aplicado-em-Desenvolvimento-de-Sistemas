import { PhysicalAssessment } from '../../core/types/tables.interface';
import { BaseAnalysis } from '../../core/types/type';

const baseNames: BaseAnalysis = {
  name: 'Name',
  date: 'Date',
  purpose: 'Purpose',
  sample_number: 'Sample Number',
};

const physicalAssessmentsNames: Record<string, string> = {
  ...baseNames,
  color: 'Color',
  total_green_defects: 'Total Green Defects',
  tdg_300: 'TDG 300',
  cobtype: 'Cobtype',
  moisture: 'Moisture',

  // Lista de defeitos com prefixos DC_ e TC_
  dc_full_black: 'Defective Count Full Black',
  tc_full_black: 'Full Defects Count Full Black',

  dc_full_sour: 'Defective Count Full Sour',
  tc_full_sour: 'Full Defects Count Full Sour',

  dc_dried_cherry: 'Defective Count Dried Cherry',
  tc_dried_cherry: 'Full Defects Count Dried Cherry',

  dc_fungus_damage: 'Defective Count Fungus Damage',
  tc_fungus_damage: 'Full Defects Count Fungus Damage',

  dc_foreign_matter: 'Defective Count Foreign Matter',
  tc_foreign_matter: 'Full Defects Count Foreign Matter',

  dc_severe_insect_damage: 'Defective Count Severe Insect Damage',
  tc_severe_insect_damage: 'Full Defects Count Severe Insect Damage',

  dc_partial_black: 'Defective Count Partial Black',
  tc_partial_black: 'Full Defects Count Partial Black',

  dc_partial_sour: 'Defective Count Partial Sour',
  tc_partial_sour: 'Full Defects Count Partial Sour',

  dc_parchment: 'Defective Count Parchment',
  tc_parchment: 'Full Defects Count Parchment',

  dc_floater: 'Defective Count Floater',
  tc_floater: 'Full Defects Count Floater',

  dc_immature_unripe: 'Defective Count Immature/Unripe',
  tc_immature_unripe: 'Full Defects Count Immature/Unripe',

  dc_withered: 'Defective Count Withered',
  tc_withered: 'Full Defects Count Withered',

  dc_shell: 'Defective Count Shell',
  tc_shell: 'Full Defects Count Shell',

  dc_broken_chipped_cut: 'Defective Count Broken/Chipped/Cut',
  tc_broken_chipped_cut: 'Full Defects Count Broken/Chipped/Cut',

  dc_hull_husk: 'Defective Count Hull/Husk',
  tc_hull_husk: 'Full Defects Count Hull/Husk',

  dc_slight_insect_damage: 'Defective Count Slight Insect Damage',
  tc_slight_insect_damage: 'Full Defects Count Slight Insect Damage',
};

export const formatColumnName = (tableName: string, key: string): string => {
  return physicalAssessmentsNames[key] || key;
};
