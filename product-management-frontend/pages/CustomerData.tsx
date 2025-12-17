import React, { useState } from "react";
import { useCustomers } from "../hooks/useCustomers";
import { Button } from "../components/atoms";
import type { Customer } from "../types/customer";

const CustomerData: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  const limit = 100;
  const { data, isLoading, error } = useCustomers(page, limit);

  const handleExport = () => {
    setIsExporting(true);
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/customers/export', true);
    xhr.responseType = 'blob';
    xhr.timeout = 600000;
    
    xhr.onprogress = (e) => {
      const mb = (e.loaded / 1024 / 1024).toFixed(1);
      setExportProgress(`Downloading: ${mb} MB...`);
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const url = window.URL.createObjectURL(xhr.response);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'customers.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
      }
      setExportProgress('');
      setIsExporting(false);
    };
    
    xhr.onerror = xhr.ontimeout = () => {
      alert('Export failed. Please try again.');
      setExportProgress('');
      setIsExporting(false);
    };
    
    xhr.send();
  };

  const customers = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading customer data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-8">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading customer data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-indigo1">Customer Data</h1>
          <p className="mt-2 text-lg text-gray-600">
            Showing {customers.length} of {total.toLocaleString()} customers
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button variant="primary" onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
          {exportProgress && (
            <p className="text-sm text-blue-600 animate-pulse">
              {exportProgress}
            </p>
          )}
        </div>
      </div>

      {customers && customers.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deleted At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer: Customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.deletedAt ? new Date(customer.deletedAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {page} of {totalPages.toLocaleString()}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No customer data available</p>
        </div>
      )}
    </div>
  );
};

export default CustomerData;
