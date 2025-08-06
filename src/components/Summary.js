// src/components/Summary.js
import React from 'react';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import './Summary.css';

const Summary = ({ entries = [] }) => {
  const totalAmount = entries.reduce((sum, entry) => sum + Number(entry.amount), 0);
  const totalTickets = entries.reduce((sum, entry) => sum + Number(entry.ticketCount), 0);

  const exportToExcel = () => {
    const wsData = [
      ['번호', '이름', '금액', '식권'],
      ...entries.map(entry => [entry.number, entry.name, entry.amount, entry.ticketCount])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    XLSX.writeFile(wb, 'summary.xlsx');
  };

  const exportToPDF = () => {
    const element = document.getElementById('pdf-content');
    const opt = {
      margin: 0.5,
      filename: 'summary.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="summary-container">
      <h2>요약 정보</h2> 
      
      <div className="summary-buttons">
        <button onClick={exportToExcel}>엑셀 다운로드</button>
        <button onClick={exportToPDF}>PDF 다운로드</button>
      </div>

      <div className="summary-info">
        <p>총 금액: {totalAmount.toLocaleString()}원</p>
        <p>총 인원: {entries.length}명</p>
        <p>총 식권 수: {totalTickets}장</p>
      </div>

      <div id="pdf-content">
        <table className="summary-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>금액</th>
              <th>식권</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.number}</td>
                <td>{entry.name}</td>
                <td>{entry.amount}</td>
                <td>{entry.ticketCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
</div>
  );
};

export default Summary;