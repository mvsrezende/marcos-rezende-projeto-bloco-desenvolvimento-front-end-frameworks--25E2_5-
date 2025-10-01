import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { decode, encode } from 'base-64';
import { Buffer } from 'buffer';
import process from 'process';

// btoa/atob (Firebase v8 usa isso em alguns fluxos)
if (!(global as any).btoa) (global as any).btoa = encode;
if (!(global as any).atob) (global as any).atob = decode;

// Buffer / process para libs que esperam ambiente Node-like
if (!(global as any).Buffer) (global as any).Buffer = Buffer;
if (!(global as any).process) (global as any).process = process;

// Alguns pacotes esperam "self" como no browser
if (typeof (global as any).self === 'undefined') (global as any).self = global;
