const BASE_URL = "http://localhost:3000/api";

const HTTP_METHOD = {
    POST(data) {
        return {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
    },
    PUT(data) {
        return {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: data ? JSON.stringify(data) : null,
        };
    },
    DELETE() {
        return {
            method: "DELETE",
        };
    },
};

const request = async (url, option) => {
    const response = await fetch(url, option);
    if(!response) {
        alert("에러가 발생했습니다.");
        console.error(e);
    }
    return response.json();
}

const requestWithoutJson = async (url, option) => {
    const response = await fetch(url, option);
    if(!response) {
        alert("에러가 발생했습니다.");
        console.error(e);
    }

    return response;
}

const MenuApi = {
    async getAllMenuByCategory(category) {
        return request(`${BASE_URL}/category/${category}/menu`);
    },
    async createMenu(category, name) {
        request(
            `${BASE_URL}/category/${category}/menu`,
            HTTP_METHOD.POST({ name })
        );
    },
    async editMenu(category, name, menuId) {
        request(
            `${BASE_URL}/category/${category}/menu/${menuId}`,
            HTTP_METHOD.PUT({ name })
        );
    },
    async toggleSoldOutMenu(category, menuId) {
        request(
            `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
            HTTP_METHOD.PUT()
        );
    },
    async deleteMenu(category, menuId){
        requestWithoutJson(`${BASE_URL}/category/${category}/menu/${menuId}`,
            HTTP_METHOD.DELETE()
        );
    },
};

export default MenuApi;