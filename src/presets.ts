const presets: { [key: string]: { numModels: number; distanceBetween: number; rotationSpeedOdd: number; rotationSpeedEven: number; } } = {
  preset1: {
    numModels: 3,
    distanceBetween: 20,
    rotationSpeedOdd: 1.5,
    rotationSpeedEven: 1.2
  },
  preset2: {
    numModels: 5,
    distanceBetween: 15,
    rotationSpeedOdd: 1.2,
    rotationSpeedEven: 1.0
  },
  preset3: {
    numModels: 7,
    distanceBetween: 10,
    rotationSpeedOdd: 1.8,
    rotationSpeedEven: 1.5
  }
};

export function applyPreset(preset: string) {
  if (preset !== "custom") {
    const { numModels, distanceBetween, rotationSpeedOdd, rotationSpeedEven } = presets[preset];
    (document.getElementById("numModels") as HTMLSelectElement).value = numModels.toString();
    (document.getElementById("distanceBetween") as HTMLInputElement).value = distanceBetween.toString();
    (document.getElementById("rotationSpeedOdd") as HTMLSelectElement).value = rotationSpeedOdd.toString();
    (document.getElementById("rotationSpeedEven") as HTMLSelectElement).value = rotationSpeedEven.toString();
  }
}

export function getPresetValues() {
  const numModels = parseInt((document.getElementById("numModels") as HTMLSelectElement).value, 10);
  const distanceBetween = parseFloat((document.getElementById("distanceBetween") as HTMLInputElement).value);
  const rotationSpeedOdd = parseFloat((document.getElementById("rotationSpeedOdd") as HTMLSelectElement).value);
  const rotationSpeedEven = parseFloat((document.getElementById("rotationSpeedEven") as HTMLSelectElement).value);

  return { numModels, distanceBetween, rotationSpeedOdd, rotationSpeedEven };
}