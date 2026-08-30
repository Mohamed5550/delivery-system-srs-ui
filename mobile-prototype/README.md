# Delivery System mobile prototype

A dependency-free, Arabic RTL mobile prototype generated from SRS v0.3 in `system_requirements_document.md` and `mobile-ui-design-system.md`.

## Run

From the repository root:

```bash
php -S 127.0.0.1:4173 -t mobile-prototype
```

Then open `http://127.0.0.1:4173`.

## Included flows

- Driver sign in
- Three-step setup flow using one shared component
- Deliveries feed with unlimited active orders and an informational count
- Completed-order date filtering for today, 7 days, 30 days, and a custom range
- New-assignment preview with accept/reject validation
- Text-address assignment and order details without an in-app map
- One clear primary action for each in-progress delivery stage
- Arrival confirmation and delivery-result action sheets
- Failed/returned delivery reasons and reassignment handoff
- Notification center with filters, read state, and deep links
- Offline queue/sync screen and conflict-safe messaging
- Driver profile, active-order count, and branch selector
- Reusable status badges plus normal/loading/empty/error preview states
- Enhanced indigo visual theme with layered surfaces and clearer active states

The desktop prototype sidebar exposes every screen and lets reviewers simulate
loading, empty, error, and offline conditions. On a phone-sized browser, the
prototype displays only the application UI.

All fonts and the custom completion illustration are stored locally under `assets/`.
