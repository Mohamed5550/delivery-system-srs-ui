const app = document.querySelector('#app');
const picker = document.querySelector('#screenPicker');
const previewPicker = document.querySelector('#previewStatePicker');
const offlineToggle = document.querySelector('#offlineToggle');

const state = {
  offline: false,
  setupGranted: { location: false, notifications: false },
  deliveryTab: new URLSearchParams(location.search).get('tab') || 'pending',
  completedRange: new URLSearchParams(location.search).get('range') || 'today',
  selectedOutcome: '',
  selectedReason: '',
  selectedBranch: 'كل الفروع المرتبطة',
  orderStage: 'transit',
  currentOrderId: 'DLV-1044',
  currentOrderTitle: 'شارع مصطفى النحاس',
  currentResultType: '',
  notificationFilter: 'all',
  readNotifications: new Set(),
  preview: 'normal',
  sheet: new URLSearchParams(location.search).get('sheet') || null,
};

const icons = {
  package:'<path d="m7.5 4.27 9 5.15v9.16l-9 5.15-9-5.15V9.42z"/><path d="m-1.2 9.8 8.7 5 8.7-5M7.5 14.8v9" transform="translate(4.5 -4)"/>',
  map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  arrow:'<path d="m15 18-6-6 6-6"/>',
  pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19c7 0 2-14 8-14"/>',
  phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.3 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"/>',
  navigation:'<path d="m3 11 19-9-9 19-2-8z"/>',
  cloudOff:'<path d="m2 2 20 20M5.8 5.8A7 7 0 0 0 5 19h11.2M18.4 18.4A5 5 0 0 0 18 9h-1.3A7 7 0 0 0 8.5 5.1"/>',
  more:'<circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/>',
  eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2 5.5M20 4v7h-7"/>',
  camera:'<path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3z"/><circle cx="12" cy="13" r="3"/>',
  upload:'<path d="M12 16V4m0 0L7 9m5-5 5 5M4 20h16"/>',
  x:'<path d="m6 6 12 12M18 6 6 18"/>',
  alert:'<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5m0 3h.01"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
};

function icon(name,size=20){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.package}</svg>`}
function badge(type,label,ico='package'){return `<span class="badge ${type}">${icon(ico,13)}${label}</span>`}
function button(label,kind='primary',action='',extra=''){return `<button class="btn ${kind} ${extra}" ${action?`data-action="${action}"`:''}>${label}</button>`}

const screens = [
  ['signin','تسجيل الدخول'],['setup-location','إعداد الموقع'],['setup-notifications','إعداد الإشعارات'],['setup-complete','اكتمال الإعداد'],
  ['deliveries','التوصيلات'],['assignment','إسناد جديد'],['order','تفاصيل الطلب'],['arrival','تأكيد الوصول'],
  ['failure','فشل أو إرجاع'],['handoff','إعادة الإسناد'],['sync','حالة المزامنة'],['notifications','الإشعارات'],['profile','حسابي']
];

function current(){return location.hash.slice(1)||'signin'}
function go(id){location.hash=id}
function header(title,subtitle='',back=false,action=''){
  return `<header class="app-header">
    ${back?`<button class="icon-btn" data-action="back" aria-label="رجوع">${icon('arrow')}</button>`:''}
    <div class="header-copy"><h2>${title}</h2>${subtitle?`<p>${subtitle}</p>`:''}</div>
    ${action==='bell'?`<button class="icon-btn" data-action="notifications" aria-label="الإشعارات">${icon('bell')}<span class="notification-dot">3</span></button>`:''}
    ${action==='more'?`<button class="icon-btn" aria-label="المزيد">${icon('more')}</button>`:''}
  </header>`
}
function offline(){return state.offline?`<div class="offline-banner">${icon('cloudOff',16)}<span>غير متصل · 3 تحديثات معلقة</span><button data-action="sync">عرض المزامنة</button></div>`:''}
function nav(active){
  const items=[['deliveries','التوصيلات','package'],['notifications','الإشعارات','bell'],['profile','حسابي','user']];
  return `<nav class="bottom-nav">${items.map(([id,l,i])=>`<button class="nav-item ${active===id?'active':''}" data-go="${id}"><span class="nav-icon">${icon(i,19)}</span>${l}${id==='notifications'?'<span class="notification-dot">3</span>':''}</button>`).join('')}</nav>`
}
function toast(message){const node=document.createElement('div');node.className='toast';node.textContent=message;document.querySelector('#toastRegion').append(node);setTimeout(()=>node.remove(),2800)}
function previewState(){
  if(state.preview==='normal') return '';
  if(state.preview==='loading') return `<div class="preview-overlay" role="status"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card short"></div><span>جارٍ تحميل البيانات…</span></div>`;
  if(state.preview==='empty') return `<div class="preview-overlay">${icon('package',44)}<h2>لا توجد بيانات لعرضها</h2><p>ستظهر العناصر هنا عند توفرها.</p><button class="btn secondary" data-preview="normal">العودة للحالة العادية</button></div>`;
  return `<div class="preview-overlay error-state" role="alert">${icon('alert',44)}<h2>تعذر تحميل البيانات</h2><p>تحقق من الاتصال ثم حاول مرة أخرى.</p><button class="btn primary" data-preview="normal">إعادة المحاولة</button></div>`;
}

