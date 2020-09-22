import React from 'react'
import useSetTitle from '../../hooks/useSetTitle';
import Loading from '../ui/Loading';
import NoResults from '../ui/NoResults';
import useFetch from '../../hooks/useFetch';
import Breadcrumb from '../ui/Breadcrumb';
import BtnPrimary from '../ui/buttons/BtnPrimary';
import secureApiFetch from '../../services/api';
import UserAvatar from '../badges/UserAvatar';
import {Link} from 'react-router-dom';
import {IconPlus} from '../icons';
import Title from '../ui/Title';
import DeleteButton from "../ui/buttons/Delete";

const TasksList = ({match, history}) => {
    const projectId = match.params.id;
    useSetTitle('Project membership');
    const [users] = useFetch(`/users`)
    const [members, updateMembers] = useFetch(`/projects/${projectId}/users`)

    const handleOnClick = (e) => {
        e.preventDefault();
        const userId = document.getElementById('userId').value;
        const userData = {userId: userId};
        secureApiFetch(`/projects/${projectId}/users`, {
            method: 'POST',
            body: JSON.stringify(userData)
        }).then(() => {
            updateMembers()
        })
    }

    const handleDelete = (member) => {
        secureApiFetch(`/projects/${projectId}/users/${member.membership_id}`, {
            method: 'DELETE'
        }).then(() => {
            updateMembers()
        })
    }

    return <>
        <div className='heading'>
            <Breadcrumb path={history.location.pathname}/>
        </div>
        <form className='flex flex-col space-y-2'>
            <Title title='Members'/>
            <select id="userId">
                {users && users.map((user, index) =>
                    <option value={user.id}>{user.name}</option>
                )}
            </select>
            <BtnPrimary onClick={handleOnClick} size='sm'><IconPlus styling='mr-2' size={4}/> Add selected user as
                member</BtnPrimary>
        </form>

        {!members ?
            <Loading/> :
            members.length === 0 ?
                <NoResults/> :
                <>
                    <table className="w-full">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {members &&
                        members.map((member, index) =>
                            <tr>
                                <td className='w-16'><UserAvatar size={10} email={member.email}/></td>
                                <td><Link to={`/users/${member.id}`}>{member.name}</Link></td>
                                <td className='text-right'>
                                    <DeleteButton onClick={() => handleDelete(member)}/>
                                </td>
                            </tr>
                        )
                        }
                        </tbody>
                    </table>
                </>
        }

    </>
}

export default TasksList
