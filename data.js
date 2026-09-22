const SAVE_KEY = "pyrpg_save_github_v3.2_" + window.location.pathname.replace(/[^a-zA-Z0-9]/g, "_");

// 6 大二階轉職分支數據與屬性加成
const JOB_ADVANCEMENTS = {
    Warrior: [
        {
            id: "BerserkerLord", nameZh: "狂戰士", descZh: "專精高爆發與吸血戰鬥！",
            hp: 150, mp: 0, atk: 35, critRate: 10, critDmg: 30, evasion: 0
        },
        {
            id: "Paladin", nameZh: "聖騎士", descZh: "極致生存防禦與神聖護盾！",
            hp: 300, mp: 80, atk: 15, critRate: 0, critDmg: 0, evasion: 5
        }
    ],
    Mage: [
        {
            id: "ElementEmperor", nameZh: "元素法師", descZh: "毀滅性的多元素極限魔攻！",
            hp: 80, mp: 200, atk: 40, critRate: 10, critDmg: 25, evasion: 0
        },
        {
            id: "Necromancer", nameZh: "死靈巫師", descZh: "掌握持續毒傷與生命吸取！",
            hp: 180, mp: 120, atk: 25, critRate: 5, critDmg: 0, evasion: 5
        }
    ],
    Archer: [
        {
            id: "SoulSniper", nameZh: "狙擊手", descZh: "遠距離致命暴擊一擊必殺！",
            hp: 100, mp: 40, atk: 45, critRate: 15, critDmg: 50, evasion: 5
        },
        {
            id: "GaleRanger", nameZh: "疾風游俠", descZh: "高閃避與極致連續射擊！",
            hp: 120, mp: 60, atk: 30, critRate: 5, critDmg: 15, evasion: 15
        }
    ]
};

