'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  doc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useVaultSession } from '@/lib/vaultSession';

export type VaultMode = 'build' | 'research' | 'report';

export interface VaultDrop {
  id: string;
  content: string;
  category: VaultMode | 'unclassified';
  createdAt: number;
}

export interface VaultState {
  activeMode: VaultMode;
  projectCodename: string;
  selectedAssets: string[];
  chaosBuffer: string;
  vaultDrops: VaultDrop[];
}

const DEFAULT_STATE: VaultState = {
  activeMode: 'build',
  projectCodename: '',
  selectedAssets: [],
  chaosBuffer: '',
  vaultDrops: [],
};

interface UseVaultStorageReturn extends VaultState {
  setActiveMode: (mode: VaultMode) => void;
  setProjectCodename: (name: string) => void;
  toggleAsset: (assetId: string) => void;
  setChaosBuffer: (text: string) => void;
  addVaultDrop: (drop: Omit<VaultDrop, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
}

export function useVaultStorage(): UseVaultStorageReturn {
  const { user, isReady } = useVaultSession();
  const [state, setState] = useState<VaultState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true); // true by default until first snapshot

  // Debounce timer ref — avoids hammering Firestore on every keystroke
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether we've received the first Firestore snapshot
  const initialised = useRef(false);

  // Helper: write the full vault state document to Firestore (debounced)
  const persistState = useCallback(
    (nextState: VaultState) => {
      if (!user) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const docRef = doc(db, 'users', user.uid, 'vault', 'state');
        setDoc(docRef, nextState, { merge: true }).catch((err) => {
          console.error('[VAULT] Firestore write failed:', err);
        });
      }, 500);
    },
    [user]
  );

  // Subscribe to Firestore in real time
  useEffect(() => {
    if (!isReady || !user) return;

    // Subscribe. isLoading starts as true (initial state) and is set false
    // once the first snapshot arrives. Do not call setIsLoading synchronously
    // here to avoid triggering cascading re-renders in the effect body.
    initialised.current = false;

    const docRef = doc(db, 'users', user.uid, 'vault', 'state');

    const unsubscribe: Unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<VaultState>;
          setState({
            activeMode: data.activeMode ?? DEFAULT_STATE.activeMode,
            projectCodename:
              data.projectCodename ?? DEFAULT_STATE.projectCodename,
            selectedAssets:
              data.selectedAssets ?? DEFAULT_STATE.selectedAssets,
            chaosBuffer: data.chaosBuffer ?? DEFAULT_STATE.chaosBuffer,
            vaultDrops: data.vaultDrops ?? DEFAULT_STATE.vaultDrops,
          });
        }
        initialised.current = true;
        setIsLoading(false);
      },
      (err) => {
        console.error('[VAULT] Firestore snapshot error:', err);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [isReady, user]);

  // Generic state updater — updates local state immediately, persists async
  const update = useCallback(
    (partial: Partial<VaultState>) => {
      setState((prev) => {
        const next = { ...prev, ...partial };
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  const setActiveMode = useCallback(
    (mode: VaultMode) => update({ activeMode: mode }),
    [update]
  );

  const setProjectCodename = useCallback(
    (name: string) => update({ projectCodename: name }),
    [update]
  );

  const toggleAsset = useCallback(
    (assetId: string) => {
      setState((prev) => {
        const next = prev.selectedAssets.includes(assetId)
          ? prev.selectedAssets.filter((id) => id !== assetId)
          : [...prev.selectedAssets, assetId];
        const nextState = { ...prev, selectedAssets: next };
        persistState(nextState);
        return nextState;
      });
    },
    [persistState]
  );

  const setChaosBuffer = useCallback(
    (text: string) => update({ chaosBuffer: text }),
    [update]
  );

  const addVaultDrop = useCallback(
    (drop: Omit<VaultDrop, 'id' | 'createdAt'>) => {
      setState((prev) => {
        const newDrop: VaultDrop = {
          ...drop,
          id: `drop_${Date.now()}`,
          createdAt: Date.now(),
        };
        const nextState = {
          ...prev,
          vaultDrops: [newDrop, ...prev.vaultDrops].slice(0, 100),
        };
        persistState(nextState);
        return nextState;
      });
    },
    [persistState]
  );

  return {
    ...state,
    setActiveMode,
    setProjectCodename,
    toggleAsset,
    setChaosBuffer,
    addVaultDrop,
    isLoading,
  };
}
