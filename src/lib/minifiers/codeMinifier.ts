import { CompressionOptions } from '@/types';

export function compressCodeContext(input: string, options: CompressionOptions): string {
  if (!input || typeof input !== 'string') return '';

  let output = input;

  if (options.stripComments) {
    output = output
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*/g, '$1');
  }

  if (options.stripConsoleLogs) {
    output = output.replace(/console\.(log|debug|trace|info|warn)\(([^)]+)\);?/g, '');
  }

  if (options.removeEmptyLines) {
    output = output.replace(/^\s*[\r\n]/gm, '');
  }

  if (options.collapseWhitespace) {
    output = output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');
  }

  return output;
}