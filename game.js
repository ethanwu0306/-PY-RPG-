let player = {};
let defeatedCount = 0;
let maxReachedStage = 1;
let currentSelectedStage = 1;
let monster = {};
let shopEquips = [];
let shopSkills = [];
let currentForgeTab = 'warrior';
let currentArmorSubTab = 'chest';
let currentAchieveTab = 'stage';
let pendingSkillToLearn = null;
let villageNpcMsg = "";
let cardRefreshCount = 3;
let pendingVictoryData = null;
let isJobTrialBattle = false;
let isTowerBattle = false;
let currentTrialTier = 2;
let currentRandomEvent = null;
let currentJobTreeTab = 'Warrior';

function getItemName(item) { return item.nameZh; }
function getStageString(count) { return `${Math.min(Math.floor((count - 1) / 10) + 1, 10)}-${((count - 1) % 10) + 1}`; }

function getMaxExp(lvl) {
    return Math.floor(80 * Math.pow(1.15, lvl - 1));
}

function hideAll() { 
    ['main-menu', 'class-select', 'card-screen', 'battle-screen', 'defeat-screen', 'village-screen', 'stats-screen', 'forge-screen', 'enchant-screen', 'shop-screen', 'replace-skill-screen', 'achieve-screen', 'potion-select-screen', 'victory-modal-screen', 'equipment-screen', 'job-advance-screen', 'job-tree-screen', 'event-screen', 'map-select-screen', 'guide-screen'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    }); 
    let ruleBtn = document.getElementById('btn-corner-rules');
    if (ruleBtn) ruleBtn.classList.add('hidden');
}

function showMainMenu() { 
    hideAll(); 
    if (typeof setBattleBgm === "function") setBattleBgm(false);
    document.getElementById('main-menu').classList.remove('hidden'); 
    let ruleBtn = document.getElementById('btn-corner-rules');
    if (ruleBtn) ruleBtn.classList.remove('hidden');
    document.getElementById('btn-load').disabled = !localStorage.getItem(SAVE_KEY); 
}

function showClassSelect() { hideAll(); document.getElementById('class-select').classList.remove('hidden'); }

function initGame(jobCode) {
    let c = CLASSES[jobCode];
    player = {
        jobCode: jobCode, jobName: c.nameZh, baseJobCode: jobCode,
        level: 1, exp: 0, maxExp: getMaxExp(1),
        jobTier: 1,
        hp: c.hp, maxHp: c.hp, mp: c.mp, maxMp: c.mp, shield: 0,
        atkMin: c.min, atkMax: c.max, weapon: c.weaponZh,
        gold: 100, enchantStones: 0, villageActions: 5, maxVillageActions: 5, skills: ["重擊"], cards: [], 
        equips: [], refines: {}, pickaxeLvl: 0, refineStones: 0, shopRefreshCount: 0, restCount: 0, 
        
        towerFloor: 1,
        artifactFrags: 0,
        luciferFrags: 0,

        equipmentSlots: { helmet: null, chest: null, leggings: null, bracer1: null, bracer2: null, weapon: null },
        weaponEnchants: [], ores: { copper: 0, iron: 0, gold: 0, diamond: 0 },
        potions: { hp: 1, mp: 1 }, mineCount: 0, achieved: [],
        
        critRate: c.critRate, critDmg: c.critDmg, evasion: c.evasion,
        poisonRate: 0, burnRate: 0, freezeRate: 0,
        poisonRes: 0, burnRes: 0, frostRes: 0, darkRes: 0,
        
        skillCDs: {}, buffTurns: 0, debuffTurns: 0, isDefending: false
    };
    defeatedCount = 0;
    maxReachedStage = 1;
    currentSelectedStage = 1;
    isJobTrialBattle = false;
    isTowerBattle = false;
    startNextBattle();
}

function startNextBattle() {
    hideAll(); 
    isJobTrialBattle = false;
    isTowerBattle = false;

    if (currentSelectedStage % 10 !== 0 && Math.random() < 0.15) {
        triggerRandomEvent();
        return;
    }

    document.getElementById('battle-screen').classList.remove('hidden');
    if (typeof setBattleBgm === "function") setBattleBgm(true);
    spawnMonster();
}

function startTowerFloorChallenge() {
    hideAll();
    isJobTrialBattle = false;
    isTowerBattle = true;
    document.getElementById('battle-screen').classList.remove('hidden');
    if (typeof setBattleBgm === "function") setBattleBgm(true);

    let floor = player.towerFloor || 1;
    let isFloorBoss = (floor % 5 === 0);
    let towerHardMult = (floor >= 50) ? 2.5 : 1.5;

    monster = {
        name: isFloorBoss ? `👑 【試煉塔第 ${floor} 層守護 BOSS】` : `👹 【試煉塔第 ${floor} 層守衛】`,
        hp: Math.floor((1500 + floor * 260) * towerHardMult), maxHp: Math.floor((1500 + floor * 260) * towerHardMult),
        min: Math.floor((60 + floor * 15) * towerHardMult), max: Math.floor((90 + floor * 22) * towerHardMult),
        reward: 400 + floor * 50, expReward: 220 + floor * 30,
        isFinal: false, isBoss: isFloorBoss, mapId: Math.min(10, Math.floor(floor / 5) + 1),
        debuffTurns: 0, isRaged: false
    };

    drawAvatarAndMonsterVisuals(monster.mapId, isFloorBoss);
    document.getElementById('log-box').innerHTML = `🏰 進入試煉之塔第 ${floor} 層挑戰！\n`;
    player.shield = 0;
    player.skillCDs = {};
    player.isDefending = false;
    render4SkillButtons();
    updateBattleUI();
}

function triggerRandomEvent() {
    hideAll();
    let evt = RANDOM_EVENTS_DATABASE[Math.floor(Math.random() * RANDOM_EVENTS_DATABASE.length)];
    currentRandomEvent = evt;

    document.getElementById('event-screen').classList.remove('hidden');
    document.getElementById('event-description').innerHTML = `<b>${evt.title}</b><br><br>${evt.desc}`;

    let container = document.getElementById('event-choices-container');
    container.innerHTML = "";

    evt.choices.forEach(c => {
        let btn = document.createElement('button');
        btn.className = "btn";
        btn.style.margin = "6px 0";
        btn.innerText = c.text;
        btn.onclick = () => handleEventChoice(c.action);
        container.appendChild(btn);
    });
}

function handleEventChoice(action) {
    if (action === "drink_well") {
        if (Math.random() < 0.60) {
            player.hp = player.maxHp; player.mp = player.maxMp;
            alert("✨ 神清氣爽！神奇的井水為你將 HP 與 MP 全部恢復填滿！");
        } else {
            player.hp = Math.floor(player.hp * 0.80);
            alert("🤮 哎呀！井水似乎不太乾淨，肚子一陣絞痛扣除 20% 血量！強制進入戰鬥！");
            enterBattleAfterEvent();
            return;
        }
    } else if (action === "coin_well") {
        if (player.gold >= 20) {
            player.gold -= 20;
            player.enchantStones += 2;
            alert("🪙 投幣許願成功！井底泛起神奇光芒，獲得了 2 顆【附魔石】！");
        } else alert("❌ 金幣不足 20 G！");
    } else if (action === "open_chest") {
        if (player.villageActions > 0) {
            player.villageActions--;
            if (Math.random() < 0.80) {
                let gotGold = Math.floor(Math.random() * 201 + 200);
                player.gold += gotGold;
                player.refineStones = (player.refineStones || 0) + 1;
                alert(`🎉 撬開寶箱成功！獲得金幣 +${gotGold} G 以及 1 顆【精煉石】！`);
            } else {
                alert("😱 糟糕！寶箱竟是偽裝的【寶箱怪】！直接展開襲擊戰鬥！");
                enterBattleAfterEvent();
                return;
            }
        } else {
            alert("❌ 村莊行動力不足 1 點，無法撬開寶箱！");
            return;
        }
    } else if (action === "buy_bag") {
        if (player.gold >= 300) {
            player.gold -= 300;
            let rand = Math.random();
            if (rand < 0.01) {
                player.refineStones = (player.refineStones || 0) + 1;
                alert("🎉【超稀有幸運爆發！】福袋內隱藏著 1 顆璀璨的【精煉石】！");
            } else if (rand < 0.21) {
                let gotStones = Math.floor(Math.random() * 2 + 1);
                player.enchantStones += gotStones;
                alert(`🔮 拆開福袋獲得了 ${gotStones} 顆【附魔石】！`);
            } else {
                let gotGold = Math.floor(Math.random() * 101 + 150);
                player.gold += gotGold;
                alert(`🪙 拆開福袋獲得了少許金幣 +${gotGold} G！`);
            }
        } else alert("❌ 金幣不足 300 G！");
    } else if (action === "learn_swordsman") {
        if (player.gold >= 100) {
            player.gold -= 100;
            let gotExp = 150;
            player.exp += gotExp;
            alert(`⚔️ 受老劍客指點迷津，收穫頗豐！獲得 +${gotExp} EXP 經驗值！`);
        } else alert("❌ 金幣不足 100 G！");
    } else if (action === "fight_swordsman") {
        alert("⚔️ 老劍客拔出長劍：『好小子！來切磋一番！』");
        enterBattleAfterEvent();
        return;
    } else if (action === "pray_altar") {
        player.shield += 80;
        alert("✨ 得到祭壇聖光庇護！獲得 80 點開場護盾！");
    }

    enterBattleAfterEvent();
}

function enterBattleAfterEvent() {
    hideAll();
    document.getElementById('battle-screen').classList.remove('hidden');
    if (typeof setBattleBgm === "function") setBattleBgm(true);
    spawnMonster();
}