const SKILLS = {
    // 通用 (11)
    "重擊": { type: "universal", elem: "none", cost: 50, mp: 5, mult: 1.5, cd: 0, descZh: "通用：1.5倍物理傷害" },
    "治癒術": { type: "universal", elem: "none", cost: 80, mp: 10, heal: 50, cd: 1, descZh: "通用：恢復 50 HP" },
    "神聖護盾": { type: "universal", elem: "none", cost: 90, mp: 12, shield: 40, cd: 2, descZh: "通用：獲得 40 護盾" },
    "強擊": { type: "universal", elem: "none", cost: 110, mp: 10, mult: 1.8, cd: 1, descZh: "通用：1.8倍物理傷害" },
    "高級治癒": { type: "universal", elem: "none", cost: 150, mp: 20, heal: 120, cd: 2, descZh: "通用：恢復 120 HP" },
    "戰意高昂": { type: "universal", elem: "none", cost: 140, mp: 15, mult: 2.0, cd: 2, buffZh: "戰意 [2T]", buffTurn: 2, descZh: "通用：2.0倍強打並提升戰意" },
    "破甲一擊": { type: "universal", elem: "none", cost: 160, mp: 18, mult: 1.7, cd: 2, debuffZh: "破甲 [2T]", debuffTurn: 2, descZh: "通用：1.7倍打擊降敵防護" },
    "精靈賜福": { type: "universal", elem: "none", cost: 200, mp: 25, shield: 150, cd: 3, descZh: "通用：獲得 150 護盾" },
    "虛弱詛咒": { type: "universal", elem: "none", cost: 170, mp: 16, mult: 1.9, cd: 2, debuffZh: "虛弱 [2T]", debuffTurn: 2, descZh: "通用：1.9倍傷害並衰弱對手" },
    "聖光復甦": { type: "universal", elem: "none", cost: 220, mp: 28, heal: 200, cd: 3, descZh: "通用：高額恢復 200 HP" },
    "生命分流": { type: "universal", elem: "none", cost: 160, mp: 5, mult: 2.3, cd: 1, descZh: "通用：2.3倍高傷害打擊" },

    // 戰士專屬 (20)
    "旋風斬": { type: "Warrior", elem: "gale", cost: 150, mp: 8, mult: 2.0, cd: 1, descZh: "風屬：2.0倍橫掃傷害" },
    "怒火狂暴": { type: "Warrior", elem: "flame", cost: 190, mp: 12, mult: 2.4, cd: 2, buffZh: "狂暴 [2T]", buffTurn: 2, descZh: "火屬：2.4倍觸發狂暴" },
    "威壓咆哮": { type: "Warrior", elem: "none", cost: 210, mp: 15, mult: 2.2, cd: 2, debuffZh: "威壓 [2T]", debuffTurn: 2, descZh: "戰士：2.2倍威壓降敵傷" },
    "狂暴打擊": { type: "Warrior", elem: "flame", cost: 220, mp: 14, mult: 2.8, cd: 1, descZh: "火屬：2.8倍致命強打" },
    "裂地重斬": { type: "Warrior", elem: "none", cost: 280, mp: 18, mult: 3.3, cd: 2, descZh: "戰士：3.3倍崩裂打擊" },
    "泰坦重踏": { type: "Warrior", elem: "thunder", cost: 350, mp: 24, mult: 4.0, cd: 3, descZh: "雷屬：4.0倍泰坦重擊" },
    "不屈怒吼": { type: "Warrior", elem: "none", cost: 200, mp: 15, shield: 120, cd: 2, buffZh: "不屈 [2T]", buffTurn: 2, descZh: "戰士：獲得 120 點護盾" },
    "盾牆壁壘": { type: "Warrior", elem: "none", cost: 260, mp: 20, shield: 220, cd: 3, buffZh: "鐵壁 [3T]", buffTurn: 3, descZh: "戰士：獲得 220 點護盾" },
    "重傷揮砍": { type: "Warrior", elem: "none", cost: 270, mp: 19, mult: 3.1, cd: 2, debuffZh: "流血 [2T]", debuffTurn: 2, descZh: "戰士：3.1倍撕裂性流血打擊" },
    "血氣爆發": { type: "Warrior", elem: "flame", cost: 300, mp: 20, mult: 3.6, cd: 2, descZh: "火屬：3.6倍血氣傷害" },
    "衝鋒撞擊": { type: "Warrior", elem: "gale", cost: 180, mp: 12, mult: 2.4, cd: 1, descZh: "風屬：2.4倍衝鋒打擊" },
    "獅子斬": { type: "Warrior", elem: "none", cost: 320, mp: 22, mult: 3.8, cd: 2, descZh: "戰士：3.8倍霸王斬擊" },
    "龍捲斬": { type: "Warrior", elem: "gale", cost: 380, mp: 26, mult: 4.3, cd: 3, descZh: "風屬：4.3倍旋風狂斬" },
    "破軍衝鋒": { type: "Warrior", elem: "none", cost: 420, mp: 30, mult: 4.8, cd: 3, descZh: "戰士：4.8倍破陣重擊" },
    "終極毀滅斬": { type: "Warrior", elem: "flame", cost: 500, mp: 35, mult: 5.5, cd: 4, descZh: "火屬：5.5倍終極斬擊" },
    "無畏重斬": { type: "Warrior", elem: "none", cost: 290, mp: 21, mult: 3.4, cd: 2, descZh: "戰士：3.4倍無畏砍劈" },
    "斷鋼斬": { type: "Warrior", elem: "none", cost: 340, mp: 25, mult: 3.9, cd: 2, descZh: "戰士：3.9倍斷鋼強打" },
    "霸王衝鋒": { type: "Warrior", elem: "none", cost: 400, mp: 28, mult: 4.5, cd: 3, descZh: "戰士：4.5倍霸王衝鋒" },
    "屠龍開山斬": { type: "Warrior", elem: "flame", cost: 460, mp: 32, mult: 5.1, cd: 3, descZh: "火屬：5.1倍屠龍開山斬" },
    "神怒天地破": { type: "Warrior", elem: "thunder", cost: 530, mp: 38, mult: 5.8, cd: 4, descZh: "雷屬：5.8倍天地崩裂斬" },

    // 法師專屬 (20)
    "火球術": { type: "Mage", elem: "flame", cost: 180, mp: 15, mult: 2.5, cd: 0, descZh: "火屬：2.5倍高額魔攻" },
    "魔力激流": { type: "Mage", elem: "none", cost: 210, mp: 16, mult: 2.7, cd: 2, buffZh: "魔激 [2T]", buffTurn: 2, descZh: "法師：2.7倍魔攻活化魔力" },
    "凍結星塵": { type: "Mage", elem: "frost", cost: 230, mp: 18, mult: 2.6, cd: 2, debuffZh: "凍結 [2T]", debuffTurn: 2, descZh: "冰屬：2.6倍冰極凍結打擊" },
    "雷霆一擊": { type: "Mage", elem: "thunder", cost: 250, mp: 20, mult: 3.2, cd: 1, descZh: "雷屬：3.2倍毀滅電擊" },
    "冰霜星爆": { type: "Mage", elem: "frost", cost: 260, mp: 22, mult: 2.3, cd: 2, debuffZh: "凍傷 [2T]", debuffTurn: 2, descZh: "冰屬：2.3倍冰霜爆破" },
    "秘銀奧術": { type: "Mage", elem: "none", cost: 210, mp: 18, mult: 2.9, cd: 1, descZh: "法師：2.9倍奧術衝擊" },
    "虛空衰弱": { type: "Mage", elem: "none", cost: 280, mp: 21, mult: 3.1, cd: 2, debuffZh: "衰弱 [2T]", debuffTurn: 2, descZh: "法師：3.1倍削敵抗性" },
    "閃電鏈": { type: "Mage", elem: "thunder", cost: 290, mp: 24, mult: 3.5, cd: 2, descZh: "雷屬：3.5倍連環閃電" },
    "烈焰風暴": { type: "Mage", elem: "flame", cost: 310, mp: 25, mult: 3.7, cd: 2, debuffZh: "灼燒 [2T]", debuffTurn: 2, descZh: "火屬：3.7倍火焰風暴" },
    "絕對零度": { type: "Mage", elem: "frost", cost: 330, mp: 28, mult: 3.9, cd: 3, descZh: "冰屬：3.9倍極寒凍結" },
    "神聖光輝": { type: "Mage", elem: "none", cost: 360, mp: 30, heal: 280, cd: 3, buffZh: "光輝 [2T]", buffTurn: 2, descZh: "法師：高額恢復 280 HP" },
    "星爆氣流": { type: "Mage", elem: "none", cost: 380, mp: 30, mult: 4.2, cd: 3, descZh: "法師：4.2倍星爆魔攻" },
    "流星雨": { type: "Mage", elem: "flame", cost: 400, mp: 32, mult: 4.5, cd: 3, descZh: "火屬：4.5倍流星打擊" },
    "末日審判": { type: "Mage", elem: "flame", cost: 450, mp: 35, mult: 4.9, cd: 4, descZh: "火屬：4.9倍末日魔攻" },
    "虛空風暴": { type: "Mage", elem: "thunder", cost: 480, mp: 38, mult: 5.2, cd: 4, descZh: "雷屬：5.2倍虛空打擊" },
    "超新星爆發": { type: "Mage", elem: "flame", cost: 520, mp: 40, mult: 5.6, cd: 4, descZh: "法師：5.6倍極限爆破" },
    "太陽耀斑": { type: "Mage", elem: "flame", cost: 350, mp: 27, mult: 4.1, cd: 3, descZh: "火屬：4.1倍強光打擊" },
    "黑洞吞噬": { type: "Mage", elem: "none", cost: 430, mp: 33, mult: 4.7, cd: 3, descZh: "法師：4.7倍黑洞魔法" },
    "混沌滅世破": { type: "Mage", elem: "thunder", cost: 490, mp: 37, mult: 5.4, cd: 4, descZh: "雷屬：5.4倍混沌毀滅魔攻" },
    "創世元素爆": { type: "Mage", elem: "flame", cost: 550, mp: 42, mult: 6.0, cd: 5, descZh: "火屬：6.0倍創世極限魔攻" },

    // 射手專屬 (20)
    "狙擊": { type: "Archer", elem: "none", cost: 160, mp: 12, mult: 2.2, cd: 0, descZh: "射手：2.2倍精準打擊" },
    "鷹眼專注": { type: "Archer", elem: "none", cost: 190, mp: 14, mult: 2.5, cd: 2, buffZh: "鷹眼 [2T]", buffTurn: 2, descZh: "射手：2.5倍射擊提升暴擊" },
    "影縫箭": { type: "Archer", elem: "none", cost: 210, mp: 16, mult: 2.6, cd: 2, debuffZh: "影縫 [2T]", debuffTurn: 2, descZh: "射手：2.6倍打擊封鎖閃避" },
    "致命毒箭": { type: "Archer", elem: "none", cost: 210, mp: 15, mult: 2.4, cd: 2, debuffZh: "劇毒 [2T]", debuffTurn: 2, descZh: "射手：2.4倍劇毒穿透" },
    "疾風步": { type: "Archer", elem: "gale", cost: 220, mp: 15, mult: 2.8, cd: 2, buffZh: "疾風 [2T]", buffTurn: 2, descZh: "風屬：2.8倍疾風提升閃避" },
    "萬箭齊發": { type: "Archer", elem: "gale", cost: 240, mp: 18, mult: 2.7, cd: 1, descZh: "風屬：2.7倍高暴擊" },
    "幻影連射": { type: "Archer", elem: "none", cost: 270, mp: 20, mult: 3.1, cd: 2, descZh: "射手：3.1倍連發射擊" },
    "鷹眼重弩": { type: "Archer", elem: "none", cost: 310, mp: 22, mult: 3.6, cd: 2, descZh: "射手：3.6倍精準狙殺" },
    "爆裂矢": { type: "Archer", elem: "flame", cost: 330, mp: 24, mult: 3.8, cd: 2, descZh: "火屬：3.8倍爆破傷害" },
    "貫星神箭": { type: "Archer", elem: "thunder", cost: 360, mp: 26, mult: 4.1, cd: 3, descZh: "雷屬：4.1倍貫星致命打擊" },
    "追魂箭": { type: "Archer", elem: "none", cost: 410, mp: 28, mult: 4.6, cd: 3, descZh: "射手：4.6倍追魂致命打擊" },
    "疾風連射": { type: "Archer", elem: "gale", cost: 440, mp: 32, mult: 5.0, cd: 3, descZh: "風屬：5.0倍疾風連射" },
    "神怒天罰箭": { type: "Archer", elem: "thunder", cost: 510, mp: 38, mult: 5.7, cd: 4, descZh: "雷屬：5.7倍天罰毀滅打擊" },
    "雙重狙擊": { type: "Archer", elem: "none", cost: 180, mp: 13, mult: 2.3, cd: 1, descZh: "射手：2.3倍雙發打擊" },
    "寒冰毒箭": { type: "Archer", elem: "frost", cost: 230, mp: 17, mult: 2.9, cd: 2, descZh: "冰屬：2.9倍冰毒射擊" },
    "疾風閃電矢": { type: "Archer", elem: "thunder", cost: 280, mp: 20, mult: 3.2, cd: 2, descZh: "雷屬：3.2倍閃電穿透" },
    "穿甲巨弩": { type: "Archer", elem: "none", cost: 340, mp: 25, mult: 3.9, cd: 2, descZh: "射手：3.9倍無視防禦" },
    "影舞連環射": { type: "Archer", elem: "gale", cost: 390, mp: 27, mult: 4.4, cd: 3, descZh: "風屬：4.4倍影舞連射" },
    "滅世連弓箭": { type: "Archer", elem: "none", cost: 470, mp: 34, mult: 5.2, cd: 4, descZh: "射手：5.2倍滅世狙殺" },
    "終極貫星天箭": { type: "Archer", elem: "thunder", cost: 540, mp: 40, mult: 5.9, cd: 5, descZh: "雷屬：5.9倍終極天箭打擊" }
};

