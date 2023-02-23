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

const $ = (selector) => document.querySelector(selector);

const store = {
    setLocalStorage(menu) {
        localStorage.setItem("menu", JSON.stringify(menu));
    },
    getLocalStorage() {
        return JSON.parse(localStorage.getItem("menu"));
    },
}

function App() {
    // 상태[변하는 데이터, 이 앱에서 변하는 것이 무엇인가] - 메뉴명(->개수)
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
        this.menu[this.currentCategory].push({ name: menuName });
        store.setLocalStorage(this.menu);
        countMenu();
        render();
        $("#menu-name").value = "";
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
        store.setLocalStorage(this.menu);
        render();
    }

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
    })

}

const app = new App();
app.init();