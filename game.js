let player = {};
let defeatedCount = 0;
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
let curLang = "zh";

function getSkillName(sKey) { return curLang === "zh" ? sKey : (SKILLS[sKey] ? SKILLS[sKey].nameEn : sKey); }
function getItemName(item) { return curLang === "zh" ? item.nameZh : item.nameEn; }
function getStageString(count) { return `${Math.min(Math.floor((count - 1) / 10) + 1, 10)}-${((count - 1) % 10) + 1}`; }

function toggleLanguage() { curLang = curLang === "zh" ? "en" : "zh"; applyLanguage(); }

function applyLanguage() {
    let t = I18N[curLang];
    if(!t) return;
    document.getElementById('btn-lang-toggle').innerText = "🌐 Language: " + t.langName;
    document.getElementById('menu-sub').innerText = t.subTitle;
    document.getElementById('btn-start').innerText = t.startG;
    document.getElementById('btn-load').innerText = t.loadG;
    document.getElementById('class-title').innerText = t.classT;
    document.getElementById('btn-warrior').innerText = t.warB;
    document.getElementById('btn-mage').innerText = t.magB;
    document.getElementById('btn-archer').innerText = t.arcB;
    document.getElementById('btn-class-back').innerText = t.backMain;
    document.getElementById('card-title').innerText = t.cardT;
    document.getElementById('card-sub').innerText = t.cardSub;
    document.getElementById('btn-attack').innerText = t.atkB;
    document.getElementById('skill-grid-title').innerText = t.skillGridT;
    document.getElementById('btn-v-stats').innerText = t.vStats;
    document.getElementById('btn-v-rest').innerText = t.vRest;
    document.getElementById('btn-v-forge').innerText = t.vForge;
    document.getElementById('btn-v-magic').innerText = t.vMagic;
    document.getElementById('btn-v-equip').innerText = t.vEquip;
    document.getElementById('btn-v-skill').innerText = t.vSkill;
    document.getElementById('btn-v-potion').innerText = t.vPotion;
    document.getElementById('btn-v-achieve').innerText = t.vAchieve;
    document.getElementById('btn-v-save').innerText = t.vSave;
    document.getElementById('btn-v-next').innerText = t.vNext;
    document.getElementById('btn-stats-back').innerText = t.back;
    document.getElementById('forge-title').innerText = t.forgeT;
    document.getElementById('forge-craft-title').innerText = t.craftT;
    document.getElementById('btn-forge-back').innerText = t.back;
    document.getElementById('magic-house-title').innerText = t.magicT;
    document.getElementById('forge-enc-title').innerText = t.encT;
    document.getElementById('btn-magic-back').innerText = t.back;
    document.getElementById('btn-refresh').innerText = t.refreshB;
    document.getElementById('btn-shop-back').innerText = t.back;
    document.getElementById('defeat-title').innerText = t.defeatT;
    document.getElementById('defeat-sub').innerText = t.defeatSub;
    document.getElementById('btn-retry').innerText = t.retryB;
    document.getElementById('btn-fallback').innerText = t.fallbackB;
    document.getElementById('replace-title').innerText = t.replaceT;
    document.getElementById('replace-sub').innerText = t.replaceSub;
    document.getElementById('btn-cancel-replace').innerText = t.cancelReplace;
    document.getElementById('stats-title').innerText = t.statsT;
    document.getElementById('shop-title').innerText = t.shopT;
}