function setupIllustration(kind){
  if(kind==='complete') return `<img src="assets/images/setup-complete.png" alt="اكتمل إعداد التطبيق">`;
  if(kind==='location') return `<svg viewBox="0 0 220 150" aria-label="إعداد الموقع"><rect x="66" y="9" width="90" height="132" rx="20" fill="#eef2ff"/><rect x="74" y="20" width="74" height="106" rx="13" fill="#fff"/><path d="M111 41c-18 0-31 13-31 30 0 22 31 47 31 47s31-25 31-47c0-17-13-30-31-30Z" fill="#4f46e5"/><circle cx="111" cy="70" r="11" fill="#ecfeff"/><circle cx="111" cy="70" r="5" fill="#0891b2"/><path d="M36 118c25-17 40-7 57-19M127 117c17-13 30-10 50-24" stroke="#0891b2" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 9"/></svg>`;
  return `<svg viewBox="0 0 220 150" aria-label="إعداد الإشعارات"><rect x="66" y="9" width="90" height="132" rx="20" fill="#eef2ff"/><rect x="74" y="20" width="74" height="106" rx="13" fill="#fff"/><path d="M137 85H85c6-7 8-14 8-24a18 18 0 0 1 36 0c0 10 2 17 8 24Z" fill="#4f46e5"/><path d="M103 94h16c-2 7-14 7-16 0Z" fill="#0891b2"/><circle cx="139" cy="46" r="11" fill="#dc2626"/><text x="139" y="50" text-anchor="middle" font-size="11" font-family="system-ui" font-weight="700" fill="white">3</text><path d="M43 53h20M47 72h14M160 55h18M162 75h13" stroke="#0891b2" stroke-width="5" stroke-linecap="round"/></svg>`;
}

function signin(){return `<section class="screen auth-screen">
  <div class="brand-mark">${icon('route',34)}</div>
  <div class="auth-copy"><h1 class="page-title">تسجيل دخول السائق</h1><p class="lead">أدخل بياناتك للوصول إلى التوصيلات المسندة إليك</p></div>
  <div class="card auth-card stack-lg">
    <div class="field"><label>البريد الإلكتروني أو رقم الهاتف</label><div class="input-wrap">${icon('user',18)}<input dir="ltr" value="driver@example.com" aria-label="البريد الإلكتروني أو رقم الهاتف"></div></div>
    <div class="field"><label>كلمة المرور</label><div class="input-wrap">${icon('shield',18)}<input type="password" value="password" aria-label="كلمة المرور"><button class="icon-btn" aria-label="إظهار كلمة المرور">${icon('eye',17)}</button></div></div>
    <button class="btn ghost" data-action="forgot">نسيت كلمة المرور؟</button>
    ${button('تسجيل الدخول','primary','login','full')}
    <div class="row security-line">${icon('shield',14)}<span>اتصال آمن ومشفّر</span></div>
  </div><div class="version">الإصدار 0.3</div></section>`}

function setup(kind){
  const config={
    location:{step:1,title:'الموقع أثناء التوصيل',desc:'نستخدم موقعك بعد بدء التوصيل لعرض المسار للمحول والمشرف، ويتوقف الإرسال عند تسجيل النتيجة.',action:'السماح بالموقع',ico:'pin',granted:state.setupGranted.location,footer:'كيف نستخدم بياناتك؟'},
    notifications:{step:2,title:'إشعارات الطلبات',desc:'فعّل الإشعارات لاستلام الإسنادات الجديدة وتغييرات حالة الطلب فورًا.',action:'تفعيل الإشعارات',ico:'bell',granted:state.setupGranted.notifications,footer:'السابق'},
    complete:{step:3,title:'اكتمل الإعداد',desc:'تم تفعيل الموقع وإشعارات الطلبات. أنت جاهز لاستلام التوصيلات.',action:'',ico:'check',granted:true,footer:'مراجعة الإعدادات'}
  }[kind];
  const progress=`<div class="setup-progress">${[1,2,3].map(n=>`<span class="${n<=config.step?'active':''}"></span>`).join('')}</div>`;
  const summary=kind==='complete'?`<div class="setup-summary"><div class="summary-row"><span>الموقع أثناء التوصيل</span>${badge('delivered','مفعّل','check')}</div><div class="summary-row"><span>إشعارات الطلبات</span>${badge('delivered','مفعّلة','check')}</div></div>`:'';
  const permissionAction=kind==='complete'?'':button(config.granted?'تم التفعيل':config.action,config.granted?'success':'secondary',kind==='location'?'grant-location':'grant-notifications','full');
  const nextAction=kind==='complete'?'finish-setup':'next-setup';
  const nextLabel=kind==='complete'?'الانتقال إلى التوصيلات':'التالي';
  const nextDisabled=kind!=='complete'&&!config.granted?'disabled':'';
  const nextButton=`<button class="btn primary full" data-action="${nextAction}" ${nextDisabled}>${nextLabel}</button>`;
  return `<section class="screen">${header('إعداد التطبيق')}${progress}<div class="setup-body"><div class="setup-visual">${setupIllustration(kind)}</div><article class="card permission-card"><div class="permission-head"><span class="permission-icon" style="${kind==='complete'?'background:var(--emerald-50);color:var(--emerald-700)':''}">${icon(config.ico,20)}</span><div class="grow"><h3>${config.title}</h3></div>${badge(kind==='complete'?'delivered':config.granted?'delivered':'warning',kind==='complete'?'جاهز':config.granted?'تم التفعيل':'مطلوب',kind==='complete'?'check':'clock')}</div><p>${config.desc}</p>${summary}${permissionAction}</article></div><div class="action-dock">${nextButton}<button class="btn ghost" data-action="setup-footer">${config.footer}</button></div></section>`;
}

