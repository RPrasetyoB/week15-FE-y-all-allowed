"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const api_url = 'https://week-15-rprasetyob-production.up.railway.app/';
const btnCreate = document.getElementById('btnCreate');
const logoutBtn = document.getElementById('logoutBtn');
function fetchHtml() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(api_url + 'v1/tasks', { method: 'GET' });
            const getData = yield response.json();
            const items = getData.data;
            const taskOutput = document.getElementById('taskList');
            let dataHtml = '';
            if (items.length !== 0) {
                for (let i = 0; i < items.length; i++) {
                    let statusColor = '';
                    if (items[i].status == 'Done / Approved') {
                        statusColor = 'text-success';
                    }
                    else if (items[i].status == 'Need revision / Rejected' || items[i].status == 'Not started') {
                        statusColor = 'text-danger';
                    }
                    else if (items[i].status == 'In progress') {
                        statusColor = 'text-warning';
                    }
                    else if (items[i].status == 'In review') {
                        statusColor = 'text-info';
                    }
                    dataHtml += `
                <tr class="${items[i]._id}">
                    <td>${i + 1}</td>
                    <td>${items[i].task}</td>
                    <td>&nbsp${items[i].createdAt.slice(0, 10)}</td>
                    <td>&nbsp;${items[i].updatedAt.slice(0, 10)}</td>
                    <td><span class="status ${statusColor}">&bull;</span>${items[i].status}</span></td>
                    <td>
                        <a href="#" class="settings" title="Update" data-toggle="tooltip"><i class="material-icons btn-update" data-toggle="modal" data-target="#myModal" data-idtask="${items[i]._id}">&#xE8B8;</i></a>
                        <a href="#" class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons btn-delete" data-idtask="${items[i]._id}">&#xE5C9;</i></a>
                    </td>
                </tr>
                `;
                }
            }
            taskOutput.innerHTML = dataHtml;
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetchHtml();
    });
});
// create task
const createTask = () => __awaiter(void 0, void 0, void 0, function* () {
    const inputTask = document.getElementById('inputTask').value;
    if (inputTask == '' || !inputTask) {
        return alert('New task input still empty');
    }
    const body = {
        task: inputTask,
    };
    const response = yield fetch(api_url + 'v1/tasks', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });
    console.log(JSON.stringify(body));
    console.log(response);
    document.getElementById('inputTask').value = '';
    fetchHtml();
});
// delete task
const deleteTask = (idTask) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(api_url + 'v1/tasks/' + idTask, {
        method: 'DELETE'
    });
    fetchHtml();
});
// update task
const updateTask = (updateStat) => __awaiter(void 0, void 0, void 0, function* () {
    const updateInput = document.getElementById('inputUpdate').value;
    if (!updateInput || updateInput === '') {
        return alert('Update task input is empty');
    }
    console.log(updateInput);
    const body = {
        status: updateInput
    };
    yield fetch(api_url + 'v1/tasks/' + updateStat, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    fetchHtml();
});
// event
// add
btnCreate.addEventListener('click', createTask);
// del
document.addEventListener('click', (e) => {
    const el = e.target;
    if (el.classList.contains('btn-delete')) {
        const idTask = el.dataset.idtask;
        deleteTask(idTask);
    }
});
//modal
document.addEventListener('click', (e) => {
    const el = e.target;
    if (el.classList.contains('btn-update')) {
        const idUpdate = el.dataset.idtask;
        const btnUpdate = document.querySelector('.btn-updated');
        btnUpdate === null || btnUpdate === void 0 ? void 0 : btnUpdate.setAttribute('data-idtask', idUpdate);
    }
});
//update
document.addEventListener('click', (e) => {
    const el = e.target;
    if (el.classList.contains('btn-updated')) {
        const updateStat = el.dataset.idtask;
        updateTask(updateStat);
    }
});
