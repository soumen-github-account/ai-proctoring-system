import React, { useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const CandidateReport = ({ candidate, setSelectedCandidate }) => {

  const reportRef = useRef(null);

  const downloadPDF = async () => {

    const element = reportRef.current;
    if (!element) return;

    // Wait until all images load (Cloudinary screenshots)
    const images = element.querySelectorAll("img");

    await Promise.all(
      [...images].map(
        img =>
          new Promise(resolve => {
            if (img.complete) resolve();
            else img.onload = resolve;
          })
      )
    );

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 295;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 295;
    }

    pdf.save(`${candidate.student.name}_report.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        {/* Download Button */}
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
        >
          Download Report
        </button>
        <button onClick={()=>setSelectedCandidate(null)} className="bg-gray-100 text-neutral-900 hover:bg-gray-200 px-7 py-2 rounded mb-6">Cancle</button>
        </div>
      {/* REPORT UI */}
      <div
        ref={reportRef}
        className="p-8 w-[900px]"
        style={{ backgroundColor: "#ffffff", color: "#000000" }}
      >

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">
          Proctoring Summary
        </h1>

        <p className="mb-6">
          Here is the list of violations committed
        </p>

        {/* Candidate Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">
            {candidate.student.name}
          </h2>

          <p>Risk Level: {candidate.risk}</p>
          <p>Risk Score: {candidate.risk_score}</p>
          <p>Total Violations: {candidate.violations_count}</p>
        </div>

        {/* Violations */}
        {candidate.violations.map((v, index) => (

          <div key={index} className="mb-10">

            <div className="flex justify-between items-center mb-3">

              <h3 className="text-lg font-semibold">
                {v.type}
              </h3>

              <span style={{ color: "red", fontWeight: "bold" }}>
                Count: {v.count}
              </span>

            </div>

            <p className="text-sm mb-3">
              {new Date(v.timestamp).toLocaleString()}
            </p>

            {/* Screenshots */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px"
              }}
            >

              {v.screenShots.slice(0, 8).map((img, i) => (

                <img
                  key={i}
                  src={img}
                  crossOrigin="anonymous"
                  alt=""
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #ddd"
                  }}
                />

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default CandidateReport;