const CLASSES = {
    "Warrior": { nameZh: "戰士", hp: 220, mp: 60, min: 22, max: 30, weaponZh: "鐵劍", critRate: 5, critDmg: 150, evasion: 5 },
    "Mage": { nameZh: "法師", hp: 110, mp: 220, min: 28, max: 40, weaponZh: "木製法杖", critRate: 10, critDmg: 160, evasion: 5 },
    "Archer": { nameZh: "射手", hp: 130, mp: 90, min: 25, max: 35, weaponZh: "獵人長弓", critRate: 15, critDmg: 150, evasion: 20 }
};

const ALL_EQUIPS_POOL = [
    { nameZh: "初級·鋼鐵頭盔 (+30 MaxHP)", slot: "helmet", tier: "basic", cost: 60, hp: 30 },
    { nameZh: "初級·皮質面甲 (+25 HP | +15 MP)", slot: "helmet", tier: "basic", cost: 65, hp: 25, mp: 15 },
    { nameZh: "初級·皮質胸甲 (+40 MaxHP)", slot: "chest", tier: "basic", cost: 70, hp: 40 },
    { nameZh: "初級·輕型腿甲 (+25 MaxHP | +3% 閃避)", slot: "leggings", tier: "basic", cost: 65, hp: 25, evasion: 3 },
    { nameZh: "初級·鐵質手腕 (+10 攻擊)", slot: "bracer", tier: "basic", cost: 55, atk: 10 },
    { nameZh: "初級·布質護腕 (+15 MP | +5 攻擊)", slot: "bracer", tier: "basic", cost: 50, mp: 15, atk: 5 },
    { nameZh: "初級·鐵質短劍 (+12 攻擊)", slot: "weapon", tier: "basic", job: "Warrior", cost: 80, atk: 12 },
    { nameZh: "初級·學徒魔杖 (+15 攻擊)", slot: "weapon", tier: "basic", job: "Mage", cost: 90, atk: 15 },
    { nameZh: "初級·短獵弓 (+14 攻擊)", slot: "weapon", tier: "basic", job: "Archer", cost: 85, atk: 14 },

    { nameZh: "中級·精鋼戰盔 (+85 MaxHP | +40 MP)", slot: "helmet", tier: "mid", cost: 220, hp: 85, mp: 40 },
    { nameZh: "中級·冥想智者冠 (+60 MaxHP | +90 MP)", slot: "helmet", tier: "mid", cost: 250, hp: 60, mp: 90 },
    { nameZh: "中級·精鋼重甲 (+110 MaxHP | +5% 閃避)", slot: "chest", tier: "mid", cost: 280, hp: 110, evasion: 5 },
    { nameZh: "中級·秘銀法系長袍 (+80 MaxHP | +120 MP)", slot: "chest", tier: "mid", cost: 310, hp: 80, mp: 120 },
    { nameZh: "中級·疾風腿甲 (+65 MaxHP | +7% 閃避)", slot: "leggings", tier: "mid", cost: 240, hp: 65, evasion: 7 },
    { nameZh: "中級·精鋼護腕 (+22 攻擊 | +3% 暴擊)", slot: "bracer", tier: "mid", cost: 200, atk: 22, critRate: 3 },
    { nameZh: "中級·騎士長劍 (+25 攻擊 | +5% 暴擊率)", slot: "weapon", tier: "mid", job: "Warrior", cost: 260, atk: 25, critRate: 5 },
    { nameZh: "中級·水晶法杖 (+30 攻擊 | +10% 暴傷)", slot: "weapon", tier: "mid", job: "Mage", cost: 300, atk: 30, critDmg: 10 },
    { nameZh: "中級·精準長弩 (+28 攻擊 | +8% 暴擊率)", slot: "weapon", tier: "mid", job: "Archer", cost: 280, atk: 28, critRate: 8 }
];

const MAPS = {
    1: { nameZh: "🌲 微光森林", weakness: "flame", villageZh: "樹梢村", monstersZh: ["哥布林斥候", "史萊姆", "狂暴野狼"], bossZh: "哥布林千人將" },
    2: { nameZh: "❄️ 寒霜雪原", weakness: "flame", villageZh: "冰晶鎮", monstersZh: ["霜狼", "雪原獵手", "冰晶石傀儡"], bossZh: "雪原暴熊王" },
    3: { nameZh: "🏜️ 熾熱荒漠", weakness: "frost", villageZh: "烈日綠洲", monstersZh: ["沙漠毒蠍", "狂沙蛇衛", "石雕巨像"], bossZh: "狂沙法老王" },
    4: { nameZh: "🌋 烈焰火山", weakness: "frost", villageZh: "火環前哨站", monstersZh: ["熔岩蜥蜴", "烈焰元素", "火焰惡魔"], bossZh: "熔岩巨龍" },
    5: { nameZh: "☠️ 幽暗地底迷宮", weakness: "thunder", villageZh: "暗影黑市", monstersZh: ["幽暗蜘蛛", "噬魂骷髏", "黑暗騎士"], bossZh: "暗影領主·卡爾巨影" },
    6: { nameZh: "🏛️ 失落古城", weakness: "thunder", villageZh: "海底驛站", monstersZh: ["遺跡守衛", "沉淪亡靈", "符文石像"], bossZh: "古代遠古守護者" },
    7: { nameZh: "⚡ 雷霆山峰", weakness: "gale", villageZh: "雲頂高地", monstersZh: ["雷霆獅鷲", "風暴元素", "閃電巨鷹"], bossZh: "風暴泰坦" },
    8: { nameZh: "🌊 深海幽谷", weakness: "thunder", villageZh: "海螺港口", monstersZh: ["潮汐海妖", "巨鉗蟹王", "深海怪魚"], bossZh: "深淵巨獸·克拉肯" },
    9: { nameZh: "☁️ 天空神殿", weakness: "gale", villageZh: "聖光高塔", monstersZh: ["神殿石像鬼", "光明聖衛", "天空巨鷹"], bossZh: "天使長·米迦勒幻影" },
    10: { nameZh: "👑 魔王城城堡", weakness: "flame", villageZh: "終極前線", monstersZh: ["煉獄夜魔", "漆黑騎士", "亡靈巨龍"], bossZh: "滅世魔王·路西法" }
};

