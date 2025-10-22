/**
 * DentAI - 資料儲存管理模組
 * 使用 localStorage 模擬後端資料庫
 */

class StorageManager {
  static KEYS = {
    USERS: 'dentai_users',
    CURRENT_USER: 'dentai_current_user',
    IMAGES: 'dentai_images',
    ANALYSES: 'dentai_analyses',
    NOTIFICATIONS: 'dentai_notifications',
    DOCTOR_REVIEWS: 'dentai_doctor_reviews',
    APPOINTMENTS: 'dentai_appointments',
    APPOINTMENT_SLOTS: 'dentai_appointment_slots'
  };
  
  /**
   * 初始化資料庫
   */
  static init() {
    if (!this.get(this.KEYS.USERS)) {
      this.set(this.KEYS.USERS, this.getDefaultUsers());
    }
    if (!this.get(this.KEYS.IMAGES)) {
      this.set(this.KEYS.IMAGES, []);
    }
    if (!this.get(this.KEYS.ANALYSES)) {
      this.set(this.KEYS.ANALYSES, []);
    }
    if (!this.get(this.KEYS.NOTIFICATIONS)) {
      this.set(this.KEYS.NOTIFICATIONS, []);
    }
    if (!this.get(this.KEYS.DOCTOR_REVIEWS)) {
      this.set(this.KEYS.DOCTOR_REVIEWS, []);
    }
    
    console.log('資料庫初始化完成');
  }
  
  /**
   * 獲取預設使用者資料
   */
  static getDefaultUsers() {
    return [
      {
        id: 'patient_001',
        type: 'patient',
        name: '王小明',
        email: 'patient@demo.com',
        password: 'demo123',
        phone: '0912-345-678',
        birthDate: '1990-05-15',
        gender: 'male',
        registeredAt: '2024-01-15T10:00:00Z',
        lastLoginAt: new Date().toISOString()
      },
      {
        id: 'doctor_001',
        type: 'doctor',
        name: '李醫師',
        email: 'doctor@demo.com',
        password: 'demo123',
        phone: '02-1234-5678',
        specialty: '牙周病科',
        license: 'DEN-12345',
        hospital: 'DentAI 示範診所',
        registeredAt: '2023-06-01T08:00:00Z',
        lastLoginAt: new Date().toISOString()
      }
    ];
  }
  
  /**
   * 儲存資料
   */
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('儲存失敗:', error);
      return false;
    }
  }
  
  /**
   * 讀取資料
   */
  static get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('讀取失敗:', error);
      return null;
    }
  }
  
  /**
   * 刪除資料
   */
  static remove(key) {
    localStorage.removeItem(key);
  }
  
  /**
   * 清空所有資料
   */
  static clear() {
    Object.values(this.KEYS).forEach(key => {
      this.remove(key);
    });
    console.log('已清空所有資料');
  }
}

class UserManager {
  /**
   * 使用者登入
   */
  static login(email, password) {
    const users = StorageManager.get(StorageManager.KEYS.USERS) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // 更新最後登入時間
      user.lastLoginAt = new Date().toISOString();
      StorageManager.set(StorageManager.KEYS.USERS, users);
      
      // 儲存當前登入使用者
      StorageManager.set(StorageManager.KEYS.CURRENT_USER, user);
      
      console.log('登入成功:', user.name);
      return { success: true, user };
    }
    
    return { success: false, message: '帳號或密碼錯誤' };
  }
  
  /**
   * 使用者登出
   */
  static logout() {
    StorageManager.remove(StorageManager.KEYS.CURRENT_USER);
    console.log('已登出');
  }
  
  /**
   * 獲取當前使用者
   */
  static getCurrentUser() {
    return StorageManager.get(StorageManager.KEYS.CURRENT_USER);
  }
  
  /**
   * 檢查是否已登入
   */
  static isLoggedIn() {
    return this.getCurrentUser() !== null;
  }
  
  /**
   * 註冊新使用者
   */
  static register(userData) {
    const users = StorageManager.get(StorageManager.KEYS.USERS) || [];
    
    // 檢查 email 是否已存在
    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: '此 Email 已被註冊' };
    }
    
    const newUser = {
      id: 'patient_' + Date.now(),
      type: 'patient',
      ...userData,
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    users.push(newUser);
    StorageManager.set(StorageManager.KEYS.USERS, users);
    
    console.log('註冊成功:', newUser.name);
    return { success: true, user: newUser };
  }
  
  /**
   * 更新使用者資料
   */
  static updateProfile(userId, updates) {
    const users = StorageManager.get(StorageManager.KEYS.USERS) || [];
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      StorageManager.set(StorageManager.KEYS.USERS, users);
      
      // 如果是當前使用者，也更新當前使用者資料
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        StorageManager.set(StorageManager.KEYS.CURRENT_USER, users[index]);
      }
      
      return { success: true, user: users[index] };
    }
    
    return { success: false, message: '使用者不存在' };
  }
}

