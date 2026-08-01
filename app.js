// Multi-Company Data Store with Corporate Banking & Tax IDs
const companiesData = {
    "company_1": {
        id: "company_1",
        code: "HLD",
        arName: "شركة المكتب العاشر القابضة",
        subAr: "شركة قابضة واستثمارية",
        enName: "TENTH OFFICE",
        enSub: "HOLDING COMPANY",
        cr: "7003400145",
        vat: "300123456700003",
        phone: "+966 11 400 1010",
        email: "info@tenthoffice.sa",
        web: "www.tenthoffice.sa",
        address: "الرياض - برج المكتب العاشر - طريق الملك فهد",
        primaryColor: "#C5A059",
        darkColor: "#1A1A1A",
        logoImg: "logo.jpg",
        sealImg: "",
        template: "template-executive",
        sealInk: "#C5A059",
        sealTop: "المكتب العاشر",
        sealMid: "موافق عليه",
        sealBot: "س.ت 7003400145",
        bankName: "البنك الأهلي السعودي (SNB)",
        bankHolder: "شركة المكتب العاشر القابضة",
        bankIban: "SA44 1000 0001 2345 6789 0101",
        bankSwift: "NCBKSARI"
    },
    "company_2": {
        id: "company_2",
        code: "CLT",
        arName: "شركة أنظمة المدينة للمقاولات",
        subAr: "أنظمة وأعمال المقاولات المتكاملة",
        enName: "CLT PRO.CO",
        enSub: "CONTRACTING & SYSTEMS CO.",
        cr: "7002168016",
        vat: "310987654300003",
        phone: "+966 57 986 3495",
        email: "cltpro.info@gmail.com",
        web: "cltpro.co",
        address: "الرياض - الدائري الجنوبي - كريستال بلازا - مكتب 7",
        primaryColor: "#1A2F50",
        darkColor: "#0D1B2A",
        logoImg: "company2_logo.jpg",
        sealImg: "company2_seal.jpg",
        template: "template-modern",
        sealInk: "#1A2F50",
        sealTop: "شركة أنظمة المدينة للمقاولات",
        sealMid: "CLT PRO.CO",
        sealBot: "رقم السجل: 7002168016",
        bankName: "مصرف الراجحي (Al Rajhi Bank)",
        bankHolder: "شركة أنظمة المدينة للمقاولات",
        bankIban: "SA88 8000 0456 1234 5678 0202",
        bankSwift: "RJHIROSA"
    },
    "company_3": {
        id: "company_3",
        code: "EXC",
        arName: "مؤسسة تبادل الشرق للمقاولات",
        subAr: "أعمال المقاولات والتجهيزات العامة",
        enName: "EAST EXCHANGE",
        enSub: "CONTRACTING EST.",
        cr: "7004561230",
        vat: "305544332200003",
        phone: "+966 50 123 4567",
        email: "info@eastexchange.sa",
        web: "www.eastexchange.sa",
        address: "الرياض - طريق الملك عبد العزيز - حي الملز - مكتب 12",
        primaryColor: "#0B2B5B",
        darkColor: "#05152E",
        logoImg: "company3_logo.png",
        sealImg: "company3_seal.png",
        template: "template-executive",
        sealInk: "#0B2B5B",
        sealTop: "مؤسسة تبادل الشرق للمقاولات",
        sealMid: "EAST EXCHANGE EST.",
        sealBot: "س.ت 7004561230",
        bankName: "بنك الرياض (Riyad Bank)",
        bankHolder: "مؤسسة تبادل الشرق للمقاولات",
        bankIban: "SA12 2000 0009 8765 4321 0303",
        bankSwift: "RIBLSARI"
    }
};

let activeCompanyId = "company_1";
let currentAppMode = "letter"; // 'letter', 'contract', 'receipt', 'quotation', 'hr', 'reports'
let currentZoom = 1.0;
let currentTemplate = 'template-executive';
let refCounter = 1;
let totalPagesCount = 1;

// Advanced Table Engine Store
let tableHeaders = ["البند", "بيان الدفعة / الوصف", "النسبة", "المبلغ (ريال)"];
let tableRows = [
    ["1", "الدفعة الأولى المقدمة (عند توقيع العقد)", "25%", "37500"],
    ["2", "الدفعة الثانية (إتمام صب الخرسانات والأنظمة)", "40%", "60000"],
    ["3", "الدفعة الثالثة (إتمام الأعمال والتسليم الأولي)", "25%", "37500"],
    ["4", "الدفعة النهائية (عند التسليم وإخلاء الطرف)", "10%", "15000"]
];
let isTableVisible = true;
let isVatEnabled = true;
let isTafqeetVisible = true;
let isBankCardVisible = true;
let isDualSignaturesVisible = true;
let currentTableTheme = "table-theme-royal";

// Signature Pad Variables
let sigCanvas, sigCtx, isDrawing = false;

// Safe DOM Helper Functions
function safeGet(id) {
    return document.getElementById(id);
}

function safeSetText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function safeSetValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

function safeToggleClass(id, className, state) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle(className, state);
}

function safeDisplay(id, displayVal) {
    const el = document.getElementById(id);
    if (el) el.style.display = displayVal;
}

document.addEventListener('DOMContentLoaded', () => {
    switchCompanyProfile("company_1");
    updateContent();
    adjustZoom(0);
    initSignatureCanvas();
    updateArchiveBadgeCount();
    updateQrCode();
    renderDynamicTable();
    renderLegalClauses();
    updateReceiptVoucher();
    updateQuotationModule();
});

// Master Sidebar Category Switcher (4 Master Groups)
function switchTabGroup(groupId) {
    document.querySelectorAll('.tab-group-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-group-content').forEach(content => content.classList.remove('active'));

    const activeBtn = safeGet(`tab-btn-${groupId}`);
    if (activeBtn) activeBtn.classList.add('active');

    const targetGroup = safeGet(groupId);
    if (targetGroup) targetGroup.classList.add('active');
}

// App Mode Switcher (6 Main Modes)
function switchAppMode(mode) {
    currentAppMode = mode;

    safeToggleClass('btn-mode-letter', 'active', mode === 'letter');
    safeToggleClass('btn-mode-contract', 'active', mode === 'contract');
    safeToggleClass('btn-mode-receipt', 'active', mode === 'receipt');
    safeToggleClass('btn-mode-quotation', 'active', mode === 'quotation');
    safeToggleClass('btn-mode-hr', 'active', mode === 'hr');
    safeToggleClass('btn-mode-reports', 'active', mode === 'reports');

    // Hide all mode panels inside builder group
    document.querySelectorAll('.mode-panel').forEach(p => p.style.display = 'none');

    const partiesBoxes = document.querySelectorAll('.paper-contract-parties-box');
    const statusBars = document.querySelectorAll('.contract-status-bar');
    const receiptPaperBox = safeGet('paper-receipt-voucher-box');
    const quotationPaperBox = safeGet('paper-quotation-box');
    const quotationTermsBox = safeGet('paper-quotation-terms-box');
    const letterBodyBox = safeGet('paper-letter-body-box');

    // Reset preview defaults
    if (receiptPaperBox) receiptPaperBox.style.display = 'none';
    if (quotationPaperBox) quotationPaperBox.style.display = 'none';
    if (quotationTermsBox) quotationTermsBox.style.display = 'none';
    if (letterBodyBox) letterBodyBox.style.display = 'flex';
    partiesBoxes.forEach(el => el.style.display = 'none');
    statusBars.forEach(el => el.style.display = 'none');

    // Switch to Builder Tab Group automatically
    switchTabGroup('group-builder');

    if (mode === 'reports' || mode === 'hr') {
        const panelReports = document.querySelector('.mode-panel-reports');
        if (panelReports) panelReports.style.display = 'block';
        setPageLayoutMode('1');
        if (mode === 'hr') loadHrPreset('car_auth');
        else loadReportPreset('site_handover');
    } else if (mode === 'quotation') {
        const panelQuo = document.querySelector('.mode-panel-quotation');
        if (panelQuo) panelQuo.style.display = 'block';
        if (quotationPaperBox) quotationPaperBox.style.display = 'block';
        if (quotationTermsBox) quotationTermsBox.style.display = 'block';
        
        loadTablePreset('cctv_boq');
        setPageLayoutMode('1');
        updateQuotationModule();
    } else if (mode === 'receipt') {
        const panelReceipt = document.querySelector('.mode-panel-receipt');
        if (panelReceipt) panelReceipt.style.display = 'block';
        if (receiptPaperBox) receiptPaperBox.style.display = 'flex';
        if (letterBodyBox) letterBodyBox.style.display = 'none';
        
        setPageLayoutMode('1');
        updateReceiptVoucher();
    } else if (mode === 'contract') {
        const panelContract = document.querySelector('.mode-panel-contract');
        if (panelContract) panelContract.style.display = 'block';
        partiesBoxes.forEach(el => el.style.display = 'grid');
        statusBars.forEach(el => el.style.display = 'block');
        
        setPageLayoutMode('2');
        safeSetValue('contract-pages-count-select', '2');

        updateContractParties();
        renderLegalClauses();
    } else {
        const panelLetter = document.querySelector('.mode-panel-letter');
        if (panelLetter) panelLetter.style.display = 'block';
        setPageLayoutMode('1');
        safeSetValue('contract-pages-count-select', '1');
    }
}

