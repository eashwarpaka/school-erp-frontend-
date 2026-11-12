# Smart School ERP - Workflow Automation Implementation Plan

## Goal
To implement the 8 core automated workflows described in the Functional Requirements Specification (Admissions, Fee Collection, HR & Payroll, Transport, Library, Inventory, Examinations, and Generic Approvals Engine), leveraging modern web architectures, AI integration, and robust exception handling.

> [!NOTE]
> This plan outlines the structural additions to the React frontend and the necessary backend/workflow integrations needed to fulfill the requirements from the provided screenshots. 

## User Review Required

> [!IMPORTANT]
> Please review the following architectural and design decisions before we proceed with the implementation:
> 1. **AI Integrations**: Are we integrating with a specific external LLM provider (e.g., OpenAI, Google Gemini) for the AI Admission Assistant, AI Fee Prediction, and AI Question Paper Generator, or are there existing models/services we should connect to?
> 2. **Backend Architecture**: The frontend workflows heavily rely on backend automation (cron jobs, state machines, AI processing). Is the backend already set up to handle these complex event-driven workflows, or will we need to mock/build these endpoints alongside the frontend?
> 3. **Payment & Banking Gateways**: For Fee Collection and Payroll, what specific payment gateways (e.g., Stripe, Razorpay) and banking integrations (e.g., Tally export formats) are we targeting?

## Open Questions

> [!WARNING]
> - For the **Approvals Engine**, should this be a standalone micro-frontend/module, or deeply integrated into each respective feature (HR, Inventory, Library)? A generic engine is recommended.
> - For **Transport**, what GPS tracking provider or API will be used for live location streaming?

---

## Proposed Changes

We will systematically build out the UI components, state management, and API integration layers for each of the 8 workflows within their respective feature directories.

### 1. Admissions Workflow (`src/features/admissions`)
- **[NEW]** `components/AdmissionAssistant.tsx`: Chat interface for AI auto-responder and lead capture.
- **[NEW]** `components/ApplicationForm.tsx`: Multi-step online application and document upload.
- **[NEW]** `components/DocumentVerification.tsx`: Admin dashboard for manual review of failed document validations.
- **[NEW]** `components/OfferLetterGenerator.tsx`: Auto-generation and preview of offer letters.
- **[MODIFY]** `AdmissionsDashboard.tsx`: Add metrics for application stages, 48-hour incomplete reminders, and manual review queues.

### 2. Fee Collection Workflow (`src/features/finance`)
- **[NEW]** `components/FeeStructureConfig.tsx`: Setup interface for class/category fee rules and due dates.
- **[NEW]** `components/FeePredictionDashboard.tsx`: AI dashboard flagging at-risk non-payers 30 days ahead.
- **[NEW]** `components/ReconciliationQueue.tsx`: Accountant view for gateway settlement mismatches.
- **[NEW]** `components/PaymentGateway.tsx`: Parent-facing online payment flow and instant receipt generation.

### 3. HR & Payroll Workflow (`src/features/hr`)
- **[NEW]** `components/AttendanceReview.tsx`: Dashboard for finalizing attendance and resolving disputed leave records via Approvals Engine.
- **[NEW]** `components/PayrollEngine.tsx`: UI for calculating gross, deductions, and net pay.
- **[NEW]** `components/PayslipViewer.tsx`: Mobile-responsive payslip view for staff.
- **[NEW]** `components/DisbursementExport.tsx`: Tool for exporting payroll data to Tally/Banking systems.

### 4. Transport Workflow (`src/features/transport`)
- **[NEW]** `components/RouteManager.tsx`: Geofence and stop configuration.
- **[NEW]** `components/LiveTracking.tsx`: Real-time map view for parents and Transport Manager.
- **[NEW]** `components/DriverCheckIn.tsx`: Mobile view for driver trip start and RFID logging.
- **[MODIFY]** `TransportDashboard.tsx`: Add alerts for GPS signal loss and manual location override audit logs.

### 5. Library Workflow (`src/features/library`)
- **[NEW]** `components/CatalogManager.tsx`: Barcode/RFID entry for books.
- **[NEW]** `components/SelfCheckout.tsx`: Kiosk/Mobile view for self-checkout and requests.
- **[NEW]** `components/FineLedger.tsx`: Integration with the finance module for overdue fines and lost-book replacement costs.
- **[NEW]** `components/OverdueDashboard.tsx`: View of due-date reminders and grace period tracking.

### 6. Inventory & Procurement Workflow (`src/features/inventory`)
- **[NEW]** `components/StockMonitor.tsx`: Real-time stock levels vs. reorder thresholds.
- **[NEW]** `components/PurchaseRequisition.tsx`: Draft generation and routing to the Approvals Engine (handling multi-level budget thresholds).
- **[NEW]** `components/PurchaseOrders.tsx`: Vendor issuance and goods receipt tracking.

### 7. Examinations Workflow (`src/features/academics`)
- **[NEW]** `components/AIQuestionPaper.tsx`: Drafting interface for AI-generated exam papers and teacher review.
- **[NEW]** `components/MarksEntry.tsx`: Interface with validation to flag out-of-range discrepancies.
- **[NEW]** `components/AIReportCard.tsx`: Auto-computed rankings and AI-drafted narrative comments for teacher review.

### 8. Approvals Workflow (Generic Engine) (`src/features/admin` or `src/lib/approvals`)
- **[NEW]** `lib/approvals/ApprovalContext.tsx`: Global state for pending approvals.
- **[NEW]** `components/RequestSubmitter.tsx`: Generic wrapper for submitting leave, expenses, and waivers.
- **[NEW]** `components/ApprovalDashboard.tsx`: Centralized inbox for approvers (Approve/Reject/Delegate/Request Info).
- **[NEW]** `components/SLAConfig.tsx`: Configuration for auto-escalation and reminder thresholds.

---

## Verification Plan

### Automated Tests
- `npm run test`: We will add Vitest/Jest unit tests for core logic, especially for out-of-range mark validation, fee calculation rules, and SLA threshold logic.
- Mock external AI and Gateway responses to ensure the UI gracefully handles both successful data mapping and API failures.

### Manual Verification
1. **Walkthrough each workflow**: We will simulate the user journey for each of the 8 workflows from end-to-end (e.g., Submitting an application -> AI Assistant -> Document Verification -> Fee Payment -> Enrollment).
2. **Exception Handling Check**: Specifically test the "Exception Handling" clauses defined in the spec, such as:
   - Entering out-of-range marks in Examinations.
   - Forcing a GPS signal loss in Transport.
   - Submitting an inventory requisition above the budget threshold.
3. Review the UI against the "Dynamic Design" and "Rich Aesthetics" constraints outlined in our web app development guidelines.
