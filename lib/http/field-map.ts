import { FieldMapDoc } from "../db/models/field-map";


export const fetchFieldMaps = async (): Promise<FieldMapDoc[]> => {
  const res = await fetch("/api/field-map");
  if (!res.ok) throw new Error("Error fetching field maps");
  const json = await res.json();

  return json.data || json;
};