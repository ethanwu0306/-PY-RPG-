const SAVE_KEY = "pyrpg_save_github_v2.4_" + window.location.pathname.replace(/[^a-zA-Z0-9]/g, "_");

const I18N = {
    zh: {
        langName: "中文", subTitle: "版本 v2.4", startG: "🎮 開始新遊戲", loadG: "📂 讀取存檔",
        classT: "請選擇你的職業", warB: "🛡️ 戰士 (特性: 高血量 | 初始 HP: 220 | MP: 60)", magB: "🔮 法師 (特性: 高魔力 | 初始 HP: 110 | MP: 220)", arcB: "🏹 射手 (特性: 高敏捷 | 初始 HP: 130 | MP: 90)",
        backMain: "⬅️ 返回主畫面", back: "⬅️ 返回村莊", cardT: "🔮 遇見神秘商人！", cardSub: "打敗區域 BOSS，獲得神秘祝福！請選擇一張卡片：",
        atkB: "⚔️ 普通攻擊", skillGridT: "✨ 技能快捷格 (最多4招)：",
        vStats: "📊 查看角色詳細面板", vRest: "⛪ 旅館休息 - 30 G",
        vForge: "🔨 鐵匠鋪", vMagic: "🔮 魔法屋", vEquip: "🛠️ 裝備商店", vSkill: "📖 技能商店", vPotion: "🧪 藥水商店", vAchieve: "🏆 勇者成就", vSave: "💾 儲存進度",
        vNext: "⚔️ 踏上征途 (下一戰)", craftT: "⚒️ 礦石打造職業專屬神裝", encT: "💎 武器魔法附魔 (消耗 10 顆附魔石 + 1 行動力)",
        refreshB: "🔄 換一批技能 (100 G)", noMP: "❌ MP 不足！", noGold: "❌ 金幣不足！",
        actionDone: "⚡ 村莊行動力耗盡", mineBtnTxt: "⚡ 礦坑採礦", stage: "區域", job: "職業", gold: "金幣", weapon: "武器", noEnc: "無附魔", noCard: "無卡片",
        defeatT: "💀 戰鬥失敗！", defeatSub: "你不幸倒下的，請選擇下一步行動：", retryB: "⚔️ 繼續挑戰當前關卡", fallbackB: "⬅️ 退回上一關並回到村莊",
        replaceT: "⚠️ 技能欄位已滿 (最多4招)", replaceSub: "請選擇要被取代掉的舊技能：", cancelReplace: "❌ 取消學習",
        statsT: "📊 角色詳細面板", shopT: "🏪 商店", forgeT: "🔨 鐵匠鋪", magicT: "🔮 魔法屋", stones: "附魔石", ores: "礦石", copper: "銅", iron: "鐵", goldOre: "金", diamond: "鑽石",
        slotEmpty: "空格", alreadyCrafted: "已打造", wrongJob: "職業不符", alreadyEquipped: "已裝備", learned: "已學會",
        atkLabel: "攻擊力", skillsLabel: "技能", equipsLabel: "裝備", cardsLabel: "卡片", actionsLabel: "村莊行動力",
        battleStart: "戰鬥開始！", attackLog: "使用 [{w}] 攻擊，造成 {d} 點傷害！", skillLog: "施展【{s}】，對敵人造成 {d} 點傷害！",
        counterLog: "{m} 反擊，造成 {d} 點傷害", victoryMsg: "擊敗了 {m}！獲得 {r} 金幣！", stoneGot: "\n💎 幸運獲得了 1 顆【附魔石】！",
        forgetSkill: "已忘記【{o}】，並成功學會【{n}】！", learnSuccess: "成功學會【{s}】！", craftSuccess: "成功打造【{i}】！",
        enchantSuccess: "消耗 10 顆附魔石與 1 行動力，成功完成【{e}附魔】！", equipSuccess: "成功購買【{i}】！", restSuccess: "✨ 狀態完全恢復！(消耗 1 行動力)",
        saveSuccess: "💾 存檔成功！", loadSuccess: "📂 成功載入進度！", hpPotLabel: "生命藥水", mpPotLabel: "魔力藥水", noActions: "❌ 村莊行動力不足！"
    },
    en: {
        langName: "English", subTitle: "Version v2.4", startG: "🎮 New Game", loadG: "📂 Load Game",
        classT: "Choose Your Class", warB: "🛡️ Warrior (HP:220 | MP: 60)", magB: "🔮 Mage (HP:110 | MP: 220)", arcB: "🏹 Archer (HP:130 | MP: 90)",
        backMain: "⬅️ Return to Main Menu", back: "⬅️ Return to Village", cardT: "🔮 Mysterious Merchant!", cardSub: "Defeated Area Boss! Choose a card blessing:",
        atkB: "⚔️ Basic Attack", skillGridT: "✨ Skill Hotbars (Max 4):",
        vStats: "📊 View Character Stats", vRest: "⛪ Rest at Inn - 30 G",
        vForge: "🔨 Blacksmith", vMagic: "🔮 Enchant House", vEquip: "🛠️ Equip Shop", vSkill: "📖 Skill Shop", vPotion: "🧪 Potion Shop", vAchieve: "🏆 Achievements", vSave: "💾 Save Progress",
        vNext: "⚔️ Embark on Quest (Next Battle)", craftT: "⚒️ Craft Class-Exclusive Gear", encT: "💎 Weapon Magic Enchantment (Cost 10 Stones + 1 Action)",
        refreshB: "🔄 Refresh Skills (100 G)", noMP: "❌ Not enough MP!", noGold: "❌ Not enough Gold!",
        actionDone: "⚡ Actions Depleted", mineBtnTxt: "⚡ Mining Area", stage: "Stage", job: "Class", gold: "Gold", weapon: "Weapon", noEnc: "None", noCard: "None",
        defeatT: "💀 Defeated!", defeatSub: "You fell in battle. Choose your next move:", retryB: "⚔️ Retry Current Stage", fallbackB: "⬅️ Retreat to Previous Stage",
        replaceT: "⚠️ Skill Slots Full (Max 4)", replaceSub: "Select an old skill to replace:", cancelReplace: "❌ Cancel",
        statsT: "📊 Character Panel", shopT: "🏪 Shop", forgeT: "🔨 Blacksmith", magicT: "🔮 Enchant House", stones: "Enchant Stones", ores: "Ores", copper: "Copper", iron: "Iron", goldOre: "Gold", diamond: "Diamond",
        slotEmpty: "Empty", alreadyCrafted: "Crafted", wrongJob: "Wrong Job", alreadyEquipped: "Equipped", learned: "Learned",
        atkLabel: "Attack", skillsLabel: "Skills", equipsLabel: "Equips", cardsLabel: "Cards", actionsLabel: "Village Actions",
        battleStart: "Battle Started!", attackLog: "Attacked with [{w}] dealing {d} damage!", skillLog: "Cast [{s}] dealing {d} damage!",
        counterLog: "{m} counterattacked for {d} damage!", victoryMsg: "Defeated {m}! Earned {r} Gold!", stoneGot: "\n💎 Lucky drop: 1 Enchant Stone!",
        forgetSkill: "Forgot [{o}] and learned [{n}]!", learnSuccess: "Successfully learned [{s}]!", craftSuccess: "Successfully crafted [{i}]!",
        enchantSuccess: "Spent 10 Stones & 1 Action for [{e}]!", equipSuccess: "Successfully bought [{i}]!", restSuccess: "✨ Fully Restored! (-1 Action)",
        saveSuccess: "💾 Game Saved!", loadSuccess: "📂 Game Loaded!", hpPotLabel: "HP Potion", mpPotLabel: "MP Potion", noActions: "❌ No Village Actions left!"
    }
};

