const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// 달력 생성
function generateCalendar(year, month) {
    // 달력을 위한 배열
    let calendar = [];
    // 현재날짜 가져오기
    let now = new Date();
    //현재 일 가져오기
    let today = new Date().getDate();
    // 이번 달의 첫 번째 날과 마지막 날 가져오기
    let firstDay = new Date(year, month, 1);
    // 이번 달 마지막 날
    let lastDay = new Date(year, month + 1, 0);
    // 이번 달 첫 번째 날의 요일 (0: 일요일, 6: 토요일)
    let firstDayWeekday = firstDay.getDay();
    // 이전 달의 마지막 날 가져오기
    let prevMonthLastDay = new Date(year, month, 0).getDate();
    // 달력을 만들기 위한 시작 날짜: 이전 달의 마지막 주에서 필요한 일자들
    let startDay = prevMonthLastDay - firstDayWeekday + 1;
    // 시작일로부터 날짜 계산
    // 이전 달부터 시작
    let currentDate = new Date(year, month - 1, startDay);
    // 달력을 6주간 채우기 (6주 * 7일)
    for (let week = 0; week < 6; week++) {
        let weekArray = [];
        for (let day = 0; day < 7; day++) {
            weekArray.push({
                date: currentDate.getDate(),
                month: currentDate.getMonth()
            });
            // 다음 날짜로 이동
            currentDate.setDate(currentDate.getDate() + 1);
        }
        calendar.push(weekArray);
    }

    // 달력 데이터를 화면에 추가
    const calendarBody = document.querySelector('.calendar_body_section');
    calendarBody.innerHTML = '';
    // 요일을 표시하는 배열 (일, 월, 화, 수, 목, 금, 토)
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    // 달력 데이터를 HTML로 변환하여 추가
    calendar.forEach((week, weekIndex) => {
        const weekSection = document.createElement('section');
        weekSection.classList.add('week', `week-${weekIndex + 1}`);

        week.forEach((day, dayIndex) => {
            const daySection = document.createElement('section');
            daySection.classList.add(weekdays[dayIndex]);
            // 현재 날짜와 동일할 경우, today 클래스 추가
            if (year === now.getFullYear() && month === now.getMonth() && day.date === now.getDate()) {
                daySection.classList.add('today');
            }
            // 현재 월이 아닌 경우 outmonth 클래스 추가
            if (day.month !== month) {
                daySection.classList.add('outmonth');
            }
            const article = document.createElement('article');
            article.classList.add('calendar_entry');

            const pDate = document.createElement('p');
            pDate.classList.add('date');
            pDate.textContent = day.date;

            const buttonSection = document.createElement('section');
            buttonSection.classList.add('calendar_buttons');

            const viewButton = document.createElement('button');
            viewButton.classList.add('view_diary');

            const viewIcon = document.createElement('img');
            viewIcon.src = 'image/읽기.png';
            viewIcon.alt = '보기';
            viewIcon.classList.add('button-icon');
            viewButton.dataset.date = day.date;

            viewButton.appendChild(viewIcon);
            viewButton.addEventListener("click", function (e) {
                //선택한 날짜 일기 불러오기
                let seclect_year = document.querySelector('#choice_year p').textContent;
                let seclect_month = document.querySelector('#choice_month p.selected').textContent;
                const monthIndex = months.findIndex(month => month === seclect_month);

                window.location.href = `read.html?type=read&year=${seclect_year}&month=${monthIndex + 1}&day=${day.date}`;
            })

            const editButton = document.createElement('button');
            editButton.classList.add('edit_diary');
            // 이미지 요소 생성
            const editIcon = document.createElement('img');
            editIcon.src = 'image/수정.png';
            editIcon.alt = '수정';
            editIcon.classList.add('button-icon');

            // 버튼에 텍스트와 이미지 추가
            editButton.appendChild(editIcon);
            editButton.addEventListener("click", function (e) {
                //선택한 날짜 일기 불러오기
                let seclect_year = document.querySelector('#choice_year p').textContent;
                let seclect_month = document.querySelector('#choice_month p.selected').textContent;
                const monthIndex = months.findIndex(month => month === seclect_month);

                window.location.href = `diary.html?type=write&year=${seclect_year}&month=${monthIndex + 1}&day=${day.date}`;
            })

            // 버튼을 buttonSection에 추가
            buttonSection.appendChild(viewButton);
            buttonSection.appendChild(editButton);

            // article에 날짜와 버튼 섹션 추가
            article.appendChild(pDate);

            if (
                (year < now.getFullYear() && !daySection.classList.contains('outmonth')) ||
                (year === now.getFullYear() && month + 1 < now.getMonth() + 1 && !daySection.classList.contains('outmonth')) ||
                (year === now.getFullYear() && month + 1 === now.getMonth() + 1 && day.date <= now.getDate() && !daySection.classList.contains('outmonth'))
            ) {
                article.appendChild(buttonSection);
            }
            // daySection에 article 추가
            daySection.appendChild(article);

            // weekSection에 daySection 추가
            weekSection.appendChild(daySection);
        });

        // calendarBody에 주차별 섹션 추가
        calendarBody.appendChild(weekSection);
    });
    // return calendar;
}

