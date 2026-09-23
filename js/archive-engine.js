// 🏛️ kids-archive/js/archive-engine.js
// 민민이네 디지털 성장 아카이브 뷰어 & 필터 엔진

const ARCHIVE_STORAGE_KEY = 'MINMIN_GROWTH_ARCHIVE_DATA';
const ARCHIVE_STORAGE_VERSION_KEY = 'MINMIN_ARCHIVE_VER';
const CURRENT_ARCHIVE_VER = 'v20260907_clean';
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
    // 🛡️ 구버전 더미 댓글/반응 캐시 자동 정화 (Purge)
    const savedVer = localStorage.getItem(ARCHIVE_STORAGE_VERSION_KEY);
    if (savedVer !== CURRENT_ARCHIVE_VER) {
        localStorage.removeItem(ARCHIVE_STORAGE_KEY);
        localStorage.setItem(ARCHIVE_STORAGE_VERSION_KEY, CURRENT_ARCHIVE_VER);
    }

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

    const savedCustomMeta = localStorage.getItem('GALLERY_CUSTOM_META');
    let customMetaMap = {};
    if (savedCustomMeta) {
        try { customMetaMap = JSON.parse(savedCustomMeta); } catch (e) {}
    }

    const masterList = (typeof ARCHIVE_MASTER_DATA !== 'undefined' ? ARCHIVE_MASTER_DATA : []).map(item => {
        const copy = { ...item };
        if (savedReactionsMap[item.id]) {
            copy.reactions = savedReactionsMap[item.id];
            copy.likes = Object.values(savedReactionsMap[item.id]).reduce((a, b) => a + b, 0);
        }
        if (savedCommentsMap[item.id]) copy.comments = savedCommentsMap[item.id];

        // 🎨 웹 편집 커스텀 메타데이터(분야/일자/제목/한마디) 연동
        if (customMetaMap[item.id]) {
            const cm = customMetaMap[item.id];
            if (cm.title) copy.title = cm.title;
            if (cm.category) {
                copy.category = cm.category;
                copy.categoryIcon = cm.categoryIcon || (cm.category.includes('만들기') ? '✂️' : (cm.category.includes('종이접기') ? '📐' : (cm.category.includes('상장') ? '🏆' : (cm.category.includes('탐구') ? '🔬' : '🎨'))));
            }
            if (cm.date) copy.date = cm.date;
            if (cm.artistNote) copy.description = cm.artistNote;
        }

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
        const matchStudent = (currentStudent === 'all') || 
            (item.studentKey === currentStudent) || 
            (item.student === currentStudent) ||
            (item.studentKey === 'together');
        const matchStage = (currentStage === 'all') || (item.stage === currentStage);
        
        let matchCategory = (currentCategory === 'all');
        if (!matchCategory) {
            if (currentCategory === '미술/드로잉') {
                matchCategory = (item.category === '미술/드로잉' || item.category === '그림/미술');
            } else if (currentCategory === '만들기/입체공예') {
                matchCategory = (item.category === '만들기/입체공예' || item.category === '만들기/공예');
            } else if (currentCategory === '상장/수상') {
                matchCategory = (item.category === '상장/수상' || item.category === '상장/기념');
            } else {
                matchCategory = (item.category === currentCategory);
            }
        }
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

        const authorPillClass = (item.student === '민수' || item.studentKey === 'minsu') 
            ? 'pill-minsu' 
            : ((item.student === '공동' || item.studentKey === 'together') ? 'pill-together' : 'pill-minseo');
        const commentsCount = (item.comments && item.comments.length) || 0;
        const totalLikes = item.likes || 0;

        const multiPhotoBadgeHtml = (item.galleryImages && item.galleryImages.length > 1) ? `
            <span style="position:absolute; bottom:12px; right:12px; z-index:2; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); color:#fff; font-size:0.78rem; font-family:'Jua', sans-serif; padding:4px 8px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); display:flex; align-items:center; gap:4px;">
                <span>📷</span> ${item.galleryImages.length}장
            </span>
        ` : '';

        card.innerHTML = `
            <div class="card-cover-wrap" style="position:relative;">
                <span class="card-stage-pill">${item.stageName || item.stage}</span>
                <span class="card-author-pill ${authorPillClass}">${item.student}</span>
                ${multiPhotoBadgeHtml}
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
    if (minsuEl) minsuEl.textContent = archiveData.filter(i => i.student === '민수' || i.studentKey === 'minsu' || i.studentKey === 'together').length;
    if (minseoEl) minseoEl.textContent = archiveData.filter(i => i.student === '민서' || i.studentKey === 'minseo' || i.studentKey === 'together').length;
}

// 🪟 상세 모달 열기
function openArchiveDetail(id) {
    const item = archiveData.find(i => i.id === id);
    if (!item) return;
    activeItemId = id;

    const imgUrl = item.coverImage || (item.galleryImages && item.galleryImages[0]) || '';
    document.getElementById('modalImg').src = imgUrl;
    document.getElementById('modalTitle').textContent = item.title;
    
    // 🖼️ 다중 사진 썸네일 스위처 제어
    const thumbsContainer = document.getElementById('modalThumbsContainer');
    const images = (item.galleryImages && item.galleryImages.length > 0) ? item.galleryImages : (item.coverImage ? [item.coverImage] : []);
    if (thumbsContainer) {
        if (images.length > 1) {
            thumbsContainer.style.display = 'flex';
            thumbsContainer.innerHTML = '';
            images.forEach((imgSrc, idx) => {
                const thumbBtn = document.createElement('button');
                thumbBtn.type = 'button';
                thumbBtn.className = `modal-thumb-btn ${idx === 0 ? 'active' : ''}`;
                thumbBtn.title = `사진 ${idx + 1} 보기`;
                thumbBtn.style.cssText = `
                    width: 54px; height: 54px; border-radius: 10px; border: 2.5px solid ${idx === 0 ? 'var(--primary-accent, #58a6ff)' : 'rgba(255,255,255,0.2)'};
                    padding: 0; overflow: hidden; cursor: pointer; background: #0d1117; transition: all 0.2s ease;
                    box-shadow: ${idx === 0 ? '0 2px 8px rgba(88,166,255,0.4)' : 'none'};
                `;
                thumbBtn.innerHTML = `<img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover; display:block;" alt="사진 ${idx + 1}">`;
                thumbBtn.onclick = () => {
                    document.getElementById('modalImg').src = imgSrc;
                    thumbsContainer.querySelectorAll('.modal-thumb-btn').forEach(b => {
                        b.style.borderColor = 'rgba(255,255,255,0.2)';
                        b.style.boxShadow = 'none';
                    });
                    thumbBtn.style.borderColor = 'var(--primary-accent, #58a6ff)';
                    thumbBtn.style.boxShadow = '0 2px 8px rgba(88,166,255,0.4)';
                };
                thumbsContainer.appendChild(thumbBtn);
            });
        } else {
            thumbsContainer.style.display = 'none';
            thumbsContainer.innerHTML = '';
        }
    }
    
    const authorTag = document.getElementById('modalAuthorTag');
    authorTag.textContent = item.student;
    authorTag.className = `card-author-pill ${(item.student === '민수' || item.studentKey === 'minsu') ? 'pill-minsu' : ((item.student === '공동' || item.studentKey === 'together') ? 'pill-together' : 'pill-minseo')}`;

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
    const modalImg = document.getElementById('modalImg');
    if (modalImg && modalImg.src) {
        window.open(modalImg.src, '_blank');
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
