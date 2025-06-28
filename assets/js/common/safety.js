export class AssetGuard {
  static validate(layer) {
    if (!layer.path) {
      console.error('Layer missing "path" property:', layer);
      return false;
    }
    if (typeof layer.width !== 'number' || layer.width <= 0) {
      console.error('Layer missing or invalid "width":', layer);
      return false;
    }
    if (typeof layer.minHeight !== 'number' || layer.minHeight <= 0) {
      console.error('Layer missing or invalid "minHeight":', layer);
      return false;
    }
    // Optionally check for zIndex or other required properties
    return true;
  }
}
