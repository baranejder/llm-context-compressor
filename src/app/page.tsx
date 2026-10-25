'use client';

import React, { useState, useMemo } from 'react';
import { compressCodeContext } from '@/lib/minifiers/codeMinifier';
import { MODEL_PRICING, calculateCost } from '@/lib/pricing';
import { CompressionOptions, SupportedModel } from '@/types';

export default function Home() {
  const [inputCode, setInputCode] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<SupportedModel>('gpt-4o');
  const [options, setOptions] = useState<CompressionOptions>({
    stripComments: true,
    collapseWhitespace: true,
    removeEmptyLines: true,
    stripConsoleLogs: false,
  });

  const compressedCode = useMemo(() => {
    return compressCodeContext(inputCode, options);
  }, [inputCode, options]);

  // Rough estimation: 1 token ~= 4 chars for code/text
  const rawTokens = useMemo(() => Math.ceil(inputCode.length / 4), [inputCode]);
  const compressedTokens = useMemo(() => Math.ceil(compressedCode.length / 4), [compressedCode]);
  
  const tokensSaved = rawTokens - compressedTokens;
  const reductionPercentage = rawTokens > 0 ? Math.round((tokensSaved / rawTokens) * 100) : 0;

  const costBefore = useMemo(() => calculateCost(rawTokens, selectedModel), [rawTokens, selectedModel]);
  const costAfter = useMemo(() => calculateCost(compressedTokens, selectedModel), [compressedTokens, selectedModel]);
  const costSavings = costBefore - costAfter;

  return (
    <main class="min-h-screen bg-[#090d16] text-gray-100 flex flex-col">
      {/* Navbar */}
      <header class="border-b border-gray-800 bg-gray-950/80 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
            ⚡
          </div>
          <span class="font-bold text-lg tracking-tight">ContextCompressor</span>
        </div>
        <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
          MIT Licensed
        </span>
      </header>

      {/* Main Grid */}
      <div class="max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Column: Input & Controls */}
        <div class="lg:col-span-7 space-y-6">
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
            <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as SupportedModel)}
              class="bg-gray-950 text-xs font-mono text-gray-200 border border-gray-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {Object.values(MODEL_PRICING).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (${m.inputCostPer1M.toFixed(2)} / 1M)
                </option>
              ))}
            </select>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div class="bg-gray-950 px-4 py-2.5 border-b border-gray-800 text-xs text-gray-400 font-medium">
              Input Code / Prompt
            </div>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="// Paste your code, JSON schema, or prompt here..."
              class="w-full h-80 bg-gray-950/50 p-4 text-xs font-mono text-gray-200 focus:outline-none resize-none"
            />
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Optimization Rules
            </h3>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.stripComments}
                  onChange={(e) => setOptions({ ...options, stripComments: e.target.checked })}
                  class="rounded bg-gray-950 border-gray-800 text-emerald-500"
                />
                <span>Strip Comments</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.collapseWhitespace}
                  onChange={(e) => setOptions({ ...options, collapseWhitespace: e.target.checked })}
                  class="rounded bg-gray-950 border-gray-800 text-emerald-500"
                />
                <span>Collapse Whitespace</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removeEmptyLines}
                  onChange={(e) => setOptions({ ...options, removeEmptyLines: e.target.checked })}
                  class="rounded bg-gray-950 border-gray-800 text-emerald-500"
                />
                <span>Remove Empty Lines</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.stripConsoleLogs}
                  onChange={(e) => setOptions({ ...options, stripConsoleLogs: e.target.checked })}
                  class="rounded bg-gray-950 border-gray-800 text-emerald-500"
                />
                <span>Strip Console Logs</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Output & Analytics */}
        <div class="lg:col-span-5 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-900 border border-gray-800 p-4 rounded-xl">
              <span class="text-xs text-gray-400 block mb-1">Token Savings</span>
              <span class="text-2xl font-bold text-emerald-400 font-mono">
                {reductionPercentage}%
              </span>
              <span class="text-[10px] text-gray-500 block font-mono">
                ({tokensSaved > 0 ? tokensSaved : 0} tokens)
              </span>
            </div>
            <div class="bg-gray-900 border border-gray-800 p-4 rounded-xl">
              <span class="text-xs text-gray-400 block mb-1">Cost / 1k Calls</span>
              <span class="text-2xl font-bold text-emerald-400 font-mono">
                ${(costSavings * 1000).toFixed(4)}
              </span>
              <span class="text-[10px] text-gray-500 block font-mono">saved</span>
            </div>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div class="bg-gray-950 px-4 py-2.5 border-b border-gray-800 flex justify-between items-center text-xs text-gray-400">
              <span>Compressed Output</span>
              <button
                onClick={() => navigator.clipboard.writeText(compressedCode)}
                class="hover:text-emerald-400 font-mono"
              >
                Copy
              </button>
            </div>
            <textarea
              readOnly
              value={compressedCode}
              placeholder="Optimized context will appear here..."
              class="w-full h-80 bg-gray-950/50 p-4 text-xs font-mono text-gray-300 focus:outline-none resize-none"
            />
          </div>
        </div>

      </div>
    </main>
  );
}