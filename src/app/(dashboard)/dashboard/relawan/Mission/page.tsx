"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Sidebar from "@/components/organism/Sidebar";
import StatusBadge from "@/components/atoms/StatusBadge";
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
}

// const data = await MisiService.getById()
const DUMMY_APPLIED: AppliedMisi[] = [
  {
    id: "apply-1",
    misi_id: "ms-4",
    judul: "Green Action",
    alamat: "Cisarua, Jawa Barat",
    foto: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300",
    ],
    mode: "Offline",
    apply_status: "Pending",
    kategori: "Lingkungan",
    jumlah_relawan: 50,
    deskripsi: "Aksi penghijauan dan penanaman pohon.",
    status: "Open",
    tanggal_mulai: "10 Mei 2026",
    tanggal_selesai: "10 Mei 2026",
  },
  {
    id: "apply-2",
    misi_id: "ms-2",
    judul: "Tanggap Banjir",
    alamat: "Tapanuli Utara, Sumatra Utara",
    foto: ["https://images.unsplash.com/photo-1547683905-f686c993aae5?w=300"],
    mode: "Offline",
    apply_status: "Reject",
    kategori: "Bencana Alam",
    jumlah_relawan: 100,
    deskripsi: "Aksi tanggap darurat banjir.",
    status: "Open",
    tanggal_mulai: "5 Mei 2026",
    tanggal_selesai: "20 Mei 2026",
  },
  {
    id: "apply-3",
    misi_id: "ms-3",
    judul: "Digital Mengajar",
    alamat: "Lombok Timur, Nusa Tenggara Barat",
    foto: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
    ],
    mode: "Online",
    apply_status: "Approve",
    kategori: "Technology",
    jumlah_relawan: 20,
    deskripsi:
      "Program ini untuk meningkatkan literasi dan keterampilan teknologi masyarakat, khususnya dalam membantu mereka memahami penggunaan perangkat digital secara efektif.",
    status: "Open",
    tanggal_mulai: "12 April 2026",
    tanggal_selesai: "20 April 2026",
    link_wa: "https://chat.whatsapp.com/contoh",
    link_lokasi: "https://maps.google.com/?q=Lombok+Timur",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

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
    Pending: "bg-[#EAF0FA] text-[#2869CA] border-[#BCD1EF]",
    Approve: "bg-green-50 text-green-600 border-green-200",
    Reject: "bg-yellow-50 text-yellow-600 border-yellow-200",
  };
  return (
    <span
      className={`px-4 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function MisiRow({
  item,
  onViewDetail,
}: {
  item: AppliedMisi;
  onViewDetail: (item: AppliedMisi) => void;
}) {
  const thumbnail = item.foto?.[0] || null;
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-20 h-20 rounded-xl overflow-hidden relative bg-gray-200 shrink-0">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={item.judul}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
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
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm truncate mb-1">
          {item.judul}
        </h3>
        <p className="text-xs text-gray-500 truncate mb-2">{item.alamat}</p>
        <div className="flex gap-2 flex-wrap">
          <ApplyStatusBadge status={item.apply_status} />
          <StatusBadge status={item.mode} />
        </div>
      </div>
      <button
        onClick={() => onViewDetail(item)}
        className="shrink-0 px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        View Details
      </button>
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
        // TODO: [BE] ganti 2 baris ini dengan:
        // const data = await MisiService.getAppliedByRelawan();
        // setApplied(data);
        await new Promise((r) => setTimeout(r, 500));
        setApplied(DUMMY_APPLIED);
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
                <div className="flex gap-3 justify-end mt-8">
                  {selectedItem.link_lokasi && (
                    <a
                      href={selectedItem.link_lokasi}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-3 rounded-xl border border-primary-normal text-primary-normal font-semibold text-sm hover:bg-primary-light transition-colors"
                    >
                      Location
                    </a>
                  )}
                  {selectedItem.link_wa && (
                    <a
                      href={selectedItem.link_wa}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-3 rounded-xl bg-primary-normal text-white font-semibold text-sm hover:bg-primary-normalHover transition-colors"
                    >
                      Join Whatsapp Group
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
            <h1 className="text-2xl font-bold text-[#122F5B] mb-6">Mission</h1>

            <div className="flex gap-2 flex-wrap mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    activeTab === tab
                      ? "bg-primary-normal text-white border-primary-normal"
                      : "bg-white text-gray-500 border-gray-200 hover:border-primary-normal hover:text-primary-normal"
                  }`}
                >
                  {tab}({tabCounts[tab] ?? 0})
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
