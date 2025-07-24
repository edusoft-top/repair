// constants/index.js

export const ROLES = {
    USER: 'user',
    TECHNICIAN: 'technician',
    ADMIN: 'admin'
  };
  
  export const STATUS = {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  };
  
  export const PRIORITY = {
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
  };
  
  export const STATUS_LABELS = {
    [STATUS.PENDING]: 'รอดำเนินการ',
    [STATUS.ASSIGNED]: 'มอบหมายแล้ว',
    [STATUS.IN_PROGRESS]: 'กำลังดำเนินการ',
    [STATUS.COMPLETED]: 'เสร็จสิ้น',
    [STATUS.CANCELLED]: 'ยกเลิก'
  };
  
  export const PRIORITY_LABELS = {
    [PRIORITY.NORMAL]: 'ปกติ',
    [PRIORITY.HIGH]: 'สูง',
    [PRIORITY.URGENT]: 'เร่งด่วน'
  };
  
  export const ROLE_LABELS = {
    [ROLES.USER]: 'ผู้ใช้ทั่วไป',
    [ROLES.TECHNICIAN]: 'ช่างเทคนิค',
    [ROLES.ADMIN]: 'ผู้ดูแลระบบ'
  };