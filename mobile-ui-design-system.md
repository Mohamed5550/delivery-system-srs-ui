# Delivery System — Mobile UI Design System

## 1. Purpose and source

This document defines the mobile-first visual and interaction system for the Delivery System driver application described in SRS v0.3 (`system_requirements_document.md`). It is optimized for a **390 × 844 px** reference viewport, Arabic-first RTL layouts, Android and iOS, outdoor use, intermittent connectivity, and fast one-handed operation.

The system supports the SRS order lifecycle:

`CREATED → READY_FOR_DELIVERY → ASSIGNED → ACCEPTED → IN_TRANSIT → DELIVERED | FAILED | RETURNED | CANCELLED`

Rejection, timeout, cancellation, and reassignment are exceptional transitions. Drivers may carry any number of active orders; the UI shows the count for information only and never presents a capacity limit (BR-007).

## 2. Product design principles

1. **Glanceable in motion:** status, address, next action, and connectivity must be recognizable within two seconds.
2. **One primary action per state:** the main CTA changes with the shipment state and remains thumb reachable.
3. **Arabic-first, bidi-safe:** RTL is the default; phone numbers, order IDs, timestamps, and coordinates remain LTR.
4. **Status is never color-only:** every state combines color, label, and icon.
5. **Offline behavior is explicit:** queued, synced, conflicting, and failed updates are visible and actionable.
6. **Privacy by default:** lock-screen notifications and collapsed cards do not reveal customer names, phone numbers, or full addresses.
7. **Accessible outdoors:** high contrast, large touch targets, and restrained shadows remain legible in bright light.

## 3. Viewport, safe areas, and layout

| Token | Value | Tailwind usage | Purpose |
| :--- | :--- | :--- | :--- |
| `viewport.reference` | `390 × 844px` | custom preview | Stitch and QA reference |
| `layout.content-width` | `100%` | `w-full` | Fluid mobile canvas |
| `layout.page-gutter` | `16px` | `px-4` | Default horizontal padding |
| `layout.compact-gutter` | `12px` | `px-3` | Dense lists only |
| `layout.max-content` | `480px` | `max-w-[480px] mx-auto` | Large phones and previews |
| `layout.header-height` | `56px + safe-area` | `h-14 pt-[env(safe-area-inset-top)]` | Sticky header |
| `layout.bottom-nav-height` | `64px + safe-area` | `h-16 pb-[env(safe-area-inset-bottom)]` | Bottom navigation |
| `layout.action-dock` | `72px + safe-area` | `min-h-[72px]` | Sticky primary action area |
| `layout.touch-target` | `48 × 48px` minimum | `min-h-12 min-w-12` | Interactive controls |

Content must not sit beneath the header, bottom navigation, or action dock. Lists use `pb-28` when a sticky action is present and `pb-24` with bottom navigation only.

## 4. Color tokens

### 4.1 Brand and action palette

| Semantic token | Hex | Tailwind standard | Usage |
| :--- | :--- | :--- | :--- |
| `color.primary.50` | `#EEF2FF` | `indigo-50` | Selected surfaces, soft highlights |
| `color.primary.100` | `#E0E7FF` | `indigo-100` | Active chips |
| `color.primary.500` | `#6366F1` | `indigo-500` | Icons and focus accents |
| `color.primary.600` | `#4F46E5` | `indigo-600` | Primary buttons and active nav |
| `color.primary.700` | `#4338CA` | `indigo-700` | Pressed primary state |
| `color.primary.900` | `#312E81` | `indigo-900` | Strong brand text |
| `color.secondary.50` | `#ECFEFF` | `cyan-50` | In-transit status surfaces |
| `color.secondary.500` | `#06B6D4` | `cyan-500` | In-transit accent |
| `color.secondary.600` | `#0891B2` | `cyan-600` | Supporting status icons |
| `color.secondary.700` | `#0E7490` | `cyan-700` | Strong in-transit text |

### 4.2 Backgrounds, surfaces, and borders

| Semantic token | Hex | Tailwind standard | Usage |
| :--- | :--- | :--- | :--- |
| `color.background.app` | `#F8FAFC` | `slate-50` | Application background |
| `color.background.surface` | `#FFFFFF` | `white` | Cards, sheets, fields |
| `color.background.sunken` | `#F1F5F9` | `slate-100` | Filter bars and grouped controls |
| `color.background.scrim` | `rgba(15,23,42,.48)` | `bg-slate-900/50` | Modal and sheet scrim |
| `color.border.default` | `#E2E8F0` | `slate-200` | Default border |
| `color.border.strong` | `#CBD5E1` | `slate-300` | Dividers and active field border |
| `color.border.focus` | `#6366F1` | `indigo-500` | Keyboard focus |

