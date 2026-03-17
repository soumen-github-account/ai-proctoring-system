import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateCandidateReport = (candidate) => {

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("AutoProctor - Candidate Report", 14, 20);

  // Candidate Info
  doc.setFontSize(12);
  doc.text(`Name: ${candidate.student.name}`, 14, 40);
  doc.text(`Risk Level: ${candidate.risk}`, 14, 48);
  doc.text(`Risk Score: ${candidate.risk_score}`, 14, 56);
  doc.text(`Total Violations: ${candidate.violations_count}`, 14, 64);

  // Violations Table
  const rows = candidate.violations.map(v => [
    v.type,
    v.count,
    new Date(v.timestamp).toLocaleString()
  ]);

  autoTable(doc, {
    startY: 80,
    head: [["Violation Type", "Count", "Timestamp"]],
    body: rows
  });

  doc.save(`${candidate.student.name}_report.pdf`);
};