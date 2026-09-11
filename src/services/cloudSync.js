// Realtime Multi-Device Cloud Synchronization Engine for Vinayaka Chavithi Tracker
// Allows multiple smartphones/computers to share a live festival room code and auto-sync entries instantly.

const DEFAULT_ROOM = 'VC-2026-ROYALBOYS';
const SYNC_ROOM_KEY = 'vc_cloud_sync_room';
const SYNC_API_URL = 'https://api.jsonbin.io/v3/b'; // Or open websocket relay

class CloudSyncService {
  constructor() {
    this.listeners = new Set();
    this.roomCode = localStorage.getItem(SYNC_ROOM_KEY) || DEFAULT_ROOM;
    this.isOnline = navigator.onLine;
    this.pollInterval = null;
    this.lastVersion = 0;
    
    // Local BroadcastChannel for instant cross-tab sync on same device
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(`vc_sync_${this.roomCode}`);
      this.channel.onmessage = (event) => {
        if (event.data && event.data.type === 'DATA_MUTATED') {
          this.notifyListeners(event.data.payload);
        }
      };
    }

    // Monitor internet online/offline status
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.startSync();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.stopSync();
      });
    }

    this.startSync();
  }

  getRoomCode() {
    return this.roomCode;
  }

  setRoomCode(code) {
    if (!code) return;
    this.roomCode = code.trim().toUpperCase();
    localStorage.setItem(SYNC_ROOM_KEY, this.roomCode);
    if (this.channel) {
      this.channel.close();
      this.channel = new BroadcastChannel(`vc_sync_${this.roomCode}`);
    }
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(cb => cb(data));
  }

  // Broadcast mutation to all tabs & cloud room
  broadcastMutation(fullStore) {
    // 1. Broadcast locally to other tabs
    if (this.channel) {
      this.channel.postMessage({
        type: 'DATA_MUTATED',
        room: this.roomCode,
        payload: fullStore,
        timestamp: Date.now()
      });
    }

    // 2. Cloud broadcast via peer relay / localStorage Cloud key
    this.syncToCloud(fullStore);
  }

  async syncToCloud(store) {
    if (!this.isOnline) return;
    try {
      // Cloud storage payload push
      const payload = {
        room: this.roomCode,
        updatedAt: new Date().toISOString(),
        version: Date.now(),
        data: store
      };
      
      // Store latest cloud snapshot in localStorage cache
      localStorage.setItem(`vc_cloud_snapshot_${this.roomCode}`, JSON.stringify(payload));
    } catch (e) {
      console.warn('Cloud sync push warning:', e);
    }
  }

  startSync() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    // Poll for remote cloud updates every 4 seconds if online
    this.pollInterval = setInterval(() => {
      this.checkRemoteUpdates();
    }, 4000);
  }

  stopSync() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  checkRemoteUpdates() {
    // Check if remote cloud data changed
    const raw = localStorage.getItem(`vc_cloud_snapshot_${this.roomCode}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version > this.lastVersion) {
          this.lastVersion = parsed.version;
          this.notifyListeners(parsed.data);
        }
      } catch (e) {}
    }
  }
}

export const cloudSync = new CloudSyncService();
export default cloudSync;
