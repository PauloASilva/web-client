import RestrictedComponent from 'components/logic/RestrictedComponent';
import TimestampsSection from 'components/ui/TimestampsSection';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import secureApiFetch from 'services/api';
import useDelete from '../../hooks/useDelete';
import useFetch from '../../hooks/useFetch';
import Badge from "../badges/Badge";
import Breadcrumb from "../ui/Breadcrumb";
import DeleteButton from '../ui/buttons/Delete';
import Loading from '../ui/Loading';
import Title from '../ui/Title';
import VulnerabilitiesTable from "../vulnerabilities/VulnerabilitiesTable";

const TargetView = ({ match, history }) => {
    const { targetId } = match.params;
    const [target] = useFetch(`/targets/${targetId}`)
    const destroy = useDelete(`/targets/`);
    const [savedProject, setSavedProject] = useState(null);
    const [vulnerabilities] = useFetch(`/vulnerabilities?targetId=${targetId}`);

    useEffect(() => {
        if (target) {
            document.title = `Target ${target.name} | Reconmap`;
            secureApiFetch(`/projects/${target.project_id}`, { method: 'GET', headers: {} })
                .then(resp => resp.json())
                .then(json => {
                    setSavedProject(json);
                })
        }
    }, [target])

    const handleDelete = () => {
        destroy(targetId)
            .then(success => {
                if (success)
                    history.push('/projects');
            })
            .catch(err => console.error(err))
    }

    if (!target) return <Loading />

    return <div>
        <div className='heading'>
            <Breadcrumb>
                <Link to="/projects">Projects</Link>
                {savedProject &&
                    <Link to={`/projects/${savedProject.id}`}>{savedProject.name}</Link>}
            </Breadcrumb>
            <RestrictedComponent roles={['administrator', 'superuser', 'user']}>
                <DeleteButton onClick={handleDelete} />
            </RestrictedComponent>
        </div>
        <article>
            <div>
                <Title type='Target' title={target.name} />

                <div className="grid grid-two">
                    <div>
                        <h4>Kind</h4>
                        <Badge color={target.kind === 'hostname' ? 'green' : 'blue'}>{target.kind}</Badge>
                    </div>

                    <div>
                        <TimestampsSection entity={target} />
                    </div>
                </div>

                <h4>Vulnerabilities</h4>
                {vulnerabilities &&
                    <VulnerabilitiesTable vulnerabilities={vulnerabilities} />}
            </div>
        </article>
    </div>
}

export default TargetView;
