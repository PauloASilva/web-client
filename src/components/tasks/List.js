import RestrictedComponent from 'components/logic/RestrictedComponent';
import DeleteButton from 'components/ui/buttons/Delete';
import ReloadButton from 'components/ui/buttons/Reload';
import { actionCompletedToast } from 'components/ui/toast';
import React, { useState } from 'react';
import secureApiFetch from 'services/api';
import useDelete from '../../hooks/useDelete';
import useFetch from '../../hooks/useFetch';
import useSetTitle from '../../hooks/useSetTitle';
import TaskStatuses from "../../models/TaskStatuses";
import Breadcrumb from '../ui/Breadcrumb';
import ButtonGroup from "../ui/buttons/ButtonGroup";
import CreateButton from "../ui/buttons/Create";
import { IconClipboardList } from '../ui/Icons';
import Loading from '../ui/Loading';
import Title from '../ui/Title';
import TasksTable from './TasksTable';

const TasksList = ({ history }) => {
    useSetTitle('Tasks');

    const [tasks, reloadTasks] = useFetch('/tasks');
    const [selectedTasks, setSelectedTasks] = useState([]);

    const [projects] = useFetch('/projects')
    const [filter, setFilter] = useState({ project: '', user: '', status: '' })

    const [reloadButtonDisabled, setReloadButtonDisabled] = useState(false);

    const handleSetProject = (ev) => {
        setFilter({ ...filter, project: ev.target.value })
    }
    const handleSetStatus = (ev) => {
        setFilter({ ...filter, status: ev.target.value })
    }
    const handleCreateTask = () => {
        history.push(`/tasks/create`);
    }

    const onStatusSelectChange = (ev) => {
        const newStatus = ev.target.value;

        secureApiFetch('/tasks', {
            method: 'PATCH',
            headers: {
                'Bulk-Operation': 'UPDATE',
            },
            body: JSON.stringify({
                taskIds: selectedTasks,
                newStatus: newStatus
            })
        })
            .then(reloadTasks)
            .then(() => {
                actionCompletedToast(`All selected tasks have been transitioned to "${newStatus}".`);
                ev.target.value = '';
            })
            .catch(err => console.error(err));
    }

    const onDeleteButtonClick = () => {
        secureApiFetch('/tasks', {
            method: 'PATCH',
            headers: {
                'Bulk-Operation': 'DELETE',
            },
            body: JSON.stringify(selectedTasks),
        })
            .then(reloadTasks)
            .then(() => {
                setSelectedTasks([]);
                actionCompletedToast('All selected tasks were deleted.');
            })
            .catch(err => console.error(err));
    };

    const destroy = useDelete('/tasks/', reloadTasks);

    return <>
        <div className='heading'>
            <Breadcrumb />
            <ButtonGroup>
                <div>
                    <label>Project</label>
                    <select onChange={handleSetProject}>
                        <option value="">Any</option>
                        {projects && projects.map(project => <option value={project.id}
                            key={project.id}>{project.name}</option>)}
                    </select>
                </div>
                <div>
                    <label>Status</label>
                    <select onChange={handleSetStatus}>
                        <option value="">(any)</option>
                        {TaskStatuses.map((status, index) => <option value={status.id}>{status.name}</option>)}
                    </select>
                </div>
                <CreateButton onClick={handleCreateTask}>Create task</CreateButton>
                <label>Transition to&nbsp;
                    <select disabled={!selectedTasks.length} onChange={onStatusSelectChange}>
                        <option value="">(select)</option>
                        {TaskStatuses.map((status, index) =>
                            <option key={index} value={status.id}>{status.name}</option>
                        )}
                    </select>
                </label>
                <RestrictedComponent roles={['administrator']}>
                    <DeleteButton onClick={onDeleteButtonClick} disabled={!selectedTasks.length}>
                        Delete selected
                    </DeleteButton>
                </RestrictedComponent>
                <ReloadButton onClick={async () => { setReloadButtonDisabled(true); await reloadTasks(); setReloadButtonDisabled(false); }} disabled={reloadButtonDisabled} />
            </ButtonGroup>
        </div>
        <Title title='Tasks' icon={<IconClipboardList />} />

        {!tasks ?
            <Loading /> :
            <TasksTable tasks={tasks} selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} filter={filter} destroy={destroy} />
        }
    </>
}

export default TasksList