const CARDS_DATABASE = [
    { id: "vampire", nameZh: "🩸 吸血鬼之吻", descZh: "攻擊時恢復傷害 15% HP" },
    { id: "berserk", nameZh: "🔥 狂暴之怒", descZh: "基礎攻擊力提升 25%" },
    { id: "shield", nameZh: "🛡️ 鋼鐵意志", descZh: "最大血量提升 80 點" },
    { id: "holy_shield", nameZh: "✨ 神聖護身", descZh: "進入戰鬥獲得 60 護盾" },
    { id: "wind_step", nameZh: "🌀 疾風之步", descZh: "閃避率提升 15%" },
    { id: "mana_flow", nameZh: "💧 魔力源泉", descZh: "最大魔力提升 60 點" },
    { id: "poison_blade", nameZh: "☠️ 劇毒之刃", descZh: "攻擊附加 20% 中毒率" },
    { id: "crit_fury", nameZh: "💥 暴怒火花", descZh: "暴擊率提升 15%" },
    { id: "gold_bless", nameZh: "🌟 黃金祝福", descZh: "戰鬥金幣收益提升 30%" },
    { id: "exp_master", nameZh: "📖 冒險天賦", descZh: "基礎傷害提升 15 點" },
    { id: "titan_guard", nameZh: "🗿 金剛不壞", descZh: "最大血量提升 120 點" },
    { id: "shadow_revenge", nameZh: "🌑 暗影復仇", descZh: "暴擊傷害提升 30%" },
    { id: "element_burst", nameZh: "🔮 元素爆發", descZh: "技能傷害效果提升 20%" },
    { id: "hawkeye", nameZh: "🏹 鷹眼專注", descZh: "暴擊率 +10% | 閃避率 +8%" },
    { id: "holy_revive", nameZh: "👼 聖光復甦", descZh: "戰鬥獲勝自動恢復 30 HP" }
];

