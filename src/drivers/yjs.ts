import { defineDriver } from "./utils";
import * as Y from "yjs";
import { Doc, Map } from "yjs";
import { WebsocketProvider } from "y-websocket";
import { WebrtcProvider } from "y-webrtc";
import { Driver, StorageValue } from "../types";

export interface YjsStorageOptions {
  headers?: Record<string, string>;
  storeName?: string;
  mapName?: string;
  webRtc?: boolean;
  webSocket?: boolean;
  webSocketUrl?: string;
  doc?: Doc;
}

const DRIVER_NAME = "yjs";
let yDoc: Doc | null = null;

function getDriver(opts: YjsStorageOptions, yMap: Map<unknown>): Driver {
  return {
    name: DRIVER_NAME,
    options: opts,
    hasItem(key: string): boolean {
      return yMap.has(key);
    },
    getItem(key: string): StorageValue {
      return (yMap.get(key) as string) || null;
    },
    setItem(key: string, value: string) {
      yMap.set(key, value);
    },
    removeItem(key: string) {
      yMap.delete(key);
    },
    getKeys(): string[] {
      return Array.from(yMap.keys());
    },
    clear() {
      yMap.clear();
    },
  };
}

export default defineDriver<YjsStorageOptions>(
  (
    opts = {
      webRtc: false,
      webSocket: false,
      storeName: "default-store",
    } as YjsStorageOptions
  ) => {
    if (opts.doc) {
      yDoc = opts.doc;
    }
    if (!opts.mapName) {
      opts.mapName = opts.storeName;
    }
    if (!yDoc) {
      yDoc = new Y.Doc();
      if (opts.webSocket && opts.webSocketUrl) {
        new WebsocketProvider(opts.webSocketUrl, opts.storeName!, yDoc);
      } else if (opts.webRtc) {
        new WebrtcProvider(opts.storeName!, yDoc);
      }

      const yMap = yDoc.getMap(opts.mapName);

      return getDriver(opts, yMap);
    }
    const yMap = yDoc.getMap(opts.mapName);
    return getDriver(opts, yMap);
  }
);
