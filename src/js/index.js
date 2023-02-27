// 회고
// '상태값'의 중요성
// 각 인스턴스 별로 서로 다른 상태를 가지고 있는데 이는 this가 있어야 알 수 있다.

// step2 요구사항 구현을 위한 전략 

// TODO localStorage Read & Write
// - [x] localStorage에 데이터를 저장한다.
//  - [x] 메뉴를 추가할 때
//  - [x] 메뉴를 수정할 때
//  - [x] 메뉴를 삭제할 때
// - [x] localStorage에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [x] 에스프레소 메뉴판을 관리한다.
// - [x] 프라푸치노 메뉴판을 관리한다.
// - [x] 블렌디드 메뉴판을 관리한다.
// - [x] 티바나 메뉴판을 관리한다.
// - [x] 디저트 메뉴판을 관리한다.

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [x] 페이지에 최초로 로딩할 때 localStorage에서 에스프레소 메뉴를 읽어온다. 
// - [x] 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// - [x] 품절 버튼을 추가한다.
// - [x] 품절 버튼을 눌렀을 때, localStorage에 품절 값을 추가한다.
// -[x] 품절 버튼을 눌렀을 때, sold-out class를 추가하여 상태를 변경한다.

// TODO 서버 요청 부분
// - [x] 웹 서버를 띄운다.
// - [x] 서버에 새로운 메뉴가 추가될 수 있게 요청한다.
// - [ ] 중복되는 메뉴가 추가되지 않게 한다.
// - [ ] 카테고리별 메뉴 리스트 불러온다.
// - [ ] 서버에 메뉴가 수정하기 될 수 있게 요청한다.
// - [ ] 서버에 메뉴의 품절 상태가 토글될 수 있게 요청한다.
// - [ ] 서버에 메뉴가 삭제될 수 있도록 요청한다.

// 리펙터링 부분
// - [ ] localStorage에 저장하는 로직은 지운다.
// - [ ] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.
//   - [ ] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 [alert](https://developer.mozilla.org/ko/docs/Web/API/Window/alert)으로 예외처리를 진행한다.

import { $ } from "./utils.js/dom.js";
import { store } from "./store/index.js";

const BASE_URL = "http://localhost:3000/api/";

function App() {
    this.menu = {
        espresso: [],
        frappuccino: [],
        blended: [],
        teavana: [],
        desert: [],
    };

    this.currentCategory = "espresso";

    this.init = () => {
        if(store.getLocalStorage()) { this.menu = store.getLocalStorage(); }
        render();
    }

    const render = () => {
        const template = this.menu[this.currentCategory]
        .map((item, index) => {
            return ( 
                    `<li data-menu-id=${index} class="menu-list-item d-flex items-center py-2">
                    <span class="${item.soldOut ? "sold-out ": "" } w-100 pl-2 menu-name">${item.name}</span>
                    <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
                    >
                    품절
                    </button>
                    <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
                    >
                    수정
                    </button>
                    <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
                    >
                    삭제
                    </button>
                </li>` 
            );
        })
        .join("");

        $("#menu-list").innerHTML = template;
        countMenu();
        initEventListener();
    }

    const countMenu = () => {
        const menuCount = this.menu[this.currentCategory].length;
        $(".menu-count").innerText = `총 ${menuCount}개`
    }

    const addMenuName = () => {
        if($("#menu-name").value === "") { 
            alert("값을 입력해주세요");
            return;
        }
        const menuName = $("#menu-name").value;
        fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: menuName }),
        }).then((response => {
            return response.json();
        }))
        .then((data) => {
            console.log(data);
        });
        // this.menu[this.currentCategory].push({ name: menuName });
        // store.setLocalStorage(this.menu);
        // render();
        // $("#menu-name").value = "";
    }

    const editMenuName = (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const newMenuName = prompt("메뉴명을 수정하세요",  $menuName.innerText);
        this.menu[this.currentCategory][menuId].name = newMenuName;
        store.setLocalStorage(this.menu);
        render();
    }

    const removeMenuName = (e) => {
        if(confirm("정말 삭제하시겠습니까?")){
            const menuId = e.target.closest("li").dataset.menuId;
            this.menu[this.currentCategory].splice(menuId, 1);
            store.setLocalStorage(this.menu);
            render();
        }
    }

    const soldOutMenuName = (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
        console.log(this.menu[this.currentCategory])
        console.log(this.menu[this.currentCategory][menuId])
        store.setLocalStorage(this.menu);
        render();
    }

    const initEventListener = () => {
        $("#menu-list").addEventListener("click", (e)=>{
            if(e.target.classList.contains("menu-edit-button")){
                editMenuName(e);
                return;
            }
            if(e.target.classList.contains("menu-remove-button")){
                removeMenuName(e);
                return;
            }
            if(e.target.classList.contains("menu-sold-out-button")){
                soldOutMenuName(e);
                return; 
            }
        });
        
        $("#menu-form").addEventListener("submit", (e)=>{
                e.preventDefault();
        });
    
        $("#menu-submit-button").addEventListener("click", addMenuName);
    
        $("#menu-name").addEventListener("keypress", (e)=>{
            if(e.key !== "Enter") { 
                return; 
            }
            addMenuName();
        });
    
        $("nav").addEventListener("click", (e)=>{
            const isCategoryButton = e.target.classList.contains("cafe-category-name");
            if(isCategoryButton) {
                const categoryName = e.target.dataset.categoryName;
                this.currentCategory = categoryName;
                $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
                render();
            }
        });
    }
}

const app = new App();
app.init();