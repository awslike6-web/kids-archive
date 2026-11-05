// 🏛️ kids-archive/data/archive-master-data.js
// 민민이네 디지털 성장 아카이브 & 평생 포트폴리오 마스터 데이터베이스
// ※ 단일 원천(Single Source of Truth)으로 관리되며 초·중·고 12년 성장 기록을 영구 보존합니다.

const ARCHIVE_MASTER_DATA = [
  {
    "id": "art_minseo_20261028_cat_dog_crossbag",
    "student": "민서",
    "studentKey": "minseo",
    "stage": "초등",
    "stageName": "초등학교 1학년",
    "year": 2026,
    "semester": "2학기",
    "date": "2026-10-28",
    "category": "만들기/공예",
    "categoryIcon": "✂️",
    "title": "알록달록 냥이와 댕댕이 크로스백 (앞면 & 별빛 뒷면) 🐱🐶👜",
    "coverImage": "assets/media/minseo/2026_elem_1/minseo_20261028_cat_dog_crossbag.jpg",
    "galleryImages": [
      "assets/media/minseo/2026_elem_1/minseo_20261028_cat_dog_crossbag.jpg",
      "assets/media/minseo/2026_elem_1/minseo_20261028_cat_dog_crossbag_back.jpg"
    ],
    "description": "학교에서 캔버스 크로스백에 귀여운 고양이와 강아지 얼굴을 그리고 알록달록 색칠했어요! 뒷면에는 반짝반짝 별들을 가득 찍어 나만의 특별하고 예쁜 가방을 완성했답니다! ✨",
    "learningPoints": [
      "다양한 자연물 및 복합 재료를 활용한 소근육 응용력",
      "민서만의 독창적인 예술적 상상력과 미적 탐구"
    ],
    "awards": "가족 갤러리 명예의 전당 등록",
    "likes": 0,
    "reactions": {
      "heart": 0,
      "thumb": 0,
      "star": 0,
      "trophy": 0
    },
    "comments": []
  }
];

if (typeof window !== 'undefined') {
  window.ARCHIVE_MASTER_DATA = ARCHIVE_MASTER_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ARCHIVE_MASTER_DATA };
}
