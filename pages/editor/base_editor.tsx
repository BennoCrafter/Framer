import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import EditorLayout from "@/layouts/editor";
import { ConfigValue, ConfigSchema } from "@/pages/editor/types";

export function BaseEditor({
  configSchema,
  config,
  updateConfig,
  previewImageURL,
  handleExportPdf,
}: {
  configSchema: ConfigSchema[];
  config: Record<string, ConfigValue>;
  updateConfig: (key: string, value: ConfigValue) => void;
  previewImageURL: string;
  handleExportPdf: () => void;
}) {
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
                      value={config[c.key] as string}
                      placeholder={c.label}
                      onChange={(e) => updateConfig(c.key, e.target.value)}
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
                      value={[config[c.key] as number]}
                      onValueChange={(val) => updateConfig(c.key, val[0])}
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
                      value={config[c.key] as string}
                      className="h-10 w-20 cursor-pointer p-1"
                      onChange={(e) => updateConfig(c.key, e.target.value)}
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
