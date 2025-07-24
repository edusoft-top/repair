# ระบบแจ้งซ่อม (Repair Management System)

ระบบจัดการคำขอซ่อมและบำรุงรักษาสำหรับองค์กร พัฒนาด้วย React 19 และ Tailwind CSS

## 🏗️ Current Setup

- **React:** 19.1.0
- **Lucide React:** 0.525.0  
- **Tailwind CSS:** 3.4.17

## โครงสร้างโปรเจค

```
src/
├── components/           # React Components
│   ├── common/          # ส่วนประกอบทั่วไป
│   │   ├── Notification.js
│   │   ├── StatsCard.js
│   │   ├── PriorityBadge.js
│   │   ├── StatusBadge.js
│   │   ├── FileUpload.js
│   │   └── AttachmentList.js
│   ├── auth/            # การยืนยันตัวตน
│   │   └── LoginForm.js
│   ├── layout/          # Layout และ Navigation
│   │   ├── Header.js
│   │   ├── MobileMenu.js
│   │   └── NavigationTabs.js
│   ├── dashboard/       # หน้าหลัก
│   │   └── Dashboard.js
│   ├── requests/        # จัดการคำขอซ่อม
│   │   ├── RepairRequestCard.js
│   │   ├── NewRequestForm.js
│   │   ├── RequestDetailModal.js
│   │   └── CostManagement.js
│   ├── admin/           # ระบบผู้ดูแล
│   │   ├── UserManagement.js
│   │   ├── UserModal.js
│   │   ├── CategoryManagement.js
│   │   ├── CategoryModal.js
│   │   ├── SystemSettings.js
│   │   └── AdvancedReports.js
│   └── index.js         # Export ทั้งหมด
├── utils/               # ฟังก์ชันยูทิลิตี้
│   └── api.js          # API utilities
├── context/             # React Context
│   └── AuthContext.js  # Authentication context
├── constants/           # ค่าคงที่
│   └── index.js        # Constants และ enums
└── App.js              # Main application
```

## คุณสมบัติหลัก

### สำหรับผู้ใช้ทั่วไป (User)
- ✅ สร้างคำขอซ่อมใหม่
- ✅ ดูรายการคำขอของตัวเอง
- ✅ ตรวจสอบสถานะการซ่อม
- ✅ ดูรายละเอียดคำขอ

### สำหรับช่างเทคนิค (Technician)
- ✅ ดูงานที่ได้รับมอบหมาย
- ✅ อัปเดตสถานะงาน
- ✅ อัปโหลดไฟล์แนบ
- ✅ บันทึกค่าใช้จ่ายจริง
- ✅ เพิ่มความคิดเห็น

### สำหรับผู้ดูแลระบบ (Admin)
- ✅ ดูคำขอซ่อมทั้งหมด
- ✅ มอบหมายงานให้ช่าง
- ✅ จัดการผู้ใช้งาน
- ✅ จัดการหมวดหมู่
- ✅ ตั้งค่าระบบ
- ✅ ดูรายงานและสถิติ
- ✅ ส่งออกรายงาน CSV

## บทบาทผู้ใช้

### User (ผู้ใช้ทั่วไป)
- สร้างและดูคำขอซ่อมของตัวเอง
- ไม่สามารถเห็นคำขอของผู้อื่น

### Technician (ช่างเทคนิค)
- ดูเฉพาะงานที่ได้รับมอบหมาย
- อัปเดตสถานะและความคืบหน้า
- จัดการไฟล์แนบและค่าใช้จ่าย

### Admin (ผู้ดูแลระบบ)
- เข้าถึงข้อมูลทั้งหมด
- จัดการผู้ใช้และระบบ
- มอบหมายงานและดูรายงาน

## การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies
```bash
# ใช้กับ React 19
npm install

# หรือถ้าเริ่มต้นใหม่
npm install react@19.1.0 react-dom@19.1.0 lucide-react@0.525.0
```

### 2. ติดตั้ง Tailwind CSS
```bash
npm install -D tailwindcss@3.4.17 postcss@8.5.6 autoprefixer@10.4.21
npx tailwindcss init -p
```

# Build
```bash
npm run build
```

