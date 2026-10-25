'use client';

import React, { useState } from 'react';
import { MODEL_PRICING, calculateCost } from '@/lib/pricing';
import { compressCodeContext } from '@/lib/minifiers/codeMinifier';
import { CompressionOptions, SupportedModel } from '@/types';
import { Zap, ShieldCheck, Copy, Check } from 'lucide-react';

export default function Home() {
  const [inputCode, setInputCode] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<SupportedModel>('gpt-4o');
  const [copied, setCopied] = useState<boolean>(false);
  const [options, setOptions] = useState<CompressionOptions>({
    stripComments: true,
    collapseWhitespace: true,
    removeEmptyLines: true,
    stripConsoleLogs: false,
  });

  const compressedCode = compressCodeContext(inputCode, options);
  const costAnalysis = calculateCost(inputCode, compressedCode, selectedModel);

  const handleCopy = () => {
    if (!compressedCode) return;
    navigator.clipboard.writeText(compressedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">ContextCompressor</span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>MIT Licensed</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls & Input */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
              MODEL:
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as SupportedModel)}
              className="bg-gray-950 border border-gray-800 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono"
            >
              {MODEL_PRICING.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (${m.inputCostPer1M} / 1M)
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex-1 flex flex-col">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono mb-2">
              Input Code / Prompt
            </label>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="// Paste your code, JSON schema, or prompt here..."
              className="w-full flex-1 min-h-[300px] bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm font-mono text-gray-200 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono mb-3 block">
              OPTIMIZATION RULES
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <label className="flex items-center space-x-2 cursor-pointer text-gray-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={options.stripComments}
                  onChange={(e) => setOptions({ ...options, stripComments: e.target.checked })}
                  className="rounded border-gray-700 bg-gray-950 text-emerald-500 focus:ring-0"
                />
                <span>Strip Comments</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-gray-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={options.collapseWhitespace}
                  onChange={(e) => setOptions({ ...options, collapseWhitespace: e.target.checked })}
                  className="rounded border-gray-700 bg-gray-950 text-emerald-500 focus:ring-0"
                />
                <span>Collapse Whitespace</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-gray-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={options.removeEmptyLines}
                  onChange={(e) => setOptions({ ...options, removeEmptyLines: e.target.checked })}
                  className="rounded border-gray-700 bg-gray-950 text-emerald-500 focus:ring-0"
                />
                <span>Remove Empty Lines</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-gray-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={options.stripConsoleLogs}
                  onChange={(e) => setOptions({ ...options, stripConsoleLogs: e.target.checked })}
                  className="rounded border-gray-700 bg-gray-950 text-emerald-500 focus:ring-0"
                />
                <span>Strip Console Logs</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Output & Stats */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
              <div className="text-xs font-mono text-gray-400">Token Savings</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                {costAnalysis.savingsPercentage}%
              </div>
              <div className="text-xs text-gray-500 font-mono mt-1">
                ({costAnalysis.savedTokens} tokens)
              </div>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
              <div className="text-xs font-mono text-gray-400">Cost / 1k Calls</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                ${costAnalysis.savedCostPer1kCalls.toFixed(4)}
              </div>
              <div className="text-xs text-emerald-500/80 font-mono mt-1">saved</div>
            </div>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                Compressed Output
              </label>
              <button
                onClick={handleCopy}
                disabled={!compressedCode}
                className="flex items-center space-x-1 text-xs font-mono bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-200 px-2.5 py-1 rounded transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={compressedCode}
              placeholder="Optimized context will appear here..."
              className="w-full flex-1 min-h-[300px] bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm font-mono text-emerald-300 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </main>
  );
}