// Reports & Inspection Minutes Presets Engine
function loadReportPreset(reportType) {
    const comp = companiesData[activeCompanyId];
    const coName = comp ? comp.arName : 'الشركة';

    if (reportType === 'site_handover') {
        safeSetValue('input-recipient', "إلى: المهندس الاستشاري وممثل المالك المحترمين");
        safeSetValue('input-subject', "الموضوع: محضر تسليم موقع مشروع رسمـي (Site Handover Minutes)");
        safeSetValue('input-salutation', "السلام عليكم ورحمة الله وبركاته،،،");
        safeSetValue('input-body', `أنه في هذا اليوم، تم المعاينة الميدانية والشخوص إلى موقع المشروع الموضحة تفاصيله أدناه، لغرض تسليم الموقع رسمياً للمقاول لبدء تنفيذ أعمال الإنشاءات والتجهيزات.

وقد تبين للجنة الاستلام خلو الموقع من أي عوائق فنية أو قانونية، وأن الموقع جاهز تماماً للبدء الفوري.

أعضاء لجنة المعاينة والتسليم:
1. ممثل المالك/الشركة: م. عبدالملك بن سلطان
2. ممثل الاستشاري المشرف: أ. خالد بن أحمد
3. ممثل الشركة المنفذة: م. أحمد بن صالح`);

        tableHeaders = ["م", "عنصر المعاينة والموقع", "الحالة الفنية", "الملاحظات التفتيشية"];
        tableRows = [
            ["1", "حدود الأرض والمساحة المساحية", "طبيعي ومطابق للمخطط", "تم تحديد البتارات الزوايا"],
            ["2", "مصادر المياه والكهرباء المؤقتة", "متوفرة بموقع المشروع", "جاهزة لتغذية معدات البناء"],
            ["3", "خلو الموقع من العوائق والمباني القديمة", "خالي تماماً", "تم التنظيف والتمهيد بالمعدة"]
        ];
        isVatEnabled = false;
        const vatCheck = safeGet('calc-vat-check');
        if (vatCheck) vatCheck.checked = false;
    } else if (reportType === 'project_completion') {
        safeSetValue('input-recipient', "السادة / لجنة الاستلام النهائي والاستشاري المشرف المحترمين");
        safeSetValue('input-subject', "الموضوع: محضر تسليم ابتدائي واستلام أعمال مشروع (Initial Handover Certificate)");
        safeSetValue('input-salutation', "تحية طيبة وبعد،،،");
        safeSetValue('input-body', `قامت لجنة الاستلام الميدانية يومنا هذا بتفقد واختبار أعمال مشروع (توريد وتركيب كاميرات المراقبة والأنظمة الأمنية)، والمُنفذ من قبل ${coName}.

وبعد إجراء المعاينة الفنية واختبارات التشغيل لكافة الكاميرات وأجهزة التسجيل ومصادر الطاقة، أقرت اللجنة بإتمام الأعمال وفق المواصفات القياسية السعودية (SASO) وبدء فترة الضمان الرسمي اعتبارا من تاريخه.`);

        tableHeaders = ["م", "المكون / بند المشروع", "نسبة الإنجاز", "قرار لجنة الفحص والتسليم"];
        tableRows = [
            ["1", "تركيب الكاميرات الخارجية والداخلية", "100%", "مقبول ومعتمد رسمياً"],
            ["2", "برمجة أجهزة التسجيل NVR والشبكة", "100%", "مقبول ومربوط بالمركز"],
            ["3", "التشغيل التجريبي لمدة 7 أيام", "100%", "يعمل بكفاءة عالية دون أعطال"]
        ];
        isVatEnabled = false;
        const vatCheck = safeGet('calc-vat-check');
        if (vatCheck) vatCheck.checked = false;
    } else if (reportType === 'board_meeting') {
        safeSetValue('input-recipient', "السادة / أعضاء مجلس الإدارة والشركاء المحترمين");
        safeSetValue('input-subject', "الموضوع: محضر اجتماع مجلس الإدارة رقم (2026/03) - شركة المكتب العاشر القابضة");
        safeSetValue('input-salutation', "السلام عليكم ورحمة الله وبركاته،،،");
        safeSetValue('input-body', `عقد مجلس إدارة ${coName} اجتماعه الدوري برئاسة رئيس المجلس وحضور كافة الأعضاء بنسبة نصاب (100%).

تم استعراض جدول الأعمال ومناقشة التقرير المالي والأداء الاستثماري للربع الثالث 2026، وقد اتخذ المجلس القرارات والتوصيات التالية:

1. اعتماد القوائم المالية المدققة للربع الثالث 2026.
2. الموافقة على تأسيس الفرع الجديد للمقاولات بمدينة الرياض وتفويض الرئيس التنفيذي بكافة الإجراءات.
3. الاعتماد النهائي للميزانية التقديرية للربع الرابع.`);

        tableHeaders = ["م", "موضوع المناقشة والقرار", "نسبة التصويت", "الإدارة المكلفة بالتنفيذ"];
        tableRows = [
            ["1", "اعتماد القوائم المالية والتوزيعات", "إجماع (100%)", "الإدارة المالية والمحاسبة"],
            ["2", "افتتاح الفرع الجديد والتوسع", "موافقة بالأغلبية", "الرئيس التنفيذي والشؤون الإدارية"],
            ["3", "توقيع الشراكة العقارية الجديدة", "إجماع (100%)", "إدارة الاستثمار والتطوير"]
        ];
        isVatEnabled = false;
        const vatCheck = safeGet('calc-vat-check');
        if (vatCheck) vatCheck.checked = false;
    }

    isTableVisible = true;
    const tableCheck = safeGet('show-table-check');
    if (tableCheck) tableCheck.checked = true;
    renderDynamicTable();
    updateContent();
}

// Commercial Quotation Module Update Engine
function updateQuotationModule() {
    const quoNo = safeGet('input-quo-no') ? safeGet('input-quo-no').value : 'QUO-2026-042';
    const validity = safeGet('input-quo-validity') ? safeGet('input-quo-validity').value : 'ساري لمدة 15 يوماً';
    const client = safeGet('input-quo-client') ? safeGet('input-quo-client').value : 'شركة الاستثمارات المستقبلية';
    const project = safeGet('input-quo-project') ? safeGet('input-quo-project').value : 'مشروع توريد وتتركيب كاميرات المراقبة';
    const rawTerms = safeGet('input-quo-terms') ? safeGet('input-quo-terms').value : '';

    safeSetText('disp-quo-no', quoNo);
    safeSetText('disp-quo-validity', validity);
    safeSetText('disp-quo-client', client);
    safeSetText('disp-quo-project', project);

    safeSetValue('input-recipient', client);
    safeSetValue('input-subject', `عرض سعر تجاري رقم: (${quoNo}) - ${project}`);

    const termsList = safeGet('disp-quo-terms-list');
    if (termsList) {
        termsList.innerHTML = '';
        const lines = rawTerms.split('\n').filter(l => l.trim() !== '');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line;
            termsList.appendChild(p);
        });
    }

    updateContent();
}