function hideAll() { 
    ['main-menu', 'class-select', 'card-screen', 'battle-screen', 'defeat-screen', 'village-screen', 'stats-screen', 'forge-screen', 'enchant-screen', 'shop-screen', 'replace-skill-screen', 'achieve-screen', 'potion-select-screen', 'guide-screen', 'transfer-save-screen', 'victory-modal-screen', 'equipment-screen'].forEach(id => {
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
    applyLanguage(); 
    document.getElementById('btn-load').disabled = !localStorage.getItem(SAVE_KEY); 
}

function showClassSelect() { hideAll(); document.getElementById('class-select').classList.remove('hidden'); }

function initGame(jobCode) {
    let c = CLASSES[jobCode];
    player = {
        jobCode: jobCode, jobName: curLang === "zh" ? c.nameZh : (c.nameEn || c.nameZh),
        hp: c.hp, maxHp: c.hp, mp: c.mp, maxMp: c.mp, shield: 0,
        atkMin: c.min, atkMax: c.max, weapon: curLang === "zh" ? c.weaponZh : (c.weaponEn || c.weaponZh),
        gold: 100, enchantStones: 0, villageActions: 5, maxVillageActions: 5, skills: ["重擊"], cards: [], 
        equips: [], 
        refines: {}, 
        pickaxeLvl: 0, 
        refineStones: 0, 
        
        equipmentSlots: {
            helmet: null, chest: null, leggings: null, bracer1: null, bracer2: null, weapon: null
        },

        weaponEnchants: [],
        ores: { copper: 0, iron: 0, gold: 0, diamond: 0 },
        potions: { hp: 1, mp: 1 }, mineCount: 0, achieved: [],
        
        critRate: c.critRate, critDmg: c.critDmg, evasion: c.evasion,
        poisonRate: 0, burnRate: 0, freezeRate: 0,
        poisonRes: 0, burnRes: 0, frostRes: 0, darkRes: 0,
        
        skillCDs: {}, buffTurns: 0, debuffTurns: 0, isDefending: false
    };
    defeatedCount = 0;
    startNextBattle();
}

function startNextBattle() {
    defeatedCount++; 
    hideAll(); 
    document.getElementById('battle-screen').classList.remove('hidden');
    if (typeof setBattleBgm === "function") setBattleBgm(true);
    spawnMonster();
}

function spawnMonster() {
    let curMapId = Math.min(Math.floor((defeatedCount - 1) / 10) + 1, 10);
    let isBoss = (defeatedCount % 10 === 0);
    let isFinal = (defeatedCount === 100);
    let mapData = (typeof MAPS !== "undefined" && MAPS[curMapId]) ? MAPS[curMapId] : { nameZh: "微光森林", bossZh: "區域頭目", monstersZh: ["哥布林斥候"] };

    if (isFinal) { 
        monster = { name: "👑 滅世魔王·路西法", hp: 3500, maxHp: 3500, min: 80, max: 120, reward: 2000, isFinal: true, mapId: 10, debuffTurns: 0, isRaged: false }; 
    } else if (isBoss) { 
        let reward = Math.floor(Math.random() * 31 + 80);
        monster = { name: `👑 ${mapData.bossZh}`, hp: 500 + defeatedCount * 25, maxHp: 500 + defeatedCount * 25, min: 25 + curMapId * 7, max: 45 + curMapId * 9, reward: reward, isFinal: false, mapId: curMapId, debuffTurns: 0, isRaged: false }; 
    } else { 
        let reward = Math.floor(Math.random() * 11 + 40);
        let mName = mapData.monstersZh[Math.floor(Math.random() * mapData.monstersZh.length)];
        monster = { name: mName, hp: 120 + defeatedCount * 16, maxHp: 120 + defeatedCount * 16, min: 12 + defeatedCount * 3, max: 22 + defeatedCount * 4, reward: reward, isFinal: false, mapId: curMapId, debuffTurns: 0, isRaged: false }; 
    }

    if (typeof drawMonsterVisual === "function") drawMonsterVisual(curMapId, isBoss || isFinal);
    let t = I18N[curLang];
    document.getElementById('log-box').innerHTML = t.battleStart + "\n";
    player.shield = 0; 
    player.skillCDs = {};
    player.isDefending = false;
    render4SkillButtons();
    updateBattleUI();
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
    let t = I18N[curLang];
    let mapObj = (typeof MAPS !== "undefined" && MAPS[monster.mapId]) ? MAPS[monster.mapId] : { nameZh: "荒野" };
    let mapName = curLang === "zh" ? mapObj.nameZh : (mapObj.nameEn || mapObj.nameZh);
    let weaknessZh = { flame: "🔥火", frost: "❄️冰", thunder: "⚡雷", gale: "🍃風" }[mapObj.weakness] || "無";

    document.getElementById('map-info').innerText = `${t.stage}: ${getStageString(defeatedCount)} ${mapName} (弱點: ${weaknessZh})`;
    
    let buffStr = player.buffTurns > 0 ? `🔥 狂暴中 (${player.buffTurns}T)` : "無";
    if (player.isDefending) buffStr += " | 🛡️ 防禦防護中";

    document.getElementById('player-status').innerText = `【${player.jobName}】HP: ${player.hp}/${player.maxHp} ${player.shield > 0 ? '(Shield:'+player.shield+')' : ''} | MP: ${player.mp}/${player.maxMp}\n🧪 ${t.hpPotLabel}: ${player.potions.hp}瓶 | ${t.mpPotLabel}: ${player.potions.mp}瓶`;
    
    let encStr = (player.weaponEnchants && player.weaponEnchants.length > 0) ? player.weaponEnchants.join(' + ') : t.noEnc;
    document.getElementById('buff-status').innerText = `${t.weapon}: [${player.weapon}] (${encStr})\nBUFF: ${buffStr} | ${t.cardsLabel}: ${player.cards.length > 0 ? player.cards.join(', ') : t.noCard}`;
    
    let rageTag = monster.isRaged ? " 🔥【二階段狂暴化中！】" : "";
    document.getElementById('monster-status').innerText = `【${monster.name}】HP: ${monster.hp}/${monster.maxHp}${rageTag}`;
    
    let mDebuffTxt = monster.debuffTurns > 0 ? `⚠️ 怪物負面狀態: 衰弱/流血 (${monster.debuffTurns}T)` : "";
    document.getElementById('monster-debuff-status').innerText = mDebuffTxt;

    checkBloodDanger();
}

function render4SkillButtons() {
    let container = document.getElementById('skill-buttons-container');
    container.innerHTML = "";
    let t = I18N[curLang];
    for (let i = 0; i < 4; i++) {
        let btn = document.createElement('button');
        btn.className = "btn-skill";
        if (i < player.skills.length) {
            let sKey = player.skills[i];
            let sInfo = SKILLS[sKey] || { mp: 10, cd: 0 };
            let displaySName = getSkillName(sKey);
            let cdRem = player.skillCDs[sKey] || 0;
            
            if (cdRem > 0) {
                btn.innerText = `⏳ ${displaySName}\n(CD: ${cdRem}T)`;
                btn.disabled = true;
            } else {
                btn.innerText = `✨ ${displaySName}\n(${sInfo.mp} MP)`;
                btn.onclick = () => useSpecificSkill(sKey);
            }
        } else {
            btn.innerText = `[${t.slotEmpty} ${i+1}]`;
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
    let p = player; let t = I18N[curLang];
    hideAll();
    document.getElementById('potion-select-screen').classList.remove('hidden');
    document.getElementById('potion-select-status').innerText = `🧪 ${t.hpPotLabel}: ${p.potions.hp} 瓶\n🧪 ${t.mpPotLabel}: ${p.potions.mp} 瓶`;
    document.getElementById('btn-use-hp-pot').disabled = (p.potions.hp <= 0);
    document.getElementById('btn-use-mp-pot').disabled = (p.potions.mp <= 0);
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
    let t = I18N[curLang];
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
        spawnFloatingText("🛡️ 防禦", "heal");
    } else if (skillKey) {
        let sInfo = SKILLS[skillKey];
        if (player.mp < sInfo.mp) { log(t.noMP); return; }
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
        
        let tag = isCounter ? "🔥克制 " : (isCrit ? "💥 " : "");
        spawnFloatingText(tag + dealtDmg, isCrit ? "crit" : "normal");

        let counterMsg = isCounter ? " 🔥【屬性克制 1.5倍！】" : "";
        log((isCrit ? "⚡【暴擊！】" : "") + t.skillLog.replace('{s}', getSkillName(skillKey)).replace('{d}', dealtDmg) + counterMsg, isCrit ? "log-crit" : "log-skill");
    } else {
        dealtDmg = randomAtk();
        if (player.buffTurns > 0) dealtDmg = Math.floor(dealtDmg * 1.25);
        if (isCrit) dealtDmg = Math.floor(dealtDmg * (player.critDmg / 100));
        
        monster.hp -= dealtDmg;
        if (typeof playSound === "function") playSound('hit', player.jobCode);
        triggerScreenShake();
        spawnFloatingText((isCrit ? "💥 " : "") + dealtDmg, isCrit ? "crit" : "normal");
        log((isCrit ? "⚡【暴擊！】" : "") + t.attackLog.replace('{w}', player.weapon).replace('{d}', dealtDmg), isCrit ? "log-crit" : "");
    }

    if ((monster.isBoss || monster.isFinal) && !monster.isRaged && (monster.hp / monster.maxHp) <= 0.30 && monster.hp > 0) {
        monster.isRaged = true;
        monster.min = Math.floor(monster.min * 1.4);
        monster.max = Math.floor(monster.max * 1.4);
        log("🔥【警告】BOSS 血量低於 30%，進入二階段狂暴狀態！攻擊力大幅提升！", "log-crit");
        spawnFloatingText("🔥狂暴化!", "crit");
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
        let gotStone = Math.random() < 0.10;
        if (gotStone) player.enchantStones++;
        player.gold += monster.reward;

        showVictoryModal(monster.name, monster.reward, gotStone);
        return;
    }

    if (Math.random() < (player.evasion / 100)) {
        log(`🌀 成功閃避了 ${monster.name} 的攻擊！`, "log-heal");
        spawnFloatingText("🌀 Miss", "heal");
        updateBattleUI();
        return;
    }

    let enemyActionRand = Math.random();
    let mDmg = Math.floor(Math.random() * (monster.max - monster.min + 1) + monster.min);

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

    if (player.hp <= 0) {
        player.hp = 0;
        updateBattleUI();
        hideAll();
        document.getElementById('defeat-screen').classList.remove('hidden');
        return;
    }
    updateBattleUI();
}

function showVictoryModal(mName, rewardGold, gotStone) {
    hideAll();
    pendingVictoryData = { gotStone: gotStone };
    let content = document.getElementById('victory-modal-content');
    let stoneMsg = gotStone ? "<br><span style='color:#70a1ff;'>💎 幸運額外獲得了 1 顆【附魔石】！</span>" : "";
    content.innerHTML = `⚔️ 成功擊敗了 <b>${mName}</b>！<br>🪙 獲得金幣獎勵：<b>+${rewardGold} G</b>${stoneMsg}`;
    document.getElementById('victory-modal-screen').classList.remove('hidden');
}

function confirmVictoryModal() {
    hideAll();
    if (defeatedCount % 10 === 0) {
        cardRefreshCount = 3;
        showCardSelect();
    } else {
        enterVillage();
    }
}

function retryBattle() { player.hp = player.maxHp; player.mp = player.maxMp; hideAll(); document.getElementById('battle-screen').classList.remove('hidden'); spawnMonster(); }
function fallbackStage() { if (defeatedCount > 1) defeatedCount--; player.hp = player.maxHp; player.mp = player.maxMp; enterVillage(); }
function randomAtk() { return Math.floor(Math.random() * (player.atkMax - player.atkMin + 1) + player.atkMin); }

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
        let cName = curLang === "zh" ? card.nameZh : card.nameEn;
        let cDesc = curLang === "zh" ? card.descZh : card.descEn;
        btn.innerHTML = `<b>${cName}</b><br><span style="font-size:12px; color:#ccc;">${cDesc}</span>`;
        btn.onclick = () => { player.cards.push(cName); enterVillage(); };
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

// **重點修改：隨機裝備商店一次刷新 5 欄位（只包含初級與中級）**
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
        player.gold += bonusGold;
        villageNpcMsg = curLang === "zh" ? `🙋‍♂️ 遇到了熱心的村莊居民，獲得了 ${bonusGold} 金幣資助！` : `🙋‍♂️ Met a villager and received ${bonusGold} Gold!`;
    } else villageNpcMsg = "";

    showVillage();
}

function showVillage() {
    hideAll(); 
    if (typeof setBattleBgm === "function") setBattleBgm(false);
    document.getElementById('village-screen').classList.remove('hidden');
    let t = I18N[curLang];
    let curMapId = Math.min(Math.floor((defeatedCount - 1) / 10) + 1, 10);
    let mapObj = (typeof MAPS !== "undefined" && MAPS[curMapId]) ? MAPS[curMapId] : { villageZh: "村莊" };
    let vName = curLang === "zh" ? mapObj.villageZh : (mapObj.villageEn || mapObj.villageZh);
    document.getElementById('village-title').innerText = `🏡 ${t.stage} ${curMapId}: ${vName}`;
    let npcBox = document.getElementById('npc-event-box');
    if (villageNpcMsg) { npcBox.innerText = villageNpcMsg; npcBox.style.display = "block"; } else npcBox.style.display = "none";
    updateVillageUI();
}

function updateVillageUI() {
    let t = I18N[curLang];
    let act = player.villageActions;
    let pLvl = player.pickaxeLvl || 0;
    
    document.getElementById('village-status').innerText = `${t.job}: ${player.jobName} | ${t.gold}: ${player.gold} G | 💎 ${t.stones}: ${player.enchantStones} | 💠 精煉石: ${player.refineStones || 0}\nHP: ${player.hp}/${player.maxHp} | MP: ${player.mp}/${player.maxMp} | ⚡ ${t.actionsLabel}: ${act}/${player.maxVillageActions}\n⛏️ 採礦鎬子等級: +${pLvl}`;

    document.getElementById('btn-v-rest').disabled = (player.gold < 30 || act <= 0);
    
    let btnMine = document.getElementById('btn-mine');
    btnMine.innerText = act <= 0 ? t.actionDone : `${t.mineBtnTxt}`;
    btnMine.disabled = (act <= 0);

    document.getElementById('btn-v-forge').disabled = (act <= 0);
    document.getElementById('btn-v-magic').disabled = (act <= 0);
    
    checkBloodDanger();
}

function showPlayerStats() {
    hideAll(); 
    document.getElementById('stats-screen').classList.remove('hidden');
    let p = player; let t = I18N[curLang];
    let encStr = (p.weaponEnchants && p.weaponEnchants.length > 0) ? p.weaponEnchants.join(' + ') : t.noEnc;
    let cardStr = p.cards.length > 0 ? p.cards.join(', ') : t.noCard;
    let skillStr = p.skills.map(getSkillName).join(', ');

    let html = `
        <b>【${t.job}: ${p.jobName}】</b> | ${t.stage}: ${getStageString(defeatedCount)}<br>
        ${t.gold}: ${p.gold} G | 💎 ${t.stones}: ${p.enchantStones} | 💠 精煉石: ${p.refineStones || 0}<br>
        ⛏️ 採礦鎬子強化等級: <b>+${p.pickaxeLvl || 0}</b><br>
        🗡️ 當前武器: <b>[${p.equipmentSlots.weapon || p.weapon}]</b> (${encStr})<br>
        🪖 當前頭盔: <b>[${p.equipmentSlots.helmet || '無'}]</b> | 🛡️ 當前胸甲: <b>[${p.equipmentSlots.chest || '無'}]</b><br>
        🦵 當前腿甲: <b>[${p.equipmentSlots.leggings || '無'}]</b> | 🥊 手腕1/2: <b>[${p.equipmentSlots.bracer1 || '無'}] / [${p.equipmentSlots.bracer2 || '無'}]</b><br><br>
        <b>⚔️ 戰鬥面板屬性：</b><br>
        ❤️ HP: ${p.hp} / ${p.maxHp} | 💧 MP: ${p.mp} / ${p.maxMp}<br>
        🗡️ ${t.atkLabel}: ${p.atkMin} ~ ${p.atkMax}<br>
        ⚡ 暴擊率: ${p.critRate}% | 💥 暴擊傷害: ${p.critDmg}% | 🌀 閃避率: ${p.evasion}%<br><br>
        ${t.skillsLabel}: ${skillStr}<br>
        ${t.cardsLabel}: ${cardStr}
    `;
    document.getElementById('stats-content').innerHTML = html;
}

// 🛡️ 獨立部位裝備穿脫管理系統
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
        🪖 <b>[頭盔]</b>：${slots.helmet ? `<b>${slots.helmet}</b> <button onclick="unequipSlot('helmet')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : '<span style="color:#888;">[空位]</span>'}<br>
        🛡️ <b>[胸甲]</b>：${slots.chest ? `<b>${slots.chest}</b> <button onclick="unequipSlot('chest')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : '<span style="color:#888;">[空位]</span>'}<br>
        🦵 <b>[腿甲]</b>：${slots.leggings ? `<b>${slots.leggings}</b> <button onclick="unequipSlot('leggings')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : '<span style="color:#888;">[空位]</span>'}<br>
        🥊 <b>[手腕 1]</b>：${slots.bracer1 ? `<b>${slots.bracer1}</b> <button onclick="unequipSlot('bracer1')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : '<span style="color:#888;">[空位]</span>'}<br>
        🥊 <b>[手腕 2]</b>：${slots.bracer2 ? `<b>${slots.bracer2}</b> <button onclick="unequipSlot('bracer2')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : '<span style="color:#888;">[空位]</span>'}<br>
        🗡️ <b>[武器]</b>：${slots.weapon ? `<b>${slots.weapon}</b> <button onclick="unequipSlot('weapon')" style="padding:2px 8px; font-size:11px; cursor:pointer;">❌ 卸下</button>` : `<span style="color:#888;">[基本預設: ${player.weapon}]</span>`}
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
    let item = FORGE_RECIPES_DATABASE.find(r => getItemName(r) === eqName) || ALL_EQUIPS_POOL.find(r => getItemName(r) === eqName);
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

    let item = FORGE_RECIPES_DATABASE.find(r => getItemName(r) === eqName) || ALL_EQUIPS_POOL.find(r => getItemName(r) === eqName);
    if (item) {
        let mult = 1 + (player.refines[eqName] || 0) * 0.15;
        if (item.atk) { player.atkMin = Math.max(10, player.atkMin - Math.floor(item.atk * mult)); player.atkMax = Math.max(15, player.atkMax - Math.floor(item.atk * mult)); }
        if (item.hp) { player.maxHp = Math.max(50, player.maxHp - Math.floor(item.hp * mult)); player.hp = Math.min(player.hp, player.maxHp); }
        if (item.mp) { player.maxMp = Math.max(30, player.maxMp - Math.floor(item.mp * mult)); player.mp = Math.min(player.mp, player.maxMp); }
        if (item.critRate) player.critRate = Math.max(0, player.critRate - item.critRate);
        if (item.evasion) player.evasion = Math.max(0, player.evasion - item.evasion);
    }

    player.equipmentSlots[slotKey] = null;
    if (slotKey === 'weapon') player.weapon = CLASSES[player.jobCode].weaponZh;

    alert(`❌ 已成功將【${getSlotNameZh(slotKey)}】部位的 [${eqName}] 卸下！`);
    updateEquipmentUI();
}

function getSlotNameZh(slotKey) {
    const names = { helmet: "頭盔", chest: "胸甲", leggings: "腿甲", bracer1: "手腕1", bracer2: "手腕2", weapon: "武器" };
    return names[slotKey] || slotKey;
}

// -------------------------------------------------------------
// ⛏️ 採礦機制
// -------------------------------------------------------------
function mine() {
    if (player.villageActions <= 0) { alert(I18N[curLang].noActions); return; }
    let t = I18N[curLang];
    player.villageActions--;
    player.mineCount = (player.mineCount || 0) + 1;
    
    let pLvl = player.pickaxeLvl || 0;
    let doubleOreRate = pLvl * 0.15;
    let highOreRateBonus = pLvl * 0.10;

    let rand = Math.random();
    let count = (Math.random() < doubleOreRate) ? 2 : 1;
    let gotMsg = "";

    if (rand < (0.72 - highOreRateBonus)) { 
        player.ores.copper += count; gotMsg = `🥉 ${t.copper} x${count}`; 
    } else if (rand < (0.94 - highOreRateBonus/2)) { 
        player.ores.iron += count; gotMsg = `🥈 ${t.iron} x${count}`; 
    } else if (rand < 0.98) { 
        player.ores.gold += count; gotMsg = `🥇 ${t.goldOre} x${count}`; 
    } else { 
        player.ores.diamond += count; gotMsg = `💎 ${t.diamond} x${count}`; 
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

    let refineStoneMsg = gotRefineStone ? "\n✨ 鎬子神威發揮！幸運額外採集到了 1 顆【💠 精煉石】！" : "";
    alert(`⛏️ 採礦成功！獲得 ${gotMsg}${refineStoneMsg}\n(${t.actionsLabel}: ${player.villageActions}/${player.maxVillageActions})`);
    updateVillageUI();
}

function rest() {
    let t = I18N[curLang];
    if (player.villageActions <= 0) { alert(t.noActions); return; }
    if (player.gold >= 30) {
        player.gold -= 30; player.hp = player.maxHp; player.mp = player.maxMp;
        player.villageActions--;
        alert(t.restSuccess); showVillage();
    } else alert(t.noGold);
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
        if (ach.reqType === "gold") curVal = player.gold || 0;
        if (ach.reqType === "diamond") curVal = player.ores.diamond || 0;
        if (ach.reqType === "enchantCount") curVal = player.weaponEnchants.length || 0;
        if (ach.reqType === "stones") curVal = player.enchantStones || 0;
        if (ach.reqType === "skillCount") curVal = player.skills.length || 0;
        if (ach.reqType === "equipCount") curVal = player.equips.length || 0;

        let canClaim = (curVal >= ach.reqVal) || (ach.reqType === "hasEnchant" && player.weaponEnchants.includes(ach.reqVal));
        let progressTxt = typeof ach.reqVal === 'number' ? ` [ ${Math.min(curVal, ach.reqVal)} / ${ach.reqVal} ]` : "";

        let btn = document.createElement('button'); btn.className = "btn";
        let title = curLang === "zh" ? ach.titleZh : ach.titleEn;
        let desc = curLang === "zh" ? ach.descZh : ach.descEn;

        btn.innerText = `${title} - ${desc}${progressTxt} (獎勵: ${ach.gold}G / ${ach.stones}💎)`;

        if (isDone) {
            btn.innerText += " [已領取]";
            btn.disabled = true;
        } else if (!canClaim) {
            btn.innerText += " [未達成]";
            btn.disabled = true;
        } else {
            btn.onclick = () => {
                player.achieved.push(ach.id);
                player.gold += ach.gold;
                player.enchantStones += ach.stones;
                alert(`🏆 領取成就成功！獲得 ${ach.gold} 金幣 與 ${ach.stones} 顆附魔石！`);
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
            if (ach.reqType === "gold") curVal = player.gold || 0;
            if (ach.reqType === "diamond") curVal = player.ores.diamond || 0;
            if (ach.reqType === "enchantCount") curVal = player.weaponEnchants.length || 0;
            if (ach.reqType === "stones") curVal = player.enchantStones || 0;
            if (ach.reqType === "skillCount") curVal = player.skills.length || 0;
            if (ach.reqType === "equipCount") curVal = player.equips.length || 0;

            let canClaim = (curVal >= ach.reqVal) || (ach.reqType === "hasEnchant" && player.weaponEnchants.includes(ach.reqVal));
            if (canClaim) {
                player.achieved.push(ach.id);
                player.gold += ach.gold;
                player.enchantStones += ach.stones;
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

// -------------------------------------------------------------
// 🔨 鐵匠鋪神兵鍛造 & ✨ 裝備精煉 & ⛏️ 升級鎬子
// -------------------------------------------------------------
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
    let p = player; let t = I18N[curLang];
    let act = p.villageActions;
    document.getElementById('ore-status').innerText = `${t.weapon}: [${p.weapon}]\n${t.ores}: ${t.copper}:${p.ores.copper} | ${t.iron}:${p.ores.iron} | ${t.goldOre}:${p.ores.gold} | ${t.diamond}:${p.ores.diamond} | 💠精煉石:${p.refineStones || 0}\n⛏️ 鎬子等級: +${p.pickaxeLvl || 0} | ⚡ 行動力: ${act}/5`;
    let forgeBox = document.getElementById('forge-items'); forgeBox.innerHTML = "";
    
    if (currentForgeTab === 'refine') {
        renderEquipmentRefineList();
        return;
    }

    if (currentForgeTab === 'pickaxe') {
        renderPickaxeUpgradeUI();
        return;
    }

    let recipeList = [];
    if (currentForgeTab === 'armor') {
        recipeList = FORGE_RECIPES_DATABASE.filter(r => r.category === 'armor' && r.slot === currentArmorSubTab);
    } else {
        recipeList = FORGE_RECIPES_DATABASE.filter(r => r.category === currentForgeTab);
    }

    recipeList.forEach(recipe => {
        let bought = p.equips.includes(getItemName(recipe));
        let wrongJob = (recipe.job && recipe.job !== p.jobCode);
        let canCraft = allOresEnough(p, recipe.req);
        let hasAction = act > 0;
        let btn = document.createElement('button'); btn.className = "btn";
        
        let reqArr = [];
        if (recipe.req.copper) reqArr.push(`${t.copper}x${recipe.req.copper}`);
        if (recipe.req.iron) reqArr.push(`${t.iron}x${recipe.req.iron}`);
        if (recipe.req.gold) reqArr.push(`${t.goldOre}x${recipe.req.gold}`);
        if (recipe.req.diamond) reqArr.push(`${t.diamond}x${recipe.req.diamond}`);
        
        btn.innerText = `${getItemName(recipe)} (${reqArr.join(', ')})` + getStatDiffText(recipe);
        if (bought) { btn.innerText += ` [${t.alreadyCrafted}]`; btn.disabled = true; }
        else if (wrongJob) { btn.innerText += ` [${t.wrongJob}]`; btn.disabled = true; }
        else if (!canCraft || !hasAction) { btn.disabled = true; }
        else {
            btn.onclick = () => {
                p.villageActions--;
                Object.keys(recipe.req).forEach(k => p.ores[k] -= recipe.req[k]); p.equips.push(getItemName(recipe));
                alert(t.craftSuccess.replace('{i}', getItemName(recipe)) + " (已存入背包，請至裝備管理頁面穿戴)"); updateForgeUI();
            };
        }
        forgeBox.appendChild(btn);
    });
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

            let unlockStoneMsg = (curLvl + 1 >= 3) ? `\n🎉 鎬子升至 +${curLvl+1}！已解鎖採礦時可挖到【💠 精煉石】能力！` : "";
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

            btn.innerText = `✨ 精煉升級: ${eqName} (+${curLvl} ➡️ +${curLvl+1}) (需求: 銅x${reqCopper}, 💠精煉石x${reqRefineStone})`;
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

function showEnchantHouse() { hideAll(); document.getElementById('enchant-screen').classList.remove('hidden'); updateEnchantHouseUI(); }
function updateEnchantHouseUI() {
    let p = player; let t = I18N[curLang];
    let act = p.villageActions;
    document.getElementById('magic-status').innerText = `${t.weapon}: [${p.weapon}]\n💎 ${t.stones}: ${p.enchantStones} 顆\n⚡ 行動力: ${act}/5`;
    let enchantBox = document.getElementById('magic-items'); enchantBox.innerHTML = "";
    WEAPON_ENCHANTS.forEach(enc => {
        let encKey = curLang === "zh" ? enc.keyZh : enc.keyEn;
        let encName = curLang === "zh" ? enc.nameZh : enc.nameEn;
        let encDesc = curLang === "zh" ? enc.descZh : enc.descEn;
        let hasEnc = p.weaponEnchants.includes(encKey);
        let enoughStone = p.enchantStones >= enc.stoneReq;
        let hasAction = act > 0;
        let btn = document.createElement('button'); btn.className = "btn btn-secondary";
        btn.innerText = `${encName} - ${encDesc}`;
        
        if (hasEnc) { btn.innerText += ` [${t.alreadyCrafted}]`; btn.disabled = true; }
        else if (!enoughStone || !hasAction) { btn.disabled = true; }
        else {
            btn.onclick = () => {
                p.villageActions--;
                p.enchantStones -= enc.stoneReq; p.weaponEnchants.push(encKey);
                if (enc.id === "sharp") { p.atkMin += 25; p.atkMax += 25; }
                alert(t.enchantSuccess.replace('{e}', encKey)); updateEnchantHouseUI();
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
    let t = I18N[curLang];
    document.getElementById('shop-status').innerText = `${t.gold}: ${player.gold} G | ${t.job}: ${player.jobName}`;
    let container = document.getElementById('shop-items'); container.innerHTML = "";
    
    document.getElementById('btn-refresh-equip').disabled = (player.gold < 100);

    shopEquips.forEach(item => {
        let bought = player.equips.includes(getItemName(item));
        let wrongJob = (item.job && item.job !== player.jobCode);
        let enoughGold = player.gold >= item.cost;
        let btn = document.createElement('button'); btn.className = "btn";
        btn.innerText = `${getItemName(item)} (${item.cost} G)` + getStatDiffText(item);
        if (bought) { btn.innerText += ` [${t.alreadyEquipped}]`; btn.disabled = true; }
        else if (wrongJob) { btn.innerText += ` [${t.wrongJob}]`; btn.disabled = true; }
        else if (!enoughGold) { btn.disabled = true; }
        else {
            btn.onclick = () => {
                player.gold -= item.cost; player.equips.push(getItemName(item));
                alert(t.equipSuccess.replace('{i}', getItemName(item)) + " (已存入背包，請至裝備管理頁面穿戴)"); updateEquipShopUI();
            };
        }
        container.appendChild(btn);
    });
}

function refreshEquipShop() {
    let t = I18N[curLang];
    if (player.gold >= 100) {
        player.gold -= 100; rollRandomEquipShop(); alert("🔄 裝備商店已刷新！(消耗 100 G)"); updateEquipShopUI();
    } else alert(t.noGold);
}

function showSkillShop() { hideAll(); document.getElementById('shop-screen').classList.remove('hidden'); document.getElementById('btn-refresh').style.display = "block"; document.getElementById('btn-refresh-equip').style.display = "none"; updateSkillShopUI(); }
function updateSkillShopUI() {
    let t = I18N[curLang];
    document.getElementById('shop-status').innerText = `${t.gold}: ${player.gold} G | Skills: ${player.skills.length}/4`;
    let container = document.getElementById('shop-items'); container.innerHTML = "";
    
    document.getElementById('btn-refresh').disabled = (player.gold < 100);

    shopSkills.forEach(sKey => {
        let sInfo = SKILLS[sKey];
        let learned = player.skills.includes(sKey);
        let wrongJob = (sInfo.type !== "universal" && sInfo.type !== player.jobCode);
        let enoughGold = player.gold >= sInfo.cost;
        let displaySName = getSkillName(sKey);
        let displayDesc = curLang === "zh" ? sInfo.descZh : sInfo.descEn;
        let btn = document.createElement('button'); btn.className = "btn";
        btn.innerText = `${displaySName} (${sInfo.cost} G) - ${displayDesc}`;
        
        if (learned) { btn.innerText += ` [${t.learned}]`; btn.disabled = true; }
        else if (wrongJob) { btn.innerText += ` [${t.wrongJob}]`; btn.disabled = true; }
        else if (!enoughGold) { btn.disabled = true; }
        else btn.onclick = () => attemptBuySkill(sKey, sInfo.cost);
        container.appendChild(btn);
    });
}

function attemptBuySkill(sKey, cost) {
    let t = I18N[curLang];
    if (player.skills.length < 4) {
        player.gold -= cost; player.skills.push(sKey);
        alert(t.learnSuccess.replace('{s}', getSkillName(sKey))); updateSkillShopUI();
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
        btn.innerText = `[${getSkillName(oldKey)}] ➡️ [${getSkillName(pendingSkillToLearn.key)}]`;
        btn.onclick = () => executeReplaceSkill(idx);
        container.appendChild(btn);
    });
}

function executeReplaceSkill(replaceIndex) {
    let t = I18N[curLang];
    let oldKey = player.skills[replaceIndex];
    player.gold -= pendingSkillToLearn.cost;
    player.skills[replaceIndex] = pendingSkillToLearn.key;
    alert(t.forgetSkill.replace('{o}', getSkillName(oldKey)).replace('{n}', getSkillName(pendingSkillToLearn.key)));
    pendingSkillToLearn = null;
    showSkillShop();
}

function refreshSkills() {
    let t = I18N[curLang];
    if (player.gold >= 100) {
        player.gold -= 100; rollRandomSkills(); alert(t.refreshB); updateSkillShopUI();
    } else alert(t.noGold);
}

function saveGame() { 
    try {
        let saveData = { player: player, defeatedCount: defeatedCount, shopEquips: shopEquips, shopSkills: shopSkills };
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData)); 
        alert(I18N[curLang].saveSuccess + "\n(存檔Key已寫入 GitHub Pages 專屬隔離區)"); 
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
            if (data.shopEquips) shopEquips = data.shopEquips;
            if (data.shopSkills) shopSkills = data.shopSkills;

            if (!player.refines) player.refines = {};
            if (!player.pickaxeLvl) player.pickaxeLvl = 0;
            if (!player.refineStones) player.refineStones = 0;

            if (!player.equipmentSlots) {
                player.equipmentSlots = { helmet: null, chest: null, leggings: null, bracer1: null, bracer2: null, weapon: null };
            }
            if (!player.skillCDs) player.skillCDs = {};
            if (!player.equips) player.equips = [];
            if (!player.ores) player.ores = { copper: 0, iron: 0, gold: 0, diamond: 0 };
            if (!player.potions) player.potions = { hp: 1, mp: 1 };
            
            alert(I18N[curLang].loadSuccess + "\n(存檔載入成功！)"); 
            showVillage(); 
        } else {
            alert("⚠️ 找不到本地存檔，請確認您已在本頁面存檔過，或使用【跨裝置代碼匯入】進度。");
        }
    } catch(e) {
        alert("❌ 讀取存檔時發生錯誤，存檔資料可能已被損壞。");
    }
}

let previousScreenBeforeGuide = 'main-menu';

function showGameGuide() {
    const screens = ['main-menu', 'class-select', 'card-screen', 'battle-screen', 'defeat-screen', 'village-screen', 'stats-screen', 'forge-screen', 'enchant-screen', 'shop-screen', 'replace-skill-screen', 'achieve-screen', 'potion-select-screen', 'equipment-screen'];
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
    hideAll();
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