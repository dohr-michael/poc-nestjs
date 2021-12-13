export interface Context {
  token: string;
  userId: string;
  userName: string;
  now: Date;
  isAllowed(action: string): Promise<void>;
}
