import * as sha256 from '@stablelib/sha256';
import { BigInteger } from 'jsbn';
import {
  decodeHexadecimal,
  decodeUtf8,
  encodeHexadecimal,
  getRandomBytes,
} from 'react-native-nacl-jsi';

type Parameters = {
  N: BigInteger;
  g: BigInteger;
  k: BigInteger;
  H: (...args: (string | BigInteger)[]) => BigInteger;
  hashOutputBytes: number;
};

type Session = {
  key: string;
  proof: string;
};

function bigIntegerToHex(i: BigInteger): string {
  const hexString = i.toString(16);
  if (hexString.length % 2 === 0) {
    return hexString;
  }

  const length = (Math.trunc(hexString.length / 2) + 1) * 2;
  return hexString.padStart(length, '0');
}

function hash(...args: (string | BigInteger)[]): BigInteger {
  const stringToHash = args
    .map((arg) => {
      if (arg instanceof BigInteger) {
        return bigIntegerToHex(arg);
      }
      return arg;
    })
    .join('');

  let paddedString = stringToHash;
  if (paddedString.length % 2 === 1) {
    const length = (Math.trunc(paddedString.length / 2) + 1) * 2;
    paddedString = paddedString.padStart(length, '0');
  }

  const h = sha256.hash(decodeHexadecimal(stringToHash));

  return new BigInteger(encodeHexadecimal(h), 16);
}

export function getParameters(): Parameters {
  const N = new BigInteger(
    `
    AC6BDB41 324A9A9B F166DE5E 1389582F AF72B665 1987EE07 FC319294
    3DB56050 A37329CB B4A099ED 8193E075 7767A13D D52312AB 4B03310D
    CD7F48A9 DA04FD50 E8083969 EDB767B0 CF609517 9A163AB3 661A05FB
    D5FAAAE8 2918A996 2F0B93B8 55F97993 EC975EEA A80D740A DBF4FF74
    7359D041 D5C33EA7 1D281E44 6B14773B CA97B43A 23FB8016 76BD207A
    436C6481 F1D2B907 8717461A 5B9D32E6 88F87748 544523B5 24B0D57D
    5EA77A27 75D2ECFA 032CFBDB F52FB378 61602790 04E57AE6 AF874E73
    03CE5329 9CCC041C 7BC308D8 2A5698F3 A8D0C382 71AE35F8 E9DBFBB6
    94B5C803 D89F7AE4 35DE236D 525F5475 9B65E372 FCD68EF2 0FA7111F
    9E4AFF73
    `.replace(/\s+/g, ''),
    16,
  );
  const g = new BigInteger('02', 16);
  const k = new BigInteger(
    encodeHexadecimal(sha256.hash(decodeHexadecimal(`${N.toString(16)}02`))),
    16,
  );
  const H = hash;
  const hashOutputBytes = 32;

  return { N, g, k, H, hashOutputBytes };
}

export async function generateSalt(parameters: Parameters): Promise<string> {
  return encodeHexadecimal(getRandomBytes(parameters.hashOutputBytes));
}

export async function derivePrivateKey(
  salt: string,
  username: string,
  password: string,
  parameters: Parameters,
): Promise<string> {
  const { H } = parameters;

  const s = new BigInteger(salt, 16);
  const I = String(username);
  const p = String(password);

  const x = H(s, H(encodeHexadecimal(decodeUtf8(`${I}:${p}`))));
  return bigIntegerToHex(x);
}

export function deriveVerifier(privateKey: string, parameters: Parameters): string {
  const { N, g } = parameters;

  const x = new BigInteger(privateKey, 16);
  const v = g.modPow(x, N);

  return bigIntegerToHex(v);
}

export async function generateEphemeral(
  parameters: Parameters,
): Promise<{ secret: string; public: string }> {
  const { N, g } = parameters;

  const a = new BigInteger(encodeHexadecimal(getRandomBytes(parameters.hashOutputBytes)), 16);
  const A = g.modPow(a, N);

  return {
    secret: bigIntegerToHex(a),
    public: bigIntegerToHex(A),
  };
}

export function deriveSession(
  clientSecretEphemeral: string,
  serverPublicEphemeral: string,
  salt: string,
  username: string,
  privateKey: string,
  parameters: Parameters,
): Session {
  const a = new BigInteger(clientSecretEphemeral, 16);
  const B = new BigInteger(serverPublicEphemeral, 16);
  const s = new BigInteger(salt, 16);
  const I = String(username);
  const x = new BigInteger(privateKey, 16);

  const { N, g, k, H } = parameters;

  const A = g.modPow(a, N);

  if (B.mod(N).equals(new BigInteger('0', 16))) {
    throw new Error('Invalid server public ephemeral');
  }

  const u = H(A, B);
  const S = B.subtract(k.multiply(g.modPow(x, N))).modPow(a.add(u.multiply(x)), N);
  const K = H(S);

  const M = H(H(N).xor(H(g)), H(encodeHexadecimal(decodeUtf8(I))), s, A, B, K);

  return {
    key: bigIntegerToHex(K),
    proof: bigIntegerToHex(M),
  };
}

export function verifySession(
  clientPublicEphemeral: string,
  clientSession: Session,
  serverSessionProof: string,
  parameters: Parameters,
): void {
  const { H } = parameters;

  const A = new BigInteger(clientPublicEphemeral, 16);
  const M = new BigInteger(clientSession.proof, 16);
  const K = new BigInteger(clientSession.key, 16);

  const expected = H(A, M, K);
  const actual = new BigInteger(serverSessionProof, 16);

  if (!actual.equals(expected)) {
    throw new Error('Server provided invalid session proof');
  }
}
