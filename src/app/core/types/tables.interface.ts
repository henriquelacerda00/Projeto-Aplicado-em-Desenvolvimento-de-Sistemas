import { BaseAnalysis } from './type';

export interface PhysicalAssessment extends BaseAnalysis {
  color: string; // Apenas a cor marcada
  total_green_defects: number;
  tdg_300: number;
  cobtype: string;
  moisture: string;

  // Lista de defeitos com prefixos DC_ e TC_
  dc_full_black: number;
  tc_full_black: number;

  dc_full_sour: number;
  tc_full_sour: number;

  dc_dried_cherry: number;
  tc_dried_cherry: number;

  dc_fungus_damage: number;
  tc_fungus_damage: number;

  dc_foreign_matter: number;
  tc_foreign_matter: number;

  dc_severe_insect_damage: number;
  tc_severe_insect_damage: number;

  dc_partial_black: number;
  tc_partial_black: number;

  dc_partial_sour: number;
  tc_partial_sour: number;

  dc_parchment: number;
  tc_parchment: number;

  dc_floater: number;
  tc_floater: number;

  dc_immature_unripe: number;
  tc_immature_unripe: number;

  dc_withered: number;
  tc_withered: number;

  dc_shell: number;
  tc_shell: number;

  dc_broken_chipped_cut: number;
  tc_broken_chipped_cut: number;

  dc_hull_husk: number;
  tc_hull_husk: number;

  dc_slight_insect_damage: number;
  tc_slight_insect_damage: number;
}

export interface SizeTable extends BaseAnalysis {
  weight_wo_defects: number;
  size_10_g: number;
  size_10_percentage: number;
  size_11_g: number;
  size_11_percentage: number;
  size_12_g: number;
  size_12_percentage: number;
  size_13_g: number;
  size_13_percentage: number;
  size_14_g: number;
  size_14_percentage: number;
  size_15_g: number;
  size_15_percentage: number;
  size_16_g: number;
  size_16_percentage: number;
  size_17_g: number;
  size_17_percentage: number;
  size_18_g: number;
  size_18_percentage: number;
  size_19_g: number;
  size_19_percentage: number;
  size_20_g: number;
  size_20_percentage: number;
  size_21_g: number;
  size_21_percentage: number;
  size_22_g: number;
  size_22_percentage: number;
  size_23_g: number;
  size_23_percentage: number;
}

export interface AffectiveForm extends BaseAnalysis {
  flavor_value: number;
  flavor_notes: string;
  aftertaste_value: number;
  aftertaste_notes: string;
  acidity_value: number;
  acidity_notes: string;
  sweetness_value: number;
  sweetness_notes: string;
  mouthfeel_value: number;
  mouthfeel_notes: string;
  overall_value: number;
  overall_notes: string;
}

export interface DescriptiveForm extends BaseAnalysis {
  flavor_slider: number;
  aftertaste_slider: number;
  floral: number;
  fruity: number;
  berry: number;
  dried_fruit: number;
  citrus_fruit: number;
  sour: number;
  fermented: number;
  green_vegetative: number;
  other: number;
  chemical: number;
  musty_earthy: number;
  woody: number;
  roasted: number;
  cereal: number;
  burnt: number;
  tobacco: number;
  nutty: number;
  cocoa: number;
  spice: number;
  sweet: number;
  vanilla: number;
  brown_sugar: number;
  sour_fermented: number;
  nutty_cocoa: number;
  vanilla_vanillin: number;
  main_taste_salty: number;
  main_taste_bitter: number;
  main_taste_sour: number;
  main_taste_umami: number;
  main_taste_sweet: number;
  acidity_slider: number;
  notes_acidity: string;
  sweetness_slider: number;
  notes_sweetness: string;
  mouthfeel_slider: number;
  rough: number;
  smooth: number;
  metallic: number;
  oily: number;
  mouth_drying: number;
  notes_mouthfeel: string;
  notes_flavor_aftertaste: string;
}

export interface Extrisnic extends BaseAnalysis {
  farm_country: number;
  farm_country_notes: string;
  farm_region: number;
  farm_region_notes: string;
  farm_name_of_farm: number;
  farm_name_of_farm_notes: string;
  farm_name_of_producer: number;
  farm_name_of_producer_notes: string;
  farm_species: number;
  farm_species_notes: string;
  farm_variety: number;
  farm_variety_notes: string;
  farm_harvest_date: number;
  farm_harvest_date_notes: string;
  farm_other: number;
  farm_other_notes: string;
  process_name_of_processor: number;
  process_name_of_processor_notes: string;
  process_wet_mill: number;
  process_dry_mill: number;
  process_fruit_dried: number;
  process_mucilage_dried: number;
  process_parchment_dried: number;
  process_seed_dried: number;
  process_other: number;
  process_other_notes: string;
  process_lactic: number;
  process_anaerobic: number;
  process_anaerobic_notes: string;
  process_carbonic_maceration: number;
  process_multiple_fermentations: number;
  process_co_fermentation: number;
  trading_size_grade: number;
  trading_size_grade_notes: string;
  trading_other_grade: number;
  trading_other_grade_notes: string;
  trading_ico_number: number;
  trading_ico_number_notes: string;
  trading_other: number;
  trading_other_notes: string;
  certific_c4: number;
  certific_fair_trade: number;
  certific_organic: number;
  certific_rainforest_alliance: number;
  certific_geographical_indication: number;
  certific_geographical_indication_notes: string;
  certific_abic: number;
  certific_abic_notes: string;
  certific_other: number;
  certific_other_notes: string;
  impression_of_value: number;
}
