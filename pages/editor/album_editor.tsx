import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

import { ConfigValue, ExportOptions } from "@/lib/types";
import {
  albumConfigSchema,
  AlbumConfig,
  albumConfigScheme,
} from "@/lib/schema";
import { hexToRgb, getPaletteFromImage } from "@/lib/utils";
import artistsToString from "@/music_api/types";
import { fetchAccessToken } from "@/music_api/fetchAccessToken";
import fetchAlbumInfo from "@/music_api/fetchAlbumInfo";
import BaseEditor from "./base_editor";
import { Album } from "@/music_api/types";
import { getItunesUncompressedAlbumCover } from "@/music_api/getUncompressedAlbumCover";
import { robotoBoldBold } from "@/fonts/Roboto-Bold-bold";
import { robotoMediumNormalfont } from "@/fonts/Roboto-Medium-normal";

const formats = ["a0", "a1", "a2", "a3", "a4"] as const;

type Format = (typeof formats)[number];
type Orientation = "portrait" | "landscape";

// Base A0 size in mm (portrait orientation: width < height)
const A0_WIDTH = 841;
const A0_HEIGHT = 1189;

type PosterTemplateName = "classic" | "minimal" | "modern";
type PosterTemplateFn = (
  doc: jsPDF,
  config: AlbumConfig,
  album: Album,
  pageWidth: number,
  pageHeight: number,
  scale: number,
  isPreview: boolean,
) => void;

function calculateScaleFactor(fmt: Format): number {
  return 1 / Math.pow(2, formats.indexOf(fmt) / 2);
}

function getDimensions(
  fmt: Format,
  orientation: Orientation = "portrait",
): [number, number] {
  const scale = calculateScaleFactor(fmt);
  let width = A0_WIDTH * scale;
  let height = A0_HEIGHT * scale;

  if (orientation === "landscape") {
    [width, height] = [height, width];
  }

  return [width, height];
}

