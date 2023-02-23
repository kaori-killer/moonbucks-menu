// step2 요구사항 구현을 위한 전략

// TODO localStorage Read & Write
// - [] localStorage에 데이터를 저장한다.
//  - [x] 메뉴를 추가할 때
//  - [x] 메뉴를 수정할 때
//  - [] 메뉴를 삭제할 때
// - [] localStorage에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [] 에스프레소 메뉴판을 관리한다.
// - [] 프라푸치노 메뉴판을 관리한다.
// - [] 블렌디드 메뉴판을 관리한다.
// - [] 티바나 메뉴판을 관리한다.
// - [] 디저트 메뉴판을 관리한다.

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [] 페이지에 최초로 로딩할 때 localStorage에서 에스프레소 메뉴를 읽어온다. 
// - [] 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// - [] 품절 버튼을 추가한다.
// - [] 품절 버튼을 눌렀을 때, localStorage에 품절 값을 추가한다.
// -[] 품절 버튼을 눌렀을 때, sold-out class를 추가하여 상태를 변경한다.

const $ = (selector) => document.querySelector(selector);

const store = {
    setLocalStorage(menu) {
        localStorage.setItem("menu", JSON.stringify(menu));
    },
    getLocalStorage() {
        localStorage.getItem("menu");
    },
}

function App() {
    // 상태[변하는 데이터, 이 앱에서 변하는 것이 무엇인가] - 메뉴명(->개수)
    let menu = [];

    const countMenu = () => {
        const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
        $(".menu-count").innerText = `총 ${menuCount}개`
    }

    const addMenuName = () => {
        if($("#espresso-menu-name").value === "") { 
            alert("값을 입력해주세요");
            return;
        }
        const espressMenuName = $("#espresso-menu-name").value;
        menu.push({ name: espressMenuName });
        store.setLocalStorage(menu);
        const template = menu
            .map((item, index) => {
                return ( 
                        `<li data-menu-id=${index} class="menu-list-item d-flex items-center py-2">
                        <span class="w-100 pl-2 menu-name">${item.name}</span>
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
        $("#espresso-menu-list").innerHTML = template;
        countMenu();
        $("#espresso-menu-name").value = "";
    }

    const EditMenuName = (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const newMenuName = prompt("메뉴명을 수정하세요",  $menuName.innerText);
        menu[menuId] = newMenuName;
        store.setLocalStorage(menu);
        $menuName.innerText = newMenuName;
    }

    const RemoveMenuName = (e) => {
        if(confirm("정말 삭제하시겠습니까?")){
            e.target.closest("li").remove();
            countMenu();
        }
    }

    $("#espresso-menu-list").addEventListener("click", (e)=>{
        if(e.target.classList.contains("menu-edit-button")){
            EditMenuName(e);
        }
        if(e.target.classList.contains("menu-remove-button")){
            RemoveMenuName(e);
        }
    });
    
    $("#espresso-menu-form").addEventListener("submit", (e)=>{
            e.preventDefault();
    });

    $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

    $("#espresso-menu-name").addEventListener("keypress", (e)=>{
        if(e.key !== "Enter") { 
            return; 
        }
        addMenuName();
    });
}

App();
