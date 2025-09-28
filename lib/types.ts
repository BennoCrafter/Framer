// ---------- Schema definitions ----------
export type ConfigValue = string | number;

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

export interface ChoiceField extends BaseField<string> {
  type: "choice";
  options: ChoiceOption[];
  inline?: boolean;
}

interface ChoiceOption {
  id: string;
  label: string;
  description?: string;
}

export type ConfigField = TextField | ColorField | SliderField | ChoiceField;
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
