import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import DefaultLayout from "@/layouts/default";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

export default function Editor() {
  const [artistName, setArtistName] = useState("Artist name");
  const [albumTitle, setAlbumTitle] = useState("ALBUM TITLE");
  const [border, setBorder] = useState(10);
  const [fontSize, setFontSize] = useState(40);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const pdfDocRef = useRef<jsPDF | null>(null);

  const generatePdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a0",
    });

    // Background
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const [r, g, b] = hexToRgb(bgColor);

    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Border box
    doc.setDrawColor(0, 0, 0);
    doc.rect(border, border, pageWidth - 2 * border, pageHeight - 2 * border);

    // Artist name
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);
    doc.text(artistName, pageWidth / 2, border + 40, { align: "center" });

    // Album title
    doc.setFontSize(fontSize * 0.6);
    doc.text(albumTitle, pageWidth / 2, pageHeight / 2, { align: "center" });

    // Update preview
    const pdfDataUri = doc.output("datauristring");
    pdfDocRef.current = doc;
    setImageUrl(pdfDataUri);
  };

  useEffect(() => {
    generatePdf();
  }, [artistName, albumTitle, border, fontSize, bgColor]);

  const handleExportPdf = () => {
    if (pdfDocRef.current) {
      pdfDocRef.current.save("album-cover.pdf");
    }
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  return (
    <DefaultLayout>
      <div className="grid grid-cols-3 gap-6 p-6">
        <Card className="col-span-1">
          <CardContent className="flex flex-col gap-4 p-4">
            <Input
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Artist Name"
            />
            <Input
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              placeholder="Album Title"
            />
            <label className="text-sm font-medium">Font Size</label>
            <Slider
              min={20}
              max={100}
              value={[fontSize]}
              onValueChange={(val) => setFontSize(val[0])}
            />
            <label className="text-sm font-medium">Border Size</label>
            <Slider
              min={0}
              max={100}
              value={[border]}
              onValueChange={(val) => setBorder(val[0])}
            />
            <label className="text-sm font-medium">Background Color</label>
            <Input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
            <Button onClick={handleExportPdf}>Export PDF</Button>
          </CardContent>
        </Card>

        <div className="col-span-2 flex items-center justify-center bg-gray-100 rounded-xl">
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
    </DefaultLayout>
  );
}