### 4.3 Neutral and text palette

| Semantic token | Hex | Tailwind standard | Usage |
| :--- | :--- | :--- | :--- |
| `color.neutral.50` | `#F8FAFC` | `slate-50` | Light background |
| `color.neutral.100` | `#F1F5F9` | `slate-100` | Disabled fill |
| `color.neutral.200` | `#E2E8F0` | `slate-200` | Borders |
| `color.neutral.400` | `#94A3B8` | `slate-400` | Disabled icon/text |
| `color.neutral.500` | `#64748B` | `slate-500` | Secondary labels |
| `color.neutral.600` | `#475569` | `slate-600` | Supporting text |
| `color.neutral.700` | `#334155` | `slate-700` | Strong secondary text |
| `color.neutral.900` | `#0F172A` | `slate-900` | Primary text |
| `color.text.primary` | `#0F172A` | `text-slate-900` | Titles and values |
| `color.text.secondary` | `#475569` | `text-slate-600` | Descriptions |
| `color.text.muted` | `#64748B` | `text-slate-500` | Metadata |
| `color.text.inverse` | `#FFFFFF` | `text-white` | Text on strong fills |
| `color.text.link` | `#4338CA` | `text-indigo-700` | Links |

### 4.4 Feedback colors

| Semantic token | Hex | Tailwind standard | Usage |
| :--- | :--- | :--- | :--- |
| `color.success.50/600/700` | `#ECFDF5 / #059669 / #047857` | `emerald-50/600/700` | Confirmed success |
| `color.warning.50/600/700` | `#FFFBEB / #D97706 / #B45309` | `amber-50/600/700` | Attention and pending sync |
| `color.danger.50/600/700` | `#FEF2F2 / #DC2626 / #B91C1C` | `red-50/600/700` | Destructive and failure |
| `color.info.50/600/700` | `#EFF6FF / #2563EB / #1D4ED8` | `blue-50/600/700` | Informational states |

## 5. Order-state badge tokens

Every state badge uses `inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold`, a leading 14px icon, and an Arabic label. Never render a badge as a color-only dot.

| State token | Arabic label | Background | Text/border | Icon | Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `CREATED` | تم إنشاء الطلب | `slate-100` | `slate-700 / slate-300` | `FilePlus2` | Draft created |
| `READY_FOR_DELIVERY` | جاهز للتوصيل | `blue-50` | `blue-700 / blue-200` | `PackageCheck` | Eligible for assignment |
| `ASSIGNED` | تم الإسناد | `violet-50` | `violet-700 / violet-200` | `UserRoundCheck` | Waiting for driver response |
| `ACCEPTED` | تم القبول | `indigo-50` | `indigo-700 / indigo-200` | `CircleCheckBig` | Accepted, not started |
| `IN_TRANSIT` | جاري التوصيل | `cyan-50` | `cyan-700 / cyan-200` | `Truck` | Delivery is in progress |
| `DELIVERED` | تم التوصيل | `emerald-50` | `emerald-700 / emerald-200` | `BadgeCheck` | Successful terminal result |
| `FAILED` | فشل التوصيل | `red-50` | `red-700 / red-200` | `CircleX` | Failed terminal result |
| `RETURNED` | تم إرجاع الطلب | `orange-50` | `orange-700 / orange-200` | `Undo2` | Returned terminal result |
| `CANCELLED` | تم الإلغاء | `slate-200` | `slate-700 / slate-400` | `Ban` | Cancelled terminal result |
| `REASSIGNMENT_REQUIRED` | يحتاج إعادة إسناد | `amber-50` | `amber-700 / amber-200` | `UserRoundCog` | Exception, not a persisted order state unless approved |

Do not use capacity badges or segmented capacity meters. A neutral count such as `3 طلبات نشطة` may be shown for information, without warning colors or assignment restrictions.

## 6. Typography

Use **Noto Sans Arabic** as the primary Arabic UI family, with `Inter` as the Latin and numeric fallback. Use tabular numerals for money, timestamps, phone numbers, distances, and order IDs.

```css
font-family: "Noto Sans Arabic", "Inter", system-ui, sans-serif;
font-variant-numeric: tabular-nums;
```