const SKILLS = {
    // 通用 (11)
    "重擊": { nameEn: "Heavy Strike", type: "universal", cost: 50, mp: 5, mult: 1.5, cd: 0, descZh: "通用：1.5倍物理傷害" },
    "治癒術": { nameEn: "Heal", type: "universal", cost: 80, mp: 10, heal: 50, cd: 1, descZh: "通用：恢復 50 HP" },
    "神聖護盾": { nameEn: "Holy Shield", type: "universal", cost: 90, mp: 12, shield: 40, cd: 2, descZh: "通用：獲得 40 護盾" },
    "強擊": { nameEn: "Power Strike", type: "universal", cost: 110, mp: 10, mult: 1.8, cd: 1, descZh: "通用：1.8倍物理傷害" },
    "高級治癒": { nameEn: "Greater Heal", type: "universal", cost: 150, mp: 20, heal: 120, cd: 2, descZh: "通用：恢復 120 HP" },
    "戰意高昂": { nameEn: "Battle Intent", type: "universal", cost: 140, mp: 15, mult: 2.0, cd: 2, buffZh: "戰意 [2T]", buffTurn: 2, descZh: "通用：2.0倍強打並提升戰意" },
    "破甲一擊": { nameEn: "Shatter Strike", type: "universal", cost: 160, mp: 18, mult: 1.7, cd: 2, debuffZh: "破甲 [2T]", debuffTurn: 2, descZh: "通用：1.7倍打擊降敵防護" },
    "精靈賜福": { nameEn: "Elven Blessing", type: "universal", cost: 200, mp: 25, shield: 150, cd: 3, descZh: "通用：獲得 150 護盾" },
    "虛弱詛咒": { nameEn: "Weakness Curse", type: "universal", cost: 170, mp: 16, mult: 1.9, cd: 2, debuffZh: "虛弱 [2T]", debuffTurn: 2, descZh: "通用：1.9倍傷害並衰弱對手" },
    "聖光復甦": { nameEn: "Holy Revival", type: "universal", cost: 220, mp: 28, heal: 200, cd: 3, descZh: "通用：高額恢復 200 HP" },
    "生命分流": { nameEn: "Life Tap", type: "universal", cost: 160, mp: 5, mult: 2.3, cd: 1, descZh: "通用：2.3倍高傷害打擊" },

    // 戰士專屬 (20)
    "旋風斬": { nameEn: "Whirlwind", type: "Warrior", cost: 150, mp: 8, mult: 2.0, cd: 1, descZh: "戰士：2.0倍橫掃傷害" },
    "怒火狂暴": { nameEn: "Fury Rage", type: "Warrior", cost: 190, mp: 12, mult: 2.4, cd: 2, buffZh: "狂暴 [2T]", buffTurn: 2, descZh: "戰士：2.4倍觸發狂暴" },
    "威壓咆哮": { nameEn: "Intimidate Roar", type: "Warrior", cost: 210, mp: 15, mult: 2.2, cd: 2, debuffZh: "威壓 [2T]", debuffTurn: 2, descZh: "戰士：2.2倍威壓降敵傷" },
    "狂暴打擊": { nameEn: "Berserk Strike", type: "Warrior", cost: 220, mp: 14, mult: 2.8, cd: 1, descZh: "戰士：2.8倍致命強打" },
    "裂地重斬": { nameEn: "Earthquake Slam", type: "Warrior", cost: 280, mp: 18, mult: 3.3, cd: 2, descZh: "戰士：3.3倍崩裂打擊" },
    "泰坦重踏": { nameEn: "Titan Stomp", type: "Warrior", cost: 350, mp: 24, mult: 4.0, cd: 3, descZh: "戰士：4.0倍泰坦重擊" },
    "不屈怒吼": { nameEn: "Indomitable Roar", type: "Warrior", cost: 200, mp: 15, shield: 120, cd: 2, buffZh: "不屈 [2T]", buffTurn: 2, descZh: "戰士：獲得 120 點護盾" },
    "盾牆壁壘": { nameEn: "Shield Wall", type: "Warrior", cost: 260, mp: 20, shield: 220, cd: 3, buffZh: "鐵壁 [3T]", buffTurn: 3, descZh: "戰士：獲得 220 點護盾" },
    "重傷揮砍": { nameEn: "Grievous Slash", type: "Warrior", cost: 270, mp: 19, mult: 3.1, cd: 2, debuffZh: "流血 [2T]", debuffTurn: 2, descZh: "戰士：3.1倍撕裂性流血打擊" },
    "血氣爆發": { nameEn: "Blood Burst", type: "Warrior", cost: 300, mp: 20, mult: 3.6, cd: 2, descZh: "戰士：3.6倍血氣傷害" },
    "衝鋒撞擊": { nameEn: "Charge Rush", type: "Warrior", cost: 180, mp: 12, mult: 2.4, cd: 1, descZh: "戰士：2.4倍衝鋒打擊" },
    "獅子斬": { nameEn: "Lion Slash", type: "Warrior", cost: 320, mp: 22, mult: 3.8, cd: 2, descZh: "戰士：3.8倍霸王斬擊" },
    "龍捲斬": { nameEn: "Tornado Blade", type: "Warrior", cost: 380, mp: 26, mult: 4.3, cd: 3, descZh: "戰士：4.3倍旋風狂斬" },
    "破軍衝鋒": { nameEn: "Army Breaker", type: "Warrior", cost: 420, mp: 30, mult: 4.8, cd: 3, descZh: "戰士：4.8倍破陣重擊" },
    "終極毀滅斬": { nameEn: "Ultimate Oblivion Slash", type: "Warrior", cost: 500, mp: 35, mult: 5.5, cd: 4, descZh: "戰士：5.5倍終極斬擊" },
    "無畏重斬": { nameEn: "Fearless Slash", type: "Warrior", cost: 290, mp: 21, mult: 3.4, cd: 2, descZh: "戰士：3.4倍無畏砍劈" },
    "斷鋼斬": { nameEn: "Steel Sever", type: "Warrior", cost: 340, mp: 25, mult: 3.9, cd: 2, descZh: "戰士：3.9倍斷鋼強打" },
    "霸王衝鋒": { nameEn: "Overlord Charge", type: "Warrior", cost: 400, mp: 28, mult: 4.5, cd: 3, descZh: "戰士：4.5倍霸王衝鋒" },
    "屠龍開山斬": { nameEn: "Dragon Cleave", type: "Warrior", cost: 460, mp: 32, mult: 5.1, cd: 3, descZh: "戰士：5.1倍屠龍開山斬" },
    "神怒天地破": { nameEn: "Divine Wrath Slam", type: "Warrior", cost: 530, mp: 38, mult: 5.8, cd: 4, descZh: "戰士：5.8倍天地崩裂斬" },

    // 法師專屬 (20)
    "火球術": { nameEn: "Fireball", type: "Mage", cost: 180, mp: 15, mult: 2.5, cd: 0, descZh: "法師：2.5倍高額魔攻" },
    "魔力激流": { nameEn: "Mana Surge", type: "Mage", cost: 210, mp: 16, mult: 2.7, cd: 2, buffZh: "魔激 [2T]", buffTurn: 2, descZh: "法師：2.7倍魔攻活化魔力" },
    "凍結星塵": { nameEn: "Freezing Dust", type: "Mage", cost: 230, mp: 18, mult: 2.6, cd: 2, debuffZh: "凍結 [2T]", debuffTurn: 2, descZh: "法師：2.6倍冰極凍結打擊" },
    "雷霆一擊": { nameEn: "Thunder Bolt", type: "Mage", cost: 250, mp: 20, mult: 3.2, cd: 1, descZh: "法師：3.2倍毀滅電擊" },
    "冰霜星爆": { nameEn: "Frost Nova", type: "Mage", cost: 260, mp: 22, mult: 2.3, cd: 2, debuffZh: "凍傷 [2T]", debuffTurn: 2, descZh: "法師：2.3倍冰霜爆破" },
    "秘銀奧術": { nameEn: "Arcane Blast", type: "Mage", cost: 210, mp: 18, mult: 2.9, cd: 1, descZh: "法師：2.9倍奧術衝擊" },
    "虛空衰弱": { nameEn: "Void Enfeeble", type: "Mage", cost: 280, mp: 21, mult: 3.1, cd: 2, debuffZh: "衰弱 [2T]", debuffTurn: 2, descZh: "法師：3.1倍削敵抗性" },
    "閃電鏈": { nameEn: "Chain Lightning", type: "Mage", cost: 290, mp: 24, mult: 3.5, cd: 2, descZh: "法師：3.5倍連環閃電" },
    "烈焰風暴": { nameEn: "Flame Storm", type: "Mage", cost: 310, mp: 25, mult: 3.7, cd: 2, debuffZh: "灼燒 [2T]", debuffTurn: 2, descZh: "法師：3.7倍火焰風暴" },
    "絕對零度": { nameEn: "Absolute Zero", type: "Mage", cost: 330, mp: 28, mult: 3.9, cd: 3, descZh: "法師：3.9倍極寒凍結" },
    "神聖光輝": { nameEn: "Holy Radiance", type: "Mage", cost: 360, mp: 30, heal: 280, cd: 3, buffZh: "光輝 [2T]", buffTurn: 2, descZh: "法師：高額恢復 280 HP" },
    "星爆氣流": { nameEn: "Star Burst", type: "Mage", cost: 380, mp: 30, mult: 4.2, cd: 3, descZh: "法師：4.2倍星爆魔攻" },
    "流星雨": { nameEn: "Meteor Shower", type: "Mage", cost: 400, mp: 32, mult: 4.5, cd: 3, descZh: "法師：4.5倍流星打擊" },
    "末日審判": { nameEn: "Doomsday Judgment", type: "Mage", cost: 450, mp: 35, mult: 4.9, cd: 4, descZh: "法師：4.9倍末日魔攻" },
    "虛空風暴": { nameEn: "Void Storm", type: "Mage", cost: 480, mp: 38, mult: 5.2, cd: 4, descZh: "法師：5.2倍虛空打擊" },
    "超新星爆發": { nameEn: "Supernova", type: "Mage", cost: 520, mp: 40, mult: 5.6, cd: 4, descZh: "法師：5.6倍極限爆破" },
    "太陽耀斑": { nameEn: "Solar Flare", type: "Mage", cost: 350, mp: 27, mult: 4.1, cd: 3, descZh: "法師：4.1倍強光打擊" },
    "黑洞吞噬": { nameEn: "Black Hole", type: "Mage", cost: 430, mp: 33, mult: 4.7, cd: 3, descZh: "法師：4.7倍黑洞魔法" },
    "混沌滅世破": { nameEn: "Chaos Devastation", type: "Mage", cost: 490, mp: 37, mult: 5.4, cd: 4, descZh: "法師：5.4倍混沌毀滅魔攻" },
    "創世元素爆": { nameEn: "Genesis Blast", type: "Mage", cost: 550, mp: 42, mult: 6.0, cd: 5, descZh: "法師：6.0倍創世極限魔攻" },

    // 射手專屬 (20)
    "狙擊": { nameEn: "Snipe", type: "Archer", cost: 160, mp: 12, mult: 2.2, cd: 0, descZh: "射手：2.2倍精準打擊" },
    "鷹眼專注": { nameEn: "Hawkeye Focus", type: "Archer", cost: 190, mp: 14, mult: 2.5, cd: 2, buffZh: "鷹眼 [2T]", buffTurn: 2, descZh: "射手：2.5倍射擊提升暴擊" },
    "影縫箭": { nameEn: "Shadow Stitch", type: "Archer", cost: 210, mp: 16, mult: 2.6, cd: 2, debuffZh: "影縫 [2T]", debuffTurn: 2, descZh: "射手：2.6倍打擊封鎖閃避" },
    "致命毒箭": { nameEn: "Poison Arrow", type: "Archer", cost: 210, mp: 15, mult: 2.4, cd: 2, debuffZh: "劇毒 [2T]", debuffTurn: 2, descZh: "射手：2.4倍劇毒穿透" },
    "疾風步": { nameEn: "Wind Step", type: "Archer", cost: 220, mp: 15, mult: 2.8, cd: 2, buffZh: "疾風 [2T]", buffTurn: 2, descZh: "射手：2.8倍疾風提升閃避" },
    "萬箭齊發": { nameEn: "Arrow Rain", type: "Archer", cost: 240, mp: 18, mult: 2.7, cd: 1, descZh: "射手：2.7倍高暴擊" },
    "幻影連射": { nameEn: "Phantom Barrage", type: "Archer", cost: 270, mp: 20, mult: 3.1, cd: 2, descZh: "射手：3.1倍連發射擊" },
    "鷹眼重弩": { nameEn: "Hawkeye Bow", type: "Archer", cost: 310, mp: 22, mult: 3.6, cd: 2, descZh: "射手：3.6倍精準狙殺" },
    "爆裂矢": { nameEn: "Explosive Arrow", type: "Archer", cost: 330, mp: 24, mult: 3.8, cd: 2, descZh: "射手：3.8倍爆破傷害" },
    "貫星神箭": { nameEn: "Star Piercer", type: "Archer", cost: 360, mp: 26, mult: 4.1, cd: 3, descZh: "射手：4.1倍貫星致命打擊" },
    "追魂箭": { nameEn: "Soul Chaser Arrow", type: "Archer", cost: 410, mp: 28, mult: 4.6, cd: 3, descZh: "射手：4.6倍追魂致命打擊" },
    "疾風連射": { nameEn: "Gale Burst", type: "Archer", cost: 440, mp: 32, mult: 5.0, cd: 3, descZh: "射手：5.0倍疾風連射" },
    "神怒天罰箭": { nameEn: "Divine Wrath Arrow", type: "Archer", cost: 510, mp: 38, mult: 5.7, cd: 4, descZh: "射手：5.7倍天罰毀滅打擊" },
    "雙重狙擊": { nameEn: "Double Shot", type: "Archer", cost: 180, mp: 13, mult: 2.3, cd: 1, descZh: "射手：2.3倍雙發打擊" },
    "寒冰毒箭": { nameEn: "Frost Poison Arrow", type: "Archer", cost: 230, mp: 17, mult: 2.9, cd: 2, descZh: "射手：2.9倍冰毒射擊" },
    "疾風閃電矢": { nameEn: "Lightning Arrow", type: "Archer", cost: 280, mp: 20, mult: 3.2, cd: 2, descZh: "射手：3.2倍閃電穿透" },
    "穿甲巨弩": { nameEn: "Armor Piercer", type: "Archer", cost: 340, mp: 25, mult: 3.9, cd: 2, descZh: "射手：3.9倍無視防禦" },
    "影舞連環射": { nameEn: "Shadow Dance Shot", type: "Archer", cost: 390, mp: 27, mult: 4.4, cd: 3, descZh: "射手：4.4倍影舞連射" },
    "滅世連弓箭": { nameEn: "Oblivion Bow", type: "Archer", cost: 470, mp: 34, mult: 5.2, cd: 4, descZh: "射手：5.2倍滅世狙殺" },
    "終極貫星天箭": { nameEn: "Ultimate Star Bow", type: "Archer", cost: 540, mp: 40, mult: 5.9, cd: 5, descZh: "射手：5.9倍終極天箭打擊" }
};

