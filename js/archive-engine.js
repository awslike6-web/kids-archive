// 🏛️ kids-archive/js/archive-engine.js
// 민민이네 디지털 성장 아카이브 뷰어 & 필터 엔진

const ARCHIVE_STORAGE_KEY = 'MINMIN_GROWTH_ARCHIVE_DATA';
let archiveData = [];
let currentStudent = 'all';
let currentStage = 'all';
let currentCategory = 'all';
let activeItemId = null;

// 🚀 데이터 로드 및 초기화
function initArchiveEngine(defaultStudent = 'all') {
    currentStudent = defaultStudent;
    loadArchiveData();
    setupEventListeners();
}

function loadArchiveData() {
    const saved = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    let customItems = [];
    let savedReactionsMap = {};
    let savedCommentsMap = {};

    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            parsed.forEach(item => {
                if (item.id && item.id.startsWith('archive_custom_')) {
                    customItems.push(item);
                } else if (item.id) {
                    if (item.reactions) savedReactionsMap[item.id] = item.reactions;
                    if (item.likes) savedReactionsMap[item.id] = item.likes;
                    if (item.comments) savedCommentsMap[item.id] = item.comments;
                }
            });
        } catch (e) {
            console.error("아카이브 로컬 데이터 파싱 오류:", e);
        }
    }

    const masterList = (typeof ARCHIVE_MASTER_DATA !== 'undefined' ? ARCHIVE_MASTER_DATA : []).map(item => {
        const copy = { ...item };
        if (savedReactionsMap[item.id]) {
            copy.reactions = savedReactionsMap[item.id];
            copy.likes = Object.values(savedReactionsMap[item.id]).reduce((a, b) => a + b, 0);
        }
        if (savedCommentsMap[item.id]) copy.comments = savedCommentsMap[item.id];
        return copy;
    });

    archiveData = [...masterList, ...customItems];
    saveArchiveData();
    renderArchiveGrid();
    updateStatsBar();
}

function saveArchiveData() {
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archiveData));
}

// 🎛️ 필터 제어
function setStudentFilter(student, element) {
    currentStudent = student;
    document.querySelectorAll('.student-tab-card').forEach(c => {
        c.classList.remove('active-all', 'active-minsu', 'active-minseo');
    });
    if (element) {
        if (student === 'all') element.classList.add('active-all');
        else if (student === 'minsu') element.classList.add('active-minsu');
        else if (student === 'minseo') element.classList.add('active-minseo');
    }
    renderArchiveGrid();
}

function setStageFilter(stage, element) {
    currentStage = stage;
    document.querySelectorAll('.stage-node').forEach(n => n.classList.remove('active'));
    if (element) element.classList.add('active');
    renderArchiveGrid();
}

function setCategoryFilter(category, element) {
    currentCategory = category;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if (element) element.classList.add('active');
    renderArchiveGrid();
}

