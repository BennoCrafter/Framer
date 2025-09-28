import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import EditorLayout from "@/layouts/editor";

type ConfigValue = string | number;
type ConfigSchema = {
  key: string;
  label: string;
  type: "text" | "slider" | "color";
  min?: number;
  max?: number;
  default: ConfigValue;
};

const configSchema: ConfigSchema[] = [
  {
    key: "artistName",
    label: "Artist Name",
    type: "text",
    default: "Artist name",
  },
  {
    key: "albumTitle",
    label: "Album Title",
    type: "text",
    default: "ALBUM TITLE",
  },
  {
    key: "fontSize",
    label: "Font Size",
    type: "slider",
    min: 20,
    max: 100,
    default: 40,
  },
  {
    key: "border",
    label: "Border Size",
    type: "slider",
    min: 0,
    max: 100,
    default: 10,
  },
  {
    key: "bgColor",
    label: "Background Color",
    type: "color",
    default: "#ffffff",
  },
];

export default function Editor() {
  const [config, setConfig] = useState<Record<string, ConfigValue>>(
    Object.fromEntries(configSchema.map((c) => [c.key, c.default])),
  );

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const pdfDocRef = useRef<jsPDF | null>(null);

  const updateConfig = (key: string, value: ConfigValue) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const generatePdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a0",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const [r, g, b] = hexToRgb(config.bgColor as string);

    // Background
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Border
    doc.setDrawColor(0, 0, 0);
    doc.rect(
      config.border as number,
      config.border as number,
      pageWidth - 2 * (config.border as number),
      pageHeight - 2 * (config.border as number),
    );

    // Artist Name
    doc.setFontSize(config.fontSize as number);
    doc.text(
      config.artistName as string,
      pageWidth / 2,
      (config.border as number) + 40,
      {
        align: "center",
      },
    );

    // Album Title
    doc.setFontSize((config.fontSize as number) * 0.6);
    doc.text(config.albumTitle as string, pageWidth / 2, pageHeight / 2, {
      align: "center",
    });

    const pdfDataUri = doc.output("datauristring");

    pdfDocRef.current = doc;
    setImageUrl(pdfDataUri);
  };

  useEffect(() => {
    generatePdf();
  }, [config]);

  const handleExportPdf = () => {
    pdfDocRef.current?.save("album-cover.pdf");
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.slice(1), 16);

    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

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
            })}
            <div className="pt-4">
              <Button className="w-full" onClick={handleExportPdf}>
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-2 flex items-center justify-center rounded-xs">
          {imageUrl && (
            <img
              alt="PDF Preview"
              src={imageUrl}
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
