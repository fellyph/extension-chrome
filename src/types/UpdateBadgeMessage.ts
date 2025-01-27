export interface UpdateBadgeMessage {
  type: 'UPDATE_BADGE';
  payload: {
    color: string;
    text: string;
  };
}