const CLASSES = {
    "Warrior": { nameZh: "戰士", nameEn: "Warrior", hp: 220, mp: 60, min: 22, max: 30, weaponZh: "鐵劍", weaponEn: "Iron Sword", critRate: 5, critDmg: 150, evasion: 5 },
    "Mage": { nameZh: "法師", nameEn: "Mage", hp: 110, mp: 220, min: 28, max: 40, weaponZh: "木製法杖", weaponEn: "Wooden Staff", critRate: 10, critDmg: 160, evasion: 5 },
    "Archer": { nameZh: "射手", nameEn: "Archer", hp: 130, mp: 90, min: 25, max: 35, weaponZh: "獵人長弓", weaponEn: "Hunter Bow", critRate: 15, critDmg: 150, evasion: 20 }
};

// 隨機裝備商店池（全數過濾排除高級 "adv" 裝備）
const ALL_EQUIPS_POOL = [
    { nameZh: "初級·鋼鐵頭盔 (+30 MaxHP)", slot: "helmet", tier: "basic", cost: 60, hp: 30 },
    { nameZh: "初級·皮質胸甲 (+40 MaxHP)", slot: "chest", tier: "basic", cost: 70, hp: 40 },
    { nameZh: "初級·輕型腿甲 (+25 MaxHP | +3% 閃避)", slot: "leggings", tier: "basic", cost: 65, hp: 25, evasion: 3 },
    { nameZh: "初級·鐵質手腕 (+10 攻擊)", slot: "bracer", tier: "basic", cost: 55, atk: 10 },
    { nameZh: "初級·鐵質短劍 (+12 攻擊)", slot: "weapon", tier: "basic", job: "Warrior", cost: 80, atk: 12 },
    { nameZh: "初級·學徒魔杖 (+15 攻擊)", slot: "weapon", tier: "basic", job: "Mage", cost: 90, atk: 15 },
    { nameZh: "初級·短獵弓 (+14 攻擊)", slot: "weapon", tier: "basic", job: "Archer", cost: 85, atk: 14 },

    { nameZh: "中級·精鋼戰盔 (+85 MaxHP | +40 MP)", slot: "helmet", tier: "mid", cost: 220, hp: 85, mp: 40 },
    { nameZh: "中級·精鋼重甲 (+110 MaxHP | +5% 閃避)", slot: "chest", tier: "mid", cost: 280, hp: 110, evasion: 5 },
    { nameZh: "中級·疾風腿甲 (+65 MaxHP | +7% 閃避)", slot: "leggings", tier: "mid", cost: 240, hp: 65, evasion: 7 },
    { nameZh: "中級·精鋼護腕 (+22 攻擊 | +3% 暴擊)", slot: "bracer", tier: "mid", cost: 200, atk: 22, critRate: 3 },
    { nameZh: "中級·騎士長劍 (+25 攻擊 | +5% 暴擊率)", slot: "weapon", tier: "mid", job: "Warrior", cost: 260, atk: 25, critRate: 5 },
    { nameZh: "中級·水晶法杖 (+30 攻擊 | +10% 暴傷)", slot: "weapon", tier: "mid", job: "Mage", cost: 300, atk: 30, critDmg: 10 },
    { nameZh: "中級·精準長弩 (+28 攻擊 | +8% 暴擊率)", slot: "weapon", tier: "mid", job: "Archer", cost: 280, atk: 28, critRate: 8 }
];

const MAPS = {
    1: { nameZh: "🌲 微光森林", nameEn: "Whispering Woods", villageZh: "樹梢村", villageEn: "Treetop Village", monstersZh: ["哥布林斥候", "史萊姆", "狂暴野狼"], bossZh: "哥布林千人將" },
    2: { nameZh: "❄️ 寒霜雪原", nameEn: "Frostbite Tundra", villageZh: "冰晶鎮", villageEn: "Frost Town", monstersZh: ["霜狼", "雪原獵手", "冰晶石傀儡"], bossZh: "雪原暴熊王" },
    3: { nameZh: "🏜️ 熾熱荒漠", nameEn: "Scorching Desert", villageZh: "烈日綠洲", villageEn: "Sun Oasis", monstersZh: ["沙漠毒蠍", "狂沙蛇衛", "石雕巨像"], bossZh: "狂沙法老王" },
    4: { nameZh: "🌋 烈焰火山", nameEn: "Molten Magma Cavern", villageZh: "火環前哨站", villageEn: "Fire Circle", monstersZh: ["熔岩蜥蜴", "烈焰元素", "火焰惡魔"], bossZh: "熔岩巨龍" },
    5: { nameZh: "☠️ 幽暗地底迷宮", nameEn: "Underdark Labyrinth", villageZh: "暗影黑市", villageEn: "Shadow Market", monstersZh: ["幽暗蜘蛛", "噬魂骷髏", "黑暗騎士"], bossZh: "暗影領主·卡爾巨影" },
    6: { nameZh: "🏛️ 失落古城", nameEn: "Lost Ruins of Atlantis", villageZh: "海底驛站", villageEn: "Ocean Outpost", monstersZh: ["遺跡守衛", "沉淪亡靈", "符文石像"], bossZh: "古代遠古守護者" },
    7: { nameZh: "⚡ 雷霆山峰", nameEn: "Thunderstorm Peak", villageZh: "雲頂高地", villageEn: "Cloudtop Village", monstersZh: ["雷霆獅鷲", "風暴元素", "閃電巨鷹"], bossZh: "風暴泰坦" },
    8: { nameZh: "🌊 深海幽谷", nameEn: "Abyssal Ocean Trench", villageZh: "海螺港口", villageEn: "Conch Port", monstersZh: ["潮汐海妖", "巨鉗蟹王", "深海怪魚"], bossZh: "深淵巨獸·克拉肯" },
    9: { nameZh: "☁️ 天空神殿", nameEn: "Sky Temple of Celestials", villageZh: "聖光高塔", villageEn: "Holy Tower", monstersZh: ["神殿石像鬼", "光明聖衛", "天空巨鷹"], bossZh: "天使長·米迦勒幻影" },
    10: { nameZh: "👑 魔王城城堡", nameEn: "Demon King Castle", villageZh: "終極前線", villageEn: "Final Front", monstersZh: ["煉獄夜魔", "漆黑騎士", "亡靈巨龍"], bossZh: "滅世魔王·路西法" }
};

