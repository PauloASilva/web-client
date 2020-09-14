import React from 'react'
import { Link } from 'react-router-dom'
import { IconUserGroup } from './../icons'
import UserAvatar from './../badges/UserAvatar'

const ProjectTeam = ({project, users}) => {
    return (
        <section className='mb-4'>
        <div className='heading'>
            <IconUserGroup />
            <h2>Team</h2>
            <Link to={`/projects/${project.id}/membership`}>
                <button><IconUserGroup /> Manage project membership</button>
            </Link>
        </div>
        {users &&  <div className='flex flex-wrap  '>
       
                {users.map((user, index) =>
                    <Link to={`/users/${user.id}`}>
                        <div className='flex flex-col text-center rounded border-2 border-transparent hover:border-gray-800 p-2 mx-1 w-32 items-center'>
                            <UserAvatar email={user.email} size={20} />
                            <small className='text-gray-500 mt-2'>{user.name}</small>
                        </div>
                    </Link>
                )}
            
        </div>}
            {/* {users && <ul>
                {users.map((user, index) =>
                    <li ><Link to={`/users/${user.id}`}>{user.name}</Link></li>
                )}
            </ul>} */}
        </section>
    )
}

export default ProjectTeam