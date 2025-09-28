import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

import { ConfigValue } from "@/pages/editor/types";
import {
  albumConfigSchema,
  AlbumConfig,
  albumConfigScheme,
} from "@/pages/editor/schema";
import artistsToString, { Album, Track, Artist } from "@/music_api/types";
import { fetchAccessToken } from "@/music_api/fetchAccessToken";
import fetchAlbumInfo from "@/music_api/fetchAlbumInfo";
import { BaseEditor } from "./base_editor";
import { hexToRgb } from "@/lib/utils";

export function AlbumEditor({ albumId }: { albumId: string }) {
  const [config, setConfig] = useState<AlbumConfig>({
    ...albumConfigScheme.default,
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const pdfDocRef = useRef<jsPDF | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await fetchAccessToken();

      if (!accessToken) return;

      fetchAlbumInfo(accessToken, albumId, setLoading).then((data) => {
        if (!data) return;

        setConfig((prevConfig) => ({
          ...prevConfig,
          albumName: data.name as string,
          artistName: artistsToString(data.artists) as string,
        }));
      });
    };

    fetchData();
  }, [albumId]);

  const updateConfig = (key: keyof AlbumConfig, value: ConfigValue) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [key]: value,
    }));
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
    doc.text(config.albumName as string, pageWidth / 2, pageHeight / 2, {
      align: "center",
    });

    setImageUrl(doc.output("datauristring"));
    pdfDocRef.current = doc;
  };

  useEffect(() => {
    generatePdf();
  }, [config]);

  const handleExportPdf = () => pdfDocRef.current?.save("album-cover.pdf");

  return (
    <BaseEditor
      configSchema={albumConfigSchema}
      config={config}
      updateConfig={updateConfig}
      previewImageURL={imageUrl || ""}
      handleExportPdf={handleExportPdf}
    />
  );
}
