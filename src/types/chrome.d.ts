declare namespace chrome {
  export namespace aiOriginTrial {
    export namespace languageModel {
      export function capabilities(): Promise<AILanguageModelCapabilities>;
      export function create(
        options?: AILanguageModelCreateOptions
      ): Promise<AILanguageModelSession>;
    }
  }
}

interface AILanguageModelCapabilities {
  available: 'no' | 'readily' | 'after-download';
  defaultTopK: number;
  maxTopK: number;
  defaultTemperature: number;
}

interface AILanguageModelCreateOptions {
  systemPrompt?: string;
  temperature?: number;
  topk?: number;
  signal?: AbortSignal;
  monitor?: (m: {
    addEventListener: (event: string, callback: (e: DownloadProgressEvent) => void) => void;
  }) => void;
}

interface AILanguageModelSession {
  prompt(text: string, options?: { signal?: AbortSignal }): Promise<string>;
  promptStreaming(text: string, options?: { signal?: AbortSignal }): ReadableStream<string>;
  destroy(): void;
  clone(options?: { signal?: AbortSignal }): Promise<AILanguageModelSession>;
}

interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
}