class ImageManager {
  /**
   * 儲存影像記錄
   */
  static saveImage(imageData) {
    const images = StorageManager.get(StorageManager.KEYS.IMAGES) || [];
    const currentUser = UserManager.getCurrentUser();
    
    const newImage = {
      id: 'img_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      imageData: imageData.base64, // Base64 編碼的影像
      fileName: imageData.fileName,
      fileSize: imageData.fileSize,
      uploadedAt: new Date().toISOString(),
      qualityCheck: null,
      analysis: null,
      status: 'uploaded' // uploaded, analyzing, analyzed, reviewed
    };
    
    images.push(newImage);
    StorageManager.set(StorageManager.KEYS.IMAGES, images);
    
    console.log('影像已儲存:', newImage.id);
    return newImage;
  }
  
  /**
   * 更新影像品質檢測結果
   */
  static updateQualityCheck(imageId, qualityResult) {
    const images = StorageManager.get(StorageManager.KEYS.IMAGES) || [];
    const index = images.findIndex(img => img.id === imageId);
    
    if (index !== -1) {
      images[index].qualityCheck = qualityResult;
      images[index].status = qualityResult.passed ? 'quality_passed' : 'quality_failed';
      StorageManager.set(StorageManager.KEYS.IMAGES, images);
      return true;
    }
    
    return false;
  }
  
  /**
   * 獲取使用者的所有影像
   */
  static getUserImages(userId) {
    const images = StorageManager.get(StorageManager.KEYS.IMAGES) || [];
    return images.filter(img => img.userId === userId).reverse(); // 最新的在前
  }
  
  /**
   * 獲取單一影像
   */
  static getImage(imageId) {
    const images = StorageManager.get(StorageManager.KEYS.IMAGES) || [];
    return images.find(img => img.id === imageId);
  }
  
  /**
   * 獲取單一影像（別名方法）
   */
  static getById(imageId) {
    return this.getImage(imageId);
  }
  
  /**
   * 刪除影像
   */
  static deleteImage(imageId) {
    let images = StorageManager.get(StorageManager.KEYS.IMAGES) || [];
    images = images.filter(img => img.id !== imageId);
    StorageManager.set(StorageManager.KEYS.IMAGES, images);
    
    // 同時刪除相關的分析記錄
    AnalysisManager.deleteByImageId(imageId);
    
    console.log('影像已刪除:', imageId);
    return true;
  }
}

class AnalysisManager {
  /**
   * 儲存分析結果
   */
  static saveAnalysis(imageId, analysisData) {
    const analyses = StorageManager.get(StorageManager.KEYS.ANALYSES) || [];
    const currentUser = UserManager.getCurrentUser();
    const image = ImageManager.getImage(imageId);
    
    const newAnalysis = {
      id: 'analysis_' + Date.now(),
      imageId,
      userId: currentUser.id,
      userName: currentUser.name,
      anomalies: analysisData.anomalies,
      riskScore: analysisData.riskScore,
      riskLevel: analysisData.riskLevel,
      riskLevelName: analysisData.riskLevelName,
      recommendation: analysisData.recommendation,
      analyzedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      doctorNotes: null,
      status: 'pending_review' // pending_review, reviewed, follow_up_scheduled
    };
    
    analyses.push(newAnalysis);
    StorageManager.set(StorageManager.KEYS.ANALYSES, analyses);
    
    // 更新影像狀態
    const images = StorageManager.get(StorageManager.KEYS.IMAGES) || [];
    const imgIndex = images.findIndex(img => img.id === imageId);
    if (imgIndex !== -1) {
      images[imgIndex].analysis = newAnalysis.id;
      images[imgIndex].status = 'analyzed';
      StorageManager.set(StorageManager.KEYS.IMAGES, images);
    }
    
    // 如果是高風險，自動建立通知
    if (analysisData.riskLevel === 'high') {
      NotificationManager.createNotification({
        userId: currentUser.id,
        type: 'high_risk_alert',
        title: '⚠️ 發現高風險異常',
        message: `您於 ${new Date().toLocaleString('zh-TW')} 上傳的影像分析結果顯示高風險狀況，請盡快就醫檢查。`,
        relatedId: newAnalysis.id,
        priority: 'high'
      });
    }
    
    console.log('分析結果已儲存:', newAnalysis.id);
    return newAnalysis;
  }
  
