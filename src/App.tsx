import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";

const border = 10;

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const pdfDocRef = useRef<jsPDF | null>(null);

  useEffect(() => {
    const generatePdf = () => {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      doc.rect(
        border,
        border,
        doc.internal.pageSize.getWidth() - 2 * border,
        doc.internal.pageSize.getHeight() - 2 * border,
      );

      doc.setFontSize(40);
      doc.text(
        "Artist name",
        doc.internal.pageSize.getWidth() / 2,
        border + 20,
        {
          align: "center",
        },
      );

      doc.rect(
        border,
        border + 40,
        doc.internal.pageSize.getWidth() - 2 * border,
        doc.internal.pageSize.getWidth() - 2 * border,
      );

      doc.setFontSize(25);
      doc.text(
        "ALBUM TITLE",
        doc.internal.pageSize.getWidth() / 2,
        border + 250,
        {
          align: "center",
        },
      );
      // Convert PDF to data URI string
      const pdfDataUri = doc.output("datauristring");

      pdfDocRef.current = doc;
      setImageUrl(pdfDataUri);
    };

    generatePdf();
  }, []);

  const handleExportPdf = () => {
    if (pdfDocRef.current) {
      pdfDocRef.current.save("album-cover.pdf");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {imageUrl ? (
        <div className="flex flex-col items-center gap-4 p-8">
          <img
            src={imageUrl}
            alt="PDF Preview"
            className="w-full h-auto border-4 border-black"
          />
          <button
            onClick={handleExportPdf}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Export PDF
          </button>
        </div>
      ) : (
        <p className="text-white text-center p-8">Generating PDF...</p>
      )}
    </div>
  );
};

export default App;