// Standalone HR & Admin Letters Module Engine
function loadHrPreset(hrType) {
    const comp = companiesData[activeCompanyId];
    const coName = comp ? comp.arName : 'الشركة';

    if (hrType === 'car_auth') {
        safeSetValue('input-recipient', "إلى: إدارة المرور والجهات الأمنية المحترمين");
        safeSetValue('input-subject', "الموضوع: خطاب تفويض قيادة مركبة شركة رسمية داخل المملكة");
        safeSetValue('input-salutation', "السلام عليكم ورحمة الله وبركاته،،،");
        safeSetValue('input-body', `تفيد ${coName} بتفويض الموظف الموضحة بياناته أدناه قيادة واستخدام المركبة المملوكة للشركة، واستخدامها في تنقلاته وأعماله الرسمية داخل كافة مناطق المملكة العربية السعودية.

المفوض بالقيادة: م. عبدالملك بن سلطان (رقم الهوية: 1087654321)
صفته الوظيفية: الرئيس التنفيذي
صلاحية التفويض: ساري لمدة سنة كاملة من تاريخ إصدار الخطاب.

نأمل من كافة الجهات المعنية التكرم بتسهيل مهامه وتسهيل تنقلاته.`);
        
        tableHeaders = ["م", "نوع المركبة / الموديل", "رقم اللوحة", "رقم الهيكل VIN", "سنة الصنع"];
        tableRows = [
            ["1", "تويوتا كامري (Toyota Camry LE)", "أ ب ج 1 2 3 4", "JTMBF11K8MD123456", "2025 M"],
            ["2", "نيسان باترول (Nissan Patrol)", "س ص ع 9 8 7 6", "JN8AY0AR3NW987654", "2026 M"]
        ];
        isVatEnabled = false;
        const vatCheck = safeGet('calc-vat-check');
        if (vatCheck) vatCheck.checked = false;
    } else if (hrType === 'job_offer') {
        safeSetValue('input-recipient', "السيد / أحمد بن خالد المحترم (المرشح للوظيفة)");
        safeSetValue('input-subject', "الموضوع: عرض عمل وظيفي رسمي (Official Job Offer)");
        safeSetValue('input-salutation', "تحية طيبة وبعد،،،");
        safeSetValue('input-body', `يسر إدارة ${coName} أن تقدم لكم عرض العمل الوظيفي للانضمام لفريق عملنا وفق الشروط والمميزات التالية:

• المسمى الوظيفي: مدير مشاريع تقنية وحوكمة
• فترة التجربة: (90 يوماً) قابلة للتمديد وفق نظام العمل السعودي.
• الإجازة السنوية: (30 يوماً) مدفوعة الأجر سنوياً مع تذاكر سفر.
• التأمين الطبي: تأمين طبي فئة ممتازة (VIP) للموظف وعائلته.

نأمل منكم الاطلاع على تفاصيل البدلات بالجدول أدناه والتوقيع بالموافقة لإصدار العقد النهائي.`);

        tableHeaders = ["م", "البند / الميزة المالية", "المبلغ الشهري (ريال)", "طريقة الصرف"];
        tableRows = [
            ["1", "الراتب الأساسي (Basic Salary)", "18000", "شهرياً بالحساب البنكي"],
            ["2", "بدل السكن (Housing Allowance)", "4500", "شهرياً"],
            ["3", "بدل المواصلات (Transport Allowance)", "1500", "شهرياً"],
            ["4", "إجمالي البكج الشهري (Total Package)", "24000", "شهرياً"]
        ];
        isVatEnabled = false;
        const vatCheck = safeGet('calc-vat-check');
        if (vatCheck) vatCheck.checked = false;
    } else if (hrType === 'subcontractor_auth') {
        safeSetValue('input-recipient', "السادة / شركة الأفق للمقاولات والتجهيزات المحترمين");
        safeSetValue('input-subject', "الموضوع: خطاب تعميد وتكليف رسمي بموجب عقد مقاولة باطن");
        safeSetValue('input-salutation', "السلام عليكم ورحمة الله وبركاته،،،");
        safeSetValue('input-body', `نفيدكم بتعميد شركتكم الموقرة رسمياً للبدء فوراً في تنفيذ أعمال المقاولة بالباطن الخاصة بمشروع (تجهيز الأبراج والشبكات الكهروميكانيكية بالرياض).

تلتزم مؤسستكم بالبدء الميداني خلال (3 أيام) من تاريخه، وتطبيق كافة الاشتراطات ومعايير السلامة والجودة المعتمدة في موقع المشروع.`);
        
        loadTablePreset('boq');
    } else if (hrType === 'govt_auth') {
        safeSetValue('input-recipient', "إلى: المديرية العامة للجوازات والجهات الحكومية المحترمين");
        safeSetValue('input-subject', "الموضوع: خطاب تفويض رسمي لمراجعة الجوازات والقطاعات الحكومية");
        safeSetValue('input-salutation', "السلام عليكم ورحمة الله وبركاته،،،");
        safeSetValue('input-body', `تفيد ${coName} بتفويض الموظف المذكور أدناه لمراجعة كافة إدارات الجوازات، ومكاتب العمل، والغرف التجارية، واستخراج ونقل وإلغاء تأشيرات الإقامة وكافة المعاملات الخاصة بعمالة وموظفي الشركة:

اسم المفوض: أ. صالح بن عبدالله العتيبي
رقم الهوية الوطنية: 1055443322
الصفة الوظيفية: معقب وممثل الشؤون الإدارية

هذا التفويض ساري المفعول لمدة سنة ميلادية كاملة من تاريخ إصدار الخطاب.`);
        
        isTableVisible = false;
        const tableCheck = safeGet('show-table-check');
        if (tableCheck) tableCheck.checked = false;
    }

    isTableVisible = true;
    const tableCheck = safeGet('show-table-check');
    if (tableCheck) tableCheck.checked = true;
    renderDynamicTable();
    updateContent();
}

