const api_url = 'https://week-15-rprasetyob-production.up.railway.app/'
const btnCreate = document.getElementById('btnCreate')as HTMLButtonElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
  

async function fetchHtml() {
    try {
        const response = await fetch(api_url + 'v1/tasks', { method: 'GET' });
        const getData = await response.json();
        const items = getData.data
        const taskOutput = document.getElementById('taskList') as HTMLElement;
        let dataHtml = ''
        if (items.length !== 0) {
            for (let i = 0; i < items.length; i++) {
                let statusColor = '';
                if(items[i].status == 'Done / Approved') {
                    statusColor = 'text-success'
                }else if(items[i].status == 'Need revision / Rejected' || items[i].status == 'Not started') {
                    statusColor = 'text-danger'
                }else if(items[i].status == 'In progress') {
                    statusColor = 'text-warning'
                }else if(items[i].status == 'In review') {
                    statusColor = 'text-info'
                }
                
                dataHtml += `
                <tr class="${items[i]._id}">
                    <td>${i+1}</td>
                    <td>${items[i].task}</td>
                    <td>&nbsp${items[i].createdAt.slice(0,10)}</td>
                    <td>&nbsp;${items[i].updatedAt.slice(0,10)}</td>
                    <td><span class="status ${statusColor}">&bull;</span>${items[i].status}</span></td>
                    <td>
                        <a href="#" class="settings" title="Update" data-toggle="tooltip"><i class="material-icons btn-update" data-toggle="modal" data-target="#myModal" data-idtask="${items[i]._id}">&#xE8B8;</i></a>
                        <a href="#" class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons btn-delete" data-idtask="${items[i]._id}">&#xE5C9;</i></a>
                    </td>
                </tr>
                `;                
            }
        }
        
        taskOutput.innerHTML = dataHtml
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    await fetchHtml();
});

// create task

const createTask = async () => {
    const inputTask = (document.getElementById('inputTask') as HTMLInputElement).value;
    if(inputTask == '' || !inputTask) {
        return alert('New task input still empty')
    }
    const body = {
        task  : inputTask,
    }

    const response = await fetch(api_url + 'v1/tasks', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });
    console.log(JSON.stringify(body));
    console.log(response);
    
    
(document.getElementById('inputTask') as HTMLInputElement).value = ''
fetchHtml()
}

// delete task

const deleteTask = async (idTask : string) => {
    await fetch(api_url + 'v1/tasks/' + idTask, {
        method: 'DELETE'
    })

    fetchHtml()
}

// update task

const updateTask = async (updateStat : string) => {
    const updateInput = (document.getElementById('inputUpdate') as HTMLInputElement).value;

    if (!updateInput || updateInput === '') {
        return alert('Update task input is empty');
    }    
    console.log(updateInput);
    
    const body = {
        status  : updateInput
    }
    await fetch(api_url + 'v1/tasks/' + updateStat, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    
    fetchHtml()
}


// event

// add
btnCreate.addEventListener('click', createTask)
// del
document.addEventListener('click', (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    
    if (el.classList.contains('btn-delete')) {
        const idTask = el.dataset.idtask
        deleteTask(idTask as string);
    }
});
//modal
document.addEventListener('click', (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    
    if (el.classList.contains('btn-update')) {
        const idUpdate : any = el.dataset.idtask
        const btnUpdate = document.querySelector('.btn-updated')
        btnUpdate?.setAttribute('data-idtask', idUpdate)
    }
})
//update
document.addEventListener('click', (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    
    if (el.classList.contains('btn-updated')){
        const updateStat = el.dataset.idtask
        updateTask(updateStat as string)
    }
})