function spawnMonster() {
    let stageNum = currentSelectedStage;
    let curMapId = Math.min(Math.floor((stageNum - 1) / 10) + 1, 10);
    let isBoss = (stageNum % 10 === 0);
    let isFinal = (stageNum === 100);
    let mapData = (typeof MAPS !== "undefined" && MAPS[curMapId]) ? MAPS[curMapId] : { nameZh: "微光森林", bossZh: "區域頭目", monstersZh: ["哥布林斥候"] };

    let chapterHardMult = (stageNum >= 51) ? 1.8 : 1.0;

    if (isFinal) { 
        monster = { name: "👑 滅世魔王·路西法", hp: 12000, maxHp: 12000, min: 220, max: 320, reward: 5000, expReward: 2000, isFinal: true, mapId: 10, debuffTurns: 0, isRaged: false }; 
    } else if (isBoss) { 
        let reward = Math.floor(Math.random() * 31 + 80);
        monster = { name: `👑 ${mapData.bossZh}`, hp: Math.floor((900 + stageNum * 55) * chapterHardMult), maxHp: Math.floor((900 + stageNum * 55) * chapterHardMult), min: Math.floor((45 + curMapId * 15) * chapterHardMult), max: Math.floor((75 + curMapId * 20) * chapterHardMult), reward: reward, expReward: 200 + stageNum * 15, isFinal: false, mapId: curMapId, debuffTurns: 0, isRaged: false, isBoss: true }; 
    } else { 
        let reward = Math.floor(Math.random() * 11 + 40);
        let mName = mapData.monstersZh[Math.floor(Math.random() * mapData.monstersZh.length)];
        monster = { name: mName, hp: Math.floor((220 + stageNum * 38) * chapterHardMult), maxHp: Math.floor((220 + stageNum * 38) * chapterHardMult), min: Math.floor((20 + stageNum * 6) * chapterHardMult), max: Math.floor((35 + stageNum * 9) * chapterHardMult), reward: reward, expReward: 60 + stageNum * 8, isFinal: false, mapId: curMapId, debuffTurns: 0, isRaged: false }; 
    }

    drawAvatarAndMonsterVisuals(curMapId, isBoss || isFinal);
    document.getElementById('log-box').innerHTML = "戰鬥開始！\n";
    player.skillCDs = {};
    player.isDefending = false;
    render4SkillButtons();
    updateBattleUI();
}

function startJobAdvanceTrial() {
    hideAll();
    isJobTrialBattle = true;
    document.getElementById('battle-screen').classList.remove('hidden');
    if (typeof setBattleBgm === "function") setBattleBgm(true);

    let nextTier = (player.jobTier || 1) + 1;
    currentTrialTier = nextTier;

    let bossName = "";
    let bossHpMult = 1.2;

    if (nextTier === 2) {
        bossName = `👑 【鏡像分身】${player.jobName}之影`;
        bossHpMult = 1.2;
    } else if (nextTier === 3) {
        bossName = `👑 【古代守護者】試煉真身`;
        bossHpMult = 1.8;
    } else if (nextTier === 4) {
        bossName = `👑 【路西法分身】終極魔尊`;
        bossHpMult = 2.5;
    }

    monster = {
        name: bossName,
        hp: Math.floor(player.maxHp * bossHpMult), maxHp: Math.floor(player.maxHp * bossHpMult),
        min: Math.floor(player.atkMin * 1.1), max: Math.floor(player.atkMax * 1.1),
        critRate: player.critRate,
        reward: 1000, expReward: 800,
        isFinal: false, isBoss: true, mapId: nextTier * 2, debuffTurns: 0, isRaged: false
    };

    drawAvatarAndMonsterVisuals(nextTier * 2, true);
    document.getElementById('log-box').innerHTML = `⚔️ 進入 ${nextTier} 階轉職試煉戰！擊敗【${bossName}】以完成超越突破！\n`;
    player.shield = 0;
    player.skillCDs = {};
    player.isDefending = false;
    render4SkillButtons();
    updateBattleUI();
}

