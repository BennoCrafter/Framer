import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

import { ConfigValue } from "@/lib/types";
import {
  albumConfigSchema,
  AlbumConfig,
  albumConfigScheme,
} from "@/lib/schema";
import { hexToRgb } from "@/lib/utils";
import artistsToString from "@/music_api/types";
import { fetchAccessToken } from "@/music_api/fetchAccessToken";
import fetchAlbumInfo from "@/music_api/fetchAlbumInfo";
import BaseEditor from "./base_editor";

// Define PDF templates
type PdfTemplate = "classic" | "minimal" | "modern";

export default function AlbumEditor({ albumId }: { albumId: string }) {
  const [config, setConfig] = useState<AlbumConfig>(albumConfigScheme.default);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<PdfTemplate>("classic");

  const pdfDocRef = useRef<jsPDF | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const accessToken = await fetchAccessToken();
      if (!accessToken) return;

      const data = await fetchAlbumInfo(accessToken, albumId, setLoading);
      if (!data) return;

      setConfig((prevConfig) => ({
        ...prevConfig,
        albumName: data.name as string,
        artistName: artistsToString(data.artists) as string,
        albumCover: data.images[0].url as string,
      }));

      setLoading(false);
    };

    fetchData();
  }, [albumId]);

  useEffect(() => {
    if (!loading) {
      generatePdf(template);
    }
  }, [config, template, loading]);

  const updateConfig = (key: keyof AlbumConfig, value: ConfigValue) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [key]: value,
    }));
  };

  const generatePdf = (tpl: PdfTemplate) => {
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

    switch (tpl) {
      case "classic":
        generateClassic(doc, pageWidth, pageHeight);
        break;
      case "minimal":
        generateMinimal(doc, pageWidth, pageHeight);
        break;
      case "modern":
        generateModern(doc, pageWidth, pageHeight);
        break;
      default:
        generateClassic(doc, pageWidth, pageHeight);
    }

    setImageUrl(doc.output("datauristring"));
    pdfDocRef.current = doc;
  };

  // ===== PDF Templates =====
  const generateClassic = (
    doc: jsPDF,
    pageWidth: number,
    pageHeight: number,
  ) => {
    doc.setDrawColor(0, 0, 0);
    doc.rect(
      config.outerMargin as number,
      config.outerMargin as number,
      pageWidth - 2 * (config.outerMargin as number),
      pageHeight - 2 * (config.outerMargin as number),
    );

    doc.addImage(
      config.albumCover as string,
      config.outerMargin as number,
      (config.outerMargin as number) + 40,
      (pageWidth - 2 * (config.outerMargin as number)) as number,
      (pageWidth - 2 * (config.outerMargin as number)) as number,
    );

    doc.setFontSize(config.fontSize as number);
    doc.text(
      config.artistName as string,
      pageWidth / 2,
      (config.outerMargin as number) + 40,
      {
        align: "center",
      },
    );

    doc.setFontSize((config.fontSize as number) * 0.6);
    doc.text(config.albumName as string, pageWidth / 2, pageHeight / 2, {
      align: "center",
    });
  };

  const generateMinimal = (
    doc: jsPDF,
    pageWidth: number,
    pageHeight: number,
  ) => {
    doc.setFontSize(config.fontSize as number);
    doc.text(config.artistName as string, pageWidth / 2, pageHeight / 2 - 20, {
      align: "center",
    });
    doc.text(config.albumName as string, pageWidth / 2, pageHeight / 2 + 20, {
      align: "center",
    });
  };

  const generateModern = (
    doc: jsPDF,
    pageWidth: number,
    pageHeight: number,
  ) => {
    doc.addImage(
      config.albumCover as string,
      pageWidth / 4,
      pageHeight / 4,
      pageWidth / 2,
      pageWidth / 2,
    );
    doc.setFontSize(config.fontSize as number);
    doc.text(config.artistName as string, pageWidth / 2, pageHeight - 80, {
      align: "center",
    });
    doc.setFontSize((config.fontSize as number) * 0.8);
    doc.text(config.albumName as string, pageWidth / 2, pageHeight - 50, {
      align: "center",
    });
  };

  const handleExportPdf = () => pdfDocRef.current?.save("album-cover.pdf");

  return (
    <>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setTemplate("classic")}
          className={template === "classic" ? "font-bold" : ""}
        >
          Classic
        </button>
        <button
          onClick={() => setTemplate("minimal")}
          className={template === "minimal" ? "font-bold" : ""}
        >
          Minimal
        </button>
        <button
          onClick={() => setTemplate("modern")}
          className={template === "modern" ? "font-bold" : ""}
        >
          Modern
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <BaseEditor
          configSchema={albumConfigSchema}
          config={config}
          updateConfig={updateConfig}
          previewImageURL={imageUrl || ""}
          handleExportPdf={handleExportPdf}
        />
      )}
    </>
  );
}
