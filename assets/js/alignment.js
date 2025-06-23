export default class DimeAlignment {
  position(layer, layerData) {
    layer.style.position = 'absolute';
    layer.style.bottom = '0';
    layer.style.left = '50%';
    layer.style.transform = `translateX(-50%) translateY(${layerData.yOffset || 0}px)`;
    layer.style.width = `${layerData.width}px`;
    layer.style.minHeight = `${layerData.minHeight}px`;
    layer.style.clipPath = 'none'; // Prevents unwanted clipping
    layer.style.overflow = 'visible';
  }
}