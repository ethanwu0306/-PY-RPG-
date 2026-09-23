const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isBgmPlaying = false;
let bgmInterval = null;
let isBattleBgm = false;
const villageNotes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23];
const battleNotes = [329.63, 392.00, 440.00, 587.33, 523.25, 440.00, 392.00, 659.25];
let noteIdx = 0;

function playBGMStep() {
    if (!isBgmPlaying) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    
    let notes = isBattleBgm ? battleNotes : villageNotes;
    const freq = notes[noteIdx];
    noteIdx = (noteIdx + 1) % notes.length;

    osc.type = isBattleBgm ? 'sawtooth' : 'sine'; 
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(isBattleBgm ? 0.05 : 0.03, now); 
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isBattleBgm ? 0.18 : 0.25));
    osc.start(now); 
    osc.stop(now + (isBattleBgm ? 0.18 : 0.25));
}

function startBGM() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (!isBgmPlaying) {
        isBgmPlaying = true;
        bgmInterval = setInterval(playBGMStep, isBattleBgm ? 200 : 280);
    }
}

function setBattleBgm(inBattle) {
    if (isBattleBgm !== inBattle) {
        isBattleBgm = inBattle;
        if (isBgmPlaying) {
            clearInterval(bgmInterval);
            bgmInterval = setInterval(playBGMStep, isBattleBgm ? 200 : 280);
        }
    }
}

function toggleBGM() {
    isBgmPlaying = !isBgmPlaying;
    let btn = document.getElementById('btn-bgm');
    if (isBgmPlaying) {
        startBGM();
        btn.innerText = "🎵 背景音樂: 開"; btn.style.background = "#27ae60";
    } else {
        clearInterval(bgmInterval);
        btn.innerText = "🎵 背景音樂: 關"; btn.style.background = "#7f8c8d";
    }
}

function playSound(type, jobCode) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'hit' || type === 'skill') {
        if (jobCode === 'Warrior') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(type === 'skill' ? 220 : 160, now);
            osc.frequency.exponentialRampToValueAtTime(35, now + (type === 'skill' ? 0.18 : 0.1));
            gain.gain.setValueAtTime(0.35, now); 
            gain.gain.linearRampToValueAtTime(0.01, now + (type === 'skill' ? 0.18 : 0.1));
            osc.start(now); osc.stop(now + (type === 'skill' ? 0.18 : 0.1));
        } else if (jobCode === 'Mage') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(type === 'skill' ? 300 : 200, now);
            osc.frequency.exponentialRampToValueAtTime(type === 'skill' ? 850 : 500, now + (type === 'skill' ? 0.22 : 0.12));
            gain.gain.setValueAtTime(0.25, now); 
            gain.gain.linearRampToValueAtTime(0.01, now + (type === 'skill' ? 0.22 : 0.12));
            osc.start(now); osc.stop(now + (type === 'skill' ? 0.22 : 0.12));
        } else if (jobCode === 'Archer') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(type === 'skill' ? 600 : 450, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + (type === 'skill' ? 0.15 : 0.08));
            gain.gain.setValueAtTime(0.25, now); 
            gain.gain.linearRampToValueAtTime(0.01, now + (type === 'skill' ? 0.15 : 0.08));
            osc.start(now); osc.stop(now + (type === 'skill' ? 0.15 : 0.08));
        } else {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
            gain.gain.setValueAtTime(0.3, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        }
    } else if (type === 'heal') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.25);
        gain.gain.setValueAtTime(0.2, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
    } else if (type === 'buff') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.25, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'debuff') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
        gain.gain.setValueAtTime(0.3, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
    } else if (type === 'victory') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(783, now + 0.2);
        gain.gain.setValueAtTime(0.3, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
    }
}