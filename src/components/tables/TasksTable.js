import TaskBadge from '../badges/TaskBadge'
import TaskCompletedBadge from '../badges/TaskCompletedBadge'
import BadgeOutline from '../badges/BadgeOutline'
import BtnPrimary from '../ui/buttons/BtnPrimary'
import {IconUpload} from '../icons'
import DeleteButton from "../ui/buttons/Delete";
import UserLink from "../users/Link";

export default function TasksTable({tasks, filter = {project: '', status: ''}, destroy}) {
    return (
        <table >
            <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Assignee</th>
                <th>Parser</th>
                <th>Details</th>
                <th>&nbsp;</th>
            </tr>
            </thead>
            <tbody>
            {tasks
                .filter(task => task.project_id.toString().includes(filter.project))
                .filter(task => task.completed.toString().includes(filter.status))
                .map((task) =>
                    <tr key={task.id}>
                        <td><TaskCompletedBadge completed={task.completed}/></td>
                        <td><TaskBadge task={task}/></td>
                        <td>{task.assignee_uid ?
                            <UserLink userId={task.assignee_uid}>{task.assignee_name}</UserLink> : '(nobody)'}</td>
                        <td>{task.parser && <BadgeOutline>{task.parser}</BadgeOutline>}</td>
                        <td><code>{task.description.slice(0, 40)} </code></td>
                        <td>
                            <BtnPrimary to={"/tasks/" + task.id + "/upload"}>
                                <IconUpload/> 
                                Upload results
                            </BtnPrimary>
                            <DeleteButton onClick={() => destroy(task.id)}/>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}
