const DEEP_LEARNING_DOC_PREFIX = 'learn-ai/deep-learning/';

const LATEX_TOKENS = [
  '\\begin{',
  '\\frac',
  '\\sqrt',
  '\\left',
  '\\right',
  '\\mathbf',
  '\\delta',
  '\\partial',
  '\\sum',
  '\\prod',
  '\\theta',
  '\\times',
  '\\cdot',
  '\\odot',
  '\\lambda',
  '\\quad',
  '\\qquad',
  '\\approx',
  '\\epsilon',
  '\\gamma',
  '\\beta',
  '\\text{',
  '\\exp',
  '\\log',
  '\\to',
  '\\lim',
  '\\in',
  '\\ne',
  '\\infty',
  '\\triangle',
  '\\int',
  '\\hat',
  '\\bar'
];

const LATEX_CANONICAL_REPLACEMENTS = new Map([
  ['\\\\times', '×'],
  ['\\\\cdot', '⋅'],
  ['\\\\lambda', 'λ'],
  ['\\\\theta', 'θ'],
  ['\\\\delta', 'δ'],
  ['\\\\epsilon', 'ε'],
  ['\\\\gamma', 'γ'],
  ['\\\\beta', 'β'],
  ['\\\\alpha', 'α'],
  ['\\\\to', '→'],
  ['\\\\infty', '∞'],
  ['\\\\in', '∈'],
  ['\\\\ne', '≠'],
  ['\\\\triangle', '△'],
  ['\\\\sum', '∑'],
  ['\\\\prod', '∏'],
  ['\\\\int', '∫'],
  ['\\\\lim', 'lim'],
  ['\\\\quad', ' '],
  ['\\\\qquad', ' '],
  ['\\\\left', ''],
  ['\\\\right', ''],
  ['\\\\mathrm', ''],
  ['\\\\hat', ''],
  ['\\\\bar', '']
]);

function findFirstLatexTokenIndex(line) {
  const indexes = LATEX_TOKENS
    .map((token) => line.indexOf(token))
    .filter((index) => index >= 0);

  if (!indexes.length) {
    return -1;
  }

  return Math.min(...indexes);
}

function isAsciiText(text) {
  return Array.from(text).every((char) => char.charCodeAt(0) <= 127);
}

function trimAtFirstNonAscii(text) {
  for (let index = 0; index < text.length; index += 1) {
    if (text.charCodeAt(index) > 127) {
      return text.slice(0, index);
    }
  }

  return text;
}

function normalizeFormulaFragment(text) {
  return text
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .replace(/\\\\/g, '\\')
    .replace(/\\_/g, '_')
    .replace(/\\=/g, '=')
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\*/g, '*')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalizeFormulaText(text) {
  let value = String(text || '').replace(/[\u200b\u200c\u200d\ufeff]/g, '');

  for (const [key, replacement] of LATEX_CANONICAL_REPLACEMENTS.entries()) {
    value = value.replace(new RegExp(key, 'g'), replacement);
  }

  return value
    .replace(/\\\\/g, '\\')
    .replace(/\\([=()[\]{}])/g, '$1')
    .replace(/[\\^_{}\s]/g, '')
    .replace(/[()[\],;:]/g, '')
    .replace(/\|/g, '∣')
    .trim();
}

function computeTextOverlap(left, right) {
  if (!left || !right) {
    return 0;
  }

  if (left.includes(right) || right.includes(left)) {
    return Math.min(left.length, right.length);
  }

  let best = 0;
  const maxLength = Math.min(left.length, right.length);

  for (let length = 1; length <= maxLength; length += 1) {
    if (left.slice(-length) === right.slice(0, length) || right.slice(-length) === left.slice(0, length)) {
      best = length;
    }
  }

  return best;
}

function getBracketBalance(text) {
  const openingPairs = { '(': ')', '[': ']', '{': '}' };
  const closingPairs = new Set(Object.values(openingPairs));
  const stack = [];
  let mismatches = 0;

  for (const char of text) {
    if (openingPairs[char]) {
      stack.push(openingPairs[char]);
    } else if (closingPairs.has(char)) {
      if (stack[stack.length - 1] === char) {
        stack.pop();
      } else {
        mismatches += 1;
      }
    }
  }

  return { mismatches, remaining: stack.length };
}

function scoreLatexCandidate(middle, prefix, suffix) {
  const tokenCount = LATEX_TOKENS.filter((token) => middle.includes(token)).length;
  const hasLatexSignal = tokenCount > 0 || /[\^_]/.test(middle);

  if (!hasLatexSignal) {
    return Number.NEGATIVE_INFINITY;
  }

  const balance = getBracketBalance(middle);
  const canonicalPrefix = canonicalizeFormulaText(prefix);
  const canonicalMiddle = canonicalizeFormulaText(middle);
  const canonicalSuffix = canonicalizeFormulaText(suffix);

  return tokenCount * 30
    + computeTextOverlap(canonicalPrefix, canonicalMiddle) * 6
    + computeTextOverlap(canonicalSuffix, canonicalMiddle) * 6
    + computeTextOverlap(canonicalPrefix, canonicalSuffix) * 8
    - middle.length * 0.05
    - balance.mismatches * 35
    - balance.remaining * 18
    - (/^[)\]}.,;:]/.test(middle) ? 30 : 0)
    - (/[([{]$/.test(middle) ? 30 : 0)
    - (/[,;:]$/.test(middle) ? 6 : 0)
    + (/^[A-Za-z]/.test(middle) ? 4 : 0)
    + (/[A-Za-z0-9)}\]]$/.test(middle) ? 4 : 0);
}

