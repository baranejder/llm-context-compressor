import { ModelPricing, SupportedModel } from '@/types';

export const MODEL_PRICING: Record<SupportedModel, ModelPricing> = {
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o-mini',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
  },
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    inputCostPer1M: 10.00,
    outputCostPer1M: 30.00,
  },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
  },
};

export function calculateCost(tokens: number, modelId: SupportedModel): number {
  const model = MODEL_PRICING[modelId] || MODEL_PRICING['gpt-4o'];
  return (tokens / 1_000_000) * model.inputCostPer1M;
}