import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import EditorLayout from "@/layouts/editor";
import { ConfigSchema, ConfigValues } from "@/lib/types";
import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemContent,
  ChoiceboxItemDescription,
  ChoiceboxItemHeader,
  ChoiceboxItemIndicator,
  ChoiceboxItemSubtitle,
  ChoiceboxItemTitle,
} from "@/components/ui/choicebox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileIcon } from "lucide-react";
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

export default function BaseEditor<T extends ConfigSchema>({
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
            {configSchema?.map((c) => {
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

              if (c.type === "choice") {
                return (
                  <div key={c.key} className="flex flex-col gap-2">
                    <label className="text-sm font-medium">{c.label}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="w-full text-left">
                          {(config as any)[c.key]
                            ? c.options.find(
                                (o) => o.id === (config as any)[c.key],
                              )?.label
                            : "Select..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-2">
                        <Choicebox
                          value={(config as any)[c.key]}
                          style={
                            c.inline
                              ? {
                                  gridTemplateColumns: `repeat(${c.options.length}, 1fr)`,
                                }
                              : undefined
                          }
                          onValueChange={(val) =>
                            updateConfig(
                              c.key,
                              val as ConfigValues<T>[keyof ConfigValues<T>],
                            )
                          }
                        >
                          {c.options?.map((option) => (
                            <ChoiceboxItem key={option.id} value={option.id}>
                              <ChoiceboxItemHeader>
                                <ChoiceboxItemTitle>
                                  {option.label}
                                </ChoiceboxItemTitle>
                                <ChoiceboxItemDescription>
                                  {option.description}
                                </ChoiceboxItemDescription>
                              </ChoiceboxItemHeader>
                              <ChoiceboxItemContent>
                                <ChoiceboxItemIndicator />
                              </ChoiceboxItemContent>
                            </ChoiceboxItem>
                          ))}
                        </Choicebox>
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              }

              if (c.type === "file") {
                return (
                  <div key={c.key} className="flex flex-col gap-2">
                    <label className="text-sm font-medium">{c.label}</label>

                    <label className="flex items-center gap-2 p-1 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200 transition">
                      <FileIcon className="w-5 h-5 text-gray-700" />
                      <span className="font-medium text-gray-800">
                        {typeof config[c.key] === "string" &&
                        config[c.key].startsWith("data:")
                          ? "Uploaded"
                          : "Original"}
                      </span>

                      <input
                        type="file"
                        accept={c.accept}
                        className="hidden"
                        onChange={(e) => {
                          console.log(config[c.key]);
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64String = reader.result as string;
                              updateConfig(
                                c.key,
                                base64String as ConfigValues<T>[keyof ConfigValues<T>],
                              );
                            };
                            reader.readAsDataURL(file);
                          }
                          console.log(config[c.key]);
                        }}
                      />
                    </label>
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
