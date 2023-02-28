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
// - [x] 카테고리별 메뉴 리스트 불러온다.
// - [x] 서버에 메뉴가 수정하기 될 수 있게 요청한다.
// - [x] 서버에 메뉴의 품절 상태가 토글될 수 있게 요청한다.
// - [x] 서버에 메뉴가 삭제될 수 있도록 요청한다.

// 리펙터링 부분
// - [x] localStorage에 저장하는 로직은 지운다.
// - [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.
//   - [ ] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 [alert](https://developer.mozilla.org/ko/docs/Web/API/Window/alert)으로 예외처리를 진행한다.

import { $ } from "./utils.js/dom.js";
import MenuApi from "./api/index.js";

function App() {
    this.menu = {
        espresso: [],
        frappuccino: [],
        blended: [],
        teavana: [],
        desert: [],
    };

    this.currentCategory = "espresso";

    this.init = async () => {
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
            this.currentCategory
        );
        initEventListener();
        render();
    };

    const render = async () => {
        this.menu[this.currentCategory] =  await MenuApi.getAllMenuByCategory(
            this.currentCategory
        );

        const template = this.menu[this.currentCategory]
        .map((menuItem) => {
            return ( 
                    `<li data-menu-id=${menuItem.id} class="menu-list-item d-flex items-center py-2">
                    <span class="${menuItem.isSoldOut ? "sold-out ": "" } w-100 pl-2 menu-name">${menuItem.name}</span>
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
    };

    const countMenu = () => {
        const menuCount = this.menu[this.currentCategory].length;
        $(".menu-count").innerText = `총 ${menuCount}개`
    };

    const addMenuName = async () => {
        if($("#menu-name").value === "") { 
            alert("값을 입력해주세요");
            return;
        }
        const menuName = $("#menu-name").value;
        await MenuApi.createMenu(this.currentCategory, menuName);
        render();
        $("#menu-name").value = "";
    };

    const editMenuName = async (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const newMenuName = prompt("메뉴명을 수정하세요",  $menuName.innerText);
        await MenuApi.editMenu(this.currentCategory, newMenuName, menuId);
        render();
    };

    const removeMenuName = async (e) => {
        if(confirm("정말 삭제하시겠습니까?")){
            const menuId = e.target.closest("li").dataset.menuId;
            await MenuApi.deleteMenu(this.currentCategory, menuId);
            render();
        }
    };

    const soldOutMenu = async (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
        render();
    };

    const changeCategory = (e) => {
        const isCategoryButton = 
        e.target.classList.contains("cafe-category-name");
    
        if(isCategoryButton) {
            const categoryName = e.target.dataset.categoryName;
            this.currentCategory = categoryName;
            $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
            render();
        }
    };
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
                soldOutMenu(e);
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
    
        $("nav").addEventListener("click", changeCategory);

    };
}

const app = new App();
app.init();