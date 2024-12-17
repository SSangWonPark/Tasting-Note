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

      // drinks 배열에 데이터 추가
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

// 검색 기능
function searchDrinks() {
  const query = searchInput.value.trim().toLowerCase();
  filteredDrinks = drinks.filter((drink) =>
    drink.name.toLowerCase().includes(query)
  );
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

// 초기 실행
window.onload = () => {
  loadExcelFromProject();
};
