/**
 * Global declarations.
 *
 * React Native 0.88 no longer ships a `global` type, so declare it here and
 * attach the image objects that the screens share with each other.
 */
import type {ImageData, Quadrilateral} from 'dynamsoft-capture-vision-react-native';

declare global {
  var global: typeof globalThis;

  var originalImage: ImageData; //Used in Scanner.tsx and Editor.tsx
  var deskewedImage: ImageData; //Used in Editor.tsx and NormalizedImage.tsx
  var showingImage: ImageData; //Used in Editor.tsx and NormalizedImage.tsx
  var sourceDeskewQuad: Quadrilateral; //Used in Editor.tsx
}

export {};