const CARDS_DATABASE = [
    { id: "vampire", nameZh: "🩸 吸血鬼之吻", nameEn: "🩸 Vampire's Kiss", descZh: "攻擊時恢復傷害 15% HP", descEn: "15% Life Steal on Attack" },
    { id: "berserk", nameZh: "🔥 狂暴之怒", nameEn: "🔥 Berserker Rage", descZh: "基礎攻擊力提升 25%", descEn: "Base Atk +25%" },
    { id: "shield", nameZh: "🛡️ 鋼鐵意志", nameEn: "🛡️ Iron Will", descZh: "最大血量提升 80 點", descEn: "Max HP +80" },
    { id: "holy_shield", nameZh: "✨ 神聖護身", nameEn: "✨ Divine Aura", descZh: "進入戰鬥獲得 60 護盾", descEn: "Gain 60 Shield in Battle" },
    { id: "wind_step", nameZh: "🌀 疾風之步", nameEn: "🌀 Swift Step", descZh: "閃避率提升 15%", descEn: "Evasion +15%" },
    { id: "mana_flow", nameZh: "💧 魔力源泉", nameEn: "💧 Mana Surge", descZh: "最大魔力提升 60 點", descEn: "Max MP +60" },
    { id: "poison_blade", nameZh: "☠️ 劇毒之刃", nameEn: "☠️ Venom Blade", descZh: "攻擊附加 20% 中毒率", descEn: "+20% Poison Rate" },
    { id: "crit_fury", nameZh: "💥 暴怒火花", nameEn: "💥 Critical Spark", descZh: "暴擊率提升 15%", descEn: "Crit Rate +15%" },
    { id: "gold_bless", nameZh: "🌟 黃金祝福", nameEn: "🌟 Wealth Blessing", descZh: "戰鬥金幣收益提升 30%", descEn: "+30% Gold Drop" },
    { id: "exp_master", nameZh: "📖 冒險天賦", nameEn: "📖 Adv Talent", descZh: "基礎傷害提升 15 點", descEn: "Base Dmg +15" },
    { id: "titan_guard", nameZh: "🗿 金剛不壞", nameEn: "🗿 Titan Guard", descZh: "最大血量提升 120 點", descEn: "Max HP +120" },
    { id: "shadow_revenge", nameZh: "🌑 暗影復仇", nameEn: "🌑 Shadow Vengeance", descZh: "暴擊傷害提升 30%", descEn: "Crit Dmg +30%" },
    { id: "element_burst", nameZh: "🔮 元素爆發", nameEn: "🔮 Element Burst", descZh: "技能傷害效果提升 20%", descEn: "Skill Dmg +20%" },
    { id: "hawkeye", nameZh: "🏹 鷹眼專注", nameEn: "🏹 Hawkeye Focus", descZh: "暴擊率 +10% | 閃避率 +8%", descEn: "Crit +10% | Evasion +8%" },
    { id: "holy_revive", nameZh: "👼 聖光復甦", nameEn: "👼 Holy Light", descZh: "戰鬥獲勝自動恢復 30 HP", descEn: "Heal 30 HP on Victory" }
];

