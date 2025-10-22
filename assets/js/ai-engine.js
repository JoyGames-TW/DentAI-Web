/**
 * DentAI - AI 分析引擎模擬
 * 模擬影像品質檢測、異常辨識、風險評分等功能
 */

class ImageQualityChecker {
  /**
   * 分析影像品質
   * @param {File} imageFile - 上傳的影像檔案
   * @returns {Promise<Object>} 品質檢測結果
   */
  static async analyze(imageFile) {
    return new Promise((resolve) => {
      // 模擬分析處理時間 (1.5-2.5秒)
      const processingTime = 1500 + Math.random() * 1000;
      
      setTimeout(() => {
        // 模擬清晰度評分 (70-95)
        const clarity = Math.floor(Math.random() * 25 + 70);
        
        // 模擬亮度檢測
        const brightnessRandom = Math.random();
        let brightness = 'good';
        let brightnessScore = 85;
        
        if (brightnessRandom < 0.15) {
          brightness = 'too_dark';
          brightnessScore = 40;
        } else if (brightnessRandom > 0.85) {
          brightness = 'too_bright';
          brightnessScore = 45;
        }
        
        // 模擬角度檢測
        const angleRandom = Math.random();
        const angle = angleRandom > 0.2 ? 'appropriate' : 'needs_adjustment';
        const angleScore = angleRandom > 0.2 ? 90 : 55;
        
        // 綜合判定
        const passed = clarity >= 70 && brightness === 'good' && angle === 'appropriate';
        const overallScore = Math.round((clarity + brightnessScore + angleScore) / 3);
        
        const result = {
          passed,
          overallScore,
          clarity,
          brightness,
          brightnessScore,
          angle,
          angleScore,
          timestamp: new Date().toISOString(),
          suggestions: this.generateSuggestions(clarity, brightness, angle)
        };
        
        console.log('品質檢測結果:', result);
        resolve(result);
      }, processingTime);
    });
  }
  
  /**
   * 生成改善建議
   */
  static generateSuggestions(clarity, brightness, angle) {
    const suggestions = [];
    
    if (clarity < 70) {
      suggestions.push('請確保鏡頭清潔，並保持手部穩定');
    }
    
    if (brightness === 'too_dark') {
      suggestions.push('光線不足，請在明亮處拍攝或開啟閃光燈');
    } else if (brightness === 'too_bright') {
      suggestions.push('光線過強，請避免直射光源');
    }
    
    if (angle === 'needs_adjustment') {
      suggestions.push('請調整拍攝角度，保持鏡頭與牙齒平行');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('影像品質良好，可進行分析');
    }
    
    return suggestions;
  }
}

