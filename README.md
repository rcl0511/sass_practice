오픈소스 재고 관리 및 ERP 시스템 추천
1. Odoo
설명: Odoo는 ERP, CRM, 재고, 회계 등 다양한 비즈니스 기능을 통합한 오픈소스 플랫폼입니다.

특징:

재고 및 창고 관리, 구매, 판매, 회계 등 다양한 모듈 제공

모듈화된 구조로 필요에 따라 기능 추가 가능

REST API를 통한 외부 시스템 연동 지원

활용 방안: 도매업체의 재고 관리, 병원과의 주문 및 명세서 관리에 적합합니다.


🔗 연동 전략
위의 오픈소스 시스템들은 REST API를 제공하여 외부 시스템과의 연동이 가능합니다. 이를 통해 도매업체의 ERP 시스템과 병원 측 시스템 간의 재고 정보 및 명세서 데이터를 실시간으로 동기화할 수 있습니다.

🛠️ 커스터마이징 및 구축 지원
각 시스템은 오픈소스로 제공되어 자유롭게 커스터마이징이 가능합니다. 도매업체의 특정 비즈니스 프로세스에 맞게 기능을 추가하거나 수정할 수 있으며, 병원 측의 요구사항에 맞는 인터페이스를 개발할 수 있습니다.

필요하신 경우, 위 시스템들에 대한 데모 환경 구성, 기능 비교표 작성, 커스터마이징 계획 수립 


📦 프로젝트 루트
├─ 📂 .vscode
│  └─ 📄 launch.json
├─ 📂 medicine-server
│  ├─ 📂 exports
│  ├─ 📂 models
│  │  ├─ 📄 Medicine.js
│  │  ├─ 📄 Order.js
│  │  └─ 📄 pdfUpload.js
│  ├─ 📂 node_modules
│  ├─ 📂 routes
│  │  ├─ 📄 invoiceRouter.js
│  │  ├─ 📄 medicines.js
│  │  ├─ 📄 orders.js
│  │  ├─ 📄 search.js
│  │  └─ 📄 upload.js
│  ├─ 📂 templates
│  │  └─ 📄 invoiceTemplate.js
│  ├─ 📂 uploads
│  ├─ 📂 utils
│  │  └─ 📄 htmlToPdf.js
│  ├─ 📄 .env
│  ├─ 📄 index.js
│  ├─ 📄 package-lock.json
│  ├─ 📄 package.json
│  └─ 📄 server.js
├─ 📂 node_modules
├─ 📂 public
│  ├─ 📄 messages.json
│  └─ 📄 orders.json
├─ 📂 src
│  ├─ 📂 assets
│  │  ├─ 📄 sidebar-left.svg
│  │  └─ 📄 Vector.svg
│  ├─ 📂 components
│  ├─ 📂 contexts
│  │  └─ 📄 AuthContext.jsx
│  ├─ 📂 firebase
│  ├─ 📂 layout
│  │  └─ 📄 MainLayout.jsx
│  ├─ 📂 pages
│  │  ├─ 📄 HospitalDashboard.jsx
│  │  ├─ 📄 Login.jsx
│  │  ├─ 📄 Order.jsx
│  │  ├─ 📄 Signup.jsx
│  │  ├─ 📄 VendorDashboard.jsx
│  │  ├─ 📄 VendorInvoice.jsx
│  │  ├─ 📄 VendorLedger.jsx
│  │  ├─ 📄 VendorOrdersManagement.jsx
│  │  └─ 📄 VendorStocks.jsx
│  ├─ 📂 router
│  ├─ 📄 app.jsx
│  ├─ 📄 config.js
│  ├─ 📄 counter.ts
│  ├─ 📄 index.css
│  ├─ 📄 index.html
│  ├─ 📄 main.jsx
│  ├─ 📄 main.ts
│  ├─ 📄 style.css
│  ├─ 📄 typescript.svg
│  └─ 📄 vite-env.d.ts
├─ 📄 .gitignore
├─ 📄 package-lock.json