const shipments={
  pending:[{id:'DLV-1048',type:'assigned',label:'تم الإسناد',title:'الحي السابع، مدينة نصر',meta:'عنوان التوصيل متاح',timer:'00:24 للرد',action:'عرض وقبول'}],
  active:[{id:'DLV-1044',type:'transit',label:'جاري التوصيل',title:'شارع مصطفى النحاس',meta:'بدأ منذ 18 دقيقة',action:'عرض الطلب'},{id:'DLV-1041',type:'accepted',label:'تم القبول',title:'مكرم عبيد، مدينة نصر',meta:'بانتظار بدء التوصيل',action:'عرض الطلب'}],
  done:[{id:'DLV-1038',type:'delivered',label:'تم التوصيل',title:'عباس العقاد، مدينة نصر',meta:'اليوم، 12:42 م',action:'عرض التفاصيل'},{id:'DLV-1036',type:'returned',label:'تم الإرجاع',title:'شارع الطيران، مدينة نصر',meta:'اليوم، 10:15 ص',action:'عرض التفاصيل'},{id:'DLV-1029',type:'delivered',label:'تم التوصيل',title:'مكرم عبيد، مدينة نصر',meta:'أمس، 06:20 م',action:'عرض التفاصيل'}]
};
function completeOrder(type){
  const labels={delivered:'تم التوصيل',failed:'فشل التوصيل',returned:'تم الإرجاع'};
  const existing=shipments.active.find(x=>x.id===state.currentOrderId)||shipments.pending.find(x=>x.id===state.currentOrderId);
  shipments.active=shipments.active.filter(x=>x.id!==state.currentOrderId);
  shipments.pending=shipments.pending.filter(x=>x.id!==state.currentOrderId);
  shipments.done.unshift({id:state.currentOrderId,type,label:labels[type],title:existing?.title||state.currentOrderTitle,meta:'اليوم، الآن',action:'عرض التفاصيل'});
  state.deliveryTab='done';state.completedRange='today';state.orderStage='transit';state.currentResultType=type;state.selectedOutcome='';state.selectedReason='';
}
function shipmentCard(o){const action=o.type==='assigned'?'open-assignment':'open-order';return `<article class="card shipment-card" data-order="${o.id}"><div class="row-between">${badge(o.type,o.label,o.type==='transit'?'navigation':o.type==='delivered'?'check':'package')}<span class="ltr caption">#${o.id}</span></div><h3>${o.title}</h3><div class="shipment-meta"><span>${icon('clock',13)} ${o.meta}</span>${o.timer?`<span class="timer">${o.timer}</span>`:''}</div><div class="shipment-actions">${button(o.action,'primary',action,'full compact')}${o.type==='assigned'?button('رفض','secondary','reject','compact'):''}</div></article>`}
function dateFilters(){const labels={today:'اليوم',week:'7 أيام',month:'30 يومًا',custom:'فترة مخصصة'};return `<section class="date-filter" aria-label="تصفية الطلبات المكتملة حسب التاريخ"><div class="row-between"><div><strong>فترة العرض</strong><p>${state.completedRange==='custom'?'20 أغسطس — 30 أغسطس':labels[state.completedRange]}</p></div><span class="date-icon">${icon('calendar',18)}</span></div><div class="filter-chips">${['today','week','month'].map(id=>`<button data-date-range="${id}" class="${state.completedRange===id?'active':''}">${labels[id]}</button>`).join('')}<button data-action="custom-date" class="${state.completedRange==='custom'?'active':''}">${icon('calendar',14)} مخصصة</button></div></section>`}
function deliveries(){let list=shipments[state.deliveryTab];if(state.deliveryTab==='done'&&state.completedRange==='today')list=list.filter(x=>x.meta.startsWith('اليوم'));const activeCount=shipments.active.length;return `<section class="screen deliveries-screen">${header('التوصيلات','فرع مدينة نصر',false,'bell')}${offline()}<div class="screen-scroll"><div class="stack-lg"><article class="card active-count"><span class="info-icon">${icon('package',18)}</span><div><strong>${activeCount} ${activeCount===1?'طلب نشط':'طلبات نشطة'}</strong><p>يمكنك استلام طلبات إضافية دون حد أقصى</p></div></article><div class="tabs"><button data-tab="pending" class="${state.deliveryTab==='pending'?'active':''}">بانتظار الرد (${shipments.pending.length})</button><button data-tab="active" class="${state.deliveryTab==='active'?'active':''}">نشطة (${activeCount})</button><button data-tab="done" class="${state.deliveryTab==='done'?'active':''}">مكتملة (${shipments.done.length})</button></div>${state.deliveryTab==='done'?dateFilters():''}<div class="stack">${list.length?list.map(shipmentCard).join(''):`<div class="empty-state">${icon('package',40)}<h3>لا توجد طلبات</h3><p>لا توجد طلبات ضمن هذا التصنيف حاليًا.</p></div>`}</div></div></div>${nav('deliveries')}</section>`}