| Token | Size/line height | Weight | Tailwind | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `type.display` | `28/36px` | 700 | `text-3xl leading-9 font-bold` | Rare KPI or success result |
| `type.h1` | `24/32px` | 700 | `text-2xl leading-8 font-bold` | Screen title |
| `type.h2` | `20/28px` | 700 | `text-xl leading-7 font-bold` | Section title |
| `type.h3` | `18/26px` | 600 | `text-lg leading-[26px] font-semibold` | Card title |
| `type.body-lg` | `16/26px` | 500 | `text-base leading-[26px] font-medium` | Important body/action |
| `type.body` | `15/24px` | 400 | `text-[15px] leading-6` | Default Arabic body |
| `type.body-sm` | `14/22px` | 400 | `text-sm leading-[22px]` | Supporting content |
| `type.label` | `13/18px` | 600 | `text-[13px] leading-[18px] font-semibold` | Field and chip labels |
| `type.caption` | `12/18px` | 500 | `text-xs leading-[18px] font-medium` | Metadata |

Do not use text smaller than 12px. Buttons use at least 15px/600. Long Arabic titles wrap to two lines; order IDs and monetary values remain LTR using `dir="ltr"`.

## 7. Spacing and sizing

Use a 4px base grid.

| Token | Value | Tailwind |
| :--- | :--- | :--- |
| `space.1` | 4px | `1` |
| `space.2` | 8px | `2` |
| `space.3` | 12px | `3` |
| `space.4` | 16px | `4` |
| `space.5` | 20px | `5` |
| `space.6` | 24px | `6` |
| `space.8` | 32px | `8` |
| `space.10` | 40px | `10` |
| `space.12` | 48px | `12` |

Standard component heights: compact chip 28px, input/button 48px, prominent CTA 52px, list row 64px minimum, shipment card 148px minimum, bottom-nav item 48px touch target.

## 8. Radius, borders, and elevation

| Token | Tailwind | Usage |
| :--- | :--- | :--- |
| `radius.control` | `rounded-xl` | Inputs and buttons |
| `radius.card` | `rounded-2xl` | Cards and banners |
| `radius.sheet` | `rounded-t-3xl` | Bottom action sheets |
| `radius.pill` | `rounded-full` | Badges and chips |
| `shadow.card` | `shadow-sm shadow-slate-900/5` | Standard card |
| `shadow.floating` | `shadow-lg shadow-slate-900/10` | Sticky CTA and floating controls |
| `shadow.sheet` | `shadow-2xl shadow-slate-900/20` | Action sheet |

Standard card: `rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5`. Pressed card: `bg-slate-50 scale-[0.99]`. Selected card: `border-indigo-500 ring-2 ring-indigo-100`.

The visual theme may use restrained indigo gradients on primary buttons, informational summary cards, and selected navigation capsules. Keep content surfaces predominantly white, preserve semantic state colors, and avoid gradients on destructive or status badges.

## 9. Core components

### 9.1 Buttons

- **Primary:** `h-12 rounded-xl bg-indigo-600 px-5 text-white`, pressed `indigo-700`, disabled `slate-200/text-slate-400`.
- **Secondary:** white surface, `border-slate-300 text-slate-700`; pressed `slate-50`.
- **Success:** `bg-emerald-600 text-white`; reserved for completion confirmation.
- **Danger:** `bg-red-600 text-white`; only for confirmed destructive actions.
- **Text:** `text-indigo-700`, no container, 48px touch target.
- **Icon:** 48 × 48px, `rounded-full` or `rounded-xl`, accessible label required.

Use full-width CTAs on mobile. Place the safest primary action on the right in LTR conceptual order but respect RTL visual order. Destructive actions must never be the default focused action.

For an in-progress order, show exactly one primary action in the sticky dock:

1. Before starting: `بدء التوصيل`.
2. After starting: `تأكيد الوصول`.
3. After arrival: `تسجيل النتيجة`.

Do not place multiple workflow actions beside each other. Secondary actions such as calling the customer or copying the address belong inside their relevant information cards.

### 9.2 Inputs

Base field: `min-h-12 rounded-xl border border-slate-300 bg-white px-3.5 text-slate-900`. Label appears above; helper/error text below. Focus uses `border-indigo-500 ring-4 ring-indigo-100`. Error uses `border-red-500 ring-red-100` with an icon and explicit message.

- Phone, OTP, money, order IDs, and coordinates use LTR input direction.
- Textareas are at least 112px high.
- Selectors open an action sheet rather than a tiny dropdown.
- Never rely on placeholder text as the only label.

### 9.3 Shipment card

