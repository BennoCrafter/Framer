import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

import { ConfigValue } from "@/pages/editor/types";
import { movieConfigSchema } from "@/pages/editor/schema";
import { BaseEditor } from "./base_editor";
import { hexToRgb } from "@/lib/utils";

export function MovieEditor() {
  const [config, setConfig] = useState<Record<string, ConfigValue>>(
    Object.fromEntries(movieConfigSchema.map((c) => [c.key, c.default])),
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

    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setDrawColor(0, 0, 0);
    doc.rect(
      config.outerMargin as number,
      config.outerMargin as number,
      pageWidth - 2 * (config.outerMargin as number),
      pageHeight - 2 * (config.outerMargin as number),
    );

    doc.setFontSize(config.fontSize as number);
    doc.text(
      config.artistName as string,
      pageWidth / 2,
      (config.outerMargin as number) + 40,
      { align: "center" },
    );

    doc.setFontSize((config.fontSize as number) * 0.6);
    doc.text(config.albumTitle as string, pageWidth / 2, pageHeight / 2, {
      align: "center",
    });

    setImageUrl(doc.output("datauristring"));
    pdfDocRef.current = doc;
  };

  useEffect(() => {
    generatePdf();
  }, [config]);

  const handleExportPdf = () => pdfDocRef.current?.save("movie-cover.pdf");

  return (
    <BaseEditor
      configSchema={movieConfigSchema}
      config={config}
      updateConfig={updateConfig}
      previewImageURL={imageUrl || ""}
      handleExportPdf={handleExportPdf}
    />
  );
}