function assignment(){return `<section class="screen">${header('طلب توصيل جديد','ينتهي الإسناد خلال 24 ثانية',true)}<div class="screen-scroll with-action"><div class="row-between" style="margin-bottom:14px">${badge('assigned','تم الإسناد','package')}<strong class="countdown ltr">00:24</strong></div><div class="stack">${infoCard('pin','عنوان التوصيل','الحي السابع، شارع مصطفى النحاس<br>بجوار مسجد السلام')}${infoCard('package','ملخص الطلب','طلب صيدلية — 3 عناصر')}<article class="card"><div class="money-grid"><div class="money-box"><span>قيمة الطلب</span><strong class="ltr">450 ج.م</strong></div><div class="money-box"><span>رسوم التوصيل</span><strong class="ltr">35 ج.م</strong></div></div><div class="divider"></div><div class="row-between small"><span class="muted">الفرع</span><strong>مدينة نصر</strong></div></article></div></div><div class="action-dock">${button('قبول الطلب','primary','accept-assignment','full')}${button('رفض الطلب','secondary','reject','full')}</div></section>`}

function timeline(){const started=state.orderStage!=='accepted';const arrived=state.orderStage==='arrived';return `<div class="timeline"><div class="timeline-step done"><i>${icon('check',12)}</i><span>تم الإسناد</span></div><b class="timeline-line done"></b><div class="timeline-step done"><i>${icon('check',12)}</i><span>تم القبول</span></div><b class="timeline-line ${started?'done':''}"></b><div class="timeline-step ${started?'done':'current'}"><i>${started?icon('check',12):''}</i><span>بدأ التوصيل</span></div><b class="timeline-line ${arrived?'done':''}"></b><div class="timeline-step ${arrived?'current':''}"><i></i><span>النتيجة</span></div></div>`}
function infoCard(ico,title,body,action=''){return `<article class="card info-card"><div class="row"><span class="info-icon">${icon(ico,18)}</span><div class="grow"><h3>${title}</h3><p>${body}</p></div>${action}</div></article>`}
function order(){const accepted=state.orderStage==='accepted';const arrived=state.orderStage==='arrived';const status=accepted?badge('accepted','تم القبول','check'):badge('transit',arrived?'تم تأكيد الوصول':'جاري التوصيل',arrived?'pin':'navigation');const next=accepted?button('بدء التوصيل','primary','start-delivery','full'):arrived?button('تسجيل نتيجة التوصيل','primary','result','full'):button('تأكيد الوصول إلى العنوان','primary','arrived','full');return `<section class="screen">${header('تفاصيل الطلب',`#${state.currentOrderId}`,true,'more')}<div class="screen-scroll with-action"><div class="row-between" style="margin-bottom:12px">${status}<span class="caption">${accepted?'بانتظار البدء':arrived?'تم الوصول الآن':'بدأ منذ 18 دقيقة'}</span></div>${timeline()}<div class="stack">${infoCard('user','أحمد محمد','010 •••• 4281',`<button class="icon-btn" data-action="call" aria-label="اتصال">${icon('phone',18)}</button>`)}${infoCard('pin','عنوان التوصيل','الحي السابع، شارع مصطفى النحاس<br>بجوار مسجد السلام',`<button class="btn secondary compact" data-action="copy-address">نسخ العنوان</button>`)}<article class="card"><h3 class="section-title">بيانات الطلب</h3><p class="small muted">أدوية — 3 عناصر</p><div class="money-grid"><div class="money-box"><span>قيمة الطلب</span><strong class="ltr">450 ج.م</strong></div><div class="money-box"><span>رسوم التوصيل</span><strong class="ltr">35 ج.م</strong></div></div></article>${infoCard('package','الفرع المسؤول','فرع مدينة نصر')}</div></div><div class="action-dock action-guidance"><span>الخطوة التالية</span>${next}</div></section>`}

function arrival(){return `<section class="screen confirmation-screen">${header('تأكيد الوصول','#DLV-1044',true)}<div class="confirmation-body"><div class="confirmation-icon cyan">${icon('pin',38)}</div><h1 class="page-title">هل وصلت إلى عنوان التوصيل؟</h1><p class="lead">الحي السابع، شارع مصطفى النحاس<br>بجوار مسجد السلام</p><article class="card verification-card"><div class="verification-row">${icon('check',17)}<span>الموقع الحالي متاح</span>${badge('delivered','دقيق','check')}</div><div class="verification-row">${icon('clock',17)}<span>وقت الخادم</span><strong class="ltr">01:42 PM</strong></div></article><p class="caption">تأكيد الوصول لا يُكمل الطلب. ستحتاج إلى تسجيل نتيجة التوصيل بعد ذلك.</p></div><div class="action-dock">${button('نعم، وصلت','primary','confirm-arrival','full')}${button('ليس بعد','ghost','back','full')}</div></section>`}

function failure(){const returned=state.selectedOutcome==='returned';const reasons=returned?['العميل طلب الإرجاع','مشكلة في الطلب','تعذر التسليم للعميل','سبب آخر']:['العميل غير متاح','العنوان غير صحيح','رفض العميل الاستلام','تعذر التواصل','مشكلة في الطلب','سبب آخر'];return `<section class="screen">${header(returned?'إرجاع الطلب':'فشل التوصيل','#DLV-1044',true)}<div class="screen-scroll with-action"><div class="result-hero ${returned?'returned':'failed'}">${icon(returned?'refresh':'alert',30)}<div><strong>${returned?'تأكيد إرجاع الطلب':'حدد سبب عدم التسليم'}</strong><p>${returned?'سيتم إخطار المحول والمشرف':'السبب مطلوب لإغلاق محاولة التوصيل'}</p></div></div><h3 class="section-title">السبب</h3><div class="reason-list">${reasons.map(x=>`<button class="option-card ${state.selectedReason===x?'selected':''}" data-reason="${x}"><span class="option-dot"></span><span>${x}</span></button>`).join('')}</div><div class="field"><label>ملاحظات إضافية — اختياري</label><textarea class="textarea" placeholder="أضف أي تفاصيل تساعد مسؤول التشغيل"></textarea></div></div><div class="action-dock"><button class="btn ${returned?'primary':'danger'} full" data-action="submit-failure" ${state.selectedReason?'':'disabled'}>${returned?'تأكيد الإرجاع':'تسجيل فشل التوصيل'}</button></div></section>`}

function handoff(){return `<section class="screen confirmation-screen">${header('إعادة الإسناد','#DLV-1044',true)}<div class="confirmation-body"><div class="confirmation-icon amber">${icon('refresh',38)}</div><div>${badge('warning','تم نقل المسؤولية','refresh')}</div><h1 class="page-title">تم نقل الطلب إلى سائق آخر</h1><p class="lead">تم حفظ آخر موقع لك وإيقاف إرسال موقعك لهذا الطلب.</p><article class="card audit-card"><div class="row-between"><span class="muted small">سبب إعادة الإسناد</span><strong class="small">تعذر الاستمرار</strong></div><div class="divider"></div><div class="row-between"><span class="muted small">آخر موقع مسجل</span><strong class="small ltr">01:38 PM</strong></div><div class="divider"></div><div class="row-between"><span class="muted small">السائق الجديد</span><strong class="small">بانتظار القبول</strong></div></article></div><div class="action-dock">${button('العودة إلى التوصيلات','primary','finish-handoff','full')}</div></section>`}

function syncScreen(){const queued=state.offline;return `<section class="screen">${header('حالة المزامنة',queued?'غير متصل':'متصل بالخادم',true)}<div class="screen-scroll"><article class="card sync-hero ${queued?'pending':'synced'}"><span>${icon(queued?'cloudOff':'check',30)}</span><div><h2>${queued?'أنت غير متصل':'تمت مزامنة جميع البيانات'}</h2><p>${queued?'3 تحديثات بانتظار المزامنة':'آخر مزامنة منذ أقل من دقيقة'}</p></div></article><div class="sync-info">وقت الخادم هو المرجع النهائي. لا يمكن تنفيذ الإسناد أو تعديل البيانات المالية دون اتصال.</div><h3 class="section-title">${queued?'بانتظار الإرسال':'تمت المزامنة مؤخرًا'}</h3><div class="stack">${[['DLV-1044','تحديث موقع','رقم تسلسلي 18'],['DLV-1044','تأكيد وصول','رقم تسلسلي 19'],['DLV-1041','تحديث موقع','رقم تسلسلي 7']].map((x,i)=>`<article class="card sync-item"><span class="info-icon">${icon(i===1?'pin':'navigation',18)}</span><div class="grow"><div class="row-between"><strong class="ltr small">#${x[0]}</strong>${badge(queued?'warning':'delivered',queued?'معلق':'تم','clock')}</div><p>${x[1]} · ${x[2]}</p><time>وقت الجهاز 01:${35+i} — غير معتمد</time></div></article>`).join('')}</div></div>${queued?`<div class="action-dock">${button('إعادة المحاولة الآن','primary','retry-sync','full')}</div>`:''}</section>`}

function notifications(){const rows=[{id:'n1',order:'DLV-1048',group:'assignment',route:'assignment',title:'طلب جديد بانتظار قبولك',time:'منذ دقيقة',type:'assigned',label:'تم الإسناد'},{id:'n2',order:'DLV-1044',group:'alert',route:'order',title:'بدأ إرسال الموقع',time:'منذ 18 دقيقة',type:'transit',label:'جاري التوصيل'},{id:'n3',order:'DLV-1042',group:'alert',route:'handoff',title:'تم نقل مسؤولية الطلب',time:'أمس',type:'warning',label:'إعادة إسناد'}];const visible=state.notificationFilter==='all'?rows:rows.filter(r=>r.group===state.notificationFilter);const unread=rows.filter(r=>!state.readNotifications.has(r.id)).length;return `<section class="screen">${header('الإشعارات',`${unread} غير مقروءة`)}<div class="screen-scroll"><button class="btn ghost compact" data-action="read-all" style="margin-bottom:8px">تحديد الكل كمقروء</button><div class="tabs" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px"><button data-filter="all" class="${state.notificationFilter==='all'?'active':''}">الكل</button><button data-filter="assignment" class="${state.notificationFilter==='assignment'?'active':''}">الإسنادات</button><button data-filter="alert" class="${state.notificationFilter==='alert'?'active':''}">التنبيهات</button></div><div class="notification-list">${visible.length?visible.map(r=>`<article class="card notification-card ${state.readNotifications.has(r.id)?'':'unread'}" data-notification="${r.id}" data-route="${r.route}"><span class="info-icon">${icon(r.group==='alert'?'bell':'package',18)}</span><div class="grow"><h3>${r.title}</h3><p>الطلب <span class="ltr">#${r.order}</span></p><div class="row-between" style="margin-top:7px"><time>${r.time}</time>${badge(r.type,r.label,r.type==='transit'?'navigation':'package')}</div></div></article>`).join(''):`<div class="empty-state">${icon('bell',40)}<h3>لا توجد إشعارات</h3><p>لا توجد عناصر في هذا التصنيف حاليًا.</p></div>`}</div></div>${nav('notifications')}</section>`}

function profile(){return `<section class="screen">${header('حسابي')}<div class="screen-scroll"><div class="stack"><article class="card profile-card"><div class="avatar">م ح</div><h2>محمد حسن</h2><p class="small muted ltr">010 •••• 4281</p>${badge('delivered','نشط ومتاح للإسناد','check')}<p class="caption">دراجة نارية</p></article><article class="card active-count"><span class="info-icon">${icon('package',18)}</span><div><strong>طلبان نشطان</strong><p>العدد معروض للمعلومية ولا يمنع إسنادات جديدة</p></div></article><article class="card"><div class="row-between"><div><h3 class="section-title">سياق الفرع</h3><p class="small muted">${state.selectedBranch}</p></div>${button('اختيار','secondary','branch','compact')}</div></article><article class="card settings-list"><button class="settings-row" data-go="notifications" style="border:0;background:transparent;width:100%">${icon('bell',18)}<span class="grow">إعدادات الإشعارات</span>${icon('arrow',16)}</button><button class="settings-row" data-go="sync" style="border:0;background:transparent;width:100%">${icon('refresh',18)}<span class="grow">حالة المزامنة</span><span class="badge delivered">محدّث</span></button><button class="settings-row" data-action="logout" style="border:0;background:transparent;color:var(--red-600);width:100%">${icon('user',18)}<span>تسجيل الخروج</span></button></article><div class="version">الإصدار 0.3 · آخر مزامنة منذ دقيقة</div></div></div>${nav('profile')}</section>`}

function actionSheet(type){
  if(type==='result') return `<div class="sheet-scrim" data-action="close-sheet"><section class="action-sheet result-sheet" role="dialog" aria-modal="true" aria-labelledby="result-title" onclick="event.stopPropagation()"><div class="sheet-handle"></div><h2 id="result-title">تسجيل نتيجة التوصيل</h2><p>اختر نتيجة الطلب <span class="ltr">#${state.currentOrderId}</span> ثم اضغط متابعة</p><button type="button" class="option-card result-option ${state.selectedOutcome==='delivered'?'selected':''}" data-outcome="delivered" aria-pressed="${state.selectedOutcome==='delivered'}"><span class="info-icon success-tone">${icon('check')}</span><div class="grow"><strong>تم التوصيل بنجاح</strong><div class="caption">إنهاء الطلب ونقله إلى المكتملة</div></div><span class="selection-check">${state.selectedOutcome==='delivered'?icon('check',16):''}</span></button><button type="button" class="option-card result-option ${state.selectedOutcome==='failed'?'selected':''}" data-outcome="failed" aria-pressed="${state.selectedOutcome==='failed'}"><span class="info-icon danger-tone">${icon('alert')}</span><div class="grow"><strong>فشل التوصيل</strong><div class="caption">ستحدد سبب الفشل في الخطوة التالية</div></div><span class="selection-check">${state.selectedOutcome==='failed'?icon('check',16):''}</span></button><button type="button" class="option-card result-option ${state.selectedOutcome==='returned'?'selected':''}" data-outcome="returned" aria-pressed="${state.selectedOutcome==='returned'}"><span class="info-icon return-tone">${icon('refresh')}</span><div class="grow"><strong>تم إرجاع الطلب</strong><div class="caption">ستحدد سبب الإرجاع في الخطوة التالية</div></div><span class="selection-check">${state.selectedOutcome==='returned'?icon('check',16):''}</span></button>${state.selectedOutcome?'':`<div class="selection-hint">اختر نتيجة واحدة للمتابعة</div>`}<button type="button" class="btn primary full" data-action="confirm-result">${state.selectedOutcome?'متابعة':'اختر النتيجة أولًا'}</button></section></div>`;
  if(type==='reject') return `<div class="sheet-scrim" data-action="close-sheet"><section class="action-sheet" role="dialog" aria-modal="true" aria-labelledby="reject-title" onclick="event.stopPropagation()"><div class="sheet-handle"></div><h2 id="reject-title">سبب رفض الطلب</h2><p>سيتم إرسال السبب إلى مسؤول التشغيل</p>${['بعيد عن موقعي الحالي','الحمولة لا تناسب وسيلة التوصيل','مشكلة في المركبة','سبب آخر'].map(x=>`<button class="option-card ${state.selectedReason===x?'selected':''}" data-reason="${x}"><span class="option-dot"></span>${x}</button>`).join('')}<button class="btn danger full" data-action="confirm-reject" ${state.selectedReason?'':'disabled'}>تأكيد الرفض</button></section></div>`;
  if(type==='branch') return `<div class="sheet-scrim" data-action="close-sheet"><section class="action-sheet" role="dialog" aria-modal="true" aria-labelledby="branch-title" onclick="event.stopPropagation()"><div class="sheet-handle"></div><h2 id="branch-title">اختيار الفرع الحالي</h2><p>لا يغيّر الاختيار الفروع المرتبطة بحسابك</p>${['كل الفروع المرتبطة','مدينة نصر — طلبان نشطان','مصر الجديدة — لا توجد طلبات'].map(x=>`<button class="option-card ${state.selectedBranch===x?'selected':''}" data-branch="${x}"><span class="option-dot"></span>${x}</button>`).join('')}${button('تطبيق الاختيار','primary','apply-branch','full')}</section></div>`;
  if(type==='date') return `<div class="sheet-scrim" data-action="close-sheet"><section class="action-sheet" role="dialog" aria-modal="true" aria-labelledby="date-title" onclick="event.stopPropagation()"><div class="sheet-handle"></div><h2 id="date-title">اختيار فترة مخصصة</h2><p>اعرض الطلبات المكتملة داخل الفترة المحددة</p><div class="date-fields"><label>من<input type="date" value="2026-08-20" max="2026-08-30"></label><label>إلى<input type="date" value="2026-08-30" max="2026-08-30"></label></div>${button('تطبيق الفترة','primary','apply-date','full')}<button class="btn ghost full" data-action="close-sheet">إلغاء</button></section></div>`;
  return '';
}

function render(){
  const id=current();
  const views={signin, 'setup-location':()=>setup('location'),'setup-notifications':()=>setup('notifications'),'setup-complete':()=>setup('complete'),deliveries,assignment,order,arrival,failure,handoff,sync:syncScreen,notifications,profile};
  app.innerHTML=(views[id]||deliveries)()+(state.sheet?actionSheet(state.sheet):'')+previewState();
  picker.innerHTML=screens.map(([sid,label],i)=>`<button data-go="${sid}" class="${sid===id?'active':''}"><span>${label}</span><small>${String(i+1).padStart(2,'0')}</small></button>`).join('');
  previewPicker.innerHTML=[['normal','عادي'],['loading','تحميل'],['empty','فارغ'],['error','خطأ']].map(([id,label])=>`<button data-preview="${id}" class="${state.preview===id?'active':''}">${label}</button>`).join('');
  offlineToggle.classList.toggle('active',state.offline);
  offlineToggle.textContent=state.offline?'استعادة الاتصال':'محاكاة فقدان الاتصال';
}

document.addEventListener('click',e=>{
  const goTo=e.target.closest('[data-go]'); if(goTo){go(goTo.dataset.go);return}
  const preview=e.target.closest('[data-preview]');if(preview){state.preview=preview.dataset.preview;render();return}
  const tab=e.target.closest('[data-tab]'); if(tab){state.deliveryTab=tab.dataset.tab;render();return}
  const range=e.target.closest('[data-date-range]');if(range){state.completedRange=range.dataset.dateRange;render();return}
  const filter=e.target.closest('[data-filter]');if(filter){state.notificationFilter=filter.dataset.filter;render();return}
  const notice=e.target.closest('[data-notification]');if(notice){state.readNotifications.add(notice.dataset.notification);go(notice.dataset.route||'order');return}
  const outcome=e.target.closest('[data-outcome]');if(outcome){state.selectedOutcome=outcome.dataset.outcome;render();return}
  const reason=e.target.closest('[data-reason]');if(reason){state.selectedReason=reason.dataset.reason;render();return}
  const branch=e.target.closest('[data-branch]');if(branch){state.selectedBranch=branch.dataset.branch;render();return}
  const actionElement=e.target.closest('[data-action]');
  const action=actionElement?.dataset.action; if(!action)return;
  if(action==='back') history.back();
  if(action==='login') go('setup-location');
  if(action==='grant-location'){state.setupGranted.location=true;toast('تم السماح بالموقع');render()}
  if(action==='grant-notifications'){state.setupGranted.notifications=true;toast('تم تفعيل الإشعارات');render()}
  if(action==='next-setup'){if(current()==='setup-location'&&state.setupGranted.location)go('setup-notifications');else if(current()==='setup-notifications'&&state.setupGranted.notifications)go('setup-complete');else toast('فعّل الإذن المطلوب أولًا')}
  if(action==='finish-setup')go('deliveries');
  if(action==='notifications')go('notifications');
  if(action==='open-assignment')go('assignment');
  if(action==='open-order'){const card=actionElement.closest('[data-order]');const item=[...shipments.active,...shipments.done].find(x=>x.id===card?.dataset.order);if(item){state.currentOrderId=item.id;state.currentOrderTitle=item.title;state.orderStage=item.type==='accepted'?'accepted':item.type==='transit'?'transit':'arrived'}go('order')}
  if(action==='result'||action==='reject'||action==='branch'){state.sheet=action;render()}
  if(action==='custom-date'){state.sheet='date';render()}
  if(action==='close-sheet'){state.sheet=null;render()}
  if(action==='accept-assignment'){const item=shipments.pending.shift();if(item){item.type='accepted';item.label='تم القبول';item.meta='بانتظار بدء التوصيل';item.action='عرض الطلب';shipments.active.push(item);state.currentOrderId=item.id;state.currentOrderTitle=item.title}state.orderStage='accepted';toast('تم قبول الطلب وأضيف إلى الطلبات النشطة');go('order')}
  if(action==='confirm-result'){if(!state.selectedOutcome){toast('اختر نتيجة التوصيل أولًا');return}state.sheet=null;if(state.selectedOutcome==='delivered'){completeOrder('delivered');toast('تم تسجيل التسليم ونقل الطلب إلى المكتملة');go('deliveries')}else go('failure')}
  if(action==='confirm-reject'){if(!state.selectedReason){toast('اختر سببًا للرفض');return}state.sheet=null;toast('تم رفض الطلب وإبلاغ المحول');state.selectedReason='';go('deliveries')}
  if(action==='arrived')go('arrival');
  if(action==='start-delivery'){state.orderStage='transit';const item=shipments.active.find(x=>x.id===state.currentOrderId);if(item){item.type='transit';item.label='جاري التوصيل';item.meta='بدأ الآن'}toast('بدأت عملية التوصيل');render()}
  if(action==='confirm-arrival'){state.orderStage='arrived';toast('تم تسجيل وقت وموقع الوصول');go('order')}
  if(action==='submit-failure'){if(!state.selectedReason)return;const result=state.selectedOutcome==='returned'?'returned':'failed';completeOrder(result);toast(result==='returned'?'تم تسجيل الإرجاع ونقل الطلب إلى المكتملة':'تم تسجيل الفشل ونقل الطلب إلى المكتملة');go('deliveries')}
  if(action==='finish-handoff')go('deliveries');
  if(action==='retry-sync'){state.offline=false;toast('تمت مزامنة 3 تحديثات');render()}
  if(action==='read-all'){['n1','n2','n3'].forEach(x=>state.readNotifications.add(x));render()}
  if(action==='apply-branch'){state.sheet=null;toast(`تم اختيار: ${state.selectedBranch}`);render()}
  if(action==='apply-date'){state.completedRange='custom';state.sheet=null;toast('تم تطبيق الفترة المخصصة');render()}
  if(action==='call')toast('فتح تطبيق الاتصال');
  if(action==='copy-address'){navigator.clipboard?.writeText('الحي السابع، شارع مصطفى النحاس، بجوار مسجد السلام');toast('تم نسخ العنوان')}
  if(action==='logout')go('signin');
  if(action==='sync'){state.offline=false;toast('تمت مزامنة التحديثات');render()}
  if(action==='setup-footer'){if(current()==='setup-notifications')go('setup-location');else toast('سياسة الخصوصية موضحة في وثيقة النظام')}
  if(action==='forgot')toast('سيتم إرسال رابط استعادة آمن');
},true);
window.addEventListener('hashchange',render);
offlineToggle.addEventListener('click',()=>{state.offline=!state.offline;toast(state.offline?'تم تفعيل وضع عدم الاتصال':'تمت استعادة الاتصال');render()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.sheet){state.sheet=null;render()}});
render();
