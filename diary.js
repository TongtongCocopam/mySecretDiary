const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function paperChange(src) {
    const textArea = document.getElementById('main_write');
    if (textArea) {
        textArea.style.backgroundImage = `url(${src})`;
    }
}

// 폰트 바꾸기
function font_select() {
    const font_select = document.getElementById('font_select');
    const selectedFont = font_select.value;
    const textArea = document.getElementById('main_write');

    textArea.className = `font${selectedFont}`;
    textArea.classList.add('selectedFont');
}

// 폰트 크기 바꾸기
function font_size_setting() {
    const font_size = document.getElementById('font_size_setting');
    const selectedSize = font_size.value;
    const textArea = document.getElementById('main_write');
    textArea.style.fontSize = `${selectedSize}px`;
}

// 스티커 붙여넣기
function push_sticker(e) {
    console.log(e);
    const stickerArea = document.getElementById('sticker_area');

    //새 스티커 컨테이너 요소 생성
    const newSticker = document.createElement('article');
    newSticker.classList.add('sticker-wrapper');
    // 절대 위치로 설정하여 이동 가능하게 함
    newSticker.style.position = 'absolute';
    newSticker.style.left = '40%';
    newSticker.style.top = '40%';

    // 스티커 이미지 요소 생성
    const sticker = document.createElement('img');
    sticker.src = e.src;
    sticker.className = 'sticker-item';

    //삭제
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = function (evt) {
        stickerArea.removeChild(newSticker);
    };
    // 스티커와 삭제 버튼을 스티커 컨테이너에 추가
    newSticker.appendChild(sticker);
    newSticker.appendChild(deleteButton);
    stickerArea.appendChild(newSticker);

    // 스티커 드래그 기능 추가
    addDragFunctionality(newSticker);
}