const FORGE_RECIPES_DATABASE = [
    // ⚔️ 戰士高級神兵 (10種)
    { category: "warrior", slot: "weapon", nameZh: "高級·狂暴屠魔巨斧 (+70 攻擊 | +15% 暴擊率 | +30% 暴傷)", req: { copper: 25, iron: 20, gold: 3 }, job: "Warrior", tier: "adv", atk: 70, critRate: 15, critDmg: 30 },
    { category: "warrior", slot: "weapon", nameZh: "高級·龍怒屠龍寶刀 (+140 攻擊 | +30% 暴擊率 | +40% 暴傷)", req: { copper: 40, iron: 32, gold: 10, diamond: 3 }, job: "Warrior", tier: "adv", atk: 140, critRate: 30, critDmg: 40 },
    { category: "warrior", slot: "weapon", nameZh: "高級·泰坦破天巨錘 (+180 攻擊 | +40% 暴傷 | +10% 閃避)", req: { copper: 50, iron: 40, gold: 12, diamond: 4 }, job: "Warrior", tier: "adv", atk: 180, critDmg: 40, evasion: 10 },
    { category: "warrior", slot: "weapon", nameZh: "高級·霸王毀滅重劍 (+200 攻擊 | +25% 暴擊率 | +20% 中毒)", req: { copper: 55, iron: 45, gold: 15, diamond: 5 }, job: "Warrior", tier: "adv", atk: 200, critRate: 25, poisonRate: 20 },
    { category: "warrior", slot: "weapon", nameZh: "高級·雷霆破陣巨長槍 (+220 攻擊 | +35% 暴擊率 | +15% 閃避)", req: { copper: 60, iron: 50, gold: 18, diamond: 6 }, job: "Warrior", tier: "adv", atk: 220, critRate: 35, evasion: 15 },
    { category: "warrior", slot: "weapon", nameZh: "高級·滅世死神巨鐮 (+240 攻擊 | +50% 暴傷 | +25% 燃燒)", req: { copper: 65, iron: 55, gold: 20, diamond: 7 }, job: "Warrior", tier: "adv", atk: 240, critDmg: 50, burnRate: 25 },
    { category: "warrior", slot: "weapon", nameZh: "高級·聖光開山寶劍 (+260 攻擊 | +40% 暴擊率 | +20% 閃避)", req: { copper: 70, iron: 60, gold: 22, diamond: 8 }, job: "Warrior", tier: "adv", atk: 260, critRate: 40, evasion: 20 },
    { category: "warrior", slot: "weapon", nameZh: "高級·阿修羅雙刃刀 (+280 攻擊 | +60% 暴傷 | +30% 中毒)", req: { copper: 75, iron: 65, gold: 25, diamond: 9 }, job: "Warrior", tier: "adv", atk: 280, critDmg: 60, poisonRate: 30 },
    { category: "warrior", slot: "weapon", nameZh: "高級·無雙混沌屠魔劍 (+320 攻擊 | +45% 暴擊率 | +25% 閃避)", req: { copper: 80, iron: 70, gold: 28, diamond: 10 }, job: "Warrior", tier: "adv", atk: 320, critRate: 45, evasion: 25 },
    { category: "warrior", slot: "weapon", nameZh: "高級·終極神怒崩天神刃 (+380 攻擊 | +50% 暴擊率 | +80% 暴傷)", req: { copper: 100, iron: 85, gold: 35, diamond: 15 }, job: "Warrior", tier: "adv", atk: 380, critRate: 50, critDmg: 80 },

    // 🔮 法師高級神兵 (10種)
    { category: "mage", slot: "weapon", nameZh: "高級·熾熱元素法杖 (+70 攻擊 | +25% 燃燒率 | +20% 暴傷)", req: { copper: 25, iron: 20, gold: 3 }, job: "Mage", tier: "adv", atk: 70, burnRate: 25, critDmg: 20 },
    { category: "mage", slot: "weapon", nameZh: "高級·星空星爆聖權杖 (+150 攻擊 | +35% 暴傷 | +20% 燃燒)", req: { copper: 40, iron: 32, gold: 10, diamond: 3 }, job: "Mage", tier: "adv", atk: 150, critDmg: 35, burnRate: 20 },
    { category: "mage", slot: "weapon", nameZh: "高級·虛空毀滅奧術魔杖 (+190 攻擊 | +30% 暴擊率 | +25% 毒傷)", req: { copper: 50, iron: 40, gold: 12, diamond: 4 }, job: "Mage", tier: "adv", atk: 190, critRate: 30, poisonRate: 25 },
    { category: "mage", slot: "weapon", nameZh: "高級·超新星極限權杖 (+210 攻擊 | +40% 暴傷 | +15% 閃避)", req: { copper: 55, iron: 45, gold: 15, diamond: 5 }, job: "Mage", tier: "adv", atk: 210, critDmg: 40, evasion: 15 },
    { category: "mage", slot: "weapon", nameZh: "高級·絕對零度極寒法杖 (+230 攻擊 | +35% 暴擊率 | +20% 閃避)", req: { copper: 60, iron: 50, gold: 18, diamond: 6 }, job: "Mage", tier: "adv", atk: 230, critRate: 35, evasion: 20 },
    { category: "mage", slot: "weapon", nameZh: "高級·末日審判黑洞權杖 (+250 攻擊 | +50% 暴傷 | +30% 燃燒)", req: { copper: 65, iron: 55, gold: 20, diamond: 7 }, job: "Mage", tier: "adv", atk: 250, critDmg: 50, burnRate: 30 },
    { category: "mage", slot: "weapon", nameZh: "高級·創世神聖光輝魔杖 (+270 攻擊 | +40% 暴擊率 | +25% 閃避)", req: { copper: 70, iron: 60, gold: 22, diamond: 8 }, job: "Mage", tier: "adv", atk: 270, critRate: 40, evasion: 25 },
    { category: "mage", slot: "weapon", nameZh: "高級·混沌元素滅世權杖 (+290 攻擊 | +60% 暴傷 | +30% 毒傷)", req: { copper: 75, iron: 65, gold: 25, diamond: 9 }, job: "Mage", tier: "adv", atk: 290, critDmg: 60, poisonRate: 30 },
    { category: "mage", slot: "weapon", nameZh: "高級·流星天罰大魔導法杖 (+330 攻擊 | +45% 暴擊率 | +30% 閃避)", req: { copper: 80, iron: 70, gold: 28, diamond: 10 }, job: "Mage", tier: "adv", atk: 330, critRate: 45, evasion: 30 },
    { category: "mage", slot: "weapon", nameZh: "高級·終極神怒創世至尊魔杖 (+390 攻擊 | +55% 暴擊率 | +85% 暴傷)", req: { copper: 100, iron: 85, gold: 35, diamond: 15 }, job: "Mage", tier: "adv", atk: 390, critRate: 55, critDmg: 85 },

    // 🏹 射手高級神兵 (10種)
    { category: "archer", slot: "weapon", nameZh: "高級·追魂神魔巨弩 (+80 攻擊 | +20% 暴擊率 | +50% 暴傷)", req: { copper: 25, iron: 20, gold: 5, diamond: 1 }, job: "Archer", tier: "adv", atk: 80, critRate: 20, critDmg: 50 },
    { category: "archer", slot: "weapon", nameZh: "高級·貫星連擊神天弩 (+145 攻擊 | +25% 暴擊率 | +20% 閃避)", req: { copper: 40, iron: 32, gold: 10, diamond: 3 }, job: "Archer", tier: "adv", atk: 145, critRate: 25, evasion: 20 },
    { category: "archer", slot: "weapon", nameZh: "高級·神怒貫穿天罰弓 (+185 攻擊 | +35% 暴擊率 | +60% 暴傷)", req: { copper: 50, iron: 40, gold: 12, diamond: 4 }, job: "Archer", tier: "adv", atk: 185, critRate: 35, critDmg: 60 },
    { category: "archer", slot: "weapon", nameZh: "高級·影舞幻影滅世弓 (+205 攻擊 | +30% 閃避 | +30% 暴擊率)", req: { copper: 55, iron: 45, gold: 15, diamond: 5 }, job: "Archer", tier: "adv", atk: 205, evasion: 30, critRate: 30 },
    { category: "archer", slot: "weapon", nameZh: "高級·爆裂天火神威弩 (+225 攻擊 | +30% 燃燒 | +45% 暴傷)", req: { copper: 60, iron: 50, gold: 18, diamond: 6 }, job: "Archer", tier: "adv", atk: 225, burnRate: 30, critDmg: 45 },
    { category: "archer", slot: "weapon", nameZh: "高級·毒龍噬魂神箭弩 (+245 攻擊 | +35% 毒傷 | +25% 暴擊率)", req: { copper: 65, iron: 55, gold: 20, diamond: 7 }, job: "Archer", tier: "adv", atk: 245, poisonRate: 35, critRate: 25 },
    { category: "archer", slot: "weapon", nameZh: "高級·疾風穿雲聖光弓 (+265 攻擊 | +35% 閃避 | +50% 暴傷)", req: { copper: 70, iron: 60, gold: 22, diamond: 8 }, job: "Archer", tier: "adv", atk: 265, evasion: 35, critDmg: 50 },
    { category: "archer", slot: "weapon", nameZh: "高級·阿修羅破天神箭弩 (+285 攻擊 | +40% 暴擊率 | +65% 暴傷)", req: { copper: 75, iron: 65, gold: 25, diamond: 9 }, job: "Archer", tier: "adv", atk: 285, critRate: 40, critDmg: 65 },
    { category: "archer", slot: "weapon", nameZh: "高級·混沌滅世神箭弓 (+325 攻擊 | +40% 閃避 | +35% 暴擊率)", req: { copper: 80, iron: 70, gold: 28, diamond: 10 }, job: "Archer", tier: "adv", atk: 325, evasion: 40, critRate: 35 },
    { category: "archer", slot: "weapon", nameZh: "高級·終極天罰滅世神尊弩 (+385 攻擊 | +50% 暴擊率 | +90% 暴傷)", req: { copper: 100, iron: 85, gold: 35, diamond: 15 }, job: "Archer", tier: "adv", atk: 385, critRate: 50, critDmg: 90 },

    // 🪖 高級頭盔 (10種)
    { category: "armor", slot: "helmet", nameZh: "高級·精鋼防爆戰盔 (+120 MaxHP)", req: { iron: 15, gold: 2 }, job: null, tier: "adv", hp: 120 },
    { category: "armor", slot: "helmet", nameZh: "高級·泰坦聖光盔 (+180 MaxHP | +8% 閃避)", req: { copper: 20, iron: 15, gold: 3 }, job: null, tier: "adv", hp: 180, evasion: 8 },
    { category: "armor", slot: "helmet", nameZh: "高級·法王聖光神冠 (+150 MaxHP | +220 MP | +10% 閃避)", req: { copper: 25, iron: 18, gold: 5 }, job: null, tier: "adv", hp: 150, mp: 220, evasion: 10 },
    { category: "armor", slot: "helmet", nameZh: "高級·暗影隱匿頭面 (+140 MaxHP | +15% 閃避)", req: { copper: 22, iron: 16, gold: 4 }, job: null, tier: "adv", hp: 140, evasion: 15 },
    { category: "armor", slot: "helmet", nameZh: "高級·龍鱗防護重盔 (+250 MaxHP)", req: { iron: 25, gold: 6, diamond: 2 }, job: null, tier: "adv", hp: 250 },
    { category: "armor", slot: "helmet", nameZh: "高級·風暴天行者冠 (+200 MaxHP | +100 MP)", req: { copper: 30, gold: 8, diamond: 2 }, job: null, tier: "adv", hp: 200, mp: 100 },
    { category: "armor", slot: "helmet", nameZh: "高級·阿修羅戰神面甲 (+300 MaxHP | +12% 閃避)", req: { iron: 35, gold: 10, diamond: 3 }, job: null, tier: "adv", hp: 300, evasion: 12 },
    { category: "armor", slot: "helmet", nameZh: "高級·元素掌控至尊冠 (+220 MaxHP | +300 MP)", req: { copper: 35, gold: 12, diamond: 4 }, job: null, tier: "adv", hp: 220, mp: 300 },
    { category: "armor", slot: "helmet", nameZh: "高級·混沌破滅頭盔 (+400 MaxHP | +15% 閃避)", req: { iron: 45, gold: 15, diamond: 5 }, job: null, tier: "adv", hp: 400, evasion: 15 },
    { category: "armor", slot: "helmet", nameZh: "高級·不朽神聖至尊頭盔 (+600 MaxHP | +400 MP | +20% 閃避)", req: { copper: 60, iron: 50, gold: 20, diamond: 8 }, job: null, tier: "adv", hp: 600, mp: 400, evasion: 20 },

    // 🛡️ 高級胸甲 (10種)
    { category: "armor", slot: "chest", nameZh: "高級·黑曜石鎖子甲 (+220 MaxHP | +15% 閃避率 | +20% 抗暗影)", req: { copper: 20, iron: 15, gold: 3 }, job: null, tier: "adv", hp: 220, evasion: 15, darkRes: 20 },
    { category: "armor", slot: "chest", nameZh: "高級·泰坦防衛重甲 (+350 MaxHP)", req: { iron: 25, gold: 5 }, job: null, tier: "adv", hp: 350 },
    { category: "armor", slot: "chest", nameZh: "高級·秘銀大魔法師長袍 (+200 MaxHP | +250 MP)", req: { copper: 25, gold: 6 }, job: null, tier: "adv", hp: 200, mp: 250 },
    { category: "armor", slot: "chest", nameZh: "高級·龍鱗巨龍胸甲 (+500 MaxHP | +10% 閃避)", req: { iron: 35, gold: 8, diamond: 2 }, job: null, tier: "adv", hp: 500, evasion: 10 },
    { category: "armor", slot: "chest", nameZh: "高級·疾風追影皮甲 (+300 MaxHP | +20% 閃避)", req: { copper: 35, gold: 8, diamond: 2 }, job: null, tier: "adv", hp: 300, evasion: 20 },
    { category: "armor", slot: "chest", nameZh: "高級·聖光開山重鎧 (+650 MaxHP)", req: { iron: 45, gold: 12, diamond: 4 }, job: null, tier: "adv", hp: 650 },
    { category: "armor", slot: "chest", nameZh: "高級·元素創世祭司袍 (+350 MaxHP | +400 MP)", req: { copper: 45, gold: 12, diamond: 4 }, job: null, tier: "adv", hp: 350, mp: 400 },
    { category: "armor", slot: "chest", nameZh: "高級·阿修羅破天戰甲 (+800 MaxHP | +15% 閃避)", req: { iron: 55, gold: 15, diamond: 6 }, job: null, tier: "adv", hp: 800, evasion: 15 },
    { category: "armor", slot: "chest", nameZh: "高級·混沌滅世戰鎧 (+1000 MaxHP | +20% 閃避)", req: { copper: 65, iron: 55, gold: 20, diamond: 8 }, job: null, tier: "adv", hp: 1000, evasion: 20 },
    { category: "armor", slot: "chest", nameZh: "高級·不朽神聖至尊鎧甲 (+1500 MaxHP | +30% 閃避率)", req: { copper: 80, iron: 70, gold: 25, diamond: 10 }, job: null, tier: "adv", hp: 1500, evasion: 30 },

    // 🦵 高級腿甲 (10種)
    { category: "armor", slot: "leggings", nameZh: "高級·追影天行腿甲 (+150 MaxHP | +15% 閃避)", req: { copper: 20, iron: 12, gold: 3 }, job: null, tier: "adv", hp: 150, evasion: 15 },
    { category: "armor", slot: "leggings", nameZh: "高級·泰坦護脛 (+220 MaxHP)", req: { iron: 20, gold: 4 }, job: null, tier: "adv", hp: 220 },
    { category: "armor", slot: "leggings", nameZh: "高級·賢者符文長褲 (+120 MaxHP | +150 MP)", req: { copper: 20, gold: 4 }, job: null, tier: "adv", hp: 120, mp: 150 },
    { category: "armor", slot: "leggings", nameZh: "高級·龍鱗重型護腿 (+320 MaxHP)", req: { iron: 28, gold: 6, diamond: 2 }, job: null, tier: "adv", hp: 320 },
    { category: "armor", slot: "leggings", nameZh: "高級·疾風幻影腿甲 (+200 MaxHP | +20% 閃避)", req: { copper: 28, gold: 6, diamond: 2 }, job: null, tier: "adv", hp: 200, evasion: 20 },
    { category: "armor", slot: "leggings", nameZh: "高級·聖光護脛 (+450 MaxHP)", req: { iron: 38, gold: 10, diamond: 3 }, job: null, tier: "adv", hp: 450 },
    { category: "armor", slot: "leggings", nameZh: "高級·元素掌控法褲 (+250 MaxHP | +300 MP)", req: { copper: 38, gold: 10, diamond: 3 }, job: null, tier: "adv", hp: 250, mp: 300 },
    { category: "armor", slot: "leggings", nameZh: "高級·阿修羅雙刃護腿 (+550 MaxHP | +15% 閃避)", req: { iron: 48, gold: 12, diamond: 5 }, job: null, tier: "adv", hp: 550, evasion: 15 },
    { category: "armor", slot: "leggings", nameZh: "高級·混沌破滅腿甲 (+700 MaxHP | +20% 閃避)", req: { copper: 58, iron: 48, gold: 15, diamond: 6 }, job: null, tier: "adv", hp: 700, evasion: 20 },
    { category: "armor", slot: "leggings", nameZh: "高級·不朽神聖至尊腿甲 (+1000 MaxHP | +25% 閃避)", req: { copper: 70, iron: 60, gold: 20, diamond: 8 }, job: null, tier: "adv", hp: 1000, evasion: 25 },

    // 🥊 高級手腕 (10種)
    { category: "armor", slot: "bracer", nameZh: "高級·阿修羅破天護腕 (+50 攻擊 | +10% 暴擊率)", req: { copper: 18, iron: 15, gold: 2 }, job: null, tier: "adv", atk: 50, critRate: 10 },
    { category: "armor", slot: "bracer", nameZh: "高級·泰坦力量護手 (+70 攻擊)", req: { iron: 20, gold: 4 }, job: null, tier: "adv", atk: 70 },
    { category: "armor", slot: "bracer", nameZh: "高級·魔導詠唱護腕 (+30 攻擊 | +150 MP)", req: { copper: 20, gold: 4 }, job: null, tier: "adv", atk: 30, mp: 150 },
    { category: "armor", slot: "bracer", nameZh: "高級·鷹眼精準護手 (+85 攻擊 | +12% 暴擊率)", req: { copper: 25, gold: 6, diamond: 2 }, job: null, tier: "adv", atk: 85, critRate: 12 },
    { category: "armor", slot: "bracer", nameZh: "高級·龍爪爆裂護腕 (+110 攻擊 | +15% 暴擊率)", req: { iron: 30, gold: 8, diamond: 3 }, job: null, tier: "adv", atk: 110, critRate: 15 },
    { category: "armor", slot: "bracer", nameZh: "高級·聖光裁決護手 (+130 攻擊)", req: { iron: 38, gold: 10, diamond: 4 }, job: null, tier: "adv", atk: 130 },
    { category: "armor", slot: "bracer", nameZh: "高級·元素尊者護腕 (+60 攻擊 | +300 MP)", req: { copper: 38, gold: 10, diamond: 4 }, job: null, tier: "adv", atk: 60, mp: 300 },
    { category: "armor", slot: "bracer", nameZh: "高級·影武者疾風護手 (+160 攻擊 | +18% 暴擊率)", req: { copper: 48, gold: 12, diamond: 5 }, job: null, tier: "adv", atk: 160, critRate: 18 },
    { category: "armor", slot: "bracer", nameZh: "高級·混沌毀滅護手 (+200 攻擊 | +20% 暴擊率)", req: { iron: 58, gold: 15, diamond: 6 }, job: null, tier: "adv", atk: 200, critRate: 20 },
    { category: "armor", slot: "bracer", nameZh: "高級·不朽神聖至尊護手 (+260 攻擊 | +25% 暴擊率 | +200 MP)", req: { copper: 70, iron: 60, gold: 20, diamond: 8 }, job: null, tier: "adv", atk: 260, critRate: 25, mp: 200 }
];

