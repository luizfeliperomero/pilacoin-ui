export interface PilacoinMiningData {
  pilacoinMiningDataId: number;
  pilacoinsFoundPerThread: Record<string, number>;
  pilacoinsFoundPerDifficulty: Record<string, number>;
  timeElapsed: string;
  pilacoins_mined: number;
  date: string;
}