// 드래그 기능
function addDragFunctionality(element) {
    let initialX, initialY;
    let offsetX = 0, offsetY = 0;

    // 부모 컨테이너를 기준으로 경계 계산
    const container = element.parentElement; // sticker_area와 같은 부모 요소
    const containerRect = container.getBoundingClientRect();

    element.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    element.addEventListener('mousedown', (e) => {
        initialX = e.clientX;
        initialY = e.clientY;

        // 요소의 현재 위치 저장
        const rect = element.getBoundingClientRect();
        offsetX = rect.left - containerRect.left;
        offsetY = rect.top - containerRect.top;

        function onMouseMove(e) {
            const dx = e.clientX - initialX;
            const dy = e.clientY - initialY;

            // 새로운 위치 계산
            let newX = offsetX + dx;
            let newY = offsetY + dy;

            // 부모 요소의 경계 내로 위치를 제한
            newX = Math.max(0, Math.min(newX, containerRect.width - rect.width - 100));
            newY = Math.max(0, Math.min(newY, containerRect.height - rect.height - 90));

            // 요소의 위치 업데이트
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

//json형식으로 저장
//type 일기장, 날짜, 글씨폰트, 크기, textArea내용, 스티커(위치x,y값,textArea좌표 기준, 이름)
function save() {
    // URL의 쿼리 문자열에서 선택한 날짜 가져오기
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let diary_year = urlParams.get('year');
    let diary_month = urlParams.get('month');
    let diary_date = urlParams.get('day');

    // 날짜 및 기타 정보 설정
    let diary_today = `${diary_year}-${diary_month}-${diary_date}`;
    let font = document.getElementById("font_select").selectedIndex;
    let font_size = document.getElementById('font_size_setting').value;
    let textContent = document.getElementById('main_write').value;
    let paperUrl = document.getElementById('main_write').style.backgroundImage;
    let paper = paperUrl.match(/url\(["']?(.*?)["']?\)/)[1];

    const textArea = document.getElementById('main_write');
    const textAreaRect = textArea.getBoundingClientRect(); // 텍스트 영역 기준 좌표

    // 스티커 위치를 텍스트 영역 기준으로 상대 좌표로 계산하여 저장
    let stickers = [];
    document.querySelectorAll('#sticker_area .sticker-wrapper').forEach((sticker) => {
        let rect = sticker.getBoundingClientRect();
        stickers.push({
            x: rect.left - textAreaRect.left,  // 텍스트 영역 기준 상대 좌표로 변환
            y: rect.top - textAreaRect.top,    // 텍스트 영역 기준 상대 좌표로 변환
            src: sticker.querySelector('img').src
        });
    });

    // 일기 데이터 저장
    const diary = {
        date: diary_today,
        font: font,
        font_size: font_size,
        content: textContent,
        paper: paper,
        stickers: stickers
    };

    localStorage.setItem(`diary_${diary_today}`, JSON.stringify(diary));
    alert("일기가 저장되었습니다.");
}


function edit() {
    let date = new Date(load_query().dates);
    window.location.href = `diary.html?type=write&year=${date.getFullYear()}&month=${date.getMonth() + 1}&day=${date.getDate()}`;
}

function load_query() {
    const queryString = window.location.search;
    // URLSearchParams 객체로 쿼리 문자열을 파싱
    const urlParams = new URLSearchParams(queryString);
    let diary_year = urlParams.get('year');
    let diary_month = urlParams.get('month');
    let diary_date = urlParams.get('day');
    // 오늘날짜 말고 선택한 날짜로 저장해야함
    return {type: urlParams.get("type"), dates: `${diary_year}-${diary_month}-${diary_date}`};
}

// 불러오기
function loadDiary() {
    let query = load_query();
    let date_str = query.dates;
    const savedDiary = localStorage.getItem(`diary_${date_str}`);
    console.log(savedDiary);
    if (savedDiary) {
        const diaryData = JSON.parse(savedDiary);
        const diary_date_view = document.querySelector(".date_view > h3");
        let this_date = new Date(date_str);
        diary_date_view.textContent = `${this_date.getFullYear()}년 ${this_date.getMonth()}월 ${this_date.getDate()}일 ${days[this_date.getDay()]}`;

        //종이
        paperChange(diaryData.paper);
        console.log(diaryData.paper);
        // 폰트 및 폰트 크기 설정
        document.getElementById("main_write").value = diaryData.content;
        document.getElementById("main_write").classList.add(`font${diaryData.font}`)
        document.getElementById("main_write").style.fontSize = diaryData.fontSize;

        // 스티커 로드
        const stickerArea = document.getElementById('sticker_area');
        const textArea = document.getElementById("main_write")
        const textAreaRect = textArea.getBoundingClientRect();
        stickerArea.innerHTML = '';
        diaryData.stickers.forEach(sticker => {
            const newSticker = document.createElement('article');
            newSticker.classList.add('sticker-wrapper');
            newSticker.style.position = 'absolute';
            // 저장된 상대 좌표에 텍스트 영역의 위치를 더해 절대 위치로 설정
            newSticker.style.left = `${sticker.x}px`;
            newSticker.style.top = `${sticker.y}px`;
            const img = document.createElement('img');
            img.src = sticker.src;
            img.className = 'sticker-item';

            if (query.type === "write") {
                //삭제
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'x';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = function (evt) {
                    newSticker.remove();
                };
                newSticker.appendChild(img);
                newSticker.appendChild(deleteButton);
                stickerArea.appendChild(newSticker);
                addDragFunctionality(newSticker);
            } else {
                // 스티커와 삭제 버튼을 스티커 컨테이너에 추가
                newSticker.appendChild(img);
                stickerArea.appendChild(newSticker);
            }

        });
    }else{
        console.log("none");
    }
}

//스티커 동적 추가, paper동적 추가
//<img src="imgs/paper/mini/1.png" alt="줄노트" onclick="paperChange('imgs/paper/1.png')">
function add_items(paperCount = 12, stickerCount = 39) {
    const itemsContainers = document.querySelectorAll(".items");

    if (itemsContainers.length < 2) {
        console.error("items 클래스를 가진 요소가 두 개 필요합니다.");
        return;
    }

    // 첫 번째 items 요소에 paper 이미지를 추가
    const paperContainer = itemsContainers[0];
    paperContainer.innerHTML = ''; // 기존 이미지 제거
    for (let i = 1; i <= paperCount; i++) {
        const img = document.createElement("img");
        img.src = `imgs/paper/mini/${i}.png`;
        img.alt = `Paper ${i}`;
        img.onclick = () => paperChange(`imgs/paper/${i}.png`);
        paperContainer.appendChild(img);
    }

    // 두 번째 items 요소에 sticker 이미지를 추가
    const stickerContainer = itemsContainers[1];
    stickerContainer.innerHTML = ''; // 기존 이미지 제거
    for (let i = 1; i <= stickerCount; i++) {
        const img = document.createElement("img");
        img.src = `imgs/sticker/${i}.png`;
        img.alt = `Sticker ${i}`;
        img.draggable = true;
        stickerContainer.appendChild(img);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const link_write = document.getElementById('link_write');
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1; // 현재 월 (0이 1월)
    link_write.href = `diary.html?type=write&year=${year}&month=${month}&day=${now.getDate()}`;

    const sticker_area = document.getElementById("sticker_area");
    const main_write = document.getElementById("main_write");
    sticker_area.addEventListener('click', function (e) {
        main_write.focus();
    })
    loadDiary();

    // URL의 쿼리 문자열 가져오기
    const queryString = window.location.search;
    // URLSearchParams 객체로 쿼리 문자열을 파싱
    const urlParams = new URLSearchParams(queryString);
    let diary_year = urlParams.get('year');
    let diary_month = parseInt(urlParams.get('month'));
    let diary_date = urlParams.get('day');

    document.querySelector(".date_view h3").textContent = `${diary_year}년 ${diary_month}월 ${diary_date}일`;
    console.log("asd");

    if (urlParams.get("type") === "write") {
        add_items();
    }

    let items = document.querySelectorAll('.design_box.sticker .design_section .items img');
    console.log(items);
    items.forEach((item) => {
        console.log(item);
        item.addEventListener('click', function (e) {
            push_sticker(this);
        })
    })
})
