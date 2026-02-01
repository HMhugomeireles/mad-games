import { DeviceDoc } from "../db/models/device";


export const fetchDevices = async (): Promise<DeviceDoc[]> => {
  const res = await fetch("/api/devices");
  if (!res.ok) throw new Error("Erro ao buscar dispositivos");
  const json = await res.json();

  return json.data || json;
};

export const fetchDevicesIndividualType = async (): Promise<DeviceDoc[]> => {
  const res = await fetch(`/api/devices?type=individual`);
  if (!res.ok) throw new Error("Erro ao buscar dispositivos");
  const json = await res.json();

  return json.data || json;
};

export const fetchDevicesSettingOptions = async (): Promise<DeviceDoc[]> => {
  const res = await fetch("/api/devices?type=settings");
  if (!res.ok) throw new Error("Erro ao buscar dispositivos");
  const json = await res.json();

  return json.data || json;
}