// Payment Receipt Voucher Updates Engine
function updateReceiptVoucher() {
    const voucherNo = safeGet('input-receipt-no') ? safeGet('input-receipt-no').value : 'REC-2026-089';
    const amountVal = parseFloat(safeGet('input-receipt-amount') ? safeGet('input-receipt-amount').value : 0) || 0;
    const payer = safeGet('input-receipt-payer') ? safeGet('input-receipt-payer').value : 'شركة الاستثمارات المستقبلية';
    const payMethod = safeGet('input-receipt-pay-method') ? safeGet('input-receipt-pay-method').value : 'bank';
    const chequeNo = safeGet('input-receipt-cheque-no') ? safeGet('input-receipt-cheque-no').value : '';
    const chequeBank = safeGet('input-receipt-cheque-bank') ? safeGet('input-receipt-cheque-bank').value : '';
    const reason = safeGet('input-receipt-reason') ? safeGet('input-receipt-reason').value : '';
    const accountant = safeGet('input-receipt-accountant') ? safeGet('input-receipt-accountant').value : 'أحمد بن صالح';
    const manager = safeGet('input-receipt-manager') ? safeGet('input-receipt-manager').value : 'م. عبدالملك بن سلطان';

    safeDisplay('cheque-details-row', (payMethod === 'cheque') ? 'flex' : 'none');

    safeSetText('disp-receipt-no', voucherNo);
    safeSetText('disp-receipt-amount', amountVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    safeSetText('disp-receipt-payer', payer);
    safeSetText('disp-receipt-payer-sign', payer);
    safeSetText('disp-receipt-tafqeet', tafqeetArabic(amountVal));
    safeSetText('disp-receipt-reason', reason);
    safeSetText('disp-receipt-accountant', accountant);
    safeSetText('disp-receipt-manager', manager);

    const badge = safeGet('disp-receipt-pay-method-badge');
    const chequeInfo = safeGet('disp-receipt-cheque-info');

    if (badge && chequeInfo) {
        if (payMethod === 'cheque') {
            badge.textContent = '📝 شيك بنكي';
            chequeInfo.textContent = `(رقم الشيك: ${chequeNo} - البنك: ${chequeBank})`;
            chequeInfo.style.display = 'inline';
        } else if (payMethod === 'cash') {
            badge.textContent = '💵 نقداً (Cash)';
            chequeInfo.style.display = 'none';
        } else if (payMethod === 'mada') {
            badge.textContent = '📲 مدى / بطاقة ائتمانية';
            chequeInfo.style.display = 'none';
        } else {
            badge.textContent = '💳 تحويل بنكي (Bank Transfer)';
            chequeInfo.style.display = 'none';
        }
    }

    updateQrCode();
}

// Set Multi-Page Layout Mode (Page 1 & Page 2 with complete Headers & Footers)
function setPageLayoutMode(pageCount) {
    totalPagesCount = parseInt(pageCount, 10);
    const p2 = safeGet('letterhead-page-2');
    const p1Num = safeGet('p1-page-num');
    const p1Sigs = document.querySelectorAll('.p1-only-signatures');

    if (totalPagesCount >= 2 && currentAppMode !== 'receipt') {
        if (p2) p2.style.display = 'flex';
        if (p1Num) p1Num.textContent = `صفحة 1 من 2`;
        p1Sigs.forEach(el => el.style.display = 'none');
    } else {
        if (p2) p2.style.display = 'none';
        if (p1Num) p1Num.textContent = `صفحة 1 من 1`;
        if (currentAppMode === 'contract') {
            const dualBlock = document.querySelector('.p1-only-signatures.paper-dual-signatures-block');
            const singleBlock = document.querySelector('.p1-only-signatures.paper-single-signature-block');
            if (dualBlock) dualBlock.style.display = isDualSignaturesVisible ? 'grid' : 'none';
            if (singleBlock) singleBlock.style.display = isDualSignaturesVisible ? 'none' : 'flex';
        } else {
            const dualBlock = document.querySelector('.p1-only-signatures.paper-dual-signatures-block');
            const singleBlock = document.querySelector('.p1-only-signatures.paper-single-signature-block');
            if (dualBlock) dualBlock.style.display = 'none';
            if (singleBlock) singleBlock.style.display = 'flex';
        }
    }
    syncMultiPageHeadersAndFooters();
}

// Sync Headers, Watermarks, Footers & Branding across all pages
function syncMultiPageHeadersAndFooters() {
    const comp = companiesData[activeCompanyId];
    if (!comp) return;

    document.querySelectorAll('.display-co-ar').forEach(el => el.textContent = comp.arName);
    document.querySelectorAll('.display-co-sub').forEach(el => el.textContent = comp.subAr);
    document.querySelectorAll('.display-co-en').forEach(el => el.textContent = comp.enName);
    document.querySelectorAll('.display-co-en-sub').forEach(el => el.textContent = comp.enSub);
    document.querySelectorAll('.val-cr').forEach(el => el.textContent = comp.cr);
    document.querySelectorAll('.val-cr-en').forEach(el => el.textContent = comp.cr);
    document.querySelectorAll('.val-vat').forEach(el => el.textContent = comp.vat || '300123456700003');
    document.querySelectorAll('.val-vat-en').forEach(el => el.textContent = comp.vat || '300123456700003');

    const phoneVal = safeGet('input-co-phone') ? safeGet('input-co-phone').value : comp.phone;
    const emailVal = safeGet('input-co-email') ? safeGet('input-co-email').value : comp.email;
    const webVal = safeGet('input-co-web') ? safeGet('input-co-web').value : comp.web;
    const addrVal = safeGet('input-co-address') ? safeGet('input-co-address').value : comp.address;

    document.querySelectorAll('.disp-phone').forEach(el => el.textContent = phoneVal);
    document.querySelectorAll('.disp-email').forEach(el => el.textContent = emailVal);
    document.querySelectorAll('.disp-web').forEach(el => el.textContent = webVal);
    document.querySelectorAll('.disp-address').forEach(el => el.textContent = addrVal);

    document.querySelectorAll('.paper-main-logo-img').forEach(el => el.src = comp.logoImg);
    document.querySelectorAll('.paper-watermark-img').forEach(el => el.src = comp.logoImg);
    document.querySelectorAll('.seal-small-logo-img').forEach(el => el.src = comp.logoImg);

    updateQrCode();
}

// Update Contract Lifecycle Status Badge
function updateContractLifecycleBadge(statusClass) {
    const bars = document.querySelectorAll('.contract-status-bar');
    const textSpans = document.querySelectorAll('.contract-status-text');

    bars.forEach(bar => bar.className = `contract-status-bar ${statusClass}`);

    textSpans.forEach(span => {
        if (statusClass === 'status-draft') span.textContent = '🟡 مسودة عقد - غير نهائي (Draft)';
        else if (statusClass === 'status-review') span.textContent = '🔵 قيد التوقيع والمراجعة (Under Review)';
        else if (statusClass === 'status-active') span.textContent = '🟢 عقد ساري ومفعل رسمياً (Active Contract)';
        else if (statusClass === 'status-completed') span.textContent = '🟣 عقد مكتمل ومسلم بالكامل (Completed)';
    });
}

// Update Contract Parties Info
function updateContractParties() {
    const p1Rep = safeGet('input-p1-rep') ? safeGet('input-p1-rep').value : '';
    const p2Name = safeGet('input-p2-name') ? safeGet('input-p2-name').value : '';
    const p2Cr = safeGet('input-p2-cr') ? safeGet('input-p2-cr').value : '';
    const p2Rep = safeGet('input-p2-rep') ? safeGet('input-p2-rep').value : '';

    document.querySelectorAll('.disp-p1-rep').forEach(el => el.textContent = p1Rep);
    document.querySelectorAll('.disp-p1-rep-sign').forEach(el => el.textContent = p1Rep);

    document.querySelectorAll('.disp-p2-name').forEach(el => el.textContent = p2Name);
    document.querySelectorAll('.disp-p2-name-sign').forEach(el => el.textContent = p2Name);
    document.querySelectorAll('.disp-p2-cr').forEach(el => el.textContent = p2Cr);
    document.querySelectorAll('.disp-p2-rep').forEach(el => el.textContent = p2Rep);
    document.querySelectorAll('.disp-p2-rep-sign').forEach(el => el.textContent = p2Rep);
}

// Render Checked Legal Clauses
function renderLegalClauses() {
    const container = document.querySelector('.legal-clauses-list-p2');
    if (!container) return;

    container.innerHTML = '';

    const addClause = (num, title, text) => {
        const item = document.createElement('div');
        item.className = 'clause-item prevent-page-break';
        item.innerHTML = `<strong>بند (${num}) - ${title}:</strong> ${text}`;
        container.appendChild(item);
    };

    let count = 1;

    const jurCheck = safeGet('clause-jurisdiction-check');
    if (jurCheck && jurCheck.checked) {
        addClause(count++, "الاختصاص القضائي والقانون الواجب التطبيق", "يخضع هذا العقد وتفسيره للأنظمة واللوائح المعتمدة في المملكة العربية السعودية، وتختص المحاكم الرياض للنظر في أي نزاع قد ينشأ لا قدر الله.");
    }

    const penCheck = safeGet('clause-penalty-check');
    if (penCheck && penCheck.checked) {
        addClause(count++, "الشرط الجزائي وغرامة التأخير", "في حال تأخر الطرف الثاني عن تنفيذ الالتزامات في المواعيد المحددة، تفرض غرامة تأخير قدرها (1,000 ريال) عن كل يوم تأخير بحد أقصى 10% من إجمالي العقد.");
    }

    const forceCheck = safeGet('clause-force-majeure-check');
    if (forceCheck && forceCheck.checked) {
        addClause(count++, "القوة القاهرة والظروف الطارئة", "لا يتحمل أي من الطرفين مسؤولية التأخير الناجم عن أحداث القوة القاهرة أو القرارات الحكومية المباشرة المؤثرة على التوريد والعمل.");
    }

    const ndaCheck = safeGet('clause-nda-check');
    if (ndaCheck && ndaCheck.checked) {
        addClause(count++, "سرية المعلومات والمستندات (NDA)", "يتعهد الطرفان بالحفاظ على سرية كافة البيانات الفنية والمالية والمستندات المتبادلة وعدم الإفصاح عنها لأي طرف ثالث دون موافقة خطية.");
    }

    const warCheck = safeGet('clause-warranty-check');
    if (warCheck && warCheck.checked) {
        addClause(count++, "الضمان والصيانة والدعم الفني", "يلتزم الطرف الأول بتقديم ضمان شامل وقطع غيار أصلية وصيانة مجانية للمشروع لمدة (سنتان ميلاديتان) تبدأ من تاريخ التسليم الابتدائي.");
    }
}

function toggleDualSignaturesDisplay(show) {
    isDualSignaturesVisible = show;
    const dualSigsP2 = document.querySelector('.paper-dual-signatures-block-p2');
    const singleSigP2 = document.querySelector('.paper-single-signature-block-p2');

    if (dualSigsP2 && singleSigP2) {
        dualSigsP2.style.display = show ? 'grid' : 'none';
        singleSigP2.style.display = show ? 'none' : 'flex';
    }
}

// Robust Auto Calculation Helper
function calculateTableSubtotal() {
    let subtotal = 0;
    let amountColIndex = -1;

    tableHeaders.forEach((header, index) => {
        const h = String(header).toLowerCase();
        if (h.includes('مبلغ') || h.includes('سعر') || h.includes('كلي') || h.includes('إجمالي') || h.includes('price') || h.includes('amount') || h.includes('total')) {
            amountColIndex = index;
        }
    });

    if (amountColIndex === -1 && tableHeaders.length > 0) {
        amountColIndex = tableHeaders.length - 1;
    }

    tableRows.forEach(row => {
        if (row[amountColIndex] !== undefined) {
            const raw = String(row[amountColIndex]);
            const cleaned = raw.replace(/,/g, '').replace(/[^\d.-]/g, '');
            const val = parseFloat(cleaned);
            if (!isNaN(val) && val > 0) {
                subtotal += val;
            }
        }
    });

    return { subtotal, amountColIndex };
}

// Arabic Tafqeet (Number to Words) Engine
function tafqeetArabic(num) {
    if (isNaN(num) || num === 0) return "صفر ريال سعودي";
    
    const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
    const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
    const hundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];

    const integerPart = Math.floor(num);

    function convertGroup(n) {
        let str = "";
        const h = Math.floor(n / 100);
        const t = Math.floor((n % 100) / 10);
        const o = n % 10;

        if (h > 0) str += hundreds[h] + " ";
        if (t === 1 && o > 0) {
            const elevenToNineteen = ["عشر", "أحد عشر", "إثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
            str += elevenToNineteen[o] + " ";
        } else {
            if (o > 0) str += ones[o] + " ";
            if (t > 0) str += (o > 0 ? "و" : "") + tens[t] + " ";
        }
        return str.trim();
    }

    let result = "";
    const thousands = Math.floor(integerPart / 1000);
    const remainder = integerPart % 1000;

    if (thousands > 0) {
        if (thousands === 1) result += "ألف ";
        else if (thousands === 2) result += "ألفان ";
        else if (thousands >= 3 && thousands <= 10) result += convertGroup(thousands) + " آلاف ";
        else result += convertGroup(thousands) + " ألف ";
    }

    if (remainder > 0) {
        if (result !== "") result += "و";
        result += convertGroup(remainder) + " ";
    }

    return `فقط ${result.trim()} ريال سعودي لا غير.`;
}

// Dynamic Table Engine & Auto VAT Calculation
function renderDynamicTable() {
    const tableWrappers = document.querySelectorAll('.paper-table-wrapper');
    const paperTables = document.querySelectorAll('.paper-dynamic-table');
    if (!tableWrappers || !paperTables) return;

    tableWrappers.forEach(w => w.style.display = isTableVisible ? 'block' : 'none');
    if (!isTableVisible) return;

    paperTables.forEach(t => t.className = `paper-table ${currentTableTheme} paper-dynamic-table`);

    // Render Table Headers
    document.querySelectorAll('.paper-table-head-tr').forEach(headTr => {
        headTr.innerHTML = '';
        tableHeaders.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headTr.appendChild(th);
        });
    });

    // Render Table Body
    document.querySelectorAll('.paper-table-body').forEach(tbody => {
        tbody.innerHTML = '';
        tableRows.forEach((rowCells, rIndex) => {
            const tr = document.createElement('tr');
            tr.className = 'prevent-page-break';
            rowCells.forEach((cellValue, cIndex) => {
                const td = document.createElement('td');
                td.contentEditable = "true";
                td.textContent = cellValue;
                
                td.oninput = function() {
                    tableRows[rIndex][cIndex] = this.textContent;
                    updateVatFooterDisplay();
                };

                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    });

    updateVatFooterDisplay();
    renderSidebarTableRowsControls();
}

function updateVatFooterDisplay() {
    const tfoots = document.querySelectorAll('.paper-table-tfoot');
    const tafqeetPaperBoxes = document.querySelectorAll('.tafqeet-paper-box');
    const tafqeetTextDisps = document.querySelectorAll('.tafqeet-text-disp');

    const { subtotal } = calculateTableSubtotal();
    let finalAmount = subtotal;

    tfoots.forEach(tfoot => {
        tfoot.innerHTML = '';
        if (isVatEnabled && subtotal > 0) {
            const vatAmount = subtotal * 0.15;
            const grandTotal = subtotal + vatAmount;
            finalAmount = grandTotal;
            const totalCols = tableHeaders.length;
            const labelColspan = Math.max(1, totalCols - 1);

            const formatNum = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ريال";

            tfoot.innerHTML = `
                <tr class="paper-table-total prevent-page-break">
                    <td colspan="${labelColspan}" style="text-align:left; font-weight:700; padding:6px 12px;">المجموع الفرعي (قبل الضريبة):</td>
                    <td style="font-weight:700; text-align:center; padding:6px 12px;">${formatNum(subtotal)}</td>
                </tr>
                <tr class="paper-table-total prevent-page-break">
                    <td colspan="${labelColspan}" style="text-align:left; font-weight:700; color:var(--gold-primary); padding:6px 12px;">ضريبة القيمة المضافة (15% VAT):</td>
                    <td style="font-weight:700; color:var(--gold-primary); text-align:center; padding:6px 12px;">${formatNum(vatAmount)}</td>
                </tr>
                <tr class="paper-table-total prevent-page-break">
                    <td colspan="${labelColspan}" style="text-align:left; font-weight:800; font-size:0.85rem; background:rgba(197,160,89,0.18) !important; padding:7px 12px;">الإجمالي النهائي الشامل للضريبة:</td>
                    <td style="font-weight:800; font-size:0.85rem; background:rgba(197,160,89,0.18) !important; text-align:center; padding:7px 12px;">${formatNum(grandTotal)}</td>
                </tr>
            `;
        }
    });

    // Update Tafqeet Text
    if (finalAmount > 0) {
        const tafqeetText = tafqeetArabic(finalAmount);
        tafqeetTextDisps.forEach(el => el.textContent = tafqeetText);
        tafqeetPaperBoxes.forEach(el => el.style.display = isTafqeetVisible ? 'block' : 'none');
    } else {
        tafqeetPaperBoxes.forEach(el => el.style.display = 'none');
    }

    updateQrCode();
}

function toggleTafqeetDisplay(show) {
    isTafqeetVisible = show;
    updateVatFooterDisplay();
}

function toggleBankCardDisplay(show) {
    isBankCardVisible = show;
    document.querySelectorAll('.paper-bank-card').forEach(card => card.style.display = show ? 'block' : 'none');
}

function setFinancialStampOverlay(status) {
    const stamps = document.querySelectorAll('.financial-status-stamp');
    const textSpans = document.querySelectorAll('.financial-stamp-text');

    stamps.forEach(stamp => {
        if (status === 'none') {
            stamp.style.display = 'none';
        } else {
            stamp.className = `financial-status-stamp ${status}`;
            stamp.style.display = 'block';
        }
    });

    textSpans.forEach(textSpan => {
        if (status === 'stamp-paid') textSpan.textContent = 'مدفوع / PAID';
        else if (status === 'stamp-approved') textSpan.textContent = 'معتمد للصرف النهائي';
        else if (status === 'stamp-audit') textSpan.textContent = 'تحت التدقيق والمراجعة';
        else if (status === 'stamp-rejected') textSpan.textContent = 'مرفوض / PENDING REVISION';
    });
}

function updateBankCardInfo() {
    const name = safeGet('input-bank-name') ? safeGet('input-bank-name').value : '';
    const holder = safeGet('input-bank-holder') ? safeGet('input-bank-holder').value : '';
    const iban = safeGet('input-bank-iban') ? safeGet('input-bank-iban').value : '';

    const comp = companiesData[activeCompanyId];
    if (comp) {
        comp.bankName = name;
        comp.bankHolder = holder;
        comp.bankIban = iban;
    }

    document.querySelectorAll('.disp-bank-name').forEach(el => el.textContent = name);
    document.querySelectorAll('.disp-bank-holder').forEach(el => el.textContent = holder);
    document.querySelectorAll('.disp-bank-iban').forEach(el => el.textContent = `${iban}`);
}

function renderSidebarTableRowsControls() {
    const container = safeGet('sidebar-table-rows-container');
    if (!container) return;
    container.innerHTML = '';

    tableRows.forEach((row, rIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'sidebar-table-row-item';
        
        let rowHtml = `<button class="remove-row-btn" onclick="removeTableRow(${rIndex})" title="حذف الصف">&times;</button>`;
        rowHtml += `<div class="form-row mb-1">`;
        
        row.forEach((cell, cIndex) => {
            rowHtml += `
                <div class="col-6 mb-1">
                    <label style="font-size:0.7rem;">${tableHeaders[cIndex] || 'عمود ' + (cIndex+1)}:</label>
                    <input type="text" class="form-control" style="padding:4px 8px; font-size:0.8rem;" value="${cell}" oninput="updateTableCell(${rIndex}, ${cIndex}, this.value)">
                </div>
            `;
        });

        rowHtml += `</div>`;
        rowDiv.innerHTML = rowHtml;
        container.appendChild(rowDiv);
    });
}

function updateTableCell(rIndex, cIndex, value) {
    if (tableRows[rIndex]) {
        tableRows[rIndex][cIndex] = value;
        renderDynamicTable();
    }
}

function addTableRow() {
    const newIndex = tableRows.length + 1;
    tableRows.push([String(newIndex), "بند / بيان جديد", "10%", "10000"]);
    renderDynamicTable();
}

function removeTableRow(index) {
    tableRows.splice(index, 1);
    renderDynamicTable();
}

function toggleTableDisplay(show) {
    isTableVisible = show;
    renderDynamicTable();
}

function toggleVatCalculation(show) {
    isVatEnabled = show;
    renderDynamicTable();
}

function changeTableTheme(themeClass) {
    currentTableTheme = themeClass;
    renderDynamicTable();
}

// CSV Export & Import Engine
function exportTableToCsv() {
    let csvContent = "\ufeff";
    csvContent += tableHeaders.join(",") + "\n";

    tableRows.forEach(row => {
        const rowEscaped = row.map(cell => `"${cell.replace(/"/g, '""')}"`);
        csvContent += rowEscaped.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `جدول_الخطاب_${Date.now()}.csv`;
    link.click();
}

function importCsvToTable(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length > 0) {
            const parseCsvLine = (line) => line.split(',').map(cell => cell.replace(/^"(.*)"$/, '$1').trim());
            tableHeaders = parseCsvLine(lines[0]);
            tableRows = lines.slice(1).map(line => parseCsvLine(line));
            isTableVisible = true;
            const tableCheck = safeGet('show-table-check');
            if (tableCheck) tableCheck.checked = true;
            renderDynamicTable();
            alert('تم استيراد بيانات الجدول من ملف Excel/CSV بنجاح!');
        }
    };
    reader.readAsText(file);
}

// Load Table Presets
function loadTablePreset(presetType) {
    if (presetType === 'cctv_boq') {
        tableHeaders = ["البند", "اسم الأنظمة والعدسات / المواصفات", "الكمية", "الوحدة", "الإجمالي (ريال)"];
        tableRows = [
            ["1", "كاميرات مراقبة خارجية 8MP IP 4K لمتابعة المداخل", "16", "كاميرا", "24000"],
            ["2", "كاميرات مراقبة داخلية 5MP Dome للمكاتب", "16", "كاميرا", "16000"],
            ["3", "جهاز تسجيل شبكي NVR 64 Ch مع هاردسك 16TB", "1", "جهاز", "9500"],
            ["4", "كوابل CAT6 خارجية ومحولات ومستلزمات التركيب", "1", "مقطوعية", "8500"],
            ["5", "البرمجة والربط بالشبكة وشاشة العرض 55 بوصة", "1", "مجموعة", "7000"]
        ];
        isVatEnabled = true;
        const vatCheck = safeGet('calc-vat-check');
        if (vatCheck) vatCheck.checked = true;
    } else if (presetType === 'payments') {
        tableHeaders = ["البند", "بيان الدفعة / المرحلة", "النسبة", "المبلغ (ريال)"];
        tableRows = [
            ["1", "الدفعة الأولى المقدمة (عند توقيع العقد)", "25%", "37500"],
            ["2", "الدفعة الثانية (إتمام صب الخرسانات والأنظمة)", "40%", "60000"],
            ["3", "الدفعة الثالثة (إتمام الأعمال والتسليم الأولي)", "25%", "37500"],
            ["4", "الدفعة النهائية (عند التسليم وإخلاء الطرف)", "10%", "15000"]
        ];
        isVatEnabled = true;
        const vatCheck = safeGet('calc-vat-check');
        if (vatCheck) vatCheck.checked = true;
    } else if (presetType === 'boq') {
        tableHeaders = ["البند", "اسم المادة / الوصف الفني", "الكمية", "الوحدة", "السعر الكلي (ريال)"];
        tableRows = [
            ["1", "توريد وتركيب كوابل ومحولات كهربائية", "150", "متر", "45000"],
            ["2", "أعمال أنظمة السلامة وإطفاء الحريق", "1", "مقطوعية", "28000"],
            ["3", "لوحات تحكم وتوزيع كهروميكانيكية", "4", "مجموعة", "32000"]
        ];
        isVatEnabled = true;
        const vatCheck = safeGet('calc-vat-check');
        if (vatCheck) vatCheck.checked = true;
    } else if (presetType === 'attachments') {
        tableHeaders = ["م", "اسم المستند / المرفق الرسمـي", "عدد الصفحات", "الحالة / التوثيق"];
        tableRows = [
            ["1", "جدول الجدوى الاقتصادية والعروض المعتمدة", "5 صفحات", "معتمد رسمياً"],
            ["2", "نسخة السجل التجاري والتراخيص الحكومية", "2 صفحة", "ساري المفعول"],
            ["3", "مخططات ومواصفات هندسية تفصيلية", "12 صفحة", "نسخة طبق الأصل"]
        ];
        isVatEnabled = false;
        const vatCheck = safeGet('calc-vat-check');
        if (vatCheck) vatCheck.checked = false;
    }
    isTableVisible = true;
    const tableCheck = safeGet('show-table-check');
    if (tableCheck) tableCheck.checked = true;
    renderDynamicTable();
}

// Switch Company Profile
function switchCompanyProfile(companyId) {
    if (companyId === "custom_new") {
        addNewCompanyPrompt();
        return;
    }

    const comp = companiesData[companyId];
    if (!comp) return;

    activeCompanyId = companyId;

    safeSetValue('company-select-dropdown', companyId);
    safeSetText('active-company-header-title', comp.arName);

    document.querySelectorAll('.company-profile-card').forEach(c => c.classList.remove('active'));
    const activeCard = safeGet(`card-${companyId.replace('_', '-')}`);
    if (activeCard) activeCard.classList.add('active');

    // Fill Sidebar Inputs
    safeSetValue('input-co-ar', comp.arName);
    safeSetValue('input-co-sub', comp.subAr);
    safeSetValue('input-co-en', comp.enName);
    safeSetValue('input-co-en-sub', comp.enSub);
    safeSetValue('input-co-cr', comp.cr);
    safeSetValue('input-co-vat', comp.vat || '300123456700003');
    safeSetValue('input-co-phone', comp.phone);
    safeSetValue('input-co-email', comp.email);
    safeSetValue('input-co-web', comp.web);
    safeSetValue('input-co-address', comp.address);

    // Banking Inputs
    safeSetValue('input-bank-name', comp.bankName || 'البنك الأهلي السعودي');
    safeSetValue('input-bank-holder', comp.bankHolder || comp.arName);
    safeSetValue('input-bank-iban', comp.bankIban || 'SA44 1000 0001 2345 6789 0101');

    safeSetValue('input-seal-top', comp.sealTop);
    safeSetValue('input-seal-mid', comp.sealMid);
    safeSetValue('input-seal-bot', comp.sealBot);

    // Update Images
    const logoImgHeader = safeGet('active-company-header-logo');
    if (logoImgHeader) logoImgHeader.src = comp.logoImg;

    if (comp.sealImg) {
        document.querySelectorAll('.custom-stamp-img').forEach(el => {
            el.src = comp.sealImg;
            el.style.display = 'block';
        });
        document.querySelectorAll('.builtin-seal-container').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.official-seal').forEach(sealBadge => {
            sealBadge.style.border = 'none';
            sealBadge.style.background = 'transparent';
            sealBadge.style.boxShadow = 'none';
        });
    } else {
        removeUploadedStamp();
    }

    setThemeColor(comp.primaryColor, comp.darkColor);
    setSealInk(comp.sealInk);
    selectTemplate(comp.template);

    generateNewRefCode();
    updateCompanyInfo();
    updateBankCardInfo();
    updateContractParties();
    updateSealTexts();
    updateContent();
    updateReceiptVoucher();
    updateQuotationModule();
}

// Generate Sequential Reference Code
function generateNewRefCode() {
    const comp = companiesData[activeCompanyId];
    const code = comp ? (comp.code || 'DOC') : 'DOC';
    const year = new Date().getFullYear();
    const formattedCounter = String(refCounter).padStart(3, '0');
    const newRef = `${code}-${year}-${formattedCounter}`;
    
    safeSetValue('input-ref', newRef);
    document.querySelectorAll('.disp-ref').forEach(el => el.textContent = newRef);
    refCounter++;
    updateQrCode();
}

// Export as Microsoft Word Document (.doc)
function exportWordDocument() {
    const originalViewport = safeGet('paper-viewport');
    if (!originalViewport) return;

    const comp = companiesData[activeCompanyId];
    const compName = comp ? comp.arName.replace(/\s+/g, '_') : 'شركة';
    
    let docTitle = 'مستند_رسمي';
    if (currentAppMode === 'contract') docTitle = 'عقد_رسمي';
    else if (currentAppMode === 'receipt') docTitle = 'سند_قبض_رسمي';
    else if (currentAppMode === 'quotation') docTitle = 'عرض_سعر_تجاري';
    else if (currentAppMode === 'reports') docTitle = 'محضر_تقرير_رسمي';

    const clone = originalViewport.cloneNode(true);
    
    const htmlHeader = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${docTitle}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; }
                .a4-page { width: 100%; padding: 20px; page-break-after: always; }
                .header-brand-ar h2 { font-size: 20px; color: #1A1A1A; }
                .display-co-sub { color: #C5A059; font-weight: bold; }
                .paper-content-body { font-size: 14px; line-height: 1.8; margin-top: 20px; }
                .footer-details-grid { font-size: 11px; color: #555; border-top: 1px solid #C5A059; margin-top: 30px; padding-top: 10px; }
            </style>
        </head>
        <body dir='rtl'>
    `;
    const htmlFooter = "</body></html>";
    const fullHtml = htmlHeader + clone.innerHTML + htmlFooter;

    const blob = new Blob(['\ufeff', fullHtml], {
        type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docTitle}_${compName}_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Live Signature Canvas Engine
function initSignatureCanvas() {
    sigCanvas = safeGet('sig-pad');
    if (!sigCanvas) return;

    sigCtx = sigCanvas.getContext('2d');
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.strokeStyle = '#1A1A1A';

    const getPos = (e) => {
        const rect = sigCanvas.getBoundingClientRect();
        return {
            x: (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left,
            y: (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
        };
    };

    const startDraw = (e) => {
        isDrawing = true;
        const pos = getPos(e);
        sigCtx.beginPath();
        sigCtx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const pos = getPos(e);
        sigCtx.lineTo(pos.x, pos.y);
        sigCtx.stroke();
    };

    const stopDraw = () => { isDrawing = false; };

    sigCanvas.addEventListener('mousedown', startDraw);
    sigCanvas.addEventListener('mousemove', draw);
    sigCanvas.addEventListener('mouseup', stopDraw);
    sigCanvas.addEventListener('mouseleave', stopDraw);

    sigCanvas.addEventListener('touchstart', startDraw);
    sigCanvas.addEventListener('touchmove', draw);
    sigCanvas.addEventListener('touchend', stopDraw);
}

function clearSignatureCanvas() {
    if (sigCtx && sigCanvas) {
        sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    }
}

function applySignatureCanvas() {
    if (!sigCanvas) return;
    const dataUrl = sigCanvas.toDataURL('image/png');
    document.querySelectorAll('.applied-signature-img').forEach(imgElem => imgElem.src = dataUrl);
    document.querySelectorAll('.signature-draw-box').forEach(el => el.style.display = 'block');
}

// QR Code Generator (ZATCA VAT & Security Specs)
function updateQrCode() {
    const comp = companiesData[activeCompanyId];
    const coName = comp ? comp.arName : '';
    const vatId = comp ? (comp.vat || '') : '';
    const ref = safeGet('input-ref') ? safeGet('input-ref').value : '';

    let docTypeStr = 'خطاب رسمي';
    let subject = safeGet('input-subject') ? safeGet('input-subject').value : '';
    let grandTotal = 0;
    let vatAmt = 0;

    if (currentAppMode === 'receipt') {
        docTypeStr = 'سند قبض مالي معتمد';
        const receiptNo = safeGet('input-receipt-no') ? safeGet('input-receipt-no').value : '';
        subject = `سند قبض رقم: ${receiptNo}`;
        grandTotal = parseFloat(safeGet('input-receipt-amount') ? safeGet('input-receipt-amount').value : 0) || 0;
        vatAmt = 0;
    } else if (currentAppMode === 'quotation') {
        docTypeStr = 'عرض سعر تجاري رسمـي';
        const quoNo = safeGet('input-quo-no') ? safeGet('input-quo-no').value : '';
        subject = `عرض سعر رقم: ${quoNo}`;
        const { subtotal } = calculateTableSubtotal();
        vatAmt = isVatEnabled ? (subtotal * 0.15) : 0;
        grandTotal = subtotal + vatAmt;
    } else {
        docTypeStr = currentAppMode === 'contract' ? 'عقد موثق' : (currentAppMode === 'reports' ? 'محضر رسمي' : 'خطاب رسمي');
        const { subtotal } = calculateTableSubtotal();
        vatAmt = isVatEnabled ? (subtotal * 0.15) : 0;
        grandTotal = subtotal + vatAmt;
    }

    const qrData = encodeURIComponent(`نوع الوثيقة: ${docTypeStr}\nالمؤسسة: ${coName}\nالرقم الضريبي: ${vatId}\nالرقم الإشاري: ${ref}\nالموضوع: ${subject}\nالتاريخ: ${new Date().toLocaleDateString('ar-SA')}\nالمبلغ: ${grandTotal.toFixed(2)} ريال`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
    
    document.querySelectorAll('.qr-code-img').forEach(el => el.src = qrUrl);
}

function toggleQrCode(show) {
    document.querySelectorAll('.paper-qr-badge').forEach(badge => badge.style.display = show ? 'flex' : 'none');
}

// Archive Storage Management
function getArchiveFromStorage() {
    try {
        return JSON.parse(localStorage.getItem('letterhead_archive')) || [];
    } catch(e) {
        return [];
    }
}

function saveCurrentLetterToArchive() {
    const comp = companiesData[activeCompanyId];
    const archive = getArchiveFromStorage();

    const recipient = safeGet('input-recipient') ? safeGet('input-recipient').value : '';
    const subject = currentAppMode === 'receipt' ? `سند قبض: ${safeGet('input-receipt-no') ? safeGet('input-receipt-no').value : ''}` : (currentAppMode === 'quotation' ? `عرض سعر: ${safeGet('input-quo-no') ? safeGet('input-quo-no').value : ''}` : (safeGet('input-subject') ? safeGet('input-subject').value : ''));
    const body = safeGet('input-body') ? safeGet('input-body').value : '';
    const salutation = safeGet('input-salutation') ? safeGet('input-salutation').value : '';
    const closing = safeGet('input-closing') ? safeGet('input-closing').value : '';
    const signName = safeGet('input-sign-name') ? safeGet('input-sign-name').value : '';
    const signTitle = safeGet('input-sign-title') ? safeGet('input-sign-title').value : '';
    const date = safeGet('input-date') ? safeGet('input-date').value : '';
    const ref = currentAppMode === 'receipt' ? (safeGet('input-receipt-no') ? safeGet('input-receipt-no').value : '') : (currentAppMode === 'quotation' ? (safeGet('input-quo-no') ? safeGet('input-quo-no').value : '') : (safeGet('input-ref') ? safeGet('input-ref').value : ''));

    const letterItem = {
        id: Date.now(),
        mode: currentAppMode,
        companyId: activeCompanyId,
        companyName: comp ? comp.arName : '',
        recipient,
        subject,
        body,
        salutation,
        closing,
        signName,
        signTitle,
        date,
        ref,
        timestamp: new Date().toLocaleString('ar-SA')
    };

    archive.unshift(letterItem);
    localStorage.setItem('letterhead_archive', JSON.stringify(archive));
    updateArchiveBadgeCount();
    alert('تم حفظ الوثيقة / المحضر بنجاح في الأرشيف!');
}

function updateArchiveBadgeCount() {
    const archive = getArchiveFromStorage();
    safeSetText('archive-count-badge', archive.length);
}

function openArchiveModal() {
    safeDisplay('archive-modal', 'flex');
    renderArchiveList();
}

function closeArchiveModal() {
    safeDisplay('archive-modal', 'none');
}

function renderArchiveList() {
    const archive = getArchiveFromStorage();
    const searchInput = safeGet('archive-search-input');
    const filterText = searchInput ? searchInput.value.toLowerCase() : '';
    const container = safeGet('archive-list-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = archive.filter(item => 
        item.recipient.toLowerCase().includes(filterText) ||
        item.subject.toLowerCase().includes(filterText) ||
        item.companyName.toLowerCase().includes(filterText) ||
        item.ref.toLowerCase().includes(filterText)
    );

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:30px;">لا توجد وثائق محفوظة مطابقة في الأرشيف.</p>';
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'archive-item-card';
        
        let typeBadge = '✉️ خطاب رسمي';
        if (item.mode === 'contract') typeBadge = '📜 عقد رسمي';
        else if (item.mode === 'receipt') typeBadge = '🧾 سند قبض رسمي';
        else if (item.mode === 'quotation') typeBadge = '💼 عرض سعر';
        else if (item.mode === 'reports') typeBadge = '📋 محضر تقرير';

        card.innerHTML = `
            <div class="archive-item-info">
                <h4>[${typeBadge}] ${item.subject}</h4>
                <p>🏢 ${item.companyName} | 👤 ${item.recipient}</p>
                <span>الرقم الإشاري: ${item.ref} | التاريخ: ${item.timestamp}</span>
            </div>
            <div class="archive-item-actions">
                <button class="btn btn-gold" onclick="restoreArchivedLetter(${item.id})">
                    <i class="fa-solid fa-folder-open"></i> فتح
                </button>
                <button class="btn btn-pdf" onclick="deleteArchivedLetter(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function restoreArchivedLetter(id) {
    const archive = getArchiveFromStorage();
    const item = archive.find(i => i.id === id);
    if (!item) return;

    if (item.mode) switchAppMode(item.mode);
    if (item.companyId && companiesData[item.companyId]) {
        switchCompanyProfile(item.companyId);
    }

    safeSetValue('input-recipient', item.recipient);
    safeSetValue('input-subject', item.subject);
    safeSetValue('input-body', item.body);
    safeSetValue('input-salutation', item.salutation || 'السلام عليكم ورحمة الله وبركاته،،،');
    safeSetValue('input-closing', item.closing || 'وتقبلوا فائق الاحترام والتقدير،،،');
    safeSetValue('input-sign-name', item.signName);
    safeSetValue('input-sign-title', item.signTitle);
    safeSetValue('input-date', item.date);
    safeSetValue('input-ref', item.ref);

    updateContent();
    closeArchiveModal();
    alert('تم تحميل وسحب بيانات المستند المؤرشف في المحرر المباشر!');
}

function deleteArchivedLetter(id) {
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذا المستند من الأرشيف؟')) return;
    let archive = getArchiveFromStorage();
    archive = archive.filter(i => i.id !== id);
    localStorage.setItem('letterhead_archive', JSON.stringify(archive));
    updateArchiveBadgeCount();
    renderArchiveList();
}

// WhatsApp Direct Share
function shareWhatsApp() {
    const comp = companiesData[activeCompanyId];
    const coName = comp ? comp.arName : '';
    const recipient = safeGet('input-recipient') ? safeGet('input-recipient').value : '';
    const subject = safeGet('input-subject') ? safeGet('input-subject').value : '';
    const ref = safeGet('input-ref') ? safeGet('input-ref').value : '';
    
    let docTypeStr = 'الخطاب الرسمي';
    if (currentAppMode === 'contract') docTypeStr = 'العقد الرسمي';
    else if (currentAppMode === 'receipt') docTypeStr = 'سند القبض الرسمي';
    else if (currentAppMode === 'quotation') docTypeStr = 'عرض السعر التجاري';
    else if (currentAppMode === 'reports') docTypeStr = 'المحضر الرسمي';

    const message = `مرحباً،،،\nمرفق لكم ${docTypeStr} الصادر من *${coName}*\n*الموضوع:* ${subject}\n*الطرف الثاني / الموجه إليه:* ${recipient}\n*الرقم الإشاري:* ${ref}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Add New Custom Company Dynamic Helper
function addNewCompanyPrompt() {
    const name = prompt("أدخل اسم الشركة الجديدة (باللغة العربية):", "شركة الاستثمارات المتقدمة");
    if (!name) {
        safeSetValue('company-select-dropdown', activeCompanyId);
        return;
    }

    const newId = `company_${Object.keys(companiesData).length + 1}`;
    companiesData[newId] = {
        id: newId,
        code: "NEW",
        arName: name,
        subAr: "شركة مساهمة مقفلة",
        enName: "ADVANCED INVESTMENTS",
        enSub: "INVESTMENT CO.",
        cr: "7009988776",
        vat: "300998877600003",
        phone: "+966 11 200 3030",
        email: "info@advanced.sa",
        web: "www.advanced.sa",
        address: "الرياض - برج الاستثمار - طريق الملك فهد",
        primaryColor: "#1B4D3E",
        darkColor: "#0F2C23",
        logoImg: "logo.jpg",
        sealImg: "",
        template: "template-executive",
        sealInk: "#1B4D3E",
        sealTop: name,
        sealMid: "معتمد",
        sealBot: "س.ت 7009988776",
        bankName: "البنك الأهلي السعودي",
        bankHolder: name,
        bankIban: "SA99 1000 0000 0000 0000 0999",
        bankSwift: "NCBKSARI"
    };

    const select = safeGet('company-select-dropdown');
    if (select) {
        const opt = document.createElement('option');
        opt.value = newId;
        opt.textContent = `🏢 ${name}`;
        select.insertBefore(opt, select.lastElementChild);
    }

    switchCompanyProfile(newId);
}

// Handle Company Logo Upload
function handleCompanyLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const comp = companiesData[activeCompanyId];
        if (comp) {
            comp.logoImg = e.target.result;
            const headerLogo = safeGet('active-company-header-logo');
            if (headerLogo) headerLogo.src = e.target.result;
            document.querySelectorAll('.paper-main-logo-img').forEach(el => el.src = e.target.result);
            document.querySelectorAll('.paper-watermark-img').forEach(el => el.src = e.target.result);
            document.querySelectorAll('.seal-small-logo-img').forEach(el => el.src = e.target.result);
        }
    };
    reader.readAsDataURL(file);
}

// Live Content Updating
function updateContent() {
    const recipVal = safeGet('input-recipient') ? safeGet('input-recipient').value : '';
    const subjVal = safeGet('input-subject') ? safeGet('input-subject').value : '';
    const salutVal = safeGet('input-salutation') ? safeGet('input-salutation').value : '';
    const closVal = safeGet('input-closing') ? safeGet('input-closing').value : '';
    const signNameVal = safeGet('input-sign-name') ? safeGet('input-sign-name').value : '';
    const signTitleVal = safeGet('input-sign-title') ? safeGet('input-sign-title').value : '';

    document.querySelectorAll('.disp-recipient').forEach(el => el.textContent = recipVal);
    document.querySelectorAll('.disp-subject').forEach(el => el.textContent = subjVal);
    document.querySelectorAll('.disp-salutation').forEach(el => el.textContent = salutVal);
    document.querySelectorAll('.disp-closing').forEach(el => el.textContent = closVal);

    const rawBody = safeGet('input-body') ? safeGet('input-body').value : '';
    const paragraphs = rawBody.split('\n').filter(p => p.trim() !== '');
    
    document.querySelectorAll('.disp-body-paragraphs').forEach(container => {
        container.innerHTML = '';
        paragraphs.forEach(p => {
            const pElem = document.createElement('p');
            pElem.className = 'prevent-page-break';
            pElem.textContent = p;
            container.appendChild(pElem);
        });
    });

    document.querySelectorAll('.disp-sign-name').forEach(el => el.textContent = signNameVal);
    document.querySelectorAll('.disp-sign-title').forEach(el => el.textContent = signTitleVal);
    updateQrCode();
}

// Live Company Info Updating
function updateCompanyInfo() {
    const coAr = safeGet('input-co-ar') ? safeGet('input-co-ar').value : '';
    const coSub = safeGet('input-co-sub') ? safeGet('input-co-sub').value : '';
    const coEn = safeGet('input-co-en') ? safeGet('input-co-en').value : '';
    const coEnSub = safeGet('input-co-en-sub') ? safeGet('input-co-en-sub').value : '';
    const coCr = safeGet('input-co-cr') ? safeGet('input-co-cr').value : '';
    const coVat = safeGet('input-co-vat') ? safeGet('input-co-vat').value : '';

    const comp = companiesData[activeCompanyId];
    if (comp) {
        comp.arName = coAr;
        comp.subAr = coSub;
        comp.enName = coEn;
        comp.enSub = coEnSub;
        comp.cr = coCr;
        comp.vat = coVat;
    }

    syncMultiPageHeadersAndFooters();
}

// Template Switching
function selectTemplate(templateClass) {
    document.querySelectorAll('.a4-page').forEach(page => {
        page.className = `a4-page ${templateClass}` + (page.classList.contains('page-break-before') ? ' page-break-before' : '');
    });
    currentTemplate = templateClass;

    document.querySelectorAll('.template-card').forEach(card => card.classList.remove('active'));
    const targetCard = safeGet(`card-${templateClass}`);
    if (targetCard) targetCard.classList.add('active');
}

// Theme Color Accent
function setThemeColor(primaryGold, darkColor) {
    document.documentElement.style.setProperty('--gold-primary', primaryGold);
    document.documentElement.style.setProperty('--primary-dark', darkColor);
}

// Font Change
function changeFont(fontCss) {
    document.documentElement.style.setProperty('--paper-font', fontCss);
}

// Watermark Opacity
function updateWatermarkOpacity(val) {
    document.querySelectorAll('.watermark-container').forEach(wm => wm.style.opacity = val);
}

// Custom Stamp Handling & Styling
function handleStampUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        document.querySelectorAll('.custom-stamp-img').forEach(customImg => {
            customImg.src = e.target.result;
            customImg.style.display = 'block';
        });
        document.querySelectorAll('.builtin-seal-container').forEach(builtinContainer => builtinContainer.style.display = 'none');

        document.querySelectorAll('.official-seal').forEach(sealBadge => {
            sealBadge.style.border = 'none';
            sealBadge.style.background = 'transparent';
            sealBadge.style.boxShadow = 'none';
        });
    };
    reader.readAsDataURL(file);
}

function removeUploadedStamp() {
    document.querySelectorAll('.custom-stamp-img').forEach(customImg => {
        customImg.src = '';
        customImg.style.display = 'none';
    });
    document.querySelectorAll('.builtin-seal-container').forEach(builtinContainer => builtinContainer.style.display = 'flex');

    document.querySelectorAll('.official-seal').forEach(sealBadge => {
        sealBadge.style.border = '2px dashed var(--seal-ink)';
        sealBadge.style.background = 'rgba(255, 255, 255, 0.95)';
        sealBadge.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
    });
}

function setSealInk(colorHex) {
    document.documentElement.style.setProperty('--seal-ink', colorHex);
}

function updateSealTexts() {
    const top = safeGet('input-seal-top') ? safeGet('input-seal-top').value : '';
    const mid = safeGet('input-seal-mid') ? safeGet('input-seal-mid').value : '';
    const bot = safeGet('input-seal-bot') ? safeGet('input-seal-bot').value : '';

    document.querySelectorAll('.disp-seal-top').forEach(el => el.textContent = top);
    document.querySelectorAll('.disp-seal-mid').forEach(el => el.textContent = mid);
    document.querySelectorAll('.disp-seal-bot').forEach(el => el.textContent = bot);
}

// Zoom Controls
function adjustZoom(delta) {
    currentZoom = Math.min(Math.max(0.5, currentZoom + delta), 1.4);
    document.querySelectorAll('.a4-page').forEach(page => page.style.transform = `scale(${currentZoom})`);
    safeSetText('zoom-level', `${Math.round(currentZoom * 100)}%`);
}

function resetZoom() {
    currentZoom = 1.0;
    document.querySelectorAll('.a4-page').forEach(page => page.style.transform = `scale(1.0)`);
    safeSetText('zoom-level', '100%');
}

// Perfect Direct PDF Export using Active Viewport Container
function exportDirectPDF() {
    const originalViewport = safeGet('paper-viewport');
    if (!originalViewport) return;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.zIndex = '-9999';
    container.style.overflow = 'visible';
    container.style.background = '#FFFFFF';
    container.style.direction = 'rtl';

    const clone = originalViewport.cloneNode(true);
    clone.querySelectorAll('.a4-page').forEach(page => {
        page.style.transform = 'none';
        page.style.width = '210mm';
        page.style.height = '297mm';
        page.style.margin = '0';
        page.style.boxShadow = 'none';
    });

    container.appendChild(clone);
    document.body.appendChild(container);

    const comp = companiesData[activeCompanyId];
    const compName = comp ? comp.arName.replace(/\s+/g, '_') : 'شركة';
    
    let docTitle = 'خطاب_رسمي';
    if (currentAppMode === 'contract') docTitle = 'عقد_رسمي';
    else if (currentAppMode === 'receipt') docTitle = 'سند_قبض_رسمي';
    else if (currentAppMode === 'quotation') docTitle = 'عرض_سعر_تجاري';
    else if (currentAppMode === 'reports') docTitle = 'محضر_تقرير_رسمي';

    const opt = {
        margin:       0,
        filename:     `${docTitle}_${compName}_${Date.now()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            allowTaint: true, 
            logging: false,
            letterRendering: true,
            scrollY: 0,
            scrollX: 0
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
    };

    const btn = document.querySelector('.btn-pdf');
    const oldText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري تجهيز الـ PDF...';
        btn.disabled = true;
    }

    html2pdf().set(opt).from(clone).save().then(() => {
        if (document.body.contains(container)) document.body.removeChild(container);
        if (btn) {
            btn.innerHTML = oldText;
            btn.disabled = false;
        }
    }).catch(err => {
        console.error(err);
        if (document.body.contains(container)) document.body.removeChild(container);
        if (btn) {
            btn.innerHTML = oldText;
            btn.disabled = false;
        }
        alert('يمكنك استخدام زر طباعة للحصول على ملف PDF نقي ودقيق.');
    });
}

// Export as High Resolution Image PNG
function downloadAsImage() {
    const originalViewport = safeGet('paper-viewport');
    if (!originalViewport) return;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.zIndex = '-9999';
    container.style.overflow = 'visible';
    container.style.background = '#FFFFFF';
    container.style.direction = 'rtl';

    const clone = originalViewport.cloneNode(true);
    clone.querySelectorAll('.a4-page').forEach(page => {
        page.style.transform = 'none';
        page.style.width = '210mm';
        page.style.margin = '0';
        page.style.boxShadow = 'none';
    });

    container.appendChild(clone);
    document.body.appendChild(container);

    const comp = companiesData[activeCompanyId];
    const compName = comp ? comp.arName.replace(/\s+/g, '_') : 'شركة';
    
    let docTitle = 'خطاب_رسمي';
    if (currentAppMode === 'contract') docTitle = 'عقد_رسمي';
    else if (currentAppMode === 'receipt') docTitle = 'سند_قبض_رسمي';
    else if (currentAppMode === 'quotation') docTitle = 'عرض_سعر_تجاري';
    else if (currentAppMode === 'reports') docTitle = 'محضر_تقرير_رسمي';

    html2canvas(clone, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        letterRendering: true,
        scrollY: 0,
        scrollX: 0
    }).then(canvas => {
        if (document.body.contains(container)) document.body.removeChild(container);
        
        const link = document.createElement('a');
        link.download = `${docTitle}_${compName}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        if (document.body.contains(container)) document.body.removeChild(container);
        alert('حدث خطأ أثناء تصدير الصورة.');
        console.error(err);
    });
}
