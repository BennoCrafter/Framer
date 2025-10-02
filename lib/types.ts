// ---------- Schema definitions ----------
export type ConfigValue = string | number | null;

interface BaseField<T extends ConfigValue> {
  key: string;
  label: string;
  default: T;
}

export interface TextField extends BaseField<string> {
  type: "text";
}

export interface ColorField extends BaseField<string> {
  type: "color";
}

export interface SliderField extends BaseField<number> {
  type: "slider";
  min: number;
  max: number;
}

export interface SelectField extends BaseField<string> {
  type: "select";
  options: SelectItem[];
  inline?: boolean;
}

export interface FileField extends BaseField<string | null> {
  type: "file";
  accept?: string; // Optional: specify accepted file types (e.g., "image/*", ".pdf")
}

interface SelectItem {
  id: string;
  label: string;
  value: string;
}

export type ConfigField =
  | TextField
  | ColorField
  | SliderField
  | SelectField
  | FileField;
export type ConfigSchema = ConfigField[];

// ---------- Values derived from schema ----------
export type ConfigValues<T extends ConfigSchema> = {
  [K in T[number]["key"]]: Extract<
    T[number],
    { key: K }
  >["default"] extends string
    ? string
    : Extract<T[number], { key: K }>["default"] extends number
      ? number
      : Extract<T[number], { key: K }>["default"] extends null
        ? string | null // File fields can be null initially
        : never;
};

// ---------- Helper ----------
export function buildDefaults<T extends ConfigSchema>(
  schema: T,
): ConfigValues<T> {
  return Object.fromEntries(
    schema.map((f) => [f.key, f.default]),
  ) as ConfigValues<T>;
}

export type ExportOptions = {
  size: "a0" | "a1" | "a2" | "a3" | "a4";
  orientation: "portrait" | "landscape";
  format: "pdf" | "png";
};
