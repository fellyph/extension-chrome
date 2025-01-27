export interface AICapabilities {
  available: boolean | 'no';
  defaultTopK: number;
}

export interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
}

export interface AISession {
  prompt: (text: string) => Promise<string>;
}

export interface AISessionOptions {
  monitor?: (m: {
    addEventListener: (event: string, callback: (e: DownloadProgressEvent) => void) => void;
  }) => void;
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
}