const WEAPON_ENCHANTS = [
    { id: "flame", keyZh: "烈焰", nameZh: "🔥 烈焰附魔 (10 附魔石)", stoneReq: 10, descZh: "+15 傷害 + 燃燒 2 回合" },
    { id: "vampire", keyZh: "吸血", nameZh: "🩸 吸血附魔 (10 附魔石)", stoneReq: 10, descZh: "獲得 15% 傷害吸血" },
    { id: "sharp", keyZh: "銳利", nameZh: "⚡ 銳利附魔 (10 附魔石)", stoneReq: 10, descZh: "基礎攻擊力提升 25 點" },
    { id: "frost", keyZh: "冰霜", nameZh: "❄️ 冰霜附魔 (10 附魔石)", stoneReq: 10, descZh: "20% 機率凍結敵人 1 回合" },
    { id: "pierce", keyZh: "破甲", nameZh: "🛡️ 破甲附魔 (10 附魔石)", stoneReq: 10, descZh: "無視防禦 +20 固定傷害" },
    { id: "holy", keyZh: "聖光", nameZh: "✨ 聖光附魔 (10 附魔石)", stoneReq: 10, descZh: "對 BOSS / 魔王額外 +30% 傷害" },
    { id: "storm", keyZh: "風暴", nameZh: "🌪️ 風暴附魔 (10 附魔石)", stoneReq: 10, descZh: "連擊機率提升 20%" },
    { id: "poison", keyZh: "毒素", nameZh: "☠️ 毒素附魔 (10 附魔石)", stoneReq: 10, descZh: "敵人每回合受到 20 點毒傷" },
    { id: "bless", keyZh: "祈願", nameZh: "🌟 祈願附魔 (10 附魔石)", stoneReq: 10, descZh: "戰鬥勝利獲得金幣量增加 25%" },
    { id: "fury", keyZh: "暴怒", nameZh: "💥 暴怒附魔 (10 附魔石)", stoneReq: 10, descZh: "暴擊率提升 20%" }
];

