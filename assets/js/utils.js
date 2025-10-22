/**
 * DentAI - 工具函數庫
 */

class Utils {
  /**
   * 格式化日期時間
   */
  static formatDateTime(dateString, format = 'full') {
    const date = new Date(dateString);
    
    if (format === 'date') {
      return date.toLocaleDateString('zh-TW');
    } else if (format === 'time') {
      return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    } else if (format === 'short') {
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    
    return date.toLocaleString('zh-TW');
  }
  
  /**
   * 格式化檔案大小
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  /**
   * 將檔案轉為 Base64
   */
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  /**
   * 顯示載入動畫
   */
  static showLoading(message = '處理中...') {
    const existingOverlay = document.querySelector('.loading-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay fade-in';
    overlay.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-text">${message}</div>
    `;
    
    document.body.appendChild(overlay);
  }
  
  /**
   * 隱藏載入動畫
   */
  static hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.remove(), 300);
    }
  }
  
  /**
   * 顯示提示訊息
   */
  static showToast(message, type = 'info', duration = 3000) {
    // 移除現有的 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    const colors = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6'
    };
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    const toast = document.createElement('div');
    toast.className = 'toast slide-up';
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: ${colors[type]};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 90%;
      font-size: 16px;
      font-weight: 500;
    `;
    
    toast.innerHTML = `
      <span style="font-size: 20px;">${icons[type]}</span>
      <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-in-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  
  /**
   * 顯示確認對話框
   */
  static showConfirm(message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay fade-in';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    `;
    
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog slide-up';
    dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    `;
    
    dialog.innerHTML = `
      <div style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">
        確認操作
      </div>
      <div style="font-size: 16px; margin-bottom: 24px; color: #4B5563; line-height: 1.5;">
        ${message}
      </div>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn-cancel" style="
          padding: 12px 24px;
          border: 2px solid #D1D5DB;
          background: white;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          color: #4B5563;
        ">取消</button>
        <button class="btn-confirm" style="
          padding: 12px 24px;
          border: none;
          background: #3B82F6;
          color: white;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        ">確認</button>
      </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    const btnCancel = dialog.querySelector('.btn-cancel');
    const btnConfirm = dialog.querySelector('.btn-confirm');
    
    const closeDialog = () => {
      overlay.style.animation = 'fadeOut 0.3s ease-in-out';
      setTimeout(() => overlay.remove(), 300);
    };
    
    btnCancel.onclick = () => {
      closeDialog();
      if (onCancel) onCancel();
    };
    
    btnConfirm.onclick = () => {
      closeDialog();
      if (onConfirm) onConfirm();
    };
    
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeDialog();
        if (onCancel) onCancel();
      }
    };
  }
  
  /**
   * 生成隨機顏色
   */
  static randomColor() {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  /**
   * 防抖函數
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * 節流函數
   */
  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  /**
   * 檢查是否為行動裝置
   */
  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  /**
   * 複製到剪貼簿
   */
  static copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('已複製到剪貼簿', 'success');
      });
    } else {
      // 備用方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast('已複製到剪貼簿', 'success');
    }
  }
  
  /**
   * 滾動到頂部
   */
  static scrollToTop(smooth = true) {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
  
  /**
   * 滾動到元素
   */
  static scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
  
  /**
   * 驗證 Email 格式
   */
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  /**
   * 驗證手機號碼格式（台灣）
   */
  static validatePhone(phone) {
    const re = /^09\d{8}$/;
    return re.test(phone.replace(/[- ]/g, ''));
  }
  
  /**
   * 生成隨機 ID
   */
  static generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * 深度複製物件
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  /**
   * 檢查物件是否為空
   */
  static isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  
  /**
   * 延遲執行
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * 格式化數字（千分位）
   */
  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  /**
   * 計算兩個日期之間的天數
   */
  static daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
  }
  
  /**
   * 取得相對時間描述
   */
  static getRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return '剛剛';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} 分鐘前`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} 小時前`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} 天前`;
    } else {
      return this.formatDateTime(dateString, 'date');
    }
  }
}

// CSS 動畫定義
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// 匯出模組
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