Required hierarchy:

1. State badge and order ID.
2. Neighborhood/short destination and distance.
3. delivery fee/order value as LTR tabular numerals where authorized.
4. Assignment timeout or next-action hint.
5. One contextual CTA; entire card opens details.

For privacy, the feed shows a shortened destination; full customer details appear only after opening an authorized order.

### 9.4 Banners and feedback

- **Offline:** persistent amber banner below the header, cloud-off icon, queued update count, “عرض المزامنة” action.
- **Sync success:** brief emerald toast, 4 seconds.
- **Conflict:** red alert card with affected order and “مراجعة” action; never silently overwrite.
- **Loading:** skeletons matching final geometry; avoid full-page spinners for list refresh.
- **Empty:** 120px illustration/icon, concise title, one explanation, optional CTA.
- **Error:** inline retry for local failures; full-page state only when the screen cannot function.

### 9.5 Completed-orders date filter

- Show the filter only inside the completed-orders tab.
- Default to `اليوم` and provide compact presets for `7 أيام` and `30 يومًا`.
- A `مخصصة` chip opens a bottom sheet with labeled start and end date fields.
- Display the currently applied period above the chips and preserve it when returning from order details.
- Validate that the start date is not later than the end date and that future dates cannot be selected.
- Use a compact indigo summary surface with white selected chips; the filter must remain visually subordinate to the completed-order cards.

## 10. Navigation patterns

### 10.1 Sticky header

Use a translucent white header with subtle bottom border: `sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200`. It contains:

- Right in RTL: back button or product/branch identity.
- Center/start: one-line screen title and optional subtitle.
- Left in RTL: notification/profile/contextual icon.
- An offline banner sits immediately below it.

### 10.2 Bottom navigation bar

Use three destinations for the driver application:

| Destination | Arabic label | Icon | Contents |
| :--- | :--- | :--- | :--- |
| Deliveries | التوصيلات | `Package` | Pending, active, completed feed |
| Notifications | الإشعارات | `Bell` | In-app notification center |
| Profile | حسابي | `UserRound` | Driver status, active-order count, branches, settings |

The active item uses `text-indigo-600` and a soft `bg-indigo-50` icon capsule. Inactive items use `text-slate-500`. Show a numeric badge only for unread notifications or pending assignments. Hide bottom navigation during blocking action sheets and authentication.

### 10.3 Action sheets

Use bottom action sheets for rejection reasons, delivery outcome, branch selection, confirmation, and filters. Anatomy:

1. Scrim and drag handle.
2. Title and optional explanation.
3. Radio/list choices with 48px rows.
4. Optional notes field.
5. Sticky primary and secondary actions.

Sheets support swipe-down dismissal unless an irreversible submission is in progress. Destructive sheets require explicit confirmation.

## 11. Address presentation

- The driver application does not contain an internal map.
- Display the delivery address as selectable Arabic text in a `rounded-2xl` information card.
- Include a landmark when available and provide a 48px `نسخ العنوان` secondary action.
- Do not show destination pins, route lines, distance, ETA, or map previews because the employee provides a textual address rather than geographic coordinates.
- Driver GPS transmission may continue in the background for supervisor/dispatcher tracking, but it must not introduce a driver-facing map screen.

## 12. Motion and accessibility

- Minimum contrast: WCAG AA, 4.5:1 for normal text and 3:1 for large text/icons.
- Support system text scaling to 200% without hiding actions.
- Respect reduced-motion preferences; transitions use 150–250ms and no decorative parallax.
- Provide semantic labels, logical RTL focus order, and visible keyboard focus.
- Use haptics for assignment arrival, successful state change, and destructive confirmation; never as the only feedback.
- Do not place critical controls within 16px of screen edges or gesture zones.

## 13. Content rules

- Arabic is primary; use concise verbs: `قبول`, `رفض`, `بدء التوصيل`, `وصلت`, `تسجيل النتيجة`.
- Use Western or Arabic-Indic digits consistently per locale; IDs remain copyable.
- Display currency with its ISO/local symbol and two decimals only when needed.
- Use absolute timestamps for audit history and relative time only as supplementary text.
- Error messages state what happened and what the driver can do next.

## 14. Tailwind implementation baseline

Recommended utility baseline:

```js
// tailwind.config.js excerpt
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans Arabic', 'Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        mobile: '390px',
      },
    },
  },
};
```

Use standard Tailwind palette names in generated UI. Custom semantic tokens should alias these palette values rather than introducing visually similar one-off colors.