// 🖼️ 아카이브 그리드 렌더링
function renderArchiveGrid() {
    const grid = document.getElementById('archiveGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = archiveData.filter(item => {
        const matchStudent = (currentStudent === 'all') || (item.studentKey === currentStudent) || (item.student === currentStudent);
        const matchStage = (currentStage === 'all') || (item.stage === currentStage);
        const matchCategory = (currentCategory === 'all') || (item.category === currentCategory);
        return matchStudent && matchStage && matchCategory;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 60px 20px; background: var(--bg-card); border-radius: 18px; border: 1px dashed var(--border-color);">
                <h3 style="font-family:'Jua',sans-serif; font-size:1.5rem; color:var(--primary-accent); margin-bottom:8px;">📦 해당 조건의 전시 작품이 없습니다.</h3>
                <p style="color:var(--text-secondary); font-size:1rem;">필터를 변경하거나 새로운 성장 기록을 등록해 보세요.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'archive-card';
        card.onclick = () => openArchiveDetail(item.id);

        const authorPillClass = (item.student === '민수' || item.studentKey === 'minsu') ? 'pill-minsu' : 'pill-minseo';
        const commentsCount = (item.comments && item.comments.length) || 0;
        const totalLikes = item.likes || 0;

        card.innerHTML = `
            <div class="card-cover-wrap">
                <span class="card-stage-pill">${item.stageName || item.stage}</span>
                <span class="card-author-pill ${authorPillClass}">${item.student}</span>
                <img src="${item.coverImage}" alt="${item.title}" class="card-cover-img" onerror="this.src='https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000'">
            </div>
            <div class="card-body">
                <div class="card-category-tag">${item.categoryIcon || '🎨'} ${item.category} · ${item.year}년</div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc-preview">${item.description}</p>
                ${item.awards ? `<div class="card-achievement-chip">🏆 ${item.awards}</div>` : ''}
                <div class="card-footer">
                    <span>📅 ${item.date}</span>
                    <div style="display:flex; gap:12px; align-items:center;">
                        <span style="color:#ff6b9d; font-weight:bold;">❤️ ${totalLikes}</span>
                        <span>💬 ${commentsCount}</span>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 📊 통계 업데이트
function updateStatsBar() {
    const totalEl = document.getElementById('statArchiveTotal');
    const minsuEl = document.getElementById('statArchiveMinsu');
    const minseoEl = document.getElementById('statArchiveMinseo');

    if (totalEl) totalEl.textContent = archiveData.length;
    if (minsuEl) minsuEl.textContent = archiveData.filter(i => i.student === '민수' || i.studentKey === 'minsu').length;
    if (minseoEl) minseoEl.textContent = archiveData.filter(i => i.student === '민서' || i.studentKey === 'minseo').length;
}

// 🪟 상세 모달 열기
function openArchiveDetail(id) {
    const item = archiveData.find(i => i.id === id);
    if (!item) return;
    activeItemId = id;

    document.getElementById('modalImg').src = item.coverImage;
    document.getElementById('modalTitle').textContent = item.title;
    
    const authorTag = document.getElementById('modalAuthorTag');
    authorTag.textContent = item.student;
    authorTag.className = `card-author-pill ${(item.student === '민수' || item.studentKey === 'minsu') ? 'pill-minsu' : 'pill-minseo'}`;

    document.getElementById('modalCategoryTag').textContent = `${item.categoryIcon || '🎨'} ${item.category} · ${item.stageName || item.stage}`;
    document.getElementById('modalDateTag').textContent = `📅 ${item.date}`;
    document.getElementById('modalDescription').textContent = item.description;

    // 배운 점 / 핵심 성취
    const learningBox = document.getElementById('modalLearningBox');
    const learningList = document.getElementById('modalLearningList');
    if (item.learningPoints && item.learningPoints.length > 0) {
        learningBox.style.display = 'block';
        learningList.innerHTML = item.learningPoints.map(p => `<li>${p}</li>`).join('');
    } else {
        learningBox.style.display = 'none';
    }

    // 스티커 반응
    const reactions = item.reactions || { heart: 0, thumb: 0, star: 0, trophy: 0 };
    document.getElementById('reactionCount_heart').textContent = reactions.heart || 0;
    document.getElementById('reactionCount_thumb').textContent = reactions.thumb || 0;
    document.getElementById('reactionCount_star').textContent = reactions.star || 0;
    document.getElementById('reactionCount_trophy').textContent = reactions.trophy || 0;

    // 댓글 렌더링
    renderComments(item.comments || []);

    document.getElementById('detailModal').style.display = 'flex';
}

function closeArchiveDetail() {
    document.getElementById('detailModal').style.display = 'none';
    activeItemId = null;
}

function openOriginalMedia() {
    if (!activeItemId) return;
    const item = archiveData.find(i => i.id === activeItemId);
    if (item && item.coverImage) {
        window.open(item.coverImage, '_blank');
    }
}

// 스티커 클릭
function addReaction(type) {
    if (!activeItemId) return;
    const item = archiveData.find(i => i.id === activeItemId);
    if (!item) return;

    if (!item.reactions) item.reactions = { heart: 0, thumb: 0, star: 0, trophy: 0 };
    item.reactions[type] = (item.reactions[type] || 0) + 1;
    item.likes = Object.values(item.reactions).reduce((a, b) => a + b, 0);

    document.getElementById(`reactionCount_${type}`).textContent = item.reactions[type];
    saveArchiveData();
    renderArchiveGrid();
}

// 칭찬 댓글
function renderComments(comments) {
    const list = document.getElementById('modalCommentsList');
    if (!list) return;
    list.innerHTML = '';
    if (!comments || comments.length === 0) {
        list.innerHTML = '<div style="color:var(--text-secondary); font-size:0.9rem; padding:6px 0;">아직 남겨진 가족 코멘트가 없습니다. 첫 칭찬을 남겨보세요!</div>';
        return;
    }
    comments.forEach(c => {
        const div = document.createElement('div');
        div.style.cssText = 'background:rgba(255,255,255,0.04); border-radius:10px; padding:10px 14px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; gap:10px;';
        div.innerHTML = `
            <div><b style="color:var(--primary-accent); margin-right:6px;">${c.author}:</b> <span>${c.text}</span></div>
            <span style="font-size:0.8rem; color:var(--text-secondary);">${c.date || ''}</span>
        `;
        list.appendChild(div);
    });
}

function submitComment() {
    if (!activeItemId) return;
    const textInput = document.getElementById('commentTextInput');
    const text = textInput.value.trim();
    if (!text) return;

    const author = document.getElementById('commentAuthorSelect').value;
    const item = archiveData.find(i => i.id === activeItemId);
    if (!item) return;

    if (!item.comments) item.comments = [];
    const todayStr = new Date().toISOString().split('T')[0];
    item.comments.push({ author, text, date: todayStr });

    textInput.value = '';
    renderComments(item.comments);
    saveArchiveData();
    renderArchiveGrid();
}

function setupEventListeners() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeArchiveDetail();
    });
}