### 3. การใช้งาน
```javascript
import App from './App';
import { createRoot } from 'react-dom/client';

## API Endpoints
ระบบใช้งานกับ API Backend ที่มี endpoints ดังนี้:

### Authentication
- `POST /auth/login` - เข้าสู่ระบบ
- `GET /auth/me` - ตรวจสอบข้อมูลผู้ใช้

### Repair Requests
- `GET /repair-requests` - ดูรายการคำขอ
- `POST /repair-requests` - สร้างคำขอใหม่
- `PUT /repair-requests/:id` - อัปเดตคำขอ
- `DELETE /repair-requests/:id` - ลบคำขอ
- `POST /repair-requests/:id/comments` - เพิ่มความคิดเห็น

### Categories
- `GET /categories` - ดูหมวดหมู่
- `POST /categories` - สร้างหมวดหมู่
- `PUT /categories/:id` - แก้ไขหมวดหมู่
- `DELETE /categories/:id` - ลบหมวดหมู่

### Users (Admin only)
- `GET /users` - ดูรายการผู้ใช้
- `POST /users` - สร้างผู้ใช้ใหม่
- `PUT /users/:id` - แก้ไขข้อมูลผู้ใช้

### Attachments
- `POST /attachments` - อัปโหลดไฟล์
- `GET /attachments/:requestId` - ดูไฟล์แนบ
- `DELETE /attachments/:id` - ลบไฟล์

### Settings (Admin only)
- `GET /settings` - ดูการตั้งค่า
- `PUT /settings` - บันทึกการตั้งค่า

## การปรับแต่ง

### เปลี่ยน API Base URL
แก้ไขไฟล์ `utils/api.js`:
```javascript
const API_BASE = 'https://your-api-domain.com/api/repair';
```

### เพิ่มหรือแก้ไขสถานะ
แก้ไขไฟล์ `constants/index.js`:
```javascript
export const STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  // เพิ่มสถานะใหม่
};
```

### Responsive Design
ระบบออกแบบให้ใช้งานได้ทั้งบนมือถือและเดสก์ท็อป:
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Mobile navigation menu

## การพัฒนาต่อ

### การเพิ่ม Component ใหม่
1. สร้างไฟล์ในโฟลเดอร์ที่เหมาะสม
2. เพิ่ม export ใน `components/index.js`
3. Import และใช้งานในส่วนที่ต้องการ

### การเพิ่มหน้าใหม่
1. สร้าง component ใหม่
2. เพิ่ม tab ใน NavigationTabs
3. เพิ่ม case ใน Dashboard switch statement

## การ Deploy

### Build Production
```bash
npm run build
```

### Environment Variables
สร้างไฟล์ `.env`:
```
# API Configuration
REACT_APP_API_BASE_URL=https://your-api-domain.com

# Public URL สำหรับ subdirectory deployment
# ใช้เฉพาะเมื่อ deploy ใน subdirectory (ปกติจะตั้งในเวลา build)
PUBLIC_URL=your-subdirectory

# Application Configuration
REACT_APP_APP_NAME=ระบบแจ้งซ่อม
REACT_APP_VERSION=0.1.0

# Feature Flags (optional)
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_PWA=true

# File Upload Configuration
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# UI Configuration
REACT_APP_DEFAULT_THEME=light
REACT_APP_DEFAULT_LANGUAGE=th

# Analytics (optional)
# REACT_APP_GA_TRACKING_ID=your-ga-tracking-id
# REACT_APP_SENTRY_DSN=your-sentry-dsn

# Development only
# REACT_APP_MOCK_API=false
# REACT_APP_API_DELAY=1000
```

## การแก้ไขปัญหาทั่วไป

### 1. API Connection Error
- ตรวจสอบ API Base URL
- ตรวจสอบ CORS settings
- ตรวจสอบ network connectivity

### 2. Authentication Issues
- ตรวจสอบ token storage
- ตรวจสอบ token expiration
- ตรวจสอบ API authentication endpoint

### 3. File Upload Problems
- ตรวจสอบขนาดไฟล์สูงสุด
- ตรวจสอบประเภทไฟล์ที่อนุญาต
- ตรวจสอบ server upload limits

## License

MIT License - ดูรายละเอียดในไฟล์ LICENSE

## การสนับสนุน

สำหรับการสนับสนุนและการแก้ไขปัญหา กรุณาติดต่อทีมพัฒนา