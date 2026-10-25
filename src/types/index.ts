export type SupportedModel = 
  | 'gpt-4o' 
  | 'gpt-4o-mini' 
  | 'gpt-4-turbo' 
  | 'claude-3-5-sonnet';

export interface CompressionOptions {
  stripComments: boolean;
  collapseWhitespace: boolean;
  removeEmptyLines: boolean;
  stripConsoleLogs: boolean;
}

export interface ModelPricing {
  id: SupportedModel;
  name: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
}