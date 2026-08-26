        // ============================================================================
        // EKRAN MODU (Kiosk/TV modu) TESPİTİ
        // ----------------------------------------------------------------------------
        // Adres "?ekran=1" içeriyorsa (TV/kiosk gösterimi), yönetim paneli açma
        // tetikleyicileri (logoya tıklama, 'A' tuşu) TAMAMEN devre dışı bırakılır.
        // Böylece TV'de yanlışlıkla dokunma/tuş basımıyla "Güvenlik Geçidi" ekranının
        // açılması imkansız hale gelir. Normal (PC'den, parametresiz) erişimde
        // yönetim paneli her zamanki gibi çalışmaya devam eder.
        // ============================================================================
        const IS_DISPLAY_MODE = new URLSearchParams(window.location.search).get("ekran") === "1";

        const classList = [
            "1/A", "1/B", "1/C", "1/D", "2/A", "2/B", "2/C", "2/D", "3/A", "3/B", "3/C", "3/D", "4/A", "4/B", "4/C", "4/D"
        ];

        const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

        let bellHours = [
            { id: 1, start: "08:40", end: "09:20" },
            { id: 2, start: "09:35", end: "10:15" },
            { id: 3, start: "10:30", end: "11:10" },
            { id: 4, start: "11:20", end: "12:00" },
            { id: 5, start: "13:20", end: "14:00" },
            { id: 6, start: "14:10", end: "14:50" },
            { id: 7, start: "15:00", end: "15:40" }
        ];

        const defaultAppConfig = {
            schoolName: "2071 MELİKŞAH İLKOKULU",
            quote: "Akıllı kimsenin lisanı kalbindedir. Düşünerek söyler.",
            quoteAuthor: "Hz. Ali (r.a.)",
            quotes: [
                { text: "Akıllı kimsenin lisanı kalbindedir. Düşünerek söyler.", author: "Hz. Ali (r.a.)", date: "" }
            ],
            cityName: "Muş",
            weatherLat: "38.73",
            weatherLng: "41.49",
            adminPin: "",
            // Başka bir cihazda/tarayıcıda yapılan güncelleme bu ekrana ulaştığında
            // gösterilecek mesaj. Yönetim Paneli > Bulut Bağlantısı bölümünden
            // değiştirilebilir; hem Pano49 hem Pano99 (Duyuru Panosu) için ayrı
            // ayrı ayarlanır (Pano99 kendi appConfig/dpCloudState'inde tutar).
            refreshMessage: "Panoda güncelleme var, yenileniyor...",
            // Bulut senkronizasyon yoklama sıklığı (saniye). Her ekran/cihaz bu süre
            // aralığıyla "yeni bir değişiklik var mı?" diye buluta bakar. Düşük değer =
            // değişiklikler ekranlara daha hızlı yansır ama bulut isteği sayısı artar.
            // Yönetim Paneli > Bulut Bağlantısı bölümünden ayarlanabilir; Pano99'da da
            // aynı isimli/işlevli bir alan vardır (dpCloudState.pollIntervalSeconds).
            pollIntervalSeconds: 15,
            // Veri Kontrol Sıklığı için süreli (periyodik) kontrolün açık/kapalı olduğunu
            // belirler. true (varsayılan) = yukarıdaki saniyeye göre otomatik/periyodik
            // kontrol edilir. false = otomatik yoklama YAPILMAZ; güncellemeler yalnızca
            // sayfa manuel olarak yenilendiğinde (F5 / kiosk yeniden yüklendiğinde) görülür.
            pollIntervalEnabled: true,
            // Ekran geçişi (Pano49 ↔ Pano99) kontrol sıklığı (saniye) — "display_control"
            // tablosuna bakıp başka bir cihazdan ekran değiştirilip değiştirilmediğini
            // kontrol eder. Veri kontrolünden AYRI bir zamanlayıcıdır.
            displaySwitchPollSeconds: 5,
            // Ekran Geçişi Kontrol Sıklığı için süreli (periyodik) kontrolün açık/kapalı
            // olduğunu belirler. true (varsayılan) = periyodik kontrol edilir. false =
            // otomatik yoklama YAPILMAZ; ekran geçişi yalnızca sayfa manuel yenilendiğinde
            // (açılışta bir kez) kontrol edilir.
            displaySwitchPollEnabled: true,
            // Günlük Zil Saatleri kartının görünüm ayarları (satır/sütun boşluğu, teneffüs gösterimi, aktif ders vurgusu, başlık biçimi)
            bellHoursSettings: {
                rowGap: 4,                 // Satır (dikey) boşluk - px (mutlak değer, varsayılan tasarımla aynı)
                colGap: 4,                 // Sütun (yatay) boşluk - px (mutlak değer, varsayılan tasarımla aynı)
                recessDisplayMode: "all",  // 'all' = tüm teneffüsleri göster, 'activeOnly' = sadece aktif teneffüsü göster
                recessLabelMode: "line",   // 'line' = düz ayırıcı çizgi, 'dotted' = noktalı çizgi, 'icon' = sadece sembol, 'time' = sadece saat aralığı
                recessTextMode: "static",  // 'static' = "🔔 Şu Anda Teneffüs", 'countdown' = "🔔 Teneffüs Xdk.", 'custom' = manuel metin
                recessCustomText: "",      // Manuel teneffüs metni (recessTextMode='custom' iken kullanılır)
                activeRowColor: "#ffb703", // Aktif ders satırı vurgu rengi
                activeRowEffect: "glow",   // 'none' | 'glow' | 'pulse' | 'border' | 'solid'
                activeRowGap: 6,           // Aktif (vurgulanan) ders satırının boyu - px (diğer satırlardan bağımsız)
                activeRowFontSize: 11,     // Aktif ders satırının yazı boyutu - px (diğer satırlardan bağımsız)
                recessRowGap: 3,           // Teneffüs satırının boyu - px (ders satırlarından bağımsız)
                recessRowFontSize: 9,      // Teneffüs satırının yazı boyutu - px (ders satırlarından bağımsız)
                activeRecessRowGap: 3,        // Aktif (o an devam eden) teneffüs satırının boyu - px (pasif teneffüslerden bağımsız)
                activeRecessRowFontSize: 10.5,// Aktif teneffüs satırının yazı boyutu - px (pasif teneffüslerden bağımsız)
                activeRecessColor: "#22c55e",  // Aktif teneffüs satırı vurgu rengi
                activeRecessEffect: "pulse",   // 'none' | 'glow' | 'pulse' | 'border' | 'solid'
                headerBgColor: "#111b2d",  // Sütun başlığı (Ders/Giriş/Çıkış) arka plan rengi
                headerTextColor: "#94a3b8",// Sütun başlığı yazı rengi
                headerBold: true,          // Sütun başlığı kalın yazı
                headerFontSize: 11         // Sütun başlığı yazı boyutu (px)
            },
            theme: "standard",
            themeMode: "dark",
            customColors: null,
            schoolLogo: "",
            logoSize: 54,
            schoolNameSize: 24,
            logoPosition: "left",
            namePosition: "left",
            schoolNameFont: "'Rajdhani', sans-serif",
            logoOffsetX: 0,
            nameOffsetX: 0,
            // Görsel çerçeveleri (saydamlık / kenarlık kalınlığı / en-boy oranı) — GÖRSEL
            // DÜZENLEYİCİ'deki kırpma/döndürmeden BAĞIMSIZDIR; bu ayarlar görsel zaten
            // kırpıldıktan SONRA, panoda gösterilirken uygulanan ince görünüm ayarlarıdır.
            logoFrame: { opacity: 100, borderWidth: 0, borderColor: "#00b4d8", ratio: "auto" },
            rosterPhotoFrame: { opacity: 100, borderWidth: 0, borderColor: "#00b4d8", ratio: "auto" },
            // Görsel Oynatma Listesi altyazısının tam özelleştirilebilir görünüm ayarları.
            mediaCaptionStyle: {
                template: "classic",
                bgColor: "#02040a",
                bgOpacity: 85,
                textColor: "#cbd5e1",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                textAlign: "center",
                widthPct: 100,
                heightMode: "auto", // "auto" | "fixed"
                heightPct: 20,
                padding: 8,
                borderColor: "#00b4d8",
                borderWidth: 0,
                cornerRadius: 0,
                shadow: "none", // "none" | "soft" | "strong"
                position: "bottom", // "bottom" | "top" | "left" | "right" | "free"
                posXPct: 50,
                posYPct: 90
            },
            brandBorderStyle: "solid",
            brandBorderColor: "#00b4d8",
            brandBorderWidth: 2,
            brandBgType: "gradient",
            brandBgColor1: "#09101f",
            brandBgColor2: "#0d1b35",
            brandEffect: "glow",
            brandSubText: "Yönetici Paneli için Tıklayın veya 'A' Tuşuna Basın",
            brandSubVisible: true,
            specialDays: [
                { title: "Okuma ve Yazma Bayramı Coşkusu", startDate: "", endDate: "" },
                { title: "İlköğretim Haftası Kutlu Olsun", startDate: "", endDate: "" }
            ],
            moduleSettings: {
                brand: { title: "", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100 },
                birthday: { title: "BUGÜN DOĞANLAR 🎂", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, interval: 6 },
                schedule: { title: "SINIFLARIN DERS DURUMLARI", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, interval: 12 },
                quote: { title: "GÜNÜN SÖZÜ", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, interval: 9 },
                specialday: { title: "Belirli Gün / Hafta", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, interval: 8 },
                bellhours: { title: "GÜNLÜK ZİL SAATLERİ", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100 },
                announcements: { title: "DUYURULAR 📢", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100 },
                clock: { title: "", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100 },
                achievements: { title: "AYIN ENLERİ", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, interval: 7 },
                duty: { title: "BUGÜN GÖREVLİ NÖBETÇİ ÖĞRETMENLER", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100 },
                media: { title: "", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, interval: 10 },
                marquee: { title: "KAYAN YAZI", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100 }
            },
            /* AYIN ENLERİ: DİNAMİK ALAN (HÜCRE) LİSTESİ
               Her alan; kendi başlığı, ikonu, kayıt listesi (URL veya manuel/dosya yüklenmiş görsel)
               ve kendi metin/görsel biçimlendirme ayarlarıyla bağımsız bir "hücre" gibi çalışır.
               Kullanıcı istediği kadar yeni alan (Ayın/Haftanın Eni) ekleyebilir. */
            achievementCategories: [
                {
                    id: "cat_clean_class",
                    title: "Ayın Temiz Sınıfı",
                    icon: "fa-wand-magic-sparkles",
                    active: true,
                    list: [
                        { title: "3/C Sınıfı", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=120", active: true }
                    ],
                    style: {
                        font: "", size: "14", color: "", textAlign: "left", justify: "center",
                        imgPosition: "left", imgSize: 44, imgShape: "rounded",
                        imgBorderWidth: 1.5, imgBorderColor: "#00b4d8", imgBorderStyle: "solid", imgOpacity: 100,
                        cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, imgEffect: "none", imgEffectColor: "#00b4d8", imgEffectIntensity: 100
                    }
                },
                {
                    id: "cat_best_student",
                    title: "Ayın Örnek Öğrencisi",
                    icon: "fa-star",
                    active: true,
                    list: [
                        { title: "M. Asaf ÇÖZÜM (3/C)", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=120", active: true }
                    ],
                    style: {
                        font: "", size: "14", color: "", textAlign: "left", justify: "center",
                        imgPosition: "left", imgSize: 44, imgShape: "rounded",
                        imgBorderWidth: 1.5, imgBorderColor: "#00b4d8", imgBorderStyle: "solid", imgOpacity: 100,
                        cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, imgEffect: "none", imgEffectColor: "#00b4d8", imgEffectIntensity: 100
                    }
                }
            ],
            /* AYIN ENLERİ: GENEL YERLEŞİM VE AYIRICI AYARLARI */
            achievementWidget: {
                layout: "column",           // column (üst üste) / row (yan yana)
                separator: "line",          // line / dots / icon / none
                separatorIcon: "fa-star",
                separatorThickness: 1,      // Ayırıcı çizgi/desenin kalınlığı (px) — sadece 'line' ve 'dots' türlerinde geçerli
                columns: 0                  // "Yan Yana" seçiliyken satır başına kaç hücre gösterileceği (0 = otomatik/tek satır)
            },
            mediaPlaylist: [
                { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000", caption: "Çocuklarımız uygulamalı eğitimlerle trafik kurallarını öğrendiler" },
                { url: "https://images.unsplash.com/photo-1577896851231-70ee18881754?q=80&w=1000", caption: "Okulumuzda eğlenceli bilim şenliği etkinlikleri düzenlendi" }
            ],
            announcements: [
                { text: "Merdivenlerin her zaman sağından inip çıkalım.", color: "", bgColor: "", font: "", fontSize: 11, bold: false },
                { text: "Teneffüs bitiminde sınıflarımıza zamanında geçelim.", color: "", bgColor: "", font: "", fontSize: 11, bold: false },
                { text: "Sevgili Çocuklar, Okulumuzu temiz tutalım.", color: "", bgColor: "", font: "", fontSize: 11, bold: false },
                { text: "Değerli velilerimiz, ders esnasında öğretmenlerimizle koridorlarda görüşmeyelim.", color: "", bgColor: "", font: "", fontSize: 11, bold: false }
            ],
            marqueeItems: [
                { text: "Okulumuza hoş geldiniz!", color: "", bold: false, italic: false, icon: "fa-bullhorn" },
                { text: "Bilgiyle dolu, güzel bir gün geçirmenizi dileriz.", color: "", bold: false, italic: false, icon: "" }
            ],
            marqueeWidget: {
                direction: "left",       // left (sağdan sola) | right (soldan sağa)
                speed: 60,                // px/saniye
                gap: 60,                  // tekrarlar arası boşluk (px)
                pauseOnHover: true,
                separator: "dot",         // dot | pipe | star | icon | none
                separatorIcon: "fa-star",
                textColor: "",
                fontSize: 16,
                letterSpacing: 0,
                bold: false,
                italic: false,
                uppercase: false,
                glowEnabled: false,
                glowColor: "#00e5ff"
            },
            birthdays: [
                { class: "2/B", name: "Beyza KIZILŞARA", date: "24.11" },
                { class: "3/C", name: "Enes DEMİR", date: "15.05" },
                { class: "1/A", name: "Elif BULUT", date: "20.07" }
            ],
            birthdayWidget: {
                title: "BUGÜN DOĞANLAR 🎂",
                cardSize: 1,
                todaySubtitle: "İYİ Kİ DOĞDUN! 🎉",
                upcomingSubtitle: "Yaklaşan Doğum Günleri 🎂",
                emptyText: "Bugün doğum günü olan kayıt bulunmuyor.",
                showUpcomingWhenEmpty: true,
                upcomingCount: 5,
                celebrationDateLabel: "Kutlama Tarihi",
                emojiText: "🎈🎉🍰",
                emojiPosition: "middle",
                emojiSize: 32,
                showYearInUpcoming: false
            },
            /* BELİRLİ GÜN & HAVA DURUMU KARTI: METİN VE HAVA DURUMU BİÇİMLENDİRME AYARLARI */
            specialDayWidget: {
                emptyText: "İyi Dersler Dileriz",  // Belirli gün/hafta listesi boşken gösterilecek metin
                emptyMode: "text",                 // 'text' = metin göster, 'image' = görsel göster
                emptyImage: "",                    // emptyMode 'image' iken gösterilecek görsel (URL veya base64)
                textColor: "",                     // '' = varsayılan (--neon-yellow)
                textFont: "",                      // '' = varsayılan font
                textSize: "11",                    // px cinsinden belirli gün yazı boyutu
                weatherLabel: "HAVA DURUMU",        // Hava durumu bölümünün küçük başlık etiketi
                weatherIcon: "🌤️",                  // Hava kodu okunamazsa kullanılacak yedek ikon
                weatherErrorIcon: "⛅",              // Bağlantı hatasında gösterilecek ikon
                // Aşağıdaki weatherColor/weatherFont/weatherSize ESKİ (tüm satırı tek biçimde
                // renklendiren) alanlardır; artık yalnızca aşağıdaki özel alanlardan biri boşsa
                // GERİYE DÖNÜK UYUMLULUK için yedek olarak kullanılır.
                weatherColor: "",
                weatherFont: "",
                weatherSize: "13",
                // ETİKET ("HAVA DURUMU" küçük başlığı) biçimi
                labelColor: "",                    // '' = varsayılan (--text-muted)
                labelFont: "",
                labelSize: "8",
                // ŞEHİR ADI biçimi
                cityColor: "",                     // '' = varsayılan (--neon-blue)
                cityFont: "",
                citySize: "13",
                // İKON (emoji) biçimi
                iconColor: "",
                iconFont: "",
                iconSize: "13",
                // DERECE (sıcaklık, ör. "21°C") biçimi
                tempColor: "",                     // '' = varsayılan (--neon-blue)
                tempFont: "",
                tempSize: "13",
                // ALAN YERLEŞİMİ & AYIRICI: Belirli Gün ve Hava Durumu iki ayrı alan (hücre)
                // olarak "Ayın Enleri" kartındaki gibi yönetilir.
                layout: "column",                  // 'column' = üst üste (dikey), 'row' = yan yana (yatay)
                separator: "line",                  // 'line' | 'dots' | 'icon' | 'none'
                separatorIcon: "fa-star",           // separator 'icon' iken kullanılacak Font Awesome sınıfı
                separatorThickness: 1,               // px cinsinden çizgi/nokta kalınlığı
                // ALAN HİZALAMA: her iki alanın içeriği de bu ayara göre hizalanır.
                alignH: "left",                      // 'left' | 'center' | 'right' — yatay (metin) hizalama
                alignV: "center",                     // 'top' | 'center' | 'bottom' — dikey hizalama
                // ALAN EFEKTLERİ: her alana ayrı ayrı uygulanabilen dikkat çekme efekti — "Ayın
                // Enleri" hücreleriyle AYNI box-shadow tabanlı sistem (kırpılma sorunu yaşamaz)
                specialdayEffect: "none",             // 'none' | 'glow' | 'pulse' | 'border' | 'shine'
                specialdayEffectColor: "#00b4d8",
                weatherEffect: "none",
                weatherEffectColor: "#00b4d8"
            },
            weeklyDuties: {
                "Pazartesi": { admin: "Nihan Öztürk", canteen: "Ahmet Ak", garden: "Veli Can", floor1: "Zeynep Şen", floor2: "Murat Koç" },
                "Salı": { admin: "Mehmet Çelik", canteen: "Canan Yılmaz", garden: "Kemal Sun", floor1: "Özlem Er", floor2: "Tarık Aka" },
                "Çarşamba": { admin: "Nihan Öztürk", canteen: "Fatih Yaşar", garden: "Deniz Gözü", floor1: "Seda Gül", floor2: "Canan Demir" },
                "Perşembe": { admin: "Mehmet Çelik", canteen: "Seda Süs", garden: "Arif Mert", floor1: "Zeynep Şen", floor2: "Murat Koç" },
                "Cuma": { admin: "Kadir Bal", canteen: "Gönül Bağı", garden: "Ali Kemal", floor1: "Hülya Avşar", floor2: "Cem Karaca" }
            },
            weeklyClassSchedules: {
                "1/A": {
                    "Pazartesi": ["Türkçe", "Türkçe", "Matematik", "Müzik", "Görsel San.", "Beden Eğt.", "Beden Eğt."],
                    "Salı": ["Matematik", "Matematik", "Türkçe", "Türkçe", "Hayat Bil.", "Müzik", "Oyun Etk."],
                    "Çarşamba": ["Türkçe", "Türkçe", "Hayat Bil.", "Hayat Bil.", "Matematik", "Serbest Etk.", "Serbest Etk."],
                    "Perşembe": ["Okuma-Yazma", "Okuma-Yazma", "Beden Eğt.", "Matematik", "Türkçe", "Görsel San.", "Müzik"],
                    "Cuma": ["Türkçe", "Türkçe", "Hayat Bil.", "Hayat Bil.", "Matematik", "Oyun Etk.", "Oyun Etk."]
                },
                "3/C": {
                    "Pazartesi": ["Hayat Bil.", "Hayat Bil.", "Türkçe", "Türkçe", "Matematik", "Görsel San.", "Serbest Etk."],
                    "Salı": ["Fen Bil.", "Fen Bil.", "Matematik", "Matematik", "Türkçe", "Türkçe", "Müzik"],
                    "Çarşamba": ["İngilizce", "İngilizce", "Matematik", "Matematik", "Türkçe", "Türkçe", "Fen Bil."],
                    "Perşembe": ["Türkçe", "Türkçe", "Matematik", "İngilizce", "İngilizce", "Beden Eğt.", "Beden Eğt."],
                    "Cuma": ["Hayat Bil.", "Matematik", "Türkçe", "Türkçe", "Müzik", "Serbest Etk.", "Serbest Etk."]
                }
            },
            /* Nöbetçi öğretmen kadrosu: isimle eşleşen öğretmenin fotoğrafı veya ikonu
               nöbet panosunda otomatik gösterilir. Ad -> {photo, icon} */
            teacherRoster: {},

            /* Öğretmen kadrosunun admin panelindeki gösterim sırası (sürükle-bırak ile
               değiştirilebilir). İçinde olmayan / silinmiş isimler otomatik göz ardı edilir,
               yeni eklenen isimler otomatik olarak sona eklenir. */
            rosterOrder: [],

            /* NÖBET YERLERİ (dinamik): id değerleri, eski aylikNobet kayıtlarıyla (kantin,
               bahce, zemin, kat1, kat2, idareci) uyumlu kalması için bilerek aynı tutulmuştur.
               Kullanıcı dilediği kadar yeni nöbet yeri ekleyip silebilir, sırasını değiştirebilir. */
            dutyPositions: [
                { id: 'idareci', label: 'İdareci',  icon: 'fa-user-tie',       color: '#00b4d8' },
                { id: 'kantin',  label: 'Kantin',    icon: 'fa-cookie-bite',   color: '#ffb703' },
                { id: 'bahce',   label: 'Bahçe',     icon: 'fa-tree',          color: '#38b000' },
                { id: 'zemin',   label: 'Zemin Kat', icon: 'fa-door-open',     color: '#38bdf8' },
                { id: 'kat1',    label: '1. Kat',    icon: 'fa-arrow-up-1-9',  color: '#d90429' },
                { id: 'kat2',    label: '2. Kat',    icon: 'fa-stairs',        color: '#9d4edd' }
            ],

            /* NÖBET KARTI GÖRSEL ÖZELLEŞTİRME AYARLARI */
            dutyStyle: {
                template: 'classic',
                shape: 'rounded',          // rounded | square | oval | card
                nameColorMode: 'auto',     // auto | custom
                nameColor: '#02040a',
                activeBg: {
                    color: '#00b4d8',
                    opacity: 15,           // 0-100
                    highlight: 'left-bar'  // none | border | glow | left-bar | underline
                }
            },

            /* DERS PROGRAMI (PANO) KUTU BİÇİMLENDİRME AYARLARI */
            scheduleBoardStyle: {
                columns: 4,           // Bir satırdaki sınıf kutusu sayısı
                gap: 6,               // Kutular arası boşluk (px)
                align: 'center',      // (Kullanılmıyor - geriye dönük uyumluluk) 
                valign: 'between',    // (Kullanılmıyor - geriye dönük uyumluluk, yerini nameValign/lessonValign aldı)
                nameAlign: 'center',  // Sınıf adı etiketi yazı hizalaması (yatay): left | center | right
                nameValign: 'top',    // Sınıf adı etiketi dikey hizalaması: top | center | bottom
                lessonAlign: 'center',// Ders adı yazı hizalaması (yatay): left | center | right
                lessonValign: 'bottom',// Ders adı dikey hizalaması: top | center | bottom
                boxBg: '',            // Kutu arka plan rengi ('' = varsayılan)
                boxBorderColor: '',   // Kutu kenarlık rengi ('' = varsayılan)
                boxRadius: 6,         // Kutu köşe yuvarlaklığı (px)
                activeBg: '',         // Aktif (o an dersi olan) kutu arka plan rengi
                activeBorderColor: '',// Aktif kutu kenarlık/parlama rengi
                nameBg: '',           // Sınıf adı etiketi arka plan rengi
                nameColor: '',        // Sınıf adı etiketi yazı rengi
                nameFontSize: 12,     // Sınıf adı etiketi yazı boyutu
                nameBold: true,       // Sınıf adı etiketi kalın yazı
                lessonColor: '',      // Ders adı yazı rengi
                lessonFontSize: 12,   // Ders adı yazı boyutu
                lessonBold: true,     // Ders adı kalın yazı
                lessonFont: '',       // Ders adı font ailesi ('' = varsayılan)
                recessColor: ''       // Teneffüs yazısı rengi
            },

            /* SAAT / GERİ SAYIM KUTUSU METİN BİÇİMLENDİRME AYARLARI
               Kutudaki 3 ayrı metin (Tarih, Saat, Geri Sayım) birbirinden
               bağımsız olarak biçimlendirilebilir ve düzenlenebilir. */
            clockStyle: {
                // Tarih satırı (örn: "25.07.2026 | Cumartesi")
                dateShowWeekday: true,   // Gün adını göster
                dateActive: true,        // Satırı göster/gizle
                dateColor: '',           // '' = varsayılan
                dateFontSize: 11,
                dateBold: false,
                dateFont: '',
                dateAlign: 'center',     // left | center | right
                dateValign: 'center',    // top | center | bottom (kendi hücresi içinde dikey)

                // Saat satırı (örn: "14:32:07")
                timeFormat: '24',        // '24' | '12'
                timeShowSeconds: true,
                timeActive: true,
                timeColor: '',
                timeFontSize: 32,
                timeBold: true,
                timeFont: '',
                timeAlign: 'center',
                timeValign: 'center',    // top | center | bottom (kendi hücresi içinde dikey)

                // Geri sayım satırı (ders/teneffüs kalan süre bilgisi)
                countdownActive: true,
                countdownShowSeconds: true,   // Kalan sürede saniyeyi göster/gizle
                countdownLayout: 'inline',    // 'inline' = Etiket ve süre aynı satırda | 'stacked' = alt alta
                countdownInClassLabel: 'Zilin Çalmasına:',
                countdownInClassSuffix: 'kaldı (Derste)',
                countdownInClassColor: '#ef4444',
                countdownBreakLabel: 'Derse Giriş Ziline:',
                countdownBreakSuffix: '(Teneffüs)',
                countdownBreakColor: '#22c55e',
                countdownOutOfHoursText: 'Eğitim Saatleri Dışındasınız',
                countdownColor: '',
                countdownFontSize: 12,
                countdownBold: false,
                countdownFont: '',
                countdownAlign: 'center',
                countdownValign: 'center'   // top | center | bottom (kendi hücresi içinde dikey)
            }
        };

        /* =========================================================================
           YERLEŞİM DÜZENLEYİCİ (LAYOUT ENGINE)
           Pano artık 96 sütun x 64 satırlık serbest (Excel benzeri) bir ızgara
           üzerinde çalışır. Sütun/satır sayısı yüksek olduğu için modüller
           çok daha ince adımlarla (excel hücreleri gibi) istenen yere taşınıp
           istenen boyuta getirilebilir.
           Her modülün konumu/ebadı {c, cs, r, rs, fs, hh, hfs, hcolor} olarak saklanır:
             c  = başlangıç sütunu (1-96)   cs = sütun genişliği (kaç hücre)
             r  = başlangıç satırı (1-64)   rs = satır yüksekliği (kaç hücre)
             fs = yazı boyutu ölçeği (%), varsayılan 100
             hh = modül başlığı yüksekliği (px, opsiyonel)
             hfs = modül başlığı yazı boyutu (px, opsiyonel)
             hcolor = modül başlığı yazı rengi (hex, opsiyonel)
           ========================================================================= */
        const PANO_GRID_COLS = 96;
        const PANO_GRID_ROWS = 64;

        const PANO_MODULE_IDS = ['brand', 'media', 'birthday', 'schedule', 'quote', 'specialday', 'bellhours', 'announcements', 'clock', 'achievements', 'duty', 'marquee'];

        const PANO_MODULE_LABELS = {
            brand: 'Okul Marka Alanı',
            media: 'Görsel Medya',
            birthday: 'Bugün Doğanlar',
            schedule: 'Ders Programı',
            quote: 'Günün Sözü',
            specialday: 'Belirli Gün / Hava',
            bellhours: 'Zil Saatleri',
            announcements: 'Duyurular',
            clock: 'Saat / Geri Sayım',
            achievements: 'Ayın Enleri',
            duty: 'Nöbetçi Öğretmenler',
            marquee: 'Kayan Yazı'
        };

        // Hazır yerleşim şablonları. Her şablon 11 modülün tamamını, boşluk bırakmadan
        // 96x64 ızgara üzerinde konumlandırır (aşağıda 48x32 baz değerler yazılıp
        // otomatik 2 katına ölçeklenir; görünüm aynı, hassasiyet iki kat artmış olur).
        const PANO_LAYOUT_TEMPLATES = {
            klasik: {
                birthday:      { c: 1,  cs: 12, r: 1,  rs: 12, fs: 100 },
                schedule:      { c: 1,  cs: 12, r: 13, rs: 12, fs: 100 },
                clock:         { c: 1,  cs: 12, r: 25, rs: 8,  fs: 100 },
                brand:         { c: 13, cs: 24, r: 1,  rs: 4,  fs: 100 },
                media:         { c: 13, cs: 24, r: 5,  rs: 20, fs: 100 },
                duty:          { c: 13, cs: 24, r: 25, rs: 8,  fs: 100 },
                quote:         { c: 37, cs: 12, r: 1,  rs: 6,  fs: 100 },
                specialday:    { c: 37, cs: 12, r: 7,  rs: 6,  fs: 100 },
                bellhours:     { c: 37, cs: 12, r: 13, rs: 8,  fs: 100 },
                announcements: { c: 37, cs: 12, r: 21, rs: 6,  fs: 100 },
                achievements:  { c: 37, cs: 12, r: 27, rs: 6,  fs: 100 }
            },
            duyuru_odakli: {
                birthday:      { c: 1,  cs: 12, r: 1,  rs: 10, fs: 100 },
                schedule:      { c: 1,  cs: 12, r: 11, rs: 12, fs: 100 },
                clock:         { c: 1,  cs: 12, r: 23, rs: 10, fs: 100 },
                brand:         { c: 13, cs: 24, r: 1,  rs: 4,  fs: 100 },
                media:         { c: 13, cs: 24, r: 5,  rs: 12, fs: 100 },
                duty:          { c: 13, cs: 24, r: 17, rs: 16, fs: 110 },
                quote:         { c: 37, cs: 12, r: 1,  rs: 4,  fs: 90 },
                specialday:    { c: 37, cs: 12, r: 5,  rs: 4,  fs: 90 },
                bellhours:     { c: 37, cs: 12, r: 9,  rs: 6,  fs: 100 },
                announcements: { c: 37, cs: 12, r: 15, rs: 10, fs: 115 },
                achievements:  { c: 37, cs: 12, r: 25, rs: 8,  fs: 100 }
            },
            ders_programi_odakli: {
                birthday:      { c: 1,  cs: 12, r: 1,  rs: 6,  fs: 95 },
                schedule:      { c: 1,  cs: 12, r: 7,  rs: 20, fs: 110 },
                clock:         { c: 1,  cs: 12, r: 27, rs: 6,  fs: 100 },
                brand:         { c: 13, cs: 24, r: 1,  rs: 4,  fs: 100 },
                media:         { c: 13, cs: 24, r: 5,  rs: 18, fs: 100 },
                duty:          { c: 13, cs: 24, r: 23, rs: 10, fs: 100 },
                quote:         { c: 37, cs: 12, r: 1,  rs: 6,  fs: 100 },
                specialday:    { c: 37, cs: 12, r: 7,  rs: 6,  fs: 100 },
                bellhours:     { c: 37, cs: 12, r: 13, rs: 8,  fs: 100 },
                announcements: { c: 37, cs: 12, r: 21, rs: 6,  fs: 100 },
                achievements:  { c: 37, cs: 12, r: 27, rs: 6,  fs: 100 }
            },
            medya_odakli: {
                birthday:      { c: 1,  cs: 12, r: 1,  rs: 10, fs: 100 },
                schedule:      { c: 1,  cs: 12, r: 11, rs: 12, fs: 100 },
                clock:         { c: 1,  cs: 12, r: 23, rs: 10, fs: 100 },
                brand:         { c: 13, cs: 24, r: 1,  rs: 2,  fs: 85 },
                media:         { c: 13, cs: 24, r: 3,  rs: 26, fs: 100 },
                duty:          { c: 13, cs: 24, r: 29, rs: 4,  fs: 85 },
                quote:         { c: 37, cs: 12, r: 1,  rs: 6,  fs: 100 },
                specialday:    { c: 37, cs: 12, r: 7,  rs: 6,  fs: 100 },
                bellhours:     { c: 37, cs: 12, r: 13, rs: 6,  fs: 100 },
                announcements: { c: 37, cs: 12, r: 19, rs: 6,  fs: 100 },
                achievements:  { c: 37, cs: 12, r: 25, rs: 8,  fs: 100 }
            }
        };

        // Yukarıdaki şablonlar 48x32 ızgara baz alınarak yazılmıştır; yeni 96x64
        // ızgaraya (2 katı hassasiyet) otomatik olarak ölçeklenir (görünüm aynı kalır).
        Object.values(PANO_LAYOUT_TEMPLATES).forEach(tpl => {
            Object.keys(tpl).forEach(id => {
                const m = tpl[id];
                m.c = (m.c - 1) * 2 + 1;
                m.r = (m.r - 1) * 2 + 1;
                m.cs = m.cs * 2;
                m.rs = m.rs * 2;
            });
        });

        const PANO_TEMPLATE_LABELS = {
            klasik: { title: 'Klasik', desc: 'Varsayılan dengeli düzen', icon: 'fa-table-columns' },
            duyuru_odakli: { title: 'Duyuru Odaklı', desc: 'Duyurular ve nöbet bilgisi öne çıkar', icon: 'fa-bullhorn' },
            ders_programi_odakli: { title: 'Ders Programı Odaklı', desc: 'Ders programı büyük gösterilir', icon: 'fa-calendar-days' },
            medya_odakli: { title: 'Medya Odaklı', desc: 'Görsel/slayt alanı büyütülür', icon: 'fa-photo-film' }
        };

        // Yerleşik modüller için PANO_MODULE_LABELS'tan, özel modüller için moduleDefs/customModuleDefs
        // içindeki 'label' alanından modül adını döndürür.
        function panoModuleLabel(id) {
            if (PANO_MODULE_LABELS[id]) return PANO_MODULE_LABELS[id];
            const custom = (appConfig.customModuleDefs || []).find(d => d.id === id);
            return (custom && custom.label) || id;
        }

        // Yerleşik + kullanıcı tarafından eklenen özel modüllerin TÜMÜNÜN id listesini döndürür.
        // Yerleşim Düzenleyici, sürükle-bırak ve etiket/tutamaç sistemleri artık bu listeyi kullanır,
        // böylece özel modüller de yerleşik modüller gibi konumlandırılabilir/boyutlandırılabilir.
        function panoAllModuleIds() {
            const customIds = ((typeof appConfig !== 'undefined' && appConfig.customModuleDefs) || [])
                .filter(d => d && d.id)
                .map(d => d.id);
            return PANO_MODULE_IDS.concat(customIds);
        }

        // localStorage'dan gelen eski/eksik bir yerleşimde kayıp modül varsa klasik şablondan tamamlar.
        // Özel modüller için klasik şablonda tanım olmadığından, uygun bir varsayılan konum üretilir.
        // Yeni eklenen "Kayan Yazı" modülü için, hazır şablonlarda henüz yeri
        // tanımlanmadığından, panonun en altında tam genişlikte ince bir bant olarak
        // makul bir varsayılan konum kullanılır (kullanıcı dilerse Yerleşim
        // Düzenleyici'den istediği yere taşıyıp boyutlandırabilir).
        const MARQUEE_DEFAULT_POS = { c: 1, cs: 96, r: 59, rs: 6, fs: 100 };

        function panoFillMissingModules(layout) {
            const merged = { ...layout };
            const fallback = PANO_LAYOUT_TEMPLATES.klasik;
            panoAllModuleIds().forEach((id, idx) => {
                const isBuiltIn = PANO_MODULE_IDS.includes(id);
                const def = fallback[id] || (id === 'marquee' ? MARQUEE_DEFAULT_POS : { c: 1, cs: 24, r: 1 + ((idx * 8) % 56), rs: 8, fs: 100 });
                if (!merged[id]) merged[id] = { ...def };
                else merged[id] = { c: 1, cs: 12, r: 1, rs: 4, fs: 100, ...def, ...merged[id] };
            });
            return merged;
        }

        function panoModuleEl(id) {
            return document.querySelector('.pano-module[data-module="' + id + '"]');
        }

        // Özel (kullanıcı tarafından eklenen) bir modül için panoda gerçek bir kart oluşturur
        // (yoksa). Kart oluşturulunca cardSel/titleSel otomatik olarak bu karta bağlanır,
        // böylece kullanıcının elle CSS seçici girmesine gerek kalmaz.
        function ensureCustomModuleCard(def) {
            if (!def || def.builtIn) return null;
            const grid = document.getElementById('pano-main-dashboard');
            if (!grid) return null;
            let el = document.querySelector('.pano-module[data-module="' + def.id + '"]');
            if (!el) {
                el = document.createElement('div');
                el.className = 'dashboard-card pano-module custom-module-card';
                el.id = 'custom-card-' + def.id;
                el.dataset.module = def.id;
                el.innerHTML = `
                    <div class="card-header" id="display-${def.id}-title"></div>
                    <div class="card-body" id="custom-body-${def.id}" style="padding:8px; white-space:pre-wrap; overflow:auto;"></div>
                `;
                grid.appendChild(el);
            }
            // cardSel/titleSel'i her zaman bu otomatik karta senkronla (kullanıcı elle
            // farklı bir seçici girmediyse); böylece taşınan/yeniden oluşturulan kartlar hep bağlı kalır.
            if (!def.cardSel || def.cardSel.trim() === '' || def.cardSel === ('#' + el.id)) {
                def.cardSel = '#' + el.id;
            }
            if (!def.titleSel) def.titleSel = '#display-' + def.id + '-title';
            def.hasTitle = true;
            return el;
        }

        // Kayıtlı tüm özel modüller için panodaki kartlarının var olduğundan emin olur
        // (sayfa her yüklendiğinde çağrılmalı, çünkü DOM elemanları localStorage'da saklanmaz).
        function ensureAllCustomModuleCards() {
            (appConfig.customModuleDefs || []).forEach(def => ensureCustomModuleCard(def));
            _rebuildModuleDefs();
        }

        // Geçerli yerleşimi (kaydedilmiş halini) döndürür; yoksa klasik şablonu kurar.
        function panoGetLayoutState() {
            if (!appConfig.panoLayout) appConfig.panoLayout = JSON.parse(JSON.stringify(PANO_LAYOUT_TEMPLATES.klasik));
            return appConfig.panoLayout;
        }

        function panoClampLayoutValue(m) {
            m.c = Math.min(Math.max(1, Math.round(m.c)), PANO_GRID_COLS);
            m.r = Math.min(Math.max(1, Math.round(m.r)), PANO_GRID_ROWS);
            m.cs = Math.min(Math.max(1, Math.round(m.cs)), PANO_GRID_COLS - m.c + 1);
            m.rs = Math.min(Math.max(1, Math.round(m.rs)), PANO_GRID_ROWS - m.r + 1);
            m.fs = Math.min(Math.max(40, Math.round(m.fs || 100)), 250);
            if (m.hh) m.hh = Math.min(Math.max(16, Math.round(m.hh)), 120);
            if (m.hfs) m.hfs = Math.min(Math.max(8, Math.round(m.hfs)), 48);
            return m;
        }

        // Yerleşimi gerçek DOM elemanlarına (grid-column/grid-row + yazı ölçeği) uygular.
        function applyPanoLayout(layout) {
            layout = layout || panoGetLayoutState();
            panoAllModuleIds().forEach(id => {
                const el = panoModuleEl(id);
                if (!el) return;
                const m = panoClampLayoutValue({ ...(layout[id] || PANO_LAYOUT_TEMPLATES.klasik[id]) });
                el.style.gridColumn = m.c + ' / span ' + m.cs;
                el.style.gridRow = m.r + ' / span ' + m.rs;
                el.dataset.c = m.c;
                el.dataset.r = m.r;
                el.dataset.cs = m.cs;
                el.dataset.rs = m.rs;
                el.dataset.fs = m.fs;
                const scale = m.fs / 100;
                const header = el.querySelector(':scope > .card-header');
                const body = el.querySelector(':scope > .card-body');
                if (header) {
                    header.style.zoom = scale;
                    header.style.height = m.hh ? (m.hh + 'px') : '';
                    header.style.fontSize = m.hfs ? (m.hfs + 'px') : '';
                    // Not: Modül Ayarları sekmesindeki "Başlık Rengi" (titleColor) ayarını
                    // ezmemek için burada sadece hcolor tanımlıysa uyguluyoruz.
                    if (m.hcolor) header.style.color = m.hcolor;
                }
                if (body) body.style.zoom = scale;
                if (!header && !body) {
                    // card-header/card-body içermeyen modüller (saat kutusu, marka alanı, medya alanı):
                    // etiket/tutamaç dışındaki doğrudan çocuklara ölçek uygula.
                    Array.from(el.children).forEach(child => {
                        if (child.classList.contains('pano-module-label') || child.classList.contains('pano-resize-handle')) return;
                        child.style.zoom = scale;
                    });
                }
            });
        }

        // ============================================================================
        // BULUT SENKRONİZASYONU (Supabase — Veritabanı + Depolama Tabanlı)
        // ----------------------------------------------------------------------------
        // Pano verisi (appConfig) bir Supabase tablosunda (public.pano_config, tek satır,
        // id=1) JSON olarak saklanır; yüklenen fotoğraflar ise Supabase Storage'da
        // ("pano-images" adlı herkese açık bucket) tutulur. Panoyu hangi cihazdan/
        // tarayıcıdan açarsanız açın aynı güncel veriyi ve fotoğrafları görürsünüz.
        //
        // Aşağıdaki SUPABASE_CONFIG.anonKey, GitHub token'ının aksine BİLEREK koda
        // gömülüdür — Supabase'in "anon / public" anahtarı tam olarak bunun için
        // tasarlanmıştır ve tarayıcı kodunda görünmesi güvenlik açığı SAYILMAZ.
        // Gerçek güvenlik, Supabase projesindeki "Row Level Security" (RLS) kurallarıyla
        // sağlanır (bkz. kurulum SQL'i). ⚠ ASLA "service_role" anahtarını buraya
        // yazmayın — o anahtar sunucu yetkisine sahiptir ve gizli kalmalıdır.
        //
        // Kurulum (bir kere, Supabase projenizin SQL Editor'ünde):
        //   1) public.pano_config tablosu + RLS politikaları
        //   2) storage.buckets içinde "pano-images" adlı herkese açık (public) bucket
        //      + storage.objects için RLS politikaları
        //   (Tam SQL script'i ayrıca iletildi.)
        // ============================================================================
        // Not: nnasyar.github.io üzerinde sunucu tarafı proxy ÇALIŞMAZ (GitHub Pages
        // sadece düz dosya sunar) — orada doğrudan Supabase'e bağlanıyoruz. Netlify'da
        // yönlendirme (redirect) yerine fonksiyonun GERÇEK adresini doğrudan
        // kullanıyoruz (daha güvenilir). Diğer platformlarda (Cloudflare gibi)
        // "/supabase-proxy" yolu kullanılır.
        const __host = window.location.hostname;
        const __supabaseUrl = (__host === "nnasyar.github.io")
            ? "https://lvrwponfyvdxvypeewnw.supabase.co"
            : __host.endsWith(".netlify.app")
                ? (window.location.origin + "/.netlify/functions/supabase-proxy")
                : (window.location.origin + "/supabase-proxy");
        const SUPABASE_CONFIG = {
            url: __supabaseUrl,
            anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2cndwb25meXZkeHZ5cGVld253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjM1MDUsImV4cCI6MjEwMDczOTUwNX0.AqsnWHE3nPF_dQ8cxuqBGK_IIyqrK21gLFXgoGrGtls",
            table: "pano_config",
            rowId: 1,
            imagesBucket: "pano-images"
        };

        // Okuma da yazma da SUPABASE_CONFIG dolu olduğu an otomatik aktif olur; token
        // girişine hiç gerek yoktur (GitHub sürümünden farkı budur).
        const CLOUD_SYNC_ENABLED = !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);

        // ============================================================================
        // GERÇEK GİRİŞ (Supabase Auth) — YAZMA işlemleri artık veritabanı seviyesinde
        // (RLS ile) SADECE oturum açmış kullanıcıya izin veriyor. ADMIN_EMAIL gizli
        // DEĞİLDİR (kaynak kodda görünür) — sorun değil, çünkü tek başına giriş
        // yapmaya yetmez. Gerçek gizli bilgi, Supabase panelinde
        // Authentication > Users kısmında SİZİN oluşturduğunuz ŞİFREDİR ve hiçbir
        // yerde (kod, veritabanı) düz metin olarak saklanmaz. Yönetim Paneli'ndeki
        // "Yönetici Şifresi" alanından bu şifreyi değiştirebilirsiniz.
        // ============================================================================
        const ADMIN_EMAIL = "nasyar@cozgen.com";

        // ============================================================================
        // EKRAN GEÇİŞİ (Pano49 ↔ Duyuru Panosu) — panox49 ile duyuru panosu editörü
        // AYNI Supabase projesindeki küçük ve bağımsız "display_control" tablosunu
        // (tek satır, id=1, "active" sütunu "pano" ya da "duyuru") paylaşır. Bu tabloya
        // dokunmak appConfig'i (pano_config tablosu) HİÇ etkilemez — kasıtlı olarak ayrı
        // tutuldu ki bir tarafın ekran geçişi diğer tarafın tüm ayarlarının üzerine
        // yazma riski taşımasın.
        //
        // DUYURU_PANOSU_URL: duyuru panosu HTML dosyasının, bu pano49.html'e göre GÖRECELİ
        // (relative) yolu. İkisini AYNI klasöre/repoya yüklerseniz aşağıdaki varsayılan
        // dosya adı doğrudan çalışır; farklı bir isim/konum kullanırsanız burayı güncelleyin.
        // ============================================================================
        const DISPLAY_CONTROL_TABLE = 'display_control';
        const DUYURU_PANOSU_URL = 'pano99.html';
        let displayControlPollTimer = null;
        let displayControlSwitching = false; // yönlendirme sırasında ikinci bir tetiklenmeyi önler

        function setActiveDisplay(target) {
            if (!supabaseClient) {
                showCustomNotification('Bulut Bağlı Değil', 'Ekran geçişi için Supabase bağlantısı gerekli.');
                return;
            }
            // Hâlâ çağrıldığı tıklamanın ("user gesture") içindeyken gerçek tam ekran
            // senkron olarak istenir (bkz. checkAdminPinCode içindeki AYNI açıklama).
            requestRealFullscreen();
            displayControlSwitching = true;
            supabaseClient
                .from(DISPLAY_CONTROL_TABLE)
                .update({ active: target, updated_at: new Date().toISOString() })
                .eq('id', 1)
                .then(({ error }) => {
                    if (error) {
                        console.warn('Ekran geçişi yazılamadı:', error);
                        showCustomNotification('Hata', 'Ekran geçişi kaydedilemedi: ' + error.message);
                        displayControlSwitching = false;
                        return;
                    }
                    if (target === 'duyuru') {
                        writeCMSLog('Ekran, Duyuru Panosu\'na geçiriliyor...');
                        const sep = DUYURU_PANOSU_URL.includes('?') ? '&' : '?';
                        // ÖNEMLİ: Buradan KASITLI olarak tam ekrandan ÇIKILMIYOR. Chrome/Edge gibi
                        // tarayıcılar, AYNI sekmede aynı origin'e yapılan bir yönlendirmede gerçek
                        // (OS düzeyinde) tam ekran durumunu koruyabiliyor — biz burada elle
                        // exitFullscreen() çağırırsak (önceki sürümde olduğu gibi) tarayıcı
                        // çubuğu geçiş anında görünüp kayboluyor ("yanlış işlem" hissi buradan
                        // geliyordu). Hedef sayfa zaten kendi açılışında/ilk tıklamada tam ekranı
                        // ister (bkz. armFullscreenPersistent) — bu yeterli ve güvenli.
                        window.location.href = DUYURU_PANOSU_URL + sep + 'ekran=1';
                    }
                });
        }

        // Yönetim Paneli başlığındaki "Duyuru Panosuna Geç" düğmesine basılınca çağrılır.
        // Panel zaten PIN/şifre ile açıldığı (oturum zaten doğrulanmış olduğu) için burada
        // tekrar şifre sorulmaz — mevcut "Duyuru Panosunu Ekrana Getir" düğmesiyle aynı
        // yetkilendirmeyi kullanır, sadece daha hızlı erişim için üstte de sunulur.
        // Not: burada KASITLI olarak native confirm() KULLANILMIYOR — tam ekran (kiosk)
        // modunda bazı tarayıcılarda native onay kutuları görünmez/engellenir ve buton
        // "çalışmıyormuş" gibi görünürdü. Doğrudan geçiş yapılır.
        function adminSwitchToDuyuruPanosu() {
            requestRealFullscreen(); // bkz. checkAdminPinCode içindeki AYNI açıklama
            setActiveDisplay('duyuru');
        }

        // Yönetim Paneli başlığındaki "Pano99'u Düzenle" düğmesine basılınca çağrılır.
        // Bu, EKRAN GEÇİŞİ değildir (herkesin gördüğü yayını etkilemez) — sadece
        // Duyuru Panosu'nun İÇERİĞİNİ düzenlemek için pano99.html'i, doğrudan düzenleme
        // arayüzünde (yayın önizlemesi atlanarak) açar. AYNI sekmede yönlendirir (yeni
        // sekme/pencere AÇMAZ) — tam ekran/kiosk modunda window.open() güvenilmez şekilde
        // engellenebiliyor ya da arka planda sessizce açılıp fark edilmeyebiliyordu.
        // Pano49 Yönetim Paneli'ne dönmek için pano99'daki "Pano49'a Dön" düğmesi kullanılır.
        function adminOpenDuyuruPanosuEditor() {
            requestRealFullscreen(); // bkz. checkAdminPinCode içindeki AYNI açıklama
            const sep = DUYURU_PANOSU_URL.includes('?') ? '&' : '?';
            window.location.href = DUYURU_PANOSU_URL + sep + 'duzenle=1';
        }

        // Anında (sayfa açılır açılmaz) ve ardından periyodik olarak kontrol eder;
        // başka bir cihazdan (ör. duyuru panosu üzerinden) "duyuru" seçilmişse bu
        // ekranı da otomatik olarak duyuru panosuna yönlendirir.
        function displayControlCheckOnce() {
            if (!supabaseClient || displayControlSwitching) return;
            const adminPanel = document.getElementById('admin-panel');
            const isAdminOpen = adminPanel && !adminPanel.classList.contains('hidden');
            if (isAdminOpen) return; // aktif düzenlemeyi bozma; panel kapanınca zaten normal akışla tekrar kontrol edilecek
            supabaseClient
                .from(DISPLAY_CONTROL_TABLE)
                .select('active')
                .eq('id', 1)
                .maybeSingle()
                .then(({ data, error }) => {
                    if (error || !data) return;
                    if (data.active === 'duyuru') {
                        displayControlSwitching = true;
                        const sep = DUYURU_PANOSU_URL.includes('?') ? '&' : '?';
                        // (bkz. setActiveDisplay içindeki AYNI açıklama) — kasıtlı olarak
                        // tam ekrandan çıkılmıyor; hedef sayfa zaten tam ekran ister.
                        window.location.href = DUYURU_PANOSU_URL + sep + 'ekran=1';
                    }
                })
                .catch(() => {});
        }

        function displayControlStartPolling() {
            if (!supabaseClient) return;
            if (displayControlPollTimer) clearInterval(displayControlPollTimer);
            displayControlCheckOnce();
            // "Ekran Geçişi Kontrol Sıklığı" pasif ise süreli (periyodik) kontrol
            // KURULMAZ; yalnızca yukarıdaki tek seferlik (sayfa açılışı/yenilemesi
            // anındaki) kontrol yapılır — bir sonraki kontrol için sayfanın manuel
            // yenilenmesi (F5) gerekir.
            if (appConfig && appConfig.displaySwitchPollEnabled === false) return;
            let intervalSec = parseInt(appConfig && appConfig.displaySwitchPollSeconds, 10);
            if (!intervalSec || isNaN(intervalSec)) intervalSec = 5;
            intervalSec = Math.min(300, Math.max(3, intervalSec));
            displayControlPollTimer = setInterval(displayControlCheckOnce, intervalSec * 1000);
        }
        // ============================================================================

        let supabaseClient = null;
        if (CLOUD_SYNC_ENABLED) {
            if (window.supabase && typeof window.supabase.createClient === 'function') {
                supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            } else {
                console.warn('Supabase kütüphanesi yüklenemedi (index.html içindeki <script> etiketini kontrol edin).');
            }
        }

        function cloudWriteEnabled() {
            return !!supabaseClient;
        }

        let cloudWriteTimer = null;
        let cloudPollTimer = null;
        let lastSyncedVersion = 0;

        // Yönetim Paneli açıldığında Bulut Bağlantısı durum metnini günceller.
        function supabaseStatusRefresh() {
            const el = document.getElementById('supabase-status');
            if (!el) return;
            if (!CLOUD_SYNC_ENABLED) {
                el.textContent = '○ SUPABASE_CONFIG (url/anonKey) doldurulmamış';
                el.className = 'text-[10px] text-slate-500';
            } else if (supabaseClient) {
                el.textContent = '● Supabase bağlı — kaydetme/yükleme aktif';
                el.className = 'text-[10px] text-emerald-400';
            } else {
                el.textContent = '✖ Supabase kütüphanesi yüklenemedi';
                el.className = 'text-[10px] text-red-400';
            }
        }

        // Yönetim Paneli > Bulut Bağlantısı kutusundaki "Bağlantıyı Test Et" butonuna bağlıdır.
        // Gerçek bir okuma + yazma denemesi yaparak (data satırını okuyup aynı değerle
        // tekrar yazarak) hem tablonun hem RLS politikalarının doğru kurulduğunu doğrular.
        function testSupabaseConnection() {
            const btn = document.getElementById('supabase-test-connection-btn');
            const resultEl = document.getElementById('supabase-test-result');
            if (!resultEl) return;

            if (!CLOUD_SYNC_ENABLED) {
                resultEl.textContent = '✖ SUPABASE_CONFIG (url/anonKey) doldurulmamış — app.js içinde ayarlanmalı.';
                resultEl.className = 'text-[10px] text-red-400';
                return;
            }
            if (!supabaseClient) {
                resultEl.textContent = '✖ Supabase kütüphanesi yüklenemedi (index.html <script> etiketini kontrol edin).';
                resultEl.className = 'text-[10px] text-red-400';
                return;
            }

            resultEl.textContent = '… Bağlantı test ediliyor';
            resultEl.className = 'text-[10px] text-slate-400';
            if (btn) btn.disabled = true;

            supabaseClient
                .from(SUPABASE_CONFIG.table)
                .select('id, sync_version')
                .eq('id', SUPABASE_CONFIG.rowId)
                .maybeSingle()
                .then(({ data, error }) => {
                    if (error) {
                        throw error;
                    }
                    if (!data) {
                        return { fail: `✖ "${SUPABASE_CONFIG.table}" tablosunda id=${SUPABASE_CONFIG.rowId} satırı yok — kurulum SQL'indeki INSERT adımını çalıştırdınız mı?`, log: 'satır bulunamadı.' };
                    }
                    // Okuma başarılı — şimdi gerçek bir YAZMA testi (upsert) yapılır.
                    return supabaseClient
                        .from(SUPABASE_CONFIG.table)
                        .update({ updated_at: new Date().toISOString() })
                        .eq('id', SUPABASE_CONFIG.rowId)
                        .then(({ error: writeErr }) => {
                            if (writeErr) {
                                return { fail: '⚠ Okuma başarılı ama yazma reddedildi: ' + writeErr.message + ' (RLS "update" politikasını kontrol edin).', log: 'yazma reddedildi: ' + writeErr.message };
                            }
                            return { ok: '✔ Bağlantı başarılı — okuma ve yazma doğrulandı, kaydetme/yükleme aktif.', log: 'okuma+yazma testi başarılı.' };
                        });
                })
                .then(result => {
                    if (btn) btn.disabled = false;
                    if (!result) return;
                    if (result.ok) {
                        resultEl.textContent = result.ok;
                        resultEl.className = 'text-[10px] text-emerald-400';
                    } else {
                        resultEl.textContent = result.fail;
                        resultEl.className = result.fail.startsWith('⚠') ? 'text-[10px] text-amber-400' : 'text-[10px] text-red-400';
                    }
                    if (typeof writeCMSLog === 'function') writeCMSLog('Bağlantı testi: ' + result.log);
                })
                .catch(err => {
                    if (btn) btn.disabled = false;
                    resultEl.textContent = '✖ Hata: ' + (err && err.message ? err.message : err);
                    resultEl.className = 'text-[10px] text-red-400';
                    if (typeof writeCMSLog === 'function') writeCMSLog('Bağlantı testi hatası: ' + (err && err.message ? err.message : err));
                });
        }

        // ============================================================================
        // GÖRSEL DÜZENLEYİCİ (paylaşılan / ortak araç) — Kırpma + Döndürme + Yerleştirme
        // ----------------------------------------------------------------------------
        // Panodaki TÜM görsel yükleme noktaları (logo, nöbetçi kadro fotoğrafı, özel
        // modül görseli, medya slaytı, ayın enleri) bu tek/ortak düzenleyiciden geçer.
        // Kullanıcı seçtiği dosyayı sürükleyerek konumlandırır, yakınlaştırma ve döndürme
        // kaydırıcılarıyla ayarlar, istediği çerçeve oranını (1:1, 4:3, 16:9, 3:4, 2:3)
        // seçer; "Uygula"ya basınca çerçeve içinde görünen kısım GERÇEKTEN kırpılıp
        // (canvas ile) tek bir görsele dönüştürülür — tıpkı Instagram/Google Fotoğraflar
        // tarzı düzenleyiciler gibi (serbest dörtgen sürüklemek yerine, sabit bir çerçeve
        // içinde görseli hareket ettirmek/yakınlaştırmak/döndürmek daha sağlam ve
        // öngörülebilir sonuç verir).
        //
        // Kullanım: openImageEditor(file, {aspect: 1}, function(editedDataUrl) { ... });
        //   editedDataUrl: kullanıcı "Uygula"ya bastıysa kırpılmış/döndürülmüş görsel
        //   (data URL), "İptal"e bastıysa null.
        // ============================================================================
        let ieState = null;

        function openImageEditor(file, opts, onDone) {
            const modal = document.getElementById('image-editor-modal');
            const imgEl = document.getElementById('ie-image');
            if (!modal || !imgEl) { onDone(null); return; }
            const reader = new FileReader();
            reader.onerror = () => onDone(null);
            reader.onload = (e) => {
                const tempImg = new Image();
                tempImg.onerror = () => onDone(null);
                tempImg.onload = () => {
                    ieState = {
                        naturalW: tempImg.width,
                        naturalH: tempImg.height,
                        rotate: 0,
                        offsetX: 0,
                        offsetY: 0,
                        zoomPct: 100,
                        aspect: (opts && opts.aspect) || 1,
                        onDone: onDone
                    };
                    imgEl.src = e.target.result;
                    // Görselin genişlik/yüksekliği SADECE BURADA, BİR KEZ, doğal piksel boyutuna
                    // sabitlenir ve bir daha ASLA değiştirilmez. Yakınlaştırma/sürükleme/döndürme
                    // yalnızca CSS "transform" ile yapılır (bkz. ieRenderTransform) — bu, oranın
                    // hiçbir koşulda (tarayıcı varsayılanları, Tailwind preflight, yuvarlama
                    // hataları vb. dahil) bozulamayacağını YAPISAL olarak garanti eder.
                    imgEl.style.width = tempImg.width + 'px';
                    imgEl.style.height = tempImg.height + 'px';
                    const zoomInput = document.getElementById('ie-zoom');
                    const rotateInput = document.getElementById('ie-rotate');
                    if (zoomInput) zoomInput.value = 100;
                    if (rotateInput) rotateInput.value = 0;
                    document.querySelectorAll('.ie-aspect-btn').forEach(b => {
                        b.classList.toggle('bg-cyan-700', Math.abs(parseFloat(b.dataset.ratio) - ieState.aspect) < 0.01);
                        b.classList.toggle('bg-slate-800', Math.abs(parseFloat(b.dataset.ratio) - ieState.aspect) >= 0.01);
                    });
                    ieUpdateViewportSize();
                    ieFitImageToViewport();
                    ieRenderTransform();
                    modal.classList.remove('hidden');
                };
                tempImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function ieUpdateViewportSize() {
            const viewport = document.getElementById('ie-viewport');
            if (!viewport || !ieState) return;
            const base = 340;
            let w = base, h = base;
            if (ieState.aspect >= 1) { w = base; h = Math.round(base / ieState.aspect); }
            else { h = base; w = Math.round(base * ieState.aspect); }
            viewport.style.width = w + 'px';
            viewport.style.height = h + 'px';
            ieState.viewportW = w;
            ieState.viewportH = h;
        }

        // Görsel, çerçeveyi (küçük kenarından) tam kaplayacak şekilde ölçeklenir (object-fit:cover mantığı)
        function ieFitImageToViewport() {
            if (!ieState) return;
            const scaleW = ieState.viewportW / ieState.naturalW;
            const scaleH = ieState.viewportH / ieState.naturalH;
            ieState.baseScale = Math.max(scaleW, scaleH);
            ieState.offsetX = 0;
            ieState.offsetY = 0;
        }

        // Her pan/zoom/döndürme karesinde SADECE "transform" güncellenir — genişlik/yükseklik
        // (ve dolayısıyla en-boy oranı) openImageEditor() içinde bir kez ayarlandıktan sonra
        // ASLA değişmez. Ölçekleme tek bir "scale(S)" ile (X ve Y eksenine EŞİT oranda)
        // uygulanır; bu, görselin yakınlaştırmada yanlardan sıkışması/esnemesi gibi bir
        // durumu matematiksel olarak imkansız kılar (tıpkı profesyonel fotoğraf düzenleyicilerdeki
        // "pan & zoom" mantığı gibi).
        function ieRenderTransform() {
            if (!ieState) return;
            const imgEl = document.getElementById('ie-image');
            if (!imgEl) return;
            const scale = ieState.baseScale * (ieState.zoomPct / 100);
            // translate(calc(-50% + Xpx), calc(-50% + Ypx)): görselin KENDİ merkezini önce
            // çerçevenin merkezine hizalar (-50%,-50%), ardından kullanıcının sürüklediği
            // offsetX/offsetY kadar EKRAN PİKSELİ cinsinden kaydırır — ikisi TEK bir translate()
            // çağrısında birleştirildiği için herhangi bir kompozisyon belirsizliği yoktur.
            // rotate/scale bu translate'ten SONRA (listede sağda) geldiği için görselin KENDİ
            // merkezi etrafında uygulanır; closeImageEditor() içindeki canvas hesabıyla birebir
            // aynı pivot noktasını kullanır.
            imgEl.style.transform =
                `translate(calc(-50% + ${ieState.offsetX}px), calc(-50% + ${ieState.offsetY}px)) rotate(${ieState.rotate}deg) scale(${scale})`;
        }

        function ieOnZoomChange(val) {
            if (!ieState) return;
            ieState.zoomPct = parseFloat(val) || 100;
            ieRenderTransform();
        }
        function ieOnRotateChange(val) {
            if (!ieState) return;
            ieState.rotate = parseFloat(val) || 0;
            ieRenderTransform();
        }
        function ieRotate90() {
            if (!ieState) return;
            ieState.rotate = ((ieState.rotate + 90 + 180) % 360) - 180;
            const rotateInput = document.getElementById('ie-rotate');
            if (rotateInput) rotateInput.value = ieState.rotate;
            ieRenderTransform();
        }
        function ieSetAspect(ratio, btnEl) {
            if (!ieState) return;
            ieState.aspect = ratio || 1;
            document.querySelectorAll('.ie-aspect-btn').forEach(b => b.classList.remove('bg-cyan-700'));
            if (btnEl) btnEl.classList.add('bg-cyan-700');
            ieUpdateViewportSize();
            ieFitImageToViewport();
            ieRenderTransform();
        }

        // Görseli çerçeve içinde fare/parmakla sürükleyerek konumlandırma (yerleştirme).
        function ieDragStart(x, y) {
            if (!ieState) return;
            ieState.dragging = true;
            ieState.dragStartX = x;
            ieState.dragStartY = y;
            ieState.dragStartOffX = ieState.offsetX;
            ieState.dragStartOffY = ieState.offsetY;
            const viewport = document.getElementById('ie-viewport');
            if (viewport) viewport.style.cursor = 'grabbing';
        }
        function ieDragMove(x, y) {
            if (!ieState || !ieState.dragging) return;
            ieState.offsetX = ieState.dragStartOffX + (x - ieState.dragStartX);
            ieState.offsetY = ieState.dragStartOffY + (y - ieState.dragStartY);
            ieRenderTransform();
        }
        function ieDragEnd() {
            if (!ieState) return;
            ieState.dragging = false;
            const viewport = document.getElementById('ie-viewport');
            if (viewport) viewport.style.cursor = 'grab';
        }
        // Sürükleme olay dinleyicileri sayfa açılışında BİR KEZ bağlanır (modal her açılışta yeniden değil).
        function ieInitDragHandlers() {
            const viewport = document.getElementById('ie-viewport');
            if (!viewport || viewport.dataset.ieBound) return;
            viewport.dataset.ieBound = '1';
            viewport.addEventListener('mousedown', e => { e.preventDefault(); ieDragStart(e.clientX, e.clientY); });
            window.addEventListener('mousemove', e => ieDragMove(e.clientX, e.clientY));
            window.addEventListener('mouseup', ieDragEnd);
            viewport.addEventListener('touchstart', e => { const t = e.touches[0]; ieDragStart(t.clientX, t.clientY); }, { passive: true });
            viewport.addEventListener('touchmove', e => { const t = e.touches[0]; ieDragMove(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
            viewport.addEventListener('touchend', ieDragEnd);
        }

        // "Uygula"ya basıldığında, o an çerçeve içinde GÖRÜNEN kısmı gerçek bir kırpılmış
        // görsele (canvas) dönüştürür ve callback'e data URL olarak döner.
        function closeImageEditor(apply) {
            const modal = document.getElementById('image-editor-modal');
            if (!modal) return;
            if (!apply || !ieState) {
                modal.classList.add('hidden');
                const cb0 = ieState && ieState.onDone;
                ieState = null;
                if (cb0) cb0(null);
                return;
            }
            const outW = 900;
            const outH = Math.round(outW * (ieState.viewportH / ieState.viewportW));
            const canvas = document.createElement('canvas');
            canvas.width = outW;
            canvas.height = outH;
            const ctx = canvas.getContext('2d');
            const imgEl = document.getElementById('ie-image');

            const renderScale = outW / ieState.viewportW;
            const scale = ieState.baseScale * (ieState.zoomPct / 100) * renderScale;
            const cx = (ieState.viewportW / 2 + ieState.offsetX) * renderScale;
            const cy = (ieState.viewportH / 2 + ieState.offsetY) * renderScale;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(ieState.rotate * Math.PI / 180);
            ctx.drawImage(imgEl, -(ieState.naturalW * scale) / 2, -(ieState.naturalH * scale) / 2, ieState.naturalW * scale, ieState.naturalH * scale);
            ctx.restore();

            const resultDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            modal.classList.add('hidden');
            const cb = ieState.onDone;
            ieState = null;
            if (cb) cb(resultDataUrl);
        }

        // Bir data URL'yi, buluta yüklemede kullanılan diğer fonksiyonların (uploadImageFileToCloud
        // vb.) beklediği File nesnesine çevirir.
        function dataUrlToFile(dataUrl, filename) {
            const arr = dataUrl.split(',');
            const mimeMatch = arr[0].match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            return new File([u8arr], filename || 'gorsel.jpg', { type: mime });
        }
        // ============================================================================

        // ── ÇERÇEVE STİLİ (saydamlık / kenarlık kalınlığı / en-boy oranı) ──────────────
        // Kırpma/döndürmeden BAĞIMSIZ, panoda gösterim anında uygulanan görünüm ayarı.
        // el: görselin KENDİSİ (img) ya da onu saran çerçeve (wrapper) elementi olabilir.
        // cfg: {opacity: 0-100, borderWidth: px, borderColor: hex, ratio: 'auto'|'1/1'|'4/3'|'16/9'|'3/4'|'2/3'}
        function applyImageFrameStyle(el, cfg) {
            if (!el) return;
            const c = Object.assign({ opacity: 100, borderWidth: 0, borderColor: '#00b4d8', ratio: 'auto' }, cfg || {});
            el.style.opacity = (typeof c.opacity === 'number' ? c.opacity : 100) / 100;
            const bw = parseFloat(c.borderWidth) || 0;
            el.style.borderWidth = bw + 'px';
            el.style.borderStyle = bw > 0 ? 'solid' : 'none';
            el.style.borderColor = c.borderColor || '#00b4d8';
            el.style.aspectRatio = (c.ratio && c.ratio !== 'auto') ? c.ratio.replace('/', ' / ') : '';
        }

        // applyImageFrameStyle'ın aynısı ama doğrudan bir DOM elementi yerine, HTML şablonu
        // (template string) içine gömülecek bir "style" metni üretir (ör. getRosterAvatarHtml).
        function imageFrameStyleString(cfg) {
            const c = Object.assign({ opacity: 100, borderWidth: 0, borderColor: '#00b4d8', ratio: 'auto' }, cfg || {});
            const bw = parseFloat(c.borderWidth) || 0;
            const ratioCss = (c.ratio && c.ratio !== 'auto') ? `aspect-ratio:${c.ratio.replace('/', ' / ')};` : '';
            return `opacity:${(typeof c.opacity === 'number' ? c.opacity : 100) / 100};border-width:${bw}px;border-style:${bw > 0 ? 'solid' : 'none'};border-color:${c.borderColor || '#00b4d8'};${ratioCss}`;
        }

        // Bir "çerçeve ayarları" mini panelinin (saydamlık + kalınlık + oran) HTML'ini
        // üretir. idPrefix: bu kontrollerin id'lerinde kullanılacak benzersiz ön ek.
        function frameControlsHtml(idPrefix, cfg) {
            const c = Object.assign({ opacity: 100, borderWidth: 0, borderColor: '#00b4d8', ratio: 'auto' }, cfg || {});
            const ratios = [['auto', 'Serbest'], ['1/1', '1:1'], ['4/3', '4:3'], ['16/9', '16:9'], ['3/4', '3:4'], ['2/3', '2:3']];
            return `
                <div class="grid grid-cols-3 gap-3 bg-slate-900/60 border border-slate-800 rounded-lg p-3">
                    <div>
                        <label class="text-[10px] text-slate-500 block mb-1">Saydamlık: <span id="${idPrefix}-opacity-val">${c.opacity}</span>%</label>
                        <input type="range" id="${idPrefix}-opacity" min="10" max="100" value="${c.opacity}" oninput="document.getElementById('${idPrefix}-opacity-val').innerText=this.value; frameControlsOnChange('${idPrefix}')" class="w-full accent-cyan-500">
                    </div>
                    <div>
                        <label class="text-[10px] text-slate-500 block mb-1">Kalınlık: <span id="${idPrefix}-border-val">${c.borderWidth}</span>px</label>
                        <div class="flex items-center gap-1.5">
                            <input type="range" id="${idPrefix}-border" min="0" max="10" value="${c.borderWidth}" oninput="document.getElementById('${idPrefix}-border-val').innerText=this.value; frameControlsOnChange('${idPrefix}')" class="w-full accent-cyan-500">
                            <input type="color" id="${idPrefix}-border-color" value="${c.borderColor}" oninput="frameControlsOnChange('${idPrefix}')" class="w-7 h-7 bg-slate-900 border border-slate-800 rounded cursor-pointer shrink-0">
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] text-slate-500 block mb-1">Çerçeve Oranı</label>
                        <select id="${idPrefix}-ratio" onchange="frameControlsOnChange('${idPrefix}')" class="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1.5 text-[10px] text-slate-200">
                            ${ratios.map(r => `<option value="${r[0]}" ${c.ratio === r[0] ? 'selected' : ''}>${r[1]}</option>`).join('')}
                        </select>
                    </div>
                </div>`;
        }

        // frameControlsHtml ile üretilen kontrollerden güncel değerleri okur.
        function readFrameControls(idPrefix) {
            const opacityEl = document.getElementById(`${idPrefix}-opacity`);
            const borderEl = document.getElementById(`${idPrefix}-border`);
            const colorEl = document.getElementById(`${idPrefix}-border-color`);
            const ratioEl = document.getElementById(`${idPrefix}-ratio`);
            if (!opacityEl || !borderEl || !colorEl || !ratioEl) return null;
            return {
                opacity: parseInt(opacityEl.value, 10) || 100,
                borderWidth: parseInt(borderEl.value, 10) || 0,
                borderColor: colorEl.value,
                ratio: ratioEl.value
            };
        }

        // idPrefix -> hangi appConfig alanına ve hangi canlı önizleme fonksiyonuna
        // bağlanacağının haritası. Yeni bir çerçeve kontrolü eklerken sadece bu haritaya
        // bir satır eklemeniz yeterlidir.
        const FRAME_CONTROL_MAP = {
            'logo-frame': { configKey: 'logoFrame', apply: () => renderPanoData() },
            'roster-frame': { configKey: 'rosterPhotoFrame', apply: () => { renderActiveDuties(); renderRosterList(); } }
        };
        function frameControlsOnChange(idPrefix) {
            const map = FRAME_CONTROL_MAP[idPrefix];
            const values = readFrameControls(idPrefix);
            if (!map || !values) return;
            appConfig[map.configKey] = values;
            map.apply();
            panoPersist();
        }

        // ── GÖRSEL OYNATMA LİSTESİ ALTYAZI STİLİ ───────────────────────────────────────
        // Hazır şablonlar: her biri, tüm alanları tek tıkla makul bir görünüme ayarlar;
        // kullanıcı sonrasında istediği tekil alanı yine de değiştirebilir.
        const MEDIA_CAPTION_TEMPLATES = {
            classic: { bgColor: "#02040a", bgOpacity: 85, textColor: "#cbd5e1", fontFamily: "'Rajdhani', sans-serif", fontSize: 14, fontWeight: 500, textAlign: "center", widthPct: 100, heightMode: "auto", heightPct: 20, padding: 8, borderColor: "#00b4d8", borderWidth: 0, cornerRadius: 0, shadow: "none", position: "bottom", posXPct: 50, posYPct: 90 },
            glass: { bgColor: "#0d1b35", bgOpacity: 35, textColor: "#ffffff", fontFamily: "'Rajdhani', sans-serif", fontSize: 15, fontWeight: 600, textAlign: "center", widthPct: 88, heightMode: "auto", heightPct: 20, padding: 12, borderColor: "#ffffff", borderWidth: 1, cornerRadius: 14, shadow: "soft", position: "bottom", posXPct: 50, posYPct: 88 },
            banner: { bgColor: "#00b4d8", bgOpacity: 100, textColor: "#02040a", fontFamily: "'Rajdhani', sans-serif", fontSize: 16, fontWeight: 800, textAlign: "center", widthPct: 100, heightMode: "auto", heightPct: 20, padding: 10, borderColor: "#00b4d8", borderWidth: 0, cornerRadius: 0, shadow: "none", position: "top", posXPct: 50, posYPct: 10 },
            outline: { bgColor: "#000000", bgOpacity: 15, textColor: "#ffffff", fontFamily: "'Rajdhani', sans-serif", fontSize: 14, fontWeight: 600, textAlign: "center", widthPct: 80, heightMode: "auto", heightPct: 20, padding: 10, borderColor: "#00b4d8", borderWidth: 2, cornerRadius: 10, shadow: "strong", position: "free", posXPct: 50, posYPct: 92 }
        };

        // appConfig.mediaCaptionStyle ayarlarını panodaki gerçek altyazı elementine uygular.
        // Elementin kendisi doğrudan güncellendiği için Yönetim Paneli açıkken bile arkadaki
        // pano canlı olarak değişikliği anında gösterir (ekstra bir "önizleme" kopyasına gerek yok).
        function applyMediaCaptionStyle() {
            const el = document.getElementById('display-media-caption');
            if (!el) return;
            const c = Object.assign({}, defaultAppConfig.mediaCaptionStyle, appConfig.mediaCaptionStyle || {});

            el.style.background = hexToRgba(c.bgColor, (parseInt(c.bgOpacity, 10) || 0) / 100);
            el.style.color = c.textColor;
            el.style.fontFamily = c.fontFamily;
            el.style.fontSize = (parseInt(c.fontSize, 10) || 14) + 'px';
            el.style.fontWeight = c.fontWeight;
            el.style.textAlign = c.textAlign;
            el.style.padding = (parseInt(c.padding, 10) || 0) + 'px';
            el.style.borderRadius = (parseInt(c.cornerRadius, 10) || 0) + 'px';
            const bw = parseInt(c.borderWidth, 10) || 0;
            el.style.borderStyle = bw > 0 ? 'solid' : 'none';
            el.style.borderWidth = bw + 'px';
            el.style.borderColor = c.borderColor;
            el.style.borderTop = ''; // .media-caption CSS sınıfındaki eski üst-kenarlığı geçersiz kılar
            el.style.boxShadow = c.shadow === 'strong' ? '0 6px 24px rgba(0,0,0,0.6)' : (c.shadow === 'soft' ? '0 2px 12px rgba(0,0,0,0.35)' : 'none');
            el.style.boxSizing = 'border-box';
            el.style.margin = '0';

            // Konum: taşıyıcı (.media-slider) zaten position:relative, overflow:hidden.
            el.style.top = el.style.bottom = el.style.left = el.style.right = 'auto';
            el.style.transform = '';
            const heightCss = c.heightMode === 'fixed' ? (parseInt(c.heightPct, 10) || 20) + '%' : 'auto';
            el.style.height = heightCss;
            const widthPct = parseInt(c.widthPct, 10) || 100;

            if (c.position === 'top' || c.position === 'bottom') {
                el.style.width = widthPct + '%';
                el.style.left = '50%';
                el.style.transform = 'translateX(-50%)';
                if (c.position === 'top') el.style.top = '0'; else el.style.bottom = '0';
            } else if (c.position === 'left' || c.position === 'right') {
                el.style.width = widthPct + '%';
                el.style.top = '0';
                el.style.height = c.heightMode === 'fixed' ? heightCss : '100%';
                if (c.position === 'left') el.style.left = '0'; else el.style.right = '0';
            } else { // "free": posXPct/posYPct, kutunun MERKEZİ o noktaya gelecek şekilde
                el.style.width = widthPct + '%';
                el.style.left = (parseInt(c.posXPct, 10) || 50) + '%';
                el.style.top = (parseInt(c.posYPct, 10) || 90) + '%';
                el.style.transform = 'translate(-50%, -50%)';
            }
        }

        // Bir hazır şablonu appConfig.mediaCaptionStyle üzerine uygular, admin formundaki
        // tüm alanları günceller, panoda anında gösterir ve kaydeder.
        function applyMediaCaptionTemplate(name) {
            const preset = MEDIA_CAPTION_TEMPLATES[name];
            if (!preset) return;
            appConfig.mediaCaptionStyle = Object.assign({ template: name }, preset);
            renderMediaCaptionStyleForm();
            applyMediaCaptionStyle();
            panoPersist();
        }

        // Tek bir alanı günceller (kaydırıcı/renk/seçim değiştiğinde admin formundan çağrılır).
        function mediaCaptionStyleOnChange(field, value) {
            if (!appConfig.mediaCaptionStyle) appConfig.mediaCaptionStyle = Object.assign({}, defaultAppConfig.mediaCaptionStyle);
            appConfig.mediaCaptionStyle[field] = value;
            appConfig.mediaCaptionStyle.template = 'custom';
            applyMediaCaptionStyle();
            panoPersist();
        }

        // Admin formundaki tüm giriş elemanlarını (id'leri "mcs-" ile başlar) güncel
        // appConfig.mediaCaptionStyle değerleriyle senkronlar (panel açılışında ve şablon
        // uygulandığında çağrılır).
        function renderMediaCaptionStyleForm() {
            const c = Object.assign({}, defaultAppConfig.mediaCaptionStyle, appConfig.mediaCaptionStyle || {});
            const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
            setVal('mcs-bgcolor', c.bgColor);
            setVal('mcs-bgopacity', c.bgOpacity); setTxt('mcs-bgopacity-val', c.bgOpacity);
            setVal('mcs-textcolor', c.textColor);
            setVal('mcs-font', c.fontFamily);
            setVal('mcs-fontsize', c.fontSize); setTxt('mcs-fontsize-val', c.fontSize);
            setVal('mcs-fontweight', c.fontWeight);
            setVal('mcs-align', c.textAlign);
            setVal('mcs-widthpct', c.widthPct); setTxt('mcs-widthpct-val', c.widthPct);
            setVal('mcs-heightmode', c.heightMode);
            setVal('mcs-heightpct', c.heightPct); setTxt('mcs-heightpct-val', c.heightPct);
            setVal('mcs-padding', c.padding); setTxt('mcs-padding-val', c.padding);
            setVal('mcs-bordercolor', c.borderColor);
            setVal('mcs-borderwidth', c.borderWidth); setTxt('mcs-borderwidth-val', c.borderWidth);
            setVal('mcs-radius', c.cornerRadius); setTxt('mcs-radius-val', c.cornerRadius);
            setVal('mcs-shadow', c.shadow);
            setVal('mcs-position', c.position);
            setVal('mcs-posx', c.posXPct); setTxt('mcs-posx-val', c.posXPct);
            setVal('mcs-posy', c.posYPct); setTxt('mcs-posy-val', c.posYPct);
            const freeRow = document.getElementById('mcs-free-position-row');
            if (freeRow) freeRow.classList.toggle('hidden', c.position !== 'free');
            const heightPctRow = document.getElementById('mcs-heightpct-row');
            if (heightPctRow) heightPctRow.classList.toggle('hidden', c.heightMode !== 'fixed');
        }

        // Büyük/orijinal boyutlu fotoğrafları hem hızlı yüklenmesi hem de depo şişmemesi için
        // tarayıcıda (canvas ile) küçültüp sıkıştırır, base64 Data URL olarak döner.
        function resizeImageFile(file, maxDim, quality) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = () => reject(new Error('Dosya okunamadı'));
                reader.onload = () => {
                    const img = new Image();
                    img.onerror = () => reject(new Error('Görsel yüklenemedi'));
                    img.onload = () => {
                        let width = img.width, height = img.height;
                        if (width > maxDim || height > maxDim) {
                            const scale = maxDim / Math.max(width, height);
                            width = Math.round(width * scale);
                            height = Math.round(height * scale);
                        }
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        const mime = (file.type === 'image/png') ? 'image/png' : 'image/jpeg';
                        resolve(canvas.toDataURL(mime, quality));
                    };
                    img.src = reader.result;
                };
                reader.readAsDataURL(file);
            });
        }

        // FOTOĞRAF YÜKLEME (Supabase Storage): Görsel dosyası önce küçültülüp sıkıştırılır,
        // sonra "pano-images" bucket'ına yüklenir; appConfig içinde ise sadece görselin
        // herkese açık (public) URL'si (küçük bir metin) saklanır. Supabase bağlantısı
        // kurulmamışsa veya yükleme başarısız olursa null döner ve çağıran taraf eskisi
        // gibi base64'ü (sadece bu cihazda) kullanmaya devam eder.
        function uploadImageFileToCloud(file, folderHint) {
            if (!file) return Promise.resolve(null);
            if (!supabaseClient) {
                if (CLOUD_SYNC_ENABLED && typeof writeCMSLog === 'function') {
                    writeCMSLog('⚠ Fotoğraf buluta yüklenemedi: Supabase bağlantısı kurulamadı. Görsel sadece bu cihazda saklanacak.');
                }
                return Promise.resolve(null);
            }
            return resizeImageFile(file, 1600, 0.82).then(dataUrl => {
                const ext = (file.type && file.type.indexOf('png') !== -1) ? 'png' : 'jpg';
                const safeName = (file.name || 'gorsel').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_');
                const path = `${folderHint}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}.${ext}`;
                return fetch(dataUrl).then(r => r.blob()).then(blob => {
                    return supabaseClient.storage
                        .from(SUPABASE_CONFIG.imagesBucket)
                        .upload(path, blob, { contentType: blob.type, upsert: true, cacheControl: '3600' })
                        .then(({ error }) => {
                            if (error) throw error;
                            const { data: pub } = supabaseClient.storage
                                .from(SUPABASE_CONFIG.imagesBucket)
                                .getPublicUrl(path);
                            return pub && pub.publicUrl ? pub.publicUrl : null;
                        });
                });
            }).catch(err => {
                console.warn('Görsel buluta yüklenemedi, sadece bu cihazda (base64) saklanacak:', err);
                if (typeof writeCMSLog === 'function') writeCMSLog('⚠ Görsel buluta yüklenemedi: ' + (err && err.message ? err.message : err));
                return null;
            });
        }

        // Sayfa açılışında ÖNCE yereldeki (localStorage) veriyle ANINDA çizim yapılır
        // (hızlı, çevrimdışı da çalışır). Ardından buluttaki (Supabase'teki) kayıt daha
        // güncelse (örn. başka bir cihazdan yapılan bir değişiklik varsa) arka planda
        // indirilip sayfa otomatik tazelenir; böylece her cihaz aynı güncel veriyi gösterir.
        //
        // NOT: Karşılaştırma tüm JSON metnini birebir eşitlemek yerine __syncVersion adlı
        // artan bir sayaçla (aynı zamanda tabloda ayrı bir sütun olan sync_version ile)
        // yapılır. Ham JSON metni karşılaştırması, uygulama içindeki otomatik veri
        // normalleştirme/varsayılan tamamlama adımları yüzünden (anahtar sırası veya
        // eksik alanların doldurulması gibi) içerik aynı olsa bile farklı string
        // üretebiliyordu; bu da gereksiz yere sürekli yenileme döngüsüne yol açıyordu.
        function cloudSyncPullOnce() {
            if (!supabaseClient) return;
            supabaseClient
                .from(SUPABASE_CONFIG.table)
                .select('data, sync_version')
                .eq('id', SUPABASE_CONFIG.rowId)
                .maybeSingle()
                .then(({ data, error }) => {
                    if (error) {
                        console.warn('Bulut senkronizasyonu okunamadı (çevrimdışı olabilir, yerel veriyle devam ediliyor):', error);
                        return;
                    }
                    if (!data || !data.data) {
                        // Depoda henüz hiç kayıt yok (ilk kurulum) — mevcut yerel veriyi buluta yükle.
                        cloudPushNow();
                        return;
                    }
                    const cloudVersion = data.sync_version || 0;
                    const localVersion = appConfig.__syncVersion || 0;
                    lastSyncedVersion = cloudVersion;
                    if (cloudVersion > localVersion) {
                        localStorage.setItem('okulPanoDataV8', JSON.stringify(data.data));
                        location.reload();
                    }
                    // cloudVersion <= localVersion: yereldeki veri buluttakiyle aynı ya da daha
                    // yeni (henüz gönderilmemiş bir kaydımız olabilir) — dokunma, yeniden yükleme.
                });
        }

        // Supabase'te Firestore'daki gibi anlık dinleme (Realtime) mevcuttur, ama en sağlam/
        // basit yöntem olarak burada da (GitHub sürümündeki gibi) belirli aralıklarla
        // (varsayılan 20 sn) tablo kontrol edilir (yoklama/polling). Başka bir cihazdan
        // değişiklik geldiyse ve Yönetim Paneli o an açık DEĞİLSE, panoyu otomatik tazeler.
        // Panel açıksa aktif düzenlemeyi bozmamak için dokunulmaz; localStorage zaten
        // güncellenmiştir, panel kapatılınca doğal akışta yeni veriyle devam eder.
        // Başka bir cihazdan/tarayıcıdan yapılan güncelleme algılandığında ekranda
        // kısa süreli bir bildirim gösterir. Mesaj metni appConfig.refreshMessage'dan
        // (Yönetim Paneli > Bulut Bağlantısı bölümünden ayarlanabilir) okunur.
        // - Yönetim Paneli KAPALIYSA (ekran/kiosk modu): mesaj kısaca gösterilir,
        //   ardından sayfa otomatik yenilenir.
        // - Yönetim Paneli AÇIKSA: aktif düzenlemeyi bozmamak için otomatik
        //   yenilenmez; tıklanabilir bir bildirim gösterilir, kullanıcı isterse
        //   tıklayıp güncel veriyi yükler.
        function panoShowUpdateNotice(autoReload) {
            const msg = (appConfig && appConfig.refreshMessage) ? appConfig.refreshMessage : 'Panoda güncelleme var, yenileniyor...';
            const existing = document.getElementById('pano-cloud-update-toast');
            if (existing) existing.remove();
            const el = document.createElement('div');
            el.id = 'pano-cloud-update-toast';
            el.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:#0f3460;color:#fff;padding:10px 18px;border-radius:8px;font-size:.85rem;z-index:100000;box-shadow:0 6px 20px rgba(0,0,0,.4);display:flex;align-items:center;gap:8px;font-family:inherit;' + (autoReload ? '' : 'cursor:pointer;');
            el.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> <span></span>';
            el.querySelector('span').textContent = msg + (autoReload ? '' : ' — yenilemek için tıklayın');
            if (!autoReload) el.onclick = () => location.reload();
            document.body.appendChild(el);
            if (autoReload) setTimeout(() => location.reload(), 1200);
        }

        function cloudSyncStartListening() {
            if (!supabaseClient) return;
            if (cloudPollTimer) clearInterval(cloudPollTimer);
            // "Veri Kontrol Sıklığı" pasif ise süreli (periyodik) bulut yoklaması hiç
            // KURULMAZ; güncellemeler yalnızca sayfa manuel yenilendiğinde (F5 / kiosk
            // yeniden başlatıldığında, açılıştaki normal veri yüklemesiyle) görülür.
            if (appConfig && appConfig.pollIntervalEnabled === false) return;
            // Süre appConfig.pollIntervalSeconds'tan okunur (Yönetim Paneli'nden
            // ayarlanabilir); 5-300sn aralığında sınırlanır, güvenlik için.
            let intervalSec = parseInt(appConfig && appConfig.pollIntervalSeconds, 10);
            if (!intervalSec || isNaN(intervalSec)) intervalSec = 15;
            intervalSec = Math.min(300, Math.max(5, intervalSec));
            cloudPollTimer = setInterval(() => {
                supabaseClient
                    .from(SUPABASE_CONFIG.table)
                    .select('data, sync_version')
                    .eq('id', SUPABASE_CONFIG.rowId)
                    .maybeSingle()
                    .then(({ data, error }) => {
                        if (error || !data || !data.data) return;
                        const cloudVersion = data.sync_version || 0;
                        if (cloudVersion <= lastSyncedVersion) return; // yeni bir değişiklik yok (ya da kendi yazdığımız — yankı)
                        lastSyncedVersion = cloudVersion;
                        localStorage.setItem('okulPanoDataV8', JSON.stringify(data.data));
                        const adminPanel = document.getElementById('admin-panel');
                        const isAdminOpen = adminPanel && !adminPanel.classList.contains('hidden');
                        // "Canlı Düzenle" (modül sürükle/boyutlandır) modu admin-panel'i KAPATIP
                        // doğrudan tuvalin üzerinde çalışır — bu yüzden sadece admin-panel'in
                        // görünürlüğüne bakmak yetmez; panoEditActive true iken de OTOMATİK
                        // yenileme YAPILMAMALI, yoksa kullanıcı modül sürüklerken ekran birden
                        // yenilenip onu düzenleme ekranından atar.
                        const isEditingNow = isAdminOpen || (typeof panoEditActive !== 'undefined' && panoEditActive);
                        panoShowUpdateNotice(!isEditingNow);
                    })
                    .catch(err => {
                        console.warn('Bulut yoklaması hata verdi:', err);
                    });
            }, intervalSec * 1000);
        }

        // Yerel bir kayıt (panoPersist) yapıldığında bulut kopyasını gecikmeli (debounce)
        // olarak günceller; art arda hızlı değişikliklerde (ör. renk seçici sürüklenirken)
        // her karede değil, kullanıcı durduktan ~1.5sn sonra tek seferde (tek upsert) yazılır.
        function cloudPushDebounced() {
            if (!cloudWriteEnabled()) return;
            clearTimeout(cloudWriteTimer);
            cloudWriteTimer = setTimeout(cloudPushNow, 1500);
        }

        // Buluta YAZAR (Supabase upsert). GitHub sürümündeki sha/409-çakışma mantığına
        // gerek yoktur; Supabase tarafında id=1 satırı tek bir "upsert" ile güncellenir.
        // "onDone" verilirse (ör. Yayınla butonu) işlem bitince (error, error) ile çağrılır.
        function cloudPushNow(onDone) {
            if (!cloudWriteEnabled()) {
                if (CLOUD_SYNC_ENABLED && typeof writeCMSLog === 'function') {
                    writeCMSLog('⚠ Bulut kaydı yapılamadı: Supabase bağlantısı kurulamadı. Veri sadece bu cihazda kaydedildi.');
                }
                if (typeof onDone === 'function') onDone('Supabase bağlantısı kurulamadı');
                return;
            }
            const versionToSend = appConfig.__syncVersion || 0;
            lastSyncedVersion = versionToSend;
            supabaseClient
                .from(SUPABASE_CONFIG.table)
                .upsert({
                    id: SUPABASE_CONFIG.rowId,
                    data: appConfig,
                    sync_version: versionToSend,
                    updated_at: new Date().toISOString()
                })
                .then(({ error }) => {
                    if (error) {
                        console.warn('Bulut kaydı başarısız oldu (yerel kayıt zaten yapıldı, bir sonraki değişiklikte tekrar denenecek):', error);
                        if (typeof writeCMSLog === 'function') {
                            writeCMSLog('⚠ Bulut senkronizasyonu başarısız: ' + error.message + ' — veri sadece bu cihazda kaydedildi.');
                        }
                    }
                    if (typeof onDone === 'function') onDone(error ? (error.message || 'Bilinmeyen hata') : null);
                });
        }
        // ============================================================================

        // "Şimdi Yayınla" — Yönetim Paneli'ndeki formdaki tüm değişiklikleri kaydeder
        // ve (1.5sn'lik normal gecikmeyi BEKLEMEDEN) hemen buluta gönderir; böylece
        // diğer tüm cihazlar/tarayıcılar en fazla ~20sn içinde (kendi yoklama
        // döngülerinde) değişikliği görür. İşlem bitince yönetici ekranında açık
        // bir onay (toast) gösterilir.
        function publishNow() {
            saveAdminChanges();
            clearTimeout(cloudWriteTimer);
            cloudPushNow((errMsg) => {
                if (errMsg) {
                    if (typeof writeCMSLog === 'function') writeCMSLog('⚠ Yayınlama başarısız: ' + errMsg);
                    alert('Yayınlama başarısız oldu: ' + errMsg + '\nVeri bu cihazda kaydedildi, bir sonraki denemede tekrar gönderilecek.');
                } else {
                    if (typeof writeCMSLog === 'function') writeCMSLog('✔ Yayınlandı — değişiklikler buluta gönderildi.');
                    if (typeof panoShowPublishConfirmation === 'function') panoShowPublishConfirmation();
                }
            });
        }

        // Yönetici ekranında kısa süreli "Yayınlandı!" onayı gösterir.
        function panoShowPublishConfirmation() {
            const existing = document.getElementById('pano-publish-confirm-toast');
            if (existing) existing.remove();
            const el = document.createElement('div');
            el.id = 'pano-publish-confirm-toast';
            el.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#059669;color:#fff;padding:10px 18px;border-radius:8px;font-size:.85rem;z-index:100000;box-shadow:0 6px 20px rgba(0,0,0,.4);display:flex;align-items:center;gap:8px;font-family:inherit;';
            el.innerHTML = '<i class="fa-solid fa-circle-check"></i> Yayınlandı! Tüm cihazlara gönderildi.';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3000);
        }

        // "Ekranları Şimdi Yenile" — içerikte bir değişiklik olmasa bile, TV/kiosk
        // ekranlarını buradan uzaktan yenilemek için kullanılır (ör. ekran takıldıysa,
        // ya da sadece emin olmak için). Kaydedilmiş mevcut veriyi değiştirmeden
        // sadece sürüm sayacını artırıp anında buluta gönderir; bu da diğer tüm
        // cihazların bir sonraki yoklamasında (pollIntervalSeconds) sayfayı
        // yenilemesini tetikler.
        function forceRefreshDisplays() {
            panoPersist();
            clearTimeout(cloudWriteTimer);
            cloudPushNow((errMsg) => {
                if (errMsg) {
                    alert('Ekranları yenileme sinyali gönderilemedi: ' + errMsg);
                } else {
                    const existing = document.getElementById('pano-refresh-confirm-toast');
                    if (existing) existing.remove();
                    const el = document.createElement('div');
                    el.id = 'pano-refresh-confirm-toast';
                    el.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#0891b2;color:#fff;padding:10px 18px;border-radius:8px;font-size:.85rem;z-index:100000;box-shadow:0 6px 20px rgba(0,0,0,.4);display:flex;align-items:center;gap:8px;font-family:inherit;';
                    el.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Sinyal gönderildi — ekranlar en geç ' + (appConfig.pollIntervalSeconds || 15) + ' sn içinde yenilenecek.';
                    document.body.appendChild(el);
                    setTimeout(() => el.remove(), 3500);
                }
            });
        }


        // Yerel (localStorage) kalıcı kayıt + (varsa) bulut senkronizasyonu.
        // Tüm "kaydet" işlemleri bu tek fonksiyon üzerinden geçer. Her çağrıda __syncVersion
        // bir artırılır; bulut karşılaştırmaları ham JSON metni yerine bu sayaca bakar.
        function panoPersist() {
            appConfig.__syncVersion = (appConfig.__syncVersion || 0) + 1;
            localStorage.setItem('okulPanoDataV8', JSON.stringify(appConfig));
            cloudPushDebounced();
        }

        // Modüllerin üzerine etiket ve boyutlandırma tutamacı ekler (bir kere çalışır).
        function panoSetupOverlays() {
            panoAllModuleIds().forEach(id => {
                const el = panoModuleEl(id);
                if (!el || el.querySelector('.pano-resize-handle')) return;
                const label = document.createElement('div');
                label.className = 'pano-module-label';
                label.textContent = panoModuleLabel(id);
                const handle = document.createElement('div');
                handle.className = 'pano-resize-handle';
                handle.dataset.moduleId = id;
                el.appendChild(label);
                el.appendChild(handle);
            });
        }

        function panoInitLayout() {
            panoSetupOverlays();
            applyPanoLayout(panoGetLayoutState());
        }

        /* ================== CANLI SÜRÜKLE / BOYUTLANDIR DÜZENLEME MODU ================== */
        let panoEditActive = false;
        let panoEditWorkingLayout = null;   // düzenleme başlarken alınan çalışma kopyası
        let panoEditBeforeSnapshot = null;  // vazgeç için orijinal (girişteki) durum
        let panoEditSelectedModule = null;
        let panoDragState = null; // {type:'move'|'resize', moduleId, startX, startY, orig:{c,r,cs,rs}, cellW, cellH}

        function panoGridEl() {
            return document.getElementById('pano-main-dashboard');
        }

        function panoCellSize() {
            const grid = panoGridEl();
            const rect = grid.getBoundingClientRect();
            const styles = getComputedStyle(grid);
            const gap = parseFloat(styles.gap) || 0;
            return {
                w: (rect.width - gap * (PANO_GRID_COLS - 1)) / PANO_GRID_COLS + gap,
                h: (rect.height - gap * (PANO_GRID_ROWS - 1)) / PANO_GRID_ROWS + gap,
                rect
            };
        }

        function panoEnterEditMode() {
            panoEditWorkingLayout = JSON.parse(JSON.stringify(panoGetLayoutState()));
            panoEditBeforeSnapshot = JSON.parse(JSON.stringify(panoGetLayoutState()));
            panoEditActive = true;
            document.body.classList.add('pano-edit-mode');
            document.getElementById('pano-edit-toolbar').classList.add('active');
            panoBindModuleDragHandlers();
            panoBindEditPanelDrag();
        }

        // Sağ üstteki "Seçili Modül Ayar Paneli"ni başlığından tutup serbestçe
        // sürükleyebilmeyi sağlar (ekranın istenen bir köşesine taşınabilir).
        function panoBindEditPanelDrag() {
            const panel = document.getElementById('pano-edit-panel');
            const handle = document.getElementById('pano-edit-panel-header');
            if (!panel || !handle || handle.dataset.dragBound) return;
            handle.dataset.dragBound = '1';
            handle.addEventListener('pointerdown', function(e) {
                e.preventDefault();
                const rect = panel.getBoundingClientRect();
                panel.style.left = rect.left + 'px';
                panel.style.top = rect.top + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
                panel.classList.add('pano-panel-dragging');
                const startX = e.clientX, startY = e.clientY;
                const origLeft = rect.left, origTop = rect.top;
                function onMove(ev) {
                    const maxLeft = Math.max(4, window.innerWidth - panel.offsetWidth - 4);
                    const maxTop = Math.max(4, window.innerHeight - panel.offsetHeight - 4);
                    let newLeft = origLeft + (ev.clientX - startX);
                    let newTop = origTop + (ev.clientY - startY);
                    newLeft = Math.min(Math.max(4, newLeft), maxLeft);
                    newTop = Math.min(Math.max(4, newTop), maxTop);
                    panel.style.left = newLeft + 'px';
                    panel.style.top = newTop + 'px';
                }
                function onUp() {
                    document.removeEventListener('pointermove', onMove);
                    panel.classList.remove('pano-panel-dragging');
                }
                document.addEventListener('pointermove', onMove);
                document.addEventListener('pointerup', onUp, { once: true });
            });
        }

        function panoBindModuleDragHandlers() {
            panoAllModuleIds().forEach(id => {
                const el = panoModuleEl(id);
                if (!el || el.dataset.panoBound) return;
                el.dataset.panoBound = '1';
                el.addEventListener('pointerdown', function(e) {
                    if (!panoEditActive) return;
                    if (e.target.classList.contains('pano-resize-handle')) return;
                    panoStartDrag('move', id, e);
                });
                const handle = el.querySelector('.pano-resize-handle');
                if (handle) {
                    handle.addEventListener('pointerdown', function(e) {
                        if (!panoEditActive) return;
                        e.stopPropagation();
                        panoStartDrag('resize', id, e);
                    });
                }
                el.addEventListener('click', function(e) {
                    if (!panoEditActive || panoDragState) return;
                    panoSelectModuleForPanel(id);
                });
            });
        }

        function panoStartDrag(type, moduleId, e) {
            const cell = panoCellSize();
            const m = panoEditWorkingLayout[moduleId];
            panoDragState = {
                type, moduleId,
                startX: e.clientX, startY: e.clientY,
                orig: { c: m.c, r: m.r, cs: m.cs, rs: m.rs },
                cellW: cell.w, cellH: cell.h
            };
            const el = panoModuleEl(moduleId);
            el.classList.add('pano-dragging');
            el.setPointerCapture(e.pointerId);
            document.addEventListener('pointermove', panoOnDragMove);
            document.addEventListener('pointerup', panoOnDragEnd, { once: true });
        }

        function panoOnDragMove(e) {
            if (!panoDragState) return;
            const { type, moduleId, startX, startY, orig, cellW, cellH } = panoDragState;
            const dCols = Math.round((e.clientX - startX) / cellW);
            const dRows = Math.round((e.clientY - startY) / cellH);
            const m = panoEditWorkingLayout[moduleId];
            if (type === 'move') {
                m.c = Math.min(Math.max(1, orig.c + dCols), PANO_GRID_COLS - orig.cs + 1);
                m.r = Math.min(Math.max(1, orig.r + dRows), PANO_GRID_ROWS - orig.rs + 1);
            } else {
                m.cs = Math.min(Math.max(1, orig.cs + dCols), PANO_GRID_COLS - orig.c + 1);
                m.rs = Math.min(Math.max(1, orig.rs + dRows), PANO_GRID_ROWS - orig.r + 1);
            }
            applyPanoLayout(panoEditWorkingLayout);
            if (panoEditSelectedModule === moduleId) panoRefreshPanelValues(moduleId);
        }

        function panoOnDragEnd() {
            document.removeEventListener('pointermove', panoOnDragMove);
            if (panoDragState) {
                const el = panoModuleEl(panoDragState.moduleId);
                if (el) el.classList.remove('pano-dragging');
            }
            panoDragState = null;
        }

        function panoSelectModuleForPanel(moduleId) {
            document.querySelectorAll('.pano-module.pano-selected').forEach(e => e.classList.remove('pano-selected'));
            const el = panoModuleEl(moduleId);
            if (el) el.classList.add('pano-selected');
            panoEditSelectedModule = moduleId;
            document.getElementById('pano-edit-panel-title').textContent = PANO_MODULE_LABELS[moduleId] || moduleId;
            panoRefreshPanelValues(moduleId);
            document.getElementById('pano-edit-panel').classList.add('active');
        }

        function panoRefreshPanelValues(moduleId) {
            const m = panoEditWorkingLayout[moduleId];
            const headerEl = panoModuleEl(moduleId) ? panoModuleEl(moduleId).querySelector(':scope > .card-header') : null;
            const naturalHh = headerEl ? Math.round(headerEl.getBoundingClientRect().height) : 32;
            const naturalHfs = headerEl ? Math.round(parseFloat(getComputedStyle(headerEl).fontSize)) : 15;
            document.getElementById('pano-panel-cs').value = m.cs;
            document.getElementById('pano-panel-cs-val').textContent = m.cs;
            document.getElementById('pano-panel-rs').value = m.rs;
            document.getElementById('pano-panel-rs-val').textContent = m.rs;
            document.getElementById('pano-panel-fs').value = m.fs;
            document.getElementById('pano-panel-fs-val').textContent = m.fs;
            const hhVal = m.hh || naturalHh || 32;
            const hfsVal = m.hfs || naturalHfs || 15;
            document.getElementById('pano-panel-hh').value = hhVal;
            document.getElementById('pano-panel-hh-val').textContent = hhVal;
            document.getElementById('pano-panel-hfs').value = hfsVal;
            document.getElementById('pano-panel-hfs-val').textContent = hfsVal;
        }

        function panoPanelUpdate() {
            if (!panoEditSelectedModule) return;
            const m = panoEditWorkingLayout[panoEditSelectedModule];
            m.cs = Math.min(parseInt(document.getElementById('pano-panel-cs').value, 10), PANO_GRID_COLS - m.c + 1);
            m.rs = Math.min(parseInt(document.getElementById('pano-panel-rs').value, 10), PANO_GRID_ROWS - m.r + 1);
            m.fs = parseInt(document.getElementById('pano-panel-fs').value, 10);
            m.hh = parseInt(document.getElementById('pano-panel-hh').value, 10);
            m.hfs = parseInt(document.getElementById('pano-panel-hfs').value, 10);
            document.getElementById('pano-panel-cs-val').textContent = m.cs;
            document.getElementById('pano-panel-rs-val').textContent = m.rs;
            document.getElementById('pano-panel-fs-val').textContent = m.fs;
            document.getElementById('pano-panel-hh-val').textContent = m.hh;
            document.getElementById('pano-panel-hfs-val').textContent = m.hfs;
            applyPanoLayout(panoEditWorkingLayout);
        }

        function panoFinishLiveEdit(save) {
            panoEditActive = false;
            document.body.classList.remove('pano-edit-mode');
            document.getElementById('pano-edit-toolbar').classList.remove('active');
            document.getElementById('pano-edit-panel').classList.remove('active');
            document.querySelectorAll('.pano-module.pano-selected').forEach(e => e.classList.remove('pano-selected'));
            panoEditSelectedModule = null;
            if (save) {
                appConfig.panoLayout = panoEditWorkingLayout;
                panoPersist();
                applyPanoLayout(appConfig.panoLayout);
                panoRenderModuleSizeList();
                showCustomNotification('Düzen Kaydedildi', 'Yeni modül yerleşimi başarıyla kaydedildi.');
            } else {
                applyPanoLayout(panoEditBeforeSnapshot);
            }
        }

        function panoStartLiveEditFromAdmin() {
            closeAdminPanelWithoutSaving();
            panoEnterEditMode();
        }

        /* ================== ŞABLONLAR ================== */
        function panoApplyTemplate(templateKey) {
            const tpl = PANO_LAYOUT_TEMPLATES[templateKey];
            if (!tpl) return;
            appConfig.panoLayout = panoFillMissingModules(JSON.parse(JSON.stringify(tpl)));
            panoPersist();
            applyPanoLayout(appConfig.panoLayout);
            panoRenderModuleSizeList();
            writeCMSLog(`"${(PANO_TEMPLATE_LABELS[templateKey] || {}).title || templateKey}" yerleşim şablonu uygulandı.`);
        }

        function panoRenderTemplateList() {
            const wrap = document.getElementById('admin-layout-template-list');
            if (!wrap) return;
            wrap.innerHTML = '';
            Object.keys(PANO_LAYOUT_TEMPLATES).forEach(key => {
                const meta = PANO_TEMPLATE_LABELS[key] || { title: key, desc: '', icon: 'fa-table-cells' };
                const card = document.createElement('button');
                card.className = 'text-left bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded-xl p-3 transition group';
                card.onclick = () => panoApplyTemplate(key);
                card.innerHTML = `
                    <div class="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 group-hover:bg-cyan-500/20">
                        <i class="fa-solid ${meta.icon}"></i>
                    </div>
                    <div class="text-white font-bold text-sm">${meta.title}</div>
                    <div class="text-[11px] text-slate-500 mt-0.5">${meta.desc}</div>
                `;
                wrap.appendChild(card);
            });
        }

        /* ================== KAYITLI (KULLANICI) DÜZENLERİ ================== */
        function panoSaveCurrentLayoutAs() {
            const input = document.getElementById('admin-layout-save-name');
            const name = (input.value || '').trim();
            if (!name) {
                showCustomNotification('İsim Gerekli', 'Kaydetmeden önce düzen için bir isim girin.');
                return;
            }
            if (!appConfig.savedLayouts) appConfig.savedLayouts = {};
            appConfig.savedLayouts[name] = JSON.parse(JSON.stringify(panoGetLayoutState()));
            panoPersist();
            input.value = '';
            panoRenderSavedLayoutsList();
            writeCMSLog(`"${name}" adıyla yeni bir yerleşim kaydedildi.`);
            showCustomNotification('Kaydedildi', `"${name}" adlı düzen kaydedildi. İstediğiniz zaman listeden yükleyebilirsiniz.`);
        }

        function panoLoadSavedLayout(name) {
            if (!appConfig.savedLayouts || !appConfig.savedLayouts[name]) return;
            appConfig.panoLayout = panoFillMissingModules(JSON.parse(JSON.stringify(appConfig.savedLayouts[name])));
            panoPersist();
            applyPanoLayout(appConfig.panoLayout);
            panoRenderModuleSizeList();
            writeCMSLog(`"${name}" adlı kayıtlı düzen yüklendi.`);
        }

        function panoDeleteSavedLayout(name) {
            askCustomConfirmation('Düzeni Sil', `"${name}" adlı kayıtlı düzeni silmek istediğinize emin misiniz?`, function() {
                delete appConfig.savedLayouts[name];
                panoPersist();
                panoRenderSavedLayoutsList();
                writeCMSLog(`"${name}" adlı kayıtlı düzen silindi.`);
            });
        }

        function panoRenderSavedLayoutsList() {
            const wrap = document.getElementById('admin-layout-saved-list');
            if (!wrap) return;
            wrap.innerHTML = '';
            const names = Object.keys(appConfig.savedLayouts || {});
            if (names.length === 0) {
                wrap.innerHTML = '<p class="text-[11px] text-slate-600 italic px-1">Henüz kayıtlı bir düzeniniz yok.</p>';
                return;
            }
            names.forEach(name => {
                const row = document.createElement('div');
                row.className = 'flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-3 py-2';
                row.innerHTML = `
                    <span class="text-sm text-slate-200 font-bold flex items-center gap-2"><i class="fa-solid fa-bookmark text-emerald-400"></i> ${name}</span>
                    <span class="flex items-center gap-2">
                        <button class="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg">Yükle</button>
                        <button class="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-lg"><i class="fa-solid fa-trash"></i></button>
                    </span>
                `;
                row.querySelectorAll('button')[0].onclick = () => panoLoadSavedLayout(name);
                row.querySelectorAll('button')[1].onclick = () => panoDeleteSavedLayout(name);
                wrap.appendChild(row);
            });
        }

        /* ================== MODÜL EBAT / YAZI BOYUTU LİSTESİ (ADMİN SEKMESİ İÇİNDE) ================== */
        function panoRenderModuleSizeList() {
            const wrap = document.getElementById('admin-layout-module-list');
            if (!wrap) return;
            wrap.innerHTML = '';
            const layout = panoGetLayoutState();
            panoAllModuleIds().forEach(id => {
                const m = layout[id];
                const headerElNow = panoModuleEl(id) ? panoModuleEl(id).querySelector(':scope > .card-header') : null;
                const naturalHfs = headerElNow ? Math.round(parseFloat(getComputedStyle(headerElNow).fontSize)) : 15;
                const hfsCurrent = m.hfs || naturalHfs || 15;
                const hcolorCurrent = m.hcolor || '#ffffff';
                const row = document.createElement('div');
                row.className = 'grid grid-cols-[repeat(16,minmax(0,1fr))] gap-3 items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-2';
                row.innerHTML = `
                    <div class="col-span-3 text-sm text-slate-200 font-bold">${panoModuleLabel(id)}</div>
                    <div class="col-span-2"><input type="number" min="1" max="96" value="${m.cs}" class="w-full bg-slate-950 border border-slate-700 rounded-md text-center text-white text-sm py-1" data-field="cs"></div>
                    <div class="col-span-2"><input type="number" min="1" max="64" value="${m.rs}" class="w-full bg-slate-950 border border-slate-700 rounded-md text-center text-white text-sm py-1" data-field="rs"></div>
                    <div class="col-span-3"><input type="range" min="40" max="250" value="${m.fs}" class="w-full" data-field="fs"></div>
                    <div class="col-span-2 text-center text-xs text-cyan-400 font-bold" data-role="fsval">${m.fs}%</div>
                    <div class="col-span-2"><input type="number" min="8" max="48" value="${hfsCurrent}" class="w-full bg-slate-950 border border-slate-700 rounded-md text-center text-white text-sm py-1" data-field="hfs"></div>
                    <div class="col-span-2 flex items-center justify-center"><input type="color" value="${hcolorCurrent}" class="w-8 h-8 bg-slate-950 border border-slate-700 rounded-md cursor-pointer" data-field="hcolor"></div>
                `;
                const csInput = row.querySelector('[data-field="cs"]');
                const rsInput = row.querySelector('[data-field="rs"]');
                const fsInput = row.querySelector('[data-field="fs"]');
                const fsVal = row.querySelector('[data-role="fsval"]');
                const hfsInput = row.querySelector('[data-field="hfs"]');
                const hcolorInput = row.querySelector('[data-field="hcolor"]');
                function commit() {
                    const state = panoGetLayoutState();
                    const mod = state[id];
                    mod.cs = Math.min(Math.max(1, parseInt(csInput.value, 10) || mod.cs), PANO_GRID_COLS - mod.c + 1);
                    mod.rs = Math.min(Math.max(1, parseInt(rsInput.value, 10) || mod.rs), PANO_GRID_ROWS - mod.r + 1);
                    mod.fs = parseInt(fsInput.value, 10) || 100;
                    mod.hfs = Math.min(Math.max(8, parseInt(hfsInput.value, 10) || 15), 48);
                    mod.hcolor = hcolorInput.value || '';
                    fsVal.textContent = mod.fs + '%';
                    panoPersist();
                    applyPanoLayout(state);
                }
                csInput.addEventListener('change', commit);
                rsInput.addEventListener('change', commit);
                fsInput.addEventListener('input', commit);
                hfsInput.addEventListener('change', commit);
                hcolorInput.addEventListener('input', commit);
                wrap.appendChild(row);
            });
        }

        let appConfig = JSON.parse(localStorage.getItem('okulPanoDataV8')) || defaultAppConfig;

        // ESKİ SÜRÜM UYUMLULUĞU: Duyurular önceden düz metin (string) dizisiydi.
        // Her duyuru için ayrı biçimlendirme desteği eklendiğinde, eski kayıtları
        // varsayılan biçimlendirme değerleriyle nesne (object) formatına dönüştürüyoruz.
        function normalizeAnnouncement(a) {
            if (typeof a === 'string') {
                return { text: a, color: '', bgColor: '', font: '', fontSize: 11, bold: false };
            }
            return {
                text: (a && a.text) || '',
                color: (a && a.color) || '',
                bgColor: (a && a.bgColor) || '',
                font: (a && a.font) || '',
                fontSize: (a && a.fontSize) ? parseInt(a.fontSize, 10) : 11,
                bold: !!(a && a.bold)
            };
        }
        if (Array.isArray(appConfig.announcements)) {
            appConfig.announcements = appConfig.announcements.map(normalizeAnnouncement);
        }

        // KAYAN YAZI: eski kayıtlarda bu alan hiç yoktu; yoksa varsayılan mesajları,
        // varsa da eksik alanları (icon/bold/italic vb.) tamamlayarak normalize ediyoruz.
        function normalizeMarqueeItem(m) {
            if (typeof m === 'string') {
                return { text: m, color: '', bold: false, italic: false, icon: '' };
            }
            return {
                text: (m && m.text) || '',
                color: (m && m.color) || '',
                bold: !!(m && m.bold),
                italic: !!(m && m.italic),
                icon: (m && m.icon) || ''
            };
        }
        if (!Array.isArray(appConfig.marqueeItems)) {
            appConfig.marqueeItems = JSON.parse(JSON.stringify(defaultAppConfig.marqueeItems));
        } else {
            appConfig.marqueeItems = appConfig.marqueeItems.map(normalizeMarqueeItem);
        }
        appConfig.marqueeWidget = { ...defaultAppConfig.marqueeWidget, ...(appConfig.marqueeWidget || {}) };

        // IZGARA SÜRÜM GEÇMİŞİ: v1 = 24x16, v2 = 48x32, v3 = 96x64
        // Daha önceki bir sürümde tarayıcıya kaydedilmiş özel bir pano düzeni varsa,
        // koordinatları eski ızgaraya göredir. Görünüm bozulmasın diye bu düzeni
        // otomatik olarak her adımda 2 katı ölçekleyip güncel ızgaraya taşıyoruz.
        const PANO_GRID_VERSION = 3;
        function panoScaleLayoutToNewGrid(layout) {
            Object.keys(layout).forEach(id => {
                const m = layout[id];
                if (!m) return;
                if (typeof m.c === 'number') m.c = (m.c - 1) * 2 + 1;
                if (typeof m.r === 'number') m.r = (m.r - 1) * 2 + 1;
                if (typeof m.cs === 'number') m.cs = m.cs * 2;
                if (typeof m.rs === 'number') m.rs = m.rs * 2;
            });
        }
        if ((appConfig.panoLayout || appConfig.savedLayouts) && (appConfig.panoGridVersion || 1) < PANO_GRID_VERSION) {
            let v = appConfig.panoGridVersion || 1;
            while (v < PANO_GRID_VERSION) {
                if (appConfig.panoLayout) panoScaleLayoutToNewGrid(appConfig.panoLayout);
                if (appConfig.savedLayouts) {
                    Object.keys(appConfig.savedLayouts).forEach(name => {
                        panoScaleLayoutToNewGrid(appConfig.savedLayouts[name]);
                    });
                }
                v++;
            }
            appConfig.panoGridVersion = PANO_GRID_VERSION;
            panoPersist();
        } else if (!appConfig.panoGridVersion) {
            appConfig.panoGridVersion = PANO_GRID_VERSION;
        }

        applyBrandPositions();
        
        if (!appConfig.bellHours) appConfig.bellHours = bellHours; else bellHours = appConfig.bellHours;
        appConfig.bellHoursSettings = { ...defaultAppConfig.bellHoursSettings, ...(appConfig.bellHoursSettings || {}) };
        if (!appConfig.weeklyDuties) appConfig.weeklyDuties = defaultAppConfig.weeklyDuties;
        if (!appConfig.weeklyClassSchedules) appConfig.weeklyClassSchedules = defaultAppConfig.weeklyClassSchedules;
        if (!appConfig.aylikNobet) appConfig.aylikNobet = {};
        if (!appConfig.teacherRoster) appConfig.teacherRoster = {};
        if (!appConfig.dutyPositions || !Array.isArray(appConfig.dutyPositions) || appConfig.dutyPositions.length === 0) {
            appConfig.dutyPositions = JSON.parse(JSON.stringify(defaultAppConfig.dutyPositions));
        } else {
            // Eksik alanları (icon/color) tamamla, id'siz kayıt varsa üret
            appConfig.dutyPositions = appConfig.dutyPositions.map((p, idx) => ({
                id: p.id || ('yer_' + Date.now() + '_' + idx),
                label: p.label || ('Nöbet Yeri ' + (idx + 1)),
                icon: p.icon || 'fa-user-shield',
                color: p.color || '#00b4d8'
            }));
        }
        if (!appConfig.dutyStyle) {
            appConfig.dutyStyle = JSON.parse(JSON.stringify(defaultAppConfig.dutyStyle));
        } else {
            appConfig.dutyStyle = {
                ...JSON.parse(JSON.stringify(defaultAppConfig.dutyStyle)),
                ...appConfig.dutyStyle,
                activeBg: { ...defaultAppConfig.dutyStyle.activeBg, ...(appConfig.dutyStyle.activeBg || {}) }
            };
        }
        appConfig.scheduleBoardStyle = { ...JSON.parse(JSON.stringify(defaultAppConfig.scheduleBoardStyle)), ...(appConfig.scheduleBoardStyle || {}) };
        appConfig.clockStyle = { ...JSON.parse(JSON.stringify(defaultAppConfig.clockStyle)), ...(appConfig.clockStyle || {}) };
        if (!appConfig.panoLayout) appConfig.panoLayout = panoFillMissingModules(JSON.parse(JSON.stringify(PANO_LAYOUT_TEMPLATES['klasik'])));
        else appConfig.panoLayout = panoFillMissingModules(appConfig.panoLayout);
        if (!appConfig.savedLayouts) appConfig.savedLayouts = {};
        if (!appConfig.quotes || appConfig.quotes.length === 0) {
            appConfig.quotes = [{ text: appConfig.quote || defaultAppConfig.quote, author: appConfig.quoteAuthor || defaultAppConfig.quoteAuthor, date: "" }];
        }
        if (!appConfig.birthdayWidget) appConfig.birthdayWidget = { ...defaultAppConfig.birthdayWidget };
        else appConfig.birthdayWidget = { ...defaultAppConfig.birthdayWidget, ...appConfig.birthdayWidget };

        // Eski (string dizisi) belirli gün/hafta verisini yeni obje formatına taşı
        if (!appConfig.specialDays) appConfig.specialDays = [...defaultAppConfig.specialDays];
        appConfig.specialDays = appConfig.specialDays.map(sd => {
            if (typeof sd === 'string') return { title: sd, startDate: "", endDate: "" };
            return { title: sd.title || "", startDate: sd.startDate || "", endDate: sd.endDate || "" };
        });

        // AYIN ENLERİ verisini dinamik alan (kategori) formatına taşı.
        // 1) En eski (tek kayıtlı) format: cleanClass / cleanClassImg / bestStudent / bestStudentImg
        // 2) Ara format (çoklu kayıt ama sabit 2 alan): cleanClassList / bestStudentList + achievementWidget.cleanX/studentX
        // 3) Güncel format: achievementCategories (dinamik, sınırsız alan)
        if (!appConfig.achievementCategories || appConfig.achievementCategories.length === 0) {
            const legacyAw = appConfig.achievementWidget || {};
            let legacyCleanList = appConfig.cleanClassList;
            if (!legacyCleanList || legacyCleanList.length === 0) {
                legacyCleanList = (appConfig.cleanClass || appConfig.cleanClassImg)
                    ? [{ title: appConfig.cleanClass || "", img: appConfig.cleanClassImg || "", active: true }]
                    : JSON.parse(JSON.stringify(defaultAppConfig.achievementCategories[0].list));
            }
            let legacyStudentList = appConfig.bestStudentList;
            if (!legacyStudentList || legacyStudentList.length === 0) {
                legacyStudentList = (appConfig.bestStudent || appConfig.bestStudentImg)
                    ? [{ title: appConfig.bestStudent || "", img: appConfig.bestStudentImg || "", active: true }]
                    : JSON.parse(JSON.stringify(defaultAppConfig.achievementCategories[1].list));
            }
            appConfig.achievementCategories = [
                {
                    id: "cat_clean_class",
                    title: "Ayın Temiz Sınıfı",
                    icon: "fa-wand-magic-sparkles",
                    list: legacyCleanList.map(r => ({ title: r.title || "", img: r.img || "", active: r.active !== false })),
                    style: {
                        font: legacyAw.cleanFont || "", size: legacyAw.cleanSize || "14", color: legacyAw.cleanColor || "",
                        textAlign: legacyAw.cleanTextAlign || "left", justify: legacyAw.cleanJustify || "center",
                        imgPosition: legacyAw.cleanImgPosition || "left", imgSize: 44, imgShape: "rounded",
                        imgBorderWidth: 1.5, imgBorderColor: "#00b4d8", imgBorderStyle: "solid", imgOpacity: 100,
                        cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, imgEffect: "none", imgEffectColor: "#00b4d8", imgEffectIntensity: 100
                    }
                },
                {
                    id: "cat_best_student",
                    title: "Ayın Örnek Öğrencisi",
                    icon: "fa-star",
                    list: legacyStudentList.map(r => ({ title: r.title || "", img: r.img || "", active: r.active !== false })),
                    style: {
                        font: legacyAw.studentFont || "", size: legacyAw.studentSize || "14", color: legacyAw.studentColor || "",
                        textAlign: legacyAw.studentTextAlign || "left", justify: legacyAw.studentJustify || "center",
                        imgPosition: legacyAw.studentImgPosition || "left", imgSize: 44, imgShape: "rounded",
                        imgBorderWidth: 1.5, imgBorderColor: "#00b4d8", imgBorderStyle: "solid", imgOpacity: 100,
                        cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, imgEffect: "none", imgEffectColor: "#00b4d8", imgEffectIntensity: 100
                    }
                }
            ];
        }
        // Kategori nesnelerini eksik alanlara karşı normalize et
        appConfig.achievementCategories = appConfig.achievementCategories.map((cat, idx) => ({
            id: cat.id || ("cat_" + Date.now().toString(36) + idx),
            title: cat.title || "Alan",
            icon: cat.icon || "fa-star",
            active: cat.active !== false,
            list: (cat.list || []).map(r => ({ title: r.title || "", img: r.img || "", active: r.active !== false })),
            style: {
                font: "", size: "14", color: "", textAlign: "left", justify: "center",
                imgPosition: "left", imgSize: 44, imgShape: "rounded",
                imgBorderWidth: 1.5, imgBorderColor: "#00b4d8", imgBorderStyle: "solid", imgOpacity: 100,
                cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, imgEffect: "none", imgEffectColor: "#00b4d8", imgEffectIntensity: 100,
                ...(cat.style || {})
            }
        }));
        appConfig.achievementWidget = { ...defaultAppConfig.achievementWidget, ...(appConfig.achievementWidget || {}) };
        // Eski sabit alanlara ait ayarlar artık kullanılmıyor; karışıklığı önlemek için temizle
        delete appConfig.cleanClassList;
        delete appConfig.bestStudentList;
        delete appConfig.cleanClass;
        delete appConfig.cleanClassImg;
        delete appConfig.bestStudent;
        delete appConfig.bestStudentImg;

        // Modül ayarlarını (başlık/renk/boyut/aktiflik) varsayılanlarla birleştir
        if (!appConfig.moduleSettings) appConfig.moduleSettings = {};
        Object.keys(defaultAppConfig.moduleSettings).forEach(key => {
            appConfig.moduleSettings[key] = { ...defaultAppConfig.moduleSettings[key], ...(appConfig.moduleSettings[key] || {}) };
        });

        // Okul Marka modülünü moduleSettings'e ekle (yoksa)
        if (!appConfig.moduleSettings.brand) {
            appConfig.moduleSettings.brand = { title: '', color: '', bgType: '', bgColor1: '', bgColor2: '', titleBgType: '', titleBgColor1: '', titleBgColor2: '', titleColor: '', font: '', size: 'normal', active: true, titleActive: true };
        }

        // Tüm modüllerin (kart) tanımları: id, panel etiketi, panodaki DOM seçicileri
        // TEMEL MODÜL DEFİNİSYONLARI — yeni modül eklemek için sadece bu listeye satır ekle.
        // Dinamik sistem bu listeyi kullanarak tüm ayar panelini, geri alma geçmişini ve otomatik
        // kaydetmeyi kendiliğinden yönetir. Özel (kullanıcı tarafından eklenen) modüller de
        // appConfig.customModuleDefs içinde tutulur ve buraya çalışma zamanında birleştirilir.
        // NOT: Bu tanım, aşağıdaki _rebuildModuleDefs() çağrısından ÖNCE gelmeli — aksi halde
        // "Cannot access 'BUILTIN_MODULE_DEFS' before initialization" hatası oluşur.
        const BUILTIN_MODULE_DEFS = [
            { id: 'brand',         label: 'Okul Marka Alanı',         cardSel: '#brand-dashboard-card',         titleSel: null,                            hasTitle: false, hasInterval: false, builtIn: true },
            { id: 'birthday',      label: 'Doğum Günleri',            cardSel: '#birthday-dashboard-card',      titleSel: '#display-birthday-title',       hasTitle: true,  hasInterval: true,  defaultInterval: 6,  builtIn: true },
            { id: 'schedule',      label: 'Ders Programı',            cardSel: '#schedule-dashboard-card',      titleSel: '#display-schedule-group-title', hasTitle: true,  hasInterval: true,  defaultInterval: 12, builtIn: true },
            { id: 'quote',         label: 'Günün Sözü',               cardSel: '#quote-dashboard-card',         titleSel: '#display-quote-title',          hasTitle: true,  hasInterval: true,  defaultInterval: 9,  builtIn: true },
            { id: 'specialday',    label: 'Belirli Gün & Hava Durumu',cardSel: '#specialday-weather-card',      titleSel: '#display-specialday-title',     hasTitle: true,  hasInterval: true,  defaultInterval: 8,  builtIn: true },
            { id: 'bellhours',     label: 'Zil Saatleri',             cardSel: '#bellhours-dashboard-card',     titleSel: '#display-bellhours-title',      hasTitle: true,  hasInterval: false, builtIn: true },
            { id: 'announcements', label: 'Duyurular',                cardSel: '#announcements-dashboard-card', titleSel: '#display-announcements-title',   hasTitle: true,  hasInterval: false, builtIn: true },
            { id: 'clock',         label: 'Saat / Geri Sayım',        cardSel: '#clock-dashboard-card',         titleSel: null,                            hasTitle: false, hasInterval: false, builtIn: true },
            { id: 'achievements',  label: 'Ayın Enleri',              cardSel: '#achievements-dashboard-card',  titleSel: '#display-achievements-title',   hasTitle: true,  hasInterval: true,  defaultInterval: 7,  builtIn: true },
            { id: 'duty',          label: 'Nöbetçi Öğretmenler',      cardSel: '#duty-dashboard-card',          titleSel: '#display-duty-title-text',      hasTitle: true,  hasInterval: false, builtIn: true },
            { id: 'media',         label: 'Görsel Slayt Alanı',       cardSel: '#media-dashboard-card',         titleSel: null,                            hasTitle: false, hasInterval: true,  defaultInterval: 10, builtIn: true },
            { id: 'marquee',       label: 'Kayan Yazı',               cardSel: '#marquee-dashboard-card',       titleSel: '#display-marquee-title',        hasTitle: true,  hasInterval: false, builtIn: true }
        ];

        // Çalışma zamanında kullanılan birleşik modül listesi (yerleşik + kullanıcı eklentileri)
        let moduleDefs = [...BUILTIN_MODULE_DEFS];

        // Kullanıcı tarafından eklenen özel modülleri yükle ve birleştir
        if (!appConfig.customModuleDefs) appConfig.customModuleDefs = [];
        _rebuildModuleDefs();

        // Modül ayarları geri alma yığını
        let moduleSettingsUndoStack = [];
        const MODULE_SETTINGS_UNDO_LIMIT = 20;

        // Geri alma yığınına anlık durumu ekler
        function moduleSettingsPushUndo() {
            const snapshot = {
                moduleSettings: JSON.parse(JSON.stringify(appConfig.moduleSettings || {})),
                customModuleDefs: JSON.parse(JSON.stringify(appConfig.customModuleDefs || []))
            };
            moduleSettingsUndoStack.push(snapshot);
            if (moduleSettingsUndoStack.length > MODULE_SETTINGS_UNDO_LIMIT) moduleSettingsUndoStack.shift();
            document.getElementById('btn-module-undo') && document.getElementById('btn-module-undo').classList.remove('hidden');
        }

        // Son durumu geri alır
        function moduleSettingsUndo() {
            if (!moduleSettingsUndoStack.length) return;
            const snap = moduleSettingsUndoStack.pop();
            const idsBefore = (appConfig.customModuleDefs || []).map(d => d.id);
            appConfig.moduleSettings = snap.moduleSettings;
            appConfig.customModuleDefs = snap.customModuleDefs || [];
            _rebuildModuleDefs();
            const idsAfter = appConfig.customModuleDefs.map(d => d.id);
            // Geri alma ile kaldırılan özel modüllerin panodaki kartlarını temizle
            idsBefore.filter(id => !idsAfter.includes(id)).forEach(id => {
                const el = panoModuleEl(id);
                if (el && el.parentNode) el.parentNode.removeChild(el);
                if (appConfig.panoLayout) delete appConfig.panoLayout[id];
            });
            // Geri alma ile geri gelen özel modüllerin kartlarını yeniden oluştur
            ensureAllCustomModuleCards();
            appConfig.panoLayout = panoFillMissingModules(panoGetLayoutState());
            applyPanoLayout(appConfig.panoLayout);
            panoSetupOverlays();
            panoBindModuleDragHandlers();
            moduleSettingsAutoSave();
            renderAdminModuleSettings();
            applyModuleSettingsToDashboard();
            if (!moduleSettingsUndoStack.length) {
                document.getElementById('btn-module-undo') && document.getElementById('btn-module-undo').classList.add('hidden');
            }
            writeCMSLog('Modül ayarları geri alındı.');
        }

        // customModuleDefs listesine göre moduleDefs'i yeniden oluşturur
        function _rebuildModuleDefs() {
            const customs = (appConfig.customModuleDefs || []).filter(d => d && d.id);
            moduleDefs = [...BUILTIN_MODULE_DEFS, ...customs];
        }

        // Modül ayarlarını localStorage'a otomatik yazar (kaydet butonuna basmadan)
        function moduleSettingsAutoSave() {
            appConfig.moduleSettings = collectModuleSettingsFromAdmin();
            appConfig.customModuleDefs = (appConfig.customModuleDefs || []);
            panoPersist();
        }

        // Yeni özel modül ekle
        function moduleSettingsAddNew() {
            moduleSettingsPushUndo();
            const newId = 'custom_' + Date.now();
            const newDef = { id: newId, label: 'Yeni Modül', cardSel: '', titleSel: null, hasTitle: true, hasInterval: false, builtIn: false, isCustom: true };
            if (!appConfig.customModuleDefs) appConfig.customModuleDefs = [];
            appConfig.customModuleDefs.push(newDef);
            if (!appConfig.moduleSettings) appConfig.moduleSettings = {};
            appConfig.moduleSettings[newId] = { title: 'Yeni Modül Başlığı', content: 'Bu alana metin yazabilirsiniz.', image: '', color: '', bgType: '', bgColor1: '', bgColor2: '', titleBgType: '', titleBgColor1: '', titleBgColor2: '', titleColor: '', font: '', size: 'normal', active: true, titleActive: true, cellEffect: 'none', cellEffectColor: '#00b4d8', moduleOpacity: 100, effectIntensity: 100, borderWidth: 1, cornerRadius: '', imgOpacity: 100, imgBorderWidth: 0, imgBorderColor: '#00b4d8', imgRatio: 'auto' };
            _rebuildModuleDefs();
            ensureCustomModuleCard(newDef);
            appConfig.panoLayout = panoFillMissingModules(panoGetLayoutState());
            applyPanoLayout(appConfig.panoLayout);
            panoSetupOverlays();
            panoBindModuleDragHandlers();
            renderAdminModuleSettings();
            applyModuleSettingsToDashboard();
            moduleSettingsAutoSave();
            writeCMSLog('Yeni modül eklendi: ' + newId);
            showCustomNotification('Modül Eklendi', 'Yeni modül panoya eklendi. Konumunu/boyutunu "Yerleşim Düzenleyici" bölümünden ayarlayabilirsiniz.');
        }

        // Var olan bir modülü kopyala
        function moduleSettingsDuplicate(id) {
            moduleSettingsPushUndo();
            const srcDef = moduleDefs.find(d => d.id === id);
            const srcSetting = (appConfig.moduleSettings && appConfig.moduleSettings[id]) ? JSON.parse(JSON.stringify(appConfig.moduleSettings[id])) : {};
            const newId = 'custom_' + Date.now();
            const newDef = { ...srcDef, id: newId, label: (srcDef ? srcDef.label : 'Modül') + ' (Kopya)', cardSel: '', titleSel: null, builtIn: false, isCustom: true };
            if (!appConfig.customModuleDefs) appConfig.customModuleDefs = [];
            appConfig.customModuleDefs.push(newDef);
            srcSetting.title = (srcSetting.title || '') + ' (Kopya)';
            if (srcSetting.content === undefined) srcSetting.content = '';
            if (srcSetting.image === undefined) srcSetting.image = '';
            if (!appConfig.moduleSettings) appConfig.moduleSettings = {};
            appConfig.moduleSettings[newId] = srcSetting;
            _rebuildModuleDefs();
            ensureCustomModuleCard(newDef);
            appConfig.panoLayout = panoFillMissingModules(panoGetLayoutState());
            applyPanoLayout(appConfig.panoLayout);
            panoSetupOverlays();
            panoBindModuleDragHandlers();
            renderAdminModuleSettings();
            applyModuleSettingsToDashboard();
            moduleSettingsAutoSave();
            writeCMSLog('Modül kopyalandı: ' + id + ' → ' + newId);
            showCustomNotification('Modül Kopyalandı', 'Kopyalanan modül panoya eklendi. Konumunu/boyutunu "Yerleşim Düzenleyici" bölümünden ayarlayabilirsiniz.');
        }

        // Özel (kullanıcı eklentisi) modülü sil
        function moduleSettingsDelete(id) {
            const def = moduleDefs.find(d => d.id === id);
            if (def && def.builtIn) { showCustomNotification('Uyarı', 'Yerleşik modüller silinemez.'); return; }
            askCustomConfirmation('Modülü Sil', 'Bu modül ve ayarları kalıcı olarak silinecek. Emin misiniz?', function() {
                moduleSettingsPushUndo();
                const el = panoModuleEl(id);
                if (el && el.parentNode) el.parentNode.removeChild(el);
                if (appConfig.panoLayout) delete appConfig.panoLayout[id];
                appConfig.customModuleDefs = (appConfig.customModuleDefs || []).filter(d => d.id !== id);
                if (appConfig.moduleSettings) delete appConfig.moduleSettings[id];
                _rebuildModuleDefs();
                moduleSettingsAutoSave();
                renderAdminModuleSettings();
                writeCMSLog('Modül silindi: ' + id);
            });
        }


        // Modül adını (label) inline düzenle
        function moduleSettingsRenameLabel(id, newLabel) {
            const ci = (appConfig.customModuleDefs || []).findIndex(d => d.id === id);
            if (ci >= 0) appConfig.customModuleDefs[ci].label = newLabel;
            _rebuildModuleDefs();
        }

        let editingBirthdayIndex = -1;
        let editingAnnouncementIndex = -1;
        let editingMarqueeIndex = -1;
        let selectedBirthdayIndices = new Set(); // Toplu silme için seçilen doğum günü satır indeksleri
        let selectedSpecialDayIndices = new Set(); // Toplu silme için seçilen belirli gün/hafta satır indeksleri
        let selectedQuoteIndices = new Set(); // Toplu silme için seçilen söz satır indeksleri
        let editingSpecialDayIndex = -1;
        let editingQuoteIndex = -1;
        // AYIN ENLERİ: hangi alanın (kategori id) hangi kaydının düzenlendiğini tutar
        let achievementEditing = { catId: null, index: -1 };
        // AYIN ENLERİ: dosyadan (bilgisayardan) seçilip henüz eklenmemiş görsel (base64) - catId -> dataURL
        let achievementPendingFile = {};
        let editingMediaSlideIndex = -1;
        let cyclingIntervalTimers = {}; // Süreli (döngüsel) modüllerin setInterval id'lerini tutar

        let activeScheduleGroup = 1; 
        let birthdayCycleIndex = 0;
        let quoteCycleIndex = 0;
        let specialDayCycleIndex = 0;
        let activeMediaSlideIndex = 0;
        let achievementActiveIndex = {}; // catId -> aktif slayt indeksi
        let activeAdminEditClass = "1/A"; 

        let tempAchievementCategories = []; // Admin panelinde düzenlenen çalışma kopyası

        let tempAnnouncements = [...appConfig.announcements];
        let tempMarqueeItems = [...(appConfig.marqueeItems || [])];
        let tempBirthdays = [...appConfig.birthdays];
        let tempQuotes = [...(appConfig.quotes || [])];
        let tempSpecialDays = [...appConfig.specialDays];
        let tempSpecialDayEmptyImage = ""; // Admin panelinde düzenlenen "boşken gösterilecek görsel" çalışma kopyası
        let tempMediaPlaylist = [...(appConfig.mediaPlaylist || [])];

        // İki pano arasında geçiş yapıldığında hedef ekranın da gerçek (OS düzeyinde)
        // tam ekranda açılmasını sağlar. Tarayıcılar requestFullscreen()'i SADECE bir
        // kullanıcı etkileşimi (tıklama/tuş) sırasında/hemen sonrasında kabul eder;
        // sayfa yeni yüklendiğinde otomatik çağrı çoğu tarayıcıda sessizce reddedilir.
        // Bu yüzden SADECE ilk tıklamada değil — kullanıcı SAATE TIKLAYIP MANUEL
        // OLARAK ÇIKMADIĞI sürece HER tıklama/dokunuş/tuşta tam ekran olup olmadığı
        // kontrol edilir ve değilse yeniden istenir. Böylece "bir kere denedim, olmadı,
        // pes ettim" durumu yaşanmaz: kullanıcı panoya her dokunduğunda (ör. TV
        // kumandasıyla rastgele bir tuşa basıldığında) sistem tam ekranı yeniden kurar.
        let fsAutoEnforce = true; // false olursa (saate tıklayıp manuel çıkınca) enforcement durur
        function isRealFullscreen() {
            return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
        }
        function requestRealFullscreen() {
            if (isRealFullscreen()) return;
            const el = document.documentElement;
            const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
            if (req) {
                const r = req.call(el);
                if (r && r.catch) r.catch(() => {});
            }
        }
        function armFullscreenPersistent() {
            const handler = () => {
                if (fsAutoEnforce && !isRealFullscreen()) requestRealFullscreen();
            };
            // {once:true} KULLANILMIYOR — manuel çıkış olana kadar her etkileşimde
            // yeniden denenir (bkz. yukarıdaki açıklama).
            document.addEventListener('click', handler);
            document.addEventListener('keydown', handler);
            document.addEventListener('touchstart', handler);
        }

        window.onload = function() {
            ieInitDragHandlers();
            writeCMSLog("Pano sistemi başarıyla başlatıldı.");
            appConfig.theme = appConfig.theme || 'standard';
            appConfig.themeMode = appConfig.themeMode || 'dark';
            ensureAllCustomModuleCards();
            renderThemeClasses();
            applyModuleSettingsToDashboard();
            renderPanoData();
            applyMediaCaptionStyle();
            startPanoClocksAndIntervals();
            fetchLiveWeather();
            buildAdminClassSelector();
            panoInitLayout();
            panoRenderTemplateList();
            panoRenderSavedLayoutsList();
            panoRenderModuleSizeList();

            requestRealFullscreen();
            armFullscreenPersistent();

            // BULUT SENKRONİZASYONU: önce mevcut yerel veriyle yukarıda ANINDA çizim yapıldı;
            // SUPABASE_CONFIG doldurulmuşsa, arka planda buluttan daha güncel bir kayıt olup
            // olmadığı kontrol edilir ve gerçek zamanlı dinleyici başlatılır.
            if (CLOUD_SYNC_ENABLED) {
                writeCMSLog("Bulut senkronizasyonu etkin, buluttaki veriler kontrol ediliyor...");
                cloudSyncPullOnce();
                cloudSyncStartListening();
                displayControlStartPolling();
            }

            document.addEventListener('keydown', function(e) {
                if (IS_DISPLAY_MODE) return; // TV/kiosk modunda yönetim paneli tuşla açılamaz
                if (e.key === 'a' || e.key === 'A') {
                    const isModalOpen = !document.getElementById('admin-panel').classList.contains('hidden') || 
                                        !document.getElementById('pin-prompt-modal').classList.contains('hidden');
                    if (!isModalOpen) tryOpenAdminPanel();
                }
            });

            // Kayan yazının hız hesaplaması gerçek piksel genişliğine dayandığından,
            // pencere/ekran boyutu değiştiğinde (ör. tam ekrana geçiş) yeniden çizilmesi gerekir.
            let marqueeResizeTimer = null;
            window.addEventListener('resize', function() {
                clearTimeout(marqueeResizeTimer);
                marqueeResizeTimer = setTimeout(renderMarqueeWidget, 200);
            });
            document.addEventListener('fullscreenchange', function() { setTimeout(renderMarqueeWidget, 250); });
            document.addEventListener('webkitfullscreenchange', function() { setTimeout(renderMarqueeWidget, 250); });
        };

        function writeCMSLog(message) {
            const consoleEl = document.getElementById('cms-log-console');
            if (!consoleEl) return;
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            const logItem = document.createElement('div');
            logItem.className = 'text-slate-400 font-mono text-[10px]';
            logItem.innerHTML = `<span class="text-slate-500">[${timeStr}]</span> ${message}`;
            consoleEl.appendChild(logItem);
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }

        function clearCMSLogs() {
            document.getElementById('cms-log-console').innerHTML = '';
        }

        let confirmCallback = null;

        function showCustomNotification(title, message) {
            document.getElementById('custom-alert-title').innerText = title;
            document.getElementById('custom-alert-message').innerText = message;
            document.getElementById('custom-alert-overlay').style.display = 'flex';
        }

        function closeCustomAlert() {
            document.getElementById('custom-alert-overlay').style.display = 'none';
        }

        function askCustomConfirmation(title, message, onConfirm) {
            document.getElementById('custom-confirm-title').innerText = title;
            document.getElementById('custom-confirm-message').innerText = message;
            confirmCallback = onConfirm;
            document.getElementById('custom-confirm-overlay').style.display = 'flex';
        }

        document.getElementById('custom-confirm-cancel-btn').onclick = function() {
            document.getElementById('custom-confirm-overlay').style.display = 'none';
            confirmCallback = null;
        };

        document.getElementById('custom-confirm-ok-btn').onclick = function() {
            document.getElementById('custom-confirm-overlay').style.display = 'none';
            if (confirmCallback) confirmCallback();
            confirmCallback = null;
        };

        // ==========================================================================
        // KAYAN YAZI (MARQUEE) — RENDER MOTORU
        // ==========================================================================

        // Mesajlar arasına konacak ayırıcının HTML'ini üretir (nokta/çizgi/yıldız/özel ikon/yok)
        // ÖNEMLİ: Öğeler arası boşluk (mw.gap) burada, ayırıcının kendi margin'i olarak
        // uygulanır — track'e (üst kapsayıcıya) column-gap olarak DEĞİL. Çünkü track'in
        // doğrudan çocukları sadece 2 tane (.marquee-seg x2, bkz. buildMarqueeTrack) ve
        // aralarına column-gap koymak yalnızca o TEK sınırda ekstra boşluk yaratır; döngü
        // (son öğeden ilk öğeye dönüş) noktasında ise bu boşluk olmadığından iki kopya
        // arasında genişlik uyuşmazlığı oluşur ve kayan yazı her turda "sıçrayarak" /
        // aniden atlayarak görünür. Boşluğu her ayırıcıya (dolayısıyla her öğe arasına,
        // döngü noktası dahil) eşit şekilde uygulamak bu sıçramayı ortadan kaldırır.
        function marqueeSeparatorHtml(mw) {
            const gap = (mw && mw.gap != null) ? mw.gap : 60;
            const half = gap / 2;
            const sep = (mw && mw.separator) || 'dot';
            if (sep === 'none') return `<span class="marquee-sep" style="margin:0 ${half}px;"></span>`;
            if (sep === 'pipe') return `<span class="marquee-sep" style="margin:0 ${half}px;">|</span>`;
            if (sep === 'star') return `<span class="marquee-sep" style="margin:0 ${half}px;"><i class="fa-solid fa-star"></i></span>`;
            if (sep === 'icon') return `<span class="marquee-sep" style="margin:0 ${half}px;"><i class="fa-solid ${(mw.separatorIcon || 'fa-circle').replace(/"/g, '')}"></i></span>`;
            return `<span class="marquee-sep" style="margin:0 ${half}px;">•</span>`;
        }

        // Tek bir kayan yazı mesajının HTML'ini üretir (kendi rengi/kalın/italik/ikonu ile)
        function renderMarqueeItemHtml(item) {
            const styleParts = [];
            if (item.color) styleParts.push(`color:${item.color}`);
            if (item.bold) styleParts.push('font-weight:700');
            if (item.italic) styleParts.push('font-style:italic');
            const iconHtml = item.icon ? `<i class="fa-solid ${item.icon.replace(/"/g, '')}"></i>` : '';
            return `<span class="marquee-item" style="${styleParts.join(';')}">${iconHtml}<span>${escapeHtml(item.text)}</span></span>`;
        }

        // Verilen mesaj listesi + ayarlara göre bir marquee-track içeriğini kurar ve
        // hıza göre animasyon süresini hesaplayıp verilen track/viewport elemanlarına uygular.
        // trackEl/viewportEl parametreleri sayesinde hem gerçek pano kartında hem de
        // yönetim panelindeki canlı önizlemede aynı fonksiyon kullanılabilir.
        function buildMarqueeTrack(trackEl, viewportEl, items, mw) {
            if (!trackEl) return;
            const list = (items && items.length > 0) ? items : [{ text: 'Kayan yazı için mesaj ekleyin.', color: '', bold: false, italic: false, icon: '' }];
            const sepHtml = marqueeSeparatorHtml(mw);
            const itemsHtml = list.map(renderMarqueeItemHtml).join(sepHtml);
            const segHtml = itemsHtml + sepHtml;

            trackEl.innerHTML = `<span class="marquee-seg">${segHtml}</span><span class="marquee-seg" aria-hidden="true">${segHtml}</span>`;

            trackEl.style.fontSize = (mw.fontSize || 16) + 'px';
            trackEl.style.fontWeight = mw.bold ? '700' : '400';
            trackEl.style.fontStyle = mw.italic ? 'italic' : 'normal';
            trackEl.style.color = mw.textColor || '';
            trackEl.style.textTransform = mw.uppercase ? 'uppercase' : 'none';
            trackEl.style.letterSpacing = (mw.letterSpacing || 0) + 'px';
            // Not: Öğeler arası boşluk artık marqueeSeparatorHtml() içinde her ayırıcının
            // kendi margin'i olarak veriliyor (bkz. yukarıdaki not). Track'e column-gap
            // uygulanmıyor; aksi halde iki .marquee-seg kopyası arasındaki tek sınırda
            // fazladan boşluk oluşup döngü noktasında sıçramaya (aniden atlamaya) yol açar.

            if (mw.glowEnabled) {
                trackEl.classList.add('marquee-glow-text');
                trackEl.style.setProperty('--marquee-glow-color', mw.glowColor || '#00e5ff');
            } else {
                trackEl.classList.remove('marquee-glow-text');
                trackEl.style.removeProperty('--marquee-glow-color');
            }

            if (viewportEl) viewportEl.classList.toggle('marquee-paused-hover', mw.pauseOnHover !== false);

            // Hıza göre animasyon süresini gerçek (render edilmiş) genişliğe bakarak hesapla.
            // Bir sonraki animasyon karesinde ölçmek, tarayıcının layout'u oturtmuş
            // olmasını garanti eder (0 genişlik okuma riskini önler).
            requestAnimationFrame(() => {
                const segEl = trackEl.querySelector('.marquee-seg');
                const segWidth = segEl ? segEl.getBoundingClientRect().width : 400;
                const speed = Math.max(5, mw.speed || 60);
                const duration = Math.max(3, segWidth / speed);
                trackEl.style.animationDuration = duration + 's';
                trackEl.style.animationDirection = (mw.direction === 'right') ? 'reverse' : 'normal';
                trackEl.style.animationPlayState = 'running';
            });
        }

        // Panodaki gerçek Kayan Yazı kartını, appConfig'teki güncel veriyle çizer.
        function renderMarqueeWidget() {
            const track = document.getElementById('marquee-track');
            const viewport = document.getElementById('marquee-viewport');
            if (!track) return;
            const mw = appConfig.marqueeWidget || defaultAppConfig.marqueeWidget;
            const items = (appConfig.marqueeItems && appConfig.marqueeItems.length > 0) ? appConfig.marqueeItems : defaultAppConfig.marqueeItems;
            buildMarqueeTrack(track, viewport, items, mw);
        }

        function renderPanoData() {
            applyBrandPositions();
            applyBrandChrome();
            document.getElementById('display-school-name').innerText = appConfig.schoolName;
            document.getElementById('display-school-name').style.fontSize = (appConfig.schoolNameSize || 24) + 'px';
            document.getElementById('display-school-name').style.fontFamily = appConfig.schoolNameFont || defaultAppConfig.schoolNameFont;
            document.getElementById('display-brand-sub').innerText = appConfig.brandSubText || defaultAppConfig.brandSubText;
            document.getElementById('display-brand-sub').style.display = (appConfig.brandSubVisible === false) ? 'none' : '';

            const logoBox = document.getElementById('brand-logo-box');
            const logoImg = document.getElementById('brand-logo-img');
            const logoText = document.getElementById('brand-logo-text');
            const logoSize = (appConfig.logoSize || 54) + 'px';
            logoBox.style.width = logoSize;
            logoBox.style.height = logoSize;
            logoText.style.fontSize = Math.round((appConfig.logoSize || 54) * 0.48) + 'px';
            logoBox.style.transform = `translateX(${appConfig.logoOffsetX || 0}px)`;
            document.getElementById('brand-name-block').style.transform = `translateX(${appConfig.nameOffsetX || 0}px)`;
            if (appConfig.schoolLogo) {
                logoImg.src = appConfig.schoolLogo;
                logoImg.classList.remove('hidden');
                logoText.classList.add('hidden');
                logoBox.classList.add('has-image');
                applyImageFrameStyle(logoImg, appConfig.logoFrame || defaultAppConfig.logoFrame);
            } else {
                logoImg.classList.add('hidden');
                logoImg.src = '';
                logoText.classList.remove('hidden');
                logoText.innerText = appConfig.schoolName ? appConfig.schoolName.charAt(0) : 'M';
                logoBox.classList.remove('has-image');
            }
            renderAchievementsCard();
            (appConfig.achievementCategories || []).filter(cat => cat.active !== false).forEach(cat => cycleAchievementCategory(cat.id));
            cycleMediaSlides();
            renderActiveDuties();

            const annListContainer = document.getElementById('display-announcements-list');
            annListContainer.innerHTML = '';
            const anns = appConfig.announcements && appConfig.announcements.length > 0 ? appConfig.announcements : [{ text: 'Duyuru bulunmamaktadır.', color: '', bgColor: '', font: '', fontSize: 11, bold: false }];
            anns.slice(0, 4).forEach(ann => {
                const item = document.createElement('div');
                item.className = 'ann-item';
                const styleParts = [];
                if (ann.color) styleParts.push(`color:${ann.color}`);
                if (ann.font) styleParts.push(`font-family:${ann.font}`);
                if (ann.fontSize) styleParts.push(`font-size:${ann.fontSize}px`);
                if (ann.bold) styleParts.push(`font-weight:700`);
                if (ann.bgColor) styleParts.push(`background-color:${ann.bgColor}`, `padding:4px 6px`, `border-radius:6px`);
                item.setAttribute('style', styleParts.join(';'));
                item.innerHTML = `<i class="fa-solid fa-diamond"></i> <span>${escapeHtml(ann.text)}</span>`;
                annListContainer.appendChild(item);
            });

            renderBellHoursTable();

            cycleBirthdayWidget();
            cycleQuoteWidget();
            renderSpecialDayWeatherLayout();
            cycleSpecialDayWidget();
            applyScheduleBoardStyle();
            applyClockStyle();
            renderActiveScheduleGroup();
            renderMarqueeWidget();
        }

        function applyBrandPositions() {
            const logoPos = appConfig.logoPosition || 'left';
            const namePos = appConfig.namePosition || 'left';
            const logoBox = document.getElementById('brand-logo-box');
            const nameBlock = document.getElementById('brand-name-block');
            const zoneLogo = document.getElementById('brand-zone-' + logoPos);
            const zoneName = document.getElementById('brand-zone-' + namePos);
            if (zoneLogo && logoBox && logoBox.parentElement !== zoneLogo) zoneLogo.appendChild(logoBox);
            if (zoneName && nameBlock && nameBlock.parentElement !== zoneName) zoneName.appendChild(nameBlock);
        }

        // Okul Tanıtım & Kimlik çubuğunun (.school-brand) çerçeve/arkaplan/efekt görünümünü
        // appConfig'teki (veya geçici admin form) değerlere göre uygular. Hem gerçek panodaki
        // çubuğa hem de yönetim panelindeki canlı önizleme kutusuna (aynı .school-brand
        // sınıfını taşıdığı için) aynı anda yansır.
        function applyBrandChrome(cfgOverride, targetEls) {
            const cfg = cfgOverride || appConfig;
            const elements = targetEls || document.querySelectorAll('#brand-dashboard-card .school-brand');
            if (!elements.length) return;

            const borderStyle = cfg.brandBorderStyle || 'solid';
            const borderColor = cfg.brandBorderColor || '#00b4d8';
            const borderWidthNum = (cfg.brandBorderWidth !== undefined && cfg.brandBorderWidth !== null) ? parseInt(cfg.brandBorderWidth, 10) : 2;

            const bgType = cfg.brandBgType || 'gradient';
            const bgColor1 = cfg.brandBgColor1 || '#09101f';
            const bgColor2 = cfg.brandBgColor2 || '#0d1b35';

            const effect = cfg.brandEffect || 'glow';

            let bg;
            if (bgType === 'solid') {
                bg = bgColor1;
            } else if (bgType === 'none') {
                bg = 'transparent';
            } else {
                bg = `linear-gradient(135deg, ${bgColor1} 0%, ${bgColor2} 100%)`;
            }
            // Cam (glassmorphism) efektinde arkaplanı yarı saydam yaparak blur'un görünür olmasını sağla
            if (effect === 'glass' && bgType !== 'none') {
                bg = hexToRgba(bgType === 'solid' ? bgColor1 : bgColor1, 0.5);
            }

            let shadow, shadowHover, backdrop = '';
            if (effect === 'shadow') {
                shadow = '0 6px 18px rgba(0, 0, 0, 0.45)';
                shadowHover = '0 8px 24px rgba(0, 0, 0, 0.55)';
            } else if (effect === 'glass') {
                shadow = '0 8px 24px rgba(0, 0, 0, 0.35)';
                shadowHover = '0 10px 28px rgba(0, 0, 0, 0.45)';
                backdrop = 'blur(12px)';
            } else if (effect === 'flat') {
                shadow = 'none';
                shadowHover = 'none';
            } else { // glow (varsayılan)
                shadow = `0 0 15px ${hexToRgba(borderColor, 0.3)}`;
                shadowHover = `0 0 25px ${hexToRgba(borderColor, 0.5)}`;
            }

            elements.forEach(el => {
                el.classList.remove('brand-fx-glass');
                if (effect === 'glass') el.classList.add('brand-fx-glass');
                el.style.setProperty('--brand-border-style', borderStyle === 'none' ? 'none' : borderStyle);
                el.style.setProperty('--brand-border-color', borderColor);
                el.style.setProperty('--brand-border-width', (borderStyle === 'none' ? 0 : borderWidthNum) + 'px');
                el.style.setProperty('--brand-bg', bg);
                el.style.setProperty('--brand-shadow', shadow);
                el.style.setProperty('--brand-shadow-hover', shadowHover);
                el.style.backdropFilter = backdrop;
                el.style.webkitBackdropFilter = backdrop;
            });
        }

        let tempSchoolLogo = null;

        function handleLogoUpload(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
                showCustomNotification("Dosya Çok Büyük", "Lütfen 2MB'tan küçük bir görsel dosyası seçin.");
                event.target.value = '';
                return;
            }
            openImageEditor(file, { aspect: 1 }, function (editedDataUrl) {
                event.target.value = '';
                if (!editedDataUrl) return; // kullanıcı iptal etti
                const dataUrl = editedDataUrl;
                tempSchoolLogo = dataUrl;
                const previewImg = document.getElementById('logo-preview-img');
                const previewText = document.getElementById('logo-preview-text');
                previewImg.src = tempSchoolLogo;
                previewImg.classList.remove('hidden');
                previewText.classList.add('hidden');
                writeCMSLog("Yeni okul logosu düzenlendi/seçildi (kaydetmeyi unutmayın).");

                // Arka planda buluta yükle: bitince (hâlâ aynı görsel seçiliyse) küçük bir
                // bağlantıyla (URL) değiştirilir, böylece kaydedilen veri hafif kalır.
                const editedFile = dataUrlToFile(dataUrl, 'logo.jpg');
                uploadImageFileToCloud(editedFile, 'logo').then(url => {
                    if (url && tempSchoolLogo === dataUrl) {
                        tempSchoolLogo = url;
                        writeCMSLog("Logo buluta yüklendi (hafif bağlantı olarak kaydedilecek).");
                    }
                });
            });
        }


        function removeSchoolLogo() {
            tempSchoolLogo = "";
            const previewImg = document.getElementById('logo-preview-img');
            const previewText = document.getElementById('logo-preview-text');
            previewImg.classList.add('hidden');
            previewImg.src = '';
            previewText.classList.remove('hidden');
            document.getElementById('school-logo-input').value = '';
        }

        function handleLiveIdentityPreview() {
            const logoSize = document.getElementById('input-logo-size').value;
            const nameSize = document.getElementById('input-school-name-size').value;
            document.getElementById('logo-size-value').innerText = logoSize + 'px';
            document.getElementById('school-name-size-value').innerText = nameSize + 'px';
            const previewBox = document.getElementById('logo-preview-box');
            previewBox.style.width = logoSize + 'px';
            previewBox.style.height = logoSize + 'px';
            document.getElementById('logo-preview-text').style.fontSize = Math.round(logoSize * 0.48) + 'px';

            const logoOffset = document.getElementById('input-logo-offset').value;
            const nameOffset = document.getElementById('input-name-offset').value;
            document.getElementById('logo-offset-value').innerText = logoOffset + 'px';
            document.getElementById('name-offset-value').innerText = nameOffset + 'px';

            const borderWidthEl = document.getElementById('input-brand-border-width');
            if (borderWidthEl) document.getElementById('brand-border-width-value').innerText = borderWidthEl.value + 'px';

            // Okul Tanıtım & Kimlik canlı önizleme kutusunu (kaydedilmemiş) form değerleriyle güncelle
            const previewLogoBox = document.getElementById('preview-logo-box2');
            const previewLogoImg = document.getElementById('preview-logo-img2');
            const previewLogoText = document.getElementById('preview-logo-text2');
            const previewName = document.getElementById('preview-brand-name2');
            if (previewLogoBox) {
                previewLogoBox.style.width = logoSize + 'px';
                previewLogoBox.style.height = logoSize + 'px';
                previewLogoText.style.fontSize = Math.round(logoSize * 0.48) + 'px';
                const logoSrc = (tempSchoolLogo !== null) ? tempSchoolLogo : (appConfig.schoolLogo || '');
                if (logoSrc) {
                    previewLogoImg.src = logoSrc;
                    previewLogoImg.classList.remove('hidden');
                    previewLogoText.classList.add('hidden');
                    previewLogoBox.classList.add('has-image');
                } else {
                    previewLogoImg.classList.add('hidden');
                    previewLogoText.classList.remove('hidden');
                    previewLogoBox.classList.remove('has-image');
                }
            }
            if (previewName) {
                const nameVal = document.getElementById('input-school-name').value || appConfig.schoolName || '';
                previewName.innerText = nameVal;
                previewName.style.fontSize = nameSize + 'px';
                previewName.style.fontFamily = document.getElementById('input-name-font').value || defaultAppConfig.schoolNameFont;
                if (previewLogoText) previewLogoText.innerText = nameVal ? nameVal.charAt(0) : 'M';
            }
            const previewSub = document.getElementById('preview-brand-sub2');
            if (previewSub) {
                const subInput = document.getElementById('input-brand-sub');
                const subVisibleEl = document.getElementById('input-brand-sub-visible');
                previewSub.innerText = (subInput.value || defaultAppConfig.brandSubText);
                previewSub.style.display = (subVisibleEl && !subVisibleEl.checked) ? 'none' : '';
            }

            const tempCfg = {
                brandBorderStyle: document.getElementById('input-brand-border-style').value,
                brandBorderColor: document.getElementById('input-brand-border-color').value,
                brandBorderWidth: document.getElementById('input-brand-border-width').value,
                brandBgType: document.getElementById('input-brand-bg-type').value,
                brandBgColor1: document.getElementById('input-brand-bg-color1').value,
                brandBgColor2: document.getElementById('input-brand-bg-color2').value,
                brandEffect: document.getElementById('input-brand-effect').value
            };
            applyBrandChrome(tempCfg, document.querySelectorAll('#brand-live-preview-box'));
        }

        function getTurkishDayName(dayIndex) {
            const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
            return days[dayIndex];
        }

        // Eski sabit haftalık nöbet alanları (weeklyDuties) ile yeni dinamik nöbet yeri id'leri
        // arasındaki eşleşme — sadece varsayılan (fabrika) nöbet yerleri için geçerlidir.
        // Kullanıcının sonradan eklediği yeni nöbet yerlerinin haftalık tabloda karşılığı yoktur.
        const DUTY_LEGACY_WEEKLY_MAP = { idareci: 'admin', kantin: 'canteen', bahce: 'garden', kat1: 'floor1', kat2: 'floor2' };

        // Hex rengi rgba() string'ine çevirir (aktif nöbetçi arka planı opaklık ayarı için)
        function hexToRgba(hex, alpha) {
            let h = (hex || '#00b4d8').replace('#', '');
            if (h.length === 3) h = h.split('').map(c => c + c).join('');
            const r = parseInt(h.substring(0, 2), 16) || 0;
            const g = parseInt(h.substring(2, 4), 16) || 0;
            const b = parseInt(h.substring(4, 6), 16) || 0;
            return `rgba(${r},${g},${b},${alpha})`;
        }

        // Verilen hex rengin üzerine yazılacak metin için siyah mı beyaz mı daha okunaklı olduğunu hesaplar
        // (Düz Renk / Dolgu vurgu efektinde kullanılır)
        function getContrastTextColor(hex) {
            let h = (hex || '#ffb703').replace('#', '');
            if (h.length === 3) h = h.split('').map(c => c + c).join('');
            const r = parseInt(h.substring(0, 2), 16) || 0;
            const g = parseInt(h.substring(2, 4), 16) || 0;
            const b = parseInt(h.substring(4, 6), 16) || 0;
            const yiq = (r * 299 + g * 587 + b * 114) / 1000;
            return yiq >= 150 ? '#0f172a' : '#ffffff';
        }

        // Kadroda fotoğrafı/ikonu olmayan nöbetçiler için nöbet yerinin kendi rengi/ikonuyla
        // oluşturulan varsayılan (fallback) avatar HTML'i.
        function buildFallbackAvatarHtml(pos) {
            return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${pos.color}22;"><i class="fa-solid ${pos.icon || 'fa-user-shield'}" style="color:${pos.color};font-size:20px;"></i></div>`;
        }

        // İsme göre kadrodan (teacherRoster) fotoğraf/ikon bulup avatar HTML'i üretir.
        // Kadroda kayıt yoksa veya fotoğraf/ikon seçilmemişse nöbet yerinin varsayılan ikonuna döner.
        function getRosterAvatarHtml(name, fallbackHtml) {
            const key = (name || '').trim();
            const entry = key && appConfig.teacherRoster ? appConfig.teacherRoster[key] : null;
            if (entry && entry.photo) {
                const frameStyle = imageFrameStyleString(appConfig.rosterPhotoFrame || defaultAppConfig.rosterPhotoFrame);
                return `<img src="${entry.photo}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;${frameStyle}">`;
            }
            if (entry && entry.icon) {
                return `<span style="font-size:22px;line-height:1;">${entry.icon}</span>`;
            }
            return fallbackHtml;
        }

        // Tek bir nöbet kartının HTML'ini, güncel appConfig.dutyStyle ayarlarına göre üretir.
        // Hem canlı pano hem de yönetim panelindeki "Canlı Önizleme" tarafından kullanılır.
        function buildDutyCardHtml(pos, name) {
            const style = (appConfig.dutyStyle) || defaultAppConfig.dutyStyle;
            const activeBg = style.activeBg || defaultAppConfig.dutyStyle.activeBg;
            const shapeClass = 'duty-shape-' + (style.shape || 'rounded');
            const hasName = !!(name && name.trim());
            const highlight = activeBg.highlight || 'none';
            const stateClass = hasName ? `duty-active duty-highlight-${highlight}` : 'duty-empty';
            const opacity = (typeof activeBg.opacity === 'number' ? activeBg.opacity : 15) / 100;
            const boxStyle = hasName
                ? `background-color:${hexToRgba(activeBg.color, opacity)}; --duty-highlight-color:${activeBg.color}; border-color:${pos.color}55;`
                : `border-color:${pos.color}33;`;
            const nameStyle = style.nameColorMode === 'custom' ? `color:${style.nameColor || '#02040a'};` : '';
            const avatarHtml = getRosterAvatarHtml(name, buildFallbackAvatarHtml(pos));

            return `
                <div class="duty-card-box ${shapeClass} ${stateClass}" style="${boxStyle}">
                    <div class="duty-avatar-box ${shapeClass}" style="border-color:${pos.color};">${avatarHtml}</div>
                    <div class="duty-info-box">
                        <div class="duty-title" style="color:${pos.color};"><i class="fa-solid ${pos.icon || 'fa-user-shield'}"></i> ${escapeHtml(pos.label)}</div>
                        <div class="duty-name-pill ${shapeClass}" style="${nameStyle}">${escapeHtml(hasName ? name : 'Nöbet Yok')}</div>
                    </div>
                </div>`;
        }

        function renderActiveDuties() {
            const now = new Date();
            let dayName = getTurkishDayName(now.getDay());

            if (dayName === "Cumartesi" || dayName === "Pazar") {
                dayName = "Pazartesi";
            }

            const dayNameEl = document.getElementById('display-duty-day-name');
            if (dayNameEl) dayNameEl.innerText = dayName.toUpperCase();

            // Önce aylık nöbet tablosuna bak (daha öncelikli)
            let gunKayit = null;
            const ayAnahtar = nobetAyAnahtari ? nobetAyAnahtari(now.getFullYear(), now.getMonth()) : null;
            if (ayAnahtar && appConfig.aylikNobet && appConfig.aylikNobet[ayAnahtar]) {
                gunKayit = appConfig.aylikNobet[ayAnahtar][String(now.getDate())] || null;
            }
            const weeklyFallback = appConfig.weeklyDuties[dayName] || {};

            const grid = document.getElementById('duty-grid-container');
            if (!grid) return;
            const positions = appConfig.dutyPositions || [];

            grid.innerHTML = positions.map(pos => {
                let name = gunKayit ? (gunKayit[pos.id] || '') : '';
                if (!name) {
                    const legacyKey = DUTY_LEGACY_WEEKLY_MAP[pos.id];
                    if (legacyKey) name = weeklyFallback[legacyKey] || '';
                }
                return buildDutyCardHtml(pos, name);
            }).join('');

            // Gelişmiş görsel ayarları uygula
            if (appConfig.dutyAdvancedSettings) {
                applyDutyAdvancedStyleToGrid(grid, positions, appConfig.dutyAdvancedSettings, appConfig.dutyStyle);
                // Modül başlığını güncelle
                const adv = appConfig.dutyAdvancedSettings;
                if (adv.moduleTitle) {
                    const titleEl = document.getElementById('display-duty-title-text');
                    if (titleEl) titleEl.innerText = adv.moduleTitle;
                }
            }
        }

        /* =========================================
           NÖBETÇİ KADROSU (Fotoğraf / İkon) YÖNETİMİ
        ========================================= */
        const ROSTER_ICON_CHOICES = [
            { v: '👨‍🏫', l: 'Öğretmen (E)' },
            { v: '👩‍🏫', l: 'Öğretmen (K)' },
            { v: '🧑‍💼', l: 'İdareci' },
            { v: '👮‍♂️', l: 'Nöbetçi (E)' },
            { v: '👮‍♀️', l: 'Nöbetçi (K)' },
            { v: '🧑', l: 'Kişi' },
            { v: '😀', l: 'Gülümseme' }
        ];

        function escapeHtml(s) {
            return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        }

        // Sürükle-bırak sırasında hangi kadro kartının taşındığını tutar
        let rosterDragFromIndex = null;

        // appConfig.rosterOrder'ı gerçek teacherRoster kayıtlarıyla senkron eder:
        // silinmiş isimleri listeden çıkarır, henüz sırada olmayan (yeni eklenen) isimleri sona ekler.
        function getOrderedRosterNames() {
            if (!appConfig.teacherRoster) appConfig.teacherRoster = {};
            if (!Array.isArray(appConfig.rosterOrder)) appConfig.rosterOrder = [];
            const allNames = Object.keys(appConfig.teacherRoster);
            const allSet = new Set(allNames);

            // Sırada olup artık kadroda olmayanları temizle
            appConfig.rosterOrder = appConfig.rosterOrder.filter(n => allSet.has(n));

            // Sırada henüz yer almayan (yeni eklenen) isimleri alfabetik olarak sona ekle
            const orderedSet = new Set(appConfig.rosterOrder);
            const missing = allNames.filter(n => !orderedSet.has(n)).sort((a, b) => a.localeCompare(b, 'tr'));
            appConfig.rosterOrder.push(...missing);

            return appConfig.rosterOrder.slice();
        }

        function renderRosterList() {
            const wrap = document.getElementById('roster-list');
            if (!wrap) return;
            if (!appConfig.teacherRoster) appConfig.teacherRoster = {};
            const names = getOrderedRosterNames();

            if (names.length === 0) {
                wrap.innerHTML = `<div class="text-slate-500 text-xs italic p-3 col-span-full">Henüz kadroya öğretmen eklenmedi. Yukarıdan isim girip "Ekle" deyin ya da "Çizelgeden Otomatik Doldur" düğmesini kullanın.</div>`;
                return;
            }

            wrap.innerHTML = names.map((name, idx) => {
                const entry = appConfig.teacherRoster[name] || {};
                const thumb = entry.photo
                    ? `<img src="${entry.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
                    : (entry.icon ? `<span style="font-size:20px;">${entry.icon}</span>` : `<i class="fa-solid fa-user text-slate-500"></i>`);
                const iconOptions = ROSTER_ICON_CHOICES.map(ic =>
                    `<option value="${ic.v}" ${entry.icon === ic.v ? 'selected' : ''}>${ic.v} ${ic.l}</option>`
                ).join('');

                return `
                <div class="roster-row bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center gap-2" draggable="true" data-index="${idx}" data-name="${escapeHtml(name)}">
                    <span class="roster-drag-handle" title="Sürükle"><i class="fa-solid fa-grip-vertical"></i></span>
                    <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">${thumb}</div>
                    <div class="flex-1 min-w-0">
                        <div class="text-white text-xs font-bold truncate mb-1">${escapeHtml(name)}</div>
                        <div class="flex items-center gap-1">
                            <label class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded text-[10px] cursor-pointer" title="Fotoğraf yükle">
                                <i class="fa-solid fa-upload"></i>
                                <input type="file" accept="image/*" class="hidden roster-photo-input">
                            </label>
                            <select class="roster-icon-select bg-slate-900 border border-slate-800 rounded text-[10px] text-white p-1" title="İkon seç">
                                <option value="">(ikon yok)</option>
                                ${iconOptions}
                            </select>
                            <button class="roster-remove-btn px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded text-[10px]" title="Kadrodan çıkar"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div>
                </div>`;
            }).join('');

            wrap.querySelectorAll('.roster-row').forEach(row => {
                const name = row.dataset.name;
                const idx = parseInt(row.dataset.index, 10);
                row.querySelector('.roster-photo-input').addEventListener('change', (e) => handleRosterPhotoUpload(name, e));
                row.querySelector('.roster-icon-select').addEventListener('change', (e) => {
                    appConfig.teacherRoster[name].icon = e.target.value;
                    if (e.target.value) appConfig.teacherRoster[name].photo = ''; // ikon seçilirse fotoğrafla karışmasın
                    renderRosterList();
                    writeCMSLog(`"${name}" için ikon güncellendi (kaydetmeyi unutmayın).`);
                });
                row.querySelector('.roster-remove-btn').addEventListener('click', () => {
                    delete appConfig.teacherRoster[name];
                    appConfig.rosterOrder = (appConfig.rosterOrder || []).filter(n => n !== name);
                    renderRosterList();
                    writeCMSLog(`"${name}" kadrodan çıkarıldı (kaydetmeyi unutmayın).`);
                });

                // Sürükle-bırak ile sıralama
                row.addEventListener('dragstart', () => { rosterDragFromIndex = idx; row.classList.add('dragging'); });
                row.addEventListener('dragend', () => { row.classList.remove('dragging'); wrap.querySelectorAll('.roster-row').forEach(r => r.classList.remove('drag-over-top', 'drag-over-bottom')); });
                row.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const rect = row.getBoundingClientRect();
                    const isTop = (e.clientY - rect.top) < rect.height / 2;
                    row.classList.toggle('drag-over-top', isTop);
                    row.classList.toggle('drag-over-bottom', !isTop);
                });
                row.addEventListener('dragleave', () => row.classList.remove('drag-over-top', 'drag-over-bottom'));
                row.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const rect = row.getBoundingClientRect();
                    const isTop = (e.clientY - rect.top) < rect.height / 2;
                    let targetIdx = idx + (isTop ? 0 : 1);
                    reorderRoster(rosterDragFromIndex, targetIdx);
                });
            });
        }

        // Kadro isim sırasını taşı ve yeniden çiz (appConfig.rosterOrder üzerinde çalışır)
        function reorderRoster(fromIdx, toIdx) {
            if (fromIdx === null || fromIdx === undefined || fromIdx === toIdx) { renderRosterList(); return; }
            const order = getOrderedRosterNames();
            const [item] = order.splice(fromIdx, 1);
            let insertAt = toIdx > fromIdx ? toIdx - 1 : toIdx;
            insertAt = Math.max(0, Math.min(insertAt, order.length));
            order.splice(insertAt, 0, item);
            appConfig.rosterOrder = order;
            rosterDragFromIndex = null;
            renderRosterList();
            writeCMSLog(`Kadro sırası güncellendi (kaydetmeyi unutmayın).`);
        }

        function addRosterTeacher() {
            const input = document.getElementById('roster-new-name');
            const name = input.value.trim();
            if (!name) return;
            if (!appConfig.teacherRoster) appConfig.teacherRoster = {};
            if (!appConfig.teacherRoster[name]) appConfig.teacherRoster[name] = { photo: '', icon: '' };
            input.value = '';
            renderRosterList();
            writeCMSLog(`"${name}" kadroya eklendi (kaydetmeyi unutmayın).`);
        }

        function handleRosterPhotoUpload(name, event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
                showCustomNotification("Dosya Çok Büyük", "Lütfen 2MB'tan küçük bir görsel dosyası seçin.");
                event.target.value = '';
                return;
            }
            openImageEditor(file, { aspect: 1 }, function (editedDataUrl) {
                event.target.value = '';
                if (!editedDataUrl) return; // kullanıcı iptal etti
                const dataUrl = editedDataUrl;
                if (!appConfig.teacherRoster[name]) appConfig.teacherRoster[name] = { photo: '', icon: '' };
                appConfig.teacherRoster[name].photo = dataUrl;
                appConfig.teacherRoster[name].icon = ''; // fotoğraf yüklenince ikon önceliğini bırak
                renderRosterList();
                writeCMSLog(`"${name}" için fotoğraf düzenlendi/seçildi (kaydetmeyi unutmayın).`);

                // Arka planda buluta yükle: bitince (hâlâ aynı fotoğraf seçiliyse) küçük bir
                // bağlantıyla (URL) değiştirilir, böylece kaydedilen veri hafif kalır.
                const editedFile = dataUrlToFile(dataUrl, 'nobetci.jpg');
                uploadImageFileToCloud(editedFile, 'nobetci-kadro').then(url => {
                    if (url && appConfig.teacherRoster[name] && appConfig.teacherRoster[name].photo === dataUrl) {
                        appConfig.teacherRoster[name].photo = url;
                        writeCMSLog(`"${name}" fotoğrafı buluta yüklendi (hafif bağlantı olarak kaydedilecek).`);
                    }
                });
            });
        }

        // Haftalık ve aylık nöbet çizelgelerinde geçen tüm isimleri tarar,
        // kadroda henüz olmayanları boş (fotoğrafsız/ikonsuz) olarak ekler.
        function autoFillRosterFromDuties() {
            if (!appConfig.teacherRoster) appConfig.teacherRoster = {};
            const found = new Set();

            Object.values(appConfig.weeklyDuties || {}).forEach(d => {
                ['admin', 'canteen', 'garden', 'floor1', 'floor2'].forEach(k => {
                    if (d[k] && d[k].trim()) found.add(d[k].trim());
                });
            });

            const dutyIds = (appConfig.dutyPositions || []).map(p => p.id);
            Object.values(appConfig.aylikNobet || {}).forEach(ay => {
                Object.values(ay || {}).forEach(gun => {
                    dutyIds.forEach(k => {
                        if (gun[k] && gun[k].trim()) found.add(gun[k].trim());
                    });
                });
            });

            let added = 0;
            found.forEach(name => {
                if (!appConfig.teacherRoster[name]) {
                    appConfig.teacherRoster[name] = { photo: '', icon: '' };
                    added++;
                }
            });

            renderRosterList();
            showCustomNotification("Tamamlandı", `${added} yeni öğretmen kadroya eklendi. Fotoğraf/ikon seçip kaydedin.`);
            writeCMSLog(`Çizelgeden otomatik doldurma: ${added} yeni kayıt eklendi.`);
        }

        /* =========================================================================
           NÖBET YERLERİ YÖNETİMİ (Dinamik Ekle / Sil / Sırala) VE
           NÖBET KARTI GÖRSEL ÖZELLEŞTİRME (Şablon / Şekil / Renk / Arka Plan)
           ========================================================================= */

        // Nöbet yeri ikonu seçimi için kullanılabilir FontAwesome ikon listesi
        const DUTY_ICON_CHOICES = [
            { v: 'fa-user-tie', l: 'İdareci' },
            { v: 'fa-cookie-bite', l: 'Kantin' },
            { v: 'fa-tree', l: 'Bahçe' },
            { v: 'fa-door-open', l: 'Zemin Kat / Giriş' },
            { v: 'fa-arrow-up-1-9', l: '1. Kat' },
            { v: 'fa-stairs', l: 'Merdiven / Kat' },
            { v: 'fa-user-shield', l: 'Genel Nöbetçi' },
            { v: 'fa-book-open', l: 'Kütüphane' },
            { v: 'fa-flask', l: 'Laboratuvar' },
            { v: 'fa-dumbbell', l: 'Spor Salonu' },
            { v: 'fa-bus', l: 'Servis / Otopark' },
            { v: 'fa-toilet', l: 'Tuvalet / Koridor' },
            { v: 'fa-utensils', l: 'Yemekhane' },
            { v: 'fa-gate', l: 'Bahçe Kapısı' },
            { v: 'fa-shield-halved', l: 'Güvenlik' }
        ];

        // En az 4 hazır görsel şablon: her biri kart şekli + isim rengi modu +
        // aktif nöbetçi arka plan rengi/opaklığı/vurgu şeklini bir arada uygular.
        const DUTY_STYLE_TEMPLATES = {
            classic: {
                label: 'Klasik Pano',
                desc: 'Orijinal hap-biçim isim etiketi, ince sol çubuk vurgu',
                style: { template: 'classic', shape: 'rounded', nameColorMode: 'auto', nameColor: '#02040a',
                    activeBg: { color: '#00b4d8', opacity: 15, highlight: 'left-bar' } }
            },
            cyberCard: {
                label: 'Cyber Kart',
                desc: 'Dikey kart tasarımı, neon parıltılı vurgu',
                style: { template: 'cyberCard', shape: 'card', nameColorMode: 'custom', nameColor: '#e2fbff',
                    activeBg: { color: '#00e5ff', opacity: 22, highlight: 'glow' } }
            },
            softOval: {
                label: 'Yumuşak Oval',
                desc: 'Oval/hap şekilli kartlar, alt çizgi vurgusu',
                style: { template: 'softOval', shape: 'oval', nameColorMode: 'auto', nameColor: '#02040a',
                    activeBg: { color: '#38b000', opacity: 18, highlight: 'underline' } }
            },
            minimalSquare: {
                label: 'Minimal Köşeli',
                desc: 'Keskin köşeli sade kartlar, kenarlık vurgusu',
                style: { template: 'minimalSquare', shape: 'square', nameColorMode: 'custom', nameColor: '#ffffff',
                    activeBg: { color: '#9d4edd', opacity: 20, highlight: 'border' } }
            },
            highContrast: {
                label: 'Yüksek Kontrast',
                desc: 'Belirgin sarı vurgu, vurgusuz sade kart zemini',
                style: { template: 'highContrast', shape: 'rounded', nameColorMode: 'custom', nameColor: '#02040a',
                    activeBg: { color: '#ffb703', opacity: 30, highlight: 'left-bar' } }
            }
        };

        let tempDutyPositions = [];
        let dutyDragFromIndex = null;

        function populateDutyIconSelect(selectEl, selectedIcon) {
            if (!selectEl) return;
            // Hem temel ikonları hem özel ikonları dahil et
            const all = (typeof getDutyIconList === 'function') ? getDutyIconList() : DUTY_ICON_CHOICES;
            selectEl.innerHTML = all.map(ic =>
                `<option value="${ic.v}" ${ic.v === selectedIcon ? 'selected' : ''}>${ic.l}</option>`
            ).join('');
        }

        function renderDutyPositionsAdmin() {
            const wrap = document.getElementById('dutypos-list');
            if (!wrap) return;
            wrap.innerHTML = '';

            tempDutyPositions.forEach((pos, idx) => {
                const row = document.createElement('div');
                row.className = 'dutypos-row';
                row.draggable = true;
                row.dataset.index = idx;
                row.innerHTML = `
                    <span class="dutypos-drag-handle" title="Sürükle"><i class="fa-solid fa-grip-vertical"></i></span>
                    <input type="text" class="dutypos-label-input flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white" value="${escapeHtml(pos.label)}" placeholder="Nöbet yeri adı">
                    <input type="color" class="dutypos-color-input w-9 h-8 bg-slate-900 border border-slate-800 rounded cursor-pointer" value="${pos.color}" title="Renk">
                    <select class="dutypos-icon-select bg-slate-900 border border-slate-800 rounded text-[10px] text-white p-1.5"></select>
                    <button class="dutypos-up-btn px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]" title="Yukarı taşı" ${idx === 0 ? 'disabled style="opacity:.3;cursor:not-allowed;"' : ''}><i class="fa-solid fa-arrow-up"></i></button>
                    <button class="dutypos-down-btn px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]" title="Aşağı taşı" ${idx === tempDutyPositions.length - 1 ? 'disabled style="opacity:.3;cursor:not-allowed;"' : ''}><i class="fa-solid fa-arrow-down"></i></button>
                    <button class="dutypos-remove-btn px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded text-[10px]" title="Sil"><i class="fa-solid fa-trash-can"></i></button>
                `;
                wrap.appendChild(row);

                populateDutyIconSelect(row.querySelector('.dutypos-icon-select'), pos.icon);

                row.querySelector('.dutypos-label-input').addEventListener('input', (e) => {
                    tempDutyPositions[idx].label = e.target.value;
                    renderDutyLivePreview();
                });
                row.querySelector('.dutypos-color-input').addEventListener('input', (e) => {
                    tempDutyPositions[idx].color = e.target.value;
                    renderDutyLivePreview();
                });
                row.querySelector('.dutypos-icon-select').addEventListener('change', (e) => {
                    tempDutyPositions[idx].icon = e.target.value;
                    renderDutyLivePreview();
                });
                row.querySelector('.dutypos-up-btn').addEventListener('click', () => moveDutyPosition(idx, -1));
                row.querySelector('.dutypos-down-btn').addEventListener('click', () => moveDutyPosition(idx, 1));
                row.querySelector('.dutypos-remove-btn').addEventListener('click', () => removeDutyPosition(idx));

                // Sürükle-bırak ile sıralama
                row.addEventListener('dragstart', () => { dutyDragFromIndex = idx; row.classList.add('dragging'); });
                row.addEventListener('dragend', () => { row.classList.remove('dragging'); wrap.querySelectorAll('.dutypos-row').forEach(r => r.classList.remove('drag-over-top', 'drag-over-bottom')); });
                row.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const rect = row.getBoundingClientRect();
                    const isTop = (e.clientY - rect.top) < rect.height / 2;
                    row.classList.toggle('drag-over-top', isTop);
                    row.classList.toggle('drag-over-bottom', !isTop);
                });
                row.addEventListener('dragleave', () => row.classList.remove('drag-over-top', 'drag-over-bottom'));
                row.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const rect = row.getBoundingClientRect();
                    const isTop = (e.clientY - rect.top) < rect.height / 2;
                    let targetIdx = idx + (isTop ? 0 : 1);
                    reorderDutyPositions(dutyDragFromIndex, targetIdx);
                });
            });

            renderDutyLivePreview();
        }

        function addDutyPosition() {
            const input = document.getElementById('dutypos-new-label');
            const label = input.value.trim();
            if (!label) { showCustomNotification("Uyarı", "Lütfen yeni nöbet yeri için bir ad girin."); return; }
            const color = document.getElementById('dutypos-new-color').value || '#00b4d8';
            const icon = document.getElementById('dutypos-new-icon').value || 'fa-user-shield';
            const id = 'yer_' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
            tempDutyPositions.push({ id, label, icon, color });
            input.value = '';
            renderDutyPositionsAdmin();
            writeCMSLog(`Yeni nöbet yeri eklendi: ${label}`);
        }

        function removeDutyPosition(idx) {
            const pos = tempDutyPositions[idx];
            if (!pos) return;
            askCustomConfirmation(
                'Nöbet Yerini Sil',
                `"${pos.label}" nöbet yerini silmek istediğinize emin misiniz? Bu nöbet yerine ait geçmiş aylık kayıtlar çizelgede saklı kalır ancak artık gösterilmez.`,
                function() {
                    tempDutyPositions.splice(idx, 1);
                    renderDutyPositionsAdmin();
                    writeCMSLog(`Nöbet yeri silindi: ${pos.label}`);
                }
            );
        }

        function moveDutyPosition(idx, dir) {
            const newIdx = idx + dir;
            if (newIdx < 0 || newIdx >= tempDutyPositions.length) return;
            const [item] = tempDutyPositions.splice(idx, 1);
            tempDutyPositions.splice(newIdx, 0, item);
            renderDutyPositionsAdmin();
        }

        function reorderDutyPositions(fromIdx, toIdx) {
            if (fromIdx === null || fromIdx === undefined || fromIdx === toIdx) { renderDutyPositionsAdmin(); return; }
            const [item] = tempDutyPositions.splice(fromIdx, 1);
            let insertAt = toIdx > fromIdx ? toIdx - 1 : toIdx;
            insertAt = Math.max(0, Math.min(insertAt, tempDutyPositions.length));
            tempDutyPositions.splice(insertAt, 0, item);
            dutyDragFromIndex = null;
            renderDutyPositionsAdmin();
        }

        let tempDutyStyle = null;

        function renderDutyTemplateList() {
            const wrap = document.getElementById('dutypos-template-list');
            if (!wrap) return;
            wrap.innerHTML = Object.entries(DUTY_STYLE_TEMPLATES).map(([key, tpl]) => `
                <div class="theme-preset-card bg-slate-900 p-3 border rounded-lg cursor-pointer hover:border-cyan-500 transition ${tempDutyStyle && tempDutyStyle.template === key ? 'border-cyan-500' : 'border-slate-800'}" data-tpl="${key}">
                    <h4 class="text-white font-bold text-xs mb-1">${tpl.label}</h4>
                    <p class="text-[10px] text-slate-500">${tpl.desc}</p>
                </div>
            `).join('');
            wrap.querySelectorAll('[data-tpl]').forEach(card => {
                card.addEventListener('click', () => applyDutyTemplate(card.dataset.tpl));
            });
        }

        function applyDutyTemplate(key) {
            const tpl = DUTY_STYLE_TEMPLATES[key];
            if (!tpl) return;
            tempDutyStyle = JSON.parse(JSON.stringify(tpl.style));
            loadDutyStyleIntoInputs();
            renderDutyTemplateList();
            renderDutyLivePreview();
        }

        function loadDutyStyleIntoInputs() {
            const s = tempDutyStyle || defaultAppConfig.dutyStyle;
            document.getElementById('dutystyle-shape').value = s.shape || 'rounded';
            document.getElementById('dutystyle-namecolor-mode').value = s.nameColorMode || 'auto';
            document.getElementById('dutystyle-namecolor').value = s.nameColor || '#02040a';
            document.getElementById('dutystyle-bgcolor').value = (s.activeBg && s.activeBg.color) || '#00b4d8';
            const opacityVal = (s.activeBg && typeof s.activeBg.opacity === 'number') ? s.activeBg.opacity : 15;
            document.getElementById('dutystyle-opacity').value = opacityVal;
            document.getElementById('dutystyle-opacity-val').innerText = opacityVal;
            document.getElementById('dutystyle-highlight').value = (s.activeBg && s.activeBg.highlight) || 'none';
        }

        function applyDutyStyleFromInputs() {
            tempDutyStyle = {
                template: (tempDutyStyle && tempDutyStyle.template) || 'custom',
                shape: document.getElementById('dutystyle-shape').value,
                nameColorMode: document.getElementById('dutystyle-namecolor-mode').value,
                nameColor: document.getElementById('dutystyle-namecolor').value,
                activeBg: {
                    color: document.getElementById('dutystyle-bgcolor').value,
                    opacity: parseInt(document.getElementById('dutystyle-opacity').value, 10) || 0,
                    highlight: document.getElementById('dutystyle-highlight').value
                }
            };
            renderDutyLivePreview();
        }

        // Canlı önizleme: yönetim panelinde yapılan değişiklikleri, panoyu etkilemeden
        // örnek isimlerle anında gösterir.
        function renderDutyLivePreview() {
            const grid = document.getElementById('dutypos-preview-grid');
            if (!grid) return;
            const savedStyle = appConfig.dutyStyle;
            const savedPositions = appConfig.dutyPositions;
            // Geçici olarak önizleme verisiyle değiştirip aynı kart üretim fonksiyonunu kullan
            appConfig.dutyStyle = tempDutyStyle || appConfig.dutyStyle;
            const sampleNames = ['Ayşe Yılmaz', 'Mehmet Kaya', '', 'Elif Demir'];
            grid.innerHTML = tempDutyPositions.map((pos, i) => buildDutyCardHtml(pos, sampleNames[i % sampleNames.length])).join('');
            appConfig.dutyStyle = savedStyle;
            appConfig.dutyPositions = savedPositions;
        }

        /* =========================================================================
           NÖBET MODÜLÜ KAPSAMLI AYARLAR (Yeni "Nöbet Modülü Ayarları" Sekmesi)
           appConfig.dutyAdvancedSettings altında saklanır.
           ========================================================================= */

        // Varsayılan gelişmiş ayarlar
        const DEFAULT_DUTY_ADVANCED = {
            fontFamily: 'inherit',
            gap: 10,
            minWidth: 140,
            padding: 6,
            avatarSize: 44,
            cardBgColor: '#09101f',
            cardOpacity: 50,
            avatarBgColor: '#111b2d',
            titleColor: '#00b4d8',
            pillBgColor: '#e2e8f0',
            pillTextColor: '#02040a',
            pillOpacity: 100,
            pillBorderColor: '#00b4d8',
            pillBorderWidth: 0,
            borderWidth: 1,
            borderColor: '#111b2d',
            borderStyle: 'solid',
            borderRadius: 6,
            shadowType: 'none',
            shadowColor: '#00b4d8',
            bgType: 'solid',
            bgColor2: '#0e1726',
            animation: 'none',
            animDur: 5,
            hoverEffect: 'none',
            transition: '0.4s',
            moduleTitle: 'BUGÜN GÖREVLİ NÖBETÇİ ÖĞRETMENLER',
            customIcons: [] // { v, l } ek ikonlar
        };

        // appConfig.dutyAdvancedSettings'i varsayılanlarla birleştir
        function getDutyAdvanced() {
            return Object.assign({}, DEFAULT_DUTY_ADVANCED, appConfig.dutyAdvancedSettings || {});
        }

        // Gelişmiş nöbet ayarlarını forma yükle
        function loadDutyAdvancedSettingsIntoForm() {
            const s = getDutyAdvanced();
            const set = (id, val) => { const el = document.getElementById(id); if (el) { el.value = val; } };
            const setText = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };

            set('ds-module-title', s.moduleTitle);
            set('ds-font-family', s.fontFamily);
            set('ds-gap', s.gap);            setText('ds-gap-val', s.gap + 'px');
            set('ds-minw', s.minWidth);      setText('ds-minw-val', s.minWidth + 'px');
            set('ds-padding', s.padding);    setText('ds-padding-val', s.padding + 'px ' + (s.padding * 2) + 'px');
            set('ds-avatar', s.avatarSize);  setText('ds-avatar-val', s.avatarSize + 'px');
            set('ds-card-bg-color', s.cardBgColor);
            set('ds-card-opacity', s.cardOpacity); setText('ds-card-opacity-val', s.cardOpacity + '%');
            set('ds-avatar-bg-color', s.avatarBgColor);
            set('ds-title-color', s.titleColor);
            set('ds-pill-bg-color', s.pillBgColor);
            set('ds-pill-text-color', s.pillTextColor);
            set('ds-pill-opacity', s.pillOpacity); setText('ds-pill-opacity-val', s.pillOpacity + '%');
            set('ds-pill-border-color', s.pillBorderColor);
            set('ds-pill-border-width', s.pillBorderWidth); setText('ds-pill-border-val', s.pillBorderWidth + 'px');
            set('ds-border-width', s.borderWidth); setText('ds-border-val', s.borderWidth + 'px');
            set('ds-border-color', s.borderColor);
            set('ds-border-style', s.borderStyle);
            set('ds-border-radius', s.borderRadius); setText('ds-radius-val', s.borderRadius + 'px');
            set('ds-shadow-type', s.shadowType);
            set('ds-shadow-color', s.shadowColor);
            set('ds-bg-type', s.bgType);
            set('ds-bg-color2', s.bgColor2);
            set('ds-animation', s.animation);
            set('ds-anim-dur', s.animDur); setText('ds-anim-dur-val', (s.animDur / 10).toFixed(1) + 's');
            set('ds-hover-effect', s.hoverEffect);
            set('ds-transition', s.transition);

            renderDutyIconList();
            dutySettingsLivePreview();
        }

        // Formdaki değerleri toplayıp geri döndür
        function collectDutyAdvancedFromForm() {
            const get = (id) => { const el = document.getElementById(id); return el ? el.value : null; };
            const getNum = (id) => parseInt(get(id), 10) || 0;
            const s = getDutyAdvanced();
            return {
                ...s,
                moduleTitle: get('ds-module-title') || DEFAULT_DUTY_ADVANCED.moduleTitle,
                fontFamily: get('ds-font-family'),
                gap: getNum('ds-gap'),
                minWidth: getNum('ds-minw'),
                padding: getNum('ds-padding'),
                avatarSize: getNum('ds-avatar'),
                cardBgColor: get('ds-card-bg-color'),
                cardOpacity: getNum('ds-card-opacity'),
                avatarBgColor: get('ds-avatar-bg-color'),
                titleColor: get('ds-title-color'),
                pillBgColor: get('ds-pill-bg-color'),
                pillTextColor: get('ds-pill-text-color'),
                pillOpacity: getNum('ds-pill-opacity'),
                pillBorderColor: get('ds-pill-border-color'),
                pillBorderWidth: getNum('ds-pill-border-width'),
                borderWidth: getNum('ds-border-width'),
                borderColor: get('ds-border-color'),
                borderStyle: get('ds-border-style'),
                borderRadius: getNum('ds-border-radius'),
                shadowType: get('ds-shadow-type'),
                shadowColor: get('ds-shadow-color'),
                bgType: get('ds-bg-type'),
                bgColor2: get('ds-bg-color2'),
                animation: get('ds-animation'),
                animDur: getNum('ds-anim-dur'),
                hoverEffect: get('ds-hover-effect'),
                transition: get('ds-transition'),
                customIcons: s.customIcons || []
            };
        }

        // Gelişmiş ayarları pano duty kartlarına uygula (CSS değişkenleri + sınıflar + inline stiller)
        function applyDutyAdvancedStyleToGrid(gridEl, positions, advSettings, dutyStyle) {
            if (!gridEl) return;
            const s = advSettings || getDutyAdvanced();
            const ds = dutyStyle || appConfig.dutyStyle || defaultAppConfig.dutyStyle;
            const animDurSec = (s.animDur / 10).toFixed(1) + 's';

            // Grid layout
            gridEl.style.setProperty('gap', s.gap + 'px');
            gridEl.style.setProperty('grid-template-columns', `repeat(auto-fit, minmax(${s.minWidth}px, 1fr))`);
            gridEl.style.setProperty('font-family', s.fontFamily);

            // CSS custom property for animation duration
            gridEl.style.setProperty('--duty-anim-dur', animDurSec);
            gridEl.style.setProperty('--duty-transition', s.transition);

            // Apply each card
            const cards = gridEl.querySelectorAll('.duty-card-box');
            cards.forEach((card, i) => {
                // Background
                let bg = '';
                const bgAlpha = s.cardOpacity / 100;
                const c1 = hexToRgba(s.cardBgColor, bgAlpha);
                const c2 = hexToRgba(s.bgColor2, bgAlpha);
                if (s.bgType === 'solid') {
                    bg = c1;
                    card.style.backgroundImage = 'none';
                    card.style.backgroundColor = c1;
                } else if (s.bgType === 'gradient-lr') {
                    card.style.backgroundImage = `linear-gradient(to right, ${c1}, ${c2})`;
                    card.style.backgroundColor = '';
                } else if (s.bgType === 'gradient-tb') {
                    card.style.backgroundImage = `linear-gradient(to bottom, ${c1}, ${c2})`;
                    card.style.backgroundColor = '';
                } else if (s.bgType === 'gradient-diag') {
                    card.style.backgroundImage = `linear-gradient(135deg, ${c1}, ${c2})`;
                    card.style.backgroundColor = '';
                } else {
                    card.style.backgroundColor = c1;
                    card.style.backgroundImage = 'none';
                }

                // Patterns via class
                card.classList.remove('duty-bg-pattern-dots','duty-bg-pattern-lines','duty-bg-pattern-grid');
                if (s.bgType === 'pattern-dots') card.classList.add('duty-bg-pattern-dots');
                if (s.bgType === 'pattern-lines') card.classList.add('duty-bg-pattern-lines');
                if (s.bgType === 'pattern-grid') card.classList.add('duty-bg-pattern-grid');

                // Border
                card.style.borderWidth = s.borderWidth + 'px';
                card.style.borderColor = s.borderColor;
                card.style.borderStyle = s.borderStyle;
                card.style.borderRadius = s.borderRadius + 'px';

                // Shadow
                let shadow = '';
                const sc = s.shadowColor || '#00b4d8';
                if (s.shadowType === 'sm')   shadow = `0 2px 6px rgba(0,0,0,0.3)`;
                if (s.shadowType === 'md')   shadow = `0 4px 16px rgba(0,0,0,0.4)`;
                if (s.shadowType === 'lg')   shadow = `0 8px 32px rgba(0,0,0,0.5)`;
                if (s.shadowType === 'neon') shadow = `0 0 14px 2px ${hexToRgba(sc, 0.55)}`;
                card.style.boxShadow = card.style.boxShadow || shadow; // don't overwrite glow highlight
                if (!card.classList.contains('duty-highlight-glow') && !card.classList.contains('duty-highlight-border')) {
                    card.style.boxShadow = shadow;
                }

                // Padding
                card.style.padding = s.padding + 'px ' + (s.padding * 2) + 'px';

                // Hover
                card.classList.remove('duty-hover-lift','duty-hover-glow','duty-hover-scale');
                if (s.hoverEffect === 'lift')  card.classList.add('duty-hover-lift');
                if (s.hoverEffect === 'glow')  card.classList.add('duty-hover-glow');
                if (s.hoverEffect === 'scale') card.classList.add('duty-hover-scale');

                // Animation (staggered by index)
                card.classList.remove('duty-anim-fade-in','duty-anim-slide-up','duty-anim-zoom-in','duty-anim-pulse-glow','duty-anim-shimmer');
                if (s.animation !== 'none') {
                    card.classList.add('duty-anim-' + s.animation.replace('-','').replace(' ','-').replace(/-/g, '-'));
                    card.style.animationDelay = (i * 0.08).toFixed(2) + 's';
                }

                // Transition
                card.style.transition = `transform ${s.transition}, box-shadow ${s.transition}`;

                // Avatar
                const avatar = card.querySelector('.duty-avatar-box');
                if (avatar) {
                    avatar.style.width = s.avatarSize + 'px';
                    avatar.style.height = s.avatarSize + 'px';
                    avatar.style.background = s.avatarBgColor;
                }

                // Title
                const titleEl = card.querySelector('.duty-title');
                if (titleEl) {
                    titleEl.style.color = s.titleColor;
                    titleEl.style.fontFamily = s.fontFamily;
                }

                // Name pill — renk, şeffaflık (opaklık), çerçeve rengi ve şekil
                // (şekil zaten shapeClass ile duty-shape-* sınıfı olarak uygulanıyor)
                const pill = card.querySelector('.duty-name-pill');
                if (pill) {
                    const pillAlpha = (typeof s.pillOpacity === 'number' ? s.pillOpacity : 100) / 100;
                    pill.style.background = hexToRgba(s.pillBgColor, pillAlpha);
                    pill.style.color = s.pillTextColor;
                    pill.style.fontFamily = s.fontFamily;
                    const pillBorderW = (typeof s.pillBorderWidth === 'number' ? s.pillBorderWidth : 0);
                    pill.style.borderWidth = pillBorderW + 'px';
                    pill.style.borderStyle = pillBorderW > 0 ? 'solid' : 'none';
                    pill.style.borderColor = s.pillBorderColor || 'transparent';
                }
            });
        }

        // Canlı önizleme (Nöbet Ayarları sekmesi)
        function dutySettingsLivePreview() {
            const grid = document.getElementById('ds-live-preview-grid');
            if (!grid) return;
            const s = collectDutyAdvancedFromForm();
            const savedStyle = appConfig.dutyStyle;
            const savedPositions = appConfig.dutyPositions;

            appConfig.dutyStyle = tempDutyStyle || appConfig.dutyStyle;
            const sampleNames = ['Ayşe Yılmaz', 'Mehmet Kaya', '', 'Elif Demir'];
            const previewPositions = (tempDutyPositions.length ? tempDutyPositions : appConfig.dutyPositions || []).slice(0, 4);
            grid.innerHTML = previewPositions.map((pos, i) => buildDutyCardHtml(pos, sampleNames[i % sampleNames.length])).join('');
            appConfig.dutyStyle = savedStyle;
            appConfig.dutyPositions = savedPositions;

            // Apply advanced styles
            applyDutyAdvancedStyleToGrid(grid, previewPositions, s, tempDutyStyle || appConfig.dutyStyle);
        }

        // Kaydet & Uygula
        function dutySettingsSave() {
            appConfig.dutyAdvancedSettings = collectDutyAdvancedFromForm();
            // Update module title in moduleSettings if present
            const moduleTitle = appConfig.dutyAdvancedSettings.moduleTitle;
            if (appConfig.moduleSettings && appConfig.moduleSettings.duty) {
                appConfig.moduleSettings.duty.title = moduleTitle;
            }
            panoPersist();
            // Apply to live pano
            const liveGrid = document.getElementById('duty-grid-container');
            if (liveGrid) applyDutyAdvancedStyleToGrid(liveGrid, appConfig.dutyPositions, appConfig.dutyAdvancedSettings, appConfig.dutyStyle);
            const titleEl = document.getElementById('display-duty-title-text');
            if (titleEl) titleEl.innerText = moduleTitle;
            showCustomNotification('Başarılı', 'Nöbet modülü görsel ayarları kaydedildi ve uygulandı.');
            writeCMSLog('Nöbet Modülü Ayarları kaydedildi.');
        }

        // Sıfırla
        function dutySettingsReset() {
            appConfig.dutyAdvancedSettings = Object.assign({}, DEFAULT_DUTY_ADVANCED);
            loadDutyAdvancedSettingsIntoForm();
            writeCMSLog('Nöbet Modülü Ayarları varsayılana sıfırlandı.');
        }

        /* --- Hazır İkon Listesi Yönetimi --- */
        function getDutyIconList() {
            const base = JSON.parse(JSON.stringify(DUTY_ICON_CHOICES));
            const custom = (getDutyAdvanced().customIcons || []);
            return base.concat(custom);
        }

        function renderDutyIconList() {
            const wrap = document.getElementById('ds-icon-list');
            if (!wrap) return;
            const all = getDutyIconList();
            const customIcons = getDutyAdvanced().customIcons || [];
            wrap.innerHTML = all.map((ic, idx) => {
                const isCustom = idx >= DUTY_ICON_CHOICES.length;
                return `<div class="ds-icon-row">
                    <span class="ds-icon-preview"><i class="fa-solid ${ic.v}"></i></span>
                    <span class="ds-icon-class text-[9px] font-mono text-slate-500">.${ic.v}</span>
                    <span class="ds-icon-label">${ic.l}</span>
                    ${isCustom ? `<button class="ds-icon-remove" onclick="removeCustomDutyIcon(${idx - DUTY_ICON_CHOICES.length})" title="Sil"><i class="fa-solid fa-trash-can"></i></button>` : '<span class="text-[9px] text-slate-600">Sistem</span>'}
                </div>`;
            }).join('');
            // Refresh icon selects in duty positions admin
            if (document.getElementById('dutypos-new-icon')) {
                populateDutyIconSelectFromAll(document.getElementById('dutypos-new-icon'), '');
            }
        }

        function populateDutyIconSelectFromAll(selectEl, selectedIcon) {
            populateDutyIconSelect(selectEl, selectedIcon);
        }

        function addCustomDutyIcon() {
            const classInput = document.getElementById('ds-new-icon-class');
            const labelInput = document.getElementById('ds-new-icon-label');
            let cls = (classInput.value || '').trim().replace(/^fa-/, '');
            const lbl = (labelInput.value || '').trim();
            if (!cls || !lbl) { showCustomNotification('Uyarı', 'İkon sınıfı ve etiket alanlarını doldurun.'); return; }
            cls = 'fa-' + cls;
            const adv = getDutyAdvanced();
            if (!adv.customIcons) adv.customIcons = [];
            if (adv.customIcons.find(ic => ic.v === cls)) { showCustomNotification('Uyarı', 'Bu ikon zaten listede mevcut.'); return; }
            adv.customIcons.push({ v: cls, l: lbl });
            appConfig.dutyAdvancedSettings = adv;
            panoPersist();
            classInput.value = '';
            labelInput.value = '';
            renderDutyIconList();
            // Refresh all icon selects in duty positions
            renderDutyPositionsAdmin();
            writeCMSLog(`Yeni ikon eklendi: ${cls} (${lbl})`);
        }

        function removeCustomDutyIcon(customIdx) {
            const adv = getDutyAdvanced();
            if (!adv.customIcons || !adv.customIcons[customIdx]) return;
            const removed = adv.customIcons.splice(customIdx, 1);
            appConfig.dutyAdvancedSettings = adv;
            panoPersist();
            renderDutyIconList();
            renderDutyPositionsAdmin();
            writeCMSLog(`İkon silindi: ${removed[0] && removed[0].v}`);
        }

        /* =========================================================================
           DERS PROGRAMI (PANO) İÇERİK BİÇİMLENDİRME — CSS DEĞİŞKENİ MOTORU
           Ayarlar appConfig.scheduleBoardStyle içinde saklanır. CSS tarafında
           .schedule-grid / .class-schedule-box / .class-name-badge /
           .class-lesson-name kuralları --sch-* değişkenlerini kullanır; bu
           sayede herhangi bir elemente bu değişkenleri yazmak yeniden render
           gerekmeden anında (canlı önizleme dahil) yansır.
           ========================================================================= */
        function getScheduleBoardStyle() {
            return { ...defaultAppConfig.scheduleBoardStyle, ...(appConfig.scheduleBoardStyle || {}) };
        }

        function scheduleBoardStyleToCSSVars(s) {
            const justifyMap = { top: 'flex-start', center: 'center', bottom: 'flex-end', between: 'space-between' };
            const vars = {
                '--sch-columns': s.columns || 4,
                '--sch-gap': `${s.gap ?? 6}px`,
                '--sch-name-justify': justifyMap[s.nameValign] || 'flex-start',
                '--sch-lesson-justify': justifyMap[s.lessonValign] || 'flex-end',
                '--sch-name-align': s.nameAlign || 'center',
                '--sch-lesson-align': s.lessonAlign || 'center',
                '--sch-box-radius': `${s.boxRadius ?? 6}px`,
                '--sch-name-size': `${s.nameFontSize || 12}px`,
                '--sch-name-weight': s.nameBold === false ? '400' : '700',
                '--sch-lesson-size': `${s.lessonFontSize || 12}px`,
                '--sch-lesson-weight': s.lessonBold === false ? '400' : '700'
            };
            if (s.boxBg) vars['--sch-box-bg'] = s.boxBg;
            if (s.boxBorderColor) vars['--sch-box-border'] = s.boxBorderColor;
            if (s.activeBg) vars['--sch-active-bg'] = s.activeBg;
            if (s.activeBorderColor) vars['--sch-active-border'] = s.activeBorderColor;
            if (s.nameBg) vars['--sch-name-bg'] = s.nameBg;
            if (s.nameColor) vars['--sch-name-color'] = s.nameColor;
            if (s.lessonColor) vars['--sch-lesson-color'] = s.lessonColor;
            if (s.lessonFont) vars['--sch-lesson-font'] = s.lessonFont;
            if (s.recessColor) vars['--sch-recess-color'] = s.recessColor;
            return vars;
        }

        // Belirtilen elemente (canlı pano kökü ya da önizleme kutusu) biçim değişkenlerini uygular
        function applyScheduleBoardStyleToDOM(styleObj, targetEl) {
            if (!targetEl) return;
            const optionalVars = ['--sch-box-bg', '--sch-box-border', '--sch-active-bg', '--sch-active-border', '--sch-name-bg', '--sch-name-color', '--sch-lesson-color', '--sch-lesson-font', '--sch-recess-color'];
            optionalVars.forEach(v => targetEl.style.removeProperty(v));
            const vars = scheduleBoardStyleToCSSVars(styleObj || {});
            Object.keys(vars).forEach(k => targetEl.style.setProperty(k, vars[k]));
        }

        // Kaydedilmiş ayarları gerçek/canlı panoya uygular (sayfa yüklenirken ve kayıt sonrası çağrılır)
        function applyScheduleBoardStyle() {
            applyScheduleBoardStyleToDOM(getScheduleBoardStyle(), document.documentElement);
        }

        // Yönetim panelindeki form kontrollerini appConfig'teki (veya varsayılan) değerlerle doldurur
        function loadScheduleBoardStyleIntoForm() {
            const s = getScheduleBoardStyle();
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };

            set('sbs-columns', s.columns);
            set('sbs-gap', s.gap);
            set('sbs-name-align', s.nameAlign || 'center');
            set('sbs-name-valign', s.nameValign || 'top');
            set('sbs-lesson-align', s.lessonAlign || 'center');
            set('sbs-lesson-valign', s.lessonValign || 'bottom');
            set('sbs-box-bg', s.boxBg || '#111b2d');
            setChk('sbs-box-bg-enabled', !!s.boxBg);
            set('sbs-box-border', s.boxBorderColor || '#111b2d');
            setChk('sbs-box-border-enabled', !!s.boxBorderColor);
            set('sbs-box-radius', s.boxRadius);
            set('sbs-active-bg', s.activeBg || '#00b4d8');
            setChk('sbs-active-bg-enabled', !!s.activeBg);
            set('sbs-active-border', s.activeBorderColor || '#00b4d8');
            setChk('sbs-active-border-enabled', !!s.activeBorderColor);
            set('sbs-name-bg', s.nameBg || '#09101f');
            setChk('sbs-name-bg-enabled', !!s.nameBg);
            set('sbs-name-color', s.nameColor || '#7dd3fc');
            setChk('sbs-name-color-enabled', !!s.nameColor);
            set('sbs-name-size', s.nameFontSize);
            setChk('sbs-name-bold', s.nameBold !== false);
            set('sbs-lesson-color', s.lessonColor || '#ffffff');
            setChk('sbs-lesson-color-enabled', !!s.lessonColor);
            set('sbs-lesson-size', s.lessonFontSize);
            setChk('sbs-lesson-bold', s.lessonBold !== false);
            set('sbs-lesson-font', s.lessonFont || '');
            set('sbs-recess-color', s.recessColor || '#38b000');
            setChk('sbs-recess-color-enabled', !!s.recessColor);

            updateScheduleBoardLivePreview();
        }

        // Form kontrollerinden güncel ayar nesnesini okur
        function readScheduleBoardStyleFromForm() {
            const g = id => document.getElementById(id);
            const val = (id, fallback) => (g(id) ? g(id).value : fallback);
            const chk = id => !!(g(id) && g(id).checked);
            return {
                columns: parseInt(val('sbs-columns', 4), 10) || 4,
                gap: parseInt(val('sbs-gap', 6), 10) || 0,
                nameAlign: val('sbs-name-align', 'center') || 'center',
                nameValign: val('sbs-name-valign', 'top') || 'top',
                lessonAlign: val('sbs-lesson-align', 'center') || 'center',
                lessonValign: val('sbs-lesson-valign', 'bottom') || 'bottom',
                boxBg: chk('sbs-box-bg-enabled') ? val('sbs-box-bg', '') : '',
                boxBorderColor: chk('sbs-box-border-enabled') ? val('sbs-box-border', '') : '',
                boxRadius: parseInt(val('sbs-box-radius', 6), 10) || 0,
                activeBg: chk('sbs-active-bg-enabled') ? val('sbs-active-bg', '') : '',
                activeBorderColor: chk('sbs-active-border-enabled') ? val('sbs-active-border', '') : '',
                nameBg: chk('sbs-name-bg-enabled') ? val('sbs-name-bg', '') : '',
                nameColor: chk('sbs-name-color-enabled') ? val('sbs-name-color', '') : '',
                nameFontSize: parseInt(val('sbs-name-size', 12), 10) || 12,
                nameBold: chk('sbs-name-bold'),
                lessonColor: chk('sbs-lesson-color-enabled') ? val('sbs-lesson-color', '') : '',
                lessonFontSize: parseInt(val('sbs-lesson-size', 12), 10) || 12,
                lessonBold: chk('sbs-lesson-bold'),
                lessonFont: val('sbs-lesson-font', '') || '',
                recessColor: chk('sbs-recess-color-enabled') ? val('sbs-recess-color', '') : ''
            };
        }

        // Formdaki güncel değerleri, canlı pano'ya dokunmadan sadece önizleme kutusuna anında uygular
        function updateScheduleBoardLivePreview() {
            const preview = document.getElementById('sbs-live-preview');
            if (!preview) return;
            applyScheduleBoardStyleToDOM(readScheduleBoardStyleFromForm(), preview);
        }

        // Ayarları kaydeder ve doğrudan gerçek/canlı panoya uygular
        function scheduleBoardStyleSave() {
            const s = readScheduleBoardStyleFromForm();
            appConfig.scheduleBoardStyle = s;
            panoPersist();
            applyScheduleBoardStyleToDOM(s, document.documentElement);
            showCustomNotification('Başarılı', 'Ders Programı pano görünüm ayarları kaydedildi ve uygulandı.');
            writeCMSLog('Ders Programı pano biçimlendirme ayarları güncellendi.');
        }

        // Formu (henüz kaydetmeden) varsayılan ayarlara döndürür
        function scheduleBoardStyleReset() {
            appConfig.scheduleBoardStyle = JSON.parse(JSON.stringify(defaultAppConfig.scheduleBoardStyle));
            loadScheduleBoardStyleIntoForm();
            writeCMSLog('Ders Programı pano görünüm ayarları varsayılana sıfırlandı (henüz kaydedilmedi).');
        }

        /* =========================================================================
           SAAT / GERİ SAYIM KUTUSU — İÇERİK BİÇİMLENDİRME (CSS DEĞİŞKENİ MOTORU)
           Ayarlar appConfig.clockStyle içinde saklanır. CSS tarafında
           .digital-date / .digital-clock / .bell-countdown kuralları --clk-*
           değişkenlerini kullanır; böylece herhangi bir elemente bu değişkenleri
           yazmak yeniden render gerekmeden anında (canlı önizleme dahil) yansır.
           ========================================================================= */
        function getClockStyle() {
            return { ...defaultAppConfig.clockStyle, ...(appConfig.clockStyle || {}) };
        }

        function clockStyleToCSSVars(s) {
            const alignMap = { left: 'left', center: 'center', right: 'right' };
            const justifyMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' };
            const vars = {
                '--clk-date-align': alignMap[s.dateAlign] || 'center',
                '--clk-date-size': `${s.dateFontSize || 11}px`,
                '--clk-date-weight': s.dateBold ? '700' : '400',
                '--clk-date-justify': justifyMap[s.dateValign] || 'center',
                '--clk-time-align': alignMap[s.timeAlign] || 'center',
                '--clk-time-size': `${s.timeFontSize || 32}px`,
                '--clk-time-weight': s.timeBold === false ? '400' : '700',
                '--clk-time-justify': justifyMap[s.timeValign] || 'center',
                '--clk-cd-align': alignMap[s.countdownAlign] || 'center',
                '--clk-cd-size': `${s.countdownFontSize || 12}px`,
                '--clk-cd-weight': s.countdownBold ? '700' : '500',
                '--clk-cd-justify': justifyMap[s.countdownValign] || 'center'
            };
            if (s.dateColor) vars['--clk-date-color'] = s.dateColor;
            if (s.dateFont) vars['--clk-date-font'] = s.dateFont;
            if (s.timeColor) vars['--clk-time-color'] = s.timeColor;
            if (s.timeFont) vars['--clk-time-font'] = s.timeFont;
            if (s.countdownColor) vars['--clk-cd-color'] = s.countdownColor;
            if (s.countdownFont) vars['--clk-cd-font'] = s.countdownFont;
            return vars;
        }

        // Belirtilen elemente (canlı pano kökü ya da önizleme kutusu) biçim değişkenlerini uygular
        function applyClockStyleToDOM(styleObj, targetEl) {
            if (!targetEl) return;
            const optionalVars = ['--clk-date-color', '--clk-date-font', '--clk-time-color', '--clk-time-font', '--clk-cd-color', '--clk-cd-font'];
            optionalVars.forEach(v => targetEl.style.removeProperty(v));
            const vars = clockStyleToCSSVars(styleObj || {});
            Object.keys(vars).forEach(k => targetEl.style.setProperty(k, vars[k]));

            // Satır görünürlüğü (Aktif/Pasif) canlı panoda doğrudan elemente uygulanır
            if (targetEl === document.documentElement) {
                const s = styleObj || {};
                const dateEl = document.getElementById('display-clock-date');
                const timeEl = document.getElementById('display-clock-time');
                const cdEl = document.getElementById('display-bell-countdown');
                if (dateEl) dateEl.style.display = (s.dateActive === false) ? 'none' : '';
                if (timeEl) timeEl.style.display = (s.timeActive === false) ? 'none' : '';
                if (cdEl) cdEl.style.display = (s.countdownActive === false) ? 'none' : '';
            }
        }

        // Kaydedilmiş ayarları gerçek/canlı panoya uygular (sayfa yüklenirken ve kayıt sonrası çağrılır)
        function applyClockStyle() {
            applyClockStyleToDOM(getClockStyle(), document.documentElement);
        }

        // Yönetim panelindeki form kontrollerini appConfig'teki (veya varsayılan) değerlerle doldurur
        function loadClockStyleIntoForm() {
            const s = getClockStyle();
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };

            setChk('clks-date-active', s.dateActive !== false);
            setChk('clks-date-weekday', s.dateShowWeekday !== false);
            set('clks-date-color', s.dateColor || '#94a3b8');
            setChk('clks-date-color-enabled', !!s.dateColor);
            set('clks-date-size', s.dateFontSize);
            setChk('clks-date-bold', !!s.dateBold);
            set('clks-date-align', s.dateAlign || 'center');
            set('clks-date-valign', s.dateValign || 'center');
            set('clks-date-font', s.dateFont || '');

            setChk('clks-time-active', s.timeActive !== false);
            set('clks-time-format', s.timeFormat || '24');
            setChk('clks-time-seconds', s.timeShowSeconds !== false);
            set('clks-time-color', s.timeColor || '#00b4d8');
            setChk('clks-time-color-enabled', !!s.timeColor);
            set('clks-time-size', s.timeFontSize);
            setChk('clks-time-bold', s.timeBold !== false);
            set('clks-time-align', s.timeAlign || 'center');
            set('clks-time-valign', s.timeValign || 'center');
            set('clks-time-font', s.timeFont || '');

            setChk('clks-cd-active', s.countdownActive !== false);
            setChk('clks-cd-seconds', s.countdownShowSeconds !== false);
            set('clks-cd-layout', s.countdownLayout || 'inline');
            set('clks-cd-inclass-text', s.countdownInClassLabel || '');
            set('clks-cd-inclass-suffix', s.countdownInClassSuffix || '');
            set('clks-cd-inclass-color', s.countdownInClassColor || '#ef4444');
            set('clks-cd-break-text', s.countdownBreakLabel || '');
            set('clks-cd-break-suffix', s.countdownBreakSuffix || '');
            set('clks-cd-break-color', s.countdownBreakColor || '#22c55e');
            set('clks-cd-outofhours-text', s.countdownOutOfHoursText || '');
            set('clks-cd-color', s.countdownColor || '#ffb703');
            setChk('clks-cd-color-enabled', !!s.countdownColor);
            set('clks-cd-size', s.countdownFontSize);
            setChk('clks-cd-bold', !!s.countdownBold);
            set('clks-cd-align', s.countdownAlign || 'center');
            set('clks-cd-valign', s.countdownValign || 'center');
            set('clks-cd-font', s.countdownFont || '');

            updateClockStyleLivePreview();
        }

        // Form kontrollerinden güncel ayar nesnesini okur
        function readClockStyleFromForm() {
            const g = id => document.getElementById(id);
            const val = (id, fallback) => (g(id) ? g(id).value : fallback);
            const chk = id => !!(g(id) && g(id).checked);
            return {
                dateActive: chk('clks-date-active'),
                dateShowWeekday: chk('clks-date-weekday'),
                dateColor: chk('clks-date-color-enabled') ? val('clks-date-color', '') : '',
                dateFontSize: parseInt(val('clks-date-size', 11), 10) || 11,
                dateBold: chk('clks-date-bold'),
                dateAlign: val('clks-date-align', 'center') || 'center',
                dateValign: val('clks-date-valign', 'center') || 'center',
                dateFont: val('clks-date-font', '') || '',

                timeActive: chk('clks-time-active'),
                timeFormat: val('clks-time-format', '24') || '24',
                timeShowSeconds: chk('clks-time-seconds'),
                timeColor: chk('clks-time-color-enabled') ? val('clks-time-color', '') : '',
                timeFontSize: parseInt(val('clks-time-size', 32), 10) || 32,
                timeBold: chk('clks-time-bold'),
                timeAlign: val('clks-time-align', 'center') || 'center',
                timeValign: val('clks-time-valign', 'center') || 'center',
                timeFont: val('clks-time-font', '') || '',

                countdownActive: chk('clks-cd-active'),
                countdownShowSeconds: chk('clks-cd-seconds'),
                countdownLayout: val('clks-cd-layout', 'inline') || 'inline',
                countdownInClassLabel: val('clks-cd-inclass-text', 'Zilin Çalmasına:') || 'Zilin Çalmasına:',
                countdownInClassSuffix: val('clks-cd-inclass-suffix', 'kaldı (Derste)'),
                countdownInClassColor: val('clks-cd-inclass-color', '#ef4444') || '#ef4444',
                countdownBreakLabel: val('clks-cd-break-text', 'Derse Giriş Ziline:') || 'Derse Giriş Ziline:',
                countdownBreakSuffix: val('clks-cd-break-suffix', '(Teneffüs)'),
                countdownBreakColor: val('clks-cd-break-color', '#22c55e') || '#22c55e',
                countdownOutOfHoursText: val('clks-cd-outofhours-text', 'Eğitim Saatleri Dışındasınız') || 'Eğitim Saatleri Dışındasınız',
                countdownColor: chk('clks-cd-color-enabled') ? val('clks-cd-color', '') : '',
                countdownFontSize: parseInt(val('clks-cd-size', 12), 10) || 12,
                countdownBold: chk('clks-cd-bold'),
                countdownAlign: val('clks-cd-align', 'center') || 'center',
                countdownValign: val('clks-cd-valign', 'center') || 'center',
                countdownFont: val('clks-cd-font', '') || ''
            };
        }

        // Formdaki güncel değerleri, canlı pano'ya dokunmadan sadece önizleme kutusuna anında uygular
        function updateClockStyleLivePreview() {
            const preview = document.getElementById('clks-live-preview');
            if (!preview) return;
            const s = readClockStyleFromForm();
            applyClockStyleToDOM(s, preview);
            const dateEl = document.getElementById('clks-preview-date');
            const timeEl = document.getElementById('clks-preview-time');
            const cdEl = document.getElementById('clks-preview-cd');
            if (dateEl) dateEl.style.display = (s.dateActive === false) ? 'none' : '';
            if (timeEl) timeEl.style.display = (s.timeActive === false) ? 'none' : '';
            if (cdEl) {
                cdEl.style.display = (s.countdownActive === false) ? 'none' : '';
                cdEl.innerHTML = buildCountdownHTML(s, s.countdownInClassLabel, 12, 4, s.countdownInClassColor, s.countdownInClassSuffix);
            }
        }

        // Ayarları kaydeder ve doğrudan gerçek/canlı panoya uygular
        function clockStyleSave() {
            const s = readClockStyleFromForm();
            appConfig.clockStyle = s;
            panoPersist();
            applyClockStyleToDOM(s, document.documentElement);
            calculateCountdownAndTableHighlight(new Date());
            showCustomNotification('Başarılı', 'Saat / Geri Sayım biçimlendirme ayarları kaydedildi ve uygulandı.');
            writeCMSLog('Saat / Geri Sayım biçimlendirme ayarları güncellendi.');
        }

        // Formu (henüz kaydetmeden) varsayılan ayarlara döndürür
        function clockStyleReset() {
            appConfig.clockStyle = JSON.parse(JSON.stringify(defaultAppConfig.clockStyle));
            loadClockStyleIntoForm();
            writeCMSLog('Saat / Geri Sayım biçimlendirme ayarları varsayılana sıfırlandı (henüz kaydedilmedi).');
        }

        function renderActiveScheduleGroup() {
            const container = document.getElementById('class-schedule-container');
            const titleEl = document.getElementById('display-schedule-group-title');
            container.innerHTML = '';

            let filteredClasses = [];
            if (activeScheduleGroup === 1) {
                titleEl.innerText = "DERS PROGRAMI (3. VE 4. SINIFLAR)";
                filteredClasses = classList.filter(c => c.startsWith('3/') || c.startsWith('4/'));
            } else {
                titleEl.innerText = "DERS PROGRAMI (1. VE 2. SINIFLAR)";
                filteredClasses = classList.filter(c => c.startsWith('1/') || c.startsWith('2/'));
            }

            const now = new Date();
            let dayName = getTurkishDayName(now.getDay());
            if (dayName === "Cumartesi" || dayName === "Pazar") {
                dayName = "Pazartesi";
            }

            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            let currentLessonObj = null;
            let isRecess = false;
            let currentLessonIndex = -1;

            for (let i = 0; i < bellHours.length; i++) {
                const start = bellHours[i].start;
                const end = bellHours[i].end;
                
                if (timeString >= start && timeString <= end) {
                    currentLessonObj = bellHours[i];
                    currentLessonIndex = i;
                    break;
                }
                
                if (i < bellHours.length - 1) {
                    const nextStart = bellHours[i+1].start;
                    if (timeString > end && timeString < nextStart) {
                        isRecess = true;
                        currentLessonIndex = i; 
                        break;
                    }
                }
            }

            filteredClasses.forEach(className => {
                const box = document.createElement('div');
                box.className = 'class-schedule-box';
                
                const classWeek = appConfig.weeklyClassSchedules[className] || {};
                const schedule = classWeek[dayName] || Array(bellHours.length).fill("-");
                
                let lessonText = "Ders Yok";
                let recessClass = "";

                if (currentLessonObj) {
                    lessonText = schedule[currentLessonIndex] || "Boş Ders";
                    box.classList.add('active');
                } else if (isRecess) {
                    lessonText = "Teneffüs ⚽";
                    recessClass = "recess";
                } else {
                    lessonText = "Paydos 🏠";
                }

                box.innerHTML = `
                    <div class="class-name-wrap"><span class="class-name-badge">${className}</span></div>
                    <div class="class-lesson-wrap"><div class="class-lesson-name ${recessClass}">${lessonText}</div></div>
                `;
                container.appendChild(box);
            });
        }

        function cycleMediaSlides() {
            const displayImg = document.getElementById('display-media-img');
            const displayCaption = document.getElementById('display-media-caption');
            const playlist = appConfig.mediaPlaylist || [];

            if (playlist.length === 0) {
                displayImg.src = 'https://placehold.co/800x450/070b13/fff?text=Medya';
                displayCaption.innerText = 'Görsel yüklenmedi.';
                return;
            }

            if (activeMediaSlideIndex >= playlist.length) activeMediaSlideIndex = 0;
            const currentSlide = playlist[activeMediaSlideIndex];
            
            displayImg.style.opacity = 0;
            setTimeout(() => {
                displayImg.src = currentSlide.url;
                displayCaption.innerText = currentSlide.caption;
                displayImg.style.opacity = 1;
            }, 500);

            activeMediaSlideIndex++;
        }

        // AYIN ENLERİ: Çerçeve Şekli seçenekleri. Her şekil, "Görsel Boyutu" değerine göre
        // genişlik/yükseklik oranını (ratioW/ratioH) ve köşe yuvarlaklığını (radius) belirler.
        // Kare/daire şekillerde oran 1:1'dir; dikdörtgen şekillerde "Görsel Boyutu" kısa kenarı temsil eder.
        const ACH_IMG_SHAPES = {
            rounded:        { ratioW: 1,    ratioH: 1,    radius: '8px' },   // Yuvarlak Köşe (kare)
            circle:         { ratioW: 1,    ratioH: 1,    radius: '50%' },   // Daire
            square:         { ratioW: 1,    ratioH: 1,    radius: '0px' },   // Kare (keskin köşe)
            squircle:       { ratioW: 1,    ratioH: 1,    radius: '22%' },   // Yumuşak Kare
            rect_landscape: { ratioW: 1.5,  ratioH: 1,    radius: '8px' },   // Dikdörtgen (Yatay 3:2)
            rect_portrait:  { ratioW: 1,    ratioH: 1.5,  radius: '8px' },   // Dikdörtgen (Dikey 2:3)
            rect_photo:     { ratioW: 4/3,  ratioH: 1,    radius: '6px' },   // Fotoğraf (Yatay 4:3)
            rect_wide:      { ratioW: 16/9, ratioH: 1,    radius: '6px' }    // Geniş Banner (16:9)
        };

        // AYIN ENLERİ: bir kategorinin (alanın) görsel/metin biçim ayarlarını ilgili DOM hücresine uygular.
        // - Metin: yazı tipi, boyutu, rengi, hizalanması
        // - Hücre: görsel konumu (sol/sağ/üst/alt) ve YATAY (ana eksen) hizalama
        // - Hücre içeriği HER ZAMAN dikey (çapraz eksen) olarak ortalanır (align-items: center)
        // - Görsel: boyut, çerçeve şekli (yuvarlak/köşeli/kare/dikdörtgen vb.) ve kenarlık (kalınlık/renk/stil)
        function applyAchievementCategoryStyle(cat, sliderEl) {
            if (!sliderEl) return;
            const st = cat.style || {};
            const titleEl = sliderEl.querySelector('h4');
            const labelEl = sliderEl.querySelector('p');
            const imgEl = sliderEl.querySelector('img');

            if (titleEl) {
                titleEl.style.fontFamily = st.font || '';
                titleEl.style.fontSize = st.size ? (st.size + 'px') : '';
                titleEl.style.color = st.color || '';
                titleEl.style.textAlign = st.textAlign || 'left';
            }

            // Alan başlığı (ör. "Ayın Örnek Öğrencisi") satırı da öğrenci ismiyle
            // AYNI yatay hizalamayı kullanmalı; aksi halde isim ortalanırken başlık solda kalır.
            if (labelEl) {
                const align = st.textAlign || 'left';
                labelEl.style.textAlign = align;
                labelEl.style.justifyContent = align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start');
            }

            sliderEl.style.justifyContent = st.justify || 'center';
            sliderEl.style.alignItems = 'center'; // dikey ortalama (istek: hücrelerdeki veriler dikey ortalı olsun)

            // DİKKAT ÇEKME EFEKTİ: hücrenin tamamına uygulanan animasyonlu vurgu (glow/pulse/border/shine)
            sliderEl.classList.remove('ach-cell-fx-glow', 'ach-cell-fx-pulse', 'ach-cell-fx-border', 'ach-cell-fx-shine');
            const cellFx = st.cellEffect || 'none';
            if (cellFx !== 'none') {
                sliderEl.classList.add('ach-cell-fx-' + cellFx);
                sliderEl.style.setProperty('--ach-cell-fx-color', st.cellEffectColor || '#00b4d8');
            } else {
                sliderEl.style.removeProperty('--ach-cell-fx-color');
            }

            const pos = st.imgPosition || 'left';
            if (pos === 'right') sliderEl.style.flexDirection = 'row-reverse';
            else if (pos === 'top') sliderEl.style.flexDirection = 'column';
            else if (pos === 'bottom') sliderEl.style.flexDirection = 'column-reverse';
            else sliderEl.style.flexDirection = 'row';

            if (imgEl) {
                const size = parseInt(st.imgSize, 10) || 44;
                const shape = st.imgShape || 'rounded';
                const cfg = ACH_IMG_SHAPES[shape] || ACH_IMG_SHAPES.rounded;
                imgEl.style.width = Math.round(size * cfg.ratioW) + 'px';
                imgEl.style.height = Math.round(size * cfg.ratioH) + 'px';
                imgEl.style.borderRadius = cfg.radius;
                const bw = (st.imgBorderWidth === 0 || st.imgBorderWidth) ? parseFloat(st.imgBorderWidth) : 1.5;
                const bStyle = st.imgBorderStyle || 'solid';
                const bColor = st.imgBorderColor || '#00b4d8';
                imgEl.style.border = (bStyle === 'none' || bw === 0) ? 'none' : `${bw}px ${bStyle} ${bColor}`;
                const imgOp = (st.imgOpacity === 0 || st.imgOpacity) ? parseFloat(st.imgOpacity) : 100;
                imgEl.style.opacity = imgOp / 100;

                // DİKKAT ÇEKME EFEKTİ: sadece görselin çevresine uygulanan animasyonlu vurgu (glow/pulse/border)
                imgEl.classList.remove('ach-img-fx-glow', 'ach-img-fx-pulse', 'ach-img-fx-border');
                const imgFx = st.imgEffect || 'none';
                if (imgFx !== 'none') {
                    imgEl.classList.add('ach-img-fx-' + imgFx);
                    imgEl.style.setProperty('--ach-img-fx-color', st.imgEffectColor || '#00b4d8');
                } else {
                    imgEl.style.removeProperty('--ach-img-fx-color');
                }
            }
        }

        // AYIN ENLERİ: iki hücre arasına, genel ayarlara göre çizgi / noktalı desen / simge / (yok) ayırıcı üretir
        function buildAchievementSeparator(aw) {
            const sep = document.createElement('div');
            const type = aw.separator || 'line';
            const thickness = Math.min(20, Math.max(1, parseInt(aw.separatorThickness, 10) || 1));
            if (type === 'none') {
                sep.className = 'achievement-separator ach-sep-none';
            } else if (type === 'icon') {
                sep.className = 'achievement-separator ach-sep-icon';
                sep.innerHTML = `<i class="fa-solid ${aw.separatorIcon || 'fa-star'}"></i>`;
            } else if (type === 'dots') {
                sep.className = 'achievement-separator ach-sep-dots';
                // Kalınlık: yatay yerleşimde genişlik, dikey yerleşimde yükseklik olarak uygulanır
                if ((aw.layout || 'column') === 'row') sep.style.width = thickness + 'px';
                else sep.style.height = thickness + 'px';
            } else {
                sep.className = 'achievement-separator ach-sep-line';
                if ((aw.layout || 'column') === 'row') sep.style.width = thickness + 'px';
                else sep.style.height = thickness + 'px';
            }
            return sep;
        }

        // Bir alana (hücreye), "Ayın Enleri" hücrelerindeki İLE AYNI box-shadow tabanlı
        // dikkat çekme efektini uygular/kaldırır (ach-cell-fx-* sınıfları + --ach-cell-fx-color
        // değişkeni). Kart düzeyindeki pano-fx-* (filter/outline tabanlı) sistemin AKSİNE bu
        // sistem bilinçli olarak tercih edildi: bu alanlar kartın (overflow:hidden + dar iç
        // boşluk) İÇİNDE yer aldığından, filter/outline efektleri kart kenarında kırpılabiliyor;
        // box-shadow ise "Ayın Enleri" hücrelerinde zaten kanıtlanmış şekilde sorunsuz görünüyor.
        function applyCellFxEffect(el, effectType, color) {
            if (!el) return;
            el.classList.remove('ach-cell-fx-glow', 'ach-cell-fx-pulse', 'ach-cell-fx-border', 'ach-cell-fx-shine');
            const fx = effectType || 'none';
            if (fx !== 'none') {
                el.classList.add('ach-cell-fx-' + fx);
                el.style.setProperty('--ach-cell-fx-color', color || '#00b4d8');
            } else {
                el.style.removeProperty('--ach-cell-fx-color');
            }
        }

        // BELİRLİ GÜN & HAVA DURUMU: iki alanın (hücrenin) yerleşimini (dikey/yatay), hizalamasını
        // (yatay/dikey ortalama) ve aralarındaki ayırıcıyı (çizgi/noktalı desen/simge/yok)
        // appConfig.specialDayWidget ayarlarına göre uygular. "Ayın Enleri" kartındaki
        // buildAchievementSeparator() ile aynı mantık, tek farkla: burada hücre sayısı sabit (2)
        // olduğundan tek bir ayırıcı öğesi baştan yaratmak yerine mevcut öğe güncellenir.
        function renderSpecialDayWeatherLayout() {
            const flex = document.getElementById('specialday-weather-flex');
            const sep = document.getElementById('specialday-separator');
            const sdAreaEl = document.getElementById('specialday-area');
            const weatherAreaEl = document.getElementById('weather-area');
            if (!flex || !sep) return;
            const sdw = appConfig.specialDayWidget || defaultAppConfig.specialDayWidget;
            const layout = sdw.layout === 'row' ? 'row' : 'column';
            const type = sdw.separator || 'line';
            const thickness = Math.min(20, Math.max(1, parseInt(sdw.separatorThickness, 10) || 1));

            flex.classList.remove('sdw-layout-row', 'sdw-layout-column');
            flex.classList.add('sdw-layout-' + layout);

            // HİZALAMA: dikey (alanların kart içindeki konumu) = ana eksen (column'da dikey,
            // row'da yatay); yatay (metin hizalama) = çapraz eksen + her alanın kendi text-align'i.
            // NOT: alignH='left' iken column düzeninde çapraz eksende "stretch" kullanılır ki
            // alanlar eskisi gibi tam genişlikte kalsın (geriye dönük uyumluluk).
            const alignH = sdw.alignH || 'left';
            const alignV = sdw.alignV || 'center';
            const crossAlignMapH = { left: 'stretch', center: 'center', right: 'flex-end' };
            const mainAlignMapH = { left: 'flex-start', center: 'center', right: 'flex-end' };
            const alignMapV = { top: 'flex-start', center: 'center', bottom: 'flex-end' };
            if (layout === 'column') {
                flex.style.justifyContent = alignMapV[alignV] || 'center';
                flex.style.alignItems = crossAlignMapH[alignH] || 'stretch';
            } else {
                flex.style.justifyContent = mainAlignMapH[alignH] || 'flex-start';
                flex.style.alignItems = alignMapV[alignV] || 'center';
            }
            [sdAreaEl, weatherAreaEl].forEach(areaEl => {
                if (!areaEl) return;
                areaEl.style.textAlign = alignH === 'center' ? 'center' : (alignH === 'right' ? 'right' : 'left');
            });

            sep.style.width = '';
            sep.style.height = '';
            sep.innerHTML = '';

            if (type === 'none') {
                sep.className = 'sdw-separator sdw-sep-none';
            } else if (type === 'icon') {
                sep.className = 'sdw-separator sdw-sep-icon';
                sep.innerHTML = `<i class="fa-solid ${sdw.separatorIcon || 'fa-star'}"></i>`;
            } else if (type === 'dots') {
                sep.className = 'sdw-separator sdw-sep-dots';
                if (layout === 'row') sep.style.width = thickness + 'px';
                else sep.style.height = thickness + 'px';
            } else {
                sep.className = 'sdw-separator sdw-sep-line';
                if (layout === 'row') sep.style.width = thickness + 'px';
                else sep.style.height = thickness + 'px';
            }

            // ALAN EFEKTLERİ: her alana ayrı ayrı, kart efektleriyle aynı sistemle uygulanır
            applyCellFxEffect(sdAreaEl, sdw.specialdayEffect, sdw.specialdayEffectColor);
            applyCellFxEffect(weatherAreaEl, sdw.weatherEffect, sdw.weatherEffectColor);
        }

        // AYIN ENLERİ: appConfig.achievementCategories listesine göre panodaki kartın içini
        // (istenen sayıda hücre + aralarında ayırıcı ile) baştan üretir.
        function renderAchievementsCard() {
            const container = document.getElementById('achievements-container');
            if (!container) return;
            const cats = (appConfig.achievementCategories || []).filter(c => c.active !== false);
            const aw = appConfig.achievementWidget || defaultAppConfig.achievementWidget;

            // "Yan Yana" (row) düzeninde, kullanıcı satır başına gösterilecek hücre sayısını
            // belirlediyse (columns > 0), taşmayı önlemek için çok satırlı bir IZGARA (grid)
            // kullanılır. 0/boş ise eski davranış (tek satır, taşma yok) korunur.
            const cols = parseInt(aw.columns, 10) || 0;
            const useGrid = aw.layout === 'row' && cols > 0;

            container.classList.remove('ach-layout-row', 'ach-layout-column', 'ach-layout-grid');
            container.style.removeProperty('--ach-cols');
            container.innerHTML = '';

            if (useGrid) {
                container.classList.add('ach-layout-grid');
                container.style.setProperty('--ach-cols', cols);
            } else {
                container.classList.add(aw.layout === 'row' ? 'ach-layout-row' : 'ach-layout-column');
            }

            cats.forEach((cat, idx) => {
                // Izgara (grid) modunda ayırıcı öğeler sütun hizasını bozacağından eklenmez;
                // hücreler arasındaki boşluk (gap) görsel ayrım için yeterlidir.
                if (!useGrid && idx > 0) container.appendChild(buildAchievementSeparator(aw));

                const slider = document.createElement('div');
                slider.className = 'achievement-slider';
                slider.dataset.catId = cat.id;
                slider.innerHTML = `
                    <img src="" class="achievement-img" id="ach-img-${cat.id}" alt="${escapeHtml(cat.title || '')}">
                    <div class="achievement-details">
                        <h4 id="ach-title-${cat.id}">Açıklanmadı</h4>
                        <p><i class="fa-solid ${cat.icon || 'fa-star'}"></i> <span id="ach-label-${cat.id}">${escapeHtml(cat.title || '')}</span></p>
                    </div>
                `;
                container.appendChild(slider);
                applyAchievementCategoryStyle(cat, slider);
            });
        }

        // AYIN ENLERİ: belirli bir kategori (alan) için sıradaki aktif kaydı ekrana getirir (slayt döngüsü)
        function cycleAchievementCategory(catId) {
            const cat = (appConfig.achievementCategories || []).find(c => c.id === catId);
            const titleEl = document.getElementById('ach-title-' + catId);
            const imgEl = document.getElementById('ach-img-' + catId);
            if (!cat || !titleEl || !imgEl) return;

            const list = (cat.list || []).filter(r => r.active !== false);
            const placeholder = 'https://placehold.co/120x120/070b13/fff?text=' + encodeURIComponent((cat.title || '?').slice(0, 12));

            if (list.length === 0) {
                titleEl.innerText = 'Açıklanmadı';
                imgEl.src = placeholder;
                return;
            }

            if (achievementActiveIndex[catId] === undefined || achievementActiveIndex[catId] >= list.length) {
                achievementActiveIndex[catId] = 0;
            }
            const record = list[achievementActiveIndex[catId]];

            imgEl.style.opacity = 0;
            setTimeout(() => {
                titleEl.innerText = record.title || 'Açıklanmadı';
                imgEl.src = record.img || placeholder;
                imgEl.style.opacity = 1;
            }, 400);

            achievementActiveIndex[catId]++;
        }

        function startPanoClocksAndIntervals() {
            setInterval(() => {
                const now = new Date();
                const cs = getClockStyle();

                const dayStr = getTurkishDayName(now.getDay());
                let dateString = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
                if (cs.dateShowWeekday !== false) dateString += ` | ${dayStr}`;

                let hours24 = now.getHours();
                let timeString;
                if (cs.timeFormat === '12') {
                    const suffix = hours24 >= 12 ? 'ÖS' : 'ÖÖ';
                    const hours12 = (hours24 % 12) || 12;
                    timeString = `${hours12.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                    if (cs.timeShowSeconds !== false) timeString += `:${now.getSeconds().toString().padStart(2, '0')}`;
                    timeString += ` ${suffix}`;
                } else {
                    timeString = `${hours24.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                    if (cs.timeShowSeconds !== false) timeString += `:${now.getSeconds().toString().padStart(2, '0')}`;
                }

                document.getElementById('display-clock-date').innerText = dateString;
                document.getElementById('display-clock-time').innerText = timeString;

                calculateCountdownAndTableHighlight(now);
            }, 1000);

            startCyclingModuleIntervals();
        }

        // Modül ayarlarındaki (Modül Ayarları sekmesi) süre (sn) değerlerini okuyup
        // ekrana süreli gelen tüm modüllerin döngü zamanlayıcılarını kurar/yeniden kurar.
        function getModuleIntervalMs(moduleId) {
            const def = moduleDefs.find(m => m.id === moduleId);
            const s = (appConfig.moduleSettings && appConfig.moduleSettings[moduleId]) || {};
            const seconds = (s.interval && s.interval > 0) ? s.interval : (def ? def.defaultInterval : 8) || 8;
            return seconds * 1000;
        }

        function startCyclingModuleIntervals() {
            // Önce çalışan zamanlayıcılar varsa temizle (ayarlar kaydedildiğinde yeniden kurulabilsin diye)
            Object.values(cyclingIntervalTimers).forEach(timerId => clearInterval(timerId));
            cyclingIntervalTimers = {};

            cyclingIntervalTimers.schedule = setInterval(() => {
                activeScheduleGroup = activeScheduleGroup === 1 ? 2 : 1;
                renderActiveScheduleGroup();
            }, getModuleIntervalMs('schedule'));

            cyclingIntervalTimers.birthday = setInterval(cycleBirthdayWidget, getModuleIntervalMs('birthday'));
            cyclingIntervalTimers.quote = setInterval(cycleQuoteWidget, getModuleIntervalMs('quote'));
            cyclingIntervalTimers.specialday = setInterval(cycleSpecialDayWidget, getModuleIntervalMs('specialday'));
            cyclingIntervalTimers.media = setInterval(cycleMediaSlides, getModuleIntervalMs('media'));
            (appConfig.achievementCategories || []).filter(cat => cat.active !== false).forEach(cat => {
                cyclingIntervalTimers['ach_' + cat.id] = setInterval(() => cycleAchievementCategory(cat.id), getModuleIntervalMs('achievements'));
            });
        }

        // Kalan süre metnini (saniye gizle/göster ayarına göre) biçimlendirir
        function formatCountdownDuration(mins, secs, showSeconds) {
            return showSeconds ? `${mins} dk. ${secs} sn` : `${mins} dk.`;
        }

        // Etiket + kalan süre + ek metni (Örn: "(Derste)") tek satırda veya alt alta birleştirir
        function buildCountdownHTML(cs, label, mins, secs, color, suffix) {
            const durationText = formatCountdownDuration(mins, secs, cs.countdownShowSeconds !== false);
            const suffixText = (suffix || '').trim();
            const valueText = suffixText ? `${durationText} ${suffixText}` : durationText;
            const valueHTML = `<span style="color: ${color}; font-weight:bold">${escapeHtml(valueText)}</span>`;
            const labelHTML = escapeHtml(label || '');
            return (cs.countdownLayout === 'stacked') ? `${labelHTML}<br>${valueHTML}` : `${labelHTML} ${valueHTML}`;
        }

        function calculateCountdownAndTableHighlight(now) {
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            let activeId = -1;
            const cs = getClockStyle();
            let countdownText = escapeHtml(cs.countdownOutOfHoursText || 'Eğitim Saatleri Dışındasınız');
            const bhs = getBellHoursSettings();

            // Önce tüm ders satırlarını ve teneffüs satırlarını sıfırla (aktif/etki sınıfları, rozet metni, görünürlük)
            bellHours.forEach(bell => {
                const row = document.getElementById(`bell-row-${bell.id}`);
                if (row) {
                    row.classList.remove('active-row', 'effect-glow', 'effect-pulse', 'effect-border', 'effect-solid');
                }
                const recessRow = document.getElementById(`recess-row-${bell.id}`);
                if (recessRow) {
                    recessRow.classList.remove('active-recess', 'effect-glow', 'effect-pulse', 'effect-border', 'effect-solid');
                    const badge = document.getElementById(`recess-badge-${bell.id}`);
                    if (badge) badge.textContent = '';
                    // 'activeOnly' modunda teneffüs satırları varsayılan olarak gizli, sadece aktif olan gösterilir
                    recessRow.style.display = (bhs.recessDisplayMode === 'activeOnly') ? 'none' : '';
                }
            });

            for (let i = 0; i < bellHours.length; i++) {
                const start = bellHours[i].start;
                const end = bellHours[i].end;

                if (timeStr >= start && timeStr <= end) {
                    activeId = bellHours[i].id;
                    const row = document.getElementById(`bell-row-${activeId}`);
                    if (row) {
                        row.classList.add('active-row');
                        const color = bhs.activeRowColor || '#ffb703';
                        row.style.setProperty('--bell-active-color', color);
                        row.style.setProperty('--bell-active-bg', hexToRgba(color, 0.16));
                        if (bhs.activeRowEffect && bhs.activeRowEffect !== 'none') {
                            row.classList.add('effect-' + bhs.activeRowEffect);
                            if (bhs.activeRowEffect === 'solid') {
                                row.style.setProperty('--bell-active-text-solid', getContrastTextColor(color));
                            }
                        }
                    }

                    const diffMs = calculateTimeDifference(now, end);
                    const mins = Math.floor(diffMs / 60000);
                    const secs = Math.floor((diffMs % 60000) / 1000);
                    countdownText = buildCountdownHTML(cs, cs.countdownInClassLabel || 'Zilin Çalmasına:', mins, secs, cs.countdownInClassColor || '#ef4444', cs.countdownInClassSuffix);
                    break;
                }

                if (i < bellHours.length - 1) {
                    const nextStart = bellHours[i+1].start;
                    if (timeStr > end && timeStr < nextStart) {
                        const diffMs = calculateTimeDifference(now, nextStart);
                        const mins = Math.floor(diffMs / 60000);
                        const secs = Math.floor((diffMs % 60000) / 1000);
                        countdownText = buildCountdownHTML(cs, cs.countdownBreakLabel || 'Derse Giriş Ziline:', mins, secs, cs.countdownBreakColor || '#22c55e', cs.countdownBreakSuffix);

                        // İlgili teneffüs satırını vurgula ve "Şu Anda Teneffüs" rozet metnini doldur
                        const recessRow = document.getElementById(`recess-row-${bellHours[i].id}`);
                        if (recessRow) {
                            recessRow.classList.add('active-recess');
                            recessRow.style.display = ''; // aktif teneffüs 'sadece aktif' modunda da her zaman görünür
                            const recessColor = bhs.activeRecessColor || '#22c55e';
                            recessRow.style.setProperty('--bell-active-recess-color', recessColor);
                            recessRow.style.setProperty('--bell-active-recess-bg', hexToRgba(recessColor, 0.14));
                            const recessEffect = bhs.activeRecessEffect || 'none';
                            if (recessEffect !== 'none') {
                                recessRow.classList.add('effect-' + recessEffect);
                                if (recessEffect === 'solid') {
                                    recessRow.style.setProperty('--bell-active-recess-text-solid', getContrastTextColor(recessColor));
                                }
                            }
                            const badge = document.getElementById(`recess-badge-${bellHours[i].id}`);
                            if (badge) {
                                let badgeText;
                                if (bhs.recessTextMode === 'custom' && (bhs.recessCustomText || '').trim()) {
                                    badgeText = bhs.recessCustomText.trim();
                                } else if (bhs.recessTextMode === 'countdown') {
                                    badgeText = `🔔 Teneffüs ${mins} dk.`;
                                } else {
                                    badgeText = `🔔 Şu Anda Teneffüs`;
                                }
                                badge.textContent = badgeText;
                            }
                        }
                        break;
                    }
                }
            }

            document.getElementById('display-bell-countdown').innerHTML = countdownText;
        }

        function calculateTimeDifference(now, targetTimeStr) {
            const [targetHour, targetMin] = targetTimeStr.split(':').map(Number);
            const targetDate = new Date(now);
            targetDate.setHours(targetHour, targetMin, 0, 0);
            return targetDate - now;
        }

        function daysUntilNextBirthday(dateStr, now) {
            const m = String(dateStr || '').trim().match(/^(\d{1,2})[.\/](\d{1,2})$/);
            if (!m) return 9999;
            const day = parseInt(m[1], 10);
            const month = parseInt(m[2], 10);
            if (!day || !month || month < 1 || month > 12) return 9999;
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let target = new Date(now.getFullYear(), month - 1, day);
            if (target < today) target = new Date(now.getFullYear() + 1, month - 1, day);
            return Math.round((target - today) / 86400000);
        }

        // Bir sonraki kutlamanın hangi yıla denk geldiğini döndürür (yaklaşan tarihe yıl eklemek için)
        function nextBirthdayYear(dateStr, now) {
            const m = String(dateStr || '').trim().match(/^(\d{1,2})[.\/](\d{1,2})$/);
            if (!m) return now.getFullYear();
            const day = parseInt(m[1], 10);
            const month = parseInt(m[2], 10);
            if (!day || !month || month < 1 || month > 12) return now.getFullYear();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let target = new Date(now.getFullYear(), month - 1, day);
            if (target < today) target = new Date(now.getFullYear() + 1, month - 1, day);
            return target.getFullYear();
        }

        function applyBirthdayWidgetChrome() {
            const settings = appConfig.birthdayWidget || defaultAppConfig.birthdayWidget;
            const titleEl = document.getElementById('display-birthday-title');
            const cardEl = document.getElementById('birthday-dashboard-card');
            if (titleEl) titleEl.innerText = settings.title || defaultAppConfig.birthdayWidget.title;
            if (cardEl) cardEl.style.flex = String(settings.cardSize || 1);
        }

        function cycleBirthdayWidget() {
            const container = document.getElementById('birthday-container-box');
            const settings = appConfig.birthdayWidget || defaultAppConfig.birthdayWidget;
            applyBirthdayWidgetChrome();

            const birthdays = appConfig.birthdays || [];
            const now = new Date();
            const todayStr = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}`;
            const todaysBirthdays = birthdays.filter(b => b.date === todayStr);

            if (todaysBirthdays.length === 0 && (birthdays.length === 0 || !settings.showUpcomingWhenEmpty)) {
                container.innerHTML = `
                    <div class="birthday-slider" style="color: var(--text-muted); font-size: 12px;">
                        <i class="fa-solid fa-cake-candles" style="font-size: 28px; color: var(--neon-red); margin-bottom: 8px;"></i>
                        <p>${settings.emptyText || defaultAppConfig.birthdayWidget.emptyText}</p>
                    </div>
                `;
                return;
            }

            let sourceList, subtitle, isUpcoming;
            if (todaysBirthdays.length > 0) {
                sourceList = todaysBirthdays;
                subtitle = settings.todaySubtitle || defaultAppConfig.birthdayWidget.todaySubtitle;
                isUpcoming = false;
            } else {
                const sorted = [...birthdays].sort((a, b) => daysUntilNextBirthday(a.date, now) - daysUntilNextBirthday(b.date, now));
                const count = parseInt(settings.upcomingCount, 10);
                sourceList = (count && count > 0) ? sorted.slice(0, count) : sorted;
                subtitle = settings.upcomingSubtitle || defaultAppConfig.birthdayWidget.upcomingSubtitle;
                isUpcoming = true;
            }

            if (sourceList.length === 0) {
                container.innerHTML = `
                    <div class="birthday-slider" style="color: var(--text-muted); font-size: 12px;">
                        <i class="fa-solid fa-cake-candles" style="font-size: 28px; color: var(--neon-red); margin-bottom: 8px;"></i>
                        <p>${settings.emptyText || defaultAppConfig.birthdayWidget.emptyText}</p>
                    </div>
                `;
                return;
            }

            if (birthdayCycleIndex >= sourceList.length) birthdayCycleIndex = 0;
            const target = sourceList[birthdayCycleIndex];
            const celebrationLabel = settings.celebrationDateLabel || defaultAppConfig.birthdayWidget.celebrationDateLabel;

            // Simgeler (🎈🎉🍰): metni ve konumu ayarlanabilir
            const emojiText = (settings.emojiText !== undefined && settings.emojiText !== null)
                ? settings.emojiText
                : defaultAppConfig.birthdayWidget.emojiText;
            const emojiPosition = settings.emojiPosition || defaultAppConfig.birthdayWidget.emojiPosition;
            const emojiSize = parseInt(settings.emojiSize, 10) || defaultAppConfig.birthdayWidget.emojiSize;
            const emojiHtml = (emojiText && emojiPosition !== 'hidden')
                ? `<div class="b-emoji" style="font-size: ${emojiSize}px; margin: 6px 0; line-height: 1;">${emojiText}</div>`
                : '';

            // Yaklaşan tarihe (varsa) yıl bilgisini ekleme seçeneği
            let displayDate = target.date;
            if (isUpcoming && settings.showYearInUpcoming) {
                const yr = nextBirthdayYear(target.date, now);
                displayDate = `${target.date}.${yr}`;
            }

            const nameBlock = `<div class="b-class">${target.class} Sınıfı</div><div class="b-name">${target.name}</div>`;
            const subtitleBlock = `<div style="font-size: 11px; color: var(--neon-yellow); font-weight: 600;">${subtitle}</div>`;
            const dateBlock = isUpcoming ? `<div class="b-count">${celebrationLabel}: ${displayDate}</div>` : '';

            let bodyHtml;
            if (emojiPosition === 'top') {
                bodyHtml = `${emojiHtml}${nameBlock}${subtitleBlock}${dateBlock}`;
            } else if (emojiPosition === 'bottom') {
                bodyHtml = `${nameBlock}${subtitleBlock}${dateBlock}${emojiHtml}`;
            } else if (emojiPosition === 'hidden') {
                bodyHtml = `${nameBlock}${subtitleBlock}${dateBlock}`;
            } else {
                // 'middle' (varsayılan): isim ile alt yazı arasında
                bodyHtml = `${nameBlock}${emojiHtml}${subtitleBlock}${dateBlock}`;
            }

            container.innerHTML = `<div class="birthday-slider">${bodyHtml}</div>`;
            birthdayCycleIndex++;
        }

        function cycleQuoteWidget() {
            const quoteEl = document.getElementById('display-quote');
            const authorEl = document.getElementById('display-quote-author');
            if (!quoteEl || !authorEl) return;

            const quotes = (appConfig.quotes && appConfig.quotes.length > 0)
                ? appConfig.quotes
                : [{ text: defaultAppConfig.quote, author: defaultAppConfig.quoteAuthor, date: "" }];

            const now = new Date();
            const todayStr = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}`;

            const todaysQuotes = quotes.filter(q => q.date && q.date === todayStr);
            const sourceList = todaysQuotes.length > 0 ? todaysQuotes : quotes;

            if (quoteCycleIndex >= sourceList.length) quoteCycleIndex = 0;
            const target = sourceList[quoteCycleIndex];

            quoteEl.innerText = `"${target.text}"`;
            authorEl.innerText = target.author || "";
            quoteCycleIndex++;
        }

        function isSpecialDayActiveToday(sd) {
            if (!sd.startDate && !sd.endDate) return true; // Tarihsiz kayıt = sürekli havuzda
            const parseVal = (str) => {
                const parts = String(str || '').split('.');
                if (parts.length < 2) return null;
                const d = parseInt(parts[0], 10), m = parseInt(parts[1], 10);
                if (isNaN(d) || isNaN(m)) return null;
                return m * 100 + d;
            };
            const startVal = parseVal(sd.startDate);
            if (startVal === null) return true;
            const endVal = parseVal(sd.endDate) ?? startVal;
            const now = new Date();
            const todayVal = (now.getMonth() + 1) * 100 + now.getDate();
            if (endVal >= startVal) {
                return todayVal >= startVal && todayVal <= endVal;
            }
            // Yıl sonu/başı sarması (örn: 28.12 - 05.01)
            return todayVal >= startVal || todayVal <= endVal;
        }

        // "Boşken gösterilecek içerik" durumunu (metin/görsel) panoda uygular
        function applySpecialDayEmptyState(sdwSettings) {
            const textEl = document.getElementById('display-special-day');
            const imgEl = document.getElementById('display-special-day-img');
            const useImage = sdwSettings.emptyMode === 'image' && sdwSettings.emptyImage;
            if (useImage) {
                if (imgEl) {
                    imgEl.src = sdwSettings.emptyImage;
                    imgEl.classList.remove('hidden');
                }
                if (textEl) textEl.classList.add('hidden');
            } else {
                if (imgEl) {
                    imgEl.classList.add('hidden');
                    imgEl.src = '';
                }
                if (textEl) {
                    textEl.classList.remove('hidden');
                    textEl.style.color = sdwSettings.textColor || '';
                    textEl.style.fontFamily = sdwSettings.textFont || '';
                    textEl.style.fontSize = sdwSettings.textSize ? (sdwSettings.textSize + 'px') : '';
                    textEl.innerText = sdwSettings.emptyText || defaultAppConfig.specialDayWidget.emptyText;
                }
            }
        }

        function cycleSpecialDayWidget() {
            const displayEl = document.getElementById('display-special-day');
            const imgEl = document.getElementById('display-special-day-img');
            const sdwSettings = appConfig.specialDayWidget || defaultAppConfig.specialDayWidget;
            const specials = appConfig.specialDays || [];

            // Sadece BUGÜN aktif olan tarihli kayıtlar; yoksa tarihsiz (her zaman geçerli) genel kayıtlar.
            // İkisi de yoksa (bugün için hiçbir belirli gün/hafta yoksa) "boşken gösterilecek içerik" devreye girer
            // — artık tarihi geçmiş/gelecek kayıtlara geri dönülmüyor.
            const todaysSpecials = specials.filter(sd => (sd.startDate || sd.endDate) && isSpecialDayActiveToday(sd));
            const generalSpecials = specials.filter(sd => !sd.startDate && !sd.endDate);
            const sourceList = todaysSpecials.length > 0 ? todaysSpecials : generalSpecials;

            if (sourceList.length === 0) {
                applySpecialDayEmptyState(sdwSettings);
                return;
            }

            // Aktif içerik varken görsel gizlenip metin gösterilir
            if (imgEl) imgEl.classList.add('hidden');
            if (displayEl) displayEl.classList.remove('hidden');

            if (specialDayCycleIndex >= sourceList.length) specialDayCycleIndex = 0;
            const item = sourceList[specialDayCycleIndex];
            specialDayCycleIndex++;

            // Her kayıt kendi renk/font/boyutunu taşıyabilir; boşsa genel (varsayılan) biçim kullanılır.
            displayEl.style.color = item.color || sdwSettings.textColor || '';
            displayEl.style.fontFamily = item.font || sdwSettings.textFont || '';
            displayEl.style.fontSize = (item.size || sdwSettings.textSize) ? ((item.size || sdwSettings.textSize) + 'px') : '';
            displayEl.innerText = item.title || "";
        }

        // Open-Meteo "weathercode" (WMO) değerini ve gündüz/gece bilgisini uygun bir emoji ikonuna çevirir.
        function getWeatherIconByCode(code, isDay) {
            const day = isDay !== 0; // Open-Meteo: is_day 1 = gündüz, 0 = gece
            switch (code) {
                case 0: return day ? '☀️' : '🌙';
                case 1: return day ? '🌤️' : '🌙';
                case 2: return day ? '⛅' : '☁️';
                case 3: return '☁️';
                case 45: case 48: return '🌫️';
                case 51: case 53: case 55: return '🌦️';
                case 56: case 57: return '🌧️';
                case 61: case 63: case 65: return '🌧️';
                case 66: case 67: return '🌨️';
                case 71: case 73: case 75: return '❄️';
                case 77: return '🌨️';
                case 80: case 81: case 82: return '🌦️';
                case 85: case 86: return '🌨️';
                case 95: return '⛈️';
                case 96: case 99: return '⛈️';
                default: return null; // bilinmeyen kod: çağıran taraf yedek ikonu kullanır
            }
        }

        // Etiket/Şehir/İkon/Derece öğelerinden birine renk/font/boyut uygular; alan boşsa eski
        // (tüm satırı tek biçimde ayarlayan) weatherColor/weatherFont/weatherSize alanlarına,
        // o da boşsa temaya (varsayılana) düşer.
        function applyWeatherPartStyle(el, sdwSettings, colorKey, fontKey, sizeKey) {
            if (!el) return;
            el.style.color = sdwSettings[colorKey] || sdwSettings.weatherColor || '';
            el.style.fontFamily = sdwSettings[fontKey] || sdwSettings.weatherFont || '';
            const size = sdwSettings[sizeKey] || sdwSettings.weatherSize;
            el.style.fontSize = size ? (size + 'px') : '';
        }

        async function fetchLiveWeather() {
            const sdwSettings = appConfig.specialDayWidget || defaultAppConfig.specialDayWidget;
            const weatherLabelEl = document.getElementById('display-weather-label');
            if (weatherLabelEl) {
                weatherLabelEl.innerText = sdwSettings.weatherLabel || defaultAppConfig.specialDayWidget.weatherLabel;
                weatherLabelEl.style.color = sdwSettings.labelColor || '';
                weatherLabelEl.style.fontFamily = sdwSettings.labelFont || '';
                weatherLabelEl.style.fontSize = sdwSettings.labelSize ? (sdwSettings.labelSize + 'px') : '';
            }
            const fallbackIcon = sdwSettings.weatherIcon || defaultAppConfig.specialDayWidget.weatherIcon;
            const weatherErrorIcon = sdwSettings.weatherErrorIcon || defaultAppConfig.specialDayWidget.weatherErrorIcon;

            const cityEl = document.getElementById('display-weather-city');
            const tempEl = document.getElementById('display-weather-temp');
            const iconEl = document.getElementById('display-weather-icon');
            applyWeatherPartStyle(cityEl, sdwSettings, 'cityColor', 'cityFont', 'citySize');
            applyWeatherPartStyle(tempEl, sdwSettings, 'tempColor', 'tempFont', 'tempSize');
            applyWeatherPartStyle(iconEl, sdwSettings, 'iconColor', 'iconFont', 'iconSize');

            try {
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${appConfig.weatherLat}&longitude=${appConfig.weatherLng}&current_weather=true`);
                const data = await response.json();
                if (data && data.current_weather) {
                    const temp = Math.round(data.current_weather.temperature);
                    // İkon artık gerçek hava şartına (açık/bulutlu/yağmurlu/karlı/fırtınalı vb.) ve
                    // gündüz/gece durumuna göre otomatik seçilir; kod okunamazsa yedek ikona düşer.
                    const autoIcon = getWeatherIconByCode(data.current_weather.weathercode, data.current_weather.is_day);
                    const weatherIcon = autoIcon || fallbackIcon;
                    if (cityEl) cityEl.innerText = appConfig.cityName;
                    if (tempEl) tempEl.innerText = `${temp}°C`;
                    if (iconEl) iconEl.innerText = weatherIcon;
                    writeCMSLog(`Canlı hava durumu başarıyla çekildi: ${appConfig.cityName} ${temp}°C`);
                }
            } catch (e) {
                if (cityEl) cityEl.innerText = appConfig.cityName;
                if (tempEl) tempEl.innerText = '--°C';
                if (iconEl) iconEl.innerText = weatherErrorIcon;
                writeCMSLog("Hava durumu bağlantı hatası.");
            }
        }

        /* TÜM MODÜLLER İÇİN: BAŞLIK / EBAT / RENK / ARKA PLAN / YAYIN DURUMU UYGULAMA */

        // Sayfa ilk açıldığında (kullanıcı hiçbir özelleştirme yapmadan önce) her modülün
        // kenarlık rengi, kart arka planı ve başlık arka planı için HTML içinde tanımlı
        // ORİJİNAL/VARSAYILAN değerlerini bir kereliğine yakalar. "Varsayılana Dön" seçeneği
        // bu yakalanan gerçek özgün değerlere geri döner (boş bırakmak yerine).
        // NOT: "Okul Marka Alanı" (brand) kartının çerçeve/arkaplan/efekti, "Kimlik & Güvenlik"
        // sekmesindeki "Çerçeve, Arkaplan & Efekt" bölümünden ayrıca (iç .school-brand kutusuna)
        // uygulanır; buradaki genel modül ayarları ise dış kart sarmalayıcısına (#brand-dashboard-card)
        // uygulanır — diğer tüm modüllerle aynı şekilde.
        let panoModuleDefaultAppearance = null;
        function captureModuleDefaultAppearance() {
            if (panoModuleDefaultAppearance) return;
            panoModuleDefaultAppearance = {};
            moduleDefs.forEach(def => {
                const card = document.querySelector(def.cardSel);
                if (!card) return;
                const headerEl = card.querySelector(':scope > .card-header');
                panoModuleDefaultAppearance[def.id] = {
                    borderColor: card.style.borderColor || '',
                    cardBg: card.style.background || '',
                    headerBg: headerEl ? (headerEl.style.background || '') : '',
                    headerColor: headerEl ? (headerEl.style.color || '') : ''
                };
            });
        }

        function applyModuleSettingsToDashboard() {
            captureModuleDefaultAppearance();
            const zoomMap = { small: 0.85, normal: 1, large: 1.15 };
            moduleDefs.forEach(def => {
                if (!def.cardSel) return; // Özel modüllerde cardSel boş olabilir
                const card = document.querySelector(def.cardSel);
                if (!card) return;
                const s = (appConfig.moduleSettings && appConfig.moduleSettings[def.id]) || {};
                const dflt = panoModuleDefaultAppearance[def.id] || { borderColor: '', cardBg: '', headerBg: '', headerColor: '' };

                // Yayında / Yayın Dışı
                card.style.display = (s.active === false) ? 'none' : '';

                // Ebat (Kart İçeriği Ölçeklendirme)
                card.style.zoom = zoomMap[s.size] || 1;

                // Kenarlık Rengi (özel seçilmemişse özgün varsayılana döner)
                if (s.color) {
                    card.style.borderColor = s.color;
                    card.style.boxShadow = `0 0 15px ${s.color}33`;
                } else {
                    card.style.borderColor = dflt.borderColor;
                    card.style.boxShadow = '';
                }

                // Modül Saydamlığı, Kenarlık Kalınlığı, Köşe Oranı — marka (üst logo) kartında uygulanmaz.
                // NOT: "Modül Saydamlığı" artık kartın TÜMÜNÜ (metin dahil) soldurmuyor — sadece
                // arka plan katmanının (bkz. style.css .dashboard-card::after) opaklığını
                // değiştiriyor; böylece yazı/görsel her zaman net kalır. Kenarlık kalınlığı için
                // "1" nötr/varsayılan değer kabul edilir (tema kendi kenarlığını kullanmaya
                // devam eder); sadece kullanıcı bilinçli olarak farklı bir değer seçtiğinde
                // (0 dahil) gerçek bir geçersiz kılma uygulanır.
                const moduleOpacity = (typeof s.moduleOpacity === 'number' ? s.moduleOpacity : 100) / 100;
                card.style.setProperty('--pano-module-opacity', moduleOpacity);
                card.style.borderWidth = (typeof s.borderWidth === 'number' && s.borderWidth !== 1) ? s.borderWidth + 'px' : '';
                card.style.borderRadius = s.cornerRadius ? (s.cornerRadius + 'px') : '';

                // Modül Arka Planı (düz renk / degrade / varsayılan) — arka plan artık doğrudan
                // kartın kendi "background"ı değil, --pano-module-bg CSS değişkeni üzerinden
                // ::after katmanına aktarılıyor (Modül Saydamlığı'nın SADECE bu katmanı
                // etkileyebilmesi için).
                if (s.bgType === 'gradient' && s.bgColor1 && s.bgColor2) {
                    card.style.setProperty('--pano-module-bg', `linear-gradient(135deg, ${s.bgColor1}, ${s.bgColor2})`);
                } else if (s.bgType === 'solid' && s.bgColor1) {
                    card.style.setProperty('--pano-module-bg', s.bgColor1);
                } else {
                    card.style.removeProperty('--pano-module-bg'); // temanın --card-bg varsayılanına düşer
                }

                // KART EFEKTİ: dikkat çekmesi istenen modülleri (ör. Saat, Doğum Günleri) vurgulayan
                // animasyonlu efekt (glow/pulse/border/shine).
                // "Efekt Işıma Oranı", efektin GÜCÜNÜ (--pano-fx-intensity çarpanı; bkz. style.css)
                // ayarlar — ör. 0 = efekt yok, 1 = normal, 2.2 = çok güçlü ışıma.
                card.classList.remove('pano-fx-glow', 'pano-fx-pulse', 'pano-fx-border', 'pano-fx-shine', 'pano-fx-neon', 'pano-fx-flicker', 'pano-fx-corner');
                const cellFx = s.cellEffect || 'none';
                if (cellFx !== 'none') {
                    card.classList.add('pano-fx-' + cellFx);
                    card.style.setProperty('--pano-fx-color', s.cellEffectColor || '#00b4d8');
                    const intensity = (parseInt(s.effectIntensity, 10) || 100) / 100;
                    card.style.setProperty('--pano-fx-intensity', intensity);
                } else {
                    card.style.removeProperty('--pano-fx-color');
                    card.style.removeProperty('--pano-fx-intensity');
                }

                // Başlık Arka Planı (düz renk / degrade / varsayılan) + Başlık Yazı Rengi
                const headerEl = card.querySelector(':scope > .card-header');
                if (headerEl) {
                    if (s.titleBgType === 'gradient' && s.titleBgColor1 && s.titleBgColor2) {
                        headerEl.style.background = `linear-gradient(to right, ${s.titleBgColor1}, ${s.titleBgColor2})`;
                    } else if (s.titleBgType === 'solid' && s.titleBgColor1) {
                        headerEl.style.background = s.titleBgColor1;
                    } else {
                        headerEl.style.background = dflt.headerBg;
                    }
                    headerEl.style.color = s.titleColor || dflt.headerColor;
                }

                // Başlık (metin) + Başlık Aktif/Pasif (başlık çubuğunu göster/gizle)
                if (def.hasTitle && def.titleSel) {
                    const titleEl = document.querySelector(def.titleSel);
                    if (titleEl && s.title) titleEl.innerText = s.title;
                    // .card-header (başlık çubuğu) varsa onu, yoksa doğrudan başlık öğesini göster/gizle
                    const titleBar = headerEl || titleEl;
                    if (titleBar) titleBar.style.display = (s.titleActive === false) ? 'none' : '';
                }

                // Özel modüller: panoda otomatik oluşturulan kartın gövdesine kullanıcının
                // eklediği görseli (varsa) ve metnini yaz
                if (!def.builtIn) {
                    const bodyEl = card.querySelector(':scope > .card-body');
                    if (bodyEl) {
                        const imgFrameStyle = imageFrameStyleString({ opacity: s.imgOpacity, borderWidth: s.imgBorderWidth, borderColor: s.imgBorderColor, ratio: s.imgRatio });
                        const imgHtml = s.image ? `<img src="${s.image.replace(/"/g, '&quot;')}" style="max-width:100%;max-height:65%;object-fit:contain;border-radius:8px;margin:0 auto 6px auto;display:block;${imgFrameStyle}">` : '';
                        const textHtml = (s.content || '').replace(/</g, '&lt;').replace(/\n/g, '<br>');
                        bodyEl.innerHTML = imgHtml + textHtml;
                    }
                }
            });

            applyModuleFontOverrides();
        }

        // Her modül için seçilen fontu, o modülün TÜM içeriğine (başlık + gövde)
        // FontAwesome ikonları hariç tutarak !important ile zorunlu kılan dinamik
        // bir <style> etiketi oluşturur/günceller.
        function applyModuleFontOverrides() {
            let css = '';
            moduleDefs.forEach(def => {
                if (!def.cardSel) return;
                const s = (appConfig.moduleSettings && appConfig.moduleSettings[def.id]) || {};
                if (s.font) {
                    css += `${def.cardSel}, ${def.cardSel} *:not(i) { font-family: ${s.font} !important; }
`;
                }
            });
            let styleTag = document.getElementById('pano-module-font-overrides');
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'pano-module-font-overrides';
                document.head.appendChild(styleTag);
            }
            styleTag.textContent = css;
        }

        // Yerleşik modüllerin ayar bloklarının artık hangi sekmede (kendi menüsünde) gösterileceğini
        // belirler. Özel (kullanıcı tarafından eklenen) modüllerin sabit bir menüsü olmadığından,
        // bunlar "Modül Ayarları" sekmesindeki genel listede (admin-module-settings-list) kalmaya devam eder.
        const MODULE_SETTINGS_EMBED_TARGETS = {
            brand: 'module-embed-brand',
            birthday: 'module-embed-birthday',
            schedule: 'module-embed-schedule',
            quote: 'module-embed-quote',
            specialday: 'module-embed-specialday',
            announcements: 'module-embed-announcements',
            bellhours: 'module-embed-bellhours',
            clock: 'module-embed-clock',
            achievements: 'module-embed-achievements',
            duty: 'module-embed-duty',
            media: 'module-embed-media',
            marquee: 'module-embed-marquee'
        };

        function renderAdminModuleSettings() {
            const fallback = document.getElementById('admin-module-settings-list');
            // Önceki çizimden kalan satırları temizlemek için tüm olası hedef konteynerleri boşalt
            const targetIds = new Set(Object.values(MODULE_SETTINGS_EMBED_TARGETS));
            targetIds.add('admin-module-settings-list');
            targetIds.forEach(elId => {
                const el = document.getElementById(elId);
                if (el) el.innerHTML = "";
            });
            if (!fallback) return;
            const fontOptions = [
                { value: "", label: "Varsayılan" },
                { value: "'Rajdhani', sans-serif", label: "Rajdhani" },
                { value: "'Roboto', sans-serif", label: "Roboto" },
                { value: "'Fira Code', monospace", label: "Fira Code" },
                { value: "Arial, sans-serif", label: "Arial" },
                { value: "Georgia, serif", label: "Georgia" },
                { value: "'Times New Roman', serif", label: "Times New Roman" },
                { value: "Verdana, sans-serif", label: "Verdana" }
            ];

            moduleDefs.forEach(def => {
                const s = (appConfig.moduleSettings && appConfig.moduleSettings[def.id]) || { title: "", color: "", bgType: "", bgColor1: "", bgColor2: "", titleBgType: "", titleBgColor1: "", titleBgColor2: "", titleColor: "", font: "", size: "normal", active: true, titleActive: true, cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100 };
                const isCustom = !def.builtIn;
                const row = document.createElement('div');
                row.className = 'bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-3';
                row.setAttribute('data-module-row', def.id);

                // Modül adı: özel modüller için düzenlenebilir
                const labelHtml = isCustom
                    ? `<input type="text" value="${(def.label || '').replace(/"/g, '&quot;')}" placeholder="Modül Adı"
                         onchange="moduleSettingsRenameLabel('${def.id}', this.value)"
                         class="bg-transparent border-b border-slate-700 text-white text-xs font-bold w-full outline-none focus:border-cyan-500 pb-0.5">`
                    : `<span class="text-xs font-bold text-white">${def.label}</span>`;

                // Eylem butonları
                const actionBtns = `
                    <div class="flex items-center gap-1 ml-auto">
                        <button type="button" title="Bu modülü kopyala" onclick="moduleSettingsDuplicate('${def.id}')"
                            class="px-2 py-1 bg-slate-800 hover:bg-cyan-600 text-slate-400 hover:text-white text-[10px] rounded-lg transition flex items-center gap-1">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                        ${isCustom ? `<button type="button" title="Bu modülü sil" onclick="moduleSettingsDelete('${def.id}')"
                            class="px-2 py-1 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white text-[10px] rounded-lg transition flex items-center gap-1">
                            <i class="fa-solid fa-trash"></i>
                        </button>` : ''}
                    </div>`;

                // Özel modüller için kart seçici alanı (artık opsiyonel — kart otomatik oluşturulur)
                // ve panoda gösterilecek serbest metin içeriği alanı
                const cardSelHtml = isCustom ? `
                    <div class="col-span-12 flex items-center gap-2 pb-1 border-b border-slate-800/50">
                        <i class="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>
                        <span class="text-[10px] text-emerald-500 font-bold">Bu modül için panoda kart otomatik oluşturuldu.</span>
                    </div>
                    <div class="col-span-12 flex items-start gap-2 pb-1 border-b border-slate-800/50">
                        <i class="fa-solid fa-align-left text-emerald-400 text-[10px] mt-1.5"></i>
                        <span class="text-[10px] uppercase text-slate-500 font-bold whitespace-nowrap mt-1">İçerik</span>
                        <textarea id="mod-content-${def.id}" rows="2" placeholder="Bu kartta gösterilecek metin"
                            oninput="moduleSettingsOnChange('${def.id}')"
                            class="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-xs outline-none focus:border-cyan-500">${(s.content || '').replace(/</g, '&lt;')}</textarea>
                    </div>
                    <div class="col-span-12 flex items-start gap-2 pb-1 border-b border-slate-800/50">
                        <i class="fa-solid fa-image text-emerald-400 text-[10px] mt-1.5"></i>
                        <span class="text-[10px] uppercase text-slate-500 font-bold whitespace-nowrap mt-1">Görsel</span>
                        <div class="flex-1 flex items-center gap-2 flex-wrap">
                            <img id="mod-image-preview-${def.id}" src="${(s.image || '').replace(/"/g, '&quot;')}" class="w-10 h-10 rounded-lg object-cover border border-slate-800 ${s.image ? '' : 'hidden'}">
                            <label class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] rounded-lg cursor-pointer whitespace-nowrap flex items-center gap-1.5">
                                <i class="fa-solid fa-upload"></i> Fotoğraf Yükle
                                <input type="file" accept="image/*" class="hidden" onchange="handleCustomModuleImageSelect('${def.id}', this)">
                            </label>
                            <button type="button" onclick="removeCustomModuleImage('${def.id}')" id="mod-image-remove-${def.id}"
                                class="px-2 py-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white text-[10px] rounded-lg ${s.image ? '' : 'hidden'}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                            <input type="hidden" id="mod-image-${def.id}" value="${(s.image || '').replace(/"/g, '&quot;')}">
                        </div>
                    </div>
                    <div class="col-span-12 flex items-center gap-3 flex-wrap pb-1 border-b border-slate-800/50">
                        <span class="text-[10px] uppercase text-slate-500 font-bold whitespace-nowrap">Görsel Çerçevesi</span>
                        <div class="flex items-center gap-1.5">
                            <label class="text-[10px] text-slate-500">Saydamlık</label>
                            <input type="range" id="mod-img-opacity-${def.id}" min="20" max="100" value="${s.imgOpacity ?? 100}"
                                oninput="document.getElementById('mod-img-opacity-val-${def.id}').innerText=this.value; moduleSettingsOnChange('${def.id}')" class="w-20 accent-cyan-500">
                            <span id="mod-img-opacity-val-${def.id}" class="text-[10px] text-slate-400 w-7">${s.imgOpacity ?? 100}</span>%
                        </div>
                        <div class="flex items-center gap-1.5">
                            <label class="text-[10px] text-slate-500">Kalınlık</label>
                            <input type="range" id="mod-img-border-${def.id}" min="0" max="8" value="${s.imgBorderWidth ?? 0}"
                                oninput="document.getElementById('mod-img-border-val-${def.id}').innerText=this.value; moduleSettingsOnChange('${def.id}')" class="w-20 accent-cyan-500">
                            <span id="mod-img-border-val-${def.id}" class="text-[10px] text-slate-400 w-5">${s.imgBorderWidth ?? 0}</span>px
                            <input type="color" id="mod-img-bordercolor-${def.id}" value="${s.imgBorderColor || '#00b4d8'}"
                                oninput="moduleSettingsOnChange('${def.id}')" class="w-7 h-7 bg-slate-900 border border-slate-800 rounded cursor-pointer">
                        </div>
                        <div class="flex items-center gap-1.5">
                            <label class="text-[10px] text-slate-500">Oran</label>
                            <select id="mod-img-ratio-${def.id}" onchange="moduleSettingsOnChange('${def.id}')" class="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-200">
                                <option value="auto" ${(!s.imgRatio || s.imgRatio === 'auto') ? 'selected' : ''}>Serbest</option>
                                <option value="1/1" ${s.imgRatio === '1/1' ? 'selected' : ''}>1:1</option>
                                <option value="4/3" ${s.imgRatio === '4/3' ? 'selected' : ''}>4:3</option>
                                <option value="16/9" ${s.imgRatio === '16/9' ? 'selected' : ''}>16:9</option>
                                <option value="3/4" ${s.imgRatio === '3/4' ? 'selected' : ''}>3:4</option>
                            </select>
                        </div>
                    </div>
                    <details class="col-span-12">
                        <summary class="text-[10px] text-slate-600 cursor-pointer select-none">Gelişmiş: farklı bir HTML elemanına bağla (opsiyonel)</summary>
                        <div class="flex items-center gap-2 pt-1.5">
                            <span class="text-[10px] uppercase text-slate-500 font-bold whitespace-nowrap">Kart Seçici (CSS)</span>
                            <input type="text" id="mod-cardsel-${def.id}" value="${(def.cardSel || '').replace(/"/g, '&quot;')}"
                                placeholder="#kart-id veya .sinif"
                                onchange="moduleSettingsUpdateCardSel('${def.id}', this.value)"
                                class="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-[10px] font-mono outline-none focus:border-cyan-500">
                        </div>
                    </details>` : '';

                row.innerHTML = `
                    <div class="grid grid-cols-12 gap-3 items-center">
                        <div class="col-span-3 flex items-center gap-2 min-w-0">
                            <i class="fa-solid fa-cube ${def.builtIn ? 'text-cyan-400' : 'text-emerald-400'} shrink-0"></i>
                            <div class="min-w-0 flex-1">${labelHtml}</div>
                            ${isCustom ? '<span class="text-[9px] text-emerald-600 font-bold shrink-0">ÖZEL</span>' : ''}
                        </div>
                        <div class="col-span-3">
                            ${def.hasTitle
                                ? `<input type="text" id="mod-title-${def.id}" value="${(s.title || '').replace(/"/g, '&quot;')}" placeholder="Modül Başlığı"
                                     oninput="moduleSettingsOnChange('${def.id}')"
                                     class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs">`
                                : `<span class="text-[10px] text-slate-500 italic">Bu modülün başlığı yoktur</span>`}
                        </div>
                        <div class="col-span-2">
                            <select id="mod-size-${def.id}" onchange="moduleSettingsOnChange('${def.id}')" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs">
                                <option value="small" ${s.size === 'small' ? 'selected' : ''}>Küçük</option>
                                <option value="normal" ${(!s.size || s.size === 'normal') ? 'selected' : ''}>Normal</option>
                                <option value="large" ${s.size === 'large' ? 'selected' : ''}>Büyük</option>
                            </select>
                        </div>
                        <div class="col-span-1 flex justify-center">
                            ${def.hasInterval
                                ? `<input type="number" min="1" step="1" id="mod-interval-${def.id}" value="${s.interval || def.defaultInterval || 8}"
                                     title="Bu modülün ekranda kaç saniyede bir değişeceğini belirler"
                                     oninput="moduleSettingsOnChange('${def.id}')"
                                     class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs text-center">`
                                : `<span class="text-[10px] text-slate-500 italic">—</span>`}
                        </div>
                        <div class="col-span-1 flex justify-center">
                            <label class="flex items-center gap-1 cursor-pointer" title="Modül yayında mı?">
                                <input type="checkbox" id="mod-active-${def.id}" ${s.active === false ? '' : 'checked'}
                                    onchange="moduleSettingsOnChange('${def.id}')" class="w-4 h-4 accent-emerald-500">
                            </label>
                        </div>
                        <div class="col-span-1 flex justify-center">
                            <label class="flex items-center gap-1 ${def.hasTitle ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'}"
                                title="${def.hasTitle ? 'Başlık çubuğunu göster/gizle' : 'Bu modülün başlığı yoktur'}">
                                <input type="checkbox" id="mod-title-active-${def.id}" ${s.titleActive === false ? '' : 'checked'}
                                    ${def.hasTitle ? '' : 'disabled'}
                                    onchange="moduleSettingsOnChange('${def.id}')" class="w-4 h-4 accent-cyan-500">
                            </label>
                        </div>
                        <div class="col-span-1 flex justify-end">${actionBtns}</div>
                    </div>
                    ${cardSelHtml}
                    <div class="space-y-3 pt-2 border-t border-slate-800/70">
                        <div class="flex flex-wrap items-center gap-4">
                            <div class="flex items-center gap-2">
                                <label class="flex items-center gap-1 cursor-pointer" title="Kenarlık rengini özelleştir">
                                    <input type="checkbox" id="mod-color-enable-${def.id}" ${s.color ? 'checked' : ''}
                                        onchange="panoToggleCustomColorUI('${def.id}','color'); moduleSettingsOnChange('${def.id}')" class="w-3.5 h-3.5 accent-cyan-500">
                                    <span class="text-[10px] uppercase text-slate-500 font-bold">Kenarlık</span>
                                </label>
                                <input type="color" id="mod-color-${def.id}" value="${s.color || '#00b4d8'}" ${s.color ? '' : 'disabled'}
                                    onchange="moduleSettingsOnChange('${def.id}')" class="w-9 h-8 bg-slate-900 border border-slate-800 rounded cursor-pointer disabled:opacity-40">
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="flex items-center gap-1 cursor-pointer" title="Başlık yazı rengini özelleştir">
                                    <input type="checkbox" id="mod-titlecolor-enable-${def.id}" ${s.titleColor ? 'checked' : ''}
                                        onchange="panoToggleCustomColorUI('${def.id}','titlecolor'); moduleSettingsOnChange('${def.id}')" ${def.hasTitle ? '' : 'disabled'} class="w-3.5 h-3.5 accent-cyan-500">
                                    <span class="text-[10px] uppercase text-slate-500 font-bold">Başlık Yazısı</span>
                                </label>
                                <input type="color" id="mod-titlecolor-${def.id}" value="${s.titleColor || '#ffffff'}" ${(s.titleColor && def.hasTitle) ? '' : 'disabled'}
                                    onchange="moduleSettingsOnChange('${def.id}')" class="w-9 h-8 bg-slate-900 border border-slate-800 rounded cursor-pointer disabled:opacity-40">
                            </div>
                            <div class="flex items-center gap-2 flex-1 min-w-[180px]">
                                <span class="text-[10px] uppercase text-slate-500 font-bold whitespace-nowrap">Font</span>
                                <select id="mod-font-${def.id}" onchange="moduleSettingsOnChange('${def.id}')" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs">
                                    ${fontOptions.map(f => `<option value="${f.value}" style="font-family:${f.value || 'inherit'};" ${((s.font || '') === f.value) ? 'selected' : ''}>${f.label}</option>`).join('')}
                                </select>
                            </div>
                            <button type="button" title="Bu modülün tüm görünüm ayarlarını varsayılana döndürür"
                                class="ml-auto px-3 py-1.5 bg-slate-800 hover:bg-red-500/80 text-slate-300 hover:text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition"
                                onclick="panoResetModuleAppearance('${def.id}')">
                                <i class="fa-solid fa-rotate-left"></i> Sıfırla
                            </button>
                        </div>
                        <div class="flex flex-wrap items-center gap-4">
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] uppercase text-slate-500 font-bold whitespace-nowrap">Modül Arka Planı</span>
                                <select id="mod-bgtype-${def.id}" onchange="panoToggleBgTypeUI('${def.id}','bg'); moduleSettingsOnChange('${def.id}')" class="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs">
                                    <option value="" ${!s.bgType ? 'selected' : ''}>Varsayılan</option>
                                    <option value="solid" ${s.bgType === 'solid' ? 'selected' : ''}>Düz Renk</option>
                                    <option value="gradient" ${s.bgType === 'gradient' ? 'selected' : ''}>Degrade</option>
                                </select>
                                <span id="mod-bgcolor1-wrap-${def.id}" style="display:${s.bgType ? 'inline-flex' : 'none'}">
                                    <input type="color" id="mod-bgcolor1-${def.id}" value="${s.bgColor1 || '#070b13'}"
                                        onchange="moduleSettingsOnChange('${def.id}')" class="w-9 h-8 bg-slate-900 border border-slate-800 rounded cursor-pointer">
                                </span>
                                <span id="mod-bgcolor2-wrap-${def.id}" style="display:${s.bgType === 'gradient' ? 'inline-flex' : 'none'}">
                                    <input type="color" id="mod-bgcolor2-${def.id}" value="${s.bgColor2 || '#0d1b35'}"
                                        onchange="moduleSettingsOnChange('${def.id}')" class="w-9 h-8 bg-slate-900 border border-slate-800 rounded cursor-pointer">
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] uppercase text-slate-500 font-bold whitespace-nowrap">Başlık Arka Planı</span>
                                <select id="mod-titlebgtype-${def.id}" onchange="panoToggleBgTypeUI('${def.id}','titlebg'); moduleSettingsOnChange('${def.id}')" ${def.hasTitle ? '' : 'disabled'} class="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs">
                                    <option value="" ${!s.titleBgType ? 'selected' : ''}>Varsayılan</option>
                                    <option value="solid" ${s.titleBgType === 'solid' ? 'selected' : ''}>Düz Renk</option>
                                    <option value="gradient" ${s.titleBgType === 'gradient' ? 'selected' : ''}>Degrade</option>
                                </select>
                                <span id="mod-titlebgcolor1-wrap-${def.id}" style="display:${s.titleBgType ? 'inline-flex' : 'none'}">
                                    <input type="color" id="mod-titlebgcolor1-${def.id}" value="${s.titleBgColor1 || '#6b1111'}"
                                        onchange="moduleSettingsOnChange('${def.id}')" class="w-9 h-8 bg-slate-900 border border-slate-800 rounded cursor-pointer">
                                </span>
                                <span id="mod-titlebgcolor2-wrap-${def.id}" style="display:${s.titleBgType === 'gradient' ? 'inline-flex' : 'none'}">
                                    <input type="color" id="mod-titlebgcolor2-${def.id}" value="${s.titleBgColor2 || '#300a0a'}"
                                        onchange="moduleSettingsOnChange('${def.id}')" class="w-9 h-8 bg-slate-900 border border-slate-800 rounded cursor-pointer">
                                </span>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="text-[10px] uppercase text-slate-500 font-bold whitespace-nowrap"><i class="fa-solid fa-bolt text-yellow-400"></i> Kart Efekti</span>
                            <select id="mod-cellfx-${def.id}" onchange="moduleSettingsOnChange('${def.id}')" class="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs">
                                <option value="none" ${(!s.cellEffect || s.cellEffect === 'none') ? 'selected' : ''}>Yok</option>
                                <option value="glow" ${s.cellEffect === 'glow' ? 'selected' : ''}>Sabit Parıltı (Glow)</option>
                                <option value="pulse" ${s.cellEffect === 'pulse' ? 'selected' : ''}>Nabız Gibi Parıltı</option>
                                <option value="border" ${s.cellEffect === 'border' ? 'selected' : ''}>Yanıp Sönen Çerçeve</option>
                                <option value="shine" ${s.cellEffect === 'shine' ? 'selected' : ''}>Kayan Işık (Shine)</option>
                                <option value="neon" ${s.cellEffect === 'neon' ? 'selected' : ''}>Neon (Güçlü Çift Katman)</option>
                                <option value="flicker" ${s.cellEffect === 'flicker' ? 'selected' : ''}>Titreşen Işık (Flicker)</option>
                                <option value="corner" ${s.cellEffect === 'corner' ? 'selected' : ''}>Köşe Işıması</option>
                            </select>
                            <input type="color" id="mod-cellfxcolor-${def.id}" value="${s.cellEffectColor || '#00b4d8'}"
                                onchange="moduleSettingsOnChange('${def.id}')" title="Efekt Rengi" class="w-9 h-8 bg-slate-900 border border-slate-800 rounded cursor-pointer">
                            <span class="text-[9px] text-slate-600">Panoda dikkat çekmesini istediğiniz kartlarda (ör. Saat, Doğum Günleri) kullanın.</span>
                        </div>
                        <div class="flex flex-wrap items-end gap-4 pt-2 border-t border-slate-800/50">
                            <div class="w-32">
                                <label class="text-[10px] uppercase text-slate-500 font-bold block mb-1">Modül Saydamlığı: <span id="mod-opacity-val-${def.id}">${s.moduleOpacity ?? 100}</span>%</label>
                                <input type="range" id="mod-opacity-${def.id}" min="20" max="100" value="${s.moduleOpacity ?? 100}"
                                    oninput="document.getElementById('mod-opacity-val-${def.id}').innerText=this.value; moduleSettingsOnChange('${def.id}')" class="w-full accent-cyan-500">
                                <p class="text-[9px] text-slate-600 mt-0.5">Sadece arka planı saydamlaştırır; yazı/görsel her zaman net kalır.</p>
                            </div>
                            <div class="w-32">
                                <label class="text-[10px] uppercase text-slate-500 font-bold block mb-1">Efekt Işıma Oranı: <span id="mod-fxintensity-val-${def.id}">${s.effectIntensity ?? 100}</span>%</label>
                                <input type="range" id="mod-fxintensity-${def.id}" min="0" max="250" value="${s.effectIntensity ?? 100}"
                                    oninput="document.getElementById('mod-fxintensity-val-${def.id}').innerText=this.value; moduleSettingsOnChange('${def.id}')" class="w-full accent-cyan-500">
                                <p class="text-[9px] text-slate-600 mt-0.5">Yukarıdaki "Kart Efekti" (Glow/Pulse/Kenarlık/Işık/Neon/Titreşen/Köşe) seçiliyken ışımanın gücünü ayarlar.</p>
                            </div>
                            <div class="w-32">
                                <label class="text-[10px] uppercase text-slate-500 font-bold block mb-1">Kenarlık Kalınlığı: <span id="mod-borderw-val-${def.id}">${s.borderWidth ?? 1}</span>px</label>
                                <input type="range" id="mod-borderw-${def.id}" min="0" max="20" value="${s.borderWidth ?? 1}"
                                    oninput="document.getElementById('mod-borderw-val-${def.id}').innerText=this.value; moduleSettingsOnChange('${def.id}')" class="w-full accent-cyan-500">
                            </div>
                            <div class="w-32">
                                <label class="text-[10px] uppercase text-slate-500 font-bold block mb-1">Köşe Yuvarlama: <span id="mod-radius-val-${def.id}">${s.cornerRadius ?? 0}</span>px</label>
                                <input type="range" id="mod-radius-${def.id}" min="0" max="50" value="${s.cornerRadius || 0}"
                                    oninput="document.getElementById('mod-radius-val-${def.id}').innerText=this.value; moduleSettingsOnChange('${def.id}')" class="w-full accent-cyan-500">
                                <p class="text-[9px] text-slate-600 mt-0.5">Küçük kartlarda üst değerde tam yuvarlak (hap) görünür.</p>
                            </div>
                        </div>
                    </div>
                `;
                const embedTargetId = MODULE_SETTINGS_EMBED_TARGETS[def.id];
                const target = (embedTargetId && document.getElementById(embedTargetId)) || fallback;
                target.appendChild(row);
            });
        }

        // Herhangi bir modül ayarı değiştiğinde çağrılır: otomatik kaydeder ve panoyu günceller
        function moduleSettingsOnChange(id) {
            // Geri alma için değişiklik öncesi durumu kaydet (debounced)
            if (!window._moduleUndoPending) {
                window._moduleUndoPending = true;
                setTimeout(() => {
                    window._moduleUndoPending = false;
                }, 800);
                // İlk tetiklemede snapshot al
                moduleSettingsPushUndo();
            }
            moduleSettingsAutoSave();
            applyModuleSettingsToDashboard();
        }

        // ÖZEL MODÜL: bilgisayardan fotoğraf seçildiğinde anında base64 olarak önizlenir/kaydedilir,
        // ardından arka planda buluta yüklenip (varsa) hafif bir bağlantıyla değiştirilir.
        function handleCustomModuleImageSelect(id, inputEl) {
            const file = inputEl.files && inputEl.files[0];
            if (!file) return;
            openImageEditor(file, { aspect: 16 / 9 }, function (editedDataUrl) {
                inputEl.value = '';
                if (!editedDataUrl) return; // kullanıcı iptal etti
                const dataUrl = editedDataUrl;
                const hidden = document.getElementById(`mod-image-${id}`);
                const preview = document.getElementById(`mod-image-preview-${id}`);
                const removeBtn = document.getElementById(`mod-image-remove-${id}`);
                if (hidden) hidden.value = dataUrl;
                if (preview) { preview.src = dataUrl; preview.classList.remove('hidden'); }
                if (removeBtn) removeBtn.classList.remove('hidden');
                moduleSettingsOnChange(id);

                const editedFile = dataUrlToFile(dataUrl, 'ozel-modul.jpg');
                uploadImageFileToCloud(editedFile, 'ozel-modul').then(url => {
                    if (url && hidden && hidden.value === dataUrl) {
                        hidden.value = url;
                        moduleSettingsOnChange(id);
                        writeCMSLog("Modül görseli buluta yüklendi (hafif bağlantı olarak kaydedilecek).");
                    }
                });
            });
        }

        function removeCustomModuleImage(id) {
            const hidden = document.getElementById(`mod-image-${id}`);
            const preview = document.getElementById(`mod-image-preview-${id}`);
            const removeBtn = document.getElementById(`mod-image-remove-${id}`);
            if (hidden) hidden.value = '';
            if (preview) { preview.src = ''; preview.classList.add('hidden'); }
            if (removeBtn) removeBtn.classList.add('hidden');
            moduleSettingsOnChange(id);
        }

        // Özel modül için kart seçicisini günceller
        function moduleSettingsUpdateCardSel(id, value) {
            const ci = (appConfig.customModuleDefs || []).findIndex(d => d.id === id);
            if (ci >= 0) {
                appConfig.customModuleDefs[ci].cardSel = value.trim();
                _rebuildModuleDefs();
                moduleSettingsAutoSave();
            }
        }

        // Kenarlık / Başlık Yazı Rengi renk seçicilerini, yanlarındaki "özel" onay
        // kutusu işaretli değilse pasifleştirir (pasifken kaydedilince varsayılana döner).
        function panoToggleCustomColorUI(id, field) {
            const enabled = document.getElementById(`mod-${field}-enable-${id}`).checked;
            const input = document.getElementById(`mod-${field}-${id}`);
            if (input) input.disabled = !enabled;
        }

        // Modül/başlık arka planı seçimi "Düz Renk" veya "Degrade" olduğunda
        // ilgili renk seçicilerini gösterir, "Varsayılan" olduğunda gizler.
        function panoToggleBgTypeUI(id, prefix) {
            const type = document.getElementById(`mod-${prefix}type-${id}`).value;
            const c1 = document.getElementById(`mod-${prefix}color1-wrap-${id}`);
            const c2 = document.getElementById(`mod-${prefix}color2-wrap-${id}`);
            if (c1) c1.style.display = type ? 'inline-flex' : 'none';
            if (c2) c2.style.display = (type === 'gradient') ? 'inline-flex' : 'none';
        }

        // Bir modülün tüm görsel özelleştirmelerini (kenarlık, arka plan, başlık arka planı,
        // başlık yazı rengi, font) tek tıkla varsayılana döndürür. Kalıcı olması için
        // panelin genel "Kaydet" düğmesine basılması gerekir.
        function panoResetModuleAppearance(id) {
            const colorEnable = document.getElementById(`mod-color-enable-${id}`);
            const colorInput = document.getElementById(`mod-color-${id}`);
            if (colorEnable) colorEnable.checked = false;
            if (colorInput) { colorInput.disabled = true; colorInput.value = '#00b4d8'; }

            const tcEnable = document.getElementById(`mod-titlecolor-enable-${id}`);
            const tcInput = document.getElementById(`mod-titlecolor-${id}`);
            if (tcEnable) tcEnable.checked = false;
            if (tcInput) { tcInput.disabled = true; tcInput.value = '#ffffff'; }

            const bgType = document.getElementById(`mod-bgtype-${id}`);
            if (bgType) bgType.value = '';
            const bgc1 = document.getElementById(`mod-bgcolor1-${id}`);
            const bgc2 = document.getElementById(`mod-bgcolor2-${id}`);
            if (bgc1) bgc1.value = '#070b13';
            if (bgc2) bgc2.value = '#0d1b35';
            panoToggleBgTypeUI(id, 'bg');

            const tbgType = document.getElementById(`mod-titlebgtype-${id}`);
            if (tbgType) tbgType.value = '';
            const tbgc1 = document.getElementById(`mod-titlebgcolor1-${id}`);
            const tbgc2 = document.getElementById(`mod-titlebgcolor2-${id}`);
            if (tbgc1) tbgc1.value = '#6b1111';
            if (tbgc2) tbgc2.value = '#300a0a';
            panoToggleBgTypeUI(id, 'titlebg');

            const fontSel = document.getElementById(`mod-font-${id}`);
            if (fontSel) fontSel.value = '';

            const cellFxSel = document.getElementById(`mod-cellfx-${id}`);
            if (cellFxSel) cellFxSel.value = 'none';
            const cellFxColor = document.getElementById(`mod-cellfxcolor-${id}`);
            if (cellFxColor) cellFxColor.value = '#00b4d8';

            const opacitySlider = document.getElementById(`mod-opacity-${id}`);
            const opacityVal = document.getElementById(`mod-opacity-val-${id}`);
            if (opacitySlider) opacitySlider.value = 100;
            if (opacityVal) opacityVal.innerText = 100;
            const blurSlider = document.getElementById(`mod-fxintensity-${id}`);
            const blurVal = document.getElementById(`mod-fxintensity-val-${id}`);
            if (blurSlider) blurSlider.value = 100;
            if (blurVal) blurVal.innerText = 100;
            const borderWSlider = document.getElementById(`mod-borderw-${id}`);
            const borderWVal = document.getElementById(`mod-borderw-val-${id}`);
            if (borderWSlider) borderWSlider.value = 1;
            if (borderWVal) borderWVal.innerText = 1;
            const radiusSlider = document.getElementById(`mod-radius-${id}`);
            const radiusVal = document.getElementById(`mod-radius-val-${id}`);
            if (radiusSlider) radiusSlider.value = 0;
            if (radiusVal) radiusVal.innerText = 0;
        }

        function collectModuleSettingsFromAdmin() {
            const result = {};
            moduleDefs.forEach(def => {
                const titleInput = document.getElementById(`mod-title-${def.id}`);
                const intervalInput = document.getElementById(`mod-interval-${def.id}`);
                let intervalVal = (appConfig.moduleSettings[def.id] || {}).interval || def.defaultInterval;
                if (def.hasInterval && intervalInput) {
                    const parsed = parseInt(intervalInput.value, 10);
                    intervalVal = (!isNaN(parsed) && parsed > 0) ? parsed : (def.defaultInterval || 8);
                }
                const colorEnable = document.getElementById(`mod-color-enable-${def.id}`);
                const colorInput = document.getElementById(`mod-color-${def.id}`);
                const titleColorEnable = document.getElementById(`mod-titlecolor-enable-${def.id}`);
                const titleColorInput = document.getElementById(`mod-titlecolor-${def.id}`);
                const bgTypeInput = document.getElementById(`mod-bgtype-${def.id}`);
                const bgColor1Input = document.getElementById(`mod-bgcolor1-${def.id}`);
                const bgColor2Input = document.getElementById(`mod-bgcolor2-${def.id}`);
                const titleBgTypeInput = document.getElementById(`mod-titlebgtype-${def.id}`);
                const titleBgColor1Input = document.getElementById(`mod-titlebgcolor1-${def.id}`);
                const titleBgColor2Input = document.getElementById(`mod-titlebgcolor2-${def.id}`);
                const cellFxInput = document.getElementById(`mod-cellfx-${def.id}`);
                const cellFxColorInput = document.getElementById(`mod-cellfxcolor-${def.id}`);
                const opacityInput = document.getElementById(`mod-opacity-${def.id}`);
                const fxIntensityInput = document.getElementById(`mod-fxintensity-${def.id}`);
                const borderWInput = document.getElementById(`mod-borderw-${def.id}`);
                const radiusInput = document.getElementById(`mod-radius-${def.id}`);
                const imgOpacityInput = document.getElementById(`mod-img-opacity-${def.id}`);
                const imgBorderInput = document.getElementById(`mod-img-border-${def.id}`);
                const imgBorderColorInput = document.getElementById(`mod-img-bordercolor-${def.id}`);
                const imgRatioInput = document.getElementById(`mod-img-ratio-${def.id}`);
                const fontInput = document.getElementById(`mod-font-${def.id}`);
                const titleActiveInput = document.getElementById(`mod-title-active-${def.id}`);
                const sizeInput = document.getElementById(`mod-size-${def.id}`);
                const activeInput = document.getElementById(`mod-active-${def.id}`);
                const contentInput = document.getElementById(`mod-content-${def.id}`);
                const imageInput = document.getElementById(`mod-image-${def.id}`);
                result[def.id] = {
                    title: titleInput ? titleInput.value.trim() : (appConfig.moduleSettings[def.id] || {}).title || "",
                    content: contentInput ? contentInput.value : (appConfig.moduleSettings[def.id] || {}).content || "",
                    image: imageInput ? imageInput.value : (appConfig.moduleSettings[def.id] || {}).image || "",
                    size: sizeInput ? sizeInput.value : (appConfig.moduleSettings[def.id] || {}).size || "normal",
                    color: (colorEnable && colorEnable.checked && colorInput) ? colorInput.value : "",
                    titleColor: (titleColorEnable && titleColorEnable.checked && titleColorInput) ? titleColorInput.value : "",
                    bgType: bgTypeInput ? bgTypeInput.value : "",
                    bgColor1: bgColor1Input ? bgColor1Input.value : "",
                    bgColor2: bgColor2Input ? bgColor2Input.value : "",
                    titleBgType: titleBgTypeInput ? titleBgTypeInput.value : "",
                    titleBgColor1: titleBgColor1Input ? titleBgColor1Input.value : "",
                    titleBgColor2: titleBgColor2Input ? titleBgColor2Input.value : "",
                    cellEffect: cellFxInput ? cellFxInput.value : "none",
                    cellEffectColor: cellFxColorInput ? cellFxColorInput.value : "#00b4d8",
                    moduleOpacity: opacityInput ? parseInt(opacityInput.value, 10) : 100,
                    effectIntensity: fxIntensityInput ? parseInt(fxIntensityInput.value, 10) : 100,
                    borderWidth: borderWInput ? parseInt(borderWInput.value, 10) : 1,
                    cornerRadius: radiusInput ? radiusInput.value : "",
                    imgOpacity: imgOpacityInput ? parseInt(imgOpacityInput.value, 10) : ((appConfig.moduleSettings[def.id] || {}).imgOpacity ?? 100),
                    imgBorderWidth: imgBorderInput ? parseInt(imgBorderInput.value, 10) : ((appConfig.moduleSettings[def.id] || {}).imgBorderWidth ?? 0),
                    imgBorderColor: imgBorderColorInput ? imgBorderColorInput.value : ((appConfig.moduleSettings[def.id] || {}).imgBorderColor || '#00b4d8'),
                    imgRatio: imgRatioInput ? imgRatioInput.value : ((appConfig.moduleSettings[def.id] || {}).imgRatio || 'auto'),
                    font: fontInput ? fontInput.value : "",
                    active: activeInput ? activeInput.checked : ((appConfig.moduleSettings[def.id] || {}).active !== false),
                    titleActive: titleActiveInput ? titleActiveInput.checked : true,
                    interval: intervalVal
                };
            });
            return result;
        }

        function applyThemePreset(presetName, skipLog) {
            appConfig.theme = presetName || 'standard';
            renderThemeClasses();
            if (!skipLog) writeCMSLog(`Pano renk teması güncellendi: ${appConfig.theme}`);
        }

        function applyThemeMode(mode, skipLog) {
            appConfig.themeMode = (mode === 'light') ? 'light' : 'dark';
            renderThemeClasses();
            if (!skipLog) writeCMSLog(`Pano görünüm modu güncellendi: ${appConfig.themeMode === 'light' ? 'Açık Tema' : 'Koyu Tema'}`);
        }

        function renderThemeClasses() {
            const body = document.body;
            const preset = appConfig.theme || 'standard';
            const mode = appConfig.themeMode || 'dark';
            body.className = `theme-${preset} mode-${mode}`;

            // Aktif buton/kart görsel durumunu güncelle
            const darkBtn = document.getElementById('mode-btn-dark');
            const lightBtn = document.getElementById('mode-btn-light');
            if (darkBtn && lightBtn) {
                darkBtn.classList.toggle('border-cyan-500', mode === 'dark');
                darkBtn.classList.toggle('border-slate-800', mode !== 'dark');
                lightBtn.classList.toggle('border-cyan-500', mode === 'light');
                lightBtn.classList.toggle('border-slate-800', mode !== 'light');
            }
            document.querySelectorAll('.theme-preset-card').forEach(card => {
                const isActive = card.getAttribute('data-preset') === preset;
                card.classList.toggle('border-cyan-500', isActive);
                card.classList.toggle('border-slate-800', !isActive);
            });

            // Özel renkler tanımlıysa uygula (tema/mod değişse bile korunur)
            if (appConfig.customColors) {
                applyCustomColorVars(appConfig.customColors);
            } else {
                clearCustomColorVars();
            }
        }

        const CUSTOM_COLOR_VAR_MAP = {
            blue: '--neon-blue',
            red: '--neon-red',
            yellow: '--neon-yellow',
            green: '--neon-green',
            cardbg: '--card-bg',
            bgdark: '--bg-dark'
        };

        function applyCustomColorVars(colors) {
            const root = document.documentElement;
            Object.keys(CUSTOM_COLOR_VAR_MAP).forEach(key => {
                if (colors[key]) root.style.setProperty(CUSTOM_COLOR_VAR_MAP[key], colors[key]);
            });
        }

        function clearCustomColorVars() {
            const root = document.documentElement;
            Object.values(CUSTOM_COLOR_VAR_MAP).forEach(v => root.style.removeProperty(v));
        }

        function applyCustomThemeColors(fromUserClick) {
            const colors = {
                blue: document.getElementById('custom-color-blue').value,
                red: document.getElementById('custom-color-red').value,
                yellow: document.getElementById('custom-color-yellow').value,
                green: document.getElementById('custom-color-green').value,
                cardbg: document.getElementById('custom-color-cardbg').value,
                bgdark: document.getElementById('custom-color-bgdark').value
            };
            appConfig.customColors = colors;
            applyCustomColorVars(colors);
            if (fromUserClick) {
                panoPersist();
                writeCMSLog("Özel tema renkleri uygulandı ve kaydedildi.");
                showCustomNotification("Özel Tema", "Özel tema renkleriniz başarıyla uygulandı ve kaydedildi.");
            }
        }

        function resetCustomThemeColors() {
            appConfig.customColors = null;
            clearCustomColorVars();
            loadCustomThemeInputsFromConfig();
            panoPersist();
            writeCMSLog("Özel tema renkleri sıfırlandı.");
            showCustomNotification("Sıfırlandı", "Özel renk özelleştirmeleri kaldırıldı, temanın orijinal renkleri geri yüklendi.");
        }

        function loadCustomThemeInputsFromConfig() {
            const defaults = { blue: '#00b4d8', red: '#d90429', yellow: '#ffb703', green: '#38b000', cardbg: '#070b13', bgdark: '#02040a' };
            const colors = appConfig.customColors || defaults;
            document.getElementById('custom-color-blue').value = colors.blue || defaults.blue;
            document.getElementById('custom-color-red').value = colors.red || defaults.red;
            document.getElementById('custom-color-yellow').value = colors.yellow || defaults.yellow;
            document.getElementById('custom-color-green').value = colors.green || defaults.green;
            document.getElementById('custom-color-cardbg').value = colors.cardbg || defaults.cardbg;
            document.getElementById('custom-color-bgdark').value = colors.bgdark || defaults.bgdark;
        }

        // SAAT MODÜLÜNE TIKLAYINCA TAM EKRAN AÇ/KAPAT — panonun TV'de tam ekran (kiosk)
        // olarak sorunsuz gösterilmesi için pratik bir yöntem: bir kumanda/uzaktan işaretçiyle
        // saatin üzerine tıklamak yeterli. Standart Fullscreen API + eski tarayıcı önekleri
        // (webkit/moz/ms) birlikte desteklenir, TV tarayıcıları arasındaki farklılıklar için.
        // Düzenleme (sürükle/boyutlandır) modundayken modül seçimiyle çakışmaması için o
        // modda devre dışı bırakılır.
        function toggleFullscreenMode() {
            if (document.body.classList.contains('pano-edit-mode')) return;
            const doc = document;
            const isFullscreen = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
            if (!isFullscreen) {
                fsAutoEnforce = true; // manuel giriş: enforcement'ı (yeniden) etkinleştir
                const el = doc.documentElement;
                const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                if (req) {
                    try {
                        const result = req.call(el);
                        if (result && typeof result.catch === 'function') result.catch(() => {});
                    } catch (err) { /* bazı eski TV tarayıcıları sessizce yoksayılabilir */ }
                }
            } else {
                // MANUEL ÇIKIŞ: kullanıcı bilerek tam ekrandan çıkıyor — bir sonraki
                // tıklamada sistem bunu geri zorlamasın diye enforcement kapatılır.
                // Tekrar saate tıklayınca (yukarıdaki dal) enforcement yeniden açılır.
                fsAutoEnforce = false;
                const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
                if (exit) {
                    try {
                        const result = exit.call(doc);
                        if (result && typeof result.catch === 'function') result.catch(() => {});
                    } catch (err) { /* bazı eski TV tarayıcıları sessizce yoksayılabilir */ }
                }
            }
        }

        let pendingPinAction = 'panel'; // 'panel' -> Yönetim Paneli aç, 'switchDisplay' -> gizli geçiş butonu

        function tryOpenAdminPanel() {
            if (IS_DISPLAY_MODE) return; // TV/kiosk modunda yönetim paneli hiçbir şekilde açılamaz
            pendingPinAction = 'panel';
            document.getElementById('pin-prompt-input').value = "";
            document.getElementById('pin-prompt-modal').classList.remove('hidden');
            document.getElementById('pin-prompt-input').focus();
        }

        // Ekranın bir köşesindeki görünmez butona (bkz. index.html #hidden-switch-trigger)
        // tıklanınca çağrılır. Panel girişiyle AYNI Supabase Auth hesabını kullanır.
        function tryHiddenDisplaySwitch() {
            if (IS_DISPLAY_MODE) return; // TV/kiosk modunda bu da açılamaz
            pendingPinAction = 'switchDisplay';
            document.getElementById('pin-prompt-input').value = "";
            document.getElementById('pin-prompt-modal').classList.remove('hidden');
            document.getElementById('pin-prompt-input').focus();
        }

        function closePinPrompt() {
            document.getElementById('pin-prompt-modal').classList.add('hidden');
        }

        function handlePinKeyPress(e) {
            if (e.key === 'Enter') checkAdminPinCode();
        }

        // Art arda yanlış PIN denemelerine karşı kademeli bekleme (basit kaba-kuvvet
        // koruması). Sunucu tarafı olmadığı için mükemmel bir koruma değildir, ama
        // bir öğrencinin PIN'i art arda deneyerek bulmasını pratik olarak imkansız
        // hale getirir.
        let pinWrongAttempts = 0;
        let pinLockedUntil = 0;
        const PIN_LOCK_STEPS_MS = [0, 0, 0, 10000, 30000, 60000, 120000]; // ilk 3 hak serbest

        // Girilen şifreyi Supabase Auth'a (gerçek sunucu tarafı doğrulama) gönderir.
        // Başarılı olursa bu tarayıcı, veritabanına yazma izni olan gerçek bir oturum
        // kazanır (RLS politikaları artık SADECE bu oturuma izin veriyor).
        async function checkAdminPinCode() {
            // Bu fonksiyon bir tıklamadan (kullanıcı hareketi/"user gesture") çağrılır.
            // Aşağıdaki adımlar async (Supabase'e ağ isteği) olduğu için tarayıcı bu
            // "gesture" hakkını kısa sürede geri alabilir; bu yüzden gerçek tam ekran
            // isteği, hâlâ tam bu tıklamanın içindeyken, EN BAŞTA senkron olarak yapılır.
            // Böylece ekran geçişi sırasında (bkz. setActiveDisplay) tarayıcı tam ekranı
            // yeni sayfaya taşıyabiliyorsa, taşınacak "canlı" bir tam ekran hakkı olur.
            requestRealFullscreen();
            const now = Date.now();
            if (now < pinLockedUntil) {
                const secs = Math.ceil((pinLockedUntil - now) / 1000);
                showCustomNotification("Kilitli", `Çok fazla hatalı deneme. ${secs} sn sonra tekrar deneyin.`);
                document.getElementById('pin-prompt-input').value = "";
                return;
            }
            if (!supabaseClient) {
                showCustomNotification("Bağlantı Yok", "Giriş yapmak için internet/Supabase bağlantısı gerekli.");
                return;
            }
            const entered = document.getElementById('pin-prompt-input').value.trim();
            document.getElementById('pin-prompt-input').value = "";
            try {
                const { error } = await supabaseClient.auth.signInWithPassword({ email: ADMIN_EMAIL, password: entered });
                if (!error) {
                    pinWrongAttempts = 0;
                    closePinPrompt();
                    writeCMSLog("Güvenlik girişi başarılı (Supabase Auth).");
                    if (pendingPinAction === 'switchDisplay') {
                        setActiveDisplay('duyuru');
                    } else {
                        openAdminPanel();
                    }
                } else {
                    pinWrongAttempts++;
                    const waitMs = PIN_LOCK_STEPS_MS[Math.min(pinWrongAttempts, PIN_LOCK_STEPS_MS.length - 1)];
                    if (waitMs > 0) {
                        pinLockedUntil = now + waitMs;
                        showCustomNotification("Hatalı Giriş", `Girdiğiniz şifre yanlış. ${waitMs / 1000} sn boyunca kilitlendi.`);
                    } else {
                        showCustomNotification("Hatalı Giriş", "Girdiğiniz şifre yanlıştır.");
                    }
                    document.getElementById('pin-prompt-input').focus();
                }
            } catch (e) {
                showCustomNotification("Hata", "Giriş doğrulanamadı, tekrar deneyin.");
            }
        }

        function openAdminPanel() {
            writeCMSLog("Yönetim Paneli açıldı.");
            if (typeof supabaseStatusRefresh === 'function') supabaseStatusRefresh();
            const panel = document.getElementById('admin-panel');
            
            document.getElementById('input-school-name').value = appConfig.schoolName;
            const refreshMsgInputInit = document.getElementById('input-refresh-message');
            if (refreshMsgInputInit) refreshMsgInputInit.value = appConfig.refreshMessage || defaultAppConfig.refreshMessage;
            const pollIntervalInputInit = document.getElementById('input-poll-interval');
            if (pollIntervalInputInit) pollIntervalInputInit.value = appConfig.pollIntervalSeconds || defaultAppConfig.pollIntervalSeconds;
            const pollIntervalEnabledInputInit = document.getElementById('input-poll-interval-enabled');
            if (pollIntervalEnabledInputInit) {
                pollIntervalEnabledInputInit.checked = appConfig.pollIntervalEnabled !== false;
                if (pollIntervalInputInit) pollIntervalInputInit.disabled = !pollIntervalEnabledInputInit.checked;
            }
            const displaySwitchPollInputInit = document.getElementById('input-display-switch-poll');
            if (displaySwitchPollInputInit) displaySwitchPollInputInit.value = appConfig.displaySwitchPollSeconds || defaultAppConfig.displaySwitchPollSeconds;
            const displaySwitchPollEnabledInputInit = document.getElementById('input-display-switch-poll-enabled');
            if (displaySwitchPollEnabledInputInit) {
                displaySwitchPollEnabledInputInit.checked = appConfig.displaySwitchPollEnabled !== false;
                if (displaySwitchPollInputInit) displaySwitchPollInputInit.disabled = !displaySwitchPollEnabledInputInit.checked;
            }
            document.getElementById('input-brand-sub').value = appConfig.brandSubText || defaultAppConfig.brandSubText;
            document.getElementById('input-brand-sub-visible').checked = appConfig.brandSubVisible !== false;
            document.getElementById('input-admin-pin').value = "";

            tempSchoolLogo = appConfig.schoolLogo || "";
            document.getElementById('input-logo-size').value = appConfig.logoSize || 54;
            document.getElementById('input-school-name-size').value = appConfig.schoolNameSize || 24;
            document.getElementById('input-logo-position').value = appConfig.logoPosition || 'left';
            document.getElementById('input-name-position').value = appConfig.namePosition || 'left';
            document.getElementById('input-name-font').value = appConfig.schoolNameFont || defaultAppConfig.schoolNameFont;
            document.getElementById('input-logo-offset').value = appConfig.logoOffsetX || 0;
            document.getElementById('input-name-offset').value = appConfig.nameOffsetX || 0;

            // Görsel çerçeveleri (saydamlık / kenarlık kalınlığı / oran) — logo, nöbetçi kadro
            // fotoğrafları ve medya slaytı için. Her panel açılışında güncel appConfig
            // değerleriyle yeniden üretilir (placeholder container'lar index.html'de).
            ['logo-frame', 'roster-frame'].forEach(prefix => {
                const container = document.getElementById(`${prefix}-controls`);
                const map = FRAME_CONTROL_MAP[prefix];
                if (container && map) {
                    container.innerHTML = frameControlsHtml(prefix, appConfig[map.configKey] || defaultAppConfig[map.configKey]);
                }
            });
            renderMediaCaptionStyleForm();
            document.getElementById('input-brand-border-style').value = appConfig.brandBorderStyle || defaultAppConfig.brandBorderStyle;
            document.getElementById('input-brand-border-color').value = appConfig.brandBorderColor || defaultAppConfig.brandBorderColor;
            document.getElementById('input-brand-border-width').value = (appConfig.brandBorderWidth !== undefined && appConfig.brandBorderWidth !== null) ? appConfig.brandBorderWidth : defaultAppConfig.brandBorderWidth;
            document.getElementById('input-brand-bg-type').value = appConfig.brandBgType || defaultAppConfig.brandBgType;
            document.getElementById('input-brand-bg-color1').value = appConfig.brandBgColor1 || defaultAppConfig.brandBgColor1;
            document.getElementById('input-brand-bg-color2').value = appConfig.brandBgColor2 || defaultAppConfig.brandBgColor2;
            document.getElementById('input-brand-effect').value = appConfig.brandEffect || defaultAppConfig.brandEffect;
            const logoPreviewImg = document.getElementById('logo-preview-img');
            const logoPreviewText = document.getElementById('logo-preview-text');
            if (tempSchoolLogo) {
                logoPreviewImg.src = tempSchoolLogo;
                logoPreviewImg.classList.remove('hidden');
                logoPreviewText.classList.add('hidden');
            } else {
                logoPreviewImg.classList.add('hidden');
                logoPreviewText.classList.remove('hidden');
            }
            handleLiveIdentityPreview();

            loadCustomThemeInputsFromConfig();
            renderThemeClasses();

            tempAnnouncements = appConfig.announcements.map(a => ({ ...a }));
            tempMarqueeItems = (appConfig.marqueeItems || []).map(a => ({ ...a }));
            tempBirthdays = [...appConfig.birthdays];
            selectedBirthdayIndices.clear();
            tempQuotes = [...(appConfig.quotes || [])];
            tempSpecialDays = [...appConfig.specialDays];
            tempMediaPlaylist = [...(appConfig.mediaPlaylist || [])];
            tempAchievementCategories = JSON.parse(JSON.stringify(appConfig.achievementCategories || []));

            cancelEditBirthday();
            cancelEditAnnouncement();
            cancelEditMarqueeItem();
            cancelEditQuote();
            cancelEditSpecialDay();
            achievementEditing = { catId: null, index: -1 };
            achievementPendingFile = {};
            cancelEditMediaSlide();
            const bwSettings = appConfig.birthdayWidget || defaultAppConfig.birthdayWidget;
            document.getElementById('input-bday-title').value = bwSettings.title || "";
            document.getElementById('input-bday-size').value = String(bwSettings.cardSize || 1);
            document.getElementById('input-bday-today-subtitle').value = bwSettings.todaySubtitle || "";
            document.getElementById('input-bday-upcoming-subtitle').value = bwSettings.upcomingSubtitle || "";
            document.getElementById('input-bday-celebration-label').value = bwSettings.celebrationDateLabel || defaultAppConfig.birthdayWidget.celebrationDateLabel;
            document.getElementById('input-bday-empty-text').value = bwSettings.emptyText || "";
            document.getElementById('input-bday-show-upcoming').checked = bwSettings.showUpcomingWhenEmpty !== false;
            document.getElementById('input-bday-upcoming-count').value = bwSettings.upcomingCount ?? 5;
            document.getElementById('input-bday-emoji-text').value = (bwSettings.emojiText !== undefined && bwSettings.emojiText !== null) ? bwSettings.emojiText : defaultAppConfig.birthdayWidget.emojiText;
            document.getElementById('input-bday-emoji-position').value = bwSettings.emojiPosition || defaultAppConfig.birthdayWidget.emojiPosition;
            document.getElementById('input-bday-emoji-size').value = bwSettings.emojiSize || defaultAppConfig.birthdayWidget.emojiSize;
            document.getElementById('input-bday-show-year').checked = !!bwSettings.showYearInUpcoming;

            const sdwSettings = appConfig.specialDayWidget || defaultAppConfig.specialDayWidget;
            document.getElementById('input-specialday-empty-text').value = sdwSettings.emptyText || defaultAppConfig.specialDayWidget.emptyText;
            document.getElementById('input-specialday-empty-mode').value = sdwSettings.emptyMode || 'text';
            tempSpecialDayEmptyImage = sdwSettings.emptyImage || "";
            const sdEmptyPreviewImg = document.getElementById('specialday-empty-img-preview');
            const sdEmptyPreviewEmpty = document.getElementById('specialday-empty-img-preview-empty');
            if (tempSpecialDayEmptyImage) {
                if (sdEmptyPreviewImg) { sdEmptyPreviewImg.src = tempSpecialDayEmptyImage; sdEmptyPreviewImg.classList.remove('hidden'); }
                if (sdEmptyPreviewEmpty) sdEmptyPreviewEmpty.classList.add('hidden');
            } else {
                if (sdEmptyPreviewImg) { sdEmptyPreviewImg.classList.add('hidden'); sdEmptyPreviewImg.src = ''; }
                if (sdEmptyPreviewEmpty) sdEmptyPreviewEmpty.classList.remove('hidden');
            }
            toggleSpecialDayEmptyModeUI();
            document.getElementById('input-specialday-color').value = sdwSettings.textColor || '#ffb703';
            document.getElementById('input-specialday-font').value = sdwSettings.textFont || '';
            document.getElementById('input-specialday-size').value = sdwSettings.textSize || defaultAppConfig.specialDayWidget.textSize;
            document.getElementById('input-weather-city').value = appConfig.cityName || defaultAppConfig.cityName;
            document.getElementById('input-weather-lat').value = appConfig.weatherLat || defaultAppConfig.weatherLat;
            document.getElementById('input-weather-lng').value = appConfig.weatherLng || defaultAppConfig.weatherLng;
            document.getElementById('input-weather-label').value = sdwSettings.weatherLabel || defaultAppConfig.specialDayWidget.weatherLabel;
            document.getElementById('input-weather-icon').value = sdwSettings.weatherIcon || defaultAppConfig.specialDayWidget.weatherIcon;
            document.getElementById('input-weather-error-icon').value = sdwSettings.weatherErrorIcon || defaultAppConfig.specialDayWidget.weatherErrorIcon;
            document.getElementById('input-weather-label-color').value = sdwSettings.labelColor || '#94a3b8';
            document.getElementById('input-weather-label-font').value = sdwSettings.labelFont || '';
            document.getElementById('input-weather-label-size').value = sdwSettings.labelSize || defaultAppConfig.specialDayWidget.labelSize;
            document.getElementById('input-weather-city-color').value = sdwSettings.cityColor || sdwSettings.weatherColor || '#00b4d8';
            document.getElementById('input-weather-city-font').value = sdwSettings.cityFont || sdwSettings.weatherFont || '';
            document.getElementById('input-weather-city-size').value = sdwSettings.citySize || sdwSettings.weatherSize || defaultAppConfig.specialDayWidget.citySize;
            document.getElementById('input-weather-icon-color').value = sdwSettings.iconColor || sdwSettings.weatherColor || '#00b4d8';
            document.getElementById('input-weather-icon-font').value = sdwSettings.iconFont || sdwSettings.weatherFont || '';
            document.getElementById('input-weather-icon-size').value = sdwSettings.iconSize || sdwSettings.weatherSize || defaultAppConfig.specialDayWidget.iconSize;
            document.getElementById('input-weather-temp-color').value = sdwSettings.tempColor || sdwSettings.weatherColor || '#00b4d8';
            document.getElementById('input-weather-temp-font').value = sdwSettings.tempFont || sdwSettings.weatherFont || '';
            document.getElementById('input-weather-temp-size').value = sdwSettings.tempSize || sdwSettings.weatherSize || defaultAppConfig.specialDayWidget.tempSize;
            document.getElementById('input-sdw-layout').value = sdwSettings.layout || defaultAppConfig.specialDayWidget.layout;
            document.getElementById('input-sdw-separator').value = sdwSettings.separator || defaultAppConfig.specialDayWidget.separator;
            document.getElementById('input-sdw-separator-icon').value = sdwSettings.separatorIcon || defaultAppConfig.specialDayWidget.separatorIcon;
            document.getElementById('input-sdw-separator-thickness').value = (sdwSettings.separatorThickness !== undefined && sdwSettings.separatorThickness !== null) ? sdwSettings.separatorThickness : defaultAppConfig.specialDayWidget.separatorThickness;
            toggleSdwSeparatorIconField();
            document.getElementById('input-sdw-align-h').value = sdwSettings.alignH || defaultAppConfig.specialDayWidget.alignH;
            document.getElementById('input-sdw-align-v').value = sdwSettings.alignV || defaultAppConfig.specialDayWidget.alignV;
            document.getElementById('input-sdw-fx-specialday').value = sdwSettings.specialdayEffect || 'none';
            document.getElementById('input-sdw-fx-specialday-color').value = sdwSettings.specialdayEffectColor || '#00b4d8';
            document.getElementById('input-sdw-fx-weather').value = sdwSettings.weatherEffect || 'none';
            document.getElementById('input-sdw-fx-weather-color').value = sdwSettings.weatherEffectColor || '#00b4d8';

            const aws = appConfig.achievementWidget || defaultAppConfig.achievementWidget;
            document.getElementById('input-ach-layout').value = aws.layout || 'column';
            document.getElementById('input-ach-separator').value = aws.separator || 'line';
            document.getElementById('input-ach-separator-icon').value = aws.separatorIcon || 'fa-star';
            document.getElementById('input-ach-separator-thickness').value = (aws.separatorThickness !== undefined && aws.separatorThickness !== null) ? aws.separatorThickness : 1;
            document.getElementById('input-ach-columns').value = (aws.columns !== undefined && aws.columns !== null) ? aws.columns : 0;
            toggleAchSeparatorIconField();

            renderAdminAnnouncements();
            loadMarqueeSettingsIntoForm();
            renderAdminBirthdays();
            renderAdminQuotes();
            renderAdminSpecialDays();
            renderAdminMediaPlaylist();
            renderAdminAchievementCategories();
            renderAdminModuleSettings();
            buildAdminBellHoursInputs();
            loadBellHoursDisplaySettingsIntoForm();
            buildWeeklyScheduleMatrix();
            loadScheduleBoardStyleIntoForm();
            loadClockStyleIntoForm();
            buildWeeklyDutiesTable();
            buildAylikNobetTablosu(); // Aylık nöbet takvimini inşa et
            renderRosterList(); // Nöbetçi kadrosu (fotoğraf/ikon) listesini inşa et

            // Nöbet yerleri (dinamik ekle/sil/sırala) ve görsel özelleştirme
            tempDutyPositions = (appConfig.dutyPositions || []).map(p => ({ ...p }));
            tempDutyStyle = JSON.parse(JSON.stringify(appConfig.dutyStyle || defaultAppConfig.dutyStyle));
            populateDutyIconSelect(document.getElementById('dutypos-new-icon'), 'fa-user-shield');
            renderDutyPositionsAdmin();
            renderDutyTemplateList();
            loadDutyStyleIntoInputs();
            // Nöbet Modülü Kapsamlı Ayarlar sekmesini başlat
            setTimeout(() => loadDutyAdvancedSettingsIntoForm(), 80);

            document.getElementById('stat-birthday-count').innerText = appConfig.birthdays.length;
            document.getElementById('stat-ann-count').innerText = appConfig.announcements.length;

            panel.classList.remove('hidden');
        }

        function closeAdminPanelWithoutSaving() {
            document.getElementById('admin-panel').classList.add('hidden');
            if (supabaseClient) supabaseClient.auth.signOut();
            writeCMSLog("Yönetim Paneli kaydetmeden kapatıldı.");
        }

        // Ayarlar panelindeki "Yönetici Şifresi" alanı artık düz metin bir PIN
        // KAYDETMİYOR — bu, doğrudan Supabase Auth hesabınızın gerçek şifresini
        // değiştiriyor (RLS bu şifreyle korunuyor). En az 6 karakter gerekir.
        // Bu işlem ayrı tutuldu (genel "Kaydet" ile birleştirilmedi) çünkü hassas
        // bir işlem; yanlışlıkla boş kaydedip şifreyi bozmamak için kullanıcı
        // bilerek bu butona basmalı.
        async function updateAdminPassword() {
            const val = document.getElementById('input-admin-pin').value.trim();
            if (!val) { showCustomNotification("Boş Bırakılamaz", "Yeni şifreyi girin (en az 6 karakter)."); return; }
            if (val.length < 6) { showCustomNotification("Çok Kısa", "Şifre en az 6 karakter olmalı."); return; }
            if (!supabaseClient) { showCustomNotification("Bağlantı Yok", "Şifre güncellemek için Supabase bağlantısı gerekli."); return; }
            try {
                const { error } = await supabaseClient.auth.updateUser({ password: val });
                if (error) {
                    showCustomNotification("Hata", "Şifre güncellenemedi: " + error.message);
                    return;
                }
                document.getElementById('input-admin-pin').value = "";
                showCustomNotification("Başarılı", "Yönetici şifresi güncellendi.");
                writeCMSLog("Yönetici şifresi değiştirildi.");
            } catch (e) {
                showCustomNotification("Hata", "Şifre güncellenemedi, tekrar deneyin.");
            }
        }

        function saveAdminChanges() {
            saveWeeklyScheduleMatrix();
            saveWeeklyDutiesTable();
            nobetAyiKaydet(); // Aylık nöbet verilerini kaydet

            const refreshMsgInput = document.getElementById('input-refresh-message');
            if (refreshMsgInput) {
                appConfig.refreshMessage = refreshMsgInput.value.trim() || defaultAppConfig.refreshMessage;
            }
            const pollIntervalEnabledInput = document.getElementById('input-poll-interval-enabled');
            if (pollIntervalEnabledInput) appConfig.pollIntervalEnabled = pollIntervalEnabledInput.checked;
            const pollIntervalInput = document.getElementById('input-poll-interval');
            if (pollIntervalInput) {
                let v = parseInt(pollIntervalInput.value, 10);
                if (!v || isNaN(v)) v = defaultAppConfig.pollIntervalSeconds;
                appConfig.pollIntervalSeconds = Math.min(300, Math.max(5, v));
            }
            const displaySwitchPollEnabledInput = document.getElementById('input-display-switch-poll-enabled');
            if (displaySwitchPollEnabledInput) appConfig.displaySwitchPollEnabled = displaySwitchPollEnabledInput.checked;
            const displaySwitchPollInput = document.getElementById('input-display-switch-poll');
            if (displaySwitchPollInput) {
                let v2 = parseInt(displaySwitchPollInput.value, 10);
                if (!v2 || isNaN(v2)) v2 = defaultAppConfig.displaySwitchPollSeconds;
                appConfig.displaySwitchPollSeconds = Math.min(300, Math.max(3, v2));
            }

            appConfig.schoolName = document.getElementById('input-school-name').value.trim() || defaultAppConfig.schoolName;
            appConfig.brandSubText = document.getElementById('input-brand-sub').value.trim() || defaultAppConfig.brandSubText;
            appConfig.brandSubVisible = document.getElementById('input-brand-sub-visible').checked;
            appConfig.schoolLogo = tempSchoolLogo !== null ? tempSchoolLogo : (appConfig.schoolLogo || "");
            appConfig.logoSize = parseInt(document.getElementById('input-logo-size').value, 10) || 54;
            appConfig.schoolNameSize = parseInt(document.getElementById('input-school-name-size').value, 10) || 24;
            appConfig.logoPosition = document.getElementById('input-logo-position').value || 'left';
            appConfig.namePosition = document.getElementById('input-name-position').value || 'left';
            appConfig.schoolNameFont = document.getElementById('input-name-font').value || defaultAppConfig.schoolNameFont;
            appConfig.logoOffsetX = parseInt(document.getElementById('input-logo-offset').value, 10) || 0;
            appConfig.nameOffsetX = parseInt(document.getElementById('input-name-offset').value, 10) || 0;
            appConfig.brandBorderStyle = document.getElementById('input-brand-border-style').value || defaultAppConfig.brandBorderStyle;
            appConfig.brandBorderColor = document.getElementById('input-brand-border-color').value || defaultAppConfig.brandBorderColor;
            appConfig.brandBorderWidth = parseInt(document.getElementById('input-brand-border-width').value, 10);
            if (isNaN(appConfig.brandBorderWidth)) appConfig.brandBorderWidth = defaultAppConfig.brandBorderWidth;
            appConfig.brandBgType = document.getElementById('input-brand-bg-type').value || defaultAppConfig.brandBgType;
            appConfig.brandBgColor1 = document.getElementById('input-brand-bg-color1').value || defaultAppConfig.brandBgColor1;
            appConfig.brandBgColor2 = document.getElementById('input-brand-bg-color2').value || defaultAppConfig.brandBgColor2;
            appConfig.brandEffect = document.getElementById('input-brand-effect').value || defaultAppConfig.brandEffect;

            appConfig.achievementCategories = JSON.parse(JSON.stringify(tempAchievementCategories));

            appConfig.achievementWidget = {
                layout: document.getElementById('input-ach-layout').value || 'column',
                separator: document.getElementById('input-ach-separator').value || 'line',
                separatorIcon: document.getElementById('input-ach-separator-icon').value.trim() || 'fa-star',
                separatorThickness: Math.min(20, Math.max(1, parseInt(document.getElementById('input-ach-separator-thickness').value, 10) || 1)),
                columns: Math.max(0, parseInt(document.getElementById('input-ach-columns').value, 10) || 0)
            };

            appConfig.announcements = [...tempAnnouncements];
            appConfig.marqueeItems = tempMarqueeItems.length > 0 ? [...tempMarqueeItems] : JSON.parse(JSON.stringify(defaultAppConfig.marqueeItems));
            appConfig.marqueeWidget = readMarqueeWidgetFromForm();
            appConfig.birthdays = [...tempBirthdays];
            appConfig.quotes = tempQuotes.length > 0 ? [...tempQuotes] : [...defaultAppConfig.quotes];
            appConfig.quote = appConfig.quotes[0].text;
            appConfig.quoteAuthor = appConfig.quotes[0].author;
            appConfig.specialDays = [...tempSpecialDays];
            appConfig.mediaPlaylist = [...tempMediaPlaylist];

            appConfig.birthdayWidget = {
                title: document.getElementById('input-bday-title').value.trim() || defaultAppConfig.birthdayWidget.title,
                cardSize: parseFloat(document.getElementById('input-bday-size').value) || 1,
                todaySubtitle: document.getElementById('input-bday-today-subtitle').value.trim() || defaultAppConfig.birthdayWidget.todaySubtitle,
                upcomingSubtitle: document.getElementById('input-bday-upcoming-subtitle').value.trim() || defaultAppConfig.birthdayWidget.upcomingSubtitle,
                celebrationDateLabel: document.getElementById('input-bday-celebration-label').value.trim() || defaultAppConfig.birthdayWidget.celebrationDateLabel,
                emptyText: document.getElementById('input-bday-empty-text').value.trim() || defaultAppConfig.birthdayWidget.emptyText,
                showUpcomingWhenEmpty: document.getElementById('input-bday-show-upcoming').checked,
                upcomingCount: parseInt(document.getElementById('input-bday-upcoming-count').value, 10) || 0,
                emojiText: document.getElementById('input-bday-emoji-text').value.trim(),
                emojiPosition: document.getElementById('input-bday-emoji-position').value || 'middle',
                emojiSize: parseInt(document.getElementById('input-bday-emoji-size').value, 10) || 32,
                showYearInUpcoming: document.getElementById('input-bday-show-year').checked
            };
            cancelEditBirthday();

            appConfig.specialDayWidget = {
                emptyText: document.getElementById('input-specialday-empty-text').value.trim() || defaultAppConfig.specialDayWidget.emptyText,
                emptyMode: document.getElementById('input-specialday-empty-mode').value || 'text',
                emptyImage: tempSpecialDayEmptyImage || "",
                textColor: document.getElementById('input-specialday-color').value || '',
                textFont: document.getElementById('input-specialday-font').value.trim() || '',
                textSize: document.getElementById('input-specialday-size').value.trim() || defaultAppConfig.specialDayWidget.textSize,
                weatherLabel: document.getElementById('input-weather-label').value.trim() || defaultAppConfig.specialDayWidget.weatherLabel,
                weatherIcon: document.getElementById('input-weather-icon').value.trim() || defaultAppConfig.specialDayWidget.weatherIcon,
                weatherErrorIcon: document.getElementById('input-weather-error-icon').value.trim() || defaultAppConfig.specialDayWidget.weatherErrorIcon,
                // Etiket
                labelColor: document.getElementById('input-weather-label-color').value || '',
                labelFont: document.getElementById('input-weather-label-font').value.trim() || '',
                labelSize: document.getElementById('input-weather-label-size').value.trim() || defaultAppConfig.specialDayWidget.labelSize,
                // Şehir
                cityColor: document.getElementById('input-weather-city-color').value || '',
                cityFont: document.getElementById('input-weather-city-font').value.trim() || '',
                citySize: document.getElementById('input-weather-city-size').value.trim() || defaultAppConfig.specialDayWidget.citySize,
                // İkon
                iconColor: document.getElementById('input-weather-icon-color').value || '',
                iconFont: document.getElementById('input-weather-icon-font').value.trim() || '',
                iconSize: document.getElementById('input-weather-icon-size').value.trim() || defaultAppConfig.specialDayWidget.iconSize,
                // Derece
                tempColor: document.getElementById('input-weather-temp-color').value || '',
                tempFont: document.getElementById('input-weather-temp-font').value.trim() || '',
                tempSize: document.getElementById('input-weather-temp-size').value.trim() || defaultAppConfig.specialDayWidget.tempSize,
                // Alan yerleşimi & ayırıcı
                layout: document.getElementById('input-sdw-layout').value || 'column',
                separator: document.getElementById('input-sdw-separator').value || 'line',
                separatorIcon: document.getElementById('input-sdw-separator-icon').value.trim() || 'fa-star',
                separatorThickness: Math.min(20, Math.max(1, parseInt(document.getElementById('input-sdw-separator-thickness').value, 10) || 1)),
                alignH: document.getElementById('input-sdw-align-h').value || 'left',
                alignV: document.getElementById('input-sdw-align-v').value || 'center',
                specialdayEffect: document.getElementById('input-sdw-fx-specialday').value || 'none',
                specialdayEffectColor: document.getElementById('input-sdw-fx-specialday-color').value || '#00b4d8',
                weatherEffect: document.getElementById('input-sdw-fx-weather').value || 'none',
                weatherEffectColor: document.getElementById('input-sdw-fx-weather-color').value || '#00b4d8'
            };
            renderSpecialDayWeatherLayout();
            appConfig.cityName = document.getElementById('input-weather-city').value.trim() || defaultAppConfig.cityName;
            appConfig.weatherLat = document.getElementById('input-weather-lat').value.trim() || defaultAppConfig.weatherLat;
            appConfig.weatherLng = document.getElementById('input-weather-lng').value.trim() || defaultAppConfig.weatherLng;

            saveBellHoursFromInputs();
            appConfig.bellHours = bellHours;

            appConfig.moduleSettings = collectModuleSettingsFromAdmin();

            // Nöbet yerleri: boş etiketli satırları at, en az 1 nöbet yeri kalmasını garanti et
            const cleanedDutyPositions = (tempDutyPositions || [])
                .map(p => ({ id: p.id, label: (p.label || '').trim(), icon: p.icon || 'fa-user-shield', color: p.color || '#00b4d8' }))
                .filter(p => p.label);
            appConfig.dutyPositions = cleanedDutyPositions.length > 0 ? cleanedDutyPositions : JSON.parse(JSON.stringify(defaultAppConfig.dutyPositions));
            appConfig.dutyStyle = tempDutyStyle || appConfig.dutyStyle;

            panoPersist();
            renderPanoData();
            applyModuleSettingsToDashboard();
            startCyclingModuleIntervals();
            cloudSyncStartListening(); // yeni "pollIntervalSeconds" değeri varsa yoklama sıklığını hemen uygular
            if (typeof displayControlStartPolling === 'function') displayControlStartPolling(); // yeni "displaySwitchPollSeconds" değerini hemen uygula
            fetchLiveWeather();

            document.getElementById('admin-panel').classList.add('hidden');
            if (supabaseClient) supabaseClient.auth.signOut();
            showCustomNotification("Başarılı", "Tüm sistem değişiklikleri başarıyla kaydedildi ve pano güncellendi.");
            writeCMSLog("Tüm pano değişiklikleri başarıyla kaydedildi.");
        }

        function resetPanoToDefaults() {
            askCustomConfirmation("Fabrika Ayarları", "Tüm pano verileri sıfırlanıp varsayılan ayarlara dönülecek. Onaylıyor musunuz?", function() {
                appConfig = JSON.parse(JSON.stringify(defaultAppConfig));
                panoPersist(); // yerel + bulut kaydını da varsayılana sıfırlar (diğer cihazlara da yansır)
                bellHours = appConfig.bellHours;
                cancelEditBirthday();
                clearCustomColorVars();
                renderThemeClasses();
                applyModuleSettingsToDashboard();
                startCyclingModuleIntervals();
                renderPanoData();
                document.getElementById('admin-panel').classList.add('hidden');
                if (supabaseClient) supabaseClient.auth.signOut();
                showCustomNotification("Sıfırlandı", "Pano varsayılan ayarlara başarıyla döndürüldü.");
                writeCMSLog("Sistem fabrika ayarlarına sıfırlandı.");
            });
        }

        function switchTab(tabId, el) {
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            document.getElementById(tabId).classList.remove('hidden');

            const links = document.getElementById('cms-sidebar-links').getElementsByTagName('button');
            for (let link of links) {
                link.className = "w-full text-left px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg text-sm flex items-center gap-3 transition";
            }
            el.className = "w-full text-left px-4 py-3 bg-cyan-600 text-white font-bold rounded-lg text-sm flex items-center gap-3 transition shadow-lg shadow-cyan-600/10";
            writeCMSLog(`Sekme değiştirildi: ${tabId}`);
        }

        // Duyuru biçimlendirme form kontrollerinden mevcut ayarları okur
        function readAnnouncementFormatFromForm() {
            const colorEnabled = document.getElementById('new-announcement-color-enabled').checked;
            const bgEnabled = document.getElementById('new-announcement-bgcolor-enabled').checked;
            const fontSizeVal = parseInt(document.getElementById('new-announcement-fontsize').value, 10);
            return {
                color: colorEnabled ? document.getElementById('new-announcement-color').value : '',
                bgColor: bgEnabled ? document.getElementById('new-announcement-bgcolor').value : '',
                font: document.getElementById('new-announcement-font').value || '',
                fontSize: fontSizeVal && fontSizeVal > 0 ? fontSizeVal : 11,
                bold: document.getElementById('new-announcement-bold').checked
            };
        }

        // Form kontrollerini bir duyuru nesnesindeki değerlerle doldurur
        function writeAnnouncementFormatToForm(ann) {
            const colorEnabled = !!ann.color;
            const bgEnabled = !!ann.bgColor;
            document.getElementById('new-announcement-color-enabled').checked = colorEnabled;
            document.getElementById('new-announcement-color').value = ann.color || '#cbd5e1';
            document.getElementById('new-announcement-bgcolor-enabled').checked = bgEnabled;
            document.getElementById('new-announcement-bgcolor').value = ann.bgColor || '#0f172a';
            document.getElementById('new-announcement-font').value = ann.font || '';
            document.getElementById('new-announcement-fontsize').value = ann.fontSize || 11;
            document.getElementById('new-announcement-bold').checked = !!ann.bold;
        }

        // Formdaki mevcut ayarlara göre canlı önizlemeyi günceller
        function updateAnnouncementLivePreview() {
            const preview = document.getElementById('announcement-live-preview');
            const previewText = document.getElementById('announcement-live-preview-text');
            if (!preview || !previewText) return;
            const fmt = readAnnouncementFormatFromForm();
            const text = document.getElementById('new-announcement-input').value.trim();
            previewText.innerText = text || 'Yeni bir duyuru yazın...';

            preview.style.color = fmt.color || '';
            preview.style.fontFamily = fmt.font || '';
            preview.style.fontSize = fmt.fontSize ? `${fmt.fontSize}px` : '';
            preview.style.fontWeight = fmt.bold ? '700' : '';
            preview.style.backgroundColor = fmt.bgColor || 'transparent';
        }

        function renderAdminAnnouncements() {
            const wrapper = document.getElementById('admin-announcements-list-wrapper');
            wrapper.innerHTML = "";
            tempAnnouncements.forEach((ann, index) => {
                const row = document.createElement('div');
                row.className = 'flex justify-between items-center p-2 border-b border-slate-800/50 text-xs gap-2';
                const previewStyle = [
                    ann.color ? `color:${ann.color}` : '',
                    ann.font ? `font-family:${ann.font}` : '',
                    ann.fontSize ? `font-size:${Math.min(ann.fontSize, 16)}px` : '',
                    ann.bold ? `font-weight:700` : '',
                    ann.bgColor ? `background-color:${ann.bgColor};padding:2px 6px;border-radius:4px;` : ''
                ].filter(Boolean).join(';');
                row.innerHTML = `
                    <span class="text-slate-300 truncate max-w-xs" style="${previewStyle}">${index + 1}. ${escapeHtml(ann.text)}</span>
                    <div class="flex gap-1 shrink-0">
                        <button class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onclick="moveAnnouncement(${index}, -1)"><i class="fa-solid fa-arrow-up"></i></button>
                        <button class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onclick="moveAnnouncement(${index}, 1)"><i class="fa-solid fa-arrow-down"></i></button>
                        <button class="p-1 hover:bg-cyan-500/20 rounded text-cyan-400" onclick="editAnnouncement(${index})"><i class="fa-solid fa-pen"></i></button>
                        <button class="p-1 hover:bg-red-500/20 rounded text-red-400" onclick="deleteAnnouncement(${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                wrapper.appendChild(row);
            });
        }

        function addAnnouncementToList() {
            const input = document.getElementById('new-announcement-input');
            const val = input.value.trim();
            if (!val) return;

            const fmt = readAnnouncementFormatFromForm();
            const annObj = { text: val, ...fmt };

            if (editingAnnouncementIndex !== -1) {
                tempAnnouncements[editingAnnouncementIndex] = annObj;
                writeCMSLog(`Duyuru güncellendi: ${val}`);
                cancelEditAnnouncement();
            } else {
                tempAnnouncements.push(annObj);
                writeCMSLog(`Yeni duyuru eklendi: ${val}`);
                input.value = "";
                document.getElementById('new-announcement-color-enabled').checked = false;
                document.getElementById('new-announcement-bgcolor-enabled').checked = false;
                document.getElementById('new-announcement-font').value = '';
                document.getElementById('new-announcement-fontsize').value = 11;
                document.getElementById('new-announcement-bold').checked = false;
                updateAnnouncementLivePreview();
            }
            renderAdminAnnouncements();
        }

        function editAnnouncement(index) {
            editingAnnouncementIndex = index;
            const ann = tempAnnouncements[index];
            const input = document.getElementById('new-announcement-input');
            input.value = ann.text;
            input.focus();
            writeAnnouncementFormatToForm(ann);
            updateAnnouncementLivePreview();
            const btn = document.getElementById('announcement-submit-btn');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
            const title = document.getElementById('announcement-form-title');
            if (title) title.innerHTML = '<i class="fa-solid fa-pen text-cyan-400"></i> Duyuruyu Düzenle';
            const cancelBtn = document.getElementById('announcement-cancel-edit-btn');
            if (cancelBtn) cancelBtn.classList.remove('hidden');
        }

        function cancelEditAnnouncement() {
            editingAnnouncementIndex = -1;
            const input = document.getElementById('new-announcement-input');
            if (input) input.value = "";
            document.getElementById('new-announcement-color-enabled').checked = false;
            document.getElementById('new-announcement-bgcolor-enabled').checked = false;
            document.getElementById('new-announcement-font').value = '';
            document.getElementById('new-announcement-fontsize').value = 11;
            document.getElementById('new-announcement-bold').checked = false;
            updateAnnouncementLivePreview();
            const btn = document.getElementById('announcement-submit-btn');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-plus"></i>';
            const title = document.getElementById('announcement-form-title');
            if (title) title.innerHTML = '<i class="fa-solid fa-bullhorn text-red-500"></i> Duyuru Panosu Yönetimi';
            const cancelBtn = document.getElementById('announcement-cancel-edit-btn');
            if (cancelBtn) cancelBtn.classList.add('hidden');
        }

        function deleteAnnouncement(index) {
            tempAnnouncements.splice(index, 1);
            if (editingAnnouncementIndex === index) cancelEditAnnouncement();
            renderAdminAnnouncements();
        }

        function moveAnnouncement(index, direction) {
            const targetIndex = index + direction;
            if (targetIndex >= 0 && targetIndex < tempAnnouncements.length) {
                const temp = tempAnnouncements[index];
                tempAnnouncements[index] = tempAnnouncements[targetIndex];
                tempAnnouncements[targetIndex] = temp;
                renderAdminAnnouncements();
            }
        }

        // ==========================================================================
        // KAYAN YAZI (MARQUEE) — YÖNETİM PANELİ MESAJ LİSTESİ (ekle/düzenle/sil/sırala)
        // ==========================================================================

        function readMarqueeItemFormatFromForm() {
            const colorEnabled = document.getElementById('new-marquee-color-enabled').checked;
            return {
                color: colorEnabled ? document.getElementById('new-marquee-color').value : '',
                icon: document.getElementById('new-marquee-icon').value || '',
                bold: document.getElementById('new-marquee-bold').checked,
                italic: document.getElementById('new-marquee-italic').checked
            };
        }

        function writeMarqueeItemFormatToForm(item) {
            const colorEnabled = !!item.color;
            document.getElementById('new-marquee-color-enabled').checked = colorEnabled;
            document.getElementById('new-marquee-color').value = item.color || '#f1f5f9';
            document.getElementById('new-marquee-icon').value = item.icon || '';
            document.getElementById('new-marquee-bold').checked = !!item.bold;
            document.getElementById('new-marquee-italic').checked = !!item.italic;
        }

        // Tek mesaj formundaki ayarlara göre küçük canlı önizlemeyi günceller
        function updateMarqueeItemLivePreview() {
            const preview = document.getElementById('marquee-item-live-preview');
            const previewText = document.getElementById('marquee-item-live-preview-text');
            if (!preview || !previewText) return;
            const fmt = readMarqueeItemFormatFromForm();
            const text = document.getElementById('new-marquee-input').value.trim();
            previewText.innerText = text || 'Yeni bir mesaj yazın...';
            preview.style.color = fmt.color || '';
            preview.style.fontWeight = fmt.bold ? '700' : '';
            preview.style.fontStyle = fmt.italic ? 'italic' : '';
            let iconEl = preview.querySelector('i');
            if (fmt.icon) {
                if (!iconEl) { iconEl = document.createElement('i'); preview.insertBefore(iconEl, previewText); }
                iconEl.className = 'fa-solid ' + fmt.icon;
            } else if (iconEl) {
                iconEl.remove();
            }
            updateMarqueeLivePreview();
        }

        function renderAdminMarqueeItems() {
            const wrapper = document.getElementById('admin-marquee-list-wrapper');
            if (!wrapper) return;
            wrapper.innerHTML = "";
            tempMarqueeItems.forEach((item, index) => {
                const row = document.createElement('div');
                row.className = 'flex justify-between items-center p-2 border-b border-slate-800/50 text-xs gap-2';
                const previewStyle = [
                    item.color ? `color:${item.color}` : '',
                    item.bold ? 'font-weight:700' : '',
                    item.italic ? 'font-style:italic' : ''
                ].filter(Boolean).join(';');
                const iconHtml = item.icon ? `<i class="fa-solid ${item.icon}"></i> ` : '';
                row.innerHTML = `
                    <span class="text-slate-300 truncate max-w-xs" style="${previewStyle}">${index + 1}. ${iconHtml}${escapeHtml(item.text)}</span>
                    <div class="flex gap-1 shrink-0">
                        <button class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onclick="moveMarqueeItem(${index}, -1)"><i class="fa-solid fa-arrow-up"></i></button>
                        <button class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onclick="moveMarqueeItem(${index}, 1)"><i class="fa-solid fa-arrow-down"></i></button>
                        <button class="p-1 hover:bg-cyan-500/20 rounded text-cyan-400" onclick="editMarqueeItem(${index})"><i class="fa-solid fa-pen"></i></button>
                        <button class="p-1 hover:bg-red-500/20 rounded text-red-400" onclick="deleteMarqueeItem(${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                wrapper.appendChild(row);
            });
            updateMarqueeLivePreview();
        }

        function addMarqueeItemToList() {
            const input = document.getElementById('new-marquee-input');
            const val = input.value.trim();
            if (!val) return;

            const fmt = readMarqueeItemFormatFromForm();
            const itemObj = { text: val, ...fmt };

            if (editingMarqueeIndex !== -1) {
                tempMarqueeItems[editingMarqueeIndex] = itemObj;
                writeCMSLog(`Kayan yazı mesajı güncellendi: ${val}`);
                cancelEditMarqueeItem();
            } else {
                tempMarqueeItems.push(itemObj);
                writeCMSLog(`Yeni kayan yazı mesajı eklendi: ${val}`);
                input.value = "";
                document.getElementById('new-marquee-color-enabled').checked = false;
                document.getElementById('new-marquee-icon').value = '';
                document.getElementById('new-marquee-bold').checked = false;
                document.getElementById('new-marquee-italic').checked = false;
                updateMarqueeItemLivePreview();
            }
            renderAdminMarqueeItems();
        }

        function editMarqueeItem(index) {
            editingMarqueeIndex = index;
            const item = tempMarqueeItems[index];
            const input = document.getElementById('new-marquee-input');
            input.value = item.text;
            input.focus();
            writeMarqueeItemFormatToForm(item);
            updateMarqueeItemLivePreview();
            const btn = document.getElementById('marquee-submit-btn');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
            const title = document.getElementById('marquee-form-title');
            if (title) title.innerHTML = '<i class="fa-solid fa-pen text-cyan-400"></i> Mesajı Düzenle';
            const cancelBtn = document.getElementById('marquee-cancel-edit-btn');
            if (cancelBtn) cancelBtn.classList.remove('hidden');
        }

        function cancelEditMarqueeItem() {
            editingMarqueeIndex = -1;
            const input = document.getElementById('new-marquee-input');
            if (input) input.value = "";
            document.getElementById('new-marquee-color-enabled').checked = false;
            document.getElementById('new-marquee-icon').value = '';
            document.getElementById('new-marquee-bold').checked = false;
            document.getElementById('new-marquee-italic').checked = false;
            updateMarqueeItemLivePreview();
            const btn = document.getElementById('marquee-submit-btn');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-plus"></i>';
            const title = document.getElementById('marquee-form-title');
            if (title) title.innerHTML = '<i class="fa-solid fa-align-left text-cyan-400"></i> Kayan Yazı Mesajları';
            const cancelBtn = document.getElementById('marquee-cancel-edit-btn');
            if (cancelBtn) cancelBtn.classList.add('hidden');
        }

        function deleteMarqueeItem(index) {
            tempMarqueeItems.splice(index, 1);
            if (editingMarqueeIndex === index) cancelEditMarqueeItem();
            renderAdminMarqueeItems();
        }

        function moveMarqueeItem(index, direction) {
            const targetIndex = index + direction;
            if (targetIndex >= 0 && targetIndex < tempMarqueeItems.length) {
                const temp = tempMarqueeItems[index];
                tempMarqueeItems[index] = tempMarqueeItems[targetIndex];
                tempMarqueeItems[targetIndex] = temp;
                renderAdminMarqueeItems();
            }
        }

        // Ayırıcı "Özel İkon" seçiliyken ikon sınıfı giriş alanını gösterir/gizler
        function toggleMarqSeparatorIconField() {
            const sel = document.getElementById('marq-separator');
            const wrap = document.getElementById('marq-separator-icon-wrap');
            if (!sel || !wrap) return;
            wrap.style.display = (sel.value === 'icon') ? '' : 'none';
        }

        // Bant/animasyon + genel metin biçimi formundaki güncel değerleri appConfig
        // formatında bir marqueeWidget nesnesi olarak okur (canlı önizleme ve kaydetme
        // fonksiyonları tarafından ortak kullanılır).
        function readMarqueeWidgetFromForm() {
            return {
                direction: document.getElementById('marq-direction').value || 'left',
                speed: parseInt(document.getElementById('marq-speed').value, 10) || 60,
                gap: parseInt(document.getElementById('marq-gap').value, 10) || 60,
                pauseOnHover: document.getElementById('marq-pause-hover').checked,
                separator: document.getElementById('marq-separator').value || 'dot',
                separatorIcon: document.getElementById('marq-separator-icon').value.trim() || 'fa-star',
                textColor: document.getElementById('marq-textcolor-enabled').checked ? document.getElementById('marq-textcolor').value : '',
                fontSize: parseInt(document.getElementById('marq-fontsize').value, 10) || 16,
                letterSpacing: parseFloat(document.getElementById('marq-letterspacing').value) || 0,
                bold: document.getElementById('marq-bold').checked,
                italic: document.getElementById('marq-italic').checked,
                uppercase: document.getElementById('marq-uppercase').checked,
                glowEnabled: document.getElementById('marq-glow-enabled').checked,
                glowColor: document.getElementById('marq-glow-color').value || '#00e5ff'
            };
        }

        // Formdaki (henüz kaydedilmemiş) bant + mesaj ayarlarını admin panelindeki büyük
        // canlı önizlemede anında gösterir.
        function updateMarqueeLivePreview() {
            const track = document.getElementById('marq-live-preview-track');
            const viewport = document.getElementById('marq-live-preview-viewport');
            if (!track) return;
            const mw = readMarqueeWidgetFromForm();
            const items = tempMarqueeItems.length > 0 ? tempMarqueeItems : [{ text: 'Kayan yazı için mesaj ekleyin.', color: '', bold: false, italic: false, icon: '' }];
            buildMarqueeTrack(track, viewport, items, mw);
        }

        // Yönetim paneli açılırken formu appConfig'teki güncel marquee ayarlarıyla doldurur
        function loadMarqueeSettingsIntoForm() {
            const mw = appConfig.marqueeWidget || defaultAppConfig.marqueeWidget;
            document.getElementById('marq-direction').value = mw.direction || 'left';
            document.getElementById('marq-speed').value = mw.speed || 60;
            document.getElementById('marq-speed-val').innerText = mw.speed || 60;
            document.getElementById('marq-gap').value = mw.gap ?? 60;
            document.getElementById('marq-gap-val').innerText = mw.gap ?? 60;
            document.getElementById('marq-pause-hover').checked = mw.pauseOnHover !== false;
            document.getElementById('marq-separator').value = mw.separator || 'dot';
            document.getElementById('marq-separator-icon').value = mw.separatorIcon || 'fa-star';
            toggleMarqSeparatorIconField();
            document.getElementById('marq-textcolor-enabled').checked = !!mw.textColor;
            document.getElementById('marq-textcolor').value = mw.textColor || '#f1f5f9';
            document.getElementById('marq-fontsize').value = mw.fontSize || 16;
            document.getElementById('marq-letterspacing').value = mw.letterSpacing || 0;
            document.getElementById('marq-bold').checked = !!mw.bold;
            document.getElementById('marq-italic').checked = !!mw.italic;
            document.getElementById('marq-uppercase').checked = !!mw.uppercase;
            document.getElementById('marq-glow-enabled').checked = !!mw.glowEnabled;
            document.getElementById('marq-glow-color').value = mw.glowColor || '#00e5ff';
            renderAdminMarqueeItems();
            updateMarqueeLivePreview();
        }

        function renderAdminBirthdays() {
            const wrapper = document.getElementById('admin-birthdays-list-wrapper');
            wrapper.innerHTML = "";

            // Artık geçerli olmayan (silinmiş) indeksleri seçim kümesinden temizle
            selectedBirthdayIndices.forEach(i => { if (i >= tempBirthdays.length) selectedBirthdayIndices.delete(i); });

            tempBirthdays.forEach((bday, index) => {
                const row = document.createElement('div');
                row.className = 'flex justify-between items-center p-2 border-b border-slate-800/50 text-xs gap-2';
                row.innerHTML = `
                    <label class="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                        <input type="checkbox" class="birthday-row-checkbox shrink-0" data-index="${index}" ${selectedBirthdayIndices.has(index) ? 'checked' : ''} onchange="toggleBirthdaySelect(${index}, this.checked)">
                        <span class="text-slate-300 truncate"><i class="fa-solid fa-cake-candles text-amber-500 mr-1.5"></i> ${escapeHtml(bday.class)} - ${escapeHtml(bday.name)} (${escapeHtml(bday.date)})</span>
                    </label>
                    <div class="flex gap-1 shrink-0">
                        <button class="p-1 hover:bg-slate-800 rounded text-cyan-400" onclick="editBirthday(${index})"><i class="fa-solid fa-pen"></i></button>
                        <button class="p-1 hover:bg-red-500/20 rounded text-red-400" onclick="deleteBirthday(${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                wrapper.appendChild(row);
            });

            updateBirthdayBulkDeleteUI();
        }

        // Bir doğum günü satırının toplu-seçim durumunu günceller
        function toggleBirthdaySelect(index, checked) {
            if (checked) selectedBirthdayIndices.add(index);
            else selectedBirthdayIndices.delete(index);
            updateBirthdayBulkDeleteUI();
        }

        // "Tümünü Seç" kutusu değiştirildiğinde tüm satırları seçer/kaldırır
        function toggleBirthdaySelectAll(checked) {
            selectedBirthdayIndices.clear();
            if (checked) {
                tempBirthdays.forEach((_, index) => selectedBirthdayIndices.add(index));
            }
            renderAdminBirthdays();
        }

        // Seçim sayısına göre "Seçilenleri Sil" butonunun durumunu ve "Tümünü Seç" kutusunu günceller
        function updateBirthdayBulkDeleteUI() {
            const countEl = document.getElementById('birthday-selected-count');
            const btn = document.getElementById('birthday-bulk-delete-btn');
            const selectAllBox = document.getElementById('birthday-select-all');
            if (countEl) countEl.innerText = selectedBirthdayIndices.size;
            if (btn) btn.disabled = selectedBirthdayIndices.size === 0;
            if (selectAllBox) selectAllBox.checked = tempBirthdays.length > 0 && selectedBirthdayIndices.size === tempBirthdays.length;
        }

        // Seçilen tüm doğum günü kayıtlarını onay alarak topluca siler
        function bulkDeleteBirthdays() {
            if (selectedBirthdayIndices.size === 0) return;
            const count = selectedBirthdayIndices.size;
            askCustomConfirmation("Toplu Silme", `Seçili ${count} doğum günü kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`, function() {
                tempBirthdays = tempBirthdays.filter((_, index) => !selectedBirthdayIndices.has(index));
                selectedBirthdayIndices.clear();
                cancelEditBirthday();
                renderAdminBirthdays();
                writeCMSLog(`${count} doğum günü kaydı toplu olarak silindi.`);
            });
        }

        function addBirthdayToList() {
            const cls = document.getElementById('new-birthday-class').value;
            const name = document.getElementById('new-birthday-name').value.trim();
            const date = document.getElementById('new-birthday-date').value.trim();
            
            if (name && date) {
                if (editingBirthdayIndex !== -1) {
                    tempBirthdays[editingBirthdayIndex] = { class: cls, name: name, date: date };
                    writeCMSLog(`Doğum günü güncellendi: ${cls} - ${name} (${date})`);
                    cancelEditBirthday();
                } else {
                    tempBirthdays.push({ class: cls, name: name, date: date });
                    document.getElementById('new-birthday-name').value = "";
                    document.getElementById('new-birthday-date').value = "";
                    writeCMSLog(`Doğum günü eklendi: ${cls} - ${name} (${date})`);
                }
                renderAdminBirthdays();
            } else {
                showCustomNotification("Giriş Hatası", "Lütfen tüm doğum günü alanlarını doldurun (Tarih formatı GG.AA olmalıdır).");
            }
        }

        function editBirthday(index) {
            const bday = tempBirthdays[index];
            if (!bday) return;
            editingBirthdayIndex = index;
            document.getElementById('new-birthday-class').value = bday.class;
            document.getElementById('new-birthday-name').value = bday.name;
            document.getElementById('new-birthday-date').value = bday.date;

            document.getElementById('birthday-form-title').innerHTML = '<i class="fa-solid fa-pen text-yellow-400"></i> Doğum Günü Kaydını Düzenle';
            document.getElementById('birthday-submit-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
            document.getElementById('birthday-submit-btn').className = 'px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg text-xs hover:bg-yellow-600';
            document.getElementById('birthday-cancel-edit-btn').classList.remove('hidden');
        }

        function cancelEditBirthday() {
            editingBirthdayIndex = -1;
            document.getElementById('new-birthday-name').value = "";
            document.getElementById('new-birthday-date').value = "";
            document.getElementById('birthday-form-title').innerHTML = '<i class="fa-solid fa-pen text-cyan-400"></i> Manuel Doğum Günü Ekle';
            document.getElementById('birthday-submit-btn').innerHTML = '<i class="fa-solid fa-plus"></i>';
            document.getElementById('birthday-submit-btn').className = 'px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg text-xs hover:bg-emerald-600';
            document.getElementById('birthday-cancel-edit-btn').classList.add('hidden');
        }

        function deleteBirthday(index) {
            tempBirthdays.splice(index, 1);
            if (editingBirthdayIndex === index) {
                cancelEditBirthday();
            } else if (editingBirthdayIndex > index) {
                editingBirthdayIndex--;
            }
            // Seçim kümesindeki indeksleri kaydırılan listeye göre yeniden hizala
            const newSelection = new Set();
            selectedBirthdayIndices.forEach(i => {
                if (i === index) return;
                newSelection.add(i > index ? i - 1 : i);
            });
            selectedBirthdayIndices = newSelection;
            renderAdminBirthdays();
        }

        function renderAdminQuotes() {
            const wrapper = document.getElementById('admin-quotes-list-wrapper');
            if (!wrapper) return;
            wrapper.innerHTML = "";
            // Artık geçerli olmayan (silinmiş) indeksleri seçim kümesinden temizle
            selectedQuoteIndices.forEach(i => { if (i >= tempQuotes.length) selectedQuoteIndices.delete(i); });
            if (tempQuotes.length === 0) {
                wrapper.innerHTML = `<div class="p-3 text-xs text-slate-500 text-center">Henüz kayıtlı söz yok.</div>`;
                updateQuoteBulkDeleteUI();
                return;
            }
            tempQuotes.forEach((q, index) => {
                const row = document.createElement('div');
                row.className = 'flex justify-between items-center gap-2 p-2 border-b border-slate-800/50 text-xs';
                row.innerHTML = `
                    <label class="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                        <input type="checkbox" class="quote-row-checkbox shrink-0" data-index="${index}" ${selectedQuoteIndices.has(index) ? 'checked' : ''} onchange="toggleQuoteSelect(${index}, this.checked)">
                        <span class="text-slate-300 flex-1 truncate">
                            ${q.date ? `<span class="text-purple-400 font-mono font-bold mr-1">[${q.date}]</span>` : ''}
                            <i class="fa-solid fa-quote-left text-slate-500 mr-1"></i> ${q.text} ${q.author ? `<span class="text-cyan-400">— ${q.author}</span>` : ''}
                        </span>
                    </label>
                    <div class="flex gap-1 flex-shrink-0">
                        <button class="p-1 hover:bg-cyan-500/20 rounded text-cyan-400" onclick="editQuote(${index})"><i class="fa-solid fa-pen"></i></button>
                        <button class="p-1 hover:bg-red-500/20 rounded text-red-400" onclick="deleteQuote(${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                wrapper.appendChild(row);
            });

            updateQuoteBulkDeleteUI();
        }

        // Bir söz satırının toplu-seçim durumunu günceller
        function toggleQuoteSelect(index, checked) {
            if (checked) selectedQuoteIndices.add(index);
            else selectedQuoteIndices.delete(index);
            updateQuoteBulkDeleteUI();
        }

        // "Tümünü Seç" kutusu değiştirildiğinde tüm söz satırlarını seçer/kaldırır
        function toggleQuoteSelectAll(checked) {
            selectedQuoteIndices.clear();
            if (checked) {
                tempQuotes.forEach((_, index) => selectedQuoteIndices.add(index));
            }
            renderAdminQuotes();
        }

        // Seçim sayısına göre "Seçilenleri Sil" butonunun durumunu ve "Tümünü Seç" kutusunu günceller
        function updateQuoteBulkDeleteUI() {
            const countEl = document.getElementById('quote-selected-count');
            const btn = document.getElementById('quote-bulk-delete-btn');
            const selectAllBox = document.getElementById('quote-select-all');
            if (countEl) countEl.innerText = selectedQuoteIndices.size;
            if (btn) btn.disabled = selectedQuoteIndices.size === 0;
            if (selectAllBox) selectAllBox.checked = tempQuotes.length > 0 && selectedQuoteIndices.size === tempQuotes.length;
        }

        // Seçilen tüm söz kayıtlarını onay alarak topluca siler
        function bulkDeleteQuotes() {
            if (selectedQuoteIndices.size === 0) return;
            const count = selectedQuoteIndices.size;
            askCustomConfirmation("Toplu Silme", `Seçili ${count} söz kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`, function() {
                tempQuotes = tempQuotes.filter((_, index) => !selectedQuoteIndices.has(index));
                selectedQuoteIndices.clear();
                cancelEditQuote();
                renderAdminQuotes();
                writeCMSLog(`${count} söz kaydı toplu olarak silindi.`);
            });
        }

        function addQuoteToList() {
            const date = document.getElementById('new-quote-date').value.trim();
            const text = document.getElementById('new-quote-text').value.trim();
            const author = document.getElementById('new-quote-author').value.trim();

            if (text) {
                if (editingQuoteIndex !== -1) {
                    tempQuotes[editingQuoteIndex] = { text, author, date };
                    writeCMSLog(`Söz güncellendi: "${text}"${author ? ' - ' + author : ''}`);
                    cancelEditQuote();
                } else {
                    tempQuotes.push({ text, author, date });
                    writeCMSLog(`Yeni söz eklendi: "${text}"${author ? ' - ' + author : ''}`);
                }
                document.getElementById('new-quote-date').value = "";
                document.getElementById('new-quote-text').value = "";
                document.getElementById('new-quote-author').value = "";
                renderAdminQuotes();
            } else {
                showCustomNotification("Giriş Hatası", "Lütfen en azından söz metnini giriniz.");
            }
        }

        function editQuote(index) {
            const q = tempQuotes[index];
            if (!q) return;
            editingQuoteIndex = index;
            document.getElementById('new-quote-date').value = q.date || "";
            document.getElementById('new-quote-text').value = q.text || "";
            document.getElementById('new-quote-author').value = q.author || "";
            const btn = document.getElementById('quote-submit-btn');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
        }

        function cancelEditQuote() {
            editingQuoteIndex = -1;
            const btn = document.getElementById('quote-submit-btn');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        }

        function deleteQuote(index) {
            tempQuotes.splice(index, 1);
            if (editingQuoteIndex === index) cancelEditQuote();
            renderAdminQuotes();
        }

        function renderAdminSpecialDays() {
            const wrapper = document.getElementById('admin-specialdays-list-wrapper');
            wrapper.innerHTML = "";
            // Artık geçerli olmayan (silinmiş) indeksleri seçim kümesinden temizle
            selectedSpecialDayIndices.forEach(i => { if (i >= tempSpecialDays.length) selectedSpecialDayIndices.delete(i); });
            if (tempSpecialDays.length === 0) {
                wrapper.innerHTML = `<div class="p-3 text-xs text-slate-500 text-center">Henüz kayıtlı belirli gün/hafta yok.</div>`;
                updateSpecialDayBulkDeleteUI();
                return;
            }
            tempSpecialDays.forEach((day, index) => {
                const range = (day.startDate || day.endDate)
                    ? `<span class="text-rose-400 font-mono font-bold ml-1">[${day.startDate || '?'} - ${day.endDate || '?'}]</span>`
                    : '';
                const customFormatBadge = (day.color || day.font || day.size)
                    ? `<span class="inline-flex items-center gap-1 ml-1.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 shrink-0" title="Bu kayıt için özel biçim tanımlı">
                         <span class="w-2.5 h-2.5 rounded-full border border-slate-600" style="background:${day.color || '#ffb703'};"></span>
                         <span class="text-[8px] uppercase text-slate-400 font-bold">Özel</span>
                       </span>`
                    : '';
                const row = document.createElement('div');
                row.className = 'flex justify-between items-center p-2 border-b border-slate-800/50 text-xs';
                row.innerHTML = `
                    <label class="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                        <input type="checkbox" class="specialday-row-checkbox shrink-0" data-index="${index}" ${selectedSpecialDayIndices.has(index) ? 'checked' : ''} onchange="toggleSpecialDaySelect(${index}, this.checked)">
                        <span class="text-slate-300 flex-1 truncate flex items-center"><i class="fa-solid fa-calendar-day text-rose-500 mr-1.5"></i> ${day.title}${range}${customFormatBadge}</span>
                    </label>
                    <div class="flex gap-1 flex-shrink-0">
                        <button class="p-1 hover:bg-cyan-500/20 rounded text-cyan-400" onclick="editSpecialDay(${index})"><i class="fa-solid fa-pen"></i></button>
                        <button class="p-1 hover:bg-red-500/20 rounded text-red-400" onclick="deleteSpecialDay(${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                wrapper.appendChild(row);
            });

            updateSpecialDayBulkDeleteUI();
        }

        // Bir belirli gün/hafta satırının toplu-seçim durumunu günceller
        function toggleSpecialDaySelect(index, checked) {
            if (checked) selectedSpecialDayIndices.add(index);
            else selectedSpecialDayIndices.delete(index);
            updateSpecialDayBulkDeleteUI();
        }

        // "Tümünü Seç" kutusu değiştirildiğinde tüm belirli gün/hafta satırlarını seçer/kaldırır
        function toggleSpecialDaySelectAll(checked) {
            selectedSpecialDayIndices.clear();
            if (checked) {
                tempSpecialDays.forEach((_, index) => selectedSpecialDayIndices.add(index));
            }
            renderAdminSpecialDays();
        }

        // Seçim sayısına göre "Seçilenleri Sil" butonunun durumunu ve "Tümünü Seç" kutusunu günceller
        function updateSpecialDayBulkDeleteUI() {
            const countEl = document.getElementById('specialday-selected-count');
            const btn = document.getElementById('specialday-bulk-delete-btn');
            const selectAllBox = document.getElementById('specialday-select-all');
            if (countEl) countEl.innerText = selectedSpecialDayIndices.size;
            if (btn) btn.disabled = selectedSpecialDayIndices.size === 0;
            if (selectAllBox) selectAllBox.checked = tempSpecialDays.length > 0 && selectedSpecialDayIndices.size === tempSpecialDays.length;
        }

        // Seçilen tüm belirli gün/hafta kayıtlarını onay alarak topluca siler
        function bulkDeleteSpecialDays() {
            if (selectedSpecialDayIndices.size === 0) return;
            const count = selectedSpecialDayIndices.size;
            askCustomConfirmation("Toplu Silme", `Seçili ${count} belirli gün/hafta kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`, function() {
                tempSpecialDays = tempSpecialDays.filter((_, index) => !selectedSpecialDayIndices.has(index));
                selectedSpecialDayIndices.clear();
                cancelEditSpecialDay();
                renderAdminSpecialDays();
                writeCMSLog(`${count} belirli gün/hafta kaydı toplu olarak silindi.`);
            });
        }

        function addSpecialDayToList() {
            const input = document.getElementById('new-specialday-input');
            const startInput = document.getElementById('new-specialday-start');
            const endInput = document.getElementById('new-specialday-end');
            const colorEnable = document.getElementById('new-specialday-color-enable');
            const colorInput = document.getElementById('new-specialday-color');
            const fontInput = document.getElementById('new-specialday-font');
            const sizeInput = document.getElementById('new-specialday-size');
            const val = input.value.trim();
            const startDate = startInput ? startInput.value.trim() : "";
            const endDate = endInput ? endInput.value.trim() : "";
            const color = (colorEnable && colorEnable.checked && colorInput) ? colorInput.value : "";
            const font = fontInput ? fontInput.value : "";
            const size = (sizeInput && sizeInput.value.trim()) ? sizeInput.value.trim() : "";
            if (val) {
                if (editingSpecialDayIndex !== -1) {
                    tempSpecialDays[editingSpecialDayIndex] = { title: val, startDate, endDate, color, font, size };
                    writeCMSLog(`Belirli gün/hafta kaydı güncellendi: ${val}`);
                    cancelEditSpecialDay();
                } else {
                    tempSpecialDays.push({ title: val, startDate, endDate, color, font, size });
                    writeCMSLog(`Belirli gün/hafta kaydı eklendi: ${val}`);
                }
                input.value = "";
                if (startInput) startInput.value = "";
                if (endInput) endInput.value = "";
                if (colorEnable) colorEnable.checked = false;
                if (colorInput) { colorInput.disabled = true; colorInput.value = '#ffb703'; }
                if (fontInput) fontInput.value = "";
                if (sizeInput) sizeInput.value = "";
                renderAdminSpecialDays();
            }
        }

        function editSpecialDay(index) {
            const day = tempSpecialDays[index];
            if (!day) return;
            editingSpecialDayIndex = index;
            document.getElementById('new-specialday-input').value = day.title || "";
            const startInput = document.getElementById('new-specialday-start');
            const endInput = document.getElementById('new-specialday-end');
            if (startInput) startInput.value = day.startDate || "";
            if (endInput) endInput.value = day.endDate || "";
            const colorEnable = document.getElementById('new-specialday-color-enable');
            const colorInput = document.getElementById('new-specialday-color');
            if (colorEnable) colorEnable.checked = !!day.color;
            if (colorInput) { colorInput.disabled = !day.color; colorInput.value = day.color || '#ffb703'; }
            const fontInput = document.getElementById('new-specialday-font');
            if (fontInput) fontInput.value = day.font || "";
            const sizeInput = document.getElementById('new-specialday-size');
            if (sizeInput) sizeInput.value = day.size || "";
            const btn = document.getElementById('specialday-submit-btn');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
        }

        function cancelEditSpecialDay() {
            editingSpecialDayIndex = -1;
            const btn = document.getElementById('specialday-submit-btn');
            if (btn) btn.innerHTML = 'Ekle';
            const colorEnable = document.getElementById('new-specialday-color-enable');
            const colorInput = document.getElementById('new-specialday-color');
            if (colorEnable) colorEnable.checked = false;
            if (colorInput) { colorInput.disabled = true; colorInput.value = '#ffb703'; }
            const fontInput = document.getElementById('new-specialday-font');
            if (fontInput) fontInput.value = "";
            const sizeInput = document.getElementById('new-specialday-size');
            if (sizeInput) sizeInput.value = "";
        }

        function deleteSpecialDay(index) {
            tempSpecialDays.splice(index, 1);
            if (editingSpecialDayIndex === index) cancelEditSpecialDay();
            renderAdminSpecialDays();
        }

        // "Belirli Gün/Hafta Olmadığı Tarihlerde Gösterilecek" bölümünde Metin/Görsel seçimine göre ilgili alanı gösterir/gizler
        function toggleSpecialDayEmptyModeUI() {
            const mode = document.getElementById('input-specialday-empty-mode').value;
            const textWrap = document.getElementById('specialday-empty-text-wrap');
            const imgWrap = document.getElementById('specialday-empty-image-wrap');
            if (textWrap) textWrap.classList.toggle('hidden', mode === 'image');
            if (imgWrap) imgWrap.classList.toggle('hidden', mode !== 'image');
        }

        // "Belirli Gün/Hafta yokken" gösterilecek görseli bilgisayardan seçip önizler ve arka planda buluta yükler
        function handleSpecialDayEmptyImageUpload(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
                showCustomNotification("Dosya Çok Büyük", "Lütfen 2MB'tan küçük bir görsel dosyası seçin.");
                event.target.value = '';
                return;
            }
            openImageEditor(file, { aspect: 3 }, function (editedDataUrl) {
                event.target.value = '';
                if (!editedDataUrl) return; // kullanıcı iptal etti
                const dataUrl = editedDataUrl;
                tempSpecialDayEmptyImage = dataUrl;
                const previewImg = document.getElementById('specialday-empty-img-preview');
                const previewEmpty = document.getElementById('specialday-empty-img-preview-empty');
                if (previewImg) { previewImg.src = dataUrl; previewImg.classList.remove('hidden'); }
                if (previewEmpty) previewEmpty.classList.add('hidden');
                writeCMSLog("Belirli gün/hafta boş durumu için yeni görsel seçildi (kaydetmeyi unutmayın).");

                const editedFile = dataUrlToFile(dataUrl, 'specialday-empty.jpg');
                uploadImageFileToCloud(editedFile, 'specialday').then(url => {
                    if (url && tempSpecialDayEmptyImage === dataUrl) {
                        tempSpecialDayEmptyImage = url;
                        writeCMSLog("Belirli gün/hafta boş durum görseli buluta yüklendi (hafif bağlantı olarak kaydedilecek).");
                    }
                });
            });
        }

        function removeSpecialDayEmptyImage() {
            tempSpecialDayEmptyImage = "";
            const previewImg = document.getElementById('specialday-empty-img-preview');
            const previewEmpty = document.getElementById('specialday-empty-img-preview-empty');
            if (previewImg) { previewImg.classList.add('hidden'); previewImg.src = ''; }
            if (previewEmpty) previewEmpty.classList.remove('hidden');
            const fileInput = document.getElementById('specialday-empty-img-input');
            if (fileInput) fileInput.value = '';
        }

        function renderAdminMediaPlaylist() {
            const container = document.getElementById('admin-media-playlist');
            container.innerHTML = "";
            tempMediaPlaylist.forEach((slide, index) => {
                const row = document.createElement('div');
                row.className = `flex gap-2 items-center p-2 border border-slate-800 rounded-lg text-[11px] bg-slate-900/50 ${index === editingMediaSlideIndex ? 'ring-1 ring-cyan-500' : ''}`;
                row.innerHTML = `
                    <img src="${slide.url}" class="w-10 h-10 object-cover rounded-lg border border-slate-800">
                    <div class="flex-1 truncate">
                        <div class="font-bold text-white truncate">${slide.caption}</div>
                    </div>
                    <div class="flex gap-1">
                        <button class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onclick="moveMediaSlide(${index}, -1)"><i class="fa-solid fa-arrow-up"></i></button>
                        <button class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onclick="moveMediaSlide(${index}, 1)"><i class="fa-solid fa-arrow-down"></i></button>
                        <button class="p-1 hover:bg-cyan-500/20 rounded text-cyan-400" onclick="editMediaSlide(${index})"><i class="fa-solid fa-pen"></i></button>
                        <button class="p-1 text-red-400 hover:bg-red-500/20 rounded" onclick="deleteMediaSlide(${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                container.appendChild(row);
            });
        }

        // GÖRSEL MEDYA (SLAYT) modülüne bilgisayardan doğrudan fotoğraf yükleme:
        // seçilen dosya anında base64 olarak URL alanına yazılır (önizleme/anlık kullanım için),
        // ardından arka planda buluta yüklenip (varsa) hafif bir bağlantıyla değiştirilir.
        function handleMediaFileSelect(inputEl) {
            const file = inputEl.files && inputEl.files[0];
            if (!file) return;
            openImageEditor(file, { aspect: 16 / 9 }, function (editedDataUrl) {
                inputEl.value = '';
                if (!editedDataUrl) return; // kullanıcı iptal etti
                const dataUrl = editedDataUrl;
                const urlInput = document.getElementById('input-media-url');
                if (urlInput) urlInput.value = dataUrl;
                writeCMSLog("Medya için fotoğraf düzenlendi/seçildi (Slayda Ekle'ye basmayı unutmayın).");

                const editedFile = dataUrlToFile(dataUrl, 'medya.jpg');
                uploadImageFileToCloud(editedFile, 'medya-slayt').then(url => {
                    if (url && urlInput && urlInput.value === dataUrl) {
                        urlInput.value = url;
                        writeCMSLog("Medya fotoğrafı buluta yüklendi (hafif bağlantı olarak kaydedilecek).");
                    }
                });
            });
        }

        function addMediaSlide() {
            const urlInput = document.getElementById('input-media-url');
            const captionInput = document.getElementById('input-media-caption');
            const url = urlInput.value.trim();
            const caption = captionInput.value.trim();

            if (url && caption) {
                if (editingMediaSlideIndex !== -1) {
                    tempMediaPlaylist[editingMediaSlideIndex] = { url, caption };
                    writeCMSLog(`Medya slaytı güncellendi: ${caption}`);
                    cancelEditMediaSlide();
                } else {
                    tempMediaPlaylist.push({ url, caption });
                    writeCMSLog(`Medya listesine slayt eklendi: ${caption}`);
                }
                urlInput.value = "";
                captionInput.value = "";
                renderAdminMediaPlaylist();
            } else {
                showCustomNotification("Hata", "Lütfen tüm görsel verilerini eksiksiz girin.");
            }
        }

        function editMediaSlide(index) {
            editingMediaSlideIndex = index;
            const slide = tempMediaPlaylist[index];
            document.getElementById('input-media-url').value = slide.url || "";
            document.getElementById('input-media-caption').value = slide.caption || "";
            const btn = document.getElementById('media-slide-submit-btn');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Güncelle';
            renderAdminMediaPlaylist();
        }

        function cancelEditMediaSlide() {
            editingMediaSlideIndex = -1;
            const btn = document.getElementById('media-slide-submit-btn');
            if (btn) btn.innerText = 'Slayda Ekle';
        }

        function deleteMediaSlide(index) {
            tempMediaPlaylist.splice(index, 1);
            if (editingMediaSlideIndex === index) cancelEditMediaSlide();
            renderAdminMediaPlaylist();
        }

        function moveMediaSlide(index, direction) {
            const targetIndex = index + direction;
            if (targetIndex >= 0 && targetIndex < tempMediaPlaylist.length) {
                const temp = tempMediaPlaylist[index];
                tempMediaPlaylist[index] = tempMediaPlaylist[targetIndex];
                tempMediaPlaylist[targetIndex] = temp;
                renderAdminMediaPlaylist();
            }
        }

        // ===================== AYIN TEMİZ SINIFI - LİSTE YÖNETİMİ =====================
        // ============================================================
        // AYIN ENLERİ — DİNAMİK ALAN (HÜCRE) YÖNETİMİ
        // Her alan (kategori) kendi başlığı, ikonu, kayıt listesi
        // (URL veya bilgisayardan manuel yükleme) ve kendi görsel/metin
        // biçimlendirme ayarlarına (boyut, çerçeve şekli, kenarlık,
        // hizalama, konum) sahip bağımsız bir hücre gibi çalışır.
        // ============================================================

        const ACH_ICON_OPTIONS = [
            "fa-star", "fa-wand-magic-sparkles", "fa-trophy", "fa-medal", "fa-crown",
            "fa-thumbs-up", "fa-heart", "fa-graduation-cap", "fa-book-open", "fa-broom",
            "fa-award", "fa-ranking-star"
        ];
        const ACH_FONT_OPTIONS = [
            { v: "", l: "Varsayılan" },
            { v: "'Rajdhani', sans-serif", l: "Rajdhani" },
            { v: "'Roboto', sans-serif", l: "Roboto" },
            { v: "'Orbitron', sans-serif", l: "Orbitron" },
            { v: "'Exo 2', sans-serif", l: "Exo 2" },
            { v: "'Share Tech Mono', monospace", l: "Share Tech Mono" },
            { v: "'Oswald', sans-serif", l: "Oswald" },
            { v: "'Nunito', sans-serif", l: "Nunito" },
            { v: "Arial, sans-serif", l: "Arial" },
            { v: "'Times New Roman', serif", l: "Times New Roman" }
        ];

        function genAchievementCategoryId() {
            return 'cat_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
        }

        // Ayırıcı türü "Simge" seçilmediyse simge alanını, "Çizgi/Noktalı Desen" değilse kalınlık alanını gizle
        function toggleAchSeparatorIconField() {
            const sepType = document.getElementById('input-ach-separator').value;
            const wrapper = document.getElementById('ach-separator-icon-wrapper');
            if (wrapper) wrapper.style.display = sepType === 'icon' ? '' : 'none';
            const thicknessWrapper = document.getElementById('ach-separator-thickness-wrapper');
            if (thicknessWrapper) thicknessWrapper.style.display = (sepType === 'line' || sepType === 'dots') ? '' : 'none';
        }

        // BELİRLİ GÜN & HAVA DURUMU: ayırıcı türüne göre simge/kalınlık alanlarını göster-gizle
        function toggleSdwSeparatorIconField() {
            const sepEl = document.getElementById('input-sdw-separator');
            if (!sepEl) return;
            const sepType = sepEl.value;
            const wrapper = document.getElementById('sdw-separator-icon-wrapper');
            if (wrapper) wrapper.style.display = sepType === 'icon' ? '' : 'none';
            const thicknessWrapper = document.getElementById('sdw-separator-thickness-wrapper');
            if (thicknessWrapper) thicknessWrapper.style.display = (sepType === 'line' || sepType === 'dots') ? '' : 'none';
        }

        // Yeni bir alan (hücre) ekler — örn. "Haftanın Sporcusu", "Ayın Kitap Kurdu" vb.
        function addAchievementCategory() {
            const newCat = {
                id: genAchievementCategoryId(),
                title: "Yeni Alan",
                icon: "fa-star",
                active: true,
                list: [],
                style: {
                    font: "", size: "14", color: "", textAlign: "left", justify: "center",
                    imgPosition: "left", imgSize: 44, imgShape: "rounded",
                    imgBorderWidth: 1.5, imgBorderColor: "#00b4d8", imgBorderStyle: "solid", imgOpacity: 100,
                    cellEffect: "none", cellEffectColor: "#00b4d8", cellEffectIntensity: 100, imgEffect: "none", imgEffectColor: "#00b4d8", imgEffectIntensity: 100
                }
            };
            tempAchievementCategories.push(newCat);
            renderAdminAchievementCategories();
            writeCMSLog("Ayın Enleri: yeni alan eklendi.");
        }

        function deleteAchievementCategory(catId) {
            const cat = tempAchievementCategories.find(c => c.id === catId);
            askCustomConfirmation(
                "Alanı Sil",
                `"${(cat && cat.title) || 'Bu alan'}" tamamen silinecek (tüm kayıtlarıyla birlikte). Onaylıyor musunuz?`,
                function () {
                    tempAchievementCategories = tempAchievementCategories.filter(c => c.id !== catId);
                    if (achievementEditing.catId === catId) achievementEditing = { catId: null, index: -1 };
                    delete achievementPendingFile[catId];
                    renderAdminAchievementCategories();
                    writeCMSLog("Ayın Enleri: bir alan silindi.");
                }
            );
        }

        function updateAchievementCategoryField(catId, field, value) {
            const cat = tempAchievementCategories.find(c => c.id === catId);
            if (!cat) return;
            cat[field] = value;
        }

        function updateAchievementCategoryStyleField(catId, field, value) {
            const cat = tempAchievementCategories.find(c => c.id === catId);
            if (!cat) return;
            if (!cat.style) cat.style = {};
            cat.style[field] = value;
        }

        // Kullanıcı bilgisayardan bir görsel seçtiğinde base64 (data URL) olarak okur ve önizler
        function handleAchievementFileSelect(catId, inputEl) {
            const file = inputEl.files && inputEl.files[0];
            if (!file) return;
            openImageEditor(file, { aspect: 1 }, function (editedDataUrl) {
                inputEl.value = '';
                if (!editedDataUrl) return; // kullanıcı iptal etti
                const dataUrl = editedDataUrl;
                achievementPendingFile[catId] = dataUrl;
                updateAchRecordPreview(catId);

                // Arka planda buluta yükle: bitince (hâlâ aynı görsel seçiliyse) küçük bir
                // bağlantıyla (URL) değiştirilir, böylece kaydedilen veri hafif kalır.
                const editedFile = dataUrlToFile(dataUrl, 'ayin-enleri.jpg');
                uploadImageFileToCloud(editedFile, 'ayin-enleri').then(url => {
                    if (url && achievementPendingFile[catId] === dataUrl) {
                        achievementPendingFile[catId] = url;
                        writeCMSLog("Görsel buluta yüklendi (hafif bağlantı olarak kaydedilecek).");
                    }
                });
            });
        }

        // URL alanına yazılan adresi veya seçilen dosyayı küçük önizlemede gösterir
        function updateAchRecordPreview(catId) {
            const preview = document.getElementById('ach-record-preview-' + catId);
            if (!preview) return;
            const urlInput = document.getElementById('ach-record-url-' + catId);
            const src = achievementPendingFile[catId] || (urlInput ? urlInput.value.trim() : '');
            if (src) {
                preview.src = src;
                preview.classList.remove('hidden');
            } else {
                preview.classList.add('hidden');
            }
        }

        // Dosyadan yüklenen görseli temizleyip tekrar URL girilebilir hale getirir
        function clearAchievementPendingFile(catId) {
            delete achievementPendingFile[catId];
            const fileInput = document.getElementById('ach-record-file-' + catId);
            if (fileInput) fileInput.value = '';
            updateAchRecordPreview(catId);
        }

        function renderAdminAchievementCategories() {
            const wrapper = document.getElementById('admin-achievement-categories-wrapper');
            if (!wrapper) return;
            wrapper.innerHTML = '';
            tempAchievementCategories.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4' + (cat.active === false ? ' opacity-50' : '');
                card.innerHTML = buildAchievementCategoryCardHtml(cat);
                wrapper.appendChild(card);
                renderAdminAchievementRecordList(cat.id);
                updateAchRecordPreview(cat.id);
            });
        }

        function buildAchievementCategoryCardHtml(cat) {
            const st = cat.style || {};
            const iconOptionsHtml = ACH_ICON_OPTIONS.map(ic =>
                `<option value="${ic}" ${cat.icon === ic ? 'selected' : ''}>${ic.replace('fa-', '')}</option>`
            ).join('');
            const fontOptionsHtml = ACH_FONT_OPTIONS.map(f =>
                `<option value="${f.v}" ${(st.font || '') === f.v ? 'selected' : ''}>${f.l}</option>`
            ).join('');
            const isEditingThis = achievementEditing.catId === cat.id && achievementEditing.index !== -1;

            return `
                <div class="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-2 flex-1">
                        <select class="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs w-12 text-center"
                            onchange="updateAchievementCategoryField('${cat.id}', 'icon', this.value); renderAdminAchievementCategories();"
                            title="Alan Simgesi">${iconOptionsHtml}</select>
                        <input type="text" value="${escapeHtml(cat.title)}" placeholder="Alan Başlığı (Örn: Ayın Temiz Sınıfı)"
                            class="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-sm font-bold"
                            oninput="updateAchievementCategoryField('${cat.id}', 'title', this.value)">
                    </div>
                    <label class="flex items-center gap-1.5 shrink-0 cursor-pointer select-none" title="Bu alan panoda gösterilsin mi?">
                        <input type="checkbox" class="accent-emerald-500 w-4 h-4" ${cat.active !== false ? 'checked' : ''}
                            onchange="updateAchievementCategoryField('${cat.id}', 'active', this.checked); renderAdminAchievementCategories();">
                        <span class="text-[11px] font-bold ${cat.active !== false ? 'text-emerald-400' : 'text-slate-500'}">${cat.active !== false ? 'Aktif' : 'Pasif'}</span>
                    </label>
                    <button class="p-2 hover:bg-red-500/20 rounded-lg text-red-400 shrink-0" title="Bu Alanı Sil"
                        onclick="deleteAchievementCategory('${cat.id}')"><i class="fa-solid fa-trash-can"></i></button>
                </div>

                <!-- KAYIT EKLEME (URL veya Bilgisayardan Manuel Yükleme) -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="form-group col-span-2">
                        <label class="text-xs text-slate-400 block mb-1">Kayıt Başlığı (Sınıf / Öğrenci / vb.)</label>
                        <input type="text" id="ach-record-title-${cat.id}" placeholder="Örn: 3/C Sınıfı" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs">
                    </div>
                    <div class="form-group">
                        <label class="text-xs text-slate-400 block mb-1">Görsel Adresi (URL)</label>
                        <input type="text" id="ach-record-url-${cat.id}" placeholder="https://..." class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                            oninput="clearAchievementPendingFile('${cat.id}'); updateAchRecordPreview('${cat.id}');">
                    </div>
                    <div class="form-group">
                        <label class="text-xs text-slate-400 block mb-1">veya Bilgisayardan Yükle</label>
                        <div class="flex items-center gap-2">
                            <button type="button" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1.5 whitespace-nowrap"
                                onclick="document.getElementById('ach-record-file-${cat.id}').click()">
                                <i class="fa-solid fa-upload"></i> Dosya Seç
                            </button>
                            <input type="file" accept="image/*" id="ach-record-file-${cat.id}" class="hidden" onchange="handleAchievementFileSelect('${cat.id}', this)">
                            <img id="ach-record-preview-${cat.id}" class="hidden w-9 h-9 rounded-lg object-cover border border-slate-700" alt="Önizleme">
                        </div>
                    </div>
                    <div class="col-span-2 flex justify-end gap-2">
                        <button class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs ${isEditingThis ? '' : 'hidden'}"
                            id="ach-cancel-btn-${cat.id}" onclick="cancelEditAchievementRecord('${cat.id}')">Vazgeç</button>
                        <button id="ach-submit-btn-${cat.id}" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-xs"
                            onclick="addOrUpdateAchievementRecord('${cat.id}')">${isEditingThis ? 'Kaydı Güncelle' : 'Listeye Ekle'}</button>
                    </div>
                </div>

                <div class="border-t border-slate-850 pt-3">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kayıt Listesi</h4>
                        <span class="text-[10px] text-slate-500" id="ach-count-label-${cat.id}">0 kayıt</span>
                    </div>
                    <div class="border border-slate-850 rounded-lg max-h-56 overflow-y-auto" id="ach-list-wrapper-${cat.id}"></div>
                </div>

                <!-- BU ALANA ÖZEL METİN & GÖRSEL BİÇİMLENDİRME -->
                <div class="border-t border-slate-800 pt-3 space-y-3">
                    <h4 class="text-cyan-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-sliders"></i> Metin & Görsel Biçimlendirme</h4>
                    <div class="grid grid-cols-3 gap-3">
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Yazı Tipi</label>
                            <select class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                                onchange="updateAchievementCategoryStyleField('${cat.id}', 'font', this.value)">${fontOptionsHtml}</select>
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Yazı Boyutu (px)</label>
                            <input type="number" min="6" max="48" value="${st.size || 14}" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs font-mono"
                                oninput="updateAchievementCategoryStyleField('${cat.id}', 'size', this.value)">
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Yazı Rengi</label>
                            <input type="color" value="${st.color || '#ffffff'}" class="w-full h-9 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                                oninput="updateAchievementCategoryStyleField('${cat.id}', 'color', this.value)">
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-3">
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Metin Hizalama</label>
                            <select class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                                onchange="updateAchievementCategoryStyleField('${cat.id}', 'textAlign', this.value)">
                                <option value="left" ${(st.textAlign || 'left') === 'left' ? 'selected' : ''}>Sola</option>
                                <option value="center" ${st.textAlign === 'center' ? 'selected' : ''}>Ortaya</option>
                                <option value="right" ${st.textAlign === 'right' ? 'selected' : ''}>Sağa</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Hücre İçi Yatay Hizalama</label>
                            <select class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                                onchange="updateAchievementCategoryStyleField('${cat.id}', 'justify', this.value)">
                                <option value="flex-start" ${st.justify === 'flex-start' ? 'selected' : ''}>Sola/Üste</option>
                                <option value="center" ${(st.justify || 'center') === 'center' ? 'selected' : ''}>Ortaya</option>
                                <option value="flex-end" ${st.justify === 'flex-end' ? 'selected' : ''}>Sağa/Alta</option>
                                <option value="space-between" ${st.justify === 'space-between' ? 'selected' : ''}>Aralıklı</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Görsel Konumu</label>
                            <select class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                                onchange="updateAchievementCategoryStyleField('${cat.id}', 'imgPosition', this.value)">
                                <option value="left" ${(st.imgPosition || 'left') === 'left' ? 'selected' : ''}>Sol</option>
                                <option value="right" ${st.imgPosition === 'right' ? 'selected' : ''}>Sağ</option>
                                <option value="top" ${st.imgPosition === 'top' ? 'selected' : ''}>Üst</option>
                                <option value="bottom" ${st.imgPosition === 'bottom' ? 'selected' : ''}>Alt</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-4 gap-3">
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Görsel Boyutu (px)</label>
                            <input type="number" min="20" max="160" value="${st.imgSize || 44}" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs font-mono"
                                oninput="updateAchievementCategoryStyleField('${cat.id}', 'imgSize', this.value)">
                            <p class="text-[9px] text-slate-500 mt-0.5">Dikdörtgen şekillerde kısa kenarı belirler.</p>
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Çerçeve Şekli</label>
                            <select class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                                onchange="updateAchievementCategoryStyleField('${cat.id}', 'imgShape', this.value)">
                                <option value="rounded" ${(st.imgShape || 'rounded') === 'rounded' ? 'selected' : ''}>Yuvarlak Köşe (Kare)</option>
                                <option value="circle" ${st.imgShape === 'circle' ? 'selected' : ''}>Daire</option>
                                <option value="square" ${st.imgShape === 'square' ? 'selected' : ''}>Kare (Keskin Köşe)</option>
                                <option value="squircle" ${st.imgShape === 'squircle' ? 'selected' : ''}>Yumuşak Kare</option>
                                <option value="rect_landscape" ${st.imgShape === 'rect_landscape' ? 'selected' : ''}>Dikdörtgen (Yatay 3:2)</option>
                                <option value="rect_portrait" ${st.imgShape === 'rect_portrait' ? 'selected' : ''}>Dikdörtgen (Dikey 2:3)</option>
                                <option value="rect_photo" ${st.imgShape === 'rect_photo' ? 'selected' : ''}>Fotoğraf (Yatay 4:3)</option>
                                <option value="rect_wide" ${st.imgShape === 'rect_wide' ? 'selected' : ''}>Geniş Banner (16:9)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Kenarlık Kalınlığı / Stili</label>
                            <div class="flex gap-1">
                                <input type="number" min="0" max="10" step="0.5" value="${st.imgBorderWidth ?? 1.5}" class="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs font-mono"
                                    oninput="updateAchievementCategoryStyleField('${cat.id}', 'imgBorderWidth', this.value)">
                                <select class="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                                    onchange="updateAchievementCategoryStyleField('${cat.id}', 'imgBorderStyle', this.value)">
                                    <option value="solid" ${(st.imgBorderStyle || 'solid') === 'solid' ? 'selected' : ''}>Düz</option>
                                    <option value="dashed" ${st.imgBorderStyle === 'dashed' ? 'selected' : ''}>Kesikli</option>
                                    <option value="dotted" ${st.imgBorderStyle === 'dotted' ? 'selected' : ''}>Noktalı</option>
                                    <option value="double" ${st.imgBorderStyle === 'double' ? 'selected' : ''}>Çift</option>
                                    <option value="none" ${st.imgBorderStyle === 'none' ? 'selected' : ''}>Yok</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Kenarlık Rengi</label>
                            <input type="color" value="${st.imgBorderColor || '#00b4d8'}" class="w-full h-9 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                                oninput="updateAchievementCategoryStyleField('${cat.id}', 'imgBorderColor', this.value)">
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Saydamlık: <span id="ach-img-opacity-val-${cat.id}">${st.imgOpacity ?? 100}</span>%</label>
                            <input type="range" min="20" max="100" value="${st.imgOpacity ?? 100}" class="w-full accent-cyan-500"
                                oninput="document.getElementById('ach-img-opacity-val-${cat.id}').innerText=this.value; updateAchievementCategoryStyleField('${cat.id}', 'imgOpacity', this.value)">
                        </div>
                    </div>

                    <!-- DİKKAT ÇEKME EFEKTLERİ: hücrenin tamamına veya sadece görsele uygulanan animasyonlu vurgular -->
                    <div class="grid grid-cols-4 gap-3">
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Hücre Efekti</label>
                            <select class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                                onchange="updateAchievementCategoryStyleField('${cat.id}', 'cellEffect', this.value)">
                                <option value="none" ${(st.cellEffect || 'none') === 'none' ? 'selected' : ''}>Yok</option>
                                <option value="glow" ${st.cellEffect === 'glow' ? 'selected' : ''}>Sabit Parıltı (Glow)</option>
                                <option value="pulse" ${st.cellEffect === 'pulse' ? 'selected' : ''}>Nabız Gibi Parıltı</option>
                                <option value="border" ${st.cellEffect === 'border' ? 'selected' : ''}>Yanıp Sönen Çerçeve</option>
                                <option value="shine" ${st.cellEffect === 'shine' ? 'selected' : ''}>Kayan Işık (Shine)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Hücre Efekti Rengi</label>
                            <input type="color" value="${st.cellEffectColor || '#00b4d8'}" class="w-full h-9 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                                oninput="updateAchievementCategoryStyleField('${cat.id}', 'cellEffectColor', this.value)">
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Görsel Efekti</label>
                            <select class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                                onchange="updateAchievementCategoryStyleField('${cat.id}', 'imgEffect', this.value)">
                                <option value="none" ${(st.imgEffect || 'none') === 'none' ? 'selected' : ''}>Yok</option>
                                <option value="glow" ${st.imgEffect === 'glow' ? 'selected' : ''}>Sabit Parıltı (Glow)</option>
                                <option value="pulse" ${st.imgEffect === 'pulse' ? 'selected' : ''}>Nabız Gibi Parıltı</option>
                                <option value="border" ${st.imgEffect === 'border' ? 'selected' : ''}>Yanıp Sönen Halka</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="text-xs text-slate-400 block mb-1">Görsel Efekti Rengi</label>
                            <input type="color" value="${st.imgEffectColor || '#00b4d8'}" class="w-full h-9 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                                oninput="updateAchievementCategoryStyleField('${cat.id}', 'imgEffectColor', this.value)">
                        </div>
                    </div>
                    <p class="text-[10px] text-slate-500"><i class="fa-solid fa-circle-info"></i> Efektler panoda dikkat çekmesi istenen alanlar (ör. Ayın Örnek Öğrencisi) için önerilir; çok fazla alanda birden aktif edilirse pano dağınık görünebilir.</p>
                </div>
            `;
        }

        function renderAdminAchievementRecordList(catId) {
            const cat = tempAchievementCategories.find(c => c.id === catId);
            const wrapper = document.getElementById('ach-list-wrapper-' + catId);
            const countLabel = document.getElementById('ach-count-label-' + catId);
            if (!cat || !wrapper) return;
            wrapper.innerHTML = "";
            countLabel.innerText = `${cat.list.length} kayıt`;
            cat.list.forEach((rec, index) => {
                const row = document.createElement('div');
                row.className = 'flex items-center justify-between p-2 border-b border-slate-800/50 text-xs gap-2';
                row.innerHTML = `
                    <div class="flex items-center gap-2 min-w-0">
                        <img src="${rec.img || 'https://placehold.co/40x40/070b13/fff?text=%3F'}" class="w-8 h-8 rounded object-cover border border-slate-700 shrink-0">
                        <span class="text-slate-300 truncate">${index + 1}. ${escapeHtml(rec.title || '(başlıksız)')}</span>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                        <button class="px-2 py-1 rounded-full text-[10px] font-bold ${rec.active === false ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/20 text-emerald-400'}" onclick="toggleAchievementRecordActive('${catId}', ${index})">${rec.active === false ? 'Pasif' : 'Aktif'}</button>
                        <button class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onclick="moveAchievementRecord('${catId}', ${index}, -1)"><i class="fa-solid fa-arrow-up"></i></button>
                        <button class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onclick="moveAchievementRecord('${catId}', ${index}, 1)"><i class="fa-solid fa-arrow-down"></i></button>
                        <button class="p-1 hover:bg-cyan-500/20 rounded text-cyan-400" onclick="editAchievementRecord('${catId}', ${index})"><i class="fa-solid fa-pen"></i></button>
                        <button class="p-1 hover:bg-red-500/20 rounded text-red-400" onclick="deleteAchievementRecord('${catId}', ${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                wrapper.appendChild(row);
            });
        }

        function addOrUpdateAchievementRecord(catId) {
            const cat = tempAchievementCategories.find(c => c.id === catId);
            if (!cat) return;
            const titleInput = document.getElementById('ach-record-title-' + catId);
            const urlInput = document.getElementById('ach-record-url-' + catId);
            const title = titleInput.value.trim();
            const img = achievementPendingFile[catId] || urlInput.value.trim();

            if (!title) {
                showCustomNotification("Eksik Bilgi", "Lütfen bir başlık girin.");
                return;
            }

            if (achievementEditing.catId === catId && achievementEditing.index !== -1) {
                cat.list[achievementEditing.index].title = title;
                cat.list[achievementEditing.index].img = img;
                writeCMSLog(`Ayın Enleri kaydı güncellendi: ${title}`);
                cancelEditAchievementRecord(catId);
            } else {
                cat.list.push({ title, img, active: true });
                writeCMSLog(`Ayın Enleri: yeni kayıt eklendi (${cat.title}): ${title}`);
                titleInput.value = "";
                urlInput.value = "";
                clearAchievementPendingFile(catId);
            }
            renderAdminAchievementRecordList(catId);
        }

        function editAchievementRecord(catId, index) {
            const cat = tempAchievementCategories.find(c => c.id === catId);
            if (!cat) return;
            achievementEditing = { catId, index };
            const rec = cat.list[index];
            document.getElementById('ach-record-title-' + catId).value = rec.title || "";
            document.getElementById('ach-record-url-' + catId).value = (rec.img && !rec.img.startsWith('data:')) ? rec.img : "";
            if (rec.img && rec.img.startsWith('data:')) {
                achievementPendingFile[catId] = rec.img;
            } else {
                delete achievementPendingFile[catId];
            }
            updateAchRecordPreview(catId);
            const submitBtn = document.getElementById('ach-submit-btn-' + catId);
            if (submitBtn) submitBtn.innerText = "Kaydı Güncelle";
            const cancelBtn = document.getElementById('ach-cancel-btn-' + catId);
            if (cancelBtn) cancelBtn.classList.remove('hidden');
        }

        function cancelEditAchievementRecord(catId) {
            achievementEditing = { catId: null, index: -1 };
            const titleInput = document.getElementById('ach-record-title-' + catId);
            const urlInput = document.getElementById('ach-record-url-' + catId);
            if (titleInput) titleInput.value = "";
            if (urlInput) urlInput.value = "";
            clearAchievementPendingFile(catId);
            const submitBtn = document.getElementById('ach-submit-btn-' + catId);
            if (submitBtn) submitBtn.innerText = "Listeye Ekle";
            const cancelBtn = document.getElementById('ach-cancel-btn-' + catId);
            if (cancelBtn) cancelBtn.classList.add('hidden');
        }

        function deleteAchievementRecord(catId, index) {
            const cat = tempAchievementCategories.find(c => c.id === catId);
            if (!cat) return;
            cat.list.splice(index, 1);
            if (achievementEditing.catId === catId && achievementEditing.index === index) cancelEditAchievementRecord(catId);
            renderAdminAchievementRecordList(catId);
        }

        function moveAchievementRecord(catId, index, direction) {
            const cat = tempAchievementCategories.find(c => c.id === catId);
            if (!cat) return;
            const targetIndex = index + direction;
            if (targetIndex >= 0 && targetIndex < cat.list.length) {
                const temp = cat.list[index];
                cat.list[index] = cat.list[targetIndex];
                cat.list[targetIndex] = temp;
                renderAdminAchievementRecordList(catId);
            }
        }

        function toggleAchievementRecordActive(catId, index) {
            const cat = tempAchievementCategories.find(c => c.id === catId);
            if (!cat) return;
            cat.list[index].active = cat.list[index].active === false ? true : false;
            renderAdminAchievementRecordList(catId);
        }

        function buildAdminClassSelector() {
            const container = document.getElementById('schedule-class-badge-container');
            container.innerHTML = "";
            classList.forEach(className => {
                const btn = document.createElement('button');
                btn.className = `px-3 py-1.5 rounded-lg text-xs font-bold transition border border-slate-800 ${className === activeAdminEditClass ? 'bg-yellow-500 text-black' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`;
                btn.innerText = className;
                btn.onclick = function() {
                    saveWeeklyScheduleMatrix();
                    activeAdminEditClass = className;
                    buildAdminClassSelector();
                    buildWeeklyScheduleMatrix();
                };
                container.appendChild(btn);
            });
        }

        /* HAFTALIK TOPLU DERS PROGRAMI MATRİSİ */
        function buildWeeklyScheduleMatrix() {
            const thead = document.getElementById('weekly-schedule-matrix-head');
            const tbody = document.getElementById('weekly-schedule-matrix-body');
            const title = document.getElementById('schedule-matrix-title');
            
            title.innerText = `${activeAdminEditClass} Sınıfı Haftalık Ders Programı Matrisi`;

            // Başlık satırını (Gün + N. Ders sütunları) mevcut ders saati (bellHours) sayısına göre dinamik üret
            if (thead) {
                thead.innerHTML = `
                    <tr class="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <th class="p-2">Gün</th>
                        ${bellHours.map(bell => `
                            <th class="p-2 text-center whitespace-nowrap">
                                ${bell.id}. Ders
                                <button type="button" class="ml-1 text-red-400/70 hover:text-red-400" title="Bu ders saatini sil" onclick="removeLessonPeriod(${bell.id})"><i class="fa-solid fa-trash-can"></i></button>
                            </th>
                        `).join('')}
                    </tr>`;
            }

            tbody.innerHTML = "";

            const classWeek = appConfig.weeklyClassSchedules[activeAdminEditClass] || {};

            daysOfWeek.forEach((day) => {
                const schedule = classWeek[day] || Array(bellHours.length).fill("");
                const tr = document.createElement('tr');
                tr.className = "border-b border-slate-800/60 hover:bg-slate-900/50";
                
                let inputsHtml = `<td class="p-2 font-bold text-cyan-400">${day}</td>`;
                for (let i = 1; i <= bellHours.length; i++) {
                    inputsHtml += `
                        <td class="p-1">
                            <input type="text" id="matrix-${day}-${i}" value="${schedule[i-1] || ''}" 
                            class="w-full bg-slate-900 border border-slate-800 rounded p-1 text-center text-xs text-white focus:border-cyan-500 outline-none">
                        </td>
                    `;
                }
                tr.innerHTML = inputsHtml;
                tbody.appendChild(tr);
            });
        }

        function saveWeeklyScheduleMatrix() {
            if (!appConfig.weeklyClassSchedules[activeAdminEditClass]) {
                appConfig.weeklyClassSchedules[activeAdminEditClass] = {};
            }

            daysOfWeek.forEach((day) => {
                const lessons = [];
                for (let i = 1; i <= bellHours.length; i++) {
                    const input = document.getElementById(`matrix-${day}-${i}`);
                    if (input) lessons.push(input.value.trim());
                }
                if (lessons.length > 0) appConfig.weeklyClassSchedules[activeAdminEditClass][day] = lessons;
            });
        }

        /* HAFTALIK / AYLIK NÖBET TABLOSU (eski haftalık — geriye dönük uyumluluk için korundu) */
        function buildWeeklyDutiesTable() {
            const tbody = document.getElementById('weekly-duties-table-body');
            if (!tbody) return; // Artık DOM'da yok, güvenli çık

            daysOfWeek.forEach((day) => {
                const duties = appConfig.weeklyDuties[day] || { admin: "", canteen: "", garden: "", floor1: "", floor2: "" };
                const tr = document.createElement('tr');
                tr.className = "border-b border-slate-800/60 hover:bg-slate-900/50";
                
                tr.innerHTML = `
                    <td class="p-2 font-bold text-yellow-400">${day}</td>
                    <td class="p-1"><input type="text" id="duty-${day}-admin" value="${duties.admin || ''}" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"></td>
                    <td class="p-1"><input type="text" id="duty-${day}-canteen" value="${duties.canteen || ''}" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"></td>
                    <td class="p-1"><input type="text" id="duty-${day}-garden" value="${duties.garden || ''}" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"></td>
                    <td class="p-1"><input type="text" id="duty-${day}-floor1" value="${duties.floor1 || ''}" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"></td>
                    <td class="p-1"><input type="text" id="duty-${day}-floor2" value="${duties.floor2 || ''}" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"></td>
                `;
                tbody.appendChild(tr);
            });
        }

        function saveWeeklyDutiesTable() {
            daysOfWeek.forEach((day) => {
                appConfig.weeklyDuties[day] = {
                    admin: document.getElementById(`duty-${day}-admin`) ? document.getElementById(`duty-${day}-admin`).value.trim() : "",
                    canteen: document.getElementById(`duty-${day}-canteen`) ? document.getElementById(`duty-${day}-canteen`).value.trim() : "",
                    garden: document.getElementById(`duty-${day}-garden`) ? document.getElementById(`duty-${day}-garden`).value.trim() : "",
                    floor1: document.getElementById(`duty-${day}-floor1`) ? document.getElementById(`duty-${day}-floor1`).value.trim() : "",
                    floor2: document.getElementById(`duty-${day}-floor2`) ? document.getElementById(`duty-${day}-floor2`).value.trim() : ""
                };
            });
        }

        // Kaydedilmiş (veya varsayılan) Günlük Zil Saatleri görünüm ayarlarını döndürür
        function getBellHoursSettings() {
            return appConfig.bellHoursSettings || defaultAppConfig.bellHoursSettings;
        }

        // Günlük Zil Saatleri kartındaki tabloyu (ders satırları + aralarındaki teneffüs ayırıcı satırları) çizer.
        // Teneffüs satırları hangi dersler arasında olduğunu net gösterir; aktif teneffüs/ders durumu
        // calculateCountdownAndTableHighlight() tarafından her saniye güncellenir.
        function renderBellHoursTable() {
            const zilTableBody = document.getElementById('lesson-hours-table-body');
            if (!zilTableBody) return;
            const bhs = getBellHoursSettings();
            zilTableBody.innerHTML = '';

            bellHours.forEach((bell, idx) => {
                const tr = document.createElement('tr');
                tr.setAttribute('id', `bell-row-${bell.id}`);
                tr.innerHTML = `<td>${bell.id}. Ders</td><td>${bell.start}</td><td>${bell.end}</td>`;
                zilTableBody.appendChild(tr);

                // Son ders hariç, her ders saatinden sonra bir teneffüs ayırıcı satırı ekle
                if (idx < bellHours.length - 1) {
                    const next = bellHours[idx + 1];
                    const recessTr = document.createElement('tr');
                    recessTr.setAttribute('id', `recess-row-${bell.id}`);

                    // Teneffüs satırı biçimi: düz çizgi / noktalı çizgi / sembol / saat aralığı
                    // (Eski sürümlerden kalan 'full' veya 'minimal' değerleri 'time' / 'line' olarak eşlenir)
                    let mode = bhs.recessLabelMode;
                    if (mode === 'full') mode = 'time';
                    if (mode === 'minimal') mode = 'line';
                    if (!['line', 'dotted', 'icon', 'time'].includes(mode)) mode = 'line';

                    let iconHtml = '';
                    let labelTextHtml = '';
                    if (mode === 'time') {
                        iconHtml = '<i class="fa-solid fa-mug-hot"></i>';
                        labelTextHtml = `<span class="recess-label-text">${bell.end} - ${next.start} arası Teneffüs</span>`;
                    } else if (mode === 'icon') {
                        iconHtml = '<i class="fa-solid fa-mug-hot"></i>';
                    }
                    // 'line' ve 'dotted' modlarında ne ikon ne metin var; sadece ayırıcı çizgi + (aktifken) rozet metni

                    recessTr.className = 'recess-row recess-style-' + mode;
                    recessTr.innerHTML = `
                        <td colspan="3">
                            <div class="recess-label">
                                ${iconHtml}
                                ${labelTextHtml}
                                <span class="recess-badge" id="recess-badge-${bell.id}"></span>
                            </div>
                        </td>`;
                    if (bhs.recessDisplayMode === 'activeOnly') recessTr.style.display = 'none';
                    zilTableBody.appendChild(recessTr);
                }
            });

            const table = zilTableBody.closest('table');
            if (table) {
                table.style.setProperty('--bell-row-gap', (bhs.rowGap ?? 4) + 'px');
                table.style.setProperty('--bell-col-gap', (bhs.colGap ?? 4) + 'px');
                table.style.setProperty('--bell-active-row-gap', (bhs.activeRowGap ?? 6) + 'px');
                table.style.setProperty('--bell-active-font-size', (bhs.activeRowFontSize ?? 11) + 'px');
                table.style.setProperty('--bell-recess-row-gap', (bhs.recessRowGap ?? 3) + 'px');
                table.style.setProperty('--bell-recess-font-size', (bhs.recessRowFontSize ?? 9) + 'px');
                table.style.setProperty('--bell-active-recess-row-gap', (bhs.activeRecessRowGap ?? 3) + 'px');
                table.style.setProperty('--bell-active-recess-font-size', (bhs.activeRecessRowFontSize ?? 10.5) + 'px');
                table.style.setProperty('--bell-header-bg', bhs.headerBgColor || '#111b2d');
                table.style.setProperty('--bell-header-color', bhs.headerTextColor || '#94a3b8');
                table.style.setProperty('--bell-header-weight', bhs.headerBold === false ? '500' : '700');
                table.style.setProperty('--bell-header-fs', (bhs.headerFontSize || 11) + 'px');
            }
        }

        // Yönetim panelindeki Zil Saatleri Görünüm Ayarları formunu mevcut appConfig değerleriyle doldurur
        function loadBellHoursDisplaySettingsIntoForm() {
            const bhs = { ...defaultAppConfig.bellHoursSettings, ...getBellHoursSettings() };
            const rowGapEl = document.getElementById('bhs-row-gap');
            const colGapEl = document.getElementById('bhs-col-gap');
            if (!rowGapEl || !colGapEl) return; // Form henüz DOM'da değilse sessizce çık
            rowGapEl.value = bhs.rowGap;
            document.getElementById('bhs-row-gap-val').innerText = bhs.rowGap + 'px';
            colGapEl.value = bhs.colGap;
            document.getElementById('bhs-col-gap-val').innerText = bhs.colGap + 'px';
            document.getElementById('bhs-recess-mode').value = bhs.recessDisplayMode;
            let labelMode = bhs.recessLabelMode || 'line';
            if (labelMode === 'full') labelMode = 'time';
            if (labelMode === 'minimal') labelMode = 'line';
            document.getElementById('bhs-recess-label-mode').value = labelMode;
            document.getElementById('bhs-recess-text-mode').value = bhs.recessTextMode;
            document.getElementById('bhs-recess-custom-text').value = bhs.recessCustomText || '';
            document.getElementById('bhs-recess-custom-text-wrap').classList.toggle('hidden', bhs.recessTextMode !== 'custom');
            document.getElementById('bhs-active-color').value = bhs.activeRowColor || '#ffb703';
            document.getElementById('bhs-active-effect').value = bhs.activeRowEffect;
            document.getElementById('bhs-active-gap').value = bhs.activeRowGap ?? 6;
            document.getElementById('bhs-active-gap-val').innerText = (bhs.activeRowGap ?? 6) + 'px';
            document.getElementById('bhs-active-fs').value = bhs.activeRowFontSize ?? 11;
            document.getElementById('bhs-active-fs-val').innerText = (bhs.activeRowFontSize ?? 11) + 'px';
            document.getElementById('bhs-recess-gap').value = bhs.recessRowGap ?? 3;
            document.getElementById('bhs-recess-gap-val').innerText = (bhs.recessRowGap ?? 3) + 'px';
            document.getElementById('bhs-recess-fs').value = bhs.recessRowFontSize ?? 9;
            document.getElementById('bhs-recess-fs-val').innerText = (bhs.recessRowFontSize ?? 9) + 'px';
            document.getElementById('bhs-active-recess-gap').value = bhs.activeRecessRowGap ?? 3;
            document.getElementById('bhs-active-recess-gap-val').innerText = (bhs.activeRecessRowGap ?? 3) + 'px';
            document.getElementById('bhs-active-recess-fs').value = bhs.activeRecessRowFontSize ?? 10.5;
            document.getElementById('bhs-active-recess-fs-val').innerText = (bhs.activeRecessRowFontSize ?? 10.5) + 'px';
            document.getElementById('bhs-active-recess-color').value = bhs.activeRecessColor || '#22c55e';
            document.getElementById('bhs-active-recess-effect').value = bhs.activeRecessEffect || 'pulse';
            document.getElementById('bhs-header-bg').value = bhs.headerBgColor || '#111b2d';
            document.getElementById('bhs-header-color').value = bhs.headerTextColor || '#94a3b8';
            document.getElementById('bhs-header-bold').checked = bhs.headerBold !== false;
            document.getElementById('bhs-header-fs').value = bhs.headerFontSize || 11;
            document.getElementById('bhs-header-fs-val').innerText = (bhs.headerFontSize || 11) + 'px';
            updateBellHoursPreview(bhs);
        }

        // Yönetim panelindeki "Canlı Önizleme" örnek satırını (gerçek saatten bağımsız olarak)
        // seçilen renk / efekt / boy ayarlarıyla anında günceller. Böylece kullanıcı, o an ders/teneffüs
        // saatinde olmasa bile Vurgu Rengi ve Vurgu Efekti değişikliklerini hemen görebilir.
        function updateBellHoursPreview(bhs) {
            const table = document.getElementById('bhs-preview-table');
            const activeRow = document.getElementById('bhs-preview-row');
            if (!table || !activeRow) return;

            table.style.setProperty('--bell-row-gap', (bhs.rowGap ?? 4) + 'px');
            table.style.setProperty('--bell-col-gap', (bhs.colGap ?? 4) + 'px');
            table.style.setProperty('--bell-active-row-gap', (bhs.activeRowGap ?? 6) + 'px');
            table.style.setProperty('--bell-active-font-size', (bhs.activeRowFontSize ?? 11) + 'px');
            table.style.setProperty('--bell-recess-row-gap', (bhs.recessRowGap ?? 3) + 'px');
            table.style.setProperty('--bell-recess-font-size', (bhs.recessRowFontSize ?? 9) + 'px');
            table.style.setProperty('--bell-active-recess-row-gap', (bhs.activeRecessRowGap ?? 3) + 'px');
            table.style.setProperty('--bell-active-recess-font-size', (bhs.activeRecessRowFontSize ?? 10.5) + 'px');

            const color = bhs.activeRowColor || '#ffb703';
            activeRow.classList.remove('effect-glow', 'effect-pulse', 'effect-border', 'effect-solid');
            activeRow.style.setProperty('--bell-active-color', color);
            activeRow.style.setProperty('--bell-active-bg', hexToRgba(color, 0.16));
            if (bhs.activeRowEffect && bhs.activeRowEffect !== 'none') {
                activeRow.classList.add('effect-' + bhs.activeRowEffect);
                if (bhs.activeRowEffect === 'solid') {
                    activeRow.style.setProperty('--bell-active-text-solid', getContrastTextColor(color));
                }
            }

            // Aktif teneffüs önizleme satırları (biri ders paneli içindeki bağlamsal örnek, diğeri kendi paneli) — ikisi de aynı ayarları yansıtır
            const recessColor = bhs.activeRecessColor || '#22c55e';
            const recessEffect = bhs.activeRecessEffect || 'pulse';
            [document.getElementById('bhs-preview-recess'), document.getElementById('bhs-preview-recess-2')].forEach(recessRow => {
                if (!recessRow) return;
                const recessTable = recessRow.closest('table');
                if (recessTable) {
                    recessTable.style.setProperty('--bell-recess-row-gap', (bhs.recessRowGap ?? 3) + 'px');
                    recessTable.style.setProperty('--bell-recess-font-size', (bhs.recessRowFontSize ?? 9) + 'px');
                    recessTable.style.setProperty('--bell-active-recess-row-gap', (bhs.activeRecessRowGap ?? 3) + 'px');
                    recessTable.style.setProperty('--bell-active-recess-font-size', (bhs.activeRecessRowFontSize ?? 10.5) + 'px');
                }
                recessRow.classList.remove('effect-glow', 'effect-pulse', 'effect-border', 'effect-solid');
                recessRow.style.setProperty('--bell-active-recess-color', recessColor);
                recessRow.style.setProperty('--bell-active-recess-bg', hexToRgba(recessColor, 0.14));
                if (recessEffect !== 'none') {
                    recessRow.classList.add('effect-' + recessEffect);
                    if (recessEffect === 'solid') {
                        recessRow.style.setProperty('--bell-active-recess-text-solid', getContrastTextColor(recessColor));
                    }
                }
            });
        }

        // Formdaki herhangi bir Zil Saatleri görünüm ayarı değiştiğinde çağrılır:
        // appConfig'i günceller, panoyu ANINDA yeniden çizer ve localStorage'a KALICI olarak kaydeder.
        function bellHoursDisplaySettingsUpdate() {
            const rowGap = parseInt(document.getElementById('bhs-row-gap').value, 10);
            const colGap = parseInt(document.getElementById('bhs-col-gap').value, 10);
            const recessDisplayMode = document.getElementById('bhs-recess-mode').value;
            const recessLabelMode = document.getElementById('bhs-recess-label-mode').value;
            const recessTextMode = document.getElementById('bhs-recess-text-mode').value;
            const recessCustomText = document.getElementById('bhs-recess-custom-text').value;
            const activeRowColor = document.getElementById('bhs-active-color').value || '#ffb703';
            const activeRowEffect = document.getElementById('bhs-active-effect').value;
            const activeRowGap = parseInt(document.getElementById('bhs-active-gap').value, 10);
            const activeRowFontSize = parseInt(document.getElementById('bhs-active-fs').value, 10);
            const recessRowGap = parseInt(document.getElementById('bhs-recess-gap').value, 10);
            const recessRowFontSize = parseInt(document.getElementById('bhs-recess-fs').value, 10);
            const activeRecessRowGap = parseInt(document.getElementById('bhs-active-recess-gap').value, 10);
            const activeRecessRowFontSize = parseFloat(document.getElementById('bhs-active-recess-fs').value);
            const activeRecessColor = document.getElementById('bhs-active-recess-color').value || '#22c55e';
            const activeRecessEffect = document.getElementById('bhs-active-recess-effect').value;
            const headerBgColor = document.getElementById('bhs-header-bg').value || '#111b2d';
            const headerTextColor = document.getElementById('bhs-header-color').value || '#94a3b8';
            const headerBold = document.getElementById('bhs-header-bold').checked;
            const headerFontSize = parseInt(document.getElementById('bhs-header-fs').value, 10) || 11;

            document.getElementById('bhs-row-gap-val').innerText = rowGap + 'px';
            document.getElementById('bhs-col-gap-val').innerText = colGap + 'px';
            document.getElementById('bhs-active-gap-val').innerText = activeRowGap + 'px';
            document.getElementById('bhs-active-fs-val').innerText = activeRowFontSize + 'px';
            document.getElementById('bhs-recess-gap-val').innerText = recessRowGap + 'px';
            document.getElementById('bhs-recess-fs-val').innerText = recessRowFontSize + 'px';
            document.getElementById('bhs-active-recess-gap-val').innerText = activeRecessRowGap + 'px';
            document.getElementById('bhs-active-recess-fs-val').innerText = activeRecessRowFontSize + 'px';
            document.getElementById('bhs-header-fs-val').innerText = headerFontSize + 'px';
            document.getElementById('bhs-recess-custom-text-wrap').classList.toggle('hidden', recessTextMode !== 'custom');

            appConfig.bellHoursSettings = {
                rowGap, colGap, recessDisplayMode, recessLabelMode, recessTextMode, recessCustomText,
                activeRowColor, activeRowEffect, activeRowGap, activeRowFontSize,
                recessRowGap, recessRowFontSize, activeRecessRowGap, activeRecessRowFontSize,
                activeRecessColor, activeRecessEffect,
                headerBgColor, headerTextColor, headerBold, headerFontSize
            };

            updateBellHoursPreview(appConfig.bellHoursSettings);
            renderBellHoursTable();
            calculateCountdownAndTableHighlight(new Date());
            panoPersist(); // Anında kalıcı kayıt
        }

        // Zil Saatleri görünüm ayarlarını fabrika varsayılanına döndürür
        function resetBellHoursDisplaySettings() {
            appConfig.bellHoursSettings = { ...defaultAppConfig.bellHoursSettings };
            loadBellHoursDisplaySettingsIntoForm();
            renderBellHoursTable();
            calculateCountdownAndTableHighlight(new Date());
            panoPersist();
            writeCMSLog('Zil Saatleri görünüm ayarları varsayılana sıfırlandı.');
        }

        function buildAdminBellHoursInputs() {
            const container = document.getElementById('admin-bell-hours-inputs');
            container.innerHTML = '';
            bellHours.forEach(bell => {
                const div = document.createElement('div');
                div.className = 'bg-slate-950 border border-slate-850 p-3 rounded-xl flex flex-col justify-between';
                div.innerHTML = `
                    <div class="flex items-center justify-between mb-1.5">
                        <h4 class="text-xs font-bold text-yellow-500">${bell.id}. Ders Zili</h4>
                        <button type="button" class="bell-remove-btn text-red-400 hover:text-red-300 text-[10px] px-1.5 py-0.5 rounded hover:bg-red-500/10" title="Bu ders saatini sil" ${bellHours.length <= 1 ? 'disabled style="opacity:.25;cursor:not-allowed;"' : ''}><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="text-[10px] text-slate-500 block">Başlangıç</label>
                            <input type="text" id="bell-start-${bell.id}" value="${bell.start}" class="w-full bg-slate-900 border border-slate-800 rounded p-1 text-center font-mono text-xs text-white">
                        </div>
                        <div>
                            <label class="text-[10px] text-slate-500 block">Bitiş</label>
                            <input type="text" id="bell-end-${bell.id}" value="${bell.end}" class="w-full bg-slate-900 border border-slate-800 rounded p-1 text-center font-mono text-xs text-white">
                        </div>
                    </div>
                `;
                container.appendChild(div);
                div.querySelector('.bell-remove-btn').addEventListener('click', () => removeLessonPeriod(bell.id));
            });
        }

        // Zil saati giriş/çıkış inputlarındaki güncel değerleri bellHours dizisine yazar
        // (yeniden çizim/ekleme/silme öncesi kullanıcının henüz kaydetmediği değerleri kaybetmemek için).
        function saveBellHoursFromInputs() {
            bellHours.forEach(bell => {
                const s = document.getElementById(`bell-start-${bell.id}`);
                const e = document.getElementById(`bell-end-${bell.id}`);
                if (s && e) { bell.start = s.value.trim(); bell.end = e.value.trim(); }
            });
        }

        // "SS:DD" formatındaki bir saate dakika ekler (24 saat içinde döner)
        function addMinutesToTimeStr(timeStr, minutes) {
            const parts = (timeStr || '08:00').split(':').map(Number);
            const h = parts[0] || 0, m = parts[1] || 0;
            let total = (h * 60 + m + minutes + 24 * 60) % (24 * 60);
            const hh = Math.floor(total / 60).toString().padStart(2, '0');
            const mm = (total % 60).toString().padStart(2, '0');
            return `${hh}:${mm}`;
        }

        // Yeni bir ders saati (zil) ekler ve TÜM sınıfların ders programına bu saate karşılık
        // gelen yeni (boş) bir sütun ekler — Zil Zamanlayıcı ile Ders Programı her zaman senkron kalır.
        function addLessonPeriod() {
            saveBellHoursFromInputs();
            saveWeeklyScheduleMatrix();

            const last = bellHours[bellHours.length - 1];
            let newStart = '08:40', newEnd = '09:20';
            if (last) {
                newStart = addMinutesToTimeStr(last.end, 10); // 10 dk teneffüs
                newEnd = addMinutesToTimeStr(newStart, 40);   // 40 dk ders
            }
            bellHours.push({ id: bellHours.length + 1, start: newStart, end: newEnd });

            // Tüm sınıfların tüm günlerine yeni (boş) ders sütunu ekle
            Object.keys(appConfig.weeklyClassSchedules || {}).forEach(cls => {
                Object.keys(appConfig.weeklyClassSchedules[cls] || {}).forEach(day => {
                    if (Array.isArray(appConfig.weeklyClassSchedules[cls][day])) {
                        appConfig.weeklyClassSchedules[cls][day].push('');
                    }
                });
            });

            appConfig.bellHours = bellHours;
            buildAdminBellHoursInputs();
            buildWeeklyScheduleMatrix();
            writeCMSLog(`Yeni ders saati eklendi: ${bellHours.length}. Ders (${newStart} - ${newEnd}). Kaydetmeyi unutmayın.`);
        }

        // Belirtilen ders saatini (zili) ve ona karşılık gelen ders programı sütununu
        // TÜM sınıflardan siler. En az 1 ders saati kalmasını garanti eder.
        function removeLessonPeriod(id) {
            if (bellHours.length <= 1) {
                showCustomNotification("Uyarı", "En az 1 ders saati kalmalıdır, bu son ders saati silinemez.");
                return;
            }
            const idx = bellHours.findIndex(b => b.id === id);
            if (idx === -1) return;

            askCustomConfirmation(
                'Ders Saatini Sil',
                `${idx + 1}. Ders saatini (${bellHours[idx].start} - ${bellHours[idx].end}) silmek istediğinize emin misiniz? Bu, zil zamanlayıcıdan ve TÜM sınıfların ders programından ilgili sütunu kaldırır.`,
                function () {
                    saveBellHoursFromInputs();
                    saveWeeklyScheduleMatrix();

                    bellHours.splice(idx, 1);
                    // Kalan ders saatlerini 1..N olacak şekilde yeniden numaralandır
                    bellHours.forEach((b, i) => { b.id = i + 1; });

                    // Tüm sınıfların tüm günlerinden ilgili sütunu (aynı indeks) çıkar
                    Object.keys(appConfig.weeklyClassSchedules || {}).forEach(cls => {
                        Object.keys(appConfig.weeklyClassSchedules[cls] || {}).forEach(day => {
                            if (Array.isArray(appConfig.weeklyClassSchedules[cls][day])) {
                                appConfig.weeklyClassSchedules[cls][day].splice(idx, 1);
                            }
                        });
                    });

                    appConfig.bellHours = bellHours;
                    buildAdminBellHoursInputs();
                    buildWeeklyScheduleMatrix();
                    writeCMSLog(`Ders saati silindi. Toplam ders saati: ${bellHours.length}. Kaydetmeyi unutmayın.`);
                }
            );
        }

        /* =========================================
           AYLIK NÖBET ÇİZELGESİ MANTIĞI
        ========================================= */
        let nobetAktifAy = new Date().getMonth(); // 0-11
        let nobetAktifYil = new Date().getFullYear();
        
        // appConfig'e aylık nöbet verisi alanı ekle (yoksa)
        if (!appConfig.aylikNobet) appConfig.aylikNobet = {};

        const TURKCE_AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
        const TURKCE_GUNLER_KISA = ["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"];
        const TURKCE_GUNLER_TAM = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];

        function nobetAyAnahtari(yil, ay) {
            return `${yil}-${String(ay+1).padStart(2,'0')}`;
        }

        function nobetAyDegistir(yon) {
            // Önce mevcut ayı kaydet
            nobetAyiKaydet();
            nobetAktifAy += yon;
            if (nobetAktifAy > 11) { nobetAktifAy = 0; nobetAktifYil++; }
            if (nobetAktifAy < 0)  { nobetAktifAy = 11; nobetAktifYil--; }
            buildAylikNobetTablosu();
        }

        function buildAylikNobetTablosu() {
            const anahtar = nobetAyAnahtari(nobetAktifYil, nobetAktifAy);
            const ayVerisi = (appConfig.aylikNobet && appConfig.aylikNobet[anahtar]) || {};
            const positions = appConfig.dutyPositions || [];

            document.getElementById('nobet-ay-baslik').innerText = 
                `${TURKCE_AYLAR[nobetAktifAy].toUpperCase()} ${nobetAktifYil}`;

            // Başlık satırını nöbet yerleri listesine göre dinamik üret
            const thead = document.getElementById('nobet-aylik-tablo-head');
            if (thead) {
                thead.innerHTML = `
                    <tr class="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <th class="p-2 text-center w-10">Tarih</th>
                        <th class="p-2 text-center w-16">Gün</th>
                        ${positions.map(p => `<th class="p-2">${escapeHtml(p.label)}</th>`).join('')}
                    </tr>`;
            }

            const tbody = document.getElementById('nobet-aylik-tablo-body');
            tbody.innerHTML = '';

            // Ayın kaç gün olduğunu hesapla
            const ayinGunSayisi = new Date(nobetAktifYil, nobetAktifAy + 1, 0).getDate();
            const bugun = new Date();

            for (let gun = 1; gun <= ayinGunSayisi; gun++) {
                const tarih = new Date(nobetAktifYil, nobetAktifAy, gun);
                const haftaGunu = tarih.getDay(); // 0=Pazar, 6=Cmt
                
                // Hafta sonunu gri göster, okul günlerini normal
                const isMesaiGunu = haftaGunu >= 1 && haftaGunu <= 5;
                const gunKey = `${gun}`;
                const kayit = ayVerisi[gunKey] || {};
                
                const isToday = bugun.getFullYear() === nobetAktifYil && 
                                bugun.getMonth() === nobetAktifAy && 
                                bugun.getDate() === gun;

                const tr = document.createElement('tr');
                tr.className = `border-b border-slate-800/50 ${isToday ? 'bg-cyan-900/20' : (isMesaiGunu ? 'hover:bg-slate-900/40' : 'opacity-40 bg-slate-950')}`;
                
                const tarihStr = `${String(gun).padStart(2,'0')}.${String(nobetAktifAy+1).padStart(2,'0')}`;
                const gunAdi = TURKCE_GUNLER_KISA[haftaGunu];
                const todayMark = isToday ? ' <span class="text-cyan-400">●</span>' : '';

                if (isMesaiGunu) {
                    const cols = positions.map(p => `
                        <td class="p-1"><input type="text" data-gun="${gunKey}" data-alan="${p.id}" value="${escapeHtml(kayit[p.id] || '')}" placeholder="—" class="nobet-input w-full bg-slate-900 border border-slate-800 rounded p-1 text-xs text-white focus:border-cyan-500 outline-none"></td>
                    `).join('');
                    tr.innerHTML = `
                        <td class="p-1.5 text-center font-mono font-bold text-slate-300 text-xs">${tarihStr}${todayMark}</td>
                        <td class="p-1.5 text-center font-bold text-yellow-400 text-xs">${gunAdi}</td>
                        ${cols}
                    `;
                } else {
                    tr.innerHTML = `
                        <td class="p-1.5 text-center font-mono text-slate-500 text-xs">${tarihStr}</td>
                        <td class="p-1.5 text-center font-bold text-slate-500 text-xs">${gunAdi}</td>
                        <td colspan="${Math.max(positions.length, 1)}" class="p-1.5 text-center text-slate-600 text-xs italic">Tatil Günü</td>
                    `;
                }
                tbody.appendChild(tr);
            }
        }

        function nobetAyiKaydet() {
            const anahtar = nobetAyAnahtari(nobetAktifYil, nobetAktifAy);
            if (!appConfig.aylikNobet) appConfig.aylikNobet = {};
            const ayVerisi = {};
            document.querySelectorAll('.nobet-input').forEach(input => {
                const gun = input.dataset.gun;
                const alan = input.dataset.alan;
                if (!ayVerisi[gun]) ayVerisi[gun] = {};
                ayVerisi[gun][alan] = input.value.trim();
            });
            appConfig.aylikNobet[anahtar] = ayVerisi;
        }

        function nobetAyiTemizle() {
            const anahtar = nobetAyAnahtari(nobetAktifYil, nobetAktifAy);
            askCustomConfirmation(
                'Ayı Temizle',
                `${TURKCE_AYLAR[nobetAktifAy]} ${nobetAktifYil} ayına ait tüm nöbet verileri silinecek. Onaylıyor musunuz?`,
                function() {
                    if (appConfig.aylikNobet) delete appConfig.aylikNobet[anahtar];
                    buildAylikNobetTablosu();
                    panoPersist(); // Anında kalıcı kayıt (yerel + bulut)
                    writeCMSLog(`${TURKCE_AYLAR[nobetAktifAy]} ${nobetAktifYil} nöbet verileri temizlendi.`);
                }
            );
        }

        // Excel seri numarasını veya string tarihi JS Date'e çevirir
        function excelTarihCevir(val) {
            if (!val && val !== 0) return null;
            if (val instanceof Date) return isNaN(val) ? null : val;
            if (typeof val === 'number') {
                // Excel epoch: 1 Ocak 1900 = 1, ama 1900 yılı hata nedeniyle 61'den başlar
                const d = new Date(Math.round((val - 25569) * 86400 * 1000));
                return isNaN(d) ? null : d;
            }
            const s = String(val).trim();
            if (!s) return null;
            // GG.AA.YYYY veya GG/AA/YYYY
            let m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
            if (m) return new Date(+m[3], +m[2]-1, +m[1]);
            // YYYY-MM-DD
            m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (m) return new Date(+m[1], +m[2]-1, +m[3]);
            // GG.AA (yıl yok → aktif yıl)
            m = s.match(/^(\d{1,2})[./](\d{1,2})$/);
            if (m) return new Date(nobetAktifYil, +m[2]-1, +m[1]);
            return null;
        }

        // Bilinen (fabrika ayarı) nöbet yerleri için esnek başlık tanıma kalıpları.
        const DUTY_LEGACY_HEADER_PATTERNS = {
            kantin:  /kantin/i,
            bahce:   /bahçe|bahce|bahçesi/i,
            zemin:   /zemin|giriş|giris|0\.?\s*kat/i,
            kat1:    /1\.?\s*kat/i,
            kat2:    /2\.?\s*kat/i,
            idareci: /idareci|müdür|mudur|nöbetçi\s*i|nobetci\s*i/i
        };

        const LEGACY_DUTY_IDS = ['idareci', 'kantin', 'bahce', 'zemin', 'kat1', 'kat2'];
        function isUsingLegacyDefaultDutyIds() {
            const ids = (appConfig.dutyPositions || []).map(p => p.id);
            return LEGACY_DUTY_IDS.every(id => ids.includes(id));
        }

        // Başlık satırında hangi sütunun hangi nöbet yerine ait olduğunu bulur.
        // Kullanıcının sonradan eklediği/yeniden adlandırdığı nöbet yerleri için
        // sütun etiketi doğrudan nöbet yerinin adına göre tanınır.
        function nobetSutunAlgila(headerRow) {
            const etiketler = {
                tarih: /tarih|date|gün no|günno/i,
                gun:   /^gün$|^gun$|weekday|day/i
            };
            (appConfig.dutyPositions || []).forEach(pos => {
                if (DUTY_LEGACY_HEADER_PATTERNS[pos.id]) {
                    etiketler[pos.id] = DUTY_LEGACY_HEADER_PATTERNS[pos.id];
                } else {
                    const escaped = String(pos.label || pos.id).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    etiketler[pos.id] = new RegExp(escaped, 'i');
                }
            });
            const map = {};
            headerRow.forEach((cell, idx) => {
                const s = String(cell || '').trim();
                for (const [alan, re] of Object.entries(etiketler)) {
                    if (map[alan] === undefined && re.test(s)) map[alan] = idx;
                }
            });
            return map;
        }

        function nobetExcelYukle(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: 'array', cellDates: false });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

                    if (!appConfig.aylikNobet) appConfig.aylikNobet = {};
                    let yuklenenSayisi = 0;
                    let hataSatir = 0;

                    // 1. Başlık satırını bul (ilk 10 satırda "Tarih" veya "Kantin" geçen satır)
                    let headerIdx = -1;
                    let sutunMap = {};
                    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
                        const deneme = nobetSutunAlgila(jsonData[i]);
                        // En az tarih + 1 nöbet alanı varsa başlık kabul et
                        const alanlari = Object.keys(deneme);
                        if (deneme.tarih !== undefined && alanlari.length >= 2) {
                            headerIdx = i;
                            sutunMap = deneme;
                            break;
                        }
                        // Tarih olmadan da: en az 3 nöbet alanı varsa
                        if (alanlari.length >= 3) {
                            headerIdx = i;
                            sutunMap = deneme;
                            break;
                        }
                    }

                    // Başlık bulunamadıysa şablon formatını dene (sütun sırası: Tarih|Gün|Kantin|Bahçe|Zemin|1.Kat|2.Kat|İdareci)
                    // veya eski okul formatı (col 2=tarih, col 4-9=alanlar). Bu sabit-sıra yedeği
                    // sadece nöbet yerleri hâlâ fabrika ayarındaki 6 kalemden oluşuyorsa denenir;
                    // kullanıcı nöbet yerlerini özelleştirdiyse yalnızca başlık eşleşmesine güvenilir.
                    const kullanSablonFormat = headerIdx === -1 && isUsingLegacyDefaultDutyIds();
                    
                    const baslangicIdx = headerIdx === -1 ? 0 : headerIdx + 1;
                    const positions = appConfig.dutyPositions || [];

                    for (let i = baslangicIdx; i < jsonData.length; i++) {
                        const row = jsonData[i];
                        if (!row || row.every(c => c === '' || c === null || c === undefined)) continue;

                        let tarih = null;
                        const kayit = {};

                        if (headerIdx !== -1 && sutunMap.tarih !== undefined) {
                            // Başlık tabanlı okuma: her nöbet yeri, kendi sütun etiketinden bulunur
                            tarih = excelTarihCevir(row[sutunMap.tarih]);
                            positions.forEach(p => {
                                if (sutunMap[p.id] !== undefined) {
                                    kayit[p.id] = String(row[sutunMap[p.id]] ?? '').trim();
                                }
                            });
                        } else if (kullanSablonFormat) {
                            // Eski okul Excel formatı: col0=Tarih, col1=Gün, col2=Kantin, col3=Bahçe, col4=Zemin, col5=1.Kat, col6=2.Kat, col7=İdareci
                            // VEYA: col2=Tarih, col3=Gün, col4=Kantin... (5.satırdan başlayan eski format)
                            tarih = excelTarihCevir(row[0]) || excelTarihCevir(row[2]);
                            if (tarih && !isNaN(tarih)) {
                                const offset = excelTarihCevir(row[0]) ? 2 : 4;
                                kayit.kantin  = String(row[offset]   || '').trim();
                                kayit.bahce   = String(row[offset+1] || '').trim();
                                kayit.zemin   = String(row[offset+2] || '').trim();
                                kayit.kat1    = String(row[offset+3] || '').trim();
                                kayit.kat2    = String(row[offset+4] || '').trim();
                                kayit.idareci = String(row[offset+5] || '').trim();
                            }
                        }

                        if (!tarih || isNaN(tarih)) { hataSatir++; continue; }
                        // Anlamsız tarihleri atla (2000 öncesi veya 2100 sonrası)
                        if (tarih.getFullYear() < 2000 || tarih.getFullYear() > 2100) { hataSatir++; continue; }

                        const yil = tarih.getFullYear();
                        const ay  = tarih.getMonth();
                        const gun = tarih.getDate();
                        const ayAnahtar = nobetAyAnahtari(yil, ay);

                        if (!appConfig.aylikNobet[ayAnahtar]) appConfig.aylikNobet[ayAnahtar] = {};
                        // Aynı güne ait önceki kaydı koru, sadece Excel'de bulunan alanları güncelle
                        appConfig.aylikNobet[ayAnahtar][String(gun)] = { ...(appConfig.aylikNobet[ayAnahtar][String(gun)] || {}), ...kayit };
                        yuklenenSayisi++;
                    }

                    buildAylikNobetTablosu();
                    if (yuklenenSayisi > 0) {
                        panoPersist(); // Anında kalıcı kayıt (yerel + bulut) — sayfa yenilense veya başka cihazdan açılsa da kayıtlar korunur
                        showCustomNotification("Nöbet Yüklendi", `${yuklenenSayisi} adet nöbet kaydı aylık takvime aktarıldı ve kaydedildi.${hataSatir > 0 ? ` (${hataSatir} satır tarih okunamadı)` : ''}`);
                        writeCMSLog(`Nöbet Excel yüklendi: ${yuklenenSayisi} kayıt, ${hataSatir} atlandı.`);
                    } else {
                        showCustomNotification("Veri Bulunamadı", "Excel'de okunabilir nöbet kaydı bulunamadı. Lütfen şablonu indirip kullanın.");
                        writeCMSLog("Nöbet Excel: hiç kayıt yüklenemedi. Şablon kullanılması önerilir.");
                    }
                    e.target.value = '';
                } catch(err) {
                    showCustomNotification("Hata", "Excel dosyası okunamadı: " + err.message);
                    writeCMSLog("Nöbet Excel yükleme hatası: " + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        }

        function nobetSablonIndir() {
            const wb = XLSX.utils.book_new();
            const yil = nobetAktifYil;
            const ay  = nobetAktifAy;
            const ayAdi = TURKCE_AYLAR[ay];
            const gunSayisi = new Date(yil, ay + 1, 0).getDate();
            const positions = appConfig.dutyPositions || [];

            // Başlık satırı — güncel nöbet yerleri listesine göre dinamik üretilir
            const rows = [
                ["Tarih", "Gün", ...positions.map(p => p.label)]
            ];

            for (let g = 1; g <= gunSayisi; g++) {
                const t = new Date(yil, ay, g);
                const haftaGunu = t.getDay();
                // Sadece iş günleri (Pzt-Cuma)
                if (haftaGunu < 1 || haftaGunu > 5) continue;
                const tarihStr = `${String(g).padStart(2,'0')}.${String(ay+1).padStart(2,'0')}.${yil}`;
                const gunAdi = TURKCE_GUNLER_TAM[haftaGunu];
                rows.push([tarihStr, gunAdi, ...positions.map(() => "")]);
            }

            const ws = XLSX.utils.aoa_to_sheet(rows);
            // Sütun genişlikleri
            ws['!cols'] = [{wch:14}, {wch:12}, ...positions.map(() => ({wch:20}))];
            XLSX.utils.book_append_sheet(wb, ws, `${ayAdi}_${yil}`);
            XLSX.writeFile(wb, `Nobet_${ayAdi}_${yil}.xlsx`);
            writeCMSLog(`Nöbet şablonu indirildi: ${ayAdi} ${yil}`);
        }

        /* =========================================
           GÜNÜN SÖZÜ EXCEL YÜKLEME / ŞABLON
        ========================================= */
        function sozSutunAlgila(headerRow) {
            const etiketler = {
                tarih: /tarih|date|gün/i,
                text:  /söz|soz|metin|text|özlü/i,
                author:/yazar|sahib|sahip|author/i
            };
            const map = {};
            (headerRow || []).forEach((cell, idx) => {
                const val = String(cell || '').trim();
                if (!val) return;
                for (const key in etiketler) {
                    if (map[key] === undefined && etiketler[key].test(val)) {
                        map[key] = idx;
                    }
                }
            });
            return map;
        }

        function sozExcelYukle(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

                    let headerIdx = -1;
                    let sutunMap = {};
                    for (let i = 0; i < Math.min(5, jsonData.length); i++) {
                        const deneme = sozSutunAlgila(jsonData[i]);
                        if (deneme.text !== undefined) { headerIdx = i; sutunMap = deneme; break; }
                    }

                    const baslangicIdx = headerIdx === -1 ? 0 : headerIdx + 1;
                    // Sütun sırası bulunamazsa varsayılan şablon sırası: Söz | Yazar | Tarih
                    const textCol = sutunMap.text !== undefined ? sutunMap.text : 0;
                    const authorCol = sutunMap.author !== undefined ? sutunMap.author : 1;
                    const dateCol = sutunMap.tarih !== undefined ? sutunMap.tarih : 2;

                    const loadedQuotes = [];
                    for (let i = baslangicIdx; i < jsonData.length; i++) {
                        const row = jsonData[i];
                        if (!row || row.every(c => c === '' || c === null || c === undefined)) continue;
                        const text = String(row[textCol] ?? '').trim();
                        if (!text) continue;
                        const author = String(row[authorCol] ?? '').trim();
                        let dateVal = row[dateCol];
                        let dateStr = '';
                        if (dateVal !== undefined && dateVal !== null && dateVal !== '') {
                            if (typeof dateVal === 'number') {
                                const d = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
                                if (!isNaN(d)) dateStr = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;
                            } else {
                                dateStr = String(dateVal).trim();
                            }
                        }
                        loadedQuotes.push({ text, author, date: dateStr });
                    }

                    if (loadedQuotes.length > 0) {
                        tempQuotes = loadedQuotes;
                        renderAdminQuotes();
                        showCustomNotification("Sözler Yüklendi", `${loadedQuotes.length} adet söz listeye aktarıldı. Kaydetmek için "Değişiklikleri Kaydet" butonuna basın.`);
                        writeCMSLog(`Günün Sözü Excel yüklendi: ${loadedQuotes.length} kayıt.`);
                    } else {
                        showCustomNotification("Veri Bulunamadı", "Excel'de okunabilir söz kaydı bulunamadı. Lütfen şablonu indirip kullanın.");
                        writeCMSLog("Günün Sözü Excel: hiç kayıt yüklenemedi.");
                    }
                    e.target.value = '';
                } catch (err) {
                    showCustomNotification("Hata", "Excel dosyası okunamadı: " + err.message);
                    writeCMSLog("Günün Sözü Excel yükleme hatası: " + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        }

        function sozSablonIndir() {
            const wb = XLSX.utils.book_new();
            const rows = [
                ["Söz", "Yazar", "Tarih (GG.AA - opsiyonel)"],
                ["Akıllı kimsenin lisanı kalbindedir. Düşünerek söyler.", "Hz. Ali (r.a.)", ""],
                ["Bilgi hazinedir, uygulama ise onun anahtarıdır.", "Hz. Ali (r.a.)", ""],
                ["Cumhuriyet, fikren, ilmen, fennen, bedenen kuvvetli ve yüksek karakterli nesiller ister.", "Mustafa Kemal Atatürk", "29.10"]
            ];
            const ws = XLSX.utils.aoa_to_sheet(rows);
            ws['!cols'] = [{ wch: 60 }, { wch: 28 }, { wch: 20 }];
            XLSX.utils.book_append_sheet(wb, ws, "Gunun_Sozu");
            XLSX.writeFile(wb, "Gunun_Sozu_Sablonu.xlsx");
            writeCMSLog("Günün Sözü Excel şablonu indirildi.");
        }

        /* =========================================
           BELİRLİ GÜN & HAFTALAR EXCEL YÜKLEME / ŞABLON
        ========================================= */
        function ozelGunExcelYukle(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                    const excelTarihCevir = (dateVal) => {
                        if (dateVal === undefined || dateVal === null || dateVal === '') return '';
                        if (typeof dateVal === 'number') {
                            const d = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
                            if (!isNaN(d)) return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;
                            return '';
                        }
                        return String(dateVal).trim();
                    };

                    const loadedSpecialDays = [];
                    rows.forEach(r => {
                        const title = String(r["Başlık"] ?? r["Baslik"] ?? r["Belirli Gün/Hafta"] ?? '').trim();
                        if (!title) return;
                        const startDate = excelTarihCevir(r["Başlangıç Tarihi (GG.AA)"] ?? r["Baslangic Tarihi"] ?? r["Başlangıç"] ?? '');
                        const endDate = excelTarihCevir(r["Bitiş Tarihi (GG.AA - opsiyonel)"] ?? r["Bitis Tarihi"] ?? r["Bitiş"] ?? '');
                        loadedSpecialDays.push({ title, startDate, endDate });
                    });

                    if (loadedSpecialDays.length > 0) {
                        tempSpecialDays = loadedSpecialDays;
                        cancelEditSpecialDay();
                        renderAdminSpecialDays();
                        showCustomNotification("Belirli Gün/Hafta Listesi Yüklendi", `${loadedSpecialDays.length} adet kayıt listeye aktarıldı. Kaydetmek için "Değişiklikleri Kaydet" butonuna basın.`);
                        writeCMSLog(`Belirli Gün/Hafta Excel yüklendi: ${loadedSpecialDays.length} kayıt.`);
                    } else {
                        showCustomNotification("Veri Bulunamadı", "Excel'de okunabilir belirli gün/hafta kaydı bulunamadı. Lütfen şablonu indirip kullanın.");
                        writeCMSLog("Belirli Gün/Hafta Excel: hiç kayıt yüklenemedi.");
                    }
                    e.target.value = '';
                } catch (err) {
                    showCustomNotification("Hata", "Excel dosyası okunamadı: " + err.message);
                    writeCMSLog("Belirli Gün/Hafta Excel yükleme hatası: " + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        }

        function ozelGunSablonIndir() {
            const wb = XLSX.utils.book_new();
            const rows = [
                ["Başlık", "Başlangıç Tarihi (GG.AA)", "Bitiş Tarihi (GG.AA - opsiyonel)"],
                ["29 Ekim Cumhuriyet Bayramı", "29.10", ""],
                ["İlköğretim Haftası", "23.09", "27.09"],
                ["Okuma ve Yazma Bayramı Coşkusu", "", ""]
            ];
            const ws = XLSX.utils.aoa_to_sheet(rows);
            ws['!cols'] = [{ wch: 45 }, { wch: 22 }, { wch: 26 }];
            XLSX.utils.book_append_sheet(wb, ws, "Ozel_Gunler_Haftalar");
            XLSX.writeFile(wb, "Belirli_Gun_Hafta_Sablonu.xlsx");
            writeCMSLog("Belirli Gün/Hafta Excel şablonu indirildi.");
        }

        /* =========================================
           BUGÜN DOĞANLAR (DOĞUM GÜNÜ) EXCEL YÜKLEME / ŞABLON
        ========================================= */
        function dogumExcelYukle(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                    const loadedBirthdays = [];
                    rows.forEach(r => {
                        const cls = String(r["Sınıf"] ?? r["Sinif"] ?? '').trim();
                        const name = String(r["Ad Soyad"] ?? r["Ad-Soyad"] ?? r["İsim"] ?? '').trim();
                        let dateVal = r["Tarih (GG.AA)"] ?? r["Tarih"] ?? '';
                        let dateStr = '';
                        if (typeof dateVal === 'number') {
                            const d = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
                            if (!isNaN(d)) dateStr = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;
                        } else {
                            dateStr = String(dateVal).trim();
                        }
                        if (name && dateStr) {
                            loadedBirthdays.push({ class: cls || '—', name, date: dateStr });
                        }
                    });

                    if (loadedBirthdays.length > 0) {
                        tempBirthdays = loadedBirthdays;
                        cancelEditBirthday();
                        renderAdminBirthdays();
                        showCustomNotification("Doğum Günleri Yüklendi", `${loadedBirthdays.length} adet kayıt listeye aktarıldı. Kaydetmek için "Değişiklikleri Kaydet" butonuna basın.`);
                        writeCMSLog(`Doğum Günü Excel yüklendi: ${loadedBirthdays.length} kayıt.`);
                    } else {
                        showCustomNotification("Veri Bulunamadı", "Excel'de okunabilir doğum günü kaydı bulunamadı. Lütfen şablonu indirip kullanın.");
                        writeCMSLog("Doğum Günü Excel: hiç kayıt yüklenemedi.");
                    }
                    e.target.value = '';
                } catch (err) {
                    showCustomNotification("Hata", "Excel dosyası okunamadı: " + err.message);
                    writeCMSLog("Doğum Günü Excel yükleme hatası: " + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        }

        function dogumSablonIndir() {
            const wb = XLSX.utils.book_new();
            const rows = [
                ["Sınıf", "Ad Soyad", "Tarih (GG.AA)"],
                ["2/B", "Beyza KIZILŞARA", "24.11"],
                ["3/C", "Enes DEMİR", "15.05"],
                ["1/A", "Elif BULUT", "20.07"]
            ];
            const ws = XLSX.utils.aoa_to_sheet(rows);
            ws['!cols'] = [{ wch: 10 }, { wch: 28 }, { wch: 16 }];
            XLSX.utils.book_append_sheet(wb, ws, "Dogum_Gunleri");
            XLSX.writeFile(wb, "Dogum_Gunleri_Sablonu.xlsx");
            writeCMSLog("Doğum Günü Excel şablonu indirildi.");
        }

        /* =========================================
           DERS PROGRAMI EXCEL YÜKLEME
        ========================================= */
        function dersExcelYukle(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (jsonData.length < 2) {
                        showCustomNotification("Hata", "Excel dosyası boş veya geçersiz.");
                        return;
                    }

                    // Format: Sütun0=Gün, Sütun1=Ders Saati/Sıra, Sütun2+=Sınıflar
                    const headerRow = jsonData[0];
                    // Sınıf listesini headerdan al (indeks 2'den itibaren)
                    const siniflarExcel = headerRow.slice(2).map(s => String(s || '').trim()).filter(s => s);

                    let sonGun = '';
                    let yuklenenSinif = 0;

                    // Geçici yapı: sinif -> gun -> [7 ders]
                    const tempSchedule = {};
                    siniflarExcel.forEach(s => { tempSchedule[s] = {}; });

                    for (let i = 1; i < jsonData.length; i++) {
                        const row = jsonData[i];
                        if (!row || row.length === 0) continue;

                        // Gün sütunu dolu ise güncelle
                        if (row[0] && String(row[0]).trim() !== '') {
                            sonGun = String(row[0]).trim();
                        }
                        if (!sonGun || !daysOfWeek.includes(sonGun)) continue;

                        // Her sınıf için ders saatlerini oluştur (mevcut ders saati sayısı kadar)
                        siniflarExcel.forEach((sinif, idx) => {
                            if (!classList.includes(sinif)) return;
                            if (!tempSchedule[sinif][sonGun]) {
                                tempSchedule[sinif][sonGun] = [];
                            }
                            const dersAdi = String(row[2 + idx] || '').trim();
                            if (tempSchedule[sinif][sonGun].length < bellHours.length) {
                                tempSchedule[sinif][sonGun].push(dersAdi);
                            }
                        });
                    }

                    // appConfig'e yaz
                    siniflarExcel.forEach(sinif => {
                        if (!classList.includes(sinif)) return;
                        if (!appConfig.weeklyClassSchedules[sinif]) appConfig.weeklyClassSchedules[sinif] = {};
                        daysOfWeek.forEach(gun => {
                            if (tempSchedule[sinif][gun]) {
                                // Mevcut ders saati sayısına tamamla
                                while (tempSchedule[sinif][gun].length < bellHours.length) tempSchedule[sinif][gun].push('');
                                appConfig.weeklyClassSchedules[sinif][gun] = tempSchedule[sinif][gun];
                            }
                        });
                        yuklenenSinif++;
                    });

                    buildWeeklyScheduleMatrix();
                    buildAdminClassSelector();
                    panoPersist(); // Anında kalıcı kayıt (yerel + bulut) — sayfa yenilense veya başka cihazdan açılsa da kayıtlar korunur
                    showCustomNotification("Ders Programı Yüklendi", `${yuklenenSinif} sınıfın haftalık ders programı başarıyla tabloya aktarıldı ve kaydedildi.`);
                    writeCMSLog(`Ders programı Excel yüklendi: ${yuklenenSinif} sınıf.`);
                    e.target.value = '';
                } catch(err) {
                    showCustomNotification("Hata", "Ders programı Excel dosyası okunamadı.");
                    writeCMSLog("Ders programı Excel yükleme hatası: " + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        }

        function dersExcelSablonIndir() {
            const wb = XLSX.utils.book_new();
            const rows = [["Gün", "Ders Sırası", ...classList]];
            daysOfWeek.forEach(gun => {
                for (let i = 1; i <= bellHours.length; i++) {
                    rows.push([i === 1 ? gun : "", `${i}. Ders`, ...classList.map(() => "")]);
                }
            });
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), "Ders_Programi");
            XLSX.writeFile(wb, "Ders_Programi_Sablonu.xlsx");
            writeCMSLog("Ders programı Excel şablonu indirildi.");
        }

        /* EXCEL ENTEGRASYON VE AKTARIM MANTIĞI */
        function downloadExcelTemplate() {
            const wb = XLSX.utils.book_new();

            // 1. Nöbet Planı Sayfası
            const dutyData = [
                ["Gün", "İdareci", "Kantin", "Bahçe", "1. Kat", "2. Kat"],
                ["Pazartesi", "Nihan Öztürk", "Ahmet Ak", "Veli Can", "Zeynep Şen", "Murat Koç"],
                ["Salı", "Mehmet Çelik", "Canan Yılmaz", "Kemal Sun", "Özlem Er", "Tarık Aka"],
                ["Çarşamba", "Nihan Öztürk", "Fatih Yaşar", "Deniz Gözü", "Seda Gül", "Canan Demir"],
                ["Perşembe", "Mehmet Çelik", "Seda Süs", "Arif Mert", "Zeynep Şen", "Murat Koç"],
                ["Cuma", "Kadir Bal", "Gönül Bağı", "Ali Kemal", "Hülya Avşar", "Cem Karaca"]
            ];
            const wsDuty = XLSX.utils.aoa_to_sheet(dutyData);
            XLSX.utils.book_append_sheet(wb, wsDuty, "Nobet_Planlar");

            // 2. Ders Programı Sayfası
            const scheduleData = [
                ["Sınıf", "Gün", "1. Ders", "2. Ders", "3. Ders", "4. Ders", "5. Ders", "6. Ders", "7. Ders"],
                ["1/A", "Pazartesi", "Türkçe", "Türkçe", "Matematik", "Müzik", "Görsel San.", "Beden Eğt.", "Beden Eğt."],
                ["1/A", "Salı", "Matematik", "Matematik", "Türkçe", "Türkçe", "Hayat Bil.", "Müzik", "Oyun Etk."],
                ["3/C", "Pazartesi", "Hayat Bil.", "Hayat Bil.", "Türkçe", "Türkçe", "Matematik", "Görsel San.", "Serbest Etk."]
            ];
            const wsSchedule = XLSX.utils.aoa_to_sheet(scheduleData);
            XLSX.utils.book_append_sheet(wb, wsSchedule, "Ders_Programlari");

            // 3. Doğum Günleri Sayfası
            const birthdayData = [
                ["Sınıf", "Ad Soyad", "Tarih (GG.AA)"],
                ["2/B", "Beyza KIZILŞARA", "24.11"],
                ["3/C", "Enes DEMİR", "15.05"]
            ];
            const wsBirthday = XLSX.utils.aoa_to_sheet(birthdayData);
            XLSX.utils.book_append_sheet(wb, wsBirthday, "Dogum_Gunleri");

            // 4. Belirli Gün & Haftalar Sayfası
            const specialDayData = [
                ["Başlık", "Başlangıç Tarihi (GG.AA)", "Bitiş Tarihi (GG.AA - opsiyonel)"],
                ["29 Ekim Cumhuriyet Bayramı", "29.10", ""],
                ["İlköğretim Haftası", "23.09", "27.09"]
            ];
            const wsSpecialDay = XLSX.utils.aoa_to_sheet(specialDayData);
            XLSX.utils.book_append_sheet(wb, wsSpecialDay, "Ozel_Gunler_Haftalar");

            XLSX.writeFile(wb, "Pano_Veri_Yukleme_Sablonu.xlsx");
            writeCMSLog("Excel şablon dosyası indirildi.");
        }

        function exportToExcel() {
            const wb = XLSX.utils.book_new();

            // Nöbet Planları
            const dutyRows = [["Gün", "İdareci", "Kantin", "Bahçe", "1. Kat", "2. Kat"]];
            daysOfWeek.forEach(day => {
                const d = appConfig.weeklyDuties[day] || {};
                dutyRows.push([day, d.admin || "", d.canteen || "", d.garden || "", d.floor1 || "", d.floor2 || ""]);
            });
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dutyRows), "Nobet_Planlari");

            // Ders Programları
            const scheduleRows = [["Sınıf", "Gün", ...bellHours.map(b => `${b.id}. Ders`)]];
            classList.forEach(cls => {
                const classWeek = appConfig.weeklyClassSchedules[cls] || {};
                daysOfWeek.forEach(day => {
                    const row = classWeek[day] || Array(bellHours.length).fill("");
                    scheduleRows.push([cls, day, ...row]);
                });
            });
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(scheduleRows), "Ders_Programlari");

            // Doğum Günleri
            const bdayRows = [["Sınıf", "Ad Soyad", "Tarih (GG.AA)"]];
            (appConfig.birthdays || []).forEach(b => {
                bdayRows.push([b.class, b.name, b.date]);
            });
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(bdayRows), "Dogum_Gunleri");

            // Belirli Gün & Haftalar
            const specialDayRows = [["Başlık", "Başlangıç Tarihi (GG.AA)", "Bitiş Tarihi (GG.AA - opsiyonel)"]];
            (appConfig.specialDays || []).forEach(sd => {
                specialDayRows.push([sd.title || "", sd.startDate || "", sd.endDate || ""]);
            });
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(specialDayRows), "Ozel_Gunler_Haftalar");

            XLSX.writeFile(wb, "Pano_Mevcut_Veriler.xlsx");
            writeCMSLog("Pano verileri Excel dosyasına indirildi.");
        }

        function importFromExcel(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // 1. Nöbet Sayfası Okuma
                    if (workbook.SheetNames.includes("Nobet_Planlar") || workbook.SheetNames.includes("Nobet_Planlari")) {
                        const sheetName = workbook.SheetNames.includes("Nobet_Planlar") ? "Nobet_Planlar" : "Nobet_Planlari";
                        const sheet = workbook.Sheets[sheetName];
                        const rows = XLSX.utils.sheet_to_json(sheet);
                        rows.forEach(r => {
                            const day = r["Gün"];
                            if (daysOfWeek.includes(day)) {
                                appConfig.weeklyDuties[day] = {
                                    admin: r["İdareci"] || "",
                                    canteen: r["Kantin"] || "",
                                    garden: r["Bahçe"] || "",
                                    floor1: r["1. Kat"] || "",
                                    floor2: r["2. Kat"] || ""
                                };
                            }
                        });
                    }

                    // 2. Ders Programı Okuma
                    if (workbook.SheetNames.includes("Ders_Programlari")) {
                        const sheet = workbook.Sheets["Ders_Programlari"];
                        const rows = XLSX.utils.sheet_to_json(sheet);
                        rows.forEach(r => {
                            const cls = r["Sınıf"];
                            const day = r["Gün"];
                            if (classList.includes(cls) && daysOfWeek.includes(day)) {
                                if (!appConfig.weeklyClassSchedules[cls]) appConfig.weeklyClassSchedules[cls] = {};
                                appConfig.weeklyClassSchedules[cls][day] = bellHours.map(b => r[`${b.id}. Ders`] || "");
                            }
                        });
                    }

                    // 3. Doğum Günleri Okuma
                    if (workbook.SheetNames.includes("Dogum_Gunleri")) {
                        const sheet = workbook.Sheets["Dogum_Gunleri"];
                        const rows = XLSX.utils.sheet_to_json(sheet);
                        const loadedBirthdays = [];
                        rows.forEach(r => {
                            if (r["Sınıf"] && r["Ad Soyad"] && r["Tarih (GG.AA)"]) {
                                loadedBirthdays.push({
                                    class: r["Sınıf"],
                                    name: r["Ad Soyad"],
                                    date: String(r["Tarih (GG.AA)"])
                                });
                            }
                        });
                        if (loadedBirthdays.length > 0) {
                            appConfig.birthdays = loadedBirthdays;
                            tempBirthdays = [...loadedBirthdays];
                        }
                    }

                    // 4. Belirli Gün & Haftalar Okuma
                    if (workbook.SheetNames.includes("Ozel_Gunler_Haftalar")) {
                        const sheet = workbook.Sheets["Ozel_Gunler_Haftalar"];
                        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
                        const loadedSpecialDays = [];
                        rows.forEach(r => {
                            const title = String(r["Başlık"] ?? r["Baslik"] ?? '').trim();
                            if (!title) return;
                            const startDate = String(r["Başlangıç Tarihi (GG.AA)"] ?? r["Baslangic Tarihi"] ?? '').trim();
                            const endDate = String(r["Bitiş Tarihi (GG.AA - opsiyonel)"] ?? r["Bitis Tarihi"] ?? '').trim();
                            loadedSpecialDays.push({ title, startDate, endDate });
                        });
                        if (loadedSpecialDays.length > 0) {
                            appConfig.specialDays = loadedSpecialDays;
                            tempSpecialDays = [...loadedSpecialDays];
                        }
                    }

                    buildWeeklyScheduleMatrix();
                    buildWeeklyDutiesTable();
                    renderAdminBirthdays();
                    renderAdminSpecialDays();
                    panoPersist(); // Anında kalıcı kayıt (yerel + bulut) — sayfa yenilense veya başka cihazdan açılsa da kayıtlar korunur

                    showCustomNotification("Excel Yüklendi", "Excel dosyasındaki veriler pano sistemine aktarıldı ve kaydedildi.");
                    writeCMSLog("Excel dosyasından toplu veri aktarımı tamamlandı.");
                } catch (err) {
                    showCustomNotification("Hata", "Excel dosyası okunamadı. Formatın doğru olduğundan emin olun.");
                    writeCMSLog("Excel içe aktarım hatası oluştu.");
                }
            };
            reader.readAsArrayBuffer(file);
        }

        function exportDataToJSON() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appConfig));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "Okul_Pano_Yedek.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            writeCMSLog("JSON sistem yedeği indirildi.");
        }

        // "JSON Sistem Yedeği Al" ile indirilen bir yedek dosyasını geri yükler. Yerel
        // (localStorage) ve buluttaki (Supabase) veriyi bu yedekle DEĞİŞTİRİR — dikkatli
        // kullanın. Fotoğrafların kendisini geri getirmez (yedekte sadece linkleri vardır);
        // eğer o linkler artık Supabase Storage'da yoksa (bucket silinmiş/değişmişse)
        // fotoğraflar görünmeyecektir.
        function importDataFromJSONFile(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            if (!confirm('Bu yedek, panodaki MEVCUT tüm ayarları/verileri üzerine yazacak. Devam edilsin mi?')) {
                event.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onerror = () => {
                showCustomNotification('Hata', 'Yedek dosyası okunamadı.');
            };
            reader.onload = () => {
                let restored;
                try {
                    restored = JSON.parse(reader.result);
                } catch (e) {
                    showCustomNotification('Hata', 'Geçersiz JSON dosyası.');
                    return;
                }
                if (!restored || typeof restored !== 'object') {
                    showCustomNotification('Hata', 'Geçersiz yedek içeriği.');
                    return;
                }
                appConfig = restored;
                // Geri yüklenen veriyi buluttaki mevcut sürümden daha yeni işaretle,
                // böylece cloudPushNow() bunu buluta da yazar (diğer cihazlar da alır).
                appConfig.__syncVersion = (appConfig.__syncVersion || 0) + 1;
                localStorage.setItem('okulPanoDataV8', JSON.stringify(appConfig));
                writeCMSLog('Yedekten geri yükleme yapıldı: ' + file.name);
                showCustomNotification('Yükleniyor', 'Yedek buluta yazılıyor, lütfen bekleyin...');
                // ÖNEMLİ: Sayfa, buluta yazma işi GERÇEKTEN bitmeden yenilenmemeli — aksi
                // halde yavaş bağlantıda sayfa açılışın buluttan çektiği ESKİ veri (henüz
                // güncellenmemiş) yedeği sessizce geri alabilir.
                cloudPushNow((errMsg) => {
                    showCustomNotification('Tamam', 'Yedek geri yüklendi. Sayfa yenileniyor...');
                    setTimeout(() => location.reload(), 400);
                });
            };
            reader.readAsText(file);
        }


// ============================================================================
// TV/KİOSK GÜVENLİ MOD: Yönetim panelinde veya PIN ekranında uzun süre
// hareketsiz kalınırsa otomatik olarak kapatıp temiz gösterim ekranına döner.
// ----------------------------------------------------------------------------
// Amaç: Biri (bilgisayardan) yönetim paneline girip düzenleme yapıp kapatmayı
// unutursa, ya da hedefsiz bir tıklama/uzaktan kumanda hareketi "Ekran Geçişi"
// PIN kutusunu kazara açarsa, TV bu ekranda takılı kalmasın. Belirlenen süre
// (varsayılan 90 saniye) boyunca hiçbir fare/klavye/dokunma etkileşimi
// olmazsa, açık olan yönetim paneli ve/veya PIN kutusu otomatik kapatılır.
// ============================================================================
(function () {
  var IDLE_LIMIT_MS = 90 * 1000; // 90 saniye
  var lastActivity = Date.now();

  ["mousemove", "mousedown", "keydown", "touchstart", "wheel"].forEach(function (evt) {
    window.addEventListener(evt, function () { lastActivity = Date.now(); }, { passive: true });
  });

  setInterval(function () {
    var idleFor = Date.now() - lastActivity;
    if (idleFor < IDLE_LIMIT_MS) return;

    var adminPanel = document.getElementById("admin-panel");
    var pinModal = document.getElementById("pin-prompt-modal");

    var adminOpen = adminPanel && !adminPanel.classList.contains("hidden");
    var pinOpen = pinModal && !pinModal.classList.contains("hidden");

    if (adminOpen && typeof closeAdminPanelWithoutSaving === "function") {
      closeAdminPanelWithoutSaving();
    }
    if (pinOpen && typeof closePinPrompt === "function") {
      closePinPrompt();
    }
  }, 5000); // her 5 saniyede bir kontrol et
})();