  /**
   * 獲取使用者的所有分析記錄
   */
  static getUserAnalyses(userId) {
    const analyses = StorageManager.get(StorageManager.KEYS.ANALYSES) || [];
    return analyses.filter(analysis => analysis.userId === userId).reverse();
  }
  
  /**
   * 獲取單一分析記錄
   */
  static getAnalysis(analysisId) {
    const analyses = StorageManager.get(StorageManager.KEYS.ANALYSES) || [];
    return analyses.find(analysis => analysis.id === analysisId);
  }
  
  /**
   * 獲取單一分析記錄（別名方法）
   */
  static getById(analysisId) {
    return this.getAnalysis(analysisId);
  }
  
  /**
   * 刪除分析記錄（根據影像ID）
   */
  static deleteByImageId(imageId) {
    let analyses = StorageManager.get(StorageManager.KEYS.ANALYSES) || [];
    analyses = analyses.filter(analysis => analysis.imageId !== imageId);
    StorageManager.set(StorageManager.KEYS.ANALYSES, analyses);
  }
  
  /**
   * 醫師審核分析結果
   * @param {string} analysisId - 分析記錄 ID
   * @param {string|object} doctorIdOrData - 醫師 ID 或包含審核資料的物件
   * @param {string} doctorName - 醫師姓名（選填）
   * @param {string} reviewStatus - 審核狀態（選填）
   * @param {string} notes - 審核意見（選填）
   */
  static reviewAnalysis(analysisId, doctorIdOrData, doctorName = null, reviewStatus = 'reviewed', notes = '') {
    const analyses = StorageManager.get(StorageManager.KEYS.ANALYSES) || [];
    const index = analyses.findIndex(a => a.id === analysisId);
    
    if (index === -1) {
      return false;
    }
    
    // 支援兩種調用方式
    let doctorId, doctorNameFinal, notesFinal, statusFinal;
    
    if (typeof doctorIdOrData === 'object') {
      // 舊的調用方式：reviewAnalysis(analysisId, { doctorId, notes })
      doctorId = doctorIdOrData.doctorId;
      doctorNameFinal = doctorIdOrData.doctorName || 'Unknown';
      notesFinal = doctorIdOrData.notes || '';
      statusFinal = 'reviewed';
    } else {
      // 新的調用方式：reviewAnalysis(analysisId, doctorId, doctorName, status, notes)
      doctorId = doctorIdOrData;
      doctorNameFinal = doctorName || 'Unknown';
      notesFinal = notes;
      statusFinal = reviewStatus;
    }
    
    analyses[index].reviewedBy = doctorId;
    analyses[index].reviewedByName = doctorNameFinal;
    analyses[index].reviewedAt = new Date().toISOString();
    analyses[index].doctorNotes = notesFinal;
    analyses[index].status = statusFinal;
    
    StorageManager.set(StorageManager.KEYS.ANALYSES, analyses);
    
    // 建立審核完成通知（僅當狀態為 reviewed 時）
    if (statusFinal === 'reviewed' || statusFinal === 'approved') {
      NotificationManager.createNotification({
        userId: analyses[index].userId,
        type: 'review_completed',
        title: '📋 醫師已完成審核',
        message: `您的口腔健康分析報告已由 ${doctorNameFinal} 醫師審核完成，請查看詳細報告。`,
        relatedId: analysisId,
        priority: 'medium'
      });
    }
    
    return true;
  }
  