function extractInlineLatex(blob) {
  const normalizedBlob = normalizeFormulaFragment(blob);
  let bestMatch = null;

  for (let start = 1; start < normalizedBlob.length - 1; start += 1) {
    for (let end = start + 1; end < normalizedBlob.length; end += 1) {
      const middle = normalizedBlob.slice(start, end);

      if (/[^ -~]/.test(middle)) {
        continue;
      }

      const prefix = normalizedBlob.slice(0, start);
      const suffix = normalizedBlob.slice(end);
      const score = scoreLatexCandidate(middle, prefix, suffix);

      if (!Number.isFinite(score)) {
        continue;
      }

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { score, middle };
      }
    }
  }

  return bestMatch?.middle || '';
}

function splitInlineOuterPunctuation(segment) {
  let start = 0;
  let end = segment.length;

  while (start < end && /[\s([{<"'`]/.test(segment[start])) {
    start += 1;
  }

  while (end > start && /[\s)\]}>",;:!?，。；：！？]/.test(segment[end - 1])) {
    end -= 1;
  }

  return {
    leading: segment.slice(0, start),
    core: segment.slice(start, end),
    trailing: segment.slice(end)
  };
}

function cleanInlineMathSegment(segment) {
  if (!LATEX_TOKENS.some((token) => segment.includes(token))) {
    return segment;
  }

  const { leading, core, trailing } = splitInlineOuterPunctuation(segment);
  const latex = extractInlineLatex(core);

  if (!latex) {
    return segment;
  }

  return `${leading}$${latex}$${trailing}`;
}

function normalizeDeepLearningInlineMath(line) {
  if (!/[\u4e00-\u9fff]/.test(line) || !LATEX_TOKENS.some((token) => line.includes(token))) {
    return line;
  }

  return line.replace(/[^\u4e00-\u9fff]+/g, (segment) => cleanInlineMathSegment(segment));
}

function isLikelyCorruptedPrefix(prefix) {
  return /\[[A-Za-z0-9+\-*/.=]{6,}\]/.test(prefix) || prefix.length > 48;
}

function extractDisplayLatex(line) {
  const tokenIndex = findFirstLatexTokenIndex(line);

  if (tokenIndex === -1) {
    return '';
  }

  const normalizedPrefix = normalizeFormulaFragment(line.slice(0, tokenIndex));
  const keepPrefix = normalizedPrefix
    && isAsciiText(normalizedPrefix)
    && !normalizedPrefix.includes('\\')
    && !isLikelyCorruptedPrefix(normalizedPrefix);

  const candidate = trimAtFirstNonAscii(`${keepPrefix ? `${normalizedPrefix} ` : ''}${line.slice(tokenIndex)}`);

  const normalized = normalizeFormulaFragment(candidate)
    .replace(/\s+\\end\{/g, '\\end{')
    .replace(/\\\s+end\{/g, '\\end{');

  const endMatches = [...normalized.matchAll(/\\end\{[^}]+\}/g)];

  if (endMatches.length) {
    const lastMatch = endMatches[endMatches.length - 1];
    const endIndex = lastMatch.index + lastMatch[0].length;
    return normalized.slice(0, endIndex).trim();
  }

  const inlineCandidate = extractInlineLatex(line);

  if (inlineCandidate) {
    const normalizedDisplay = canonicalizeFormulaText(normalized);
    const normalizedInline = canonicalizeFormulaText(inlineCandidate);

    if (
      normalized.startsWith('\\')
      || normalizedInline.length > normalizedDisplay.length
      || (
        normalizedDisplay
        && normalizedInline
        && normalizedDisplay !== normalizedInline
        && normalizedDisplay.includes(normalizedInline)
      )
    ) {
      return inlineCandidate;
    }
  }

  return normalized;
}

function shouldConvertToDisplayMath(line) {
  const trimmed = line.trim();

  if (!trimmed) {
    return false;
  }

  if (/^(?:[#>*-]\s|\d+\.\s)/.test(trimmed)) {
    return false;
  }

  if (/^(?:!\[|```|<.+>$)/.test(trimmed)) {
    return false;
  }

  if (/[\u4e00-\u9fff]/.test(trimmed)) {
    return false;
  }

  return LATEX_TOKENS.some((token) => trimmed.includes(token));
}

export function normalizeDeepLearningMathMarkdown(content, docPath = '') {
  if (!content || !docPath.startsWith(DEEP_LEARNING_DOC_PREFIX)) {
    return content;
  }

  return content
    .split('\n')
    .map((line) => {
      const normalizedInlineLine = normalizeDeepLearningInlineMath(line);

      if (!shouldConvertToDisplayMath(line)) {
        return normalizedInlineLine;
      }

      const latex = extractDisplayLatex(normalizedInlineLine);

      if (!latex) {
        return normalizedInlineLine;
      }

      return `$$\n${latex}\n$$`;
    })
    .join('\n');
}
