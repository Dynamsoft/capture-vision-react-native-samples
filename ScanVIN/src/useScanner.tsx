import { useState, useRef, useCallback } from 'react';
import {VINScanResult} from './VINScanResult.tsx';

export function useScanner() {
  // Controls whether the scanner modal is visible
  const [visible, setVisible] = useState(false);

  // Holds the resolver function for the current scan promise
  const resolverRef = useRef<(r: VINScanResult) => void>();

  /**
   * Triggers the scanner overlay to appear and returns
   * a Promise that resolves when scanning completes.
   */
  const openScanner = useCallback((): Promise<VINScanResult> => {
    setVisible(true);
    // Return a new Promise and store its resolve function
    return new Promise<VINScanResult>(resolve => {
      resolverRef.current = resolve;
    });
  }, []);

  /**
   * Should be passed to the ScannerView component.
   * When the scanner finishes (success, error, or cancel),
   * this callback hides the overlay and resolves the Promise.
   */
  const onComplete = useCallback((res: VINScanResult) => {
    setVisible(false);
    // Resolve the Promise that was returned by scan()
    resolverRef.current?.(res);
  }, []);

  return { visible, openScanner, onComplete };
}
