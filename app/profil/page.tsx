"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, Users, Palette, Home as HomeIcon, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilDesa() {
  const [activeTab, setActiveTab] = useState("sejarah");
  const [alamBudayaImages, setAlamBudayaImages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/galleries")
      .then(res => res.json())
      .then(data => {
        if (data && data.alam_budaya) {
          setAlamBudayaImages(data.alam_budaya);
        }
      })
      .catch(err => console.error("Failed to load galleries:", err));
  }, []);

  const tabs = [
    { id: "sejarah", label: "Sejarah & Geografis", icon: MapPin },
    { id: "demografi", label: "Demografi & Ekonomi", icon: Users },
    { id: "budaya", label: "Adat & Seni Budaya", icon: Palette },
    { id: "arsitektur", label: "Arsitektur Tradisional", icon: HomeIcon },
    { id: "peninggalan", label: "Situs Peninggalan", icon: BookOpen },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Header Profil */}
        <div className="container mx-auto px-4 md:px-6 mb-12 text-center space-y-4">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase font-poppins bg-primary/10 px-4 py-1.5 rounded-full inline-block">
            Mengenal Lebih Dekat
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-poppins text-foreground tracking-tight">
            Profil Desa Salawu
          </h1>
          <p className="text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Menyelami warisan budaya, sejarah panjang, serta potensi luar biasa yang dimiliki oleh masyarakat Desa Salawu, Kecamatan Salawu, Kabupaten Tasikmalaya.
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar / Tabs (Horizontal Scroll on Mobile, Vertical Sticky on Desktop) */}
            <div className="lg:col-span-3 sticky top-20 lg:top-28 z-30 bg-background/95 backdrop-blur-md border border-border/60 rounded-2xl p-2 md:p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-none shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                    }}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2.5 lg:py-3 rounded-xl text-xs md:text-sm font-semibold font-poppins transition-all text-left shrink-0 whitespace-nowrap",
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground bg-muted/30 lg:bg-transparent"
                    )}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9 bg-background border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm min-h-[60vh]">
              {/* TAB 1: SEJARAH & GEOGRAFIS */}
              {activeTab === "sejarah" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
                      <span className="text-primary">01.</span> Sejarah & Geografis
                    </h2>
                    <div className="w-20 h-1 bg-secondary rounded-full"></div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                      <h3 className="text-xl font-bold font-poppins mb-3">Legenda Desa (Sasakala)</h3>
                      <p className="text-muted-foreground leading-relaxed text-justify indent-8">
                        Desa Salawu adalah desa lama yang dimekarkan, yang tadinya merupakan perpaduan antara Desa Malongpong dengan Desa Serang sekitar Tahun 1905, dan namanya diganti menjadi Desa Salawu. Pusat Pemerintahan Desa pun berpindah dari Malongpong ke Nanggorak (dekat sawah percontohan).
                      </p>
                      <p className="text-muted-foreground leading-relaxed text-justify indent-8 mt-3">
                        Untuk menentukan Pusat Pemerintah Desa dan Nama desa, para sepuh mengadakan Musyawarah (Berempug). Hasilnya, mereka sepakat untuk melarung (menghanyutkan) <strong>sapu pare di Sungai Ciwulan</strong> (tepatnya di Leuwi Salawu). Arus membawa sapu pare tersebut hingga berhenti di Beunghar blok Cisitu. Melihat hal tersebut, para sepuh sangat senang (<em>Bingah Amarwatasuta</em>) karena akhirnya menemukan tempat dan nama Desa yang sampai sekarang bernama <strong>Desa Salawu</strong>.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-border/50 rounded-2xl p-6 space-y-3">
                        <h3 className="text-lg font-bold font-poppins text-foreground">Kondisi Geografis</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Keadaan Geografis Desa Salawu terletak di jalur Jalan Provinsi sebelah barat Kabupaten Tasikmalaya. Jarak antara Desa dengan Ibu Kota Kecamatan sekitar 500 m, dan dengan Ibu Kota Kabupaten sekitar 10 km.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2 mt-4 list-none">
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> <strong>Ketinggian:</strong> 593 m mdpl</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> <strong>Luas Wilayah:</strong> 292.017 Ha</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> <strong>Topografi:</strong> Berbukit-bukit (400m - 800m mdpl)</li>
                        </ul>
                      </div>

                      <div className="border border-border/50 rounded-2xl p-6 space-y-3">
                        <h3 className="text-lg font-bold font-poppins text-foreground">Batas Administratif</h3>
                        <ul className="text-sm text-muted-foreground space-y-3 mt-4">
                          <li className="flex items-center gap-2"><strong>Sebelah Utara:</strong> Desa Serang</li>
                          <li className="flex items-center gap-2"><strong>Sebelah Timur:</strong> Desa Margalaksana</li>
                          <li className="flex items-center gap-2"><strong>Sebelah Selatan:</strong> Desa Jahiang & Desa Sukarasa</li>
                          <li className="flex items-center gap-2"><strong>Sebelah Barat:</strong> Desa Karang Mukti</li>
                        </ul>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-sm bg-muted/40 p-4 rounded-xl border border-border/40">
                      <strong>Kondisi Fisik:</strong> Sungai Cimawate mengalir membelah Desa Salawu dan menjadi Sumber Air Baku bagi kehidupan. Lahan di sepanjang lembah sungai sangat subur untuk pertanian basah. Desa ini terbagi menjadi 6 Kedusunan (Dusun Salawu I, Salawu II, Nanggerang, Cisudang, Cikiray I, dan Cikiray II), 7 RW, dan 31 RT.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: DEMOGRAFI & SOSIAL EKONOMI */}
              {activeTab === "demografi" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
                      <span className="text-primary">02.</span> Demografi & Sosial Ekonomi
                    </h2>
                    <div className="w-20 h-1 bg-secondary rounded-full"></div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      Sebagian besar masyarakat di Desa Salawu bergerak di bidang <strong>Pertanian</strong> dan <strong>Produksi Anyaman & Olahan Makanan Ringan</strong>. Setiap dusun memiliki fokus penggerak ekonomi yang berbeda:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                        <h4 className="font-bold text-primary mb-2 font-poppins">Cikiray I & Cikiray II</h4>
                        <p className="text-sm text-muted-foreground">Fokus pada sektor Produksi <strong>Anyaman Bambu</strong> untuk menopang perekonomian keluarga.</p>
                      </div>
                      <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-5">
                        <h4 className="font-bold text-secondary-foreground mb-2 font-poppins">Nanggerang</h4>
                        <p className="text-sm text-muted-foreground">Fokus pada sektor Pertanian dan Produksi <strong>Olahan Makanan Ringan</strong> berbahan dasar Singkong (&quot;Comring&quot;).</p>
                      </div>
                      <div className="bg-muted/50 border border-border/50 rounded-xl p-5">
                        <h4 className="font-bold text-foreground mb-2 font-poppins">Salawu I & Salawu II</h4>
                        <p className="text-sm text-muted-foreground">Wilayah ini memiliki karakteristik yang lebih mendekati perkotaan dan banyak didominasi oleh aktivitas Perdagangan.</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold font-poppins mt-8 mb-4 border-b pb-2">Mata Pencaharian Utama</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-sm text-muted-foreground">Buruh Tani</span>
                        <span className="text-sm font-bold text-foreground">744 orang</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-sm text-muted-foreground">Karyawan Swasta</span>
                        <span className="text-sm font-bold text-foreground">689 orang</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-sm text-muted-foreground">Petani</span>
                        <span className="text-sm font-bold text-foreground">674 orang</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-sm text-muted-foreground">Buruh Bangunan</span>
                        <span className="text-sm font-bold text-foreground">464 orang</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-sm text-muted-foreground">PNS</span>
                        <span className="text-sm font-bold text-foreground">186 orang</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-sm text-muted-foreground">Pengrajin</span>
                        <span className="text-sm font-bold text-primary">179 orang</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold font-poppins mt-8 mb-4 border-b pb-2">Fasilitas Desa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Pendidikan</h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>SD/MI: 4 buah</li>
                          <li>Taman Kanak-kanak/PAUD: 2 buah</li>
                          <li>Madrasah Diniyah: 5 buah</li>
                          <li>Pondok Pesantren: 2 buah</li>
                          <li>SLTP/MTs: 1 buah | SLTA/MA: 1 buah</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Kesehatan & Ekonomi</h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>Posyandu: 6 buah</li>
                          <li>Tenaga Medis & Bidan: 4 orang</li>
                          <li>Industri Rumah Tangga: 45 buah</li>
                          <li>Perusahaan Kecil: 67 buah</li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 3: ADAT ISTIADAT & SENI */}
              {activeTab === "budaya" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
                      <span className="text-primary">03.</span> Adat Istiadat & Seni Budaya
                    </h2>
                    <div className="w-20 h-1 bg-secondary rounded-full"></div>
                  </div>

                  <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <p className="text-justify indent-8">
                      Budaya dan Adat Istiadat yang diwariskan oleh para leluhur masih sangat dijaga dan dihormati oleh masyarakat Desa Salawu. Masyarakat masih kuat memegang nilai <strong>&quot;Pamali&quot;</strong> (hal-hal tabu yang dilarang) sebagai panduan keharmonisan hidup dengan alam dan sesama.
                    </p>
                    
                    <div className="p-6 bg-secondary/10 border-l-4 border-secondary rounded-r-2xl">
                      <h3 className="text-lg font-bold font-poppins text-foreground mb-2">Budaya &quot;Nganyam&quot;</h3>
                      <p className="text-sm">
                        Daya tarik utama Desa Salawu yang membedakannya dengan desa lain di Jawa Barat adalah tradisi <strong>&quot;Nganyam&quot;</strong> (menganyam bambu) yang telah turun temurun. Keterampilan tangan ini terus dipelihara dan menjadi salah satu poros perekonomian kerakyatan desa.
                      </p>
                    </div>

                    <h3 className="text-xl font-bold font-poppins mt-8 mb-4 border-b pb-2 text-foreground">Permainan Rakyat & Olahraga Tradisional</h3>
                    <p className="text-sm mb-4">Masyarakat (khususnya Dusun Cikiray I & II) sangat aktif melestarikan permainan rakyat yang sarat edukasi, kecermatan, dan nilai jasmani:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-border/50 p-5 rounded-2xl">
                        <h4 className="font-bold text-primary font-poppins mb-2 flex items-center gap-2">
                          <span className="text-xl">🐚</span> Congkak
                        </h4>
                        <p className="text-sm">Dimainkan dengan papan kayu berisi 98 lubang biji-bijian/kerikil/lokan. Melatih keterampilan menghitung, tanggung jawab, dan kejujuran.</p>
                      </div>
                      <div className="border border-border/50 p-5 rounded-2xl">
                        <h4 className="font-bold text-primary font-poppins mb-2 flex items-center gap-2">
                          <span className="text-xl">🎋</span> Jajangkungan
                        </h4>
                        <p className="text-sm">Dimainkan menggunakan dua batang bambu panjang dengan &quot;sengked&quot; (pijakan kaki). Olahraga ini menguji kesabaran dan keseimbangan tingkat tinggi.</p>
                      </div>
                      <div className="border border-border/50 p-5 rounded-2xl">
                        <h4 className="font-bold text-primary font-poppins mb-2 flex items-center gap-2">
                          <span className="text-xl">🪢</span> Tarik Tambang
                        </h4>
                        <p className="text-sm">Sering dijumpai saat acara Agustusan. Olahraga adu kekuatan yang mempererat solidaritas dan kerja sama tim antar warga.</p>
                      </div>
                      <div className="border border-border/50 p-5 rounded-2xl">
                        <h4 className="font-bold text-primary font-poppins mb-2 flex items-center gap-2">
                          <span className="text-xl">🎭</span> Seni Kesenian
                        </h4>
                        <p className="text-sm">Alat kesenian yang masih dipertahankan adalah <strong>Angklung</strong>, <strong>Dog-dog</strong>, dan <strong>Dugkol</strong> (Perpaduan Bedug & Kokol), sering dimainkan di acara khitanan atau syukuran.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ARSITEKTUR */}
              {activeTab === "arsitektur" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
                      <span className="text-primary">04.</span> Arsitektur Tradisional
                    </h2>
                    <div className="w-20 h-1 bg-secondary rounded-full"></div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed text-justify indent-8">
                      Bentuk bangunan rumah yang ada di Desa Salawu (khususnya Dusun Cikiray I) hampir menyerupai <strong>Bangunan Rumah Tradisional Kampung Naga</strong>. Struktur ini mengutamakan kearifan lokal menggunakan bahan alam sekitarnya seperti kayu, bambu, dan ijuk.
                    </p>

                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                      <h3 className="text-xl font-bold font-poppins text-primary mb-4">Filosofi Rumah Panggung</h3>
                      <p className="text-sm text-muted-foreground mb-4">Secara vertikal, bangunan rumah adat dibagi menjadi 3 bagian filosofis:</p>
                      <ul className="space-y-4 text-sm text-muted-foreground">
                        <li className="flex gap-4">
                          <div className="bg-white/50 w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg text-primary shrink-0">1</div>
                          <div>
                            <strong className="text-foreground">Lalangit / Para (Atas)</strong><br />
                            Langit-langit dari anyaman bambu yang dicat putih dengan kapur. Berfungsi sebagai pelindung suhu ekstra di bawah atap (daun nipah/ijuk).
                          </div>
                        </li>
                        <li className="flex gap-4">
                          <div className="bg-white/50 w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg text-primary shrink-0">2</div>
                          <div>
                            <strong className="text-foreground">Palupuh (Tengah)</strong><br />
                            Lantai bangunan berupa belahan bambu atau papan kayu. Terasa hangat di malam hari karena tidak bersentuhan langsung dengan tanah.
                          </div>
                        </li>
                        <li className="flex gap-4">
                          <div className="bg-white/50 w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg text-primary shrink-0">3</div>
                          <div>
                            <strong className="text-foreground">Kolong Imah (Bawah)</strong><br />
                            Ruang hampa antara tanah (ketinggian 45-65cm) dengan lantai rumah, berfungsi menopang fondasi tiang utama kayu rumah panggung.
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="border border-border/50 p-5 rounded-xl">
                        <h4 className="font-bold text-foreground font-poppins mb-2">Konsep &quot;Golodog&quot;</h4>
                        <p className="text-sm text-muted-foreground">
                          Tangga kayu di depan rumah yang lebih dari sekadar jalur masuk. Golodog berfungsi sebagai ruang bersosialisasi, tempat tetangga mengobrol santai sambil mencari angin sore.
                        </p>
                      </div>
                      <div className="border border-border/50 p-5 rounded-xl">
                        <h4 className="font-bold text-foreground font-poppins mb-2">Padepokan Cijagra</h4>
                        <p className="text-sm text-muted-foreground">
                          Kompleks di Cikiray I dengan ragam fungsi bangunan unik: <em>Saung Olot</em> (rumah sesepuh), <em>Bale Patemon</em> (balai pertemuan), <em>Saung Pangatik</em> (ruang guru), hingga <em>Ubrug</em> (gudang perkakas).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PENINGGALAN */}
              {activeTab === "peninggalan" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
                      <span className="text-primary">05.</span> Peninggalan & Teknologi
                    </h2>
                    <div className="w-20 h-1 bg-secondary rounded-full"></div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      Desa Salawu menyimpan jejak spiritual serta kejeniusan teknologi tradisional yang beradaptasi sempurna dengan keindahan alam sekitarnya.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-bold font-poppins mb-4 text-foreground flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-secondary" /> Situs Keramat Leluhur
                        </h3>
                        <ul className="space-y-3 text-sm text-muted-foreground bg-muted/30 p-5 rounded-2xl border border-border/40">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                            <strong>Situs Gunung Masigit</strong> (Eyang Nur Banten) - Cikiray I
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                            <strong>Situs Gunung Karamat</strong> (Sembah Dalem Geger Cahaya) - Cikiray I
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                            <strong>Situs Sembah Raja</strong> - Dusun Cisudang
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                            <strong>Situs Jati</strong> (Eyang Sanggan Jati)
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold font-poppins mb-4 text-foreground flex items-center gap-2">
                          <Palette className="w-5 h-5 text-secondary" /> Teknologi Tradisional
                        </h3>
                        <div className="text-sm text-muted-foreground bg-primary/5 p-5 rounded-2xl border border-primary/20 space-y-3">
                          <p>
                            Peralatan hidup masyarakat Sangat dipengaruhi alam. Warga khususnya Cikiray I & II mewarisi insting dan keterampilan presisi mengubah batang bambu menjadi karya seni multifungsi:
                          </p>
                          <ul className="space-y-2 pl-4 list-disc marker:text-primary">
                            <li><strong>Boboko</strong> - Tempat menaruh nasi</li>
                            <li><strong>Nyiru / Tampir</strong> - Alat membersihkan & menjemur beras</li>
                            <li><strong>Hihid</strong> - Kipas anyaman tradisional</li>
                            <li><strong>Aseupan</strong> - Wadah penanak nasi berbentuk kerucut</li>
                            <li><strong>Ayakan</strong> - Penyaring bambu presisi</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