const ACHIEVEMENTS_DATABASE = [
    // ⚔️ 主線關卡 (15項)
    { category: "stage", id: "stage_10", titleZh: "🏆 森林征服者", descZh: "擊敗第 1 區 BOSS (1-10)", reqType: "stage", reqVal: 10, gold: 200, stones: 2 },
    { category: "stage", id: "stage_20", titleZh: "🏆 冰雪勇將", descZh: "擊敗第 2 區 BOSS (2-10)", reqType: "stage", reqVal: 20, gold: 300, stones: 3 },
    { category: "stage", id: "stage_30", titleZh: "🏆 沙漠霸主", descZh: "擊敗第 3 區 BOSS (3-10)", reqType: "stage", reqVal: 30, gold: 400, stones: 4 },
    { category: "stage", id: "stage_40", titleZh: "🏆 熔岩屠龍者", descZh: "擊敗第 4 區 BOSS (4-10)", reqType: "stage", reqVal: 40, gold: 500, stones: 5 },
    { category: "stage", id: "stage_50", titleZh: "🏆 地底破魔者", descZh: "擊敗第 5 區 BOSS (5-10)", reqType: "stage", reqVal: 50, gold: 600, stones: 6 },
    { category: "stage", id: "stage_60", titleZh: "🏆 古城尋寶家", descZh: "擊敗第 6 區 BOSS (6-10)", reqType: "stage", reqVal: 60, gold: 700, stones: 7 },
    { category: "stage", id: "stage_70", titleZh: "🏆 雷霆征服者", descZh: "擊敗第 7 區 BOSS (7-10)", reqType: "stage", reqVal: 70, gold: 800, stones: 8 },
    { category: "stage", id: "stage_80", titleZh: "🏆 深海獵手", descZh: "擊敗第 8 區 BOSS (8-10)", reqType: "stage", reqVal: 80, gold: 900, stones: 9 },
    { category: "stage", id: "stage_90", titleZh: "🏆 聖光洗禮者", descZh: "擊敗第 9 區 BOSS (9-10)", reqType: "stage", reqVal: 90, gold: 1000, stones: 10 },
    { category: "stage", id: "stage_100", titleZh: "👑 滅世救世主", descZh: "通關 100 關擊敗滅世魔王", reqType: "stage", reqVal: 100, gold: 3000, stones: 20 },
    { category: "stage", id: "stage_win_5", titleZh: "⚔️ 連戰連捷", descZh: "累積勝場達到 5 次", reqType: "stage", reqVal: 5, gold: 100, stones: 1 },
    { category: "stage", id: "stage_win_15", titleZh: "⚔️ 戰場老兵", descZh: "累積勝場達到 15 次", reqType: "stage", reqVal: 15, gold: 200, stones: 2 },
    { category: "stage", id: "stage_win_30", titleZh: "⚔️ 無敵勇者", descZh: "累積勝場達到 30 次", reqType: "stage", reqVal: 30, gold: 400, stones: 4 },
    { category: "stage", id: "stage_win_60", titleZh: "⚔️ 戰神轉世", descZh: "累積勝場達到 60 次", reqType: "stage", reqVal: 60, gold: 800, stones: 8 },
    { category: "stage", id: "stage_win_90", titleZh: "⚔️ 百戰不殆", descZh: "累積勝場達到 90 次", reqType: "stage", reqVal: 90, gold: 1200, stones: 12 },

    // ⛏️ 採礦鍛造 (15項)
    { category: "mine", id: "mine_1", titleZh: "⛏️ 採礦新手", descZh: "完成 1 次採礦", reqType: "mine", reqVal: 1, gold: 100, stones: 1 },
    { category: "mine", id: "mine_5", titleZh: "⛏️ 礦坑勤務員", descZh: "完成 5 次採礦", reqType: "mine", reqVal: 5, gold: 150, stones: 2 },
    { category: "mine", id: "mine_10", titleZh: "⛏️ 採礦大師", descZh: "完成 10 次採礦", reqType: "mine", reqVal: 10, gold: 250, stones: 3 },
    { category: "mine", id: "mine_25", titleZh: "⛏️ 礦脈探險家", descZh: "完成 25 次採礦", reqType: "mine", reqVal: 25, gold: 500, stones: 5 },
    { category: "mine", id: "mine_50", titleZh: "⛏️ 傳奇黃金礦工", descZh: "完成 50 次採礦", reqType: "mine", reqVal: 50, gold: 1000, stones: 10 },
    { category: "mine", id: "mine_copper", titleZh: "🥉 銅礦愛好者", descZh: "擁有一顆銅礦石", reqType: "copper", reqVal: 1, gold: 80, stones: 1 },
    { category: "mine", id: "mine_iron", titleZh: "🥈 鐵骨好手", descZh: "擁有一顆鐵礦石", reqType: "iron", reqVal: 1, gold: 120, stones: 1 },
    { category: "mine", id: "mine_gold", titleZh: "🥇 黃金大亨", descZh: "擁有一顆金礦石", reqType: "goldOre", reqVal: 1, gold: 300, stones: 3 },
    { category: "mine", id: "mine_diamond", titleZh: "💎 鑽石獵人", descZh: "擁有一顆鑽石", reqType: "diamond", reqVal: 1, gold: 800, stones: 5 },
    { category: "mine", id: "craft_1", titleZh: "🔨 學徒打鐵師", descZh: "在鐵匠鋪打造 1 件裝備", reqType: "craft", reqVal: 1, gold: 200, stones: 2 },
    { category: "mine", id: "craft_3", titleZh: "🔨 熟練鐵匠", descZh: "在鐵匠鋪打造 3 件裝備", reqType: "craft", reqVal: 3, gold: 400, stones: 4 },
    { category: "mine", id: "craft_5", titleZh: "🔨 神兵鑄造師", descZh: "在鐵匠鋪打造 5 件裝備", reqType: "craft", reqVal: 5, gold: 800, stones: 8 },
    { category: "mine", id: "craft_10", titleZh: "👑 鍛造宗師", descZh: "在鐵匠鋪打造 10 件裝備", reqType: "craft", reqVal: 10, gold: 1500, stones: 15 },
    { category: "mine", id: "equip_basic", titleZh: "🛡️ 基礎武裝", descZh: "裝備至少 1 件初級裝備", reqType: "equipCount", reqVal: 1, gold: 100, stones: 1 },
    { category: "mine", id: "equip_full", titleZh: "🛡️ 神裝加身", descZh: "裝備至少 5 件裝備", reqType: "equipCount", reqVal: 5, gold: 1000, stones: 10 },

    // 🔮 魔法附魔 (10項)
    { category: "enchant", id: "enc_1", titleZh: "🔮 初次附魔", descZh: "完成 1 次武器魔法附魔", reqType: "enchantCount", reqVal: 1, gold: 300, stones: 3 },
    { category: "enchant", id: "enc_2", titleZh: "🔮 元素親和", descZh: "完成 2 次武器魔法附魔", reqType: "enchantCount", reqVal: 2, gold: 500, stones: 5 },
    { category: "enchant", id: "enc_3", titleZh: "🔮 附魔大師", descZh: "完成 3 次武器魔法附魔", reqType: "enchantCount", reqVal: 3, gold: 800, stones: 8 },
    { category: "enchant", id: "enc_5", titleZh: "🔮 魔力滿溢", descZh: "完成 5 次武器魔法附魔", reqType: "enchantCount", reqVal: 5, gold: 1200, stones: 12 },
    { category: "enchant", id: "enc_stone_10", titleZh: "💎 附魔石收藏家", descZh: "持有 10 顆附魔石", reqType: "stones", reqVal: 10, gold: 500, stones: 5 },
    { category: "enchant", id: "enc_stone_20", titleZh: "💎 魔法寶石富豪", descZh: "持有 20 顆附魔石", reqType: "stones", reqVal: 20, gold: 1000, stones: 10 },
    { category: "enchant", id: "enc_flame", titleZh: "🔥 熾熱火焰", descZh: "獲得烈焰附魔", reqType: "hasEnchant", reqVal: "烈焰", gold: 300, stones: 3 },
    { category: "enchant", id: "enc_vampire", titleZh: "🩸 嗜血魔咒", descZh: "獲得吸血附魔", reqType: "hasEnchant", reqVal: "吸血", gold: 300, stones: 3 },
    { category: "enchant", id: "enc_frost", titleZh: "❄️ 寒冰凍結", descZh: "獲得冰霜附魔", reqType: "hasEnchant", reqVal: "冰霜", gold: 300, stones: 3 },
    { category: "enchant", id: "enc_fury", titleZh: "💥 暴怒狂之", descZh: "獲得暴怒附魔", reqType: "hasEnchant", reqVal: "暴怒", gold: 300, stones: 3 },

    // 💰 冒險財富 (10項)
    { category: "wealth", id: "gold_500", titleZh: "💰 第一桶金", descZh: "持有金幣達到 500 G", reqType: "gold", reqVal: 500, gold: 200, stones: 2 },
    { category: "wealth", id: "gold_2000", titleZh: "💰 村莊小富豪", descZh: "持有金幣達到 2,000 G", reqType: "gold", reqVal: 2000, gold: 500, stones: 5 },
    { category: "wealth", id: "gold_5000", titleZh: "💰 富甲一方", descZh: "持有金幣達到 5,000 G", reqType: "gold", reqVal: 5000, gold: 1000, stones: 8 },
    { category: "wealth", id: "gold_10000", titleZh: "💰 富可敵國", descZh: "持有金幣達到 10,000 G", reqType: "gold", reqVal: 10000, gold: 2000, stones: 15 },
    { category: "wealth", id: "skill_2", titleZh: "📖 技能入門", descZh: "學會 2 招技能", reqType: "skillCount", reqVal: 2, gold: 200, stones: 2 },
    { category: "wealth", id: "skill_4", titleZh: "📖 技能滿載", descZh: "學滿 4 招技能", reqType: "skillCount", reqVal: 4, gold: 500, stones: 5 },
    { category: "wealth", id: "potion_hp", titleZh: "🧪 生命保障", descZh: "持有 5 瓶生命藥水", reqType: "potHp", reqVal: 5, gold: 200, stones: 2 },
    { category: "wealth", id: "potion_mp", titleZh: "💧 魔力源泉", descZh: "持有 5 瓶魔力藥水", reqType: "potMp", reqVal: 5, gold: 200, stones: 2 },
    { category: "wealth", id: "shop_refresh", titleZh: "🔄 購物狂人", descZh: "進行 1 次技能商店換一批", reqType: "shopRefreshCount", reqVal: 1, gold: 150, stones: 1 },
    { category: "wealth", id: "action_rest", titleZh: "⛪ 充分休息", descZh: "在旅館完成休息恢復", reqType: "restCount", reqVal: 1, gold: 100, stones: 1 }
];