class AnomalyDetector {
  /**
   * 偵測口腔異常
   * @param {Object} imageData - 影像資料
   * @returns {Promise<Array>} 異常清單
   */
  static async detect(imageData) {
    return new Promise((resolve) => {
      // 模擬AI分析時間 (2-3秒)
      const processingTime = 2000 + Math.random() * 1000;
      
      setTimeout(() => {
        const anomalies = [];
        
        // 齲齒檢測 (40% 機率)
        if (Math.random() > 0.6) {
          const cariesCount = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < cariesCount; i++) {
            anomalies.push({
              id: this.generateId(),
              type: 'caries',
              typeName: '齲齒',
              confidence: Math.floor(Math.random() * 35 + 60), // 60-95
              location: this.randomToothLocation(),
              severity: Math.random() > 0.5 ? 'moderate' : 'severe',
              severityName: Math.random() > 0.5 ? '中度' : '嚴重',
              description: '偵測到牙齒表面可能有蛀洞或脫鈣現象'
            });
          }
        }
        
        // 牙石檢測 (50% 機率)
        if (Math.random() > 0.5) {
          anomalies.push({
            id: this.generateId(),
            type: 'calculus',
            typeName: '牙結石',
            confidence: Math.floor(Math.random() * 30 + 55), // 55-85
            location: this.randomGumLocation(),
            severity: 'mild',
            severityName: '輕度',
            description: '牙齦邊緣或齒間發現礦化沉積物'
          });
        }
        
        // 牙齦發炎檢測 (30% 機率)
        if (Math.random() > 0.7) {
          anomalies.push({
            id: this.generateId(),
            type: 'gingivitis',
            typeName: '牙齦炎',
            confidence: Math.floor(Math.random() * 25 + 65), // 65-90
            location: 'gingiva',
            locationName: '牙齦',
            severity: Math.random() > 0.6 ? 'mild' : 'moderate',
            severityName: Math.random() > 0.6 ? '輕度' : '中度',
            description: '牙齦組織呈現紅腫或色澤異常'
          });
        }
        
        // 色澤變化檢測 (35% 機率)
        if (Math.random() > 0.65) {
          anomalies.push({
            id: this.generateId(),
            type: 'discoloration',
            typeName: '色澤異常',
            confidence: Math.floor(Math.random() * 30 + 50), // 50-80
            location: this.randomToothLocation(),
            severity: 'mild',
            severityName: '輕度',
            description: '牙齒表面色澤不均或有色素沉澱'
          });
        }
        
        // 牙周退縮檢測 (20% 機率)
        if (Math.random() > 0.8) {
          anomalies.push({
            id: this.generateId(),
            type: 'recession',
            typeName: '牙齦退縮',
            confidence: Math.floor(Math.random() * 28 + 60), // 60-88
            location: this.randomToothLocation(),
            severity: Math.random() > 0.5 ? 'moderate' : 'severe',
            severityName: Math.random() > 0.5 ? '中度' : '嚴重',
            description: '牙根部分外露，牙齦高度下降'
          });
        }
        
        console.log('異常檢測結果:', anomalies);
        resolve(anomalies);
      }, processingTime);
    });
  }
  
  /**
   * 生成隨機牙齒位置
   */
  static randomToothLocation() {
    const teeth = [
      { code: '11', name: '右上中門齒' },
      { code: '12', name: '右上側門齒' },
      { code: '13', name: '右上犬齒' },
      { code: '21', name: '左上中門齒' },
      { code: '22', name: '左上側門齒' },
      { code: '31', name: '左下中門齒' },
      { code: '32', name: '左下側門齒' },
      { code: '41', name: '右下中門齒' },
      { code: '42', name: '右下側門齒' },
    ];
    const tooth = teeth[Math.floor(Math.random() * teeth.length)];
    return `${tooth.code} (${tooth.name})`;
  }
  
  /**
   * 生成隨機牙齦位置
   */
  static randomGumLocation() {
    const locations = [
      '上顎前牙區',
      '下顎前牙區',
      '右側臼齒區',
      '左側臼齒區',
      '全口牙齦'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }
  
  /**
   * 生成唯一ID
   */
  static generateId() {
    return 'anomaly_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

class RiskCalculator {
  /**
   * 計算風險評分
   * @param {Array} anomalies - 異常清單
   * @returns {Object} 風險評估結果
   */
  static calculate(anomalies) {
    // 風險權重配置
    const weights = {
      caries: 3,        // 齲齒 - 高風險
      recession: 3,     // 牙齦退縮 - 高風險
      gingivitis: 2,    // 牙齦炎 - 中風險
      calculus: 2,      // 牙結石 - 中風險
      discoloration: 1  // 色澤變化 - 低風險
    };
    
    let totalScore = 0;
    const anomalyDetails = [];
    
    anomalies.forEach(anomaly => {
      const weight = weights[anomaly.type] || 1;
      const contributionScore = (anomaly.confidence / 100) * weight;
      totalScore += contributionScore;
      
      anomalyDetails.push({
        type: anomaly.typeName,
        confidence: anomaly.confidence,
        weight,
        contribution: Math.round(contributionScore * 10) / 10
      });
    });
    
    // 四捨五入到小數點後一位
    totalScore = Math.round(totalScore * 10) / 10;
    
    // 判定風險等級
    let level = 'low';
    let levelName = '低風險';
    let color = '#10B981';
    let icon = '✅';
    let recommendation = '未發現明顯異常，請繼續保持良好的口腔衛生習慣。建議每 3 個月定期追蹤。';
    
    if (totalScore >= 8) {
      level = 'high';
      levelName = '高風險';
      color = '#EF4444';
      icon = '🔴';
      recommendation = '偵測到嚴重異常徵兆，強烈建議您盡快預約牙科檢查，以免延誤治療時機。';
    } else if (totalScore >= 5) {
      level = 'medium';
      levelName = '中風險';
      color = '#F59E0B';
      icon = '🟠';
      recommendation = '發現部分需要注意的狀況，請加強口腔清潔，並於一週內安排複查。';
    }
    
    const result = {
      score: totalScore,
      level,
      levelName,
      color,
      icon,
      anomalyCount: anomalies.length,
      highRiskCount: anomalies.filter(a => weights[a.type] === 3).length,
      mediumRiskCount: anomalies.filter(a => weights[a.type] === 2).length,
      lowRiskCount: anomalies.filter(a => weights[a.type] === 1).length,
      recommendation,
      anomalyDetails,
      timestamp: new Date().toISOString()
    };
    
    console.log('風險評估結果:', result);
    return result;
  }
  
  /**
   * 生成警示訊息
   */
  static generateAlert(riskResult) {
    const templates = {
      high: {
        title: '⚠️ 發現高風險異常',
        message: `您的口腔健康評分為 ${riskResult.score} 分（高風險），偵測到 ${riskResult.anomalyCount} 項異常。${riskResult.recommendation}`,
        action: '立即預約',
        actionUrl: 'tel:0800-123-456',
        urgency: 'immediate'
      },
      medium: {
        title: '⚡ 需要注意',
        message: `您的口腔健康評分為 ${riskResult.score} 分（中風險），發現 ${riskResult.anomalyCount} 項需要關注的狀況。${riskResult.recommendation}`,
        action: '查看詳情',
        actionUrl: '#report',
        urgency: 'soon'
      },
      low: {
        title: '✅ 口腔健康良好',
        message: `您的口腔健康評分為 ${riskResult.score} 分（低風險）。${riskResult.recommendation}`,
        action: '查看報告',
        actionUrl: '#report',
        urgency: 'routine'
      }
    };
    
    return templates[riskResult.level];
  }
}

class TimeSeriesAnalyzer {
  /**
   * 分析時序變化
   * @param {Array} historicalData - 歷史分析記錄
   * @returns {Object} 趨勢分析結果
   */
  static analyzeTrend(historicalData) {
    if (!historicalData || historicalData.length < 2) {
      return {
        trend: 'insufficient_data',
        trendName: '資料不足',
        message: '需要至少 2 次記錄才能進行趨勢分析'
      };
    }
    
    // 取最近兩次記錄比較
    const latest = historicalData[historicalData.length - 1];
    const previous = historicalData[historicalData.length - 2];
    
    const scoreDiff = latest.riskScore - previous.riskScore;
    const anomalyDiff = latest.anomalyCount - previous.anomalyCount;
    
    let trend = 'stable';
    let trendName = '穩定';
    let icon = '➡️';
    let message = '口腔健康狀況與上次相比無明顯變化';
    
    if (scoreDiff > 2 || anomalyDiff > 1) {
      trend = 'worsening';
      trendName = '惡化';
      icon = '📈';
      message = '口腔健康狀況較上次惡化，請加強注意';
    } else if (scoreDiff < -2 || anomalyDiff < -1) {
      trend = 'improving';
      trendName = '改善';
      icon = '📉';
      message = '口腔健康狀況較上次改善，請繼續保持';
    }
    
    return {
      trend,
      trendName,
      icon,
      message,
      scoreDiff: Math.round(scoreDiff * 10) / 10,
      anomalyDiff,
      latestScore: latest.riskScore,
      previousScore: previous.riskScore,
      recordCount: historicalData.length
    };
  }
  
  /**
   * 生成健康趨勢圖表資料
   */
  static generateChartData(historicalData) {
    if (!historicalData || historicalData.length === 0) {
      return null;
    }
    
    const labels = historicalData.map(record => {
      const date = new Date(record.timestamp);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    const scores = historicalData.map(record => record.riskScore);
    
    return {
      labels,
      datasets: [{
        label: '風險評分',
        data: scores,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    };
  }
}

// 匯出模組 (如果使用 ES6 模組系統)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ImageQualityChecker,
    AnomalyDetector,
    RiskCalculator,
    TimeSeriesAnalyzer
  };
}
