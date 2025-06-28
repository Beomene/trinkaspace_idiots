export default class DimeAlignment {
  position(layer, layerData, cuc = 1.0) {
    layer.style.position = 'absolute';
    layer.style.bottom = '0';
    layer.style.left = '50%';
    layer.style.transform = `translateX(-50%) translateY(${(layerData.yOffset || 0) * cuc}px)`;
    layer.style.width = `${(layerData.width || 0) * cuc}px`;
    layer.style.minHeight = `${(layerData.minHeight || 0) * cuc}px`;
    layer.style.clipPath = 'none'; // Prevents unwanted clipping
    layer.style.overflow = 'visible';
  }
}