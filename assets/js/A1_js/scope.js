export class ScopeSystem {
  constructor(container, scopeConfig, deviceClass, cuc = 1.0) {
    // Sizing logic with CUC scaling
    let width = (scopeConfig.width || 320) * cuc + 'px';
    let height = (scopeConfig.width || 320) * (scopeConfig.widthRatio || 1.0) * cuc + 'px';
    container.style.width = width;
    container.style.height = height;
    this.yOffset = (scopeConfig.yOffset || 0) * cuc;
    this.safetyZone = (scopeConfig.safetyZone || 60) * cuc;
    // Remove legacy positioning fields
    this.width = width;
    this.height = height;
    // Remove diorama-hidden logic for debugging: always show dioramas
    container.classList.remove('diorama-hidden');
    // Optionally, disconnect observer if it exists
    if (this.observer) {
      this.observer.disconnect();
    }
    console.log(`Scope set to ${width} x ${height} with viewport toggle`);
  }
  update(layers) {
    if (layers && layers.length > 0) {
      const natscene = layers[0].closest('.natscene');
      if (natscene && natscene.dataset.scopeVerticalOffset) {
        const offset = natscene.dataset.scopeVerticalOffset;
        natscene.style.transform = `translateY(${offset}px)`;
      }
    }
  }
  static preloadImages(container) {
    const images = Array.from(container.querySelectorAll('img'));
    return Promise.all(
      images.map(
        img =>
          img.complete
            ? Promise.resolve()
            : new Promise(resolve => {
                img.onload = img.onerror = resolve;
              })
      )
    );
  }
  applyFrames(container, frames) {
    const framePositions = ['upper', 'lower', 'left', 'right'];
    const baseUrl = '../../assets/images/primaryArena/scope/frames/scope';
    framePositions.forEach(position => {
      if (frames[position]) {
        const frameEl = document.createElement('img');
        frameEl.className = `diorama-frame diorama-frame-${position}`;
        frameEl.src = `${baseUrl}${position.toUpperCase()}/${frames[position]}`;
        frameEl.alt = `Scope ${position} frame`;
        container.appendChild(frameEl);
        console.log(`[ScopeSystem] Applied ${position} frame: ${frames[position]}`);
      }
    });
  }
  applyFilter(container, filter) {
    const filterEl = document.createElement('img');
    filterEl.className = 'diorama-filter';
    if (typeof filter === 'string') {
      filterEl.src = `../../assets/images/primaryArena/scope/filters/${filter}`;
      filterEl.alt = 'Diorama filter';
    } else {
      filterEl.src = `../../assets/images/primaryArena/scope/filters/${filter.path}`;
      filterEl.alt = filter.alt || 'Diorama filter';
      if (filter.opacity !== undefined) {
        filterEl.style.opacity = filter.opacity;
      }
      if (filter.blendMode) {
        filterEl.style.mixBlendMode = filter.blendMode;
      }
    }
    container.appendChild(filterEl);
    console.log(`[ScopeSystem] Applied filter: ${typeof filter === 'string' ? filter : filter.path}`);
  }
}