// **所有 90 把武器與高級專屬神裝完全收錄於鐵匠鋪**
const FORGE_RECIPES_DATABASE = [
    // ⚔️ 戰士武器 (10/10/10)
    { category: "warrior", slot: "weapon", nameZh: "初級·青銅劍 (+15 攻擊)", nameEn: "Basic Bronze Sword (+15 Atk)", req: { copper: 5 }, job: "Warrior", tier: "basic", atk: 15 },
    { category: "warrior", slot: "weapon", nameZh: "初級·粗鐵長刀 (+18 攻擊)", nameEn: "Basic Iron Saber (+18 Atk)", req: { copper: 6 }, job: "Warrior", tier: "basic", atk: 18 },
    { category: "warrior", slot: "weapon", nameZh: "初級·鋼製戰斧 (+20 攻擊)", nameEn: "Basic Steel Axe (+20 Atk)", req: { copper: 7 }, job: "Warrior", tier: "basic", atk: 20 },
    { category: "warrior", slot: "weapon", nameZh: "初級·騎士短劍 (+22 攻擊)", nameEn: "Basic Knight Dagger (+22 Atk)", req: { copper: 8 }, job: "Warrior", tier: "basic", atk: 22 },
    { category: "warrior", slot: "weapon", nameZh: "初級·重型鐵錘 (+24 攻擊)", nameEn: "Basic Heavy Hammer (+24 Atk)", req: { copper: 9 }, job: "Warrior", tier: "basic", atk: 24 },
    { category: "warrior", slot: "weapon", nameZh: "初級·雙刃戰斧 (+25 攻擊)", nameEn: "Basic Double Axe (+25 Atk)", req: { copper: 10 }, job: "Warrior", tier: "basic", atk: 25 },
    { category: "warrior", slot: "weapon", nameZh: "初級·精鋼長槍 (+26 攻擊)", nameEn: "Basic Steel Spear (+26 Atk)", req: { copper: 10, iron: 2 }, job: "Warrior", tier: "basic", atk: 26 },
    { category: "warrior", slot: "weapon", nameZh: "初級·開山大刀 (+28 攻擊)", nameEn: "Basic Mountain Cleaver (+28 Atk)", req: { copper: 10, iron: 3 }, job: "Warrior", tier: "basic", atk: 28 },
    { category: "warrior", slot: "weapon", nameZh: "初級·獵魔長劍 (+29 攻擊)", nameEn: "Basic Demon Sword (+29 Atk)", req: { copper: 10, iron: 4 }, job: "Warrior", tier: "basic", atk: 29 },
    { category: "warrior", slot: "weapon", nameZh: "初級·破甲巨劍 (+30 攻擊)", nameEn: "Basic Buster Sword (+30 Atk)", req: { copper: 10, iron: 5 }, job: "Warrior", tier: "basic", atk: 30 },

    { category: "warrior", slot: "weapon", nameZh: "中級·刺客毒刃 (+35 攻擊 | +20% 中毒率)", nameEn: "Mid Poison Dagger (+35 Atk | +20% Poison)", req: { copper: 12, iron: 8 }, job: "Warrior", tier: "mid", atk: 35, poisonRate: 20 },
    { category: "warrior", slot: "weapon", nameZh: "中級·騎士長劍 (+38 攻擊 | +5% 暴擊率)", nameEn: "Mid Knight Sword (+38 Atk | +5% Crit)", req: { copper: 13, iron: 9 }, job: "Warrior", tier: "mid", atk: 38, critRate: 5 },
    { category: "warrior", slot: "weapon", nameZh: "中級·狂暴重斧 (+40 攻擊 | +10% 暴傷)", nameEn: "Mid Berserk Axe (+40 Atk | +10% CritDmg)", req: { copper: 14, iron: 10 }, job: "Warrior", tier: "mid", atk: 40, critDmg: 10 },
    { category: "warrior", slot: "weapon", nameZh: "中級·破軍長槍 (+42 攻擊 | +6% 暴擊率)", nameEn: "Mid Breaker Spear (+42 Atk | +6% Crit)", req: { copper: 15, iron: 11 }, job: "Warrior", tier: "mid", atk: 42, critRate: 6 },
    { category: "warrior", slot: "weapon", nameZh: "中級·雙手斬馬刀 (+45 攻擊 | +12% 暴傷)", nameEn: "Mid Katana (+45 Atk | +12% CritDmg)", req: { copper: 16, iron: 12 }, job: "Warrior", tier: "mid", atk: 45, critDmg: 12 },
    { category: "warrior", slot: "weapon", nameZh: "中級·寒鐵巨劍 (+48 攻擊 | +5% 閃避)", nameEn: "Mid Coldsword (+48 Atk | +5% Evasion)", req: { copper: 17, iron: 13 }, job: "Warrior", tier: "mid", atk: 48, evasion: 5 },
    { category: "warrior", slot: "weapon", nameZh: "中級·烈焰戰斧 (+50 攻擊 | +15% 燃燒率)", nameEn: "Mid Flame Axe (+50 Atk | +15% Burn)", req: { copper: 18, iron: 14 }, job: "Warrior", tier: "mid", atk: 50, burnRate: 15 },
    { category: "warrior", slot: "weapon", nameZh: "中級·碎骨重錘 (+52 攻擊 | +8% 暴擊率)", nameEn: "Mid Bone Hammer (+52 Atk | +8% Crit)", req: { copper: 19, iron: 15 }, job: "Warrior", tier: "mid", atk: 52, critRate: 8 },
    { category: "warrior", slot: "weapon", nameZh: "中級·血氣巨刀 (+55 攻擊 | +15% 暴傷)", nameEn: "Mid Blood Blade (+55 Atk | +15% CritDmg)", req: { copper: 20, iron: 16 }, job: "Warrior", tier: "mid", atk: 55, critDmg: 15 },
    { category: "warrior", slot: "weapon", nameZh: "中級·黑曜石戰刃 (+58 攻擊 | +8% 閃避)", nameEn: "Mid Obsidian Blade (+58 Atk | +8% Evasion)", req: { copper: 22, iron: 18 }, job: "Warrior", tier: "mid", atk: 58, evasion: 8 },

    { category: "warrior", slot: "weapon", nameZh: "高級·狂暴屠魔巨斧 (+70 攻擊 | +15% 暴擊率 | +30% 暴傷)", nameEn: "Adv Berserk Axe (+70 Atk | +15% Crit | +30% CritDmg)", req: { copper: 25, iron: 20, gold: 3 }, job: "Warrior", tier: "adv", atk: 70, critRate: 15, critDmg: 30 },
    { category: "warrior", slot: "weapon", nameZh: "高級·龍怒屠龍寶刀 (+140 攻擊 | +30% 暴擊率 | +40% 暴傷)", nameEn: "Adv Dragon Saber (+140 Atk | +30% Crit | +40% CritDmg)", req: { copper: 40, iron: 32, gold: 10, diamond: 3 }, job: "Warrior", tier: "adv", atk: 140, critRate: 30, critDmg: 40 },
    { category: "warrior", slot: "weapon", nameZh: "高級·泰坦破天巨錘 (+180 攻擊 | +40% 暴傷 | +10% 閃避)", nameEn: "Adv Titan Hammer (+180 Atk | +40% CritDmg | +10% Evasion)", req: { copper: 50, iron: 40, gold: 12, diamond: 4 }, job: "Warrior", tier: "adv", atk: 180, critDmg: 40, evasion: 10 },
    { category: "warrior", slot: "weapon", nameZh: "高級·霸王毀滅重劍 (+200 攻擊 | +25% 暴擊率 | +20% 中毒)", nameEn: "Adv Overlord Sword (+200 Atk | +25% Crit | +20% Poison)", req: { copper: 55, iron: 45, gold: 15, diamond: 5 }, job: "Warrior", tier: "adv", atk: 200, critRate: 25, poisonRate: 20 },
    { category: "warrior", slot: "weapon", nameZh: "高級·雷霆破陣巨長槍 (+220 攻擊 | +35% 暴擊率 | +15% 閃避)", nameEn: "Adv Thunder Spear (+220 Atk | +35% Crit | +15% Evasion)", req: { copper: 60, iron: 50, gold: 18, diamond: 6 }, job: "Warrior", tier: "adv", atk: 220, critRate: 35, evasion: 15 },
    { category: "warrior", slot: "weapon", nameZh: "高級·滅世死神巨鐮 (+240 攻擊 | +50% 暴傷 | +25% 燃燒)", nameEn: "Adv Scythe (+240 Atk | +50% CritDmg | +25% Burn)", req: { copper: 65, iron: 55, gold: 20, diamond: 7 }, job: "Warrior", tier: "adv", atk: 240, critDmg: 50, burnRate: 25 },
    { category: "warrior", slot: "weapon", nameZh: "高級·聖光開山寶劍 (+260 攻擊 | +40% 暴擊率 | +20% 閃避)", nameEn: "Adv Holy Cleaver (+260 Atk | +40% Crit | +20% Evasion)", req: { copper: 70, iron: 60, gold: 22, diamond: 8 }, job: "Warrior", tier: "adv", atk: 260, critRate: 40, evasion: 20 },
    { category: "warrior", slot: "weapon", nameZh: "高級·阿修羅雙刃刀 (+280 攻擊 | +60% 暴傷 | +30% 中毒)", nameEn: "Adv Asura Dual Blade (+280 Atk | +60% CritDmg | +30% Poison)", req: { copper: 75, iron: 65, gold: 25, diamond: 9 }, job: "Warrior", tier: "adv", atk: 280, critDmg: 60, poisonRate: 30 },
    { category: "warrior", slot: "weapon", nameZh: "高級·無雙混沌屠魔劍 (+320 攻擊 | +45% 暴擊率 | +25% 閃避)", nameEn: "Adv Chaos Sword (+320 Atk | +45% Crit | +25% Evasion)", req: { copper: 80, iron: 70, gold: 28, diamond: 10 }, job: "Warrior", tier: "adv", atk: 320, critRate: 45, evasion: 25 },
    { category: "warrior", slot: "weapon", nameZh: "高級·終極神怒崩天神刃 (+380 攻擊 | +50% 暴擊率 | +80% 暴傷)", nameEn: "Adv Ultimate Divine Blade (+380 Atk | +50% Crit | +80% CritDmg)", req: { copper: 100, iron: 85, gold: 35, diamond: 15 }, job: "Warrior", tier: "adv", atk: 380, critRate: 50, critDmg: 80 },

    // 🔮 法師武器 (10/10/10)
    { category: "mage", slot: "weapon", nameZh: "初級·學徒木杖 (+15 攻擊)", nameEn: "Basic Apprentice Wand (+15 Atk)", req: { copper: 5 }, job: "Mage", tier: "basic", atk: 15 },
    { category: "mage", slot: "weapon", nameZh: "初級·橡木魔導杖 (+18 攻擊)", nameEn: "Basic Oak Wand (+18 Atk)", req: { copper: 6 }, job: "Mage", tier: "basic", atk: 18 },
    { category: "mage", slot: "weapon", nameZh: "初級·水晶短杖 (+20 攻擊)", nameEn: "Basic Crystal Wand (+20 Atk)", req: { copper: 7 }, job: "Mage", tier: "basic", atk: 20 },
    { category: "mage", slot: "weapon", nameZh: "初級·元素元素杖 (+22 攻擊)", nameEn: "Basic Elemental Wand (+22 Atk)", req: { copper: 8 }, job: "Mage", tier: "basic", atk: 22 },
    { category: "mage", slot: "weapon", nameZh: "初級·紫晶權杖 (+24 攻擊)", nameEn: "Basic Amethyst Scepter (+24 Atk)", req: { copper: 9 }, job: "Mage", tier: "basic", atk: 24 },
    { category: "mage", slot: "weapon", nameZh: "初級·古木魔法杖 (+25 攻擊)", nameEn: "Basic Ancient Wand (+25 Atk)", req: { copper: 10 }, job: "Mage", tier: "basic", atk: 25 },
    { category: "mage", slot: "weapon", nameZh: "初級·符文長杖 (+26 攻擊)", nameEn: "Basic Rune Staff (+26 Atk)", req: { copper: 10, iron: 2 }, job: "Mage", tier: "basic", atk: 26 },
    { category: "mage", slot: "weapon", nameZh: "初級·水藍魔杖 (+28 攻擊)", nameEn: "Basic Aqua Wand (+28 Atk)", req: { copper: 10, iron: 3 }, job: "Mage", tier: "basic", atk: 28 },
    { category: "mage", slot: "weapon", nameZh: "初級·烈火短權杖 (+29 攻擊)", nameEn: "Basic Fire Scepter (+29 Atk)", req: { copper: 10, iron: 4 }, job: "Mage", tier: "basic", atk: 29 },
    { category: "mage", slot: "weapon", nameZh: "初級·秘銀魔導杖 (+30 攻擊)", nameEn: "Basic Mithril Wand (+30 Atk)", req: { copper: 10, iron: 5 }, job: "Mage", tier: "basic", atk: 30 },

    { category: "mage", slot: "weapon", nameZh: "中級·秘銀符文權杖 (+35 攻擊 | +10% 暴擊率)", nameEn: "Mid Rune Scepter (+35 Atk | +10% Crit)", req: { copper: 12, iron: 8 }, job: "Mage", tier: "mid", atk: 35, critRate: 10 },
    { category: "mage", slot: "weapon", nameZh: "中級·水晶導導法杖 (+38 攻擊 | +10% 暴傷)", nameEn: "Mid Crystal Staff (+38 Atk | +10% CritDmg)", req: { copper: 13, iron: 9 }, job: "Mage", tier: "mid", atk: 38, critDmg: 10 },
    { category: "mage", slot: "weapon", nameZh: "中級·熾熱火球權杖 (+40 攻擊 | +15% 燃燒率)", nameEn: "Mid Fire Scepter (+40 Atk | +15% Burn)", req: { copper: 14, iron: 10 }, job: "Mage", tier: "mid", atk: 40, burnRate: 15 },
    { category: "mage", slot: "weapon", nameZh: "中級·冰霜凍結法杖 (+42 攻擊 | +5% 閃避)", nameEn: "Mid Frost Staff (+42 Atk | +5% Evasion)", req: { copper: 15, iron: 11 }, job: "Mage", tier: "mid", atk: 42, evasion: 5 },
    { category: "mage", slot: "weapon", nameZh: "中級·雷霆電擊權杖 (+45 攻擊 | +8% 暴擊率)", nameEn: "Mid Thunder Scepter (+45 Atk | +8% Crit)", req: { copper: 16, iron: 12 }, job: "Mage", tier: "mid", atk: 45, critRate: 8 },
    { category: "mage", slot: "weapon", nameZh: "中級·毒素魔法杖 (+48 攻擊 | +20% 中毒率)", nameEn: "Mid Poison Wand (+48 Atk | +20% Poison)", req: { copper: 17, iron: 13 }, job: "Mage", tier: "mid", atk: 48, poisonRate: 20 },
    { category: "mage", slot: "weapon", nameZh: "中級·星光奧術權杖 (+50 攻擊 | +15% 暴傷)", nameEn: "Mid Starlight Scepter (+50 Atk | +15% CritDmg)", req: { copper: 18, iron: 14 }, job: "Mage", tier: "mid", atk: 50, critDmg: 15 },
    { category: "mage", slot: "weapon", nameZh: "中級·虛空長法杖 (+52 攻擊 | +10% 暴擊率)", nameEn: "Mid Void Staff (+52 Atk | +10% Crit)", req: { copper: 19, iron: 15 }, job: "Mage", tier: "mid", atk: 52, critRate: 10 },
    { category: "mage", slot: "weapon", nameZh: "中級·神聖聖光權杖 (+55 攻擊 | +8% 閃避)", nameEn: "Mid Holy Scepter (+55 Atk | +8% Evasion)", req: { copper: 20, iron: 16 }, job: "Mage", tier: "mid", atk: 55, evasion: 8 },
    { category: "mage", slot: "weapon", nameZh: "中級·深海潮汐法杖 (+58 攻擊 | +12% 暴傷)", nameEn: "Mid Ocean Staff (+58 Atk | +12% CritDmg)", req: { copper: 22, iron: 18 }, job: "Mage", tier: "mid", atk: 58, critDmg: 12 },

    { category: "mage", slot: "weapon", nameZh: "高級·熾熱元素法杖 (+70 攻擊 | +25% 燃燒率 | +20% 暴傷)", nameEn: "Adv Flame Staff (+70 Atk | +25% Burn | +20% CritDmg)", req: { copper: 25, iron: 20, gold: 3 }, job: "Mage", tier: "adv", atk: 70, burnRate: 25, critDmg: 20 },
    { category: "mage", slot: "weapon", nameZh: "高級·星空星爆聖權杖 (+150 攻擊 | +35% 暴傷 | +20% 燃燒)", nameEn: "Adv Star Burst Scepter (+150 Atk | +35% CritDmg | +20% Burn)", req: { copper: 40, iron: 32, gold: 10, diamond: 3 }, job: "Mage", tier: "adv", atk: 150, critDmg: 35, burnRate: 20 },
    { category: "mage", slot: "weapon", nameZh: "高級·虛空毀滅奧術魔杖 (+190 攻擊 | +30% 暴擊率 | +25% 毒傷)", nameEn: "Adv Void Wand (+190 Atk | +30% Crit | +25% Poison)", req: { copper: 50, iron: 40, gold: 12, diamond: 4 }, job: "Mage", tier: "adv", atk: 190, critRate: 30, poisonRate: 25 },
    { category: "mage", slot: "weapon", nameZh: "高級·超新星極限權杖 (+210 攻擊 | +40% 暴傷 | +15% 閃避)", nameEn: "Adv Supernova Scepter (+210 Atk | +40% CritDmg | +15% Evasion)", req: { copper: 55, iron: 45, gold: 15, diamond: 5 }, job: "Mage", tier: "adv", atk: 210, critDmg: 40, evasion: 15 },
    { category: "mage", slot: "weapon", nameZh: "高級·絕對零度極寒法杖 (+230 攻擊 | +35% 暴擊率 | +20% 閃避)", nameEn: "Adv Absolute Zero Staff (+230 Atk | +35% Crit | +20% Evasion)", req: { copper: 60, iron: 50, gold: 18, diamond: 6 }, job: "Mage", tier: "adv", atk: 230, critRate: 35, evasion: 20 },
    { category: "mage", slot: "weapon", nameZh: "高級·末日審判黑洞權杖 (+250 攻擊 | +50% 暴傷 | +30% 燃燒)", nameEn: "Adv Doomsday Scepter (+250 Atk | +50% CritDmg | +30% Burn)", req: { copper: 65, iron: 55, gold: 20, diamond: 7 }, job: "Mage", tier: "adv", atk: 250, critDmg: 50, burnRate: 30 },
    { category: "mage", slot: "weapon", nameZh: "高級·創世神聖光輝魔杖 (+270 攻擊 | +40% 暴擊率 | +25% 閃避)", nameEn: "Adv Genesis Wand (+270 Atk | +40% Crit | +25% Evasion)", req: { copper: 70, iron: 60, gold: 22, diamond: 8 }, job: "Mage", tier: "adv", atk: 270, critRate: 40, evasion: 25 },
    { category: "mage", slot: "weapon", nameZh: "高級·混沌元素滅世權杖 (+290 攻擊 | +60% 暴傷 | +30% 毒傷)", nameEn: "Adv Chaos Scepter (+290 Atk | +60% CritDmg | +30% Poison)", req: { copper: 75, iron: 65, gold: 25, diamond: 9 }, job: "Mage", tier: "adv", atk: 290, critDmg: 60, poisonRate: 30 },
    { category: "mage", slot: "weapon", nameZh: "高級·流星天罰大魔導法杖 (+330 攻擊 | +45% 暴擊率 | +30% 閃避)", nameEn: "Adv Meteor Archmage Staff (+330 Atk | +45% Crit | +30% Evasion)", req: { copper: 80, iron: 70, gold: 28, diamond: 10 }, job: "Mage", tier: "adv", atk: 330, critRate: 45, evasion: 30 },
    { category: "mage", slot: "weapon", nameZh: "高級·終極神怒創世至尊魔杖 (+390 攻擊 | +55% 暴擊率 | +85% 暴傷)", nameEn: "Adv Supreme Divine Staff (+390 Atk | +55% Crit | +85% CritDmg)", req: { copper: 100, iron: 85, gold: 35, diamond: 15 }, job: "Mage", tier: "adv", atk: 390, critRate: 55, critDmg: 85 },

    // 🏹 射手武器 (10/10/10)
    { category: "archer", slot: "weapon", nameZh: "初級·短獵弓 (+14 攻擊)", nameEn: "Basic Short Bow (+14 Atk)", req: { copper: 5 }, job: "Archer", tier: "basic", atk: 14 },
    { category: "archer", slot: "weapon", nameZh: "初級·精鋼神木弓 (+16 攻擊)", nameEn: "Basic Steel Bow (+16 Atk)", req: { copper: 6 }, job: "Archer", tier: "basic", atk: 16 },
    { category: "archer", slot: "weapon", nameZh: "初級·獵人輕弩 (+18 攻擊)", nameEn: "Basic Hunter Crossbow (+18 Atk)", req: { copper: 7 }, job: "Archer", tier: "basic", atk: 18 },
    { category: "archer", slot: "weapon", nameZh: "初級·竹製長弓 (+20 攻擊)", nameEn: "Basic Bamboo Bow (+20 Atk)", req: { copper: 8 }, job: "Archer", tier: "basic", atk: 20 },
    { category: "archer", slot: "weapon", nameZh: "初級·複合木弓 (+22 攻擊)", nameEn: "Basic Composite Bow (+22 Atk)", req: { copper: 9 }, job: "Archer", tier: "basic", atk: 22 },
    { category: "archer", slot: "weapon", nameZh: "初級·精銳反曲弓 (+24 攻擊)", nameEn: "Basic Recurve Bow (+24 Atk)", req: { copper: 10 }, job: "Archer", tier: "basic", atk: 24 },
    { category: "archer", slot: "weapon", nameZh: "初級·鐵臂重弩 (+25 攻擊)", nameEn: "Basic Iron Crossbow (+25 Atk)", req: { copper: 10, iron: 2 }, job: "Archer", tier: "basic", atk: 25 },
    { category: "archer", slot: "weapon", nameZh: "初級·疾風短弓 (+27 攻擊)", nameEn: "Basic Gale Bow (+27 Atk)", req: { copper: 10, iron: 3 }, job: "Archer", tier: "basic", atk: 27 },
    { category: "archer", slot: "weapon", nameZh: "初級·穿雲木弓 (+28 攻擊)", nameEn: "Basic Cloud Bow (+28 Atk)", req: { copper: 10, iron: 4 }, job: "Archer", tier: "basic", atk: 28 },
    { category: "archer", slot: "weapon", nameZh: "初級·神射鋼弩 (+30 攻擊)", nameEn: "Basic Sniper Crossbow (+30 Atk)", req: { copper: 10, iron: 5 }, job: "Archer", tier: "basic", atk: 30 },

    { category: "archer", slot: "weapon", nameZh: "中級·追風神射弩 (+32 攻擊 | +10% 閃避率)", nameEn: "Mid Wind Crossbow (+32 Atk | +10% Evasion)", req: { copper: 12, iron: 8 }, job: "Archer", tier: "mid", atk: 32, evasion: 10 },
    { category: "archer", slot: "weapon", nameZh: "中級·精準長弩 (+35 攻擊 | +8% 暴擊率)", nameEn: "Mid Precision Crossbow (+35 Atk | +8% Crit)", req: { copper: 13, iron: 9 }, job: "Archer", tier: "mid", atk: 35, critRate: 8 },
    { category: "archer", slot: "weapon", nameZh: "中級·致命毒矢弓 (+38 攻擊 | +20% 中毒率)", nameEn: "Mid Poison Bow (+38 Atk | +20% Poison)", req: { copper: 14, iron: 10 }, job: "Archer", tier: "mid", atk: 38, poisonRate: 20 },
    { category: "archer", slot: "weapon", nameZh: "中級·疾風連發弩 (+40 攻擊 | +6% 閃避率)", nameEn: "Mid Repeating Crossbow (+40 Atk | +6% Evasion)", req: { copper: 15, iron: 11 }, job: "Archer", tier: "mid", atk: 40, evasion: 6 },
    { category: "archer", slot: "weapon", nameZh: "中級·鷹眼狙擊弓 (+42 攻擊 | +12% 暴傷)", nameEn: "Mid Hawkeye Bow (+42 Atk | +12% CritDmg)", req: { copper: 16, iron: 12 }, job: "Archer", tier: "mid", atk: 42, critDmg: 12 },
    { category: "archer", slot: "weapon", nameZh: "中級·爆裂火焰弩 (+45 攻擊 | +15% 燃燒率)", nameEn: "Mid Explosive Crossbow (+45 Atk | +15% Burn)", req: { copper: 17, iron: 13 }, job: "Archer", tier: "mid", atk: 45, burnRate: 15 },
    { category: "archer", slot: "weapon", nameZh: "中級·影縫長弓 (+48 攻擊 | +10% 暴擊率)", nameEn: "Mid Shadow Bow (+48 Atk | +10% Crit)", req: { copper: 18, iron: 14 }, job: "Archer", tier: "mid", atk: 48, critRate: 10 },
    { category: "archer", slot: "weapon", nameZh: "中級·穿透金屬弩 (+50 攻擊 | +15% 暴傷)", nameEn: "Mid Piercing Crossbow (+50 Atk | +15% CritDmg)", req: { copper: 19, iron: 15 }, job: "Archer", tier: "mid", atk: 50, critDmg: 15 },
    { category: "archer", slot: "weapon", nameZh: "中級·寒冰獵魔弓 (+52 攻擊 | +8% 閃避)", nameEn: "Mid Ice Hunter Bow (+52 Atk | +8% Evasion)", req: { copper: 20, iron: 16 }, job: "Archer", tier: "mid", atk: 52, evasion: 8 },
    { category: "archer", slot: "weapon", nameZh: "中級·紫晶重型弩 (+55 攻擊 | +12% 暴擊率)", nameEn: "Mid Amethyst Crossbow (+55 Atk | +12% Crit)", req: { copper: 22, iron: 18 }, job: "Archer", tier: "mid", atk: 55, critRate: 12 },

    { category: "archer", slot: "weapon", nameZh: "高級·追魂神魔巨弩 (+80 攻擊 | +20% 暴擊率 | +50% 暴傷)", nameEn: "Adv Soul Crossbow (+80 Atk | +20% Crit | +50% CritDmg)", req: { copper: 25, iron: 20, gold: 5, diamond: 1 }, job: "Archer", tier: "adv", atk: 80, critRate: 20, critDmg: 50 },
    { category: "archer", slot: "weapon", nameZh: "高級·貫星連擊神天弩 (+145 攻擊 | +25% 暴擊率 | +20% 閃避)", nameEn: "Adv Star Crossbow (+145 Atk | +25% Crit | +20% Evasion)", req: { copper: 40, iron: 32, gold: 10, diamond: 3 }, job: "Archer", tier: "adv", atk: 145, critRate: 25, evasion: 20 },
    { category: "archer", slot: "weapon", nameZh: "高級·神怒貫穿天罰弓 (+185 攻擊 | +35% 暴擊率 | +60% 暴傷)", nameEn: "Adv Wrath Bow (+185 Atk | +35% Crit | +60% CritDmg)", req: { copper: 50, iron: 40, gold: 12, diamond: 4 }, job: "Archer", tier: "adv", atk: 185, critRate: 35, critDmg: 60 },
    { category: "archer", slot: "weapon", nameZh: "高級·影舞幻影滅世弓 (+205 攻擊 | +30% 閃避 | +30% 暴擊率)", nameEn: "Adv Phantom Bow (+205 Atk | +30% Evasion | +30% Crit)", req: { copper: 55, iron: 45, gold: 15, diamond: 5 }, job: "Archer", tier: "adv", atk: 205, evasion: 30, critRate: 30 },
    { category: "archer", slot: "weapon", nameZh: "高級·爆裂天火神威弩 (+225 攻擊 | +30% 燃燒 | +45% 暴傷)", nameEn: "Adv Flame Crossbow (+225 Atk | +30% Burn | +45% CritDmg)", req: { copper: 60, iron: 50, gold: 18, diamond: 6 }, job: "Archer", tier: "adv", atk: 225, burnRate: 30, critDmg: 45 },
    { category: "archer", slot: "weapon", nameZh: "高級·毒龍噬魂神箭弩 (+245 攻擊 | +35% 毒傷 | +25% 暴擊率)", nameEn: "Adv Dragon Crossbow (+245 Atk | +35% Poison | +25% Crit)", req: { copper: 65, iron: 55, gold: 20, diamond: 7 }, job: "Archer", tier: "adv", atk: 245, poisonRate: 35, critRate: 25 },
    { category: "archer", slot: "weapon", nameZh: "高級·疾風穿雲聖光弓 (+265 攻擊 | +35% 閃避 | +50% 暴傷)", nameEn: "Adv Cloud Bow (+265 Atk | +35% Evasion | +50% CritDmg)", req: { copper: 70, iron: 60, gold: 22, diamond: 8 }, job: "Archer", tier: "adv", atk: 265, evasion: 35, critDmg: 50 },
    { category: "archer", slot: "weapon", nameZh: "高級·阿修羅破天神箭弩 (+285 攻擊 | +40% 暴擊率 | +65% 暴傷)", nameEn: "Adv Asura Crossbow (+285 Atk | +40% Crit | +65% CritDmg)", req: { copper: 75, iron: 65, gold: 25, diamond: 9 }, job: "Archer", tier: "adv", atk: 285, critRate: 40, critDmg: 65 },
    { category: "archer", slot: "weapon", nameZh: "高級·混沌滅世神箭弓 (+325 攻擊 | +40% 閃避 | +35% 暴擊率)", nameEn: "Adv Chaos Bow (+325 Atk | +40% Evasion | +35% Crit)", req: { copper: 80, iron: 70, gold: 28, diamond: 10 }, job: "Archer", tier: "adv", atk: 325, evasion: 40, critRate: 35 },
    { category: "archer", slot: "weapon", nameZh: "高級·終極天罰滅世神尊弩 (+385 攻擊 | +50% 暴擊率 | +90% 暴傷)", nameEn: "Adv Supreme Crossbow (+385 Atk | +50% Crit | +90% CritDmg)", req: { copper: 100, iron: 85, gold: 35, diamond: 15 }, job: "Archer", tier: "adv", atk: 385, critRate: 50, critDmg: 90 },

    // 🛡️ 各部位防具 (頭盔, 胸甲, 腿甲, 手腕 - 含高級獨佔神裝)
    { category: "armor", slot: "helmet", nameZh: "初級·鋼鐵頭盔 (+35 MaxHP)", req: { iron: 4 }, job: null, tier: "basic", hp: 35 },
    { category: "armor", slot: "helmet", nameZh: "中級·精鋼戰盔 (+85 MaxHP | +40 MP)", req: { copper: 10, iron: 6 }, job: null, tier: "mid", hp: 85, mp: 40 },
    { category: "armor", slot: "helmet", nameZh: "高級·泰坦聖光盔 (+180 MaxHP | +8% 閃避)", req: { copper: 20, iron: 15, gold: 3 }, job: null, tier: "adv", hp: 180, evasion: 8 },

    { category: "armor", slot: "chest", nameZh: "初級·鐵骨胸甲 (+60 MaxHP)", req: { iron: 5 }, job: null, tier: "basic", hp: 60 },
    { category: "armor", slot: "chest", nameZh: "中級·精鋼合金武裝 (+110 MaxHP | +5% 閃避率)", req: { copper: 12, iron: 8 }, job: null, tier: "mid", hp: 110, evasion: 5 },
    { category: "armor", slot: "chest", nameZh: "高級·不朽神聖鎧甲 (+800 MaxHP | +30% 閃避率)", req: { copper: 50, iron: 40, gold: 12, diamond: 4 }, job: null, tier: "adv", hp: 800, evasion: 30 },

    { category: "armor", slot: "leggings", nameZh: "初級·輕型護腿 (+25 MaxHP | +2% 閃避)", req: { copper: 5 }, job: null, tier: "basic", hp: 25, evasion: 2 },
    { category: "armor", slot: "leggings", nameZh: "中級·疾風腿甲 (+65 MaxHP | +7% 閃避)", req: { copper: 10, iron: 5 }, job: null, tier: "mid", hp: 65, evasion: 7 },
    { category: "armor", slot: "leggings", nameZh: "高級·追影天行腿甲 (+150 MaxHP | +15% 閃避)", req: { copper: 20, iron: 12, gold: 3 }, job: null, tier: "adv", hp: 150, evasion: 15 },

    { category: "armor", slot: "bracer", nameZh: "初級·鐵質手腕 (+10 攻擊)", req: { iron: 3 }, job: null, tier: "basic", atk: 10 },
    { category: "armor", slot: "bracer", nameZh: "中級·精鋼護腕 (+22 攻擊 | +3% 暴擊)", req: { copper: 8, iron: 5 }, job: null, tier: "mid", atk: 22, critRate: 3 },
    { category: "armor", slot: "bracer", nameZh: "高級·阿修羅破天護腕 (+50 攻擊 | +10% 暴擊率)", req: { copper: 18, iron: 15, gold: 2 }, job: null, tier: "adv", atk: 50, critRate: 10 }
];

