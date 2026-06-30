# SPV Economics Calculator (POC-75)

An interactive single-deal vehicle waterfall metrics simulation platform tailored for emerging syndicate managers and allocators. This module models distribution tiers, management overhead tracking, and net yield outputs.

## 🛠️ Tech Stack & Architecture
- **Frontend Client:** React, Next.js (TypeScript, Tailwind CSS, Recharts)
- **Backend API Core Engine:** FastAPI (Python, Uvicorn ASGI)
- **Design System:** Custom 70/30 spatial split matrix layout

## 🚀 Implemented Architectural Features
- **FastAPI Core Architecture:** A dedicated local API backend server handling real-time analytical vectors and content requests.
- **SEC EDGAR Pipeline Data Ingestion:** Integrated reusable data adapter structures mapping synthetic Form D placement details.
- **Data Engineering Sample Exporter:** Native API pipeline streaming downloadable spreadsheet matrices (`.csv`).
- **Interactive Tooltip Annotations:** Direct descriptive micro-copy information bubbles activated dynamically upon pointer hover.
- **Break-Even Yield Analytics:** Live calculations displaying the exact growth threshold needed to clear fee overheads and return 100% of principal capital to LPs.
- **Investment Memo Generation:** Single-click script exporting your current dashboard configuration profiles to a text file summary.

---

## ⚙️ How To Verify and Launch Locally

### 1. Run the Backend Server Instance
Open a terminal window, navigate to your root folder, set up your environment, and start the FastAPI service:
```bash
# Navigate to backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required python dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8000