// ===== Poster Templates =====
const posterTemplates: Record<PosterTemplateName, PosterTemplateFn> = {
  classic: async (
    doc,
    config,
    album,
    pageWidth,
    pageHeight,
    scale,
    isPreview,
  ) => {
    const outerMargin = (config.outerMargin as number) * scale;
    const fontSize = (config.fontSize as number) * scale;

    const scaled = (value: number) => value * scale;

    doc.setFont("Roboto-Bold", "bold");

    // Draw outer border (preview mode)
    // if (isPreview) {
    //   doc.setDrawColor(0, 0, 0);
    //   doc.rect(
    //     outerMargin,
    //     outerMargin,
    //     pageWidth - 2 * outerMargin,
    //     pageHeight - 2 * outerMargin,
    //   );
    // }

    // Draw album cover
    doc.addImage(
      config.albumCover as string,
      outerMargin,
      outerMargin,
      pageWidth - 2 * outerMargin,
      pageWidth - 2 * outerMargin,
    );

    // Divider line
    doc.setDrawColor(0, 0, 0);
    doc.line(
      outerMargin,
      pageWidth - outerMargin + scaled(70),
      pageWidth - outerMargin,
      pageWidth - outerMargin + scaled(70),
    );

    // Album name
    doc.setFont("Roboto-Bold", "bold");
    doc.setFontSize(fontSize);
    doc.text(
      config.albumName as string,
      pageWidth - outerMargin - scaled(5),
      pageHeight - 2 * outerMargin - scaled(160),
      { align: "right" },
    );

    // Artist name (bottom)
    doc.setFont("Roboto-Medium", "normal");
    doc.setFontSize(fontSize - scaled(2));
    doc.text(
      config.artistName as string,
      pageWidth - outerMargin - scaled(5),
      pageHeight - 2 * outerMargin - scaled(135),
      { align: "right" },
    );

    let colorPalette: string[] =
      (await getPaletteFromImage(config.albumCover as string)) || [];

    // Color swatches
    const swatchHeight = scaled(20);
    const swatchWidth = scaled(40);
    const swatchSpacing = scaled(0);
    const swatchYPosition =
      pageHeight - 2 * outerMargin - swatchHeight - scaled(90);

    colorPalette.forEach((color, i) => {
      const [r, g, b] = hexToRgb(color);
      doc.setFillColor(r, g, b);
      doc.rect(
        pageWidth - 2 * outerMargin - i * swatchWidth - i * swatchSpacing,
        swatchYPosition,
        swatchWidth,
        swatchHeight,
        "F",
      );
    });

    // Release date
    doc.setFont("Roboto-Bold", "bold");
    doc.setFontSize(fontSize - scaled(10));
    doc.text(
      "Release Date",
      pageWidth - outerMargin - scaled(5),
      pageHeight - outerMargin - scaled(110),
      { align: "right" },
    );

    doc.setFont("Roboto-Medium", "normal");
    doc.setFontSize(fontSize - scaled(10));
    doc.text(
      album.release_date as string,
      pageWidth - outerMargin - scaled(5),
      pageHeight - outerMargin - scaled(90),
      { align: "right" },
    );

    // Release label
    doc.setFont("Roboto-Bold", "bold");
    doc.setFontSize(fontSize - scaled(10));
    doc.text(
      "Release By",
      pageWidth - outerMargin - scaled(5),
      pageHeight - outerMargin - scaled(65),
      { align: "right" },
    );

    doc.setFont("Roboto-Medium", "normal");
    doc.setFontSize(fontSize - scaled(10));
    doc.text(
      album.label as string,
      pageWidth - outerMargin - scaled(5),
      pageHeight - outerMargin - scaled(45),
      { align: "right" },
    );

    // --- Tracks section ---
    const maxTracksPerColumn = 11;
    const trackListY = pageHeight - 2 * outerMargin - scaled(160);
    const trackSpacing = scaled(20);
    const trackXStart = outerMargin;

    // Base font
    doc.setFont("Roboto-Medium", "normal");
    let trackFontSize = fontSize - scaled(10);

    doc.setFontSize(trackFontSize);

    if (album.total_tracks > maxTracksPerColumn) {
      trackFontSize = fontSize - scaled(20);
      doc.setFontSize(trackFontSize);
    }

    album.tracks.items.forEach((track, index) => {
      const columnIndex = Math.floor(index / maxTracksPerColumn);
      const rowIndex = index % maxTracksPerColumn;

      const x = trackXStart + columnIndex * scaled(320); // spacing between columns
      const y = trackListY + rowIndex * trackSpacing;

      doc.text(`${index + 1}. ${track.name}`, x, y, { align: "left" });
    });
  },

  minimal: (doc, config, album, pageWidth, pageHeight, scale, isPreview) => {
    doc.setFontSize((config.fontSize as number) * scale);
    doc.text(
      config.artistName as string,
      pageWidth / 2,
      pageHeight / 2 - 20 * scale,
      { align: "center" },
    );
    doc.text(
      config.albumName as string,
      (pageWidth / 2) * scale,
      pageHeight / 2 + 20 * scale,
      { align: "center" },
    );
  },

  modern: (doc, config, album, pageWidth, pageHeight, scale, isPreview) => {
    doc.addImage(
      config.albumCover as string,
      pageWidth / 4,
      pageHeight / 4,
      pageWidth / 2,
      pageWidth / 2,
    );
    doc.setFontSize((config.fontSize as number) * scale);
    doc.text(
      config.artistName as string,
      pageWidth / 2,
      pageHeight - 80 * scale,
      {
        align: "center",
      },
    );
    doc.setFontSize((config.fontSize as number) * 0.8 * scale);
    doc.text(
      config.albumName as string,
      pageWidth / 2,
      pageHeight - 50 * scale,
      {
        align: "center",
      },
    );
  },
};

