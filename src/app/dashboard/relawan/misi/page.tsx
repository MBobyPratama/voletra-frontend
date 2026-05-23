"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/organism/Sidebar";
import MissionSkeleton from "@/components/molecules/MissionSkeleton";
import MissionDetailCard from "@/components/organism/MissionDetailCard";
import ApprovedRegistration from "@/components/organism/ApprovedRegistration";
// TODO: [BE] import ini saat backend siap
import { MisiService } from '@/services/MisiService';

type ApplyStatus = "Pending" | "Approve" | "Reject";
type PageView = "list" | "detail" | "approved-step2" | "approved-done";

interface AppliedMisi {
  id: string;
  misi_id: string;
  judul: string;
  alamat: string;
  foto: string[];
  mode: string;
  apply_status: ApplyStatus;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  kategori: string;
  jumlah_relawan: number;
  deskripsi: string;
  status: string;
  link_wa?: string; // link whatsapp group dari pelapor
  link_lokasi?: string; // link maps lokasi
  latitude?: number;
  longitude?: number;
}

const TABS = [
  "All",
  "Offline",
  "Online",
  "Open",
  "On going",
  "Completed",
] as const;

function ApplyStatusBadge({ status }: { status: ApplyStatus }) {
  const styles: Record<ApplyStatus, string> = {
    Pending: "bg-[rgba(188,209,239,0.87)] text-[#1E4F98]",
    Approve: "bg-[#BFE5BD] text-[#258020]",
    Reject: "bg-[#FFE1B0] text-[#BF7600]",
  };
  return (
    <div className={`flex h-[28px] items-center justify-center px-3 py-[10px] rounded-[8px] ${styles[status]}`}>
      <span className="font-['Poppins:SemiBold',sans-serif] leading-[20px] text-[12px]">
        {status}
      </span>
    </div>
  );
}

