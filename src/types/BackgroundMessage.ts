export type BackgroundMessage = {
  type: 'GET_AI_CAPABILITIES' | 'ANALYZE_TEXT';
  payload?: {
    text?: string;
  };
};