const WEAPON_ENCHANTS = [
    { id: "flame", keyZh: "烈焰", keyEn: "Flame", nameZh: "🔥 烈焰附魔 (10 附魔石)", stoneReq: 10, descZh: "+15 傷害 + 燃燒 2 回合" },
    { id: "vampire", keyZh: "吸血", keyEn: "Vampire", nameZh: "🩸 吸血附魔 (10 附魔石)", stoneReq: 10, descZh: "獲得 15% 傷害吸血" },
    { id: "sharp", keyZh: "銳利", keyEn: "Sharp", nameZh: "⚡ 銳利附魔 (10 附魔石)", stoneReq: 10, descZh: "基礎攻擊力提升 25 點" },
    { id: "frost", keyZh: "冰霜", keyEn: "Frost", nameZh: "❄️ 冰霜附魔 (10 附魔石)", stoneReq: 10, descZh: "20% 機率凍結敵人 1 回合" },
    { id: "pierce", keyZh: "破甲", keyEn: "Pierce", nameZh: "🛡️ 破甲附魔 (10 附魔石)", stoneReq: 10, descZh: "無視防禦 +20 固定傷害" },
    { id: "holy", keyZh: "聖光", keyEn: "Holy", nameZh: "✨ 聖光附魔 (10 附魔石)", stoneReq: 10, descZh: "對 BOSS / 魔王額外 +30% 傷害" },
    { id: "storm", keyZh: "風暴", keyEn: "Storm", nameZh: "🌪️ 風暴附魔 (10 附魔石)", stoneReq: 10, descZh: "連擊機率提升 20%" },
    { id: "poison", keyZh: "毒素", keyEn: "Poison", nameZh: "☠️ 毒素附魔 (10 附魔石)", stoneReq: 10, descZh: "敵人每回合受到 20 點毒傷" },
    { id: "bless", keyZh: "祈願", keyEn: "Bless", nameZh: "🌟 祈願附魔 (10 附魔石)", stoneReq: 10, descZh: "戰鬥勝利獲得金幣量增加 25%" },
    { id: "fury", keyZh: "暴怒", keyEn: "Fury", nameZh: "💥 暴怒附魔 (10 附魔石)", stoneReq: 10, descZh: "暴擊率提升 20%" }
];

