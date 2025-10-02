import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import EditorLayout from "@/layouts/editor";
import { ConfigSchema, ConfigValues } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileIcon, DownloadIcon, RefreshCw, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExportOptions } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
// --------------------------------------------
// Reusable ConfigField Component
// --------------------------------------------
function ConfigField<T extends ConfigSchema>({
  schema,
  value,
  defaultValue,
  onChange,
}: {
  schema: T[number];
  value: any;
  defaultValue: any;
  onChange: (val: any) => void;
}) {
  const isModified = value !== defaultValue;

  const resetButton = isModified && (
    <Button
      size="icon"
      variant="ghost"
      className="h-5 w-5 p-0 cursor-pointer"
      title="Reset to default"
      onClick={() => onChange(defaultValue)}
    >
      <RefreshCw className="w-4 h-4" />
    </Button>
  );

  return (
    <div key={schema.key} className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{schema.label}</label>
        {resetButton}
      </div>

      {/* Field Types */}
      {schema.type === "text" && (
        <Input
          value={value}
          placeholder={schema.label}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {schema.type === "slider" && (
        <Slider
          min={schema.min}
          max={schema.max}
          value={[value]}
          onValueChange={(val) => onChange(val[0])}
        />
      )}

      {schema.type === "color" && (
        <Input
          type="color"
          value={value}
          className="h-10 w-20 cursor-pointer p-1"
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {schema.type === "select" && (
        <Select defaultValue={value} onValueChange={(val) => onChange(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={schema.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{schema.label}</SelectLabel>
              {schema.options?.map((option: any) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {schema.type === "file" && (
        <label className="flex items-center gap-2 p-1 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200 transition">
          <FileIcon className="w-5 h-5 text-gray-700" />
          <span className="font-medium text-gray-800">
            {typeof value === "string" && value.startsWith("data:")
              ? "Uploaded"
              : "Original"}
          </span>
          <input
            type="file"
            accept={schema.accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                const reader = new FileReader();

                reader.onloadend = () => {
                  onChange(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>
      )}

      {schema.type === "toggle" && (
        <div className="flex items-center justify-between">
          <Checkbox
            id={schema.key}
            checked={value}
            onCheckedChange={(checked) => onChange(checked)}
          />
        </div>
      )}
    </div>
  );
}

// --------------------------------------------
// BaseEditor
// --------------------------------------------
type BaseEditorProps<T extends ConfigSchema> = {
  configSchema: T;
  config: ConfigValues<T>;
  updateConfig: <K extends keyof ConfigValues<T>>(
    key: K,
    value: ConfigValues<T>[K],
  ) => void;
  previewImageURL: string;
  handleExportPoster: (options: ExportOptions) => void;
};

export default function BaseEditor<T extends ConfigSchema>({
  configSchema,
  config,
  updateConfig,
  previewImageURL,
  handleExportPoster,
}: BaseEditorProps<T>) {
  return (
    <EditorLayout>
      <div className="grid grid-cols-3 gap-6 p-6">
        <Card className="col-span-1">
          <CardContent className="flex flex-col gap-6 p-6">
            {configSchema.map((schema: any) => (
              <ConfigField
                key={schema.key}
                schema={schema}
                value={(config as any)[schema.key]}
                defaultValue={schema.default}
                onChange={(val) =>
                  updateConfig(
                    schema.key,
                    val as ConfigValues<T>[keyof ConfigValues<T>],
                  )
                }
              />
            ))}

            <ExportDialog handleExportPoster={handleExportPoster} />
          </CardContent>
        </Card>

        {/* Poster Preview */}
        <div className="col-span-2 flex items-center justify-center rounded-xs">
          {previewImageURL && (
            <img
              alt="Poster Preview"
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

// --------------------------------------------
// Export Dialog
// --------------------------------------------
const ExportDialog = ({
  handleExportPoster,
}: {
  handleExportPoster: (options: ExportOptions) => void;
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    size: "a0",
    orientation: "portrait",
    format: "pdf",
    dpi: 300,
  });

  return (
    <div className="pt-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full flex items-center justify-center gap-2">
            <DownloadIcon className="w-4 h-4" />
            Export Poster
          </Button>
        </DialogTrigger>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Export Poster</DialogTitle>
          </DialogHeader>

          {(["size", "orientation", "format"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {field}
              </label>
              <Select
                defaultValue={exportOptions[field]}
                onValueChange={(value) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    [field]: value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${field}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="capitalize">{field}</SelectLabel>
                    {field === "size" &&
                      ["a0", "a1", "a2", "a3", "a4"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.toUpperCase()}
                        </SelectItem>
                      ))}
                    {field === "orientation" &&
                      ["portrait", "landscape"].map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    {field === "format" &&
                      ["pdf", "png"].map((f) => (
                        <SelectItem key={f} value={f}>
                          {f.toUpperCase()}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}

          {exportOptions.format === "png" && (
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="dpi">
                DPI
              </label>
              <Slider
                min={100}
                max={600}
                step={50}
                value={[exportOptions.dpi || 300]}
                onValueChange={(value) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    dpi: value[0],
                  }))
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                {exportOptions.dpi} DPI
              </p>
            </div>
          )}

          <Button
            className="w-full"
            onClick={() => handleExportPoster(exportOptions)}
          >
            Download
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
