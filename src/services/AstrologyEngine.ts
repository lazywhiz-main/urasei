import { ZodiacSign } from '../types/astrology';

// 天体の定義
export type Planet = 
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' 
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';

// アスペクトタイプ
export type AspectType = 
  | 'conjunction' | 'opposition' | 'trine' | 'square' 
  | 'sextile' | 'quincunx';

// 天体位置情報
export interface PlanetPosition {
  planet: Planet;
  zodiacSign: ZodiacSign;
  degree: number;        // 0-29.9999 (星座内の度数)
  absoluteDegree: number; // 0-359.9999 (黄道上の絶対度数)
  retrograde: boolean;
  house?: number;        // 1-12 (ハウス)
}

// アスペクト情報
export interface Aspect {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  orb: number;          // 許容度数
  isExact: boolean;     // 正確なアスペクトかどうか
  strength: number;     // 0-1 (強度)
}

// 出生チャート
export interface BirthChart {
  planets: PlanetPosition[];
  aspects: Aspect[];
  ascendant: ZodiacSign;
  midheaven: ZodiacSign;
  houses: number[];     // 各ハウスの開始度数
  chartDate: Date;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

// 日運情報
export interface DailyTransit {
  date: Date;
  transitingPlanets: PlanetPosition[];
  significantAspects: Aspect[];
  moonPhase: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' 
           | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
  overallEnergy: number; // 1-10
  recommendations: string[];
}

// 天体マスターデータ
const PLANET_DATA = {
  sun: { symbol: '☉', name: '太陽', orbSpeed: 1.0 },
  moon: { symbol: '☽', name: '月', orbSpeed: 13.2 },
  mercury: { symbol: '☿', name: '水星', orbSpeed: 1.6 },
  venus: { symbol: '♀', name: '金星', orbSpeed: 1.2 },
  mars: { symbol: '♂', name: '火星', orbSpeed: 0.5 },
  jupiter: { symbol: '♃', name: '木星', orbSpeed: 0.08 },
  saturn: { symbol: '♄', name: '土星', orbSpeed: 0.03 },
  uranus: { symbol: '♅', name: '天王星', orbSpeed: 0.01 },
  neptune: { symbol: '♆', name: '海王星', orbSpeed: 0.006 },
  pluto: { symbol: '♇', name: '冥王星', orbSpeed: 0.004 }
};

// アスペクト定義
const ASPECT_DATA = {
  conjunction: { angle: 0, orb: 10, symbol: '☌', name: '合' },
  opposition: { angle: 180, orb: 10, symbol: '☍', name: '衝' },
  trine: { angle: 120, orb: 8, symbol: '△', name: '三分' },
  square: { angle: 90, orb: 8, symbol: '□', name: '四分' },
  sextile: { angle: 60, orb: 6, symbol: '⚹', name: '六分' },
  quincunx: { angle: 150, orb: 3, symbol: '⚻', name: '五分' }
};

export class AstrologyEngine {
  
  /**
   * 基準日(2000年1月1日12:00 UTC)からの経過日数を計算
   */
  private static calculateJulianDay(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;
    
    let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
              Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    let jd = jdn + (hour - 12) / 24 + minute / 1440;
    
    return jd;
  }

  /**
   * 簡易的な太陽位置計算（実際の天体暦に比べ精度は劣る）
   */
  private static calculateSunPosition(date: Date): number {
    const jd = this.calculateJulianDay(date);
    const epoch2000 = 2451545.0; // J2000.0
    const daysSinceEpoch = jd - epoch2000;
    
    // 平均黄経 (度)
    const meanLongitude = (280.46646 + 0.9856474 * daysSinceEpoch) % 360;
    
    return meanLongitude < 0 ? meanLongitude + 360 : meanLongitude;
  }

  /**
   * 度数から星座を判定
   */
  private static getZodiacFromDegree(degree: number): ZodiacSign {
    const normalizedDegree = ((degree % 360) + 360) % 360;
    const signIndex = Math.floor(normalizedDegree / 30);
    
    const signs: ZodiacSign[] = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];
    
    return signs[signIndex];
  }

  /**
   * 星座内の度数を計算
   */
  private static getDegreeInSign(absoluteDegree: number): number {
    return absoluteDegree % 30;
  }