  /**
   * 獲取待審核列表（醫師端使用）
   */
  static getPendingReviews() {
    const analyses = StorageManager.get(StorageManager.KEYS.ANALYSES) || [];
    return analyses
      .filter(a => a.status === 'pending_review')
      .sort((a, b) => {
        // 高風險優先
        if (a.riskLevel === 'high' && b.riskLevel !== 'high') return -1;
        if (a.riskLevel !== 'high' && b.riskLevel === 'high') return 1;
        // 時間排序
        return new Date(b.analyzedAt) - new Date(a.analyzedAt);
      });
  }
}

class NotificationManager {
  /**
   * 建立通知
   */
  static createNotification(notificationData) {
    const notifications = StorageManager.get(StorageManager.KEYS.NOTIFICATIONS) || [];
    
    const newNotification = {
      id: 'notif_' + Date.now(),
      userId: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      relatedId: notificationData.relatedId || null,
      priority: notificationData.priority || 'medium', // high, medium, low
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.push(newNotification);
    StorageManager.set(StorageManager.KEYS.NOTIFICATIONS, notifications);
    
    console.log('通知已建立:', newNotification.title);
    return newNotification;
  }
  
  /**
   * 獲取使用者的通知
   */
  static getUserNotifications(userId, unreadOnly = false) {
    const notifications = StorageManager.get(StorageManager.KEYS.NOTIFICATIONS) || [];
    let userNotifications = notifications.filter(n => n.userId === userId);
    
    if (unreadOnly) {
      userNotifications = userNotifications.filter(n => !n.isRead);
    }
    
    return userNotifications.reverse(); // 最新的在前
  }
  
  /**
   * 標記為已讀
   */
  static markAsRead(notificationId) {
    const notifications = StorageManager.get(StorageManager.KEYS.NOTIFICATIONS) || [];
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      notifications[index].isRead = true;
      StorageManager.set(StorageManager.KEYS.NOTIFICATIONS, notifications);
      return true;
    }
    
    return false;
  }
  
  /**
   * 標記全部為已讀
   */
  static markAllAsRead(userId) {
    const notifications = StorageManager.get(StorageManager.KEYS.NOTIFICATIONS) || [];
    
    notifications.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    
    StorageManager.set(StorageManager.KEYS.NOTIFICATIONS, notifications);
    console.log('所有通知已標記為已讀');
  }
  
  /**
   * 獲取未讀數量
   */
  static getUnreadCount(userId) {
    const unreadNotifications = this.getUserNotifications(userId, true);
    return unreadNotifications.length;
  }
}

// 初始化資料庫
StorageManager.init();

/**
 * 預約管理器
 */
