import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

import { BaseEditor } from "./base_editor";

import {
  MovieConfig,
  movieConfigSchema,
  movieConfigScheme,
} from "@/pages/editor/schema";
import { ConfigValue } from "@/pages/editor/types";

export function MovieEditor() {
  const [config, setConfig] = useState<MovieConfig>({
    ...movieConfigScheme.default,
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const pdfDocRef = useRef<jsPDF | null>(null);

  const updateConfig = (key: string, value: ConfigValue) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const generatePdf = () => {
    const doc = new jsPDF({
      orientation: config.posterOrientation as "portrait" | "landscape",
      unit: "mm",
      format: "a0",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const [r, g, b] = [255, 255, 255];

    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setDrawColor(0, 0, 0);
    doc.rect(
      config.outerMargin as number,
      config.outerMargin as number,
      pageWidth - 2 * (config.outerMargin as number),
      pageHeight - 2 * (config.outerMargin as number),
    );

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