function MisiRow({
  item,
  onViewDetail,
}: {
  item: AppliedMisi;
  onViewDetail: (item: AppliedMisi) => void;
}) {
  const thumbnail = item.foto && item.foto.length > 0 
    ? (item.foto[0].startsWith('http') ? item.foto[0] : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.foto[0]}`) 
    : null;
    
  return (
    <div className="bg-white flex items-center h-[121px] w-full border-b border-[rgba(0,0,0,0.2)]">
      <div className="w-[102px] h-[87px] relative shrink-0 ml-[12px] rounded-[6px] overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={item.judul}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-300">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 ml-[23px] flex flex-col justify-center h-full">
        <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-black leading-[normal] truncate mb-1">
          {item.judul}
        </p>
        <p className="font-['Poppins:Light',sans-serif] text-[12px] text-black leading-[normal] truncate">
          {item.alamat}
        </p>
        <div className="flex gap-[13px] items-center mt-[15px]">
          <ApplyStatusBadge status={item.apply_status} />
          <div className="border border-[#2869ca] flex h-[28px] items-center justify-center px-3 py-[10px] rounded-[6px]">
             <span className="font-['Poppins:Medium',sans-serif] text-[#2869ca] text-[12px]">
               {item.mode}
             </span>
          </div>
        </div>
      </div>
      <div className="shrink-0 mr-[18px]">
        <button
          onClick={() => onViewDetail(item)}
          className="border border-[#2869ca] flex h-[27px] items-center justify-center px-[10px] rounded-[6px] transition-colors hover:bg-blue-50"
        >
          <span className="font-['Poppins:Medium',sans-serif] text-[#2869ca] text-[12px] whitespace-nowrap">
            View Details
          </span>
        </button>
      </div>
    </div>
  );
}

export default function RelawanMisiPage() {
  const [applied, setApplied] = useState<AppliedMisi[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItem, setSelectedItem] = useState<AppliedMisi | null>(null);
  const [view, setView] = useState<PageView>("list");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await MisiService.getAppliedByRelawan();
        setApplied(data);
      } catch (error) {
        console.error("Failed to fetch applied missions:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { All: applied.length };
    TABS.forEach((tab) => {
      if (tab === "All") return;
      counts[tab] = applied.filter(
        (m) =>
          m.mode === tab ||
          m.status === tab ||
          (tab === "On going" && m.status === "Ongoing")
      ).length;
    });
    return counts;
  }, [applied]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return applied;
    return applied.filter(
      (m) =>
        m.mode === activeTab ||
        m.status === activeTab ||
        (activeTab === "On going" && m.status === "Ongoing")
    );
  }, [applied, activeTab]);

  const toMisi = (item: AppliedMisi) => ({
    id: item.misi_id,
    judul: item.judul,
    deskripsi: item.deskripsi,
    kategori: item.kategori,
    alamat: item.alamat,
    jumlah_relawan: item.jumlah_relawan,
    foto: item.foto,
    status: item.status as never,
    tanggal_mulai: item.tanggal_mulai,
    tanggal_selesai: item.tanggal_selesai,
    link_wa: item.link_wa,
    link_lokasi: item.link_lokasi,
    createdAt: "",
    updatedAt: "",
  });

  const handleViewDetail = (item: AppliedMisi) => {
    setSelectedItem(item);
    if (item.apply_status === "Approve") {
      if (item.mode === "Online") {
        setView("approved-step2"); // Online → upload materi dulu
      } else {
        setView("approved-done"); // Offline → langsung ke detail WA & lokasi
      }
    } else {
      setView("detail");
    }
  };

  const handleBack = () => {
    setSelectedItem(null);
    setView("list");
  };

  const BackButton = () => (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Kembali ke daftar misi
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#EAF0FA]">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* ─── View: Step 2 Approved (upload material) ─── */}
        {view === "approved-step2" && selectedItem && (
          <>
            <BackButton />
            <ApprovedRegistration
              misiJudul={selectedItem.judul}
              onDone={() => setView("approved-done")}
            />
          </>
        )}

        {/* ─── View: Detail setelah Approved + Done (tampilkan tombol WA & Lokasi) ─── */}
        {view === "approved-done" && selectedItem && (
          <>
            <BackButton />
            <MissionDetailCard
              misi={toMisi(selectedItem)}
              // Tidak ada onEdit — diganti dua tombol di bawah
              extraActions={
                <div className="flex gap-[14px] justify-end mt-8">
                  {selectedItem.link_lokasi && (
                    <Link
                      href={`/dashboard/relawan/misi/${selectedItem.misi_id}/location`}
                      className="bg-[#bcd1ef] flex items-center justify-center p-[10px] rounded-[10px] w-[293px]"
                    >
                      <span className="font-['Poppins:Medium',sans-serif] text-[#0e2547] text-[16px] whitespace-nowrap">
                        Location
                      </span>
                    </Link>
                  )}
                  {selectedItem.link_wa && (
                    <a
                      href={selectedItem.link_wa}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#3349c6] flex items-center justify-center p-[10px] rounded-[10px] w-[293px]"
                    >
                      <span className="font-['Poppins:Medium',sans-serif] text-[#eaf0fa] text-[16px] whitespace-nowrap">
                        Join Whatsapp Group
                      </span>
                    </a>
                  )}
                </div>
              }
            />
          </>
        )}

        {/* ─── View: Detail biasa (Pending/Reject) ─── */}
        {view === "detail" && selectedItem && (
          <>
            <BackButton />
            <MissionDetailCard
              misi={toMisi(selectedItem)}
              onBack={handleBack}
              onRegister={() => setView("approved-step2")}
              applyStatus={selectedItem.apply_status} // ← tambah ini
            />
          </>
        )}

        {/* ─── View: List misi ─── */}
        {view === "list" && (
          <>
            <h1 className="font-['Poppins:Medium',sans-serif] text-[24px] text-black mb-[25px]">Mission</h1>

            <div className="flex gap-[18px] items-center mb-[25px]">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex h-[28px] items-center justify-center p-[10px] rounded-[14px] transition-all min-w-[93px] ${
                    activeTab === tab
                      ? "bg-[#2869ca] border border-transparent"
                      : "bg-[rgba(255,255,255,0.43)] border border-[rgba(0,0,0,0.2)] hover:border-[#2869ca]"
                  }`}
                >
                  <span className={`font-['Poppins:Regular',sans-serif] leading-[20px] text-[12px] whitespace-nowrap ${
                    activeTab === tab ? "text-white" : "text-[rgba(0,0,0,0.54)]"
                  }`}>
                    {tab}({tabCounts[tab] ?? 0})
                  </span>
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <MissionSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <p className="text-gray-500 font-medium">
                  Belum ada misi yang diapply
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Pergi ke Home untuk menemukan misi
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((item) => (
                  <MisiRow
                    key={item.id}
                    item={item}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