  /**
   * 簡易的な天体位置計算（実用レベル）
   */
  public static calculatePlanetPositions(date: Date): PlanetPosition[] {
    const baseJD = this.calculateJulianDay(date);
    const sunPosition = this.calculateSunPosition(date);
    
    const positions: PlanetPosition[] = [];
    
    // 太陽
    positions.push({
      planet: 'sun',
      zodiacSign: this.getZodiacFromDegree(sunPosition),
      degree: this.getDegreeInSign(sunPosition),
      absoluteDegree: sunPosition,
      retrograde: false
    });

    // 月（簡易計算）
    const moonPosition = (sunPosition + 13.2 * (baseJD % 27.3)) % 360;
    positions.push({
      planet: 'moon',
      zodiacSign: this.getZodiacFromDegree(moonPosition),
      degree: this.getDegreeInSign(moonPosition),
      absoluteDegree: moonPosition,
      retrograde: false
    });

    // その他の天体（簡易近似）
    const planetOffsets = {
      mercury: { offset: -5, speed: 1.6, retroPeriod: 116 },
      venus: { offset: 15, speed: 1.2, retroPeriod: 584 },
      mars: { offset: 45, speed: 0.5, retroPeriod: 780 },
      jupiter: { offset: 120, speed: 0.08, retroPeriod: 399 },
      saturn: { offset: 240, speed: 0.03, retroPeriod: 378 },
      uranus: { offset: 300, speed: 0.01, retroPeriod: 370 },
      neptune: { offset: 330, speed: 0.006, retroPeriod: 367 },
      pluto: { offset: 350, speed: 0.004, retroPeriod: 366 }
    };

    Object.entries(planetOffsets).forEach(([planet, data]) => {
      const dayProgress = (baseJD % data.retroPeriod) / data.retroPeriod;
      const isRetrograde = dayProgress > 0.6 && dayProgress < 0.9;
      const speed = isRetrograde ? -data.speed * 0.3 : data.speed;
      
      const position = (sunPosition + data.offset + speed * (baseJD % 365)) % 360;
      
      positions.push({
        planet: planet as Planet,
        zodiacSign: this.getZodiacFromDegree(position),
        degree: this.getDegreeInSign(position),
        absoluteDegree: position,
        retrograde: isRetrograde
      });
    });

    return positions;
  }