export default function AlbumEditor({ albumId }: { albumId: string }) {
  const [config, setConfig] = useState<AlbumConfig>(albumConfigScheme.default);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<PosterTemplateName>("classic");
  const [album, setAlbum] = useState<Album | undefined>(undefined);

  const pdfDocRef = useRef<jsPDF | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const accessToken = await fetchAccessToken();

      if (!accessToken) return;

      const data = await fetchAlbumInfo(accessToken, albumId, setLoading);

      if (!data) return;

      setAlbum(data);

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
      (async () => {
        pdfDocRef.current = await generatePoster(template, {
          size: "a0",
          orientation: "portrait",
          format: "pdf",
        });
      })();
    }
  }, [config, template, loading]);

  const updateConfig = async (key: keyof AlbumConfig, value: ConfigValue) => {
    console.log("Updating config:", key, value);
    setConfig((prevConfig) => ({ ...prevConfig, [key]: value }));

    // special handling
    // change cover to high res
    if (key === "useHighResCover") {
      if (value === true) {
        setLoading(true);
        const highResCover = await getItunesUncompressedAlbumCover(
          `${config.albumName} ${config.artistName}`,
        );

        if (highResCover) {
          setConfig((prevConfig) => ({
            ...prevConfig,
            albumCover: highResCover.toString(),
          }));
          setLoading(false);
        } else {
          console.log("No high res cover found");
          setConfig((prevConfig) => ({
            ...prevConfig,
            useHighResCover: false,
          }));
        }
      } else {
        setConfig((prevConfig) => ({
          ...prevConfig,
          albumCover: album?.images?.[0]?.url || "",
        }));
      }
    }
  };

  async function generatePoster(
    tpl: PosterTemplateName,
    options: ExportOptions,
    isPreview: boolean = true,
  ) {
    const doc = new jsPDF({
      orientation: options.orientation,
      unit: "mm",
      format: options.size,
    });

    doc.addFileToVFS("Roboto-Bold-bold.ttf", robotoBoldBold);
    doc.addFont("Roboto-Bold-bold.ttf", "Roboto-Bold", "bold");

    doc.addFileToVFS("Roboto-Medium-normal.ttf", robotoMediumNormalfont);
    doc.addFont("Roboto-Medium-normal.ttf", "Roboto-Medium", "normal");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const [r, g, b] = hexToRgb(config.bgColor as string);

    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    const templateFn = posterTemplates[tpl] ?? posterTemplates.classic;

    if (!album) {
      throw new Error("Album is required");
    }

    await templateFn(
      doc,
      config,
      album,
      pageWidth,
      pageHeight,
      calculateScaleFactor(options.size),
      isPreview,
    );

    setImageUrl(doc.output("datauristring"));

    return doc;
  }

  const handleExportPoster = async (options: ExportOptions) => {
    console.log("Exporting poster in ", options);
    const pdfGeneratedPosterPdf = await generatePoster(
      template,
      options,
      false,
    );

    if (options.format === "pdf") {
      pdfGeneratedPosterPdf.save(`album-poster-${options.size}.pdf`);
    } else if (options.format === "png") {
      const pageWidth = pdfGeneratedPosterPdf.internal.pageSize.getWidth();
      const pageHeight = pdfGeneratedPosterPdf.internal.pageSize.getHeight();

      const dpiCalc = options.dpi || 300;
      const resolutionMultiplier = dpiCalc / 72;
      const canvasWidth = pageWidth * resolutionMultiplier;
      const canvasHeight = pageHeight * resolutionMultiplier;

      const canvas = document.createElement("canvas");

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d")!;

      const imgData = pdfGeneratedPosterPdf.output("datauristring");
      const image = new Image();

      image.src = imgData;

      image.onload = () => {
        ctx.scale(resolutionMultiplier, resolutionMultiplier);
        ctx.drawImage(image, 0, 0, pageWidth, pageHeight);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const link = document.createElement("a");

          link.href = URL.createObjectURL(blob);
          link.download = `album-poster-${options.size}-${dpiCalc}dpi.png`;
          link.click();
          URL.revokeObjectURL(link.href);
        }, "image/png");
      };
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        {Object.keys(posterTemplates).map((tpl) => (
          <button
            key={tpl}
            className={template === tpl ? "font-bold" : ""}
            onClick={() => setTemplate(tpl as PosterTemplateName)}
          >
            {tpl.charAt(0).toUpperCase() + tpl.slice(1)}
          </button>
        ))}
      </div>

      <BaseEditor
        configSchema={albumConfigSchema}
        config={config}
        updateConfig={updateConfig}
        previewImageURL={imageUrl || ""}
        handleExportPoster={handleExportPoster}
      />
    </>
  );
}
