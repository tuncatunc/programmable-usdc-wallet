import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";

export interface IDerivationPath {
  accountIndex: number;
  subaccountIndex: number
}

export const generateKeypair = (mnemonic: string, derivationPath: IDerivationPath): Keypair =>
{
  const seed = bip39.mnemonicToSeedSync(mnemonic, ""); // (mnemonic, password)

  const path = `m/44'/501'/${derivationPath.accountIndex}'/${derivationPath.subaccountIndex}'`;
  const keypair = Keypair.fromSeed(derivePath(path, seed.toString("hex")).key);

  console.log(`${path} => ${keypair.publicKey.toBase58()}`);
  return keypair;
}