  /**
   * アスペクト計算
   */
  public static calculateAspects(positions: PlanetPosition[]): Aspect[] {
    const aspects: Aspect[] = [];
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const planet1 = positions[i];
        const planet2 = positions[j];
        
        const angleDiff = Math.abs(planet1.absoluteDegree - planet2.absoluteDegree);
        const adjustedAngle = angleDiff > 180 ? 360 - angleDiff : angleDiff;
        
        Object.entries(ASPECT_DATA).forEach(([aspectType, aspectInfo]) => {
          const orb = Math.abs(adjustedAngle - aspectInfo.angle);
          
          if (orb <= aspectInfo.orb) {
            const strength = 1 - (orb / aspectInfo.orb);
            const isExact = orb <= 1;
            
            aspects.push({
              planet1: planet1.planet,
              planet2: planet2.planet,
              type: aspectType as AspectType,
              orb,
              isExact,
              strength
            });
          }
        });
      }
    }
    
    return aspects.sort((a, b) => b.strength - a.strength);
  }

  /**
   * 出生チャート生成
   */
  public static generateBirthChart(
    birthDate: Date,
    latitude: number,
    longitude: number,
    timezone: string
  ): BirthChart {
    const positions = this.calculatePlanetPositions(birthDate);
    const aspects = this.calculateAspects(positions);
    
    // アセンダント計算（簡易）
    const localSiderealTime = (birthDate.getHours() + longitude / 15) % 24;
    const ascendantDegree = (localSiderealTime * 15) % 360;
    const ascendant = this.getZodiacFromDegree(ascendantDegree);
    
    // MC計算（簡易）
    const mcDegree = (ascendantDegree + 90) % 360;
    const midheaven = this.getZodiacFromDegree(mcDegree);
    
    // ハウス計算（プラシダス式簡易版）
    const houses = [];
    for (let i = 0; i < 12; i++) {
      houses.push((ascendantDegree + i * 30) % 360);
    }

    return {
      planets: positions,
      aspects,
      ascendant,
      midheaven,
      houses,
      chartDate: birthDate,
      location: { latitude, longitude, timezone }
    };
  }

  /**
   * 日運計算
   */
  public static calculateDailyTransit(
    birthChart: BirthChart,
    targetDate: Date
  ): DailyTransit {
    const transitPositions = this.calculatePlanetPositions(targetDate);
    
    // 出生図との重要なアスペクト検出
    const significantAspects: Aspect[] = [];
    
    transitPositions.forEach(transitPlanet => {
      birthChart.planets.forEach(natalPlanet => {
        const angleDiff = Math.abs(transitPlanet.absoluteDegree - natalPlanet.absoluteDegree);
        const adjustedAngle = angleDiff > 180 ? 360 - angleDiff : angleDiff;
        
        Object.entries(ASPECT_DATA).forEach(([aspectType, aspectInfo]) => {
          const orb = Math.abs(adjustedAngle - aspectInfo.angle);
          
          if (orb <= aspectInfo.orb * 0.7) { // より厳しい基準
            significantAspects.push({
              planet1: transitPlanet.planet,
              planet2: natalPlanet.planet,
              type: aspectType as AspectType,
              orb,
              isExact: orb <= 1,
              strength: 1 - (orb / (aspectInfo.orb * 0.7))
            });
          }
        });
      });
    });

    // 月相計算（簡易）
    const moonPos = transitPositions.find(p => p.planet === 'moon')!;
    const sunPos = transitPositions.find(p => p.planet === 'sun')!;
    const moonPhaseAngle = (moonPos.absoluteDegree - sunPos.absoluteDegree + 360) % 360;
    
    let moonPhase: DailyTransit['moonPhase'];
    if (moonPhaseAngle < 45) moonPhase = 'new';
    else if (moonPhaseAngle < 90) moonPhase = 'waxing_crescent';
    else if (moonPhaseAngle < 135) moonPhase = 'first_quarter';
    else if (moonPhaseAngle < 180) moonPhase = 'waxing_gibbous';
    else if (moonPhaseAngle < 225) moonPhase = 'full';
    else if (moonPhaseAngle < 270) moonPhase = 'waning_gibbous';
    else if (moonPhaseAngle < 315) moonPhase = 'last_quarter';
    else moonPhase = 'waning_crescent';

    // 全体エネルギー計算
    const aspectStrengthSum = significantAspects.reduce((sum, aspect) => sum + aspect.strength, 0);
    const overallEnergy = Math.min(10, Math.max(1, Math.round(aspectStrengthSum * 2 + 3)));

    // 推奨事項生成
    const recommendations = this.generateRecommendations(significantAspects, moonPhase);

    return {
      date: targetDate,
      transitingPlanets: transitPositions,
      significantAspects: significantAspects.sort((a, b) => b.strength - a.strength),
      moonPhase,
      overallEnergy,
      recommendations
    };
  }

  /**
   * 推奨事項生成
   */
  private static generateRecommendations(
    aspects: Aspect[],
    moonPhase: DailyTransit['moonPhase']
  ): string[] {
    const recommendations: string[] = [];
    
    // 月相による基本的なアドバイス
    const moonPhaseAdvice = {
      'new': '新しいことを始めるのに最適な時期です。',
      'waxing_crescent': '目標に向かって着実に進歩する時期です。',
      'first_quarter': '障害を乗り越える力が高まっています。',
      'waxing_gibbous': '努力の成果が現れやすい時期です。',
      'full': '感情が高まり、直感力が冴える時期です。',
      'waning_gibbous': '感謝の気持ちを大切にする時期です。',
      'last_quarter': '手放すべきものを見極める時期です。',
      'waning_crescent': '内面と向き合い、休息を取る時期です。'
    };
    
    recommendations.push(moonPhaseAdvice[moonPhase]);
    
    // アスペクトによる詳細なアドバイス
    const topAspects = aspects.slice(0, 3);
    topAspects.forEach(aspect => {
      const advice = this.getAspectAdvice(aspect);
      if (advice) recommendations.push(advice);
    });
    
    return recommendations;
  }

  /**
   * アスペクト別アドバイス
   */
  private static getAspectAdvice(aspect: Aspect): string | null {
    const planetAdvice: Record<string, Record<AspectType, string>> = {
      sun: {
        conjunction: '自己表現力が高まっています',
        trine: '創造性と自信に満ちた一日',
        square: '困難を乗り越える挑戦の時',
        opposition: '他者との関係性を見直す時',
        sextile: '協力と調和がカギとなります',
        quincunx: '柔軟性を持って調整しましょう'
      },
      moon: {
        conjunction: '感情と直感が冴えています',
        trine: '心の平安と癒しの時',
        square: '感情的な起伏に注意が必要',
        opposition: '感情のバランスを保ちましょう',
        sextile: '人とのつながりを大切に',
        quincunx: '感情の整理整頓が必要'
      }
    };
    
    const planet1Advice = planetAdvice[aspect.planet1];
    if (planet1Advice && planet1Advice[aspect.type]) {
      return planet1Advice[aspect.type];
    }
    
    return null;
  }

  /**
   * 天体データ取得
   */
  public static getPlanetData(planet: Planet) {
    return PLANET_DATA[planet];
  }

  /**
   * アスペクトデータ取得
   */
  public static getAspectData(aspect: AspectType) {
    return ASPECT_DATA[aspect];
  }
}

export { PLANET_DATA, ASPECT_DATA }; 