// 全 50 項成就資料（完整無刪減）
const ACHIEVEMENTS_DATABASE = [
    // ⚔️ 主線關卡 (15項)
    { category: "stage", id: "stage_10", titleZh: "🏆 森林征服者", titleEn: "Stage 1-10 Clear", descZh: "擊敗第 1 區 BOSS (1-10)", reqType: "stage", reqVal: 10, gold: 200, stones: 2 },
    { category: "stage", id: "stage_20", titleZh: "🏆 冰雪勇將", titleEn: "Stage 2-10 Clear", descZh: "擊敗第 2 區 BOSS (2-10)", reqType: "stage", reqVal: 20, gold: 300, stones: 3 },
    { category: "stage", id: "stage_30", titleZh: "🏆 沙漠霸主", titleEn: "Stage 3-10 Clear", descZh: "擊敗第 3 區 BOSS (3-10)", reqType: "stage", reqVal: 30, gold: 400, stones: 4 },
    { category: "stage", id: "stage_40", titleZh: "🏆 熔岩屠龍者", titleEn: "Stage 4-10 Clear", descZh: "擊敗第 4 區 BOSS (4-10)", reqType: "stage", reqVal: 40, gold: 500, stones: 5 },
    { category: "stage", id: "stage_50", titleZh: "🏆 地底破魔者", titleEn: "Stage 5-10 Clear", descZh: "擊敗第 5 區 BOSS (5-10)", reqType: "stage", reqVal: 50, gold: 600, stones: 6 },
    { category: "stage", id: "stage_60", titleZh: "🏆 古城尋寶家", titleEn: "Stage 6-10 Clear", descZh: "擊敗第 6 區 BOSS (6-10)", reqType: "stage", reqVal: 60, gold: 700, stones: 7 },
    { category: "stage", id: "stage_70", titleZh: "🏆 雷霆征服者", titleEn: "Stage 7-10 Clear", descZh: "擊敗第 7 區 BOSS (7-10)", reqType: "stage", reqVal: 70, gold: 800, stones: 8 },
    { category: "stage", id: "stage_80", titleZh: "🏆 深海獵手", titleEn: "Stage 8-10 Clear", descZh: "擊敗第 8 區 BOSS (8-10)", reqType: "stage", reqVal: 80, gold: 900, stones: 9 },
    { category: "stage", id: "stage_90", titleZh: "🏆 聖光洗禮者", titleEn: "Stage 9-10 Clear", descZh: "擊敗第 9 區 BOSS (9-10)", reqType: "stage", reqVal: 90, gold: 1000, stones: 10 },
    { category: "stage", id: "stage_100", titleZh: "👑 滅世救世主", titleEn: "Final Boss Defeated", descZh: "通關 100 關擊敗滅世魔王", reqType: "stage", reqVal: 100, gold: 3000, stones: 20 },
    { category: "stage", id: "stage_win_5", titleZh: "⚔️ 連戰連捷", titleEn: "Win 5 Battles", descZh: "累積勝場達到 5 次", reqType: "stage", reqVal: 5, gold: 100, stones: 1 },
    { category: "stage", id: "stage_win_15", titleZh: "⚔️ 戰場老兵", titleEn: "Win 15 Battles", descZh: "累積勝場達到 15 次", reqType: "stage", reqVal: 15, gold: 200, stones: 2 },
    { category: "stage", id: "stage_win_30", titleZh: "⚔️ 無敵勇者", titleEn: "Win 30 Battles", descZh: "累積勝場達到 30 次", reqType: "stage", reqVal: 30, gold: 400, stones: 4 },
    { category: "stage", id: "stage_win_60", titleZh: "⚔️ 戰神轉世", titleEn: "Win 60 Battles", descZh: "累積勝場達到 60 次", reqType: "stage", reqVal: 60, gold: 800, stones: 8 },
    { category: "stage", id: "stage_win_90", titleZh: "⚔️ 百戰不殆", titleEn: "Win 90 Battles", descZh: "累積勝場達到 90 次", reqType: "stage", reqVal: 90, gold: 1200, stones: 12 },

    // ⛏️ 採礦鍛造 (15項)
    { category: "mine", id: "mine_1", titleZh: "⛏️ 採礦新手", titleEn: "Mine 1 Time", descZh: "完成 1 次採礦", reqType: "mine", reqVal: 1, gold: 100, stones: 1 },
    { category: "mine", id: "mine_5", titleZh: "⛏️ 礦坑勤務員", titleEn: "Mine 5 Times", descZh: "完成 5 次採礦", reqType: "mine", reqVal: 5, gold: 150, stones: 2 },
    { category: "mine", id: "mine_10", titleZh: "⛏️ 採礦大師", titleEn: "Mine 10 Times", descZh: "完成 10 次採礦", reqType: "mine", reqVal: 10, gold: 250, stones: 3 },
    { category: "mine", id: "mine_25", titleZh: "⛏️ 礦脈探險家", titleEn: "Mine 25 Times", descZh: "完成 25 次採礦", reqType: "mine", reqVal: 25, gold: 500, stones: 5 },
    { category: "mine", id: "mine_50", titleZh: "⛏️ 傳奇黃金礦工", titleEn: "Mine 50 Times", descZh: "完成 50 次採礦", reqType: "mine", reqVal: 50, gold: 1000, stones: 10 },
    { category: "mine", id: "mine_copper", titleZh: "🥉 銅礦愛好者", titleEn: "Own Copper", descZh: "擁有一顆銅礦石", reqType: "copper", reqVal: 1, gold: 80, stones: 1 },
    { category: "mine", id: "mine_iron", titleZh: "🥈 鐵骨好手", titleEn: "Own Iron", descZh: "擁有一顆鐵礦石", reqType: "iron", reqVal: 1, gold: 120, stones: 1 },
    { category: "mine", id: "mine_gold", titleZh: "🥇 黃金大亨", titleEn: "Own Gold Ore", descZh: "擁有一顆金礦石", reqType: "gold", reqVal: 1, gold: 300, stones: 3 },
    { category: "mine", id: "mine_diamond", titleZh: "💎 鑽石獵人", titleEn: "Own Diamond", descZh: "擁有一顆鑽石", reqType: "diamond", reqVal: 1, gold: 800, stones: 5 },
    { category: "mine", id: "craft_1", titleZh: "🔨 學徒打鐵師", titleEn: "Craft 1 Gear", descZh: "在鐵匠鋪打造 1 件裝備", reqType: "craft", reqVal: 1, gold: 200, stones: 2 },
    { category: "mine", id: "craft_3", titleZh: "🔨 熟練鐵匠", titleEn: "Craft 3 Gear", descZh: "在鐵匠鋪打造 3 件裝備", reqType: "craft", reqVal: 3, gold: 400, stones: 4 },
    { category: "mine", id: "craft_5", titleZh: "🔨 神兵鑄造師", titleEn: "Craft 5 Gear", descZh: "在鐵匠鋪打造 5 件裝備", reqType: "craft", reqVal: 5, gold: 800, stones: 8 },
    { category: "mine", id: "craft_10", titleZh: "👑 鍛造宗師", titleEn: "Craft 10 Gear", descZh: "在鐵匠鋪打造 10 件裝備", reqType: "craft", reqVal: 10, gold: 1500, stones: 15 },
    { category: "mine", id: "equip_basic", titleZh: "🛡️ 基礎武裝", titleEn: "Equip Basic", descZh: "裝備至少 1 件初級裝備", reqType: "equipCount", reqVal: 1, gold: 100, stones: 1 },
    { category: "mine", id: "equip_full", titleZh: "🛡️ 神裝加身", titleEn: "Equip Advanced", descZh: "裝備至少 5 件裝備", reqType: "equipCount", reqVal: 5, gold: 1000, stones: 10 },

    // 🔮 魔法附魔 (10項)
    { category: "enchant", id: "enc_1", titleZh: "🔮 初次附魔", titleEn: "Enchant 1 Time", descZh: "完成 1 次武器魔法附魔", reqType: "enchantCount", reqVal: 1, gold: 300, stones: 3 },
    { category: "enchant", id: "enc_2", titleZh: "🔮 元素親和", titleEn: "Enchant 2 Times", descZh: "完成 2 次武器魔法附魔", reqType: "enchantCount", reqVal: 2, gold: 500, stones: 5 },
    { category: "enchant", id: "enc_3", titleZh: "🔮 附魔大師", titleEn: "Enchant 3 Times", descZh: "完成 3 次武器魔法附魔", reqType: "enchantCount", reqVal: 3, gold: 800, stones: 8 },
    { category: "enchant", id: "enc_5", titleZh: "🔮 魔力滿溢", titleEn: "Enchant 5 Times", descZh: "完成 5 次武器魔法附魔", reqType: "enchantCount", reqVal: 5, gold: 1200, stones: 12 },
    { category: "enchant", id: "enc_stone_10", titleZh: "💎 附魔石收藏家", titleEn: "Own 10 Stones", descZh: "持有 10 顆附魔石", reqType: "stones", reqVal: 10, gold: 500, stones: 5 },
    { category: "enchant", id: "enc_stone_20", titleZh: "💎 魔法寶石富豪", titleEn: "Own 20 Stones", descZh: "持有 20 顆附魔石", reqType: "stones", reqVal: 20, gold: 1000, stones: 10 },
    { category: "enchant", id: "enc_flame", titleZh: "🔥 熾熱火焰", titleEn: "Flame Enchant", descZh: "獲得烈焰附魔", reqType: "hasEnchant", reqVal: "烈焰", gold: 300, stones: 3 },
    { category: "enchant", id: "enc_vampire", titleZh: "🩸 嗜血魔咒", titleEn: "Vampire Enchant", descZh: "獲得吸血附魔", reqType: "hasEnchant", reqVal: "吸血", gold: 300, stones: 3 },
    { category: "enchant", id: "enc_frost", titleZh: "❄️ 寒冰凍結", titleEn: "Frost Enchant", descZh: "獲得冰霜附魔", reqType: "hasEnchant", reqVal: "冰霜", gold: 300, stones: 3 },
    { category: "enchant", id: "enc_fury", titleZh: "💥 暴怒狂之", titleEn: "Fury Enchant", descZh: "獲得暴怒附魔", reqType: "hasEnchant", reqVal: "暴怒", gold: 300, stones: 3 },

    // 💰 冒險財富 (10項)
    { category: "wealth", id: "gold_500", titleZh: "💰 第一桶金", titleEn: "Reach 500 Gold", descZh: "持有金幣達到 500 G", reqType: "gold", reqVal: 500, gold: 200, stones: 2 },
    { category: "wealth", id: "gold_2000", titleZh: "💰 村莊小富豪", titleEn: "Reach 2000 Gold", descZh: "持有金幣達到 2,000 G", reqType: "gold", reqVal: 2000, gold: 500, stones: 5 },
    { category: "wealth", id: "gold_5000", titleZh: "💰 富甲一方", titleEn: "Reach 5000 Gold", descZh: "持有金幣達到 5,000 G", reqType: "gold", reqVal: 5000, gold: 1000, stones: 8 },
    { category: "wealth", id: "gold_10000", titleZh: "💰 富可敵國", titleEn: "Reach 10000 Gold", descZh: "持有金幣達到 10,000 G", reqType: "gold", reqVal: 10000, gold: 2000, stones: 15 },
    { category: "wealth", id: "skill_2", titleZh: "📖 技能入門", titleEn: "Learn 2 Skills", descZh: "學會 2 招技能", reqType: "skillCount", reqVal: 2, gold: 200, stones: 2 },
    { category: "wealth", id: "skill_4", titleZh: "📖 技能滿載", titleEn: "Learn 4 Skills", descZh: "學滿 4 招技能", reqType: "skillCount", reqVal: 4, gold: 500, stones: 5 },
    { category: "wealth", id: "potion_hp", titleZh: "🧪 生命保障", titleEn: "Own 5 HP Potions", descZh: "持有 5 瓶生命藥水", reqType: "potHp", reqVal: 5, gold: 200, stones: 2 },
    { category: "wealth", id: "potion_mp", titleZh: "💧 魔力源泉", titleEn: "Own 5 MP Potions", descZh: "持有 5 瓶魔力藥水", reqType: "potMp", reqVal: 5, gold: 200, stones: 2 },
    { category: "wealth", id: "shop_refresh", titleZh: "🔄 購物狂人", titleEn: "Refresh Shop", descZh: "進行 1 次技能商店換一批", reqType: "gold", reqVal: 100, gold: 150, stones: 1 },
    { category: "wealth", id: "action_rest", titleZh: "⛪ 充分休息", titleEn: "Rest at Inn", descZh: "在旅館完成休息恢復", reqType: "gold", reqVal: 30, gold: 100, stones: 1 }
];