# SPV Economics Calculator & Ledger Portal (POC-75)

A production-grade single-deal vehicle economics, break-even analysis, and regulatory telemetry matrix built for the Real Rails Intelligence Library. It features an advanced asynchronous architectural bridge syncing a Next.js user interface with a high-performance Python FastAPI calculation engine.

---

## 📐 Tech Stack & Architecture
- **Frontend Layer:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend Service Layer:** Python, FastAPI, Uvicorn ASGI Server
- **Data Isolation Standard:** Independent `mock-data` envelope package utilizing localized JSON schema structures.
- **Design System:** Custom high-contrast, ultra-dark analytics workspace (#030712) oriented around a balanced 70:30 layout viewport partition.

---

## ⚡ Core Compliance Features Implemented

- **Isolated Synthetic Data Package:** Zero hardcoded data arrays within logic blocks. All records are housed inside an independent, structured JSON schema package with explicit fields definitions, data dictionaries, and designated runtime edge cases.
- **Dynamic Data Adapters:** Programmatic frontend utility functions that intercept raw network JSON payloads, parsing string metrics into live math assets instantly.
- **System Governance Rail Trackers:** High-visibility contextual blocks identifying the exact asset rail controller authority and operational parameters.
- **SEC EDGAR Pipeline Sync:** Real-time data pipeline tracking module logging active Central Index Key (CIK) IDs and filing exemptions.
- **Interactive Tooltips & Evaluation Matrix:** Hoverable definitions detailing operational drag alongside side-by-side comparative dropdown selectors.
- **Payback & Break-Even Analytics:** Operational calculation modules tracking lifetime management fee drag against projected yield horizons.
- **Export & Download Actions:** Direct local triggers to stream downloadable synthetic CSV files and generate automated text summaries on demand.

---

## 🚀 Local Installation & Execution

Follow these steps sequentially to launch both service runtimes locally on your machine:

### 🐍 1. Initialize and Start the FastAPI Backend Engine
Open your project terminal at the root directory level and execute the following commands to spin up your local server instance on port `8000`:

```bash
# Explicitly initialize the Python server routing through the backend directory asset structure
python -m uvicorn main:app --reload --port 8000 --app-dir backend