document.addEventListener("DOMContentLoaded", () => {
    const link_write = document.getElementById('link_write');
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1; // 현재 월 (0이 1월)
    link_write.href = `diary.html?type=write&year=${year}&month=${month}&day=${now.getDate()}`;

    const date_view = document.querySelector(".calendar_date_view");
    date_view.textContent = `${year}년 ${month}월`;

    //년도 가져오기
    const calendar_year_view = document.querySelector("#choice_year > p");
    calendar_year_view.textContent = `${year}`;

    document.getElementById("left_button").addEventListener("click", () => {
        let prev_year = parseInt(calendar_year_view.textContent) - 1;
        calendar_year_view.textContent = `${prev_year}`;
        generateCalendar(prev_year, month);
    })

    document.getElementById("right_button").addEventListener("click", () => {
        let next_year = parseInt(calendar_year_view.textContent) + 1;
        calendar_year_view.textContent = `${next_year}`;
        generateCalendar(next_year, month);
    })

    // 선택할 수 있는 5개의 월을 표시하는 함수
    const displayMonths = (centerMonth) => {
        const choiceMonthContainer = document.querySelector("#choice_month");
        // 기존 월 삭제
        choiceMonthContainer.innerHTML = "";

        // 중앙의 선택된 월을 기준으로 5개의 월을 표시
        for (let i = -2; i <= 2; i++) {
            // 월 인덱스 순환
            let displayMonthIndex = (centerMonth + i + 12) % 12;
            console.log(i, displayMonthIndex);
            const monthElement = document.createElement("p");
            monthElement.className = "month";
            monthElement.textContent = months[displayMonthIndex];
            if (i === 0) {
                // 중앙 달에 선택 스타일 적용
                monthElement.classList.add("selected");
                // 중앙 달 표시
                date_view.textContent = `${year}년 ${month}월`;
            }
            // 클릭 이벤트 추가
            monthElement.addEventListener("click", () => {
                // 클릭 시 해당 월을 중앙으로
                displayMonths(displayMonthIndex);
                // 캘린더를 선택한 년도와 월로 갱신
                let selectedYear = parseInt(calendar_year_view.textContent);
                generateCalendar(selectedYear, displayMonthIndex);
                date_view.textContent = `${calendar_year_view.textContent}년 ${displayMonthIndex + 1}월`;
            });
            choiceMonthContainer.appendChild(monthElement);
        }
    };

    displayMonths(month - 1);
    generateCalendar(year, month - 1);
    const inverseCircle = document.getElementById("inverse-circle");

})
