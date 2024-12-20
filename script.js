const gallery = document.getElementById('gallery');
const details = document.getElementById('details');
const overlay = document.getElementById('overlay');
const detailsImage = document.getElementById('detailsImage');
const detailsName = document.getElementById('detailsName');
const detailsNose = document.getElementById('detailsNose');
const detailsPalate = document.getElementById('detailsPalate');
const detailsFinish = document.getElementById('detailsFinish');
const detailsCf = document.getElementById('detailsCf');

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const excelInput = document.getElementById('excelInput');
const searchScopeDropdown = document.getElementById('searchScope');
let searchScope = '모두'; // 초기값은 "모두"

const fullscreenImage = document.getElementById('fullscreenImage'); // 중복 제거
const fullscreenImgElement = fullscreenImage.querySelector('img');

const drinks = []; // 전체 데이터를 저장할 배열
let filteredDrinks = []; // 검색 결과 데이터를 저장할 배열

// Excel 파일 로드
function loadExcelFromProject() {
  fetch('./data/data.xlsx')
    .then((response) => response.arrayBuffer())
    .then((data) => {
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // drinks 배열에 데이터 추가 테스트용 더미미
      drinks.length = 0;
      jsonData.forEach((item) => {
        drinks.push({
          name: item.Name || 'Unknown',
          image: item.Image || 'https://via.placeholder.com/150',
          nose: item.Nose || '',
          palate: item.Palate || '',
          finish: item.Finish || '',
          cf: item.Cf || '',
        });
      });

      filteredDrinks = [...drinks]; // 초기화 시 전체 데이터를 기준으로 설정
      renderGallery();
    })
    .catch((error) => console.error('Error loading Excel file:', error));
}

// 검색 범위 변경 이벤트
searchScopeDropdown.addEventListener('change', (e) => {
  searchScope = e.target.value;
});

// 공백 제거 함수
function removeSpaces(str) {
  return str.replace(/\s+/g, '').toLowerCase(); // 공백 제거 + 소문자 변환
}

// 검색 기능
function searchDrinks() {
  const query = removeSpaces(searchInput.value.trim()); // 검색어에서 공백 제거
  filteredDrinks = drinks.filter((drink) => {
    // 각 속성의 공백을 제거한 문자열에서 검색
    const name = removeSpaces(drink.name);
    const nose = removeSpaces(drink.nose);
    const palate = removeSpaces(drink.palate);
    const finish = removeSpaces(drink.finish);
    const cf = removeSpaces(drink.cf);

    // 검색 범위에 따라 조건 분기
    if (searchScope === '모두') {
      return (
        name.includes(query) ||
        nose.includes(query) ||
        palate.includes(query) ||
        finish.includes(query) ||
        cf.includes(query)
      );
    } else if (searchScope === '이름') {
      return name.includes(query);
    } else if (searchScope === 'Nose') {
      return nose.includes(query);
    } else if (searchScope === 'Palate') {
      return palate.includes(query);
    } else if (searchScope === 'Finish') {
      return finish.includes(query);
    } else if (searchScope === 'Cf') {
      return cf.includes(query);
    }
    return false; // 기본값
  });

  currentPage = 0; // 검색 후 페이지 초기화
  renderGallery();
}

// 이벤트 리스너 추가
searchButton.addEventListener('click', searchDrinks);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchDrinks();
});

// 갤러리 렌더링 함수
let currentPage = 0;
const pageSize = 16; // 페이지당 표시할 항목 수

function renderGallery() {
  gallery.innerHTML = '';
  const start = currentPage * pageSize;
  const end = Math.min(start + pageSize, filteredDrinks.length);

  for (let i = start; i < end; i++) {
    const item = filteredDrinks[i];
    const div = document.createElement('div');
    div.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.addEventListener('click', () => showDetails(item));

    const name = document.createElement('div');
    name.innerText = item.name;

    div.appendChild(img);
    div.appendChild(name);
    gallery.appendChild(div);
  }

  // 페이지네이션 버튼 상태 업데이트
  prevPageButton.disabled = currentPage === 0;
  nextPageButton.disabled =
    (currentPage + 1) * pageSize >= filteredDrinks.length;
}

// 상세 보기
function showDetails(item) {
  overlay.style.display = 'block';
  details.style.display = 'flex';
  detailsImage.src = item.image;
  detailsName.innerText = item.name;
  detailsNose.value = item.nose;
  detailsPalate.value = item.palate;
  detailsFinish.value = item.finish;
  detailsCf.value = item.cf;
}

// 닫기 기능
overlay.addEventListener('click', closeDetails);
document.getElementById('closeDetails').addEventListener('click', closeDetails);

function closeDetails() {
  overlay.style.display = 'none';
  details.style.display = 'none';
}

// 페이지네이션 버튼 이벤트
prevPageButton.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    renderGallery();
  }
});

nextPageButton.addEventListener('click', () => {
  if ((currentPage + 1) * pageSize < filteredDrinks.length) {
    currentPage++;
    renderGallery();
  }
});

// 전체화면 보기
detailsImage.addEventListener('click', () => {
  fullscreenImgElement.src = detailsImage.src; // 상세 정보 창 이미지의 src를 가져오기
  fullscreenImage.style.display = 'flex'; // 전체화면 컨테이너 표시
});

// 전체화면 닫기
fullscreenImage.addEventListener('click', () => {
  fullscreenImage.style.display = 'none'; // 전체화면 숨기기
  fullscreenImgElement.src = ''; // src 초기화 (메모리 최적화)
});

// 초기 실행
window.onload = () => {
  loadExcelFromProject();
};
