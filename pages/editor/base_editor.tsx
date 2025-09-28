import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import EditorLayout from "@/layouts/editor";
import { ConfigSchema, ConfigValues } from "@/pages/editor/types";

type BaseEditorProps<T extends ConfigSchema> = {
  configSchema: T;
  config: ConfigValues<T>;
  updateConfig: <K extends keyof ConfigValues<T>>(
    key: K,
    value: ConfigValues<T>[K],
  ) => void;
  previewImageURL: string;
  handleExportPdf: () => void;
};

export function BaseEditor<T extends ConfigSchema>({
  configSchema,
  config,
  updateConfig,
  previewImageURL,
  handleExportPdf,
}: BaseEditorProps<T>) {
  return (
    <EditorLayout>
      <div className="grid grid-cols-3 gap-6 p-6">
        <Card className="col-span-1">
          <CardContent className="flex flex-col gap-6 p-6">
            {configSchema.map((c) => {
              if (c.type === "text") {
                return (
                  <div key={c.key} className="flex flex-col gap-2">
                    <label className="text-sm font-medium">{c.label}</label>
                    <Input
                      value={(config as any)[c.key]}
                      placeholder={c.label}
                      onChange={(e) =>
                        updateConfig(
                          c.key,
                          e.target
                            .value as ConfigValues<T>[keyof ConfigValues<T>],
                        )
                      }
                    />
                  </div>
                );
              }
              if (c.type === "slider") {
                return (
                  <div key={c.key} className="flex flex-col gap-2">
                    <label className="text-sm font-medium">{c.label}</label>
                    <Slider
                      min={c.min}
                      max={c.max}
                      value={[(config as any)[c.key] as number]}
                      onValueChange={(val) =>
                        updateConfig(
                          c.key,
                          val[0] as ConfigValues<T>[keyof ConfigValues<T>],
                        )
                      }
                    />
                  </div>
                );
              }
              if (c.type === "color") {
                return (
                  <div key={c.key} className="flex flex-col gap-2">
                    <label className="text-sm font-medium">{c.label}</label>
                    <Input
                      type="color"
                      value={(config as any)[c.key]}
                      className="h-10 w-20 cursor-pointer p-1"
                      onChange={(e) =>
                        updateConfig(
                          c.key,
                          e.target
                            .value as ConfigValues<T>[keyof ConfigValues<T>],
                        )
                      }
                    />
                  </div>
                );
              }

              return null;
            })}
            <div className="pt-4">
              <Button className="w-full" onClick={handleExportPdf}>
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-2 flex items-center justify-center rounded-xs">
          {previewImageURL && (
            <img
              alt="PDF Preview"
              src={previewImageURL}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                borderRadius: "12px",
                boxShadow: "0 0 10px rgba(0,0,0,0.15)",
              }}
            />
          )}
        </div>
      </div>
    </EditorLayout>
  );
}
