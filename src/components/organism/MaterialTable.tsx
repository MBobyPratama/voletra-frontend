'use client';

import React from 'react';
import Image from 'next/image';
import { Applicant } from '@/types/misi';

interface MaterialTableProps {
  applicants: Applicant[];
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
  isProcessing?: boolean;
}

export default function MaterialTable({ applicants, onApprove, onDecline, isProcessing }: MaterialTableProps) {
  if (!applicants || applicants.length === 0) {
    return (
      <div className="bg-white rounded-[16px] p-[24px] shadow-sm min-h-[200px] flex flex-col items-center justify-center border border-gray-100">
        <h2 className="w-full font-semibold text-[20px] text-black mb-6">Materials</h2>
        <div className="flex-1 flex items-center justify-center w-full text-center">
           <div>
              <p className="text-gray-400 font-medium">Belum ada material atau pelamar</p>
              <p className="text-gray-400 text-sm mt-1">Daftar material akan muncul di sini.</p>
           </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-[16px] p-6 sm:p-10 shadow-sm border border-gray-100 overflow-x-auto">
      <h2 className="font-semibold text-[20px] text-black mb-8">Materials</h2>
      
      <table className="w-full min-w-[900px] text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-100">
            <th className="pb-4 font-medium text-[14px] text-gray-500 w-[20%] px-2">Name</th>
            <th className="pb-4 font-medium text-[14px] text-gray-500 w-[15%] px-2">Upload Date</th>
            <th className="pb-4 font-medium text-[14px] text-gray-500 w-[35%] px-2">Link File</th>
            <th className="pb-4 font-medium text-[14px] text-gray-500 w-[30%] px-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((item) => {
            const displayName = item.full_name || item.nama || '-';
            const displayDate = item.video_link ? formatDate(item.updated_at) : '-';
            const displayLink = item.video_link || '-';

            return (
              <tr key={item.apply_id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="py-5 border-b border-gray-50 px-2 group-last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-50">
                      <Image 
                        src={`https://ui-avatars.com/api/?name=${displayName}&background=random`} 
                        alt={displayName} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <p className="font-medium text-[14px] text-black line-clamp-1">{displayName}</p>
                  </div>
                </td>
                <td className="py-5 border-b border-gray-50 px-2 group-last:border-0 text-gray-600 text-[14px]">
                  {displayDate}
                </td>
                <td className="py-5 border-b border-gray-50 px-2 group-last:border-0">
                  {item.video_link ? (
                    <a 
                      href={displayLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#2869CA] hover:underline font-medium text-[14px] break-all line-clamp-1 max-w-xs block"
                    >
                      {displayLink}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic text-[13px]">Belum diunggah</span>
                  )}
                </td>
                <td className="py-5 border-b border-gray-50 px-2 group-last:border-0 text-right">
                   <div className="flex justify-end items-center h-full">
                      {item.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onDecline?.(item.apply_id)}
                            disabled={isProcessing}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => onApprove?.(item.apply_id)}
                            disabled={isProcessing}
                            className="bg-primary-normal text-white hover:bg-blue-700 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm shadow-blue-100 disabled:opacity-50"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <div className={`text-[12px] font-bold px-3 py-1 rounded-full inline-block ${
                          item.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {item.status === 'approved' ? 'APPROVED' : 'REJECTED'}
                        </div>
                      )}
                   </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
