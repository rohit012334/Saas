import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileText, FileSpreadsheet, File as FilePdf, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ExportButton = ({ data, filename = 'export', columns = [] }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    const headers = columns.map(col => col.header).join(',');
    const rows = data.map(item => 
      columns.map(col => {
        const value = typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor];
        return `"${value}"`;
      }).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const exportToExcel = () => {
    const worksheetData = data.map(item => {
      const row = {};
      columns.forEach(col => {
        row[col.header] = typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor];
      });
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    setIsOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableHeaders = columns.map(col => col.header);
    const tableBody = data.map(item => 
      columns.map(col => typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor])
    );

    doc.autoTable({
      head: [tableHeaders],
      body: tableBody,
    });
    doc.save(`${filename}.pdf`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold text-muted hover:text-white hover:bg-white/5 transition-smooth"
      >
        <Download size={18} />
        {t('common:export')}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <button 
              onClick={exportToPDF}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted hover:text-white hover:bg-white/5 transition-smooth"
            >
              <FilePdf size={16} className="text-danger" />
              {t('common:saveAsPdf')}
            </button>
            <button 
              onClick={exportToCSV}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted hover:text-white hover:bg-white/5 transition-smooth border-t border-border/50"
            >
              <FileText size={16} className="text-info" />
              {t('common:saveAsCsv')}
            </button>
            <button 
              onClick={exportToExcel}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted hover:text-white hover:bg-white/5 transition-smooth border-t border-border/50"
            >
              <FileSpreadsheet size={16} className="text-success" />
              {t('common:saveAsExcel')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
