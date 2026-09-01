// 🏛️ kids-archive/data/archive-master-data.js
// 민민이네 디지털 성장 아카이브 & 평생 포트폴리오 마스터 데이터베이스

const ARCHIVE_MASTER_DATA = [
  // ==========================================
  // 👦 [민수 - 초등학교 5학년]
  // ==========================================
  {
    id: "minsu_2026_01",
    student: "민수",
    studentKey: "minsu",
    stage: "초등",
    stageName: "초등학교 5학년",
    year: 2026,
    semester: "1학기",
    date: "2026-09-02",
    category: "미술/드로잉",
    categoryIcon: "🎨",
    title: "다채로운 감정의 입체파(큐비즘) 인물화",
    coverImage: "assets/media/minsu/2026_elem_5/minsu_cubism_art_20260902.jpg",
    galleryImages: [
      "assets/media/minsu/2026_elem_5/minsu_cubism_art_20260902.jpg"
    ],
    description: "피카소의 입체파(큐비즘) 미술 사조를 탐구하며 얼굴의 정면과 측면을 하나의 캔버스에 입체적으로 재구성한 회화 작품입니다. 노랑과 하늘색의 대비, 무지개빛 배경 스트라이프를 통해 내면의 다채로운 감정을 대담한 선과 색채로 표현했습니다.",
    learningPoints: [
      "입체파 원근법 및 복합 시점(Multiple Perspectives) 원리 이해",
      "보색 대비 및 감정 표현을 위한 색채 배치 기법 습득",
      "유성 파스텔 및 수채 물감 혼합 기법 활용"
    ],
    awards: "교내 미술 우수작 선정",
    likes: 35,
    reactions: { heart: 18, thumb: 10, star: 8, trophy: 6 },
    comments: [
      { author: "아빠", text: "시점의 해체와 재구성이 정말 놀랍다! 색감도 과감하고 멋져 👍", date: "2026-09-02" },
      { author: "엄마", text: "민수의 창의력과 예술적 감수성이 돋보이는 명작이야 ❤️", date: "2026-09-02" }
    ]
  },
  {
    id: "minsu_2026_02",
    student: "민수",
    studentKey: "minsu",
    stage: "초등",
    stageName: "초등학교 5학년",
    year: 2026,
    semester: "1학기",
    date: "2026-06-25",
    category: "상장/수상",
    categoryIcon: "🏆",
    title: "교내 과학 탐구 토론 대회 우수상",
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1000&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1000&auto=format&fit=crop&q=80"
    ],
    description: "교내 과학의 날 탐구 토론 대회에서 '지구 온난화 극복을 위한 미래 친환경 에너지 솔루션'을 주제로 발표 및 질의응답을 주도하여 우수상을 수상했습니다.",
    learningPoints: [
      "과학적 근거 자료 수집 및 논리적 발표 역량 강화",
      "기후 변화 대응 신재생 에너지 메커니즘 분석"
    ],
    awards: "교내 과학 탐구 토론 우수상 (학교장상)",
    likes: 28,
    reactions: { heart: 12, thumb: 14, star: 7, trophy: 10 },
    comments: [
      { author: "아빠", text: "스스로 자료 찾고 토론 준비하더니 멋진 결과를 냈구나! 🏆", date: "2026-06-25" }
    ]
  },
  {
    id: "minsu_2026_03",
    student: "민수",
    studentKey: "minsu",
    stage: "초등",
    stageName: "초등학교 5학년",
    year: 2026,
    semester: "1학기",
    date: "2026-07-18",
    category: "프로젝트/연구",
    categoryIcon: "🏫",
    title: "우리 고장 역사 신문 발행 프로젝트",
    coverImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80"
    ],
    description: "사회과 협동 학습으로 옛 인물 문익점의 목화 전래 이야기와 고려청자, 조선백자 도자기 문화를 취재 기사 형식으로 작성한 신문 프로젝트입니다.",
    learningPoints: [
      "기사 헤드라인 작성 및 협동 레이아웃 편집",
      "역사적 사실의 현대적 해석과 스토리텔링"
    ],
    awards: "모둠 우수 프로젝트 선정",
    likes: 19,
    reactions: { heart: 8, thumb: 9, star: 5, trophy: 2 },
    comments: [
      { author: "엄마", text: "진짜 기자처럼 핵심을 잘 짚었네! 대단해 📰", date: "2026-07-19" }
    ]
  },

  // ==========================================
  // 👧 [민서 - 초등학교 1학년]
  // ==========================================
  {
    id: "minseo_2026_01",
    student: "민서",
    studentKey: "minseo",
    stage: "초등",
    stageName: "초등학교 1학년",
    year: 2026,
    semester: "1학기",
    date: "2026-09-02",
    category: "만들기/입체공예",
    categoryIcon: "✂️",
    title: "아기자기 미니 온실 정원 디오라마",
    coverImage: "assets/media/minseo/2026_elem_1/minseo_mini_garden_20260902.jpg",
    galleryImages: [
      "assets/media/minseo/2026_elem_1/minseo_mini_garden_20260902.jpg"
    ],
    description: "투명한 아크릴 온실 구조물 안에 클레이 점토로 핑크빛 지붕 꽃, 앙증맞은 선인장과 보라색 꽃 화분, 미니 금속 조루와 디딤돌을 정성스럽게 빚어 배치한 입체 조형 공예 작품입니다.",
    learningPoints: [
      "클레이 점토를 활용한 정밀 소근육 조형 능력 발달",
      "공간 배치 및 입체 디오라마 구조화 감각 체득",
      "자연 식물과 원예 도구에 대한 관찰력 증진"
    ],
    awards: "교내 솜씨 자랑 우수작 선정",
    likes: 42,
    reactions: { heart: 24, thumb: 8, star: 15, trophy: 5 },
    comments: [
      { author: "엄마", text: "손끝이 정말 야무지고 사랑스러운 작품이야! 요정 마을 정원 같아 🌸", date: "2026-09-02" },
      { author: "아빠", text: "선인장에 핀 작은 꽃까지 정성이 대단해! 우리 민서 최고 ❤️", date: "2026-09-02" }
    ]
  },
  {
    id: "minseo_2026_02",
    student: "민서",
    studentKey: "minseo",
    stage: "초등",
    stageName: "초등학교 1학년",
    year: 2026,
    semester: "1학기",
    date: "2026-07-10",
    category: "만들기/입체공예",
    categoryIcon: "📐",
    title: "알록달록 하트 품은 사랑의 백조 카드",
    coverImage: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1000&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1000&auto=format&fit=crop&q=80"
    ],
    description: "종이접기 기법으로 하트를 품은 입체 백조를 완성하고 부모님을 향한 감사의 메시지를 담은 감사 카드 공예입니다.",
    learningPoints: [
      "3차원 종이접기 대칭 구조 이해",
      "가족을 향한 감사와 사랑의 마음 표현"
    ],
    awards: "사랑의 편지 쓰기 으뜸상",
    likes: 22,
    reactions: { heart: 16, thumb: 4, star: 6, trophy: 2 },
    comments: [
      { author: "아빠", text: "민서의 따뜻한 마음이 고스란히 느껴져서 감동이야 ❤️", date: "2026-07-10" }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.ARCHIVE_MASTER_DATA = ARCHIVE_MASTER_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ARCHIVE_MASTER_DATA };
}
