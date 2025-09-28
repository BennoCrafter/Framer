export type ConfigValue = string | number;
export type ConfigSchema = {
  key: string;
  label: string;
  type: "text" | "slider" | "color";
  min?: number;
  max?: number;
  default: ConfigValue;
};