class AppointmentManager {
  /**
   * 初始化預約時段數據（生成未來14天的時段）
   */
  static init() {
    const slots = StorageManager.get(StorageManager.KEYS.APPOINTMENT_SLOTS) || [];
    
    // 如果已有數據，不重複初始化
    if (slots.length > 0) {
      return;
    }
    
    // 獲取所有醫生用戶
    const users = StorageManager.get(StorageManager.KEYS.USERS) || [];
    const doctors = users.filter(u => u.role === 'doctor');
    
    // 如果沒有醫生，創建默認醫生數據
    if (doctors.length === 0) {
      doctors.push(
        { id: 'doc1', name: '林志明 醫師', role: 'doctor', specialty: '牙周病專科', hospital: '台大醫院' },
        { id: 'doc2', name: '陳美玲 醫師', role: 'doctor', specialty: '齒顎矯正專科', hospital: '馬偕醫院' },
        { id: 'doc3', name: '王建國 醫師', role: 'doctor', specialty: '口腔外科', hospital: '長庚醫院' }
      );
    }
    
    const newSlots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 生成未來14天的時段
    for (let day = 0; day < 14; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);
      
      // 跳過週日
      if (date.getDay() === 0) {
        continue;
      }
      
      const dateStr = date.toISOString().split('T')[0];
      
      // 為每位醫生生成時段
      doctors.forEach(doctor => {
        // 上午時段: 09:00 - 12:00 (30分鐘一個時段)
        for (let hour = 9; hour < 12; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            newSlots.push({
              id: `slot_${dateStr}_${timeStr}_${doctor.id}`,
              date: dateStr,
              time: timeStr,
              doctorId: doctor.id,
              doctorName: doctor.name,
              doctorSpecialty: doctor.specialty || '一般牙科',
              hospital: doctor.hospital || '醫療診所',
              isBooked: Math.random() > 0.7, // 30% 已被預約
              patientId: null
            });
          }
        }
        
        // 下午時段: 14:00 - 17:00
        for (let hour = 14; hour < 17; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            newSlots.push({
              id: `slot_${dateStr}_${timeStr}_${doctor.id}`,
              date: dateStr,
              time: timeStr,
              doctorId: doctor.id,
              doctorName: doctor.name,
              doctorSpecialty: doctor.specialty || '一般牙科',
              hospital: doctor.hospital || '醫療診所',
              isBooked: Math.random() > 0.7,
              patientId: null
            });
          }
        }
      });
    }
    
    StorageManager.set(StorageManager.KEYS.APPOINTMENT_SLOTS, newSlots);
  }
  
  /**
   * 獲取指定日期的可用時段
   */
  static getAvailableSlots(date) {
    const slots = StorageManager.get(StorageManager.KEYS.APPOINTMENT_SLOTS) || [];
    return slots.filter(slot => slot.date === date && !slot.isBooked);
  }
  
  /**
   * 獲取所有未來可預約的日期
   */
  static getAvailableDates() {
    const slots = StorageManager.get(StorageManager.KEYS.APPOINTMENT_SLOTS) || [];
    const dates = [...new Set(slots.map(slot => slot.date))];
    const today = new Date().toISOString().split('T')[0];
    return dates.filter(date => date >= today).sort();
  }
  
  /**
   * 預約時段
   */
  static bookAppointment(slotId, userId) {
    const slots = StorageManager.get(StorageManager.KEYS.APPOINTMENT_SLOTS) || [];
    const slot = slots.find(s => s.id === slotId);
    
    if (!slot) {
      throw new Error('時段不存在');
    }
    
    if (slot.isBooked) {
      throw new Error('此時段已被預約');
    }
    
    // 更新時段狀態
    slot.isBooked = true;
    slot.patientId = userId;
    StorageManager.set(StorageManager.KEYS.APPOINTMENT_SLOTS, slots);
    
    // 創建預約記錄
    const appointments = StorageManager.get(StorageManager.KEYS.APPOINTMENTS) || [];
    const appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slotId: slotId,
      patientId: userId,
      doctorId: slot.doctorId,
      doctorName: slot.doctorName,
      date: slot.date,
      time: slot.time,
      hospital: slot.hospital,
      status: 'confirmed', // confirmed, completed, cancelled
      createdAt: new Date().toISOString(),
      note: ''
    };
    
    appointments.push(appointment);
    StorageManager.set(StorageManager.KEYS.APPOINTMENTS, appointments);
    
    // 發送通知給患者
    NotificationManager.createNotification(userId, {
      title: '預約成功',
      message: `您已成功預約 ${slot.date} ${slot.time} ${slot.doctorName}`,
      type: 'success'
    });
    
    return appointment;
  }
  
  /**
   * 獲取用戶的所有預約
   */
  static getUserAppointments(userId) {
    const appointments = StorageManager.get(StorageManager.KEYS.APPOINTMENTS) || [];
    return appointments.filter(apt => apt.patientId === userId).sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }
  
  /**
   * 取消預約
   */
  static cancelAppointment(appointmentId) {
    const appointments = StorageManager.get(StorageManager.KEYS.APPOINTMENTS) || [];
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (!appointment) {
      throw new Error('預約不存在');
    }
    
    // 更新預約狀態
    appointment.status = 'cancelled';
    StorageManager.set(StorageManager.KEYS.APPOINTMENTS, appointments);
    
    // 釋放時段
    const slots = StorageManager.get(StorageManager.KEYS.APPOINTMENT_SLOTS) || [];
    const slot = slots.find(s => s.id === appointment.slotId);
    if (slot) {
      slot.isBooked = false;
      slot.patientId = null;
      StorageManager.set(StorageManager.KEYS.APPOINTMENT_SLOTS, slots);
    }
    
    return appointment;
  }
}

// 匯出模組
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    StorageManager,
    UserManager,
    ImageManager,
    AnalysisManager,
    NotificationManager,
    AppointmentManager
  };
}