function drawAvatarAndMonsterVisuals(mapId, isBoss) {
    let pCanvas = document.getElementById('player-avatar-canvas');
    if (pCanvas) {
        let ctx = pCanvas.getContext('2d');
        ctx.clearRect(0, 0, 120, 120);
        
        ctx.fillStyle = player.baseJobCode === 'Warrior' ? '#e74c3c' : (player.baseJobCode === 'Mage' ? '#9b59b6' : '#2ecc71');
        ctx.beginPath(); ctx.arc(60, 45, 25, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(40, 70, 40, 40);
        
        ctx.fillStyle = '#f1c40f';
        if (player.baseJobCode === 'Warrior') { ctx.fillRect(80, 50, 20, 5); ctx.fillRect(20, 60, 15, 25); }
        else if (player.baseJobCode === 'Mage') { ctx.fillRect(85, 30, 6, 60); ctx.fillStyle='#00ffff'; ctx.beginPath(); ctx.arc(88, 25, 8, 0, Math.PI*2); ctx.fill(); }
        else if (player.baseJobCode === 'Archer') { ctx.strokeStyle='#d35400'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(80, 70, 20, -Math.PI/2, Math.PI/2); ctx.stroke(); }
    }

    let mCanvas = document.getElementById('monster-canvas');
    if (mCanvas) {
        let ctx = mCanvas.getContext('2d');
        ctx.clearRect(0, 0, 120, 120);
        let mColor = isBoss ? '#f39c12' : '#e74c3c';
        ctx.fillStyle = mColor;
        ctx.beginPath(); ctx.arc(60, 60, isBoss ? 35 : 25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.fillRect(48, 50, 8, 8); ctx.fillRect(64, 50, 8, 8);
    }
}

function checkBloodDanger() {
    let container = document.getElementById('game-container');
    if (player.hp > 0 && (player.hp / player.maxHp) <= 0.10) {
        container.classList.add('blood-danger');
    } else {
        container.classList.remove('blood-danger');
    }
}

function spawnFloatingText(text, type) {
    let container = document.getElementById('floating-text-container');
    if (!container) return;
    let div = document.createElement('div');
    div.className = `float-num ${type}`;
    div.innerText = text;
    container.appendChild(div);
    setTimeout(() => div.remove(), 800);
}

function triggerScreenShake() {
    let container = document.getElementById('game-container');
    container.classList.add('shake-anim');
    setTimeout(() => container.classList.remove('shake-anim'), 250);
}

function updateBattleUI() {
    let mapObj = (typeof MAPS !== "undefined" && MAPS[monster.mapId]) ? MAPS[monster.mapId] : { nameZh: "荒野" };
    let weaknessZh = { flame: "🔥火", frost: "❄️冰", thunder: "⚡雷", gale: "🍃風" }[mapObj.weakness] || "無";

    let titleText = `區域: ${getStageString(currentSelectedStage)} ${mapObj.nameZh}`;
    if (isJobTrialBattle) titleText = `👑 ${currentTrialTier} 階轉職試煉戰`;
    else if (isTowerBattle) titleText = `🏰 試煉之塔第 ${player.towerFloor || 1} 層`;

    document.getElementById('map-info').innerText = `${titleText} (弱點: ${weaknessZh})`;
    
    let buffStr = player.buffTurns > 0 ? `狂暴中 (${player.buffTurns}T)` : "無";
    if (player.isDefending) buffStr += " | 防禦防護中";

    let pHpPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    let pMpPct = Math.max(0, Math.min(100, (player.mp / player.maxMp) * 100));
    let pExpPct = Math.max(0, Math.min(100, (player.exp / player.maxExp) * 100));
    let mHpPct = Math.max(0, Math.min(100, (monster.hp / monster.maxHp) * 100));

    let pHpBar = document.getElementById('player-hp-bar'); if(pHpBar) pHpBar.style.width = pHpPct + "%";
    let pMpBar = document.getElementById('player-mp-bar'); if(pMpBar) pMpBar.style.width = pMpPct + "%";
    let pExpBar = document.getElementById('player-exp-bar'); if(pExpBar) pExpBar.style.width = pExpPct + "%";
    let mHpBar = document.getElementById('monster-hp-bar'); if(mHpBar) mHpBar.style.width = mHpPct + "%";

    document.getElementById('player-status-text').innerText = `Lv.${player.level} 【${player.jobName}】HP: ${player.hp}/${player.maxHp} | MP: ${player.mp}/${player.maxMp}`;
    
    let rageTag = monster.isRaged ? " 🔥【二階段狂暴化！】" : "";
    document.getElementById('monster-status-text').innerText = `【${monster.name}】HP: ${monster.hp}/${monster.maxHp}${rageTag}`;
    
    let encStr = (player.weaponEnchants && player.weaponEnchants.length > 0) ? player.weaponEnchants.join(' + ') : "無附魔";
    document.getElementById('buff-status').innerText = `武器: [${player.weapon}] (${encStr})\nBUFF: ${buffStr} | 卡片: ${player.cards.length > 0 ? player.cards.join(', ') : '無'}`;
    
    let mDebuffTxt = monster.debuffTurns > 0 ? `⚠️ 怪物負面狀態: 衰弱/流血 (${monster.debuffTurns}T)` : "";
    document.getElementById('monster-debuff-status').innerText = mDebuffTxt;

    checkBloodDanger();
}

function render4SkillButtons() {
    let container = document.getElementById('skill-buttons-container');
    container.innerHTML = "";
    for (let i = 0; i < 4; i++) {
        let btn = document.createElement('button');
        btn.className = "btn-skill";
        if (i < player.skills.length) {
            let sKey = player.skills[i];
            let sInfo = SKILLS[sKey] || { mp: 10, cd: 0 };
            let cdRem = player.skillCDs[sKey] || 0;
            
            if (cdRem > 0) {
                btn.innerText = `⏳ ${sKey}\n(CD: ${cdRem}T)`;
                btn.disabled = true;
            } else {
                btn.innerText = `✨ ${sKey}\n(${sInfo.mp} MP)`;
                btn.onclick = () => useSpecificSkill(sKey);
            }
        } else {
            btn.innerText = `[空格 ${i+1}]`;
            btn.disabled = true;
        }
        container.appendChild(btn);
    }
}

function log(msg, styleClass) {
    let box = document.getElementById('log-box');
    if (styleClass) box.innerHTML += `<span class="${styleClass}">${msg}</span>\n`;
    else box.innerHTML += msg + "\n";
    box.scrollTop = box.scrollHeight;
}

function playerAttack() { executeTurn(null, false); }
function playerDefend() { executeTurn(null, true); }
function useSpecificSkill(sKey) { executeTurn(sKey, false); }

function showInBattlePotions() {
    hideAll();
    document.getElementById('potion-select-screen').classList.remove('hidden');
    document.getElementById('potion-select-status').innerText = `🧪 生命藥水: ${player.potions.hp} 瓶\n🧪 魔力藥水: ${player.potions.mp} 瓶`;
    document.getElementById('btn-use-hp-pot').disabled = (player.potions.hp <= 0);
    document.getElementById('btn-use-mp-pot').disabled = (player.potions.mp <= 0);
}

function cancelPotionSelect() {
    hideAll();
    document.getElementById('battle-screen').classList.remove('hidden');
}

function useBattlePotion(type) {
    let p = player;
    if (type === 'hp' && p.potions.hp > 0) {
        p.potions.hp--; p.hp = Math.min(p.maxHp, p.hp + 100);
        if (typeof playSound === "function") playSound('heal', p.jobCode);
        spawnFloatingText("+100 HP", "heal");
        cancelPotionSelect();
        log("❇️ 使用了生命藥水，恢復 100 HP！", "log-heal");
    } else if (type === 'mp' && p.potions.mp > 0) {
        p.potions.mp--; p.mp = Math.min(p.maxMp, p.mp + 50);
        if (typeof playSound === "function") playSound('heal', p.jobCode);
        spawnFloatingText("+50 MP", "heal");
        cancelPotionSelect();
        log("❇️ 使用了魔力藥水，恢復 50 MP！", "log-heal");
    }
    updateBattleUI();
}

function executeTurn(skillKey, isDefendingAction) {
    if (player.hp <= 0) return;

    Object.keys(player.skillCDs).forEach(k => {
        if (player.skillCDs[k] > 0) player.skillCDs[k]--;
    });
    if (player.buffTurns > 0) player.buffTurns--;

    player.isDefending = isDefendingAction;

    let dealtDmg = 0;
    let isCrit = Math.random() < (player.critRate / 100);
    let mapObj = (typeof MAPS !== "undefined" && MAPS[monster.mapId]) ? MAPS[monster.mapId] : {};

    if (isDefendingAction) {
        player.mp = Math.min(player.maxMp, player.mp + 15);
        log("🛡️ 進入防禦防護狀態！傷害減半並恢復 15 MP！", "log-skill");
        spawnFloatingText("防禦", "heal");
    } else if (skillKey) {
        let sInfo = SKILLS[skillKey];
        if (player.mp < sInfo.mp) { log("❌ MP 不足！"); return; }
        player.mp -= sInfo.mp;
        
        if (sInfo.cd > 0) player.skillCDs[skillKey] = sInfo.cd;

        dealtDmg = Math.floor(randomAtk() * (sInfo.mult || 1.5));
        
        let isCounter = (sInfo.elem && sInfo.elem === mapObj.weakness);
        if (isCounter) dealtDmg = Math.floor(dealtDmg * 1.5);

        if (player.buffTurns > 0) dealtDmg = Math.floor(dealtDmg * 1.25);
        if (isCrit) dealtDmg = Math.floor(dealtDmg * (player.critDmg / 100));
        
        if (sInfo.shield) player.shield += sInfo.shield;
        if (sInfo.buffTurn) player.buffTurns = sInfo.buffTurn;
        if (sInfo.debuffTurn) monster.debuffTurns = sInfo.debuffTurn;

        monster.hp -= dealtDmg;
        if (typeof playSound === "function") playSound('skill', player.jobCode);
        triggerScreenShake();
        
        let tag = isCounter ? "克制 " : (isCrit ? "💥 " : "");
        spawnFloatingText(tag + dealtDmg, isCrit ? "crit" : "normal");

        let counterMsg = isCounter ? " 【屬性克制 1.5倍！】" : "";
        log((isCrit ? "⚡【暴擊！】" : "") + `施展【${skillKey}】，對敵人造成 ${dealtDmg} 點傷害！` + counterMsg, isCrit ? "log-crit" : "log-skill");
    } else {
        dealtDmg = randomAtk();
        if (player.buffTurns > 0) dealtDmg = Math.floor(dealtDmg * 1.25);
        if (isCrit) dealtDmg = Math.floor(dealtDmg * (player.critDmg / 100));
        
        monster.hp -= dealtDmg;
        if (typeof playSound === "function") playSound('hit', player.jobCode);
        triggerScreenShake();
        spawnFloatingText((isCrit ? "💥 " : "") + dealtDmg, isCrit ? "crit" : "normal");
        log((isCrit ? "⚡【暴擊！】" : "") + `使用 [${player.weapon}] 攻擊，造成 ${dealtDmg} 點傷害！`, isCrit ? "log-crit" : "");
    }

    if ((monster.isBoss || monster.isFinal) && !monster.isRaged && (monster.hp / monster.maxHp) <= 0.30 && monster.hp > 0) {
        monster.isRaged = true;
        monster.min = Math.floor(monster.min * 1.4);
        monster.max = Math.floor(monster.max * 1.4);
        log("🔥【警告】BOSS 血量低於 30%，進入二階段狂暴狀態！攻擊力大幅提升！", "log-crit");
        spawnFloatingText("狂暴化!", "crit");
    }

    if (monster.debuffTurns > 0) {
        let dotDmg = 15;
        monster.hp -= dotDmg;
        monster.debuffTurns--;
        spawnFloatingText(`☠️ ${dotDmg}`, "debuff");
        log(`☠️ 怪物受到持續流血/毒傷，扣除 ${dotDmg} 點 HP！`, "log-dmg");
    }

    render4SkillButtons();
    updateBattleUI();

    if (monster.hp <= 0) {
        if (typeof playSound === "function") playSound('victory', player.jobCode);
        
        let isOldStage = (!isTowerBattle && currentSelectedStage < maxReachedStage);
        let rewardMult = isOldStage ? 0.50 : 1.0;

        let expGained = Math.floor((monster.expReward || 50) * rewardMult);
        let goldGained = Math.floor(monster.reward * rewardMult);

        player.exp += expGained;
        player.gold = (Number(player.gold) || 0) + goldGained;

        let extraRewardMsg = "";

        if (isTowerBattle) {
            let curFloor = player.towerFloor || 1;
            
            if (curFloor >= 50 && Math.random() < 0.30) {
                player.luciferFrags = (player.luciferFrags || 0) + 1;
                extraRewardMsg += "<br><span style='color:#e74c3c;'>👑 幸運掉落了 1 顆【路西法碎片】！</span>";
            }

            if (curFloor % 5 === 0) {
                player.artifactFrags = (player.artifactFrags || 0) + 1;
                extraRewardMsg += "<br><span style='color:#a29bfe; font-weight:bold;'>🧩 突破第 " + curFloor + " 層！獲得 1 顆【神器碎片】！</span>";
            }

            player.towerFloor = curFloor + 1;
        } else if (currentSelectedStage === maxReachedStage) {
            maxReachedStage++;
            currentSelectedStage = maxReachedStage;
        }

        let levelUpMsg = "";
        while (player.exp >= player.maxExp && player.level < 100) {
            player.exp -= player.maxExp;
            player.level++;
            player.maxExp = getMaxExp(player.level);
            player.maxHp += 25; player.hp = player.maxHp;
            player.maxMp += 12; player.mp = player.maxMp;
            player.atkMin += 5; player.atkMax += 8;
            levelUpMsg += `<br><span style="color:#f1c40f; font-weight:bold;">🎉 等級提升至 Lv.${player.level}！基礎屬性大幅增加！</span>`;
        }

        let gotStone = Math.random() < 0.10;
        if (gotStone) player.enchantStones++;

        if (isJobTrialBattle) {
            showJobAdvanceSelectScreen();
        } else {
            let oldStageMsg = isOldStage ? " <span style='color:#e67e22;'>(舊關卡收益 50%)</span>" : "";
            showVictoryModal(monster.name, goldGained, expGained, gotStone, levelUpMsg + oldStageMsg + extraRewardMsg);
        }
        return;
    }

    if (Math.random() < (player.evasion / 100)) {
        log(`🌀 成功閃避了 ${monster.name} 的攻擊！`, "log-heal");
        spawnFloatingText("Miss", "heal");
        updateBattleUI();
        return;
    }

    let enemyActionRand = Math.random();
    let mDmg = 0;

    if (isJobTrialBattle && enemyActionRand < 0.40 && player.skills.length > 0) {
        let randSkillKey = player.skills[Math.floor(Math.random() * player.skills.length)];
        let sInfo = SKILLS[randSkillKey] || { mult: 1.5 };
        mDmg = Math.floor(randomAtk() * (sInfo.mult || 1.5));
        if (player.isDefending) mDmg = Math.floor(mDmg * 0.5);
        player.hp -= mDmg;
        log(`⚡ 【試煉BOSS】複製並施展了你的【${randSkillKey}】，造成 ${mDmg} 點試煉傷害！`, "log-crit");
    } else {
        mDmg = Math.floor(Math.random() * (monster.max - monster.min + 1) + monster.min);
        if (player.isDefending) mDmg = Math.floor(mDmg * 0.5);

        if (enemyActionRand < 0.15) {
            mDmg = Math.floor(mDmg * 1.5);
            if (player.isDefending) mDmg = Math.floor(mDmg * 0.5);
            player.hp -= mDmg;
            log(`🩸 ${monster.name} 施展【猛烈重擊】，造成 ${mDmg} 點傷害！`, "log-crit");
        } else {
            player.hp -= mDmg;
            log(`🩸 ${monster.name} 反擊，造成 ${mDmg} 點傷害`, "log-dmg");
        }
    }

    if (player.hp <= 0) {
        player.hp = 0;
        updateBattleUI();
        hideAll();
        document.getElementById('defeat-screen').classList.remove('hidden');
        return;
    }
    updateBattleUI();
}

function showVictoryModal(mName, rewardGold, expGained, gotStone, levelUpMsg) {
    hideAll();
    pendingVictoryData = { gotStone: gotStone };
    let content = document.getElementById('victory-modal-content');
    let stoneMsg = gotStone ? "<br><span style='color:#70a1ff;'>💎 幸運額外獲得了 1 顆【附魔石】！</span>" : "";
    content.innerHTML = `⚔️ 成功擊敗了 <b>${mName}</b>！<br>🪙 獲得金幣：<b>+${rewardGold} G</b> | ⭐ 獲得 EXP：<b>+${expGained}</b>${stoneMsg}${levelUpMsg}`;
    document.getElementById('victory-modal-screen').classList.remove('hidden');
}

function showJobAdvanceSelectScreen() {
    hideAll();
    document.getElementById('job-advance-screen').classList.remove('hidden');
    let container = document.getElementById('job-advance-options');
    container.innerHTML = "";

    let jobTree = JOB_ADVANCEMENTS[player.baseJobCode] || {};
    let targetTier = (player.jobTier || 1) + 1;
    let options = [];

    if (targetTier === 2) {
        options = jobTree.tier2 || [];
    } else if (targetTier === 3) {
        options = (jobTree.tier3 || {})[player.jobName] || [];
    } else if (targetTier === 4) {
        options = (jobTree.tier4 || {})[player.jobName] || [];
    }

    options.forEach(opt => {
        let btn = document.createElement('button');
        btn.className = "btn";
        btn.style.margin = "8px 0";
        btn.innerHTML = `<b>${opt.nameZh}</b><br><span style="font-size:12px; color:#ccc;">${opt.descZh}</span>`;
        btn.onclick = () => selectJobAdvancement(opt);
        container.appendChild(btn);
    });
}

function selectJobAdvancement(advOption) {
    player.jobTier = advOption.tier;
    player.advancedJobId = advOption.id;
    player.jobName = advOption.nameZh;

    player.maxHp += advOption.hp; player.hp += advOption.hp;
    player.maxMp += advOption.mp; player.mp += advOption.mp;
    player.atkMin += advOption.atk; player.atkMax += advOption.atk;
    player.critRate += advOption.critRate;
    player.critDmg += advOption.critDmg;
    player.evasion += advOption.evasion;

    alert(`🎉 轉職成功！恭喜突破至 ${advOption.tier} 階職業【${advOption.nameZh}】！獲得極致屬性加成！`);
    enterVillage();
}

function confirmVictoryModal() {
    hideAll();
    if (!isTowerBattle && currentSelectedStage % 10 === 0) {
        cardRefreshCount = 3;
        showCardSelect();
    } else {
        enterVillage();
    }
}

function retryBattle() { 
    player.hp = Math.floor(player.maxHp * 0.50); 
    player.mp = Math.floor(player.maxMp * 0.50); 
    hideAll(); 
    document.getElementById('battle-screen').classList.remove('hidden'); 
    spawnMonster(); 
}

function fallbackStage() { 
    if (currentSelectedStage > 1) currentSelectedStage--; 
    player.hp = Math.floor(player.maxHp * 0.50); 
    player.mp = Math.floor(player.maxMp * 0.50); 
    enterVillage(); 
}

function randomAtk() { return Math.floor(Math.random() * (player.atkMax - player.atkMin + 1) + player.atkMin); }

function showMapSelectScreen() {
    hideAll();
    document.getElementById('map-select-screen').classList.remove('hidden');
    let container = document.getElementById('map-stages-list');
    container.innerHTML = "";

    for (let stg = 1; stg <= maxReachedStage; stg++) {
        let curMapId = Math.min(Math.floor((stg - 1) / 10) + 1, 10);
        let mapObj = MAPS[curMapId] || { nameZh: "荒野" };
        let isCurrentMax = (stg === maxReachedStage);
        
        let btn = document.createElement('button');
        btn.className = "btn";
        btn.style.margin = "4px 0";
        btn.style.fontSize = "12px";

        if (isCurrentMax) {
            btn.innerText = `⚔️ [當前進度] 關卡 ${getStageString(stg)} - ${mapObj.nameZh}`;
            btn.style.background = "linear-gradient(180deg, #d35400 0%, #7e3200 100%)";
        } else {
            btn.innerText = `🔁 [已通關 收益50%] 關卡 ${getStageString(stg)} - ${mapObj.nameZh}`;
            btn.style.background = "linear-gradient(180deg, #1f3a60 0%, #0d1f38 100%)";
        }

        btn.onclick = () => {
            currentSelectedStage = stg;
            alert(`🗺️ 飛躍關卡成功！準備進入【關卡 ${getStageString(stg)}】！`);
            startNextBattle();
        };
        container.appendChild(btn);
    }
}

function showCardSelect() {
    hideAll(); 
    if (typeof setBattleBgm === "function") setBattleBgm(false);
    document.getElementById('card-screen').classList.remove('hidden'); 
    renderCardOptions();
}

function renderCardOptions() {
    let container = document.getElementById('card-list'); container.innerHTML = "";
    let available = CARDS_DATABASE.filter(c => !player.cards.includes(c.id)); 
    let shuffled = available.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    shuffled.forEach(card => {
        let btn = document.createElement('button'); btn.className = "btn btn-card";
        btn.innerHTML = `<b>${card.nameZh}</b><br><span style="font-size:12px; color:#ccc;">${card.descZh}</span>`;
        btn.onclick = () => { player.cards.push(card.nameZh); enterVillage(); };
        container.appendChild(btn);
    });

    let refBtn = document.getElementById('btn-refresh-card');
    refBtn.innerText = `🔄 刷新卡片 (消耗 1 顆附魔石 | 剩餘 ${cardRefreshCount}/3 次)`;
    refBtn.disabled = (player.enchantStones < 1 || cardRefreshCount <= 0);
}

function refreshCardSelection() {
    if (player.enchantStones >= 1 && cardRefreshCount > 0) {
        player.enchantStones--;
        cardRefreshCount--;
        renderCardOptions();
        alert(`🔮 已消耗 1 顆附魔石刷新卡片！剩餘刷新次數: ${cardRefreshCount}/3`);
    } else {
        alert("❌ 附魔石不足或刷新次數已用盡！");
    }
}

function rollRandomSkills() {
    let unlearnedKeys = Object.keys(SKILLS).filter(sKey => !player.skills.includes(sKey));
    let shuffled = unlearnedKeys.sort(() => 0.5 - Math.random());
    shopSkills = shuffled.slice(0, 3);
}

function rollRandomEquipShop() {
    let normalShopPool = ALL_EQUIPS_POOL.filter(eq => eq.tier !== 'adv');
    shopEquips = normalShopPool.sort(() => 0.5 - Math.random()).slice(0, 5);
}

function enterVillage() {
    player.villageActions = 5;
    rollRandomEquipShop();
    rollRandomSkills();

    if (Math.random() < 0.50) {
        let bonusGold = Math.floor(Math.random() * 21 + 80);
        player.gold = (Number(player.gold) || 0) + bonusGold;
        villageNpcMsg = `🙋‍♂️ 遇到了熱心的村莊居民，獲得了 ${bonusGold} 金幣資助！`;
    } else villageNpcMsg = "";

    showVillage();
}

function showVillage() {
    hideAll(); 
    if (typeof setBattleBgm === "function") setBattleBgm(false);
    document.getElementById('village-screen').classList.remove('hidden');
    let curMapId = Math.min(Math.floor((currentSelectedStage - 1) / 10) + 1, 10);
    let mapObj = (typeof MAPS !== "undefined" && MAPS[curMapId]) ? MAPS[curMapId] : { villageZh: "村莊" };
    document.getElementById('village-title').innerText = `🏡 區域 ${curMapId}: ${mapObj.villageZh}`;
    
    let trialBtn = document.getElementById('btn-job-trial');
    if (trialBtn) {
        let curTier = player.jobTier || 1;
        let maxStg = maxReachedStage || 1;

        if (curTier === 1 && player.level >= 20) {
            trialBtn.classList.remove('hidden');
            trialBtn.innerText = "👑 挑戰【2階轉職試煉 BOSS (鏡像分身)】";
        } else if (curTier === 2 && player.level >= 50 && maxStg >= 50) {
            trialBtn.classList.remove('hidden');
            trialBtn.innerText = "👑 挑戰【3階轉職試煉 BOSS (古代守護者)】";
        } else if (curTier === 3 && player.level >= 70 && maxStg >= 80) {
            trialBtn.classList.remove('hidden');
            trialBtn.innerText = "👑 挑戰【4階轉職試煉 BOSS (路西法分身)】";
        } else {
            trialBtn.classList.add('hidden');
        }
    }

    let towerBtn = document.getElementById('btn-tower-enter');
    if (towerBtn) {
        if ((maxReachedStage || 1) >= 50) {
            towerBtn.classList.remove('hidden');
            towerBtn.innerText = `🏰 進入【試煉之塔】(目前最高第 ${player.towerFloor || 1} 層)`;
        } else {
            towerBtn.classList.add('hidden');
        }
    }

    let npcBox = document.getElementById('npc-event-box');
    if (villageNpcMsg) { npcBox.innerText = villageNpcMsg; npcBox.style.display = "block"; } else npcBox.style.display = "none";
    updateVillageUI();
}

function updateVillageUI() {
    let act = player.villageActions;
    let pLvl = player.pickaxeLvl || 0;
    
    if (typeof player.gold !== "number" || isNaN(player.gold)) {
        player.gold = 100;
    }

    document.getElementById('village-status').innerText = `Lv.${player.level || 1} 【${player.jobName}】 (${player.jobTier || 1}階) | EXP: ${player.exp}/${player.maxExp}\n金幣: ${player.gold} G | 💎 附魔石: ${player.enchantStones} | 精煉石: ${player.refineStones || 0}\n🧩 神器碎片: ${player.artifactFrags || 0} | 👑 路西法碎片: ${player.luciferFrags || 0}\nHP: ${player.hp}/${player.maxHp} | MP: ${player.mp}/${player.maxMp} | ⚡ 行動力: ${act}/5\n⛏️ 採礦鎬子等級: +${pLvl}`;

    document.getElementById('btn-v-rest').disabled = (player.gold < 30 || act <= 0);
    
    let btnMine = document.getElementById('btn-mine');
    btnMine.innerText = act <= 0 ? "⚡ 行動力耗盡" : "⚡ 礦坑採礦";
    btnMine.disabled = (act <= 0);

    document.getElementById('btn-v-forge').disabled = (act <= 0);
    document.getElementById('btn-v-magic').disabled = (act <= 0);
    
    checkBloodDanger();
}

function showJobTree(jobKey) {
    hideAll();
    document.getElementById('job-tree-screen').classList.remove('hidden');
    if (jobKey) currentJobTreeTab = jobKey;
    renderJobTreeUI();
}

function switchJobTreeTab(jobKey) {
    currentJobTreeTab = jobKey;
    renderJobTreeUI();
}

function renderJobTreeUI() {
    let container = document.getElementById('job-tree-content');
    let tree = JOB_ADVANCEMENTS[currentJobTreeTab];
    let baseClass = CLASSES[currentJobTreeTab];

    if (!tree || !baseClass) return;

    let html = `
        <div style="display:flex; gap:4px; margin-bottom:12px;">
            <button class="btn btn-tab" style="${currentJobTreeTab==='Warrior'?'background:#c0392b; border-color:#f1c40f;':''}" onclick="switchJobTreeTab('Warrior')">⚔️ 戰士體系</button>
            <button class="btn btn-tab" style="${currentJobTreeTab==='Mage'?'background:#8e44ad; border-color:#f1c40f;':''}" onclick="switchJobTreeTab('Mage')">🔮 法師體系</button>
            <button class="btn btn-tab" style="${currentJobTreeTab==='Archer'?'background:#27ae60; border-color:#f1c40f;':''}" onclick="switchJobTreeTab('Archer')">🏹 射手體系</button>
        </div>

        <div style="background:#161224; border:1px solid #d4af37; border-radius:8px; padding:10px; margin-bottom:10px;">
            <div style="color:#f1c40f; font-weight:bold; font-size:14px; border-bottom:1px solid #33270d; padding-bottom:4px; margin-bottom:8px;">
                1階初始職業：【${baseClass.nameZh}】
            </div>
            <div style="font-size:11px; color:#aaa;">
                初始屬性：HP ${baseClass.hp} | MP ${baseClass.mp} | 攻擊 ${baseClass.min}~${baseClass.max} | 暴擊 ${baseClass.critRate}%
            </div>
        </div>
    `;

    tree.tier2.forEach(adv2 => {
        html += `
        <div style="background:#231a10; border:1px solid #e67e22; border-radius:8px; padding:10px; margin-bottom:12px;">
            <div style="color:#e67e22; font-weight:bold; font-size:13px;">
                ➔ 2階轉職：【${adv2.nameZh}】 <span style="font-size:10px; color:#f1c40f;">(Lv.20 解鎖試煉)</span>
            </div>
            <div style="font-size:11px; color:#ccc; margin:3px 0;">${adv2.descZh}</div>
            <div style="font-size:10px; color:#2ecc71;">加成：HP+${adv2.hp} | MP+${adv2.mp} | 攻擊+${adv2.atk} | 暴擊+${adv2.critRate}% | 暴傷+${adv2.critDmg}%</div>
            
            <div style="margin-top:8px; padding-left:10px; border-left:2px solid #3498db;">
        `;

        let t3List = (tree.tier3 || {})[adv2.nameZh] || [];
        t3List.forEach(adv3 => {
            html += `
                <div style="background:#0f2232; border:1px solid #3498db; border-radius:6px; padding:8px; margin:6px 0;">
                    <div style="color:#3498db; font-weight:bold; font-size:12px;">
                        ➔ 3階進階：【${adv3.nameZh}】 <span style="font-size:10px; color:#aaa;">(Lv.50 + 通過第5章)</span>
                    </div>
                    <div style="font-size:11px; color:#ccc; margin:2px 0;">${adv3.descZh}</div>
                    <div style="font-size:10px; color:#2ecc71;">加成：HP+${adv3.hp} | MP+${adv3.mp} | 攻擊+${adv3.atk} | 暴擊+${adv3.critRate}%</div>

                    <div style="margin-top:6px; padding-left:10px; border-left:2px solid #9b59b6;">
            `;

            let t4List = (tree.tier4 || {})[adv3.nameZh] || [];
            t4List.forEach(adv4 => {
                html += `
                        <div style="background:#220e2e; border:1px solid #9b59b6; border-radius:6px; padding:6px; margin:4px 0;">
                            <div style="color:#9b59b6; font-weight:bold; font-size:12px;">
                                👑 4階終極：【${adv4.nameZh}】 <span style="font-size:10px; color:#f1c40f;">(Lv.70 + 通過第8章)</span>
                            </div>
                            <div style="font-size:11px; color:#ccc; margin:2px 0;">${adv4.descZh}</div>
                            <div style="font-size:10px; color:#2ecc71;">加成：HP+${adv4.hp} | MP+${adv4.mp} | 攻擊+${adv4.atk} | 暴擊+${adv4.critRate}% | 暴傷+${adv4.critDmg}%</div>
                        </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

function showPlayerStats() {
    hideAll(); 
    document.getElementById('stats-screen').classList.remove('hidden');
    let p = player;
    let encStr = (p.weaponEnchants && p.weaponEnchants.length > 0) ? p.weaponEnchants.join(' + ') : "無附魔";
    let cardStr = p.cards.length > 0 ? p.cards.join(', ') : "無";
    let skillStr = p.skills.join(', ');

    let html = `
        <b>【等級: Lv.${p.level || 1}】</b> (EXP: ${p.exp} / ${p.maxExp})<br>
        <b>【職業: ${p.jobName}】</b> <span style="color:#2ecc71;">[${p.jobTier || 1}階職業]</span><br>
        金幣: ${p.gold} G | 💎 附魔石: ${p.enchantStones} | 精煉石: ${p.refineStones || 0}<br>
        🧩 神器碎片: <b>${p.artifactFrags || 0}</b> 顆 | 👑 路西法碎片: <b>${p.luciferFrags || 0}</b> 顆<br>
        ⛏️ 採礦鎬子強化等級: <b>+${p.pickaxeLvl || 0}</b><br>
        當前武器: <b>[${p.equipmentSlots.weapon || p.weapon}]</b> (${encStr})<br>
        當前頭盔: <b>[${p.equipmentSlots.helmet || '無'}]</b> | 當前胸甲: <b>[${p.equipmentSlots.chest || '無'}]</b><br>
        當前腿甲: <b>[${p.equipmentSlots.leggings || '無'}]</b> | 手腕1/2: <b>[${p.equipmentSlots.bracer1 || '無'}] / [${p.equipmentSlots.bracer2 || '無'}]</b><br><br>
        <b>⚔️ 戰鬥面板屬性：</b><br>
        ❤️ HP: ${p.hp} / ${p.maxHp} | 💧 MP: ${p.mp} / ${p.maxMp}<br>
        🗡️ 攻擊力: ${p.atkMin} ~ ${p.atkMax}<br>
        ⚡ 暴擊率: ${p.critRate}% | 💥 暴擊傷害: ${p.critDmg}% | 🌀 閃避率: ${p.evasion}%<br><br>
        技能: ${skillStr}<br>
        卡片: ${cardStr}
    `;
    document.getElementById('stats-content').innerHTML = html;
}

function showEquipmentScreen() {
    hideAll();
    document.getElementById('equipment-screen').classList.remove('hidden');
    updateEquipmentUI();
}

function updateEquipmentUI() {
    let slots = player.equipmentSlots;
    let summaryBox = document.getElementById('equipped-slots-summary');
    
    summaryBox.innerHTML = `
        <b>目前穿戴裝備欄位狀態：</b><br>
        <b>[頭盔]</b>：${slots.helmet ? `<b>${slots.helmet}</b> <button onclick="unequipSlot('helmet')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : '<span style="color:#888;">[空位]</span>'}<br>
        <b>[胸甲]</b>：${slots.chest ? `<b>${slots.chest}</b> <button onclick="unequipSlot('chest')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : '<span style="color:#888;">[空位]</span>'}<br>
        <b>[腿甲]</b>：${slots.leggings ? `<b>${slots.leggings}</b> <button onclick="unequipSlot('leggings')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : '<span style="color:#888;">[空位]</span>'}<br>
        <b>[手腕 1]</b>：${slots.bracer1 ? `<b>${slots.bracer1}</b> <button onclick="unequipSlot('bracer1')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : '<span style="color:#888;">[空位]</span>'}<br>
        <b>[手腕 2]</b>：${slots.bracer2 ? `<b>${slots.bracer2}</b> <button onclick="unequipSlot('bracer2')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : '<span style="color:#888;">[空位]</span>'}<br>
        <b>[武器]</b>：${slots.weapon ? `<b>${slots.weapon}</b> <button onclick="unequipSlot('weapon')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : `<span style="color:#888;">[基本預設: ${player.weapon}]</span>`}
    `;

    renderEquipmentBagList();
}

function renderEquipmentBagList() {
    let container = document.getElementById('equipment-bag-list');
    container.innerHTML = "";

    if (!player.equips || player.equips.length === 0) {
        container.innerHTML = "<p style='color:#888; text-align:center;'>背包目前沒有備用裝備</p>";
        return;
    }

    player.equips.forEach((eqName) => {
        let isEquipped = Object.values(player.equipmentSlots).includes(eqName);
        let refineLvl = player.refines[eqName] || 0;
        let refineTag = refineLvl > 0 ? ` (+${refineLvl})` : "";
        let btn = document.createElement('button');
        btn.className = "btn";
        btn.style.fontSize = "12px";
        btn.style.margin = "4px 0";

        if (isEquipped) {
            btn.innerText = `✔ [使用中] ${eqName}${refineTag}`;
            btn.disabled = true;
        } else {
            btn.innerText = `✨ [裝備] ${eqName}${refineTag}`;
            btn.onclick = () => equipItemToSlot(eqName);
        }
        container.appendChild(btn);
    });
}

function equipItemToSlot(eqName) {
    let item = FORGE_RECIPES_DATABASE.find(r => getItemName(r) === eqName) || ALL_EQUIPS_POOL.find(r => getItemName(r) === eqName) || CLASS_ARTIFACTS_DATABASE[player.jobName];
    if (!item) return;

    let targetSlot = item.slot || (item.type === 'armor' ? 'chest' : 'weapon');
    let slots = player.equipmentSlots;

    if (targetSlot === 'bracer') {
        if (!slots.bracer1) targetSlot = 'bracer1';
        else if (!slots.bracer2) targetSlot = 'bracer2';
        else {
            alert("⚠️ 兩個【手腕】欄位都已有裝備！請先點擊「❌ 卸下」騰出空間才可穿上新手腕。");
            return;
        }
    } else {
        if (slots[targetSlot]) {
            alert(`⚠️ 【${getSlotNameZh(targetSlot)}】欄位已有裝備 [${slots[targetSlot]}]！\n請先將原裝備「❌ 卸下」後才能替換！`);
            return;
        }
    }

    let mult = 1 + (player.refines[eqName] || 0) * 0.15;
    slots[targetSlot] = eqName;
    if (item.atk) { player.atkMin += Math.floor(item.atk * mult); player.atkMax += Math.floor(item.atk * mult); }
    if (item.hp) { player.maxHp += Math.floor(item.hp * mult); player.hp += Math.floor(item.hp * mult); }
    if (item.mp) { player.maxMp += Math.floor(item.mp * mult); player.mp += Math.floor(item.mp * mult); }
    if (item.critRate) player.critRate += item.critRate;
    if (item.evasion) player.evasion += item.evasion;
    if (targetSlot === 'weapon') player.weapon = eqName;

    alert(`🎉 成功將 [${eqName}] 穿戴至【${getSlotNameZh(targetSlot)}】部位！`);
    updateEquipmentUI();
}

function unequipSlot(slotKey) {
    let eqName = player.equipmentSlots[slotKey];
    if (!eqName) return;

    let item = FORGE_RECIPES_DATABASE.find(r => getItemName(r) === eqName) || ALL_EQUIPS_POOL.find(r => getItemName(r) === eqName) || CLASS_ARTIFACTS_DATABASE[player.jobName];
    if (item) {
        let mult = 1 + (player.refines[eqName] || 0) * 0.15;
        if (item.atk) { player.atkMin = Math.max(10, player.atkMin - Math.floor(item.atk * mult)); player.atkMax = Math.max(15, player.atkMax - Math.floor(item.atk * mult)); }
        if (item.hp) { player.maxHp = Math.max(50, player.maxHp - Math.floor(item.hp * mult)); player.hp = Math.min(player.hp, player.maxHp); }
        if (item.mp) { player.maxMp = Math.max(30, player.maxMp - Math.floor(item.mp * mult)); player.mp = Math.min(player.mp, player.maxMp); }
        if (item.critRate) player.critRate = Math.max(0, player.critRate - item.critRate);
        if (item.evasion) player.evasion = Math.max(0, player.evasion - item.evasion);
    }

    player.equipmentSlots[slotKey] = null;
    if (slotKey === 'weapon') player.weapon = CLASSES[player.baseJobCode || player.jobCode].weaponZh;

    alert(`❌ 已成功將【${getSlotNameZh(slotKey)}】部位的 [${eqName}] 卸下！`);
    updateEquipmentUI();
}

function getSlotNameZh(slotKey) {
    const names = { helmet: "頭盔", chest: "胸甲", leggings: "腿甲", bracer1: "手腕1", bracer2: "手腕2", weapon: "武器" };
    return names[slotKey] || slotKey;
}

function updateMineUI() { updateVillageUI(); }

function mine() {
    if (player.villageActions <= 0) { alert("❌ 村莊行動力不足！"); return; }
    player.villageActions--;
    player.mineCount = (player.mineCount || 0) + 1;
    
    let pLvl = player.pickaxeLvl || 0;
    let doubleOreRate = pLvl * 0.15;
    let highOreRateBonus = pLvl * 0.10;

    let rand = Math.random();
    let count = (Math.random() < doubleOreRate) ? 2 : 1;
    let gotMsg = "";

    if (rand < (0.72 - highOreRateBonus)) { 
        player.ores.copper += count; gotMsg = `🥉 銅 x${count}`; 
    } else if (rand < (0.94 - highOreRateBonus/2)) { 
        player.ores.iron += count; gotMsg = `🥈 鐵 x${count}`; 
    } else if (rand < 0.98) { 
        player.ores.gold += count; gotMsg = `🥇 金 x${count}`; 
    } else { 
        player.ores.diamond += count; gotMsg = `💎 鑽石 x${count}`; 
    }

    let refineStoneRate = 0;
    if (pLvl === 3) refineStoneRate = 0.20;
    else if (pLvl === 4) refineStoneRate = 0.40;
    else if (pLvl >= 5) refineStoneRate = 0.60;

    let gotRefineStone = false;
    if (refineStoneRate > 0 && Math.random() < refineStoneRate) {
        player.refineStones = (player.refineStones || 0) + 1;
        gotRefineStone = true;
    }

    let refineStoneMsg = gotRefineStone ? "\n✨ 鎬子神威發揮！幸運額外採集到了 1 顆【精煉石】！" : "";
    alert(`⛏️ 採礦成功！獲得 ${gotMsg}${refineStoneMsg}\n(村莊行動力: ${player.villageActions}/${player.maxVillageActions})`);
    updateVillageUI();
}

function rest() {
    if (player.villageActions <= 0) { alert("❌ 村莊行動力不足！"); return; }
    if (player.gold >= 30) {
        player.gold -= 30; player.hp = player.maxHp; player.mp = player.maxMp;
        player.villageActions--;
        player.restCount = (player.restCount || 0) + 1;
        alert("✨ 狀態完全恢復！(消耗 1 行動力)"); showVillage();
    } else alert("❌ 金幣不足！");
}

function returnToVillage() { showVillage(); }

function getStatDiffText(item) {
    let diffs = [];
    if (item.atk) diffs.push(`⚔️ 攻擊:+${item.atk}`);
    if (item.hp) diffs.push(`❤️ HP:+${item.hp}`);
    if (item.mp) diffs.push(`💧 MP:+${item.mp}`);
    if (item.critRate) diffs.push(`⚡ 暴擊率:+${item.critRate}%`);
    if (item.critDmg) diffs.push(`💥 暴傷:+${item.critDmg}%`);
    if (item.evasion) diffs.push(`🌀 閃避:+${item.evasion}%`);
    if (item.poisonRate) diffs.push(`☠️ 中毒率:+${item.poisonRate}%`);
    if (item.burnRate) diffs.push(`🔥 燃燒率:+${item.burnRate}%`);
    return diffs.length > 0 ? ` [${diffs.join(' | ')}]` : '';
}

function showPotionShop() {
    hideAll(); 
    document.getElementById('shop-screen').classList.remove('hidden');
    document.getElementById('btn-refresh').style.display = "none";
    document.getElementById('btn-refresh-equip').style.display = "none";
    let container = document.getElementById('shop-items'); container.innerHTML = "";
    document.getElementById('shop-status').innerText = `目前金幣: ${player.gold} G | 🧪 生命藥水: ${player.potions.hp} 瓶 | 魔力藥水: ${player.potions.mp} 瓶`;

    let hpBtn = document.createElement('button'); hpBtn.className = "btn";
    hpBtn.innerText = "❤️ 生命藥水 (50 G) - 恢復 100 HP";
    hpBtn.disabled = (player.gold < 50);
    hpBtn.onclick = () => { player.gold -= 50; player.potions.hp++; alert("🎉 購買了 1 瓶生命藥水！"); showPotionShop(); };
    container.appendChild(hpBtn);

    let mpBtn = document.createElement('button'); mpBtn.className = "btn";
    mpBtn.innerText = "💧 魔力藥水 (40 G) - 恢復 50 MP";
    mpBtn.disabled = (player.gold < 40);
    mpBtn.onclick = () => { player.gold -= 40; player.potions.mp++; alert("🎉 購買了 1 瓶魔力藥水！"); showPotionShop(); };
    container.appendChild(mpBtn);
}

function showAchievements() { hideAll(); document.getElementById('achieve-screen').classList.remove('hidden'); updateAchieveUI(); }
function switchAchieveTab(tab) { currentAchieveTab = tab; updateAchieveUI(); }

function updateAchieveUI() {
    let container = document.getElementById('achieve-items'); container.innerHTML = "";
    let achList = ACHIEVEMENTS_DATABASE.filter(a => a.category === currentAchieveTab);

    achList.forEach(ach => {
        let isDone = player.achieved.includes(ach.id);
        let curVal = 0;

        if (ach.reqType === "stage") curVal = defeatedCount;
        if (ach.reqType === "mine") curVal = player.mineCount || 0;
        if (ach.reqType === "copper") curVal = player.ores.copper || 0;
        if (ach.reqType === "iron") curVal = player.ores.iron || 0;
        if (ach.reqType === "goldOre") curVal = player.ores.gold || 0;
        if (ach.reqType === "diamond") curVal = player.ores.diamond || 0;
        if (ach.reqType === "gold") curVal = player.gold || 0;
        if (ach.reqType === "enchantCount") curVal = player.weaponEnchants.length || 0;
        if (ach.reqType === "stones") curVal = player.enchantStones || 0;
        if (ach.reqType === "skillCount") curVal = player.skills.length || 0;
        if (ach.reqType === "equipCount") curVal = player.equips.length || 0;
        if (ach.reqType === "shopRefreshCount") curVal = player.shopRefreshCount || 0;
        if (ach.reqType === "restCount") curVal = player.restCount || 0;

        let canClaim = (curVal >= ach.reqVal) || (ach.reqType === "hasEnchant" && player.weaponEnchants.includes(ach.reqVal));
        let progressTxt = typeof ach.reqVal === 'number' ? ` [ ${Math.min(curVal, ach.reqVal)} / ${ach.reqVal} ]` : "";
        let stoneTxt = ach.stones > 0 ? ` / ${ach.stones}💎` : "";

        let btn = document.createElement('button'); btn.className = "btn";
        btn.innerText = `${ach.titleZh} - ${ach.descZh}${progressTxt} (獎勵: ${ach.gold}G${stoneTxt})`;

        if (isDone) {
            btn.innerText += " [已領取]";
            btn.disabled = true;
        } else if (!canClaim) {
            btn.innerText += " [未達成]";
            btn.disabled = true;
        } else {
            btn.onclick = () => {
                player.achieved.push(ach.id);
                player.gold = (Number(player.gold) || 0) + (Number(ach.gold) || 100);
                if (ach.stones) player.enchantStones += ach.stones;
                alert(`🏆 領取成就成功！獲得 ${ach.gold} 金幣${ach.stones ? " 與 " + ach.stones + " 顆附魔石" : ""}！`);
                updateAchieveUI();
            };
        }
        container.appendChild(btn);
    });
}

function claimAllAchievements() {
    let claimedCount = 0;
    ACHIEVEMENTS_DATABASE.forEach(ach => {
        if (!player.achieved.includes(ach.id)) {
            let curVal = 0;
            if (ach.reqType === "stage") curVal = defeatedCount;
            if (ach.reqType === "mine") curVal = player.mineCount || 0;
            if (ach.reqType === "copper") curVal = player.ores.copper || 0;
            if (ach.reqType === "iron") curVal = player.ores.iron || 0;
            if (ach.reqType === "goldOre") curVal = player.ores.gold || 0;
            if (ach.reqType === "diamond") curVal = player.ores.diamond || 0;
            if (ach.reqType === "gold") curVal = player.gold || 0;
            if (ach.reqType === "enchantCount") curVal = player.weaponEnchants.length || 0;
            if (ach.reqType === "stones") curVal = player.enchantStones || 0;
            if (ach.reqType === "skillCount") curVal = player.skills.length || 0;
            if (ach.reqType === "equipCount") curVal = player.equips.length || 0;
            if (ach.reqType === "shopRefreshCount") curVal = player.shopRefreshCount || 0;
            if (ach.reqType === "restCount") curVal = player.restCount || 0;

            let canClaim = (curVal >= ach.reqVal) || (ach.reqType === "hasEnchant" && player.weaponEnchants.includes(ach.reqVal));
            if (canClaim) {
                player.achieved.push(ach.id);
                player.gold = (Number(player.gold) || 0) + (Number(ach.gold) || 100);
                if (ach.stones) player.enchantStones += ach.stones;
                claimedCount++;
            }
        }
    });

    if (claimedCount > 0) {
        alert(`🎉 一鍵領取成功！共領取了 ${claimedCount} 項成就獎勵！`);
        updateAchieveUI();
    } else {
        alert("⚠️ 目前沒有可領取的達成成就。");
    }
}

// 🔨 鐵匠鋪選單與裝備渲染 (職業完美比對)
function showForge() { 
    hideAll(); 
    document.getElementById('forge-screen').classList.remove('hidden'); 
    switchForgeTab('warrior'); 
}

function switchForgeTab(tab) { 
    currentForgeTab = tab; 
    let subTabMenu = document.getElementById('armor-sub-tabs');
    if (tab === 'armor') {
        subTabMenu.classList.remove('hidden');
    } else {
        subTabMenu.classList.add('hidden');
    }
    updateForgeUI(); 
}

function switchForgeArmorTab(slot) {
    currentArmorSubTab = slot;
    updateForgeUI();
}

function updateForgeUI() {
    let p = player;
    let act = p.villageActions;
    document.getElementById('ore-status').innerText = `武器: [${p.weapon}]\n礦石: 銅:${p.ores.copper} | 鐵:${p.ores.iron} | 金:${p.ores.gold} | 鑽石:${p.ores.diamond} | 精煉石:${p.refineStones || 0}\n🧩 神器碎片: ${p.artifactFrags || 0} | 👑 路西法碎片: ${p.luciferFrags || 0} | ⚡ 行動力: ${act}/5`;
    let forgeBox = document.getElementById('forge-items'); forgeBox.innerHTML = "";
    
    if (currentForgeTab === 'refine') {
        renderEquipmentRefineList();
        return;
    }

    if (currentForgeTab === 'pickaxe') {
        renderPickaxeUpgradeUI();
        return;
    }

    if (currentForgeTab === 'artifact') {
        renderArtifactCraftAndUpgradeUI();
        return;
    }

    let recipeList = [];
    if (currentForgeTab === 'armor') {
        recipeList = FORGE_RECIPES_DATABASE.filter(r => r.category === 'armor' && r.slot === currentArmorSubTab);
    } else {
        recipeList = FORGE_RECIPES_DATABASE.filter(r => r.category === currentForgeTab);
    }

    // 映射按鈕頁籤至英文代碼
    const tabMap = { warrior: 'Warrior', mage: 'Mage', archer: 'Archer' };

    recipeList.forEach(recipe => {
        let bought = p.equips.includes(getItemName(recipe));
        
        // 🔒 精準匹配基礎職業
        let isJobMatch = true;
        if (recipe.job) {
            isJobMatch = (recipe.job === p.baseJobCode) || (recipe.job === p.jobCode) || (tabMap[currentForgeTab] === recipe.job);
        }

        let canCraft = allOresEnough(p, recipe.req);
        let hasAction = act > 0;
        let btn = document.createElement('button'); btn.className = "btn";
        
        let reqArr = [];
        if (recipe.req.copper) reqArr.push(`銅x${recipe.req.copper}`);
        if (recipe.req.iron) reqArr.push(`鐵x${recipe.req.iron}`);
        if (recipe.req.gold) reqArr.push(`金x${recipe.req.gold}`);
        if (recipe.req.diamond) reqArr.push(`鑽石x${recipe.req.diamond}`);
        
        btn.innerText = `${getItemName(recipe)} (${reqArr.join(', ')})` + getStatDiffText(recipe);
        if (bought) { btn.innerText += ` [已打造]`; btn.disabled = true; }
        else if (!isJobMatch) { btn.innerText += ` [職業不符]`; btn.disabled = true; }
        else if (!canCraft || !hasAction) { btn.disabled = true; }
        else {
            btn.onclick = () => {
                p.villageActions--;
                Object.keys(recipe.req).forEach(k => p.ores[k] -= recipe.req[k]); p.equips.push(getItemName(recipe));
                alert(`成功打造【${getItemName(recipe)}】！` + " (已存入背包，請至裝備管理頁面穿戴)"); updateForgeUI();
            };
        }
        forgeBox.appendChild(btn);
    });
}

function renderArtifactCraftAndUpgradeUI() {
    let forgeBox = document.getElementById('forge-items');
    forgeBox.innerHTML = "";

    let curJobArt = CLASS_ARTIFACTS_DATABASE[player.jobName];
    if (!curJobArt) {
        forgeBox.innerHTML = "<p style='color:#888; text-align:center;'>請先完成 2 階或 3 階轉職以解鎖專屬職業神器打造！</p>";
        return;
    }

    let artName = curJobArt.nameZh;
    let hasArtifact = player.equips.includes(artName);
    let curRefineLvl = player.refines[artName] || 0;

    let craftBtn = document.createElement('button');
    craftBtn.className = "btn";
    craftBtn.style.margin = "6px 0";

    if (hasArtifact) {
        craftBtn.innerText = `🗡️ ${artName} [已合成]`;
        craftBtn.disabled = true;
    } else {
        let canCraft = (player.artifactFrags || 0) >= 5 && player.villageActions > 0;
        craftBtn.innerText = `🗡️ 打造專屬神器: ${artName} (需求: 🧩神器碎片 x5)`;
        craftBtn.disabled = !canCraft;

        craftBtn.onclick = () => {
            player.villageActions--;
            player.artifactFrags -= 5;
            player.equips.push(artName);
            alert(`🎉 成功打造職業專屬神器【${artName}】！請至裝備管理頁面穿戴！`);
            updateForgeUI();
        };
    }
    forgeBox.appendChild(craftBtn);

    if (hasArtifact) {
        let upgradeBtn = document.createElement('button');
        upgradeBtn.className = "btn";
        upgradeBtn.style.margin = "6px 0";

        if (curRefineLvl >= 5) {
            upgradeBtn.innerText = `✨ ${artName} (+5 滿級神器降臨)`;
            upgradeBtn.disabled = true;
        } else {
            let luciferReqArr = [2, 4, 7, 11, 16];
            let reqLucifer = luciferReqArr[curRefineLvl];
            let reqFrags = 2;

            let canUpgrade = (player.artifactFrags || 0) >= reqFrags && (player.luciferFrags || 0) >= reqLucifer && player.villageActions > 0;

            upgradeBtn.innerText = `✨ 神器強化升級 (+${curRefineLvl} ➡️ +${curRefineLvl + 1}) (需求: 🧩神器碎片x${reqFrags}, 👑路西法碎片x${reqLucifer})`;
            upgradeBtn.disabled = !canUpgrade;

            upgradeBtn.onclick = () => {
                player.villageActions--;
                player.artifactFrags -= reqFrags;
                player.luciferFrags -= reqLucifer;
                player.refines[artName] = curRefineLvl + 1;
                alert(`🎉 神器強化成功！【${artName}】提升至 +${curRefineLvl + 1}！（全屬性額外加成 25%）`);
                updateForgeUI();
            };
        }
        forgeBox.appendChild(upgradeBtn);
    }
}

function renderPickaxeUpgradeUI() {
    let forgeBox = document.getElementById('forge-items');
    forgeBox.innerHTML = "";

    let curLvl = player.pickaxeLvl || 0;
    let btn = document.createElement('button');
    btn.className = "btn";

    if (curLvl >= 5) {
        btn.innerText = "⛏️ 採礦鎬子已達到最高等級 (+5 神級鎬子)";
        btn.disabled = true;
    } else {
        let reqCopper = (curLvl + 1) * 5;
        let reqIron = (curLvl + 1) * 3;
        let reqGold = curLvl >= 2 ? (curLvl) * 2 : 0;
        let canUpgrade = (player.ores.copper >= reqCopper && player.ores.iron >= reqIron && player.ores.gold >= reqGold);

        let reqGoldTxt = reqGold > 0 ? `, 金x${reqGold}` : "";
        btn.innerText = `🔨 升級鎬子: (+${curLvl} ➡️ +${curLvl+1}) (需求: 銅x${reqCopper}, 鐵x${reqIron}${reqGoldTxt})`;
        btn.disabled = !canUpgrade;

        btn.onclick = () => {
            player.ores.copper -= reqCopper;
            player.ores.iron -= reqIron;
            if (reqGold > 0) player.ores.gold -= reqGold;
            player.pickaxeLvl = curLvl + 1;

            let unlockStoneMsg = (curLvl + 1 >= 3) ? `\n🎉 鎬子升至 +${curLvl+1}！已解鎖採礦時可挖到【精煉石】能力！` : "";
            alert(`🔨 鎬子升級成功！當前等級: +${curLvl+1}${unlockStoneMsg}`);
            updateForgeUI();
        };
    }
    forgeBox.appendChild(btn);
}

function renderEquipmentRefineList() {
    let forgeBox = document.getElementById('forge-items');
    forgeBox.innerHTML = "";

    if (!player.equips || player.equips.length === 0) {
        forgeBox.innerHTML = "<p style='color:#888; text-align:center;'>背包內尚無可精煉強化的裝備</p>";
        return;
    }

    player.equips.forEach((eqName) => {
        let curLvl = player.refines[eqName] || 0;
        let btn = document.createElement('button');
        btn.className = "btn";

        if (curLvl >= 5) {
            btn.innerText = `✨ ${eqName} (+5 滿級精煉)`;
            btn.disabled = true;
        } else {
            let reqCopper = (curLvl + 1) * 3;
            let reqRefineStone = (curLvl + 1);
            let canRefine = (player.ores.copper >= reqCopper && (player.refineStones || 0) >= reqRefineStone && player.villageActions > 0);

            btn.innerText = `✨ 精煉升級: ${eqName} (+${curLvl} ➡️ +${curLvl+1}) (需求: 銅x${reqCopper}, 精煉石x${reqRefineStone})`;
            btn.disabled = !canRefine;

            btn.onclick = () => {
                player.villageActions--;
                player.ores.copper -= reqCopper;
                player.refineStones -= reqRefineStone;
                player.refines[eqName] = curLvl + 1;
                alert(`🎉 精煉成功！[${eqName}] 已強化提升至 +${curLvl+1}！（屬性額外提升 15%）`);
                updateForgeUI();
            };
        }
        forgeBox.appendChild(btn);
    });
}

function allOresEnough(p, req) {
    let ok = true;
    Object.keys(req).forEach(k => { if ((p.ores[k] || 0) < req[k]) ok = false; });
    return ok;
}

// 🔮 魔法屋渲染與附魔選項修復
function showEnchantHouse() { hideAll(); document.getElementById('enchant-screen').classList.remove('hidden'); updateEnchantHouseUI(); }
function updateEnchantHouseUI() {
    let p = player;
    let act = p.villageActions;
    document.getElementById('magic-status').innerText = `武器: [${p.weapon}]\n💎 附魔石: ${p.enchantStones} 顆\n⚡ 行動力: ${act}/5`;
    let enchantBox = document.getElementById('magic-items'); enchantBox.innerHTML = "";
    
    WEAPON_ENCHANTS.forEach(enc => {
        let hasEnc = p.weaponEnchants && p.weaponEnchants.includes(enc.keyZh);
        let enoughStone = p.enchantStones >= enc.stoneReq;
        let hasAction = act > 0;
        let btn = document.createElement('button'); btn.className = "btn btn-secondary";
        btn.innerText = `${enc.nameZh} - ${enc.descZh}`;
        
        if (hasEnc) { btn.innerText += ` [已打造]`; btn.disabled = true; }
        else if (!enoughStone || !hasAction) { btn.disabled = true; }
        else {
            btn.onclick = () => {
                p.villageActions--;
                p.enchantStones -= enc.stoneReq;
                if (!p.weaponEnchants) p.weaponEnchants = [];
                p.weaponEnchants.push(enc.keyZh);
                if (enc.id === "sharp") { p.atkMin += 25; p.atkMax += 25; }
                alert(`消耗 10 顆附魔石與 1 行動力，成功完成【${enc.keyZh}附魔】！`); updateEnchantHouseUI();
            };
        }
        enchantBox.appendChild(btn);
    });
}

function showEquipShop() { 
    hideAll(); 
    document.getElementById('shop-screen').classList.remove('hidden'); 
    document.getElementById('btn-refresh').style.display = "none";
    document.getElementById('btn-refresh-equip').style.display = "block";
    updateEquipShopUI(); 
}

function updateEquipShopUI() {
    document.getElementById('shop-status').innerText = `金幣: ${player.gold} G | 職業: ${player.jobName}`;
    let container = document.getElementById('shop-items'); container.innerHTML = "";
    
    document.getElementById('btn-refresh-equip').disabled = (player.gold < 100);

    shopEquips.forEach(item => {
        let bought = player.equips.includes(getItemName(item));
        let wrongJob = (item.job && item.job !== player.jobCode && item.job !== player.baseJobCode);
        let enoughGold = player.gold >= item.cost;
        let btn = document.createElement('button'); btn.className = "btn";
        btn.innerText = `${getItemName(item)} (${item.cost} G)` + getStatDiffText(item);
        if (bought) { btn.innerText += ` [已裝備]`; btn.disabled = true; }
        else if (wrongJob) { btn.innerText += ` [職業不符]`; btn.disabled = true; }
        else if (!enoughGold) { btn.disabled = true; }
        else {
            btn.onclick = () => {
                player.gold -= item.cost; player.equips.push(getItemName(item));
                alert(`成功購買【${getItemName(item)}】！` + " (已存入背包，請至裝備管理頁面穿戴)"); updateEquipShopUI();
            };
        }
        container.appendChild(btn);
    });
}

function refreshEquipShop() {
    if (player.gold >= 100) {
        player.gold -= 100;
        player.shopRefreshCount = (player.shopRefreshCount || 0) + 1;
        rollRandomEquipShop(); 
        alert("🔄 裝備商店已刷新！(消耗 100 G)"); updateEquipShopUI();
    } else alert("❌ 金幣不足！");
}

function showSkillShop() { hideAll(); document.getElementById('shop-screen').classList.remove('hidden'); document.getElementById('btn-refresh').style.display = "block"; document.getElementById('btn-refresh-equip').style.display = "none"; updateSkillShopUI(); }
function updateSkillShopUI() {
    document.getElementById('shop-status').innerText = `金幣: ${player.gold} G | Skills: ${player.skills.length}/4`;
    let container = document.getElementById('shop-items'); container.innerHTML = "";
    
    document.getElementById('btn-refresh').disabled = (player.gold < 100);

    shopSkills.forEach(sKey => {
        let sInfo = SKILLS[sKey];
        let learned = player.skills.includes(sKey);
        let wrongJob = (sInfo.type !== "universal" && sInfo.type !== player.jobCode && sInfo.type !== player.baseJobCode);
        let enoughGold = player.gold >= sInfo.cost;
        let btn = document.createElement('button'); btn.className = "btn";
        btn.innerText = `${sKey} (${sInfo.cost} G) - ${sInfo.descZh}`;
        
        if (learned) { btn.innerText += ` [已學會]`; btn.disabled = true; }
        else if (wrongJob) { btn.innerText += ` [職業不符]`; btn.disabled = true; }
        else if (!enoughGold) { btn.disabled = true; }
        else btn.onclick = () => attemptBuySkill(sKey, sInfo.cost);
        container.appendChild(btn);
    });
}

function attemptBuySkill(sKey, cost) {
    if (player.skills.length < 4) {
        player.gold -= cost; player.skills.push(sKey);
        alert(`成功學會【${sKey}】！`); updateSkillShopUI();
    } else {
        pendingSkillToLearn = { key: sKey, cost: cost };
        showReplaceSkillScreen();
    }
}

function showReplaceSkillScreen() {
    hideAll(); document.getElementById('replace-skill-screen').classList.remove('hidden');
    let container = document.getElementById('replace-skills-list'); container.innerHTML = "";
    player.skills.forEach((oldKey, idx) => {
        let btn = document.createElement('button'); btn.className = "btn";
        btn.innerText = `[${oldKey}] ➡️ [${pendingSkillToLearn.key}]`;
        btn.onclick = () => executeReplaceSkill(idx);
        container.appendChild(btn);
    });
}

function executeReplaceSkill(replaceIndex) {
    let oldKey = player.skills[replaceIndex];
    player.gold -= pendingSkillToLearn.cost;
    player.skills[replaceIndex] = pendingSkillToLearn.key;
    alert(`已忘記【${oldKey}】，並成功學會【${pendingSkillToLearn.key}】！`);
    pendingSkillToLearn = null;
    showSkillShop();
}

function refreshSkills() {
    if (player.gold >= 100) {
        player.gold -= 100;
        player.shopRefreshCount = (player.shopRefreshCount || 0) + 1;
        rollRandomSkills(); alert("🔄 換一批技能 (100 G)"); updateSkillShopUI();
    } else alert("❌ 金幣不足！");
}

function saveGame() { 
    try {
        let saveData = { player: player, defeatedCount: defeatedCount, shopEquips: shopEquips, shopSkills: shopSkills, maxReachedStage: maxReachedStage, currentSelectedStage: currentSelectedStage };
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData)); 
        alert("💾 存檔成功！\n(存檔Key已寫入 GitHub Pages 專屬隔離區)"); 
    } catch(e) {
        alert("❌ 儲存失敗！您的瀏覽器可能停用了 LocalStorage 功能。");
    }
}

function loadGame() { 
    try {
        let saved = localStorage.getItem(SAVE_KEY); 
        if (saved) { 
            let data = JSON.parse(saved); 
            player = data.player; 
            defeatedCount = data.defeatedCount; 
            if (data.maxReachedStage) maxReachedStage = data.maxReachedStage; else maxReachedStage = defeatedCount || 1;
            if (data.currentSelectedStage) currentSelectedStage = data.currentSelectedStage; else currentSelectedStage = maxReachedStage;
            if (data.shopEquips) shopEquips = data.shopEquips;
            if (data.shopSkills) shopSkills = data.shopSkills;

            if (typeof player.gold !== "number" || isNaN(player.gold)) {
                player.gold = 100;
            }

            if (!player.level) player.level = 1;
            if (!player.exp) player.exp = 0;
            if (!player.maxExp) player.maxExp = getMaxExp(1);
            if (!player.baseJobCode) player.baseJobCode = player.jobCode;
            if (!player.jobTier) player.jobTier = 1;
            if (!player.towerFloor) player.towerFloor = 1;
            if (!player.artifactFrags) player.artifactFrags = 0;
            if (!player.luciferFrags) player.luciferFrags = 0;

            if (!player.refines) player.refines = {};
            if (!player.pickaxeLvl) player.pickaxeLvl = 0;
            if (!player.refineStones) player.refineStones = 0;
            if (!player.shopRefreshCount) player.shopRefreshCount = 0;
            if (!player.restCount) player.restCount = 0;

            if (!player.equipmentSlots) {
                player.equipmentSlots = { helmet: null, chest: null, leggings: null, bracer1: null, bracer2: null, weapon: null };
            }
            if (!player.skillCDs) player.skillCDs = {};
            if (!player.equips) player.equips = [];
            if (!player.ores) player.ores = { copper: 0, iron: 0, gold: 0, diamond: 0 };
            if (!player.potions) player.potions = { hp: 1, mp: 1 };
            
            alert("📂 成功載入進度！"); 
            showVillage(); 
        } else {
            alert("⚠️ 找不到本地存檔，請確認您已在本頁面存檔過，或使用【跨裝置代碼匯入】進度。");
        }
    } catch(e) {
        alert("❌ 讀取存檔時發生錯誤，存檔資料可能已被損壞。");
    }
}

// 📖 遊玩規則指南控制機制 (獨立彈窗隔離模式)
let previousScreenBeforeGuide = 'main-menu';

function showGameGuide() {
    const screens = ['main-menu', 'class-select', 'card-screen', 'battle-screen', 'defeat-screen', 'village-screen', 'stats-screen', 'forge-screen', 'enchant-screen', 'shop-screen', 'replace-skill-screen', 'achieve-screen', 'potion-select-screen', 'equipment-screen', 'job-advance-screen', 'job-tree-screen', 'event-screen', 'map-select-screen'];
    
    for (let id of screens) {
        let el = document.getElementById(id);
        if (el && !el.classList.contains('hidden')) {
            previousScreenBeforeGuide = id;
            break;
        }
    }
    
    hideAll(); 
    document.getElementById('guide-screen').classList.remove('hidden'); 
}

function hideGameGuide() {
    document.getElementById('guide-screen').classList.add('hidden');
    let prevEl = document.getElementById(previousScreenBeforeGuide);
    if (prevEl) {
        prevEl.classList.remove('hidden'); 
    } else {
        showMainMenu();
    }
    document.getElementById('btn-corner-rules').classList.remove('hidden');
}

function showTransferSave() {
    hideAll();
    document.getElementById('transfer-save-screen').classList.remove('hidden');
    let localData = localStorage.getItem(SAVE_KEY);
    if (localData) {
        document.getElementById('save-code-input').value = btoa(encodeURIComponent(localData));
    } else {
        document.getElementById('save-code-input').value = "";
    }
}

function exportSaveCode() {
    let localData = localStorage.getItem(SAVE_KEY);
    if (!localData) { alert("⚠️ 目前沒有可導出的本地存檔！請先開始遊戲並存檔。"); return; }
    let code = btoa(encodeURIComponent(localData));
    navigator.clipboard.writeText(code).then(() => {
        alert("📋 存檔代碼已成功複製到剪貼簿！您可以貼上發送給自己備份。");
    }).catch(() => {
        document.getElementById('save-code-input').value = code;
        alert("📋 存檔代碼已生成於框內，請手動全選複製。");
    });
}

function importSaveCode() {
    let code = document.getElementById('save-code-input').value.trim();
    if (!code) { alert("❌ 請先貼上有效的存檔代碼！"); return; }
    try {
        let jsonStr = decodeURIComponent(atob(code));
        let testData = JSON.parse(jsonStr);
        if (testData && testData.player) {
            localStorage.setItem(SAVE_KEY, jsonStr);
            alert("📥 存檔代碼匯入成功！即將為您載入進度...");
            loadGame();
        } else {
            throw new Error("無效的資料格式");
        }
    } catch (e) {
        alert("❌ 存檔代碼解析失敗，請確認代碼是否完整且未被修改！");
    }
}

showMainMenu();