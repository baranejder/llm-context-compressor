import { ModelPricing, SupportedModel } from '@/types';

export const MODEL_PRICING: ModelPricing[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    inputCostPer1M: 10.00,
    outputCostPer1M: 30.00,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
  },
];

export function calculateCost(
  originalCode: string,
  compressedCode: string,
  modelId: SupportedModel = 'gpt-4o'
) {
  const originalTokens = Math.ceil(originalCode.length / 4);
  const compressedTokens = Math.ceil(compressedCode.length / 4);
  const savedTokens = Math.max(0, originalTokens - compressedTokens);

  const model = MODEL_PRICING.find((m) => m.id === modelId) || MODEL_PRICING[0];
  
  const savedCostPer1kCalls = (savedTokens / 1000000) * model.inputCostPer1M * 1000;
  const savingsPercentage = originalTokens > 0 
    ? Math.round((savedTokens / originalTokens) * 100) 
    : 0;

  return {
    originalTokens,
    compressedTokens,
    savedTokens,
    savingsPercentage,
    savedCostPer1kCalls,
  };
}